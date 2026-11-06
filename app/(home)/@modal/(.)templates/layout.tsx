import { TemplateSheet } from "@/components/templates/template-sheet";

// The sheet sits in a layout above [slug], so it stays mounted while the arrows
// and the three at its foot walk from one template to the next: it rises once,
// and only what is inside it changes.
export default function TemplatesSheetLayout({ children }: { children: React.ReactNode }) {
  return <TemplateSheet>{children}</TemplateSheet>;
}
