import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { CopyEmail } from "@/components/site/copy-email";
import { Logo } from "@/components/site/logo";
import { author } from "@/lib/data/projects";
import { email, marketplaces, socials, studioLinks } from "@/lib/nav";

const since = author.since.slice(0, 4);
const linkClass =
  "inline-flex min-h-10 items-center gap-1.5 rounded-control text-sm text-muted-foreground transition-colors duration-answer ease-answer hover:text-foreground";

// Paper to the end: the hairline above it, one line on who we are, the
// studio's links, where the templates are sold, and the address.
export function SiteFooter() {
  const external = [...marketplaces, ...socials];
  return (
    <footer className="mx-auto mt-40 w-full max-w-7xl px-6 sm:px-8">
      <div className="grid gap-10 border-t border-border py-12 md:grid-cols-[1fr_auto_auto] md:gap-16">
        <div className="max-w-sm">
          <Logo aria-hidden className="h-6 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            A two-person studio designing websites, and using AI to draw them faster.
          </p>
        </div>
        <nav aria-label="Studio">
          <ul>
            {studioLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <ul>
            {external.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <ArrowUpRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {since}–{new Date().getFullYear()} BooliiTheme
        </p>
        <CopyEmail email={email} className="-mx-3 self-start sm:self-auto" />
      </div>
    </footer>
  );
}
