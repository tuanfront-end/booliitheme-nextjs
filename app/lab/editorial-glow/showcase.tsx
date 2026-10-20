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

const items = [
  {
    name: "Storefront",
    title: "Ciseco — a storefront for Next.js",
    figures: ["6,126", "4.61", "v16.0"],
    icon: Layers01Icon,
    headline: "A catalogue that sells itself",
    line: "Filters, a cart drawer and a checkout that keeps its state on refresh.",
  },
  {
    name: "Booking",
    title: "Chisfis — stays, cars and experiences",
    figures: ["3", "1,240", "v15.4"],
    icon: Calendar03Icon,
    headline: "Dates, guests, done",
    line: "A date range, a guest stepper and a map that follows the list.",
  },
  {
    name: "Magazine",
    title: "Ncmaz — a magazine for WordPress",
    figures: ["42", "18", "v6.8"],
    icon: PaintBoardIcon,
    headline: "Long reads, set like print",
    line: "Issue pages, an author archive and a reading-time line on every card.",
  },
  {
    name: "Custom work",
    title: "A template of your own",
    figures: ["2", "6", "wk"],
    icon: Briefcase01Icon,
    headline: "Built for one client",
    line: "Send the brief; we answer with a scope and a date within two days.",
  },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const item = items[active];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[200px_1fr_300px]">
      <ul className="flex flex-col gap-1" role="tablist" aria-label="Template kinds">
        {items.map((it, i) => (
          <li key={it.name}>
            <button
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex min-h-10 w-full items-center gap-3 rounded-[10px] text-start text-[17px] transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring) ${
                i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  i === active ? "bg-foreground" : "border border-muted-foreground"
                }`}
              />
              {it.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative overflow-hidden rounded-[12px] border border-border bg-muted px-10 pt-12 pb-24">
        <div className="eg-rings absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[460px] rounded-[12px] border border-border bg-background p-7">
          <p className="text-[18px] leading-snug text-muted-foreground">{item.title}</p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-b border-border pb-6">
            {item.figures.map((f) => (
              <div key={f}>
                <p className="eg-mono text-[26px] text-(--brand)">{f}</p>
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
        <div className="absolute inset-x-8 bottom-8 flex items-center gap-3 rounded-[12px] bg-background p-3 ps-4 shadow-(--shadow-float)">
          <p className="flex-1 text-[15px]">Can it ship with my client&apos;s brand colour?</p>
          <span className="eg-btn grid size-10 place-items-center rounded-full">
            <HugeiconsIcon icon={SentIcon} size={18} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div key={item.name} className="animate-in fade-in duration-300">
        <HugeiconsIcon icon={item.icon} size={28} strokeWidth={1.5} className="text-(--brand)" />
        <p className="mt-6 text-[18px] font-medium">{item.headline}</p>
        <p className="mt-1 text-muted-foreground">{item.line}</p>
      </div>
    </div>
  );
}

export function Segmented() {
  const [v, setV] = useState("Next.js");
  return (
    <div className="inline-flex rounded-[12px] border border-border bg-muted p-1">
      {["Next.js", "Hydrogen", "WordPress"].map((o) => (
        <button
          key={o}
          onClick={() => setV(o)}
          className={`h-9 rounded-[8px] px-4 text-[15px] transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring) ${
            v === o
              ? "bg-background text-foreground shadow-(--shadow-lift)"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
