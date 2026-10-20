import type { Metadata } from "next";

import { readPicks, versions } from "@/components/dev/picks";
import { Skin, Variant } from "@/components/dev/switch-control";
import { Catalogue } from "@/components/home/catalogue";
import { Contact } from "@/components/home/contact";
import { Faq } from "@/components/home/faq";
import { Families } from "@/components/home/families";
import { Hero } from "@/components/home/hero";
import { HeroV2 } from "@/components/home/hero-v2";
import { HeroV3 } from "@/components/home/hero-v3";
import { LatestRelease } from "@/components/home/latest-release";
import { License } from "@/components/home/license";
import { Proof } from "@/components/home/proof";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Storefront, booking and magazine templates for Next.js, Shopify and WordPress",
  description:
    "BooliiTheme builds one design for every platform: ten templates for Next.js, Shopify Hydrogen and WordPress block themes, each with a live demo.",
  path: "/",
});

// Scaffolding: `versions`, `searchParams` and `dynamic` go at phase one's
// harvest, `readPicks` with `<Skin>` at phase two's — switch.md § Taking it off.
// The layout's <Skin> owns the knobs; this one only hands `?v=` to the
// <Variant>s below it.
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ v?: string | string[] }> }) {
  return (
    <Skin saved={await readPicks()} preview={versions((await searchParams).v)}>
      <main id="content" className="flex flex-col gap-32 pt-12 sm:gap-40 sm:pt-16">
        <Variant slot="hero">
          <Hero />
          <HeroV2 />
          <HeroV3 />
        </Variant>
        <Catalogue />
        <Families />
        <Proof />
        <LatestRelease />
        <License />
        <Faq />
        <Contact />
      </main>
    </Skin>
  );
}
