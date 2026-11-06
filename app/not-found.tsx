import type { Metadata } from "next";
import Link from "next/link";

import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Not found" };

// What an address with nothing behind it shows, inside the header and footer
// every route has. Short, in the voice of the rest of the site, with the two
// places a lost visitor is most likely after.
export default function NotFound() {
  return (
    <main id="content" className="flex flex-1 flex-col justify-center py-24 sm:py-32">
      <Column>
        <Eyebrow>(404) Not found</Eyebrow>
        <SectionHeading as="h1" className="mt-3 max-w-xl">
          There is nothing at this address
        </SectionHeading>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          The link may be old, or mistyped. The templates and the CV are one press away.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Button render={<Link href="/" />} nativeButton={false}>
            Back to the home page
          </Button>
          <Button variant="secondary" render={<Link href="/#templates" />} nativeButton={false}>
            See the templates
          </Button>
        </div>
      </Column>
    </main>
  );
}
