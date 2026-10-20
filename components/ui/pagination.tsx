// Pagination — the numbered pages of a result set: seven slots at most, the page on show marked, and the end arrows drawn disabled.
"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Numbers rather than an endless scroll, because a listing is a place a
// visitor comes back to: "the one on page two" is an instruction they can
// follow, and a scroll position is not. Scrolling the results back into view
// after a step belongs to the caller, in `onPageChange` — it knows where its
// results start.

/** 1 … 4 5 6 … 12. Past seven pages the row is always seven slots — the
 *  first page, the last, the page on show with its two neighbours, and a gap
 *  for each run left out — so its width holds still from page to page and the
 *  arrows never slide out from under the pointer. Near either end the window
 *  rests against it, and a gap always stands for two pages or more: a gap
 *  hiding one page would cost the same slot as printing it. */
export function pageSlots(page: number, count: number): (number | "gap")[] {
  const run = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (count <= 7) return run(1, count);
  if (page <= 4) return [...run(1, 5), "gap", count];
  if (page >= count - 3) return [1, "gap", ...run(count - 4, count)];
  return [1, "gap", page - 1, page, page + 1, "gap", count];
}

// One cell is 36px drawn and 40px reached, through a pseudo-element rather
// than padding, so the row stays as tight as the reference's while every cell
// still takes a finger.
const cellVariants = cva(
  "relative grid size-9 shrink-0 place-items-center rounded-control text-sm tabular-nums select-none press after:absolute after:-inset-0.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      kind: {
        page: "hover:bg-accent",
        // The page on show is the one cell on the row that is not a door, so
        // it is ink on the brand's chip tint rather than a filled disc — a
        // solid brand circle here would outweigh the primary action on every
        // card above it — and it answers neither hover nor press. A variant
        // of its own rather than a hover written over the page's, so there is
        // no second rule for the cascade to settle.
        current: "pointer-events-none bg-chip font-medium text-primary-ink",
        // The arrows rest on a hairline so the row has two ends a reader can
        // find; disabled at the first and last page, they keep their box, so
        // the row never shifts when one comes alive.
        step: "border border-border bg-card hover:bg-accent",
      },
    },
    defaultVariants: { kind: "page" },
  },
);

/** One cell of the row, for a pager laid out by hand. `aria-current="page"`
 *  is what marks the page on show, and it draws the cell that way too, so the
 *  look and what a screen reader hears cannot disagree. An arrow at its end
 *  stays focusable while disabled, so pressing it from the keyboard until the
 *  pages run out leaves focus on it rather than dropping it on the page. */
function PaginationButton({
  kind,
  className,
  focusableWhenDisabled = true,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof cellVariants>) {
  const current = props["aria-current"] === "page";
  return (
    <ButtonPrimitive
      data-slot="pagination-button"
      focusableWhenDisabled={focusableWhenDisabled}
      className={cn(cellVariants({ kind: current ? "current" : kind }), className)}
      {...props}
    />
  );
}

function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "Pagination",
  className,
}: {
  /** The page on show, counted from 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** The landmark's name, when a page holds more than one: "Review pages". */
  label?: string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const go = (n: number) => {
    const next = Math.min(pageCount, Math.max(1, n));
    if (next !== page) onPageChange(next);
  };

  return (
    <nav aria-label={label} data-slot="pagination" className={cn("flex items-center justify-center gap-1.5", className)}>
      <PaginationButton
        kind="step"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => go(page - 1)}
      >
        <ChevronLeftIcon aria-hidden className="rtl:-scale-x-100" />
      </PaginationButton>

      {/* Seven numbers and two arrows run 372px, more than a 320px phone has
          inside its gutters, so under `sm` the numbers give way to where the
          reader is — the arrows still step, and every page stays one press
          from the next. */}
      <ol data-slot="pagination-pages" className="flex items-center gap-1.5 max-sm:hidden">
        {pageSlots(page, pageCount).map((slot, i) =>
          slot === "gap" ? (
            <li
              key={`gap-${i}`}
              aria-hidden="true"
              className="grid size-9 place-items-center text-sm text-muted-foreground"
            >
              &hellip;
            </li>
          ) : (
            <li key={slot}>
              <PaginationButton
                aria-label={`Page ${slot}`}
                aria-current={slot === page ? "page" : undefined}
                onClick={() => go(slot)}
              >
                {slot}
              </PaginationButton>
            </li>
          ),
        )}
      </ol>
      <p data-slot="pagination-status" className="px-3 text-sm sm:hidden">
        Page <span className="font-medium tabular-nums">{page}</span>{" "}
        <span className="text-muted-foreground">
          of <span className="tabular-nums">{pageCount}</span>
        </span>
      </p>

      <PaginationButton
        kind="step"
        disabled={page >= pageCount}
        aria-label="Next page"
        onClick={() => go(page + 1)}
      >
        <ChevronRightIcon aria-hidden className="rtl:-scale-x-100" />
      </PaginationButton>
    </nav>
  );
}

export { Pagination, PaginationButton, cellVariants as paginationButtonVariants };
