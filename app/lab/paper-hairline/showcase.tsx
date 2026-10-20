"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Calendar03Icon,
  Layers01Icon,
  PaintBoardIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { DotTabs } from "@/components/ui/dot-tabs";
import { Segmented } from "@/components/ui/segmented";

const items = [
  {
    value: "storefront",
    label: "Storefront",
    title: "Ciseco — a storefront for Next.js",
    figures: ["6,126", "4.61", "v16.0"],
    icon: Layers01Icon,
    headline: "A catalogue that sells itself",
    line: "Filters, a cart drawer and a checkout that keeps its state on refresh.",
  },
  {
    value: "booking",
    label: "Booking",
    title: "Chisfis — stays, cars and experiences",
    figures: ["3", "1,240", "v15.4"],
    icon: Calendar03Icon,
    headline: "Dates, guests, done",
    line: "A date range, a guest stepper and a map that follows the list.",
  },
  {
    value: "magazine",
    label: "Magazine",
    title: "Ncmaz — a magazine for WordPress",
    figures: ["42", "18", "v6.8"],
    icon: PaintBoardIcon,
    headline: "Long reads, set like print",
    line: "Issue pages, an author archive and a reading-time line on every card.",
  },
  {
    value: "custom",
    label: "Custom work",
    title: "A template of your own",
    figures: ["2", "6", "wk"],
    icon: Briefcase01Icon,
    headline: "Built for one client",
    line: "Send the brief; we answer with a scope and a date within two days.",
  },
];

export function Showcase() {
  const [active, setActive] = useState("storefront");
  const item = items.find((it) => it.value === active) ?? items[0];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[200px_1fr_300px]">
      <DotTabs aria-label="Template kinds" items={items} value={active} onValueChange={setActive} controls="showcase-panel" />

      <div
        id="showcase-panel"
        role="tabpanel"
        className="relative overflow-hidden rounded-lg border border-border bg-muted px-10 pt-12 pb-24"
      >
        <div className="ground-rings absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[460px] rounded-lg border border-border bg-background p-7">
          <p className="text-sm font-medium">{item.title}</p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-b border-border pb-6">
            {item.figures.map((f) => (
              <div key={f}>
                <p className="font-mono text-2xl text-brand">{f}</p>
                <span className="mt-1 block h-2 w-10 rounded-[2px] bg-border" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3" aria-hidden>
            {[92, 100, 74, 96, 60, 88, 40].map((w, i) => (
              <span key={i} className="h-2 rounded-[2px] bg-border" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-x-8 bottom-8 flex items-center gap-3 rounded-lg bg-background p-2 ps-4 shadow-soft-lg">
          <p className="flex-1 text-sm">Can it ship with my client&apos;s brand colour?</p>
          <Button size="icon" aria-label="Send">
            <HugeiconsIcon icon={SentIcon} size={18} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div key={item.value} className="animate-in fade-in duration-answer ease-answer">
        <HugeiconsIcon icon={item.icon} size={28} strokeWidth={1.5} className="text-brand" />
        <p className="mt-6 text-sm font-medium">{item.headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.line}</p>
      </div>
    </div>
  );
}

export function PlatformSegmented() {
  const [v, setV] = useState("next");
  return (
    <Segmented
      aria-label="Platform"
      name="platform"
      value={v}
      onValueChange={setV}
      options={[
        { value: "next", label: "Next.js" },
        { value: "hydrogen", label: "Hydrogen" },
        { value: "wordpress", label: "WordPress" },
      ]}
    />
  );
}
