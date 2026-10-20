// ref: feature-sections/centred-heading-and-three-tab-cards-over-photo-left-copy-right.jpeg — centred-stack 3+split · bottom-heavy (departed: the pattern line heads the copy column as the platform switcher, which the reference has no slot for)
// opens: panel · light
"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { News01Icon, ServerStack01Icon, ShoppingBag01Icon, SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

import { BrowserFrame } from "@/components/site/browser-frame";
import { Eyebrow } from "@/components/site/eyebrow";
import { PatternLine } from "@/components/site/pattern-line";
import { SectionHeading } from "@/components/site/section-heading";
import { VersionChip } from "@/components/site/version-chip";
import { Button } from "@/components/ui/button";
import { RadioTiles } from "@/components/ui/radio-tiles";
import { alsoOn, buildLabel, familyName, joinList } from "@/lib/data/catalogue";
import { families, type Industry, type Platform, type Project } from "@/lib/data/projects";
import { hostOf } from "@/lib/format";
import { cn } from "@/lib/utils";

// What a buyer gets on each platform that the others do it differently:
// who runs the checkout, where the words are edited, what the pages read from.
const runs: Record<string, string> = {
  ciseco: "Next.js renders every page, cart and checkout from local demo data, ready to point at your own store API.",
  "ciseco-hydrogen": "Shopify runs checkout, payments and stock; Hydrogen draws the storefront from the Storefront API.",
  "ciseco-woocommerce": "WooCommerce runs the cart and checkout, and every page is edited in the Site Editor with blocks.",
  ncmaz: "Next.js renders posts from local demo data, ready to point at the CMS or API you already use.",
  "ncmaz-headless-wordpress": "WordPress keeps the editor and the posts; the Next.js front end reads them over GraphQL.",
  "ncmaz-wordpress": "Everything stays in WordPress: posts in the block editor, page layouts in the Site Editor.",
  bitpan: "Next.js renders every page, cart and checkout from local demo data, ready to point at your own store API.",
  "bitpan-woocommerce": "WooCommerce runs the cart and checkout, and every page is edited in the Site Editor with blocks.",
};

const glyph: Partial<Record<Industry, IconSvgElement>> = { ecommerce: ShoppingBag01Icon, magazine: News01Icon };

const order: Platform[] = ["nextjs", "shopify", "wordpress"];
const sets = families.map((f) => ({
  family: f.family,
  name: familyName(f.family),
  builds: f.builds
    .slice()
    .sort(
      (a, b) =>
        order.indexOf(a.platforms[0]) - order.indexOf(b.platforms[0]) || a.platforms.length - b.platforms.length,
    ),
}));

export function Families() {
  const [family, setFamily] = useState(sets[0].family);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const set = sets.find((s) => s.family === family)!;
  const at = picks[family] ?? 0;
  const p: Project = set.builds[at];

  return (
    <section id="families" aria-labelledby="families-title" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Families</Eyebrow>
        <SectionHeading id="families-title" className="mt-4 text-balance">
          One design, rebuilt by hand for each platform
        </SectionHeading>
      </div>

      <RadioTiles
        aria-label="Design family"
        layout="grid"
        from="sm"
        columns={3}
        mark={false}
        value={family}
        onValueChange={(v) => setFamily(v as typeof family)}
        className="mt-12"
        options={sets.map((s) => ({
          value: s.family,
          title: s.name,
          aside: `${s.builds.length} platforms`,
          icon: glyph[s.builds[0].industry],
          description: joinList(s.builds.map(buildLabel)),
        }))}
      />

      <div className="column-grid mt-10 gap-y-10 lg:mt-12">
        <div className="col-span-full lg:col-span-6">
          <a
            href={p.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="group/frame block rounded-md press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <BrowserFrame
              key={p.slug}
              shots={p.shots}
              url={p.demo}
              alt={`${p.name} demo, home page`}
              sizes="(min-width: 1024px) 592px, 100vw"
              aspect="aspect-[16/14]"
            />
            <span className="sr-only">Open the {p.name} live demo (opens in a new tab)</span>
          </a>
        </div>

        <div className="col-span-full flex flex-col lg:col-span-5 lg:col-start-8">
          <p className="text-sm text-muted-foreground">
            The same design on {set.builds.length}&nbsp;platforms
          </p>
          <PatternLine
            className="mt-2 max-w-sm"
            active={at}
            source={
              <span className="block rounded-control bg-muted px-3 py-1.5 text-sm font-medium">{set.name}</span>
            }
            branches={set.builds.map((b, i) => (
              <Button
                key={b.slug}
                size="sm"
                variant={i === at ? "default" : "outline"}
                aria-pressed={i === at}
                onClick={() => setPicks((all) => ({ ...all, [family]: i }))}
                aria-label={buildLabel(b)}
              >
                <span aria-hidden="true" className="sm:hidden">
                  {buildLabel(b).replace(/^(Shopify|Headless) (\w+)$/, (_, a, z) => (a === "Shopify" ? z : a))}
                </span>
                <span aria-hidden="true" className="max-sm:hidden">
                  {buildLabel(b)}
                </span>
              </Button>
            ))}
          />

          <h3 className="mt-6 text-2xl tracking-tight sm:text-3xl sm:tracking-tighter">{p.name}</h3>
          <p aria-live="polite" className="mt-3 min-h-[2lh] text-base text-balance text-muted-foreground">
            {p.tagline}, also on {alsoOn(p)}.
          </p>

          <dl className="mt-8 flex flex-col">
            {[
              { icon: ServerStack01Icon, term: "What runs where", detail: runs[p.slug] },
              {
                icon: SourceCodeIcon,
                term: "Versions",
                detail: (
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {p.stack.map((d) => (
                      <VersionChip key={d.name} dep={d} />
                    ))}
                  </span>
                ),
              },
            ].map((row, i) => (
              <div key={row.term} className={i ? "flex gap-4 border-t border-border pt-5" : "flex gap-4 pb-5"}>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-chip">
                  <HugeiconsIcon icon={row.icon} size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="font-medium">{row.term}</dt>
                  <dd className={cn("mt-0.5 text-base text-muted-foreground", !i && "min-h-[3lh] text-balance")}>{row.detail}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
            >
              Live demo
              <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
              <span className="sr-only">at {hostOf(p.demo)} (opens in a new tab)</span>
            </Button>
            <Button size="lg" variant="outline" render={<Link href={`/work/${p.slug}`} />} nativeButton={false}>
              Details<span className="sr-only"> of {p.name}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
