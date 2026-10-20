import { DsTokens, Specimen } from "@/components/design-system/section";
import { cn } from "@/lib/utils";

const RADII = [
  { cls: "rounded-control", name: "control", use: "Every control" },
  { cls: "rounded-sm", name: "sm", use: "Under 48px" },
  { cls: "rounded-md", name: "md", use: "A tile" },
  { cls: "rounded-lg", name: "lg", use: "A card" },
] as const;

const DEPTH = [
  { cls: "ring-1 ring-border ring-inset", name: "hairline", use: "Resting" },
  { cls: "shadow-soft", name: "shadow-soft", use: "Lifted" },
  { cls: "shadow-soft-lg", name: "shadow-soft-lg", use: "Floating" },
] as const;

export function Shape() {
  return (
    <DsTokens
      id="shape"
      title="Radius and depth"
      note="Corners read against the shortest side; depth is one cue — a hairline or a shadow."
      source="app/globals.css · --radius, --radius-control"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {RADII.map((r) => (
            <div key={r.name} className="flex min-w-0 flex-col gap-3">
              <div className={cn("aspect-square bg-accent ring-1 ring-border ring-inset", r.cls)} />
              <code className="truncate font-mono text-xs text-muted-foreground">{r.name}</code>
              <span className="truncate text-sm">{r.use}</span>
            </div>
          ))}
        </Specimen>
        <Specimen className="grid grid-cols-1 gap-6 bg-background sm:grid-cols-3">
          {DEPTH.map((d) => (
            <div key={d.name} className="flex min-w-0 flex-col gap-3">
              <div className={cn("aspect-square rounded-md bg-card", d.cls)} />
              <code className="truncate font-mono text-xs text-muted-foreground">{d.name}</code>
              <span className="truncate text-sm">{d.use}</span>
            </div>
          ))}
        </Specimen>
      </div>
    </DsTokens>
  );
}
