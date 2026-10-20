import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";

import { Header } from "./section-header";

const plans = [
  { name: "Single", note: "One site, one client", price: "$59", list: ["One end product", "Six months of support*", "Every update"] },
  { name: "Studio", note: "For a small team's own work", price: "$149", list: ["Three end products", "Twelve months of support*", "Every update"] },
  { name: "Agency", note: "Client work at volume", price: "$399", list: ["Unlimited end products", "Priority support*", "Every update", "Refund within 14 days†"], chosen: true },
  { name: "Custom", note: "A template of your own", price: "$4k", list: ["Your brief, our design", "Built in six weeks", "Source and handover"] },
];

// Four plans in one hairline panel, the chosen one on a flat wash.
export function Pricing() {
  return (
    <section id="plans">
      <Header eyebrow="Licences" title="Pick the licence that fits" lede="Every licence includes every update for as long as the template is sold." />
      <div className="mt-16 grid overflow-hidden rounded-lg border border-border md:grid-cols-2 lg:mt-24 lg:grid-cols-4">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`relative flex flex-col overflow-hidden p-8 ${i < 3 ? "border-b border-border lg:border-e lg:border-b-0" : ""} ${
              p.chosen ? "bg-brand-wash" : ""
            }`}
          >
            <div className="relative">
              <p className="font-heading text-[40px]/[var(--heading-leading-display)]">
                {p.name}
                {p.chosen && <span className="font-heading ms-2 text-2xl text-brand-ink italic">(Recommended)</span>}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
              <p className="mt-14 text-[44px]/[var(--leading-display)] font-semibold tracking-tight tabular-nums">
                {p.price}
                <span className="ms-1 text-sm font-normal text-muted-foreground">/licence</span>
              </p>
              <ul className="mt-10 flex flex-col gap-2.5">
                {p.list.map((l) => (
                  <li key={l} className="flex items-center gap-2.5 text-sm">
                    <svg viewBox="0 0 16 16" className="size-4 shrink-0 stroke-muted-foreground" fill="none" strokeWidth={1.5} aria-hidden>
                      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-auto pt-10">
              <Button variant={p.chosen ? "default" : "secondary"} render={<a href="#plans" />} nativeButton={false}>
                {p.chosen ? "Buy Agency" : "Choose"} <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
        <p>
          <span className="text-foreground">* Support:</span> answers within two working days, by email.
        </p>
        <p>
          <span className="text-foreground">† Refund:</span> within 14 days, if the template does not run as described.
        </p>
      </div>
    </section>
  );
}
