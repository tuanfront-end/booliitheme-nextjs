import type { Metadata } from "next";
import Image from "next/image";
import { IBM_Plex_Mono, Noto_Serif_Display } from "next/font/google";
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
  Search01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import chisfis from "@/images/work/chisfis.png";
import { Segmented, Showcase } from "./showcase";
import "./eg.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Editorial Glow — lab",
  robots: { index: false },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-medium tracking-[0.04em] text-(--brand-ink) uppercase">
      <span className="size-1.5 rounded-full bg-(--brand)" />
      {children}
    </p>
  );
}

function Header({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="eg-serif mt-4 text-[36px] sm:text-[44px] lg:text-[48px]">{title}</h2>
      <p className="mt-2 text-[16px] leading-[1.5] text-muted-foreground">{lede}</p>
    </div>
  );
}

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
            <circle cx={x} cy={ky} r="2.5" className="fill-(--brand) stroke-none" />
          </g>
        ))}
    </g>
  );
  return (
    <svg
      viewBox="40 40 320 320"
      className="h-auto w-full max-w-[380px] fill-background stroke-(--lineart)"
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
        className="fill-none stroke-(--brand-soft)"
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
            className="stroke-(--brand)"
            strokeWidth={long ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line x1="-14" y1="4" x2="250" y2="-48" className="stroke-(--brand)" strokeWidth={6} strokeLinecap="round" />
      <line x1="-6" y1="14" x2="120" y2="-200" className="stroke-(--brand)" strokeWidth={8} strokeLinecap="round" />
      <circle r="9" className="fill-background stroke-(--brand)" strokeWidth={4} />
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

const plans = [
  { name: "Single", note: "One site, one client", price: "$59", list: ["One end product", "Six months of support*", "Every update"] },
  { name: "Studio", note: "For a small team's own work", price: "$149", list: ["Three end products", "Twelve months of support*", "Every update"] },
  { name: "Agency", note: "Client work at volume", price: "$399", list: ["Unlimited end products", "Priority support*", "Every update", "Refund within 14 days†"], chosen: true },
  { name: "Custom", note: "A template of your own", price: "$4k", list: ["Your brief, our design", "Built in six weeks", "Source and handover"] },
];

export default function EditorialGlowLab() {
  return (
    <main className={`eg ${plexMono.variable} ${notoDisplay.variable} flex-1`}>
      {/* Hero: copy anchored low on the start side, a framed product on stripes. */}
      <section className="relative overflow-hidden">
        <div className="eg-stripes absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1280px] items-end gap-12 px-6 pt-24 pb-20 md:px-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="pb-6">
            <h1 className="eg-serif text-[48px] sm:text-[64px] lg:text-[72px]">Templates built to be lived in</h1>
            <p className="mt-4 max-w-[34em] text-[16px] leading-[1.5] text-muted-foreground">
              Storefront, booking and magazine starters for Next.js, Hydrogen and WordPress.
            </p>
            <div className="eg-rail mt-8 flex max-w-[460px] gap-6 overflow-hidden text-[14px] whitespace-nowrap">
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
              <a href="#plans" className="eg-btn inline-flex h-11 items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium">
                Browse templates <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
              </a>
              <a href="#plans" className="eg-btn-2 inline-flex h-11 items-center rounded-[12px] px-5 text-[14px] font-medium">
                Hire the studio
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[12px] border border-border bg-background p-1.5">
              <Image src={chisfis} alt="Chisfis booking template, home page" className="rounded-[8px]" priority />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-32 px-6 py-32 md:px-12 lg:gap-40">
        {/* Joined panel: a figure cell beside a 2x3 grid, cells sharing hairlines. */}
        <section>
          <Header eyebrow="Why Boolii" title="Built different" lede="We don't sell kits. We sell sites that were finished before you bought them." />
          <div className="mt-16 grid overflow-hidden rounded-[12px] border border-border lg:mt-24 lg:grid-cols-[1fr_2fr]">
            <div className="relative grid place-items-center border-b border-border bg-muted p-10 lg:border-e lg:border-b-0">
              <div className="eg-grid absolute inset-0" aria-hidden />
              <div className="relative w-full max-w-[380px]">
                <LineArt />
              </div>
            </div>
            <div className="grid divide-border sm:grid-cols-2 [&>*]:border-border [&>*]:border-b sm:[&>*:nth-child(odd)]:border-e sm:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*:last-child]:border-b-0">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3 p-8 lg:p-10">
                  <HugeiconsIcon icon={f.icon} size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-(--brand)" />
                  <div>
                    <p className="text-[14px] leading-[1.55] font-medium">{f.title}</p>
                    <p className="mt-1 text-[14px] leading-[1.55] text-muted-foreground">{f.line}</p>
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
                <p className="eg-serif text-[36px]">09:00</p>
                <p className="mt-3 text-[14px] font-medium">Changelog published</p>
                <p className="text-[14px] text-muted-foreground">Next.js 16.1 support, two fixes, one new block.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing: four plans in one hairline panel, the chosen one on a flat wash. */}
        <section id="plans">
          <Header eyebrow="Licences" title="Pick the licence that fits" lede="Every licence includes every update for as long as the template is sold." />
          <div className="mt-16 grid overflow-hidden rounded-[12px] border border-border md:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            {plans.map((p, i) => (
              <div
                key={p.name}
                className={`relative flex flex-col overflow-hidden p-8 ${i < 3 ? "border-b border-border lg:border-e lg:border-b-0" : ""} ${
                  p.chosen ? "bg-(--brand-wash)" : ""
                }`}
              >
                <div className="relative">
                  <p className="eg-serif text-[40px]">
                    {p.name}
                    {p.chosen && <span className="eg-serif ms-2 text-[22px] text-(--brand-ink) italic">(Recommended)</span>}
                  </p>
                  <p className="mt-2 text-[14px] text-muted-foreground">{p.note}</p>
                  <p className="mt-14 text-[44px] leading-none font-semibold tracking-[-0.02em]">
                    {p.price}
                    <span className="ms-1 text-[14px] font-normal tracking-normal text-muted-foreground">/licence</span>
                  </p>
                  <ul className="mt-10 flex flex-col gap-2.5">
                    {p.list.map((l) => (
                      <li key={l} className="flex items-center gap-2.5 text-[14px]">
                        <svg viewBox="0 0 16 16" className="size-4 shrink-0 stroke-muted-foreground" fill="none" strokeWidth={1.5} aria-hidden>
                          <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative mt-auto pt-10">
                  <a
                    href="#plans"
                    className={`${p.chosen ? "eg-btn" : "eg-btn-2"} inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[14px] font-medium`}
                  >
                    {p.chosen ? "Buy Agency" : "Choose"} <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-1 text-[12px] text-muted-foreground">
            <p>
              <span className="text-foreground">* Support:</span> answers within two working days, by email.
            </p>
            <p>
              <span className="text-foreground">† Refund:</span> within 14 days, if the template does not run as described.
            </p>
          </div>
        </section>

        {/* The kit at a glance, both halves. */}
        <section>
          <Header eyebrow="The kit" title="Controls, faces and tokens" lede="What every section above is built from, in the light half and the dark one." />
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {["", "eg-dark"].map((half) => (
              <div key={half} className={`eg ${half} rounded-[12px] border border-border p-8`}>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="eg-btn h-10 rounded-[10px] px-4 text-[14px] font-medium">Primary</button>
                  <button className="eg-btn-2 h-10 rounded-[10px] px-4 text-[14px] font-medium">Secondary</button>
                  <button disabled className="eg-btn h-10 rounded-[10px] px-4 text-[14px] font-medium">
                    Disabled
                  </button>
                  <a href="#plans" className="text-[14px] underline-offset-4 hover:underline">
                    Text link
                  </a>
                </div>
                <div className="mt-6">
                  <Segmented />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Storefront", "Booking", "Magazine"].map((c, i) => (
                    <span
                      key={c}
                      className={`rounded-full border px-3 py-1 text-[14px] ${
                        i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <label className="mt-6 flex h-10 items-center gap-2 rounded-[10px] border border-input px-3 text-muted-foreground">
                  <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} />
                  <span className="text-[14px]">Search templates</span>
                </label>
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
                  <div>
                    <p className="text-[13px] text-muted-foreground">Original</p>
                    <p className="eg-serif mt-1 text-[40px]">Booking, done</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground">Condensed</p>
                    <p className="eg-serif-condensed mt-1 text-[40px]">Booking, done</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {["background", "foreground", "muted-foreground", "border", "muted", "brand", "brand-soft", "brand-wash"].map((t) => (
                    <div key={t}>
                      <span className="block h-10 rounded-[8px] border border-border" style={{ background: `var(--${t})` }} />
                      <p className="eg-mono mt-1 text-[10px] leading-tight text-muted-foreground">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
