// Slider — one value or a range on a rail: a label and its reading above, 24px white thumbs ringed in the light brand under the pointer, a value bubble on a range.
"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

const plain = (value: number) => formatNumber(value);

type SliderProps = Omit<
  SliderPrimitive.Root.Props<readonly number[]>,
  "value" | "defaultValue" | "onValueChange" | "onValueCommitted" | "children" | "className" | "format"
> & {
  /** Names the slider, and leads the row above the rail. */
  label: string;
  /** Keeps the label for screen readers and draws no row: for a slider whose
   *  section already says what it measures, like a range under a histogram. */
  hideHeader?: boolean;
  /** One number for a single thumb, two for a range. */
  value?: readonly number[];
  defaultValue?: readonly number[];
  onValueChange?: (value: number[]) => void;
  onValueCommitted?: (value: number[]) => void;
  /** How a value is written — in the row, in the bubble, and to a screen
   *  reader, so all three say the same thing. */
  format?: (value: number) => string;
  /** The value over a thumb while it is pointed at, dragged or focused from
   *  the keyboard, the row's reading giving way to it. On by default for a
   *  range, where the row cannot say which end is moving. */
  bubble?: boolean;
  /** Each thumb's name on a range, by index: "Lowest price", "Highest price". */
  thumbLabels?: string[];
  className?: string;
};

/** Every range control on the site, on Base UI's Slider. The rail is the muted
 *  rung with the chosen stretch in the brand; every value is also printed in
 *  words above it, so the fill never has to clear a contrast floor alone.
 *  `thumbAlignment="edge"` keeps a thumb at either end inside the rail, so
 *  nothing it carries leaves the control's own box. */
function Slider({
  label,
  hideHeader,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  format = plain,
  bubble,
  thumbLabels,
  disabled,
  className,
  ...props
}: SliderProps) {
  // Mirrored here as well as in Base UI, so the row and the bubbles read the
  // live value whether the slider is controlled or not.
  const [inner, setInner] = React.useState<readonly number[]>(defaultValue ?? value ?? [min]);
  const values = value ?? inner;
  const range = values.length > 1;
  const showBubble = bubble ?? range;
  const span = max - min || 1;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={values}
      min={min}
      max={max}
      disabled={disabled}
      thumbAlignment="edge"
      onValueChange={(next) => {
        const list = typeof next === "number" ? [next] : [...next];
        setInner(list);
        onValueChange?.(list);
      }}
      onValueCommitted={(next) => onValueCommitted?.(typeof next === "number" ? [next] : [...next])}
      // Relative so a hidden header is placed inside the slider rather than
      // off the page's box, where it would widen any scroller it stands in.
      className={cn("group/slider relative w-full", className)}
      {...props}
    >
      <div
        data-slot="slider-header"
        className={cn("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", hideHeader && "sr-only")}
      >
        <SliderPrimitive.Label className="text-sm text-muted-foreground">{label}</SliderPrimitive.Label>
        {/* The thumbs carry the same words as their value text, so this copy
            is for the eye only and a screen reader hears it once. */}
        <span
          aria-hidden
          className={cn(
            "text-sm font-medium tabular-nums group-data-disabled/slider:text-muted-foreground",
            // while a bubble carries the reading, the row lets it go
            showBubble &&
              "transition-opacity duration-answer ease-answer group-has-[[data-slot=slider-thumb]:hover]/slider:opacity-0 group-has-[[data-dragging]]/slider:opacity-0 group-has-focus-visible/slider:opacity-0 motion-reduce:transition-none",
          )}
        >
          {values.map(format).join(" – ")}
        </span>
      </div>
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(
          "relative flex h-6 w-full touch-none items-center select-none",
          !hideHeader && "mt-3",
        )}
      >
        <SliderPrimitive.Track data-slot="slider-track" className="relative h-1.5 w-full rounded-full bg-muted">
          <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className="rounded-full bg-primary data-disabled:bg-foreground/20"
          />
          {values.map((v, i) => (
            <SliderPrimitive.Thumb
              key={i}
              index={i}
              getAriaLabel={range ? () => thumbLabels?.[i] ?? `${label}, ${i === 0 ? "lowest" : "highest"}` : undefined}
              getAriaValueText={(_, current) => format(current)}
              data-slot="slider-thumb"
              // Base UI hands focus to a hidden range input inside the thumb,
              // so the ring is drawn here whenever that input has it — the
              // same colour, width and offset as every other focused control,
              // and only from the keyboard. 40px of reach round a 24px disc.
              className={cn(
                "group/thumb size-6 cursor-grab rounded-full after:absolute after:-inset-2 after:content-['']",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                "data-dragging:cursor-grabbing data-disabled:pointer-events-none",
              )}
            >
              {/* The disc: white in both halves, since it has left the surface,
                  with a hairline so a thumb parked at either end of a white
                  card still reads as a control. It never changes size. Under
                  the pointer and while held, the hairline gives way to a 2px
                  ring of the light brand — twice the chip's alpha, so it
                  shows on a white card and stays soft on a dark one — and a
                  held thumb casts deeper as well. The keyboard's ring is the
                  outline round the thumb, 2px clear of the disc in the deep
                  ink; while it shows, the hover ring stands down, so the two
                  are never read as one. */}
              <span
                aria-hidden
                data-slot="slider-knob"
                className={cn(
                  "block size-full rounded-full bg-fixed-light shadow-soft ring-1 ring-foreground/15",
                  "transition-[box-shadow] duration-answer ease-answer motion-reduce:transition-none",
                  "group-hover/thumb:ring-2 group-hover/thumb:ring-[color-mix(in_oklab,var(--primary)_calc(var(--chip-alpha)*2),transparent)]",
                  "group-data-dragging/thumb:shadow-soft-lg group-data-dragging/thumb:ring-2 group-data-dragging/thumb:ring-[color-mix(in_oklab,var(--primary)_calc(var(--chip-alpha)*2),transparent)]",
                  "group-has-focus-visible/thumb:group-hover/thumb:ring-1 group-has-focus-visible/thumb:group-hover/thumb:ring-foreground/15",
                  "group-data-disabled/thumb:bg-muted group-data-disabled/thumb:shadow-none",
                )}
              />
              {showBubble ? (
                // Slides from the thumb's start edge at the start of the rail to
                // its end edge at the end, so it never hangs past the rail.
                <span
                  aria-hidden
                  data-slot="slider-bubble"
                  style={{ "--at": (v - min) / span } as React.CSSProperties}
                  className="pointer-events-none absolute start-[calc(var(--at)*1.5rem)] bottom-full mb-2.5 -translate-x-[calc(var(--at)*100%)] rounded-sm bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background tabular-nums opacity-0 transition-opacity duration-answer ease-answer group-hover/thumb:opacity-100 group-data-dragging/thumb:opacity-100 group-has-focus-visible/thumb:opacity-100 rtl:translate-x-[calc(var(--at)*100%)] motion-reduce:transition-none"
                >
                  {format(v)}
                </span>
              ) : null}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
