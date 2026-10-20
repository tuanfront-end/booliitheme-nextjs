// ref: stats/four-columns-under-headline-and-cert-badges-on-dark.png — header-row 4-col · bottom-heavy (departed: a delta chip per column, which the reference has no slot for)
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

import { MarkA, MarkB } from "@/components/lab/marks";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";

type Stat = {
  label: string;
  value: string;
  delta?: { amount: string; direction: "up" | "down"; good: boolean };
};

const stats: Stat[] = [
  {
    label: "Customers worldwide",
    value: "100k+",
    delta: { amount: "12%", direction: "up", good: true },
  },
  {
    label: "Calls in the last hour",
    value: "2.3M+",
    delta: { amount: "4%", direction: "up", good: true },
  },
  {
    label: "Average time to first value",
    value: "4 days",
    // Down and good — the chip is coloured by what it means, not by which way
    // the arrow points.
    delta: { amount: "38%", direction: "down", good: true },
  },
  { label: "Countries supported", value: "100+" },
];

const certifications = [
  { mark: MarkA, caption: "SOC 2 Type 2" },
  { mark: MarkB, caption: "HIPAA" },
];

export function StatsColumns() {
  return (
    <section className="py-24">
      <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-x-16 gap-y-10 px-8">
        <div className="me-auto max-w-xl">
          <Eyebrow>
            Scale with Northwind
          </Eyebrow>
          <SectionHeading className="mt-4 text-balance">
            Reaching new heights, without the roadblocks
          </SectionHeading>
        </div>

        <div>
          <Eyebrow>
            Proudly certified
          </Eyebrow>
          <div className="mt-4 flex gap-3">
            {certifications.map(({ mark: Mark, caption }) => (
              <div key={caption}>
                {/* A mark is ink, not colour, and it is sized by height. */}
                <div className="flex h-16 w-32 items-center justify-center rounded-sm bg-accent px-4">
                  <Mark className="h-4 w-full text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-bleed rules, container-width columns: the horizontal line is what
          separates the band, so it runs the whole way. */}
      <div className="mt-20 border-y">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x px-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex min-h-56 flex-col justify-between gap-10 px-6 py-8 first:ps-0 last:pe-0"
            >
              {/* The claim is body copy, read before the figure is. */}
              <p className="max-w-40 text-base text-muted-foreground">
                {stat.label}
              </p>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="text-5xl tracking-tighter tabular-nums md:text-6xl">
                  {stat.value}
                </span>
                {stat.delta && (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-control px-2 py-1 text-xs font-medium ${
                      stat.delta.good
                        ? "bg-leaf/15 text-leaf-ink"
                        : "bg-coral/15 text-coral-ink"
                    }`}
                  >
                    {stat.delta.direction === "up" ? (
                      <ArrowUpIcon className="size-3.5" />
                    ) : (
                      <ArrowDownIcon className="size-3.5" />
                    )}
                    {stat.delta.amount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
