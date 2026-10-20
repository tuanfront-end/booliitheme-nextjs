import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  CodeIcon,
  FlashIcon,
  InfinityIcon,
  LaptopIcon,
  Mail01Icon,
  PencilEdit02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import chisfis from "@/images/work/chisfis.png";
import { Kit } from "./kit";
import { Pricing } from "./pricing";
import { Header } from "./section-header";
import { Showcase } from "./showcase";

export const metadata: Metadata = {
  title: "Paper Hairline — lab",
  robots: { index: false },
};


function LineArt() {
  const slab = (y: number, keys = false) => (
    <g key={y}>
      <path d={`M80 ${y} L200 ${y + 60} L200 ${y + 78} L80 ${y + 18} Z`} />
      <path d={`M200 ${y + 60} L320 ${y} L320 ${y + 18} L200 ${y + 78} Z`} />
      <path d={`M80 ${y} L200 ${y - 60} L320 ${y} L200 ${y + 60} Z`} />
      {[0.25, 0.5, 0.75].map((t) => (
        <path
          key={t}
          className="opacity-50"
          d={`M${80 + 120 * t} ${y - 60 * t} L${200 + 120 * t} ${y + 60 - 60 * t}`}
        />
      ))}
      {keys &&
        [
          [170, y - 6],
          [215, y + 16],
          [230, y - 24],
        ].map(([x, ky], i) => (
          <g key={i}>
            <path d={`M${x - 22} ${ky} L${x} ${ky - 11} L${x + 22} ${ky} L${x} ${ky + 11} Z`} />
            <circle cx={x} cy={ky} r="2.5" className="fill-brand stroke-none" />
          </g>
        ))}
    </g>
  );
  return (
    <svg
      viewBox="40 40 320 320"
      className="h-auto w-full max-w-[380px] fill-background stroke-foreground/70"
      strokeWidth={1.25}
      strokeLinejoin="round"
      aria-hidden
    >
      {slab(270)}
      {slab(215)}
      {slab(150, true)}
    </svg>
  );
}

function Dial() {
  const ticks = Array.from({ length: 96 }, (_, i) => i);
  const r = 300;
  return (
    <svg viewBox="-320 -320 640 640" className="h-[520px] w-[520px] shrink-0" aria-hidden>
      <path
        d={`M ${r * Math.cos(-1.35)} ${r * Math.sin(-1.35)} A ${r} ${r} 0 0 1 ${r * Math.cos(-0.75)} ${r * Math.sin(-0.75)}`}
        className="fill-none stroke-brand-soft"
        strokeWidth={18}
      />
      {ticks.map((i) => {
        const a = (i / 96) * Math.PI * 2;
        const long = i % 8 === 0;
        const r1 = long ? r - 40 : r - 14;
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * (r - 4)}
            y2={Math.sin(a) * (r - 4)}
            className="stroke-brand"
            strokeWidth={long ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line x1="-14" y1="4" x2="250" y2="-48" className="stroke-brand" strokeWidth={6} strokeLinecap="round" />
      <line x1="-6" y1="14" x2="120" y2="-200" className="stroke-brand" strokeWidth={8} strokeLinecap="round" />
      <circle r="9" className="fill-background stroke-brand" strokeWidth={4} />
    </svg>
  );
}

const features = [
  { icon: AiBrain01Icon, title: "Designed, then drawn", line: "Every page starts as a layout we would ship ourselves, not a kit." },
  { icon: LaptopIcon, title: "Runs where you do", line: "One design on Next.js, Hydrogen and WordPress block themes." },
  { icon: BookOpen01Icon, title: "Documented properly", line: "Folder map, tokens and a changelog that says what moved." },
  { icon: InfinityIcon, title: "Kept current", line: "Updated with each framework release, dated in the changelog." },
  { icon: FlashIcon, title: "Fast by default", line: "Images sized, fonts subset, nothing shipped twice." },
  { icon: Shield01Icon, title: "Licensed plainly", line: "Regular and Extended, with what each one covers in one line." },
];

export default function PaperHairlineLab() {
  return (
    <main className="flex-1 bg-background">
      {/* Hero: copy anchored low on the start side, a framed product on stripes. */}
      <section className="relative overflow-hidden">
        <div className="ground-stripes absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1280px] items-end gap-12 px-6 pt-24 pb-20 md:px-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="pb-6">
            <h1 className="font-heading text-[48px]/[var(--heading-leading-display)] sm:text-[64px]/[var(--heading-leading-display)] lg:text-[72px]/[var(--heading-leading-display)]">Templates built to be lived in</h1>
            <p className="mt-4 max-w-[34em] text-base text-muted-foreground">
              Storefront, booking and magazine starters for Next.js, Hydrogen and WordPress.
            </p>
            <div style={{ maskImage: "linear-gradient(to right, black 55%, transparent)" }} className="mt-8 flex max-w-[460px] gap-6 overflow-hidden text-sm whitespace-nowrap">
              {[
                [Calendar03Icon, "Booking flows"],
                [Mail01Icon, "Newsletter kits"],
                [PencilEdit02Icon, "Editorial grids"],
                [CodeIcon, "Typed data"],
              ].map(([icon, label], i) => (
                <span key={i} className={`flex items-center gap-2 ${i > 1 ? "text-muted-foreground" : ""}`}>
                  <HugeiconsIcon icon={icon as typeof CodeIcon} size={18} strokeWidth={1.5} />
                  {label as string}
                </span>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button size="lg" render={<a href="#plans" />} nativeButton={false}>
                Browse templates <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
              </Button>
              <Button size="lg" variant="secondary" render={<a href="#plans" />} nativeButton={false}>
                Hire the studio
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-border bg-background p-1.5">
              <Image src={chisfis} alt="Chisfis booking template, home page" className="rounded-md" priority />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-32 px-6 py-32 md:px-12 lg:gap-40">
        {/* Joined panel: a figure cell beside a 2x3 grid, cells sharing hairlines. */}
        <section>
          <Header eyebrow="Why Boolii" title="Built different" lede="We don't sell kits. We sell sites that were finished before you bought them." />
          <div className="mt-16 grid overflow-hidden rounded-lg border border-border lg:mt-24 lg:grid-cols-[1fr_2fr]">
            <div className="relative grid place-items-center border-b border-border bg-muted p-10 lg:border-e lg:border-b-0">
              <div className="ground-grid absolute inset-0" aria-hidden />
              <div className="relative w-full max-w-[380px]">
                <LineArt />
              </div>
            </div>
            <div className="grid divide-border sm:grid-cols-2 [&>*]:border-border [&>*]:border-b sm:[&>*:nth-child(odd)]:border-e sm:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*:last-child]:border-b-0">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3 p-8 lg:p-10">
                  <HugeiconsIcon icon={f.icon} size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{f.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* List with a figure: vertical tabs, a skeleton mock on rings, a floating field. */}
        <section>
          <Header eyebrow="See it working" title="One brief. Four kinds of site." lede="Every example below is a template on sale today, not a mock made for this page." />
          <div className="mt-16 lg:mt-24">
            <Showcase />
          </div>
        </section>

        {/* Data as ornament: a dial cropped by the viewport, a leader to a serif label. */}
        <section className="relative">
          <Header eyebrow="Release day" title="Your update, fully handled" lede="From the framework's release to a tested template in your downloads." />
          <div className="relative mt-12 flex items-center">
            <div className="-ms-[220px] md:-ms-[160px]">
              <Dial />
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-5 h-px w-16 bg-border" aria-hidden />
              <div>
                <p className="font-heading text-4xl">09:00</p>
                <p className="mt-3 text-sm font-medium">Changelog published</p>
                <p className="text-sm text-muted-foreground">Next.js 16.1 support, two fixes, one new block.</p>
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        <Kit />
      </div>
    </main>
  );
}
