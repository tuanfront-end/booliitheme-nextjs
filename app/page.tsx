import type { Metadata } from "next";

import { About, Stack } from "@/components/home/about";
import { CvCta } from "@/components/home/cv-cta";
import { Intro } from "@/components/home/intro";
import { Templates } from "@/components/home/templates";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Website templates by a studio of two",
  description:
    "BooliiTheme is two designers making website templates for Next.js, Shopify and WordPress, drafted with AI and finished by hand.",
  path: "/",
});

// Who we are, the templates, then the studio behind them and the CV. Where to
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
