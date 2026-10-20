import type { ReactNode } from "react";

import { BlockHeading, NestedBlocks } from "@/components/design-system/block-heading";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

// A part of the sheet — Foundations, Components — opened by the page roles the
// rest of the site opens its sections with, so the sheet is drawn in the
// system it documents.
export function DsGroup({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionHeading id={`${id}-title`} className="mt-3 max-w-[18ch]">
        {title}
      </SectionHeading>
      <Lede className="mt-4 max-w-2xl">{lede}</Lede>
      <div className="mt-head flex flex-col gap-20">{children}</div>
    </section>
  );
}

// A run of components inside a part — actions, fields, dates — opened by a
// hairline and its name as a small heading, so a part forty blocks long reads
// in chapters. The blocks inside take the heading level under it.
export function DsSubgroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <Eyebrow as="h3" id={`${id}-title`} className="border-t border-border pt-5">
        {title}
      </Eyebrow>
      <NestedBlocks>
        <div className="mt-12 flex flex-col gap-20">{children}</div>
      </NestedBlocks>
    </section>
  );
}

// A block's head: its name, the file a buyer opens to change it, and the
// line under them.
function BlockHead({ id, title, source, children }: { id: string; title: string; source?: string; children: ReactNode }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <BlockHeading id={`${id}-title`}>{title}</BlockHeading>
        {source ? (
          <code className="font-mono text-xs text-muted-foreground">{source}</code>
        ) : null}
      </div>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">{children}</p>
    </>
  );
}

// One token family: a title, a line on what it holds, and the specimen.
export function DsTokens({
  id,
  title,
  note,
  source,
  children,
  className,
}: {
  id: string;
  title: string;
  note: string;
  source?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <BlockHead id={id} title={title} source={source}>
        {note}
      </BlockHead>
      <div className={cn("mt-6", className)}>{children}</div>
    </section>
  );
}

const ROWS = [
  ["variants", "Variants"],
  ["sizes", "Sizes"],
  ["states", "States"],
  ["edges", "Edge cases"],
] as const;

type Rows = Partial<Record<(typeof ROWS)[number][0], ReactNode>>;

// One component, in the frame every block on the sheet shares, so a buyer and
// a buyer's agent read any of them the same way: what it is for before what
// it looks like. Three parts are required — the name, the line that finishes
// "Use it when", and one typical use as the children. The rest are optional
// and always drawn in this order under these labels, and a block draws only
// the rows it has:
//
// - `variants` — the forms the states row does not already show: a ground, a
//   glyph, a tone.
// - `sizes` — each height, captioned with its number.
// - `states` — a `StateGrid`, whose rows are the variants, so a block with
//   one names its variants there and draws no second row of them.
// - `edges` — where a control breaks: a long text, a missing photograph,
//   nothing to show. Drawn only on the controls that meet them.
export function DsBlock({
  id,
  title,
  when,
  source,
  children,
  className,
  ...rows
}: Rows & {
  id: string;
  title: string;
  /** Finishes "Use it when": the job first, then what tells it apart. */
  when: string;
  source?: string;
  /** The typical use. */
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <BlockHead id={id} title={title} source={source}>
        <span className="font-medium text-foreground">Use it when</span> {when}
      </BlockHead>
      <div className={cn("mt-6", className)}>{children}</div>
      {ROWS.map(([key, label]) =>
        rows[key] ? (
          <div key={key} role="group" aria-labelledby={`${id}-${key}`} className="mt-12">
            <p id={`${id}-${key}`} className="text-sm font-medium">
              {label}
            </p>
            <div className="mt-4">{rows[key]}</div>
          </div>
        ) : null,
      )}
    </section>
  );
}

// The ground a specimen sits on: the card, lifted off the page by its
// hairline, the way every card on the site is. A second layer inside the
// page's gutter, so on a phone it pads 16 at the sides rather than adding a
// desktop number to the gutter's 24.
export function Specimen({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card px-4 py-6 ring-1 ring-border ring-inset sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
