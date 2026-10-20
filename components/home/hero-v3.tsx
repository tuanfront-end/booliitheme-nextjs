// ref: hero-sections/centred-headline-and-email-pill-over-a-three-card-carousel-with-a-lifted-middle.webp — centred-stack 3-card carousel · bottom-heavy (departed: the email pill holds the template count and the first action, the note under it the stat line, and the second action stands under the carousel)
// opens: card · light
// ornament: Line ← hero-sections/centred-headline-and-email-pill-over-a-three-card-carousel-with-a-lifted-middle.webp · the middle card's three rules redrawn as the pattern line, branching to the design's builds
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { LayoutGridIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { counts, DesignsPill, heroActions, heroLede, heroStat, heroTitle, showcase } from "@/components/home/hero";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { Lede } from "@/components/site/lede";
import { Button } from "@/components/ui/button";

// Hero v3: the same words as v1, centred, over one design on three platforms.
// The reference's email pill is a pill holding the catalogue's count and the
// first action; its small print is the stat line.
export function HeroV3() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 id="hero-title" className="text-4xl tracking-tighter text-balance sm:text-5xl lg:text-6xl">
          {heroTitle} <DesignsPill />
        </h1>
        <Lede className="mt-6 max-w-xl text-balance">{heroLede}</Lede>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 rounded-lg bg-accent p-3 sm:flex-row sm:items-center sm:rounded-control sm:p-1.5 sm:ps-5">
          <span className="flex min-w-0 flex-1 items-center gap-3 max-sm:justify-center max-sm:pt-1">
            <HugeiconsIcon icon={LayoutGridIcon} size={18} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
            <span className="font-medium tabular-nums">{counts.templates}&nbsp;templates</span>
          </span>
          <Button render={<Link href={heroActions[0].href} />} nativeButton={false}>
            {heroActions[0].label}
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
          </Button>
        </div>
        <p className="mt-4 max-w-md text-balance text-muted-foreground">{heroStat}</p>
      </div>

      <div className="mt-14 lg:mt-16">
        <HeroCarousel builds={showcase} />
      </div>

      <div className="mt-10 flex justify-center">
        <Button render={<Link href={heroActions[1].href} />} nativeButton={false} size="lg" variant="outline">
          {heroActions[1].label}
          <ArrowDownIcon aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
    </section>
  );
}
