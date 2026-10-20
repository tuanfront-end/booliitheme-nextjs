import { DsTokens, Specimen } from "@/components/design-system/section";
import { cn } from "@/lib/utils";

const HEIGHTS = [
  { h: "h-9", px: 36, use: "A small or header control" },
  { h: "h-10", px: 40, use: "Every control by default" },
  { h: "h-11", px: 44, use: "A section's one call to action" },
] as const;

const GAPS = [
  { w: "w-3", px: 12, use: "Inside a group" },
  { w: "w-6", px: 24, use: "Between items of a row" },
  { w: "w-12", px: 48, use: "The header gap, mt-head" },
  { w: "w-32", px: 128, use: "Between sections, 160 from sm" },
] as const;

export function Spacing() {
  return (
    <DsTokens
      id="spacing"
      title="Spacing and size"
      note="Space around a group exceeds space within it. Controls draw at 40, never under 36."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen className="flex flex-col gap-5">
          <span className="text-sm font-medium">Control heights</span>
          {HEIGHTS.map((r) => (
            <div key={r.px} className="flex items-center gap-4">
              <div className={cn("w-16 shrink-0 rounded-control bg-primary", r.h)} />
              <code className="w-10 font-mono text-xs text-muted-foreground">{r.px}</code>
              <span className="truncate text-sm">{r.use}</span>
            </div>
          ))}
        </Specimen>
        <Specimen className="flex flex-col gap-5">
          <span className="text-sm font-medium">Gaps</span>
          {GAPS.map((r) => (
            <div key={r.px} className="flex items-center gap-4">
              <div className="flex w-32 shrink-0 items-center">
                <div className={cn("h-3 rounded-full bg-iris/40", r.w)} />
              </div>
              <code className="w-10 font-mono text-xs text-muted-foreground">{r.px}</code>
              <span className="truncate text-sm">{r.use}</span>
            </div>
          ))}
        </Specimen>
      </div>
    </DsTokens>
  );
}
