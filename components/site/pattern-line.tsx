import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// The signature: a tailor's paper pattern — one design cut along a dashed,
// notched line into each platform it ships on. Drawn in the ornament hand: a
// 1.5px stroke, round caps and joins, elbows on a 6px radius, a 4–6 dash, ink
// at the muted strength; the brand's fill only on the node where the pattern
// branches. The branch for the platform in view is drawn solid, in full ink.
//
// The caller hands in what sits at each end — the design on the left, one
// node per platform on the right — so a branch can be a plain chip or the
// button that switches the shot. Two or three branches.
const W = 300;
const H = 160;
const FROM = 60; // where the source chip's edge meets the line
const SPLIT = 96; // where the pattern branches
const TO = 150; // where a branch meets its chip

function branchPath(y: number) {
  const mid = H / 2;
  if (Math.abs(y - mid) < 1) return `M${FROM} ${mid} H${TO}`;
  const dir = y < mid ? -1 : 1;
  return `M${FROM} ${mid} H${SPLIT - 6} Q${SPLIT} ${mid} ${SPLIT} ${mid + dir * 6} V${y - dir * 6} Q${SPLIT} ${y} ${SPLIT + 6} ${y} H${TO}`;
}

export function PatternLine({
  source,
  branches,
  active,
  className,
}: {
  source: ReactNode;
  branches: ReactNode[];
  /** The branch drawn solid — the platform currently shown. */
  active?: number;
  className?: string;
}) {
  const ys = branches.length === 2 ? [44, 116] : [24, 80, 136];
  return (
    <div className={cn("relative aspect-[300/160] w-full", className)}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 size-full rtl:-scale-x-100"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ys.map((y, i) => (
          <g key={y} className={i === active ? "text-foreground" : "text-muted-foreground/45"} stroke="currentColor">
            <path d={branchPath(y)} strokeDasharray={i === active ? undefined : "4 6"} />
            <path d={`M${(SPLIT + TO) / 2 + 4} ${y - 5} V${y + 5}`} />
          </g>
        ))}
        <circle cx={SPLIT} cy={H / 2} r="4" className="fill-primary" />
      </svg>
      <div className="absolute start-0 top-1/2 -translate-y-1/2">{source}</div>
      {branches.map((b, i) => (
        <div
          key={i}
          className="absolute -translate-y-1/2"
          style={{ insetInlineStart: `${(TO / W) * 100}%`, top: `${(ys[i] / H) * 100}%` }}
        >
          {b}
        </div>
      ))}
    </div>
  );
}
