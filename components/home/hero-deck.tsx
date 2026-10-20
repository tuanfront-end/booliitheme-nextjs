"use client";

import { useState } from "react";

import { BrowserFrame } from "@/components/site/browser-frame";
import { PatternLine } from "@/components/site/pattern-line";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { familyName, newestRelease, platformOf } from "@/lib/data/catalogue";
import { author, type Project } from "@/lib/data/projects";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

// The hero's picture: one design's builds fanned over a slab, the way the
// reference fans its cards, with the pattern line beside them as the switch
// that brings a platform's build to the front. The picked build takes the
// front slot and the rest follow it in order, each one under the one before,
// so a frame's address bar is only ever covered, never drawn over a shot.
const SLOTS = [
  "z-30 start-0 top-0 -rotate-3 shadow-soft-lg",
  "z-20 start-[15%] top-[12%] lg:start-[18%]",
  "z-10 start-[30%] top-[24%] rotate-3 lg:start-[36%]",
];

export function HeroDeck({ builds }: { builds: Project[] }) {
  const [front, setFront] = useState(0);
  const name = familyName(builds[0].family);

  const switcher = (
    <div className="rounded-lg bg-card p-4 shadow-soft-lg">
      <p className="text-xs text-muted-foreground">
        {name} on {builds.length} platforms
      </p>
      <PatternLine
        className="mt-1"
        active={front}
        source={
          <span className="block rounded-control bg-muted px-2.5 py-1 text-xs font-medium">{name}</span>
        }
        branches={builds.map((b, i) => (
          <Button
            key={b.slug}
            size="sm"
            variant={i === front ? "default" : "outline"}
            aria-pressed={i === front}
            onClick={() => setFront(i)}
          >
            {platformOf(b)}
          </Button>
        ))}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-[5/6] w-full sm:aspect-[6/5]">
        <div aria-hidden="true" className="absolute inset-x-0 top-[34%] bottom-0 rounded-lg bg-sun/20 lg:start-[8%]" />

        {builds.map((b, i) => (
          <div
            key={b.slug}
            className={cn("absolute w-[70%] rounded-md lg:w-[60%]", SLOTS[(i - front + builds.length) % builds.length])}
          >
            <BrowserFrame
              shots={[b.shots[0]]}
              url={b.demo}
              alt={`${b.name} demo home page`}
              sizes="(min-width: 1024px) 360px, 70vw"
              priority
            />
          </div>
        ))}

        <div className="absolute start-3 bottom-3 z-40 rounded-md bg-card p-3 shadow-soft-lg sm:start-auto sm:-end-[2%] sm:bottom-auto sm:top-[3%] sm:p-4">
          <p className="flex items-center gap-2">
            <span className="text-2xl tracking-tight tabular-nums">{author.rating.toFixed(2)}</span>
            <Rating value={author.rating} label={`Rated ${author.rating.toFixed(2)} out of 5`} />
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatNumber(author.ratings)}&nbsp;ratings on ThemeForest
          </p>
        </div>

        <Badge
          tone="leaf"
          ground="photo"
          dot
          className="absolute start-3 bottom-[5.75rem] z-40 sm:start-auto sm:end-6 sm:bottom-6"
          title={`${newestRelease.name}, the newest release`}
        >
          Updated {formatDate(newestRelease.market.updated)}
        </Badge>

        <div className="absolute -start-[6%] bottom-0 z-40 hidden w-80 lg:block">{switcher}</div>
      </div>

      <div className="lg:hidden">{switcher}</div>
    </div>
  );
}
