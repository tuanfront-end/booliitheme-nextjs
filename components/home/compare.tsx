"use client";

import { useState } from "react";

import { VersionChip } from "@/components/site/version-chip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Price } from "@/components/ui/price";
import { platformOf } from "@/lib/data/catalogue";
import { industries, type Project } from "@/lib/data/projects";
import { formatDate } from "@/lib/format";

export const COMPARE_MAX = 3;

// The tray a compare tick brings up, pinned to the foot of the screen while at
// least one template is picked, and the dialog it opens: up to three templates
// side by side on what a buyer weighs between them — where each one runs, what
// it pins, what it is for, what it costs and when it was last updated. A row
// the marketplace never showed a figure for prints a dash in that column.
export function CompareTray({
  picked,
  onRemove,
  onClear,
}: {
  picked: Project[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (picked.length === 0) return null;

  const rows: { label: string; cell: (p: Project) => React.ReactNode }[] = [
    { label: "Platform", cell: (p) => `${platformOf(p)} · ${p.build}` },
    {
      label: "Versions",
      cell: (p) => (
        <span className="flex flex-wrap gap-1">
          {p.stack.map((d) => (
            <VersionChip key={d.name} dep={d} />
          ))}
        </span>
      ),
    },
    { label: "Industry", cell: (p) => industries[p.industry] },
    {
      label: "Regular license",
      cell: (p) => (p.market.price ? <Price amount={p.market.price} /> : "—"),
    },
    { label: "Last update", cell: (p) => (p.market.updated ? formatDate(p.market.updated) : "—") },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        role="region"
        aria-label="Compare"
        className="pointer-events-auto flex max-w-full items-center gap-3 rounded-control bg-card py-2 ps-5 pe-2 shadow-soft-lg"
      >
        <p className="min-w-0 truncate text-sm">
          <span className="font-medium tabular-nums">
            {picked.length} of {COMPARE_MAX}
          </span>
          <span className="text-muted-foreground max-sm:hidden"> · {picked.map((p) => p.name).join(", ")}</span>
        </p>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button size="sm" onClick={() => setOpen(true)}>
            Compare
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compare templates</DialogTitle>
              <DialogDescription>
                {picked.length === 1
                  ? "Tick up to two more cards to set them side by side."
                  : "Figures as ThemeForest showed them; a dash means the item page showed none."}
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div
                className="grid gap-x-4 text-sm"
                style={{ gridTemplateColumns: `repeat(${picked.length}, minmax(0, 1fr))` }}
              >
                {picked.map((p) => (
                  <div key={p.slug} className="flex flex-col items-start gap-1 pb-4">
                    <p className="font-medium">{p.name}</p>
                    <Button variant="link" size="sm" onClick={() => onRemove(p.slug)}>
                      Remove<span className="sr-only"> {p.name}</span>
                    </Button>
                  </div>
                ))}
                {rows.map((row) => (
                  <div key={row.label} className="col-span-full grid grid-cols-subgrid border-t border-border py-4">
                    <p className="col-span-full mb-2 text-xs text-muted-foreground">{row.label}</p>
                    {picked.map((p) => (
                      <div key={p.slug} className="min-w-0">
                        {row.cell(p)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={onClear} className="me-auto">
                Clear all
              </Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
