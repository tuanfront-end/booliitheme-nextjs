// ref: hero-sections/headline-and-client-pill-left-fanned-cards-over-a-peach-slab-right.png — split 50/50 · right-heavy (departed: the stat's own avatar cluster, since the headline's pill already carries the one cluster of designs; the strip holds version chips, standing still at motion 0)
// opens: panel · light
// ornament: Field ← hero-sections/headline-and-client-pill-left-fanned-cards-over-a-peach-slab-right.png · the column hairlines redrawn on this page's own grid, faded toward the foot
// ornament: Tilt ← hero-sections/headline-and-client-pill-left-fanned-cards-over-a-peach-slab-right.png · the fanned cards redrawn as three browser frames at -3°, 0 and 3°
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { HeroDeck } from "@/components/home/hero-deck";
import { Lede } from "@/components/site/lede";
import { VersionChip } from "@/components/site/version-chip";
import { Button } from "@/components/ui/button";
import { catalogueCounts, familyName, joinList, multiPlatformFamilies, stackLatest } from "@/lib/data/catalogue";
import { families, projects, type Platform } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

export const counts = catalogueCounts();
// One build per design — its own home page, as the pill's discs.
const designs = [...new Map(projects.map((p) => [p.family, p])).values()];
// The family with the most builds is the one the deck fans out, its builds in
// the order the display line names their platforms.
const order: Platform[] = ["nextjs", "shopify", "wordpress"];
export const showcase = [...families]
  .sort((a, b) => b.builds.length - a.builds.length)[0]
  .builds.slice()
  .sort((a, b) => order.indexOf(a.platforms[0]) - order.indexOf(b.platforms[0]));
// Every string the hero says, shared by its three versions: they differ in
// layout and never in what they say.
export const heroTitle = "The same design on Next.js, Shopify Hydrogen or WordPress";
export const heroLede = `Pick the platform your client already runs. ${joinList(multiPlatformFamilies.map((f) => familyName(f.family)))} ship on two or three of them, with checkout and editor rebuilt by hand on each.`;
export const heroStat = `Across ${counts.platforms}\u00a0platforms, each running as a live demo you can click through before you buy it.`;
export const heroActions = [
  { label: "Browse templates", href: "#templates" },
  { label: "Switch a design's platform", href: "#families" },
];

// The strip: every dependency a template pins to a version.
const pinned = stackLatest.filter((dep) => dep.version);

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -top-16 bottom-0 -z-10 column-grid grid-rows-1 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] sm:inset-x-8"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="border-s border-border last:border-e max-lg:nth-[n+9]:hidden max-md:nth-[n+5]:hidden" />
        ))}
      </div>

      <div className="column-grid gap-y-10 lg:gap-y-12">
        <h1
          id="hero-title"
          className="col-span-full text-4xl tracking-tighter sm:text-5xl lg:col-span-7 lg:row-start-1 lg:text-6xl"
        >
          {heroTitle}{" "}
          <DesignsPill />
        </h1>

        <Lede className="col-span-full max-w-md lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-3">
          {heroLede}
        </Lede>

        <div className="col-span-full flex flex-wrap gap-3 lg:col-span-6 lg:row-start-2">
          <Button render={<Link href={heroActions[0].href} />} nativeButton={false} size="lg">
            {heroActions[0].label}
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
          </Button>
          <Button render={<Link href={heroActions[1].href} />} nativeButton={false} size="lg" variant="outline">
            {heroActions[1].label}
            <ArrowDownIcon aria-hidden="true" data-icon="inline-end" />
          </Button>
        </div>

        <div className="col-span-full md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-2 lg:-mt-10">
          <HeroDeck builds={showcase} />
        </div>

        <div className="col-span-full max-w-sm lg:col-span-5 lg:row-start-3 lg:self-end">
          <p className="text-4xl tracking-tighter tabular-nums sm:text-5xl">
            {counts.templates}&nbsp;templates
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            {heroStat}
          </p>
        </div>
      </div>

      <ul
        aria-label="The newest version of each dependency the templates pin"
        className="mt-16 flex flex-wrap items-center justify-center gap-2 border-y border-border py-5 lg:mt-20 lg:flex-nowrap lg:justify-between lg:gap-4"
      >
        {pinned.map((dep, i) => (
          <li key={dep.name} className="flex items-center gap-4">
            {i > 0 ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="hidden size-4 text-muted-foreground/45 lg:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6" />
              </svg>
            ) : null}
            <VersionChip dep={dep} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The headline's count of designs: one disc per design, cropped from its
 *  inner-page shot. `ring` is the ground the discs are cut out of. */
export function DesignsPill({ ring = "ring-background" }: { ring?: string }) {
  return (
    <span className="inline-flex translate-y-[-0.12em] items-center gap-2 rounded-control py-1 ps-1 pe-4 align-middle ring-1 ring-border ring-inset">
      <span className="flex -space-x-2.5 rtl:space-x-reverse">
        {designs.map((p) => (
          <span key={p.slug} className={cn("relative size-8 overflow-hidden rounded-full ring-2", ring)}>
            <Image src={p.shots[1]} alt="" fill sizes="96px" className="object-cover object-[50%_40%]" />
          </span>
        ))}
      </span>
      <span className="text-sm tracking-normal whitespace-nowrap">{counts.designs}&nbsp;designs</span>
    </span>
  );
}
