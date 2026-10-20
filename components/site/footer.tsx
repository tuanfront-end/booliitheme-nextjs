// ref: footers/cta-strip-over-link-columns-and-a-ghost-wordmark-on-dark.webp — strip + 4-col · top-heavy
// ornament: Oversized glyph ← footers/cta-strip-over-link-columns-and-a-ghost-wordmark-on-dark.webp · the studio's own wordmark, redrawn in the template's hand
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { CopyEmail } from "@/components/site/copy-email";
import { Eyebrow } from "@/components/site/eyebrow";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { author } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";
import { email, marketplaces, socials, studioLinks, templatesByPlatform } from "@/lib/nav";

// The page closes on ink. The band wears the dark half's tokens through the
// `dark` class on its own wrapper, so every ink, rule and button inside reads
// the values solved for a near-black ground — on the light page it is the one
// inverted band, on the dark page it is the card rung lifted off the page. It
// is drawn at the container's width, like every band here.
const since = author.since.slice(0, 4);
const linkClass =
  "inline-flex min-h-10 items-center gap-1.5 text-foreground press hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export function SiteFooter() {
  const columns = [
    {
      title: "Templates",
      links: templatesByPlatform.map((g) => ({
        label: `${g.label} · ${g.items.length}`,
        href: `/?platform=${g.platform}#templates`,
      })),
    },
    { title: "Studio", links: studioLinks.filter((l) => l.label !== "Templates") },
    { title: "Marketplaces", links: marketplaces, external: true },
    { title: "Follow", links: socials, external: true },
  ];

  return (
    <footer className="mx-auto w-full max-w-7xl px-6 pt-40 pb-6 sm:px-8 sm:pb-8">
      <div className="dark -mx-6 overflow-hidden rounded-lg bg-card px-6 text-foreground sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-8 border-b border-border py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-xl">
            <p className="font-heading text-3xl tracking-tighter sm:text-4xl">
              All {author.items} items, one ThemeForest portfolio
            </p>
            <p className="mt-3 text-muted-foreground">
              {author.level} since {since} · {formatNumber(author.sales)} sales ·{" "}
              {author.rating.toFixed(2)} from {formatNumber(author.ratings)} ratings
            </p>
          </div>
          <Button
            render={<a href={author.url} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="lg"
            className="self-start md:self-auto"
          >
            Open the portfolio
            <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        </div>

        <nav aria-label="Footer" className="column-grid gap-y-10 py-12">
          {columns.map((col) => (
            <div key={col.title} className="col-span-2 lg:col-span-3">
              <Eyebrow as="h2">{col.title}</Eyebrow>
              <ul className="mt-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {col.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {link.label}
                        <ArrowUpRightIcon aria-hidden="true" className="size-4 text-muted-foreground rtl:-scale-x-100" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <Logo aria-hidden="true" className="block h-auto w-full text-muted-foreground/15" />

        <div className="mt-8 flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {since}–{new Date().getFullYear()} BooliiTheme. Figures as ThemeForest shows them.
          </p>
          <CopyEmail email={email} className="-mx-5 self-start sm:self-auto" />
        </div>
      </div>
    </footer>
  );
}
