"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { DeviceMockup } from "@/components/site/device-mockup";
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

// A capture in a hairline frame, the way every picture in the overlay sits.
function Frame({
  src,
  alt,
  sizes = "(min-width: 1024px) 60rem, 100vw",
  className,
}: {
  src: StaticImageData;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <span className={`block self-start overflow-hidden rounded-md border border-border p-1 ${className ?? ""}`}>
      <Image src={src} alt={alt} sizes={sizes} className="w-full rounded-[4px]" />
    </span>
  );
}

const price = (p: Project) =>
  p.market.price ? formatMoney(p.market.price, undefined, { maximumFractionDigits: 0 }) : "On ThemeForest";

// Every template as a picture, its name and its price on paper, in two
// columns, the second set half a card lower — nothing else on the card. A press opens the template over the page, the way
// Dribbble opens a shot, and the arrows walk to its neighbours without closing.
export function Templates() {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : projects[open];
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + projects.length) % projects.length));

  return (
    <section
      id="templates"
      aria-labelledby="templates-title"
      className="mx-auto w-full max-w-7xl px-6 sm:px-8"
    >
      <Eyebrow>Templates</Eyebrow>
      <SectionHeading id="templates-title" className="mt-4">
        Ten templates, each one finished
      </SectionHeading>
      <Lede className="mt-2">Open one to see it closer. Every template runs as a live demo.</Lede>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 sm:pb-40 sm:[&>li:nth-child(even)]:translate-y-40 lg:mt-24 lg:gap-x-12">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <DialogTrigger
                onClick={() => setOpen(i)}
                className="group/card flex w-full flex-col gap-4 rounded-lg text-start"
              >
                {p.live ? (
                  <DeviceMockup
                    desktop={p.live.desktop}
                    mobile={p.live.mobile}
                    alt=""
                    className="transition-transform duration-arrive ease-arrive group-hover/card:-translate-y-1"
                  />
                ) : (
                  <span className="block overflow-hidden rounded-lg border border-border bg-background p-1.5 transition-colors duration-answer ease-answer group-hover/card:border-[color-mix(in_oklab,var(--foreground)_20%,transparent)]">
                    <Image
                      src={p.shots[0]}
                      alt=""
                      sizes="(min-width: 640px) 40rem, 100vw"
                      className="aspect-[16/11] w-full rounded-[calc(var(--radius)-6px)] object-cover object-top"
                    />
                  </span>
                )}
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
                <Frame src={current.live?.desktop ?? current.shots[0]} alt={`${current.name}, home page`} />
                <div className="grid gap-4 sm:grid-cols-[1fr_3fr]">
                  {current.live && (
                    <Frame src={current.live.mobile} alt={`${current.name} on a phone`} sizes="16rem" />
                  )}
                  <Frame
                    src={current.shots[1]}
                    alt={`${current.name}, an inner page`}
                    className={current.live ? undefined : "sm:col-span-2"}
                  />
                </div>
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
