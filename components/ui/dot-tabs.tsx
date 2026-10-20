// DotTabs — a short vertical list of tabs beside the figure it switches, the current one in ink with a filled dot, the rest muted with a hollow one.
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type DotTab = { value: string; label: string; disabled?: boolean };

type DotTabsProps = {
  items: DotTab[];
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  // The id of the panel the tabs control, so each tab names it.
  controls?: string;
  className?: string;
};

// A row is 40px for the reach and reads at 14px; the dot is the mark that says
// which one is current, and it clears 3:1 on its own because the label's ink
// changes with it. Arrow keys move along the list, Home and End jump to its
// ends, and only the current tab sits in the tab order.
export function DotTabs({ items, value, onValueChange, controls, className, ...rest }: DotTabsProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  function move(from: number, step: number | "first" | "last") {
    const at = enabled.indexOf(from);
    const next =
      step === "first" ? enabled[0]
      : step === "last" ? enabled[enabled.length - 1]
      : enabled[(at + step + enabled.length) % enabled.length];
    refs.current[next]?.focus();
    onValueChange(items[next].value);
  }

  return (
    <div role="tablist" aria-orientation="vertical" aria-label={rest["aria-label"]} className={cn("flex flex-col", className)}>
      {items.map((it, i) => {
        const current = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={current}
            aria-controls={controls}
            disabled={it.disabled}
            tabIndex={current ? 0 : -1}
            onClick={() => onValueChange(it.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") move(i, 1);
              else if (e.key === "ArrowUp") move(i, -1);
              else if (e.key === "Home") move(i, "first");
              else if (e.key === "End") move(i, "last");
              else return;
              e.preventDefault();
            }}
            className={cn(
              "group/tab flex min-h-10 items-center gap-3 rounded-control text-start text-sm transition-colors duration-answer ease-answer disabled:pointer-events-none disabled:text-muted-foreground",
              current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 shrink-0 rounded-full border transition-colors duration-answer ease-answer",
                current ? "border-foreground bg-foreground" : "border-muted-foreground group-hover/tab:border-foreground"
              )}
            />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
