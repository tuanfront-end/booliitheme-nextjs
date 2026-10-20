"use client";

import { useState } from "react";

import { BuildSwitch, RatingPill, UpdatedBadge } from "@/components/home/hero-deck";
import { BrowserFrame } from "@/components/site/browser-frame";
import { VersionChip } from "@/components/site/version-chip";
import { CarouselArrow } from "@/components/ui/carousel-nav";
import { familyName, platformOf } from "@/lib/data/catalogue";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

// Hero v3's picture: one design on three platforms as three cards, the picked
// build in the middle and lifted, its neighbours either side a step lower and
// smaller. The arrows and the pattern line inside the middle card move the
// same pick, and the ring wraps, so neither arrow ever runs out. The rating
// and the Updated state ride the side cards' outer corners.
export function HeroCarousel({ builds }: { builds: Project[] }) {
  const [mid, setMid] = useState(0);
  const n = builds.length;
  const at = (offset: number) => builds[(mid + offset + n) % n];
  const step = (by: number) => setMid((i) => (i + by + n) % n);
  const name = familyName(builds[0].family);

  return (
    <div className="relative">
      <div
        id="hero-builds"
        aria-label={`${name} on ${n} platforms`}
        role="group"
        className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] sm:gap-5 lg:gap-8"
      >
        <div className="relative hidden pt-14 sm:block">
          <RatingPill className="absolute -start-4 top-6 z-10 bg-card shadow-soft-lg xl:-start-8" />
          <BuildCard build={at(-1)} />
        </div>

        <div className="relative z-10">
          <BuildCard build={at(0)} lifted>
            <BuildSwitch builds={builds} front={mid} onPick={setMid} />
          </BuildCard>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:hidden">
            <RatingPill className="bg-accent" />
            <UpdatedBadge />
          </div>
        </div>

        <div className="relative hidden pt-14 sm:block">
          <UpdatedBadge className="absolute -end-3 top-10 z-10 xl:-end-6" />
          <BuildCard build={at(1)} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3 xl:pointer-events-none xl:absolute xl:inset-x-0 xl:top-1/2 xl:mt-0 xl:-translate-y-1/2 xl:justify-between xl:*:pointer-events-auto">
        <CarouselArrow
          direction="previous"
          aria-label={`Show ${platformOf(at(-1))}`}
          aria-controls="hero-builds"
          onClick={() => step(-1)}
        />
        <CarouselArrow
          direction="next"
          aria-label={`Show ${platformOf(at(1))}`}
          aria-controls="hero-builds"
          onClick={() => step(1)}
        />
      </div>
    </div>
  );
}

function BuildCard({ build: b, lifted = false, children }: { build: Project; lifted?: boolean; children?: React.ReactNode }) {
  const pinned = b.stack.find((d) => d.version);
  return (
    <article
      aria-label={b.name}
      className={cn(
        "rounded-lg bg-card p-1.5",
        lifted ? "shadow-soft-lg" : "ring-1 ring-border ring-inset",
      )}
    >
      <BrowserFrame
        shots={[b.shots[0]]}
        url={b.demo}
        alt={`${b.name} demo home page`}
        sizes={lifted ? "(min-width: 1024px) 400px, (min-width: 640px) 40vw, 90vw" : "(min-width: 1024px) 320px, 30vw"}
        priority
      />
      <div className={cn("flex flex-col px-3.5 pt-4 pb-3.5", lifted && "sm:px-5 sm:pt-5 sm:pb-5")}>
        <p className={cn("font-heading tracking-tight", lifted ? "text-2xl" : "text-xl")}>{b.name}</p>
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{platformOf(b)}</span>
          {pinned ? <VersionChip dep={pinned} /> : null}
        </div>
      </div>
    </article>
  );
}
