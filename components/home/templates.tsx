"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { platforms, projects, type Project } from "@/lib/data/projects";
import { formatMoney } from "@/lib/format";

const price = (p: Project) =>
  p.market.price ? formatMoney(p.market.price, undefined, { maximumFractionDigits: 0 }) : "On ThemeForest";

// Every template as a picture, its name and its price, in one hairline panel —
// nothing else on the card. A press opens the template over the page, the way
// Dribbble opens a shot, and the arrows walk to its neighbours without closing.
export function Templates() {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : projects[open];
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + projects.length) % projects.length));

  return (
    <section
      id="templates"
      aria-labelledby="templates-title"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-8"
    >
      <Eyebrow>Templates</Eyebrow>
      <SectionHeading id="templates-title" className="mt-4">
        Ten templates, each one finished
      </SectionHeading>
      <Lede className="mt-2">Open one to see it closer — every template runs as a live demo.</Lede>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <ul className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:mt-24">
          {projects.map((p, i) => (
            <li key={p.slug} className="bg-background">
              <DialogTrigger
                onClick={() => setOpen(i)}
                className="group/card flex w-full flex-col gap-4 p-4 text-start transition-colors duration-answer ease-answer hover:bg-muted sm:p-5"
              >
                <span className="block overflow-hidden rounded-md border border-border bg-background p-1">
                  <Image
                    src={p.shots[0]}
                    alt=""
                    sizes="(min-width: 640px) 40rem, 100vw"
                    className="aspect-[16/11] w-full rounded-[4px] object-cover object-top transition-transform duration-arrive ease-arrive group-hover/card:scale-[1.015]"
                  />
                </span>
                <span className="flex items-baseline justify-between gap-4 px-1">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{price(p)}</span>
                </span>
              </DialogTrigger>
            </li>
          ))}
        </ul>

        <DialogContent className="sm:max-w-5xl">
          {current && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-4xl font-normal">{current.name}</DialogTitle>
                <DialogDescription>
                  {current.tagline} · {current.platforms.map((pl) => platforms[pl]).join(", ")}
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                {current.shots.map((shot, i) => (
                  <span key={i} className="block overflow-hidden rounded-md border border-border p-1">
                    <Image
                      src={shot}
                      alt={`${current.name}, ${i === 0 ? "home page" : "an inner page"}`}
                      sizes="(min-width: 1024px) 60rem, 100vw"
                      className="w-full rounded-[4px]"
                    />
                  </span>
                ))}
              </DialogBody>
              <DialogFooter className="justify-between">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label="Previous template" onClick={() => step(-1)}>
                    <ArrowLeftIcon className="rtl:-scale-x-100" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Next template" onClick={() => step(1)}>
                    <ArrowRightIcon className="rtl:-scale-x-100" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground tabular-nums">{price(current)}</span>
                  <Button
                    variant="secondary"
                    render={<a href={current.demo} target="_blank" rel="noopener noreferrer" />}
                    nativeButton={false}
                  >
                    Live demo
                    <ArrowUpRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </Button>
                  <Button
                    render={<a href={current.market.url} target="_blank" rel="noopener noreferrer" />}
                    nativeButton={false}
                  >
                    Buy on ThemeForest
                    <ArrowUpRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
