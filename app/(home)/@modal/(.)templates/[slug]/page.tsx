import { notFound } from "next/navigation";

import { DialogBody, DialogCloseButton, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { forSale, TemplateDetail, TemplateSteps } from "@/components/templates/detail";

export { generateMetadata } from "@/app/templates/[slug]/page";

// A card pressed on the home page lands here instead of on the template's own
// page: the same template, drawn in the sheet the layout beside this file
// holds open. Walking to another template swaps this page and keeps the sheet.
export default async function TemplateModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = forSale.find((t) => t.slug === slug);
  if (!p) notFound();

  return (
    <>
      <div className="flex shrink-0 items-center justify-end gap-1 px-4 pt-4 sm:px-6">
        <TemplateSteps p={p} replace />
        <DialogCloseButton className="ms-2" />
      </div>
      <DialogBody className="pt-6 pb-16 sm:pt-8">
        <TemplateDetail
          p={p}
          replace
          title={
            <DialogTitle className="text-3xl font-normal tracking-tight sm:text-4xl sm:tracking-tighter">
              {p.name}
            </DialogTitle>
          }
          description={
            <DialogDescription className="mt-2 text-sm text-muted-foreground">{p.tagline}</DialogDescription>
          }
        />
      </DialogBody>
    </>
  );
}
