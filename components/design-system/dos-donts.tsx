// DosDonts — the house rules a build breaks most often, each drawn with the kit beside the way a build gets it wrong.
import type { ReactNode } from "react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { BlockHeading } from "@/components/design-system/block-heading";
import { Specimen } from "@/components/design-system/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RadioTiles } from "@/components/ui/radio-tiles";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Every Don't here breaks a rule on purpose, which is why they live in this
// one file: the checkers that would name them skip it by its name, and every
// other file is still held to the rule. Each wrong drawing is an illustration
// rather than a control — hidden from screen readers, out of the tab order —
// and wears a visible "Don't", so neither a buyer nor an agent reading the
// sheet takes it for something to copy. The caption under it says in words
// what the drawing shows.

const SORT = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price, low to high" },
  { value: "rating", label: "Guest rating" },
];

const RATES = [
  { value: "flexible", title: "Free cancellation", aside: "$206" },
  { value: "saver", title: "Non-refundable", aside: "$184" },
];

function Verdict({ good }: { good: boolean }) {
  return (
    <Badge tone={good ? "leaf" : "coral"}>
      <HugeiconsIcon icon={good ? Tick02Icon : Cancel01Icon} strokeWidth={2} aria-hidden="true" />
      {good ? "Do" : "Don't"}
    </Badge>
  );
}

function Side({ good, note, children }: { good: boolean; note: string; children: ReactNode }) {
  return (
    <Specimen className="flex flex-col gap-6">
      <Verdict good={good} />
      {good ? (
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      ) : (
        <div aria-hidden="true" inert className="flex flex-1 flex-col justify-center">
          {children}
        </div>
      )}
      <p className="text-sm text-muted-foreground">{note}</p>
    </Specimen>
  );
}

function Pair({
  id,
  rule,
  good,
  bad,
}: {
  id: string;
  rule: string;
  good: { note: string; drawing: ReactNode };
  bad: { note: string; drawing: ReactNode };
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <BlockHeading id={`${id}-title`}>{rule}</BlockHeading>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Side good note={good.note}>
          {good.drawing}
        </Side>
        <Side good={false} note={bad.note}>
          {bad.drawing}
        </Side>
      </div>
    </section>
  );
}

// ── 1. The kit's Select as it comes ─────────────────────────────────────

function SortBar({ reshaped = false }: { reshaped?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-base">
        <span className="font-medium tabular-nums">248</span>
        <span className="text-muted-foreground"> stays</span>
      </p>
      <Select items={SORT} defaultValue="recommended">
        {reshaped ? (
          <SelectTrigger className="w-auto gap-2">
            <span className="text-muted-foreground">Sort by</span>
            <SelectValue />
          </SelectTrigger>
        ) : (
          <SelectTrigger aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
        )}
        <SelectContent label="Sort by" align="end">
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {SORT.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

// ── 2. The pick frame ───────────────────────────────────────────────────

/** The kit's tile, drawn by hand so its frame can be the wrong one. */
function WrongTiles() {
  return (
    <ul className="flex flex-col gap-3">
      {RATES.map((r, i) => (
        <li
          key={r.value}
          data-checked={i === 0 ? "" : undefined}
          className="flex items-baseline justify-between gap-4 rounded-sm bg-card p-4 text-sm ring-1 ring-border ring-inset data-checked:ring-1 data-checked:ring-primary"
        >
          <span className="font-medium">{r.title}</span>
          <span className="tabular-nums">{r.aside}</span>
        </li>
      ))}
    </ul>
  );
}

// ── 3. Where the brand goes ─────────────────────────────────────────────

function Listing({ loud = false }: { loud?: boolean }) {
  const chip = loud ? "rounded-control bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground" : "";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {loud ? (
          <>
            <span className={chip}>Guest favourite</span>
            <span className={chip}>Free cancellation</span>
          </>
        ) : (
          <>
            <Badge tone="brand">Guest favourite</Badge>
            <Badge tone="neutral">Free cancellation</Badge>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-base font-medium">Fireside loft in Alfama</p>
          <p className="mt-1 text-sm">
            {loud ? (
              <span className={chip}>$180 / night</span>
            ) : (
              <Price amount={180} per="night" />
            )}
          </p>
        </div>
        <Button>Reserve</Button>
      </div>
    </div>
  );
}

// ── 4. Depth from tint ──────────────────────────────────────────────────

const CHARGES: [string, number][] = [
  ["Three nights", 540],
  ["Cleaning", 45],
  ["Service fee", 62],
];

function Charges({ heavy = false }: { heavy?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md p-3",
        heavy ? "border border-border bg-card shadow-soft" : "bg-accent",
      )}
    >
      {CHARGES.map(([what, amount]) => (
        <div
          key={what}
          className={cn(
            "flex items-baseline justify-between gap-4 rounded-sm px-4 py-3 text-sm",
            heavy ? "border border-border bg-card shadow-soft" : "bg-card",
          )}
        >
          <span className="text-muted-foreground">{what}</span>
          <Price amount={amount} />
        </div>
      ))}
    </div>
  );
}

export function DosDonts() {
  return (
    <>
      <Pair
        id="dont-reshape"
        rule="Take the Select as the kit gives it, and dress it by a variant"
        good={{
          note: "The outline select at its own width. Its name goes to a screen reader in aria-label.",
          drawing: <SortBar />,
        }}
        bad={{
          note: "Squeezed with w-auto gap-2 and a label typed before the value, it matches no other select on the site.",
          drawing: <SortBar reshaped />,
        }}
      />
      <Pair
        id="dont-frame"
        rule="A pick is a 2px frame inside the tile, in the brand's ink"
        good={{
          note: "The kit's tile: a 2px frame in the brand's ink, which reads at 3:1 on any brand, and no tint under it.",
          drawing: (
            <RadioTiles
              aria-label="Choose a rate"
              name="dos-rate"
              defaultValue="flexible"
              options={RATES.map((r) => ({ value: r.value, title: r.title, aside: r.aside }))}
            />
          ),
        }}
        bad={{
          note: "A 1px frame in the bright fill falls under 3:1 on a light brand, and the pick goes missing.",
          drawing: <WrongTiles />,
        }}
      />
      <Pair
        id="dont-brand"
        rule="The brand goes on the primary action and a chosen state"
        good={{
          note: "One solid fill, on the button that books. The chip is the brand's tint under its ink.",
          drawing: <Listing />,
        }}
        bad={{
          note: "The brand's solid fill on every chip and the price: nothing leads, so the button stops leading.",
          drawing: <Listing loud />,
        }}
      />
      <Pair
        id="dont-lines"
        rule="Part surfaces by one step of tint, never by a border and a shadow"
        good={{
          note: "The rows sit on a well one step below the card, and the tint is the only cue.",
          drawing: <Charges />,
        }}
        bad={{
          note: "A hairline and a shadow on every box: two cues for one edge, and the card turns heavy.",
          drawing: <Charges heavy />,
        }}
      />
    </>
  );
}
