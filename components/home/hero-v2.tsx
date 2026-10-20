// ref: hero-sections/dark-badge-copy-left-tilted-card-pair-with-glass-chips-right-logo-row-below.png — split 50/50 · right-heavy
// opens: panel · dark
// ornament: Tilt ← hero-sections/dark-badge-copy-left-tilted-card-pair-with-glass-chips-right-logo-row-below.png · the card pair redrawn as two browser frames at -3° and -2°
// ornament: Glass ← hero-sections/dark-badge-copy-left-tilted-card-pair-with-glass-chips-right-logo-row-below.png · the two chips redrawn as frosted panels holding the pattern-line switch and the Updated state
import { ArrowDownIcon, ArrowRightIcon, StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { counts, DesignsPill, heroActions, heroLede, heroStat, heroTitle, showcase } from "@/components/home/hero";
import { HeroPair } from "@/components/home/hero-pair";
import { Lede } from "@/components/site/lede";
import { Button } from "@/components/ui/button";
import { platformMarks } from "@/lib/data/catalogue";
import { author } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";

// Hero v2: the same words as v1 on an ink band at the container's width — the
// dark half's tokens scoped to it, as the footer's are. Copy on the reading
// side under the rating pill; one design's builds as a tilted pair on the
// other; the template count and the platforms in flat ink along the foot.
export function HeroV2() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="dark -mx-6 rounded-lg bg-card px-6 pt-14 pb-10 text-foreground sm:-mx-8 sm:px-8 lg:pt-20">
        <div className="column-grid items-center gap-y-14">
          <div className="col-span-full lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-control bg-muted py-1 ps-1 pe-3 text-sm">
              <span className="grid size-6 place-items-center rounded-full bg-card">
                <StarIcon aria-hidden="true" className="size-3.5 text-sun" />
              </span>
              <span>
                <span className="font-medium tabular-nums">{author.rating.toFixed(2)}</span>
                <span className="text-muted-foreground">
                  {" "}
                  from {formatNumber(author.ratings)}&nbsp;ratings on ThemeForest
                </span>
              </span>
            </p>
            <h1 id="hero-title" className="mt-6 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
              {heroTitle} <DesignsPill ring="ring-card" />
            </h1>
            <Lede className="mt-6 max-w-md text-balance">{heroLede}</Lede>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button render={<Link href={heroActions[0].href} />} nativeButton={false} size="lg">
                {heroActions[0].label}
                <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
              </Button>
              <Button render={<Link href={heroActions[1].href} />} nativeButton={false} size="lg" variant="outline">
                {heroActions[1].label}
                <ArrowDownIcon aria-hidden="true" data-icon="inline-end" />
              </Button>
            </div>
          </div>

          <div className="col-span-full md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-7">
            <HeroPair builds={showcase} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <p className="text-2xl tracking-tight tabular-nums">{counts.templates}&nbsp;templates</p>
            <p className="mt-1 text-muted-foreground">{heroStat}</p>
          </div>
          <ul aria-label="Platforms" className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:gap-x-10">
            {platformMarks.map((m) => (
              <li key={m} className="text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
