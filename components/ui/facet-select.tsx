// FacetSelect — a filter pill that picks any number of one facet's options, each row counting the results it would leave.
"use client";

import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

export type FacetOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  /** How many results this option would leave under the other filters. */
  count: number;
};

// The ground the pill stands on, which the corner count is ringed in: a ring
// in the ground keeps the count and the pill reading as two shapes rather than
// one notched blob, and a literal white would be a lighter patch than the page.
const RING = {
  page: "ring-background",
  card: "ring-card",
  band: "ring-accent",
} as const;

/** One facet as a list of options, any number of them on at once. The pill
 *  keeps the facet's name however many are on, and the count of what is on
 *  rides its corner, so the pill neither changes width nor moves its label
 *  when a second option goes on. An option that would empty the results is
 *  locked, unless it is already on. */
export function FacetSelect<T extends string>({
  label,
  options,
  value,
  onValueChange,
  noun = ["result", "results"],
  ground = "page",
  disabled,
  className,
}: {
  /** The facet's name: "Amenities". Also the list's heading. */
  label: string;
  options: readonly FacetOption<T>[];
  value: T[];
  onValueChange: (next: T[]) => void;
  /** What a count counts, singular then plural. The plural heads the count
   *  column; a screen reader hears it after every figure. */
  noun?: readonly [string, string];
  ground?: keyof typeof RING;
  disabled?: boolean;
  className?: string;
}) {
  const on = value.length;
  const column = noun[1][0].toUpperCase() + noun[1].slice(1);

  return (
    <Select
      multiple
      value={value}
      onValueChange={(next) => onValueChange(next as T[])}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label={on ? `${label}, ${on} selected` : label}
        // The facet's name is not a prompt, so it keeps the ink of a chosen
        // value while nothing is on; a filter rail otherwise reads half grey.
        className={cn("not-disabled:data-placeholder:text-foreground", className)}
      >
        {/* The Select's own value slot, which the list lines its rows up
            against, saying the facet's name whatever is chosen. */}
        <SelectValue>{() => label}</SelectValue>
        {on > 0 && (
          <span
            aria-hidden="true"
            data-slot="facet-select-count"
            className={cn(
              "absolute -top-1.5 -inset-e-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground tabular-nums ring-2 group-disabled:bg-muted group-disabled:text-muted-foreground",
              RING[ground],
            )}
          >
            {on}
          </span>
        )}
      </SelectTrigger>
      <SelectContent
        label={label}
        // Below rather than over the pill: the count on its corner would
        // otherwise sit on the list's first row.
        alignItemWithTrigger={false}
        align="start"
        className="min-w-[min(16rem,calc(100vw-2rem))]"
      >
        <SelectGroup>
          {/* Two heads: the facet, and the noun over the figures down the
              end, for the eye only — every figure already says it. */}
          <SelectLabel className="flex justify-between gap-4 pe-8">
            <span>{label}</span>
            <span aria-hidden="true">{column}</span>
          </SelectLabel>
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              disabled={!value.includes(o.value) && o.count === 0}
              trailing={
                <span className="ms-auto ps-6 text-sm text-muted-foreground tabular-nums">
                  {formatNumber(o.count)}
                  <span className="sr-only"> {o.count === 1 ? noun[0] : noun[1]}</span>
                </span>
              }
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
