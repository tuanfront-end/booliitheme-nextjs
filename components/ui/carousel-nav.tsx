// CarouselNav — the previous and next arrows of a sideways rail: disabled at its ends, a page per press, and not drawn when nothing overflows.
"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import type { Rail } from "@/components/ui/use-rail";
import { cn } from "@/lib/utils";

// The pair sits at the end of the rail's heading row, where the reference
// shelves put it, and reads its state from `useRail` — the hook owns the rail,
// this file only draws its two doors.
//
// An arrow at its end stays focusable while it is disabled. Pressed from the
// keyboard until the rail runs out, a native `disabled` would drop focus onto
// the page body; `focusableWhenDisabled` keeps it on the arrow, which now says
// it is unavailable. `Button` draws that state off `data-disabled`, the
// attribute such a button carries in place of the property.

/** One arrow, for a rail whose two doors are set apart — either side of a
 *  gallery rather than together beside a heading. */
function CarouselArrow({
  direction,
  size = "icon",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "variant" | "size"> & {
  direction: "previous" | "next";
  /** 40px beside a section heading; 36px in a tighter row. */
  size?: "icon" | "icon-sm";
}) {
  return (
    <Button
      data-slot="carousel-arrow"
      variant="outline"
      size={size}
      focusableWhenDisabled
      className={className}
      {...props}
    >
      {direction === "previous" ? (
        <ChevronLeftIcon aria-hidden className="rtl:-scale-x-100" />
      ) : (
        <ChevronRightIcon aria-hidden className="rtl:-scale-x-100" />
      )}
    </Button>
  );
}

function CarouselNav({
  rail,
  controls,
  previousLabel = "Previous",
  nextLabel = "Next",
  size = "icon",
  className,
}: {
  /** What `useRail` returned for the rail these arrows move. */
  rail: Pick<Rail, "ends" | "none" | "page">;
  /** The id of the rail the arrows move. */
  controls?: string;
  /** What each arrow says to a screen reader: "Previous stays". */
  previousLabel?: string;
  nextLabel?: string;
  size?: "icon" | "icon-sm";
  className?: string;
}) {
  // A rail whose items all fit has nowhere to go, and two dead arrows beside a
  // heading read as a broken control rather than a finished one.
  if (rail.none) return null;

  return (
    <div data-slot="carousel-nav" className={cn("flex shrink-0 items-center gap-2", className)}>
      <CarouselArrow
        direction="previous"
        size={size}
        disabled={rail.ends.start}
        aria-label={previousLabel}
        aria-controls={controls}
        onClick={() => rail.page(-1)}
      />
      <CarouselArrow
        direction="next"
        size={size}
        disabled={rail.ends.end}
        aria-label={nextLabel}
        aria-controls={controls}
        onClick={() => rail.page(1)}
      />
    </div>
  );
}

export { CarouselArrow, CarouselNav };
