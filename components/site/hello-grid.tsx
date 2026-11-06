import { cn } from "@/lib/utils";

// The last year in green squares, drawn the way a contribution graph draws
// one — a week to a column, Sunday at the top, months over the columns, a
// legend at the foot — with "HELLO" set in its darkest squares. It claims no
// figure: the field is a fixed scatter, there to be the greeting over the
// footer. The dates are real ones, counted back from the day the page was built.

const WEEKS = 53;
const DAYS = 7;

// 5 × 7 letters, one string per row.
const GLYPHS: Record<string, string[]> = {
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
};

const WORD = "HELLO";
const START = Math.floor((WEEKS - (WORD.length * 6 - 1)) / 2);

const lit = new Set<string>();
[...WORD].forEach((ch, i) =>
  GLYPHS[ch].forEach((row, y) =>
    [...row].forEach((px, x) => px === "#" && lit.add(`${START + i * 6 + x},${y}`)),
  ),
);

// A seeded generator, so the scatter is the same on every build and in every
// browser.
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

const day = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const span = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// Today's week is the last column; the first column starts 52 weeks of Sundays
// before it. Days after today stay empty, as a contribution graph leaves them.
const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
const first = new Date(today);
first.setUTCDate(today.getUTCDate() - today.getUTCDay() - (WEEKS - 1) * 7);

const weeks = (() => {
  const rand = mulberry32(2026);
  return Array.from({ length: WEEKS }, (_, x) =>
    Array.from({ length: DAYS }, (_, y) => {
      const date = new Date(first);
      date.setUTCDate(first.getUTCDate() + x * 7 + y);
      const r = rand();
      const level = lit.has(`${x},${y}`) ? 3 : r < 0.5 ? 0 : r < 0.76 ? 1 : 2;
      return { date, level, future: date > today };
    }),
  );
})();

// A month's name over the first column whose Sunday falls in it, left off the
// last columns where it would run past the grid.
const monthAt = new Map(
  weeks
    .map((w, x) => [x, w[0].date] as const)
    .filter(([x, d]) => x > 0 && x <= WEEKS - 3 && d.getUTCMonth() !== weeks[x - 1][0].date.getUTCMonth())
    .map(([x, d]) => [x, month.format(d)]),
);

const DAY_NAMES = new Map([
  [1, "Mon"],
  [3, "Wed"],
  [5, "Fri"],
]);

export function HelloGrid({ className }: { className?: string }) {
  return (
    <figure className={cn("rounded-lg border border-border p-5 sm:p-6", className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm">
        <span className="font-medium">One word in a year of squares</span>
        <span className="text-muted-foreground">
          {span.format(first)} – {span.format(today)}
        </span>
      </figcaption>

      <div
        role="img"
        aria-label="Hello, spelled in a year of green squares"
        className="mt-5 grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[2px] sm:grid-cols-[auto_repeat(53,minmax(0,1fr))] sm:gap-[3px]"
      >
        {/* The months over their columns and the weekdays in the gutter, from
            `sm`; a phone's columns are too narrow to carry them. */}
        <span aria-hidden className="max-sm:hidden" />
        {weeks.map((_, x) => (
          <span key={x} aria-hidden className="relative h-5 max-sm:hidden">
            {monthAt.has(x) && (
              <span className="absolute start-0 top-0 text-xs text-muted-foreground">{monthAt.get(x)}</span>
            )}
          </span>
        ))}

        {Array.from({ length: DAYS }, (_, y) => (
          <Week key={y} y={y} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-xs text-muted-foreground min-[420px]:justify-between">
        {/* The hint gives way to the legend on a narrow phone. */}
        <span className="max-[419px]:hidden">Read the darkest squares</span>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {LEVELS.map((fill) => (
            <span key={fill} className="size-3 rounded-[3px]" style={{ backgroundColor: fill }} />
          ))}
          More
        </span>
      </div>
    </figure>
  );
}

// One weekday across the year: its name in the gutter on Mon, Wed and Fri,
// then a square a week, each carrying its date for a pointer that rests on it.
function Week({ y }: { y: number }) {
  return (
    <>
      <span aria-hidden className="flex items-center pe-2 text-xs text-muted-foreground max-sm:hidden">
        {DAY_NAMES.get(y)}
      </span>
      {weeks.map((w, x) => {
        const cell = w[y];
        return (
          <span
            key={x}
            aria-hidden
            title={cell.future ? undefined : day.format(cell.date)}
            className="aspect-square rounded-[2px] sm:rounded-[3px]"
            style={{ backgroundColor: cell.future ? "transparent" : LEVELS[cell.level] }}
          />
        );
      })}
    </>
  );
}
