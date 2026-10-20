"use client";

import { useState } from "react";

import { BuildSwitch, UpdatedBadge } from "@/components/home/hero-deck";
import { BrowserFrame } from "@/components/site/browser-frame";
import type { Project } from "@/lib/data/projects";

// Hero v2's picture: two builds of one design as a tilted pair, the picked
// build in front and the next one behind it, with two glass chips over them —
// the pattern-line switch that picks the front build, and the Updated state.
// The glass needs the screenshots behind it, so both chips overlap a frame.
export function HeroPair({ builds }: { builds: Project[] }) {
  const [front, setFront] = useState(0);
  const back = (front + 1) % builds.length;
  const glass = "rounded-lg bg-card/70 shadow-soft-lg ring-1 ring-white/10 ring-inset backdrop-blur-xl";

  const switcher = <BuildSwitch builds={builds} front={front} onPick={setFront} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative isolate aspect-square w-full sm:aspect-[6/5] lg:aspect-square">
        <div className="absolute end-[2%] top-[2%] w-[66%] -rotate-3 rounded-md">
          <BrowserFrame
            shots={[builds[back].shots[0]]}
            url={builds[back].demo}
            alt={`${builds[back].name} demo home page`}
            sizes="(min-width: 1024px) 380px, 66vw"
            priority
          />
        </div>
        <div className="absolute start-[4%] top-[30%] z-10 sm:top-[24%] lg:top-[28%] w-[66%] -rotate-2 rounded-md shadow-soft-lg">
          <BrowserFrame
            shots={[builds[front].shots[0]]}
            url={builds[front].demo}
            alt={`${builds[front].name} demo home page`}
            sizes="(min-width: 1024px) 380px, 66vw"
            priority
          />
        </div>

        <div className={`absolute end-0 top-[48%] z-20 px-3 py-2.5 ${glass}`}>
          <UpdatedBadge />
        </div>

        <div className={`absolute -start-[4%] -bottom-[6%] z-20 hidden w-80 p-4 lg:block ${glass}`}>{switcher}</div>
      </div>

      <div className={`p-4 lg:hidden ${glass}`}>{switcher}</div>
    </div>
  );
}
