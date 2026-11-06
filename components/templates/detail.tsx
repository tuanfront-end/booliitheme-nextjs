import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { industries, priceOf, projects, type Project } from "@/lib/data/projects";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

/** A template built on Next.js alone — the builds the home page leads with. */
export const isNextOnly = (p: Project) => p.platforms.length === 1 && p.platforms[0] === "nextjs";

/** Everything the grid shows: the Next.js templates first, then the sites of my
 *  own, then the other builds, each in the order the data file keeps it. The
 *  grid, the sheet's arrows and the template pages all walk this order. */
export const listed = [
  ...projects.filter((p) => !p.personal && isNextOnly(p)),
  ...projects.filter((p) => p.personal),
  ...projects.filter((p) => !p.personal && !isNextOnly(p)),
];

/** Where an open template lives: its own page, or the sheet over the home. */
export const templateHref = (p: Project) => `/templates/${p.slug}`;

export const price = (p: Project) => {
  // A site of my own sells nothing; its slot says what it is instead.
  if (p.personal) return "Side project";
  const usd = priceOf(p);
  return usd ? formatMoney(usd, undefined, { maximumFractionDigits: 0 }) : "On ThemeForest";
};

// Every Buy goes to the template's Polar checkout; the marketplace page stands
// in until a checkout is set.
const buyHref = (p: Project) => p.checkout?.url ?? p.market.url;

// The desktop capture in a window set high in a tinted panel and cut by its
// foot, and the phone capture over the window's end corner, cut the same way,
// so a website reads as a shot of one on two screens. The desktop capture runs
// twice the window's height, so a hover scrolls it a little way down the page
// and its foot never shows; the phone lifts and casts a deep shadow, so it
// reads as standing over the desktop rather than pasted on it.
export function Shot({
  p,
  sizes,
  preload,
  className,
}: {
  p: Project;
  sizes: string;
  /** The first row's pictures, painted on the first screen: fetched early. */
  preload?: boolean;
  className?: string;
}) {
  return (
    <span className={`relative block aspect-[5/3] overflow-hidden rounded-lg bg-muted ${className ?? ""}`}>
      <span
        className={`absolute start-[5%] top-[14%] bottom-0 overflow-hidden rounded-t-sm bg-background shadow-soft ${
          p.live ? "w-[82%]" : "w-[90%]"
        }`}
      >
        <Image
          src={p.live?.desktop ?? p.shots[0]}
          alt=""
          sizes={sizes}
          preload={preload}
          className="w-full transition-transform duration-browse ease-sheet group-hover/shot:-translate-y-[8%] motion-reduce:transition-none"
        />
      </span>
      {p.live && (
        <Image
          src={p.live.mobile}
          alt=""
          sizes="8rem"
          className="absolute end-[5%] top-[26%] w-[22%] rounded-t-[12px] shadow-2xl ring-4 ring-background transition-transform duration-arrive ease-arrive group-hover/shot:-translate-y-2 motion-reduce:transition-none"
        />
      )}
    </span>
  );
}

// The open template's two captures as one picture, the way its card draws
// them, at the sheet's full width: the desktop in a window cut by the panel's
// foot, the phone standing whole over its end corner with the deep shadow that
// lifts it off the desktop. Still: this is the picture being looked at.
function Showcase({ p }: { p: Project }) {
  return (
    <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <div
        className={`absolute start-[4%] top-[7%] bottom-0 overflow-hidden rounded-t-md bg-background shadow-soft ${
          p.live ? "w-[76%]" : "w-[92%]"
        }`}
      >
        <Image
          src={p.live?.desktop ?? p.shots[0]}
          alt={`${p.name}, home page`}
          sizes={`(min-width: 1024px) ${p.live ? "48rem" : "60rem"}, 100vw`}
          preload
          className="w-full"
        />
      </div>
      {p.live && (
        <Image
          src={p.live.mobile}
          alt={`${p.name} on a phone`}
          sizes="(min-width: 640px) 14rem, 6rem"
          className="absolute end-[4%] top-[16%] w-[21%] rounded-[22px] shadow-2xl ring-[6px] ring-background"
        />
      )}
    </div>
  );
}

// A picture of an inner page: the capture on the panel's tint, 6px in from its
// edge, so a white page still has an edge on the white sheet.
function Picture({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <span className="mt-4 block overflow-hidden rounded-lg bg-muted p-1.5">
      <Image src={src} alt={alt} sizes="(min-width: 1024px) 64rem, 100vw" className="w-full rounded-[18px]" />
    </span>
  );
}

// The facts a buyer checks before paying, in the order they ask them. A row
// whose figure the marketplace does not give is left out.
function details(p: Project): [string, string][] {
  const rows: [string, string][] = [
    ["Built with", p.build],
    ["Category", industries[p.industry]],
    // A name and its version never part at a line end: "Tailwind CSS 4" is one.
    ["Stack", p.stack.map((d) => [d.name, d.version].filter(Boolean).join(" ").replace(/ /g, "\u00a0")).join(", ")],
  ];
  if (p.market.updated) rows.push(["Last updated", formatDate(p.market.updated)]);
  if (p.market.sales) rows.push(["Sales", formatNumber(p.market.sales)]);
  if (p.market.rating)
    rows.push(["Rating", `${p.market.rating.toFixed(2)}${p.market.ratings ? ` from ${p.market.ratings}` : ""}`]);
  return rows;
}

const at = (p: Project, by: number) => listed[(listed.indexOf(p) + by + listed.length) % listed.length];

// A link to another template. Inside the sheet (`replace`) it is a soft
// navigation that replaces the address, so the sheet stays and Back closes it.
// On a template's own page it is a plain link: a soft one to /templates/* is
// caught by the home's sheet route wherever it starts, and would open the
// sheet over the page.
function to(href: string, replace?: boolean) {
  return replace ? <Link href={href} replace scroll={false} /> : <a href={href} />;
}

/** The arrows to the template before and after this one. */
export function TemplateSteps({ p, replace }: { p: Project; replace?: boolean }) {
  return (
    <>
      <IconButton
        aria-label={`Previous template, ${at(p, -1).name}`}
        nativeButton={false}
        render={to(templateHref(at(p, -1)), replace)}
      >
        <ArrowLeftIcon className="rtl:-scale-x-100" />
      </IconButton>
      <IconButton
        aria-label={`Next template, ${at(p, 1).name}`}
        nativeButton={false}
        render={to(templateHref(at(p, 1)), replace)}
      >
        <ArrowRightIcon className="rtl:-scale-x-100" />
      </IconButton>
    </>
  );
}

const moreCard =
  "group/shot block rounded-lg press focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

function MoreCard({ p }: { p: Project }) {
  return (
    <>
      <Shot p={p} sizes="20rem" />
      <span className="mt-3 flex justify-between gap-3 text-sm">
        <span className="font-medium">{p.name}</span>
        <span className="text-muted-foreground tabular-nums">{price(p)}</span>
      </span>
    </>
  );
}

// One template, whole: its name and the two things to do with it, the picture,
// what it is for beside the facts, and three more to walk on to. The sheet and
// the template's own page both draw this; each passes its own title, since the
// sheet's has to be the dialog's.
export function TemplateDetail({
  p,
  title,
  description,
  replace,
}: {
  p: Project;
  title: ReactNode;
  description: ReactNode;
  replace?: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div>
          {title}
          {description}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            render={<a href={p.demo} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            {p.personal ? "Open the site" : "Live preview"}
            <ArrowUpRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
            <span className="sr-only">of {p.name} (opens in a new tab)</span>
          </Button>
          {/* A site of my own has nothing to buy. */}
          {!p.personal && (
            <Button render={<a href={buyHref(p)} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
              Buy for {price(p)}
              <span className="sr-only">{p.name} (opens in a new tab)</span>
            </Button>
          )}
        </div>
      </div>

      <Showcase p={p} />
      {p.shots[1] && <Picture src={p.shots[1]} alt={`${p.name}, an inner page`} />}

      {/* Ten columns at `lg`, the page's own: five for what it is for, four
          for the facts, one of air between. The two sentences come from the
          data file, so `text-balance` evens their lines rather than the words. */}
      <div className="mt-12 grid gap-10 lg:grid-cols-10 lg:gap-x-8">
        <p className="max-w-prose text-sm text-balance text-muted-foreground lg:col-span-5">{p.about}</p>
        <dl className="text-sm lg:col-span-4 lg:col-start-7">
          {details(p).map(([term, value]) => (
            <div key={term} className="flex items-baseline justify-between gap-6 py-1.5">
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="text-end tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20">
        <Eyebrow as="h2">More templates</Eyebrow>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((by) => {
            const next = at(p, by);
            return (
              <li key={next.slug}>
                {/* Inside the sheet a soft link that keeps it; on the page a
                    plain one, as the arrows do. */}
                {replace ? (
                  <Link href={templateHref(next)} replace scroll={false} className={moreCard}>
                    <MoreCard p={next} />
                  </Link>
                ) : (
                  <a href={templateHref(next)} className={moreCard}>
                    <MoreCard p={next} />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
