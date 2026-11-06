import { isNextOnly, listed } from "@/components/templates/detail";
import { TemplateCard } from "./template-card";

// The builds folded behind the grid's last tile. Loaded by the grid when they
// are unfolded, so the data they draw from is not part of the home page's
// first load.
export function TemplateRest() {
  return listed
    .filter((p) => !isNextOnly(p))
    .map((p, i) => <TemplateCard key={p.slug} p={p} first={i === 0} />);
}
