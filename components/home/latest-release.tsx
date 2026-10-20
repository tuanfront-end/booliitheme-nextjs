// ref: feature-sections/photo-left-serif-heading-cta-and-four-tick-rows-right.png — split 45/55 · left-heavy
// opens: panel · light
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { BrowserFrame } from "@/components/site/browser-frame";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { VersionChip } from "@/components/site/version-chip";
import { Button } from "@/components/ui/button";
import { buildLabel, dated, familyName, newestRelease as p, runs } from "@/lib/data/catalogue";
import { familyOf } from "@/lib/data/projects";
import { formatDate, hostOf } from "@/lib/format";

// A design that arrived on a new platform says so; a design new to the
// catalogue goes by its own name.
const elder = familyOf(p).some((q) => q.slug !== p.slug);
const title = elder ? `${familyName(p.family)}, now on ${buildLabel(p)}` : p.name;
const log = dated.slice(0, 4);

export function LatestRelease() {
  return (
    <section aria-labelledby="release-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="column-grid gap-y-12">
        <a
          href={p.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group/frame col-span-full block rounded-md press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-1"
        >
          <BrowserFrame
            shots={p.shots}
            url={p.demo}
            alt={`${p.name} demo, home page`}
            sizes="(min-width: 1024px) 490px, (min-width: 768px) 75vw, 100vw"
            aspect="aspect-[5/6]"
          />
          <span className="sr-only">Open the {p.name} live demo (opens in a new tab)</span>
        </a>

        <div className="col-span-full flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7 lg:py-12">
          <div>
            <Eyebrow>Latest release</Eyebrow>
            <SectionHeading id="release-title" className="mt-4">
              {title}
            </SectionHeading>
            <Lede className="mt-5 max-w-lg text-balance">
              {p.tagline}, last updated {formatDate(p.market.updated)}. {runs[p.slug]}
            </Lede>
            <ul aria-label={`${p.name} versions`} className="mt-6 flex flex-wrap gap-1.5">
              {p.stack.map((d) => (
                <li key={d.name}>
                  <VersionChip dep={d} />
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                Live demo
                <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
                <span className="sr-only">at {hostOf(p.demo)} (opens in a new tab)</span>
              </Button>
              <Button size="lg" variant="outline" render={<Link href={`/work/${p.slug}`} />} nativeButton={false}>
                Details<span className="sr-only"> of {p.name}</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground">Last updates on ThemeForest</h3>
            <ol className="mt-4 flex flex-col gap-4">
              {log.map((q) => (
                <li key={q.slug} className="flex items-center gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-leaf/15 text-leaf-ink">
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="grid min-w-0 flex-1 gap-x-3 gap-y-1 sm:grid-cols-[6.5rem_minmax(0,11rem)_minmax(0,1fr)] sm:items-center">
                    <time dateTime={q.market.updated} className="text-sm text-muted-foreground tabular-nums">
                      {formatDate(q.market.updated)}
                    </time>
                    <span className="font-medium">{q.name}</span>
                    <span className="flex flex-wrap gap-1.5">
                      {q.stack
                        .filter((d) => d.version)
                        .slice(0, 1)
                        .map((d) => (
                          <VersionChip key={d.name} dep={d} />
                        ))}
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
