// Skeleton — the resting shape of content still on its way: a block on the muted rung with a slow pulse that stops under reduced motion.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Drawn in the shape of what it stands for — the photograph's frame, a line of
// the title, the host's face — so nothing moves when the content lands. On the
// muted rung, the one the style keeps for resting rows, so it reads as the
// page waiting rather than as a grey box; the pulse is the stock two seconds,
// opacity alone, and under reduced motion the block simply rests.
//
// A skeleton is hidden from screen readers. The region it fills says it is
// loading instead — `aria-busy` on the region and one line of `sr-only` text —
// so a reader hears "Loading stays" once, not a list of empty boxes.
const skeletonVariants = cva("block bg-muted motion-safe:animate-pulse", {
  variants: {
    shape: {
      // A frame, a card, a panel: the caller gives it the radius of what it
      // stands for.
      block: "rounded-sm",
      // A line of text, set a little under the line's height.
      line: "h-3.5 rounded-full",
      // A face, an icon disc.
      circle: "aspect-square rounded-full",
    },
  },
  defaultVariants: { shape: "block" },
});

function Skeleton({
  shape,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof skeletonVariants>) {
  return (
    <span
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
