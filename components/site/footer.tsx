import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { HelloGrid } from "@/components/site/hello-grid";
import { email, marketplaces, socials } from "@/lib/nav";

const linkClass =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-xs text-sm press hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// The greeting in green squares, then the two offers in one line and the
// address large enough to be the heading, then where else I am.
export function SiteFooter() {
  return (
    <Column as="footer" id="contact" aria-labelledby="contact-title" className="mt-32 pb-10 sm:mt-40 print:hidden">
      <HelloGrid className="h-auto w-full" />

      <Eyebrow as="h2" id="contact-title" className="mt-20 sm:mt-24">
        Work with me
      </Eyebrow>
      <a
        href={`mailto:${email}`}
        className="mt-4 inline-flex min-h-10 items-center press font-heading text-2xl tracking-tight hover:text-muted-foreground focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring min-[400px]:text-3xl sm:text-5xl sm:tracking-tighter"
      >
        {email}
      </a>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Ask for a template no one else has, or have me build your site.
      </p>

      {/* Where else I am on the start side and the © on the end, as the
          reference sets them. */}
      <div className="mt-20 flex flex-col gap-x-8 gap-y-4 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Elsewhere">
          <ul className="-mx-2 flex flex-wrap gap-x-4">
            {[...socials, ...marketplaces].map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BooliiTheme</p>
      </div>
    </Column>
  );
}
