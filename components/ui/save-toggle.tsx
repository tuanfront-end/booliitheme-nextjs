// SaveToggle — the heart that keeps a listing on a visitor's list: a disc on a photograph, a heart and its count in a card's footer, or a labelled Save pill.
"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber, numberFormat } from "@/lib/format";

// A count short the way social counts are ("1.8K"). Under a thousand it is
// exact, so there a press visibly moves it by one.
const compact = numberFormat({ notation: "compact", maximumFractionDigits: 1 });

// Saved is a solid coral heart in every form, because red is what a liked
// heart means everywhere else, and it is the one place the page borrows a hue
// for a meaning of its own. Not --coral as it stands: the 400 fill is 2.8:1 on
// a white card, and on the disc and in the count the heart is the only thing
// saying the listing is kept, a mark alone, which owes 3:1. Halfway to its
// ink it clears 4:1 on white and still reads as the same coral.
const SAVED = "text-[color-mix(in_oklab,var(--coral),var(--coral-ink))]";

// Three drawings of one control. The disc floats on a photograph whose colour
// is not ours to predict, so it is opaque card with a cast, darkens a rung on
// hover in the light half and lifts its cast in the dark one, and rings with a
// card-coloured halo outside the ring so the ring shows on any picture. The
// count is ink on a card, read like a post's likes. The pill is the outline
// Button, for a detail page where Save stands beside Share.
const FORMS = {
  disc: "relative inline-grid size-9 shrink-0 place-items-center rounded-control bg-card text-foreground shadow-soft press select-none after:absolute after:-inset-0.5 after:content-[''] hover:bg-photo-lift-deep hover:shadow-soft-lg active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:ring-4 focus-visible:ring-card data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:size-4.5",
  count:
    "relative -mx-1 inline-flex h-6 shrink-0 items-center gap-1.5 rounded-control px-1 text-sm text-muted-foreground tabular-nums press select-none after:absolute after:-inset-x-1 after:-inset-y-2 after:content-[''] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none [&_svg]:size-4",
  pill: buttonVariants({ variant: "outline" }),
} as const;

type SaveToggleProps = Omit<Toggle.Props, "children" | "className" | "value" | "aria-label"> & {
  /** The listing's name. A grid draws one heart per card, and without it a
   *  screen reader hears "Save" fifteen times with nothing between them. */
  label: string;
  variant?: keyof typeof FORMS;
  /** For `count`: how many other people have saved it. The visitor's own
   *  save is added on top, so the figure moves with the press. */
  count?: number;
  className?: string;
};

function SaveToggle({
  label,
  variant = "disc",
  count = 0,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  className,
  ...props
}: SaveToggleProps) {
  // Controlled when the template's own store passes `pressed`, and holding
  // its own state otherwise, so the count can be drawn either way.
  const [own, setOwn] = React.useState(defaultPressed);
  const saved = pressedProp ?? own;
  // The heart pops only on a press, never on the first paint of a listing
  // that loads already saved.
  const [popped, setPopped] = React.useState(false);
  const total = count + (saved ? 1 : 0);

  // One drawing in both states: the outline at rest, and saved the same
  // heart filled with its own stroke colour, so the shape never changes under
  // the press — only its weight does.
  const heart = saved ? (
    <HugeiconsIcon
      key="saved"
      icon={FavouriteIcon}
      fill="currentColor"
      aria-hidden="true"
      data-icon={variant === "pill" ? "inline-start" : undefined}
      className={cn(SAVED, popped && "animate-in zoom-in-50 duration-spring ease-spring")}
    />
  ) : (
    <HugeiconsIcon
      key="rest"
      icon={FavouriteIcon}
      aria-hidden="true"
      data-icon={variant === "pill" ? "inline-start" : undefined}
    />
  );

  return (
    <Toggle
      data-slot="save-toggle"
      data-variant={variant}
      pressed={saved}
      onPressedChange={(next, details) => {
        if (pressedProp === undefined) setOwn(next);
        setPopped(next);
        onPressedChange?.(next, details);
      }}
      // A toggle keeps one name and lets aria-pressed say which way it is set;
      // the count is part of the name because it is part of what is shown.
      aria-label={
        variant === "pill"
          ? undefined
          : variant === "count"
            ? `Save ${label}, ${formatNumber(total)} ${total === 1 ? "save" : "saves"}`
            : `Save ${label}`
      }
      className={cn(FORMS[variant], className)}
      {...props}
    >
      {heart}
      {variant === "count" ? <span aria-hidden="true">{compact.format(total)}</span> : null}
      {variant === "pill" ? (
        <>
          {/* Both words stand in one cell and the one not in use is hidden,
              so the pill keeps the longer one's width and nothing beside it
              moves when the label changes. */}
          <span className="grid">
            <span className={cn("col-start-1 row-start-1", saved && "invisible")}>Save</span>
            <span className={cn("col-start-1 row-start-1", !saved && "invisible")}>Saved</span>
          </span>
          <span className="sr-only">{label}</span>
        </>
      ) : null}
    </Toggle>
  );
}

export { SaveToggle, type SaveToggleProps };
