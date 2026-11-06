import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// The page's one column. Header, every section and the footer stand in it, so
// their start edges line up down the whole page the way a single sheet does.
// The outer box is the site's container; the inner one gives up a column and
// its gap on each side from `lg`, so the column runs from the second line of
// the twelve to the eleventh and every row inside it lands on the grid.
type ColumnProps = ComponentProps<"div"> & {
  as?: "div" | "section" | "header" | "footer" | "nav";
  /** The inner box, the one the content lays out in. */
  innerClassName?: string;
};

export function Column({ as: Tag = "div", className, innerClassName, children, ...props }: ColumnProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-6 sm:px-8", className)} {...props}>
      <div className={cn("lg:mx-[calc((100%+var(--column-gap))/12)]", innerClassName)}>{children}</div>
    </Tag>
  );
}
