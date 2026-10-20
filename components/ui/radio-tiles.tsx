// RadioTiles — a pick-one choice drawn as tiles, each a title with an optional line, glyph and price, in a list or a grid.
"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { frameInk } from "@/components/ui/filter-rail";
import { cn } from "@/lib/utils";

// A tile is larger than a control, so it never shrinks under a press: its
// fill moves one rung below its hover instead, picked or not. Picked, it says
// so with the 2px pick frame every pick in the kit wears and, with `mark`, the
// ticked disc — no tint under it, so the frame's ink alone carries the pick and
// clears 3:1 on any brand.
function tileClass({ picked, mark, invalid }: { picked: boolean; mark: boolean; invalid: boolean }) {
  return cn(
    "group/tile relative flex w-full cursor-pointer items-start gap-3 rounded-sm p-4 text-start select-none",
    "transition-[background-color,box-shadow,color] duration-answer ease-answer motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "data-disabled:pointer-events-none",
    "bg-card hover:bg-accent active:bg-muted",
    picked
      ? cn(frameInk, "ring-2 ring-(--frame-ink) ring-inset")
      : cn("ring-1 ring-inset", invalid ? "ring-destructive" : "ring-border"),
  );
}

export type RadioTileOption = {
  value: string;
  title: React.ReactNode;
  /** A line under the title, free to wrap. */
  description?: React.ReactNode;
  /** Held at the end of the title's line, on its baseline: a price, a time. */
  aside?: React.ReactNode;
  /** A glyph for the option. It takes the end of the title's line when there
   *  is no aside, and leads the title when there is one. */
  icon?: IconSvgElement;
  disabled?: boolean;
};

function Tile({
  option,
  picked,
  mark,
  invalid,
}: {
  option: RadioTileOption;
  picked: boolean;
  mark: boolean;
  invalid: boolean;
}) {
  const id = React.useId();
  const titleId = `${id}-title`;
  const asideId = `${id}-aside`;
  const lineId = `${id}-line`;
  const { title, description, aside, icon } = option;
  const glyph = icon ? (
    <HugeiconsIcon
      icon={icon}
      size={18}
      strokeWidth={1.5}
      aria-hidden
      className="shrink-0 text-muted-foreground transition-colors group-data-checked/tile:text-primary-ink"
    />
  ) : null;

  return (
    <Radio.Root
      value={option.value}
      disabled={option.disabled}
      data-slot="radio-tile"
      // The tile is the radio, so its name is the title and the figure held
      // beside it; the line under them is its description.
      aria-labelledby={aside ? `${titleId} ${asideId}` : titleId}
      aria-describedby={description ? lineId : undefined}
      className={tileClass({ picked, mark, invalid })}
    >
      {mark ? (
        // At rest a quiet hollow circle; picked, a solid disc of the bright
        // brand with a tick in its own ink, which is what clears 3:1 — the
        // disc alone does not on a light brand. 20px and the Checkbox's tick,
        // so a form mixing the two reads as one set. The disc fills on the
        // answer curve and the tick springs in; reduced motion just swaps.
        <span
          aria-hidden
          data-slot="radio-tile-mark"
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-full border border-input bg-card",
            "transition-[background-color,border-color] duration-answer ease-answer motion-reduce:transition-none",
            "group-data-unchecked/tile:group-hover/tile:border-muted-foreground group-data-unchecked/tile:group-data-disabled/tile:border-border",
            "group-data-checked/tile:border-primary group-data-checked/tile:bg-primary",
            "group-data-checked/tile:group-data-disabled/tile:border-transparent group-data-checked/tile:group-data-disabled/tile:bg-muted",
          )}
        >
          <HugeiconsIcon
            icon={Tick02Icon}
            strokeWidth={3}
            aria-hidden
            className="size-3 scale-50 text-primary-foreground opacity-0 transition-[scale,opacity] duration-spring ease-spring group-data-checked/tile:scale-100 group-data-checked/tile:opacity-100 group-data-disabled/tile:text-muted-foreground motion-reduce:transition-none"
          />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="flex min-w-0 items-center gap-2">
            {aside ? glyph : null}
            <span
              id={titleId}
              className="text-sm font-medium transition-colors group-data-checked/tile:text-primary-ink group-data-unchecked/tile:group-data-disabled/tile:text-muted-foreground"
            >
              {title}
            </span>
          </span>
          {aside ? (
            <span
              id={asideId}
              className="text-sm whitespace-nowrap tabular-nums group-data-disabled/tile:text-muted-foreground"
            >
              {aside}
            </span>
          ) : (
            glyph
          )}
        </span>
        {description ? (
          <span id={lineId} className="mt-1 text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </Radio.Root>
  );
}

type RadioTilesProps = {
  options: RadioTileOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** The question the tiles answer, read before them. */
  label?: React.ReactNode;
  /** A line under the label: what the choice changes. */
  hint?: React.ReactNode;
  /** Shown under the tiles when the step is refused, and announced. */
  error?: React.ReactNode;
  /** `list` stacks full-width rows, the shape for options carrying prices;
   *  `grid` sets short options side by side. */
  layout?: "list" | "grid";
  /** Where a grid's tiles go side by side: at every width (`base`, the
   *  default, for short options), or from `sm`, stacked under it, for titles
   *  a half-width tile on a phone would break. */
  from?: "base" | "sm";
  /** Columns from `sm` in a grid; two under it, or one with `from="sm"`. */
  columns?: 2 | 3;
  /** The radio mark. A template that draws its picks without one sets this
   *  off, and the edge thickens to carry the state alone. */
  mark?: boolean;
  /** The key the picked value is sent under in a form: each tile carries a
   *  hidden radio input. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/** One tab stop for the set, on the picked tile; the arrow keys move the pick,
 *  as native radios do, and Space picks the focused tile. */
function RadioTiles({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  layout = "list",
  from = "base",
  columns = 2,
  mark = true,
  name,
  required,
  disabled,
  className,
  "aria-label": ariaLabel,
}: RadioTilesProps) {
  const id = React.useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [inner, setInner] = React.useState<string | null>(defaultValue ?? null);
  const current = value ?? inner;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div data-slot="radio-tiles" className={cn("flex flex-col", className)}>
      {label ? (
        <div id={labelId} className="text-sm font-medium">
          {label}
        </div>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <RadioGroup
        data-slot="radio-tiles-group"
        value={current}
        onValueChange={(next) => {
          setInner(String(next));
          onValueChange?.(String(next));
        }}
        name={name}
        required={required}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "grid gap-2",
          label || hint ? "mt-3" : null,
          layout === "grid" && (from === "sm" ? "sm:grid-cols-2" : "grid-cols-2"),
          layout === "grid" && columns === 3 && "sm:grid-cols-3",
        )}
      >
        {options.map((o) => (
          <Tile
            key={o.value}
            option={o}
            picked={o.value === current}
            mark={mark}
            invalid={Boolean(error)}
          />
        ))}
      </RadioGroup>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { RadioTiles };
