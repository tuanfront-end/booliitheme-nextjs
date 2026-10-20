// RangeFilter — a range picked over where the results sit: a histogram on a two-thumb slider, typeable ends, quick picks and the count it leaves.
"use client";

import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";

import { FilterChip } from "@/components/ui/filter-rail";
import { railFade, useRailFade } from "@/components/ui/rail-fade";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

export type RangePreset = { label: string; range: [number, number] };

const plain = (value: number) => formatNumber(value);

/** The bars say where the results sit, the thumbs say which of them to keep,
 *  and the bars inside the range take the rail's own fill, so the two read as
 *  one instrument. Each bar covers an equal share of `min`–`max`. Thin, and
 *  softened at the top only, so they read as a histogram rather than a row of
 *  pills; an empty share keeps a stub, so the axis stays unbroken. Padded by
 *  half a thumb, which is how far in a thumb's centre stops at either end. */
function Histogram({
  bins,
  min,
  max,
  value,
}: {
  bins: number[];
  min: number;
  max: number;
  value: readonly [number, number];
}) {
  const tallest = Math.max(1, ...bins);
  const width = (max - min) / Math.max(1, bins.length);
  return (
    <div aria-hidden data-slot="range-filter-histogram" className="flex h-16 items-end gap-1 px-3">
      {bins.map((n, i) => {
        const lo = min + i * width;
        const inside = n > 0 && lo + width > value[0] && lo <= value[1];
        return (
          <span
            key={i}
            style={{ height: n ? `${Math.max(14, (n / tallest) * 100)}%` : "3px" }}
            className={cn(
              "min-w-0 flex-1 rounded-t-[4px] transition-colors duration-answer ease-answer",
              inside ? "bg-primary" : "bg-muted",
            )}
          />
        );
      })}
    </div>
  );
}

/** One end of the range, typed. It takes what was typed once the field is
 *  left, never on every keystroke — a "1" on its way to "150" would otherwise
 *  throw the thumb to the far end and back. The arrow keys step it. Whatever
 *  lands is held inside its own side of the range, and an emptied field goes
 *  back to the end of the scale. */
function EndField({
  label,
  value,
  placeholder,
  min,
  max,
  step,
  prefix,
  suffix,
  disabled,
  onCommit,
}: {
  label: string;
  value: number | null;
  placeholder?: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  onCommit: (value: number | null) => void;
}) {
  const id = React.useId();
  return (
    <NumberField.Root
      id={id}
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      format={{ maximumFractionDigits: 0 }}
      onValueCommitted={(next) => onCommit(next)}
      data-slot="range-filter-field"
      className={cn(
        "flex min-w-0 flex-col rounded-control bg-accent py-2 ps-5 pe-4 transition-colors duration-answer ease-answer",
        "has-[input:enabled:hover]:bg-muted",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
      )}
    >
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </label>
      <div className="flex items-baseline gap-0.5 text-sm font-medium tabular-nums">
        {prefix ? <span aria-hidden>{prefix}</span> : null}
        {/* 16px under md, so a phone does not zoom the page on focus. */}
        <NumberField.Input
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:text-muted-foreground md:text-sm"
        />
        {suffix ? <span className="ms-1 text-muted-foreground">{suffix}</span> : null}
      </div>
    </NumberField.Root>
  );
}

type RangeFilterProps = {
  /** What the range measures — "Price per night". Names the slider too. */
  label: string;
  /** One line under the label: the unit, what is included. */
  description?: React.ReactNode;
  /** Drop the label and line, where a popover or a dialog section already
   *  heads the control; the label still names it for screen readers. */
  hideLabel?: boolean;
  /** Results per equal share of `min`–`max`, left to right. */
  bins: number[];
  min: number;
  max: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  /** Quick picks under the fields. Pressing the one already picked lets the
   *  range go back to everything. */
  presets?: RangePreset[];
  /** How many results the range leaves, announced as it changes. */
  count?: number;
  /** The words around the count: `(n) => \`${n} stays\``. */
  countLabel?: (count: number) => React.ReactNode;
  /** How a value is written in the bubble and to a screen reader. */
  format?: (value: number) => string;
  /** The symbol in front of a typed figure, and the unit after it. */
  prefix?: string;
  suffix?: string;
  /** The top of the scale means "and above": at `max` the upper end reads as
   *  no cap rather than as a ceiling. */
  openMax?: boolean;
  /** The two ends' names. */
  endLabels?: [string, string];
  disabled?: boolean;
  className?: string;
};

function RangeFilter({
  label,
  description,
  hideLabel,
  bins,
  min,
  max,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  presets,
  count,
  countLabel = (n) => `${formatNumber(n)} ${n === 1 ? "result" : "results"}`,
  format = plain,
  prefix,
  suffix,
  openMax,
  endLabels = ["Minimum", "Maximum"],
  disabled,
  className,
}: RangeFilterProps) {
  const [inner, setInner] = React.useState<[number, number]>(defaultValue ?? value ?? [min, max]);
  const picks = React.useRef<HTMLDivElement>(null);
  useRailFade(picks);
  const current = value ?? inner;
  const set = (next: [number, number]) => {
    setInner(next);
    onValueChange?.(next);
  };
  const snap = (v: number) => Math.min(max, Math.max(min, min + Math.round((v - min) / step) * step));
  const written = (v: number) => (openMax && v >= max ? `${format(max)}+` : format(v));

  return (
    <div data-slot="range-filter" className={cn("flex flex-col", className)}>
      {hideLabel ? null : (
        <div className="mb-5">
          <p className="text-sm font-medium">{label}</p>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      )}
      <Histogram bins={bins} min={min} max={max} value={current} />
      {/* The rail stands just under the bars, so the histogram reads as sitting
          on the slider it describes, and the thumbs lap the bars' feet. */}
      <Slider
        label={label}
        hideHeader
        value={current}
        onValueChange={(next) => set([next[0], next[1]])}
        min={min}
        max={max}
        step={step}
        format={written}
        thumbLabels={endLabels.map((end) => `${end}, ${label.toLowerCase()}`)}
        disabled={disabled}
        className="-mt-2"
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <EndField
          label={endLabels[0]}
          value={current[0]}
          min={min}
          max={current[1]}
          step={step}
          prefix={prefix}
          suffix={suffix}
          disabled={disabled}
          onCommit={(next) => set([next === null ? min : snap(Math.min(next, current[1])), current[1]])}
        />
        <EndField
          label={endLabels[1]}
          // At the top of an open scale the field is empty, and its
          // placeholder says the range runs on past the last figure.
          value={openMax && current[1] >= max ? null : current[1]}
          placeholder={openMax ? `${plain(max)}+` : undefined}
          min={current[0]}
          max={max}
          step={step}
          prefix={prefix}
          suffix={suffix}
          disabled={disabled}
          onCommit={(next) => set([current[0], next === null ? max : snap(Math.max(next, current[0]))])}
        />
      </div>
      {presets?.length || count !== undefined ? (
        // The quick picks are a chip row, so on a phone they scroll sideways
        // on one line rather than wrap, padded by what a chip's ring draws
        // past it, fading the edge with more past it, and the count takes the
        // line under them. From `sm` the
        // scroller steps out of the way and the two share one row.
        <div
          data-slot="range-filter-picks"
          className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
        >
          {presets?.length ? (
            <div
              ref={picks}
              className={cn("no-scrollbar -mx-1 -my-3 flex gap-2 overflow-x-auto px-1 py-3 sm:contents", railFade)}
            >
              {presets.map((p) => {
                const on = current[0] === p.range[0] && current[1] === p.range[1];
                return (
                  <FilterChip
                    key={p.label}
                    variant="outline"
                    pressed={on}
                    disabled={disabled}
                    onPressedChange={(next) => set(next ? p.range : [min, max])}
                  >
                    {p.label}
                  </FilterChip>
                );
              })}
            </div>
          ) : null}
          {count !== undefined ? (
            <p
              aria-live="polite"
              data-slot="range-filter-count"
              className="text-sm text-muted-foreground tabular-nums sm:ms-auto"
            >
              {countLabel(count)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { RangeFilter };
