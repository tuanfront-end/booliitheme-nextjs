import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { about, figuresAsOf, figures, stack } from "@/lib/data/studio";

// Two sections on one frame: the kicker and heading on the start side, what
// they head across from them, so About and Stack read as two pages of the same
// sheet. Ten columns at `lg`: four for the heading, five for the text, one of
// air between.
function Split({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Column as="section" id={id} aria-labelledby={`${id}-title`} innerClassName="lg:grid lg:grid-cols-10 lg:gap-x-8">
      <div className="lg:col-span-4">
        <Eyebrow>{kicker}</Eyebrow>
        <SectionHeading id={`${id}-title`} className="mt-3">
          {title}
        </SectionHeading>
      </div>
      <div className="mt-10 lg:col-span-5 lg:col-start-6 lg:mt-8">{children}</div>
    </Column>
  );
}

export function About() {
  return (
    <Split id="about" kicker="(02) About" title="A studio of two, since 2021">
      <div className="flex flex-col gap-4 text-sm text-muted-foreground">
        {about.map((line, i) => (
          <p key={i} className={i === 0 ? "text-foreground" : undefined}>
            {line}
          </p>
        ))}
      </div>
      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
        {figures.map(([term, value]) => (
          <div key={term}>
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="mt-0.5 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs text-muted-foreground">{figuresAsOf}</p>
    </Split>
  );
}

export function Stack() {
  return (
    <Split id="stack" kicker="(03) Stack & tools" title="What we build with">
      <dl className="divide-y divide-border border-y border-border text-sm">
        {stack.map(([part, tools]) => (
          <div key={part} className="grid grid-cols-[7rem_1fr] gap-4 py-3.5">
            <dt className="text-muted-foreground">{part}</dt>
            {/* A name never breaks inside itself: "Base UI" wraps whole. */}
            <dd>
              {tools.map((tool, i) => (
                <span key={tool}>
                  <span className="whitespace-nowrap">{tool}</span>
                  {i < tools.length - 1 && ", "}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Split>
  );
}
