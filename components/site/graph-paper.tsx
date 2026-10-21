import { cn } from "@/lib/utils";

const line = (side: "right" | "bottom", strength: number) =>
  `linear-gradient(to ${side}, color-mix(in oklab, var(--border) ${strength}%, transparent) 1px, transparent 1px)`;

// A sheet of graph paper under the whole page: a 24px grid in a faint line,
// every fifth line a step firmer, fading out before the footer. It sits
// behind everything and takes no pointer.
export function GraphPaper({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        backgroundImage: [line("right", 45), line("bottom", 45), line("right", 22), line("bottom", 22)].join(", "),
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        maskImage: "linear-gradient(to bottom, black 85%, transparent)",
      }}
    />
  );
}
