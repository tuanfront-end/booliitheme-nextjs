import type { Metadata } from "next";

import { PastelShowcase } from "@/components/lab/pastel-showcase";
import { PricingTiers } from "@/components/lab/pricing-tiers";
import { StatsBars } from "@/components/lab/stats-bars";
import { StatsColumns } from "@/components/lab/stats-columns";
import { TeamPanel } from "@/components/lab/team-panel";
import { TypeSpecimen } from "@/components/lab/type-specimen";
import { pageMeta } from "@/lib/seo";

// The bench: the sections a face, a pairing, a ground and a pastel strength
// most often fail on, with nothing else on the page. The page roles every
// section reuses are drawn on /design-system, which ships. It has no picker of
// its own. Once the switch is up, this page is wrapped in `<Skin>` like the home,
// so every pick is made in one place and written to one file; before then it
// shows the scaffold's own values.
//
// The pastel showcase only means something on a pastel project, so it shows
// under a `data-pastel` ancestor — the Skin's wrapper, or <html> once candy is
// harvested — and stays out of the way everywhere else.
// Out of the search index, like /design-system: a bench for whoever builds on
// the template, not a page a visitor lands on.
export const metadata: Metadata = pageMeta({
  title: "Lab",
  description: "The sections a face, a pairing and a ground most often fail on, drawn on a page of their own.",
  path: "/lab",
  robots: { index: false, follow: true },
});

export default function Lab() {
  return (
    <main id="content" className="flex-1 bg-background font-sans font-normal">
      <TypeSpecimen />
      <div className="hidden [[data-pastel]_&]:block">
        <PastelShowcase />
      </div>
      <PricingTiers />
      <TeamPanel />
      <StatsColumns />
      <StatsBars />
    </main>
  );
}
