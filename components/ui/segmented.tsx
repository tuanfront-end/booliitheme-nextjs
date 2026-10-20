// Segmented — a few options in one track, the pick lifted, brand-filled or framed; switches a panel as tabs or sets a value as radios.
"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Tabs } from "@base-ui/react/tabs";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva } from "class-variance-authority";

import { frameInk, revealInRail, SteadyLabel } from "@/components/ui/filter-rail";
import { cn } from "@/lib/utils";

// Three dresses of one track. Every option sits inside it, 4px in, on a
// corner taken off the control seed so the two stay concentric at any radius.
//   default  the accent rung, the lightest under the card, the picked option
//            the card lifted on the soft shadow, its words in full ink. In
//            the dark half the card is the nearest rung, so the same token
//            reads as a pill set into the track, which is the intended look
//            there.
//   brand    no fill, the track drawn by the house hairline on whatever ground
//            it stands on, the picked option in the brand's fill.
//   framed   the same hairline track, the picked option on the card inside a
//            2px frame in `frameInk`, the brand's ink — one declaration, in
//            filter-rail.
// Bright measures under 3:1 against a card or the page as a fill, so in the
// last two the picked words also step to full ink and one weight up, held in
// a `SteadyLabel` so the step never moves the row.
//
// Hover is written per state. An unpicked option on the accent track goes one
// rung further down; on a hairline track it takes a coat of the light brand.
// The picked fill shades as the Button does; a picked card cannot lift any
// further in its fill, so its cast deepens. Pressed, a lifted option gives its
// shadow up — pressed into the track, it has nothing left to cast from.
const optionVariants = cva(
  cn(
    "group/option relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[calc(var(--radius-control)-4px)] text-sm whitespace-nowrap select-none press",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "data-disabled:pointer-events-none data-disabled:text-muted-foreground data-disabled:shadow-none",
    // the 36px option reaches 40px through the track's own padding
    "after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']",
  ),
  {
    variants: {
      size: {
        default: "h-9 px-4",
        lg: "h-10 px-5",
      },
      variant: {
        default: "",
        brand: "",
        framed: frameInk,
      },
      picked: {
        true: "",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        picked: true,
        class: "bg-card text-foreground shadow-soft hover:shadow-soft-lg active:shadow-none",
      },
      { variant: "default", picked: false, class: "hover:bg-muted" },
      {
        variant: "brand",
        picked: true,
        // Locked, the fill drops to the muted rung, as a locked Button's does.
        class: "bg-primary font-medium text-primary-foreground hover:bg-primary/80 data-disabled:bg-muted",
      },
      { variant: ["brand", "framed"], picked: false, class: "hover:bg-chip" },
      {
        variant: "framed",
        picked: true,
        // The frame is a ring inside the edge, the focus ring an outline 2px
        // clear of it, so a focused pick shows both, apart.
        class:
          "bg-card font-medium text-foreground ring-2 ring-(--frame-ink) ring-inset hover:shadow-soft active:shadow-none data-disabled:ring-input",
      },
    ],
    defaultVariants: { size: "default", variant: "default", picked: false },
  },
);

type Variant = "default" | "brand" | "framed";

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  /** A glyph before the words. */
  icon?: IconSvgElement;
  /** A count after the words, a step quieter than them. */
  count?: number;
  disabled?: boolean;
};

// The count stays at the base weight when the words step up. On the brand
// fill it takes the fill's own ink, a step quieter, since muted ink measures
// under 4.5:1 on the bright brand.
function OptionBody({ option, variant, picked }: { option: SegmentedOption; variant: Variant; picked: boolean }) {
  return (
    <>
      {option.icon ? (
        <HugeiconsIcon icon={option.icon} size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
      ) : null}
      {variant === "default" ? option.label : <SteadyLabel>{option.label}</SteadyLabel>}
      {option.count !== undefined ? (
        <span
          className={cn(
            "font-normal tabular-nums",
            variant === "brand" && picked ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {option.count}
        </span>
      ) : null}
    </>
  );
}

// The track scrolls sideways when its options outgrow a phone, and on one
// axis only: the scroller pads by what paints outside an option — the picked
// one's shadow below it, a focus ring around it — and takes the padding back
// with a negative margin, so nothing is clipped flat at the edge and nothing
// scrolls vertically.
function Scroller({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="segmented-scroller"
      {...props}
      className={cn(
        "no-scrollbar -mx-2 -my-3 max-w-[calc(100%+1rem)] min-w-0 overflow-x-auto px-2 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

// A filling track shares the width out, and never drops below its options'
// own: past that it grows with them, and the scroller around it scrolls.
// Every track carries a 1px border, transparent under the muted fill, so the
// hairline and the 3px inside it put the options 4px in on all three and one
// corner sum serves them.
const trackClass = (variant: Variant, fill?: boolean) =>
  cn(
    "gap-1 rounded-control border p-0.75",
    variant === "default" ? "border-transparent bg-accent" : "border-border",
    fill ? "flex w-full min-w-max *:flex-1" : "inline-flex w-max",
  );

type SegmentedProps = {
  /** `radio` sets a value the row applies itself and carries a form field;
   *  `tabs` switches the `SegmentedPanel` children of the same value. */
  kind?: "radio" | "tabs";
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "default" | "lg";
  /** `default` lifts the pick out of a muted track; `brand` fills it with the
   *  brand on a hairline track; `framed` frames it on the same track. */
  variant?: Variant;
  /** Options share the full width instead of hugging their words. */
  fill?: boolean;
  /** The key the picked value is sent under in a form. Radios only. */
  name?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** The panels, as tabs. */
  children?: React.ReactNode;
};

/** One look for every row of a few options that switches what stands under it
 *  or sets something: a view toggle, a price basis, a search's three modes.
 *  One tab stop; the arrow keys move along the options and pick as they go.
 *  A row of pills on the page's own ground that narrows a list is a
 *  FilterRail, not this. */
function Segmented({
  kind = "radio",
  options,
  value,
  defaultValue,
  onValueChange,
  size = "default",
  variant = "default",
  fill,
  name,
  disabled,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  children,
}: SegmentedProps) {
  const fallback = options.find((o) => !o.disabled)?.value ?? "";
  const [inner, setInner] = React.useState(defaultValue ?? fallback);
  const current = value ?? inner;
  const pick = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };

  // A track that scrolls brings the picked option fully into view — inside
  // the track, never by scrolling the page.
  const scroller = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);
  React.useEffect(() => {
    const item = scroller.current?.querySelector(`[data-option="${CSS.escape(current)}"]`) ?? null;
    revealInRail(scroller.current, item, first.current);
    first.current = false;
  }, [current]);

  if (kind === "tabs") {
    return (
      <Tabs.Root
        data-slot="segmented"
        value={current}
        onValueChange={(next) => pick(String(next))}
        className={cn("flex flex-col", className)}
      >
        <Scroller ref={scroller}>
          <Tabs.List
            data-slot="segmented-track"
            activateOnFocus
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            className={trackClass(variant, fill)}
          >
            {options.map((o) => (
              <Tabs.Tab
                key={o.value}
                value={o.value}
                data-slot="segmented-option"
                data-option={o.value}
                disabled={disabled || o.disabled}
                className={optionVariants({ size, variant, picked: o.value === current })}
              >
                <OptionBody option={o} variant={variant} picked={o.value === current} />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Scroller>
        {children}
      </Tabs.Root>
    );
  }

  return (
    <Scroller ref={scroller} data-slot="segmented" className={className}>
      <RadioGroup
        data-slot="segmented-track"
        value={current}
        onValueChange={(next) => pick(String(next))}
        name={name}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={trackClass(variant, fill)}
      >
        {options.map((o) => (
          <Radio.Root
            key={o.value}
            value={o.value}
            data-slot="segmented-option"
            data-option={o.value}
            disabled={o.disabled}
            className={optionVariants({ size, variant, picked: o.value === current })}
          >
            <OptionBody option={o} variant={variant} picked={o.value === current} />
          </Radio.Root>
        ))}
      </RadioGroup>
    </Scroller>
  );
}

/** What a tab shows. Focusable, as a tab panel is, so its ring is the
 *  site's own and drawn a little clear of whatever it frames. */
function SegmentedPanel({ className, ...props }: Tabs.Panel.Props) {
  return (
    <Tabs.Panel
      data-slot="segmented-panel"
      className={cn(
        "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export { Segmented, SegmentedPanel };
