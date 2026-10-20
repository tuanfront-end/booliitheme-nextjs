import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// The paragraph under a section's heading: body copy at the body size, in the
// muted ink. `text-lg` is the drift this holds off — 18 beside 16 is a wobble
// nobody sees, and it spends one of the section's sizes. A page role, so it is
// a component before the first section is built.
//
// A caller passes position, width and alignment through `className`: a lede's
// measure is the section's to choose, `max-w-xl` under a heading that runs the
// container and less beside a picture.
export function Lede({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-base text-muted-foreground", className)} {...props} />
  );
}
