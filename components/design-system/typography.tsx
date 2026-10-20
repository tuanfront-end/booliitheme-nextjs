"use client";

import { useEffect, useRef, useState } from "react";

import { useLive } from "@/components/design-system/live";
import { DsTokens, Specimen } from "@/components/design-system/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

// A line takes its size from how it is read — recognised, read in passing, or
// read through — so the roles are drawn here, not a ladder of sizes.
const ROLES = [
  {
    role: "Display",
    spec: "font-heading · 36 to 60",
    sample: (
      <p className="font-heading text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
        Plan less, arrive more
      </p>
    ),
  },
  {
    role: "Section heading",
    spec: "SectionHeading · 30 to 48",
    sample: <SectionHeading as="h3">The weekend, sorted</SectionHeading>,
  },
  {
    role: "Tile title",
    spec: "text-xl · 20",
    sample: <p className="text-xl font-medium tracking-tight">Free cancellation</p>,
  },
  {
    role: "Body copy",
    spec: "text-base · 16",
    sample: (
      <p className="max-w-xl text-base text-muted-foreground">
        Change plans up to a day before and the full amount comes back to you.
      </p>
    ),
  },
  {
    role: "Product object",
    spec: "text-sm · 14",
    sample: <p className="text-sm">Two nights · Breakfast included · From $184</p>,
  },
  {
    role: "Caption",
    spec: "text-xs · 12",
    sample: <Eyebrow>Popular this week</Eyebrow>,
  },
] as const;

// The face's name, read off an element set in it: the heading variable points
// at itself until a pairing is chosen, so only the drawn text knows.
function Face({ face, label }: { face: "font-heading" | "font-sans"; label: string }) {
  const live = useLive();
  const ref = useRef<HTMLSpanElement>(null);
  const [family, setFamily] = useState("");
  useEffect(() => {
    const el = ref.current;
    if (el) setFamily(getComputedStyle(el).fontFamily.split(",")[0].replaceAll(/["']/g, ""));
  }, [live]);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span ref={ref} className={cn("text-xl tracking-tight", face)}>
        {family || "\u00a0"}
      </span>
    </div>
  );
}

export function Typography() {
  return (
    <DsTokens
      id="typography"
      title="Typography"
      note="Two faces at most, two weights, two ink levels. Size says how a line is read."
      source="app/globals.css · --font-heading, --font-sans"
    >
      <Specimen className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          <Face face="font-heading" label="Heading face" />
          <Face face="font-sans" label="Body face" />
        </div>
        <ul className="flex flex-col">
          {ROLES.map((r) => (
            <li
              key={r.role}
              className="grid grid-cols-1 gap-3 border-t border-border py-6 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{r.role}</span>
                <code className="font-mono text-xs text-muted-foreground">{r.spec}</code>
              </div>
              <div className="min-w-0">{r.sample}</div>
            </li>
          ))}
        </ul>
      </Specimen>
    </DsTokens>
  );
}
