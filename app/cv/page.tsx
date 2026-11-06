import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { CvSheet } from "@/components/cv/cv-sheet";
import { Column } from "@/components/site/column";
import { Button } from "@/components/ui/button";
import { cvFile } from "@/lib/data/studio";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "CV",
  description:
    "BooliiTheme on one page: the studio, its ThemeForest figures, every template it sells, the stack it builds on and how to work with it.",
  path: "/cv",
});

// The CV as the sheet the PDF prints from. On screen it stands on the page
// with the way back and the download above it; printed, the chrome drops away
// and the sheet is the whole document. Under `lg` it is zoomed to fit, since
// an A4 page is wider than a phone.
export default function CvPage() {
  return (
    <main id="content" className="pb-24 print:pb-0">
      <Column className="print:hidden" innerClassName="flex items-center justify-between gap-4 pt-6 pb-10">
        <Button variant="ghost" render={<Link href="/" />} nativeButton={false}>
          <ArrowLeftIcon data-icon="inline-start" className="rtl:-scale-x-100" />
          Home
        </Button>
        <Button render={<a href={cvFile} download />} nativeButton={false}>
          <ArrowDownTrayIcon data-icon="inline-start" />
          Download PDF
        </Button>
      </Column>
      <div className="px-6 max-[399px]:[zoom:0.36] min-[400px]:max-sm:[zoom:0.42] sm:max-md:[zoom:0.78] md:max-lg:[zoom:0.9] print:px-0 print:[zoom:1]">
        <CvSheet className="rounded-sm shadow-soft-lg print:rounded-none print:shadow-none" />
      </div>
    </main>
  );
}
