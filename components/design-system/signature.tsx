import { eyebrowClass } from "@/components/site/eyebrow";

// The signature move the site kept at stop 2 — the pattern line — and the
// ornament hand every ornament is drawn in. The hand: a 1.5px stroke,
// round caps and joins, elbows turned on a 6px radius, a 4–6 dash for a cut
// line; ink at the muted strength for the line itself, the brand's fill for
// the one node a drawing is about, leaf for anything live.

function Move({ label, title, caption, children }: { label: string; title: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col gap-5 rounded-lg border border-border p-6 sm:p-8">
      <figcaption className="flex flex-col gap-1">
        <span className={eyebrowClass}>{label}</span>
        <span className="font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{caption}</span>
      </figcaption>
      <div className="flex min-h-48 flex-col justify-center rounded-sm bg-accent p-6">{children}</div>
    </figure>
  );
}

/** C: the pattern line — one design cut along a dashed, notched line into its platforms. */
export function PatternLine({ name, builds }: { name: string; builds: [string, string, string] }) {
  const chip = "absolute -translate-y-1/2 rounded-control bg-card px-3 py-1.5 text-sm whitespace-nowrap shadow-soft";
  return (
    <div className="relative aspect-[300/160] w-full">
      <svg
        aria-hidden="true"
        viewBox="0 0 300 160"
        className="absolute inset-0 size-full text-muted-foreground/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g strokeDasharray="4 6">
          <path d="M66 80 H104 Q110 80 110 74 V30 Q110 24 116 24 H176" />
          <path d="M66 80 H176" />
          <path d="M66 80 H104 Q110 80 110 86 V130 Q110 136 116 136 H176" />
        </g>
        <path d="M146 19 V29 M146 75 V85 M146 131 V141" />
        <circle cx="110" cy="80" r="4" className="fill-primary stroke-none" />
      </svg>
      <span className={`${chip} start-0 top-1/2 font-medium`}>{name}</span>
      {builds.map((b, i) => (
        <span key={b} className={chip} style={{ insetInlineStart: "59%", top: `${[15, 50, 85][i]}%` }}>
          {b}
        </span>
      ))}
    </div>
  );
}

export function Signature() {
  return (
    <div className="flex flex-col gap-12">
      <div className="grid gap-6">
        <Move
          label="Signature · a way of drawing"
          title="The pattern line"
          caption="From a tailor's paper pattern: one design cut along a dashed, notched line into each platform it ships on."
        >
          <div className="mx-auto w-full max-w-md">
            <PatternLine name="Ciseco" builds={["Next.js", "Shopify Hydrogen", "WooCommerce"]} />
          </div>
        </Move>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Move
          label="Ornament hand · Line"
          title="1.5px, round caps, 6px elbows, a 4–6 dash"
          caption="Ink at the muted strength; the brand's fill only on the node the drawing is about."
        >
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-control bg-card px-4 py-2 text-sm shadow-soft">Live demo</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 200 60"
              preserveAspectRatio="none"
              className="h-16 min-w-16 flex-1 text-muted-foreground/45"
              fill="none"
            >
              <path
                d="M0 12 H90 Q96 12 96 18 V42 Q96 48 102 48 H200"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
              <path d="M96 30 h0" stroke="var(--primary)" strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="rounded-control bg-card px-4 py-2 text-sm shadow-soft">Buy on ThemeForest</span>
          </div>
        </Move>
        <Move
          label="Ornament hand · Annotation"
          title="The same stroke, pointing"
          caption="A curved leader with an open head, and the note in the body face at the muted ink — never a script face."
        >
          <div className="relative h-28">
            <span className="absolute start-0 bottom-0 rounded-control bg-card px-3 py-1.5 text-sm whitespace-nowrap shadow-soft">
              next@15 · react@19
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 90 60"
              className="absolute start-40 top-4 h-15 w-[5.625rem] text-muted-foreground/45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M88 8 Q40 6 10 52 M10 52 L11 40 M10 52 L21 47" />
            </svg>
            <span className="absolute start-[16.25rem] top-1 text-sm text-muted-foreground">
              the versions it really ships
            </span>
          </div>
        </Move>
      </div>
    </div>
  );
}
