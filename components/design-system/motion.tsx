import { DsTokens, Specimen } from "@/components/design-system/section";
import { cn } from "@/lib/utils";

// Each tile runs its own curve when the pointer reaches it — a duration is
// only legible in motion. Reduced motion stills them all.
const CURVES = [
  { name: "answer", cls: "duration-answer ease-answer", use: "Hover, a colour, a press" },
  { name: "spring", cls: "duration-spring ease-spring", use: "Letting go of a press" },
  { name: "sheet", cls: "duration-sheet ease-sheet", use: "A drawer, a dialog" },
  { name: "arrive", cls: "duration-arrive ease-arrive", use: "A section revealing once" },
] as const;

export function Motion() {
  return (
    <DsTokens
      id="motion"
      title="Motion"
      note="Four named curves, nothing written as a number. Point at a tile to run it."
      source="app/globals.css · --duration-*, --ease-*"
    >
      <Specimen className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CURVES.map((c) => (
          <div
            key={c.name}
            className="group/curve flex flex-col gap-4 rounded-md bg-accent p-5"
          >
            <div className="@container h-10 rounded-control bg-background p-1">
              <div
                className={cn(
                  "size-8 rounded-full bg-primary transition-transform motion-reduce:transition-none",
                  "group-hover/curve:translate-x-[calc(100cqw-2rem)] rtl:group-hover/curve:-translate-x-[calc(100cqw-2rem)]",
                  c.cls,
                )}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <code className="font-mono text-xs text-muted-foreground">{c.name}</code>
              <span className="truncate text-sm">{c.use}</span>
            </div>
          </div>
        ))}
      </Specimen>
    </DsTokens>
  );
}
