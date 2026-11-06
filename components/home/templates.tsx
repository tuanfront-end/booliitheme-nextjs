import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { isNextOnly, listed } from "@/components/templates/detail";
import { joinList } from "@/lib/data/catalogue";
import { platforms } from "@/lib/data/projects";

import { TemplateCard } from "./template-card";
import { TemplateGrid } from "./template-grid";

const lead = listed.filter(isNextOnly);
const rest = listed.filter((p) => !isNextOnly(p));
// "WordPress and Shopify" — what the folded builds are built on, off the data.
const restOn = joinList([...new Set(rest.map((p) => platforms[p.platforms.at(-1)!]))]);

// Every template I sell as a picture, its name and its price, two to a row,
// the Next.js ones first. The WordPress and Shopify builds wait folded behind
// the tile that closes the grid, and open in place of it. A card opens its
// template in a sheet over the page, the way Dribbble opens a shot, with the
// address changing to the template's own page.
export function Templates() {
  return (
    <Column as="section" id="templates" aria-labelledby="templates-title">
      <Eyebrow>(01) Templates</Eyebrow>
      <SectionHeading id="templates-title" className="mt-3">
        Every template I sell
      </SectionHeading>

      <TemplateGrid count={rest.length} on={restOn}>
        {/* One picture is fetched early: the first card's. */}
        {lead.map((p, i) => (
          <TemplateCard key={p.slug} p={p} preload={i === 0} />
        ))}
      </TemplateGrid>
    </Column>
  );
}
