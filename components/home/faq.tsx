// ref: faqs/centred-heading-with-tabs-over-numbered-accordion.png — centred-stack 3-tab · top-heavy
// opens: panel · light
import type { ReactNode } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Segmented, SegmentedPanel } from "@/components/ui/segmented";
import { familyName, runs } from "@/lib/data/catalogue";

type Question = { q: string; a: ReactNode };

const inlineLink =
  "rounded-xs font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const groups: { value: string; label: string; questions: Question[] }[] = [
  {
    value: "general",
    label: "General",
    questions: [
      {
        q: "Which platform should I choose?",
        a: (
          <>
            The one the site will live on. Pick Shopify Hydrogen when the products and checkout sit in Shopify, a
            WordPress block theme when your client edits in the Site Editor, and Next.js when you write the front end
            and bring the data.
          </>
        ),
      },
      {
        q: "How do updates reach me?",
        a: (
          <>
            We publish each version on the template&apos;s ThemeForest page. Open Downloads in your Envato account,
            download the template again and compare it with your copy; the changelog on the item page lists what
            changed.
          </>
        ),
      },
      {
        q: "Can I see a template running before I buy?",
        a: (
          <>
            Yes. Every card in the catalog opens its live demo in a new tab, on the platform the template ships for,
            with the demo content it comes with.
          </>
        ),
      },
      {
        q: "Do you take custom work?",
        a: (
          <>
            Yes: a change to a template, a page it lacks, or one of our designs on a new platform.{" "}
            <a href="#contact" className={inlineLink}>
              Tell us the template and the job
            </a>
            , and we reply with a quote.
          </>
        ),
      },
    ],
  },
  {
    value: "platforms",
    label: "Platforms",
    questions: [
      {
        q: "Headless WordPress or a block theme?",
        a: (
          <>
            {familyName("ncmaz")} ships as both. The block theme keeps everything in WordPress, on any WordPress host.
            The headless build keeps WordPress for writing and serves the site from Next.js over GraphQL, so you run two
            apps and a Node host.
          </>
        ),
      },
      {
        q: "Does Shopify Hydrogen need a Shopify plan?",
        a: (
          <>
            Yes. {runs["ciseco-hydrogen"]} The store needs a paid Shopify plan; the storefront can run on Shopify&apos;s
            Oxygen hosting or on any other Node host.
          </>
        ),
      },
      {
        q: "Do the Next.js templates come with a backend?",
        a: (
          <>
            No. Each one renders every page from local demo data, laid out so you can point it at the store API, CMS or
            headless backend your client already uses.
          </>
        ),
      },
    ],
  },
  {
    value: "license",
    label: "License",
    questions: [
      {
        q: "Can I build a client's site with one purchase?",
        a: (
          <>
            Yes, on a Regular license: one site, for you or one client, and you can charge the client for your work. A
            second client&apos;s site needs a second license.
          </>
        ),
      },
      {
        q: "When do I need the Extended license?",
        a: (
          <>
            When the people using the product pay for it: a subscription, a paid membership, a SaaS. Each
            template&apos;s item page lists its Extended price.
          </>
        ),
      },
      {
        q: "How long does support last?",
        a: (
          <>
            6&nbsp;months from your purchase, through the Support tab on the item page. Extend it to 12&nbsp;months on
            ThemeForest; updates keep coming after support ends.
          </>
        ),
      },
      {
        q: "Can I get a refund?",
        a: (
          <>
            Refunds follow Envato&apos;s refund policy, and Envato decides them. Write to us on the item page first, so
            we can fix what broke before you ask for one.
          </>
        ),
      },
    ],
  },
];

// The objections left after the catalogue, the license and the release log:
// three tabs over one numbered accordion each, its first answer open. The
// answers are short paragraphs; the one that asks for work links down to the
// contact form.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <SectionHeading id="faq-title" className="mx-auto max-w-2xl text-center text-balance">
        Before you buy: platforms, updates and licenses
      </SectionHeading>

      <Segmented
        kind="tabs"
        variant="brand"
        aria-label="Question topics"
        options={groups.map(({ value, label }) => ({ value, label }))}
        defaultValue="general"
        className="mt-10 items-center"
      >
        {groups.map((g) => (
          <SegmentedPanel key={g.value} value={g.value} className="mt-8 w-full max-w-2xl sm:mt-10">
            <Accordion numbered defaultValue={[`${g.value}-0`]}>
              {g.questions.map((item, i) => (
                <AccordionItem key={item.q} value={`${g.value}-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionPanel>{item.a}</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </SegmentedPanel>
        ))}
      </Segmented>
    </section>
  );
}
