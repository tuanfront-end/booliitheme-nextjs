import type { Dependency } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

// One dependency as a buyer's package.json would print it — `next@15` — in
// the mono face, because it is machine text. A part with no version to pin
// (Full Site Editing, Shopify Hydrogen) is named in the body face instead.
export function VersionChip({ dep, className }: { dep: Dependency; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-control bg-foreground/6 px-2.5 text-xs whitespace-nowrap text-muted-foreground",
        dep.version && "font-mono",
        className,
      )}
    >
      {dep.version ? `${dep.name.toLowerCase()}@${dep.version}` : dep.name}
    </span>
  );
}
