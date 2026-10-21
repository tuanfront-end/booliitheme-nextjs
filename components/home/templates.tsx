"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { DeviceMockup } from "@/components/site/device-mockup";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { industries, platforms, priceOf, projects, type Project } from "@/lib/data/projects";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

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

const price = (p: Project) => {
  const usd = priceOf(p);
  if (p.personal) return "Personal project";
  return usd ? formatMoney(usd, undefined, { maximumFractionDigits: 0 }) : "On ThemeForest";
};

// Every Buy goes to the template's Polar checkout; the marketplace page stands
// in until a checkout is set.
const buyHref = (p: Project) => p.checkout?.url ?? p.market.url;

// The facts under an open template, in the order a buyer asks them. A row
// whose figure the marketplace does not give is left out.
function details(p: Project): [string, React.ReactNode][] {
  const rows: [string, React.ReactNode][] = [
    ["Built with", p.build],
    ["Category", industries[p.industry]],
    [
      "Stack",
      <span key="stack" className="flex flex-wrap justify-end gap-1.5">
        {p.stack.map((d) => (
          <Badge key={d.name}>
            {d.name}
            {d.version && <span className="text-muted-foreground tabular-nums">{d.version}</span>}
          </Badge>
        ))}
      </span>,
    ],
  ];
  if (p.market.updated) rows.push(["Last updated", formatDate(p.market.updated)]);
  if (p.market.sales) rows.push(["Sales", <span key="sales" className="tabular-nums">{formatNumber(p.market.sales)}</span>]);
  if (p.market.rating)
    rows.push([
      "Rating",
      <span key="rating" className="tabular-nums">
        {p.market.rating.toFixed(2)}
        {p.market.ratings ? <span className="text-muted-foreground"> from {p.market.ratings}</span> : null}
      </span>,
    ]);
  return rows;
}

const NUMBERS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
const forSale = projects.filter((p) => !p.personal).length;

// Preview opens the live demo in a new tab; Buy goes to checkout. A personal
// project has the preview alone.
function Actions({ p }: { p: Project }) {
  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        Preview
        <ArrowUpRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
        <span className="sr-only">{p.name} (opens in a new tab)</span>
      </Button>
      {!p.personal && (
        <Button size="sm" render={<a href={buyHref(p)} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
          Buy
          <span className="sr-only">{p.name} (opens in a new tab)</span>
        </Button>
      )}
    </>
  );
}

// Every template as a laptop and a phone showing its live demo, its name, its
// price and the two things to do with it — preview, buy — in two columns, the
// second set half a card lower. A press on the devices opens the template over
// the page, the way Dribbble opens a shot; the arrows and the three templates at
// its foot walk on without closing.
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
        {NUMBERS[forSale] ?? forSale} templates, each one finished
      </SectionHeading>
      <Lede className="mt-2">Open one to see it closer. Every template runs as a live demo.</Lede>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 sm:pb-40 sm:[&>li:nth-child(even)]:translate-y-40 lg:mt-24 lg:gap-x-12">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <DialogTrigger
                onClick={() => setOpen(i)}
                aria-label={`Open ${p.name}`}
                className="group/card block w-full rounded-lg text-start"
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
              </DialogTrigger>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-1">
                <p className="text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="ms-3 text-muted-foreground tabular-nums">{price(p)}</span>
                </p>
                <div className="flex gap-2">
                  <Actions p={p} />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Open, a template takes the screen the way a Dribbble shot does: a
            sheet rising almost to the top, its name and the things to do with it
            in a bar across the head, the pictures large below, and three more
            templates at the foot to walk on to. */}
        <DialogContent className="sm:-mb-6 sm:h-[calc(100dvh-2.5rem)] sm:max-h-none sm:max-w-none sm:self-end sm:rounded-b-none sm:rounded-t-xl sm:data-starting-style:translate-y-16 sm:data-ending-style:translate-y-16">
          {current && (
            <>
              <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b px-6 py-4 sm:px-8">
                <div className="me-auto flex min-w-0 flex-col gap-0.5">
                  <DialogTitle className="font-heading text-3xl font-normal">{current.name}</DialogTitle>
                  <DialogDescription>
                    {current.tagline} · {current.platforms.map((pl) => platforms[pl]).join(", ")}
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground tabular-nums">{price(current)}</span>
                  <Actions p={current} />
                </div>
                <div className="flex items-center gap-1 max-sm:order-first max-sm:w-full max-sm:justify-end">
                  <Button variant="ghost" size="icon" aria-label="Previous template" onClick={() => step(-1)}>
                    <ArrowLeftIcon className="rtl:-scale-x-100" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Next template" onClick={() => step(1)}>
                    <ArrowRightIcon className="rtl:-scale-x-100" />
                  </Button>
                  <DialogCloseButton className="ms-2" />
                </div>
              </div>
              {/* Keyed by template, so walking on starts the next one at its top. */}
              <DialogBody key={current.slug} className="py-10 sm:py-14">
                <div className="mx-auto flex max-w-6xl flex-col gap-6">
                  <div className="grid items-start gap-6 sm:grid-cols-[3fr_1fr]">
                    <Frame
                      src={current.live?.desktop ?? current.shots[0]}
                      alt={`${current.name}, home page`}
                      sizes="(min-width: 1024px) 54rem, 100vw"
                      className={current.live ? "w-full" : "w-full sm:col-span-2"}
                    />
                    {current.live && (
                      <Frame src={current.live.mobile} alt={`${current.name} on a phone`} sizes="18rem" className="w-full" />
                    )}
                  </div>
                  {current.shots[1] && (
                    <Frame src={current.shots[1]} alt={`${current.name}, an inner page`} className="w-full" />
                  )}

                  {/* What it is, then the facts a buyer checks before paying,
                      in a hairline list beside it. */}
                  <div className="mt-10 grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
                    <div>
                      <h3 className="text-sm font-medium">About {current.name}</h3>
                      <p className="mt-3 max-w-prose text-base text-muted-foreground">{current.about}</p>
                    </div>
                    <dl className="divide-y divide-border border-y border-border text-sm">
                      {details(current).map(([term, value]) => (
                        <div key={term} className="flex items-baseline justify-between gap-6 py-3">
                          <dt className="text-muted-foreground">{term}</dt>
                          <dd className="text-end">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="mt-16 border-t border-border pt-8">
                    <h3 className="text-sm font-medium">More templates</h3>
                    <ul className="mt-6 grid gap-6 sm:grid-cols-3">
                      {[1, 2, 3].map((by) => {
                        const at = ((open ?? 0) + by) % projects.length;
                        const next = projects[at];
                        return (
                          <li key={next.slug}>
                            <DialogTrigger
                              onClick={() => setOpen(at)}
                              className="group/more block w-full rounded-md text-start"
                            >
                              <span className="block overflow-hidden rounded-md border border-border p-1 transition-colors duration-answer ease-answer group-hover/more:border-[color-mix(in_oklab,var(--foreground)_20%,transparent)]">
                                <Image
                                  src={next.live?.desktop ?? next.shots[0]}
                                  alt=""
                                  sizes="24rem"
                                  className="aspect-[16/10] w-full rounded-[4px] object-cover object-top"
                                />
                              </span>
                              <span className="mt-3 flex justify-between gap-3 px-1 text-sm">
                                <span className="font-medium">{next.name}</span>
                                <span className="text-muted-foreground tabular-nums">{price(next)}</span>
                              </span>
                            </DialogTrigger>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </DialogBody>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
