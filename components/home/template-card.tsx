import Link from "next/link";

import { price, Shot, templateHref } from "@/components/templates/detail";
import type { Project } from "@/lib/data/projects";

// One card of the grid: the template's picture, its name and its price. A
// plain module on purpose, so the grid's first row renders on the server and
// the folded rest renders from a chunk that loads when they are unfolded.
// The cursor pill is the grid's, found by `data-card`.
export function TemplateCard({ p, preload, first }: { p: Project; preload?: boolean; first?: boolean }) {
  return (
    <li>
      <Link
        href={templateHref(p)}
        scroll={false}
        data-card
        data-first={first || undefined}
        className="group/shot block rounded-lg press focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring pointer-fine:cursor-none"
      >
        <Shot p={p} sizes="(min-width: 1024px) 28rem, (min-width: 640px) 45vw, 78vw" preload={preload} />
        <span className="mt-4 flex items-baseline justify-between gap-4 text-sm">
          <span className="font-medium">{p.name}</span>
          <span className="text-muted-foreground tabular-nums">{price(p)}</span>
        </span>
      </Link>
    </li>
  );
}
