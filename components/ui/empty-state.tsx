// EmptyState — what a list shows when there is nothing in it: a glyph, what emptied it, what to do, and the actions that bring results back.
import * as React from "react";
import { MonocleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";

// The first screen a filter that matched nothing shows, so it is a designed
// one rather than a line of grey text: a glyph on a white disc, one line
// saying what happened, one saying what to do, and the page's own controls
// under them.
//
// Its action leads to results. "Remove Pets allowed" when dropping that one
// filter brings fourteen stays back, never a "Try again" that lands on the
// same empty grid — and the filters and sort that act on nothing are not
// drawn beside it at all.
function EmptyState({
  icon = MonocleIcon,
  title,
  text,
  titleAs: Title = "h3",
  className,
  children,
}: {
  /** The house's glyph is the monocle — looked closely, found nothing. Pass
   *  another HugeIcons glyph only where the list has a truer one. */
  icon?: IconSvgElement;
  /** What emptied the list, in one line. */
  title: string;
  /** What to do about it, in one or two. */
  text: string;
  /** The heading level the page's outline needs here. */
  titleAs?: "h2" | "h3" | "h4";
  className?: string;
  /** The actions, set centred under the text. */
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center rounded-lg bg-accent px-6 py-16 text-center sm:py-20",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-card shadow-soft">
        <HugeiconsIcon icon={icon} size={24} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <Title className="mt-6 text-xl font-medium tracking-tight text-balance">{title}</Title>
      <p className="mt-2 max-w-md text-base text-muted-foreground">{text}</p>
      {children && (
        <div data-slot="empty-state-actions" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
