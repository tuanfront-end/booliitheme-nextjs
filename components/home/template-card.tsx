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
import { buildLabel, regularLicense } from "@/lib/data/catalogue";
import { industries, type Project } from "@/lib/data/projects";
import { formatNumber, hostOf } from "@/lib/format";
import { toggleShortlist, useShortlist } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

type CardProps = {
  project: Project;
  compared?: boolean;
  /** Three are already picked, so this one cannot join them. */
  compareLocked?: boolean;
  onCompareChange?: (next: boolean) => void;
};

// The listing card: the template's demo in a browser window on the start side,
// what a buyer checks before opening it on the other — the build, the name and
// its industry, the versions it pins, the marketplace's rating and sales, the
// Regular license price. The window is the live demo's own link and turns to
// the second shot while pointed at. Save, compare, demo and details each stand
// on their own; a figure the marketplace never showed is left out, not zeroed.
export function TemplateCard({ project: p, compared = false, compareLocked = false, onCompareChange }: CardProps) {
  return (
    <article
      data-object
      className="relative grid min-w-0 gap-5 rounded-lg bg-card p-1.5 ring-1 ring-border ring-inset sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-0"
    >
      <DemoFrame
        project={p}
        sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
        aspect="aspect-[16/14] sm:flex-1 sm:aspect-auto"
        className="h-full"
      />

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
          <SaveButton project={p} className="-mt-0.5 shrink-0" />
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-lg tracking-tight">
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-muted-foreground">/ {industries[p.industry]}</p>
        </div>

        <VersionList project={p} className="mt-3" />

        <div className="mt-auto flex flex-col items-start gap-1.5 pt-5">
          <MarketLine project={p} />
          <PriceLine project={p} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <DemoButton project={p} />
          <DetailsLink project={p} className="ms-2" />
          <CompareBox
            project={p}
            checked={compared}
            locked={compareLocked}
            onChange={onCompareChange}
            className="ms-auto"
          />
        </div>
      </div>
    </article>
  );
}

// The same card stood upright for a four-up grid: the window on top with New
// and the save disc over the shot, the versions in the row where a shop puts
// its swatches, then the name, the platform and industry, the marketplace's
// figures, the price and compare, and the demo and details last.
export function TemplateTile({ project: p, compared = false, compareLocked = false, onCompareChange }: CardProps) {
  return (
    <article data-object className="flex min-w-0 flex-col rounded-lg bg-card p-1.5 ring-1 ring-border ring-inset">
      <div className="relative">
        <DemoFrame
          project={p}
          sizes="(min-width: 1280px) 280px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
          aspect="aspect-[16/15]"
        />
        {p.isNew ? (
          <Badge tone="leaf" ground="photo" dot className="pointer-events-none absolute start-3 top-[2.875rem]">
            New
          </Badge>
        ) : null}
        <SaveButton project={p} className="absolute end-3 top-10" />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
        {/* Three rows of chips at the four-up width, set to the foot, so every name in a row sits level. */}
        <VersionList project={p} className="content-end xl:min-h-[5.25rem]" />

        <h3 className="mt-4 font-medium">{p.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {buildLabel(p)} · {industries[p.industry]}
        </p>

        <div className="mt-auto flex flex-col items-start gap-1 pt-4">
          <MarketLine project={p} />
          <PriceLine project={p} />
          <CompareBox
            project={p}
            checked={compared}
            locked={compareLocked}
            onChange={onCompareChange}
            className="mt-1"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <DemoButton project={p} />
          <DetailsLink project={p} className="ms-auto" />
        </div>
      </div>
    </article>
  );
}

/** The demo's window, the live demo's own link, crossfading while pointed at. */
function DemoFrame({
  project: p,
  sizes,
  aspect,
  className,
}: {
  project: Project;
  sizes: string;
  aspect: string;
  className?: string;
}) {
  return (
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
        sizes={sizes}
        aspect={aspect}
        className={className}
      />
      <span className="sr-only">Open the {p.name} live demo (opens in a new tab)</span>
    </a>
  );
}

function SaveButton({ project: p, className }: { project: Project; className?: string }) {
  const saved = useShortlist().includes(p.slug);
  return (
    <SaveToggle
      label={p.name}
      pressed={saved}
      onPressedChange={() => toggleShortlist(p.slug)}
      className={className}
    />
  );
}

function VersionList({ project: p, className }: { project: Project; className?: string }) {
  return (
    <ul aria-label={`${p.name} versions`} className={cn("flex flex-wrap gap-1.5", className)}>
      {p.stack.map((dep) => (
        <li key={dep.name}>
          <VersionChip dep={dep} />
        </li>
      ))}
    </ul>
  );
}

/** Stars, the rating and its count, and sales — whichever the marketplace showed. */
function MarketLine({ project: p }: { project: Project }) {
  const { rating, ratings, sales } = p.market;
  if (!rating && !sales) return null;
  return (
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
  );
}

/** "$39 Regular license", its gloss on the info button beside it. */
function PriceLine({ project: p }: { project: Project }) {
  const { price } = p.market;
  if (!price) return null;
  return (
    <p className="flex items-center gap-1 text-sm">
      <Price amount={price} className="text-base" />
      <span className="text-muted-foreground">Regular license</span>
      <Tooltip>
        <TooltipTrigger
          render={
            <IconButton size="sm" aria-label={regularLicense} render={<Link href="#license" />} nativeButton={false} />
          }
        >
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.5} aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{regularLicense}</TooltipContent>
      </Tooltip>
    </p>
  );
}

function DemoButton({ project: p }: { project: Project }) {
  const host = hostOf(p.demo);
  return (
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
  );
}

function DetailsLink({ project: p, className }: { project: Project; className?: string }) {
  return (
    <Button variant="link" size="sm" render={<Link href={`/work/${p.slug}`} />} nativeButton={false} className={className}>
      Details<span className="sr-only"> of {p.name}</span>
    </Button>
  );
}

function CompareBox({
  project: p,
  checked,
  locked,
  onChange,
  className,
}: {
  project: Project;
  checked: boolean;
  locked: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
}) {
  return (
    <CheckboxField
      label={
        <>
          Compare<span className="sr-only"> {p.name}</span>
        </>
      }
      checked={checked}
      disabled={locked && !checked}
      onCheckedChange={(next) => onChange?.(next)}
      className={className}
    />
  );
}
