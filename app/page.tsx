import type { Metadata } from "next";

import { About, Stack } from "@/components/home/about";
import { CvCta } from "@/components/home/cv-cta";
import { Intro } from "@/components/home/intro";
import { Templates } from "@/components/home/templates";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Website templates by Tuan",
  description:
    "I'm Tuan, and BooliiTheme is me: website templates for Next.js, Shopify and WordPress, drafted with AI agents and finished by hand.",
  path: "/",
});

// Who I am, the templates, then the studio of one behind them and the CV. Where to
// write sits in the footer, under a greeting, on every page.
export default function Home() {
  return (
    <main id="content" className="flex flex-col gap-28 sm:gap-36">
      <Intro />
      <Templates />
      <About />
      <Stack />
      <CvCta />
    </main>
  );
}
