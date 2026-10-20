// Badge — a status or price chip, a hue's tint under its own ink on a card, a pastel surface or a photograph; and CountBadge, the count that rides a control's corner.
import type * as React from "react";

import { cn } from "@/lib/utils";

// The tone is the meaning and the ground is what the chip stands on.
//
// `brand` is the page's own hue through its chip token, for what the product
// means by colour: a guest favourite, a verified host. The seven accent colours
// are statuses and peers, leaf for done and coral for urgent; `neutral` is a
// role or a state that has run out, sold out or closed.
//
// - `card`, the default: on a white card or the page, the hue at /15 with its
//   ink. The ink is measured against that tint over the card, where amber runs
//   closest at 4.6.
// - `pastel`: on a tinted band or a pastel surface a /15 tint would be a tint
//   of a tint, so the chip turns white and keeps its hue in the ink alone.
// - `photo`: a translucent tint over a photograph cannot be read, so the
//   ground is the same tint made opaque, the hue mixed into the card colour in
//   sRGB so the ink keeps the contrast measured above, lifted on a cast.
export type BadgeTone = "brand" | "neutral" | "leaf" | "sun" | "coral" | "iris" | "lime" | "sky" | "peach";
export type BadgeGround = "card" | "pastel" | "photo";

// Written whole so Tailwind finds every utility.
const TONES: Record<BadgeGround, Record<BadgeTone, string>> = {
  card: {
    brand: "bg-chip text-primary-ink",
    neutral: "bg-foreground/6 text-muted-foreground",
    leaf: "bg-leaf/15 text-leaf-ink",
    sun: "bg-sun/15 text-sun-ink",
    coral: "bg-coral/15 text-coral-ink",
    iris: "bg-iris/15 text-iris-ink",
    lime: "bg-lime/15 text-lime-ink",
    sky: "bg-sky/15 text-sky-ink",
    peach: "bg-peach/15 text-peach-ink",
  },
  pastel: {
    brand: "bg-card text-primary-ink",
    neutral: "bg-card text-muted-foreground",
    leaf: "bg-card text-leaf-ink",
    sun: "bg-card text-sun-ink",
    coral: "bg-card text-coral-ink",
    iris: "bg-card text-iris-ink",
    lime: "bg-card text-lime-ink",
    sky: "bg-card text-sky-ink",
    peach: "bg-card text-peach-ink",
  },
  photo: {
    brand: "bg-[color-mix(in_srgb,var(--primary)_var(--chip-alpha),var(--card))] text-primary-ink shadow-soft",
    neutral: "bg-muted text-muted-foreground shadow-soft",
    leaf: "bg-[color-mix(in_srgb,var(--leaf)_15%,var(--card))] text-leaf-ink shadow-soft",
    sun: "bg-[color-mix(in_srgb,var(--sun)_15%,var(--card))] text-sun-ink shadow-soft",
    coral: "bg-[color-mix(in_srgb,var(--coral)_15%,var(--card))] text-coral-ink shadow-soft",
    iris: "bg-[color-mix(in_srgb,var(--iris)_15%,var(--card))] text-iris-ink shadow-soft",
    lime: "bg-[color-mix(in_srgb,var(--lime)_15%,var(--card))] text-lime-ink shadow-soft",
    sky: "bg-[color-mix(in_srgb,var(--sky)_15%,var(--card))] text-sky-ink shadow-soft",
    peach: "bg-[color-mix(in_srgb,var(--peach)_15%,var(--card))] text-peach-ink shadow-soft",
  },
};

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: BadgeTone;
  ground?: BadgeGround;
  /** A dot in the chip's own ink before the label, for a live state: open now, available tonight. */
  dot?: boolean;
};

/** Information, never a button: no hover, no press, the same shape everywhere.
 *  Size and position stay with the caller. A glyph inside takes 12px at a
 *  stroke of 2, where 1.5 goes faint. */
function Badge({ tone = "neutral", ground = "card", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums [&_svg]:size-3 [&_svg]:shrink-0",
        TONES[ground][tone],
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

// A count of what is set, how many filters narrow a list or how many messages
// are unread, overhangs the corner of a `relative` control instead of sitting
// in its label, so the label stays centred and the control keeps its width when
// the count goes from 9 to 12. 20px, with a 2px ring in the ground behind the
// control so the disc reads as a count on it and not a notch out of it:
// `ring-background` on the page by default, `ring-card` inside a card,
// `ring-accent` on a tinted band. A rail of these goes to `gap-3`, or one
// chip's count lands on the next.
//
// Hidden from screen readers: the count belongs in the control's own name,
// "Filters, 3 applied". At zero nothing is set and nothing is drawn.
const COUNT = {
  brand: "bg-primary text-primary-foreground",
  /** On a control already filled with the brand. */
  onBrand: "bg-card text-primary-ink",
};

function CountBadge({
  count,
  max = 99,
  tone = "brand",
  className,
}: {
  count: number;
  /** Past this the badge reads "99+" rather than growing past its disc. */
  max?: number;
  tone?: keyof typeof COUNT;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      data-slot="count-badge"
      className={cn(
        "pointer-events-none absolute -top-1.5 -inset-e-1.5 flex h-5 min-w-5 items-center justify-center rounded-control px-1 text-xs font-medium tabular-nums ring-2 ring-background",
        COUNT[tone],
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

export { Badge, CountBadge, type BadgeProps };
