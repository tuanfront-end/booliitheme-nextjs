// LinkCard — a card that goes to one page and presses across its whole face: the title's link stretched over it, its own controls standing above.
import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A stay, a course, an event: a card whose job is "go to this item" is one
// target. One link carries the card's name — `LinkCardLink`, round the title —
// and its ::after stretches over the whole card, so the photograph, the meta
// line and the empty space all open the page, and a screen reader hears the
// title once rather than every line the card holds.
//
// Anything else the card does — save, compare, a host's profile — is its own
// control and stands above that layer with `relative z-10`. Anything else
// positioned that comes after the link in the source sits above it too and
// takes the click, so a positioned element belongs before the link or carries
// a link of its own.
//
// The card answers as one thing. Resting, it is a white card on a hairline.
// Pointed at, it lifts — the soft shadow's diffusion without its 1px ring,
// which would draw a second line over the hairline — and its photograph leans
// in. Pressed, a veil one rung deep comes over the whole face, photograph
// included, and the lift drops. Tabbed to, it lifts the same way and the ring
// goes round the card rather than round the title's words.
//
// The size sets the card's corner and how far in the photograph sits, as two
// custom properties the media and the link read, so the photo's corner is
// always the card's less that inset and the two stay concentric. The hairline
// is an inset ring rather than a border, so the inset is measured from the
// card's true edge. A card under about 240px wide is `sm`.
const linkCardVariants = cva(
  [
    "group/card relative flex flex-col rounded-(--link-card-radius) bg-card ring-1 ring-border ring-inset transition-shadow",
    "hover:shadow-[0_1px_2px_oklch(var(--shadow-ink)/calc(0.04*var(--shadow-depth))),0_8px_20px_-8px_oklch(var(--shadow-ink)/calc(0.07*var(--shadow-depth)))]",
    "has-[[data-slot=link-card-link]:focus-visible]:shadow-[0_1px_2px_oklch(var(--shadow-ink)/calc(0.04*var(--shadow-depth))),0_8px_20px_-8px_oklch(var(--shadow-ink)/calc(0.07*var(--shadow-depth)))]",
    "has-[[data-slot=link-card-link]:active]:shadow-none",
  ],
  {
    variants: {
      size: {
        default: "[--link-card-inset:0.375rem] [--link-card-radius:var(--radius-lg)]",
        sm: "[--link-card-inset:0.25rem] [--link-card-radius:var(--radius-md)]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function LinkCard({
  className,
  size,
  ...props
}: React.ComponentProps<"article"> & VariantProps<typeof linkCardVariants>) {
  return <article data-slot="link-card" className={cn(linkCardVariants({ size }), className)} {...props} />;
}

/** The photograph's frame, set in from the card's top and sides — 6px, 4px on
 *  a small card — and rounded on all four corners to the card's radius less
 *  that inset. The image leans in while the card is pointed at and settles
 *  back while it is held — written as a transform, the property the hover
 *  check reads, where Tailwind's scale utility writes `scale`. `isolate`
 *  keeps Safari clipping the corners while the image scales. */
function LinkCardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="link-card-media"
      className={cn(
        "relative isolate mx-(--link-card-inset) mt-(--link-card-inset) aspect-[4/3] overflow-hidden rounded-[calc(var(--link-card-radius)-var(--link-card-inset))] bg-muted",
        "[&_img]:transition-transform [&_img]:duration-sheet [&_img]:ease-arrive group-active/card:[&_img]:duration-answer",
        "motion-safe:group-hover/card:[&_img]:[transform:scale(1.04)] motion-safe:group-active/card:[&_img]:[transform:scale(1)]",
        className,
      )}
      {...props}
    />
  );
}

/** The card's one link, round its title. Never `relative` itself: the overlay
 *  has to anchor to the card, not to the words. */
function LinkCardLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      data-slot="link-card-link"
      className={cn(
        "outline-hidden after:absolute after:inset-0 after:rounded-[var(--link-card-radius,var(--radius-lg))] after:transition-colors after:content-['']",
        "active:after:bg-foreground/5",
        "focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export { LinkCard, LinkCardLink, LinkCardMedia, linkCardVariants };
