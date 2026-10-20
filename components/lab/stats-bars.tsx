// ref: stats/four-unequal-bars-figures-above-captions-inside.webp — stagger 4-col · bottom-heavy
import { Eyebrow } from "@/components/site/eyebrow";

const bars = [
  { value: 94, caption: "Tickets resolved without an escalation." },
  { value: 71, caption: "Onboarding finished in the first session." },
  { value: 99.9, caption: "Uptime across every region, last 12 months.", focal: true },
  { value: 62, caption: "Support volume handled by self-serve." },
];

// The tallest bar reaches the full height of the plot; the rest are drawn to
// scale against it, floored so the shortest still has room for its caption.
const tallest = Math.max(...bars.map((bar) => bar.value));

export function StatsBars() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Eyebrow className="border-b px-8 py-5">
          Northwind / Service reliability
        </Eyebrow>

        <div className="flex items-end px-8 pt-16">
          {bars.map((bar) => (
            <div key={bar.caption} className="flex-1">
              {/* Centred over its own bar, as in the reference. Left-aligning
                  it would leave it sitting 20px clear of the caption below,
                  which is indented by the bar's padding. */}
              <p className="mb-4 text-center text-4xl tracking-tighter tabular-nums md:text-5xl">
                {bar.value}%
              </p>

              {/* The bar is a whisper of a fill with a drawn top edge — the
                  edge is what makes it a bar, not the fill. Only the focal one
                  spends any colour. */}
              <div
                style={{ height: `${(bar.value / tallest) * 300}px` }}
                className={
                  bar.focal
                    ? "flex items-end border-t-2 border-sun bg-linear-to-b from-sun/20 to-transparent p-5"
                    : "flex items-end border-t-2 border-foreground/10 bg-accent p-5"
                }
              >
                <p className="text-base text-balance">{bar.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
