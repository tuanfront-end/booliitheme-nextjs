import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// The heading that opens a section: 30px on a phone, 36 from `sm`, 48 from
// `lg`. One role at three widths, so it is written once — a size ladder copied
// into every section is the one that loses its top step in the fifth.
//
// `tracking-tighter` at all three, 30px included: a responsive heading takes
// the tracking of its largest step. No weight at any of them, because from
// `text-3xl` up the size is the emphasis. A caller passes position, width and
// alignment through `className`; a heading that needs a different size is a
// different role, not this one.
type SectionHeadingProps = ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  as: Tag = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "text-3xl tracking-tighter sm:text-4xl lg:text-5xl",
        className,
      )}
      {...props}
    />
  );
}
