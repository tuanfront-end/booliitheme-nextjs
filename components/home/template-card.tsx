"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { BrowserFrame } from "@/components/site/browser-frame";
import { VersionChip } from "@/components/site/version-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import { IconButton } from "@/components/ui/icon-button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { SaveToggle } from "@/components/ui/save-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { regularLicense } from "@/lib/data/catalogue";
import { industries, type Project } from "@/lib/data/projects";
import { formatNumber, hostOf } from "@/lib/format";
import { toggleShortlist, useShortlist } from "@/lib/shortlist";

// The listing card: the template's demo in a browser window on the start side,
// what a buyer checks before opening it on the other — the build, the name and
// its industry, the versions it pins, the marketplace's rating and sales, the
// Regular license price. The window is the live demo's own link and turns to
// the second shot while pointed at. Save, compare, demo and details each stand
// on their own; a figure the marketplace never showed is left out, not zeroed.
export function TemplateCard({
  project: p,
  compared = false,
  compareLocked = false,
  onCompareChange,
}: {
  project: Project;
  compared?: boolean;
  /** Three are already picked, so this one cannot join them. */
  compareLocked?: boolean;
  onCompareChange?: (next: boolean) => void;
}) {
  const saved = useShortlist().includes(p.slug);
  const { rating, ratings, sales, price } = p.market;
  const host = hostOf(p.demo);

  return (
    <article
      data-object
      className="relative grid min-w-0 gap-5 rounded-lg bg-card p-1.5 ring-1 ring-border ring-inset sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-0"
    >
      <a
        href={p.demo}
        target="_blank"
        rel="noopener noreferrer"
        className="group/frame block min-w-0 rounded-md press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <BrowserFrame
          shots={p.shots}
          url={p.demo}
          alt={`${p.name} demo, home page`}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
          aspect="aspect-[16/14] sm:flex-1 sm:aspect-auto"
          className="h-full"
        />
        <span className="sr-only">Open the {p.name} live demo (opens in a new tab)</span>
      </a>

      <div className="flex min-w-0 flex-col px-3.5 pb-3.5 sm:py-3.5 sm:ps-5 sm:pe-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{p.build}</Badge>
            {p.isNew ? (
              <Badge tone="leaf" dot>
                New
              </Badge>
            ) : null}
          </div>
          <SaveToggle
            label={p.name}
            pressed={saved}
            onPressedChange={() => toggleShortlist(p.slug)}
            className="-mt-0.5 shrink-0"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-lg tracking-tight">
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-muted-foreground">/ {industries[p.industry]}</p>
        </div>

        <ul aria-label={`${p.name} versions`} className="mt-3 flex flex-wrap gap-1.5">
          {p.stack.map((dep) => (
            <li key={dep.name}>
              <VersionChip dep={dep} />
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col items-start gap-1.5 pt-5">
          {rating || sales ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
              {rating ? (
                <>
                  <Rating value={rating} label={`Rated ${rating.toFixed(2)} out of 5`} />
                  <span>
                    <span className="font-medium text-foreground">{rating.toFixed(2)}</span>
                    {ratings ? ` (${formatNumber(ratings)})` : null}
                  </span>
                </>
              ) : null}
              {rating && sales ? <span aria-hidden="true">·</span> : null}
              {sales ? <span>{formatNumber(sales)}&nbsp;sales</span> : null}
            </p>
          ) : null}
          {price ? (
            <p className="flex items-center gap-1 text-sm">
              <Price amount={price} className="text-base" />
              <span className="text-muted-foreground">Regular license</span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <IconButton
                      size="sm"
                      aria-label={regularLicense}
                      render={<Link href="#license" />}
                      nativeButton={false}
                    />
                  }
                >
                  <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.5} aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>{regularLicense}</TooltipContent>
              </Tooltip>
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                />
              }
            >
              Live demo
              <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
              <span className="sr-only">at {host} (opens in a new tab)</span>
            </TooltipTrigger>
            <TooltipContent>{host} · opens in a new tab</TooltipContent>
          </Tooltip>
          <Button variant="link" size="sm" render={<Link href={`/work/${p.slug}`} />} nativeButton={false} className="ms-2">
            Details<span className="sr-only"> of {p.name}</span>
          </Button>
          <CheckboxField
            label={
              <>
                Compare<span className="sr-only"> {p.name}</span>
              </>
            }
            checked={compared}
            disabled={compareLocked && !compared}
            onCheckedChange={(next) => onCompareChange?.(next)}
            className="ms-auto"
          />
        </div>
      </div>
    </article>
  );
}
