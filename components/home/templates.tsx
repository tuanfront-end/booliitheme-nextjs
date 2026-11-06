"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { industries, priceOf, projects, type Project } from "@/lib/data/projects";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

const forSale = projects.filter((p) => !p.personal);

const price = (p: Project) => {
  const usd = priceOf(p);
  return usd ? formatMoney(usd, undefined, { maximumFractionDigits: 0 }) : "On ThemeForest";
};

// Every Buy goes to the template's Polar checkout; the marketplace page stands
// in until a checkout is set.
const buyHref = (p: Project) => p.checkout?.url ?? p.market.url;

// A capture standing in a tinted panel, set high and cut by the panel's foot,
// so a website reads as a shot of one rather than a screenshot pasted down.
function Shot({ src, sizes, className }: { src: StaticImageData; sizes: string; className?: string }) {
  return (
    <span className={`relative block aspect-[5/3] overflow-hidden rounded-lg bg-muted ${className ?? ""}`}>
      <Image
        src={src}
        alt=""
        sizes={sizes}
        className="absolute inset-x-[6%] top-[13%] w-[88%] rounded-t-sm shadow-soft transition-transform duration-arrive ease-arrive group-hover/shot:-translate-y-1.5 motion-reduce:transition-none"
      />
    </span>
  );
}

// The facts a buyer checks before paying, in the order they ask them. A row
// whose figure the marketplace does not give is left out.
function details(p: Project): [string, string][] {
  const rows: [string, string][] = [
    ["Built with", p.build],
    ["Category", industries[p.industry]],
    ["Stack", p.stack.map((d) => [d.name, d.version].filter(Boolean).join(" ")).join(", ")],
  ];
  if (p.market.updated) rows.push(["Last updated", formatDate(p.market.updated)]);
  if (p.market.sales) rows.push(["Sales", formatNumber(p.market.sales)]);
  if (p.market.rating)
    rows.push(["Rating", `${p.market.rating.toFixed(2)}${p.market.ratings ? ` from ${p.market.ratings}` : ""}`]);
  return rows;
}

// Preview opens the live demo in a new tab; Buy goes to checkout.
function Actions({ p }: { p: Project }) {
  return (
    <>
      <Button
        variant="secondary"
        render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        Live preview
        <ArrowUpRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
        <span className="sr-only">of {p.name} (opens in a new tab)</span>
      </Button>
      <Button render={<a href={buyHref(p)} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
        Buy for {price(p)}
        <span className="sr-only">{p.name} (opens in a new tab)</span>
      </Button>
    </>
  );
}

// Every template we sell as a picture, its name and its price, two to a row.
// A press opens it over the page the way Dribbble opens a shot; the arrows and
// the three at its foot walk on without closing.
export function Templates() {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : forSale[open];
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + forSale.length) % forSale.length));

  return (
    <Column as="section" id="templates" aria-labelledby="templates-title">
      <Eyebrow>(01) Templates</Eyebrow>
      <SectionHeading id="templates-title" className="mt-3">
        Every template we sell
      </SectionHeading>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-16">
          {forSale.map((p, i) => (
            <li key={p.slug}>
              <DialogTrigger
                onClick={() => setOpen(i)}
                className="group/shot block w-full rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Shot src={p.live?.desktop ?? p.shots[0]} sizes="(min-width: 640px) 30rem, 100vw" />
                <span className="mt-4 flex items-baseline justify-between gap-4 px-1 text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground tabular-nums">{price(p)}</span>
                </span>
              </DialogTrigger>
            </li>
          ))}
        </ul>

        {/* Open, a template takes the screen the way a Dribbble shot does: a
            sheet rising almost to the top, its name and the things to do with
            it across the head, the pictures large below, and three more at the
            foot to walk on to. */}
        <DialogContent className="sm:-mb-6 sm:h-[calc(100dvh-2.5rem)] sm:max-h-none sm:max-w-none sm:self-end sm:rounded-b-none sm:rounded-t-xl sm:data-starting-style:translate-y-16 sm:data-ending-style:translate-y-16">
          {current && (
            <>
              <div className="flex shrink-0 items-center justify-end gap-1 px-4 pt-4 sm:px-6">
                <IconButton aria-label="Previous template" onClick={() => step(-1)}>
                  <ArrowLeftIcon className="rtl:-scale-x-100" />
                </IconButton>
                <IconButton aria-label="Next template" onClick={() => step(1)}>
                  <ArrowRightIcon className="rtl:-scale-x-100" />
                </IconButton>
                <DialogCloseButton className="ms-2" />
              </div>

              {/* Keyed by template, so walking on starts the next one at its top. */}
              <DialogBody key={current.slug} className="pt-6 pb-16 sm:pt-8">
                <div className="mx-auto flex max-w-5xl flex-col">
                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
                    <div>
                      <DialogTitle className="text-3xl font-normal tracking-tight sm:text-4xl sm:tracking-tighter">
                        {current.name}
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-sm text-muted-foreground">
                        {current.tagline}
                      </DialogDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Actions p={current} />
                    </div>
                  </div>

                  <div className="mt-10 grid items-start gap-4 sm:grid-cols-[3fr_1fr]">
                    <Picture
                      src={current.live?.desktop ?? current.shots[0]}
                      alt={`${current.name}, home page`}
                      sizes="(min-width: 1024px) 46rem, 100vw"
                      className={current.live ? undefined : "sm:col-span-2"}
                    />
                    {current.live && (
                      <Picture src={current.live.mobile} alt={`${current.name} on a phone`} sizes="15rem" />
                    )}
                  </div>
                  {current.shots[1] && (
                    <Picture src={current.shots[1]} alt={`${current.name}, an inner page`} sizes="64rem" className="mt-4" />
                  )}

                  <div className="mt-12 grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
                    <p className="max-w-prose text-sm text-muted-foreground">{current.about}</p>
                    <dl className="text-sm">
                      {details(current).map(([term, value]) => (
                        <div key={term} className="flex items-baseline justify-between gap-6 py-1.5">
                          <dt className="text-muted-foreground">{term}</dt>
                          <dd className="text-end tabular-nums">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="mt-20">
                    <Eyebrow as="h3">More templates</Eyebrow>
                    <ul className="mt-6 grid gap-6 sm:grid-cols-3">
                      {[1, 2, 3].map((by) => {
                        const at = ((open ?? 0) + by) % forSale.length;
                        const next = forSale[at];
                        return (
                          <li key={next.slug}>
                            <DialogTrigger
                              onClick={() => setOpen(at)}
                              className="group/shot block w-full rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                            >
                              <Shot src={next.live?.desktop ?? next.shots[0]} sizes="20rem" />
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
    </Column>
  );
}

// A picture inside the open template: the capture on the panel's tint, 6px in
// from its edge, so a white page still has an edge on the white sheet.
function Picture({
  src,
  alt,
  sizes,
  className,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden rounded-lg bg-muted p-1.5 ${className ?? ""}`}>
      <Image src={src} alt={alt} sizes={sizes} className="w-full rounded-[18px]" />
    </span>
  );
}
