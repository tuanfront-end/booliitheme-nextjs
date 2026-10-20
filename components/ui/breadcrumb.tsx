// Breadcrumb — the trail above a detail page's title, one link per step back and the page itself marked, published as structured data from the same list.
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { reach } from "@/components/reach";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Where the reader is, one link per step back. The last crumb is the page
 *  itself: not a link, and marked as the current page.
 *
 *  It publishes its own BreadcrumbList off the same array it draws, so the
 *  trail a search engine reads can never name different steps from the one on
 *  the page. `structuredData={false}` turns that off where the trail is not
 *  the page's own — a preview, a specimen.
 *
 *  The row wraps rather than scrolls: a trail is read once, left to right, and
 *  a long last crumb truncates on its own line instead of pushing the page
 *  sideways at 320px. */
export function Breadcrumb({
  trail,
  structuredData = true,
  className,
}: {
  trail: Crumb[];
  structuredData?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {trail.map((crumb, i) => (
          <li key={`${i}-${crumb.label}`} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRightIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground rtl:-scale-x-100"
              />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                data-slot="breadcrumb-link"
                // A 20px line of text, reached at 40px by the pseudo-element
                // behind it, and ringed on its own words when tabbed to.
                className={cn(
                  "text-muted-foreground press hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  reach,
                )}
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" data-slot="breadcrumb-page" className="truncate text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      {structuredData && <JsonLd schema={breadcrumbLd(trail)} />}
    </nav>
  );
}
