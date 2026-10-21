// Two people in profile, face to face, drawn in 0s and 1s: the two of us, and
// the drafting a machine does for us. Each head is one outline, the second a
// mirror of the first with a bun added; the characters are firmest on the face, where the two
// look at each other, and thin out towards the back of the head. Edges
// dissolve a cell at a time. Every cell is decided from its position, so the
// server and the browser draw the same figure.

const CW = 6.6; // IBM Plex Mono's advance at 11px
const LH = 11;
const ROWS = 72;
const H = ROWS * LH; // one head's height
const W = H * 0.85; // and its width
const X2 = W * 0.84; // where the mirrored head starts, noses a little apart
const BUN = { u: 0.1, v: 0.3, r: 0.1 * H }; // the second head's, in its own box
const COLS = Math.ceil((X2 + (1 - BUN.u) * W + BUN.r) / CW);

// One head facing the end side, in a unit box: up the back of the neck, over
// the crown, down the brow, nose, lips and chin, and out along the shoulder.
const HEAD: [number, number][] = [
  [0.02, 1], [0.08, 0.9], [0.2, 0.83], [0.3, 0.76], [0.29, 0.68], [0.22, 0.61],
  [0.16, 0.52], [0.13, 0.4], [0.15, 0.28], [0.22, 0.17], [0.33, 0.09], [0.46, 0.05],
  [0.58, 0.06], [0.68, 0.11], [0.74, 0.19], [0.77, 0.28], [0.78, 0.34], [0.74, 0.38],
  [0.76, 0.41], [0.82, 0.46], [0.88, 0.51], [0.83, 0.535], [0.8, 0.545], [0.81, 0.575],
  [0.84, 0.59], [0.8, 0.61], [0.83, 0.635], [0.79, 0.66], [0.78, 0.68], [0.81, 0.71],
  [0.78, 0.745], [0.7, 0.76], [0.62, 0.765], [0.59, 0.8], [0.6, 0.86], [0.7, 0.92],
  [0.84, 0.97], [0.9, 1],
];

function inHead(u: number, v: number) {
  let inside = false;
  for (let i = 0, j = HEAD.length - 1; i < HEAD.length; j = i++) {
    const [xi, yi] = HEAD[i];
    const [xj, yj] = HEAD[j];
    if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Where a point sits on either head: its depth from the face (0) to the back
// of the head (1), or null outside both.
function depth(px: number, py: number): number | null {
  const v = py / H;
  const left = px / W;
  if (left <= 1 && inHead(left, v)) return 1 - left / 0.88;
  const right = 1 - (px - X2) / W;
  if (right >= 0 && right <= 1 && inHead(right, v)) return 1 - right / 0.88;
  // The second head wears its hair up, so the two are two people and not a
  // reflection: a bun at the back, in the middle strength.
  if (Math.hypot((right - BUN.u) * W, (v - BUN.v) * H) < BUN.r) return 0.45;
  return null;
}

const OPACITY = ["1", "0.62", "0.32"];
const KEEP = [0.92, 0.78, 0.56];

// A stable pseudo-random number in [0, 1) for a cell.
function hash(x: number, y: number, salt: number) {
  let h = (x * 374761393 + y * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function cell(gx: number, gy: number): { ch: string; tier: number } | null {
  const px = (gx + 0.5) * CW;
  const py = (gy + 0.5) * LH;
  const d = depth(px, py);
  if (d === null) return null;
  const tier = d < 0.3 ? 0 : d < 0.6 ? 1 : 2;
  // A cell with a neighbour outside the outline is on the edge, and dropped
  // more often, so the silhouette dissolves rather than ends; the face's
  // edge less so, or the nose and lips would go with it.
  const edge = [[CW, 0], [-CW, 0], [0, LH], [0, -LH]].some(([dx, dy]) => depth(px + dx, py + dy) === null);
  const keep = edge ? KEEP[tier] * (tier === 0 ? 0.85 : 0.45) : KEEP[tier];
  if (hash(gx, gy, 1) > keep) return null;
  return { ch: hash(gx, gy, 2) < 0.6 ? "0" : "1", tier };
}

// One <text> per row and tier, the empty cells as spaces, so the figure is a
// couple of hundred text runs rather than thousands of nodes.
function rows() {
  const out: { y: number; tier: number; text: string }[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let tier = 0; tier < 3; tier++) {
      let text = "";
      let any = false;
      for (let x = 0; x < COLS; x++) {
        const c = cell(x, y);
        if (c && c.tier === tier) {
          text += c.ch;
          any = true;
        } else text += " ";
      }
      if (any) out.push({ y, tier, text });
    }
  }
  return out;
}

const RUNS = rows();

export function HeroFigure({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${COLS * CW} ${H}`}
      preserveAspectRatio="xMaxYMax meet"
      className={className}
      aria-hidden
      focusable="false"
    >
      {RUNS.map((r) => (
        <text
          key={`${r.y}-${r.tier}`}
          x={0}
          y={(r.y + 1) * LH - 3}
          xmlSpace="preserve"
          fontSize={11}
          className="fill-brand font-mono animate-in fade-in fill-mode-both duration-arrive ease-arrive motion-reduce:animate-none"
          style={{ fillOpacity: OPACITY[r.tier], animationDelay: `${r.y * 20}ms` }}
        >
          {r.text}
        </text>
      ))}
    </svg>
  );
}
