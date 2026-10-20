// Progress — how far along something is, a label and its value over a bar that fills from the start: a booking's steps, a host's profile, a course.
"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { LOCALE } from "@/lib/format";
import { cn } from "@/lib/utils";

// The label and the value sit on one line above the bar — `ProgressLabel` and
// `ProgressValue` as children — and the bar takes the whole width under them.
//
// The fill is the bright brand on a light tint of itself. A light brand — a
// lime, a sun — draws under 3:1 against that track, so the bar never carries
// the value alone: `ProgressValue` prints it as a number beside the label,
// and a bar shown without one is a picture of the number, never the reading.
// It slides in from the start of the track rather than growing, so it moves
// on the compositor and both its ends stay round; on a right-to-left page it
// slides in from the right.
//
// The value is formatted in the site's locale, `lib/format.ts`, unless told
// otherwise, so the server and the browser print the same "40%" and the page
// hydrates clean.
function Progress({
  className,
  children,
  value,
  min = 0,
  max = 100,
  locale = LOCALE,
  ...props
}: ProgressPrimitive.Root.Props) {
  const share = value == null ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      min={min}
      max={max}
      locale={locale}
      className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-2", className)}
      {...props}
    >
      {children}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/25"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          // Base UI sizes the indicator by its width; it is held at full width
          // here and moved instead.
          style={{ width: "100%", "--progress-rest": `${(1 - share) * 100}%` } as React.CSSProperties}
          className="h-full rounded-full bg-primary -translate-x-(--progress-rest) transition-[translate] duration-answer ease-answer motion-reduce:transition-none rtl:translate-x-(--progress-rest)"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn("ms-auto text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    />
  );
}

export { Progress, ProgressLabel, ProgressValue };
