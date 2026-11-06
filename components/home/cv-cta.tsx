import Image from "next/image";
import Link from "next/link";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { Column } from "@/components/site/column";
import { Button } from "@/components/ui/button";
import { cvFile } from "@/lib/data/studio";
import cvPage from "@/images/cv.png";

// The CV handed out from a tinted panel: the line and the two ways to take it
// on the start side, and across from them the page itself rising from the
// panel's foot, so what the button downloads is already in view.
export function CvCta() {
  return (
    <Column as="section" aria-labelledby="cv-title">
      <div className="relative grid overflow-hidden rounded-lg bg-accent md:grid-cols-[1fr_17rem] lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <h2 id="cv-title" className="text-2xl tracking-tight">
            The studio on one page
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Our templates, stack and figures as a PDF, to keep or to forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button render={<a href={cvFile} download />} nativeButton={false}>
              <ArrowDownTrayIcon data-icon="inline-start" />
              Download CV
            </Button>
            <Button variant="secondary" render={<Link href="/cv" />} nativeButton={false}>
              Read it here
            </Button>
          </div>
        </div>
        <div className="relative h-56 md:h-auto">
          <Image
            src={cvPage}
            alt="The first page of the BooliiTheme CV"
            sizes="20rem"
            className="absolute inset-x-8 top-10 w-[calc(100%-4rem)] rotate-2 rounded-xs shadow-soft-lg md:inset-x-0 md:top-12 md:w-[calc(100%-2.5rem)]"
          />
        </div>
      </div>
    </Column>
  );
}
