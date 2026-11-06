import { notFound } from "next/navigation";

export { generateMetadata } from "@/app/templates/[slug]/page";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { forSale, TemplateDetail, TemplateSteps } from "@/components/templates/detail";
import { TemplateSheet } from "@/components/templates/template-sheet";

// A card pressed on the home page lands here instead of on the template's own
// page: the same template, drawn in a sheet over the page it was opened from.
export default async function TemplateModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = forSale.find((t) => t.slug === slug);
  if (!p) notFound();

  return (
    <TemplateSheet key={p.slug} steps={<TemplateSteps p={p} replace />}>
      <TemplateDetail
        p={p}
        replace
        title={
          <DialogTitle className="text-3xl font-normal tracking-tight sm:text-4xl sm:tracking-tighter">
            {p.name}
          </DialogTitle>
        }
        description={<DialogDescription className="mt-2 text-sm text-muted-foreground">{p.tagline}</DialogDescription>}
      />
    </TemplateSheet>
  );
}
