import type { Metadata } from "next";

import { readPicks, versions } from "@/components/dev/picks";
import { Skin } from "@/components/dev/switch-control";
import { Hero } from "@/components/home/hero";
import { Templates } from "@/components/home/templates";
import { WorkWithUs } from "@/components/home/work-with-us";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "A two-person website design studio",
  description:
    "BooliiTheme designs and builds templates for Next.js, Shopify and WordPress, and custom websites for teams who want their own.",
  path: "/",
});

// Scaffolding: `versions`, `searchParams` and `dynamic` go at phase one's
// harvest, `readPicks` with `<Skin>` at phase two's — switch.md § Taking it off.
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ v?: string | string[] }> }) {
  return (
    <Skin saved={await readPicks()} preview={versions((await searchParams).v)}>
      <main id="content" className="flex flex-col gap-32 lg:gap-40">
        <Hero />
        <Templates />
        <WorkWithUs />
      </main>
    </Skin>
  );
}
