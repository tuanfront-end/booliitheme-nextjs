// A website half-built, drawn in 0s and 1s: the browser bar, a headline, a
// button, a picture and three cards, each a block of characters in the brand
// on flat paper. Edges dissolve a cell at a time, and three strengths of the
// one hue give it depth without a gradient. Every cell is decided from its
// position, so the server and the browser draw the same figure.

// The layout below is drawn on a 56 × 34 sketch and set on a grid twice as
// fine, so the characters read as a texture rather than as type.
const SCALE = 2;
const COLS = Math.round(56 * SCALE);
const ROWS = Math.round(34 * SCALE);
const CW = 6.6; // IBM Plex Mono's advance at 11px
const LH = 11;

type Block = { x0: number; y0: number; x1: number; y1: number; tier: 0 | 1 | 2; fill: number };

// tier 0 is the firmest ink, 2 the faintest; fill is how much of the block is set.
const BLOCKS: Block[] = [
  { x0: 0, y0: 0, x1: 55, y1: 2, tier: 1, fill: 0.9 }, // the browser bar
  { x0: 0, y0: 3, x1: 0, y1: 33, tier: 2, fill: 0.8 }, // its frame
  { x0: 55, y0: 3, x1: 55, y1: 33, tier: 2, fill: 0.8 },
  { x0: 0, y0: 33, x1: 55, y1: 33, tier: 2, fill: 0.8 },
  { x0: 3, y0: 4, x1: 8, y1: 4, tier: 1, fill: 1 }, // the logo
  { x0: 33, y0: 4, x1: 52, y1: 4, tier: 2, fill: 0.6 }, // the nav
  { x0: 3, y0: 7, x1: 27, y1: 9, tier: 0, fill: 0.95 }, // the headline
  { x0: 3, y0: 10, x1: 20, y1: 12, tier: 0, fill: 0.95 },
  { x0: 3, y0: 14, x1: 26, y1: 15, tier: 2, fill: 0.55 }, // the lede
  { x0: 3, y0: 17, x1: 13, y1: 18, tier: 0, fill: 1 }, // the button
  { x0: 31, y0: 6, x1: 52, y1: 19, tier: 1, fill: 0.85 }, // the picture
  { x0: 3, y0: 22, x1: 16, y1: 27, tier: 1, fill: 0.8 }, // three cards
  { x0: 3, y0: 29, x1: 13, y1: 29, tier: 0, fill: 0.9 },
  { x0: 3, y0: 30, x1: 15, y1: 30, tier: 2, fill: 0.5 },
  { x0: 20, y0: 22, x1: 34, y1: 27, tier: 1, fill: 0.8 },
  { x0: 20, y0: 29, x1: 30, y1: 29, tier: 0, fill: 0.9 },
  { x0: 20, y0: 30, x1: 33, y1: 30, tier: 2, fill: 0.5 },
  { x0: 38, y0: 22, x1: 52, y1: 27, tier: 1, fill: 0.8 },
  { x0: 38, y0: 29, x1: 48, y1: 29, tier: 0, fill: 0.9 },
  { x0: 38, y0: 30, x1: 51, y1: 30, tier: 2, fill: 0.5 },
];

const OPACITY = ["1", "0.62", "0.32"];

// A stable pseudo-random number in [0, 1) for a cell.
function hash(x: number, y: number, salt: number) {
  let h = (x * 374761393 + y * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function cell(gx: number, gy: number): { ch: string; tier: number } | null {
  const x = Math.floor(gx / SCALE);
  const y = Math.floor(gy / SCALE);
  for (const b of BLOCKS) {
    if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) continue;
    // Cells on a block's edge are dropped more often, so the shape dissolves.
    const edge = x === b.x0 || x === b.x1 || y === b.y0 || y === b.y1;
    const keep = edge ? b.fill * 0.6 : b.fill;
    if (hash(gx, gy, 1) > keep) return null;
    return { ch: hash(gx, gy, 2) < 0.62 ? "0" : "1", tier: b.tier };
  }
  return null;
}

// One <text> per row and tier, the empty cells as spaces, so the whole figure
// is a hundred-odd text runs rather than two thousand nodes.
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
      viewBox={`0 0 ${COLS * CW} ${ROWS * LH}`}
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
