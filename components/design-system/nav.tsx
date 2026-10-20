import { cn } from "@/lib/utils";

// The sheet's contents. Plain anchors: every block is a section with an id,
// so the browser does the rest and a link can be shared to one block.
export type NavGroup = { label: string; items: { id: string; label: string }[] };

// The list is longer than a screen once the kit is in, so it scrolls inside its
// own column rather than running off the bottom of a sticky box. The padding is
// room for each link's hover fill and focus ring, which overhang the column.
export function DsNav({ groups, className }: { groups: NavGroup[]; className?: string }) {
  return (
    <nav aria-label="Design system" className={cn("hidden lg:block", className)}>
      <div className="sticky top-24 -mx-4 flex max-h-[calc(100dvh-8rem)] flex-col gap-8 overflow-y-auto overscroll-contain px-4 pb-4 [scrollbar-width:thin]">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{g.label}</span>
            <ul className="flex flex-col">
              {g.items.map((i) => (
                <li key={i.id}>
                  <a
                    href={`#${i.id}`}
                    className="-mx-3 flex h-9 items-center rounded-control px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-muted"
                  >
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
