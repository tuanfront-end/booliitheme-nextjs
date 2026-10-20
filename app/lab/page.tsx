import { PastelShowcase } from "@/components/lab/pastel-showcase";
import { PricingTiers } from "@/components/lab/pricing-tiers";
import { StatsBars } from "@/components/lab/stats-bars";
import { StatsColumns } from "@/components/lab/stats-columns";
import { TeamPanel } from "@/components/lab/team-panel";
import { TypeSpecimen } from "@/components/lab/type-specimen";

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
export default function Lab() {
  return (
    <main className="flex-1 bg-background font-sans font-normal">
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
