// Accordion — a list of questions that open one answer at a time, ruled by hairlines or with the open row on a tint, numbered when the order means something.
"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

// Two dresses, one keyboard model.
//
// `line` is a ruled list: rows split by hairlines, the trigger's hover ground
// bleeding 16px past the column on each side so the hairlines stay on the
// column's edges, and a chevron that turns. `tint` drops the rules and lets the
// open row carry the ground instead — the closed rows a step apart, the plus
// in its disc turning into a close mark — for a column that sits beside a
// photograph rather than on its own.
//
// The open panel's answer stays in the page while it is closed
// (`hiddenUntilFound`), so the browser's find-in-page opens the row that holds
// the match, and a crawler reads every answer.
type Tone = "line" | "tint";

const AccordionContext = React.createContext<{ tone: Tone; numbered: boolean }>({
  tone: "line",
  numbered: false,
});

function Accordion({
  tone = "line",
  numbered = false,
  hiddenUntilFound = true,
  className,
  ...props
}: AccordionPrimitive.Root.Props & {
  tone?: Tone;
  /** 01, 02, 03 before each question, for a list whose order is a sequence. */
  numbered?: boolean;
}) {
  const value = React.useMemo(() => ({ tone, numbered }), [tone, numbered]);
  return (
    <AccordionContext.Provider value={value}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-tone={tone}
        hiddenUntilFound={hiddenUntilFound}
        className={cn(
          // The numbers are a CSS counter rather than a prop, so they are in
          // the first paint, before Base UI has counted its items, and a row
          // added or removed renumbers the rest by itself.
          "[counter-reset:accordion]",
          tone === "line" ? "divide-y divide-border" : "flex flex-col gap-1",
          className,
        )}
        {...props}
      />
    </AccordionContext.Provider>
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  const { tone } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group/item [counter-increment:accordion]",
        // The open row owns the ground in `tint`; a closed row only shows one
        // under the pointer, through its trigger.
        tone === "tint" && "rounded-lg transition-colors data-open:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  const { tone, numbered } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="text-base font-medium">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={(state) =>
          cn(
            // A row is larger than a control, so a press moves its ground one
            // rung below its hover rather than shrinking it.
            "group/trigger relative flex w-full items-center text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:text-muted-foreground",
            tone === "line" &&
              "-mx-4 w-[calc(100%+2rem)] gap-5 rounded-sm px-4 py-5 hover:bg-accent active:bg-muted",
            // On a phone the tinted row pads 16, the house's second-layer
            // number, so a card on the page keeps its words a line wide.
            tone === "tint" && "gap-4 rounded-lg p-4 sm:gap-6 sm:p-6",
            // In `tint` the hover is chosen by the row's state rather than
            // written twice for the cascade to settle. A closed row lightens to
            // half the open row's ground, so hover never reads as open; the
            // open row keeps its ground and answers through its disc, and its
            // press takes the rung under the row's own.
            tone === "tint" &&
              (state.open ? "active:bg-muted" : "hover:bg-accent/60 active:bg-accent"),
            typeof className === "function" ? className(state) : className,
          )
        }
        {...props}
      >
        {numbered && (
          // aria-hidden: the number marks the order for the eye; read aloud,
          // "zero one" would open every question's name.
          <span
            aria-hidden="true"
            className="w-6 shrink-0 text-sm text-muted-foreground tabular-nums before:content-[counter(accordion,decimal-leading-zero)] group-data-panel-open/trigger:text-primary-ink"
          />
        )}
        <span className="min-w-0 flex-1 text-foreground">{children}</span>
        {tone === "line" ? (
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-answer ease-answer group-data-panel-open/trigger:rotate-180 motion-reduce:transition-none"
          />
        ) : (
          // One disc, one glyph: the close mark is the plus turned 45 degrees,
          // the same drawing, so nothing on the row is swapped at the moment
          // of the press. Closed, the disc stops painting its own tint under a
          // hovered row — an alpha over the same alpha composites darker — and
          // open, it is a white disc on the row's ground that lifts on hover.
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-accent transition-[background-color,box-shadow] group-hover/trigger:bg-transparent group-data-panel-open/trigger:bg-card group-data-panel-open/trigger:shadow-soft group-data-panel-open/trigger:group-hover/trigger:bg-card group-data-panel-open/trigger:group-hover/trigger:shadow-soft-lg"
          >
            <HugeiconsIcon icon={Add01Icon} aria-hidden="true" className="size-4 transition-transform duration-answer ease-answer group-data-panel-open/trigger:rotate-45 motion-reduce:transition-none" />
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  const { tone, numbered } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      // The page's reduced-motion rule shortens every animation to 0.01ms
      // rather than removing it, and Base UI reads any non-zero duration as a
      // second animation beside the height transition. Zero here leaves it only
      // the transition, which reduced motion takes away.
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-answer ease-answer data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none motion-reduce:[animation-duration:0s]!"
      {...props}
    >
      <div
        data-slot="accordion-answer"
        className={cn(
          "max-w-prose text-base text-muted-foreground",
          // The answer starts under its question and stops short of the
          // chevron or the disc, so it never runs under the control: the
          // glyph's width plus the gap before it, and in `tint` the row's own
          // padding as well. On a phone the tinted answer takes the width the
          // disc leaves on the row below it, rather than a column of white.
          tone === "line" && "pe-9 pb-5",
          tone === "line" && numbered && "ps-11",
          tone === "tint" && "ps-4 pe-4 pb-4 sm:ps-6 sm:pe-21 sm:pb-6",
          tone === "tint" && numbered && "ps-14 sm:ps-18",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel };
