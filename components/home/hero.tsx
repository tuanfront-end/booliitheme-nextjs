import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { HeroFigure } from "@/components/home/hero-figure";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";
import { author, projects } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";

const since = author.since.slice(0, 4);
// Who we are and what we do, anchored low on the start side; across from it a
// website half-built in 0s and 1s, on a sheet of graph paper. Below the actions, the
// portfolio's real figures in mono.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Graph paper: a 24px grid in a faint line, every fifth line a step
          firmer, fading out at the foot so the sheet ends before the next
          section. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px)",
            "linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px)",
            "linear-gradient(to right, color-mix(in oklab, var(--border) 35%, transparent) 1px, transparent 1px)",
            "linear-gradient(to bottom, color-mix(in oklab, var(--border) 35%, transparent) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
          maskImage: "linear-gradient(to bottom, black 70%, transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-end gap-16 px-6 pt-16 pb-12 sm:px-8 lg:min-h-[44rem] lg:grid-cols-[6fr_6fr] lg:pt-24">
        <div className="pb-2">
          <Eyebrow>Design studio · since {since}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-5 text-[48px]/[var(--heading-leading-display)] tracking-tight sm:text-[64px]/[var(--heading-leading-display)] lg:text-[72px]/[var(--heading-leading-display)]"
          >
            Two designers, finishing websites
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            BooliiTheme is a studio of two. We design templates for Next.js, Shopify and WordPress,
            and let AI take the drafting so our hours go into the details.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/#templates" />} nativeButton={false}>
              See the templates
              <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
            <Button size="lg" variant="secondary" render={<Link href="/#contact" />} nativeButton={false}>
              Message us
            </Button>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
            {[
              [String(projects.filter((p) => !p.personal).length), "templates"],
              [formatNumber(author.sales), "sales"],
              [author.rating.toFixed(2), "average rating"],
            ].map(([figure, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="sr-only">{label}</dt>
                <dd className="font-mono text-sm text-brand-ink tabular-nums">{figure}</dd>
                <dd aria-hidden className="text-sm text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroFigure className="h-auto w-full max-w-[34rem]" />
        </div>
      </div>
    </section>
  );
}
