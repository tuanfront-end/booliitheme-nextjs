import { Eyebrow } from "@/components/site/eyebrow";
import { LogoMark } from "@/components/site/logo-mark";
import { buildLabel } from "@/lib/data/catalogue";
import { author, industries, projects } from "@/lib/data/projects";
import { about, figures, stack } from "@/lib/data/studio";
import { formatMonth } from "@/lib/format";
import { email, socials } from "@/lib/nav";
import { cn } from "@/lib/utils";

const forSale = projects.filter((p) => !p.personal);

// The addresses as a machine writes them, so they set in mono. Facebook's is
// a profile number rather than a name, and stays on the site.
const contacts = [
  email,
  "themeforest.net/user/booliitheme",
  ...socials.filter((s) => s.label !== "Facebook").map((s) => s.href.replace(/^https:\/\//, "").replace(/\/$/, "")),
];

const services: [string, string][] = [
  ["A template of your own", "Designed for one niche and one buyer, and not sold to anyone else."],
  ["A site built to order", "Designed and built start to finish on my stack, then handed over to you."],
];

// One row of the sheet: its label in the narrow column, its matter beside it.
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid shrink-0 grid-cols-[34mm_1fr] gap-6 border-t border-border py-5.5">
      <Eyebrow as="h2">{label}</Eyebrow>
      <div>{children}</div>
    </section>
  );
}

// The studio on one A4 page: who, the figures, every template, the stack and
// the two things we take on. Drawn at A4's own size, so the browser's print is
// the PDF and the page on screen is the same sheet.
export function CvSheet({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "mx-auto flex h-[297mm] w-[210mm] shrink-0 flex-col bg-card px-[14mm] pt-[13mm] pb-[11mm] text-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-8 pb-7">
        <div className="flex items-center gap-4">
          <span className="block size-14 shrink-0 overflow-hidden rounded-full">
            <LogoMark className="size-full scale-[1.3]" />
          </span>
          <div>
            <h1 className="text-4xl tracking-tighter">BooliiTheme</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Tuan, designer and developer of website templates</p>
          </div>
        </div>
        <ul className="pt-1 text-end font-mono text-xs text-muted-foreground">
          {contacts.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </header>

      <Row label="Profile">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {about.map((line, i) => (
            <p key={i} className={i === 0 ? "text-foreground" : undefined}>
              {line}
            </p>
          ))}
        </div>
      </Row>

      <Row label="ThemeForest">
        <dl className="grid grid-cols-4 gap-4 text-sm">
          {figures.map(([term, value]) => (
            <div key={term}>
              <dt className="text-xs text-muted-foreground">{term}</dt>
              <dd className="mt-0.5 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Templates">
        <ul className="text-sm">
          {forSale.map((p) => (
            <li key={p.slug} className="grid grid-cols-[42mm_1fr_auto] gap-3">
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground">{industries[p.industry]}</span>
              <span className="text-muted-foreground">{buildLabel(p) === "Next.js" ? "Next.js & HTML" : buildLabel(p)}</span>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Stack">
        <dl className="text-sm">
          {stack.map(([part, tools]) => (
            <div key={part} className="grid grid-cols-[42mm_1fr] gap-3">
              <dt className="text-muted-foreground">{part}</dt>
              <dd>{tools.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Work with me">
        <dl className="grid grid-cols-2 gap-6 text-sm">
          {services.map(([term, line]) => (
            <div key={term}>
              <dt className="font-medium">{term}</dt>
              <dd className="mt-0.5 text-muted-foreground">{line}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <footer className="mt-auto flex justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="font-mono">{email}</span>
        <span>ThemeForest figures as of {formatMonth(author.asOf)} · Updated {formatMonth(new Date().toISOString())}</span>
      </footer>
    </article>
  );
}
