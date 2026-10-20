// ref: stats/four-staggered-figure-blocks-with-logo-row.png — stagger 4-col · bottom-heavy
// opens: band · light
// ornament: Frame ← stats/four-staggered-figure-blocks-with-logo-row.png · the two corner squares on the first block redrawn as flat peach marks at this block's own corners
import { eyebrowClass } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { Lede } from "@/components/site/lede";
import { catalogueCounts, platformMarks } from "@/lib/data/catalogue";
import { author, projects } from "@/lib/data/projects";
import { formatMonth, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const best = projects.reduce((a, b) => ((b.market.sales ?? 0) > (a.market.sales ?? 0) ? b : a));
const counts = catalogueCounts();
const since = formatMonth(`${author.since}-01`);

// Four peers, so four hues as one set: none of them outranks another.
const blocks = [
  {
    label: "Sales",
    figure: formatNumber(author.sales),
    unit: "",
    text: `Across ${author.items} items since ${since}. ${best.name} leads with ${formatNumber(best.market.sales!)} of them.`,
    tint: "bg-peach/20",
  },
  {
    label: "Buyer rating",
    figure: author.rating.toFixed(2),
    unit: "/ 5",
    text: `From ${formatNumber(author.ratings)} ratings buyers left on the item pages after they downloaded.`,
    tint: "bg-lime/20",
  },
  {
    label: "Selling since",
    figure: author.since.slice(0, 4),
    unit: "",
    text: `${author.level} on ThemeForest, a level Envato gives an author for lifetime sales.`,
    tint: "bg-sky/20",
  },
  {
    label: "Items",
    figure: String(author.items),
    unit: "",
    text: `${counts.templates} of them on this site, across ${counts.platforms} platforms and ${counts.designs} designs.`,
    tint: "bg-iris/20",
  },
];


const stagger = ["lg:mt-0", "lg:mt-12", "lg:mt-24", "lg:mt-36"];

export function Proof() {
  return (
    <section aria-labelledby="proof-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="column-grid gap-y-4">
        <SectionHeading id="proof-title" className="col-span-full lg:col-span-7">
          What ThemeForest buyers have on record
        </SectionHeading>
        <Lede className="col-span-full max-w-sm lg:col-span-4 lg:col-start-9 lg:mt-2">
          Each figure is the one the BooliiTheme profile and item pages on ThemeForest printed in {formatMonth(author.asOf)}.
        </Lede>
      </div>

      <dl className="mt-12 grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {blocks.map((b, i) => (
          <div
            key={b.label}
            className={cn("relative isolate flex min-h-64 flex-col overflow-hidden p-6 sm:p-8 lg:min-h-0", b.tint, stagger[i])}
          >
            {i === 0 ? (
              <>
                <span aria-hidden="true" className="absolute end-0 top-0 -z-10 size-20 bg-peach/35" />
                <span aria-hidden="true" className="absolute start-0 bottom-0 -z-10 h-20 w-1/2 bg-peach/35" />
              </>
            ) : null}
            <dt className={cn(eyebrowClass, "text-foreground")}>{b.label}</dt>
            <dd className="mt-6 text-6xl tracking-tighter tabular-nums lg:text-7xl">
              {b.figure}
              {b.unit ? <span className="ms-2 text-3xl tracking-tighter">{b.unit}</span> : null}
            </dd>
            <dd className="mt-auto pt-16 text-base lg:pt-24">{b.text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-xs text-base text-muted-foreground">
          Every template is built by hand on one of these four platforms.
        </p>
        <ul aria-label="Platforms" className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:gap-x-10">
          {platformMarks.map((m) => (
            <li key={m} className="text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl">
              {m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
