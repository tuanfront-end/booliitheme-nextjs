// ToggleButton — a labelled two-state control such as Follow or Compare: pressed shows a check and swaps the fill, in a quiet or a lead tone.
import type * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { Add01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Two tones, and each has two resting looks, so each has two hovers.
//
// `quiet` is a block's secondary control: a muted fill that darkens a rung
// under the pointer, filling with the brand once pressed, since pressed is a
// selected state. `lead` is a page's own action, a Follow on a host's profile:
// dressed as the primary Button — --action, not the brand's fill — until it
// is pressed, then the muted one, as a call to action that has been answered
// steps back. Either way the plus turns to a tick, so the state is said by the
// glyph and the label as well as the fill.
//
// A pressed hover shades the fill it has (/80, muted to secondary) and
// never returns to the other state's colour, which would read as the control
// switching itself off under the cursor. The stacked variants outrank the
// single ones whichever way the stylesheet is written out.
const toggleButtonVariants = cva(
  "group/toggle relative inline-grid shrink-0 place-items-center rounded-control text-sm font-medium whitespace-nowrap press select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:bg-muted data-disabled:text-muted-foreground data-disabled:data-pressed:bg-muted data-disabled:data-pressed:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        quiet:
          "bg-muted text-foreground hover:bg-secondary data-pressed:bg-primary data-pressed:text-primary-foreground hover:data-pressed:bg-primary/80",
        lead: "bg-action text-action-foreground hover:bg-action-hover data-pressed:bg-muted data-pressed:text-foreground hover:data-pressed:bg-secondary",
      },
      // The label always leads with a glyph, so the start side sits a step
      // tighter, as a Button's does with one.
      size: {
        default: "h-10 ps-4 pe-5",
        lg: "h-11 ps-5 pe-6",
      },
    },
    defaultVariants: {
      tone: "quiet",
      size: "default",
    },
  },
);

type ToggleButtonProps = Omit<React.ComponentProps<typeof Toggle>, "className" | "children"> &
  VariantProps<typeof toggleButtonVariants> & {
    /** The label at rest: "Follow Marta", "Compare". */
    children: React.ReactNode;
    /** The label once pressed, "Following Marta"; the rest label when omitted. */
    pressedLabel?: React.ReactNode;
    /** The glyph at rest, a plus unless given. Pressed is always the tick. */
    icon?: React.ReactNode;
    className?: string;
  };

function ToggleButton({ tone, size, children, pressedLabel, icon, className, ...props }: ToggleButtonProps) {
  return (
    <Toggle
      data-slot="toggle-button"
      className={cn(toggleButtonVariants({ tone, size }), className)}
      {...props}
    >
      {/* Both labels stand in one cell and the one not in use is hidden, so
          the control keeps the longer one's width and nothing beside it moves
          when it is pressed. A hidden label is left out of the spoken name. */}
      <span className="col-start-1 row-start-1 inline-flex items-center gap-1.5 group-data-pressed/toggle:invisible">
        {icon ?? <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />}
        {children}
      </span>
      <span className="invisible col-start-1 row-start-1 inline-flex items-center gap-1.5 group-data-pressed/toggle:visible">
        <HugeiconsIcon icon={Tick02Icon} aria-hidden="true" />
        {pressedLabel ?? children}
      </span>
    </Toggle>
  );
}

export { ToggleButton, toggleButtonVariants, type ToggleButtonProps };
