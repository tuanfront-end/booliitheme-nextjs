"use client";

import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";

// What a route that threw shows in place of itself, inside the header and
// footer. The page is static and has nothing to lose, so the one thing to offer
// is trying again.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="content" className="flex flex-1 flex-col justify-center py-24 sm:py-32">
      <Column>
        <Eyebrow>Something broke</Eyebrow>
        <SectionHeading as="h1" className="mt-3 max-w-xl">
          This page did not load
        </SectionHeading>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">Trying again usually fixes it.</p>
        <div className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Column>
    </main>
  );
}
