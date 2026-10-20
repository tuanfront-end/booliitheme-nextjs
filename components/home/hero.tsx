import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";
import { author, projects } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";

const since = author.since.slice(0, 4);
// Three builds from three families, the newest at the front.
const shown = ["chisfis", "ciseco", "ncmaz"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);

// Who we are and what we do, anchored low on the start side; three templates
// cascade off the far edge on hairline stripes. Below the actions, the
// portfolio's real figures in mono.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="ground-stripes absolute inset-0" aria-hidden />
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
              [String(author.items), "templates"],
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

        <div className="relative h-[22rem] sm:h-[30rem] lg:h-[36rem]" aria-hidden>
          {shown.map((p, i) => (
            <div
              key={p.slug}
              className="absolute w-[78%] rounded-lg border border-border bg-background p-1.5 shadow-soft-lg sm:w-[70%] lg:w-[76%]"
              style={{ insetInlineStart: `${i * 16}%`, top: `${(2 - i) * 14}%`, zIndex: 3 - i }}
            >
              <Image
                src={p.shots[0]}
                alt=""
                sizes="(min-width: 1024px) 40rem, 80vw"
                priority={i === 0}
                className="aspect-[16/11] w-full rounded-md object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
