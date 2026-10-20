// ref: feature-sections/centred-copy-and-link-over-two-tinted-panels-with-ui-illustrations.webp — centred-stack 2-col · bottom-heavy (departed: each panel carries the build's runs line, Live demo and Details under its illustration, and a versions card over its shot, which the reference's panels have no slot for)
// opens: panel · light
"use client";

import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

import { FamilyLine, familiesTitle, familySets } from "@/components/home/families";
import { BrowserFrame } from "@/components/site/browser-frame";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { VersionChip } from "@/components/site/version-chip";
import { Button } from "@/components/ui/button";
import { alsoOn, buildLabel, joinList, runs } from "@/lib/data/catalogue";
import type { Project } from "@/lib/data/projects";
import { hostOf } from "@/lib/format";
import { cn } from "@/lib/utils";

// The two families on the most platforms get a panel each; the rest are named
// in the link line under the lede.
const most = Math.max(...familySets.map((s) => s.builds.length));
const panels = familySets.filter((s) => s.builds.length === most);
const others = familySets.filter((s) => s.builds.length < most);

const inline = "underline decoration-foreground/30 underline-offset-4 hover:text-muted-foreground";

export function FamiliesV2() {
  return (
    <section id="families" aria-labelledby="families-title" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Families</Eyebrow>
        <SectionHeading id="families-title" className="mt-4 text-balance">
          {familiesTitle}
        </SectionHeading>
        <Lede className="mx-auto mt-4 max-w-xl text-balance">
          {joinList(panels.map((s) => s.name))} each run on {most}&nbsp;platforms. Pick a branch and the panel swaps
          to that build: its demo, the versions it pins and what its platform runs.
        </Lede>
        {others.map((s) => (
          <p key={s.family} className="mt-6 text-sm font-medium text-balance">
            <ArrowRightIcon aria-hidden="true" className="me-2 inline size-4 align-[-3px] rtl:-scale-x-100" />
            <span>
              {s.name} is on {s.builds.length}&nbsp;platforms:{" "}
              {s.builds.map((b, i) => (
                <span key={b.slug}>
                  {i ? (i === s.builds.length - 1 ? " and " : ", ") : null}
                  <Link href={`/work/${b.slug}`} className={inline}>
                    <span className="sr-only">Details of {s.name} </span>
                    {buildLabel(b)}
                  </Link>
                </span>
              ))}
            </span>
          </p>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {panels.map((s) => (
          <FamilyPanel key={s.family} set={s} />
        ))}
      </div>
    </section>
  );
}

function FamilyPanel({ set }: { set: (typeof familySets)[number] }) {
  const [at, setAt] = useState(0);
  const p = set.builds[at];
  const host = hostOf(p.demo);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-accent px-6 pt-10 text-center sm:px-10">
      <h3 className="text-2xl tracking-tight">{set.name}</h3>
      <p aria-live="polite" className="mx-auto mt-2 min-h-[2lh] max-w-sm text-base text-balance text-muted-foreground">
        {p.tagline}, also on {alsoOn(p)}.
      </p>

      <FamilyLine set={set} at={at} onPick={setAt} className="mx-auto mt-8 max-w-sm text-start" />
      <p className="mx-auto mt-4 min-h-[3lh] max-w-sm text-base text-balance text-muted-foreground">{runs[p.slug]}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button variant="outline" render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
          Live demo
          <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
          <span className="sr-only">at {host} (opens in a new tab)</span>
        </Button>
        <Button variant="link" render={<Link href={`/work/${p.slug}`} />} nativeButton={false}>
          Details<span className="sr-only"> of {p.name}</span>
        </Button>
      </div>

      <Versions project={p} className="mt-8 justify-center sm:hidden" />

      {/* The shot rises from the panel's foot and is cut by it. From `sm` the
          versions ride over it on a card; on a phone that card would hide it. */}
      <div className="relative mx-auto mt-6 h-56 sm:mt-10 w-full max-w-md sm:h-72">
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
            sizes="(min-width: 1024px) 448px, 90vw"
            aspect="aspect-[16/14]"
          />
          <span className="sr-only">Open the {p.name} live demo (opens in a new tab)</span>
        </a>

        <div className="absolute -start-6 bottom-5 hidden max-w-[18rem] rounded-md bg-card p-3 text-start shadow-soft-lg sm:block">
          <p className="text-xs text-muted-foreground">Versions</p>
          <Versions project={p} className="mt-2" />
        </div>
      </div>
    </article>
  );
}

function Versions({ project: p, className }: { project: Project; className?: string }) {
  return (
    <ul aria-label={`${p.name} versions`} className={cn("flex flex-wrap gap-1.5", className)}>
      {p.stack.map((d) => (
        <li key={d.name}>
          <VersionChip dep={d} />
        </li>
      ))}
    </ul>
  );
}
