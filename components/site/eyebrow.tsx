import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// The line over a section's heading: 12px, capitals, the widest tracking, the
// muted ink. A page role, so it is a component before the first section is
// built — every builder writes its section alone and meets no second use, and
// twelve eyebrows typed by twelve hands are eleven alike and one not.
//
// A footer column or a menu group takes it as a small heading: `as="h2"`, or
// `as="span"` inside a control. A primitive that draws its own label — a menu's
// group label — takes `eyebrowClass` instead. A caller passes position,
// alignment and, on a pastel surface, the foreground ink through `className`;
// how an eyebrow looks on this template is decided here, once.
// A brand dot and two to four uppercase words in the brand's ink: the one
// place a section header spends the brand.
export const eyebrowClass =
  "inline-flex items-center gap-2 text-xs font-medium tracking-wider text-brand-ink uppercase before:size-1.5 before:shrink-0 before:rounded-full before:bg-brand before:content-['']";

type EyebrowProps = ComponentProps<"p"> & {
  as?: "p" | "span" | "h2" | "h3";
};

export function Eyebrow({ as: Tag = "p", className, ...props }: EyebrowProps) {
  return <Tag className={cn(eyebrowClass, className)} {...props} />;
}
