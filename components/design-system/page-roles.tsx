import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";

// The parts every section repeats, drawn together: a section takes its opening
// from these four and nothing else, so a change to one reaches every page. The
// words are this template's own, rewritten in its voice at stop 2.
const SAMPLE = {
  eyebrow: "How it works",
  heading: "Three steps from browsing to booked",
  lede: "Pick what you want, choose a time that suits you, and pay once you are sure. Nothing is charged until you confirm the dates and the price.",
  primary: "Start browsing",
  secondary: "See how booking works",
  cards: [
    { title: "Search by what matters", blurb: "Filter by date, price and distance, and keep the ones you like." },
    { title: "Book in two taps", blurb: "Pick a time that suits you; nothing is charged until you confirm." },
    { title: "Change your mind", blurb: "Plans move. Free cancellation up to a day before keeps it simple." },
  ],
};

export function PageRoles() {
  return (
    <DsBlock
      id="page-roles"
      title="Page roles"
      when="a section opens: the same four parts on every page, and a card is one link."
      source="components/site · Eyebrow, SectionHeading, Lede"
    >
      <Specimen className="bg-background sm:p-10">
        <div className="max-w-2xl">
          <Eyebrow>{SAMPLE.eyebrow}</Eyebrow>
          <SectionHeading as="h3" className="mt-4">
            {SAMPLE.heading}
          </SectionHeading>
          <Lede className="mt-6 max-w-xl">{SAMPLE.lede}</Lede>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="#page-roles" />}>
              {SAMPLE.primary}
              <ArrowRightIcon aria-hidden data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
            <Button variant="secondary" render={<Link href="#page-roles" />}>
              {SAMPLE.secondary}
            </Button>
          </div>
        </div>
        {/* Peers that each go to a page: one target apiece, the title's link
            stretched over the card, the arrow drawn as part of it. */}
        <ul className="mt-head grid grid-cols-1 gap-4 md:grid-cols-3">
          {SAMPLE.cards.map((card) => (
            <li
              key={card.title}
              className="group relative flex flex-col rounded-lg bg-card p-6 transition-colors hover:bg-accent active:bg-muted"
            >
              <h4 className="text-xl font-medium tracking-tight">
                <Link
                  href="#page-roles"
                  className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
                >
                  {card.title}
                </Link>
              </h4>
              <p className="mt-2 text-base text-muted-foreground">{card.blurb}</p>
              <ArrowRightIcon
                aria-hidden
                className="mt-8 size-5 text-muted-foreground transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </li>
          ))}
        </ul>
      </Specimen>
    </DsBlock>
  );
}
