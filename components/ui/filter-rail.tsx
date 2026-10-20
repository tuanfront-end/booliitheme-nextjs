// FilterRail — a row of pill chips that narrows a list, each with its count, in three dresses, scrolling sideways on a phone.
"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";

import { reach } from "@/components/reach";
import { railFade, railFadeRem, useRailFade } from "@/components/ui/rail-fade";
import { cn } from "@/lib/utils";

// The frame a pick is drawn in when it is a 2px edge rather than a fill, or
// beside one — the `framed` chip here, the `framed` segmented option, a slot,
// a lit map pin. One declaration for all of them, so the colour is swapped
// on this line and nowhere else. It is the brand's ink, which clears 3:1 on a
// card or the page where the bright brand does not; the picked label still
// steps up to full ink and one weight heavier (`SteadyLabel`), so a framed
// pick reads in its words as well as its edge.
export const frameInk = "[--frame-ink:var(--primary-ink)]";

/** A label that can step one weight heavier without moving anything. An
 *  invisible medium copy shares its grid cell, so the cell is always the width
 *  of the heavier text and a pick never nudges its neighbours along the row. */
export function SteadyLabel({ children }: { children: React.ReactNode }) {
  return (
    <span data-slot="steady-label" className="inline-grid justify-items-center">
      <span className="[grid-area:1/1]">{children}</span>
      <span aria-hidden className="invisible font-medium [grid-area:1/1]">
        {children}
      </span>
    </span>
  );
}

// The brand fill a picked `plain` or `outline` chip takes — a selected state
// takes the control fill — hovering by shading it, never by going back to the
// unpicked look.
const filled =
  "data-pressed:bg-primary data-pressed:text-primary-foreground hover:data-pressed:bg-primary/80 hover:data-pressed:text-primary-foreground";

// One chip, three resting dresses. `plain` is the rail on the page's own
// ground: no fill until the pointer lands, so a row of eight reads as one
// strip rather than eight buttons. `outline` is a hairline pill for a chip row
// inside a card or a popover, where a bare word would read as a label; both of
// those fill with the brand when picked. `framed` keeps the hairline pill and
// draws the pick as a 2px frame instead of a fill, its label in full ink and
// medium weight where the others sit muted.
//
// Drawn at 36px with the 40px reach behind it. A locked chip stops taking the
// pointer rather than painting a hover it would then refuse.
const filterChipVariants = cva(
  cn(
    "group/chip inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-control px-4 text-sm whitespace-nowrap select-none press",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "data-disabled:pointer-events-none data-disabled:text-muted-foreground",
    "[&_svg]:shrink-0",
    reach,
  ),
  {
    variants: {
      variant: {
        plain: cn(filled, "text-muted-foreground hover:bg-muted hover:text-foreground"),
        outline: cn(
          filled,
          "bg-card text-foreground ring-1 ring-input ring-inset hover:bg-accent data-pressed:ring-transparent",
        ),
        // The frame is a ring drawn inside the edge and the focus ring an
        // outline 2px clear of it, so a focused pick shows both, apart.
        framed: cn(
          frameInk,
          "bg-card text-muted-foreground ring-1 ring-input ring-inset hover:bg-accent hover:text-foreground",
          "data-pressed:font-medium data-pressed:text-foreground data-pressed:ring-2 data-pressed:ring-(--frame-ink)",
          "data-disabled:data-pressed:text-muted-foreground data-disabled:data-pressed:ring-input",
        ),
      },
    },
    defaultVariants: { variant: "plain" },
  },
);

export type FilterChipVariant = NonNullable<VariantProps<typeof filterChipVariants>["variant"]>;

// A count of what pressing the chip would show, so it reads in the label's
// flow, a step quieter than the word. On a brand fill it takes the picked ink
// with the label; a framed pick stays on the card, so its count stays quiet
// there and only the word steps up. The picked hover is stacked on the picked
// state so it wins on specificity rather than on where the stylesheet happens
// to write it.
function ChipCount({ n, filled }: { n: number; filled: boolean }) {
  return (
    <span
      data-slot="filter-chip-count"
      className={cn(
        "font-normal text-muted-foreground tabular-nums transition-colors group-hover/chip:text-foreground group-data-disabled/chip:text-muted-foreground",
        filled &&
          "group-data-pressed/chip:text-primary-foreground group-hover/chip:group-data-pressed/chip:text-primary-foreground",
      )}
    >
      {n}
    </span>
  );
}

function FilterChip({
  className,
  variant,
  icon,
  count,
  children,
  ...props
}: Toggle.Props & {
  variant?: FilterChipVariant;
  /** A glyph before the words — a category's own, never a decoration. */
  icon?: IconSvgElement;
  /** How many results the chip would leave. */
  count?: number;
}) {
  const framed = variant === "framed";
  return (
    <Toggle
      data-slot="filter-chip"
      className={cn(filterChipVariants({ variant }), className)}
      {...props}
    >
      {icon ? <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} aria-hidden /> : null}
      {framed ? <SteadyLabel>{children}</SteadyLabel> : children}
      {count !== undefined ? <ChipCount n={count} filled={!framed} /> : null}
    </Toggle>
  );
}

// Bring a chip fully into view inside its rail, and move nothing else. A rail
// scrolls on its own axis only, so the scroll is the rail's own `scrollLeft`
// and never `scrollIntoView`, which also scrolls the page when the rail sits
// half under the fold. Physical rects and a physical delta hold in both
// directions of text. A rail that fades its edges brings the chip clear of the
// fade as well, and at either end the browser stops the scroll where the fade
// has gone.
export function revealInRail(rail: HTMLElement | null, item: Element | null, instant = false) {
  if (!rail || !item || rail.scrollWidth <= rail.clientWidth) return;
  const box = rail.getBoundingClientRect();
  const at = item.getBoundingClientRect();
  const style = getComputedStyle(rail);
  const fade =
    style.maskImage === "none" ? 0 : railFadeRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const start = Math.max(parseFloat(style.paddingLeft) || 0, fade);
  const end = Math.max(parseFloat(style.paddingRight) || 0, fade);
  let by = 0;
  if (at.left < box.left + start) by = at.left - box.left - start;
  else if (at.right > box.right - end) by = at.right - box.right + end;
  if (!by) return;
  const still = instant || matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The delta is measured from screen rects, so it already points the way the
  // chip lies on a page of either direction and takes no sign.
  // physical: a screen-space delta, right on both kinds of page
  rail.scrollBy({ left: by, behavior: still ? "auto" : "smooth" });
}

// The rail scrolls on one axis. It pads by the reach of the focus ring — 2px
// out, 2px wide — and takes the padding back with a matching negative margin,
// so nothing paints past its box and nothing scrolls vertically. On a phone it
// bleeds to the screen edge, so the end chips sit on the gutter instead of
// against a cut edge: `page` in the page's 24px gutter, `panel` in a tinted
// panel's 16px one. An edge with more chips past it fades (`railFade`).
const bleeds = {
  page: "-mx-6 px-6 sm:-mx-1 sm:px-1",
  panel: "-mx-4 px-4 md:-mx-1 md:px-1",
  none: "-mx-1 px-1",
} as const;

export type FilterRailOption = {
  value: string;
  label: React.ReactNode;
  count?: number;
  icon?: IconSvgElement;
  disabled?: boolean;
};

type RailCommon = {
  options: FilterRailOption[];
  variant?: FilterChipVariant;
  /** Which gutter the rail bleeds into on a phone. */
  bleed?: keyof typeof bleeds;
  /** `center` falls back to the start whenever the chips outgrow the rail. */
  align?: "start" | "center";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

type RailSingle = RailCommon & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type RailMultiple = RailCommon & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

/** One pick from a set by default — a category, a time range — and any number
 *  with `multiple` — amenities, features. One tab stop for the rail; the arrow
 *  keys walk it and Space or Enter presses. A single-pick rail always holds a
 *  pick: pressing the picked chip leaves it picked. */
function FilterRail(props: RailSingle | RailMultiple) {
  const {
    options,
    variant = "plain",
    bleed = "page",
    align = "start",
    disabled,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
  } = props;
  const multiple = props.multiple === true;
  const toList = (v: string | string[] | undefined) =>
    v === undefined ? undefined : Array.isArray(v) ? v : [v];

  const [inner, setInner] = React.useState<string[]>(
    () => toList(props.defaultValue) ?? (multiple ? [] : options[0] ? [options[0].value] : []),
  );
  const current = toList(props.value) ?? inner;

  const rail = React.useRef<HTMLDivElement>(null);
  useRailFade(rail);
  const first = React.useRef(true);
  const lead = current[current.length - 1];
  React.useEffect(() => {
    const item = rail.current?.querySelector(`[data-chip="${CSS.escape(lead ?? "")}"]`) ?? null;
    revealInRail(rail.current, item, first.current);
    first.current = false;
  }, [lead]);

  return (
    <ToggleGroup
      ref={rail}
      data-slot="filter-rail"
      value={current}
      multiple={multiple}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      onValueChange={(next, details) => {
        if (!multiple) {
          if (next.length === 0) {
            details.cancel();
            return;
          }
          setInner(next);
          (props as RailSingle).onValueChange?.(next[0]);
          return;
        }
        setInner(next);
        (props as RailMultiple).onValueChange?.(next);
      }}
      className={cn(
        "no-scrollbar -my-3 flex overflow-x-auto py-3",
        railFade,
        variant === "plain" ? "gap-1" : "gap-2",
        align === "center" && "justify-center-safe",
        bleeds[bleed],
        className,
      )}
    >
      {options.map((o) => (
        <FilterChip
          key={o.value}
          value={o.value}
          data-chip={o.value}
          variant={variant}
          icon={o.icon}
          count={o.count}
          disabled={o.disabled}
        >
          {o.label}
        </FilterChip>
      ))}
    </ToggleGroup>
  );
}

export { FilterChip, FilterRail, filterChipVariants };
