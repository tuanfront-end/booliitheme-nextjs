import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { HelloGrid } from "@/components/site/hello-grid";
import { email, marketplaces, socials } from "@/lib/nav";

const linkClass =
  "inline-flex min-h-10 items-center rounded-xs text-sm press hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// The greeting in green squares, then the two offers in one line and the
// address large enough to be the heading, then where else we are.
export function SiteFooter() {
  return (
    <Column as="footer" id="contact" aria-labelledby="contact-title" className="mt-32 pb-10 sm:mt-40 print:hidden">
      <HelloGrid className="h-auto w-full max-w-3xl" />

      <Eyebrow as="h2" id="contact-title" className="mt-20 sm:mt-24">
        Work with us
      </Eyebrow>
      <a
        href={`mailto:${email}`}
        className="mt-4 inline-block press font-heading text-2xl tracking-tight transition-colors duration-answer ease-answer hover:text-muted-foreground focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring min-[400px]:text-3xl sm:text-5xl sm:tracking-tighter"
      >
        {email}
      </a>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Ask for a template no one else has, or have the two of us build your site.
      </p>

      <div className="mt-20 flex flex-col-reverse gap-x-8 gap-y-4 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BooliiTheme</p>
        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-6">
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
      </div>
    </Column>
  );
}
