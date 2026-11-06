// Days in a green grid, the way a contribution graph draws one, with
// "HELLO" set in its darkest squares. It claims no figure: the field is a
// fixed scatter, there to be the greeting over the footer.

// Enough weeks to run the column's whole width at a 16px pitch.
const COLS = 63;
const ROWS = 7;
const PITCH = 16;
const CELL = 12;

// 5 × 7 letters, one string per row.
const GLYPHS: Record<string, string[]> = {
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
};

const WORD = "HELLO";
const START = Math.floor((COLS - (WORD.length * 6 - 1)) / 2);

const lit = new Set<string>();
[...WORD].forEach((ch, i) =>
  GLYPHS[ch].forEach((row, y) =>
    [...row].forEach((px, x) => px === "#" && lit.add(`${START + i * 6 + x},${y}`)),
  ),
);

// A seeded generator, so the scatter is the same on the server and in every
// browser and the page never hydrates to a different picture.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The leaf ramp, empty to full, every step mixed from the leaf and its ink
// against the page, so the dark half turns them with it. The letters take the
// deepest step and the scatter never reaches it, so the word stays legible.
const LEVELS = [
  "var(--muted)",
  "color-mix(in oklab, var(--leaf) 35%, var(--background))",
  "color-mix(in oklab, var(--leaf) 75%, var(--leaf-ink))",
  "color-mix(in oklab, var(--leaf-ink) 60%, var(--foreground))",
];

const cells = (() => {
  const rand = mulberry32(2026);
  const out: { x: number; y: number; fill: string }[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const r = rand();
      const level = lit.has(`${x},${y}`) ? 3 : r < 0.5 ? 0 : r < 0.76 ? 1 : 2;
      out.push({ x, y, fill: LEVELS[level] });
    }
  }
  return out;
})();

export function HelloGrid({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${COLS * PITCH - (PITCH - CELL)} ${ROWS * PITCH - (PITCH - CELL)}`}
      role="img"
      aria-label="Hello, spelled in a grid of green squares"
      className={className}
    >
      {cells.map((c) => (
        <rect
          key={`${c.x},${c.y}`}
          x={c.x * PITCH}
          y={c.y * PITCH}
          width={CELL}
          height={CELL}
          rx={3}
          fill={c.fill}
        />
      ))}
    </svg>
  );
}
