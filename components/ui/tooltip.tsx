// Tooltip — a few words of ink over an icon-only control, shown on hover and on keyboard focus; never the only place something is said.
"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

// A tooltip names a control for a sighted pointer or keyboard user, and that
// is all it is for. It never opens on touch, and a screen reader hears the
// trigger's own aria-label instead, so the words here repeat that label and
// anything a visitor needs to know lives on the page. Base UI disables it on
// touch screens; a hint someone has to read is a Popover.
//
// The provider makes a row of them feel like one: once a tooltip has shown,
// its neighbours open at once instead of each waiting out the delay.
function TooltipProvider({ delay = 400, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/** Render the control through it: `<TooltipTrigger render={<IconButton aria-label="…" />}>`. */
function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

// Ink rather than a white popover, because it is the interface speaking about
// itself rather than content: its words read at 17:1 whatever is under it,
// and the dark half turns it light on the dark page. No arrow; 8px of air and
// the cast already tie it to its trigger. The corner is the small one, which a
// one-line tooltip renders as a pill and a two-line one as a rounded box.
function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "w-fit max-w-64 origin-(--transform-origin) rounded-sm bg-foreground px-3 py-1.5 text-sm text-balance text-background shadow-soft-lg transition-[opacity,scale] duration-spring ease-spring data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer data-instant:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
