import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Home01Icon,
  Mail01Icon,
  NewTwitterIcon,
  ShoppingBag01Icon,
  WebDesign01Icon,
} from "@hugeicons/core-free-icons";

import { Column } from "@/components/site/column";
import { ModeToggle } from "@/components/site/mode-toggle";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { author } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";
import { sections, socials } from "@/lib/nav";

const glyphs: Record<string, IconSvgElement> = {
  Home: Home01Icon,
  Templates: WebDesign01Icon,
  "Write to me": Mail01Icon,
  X: NewTwitterIcon,
};

// One glyph in a tinted disc, named by a tooltip. A link inside the site is a
// <Link>; one that leaves it opens a new tab and says so aloud.
function Disc({ label, href, className }: { label: string; href: string; className?: string }) {
  const away = href.startsWith("http");
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <IconButton
            variant="soft"
            aria-label={away ? `${label} (opens in a new tab)` : label}
            className={className}
            nativeButton={false}
            render={away ? <a href={href} target="_blank" rel="noopener noreferrer" /> : <Link href={href} />}
          />
        }
      >
        <HugeiconsIcon icon={glyphs[label]} strokeWidth={1.5} aria-hidden className="size-5" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const sales = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
  .format(author.sales)
  .toLowerCase();

// The way round the page as three discs on the start side; across from them
// the mode, where I post, and the one figure I let speak for me — sales on
// ThemeForest — in a pill that goes there.
export function SiteHeader() {
  return (
    // The discs carry no words, so their names come up almost at once: 120ms
    // is long enough that sweeping across the row does not flash every one.
    <TooltipProvider delay={120}>
      <Column as="header" className="py-6 print:hidden" innerClassName="flex items-center justify-between gap-3">
        <nav aria-label="Primary">
          <ul className="flex gap-1.5 min-[380px]:gap-2">
            {sections.map((s) => (
              <li key={s.label} className={s.href === "/" ? "max-[359px]:hidden" : undefined}>
                <Disc label={s.label} href={s.href} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 min-[380px]:gap-2">
          <ModeToggle />
          {socials
            .filter((s) => s.label in glyphs)
            .map((s) => (
              <Disc key={s.label} label={s.label} href={s.href} className="max-sm:hidden" />
            ))}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="soft"
                  nativeButton={false}
                  render={<a href={author.url} target="_blank" rel="noopener noreferrer" />}
                />
              }
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.5} aria-hidden data-icon="inline-start" className="size-5" />
              {/* One span, so the figure and its unit sit a word space apart
                  rather than the pill's gap. */}
              <span>
                <span className="tabular-nums">{sales}</span>
                <span className="max-[379px]:sr-only"> sales</span>
              </span>
              <span className="sr-only">on ThemeForest (opens in a new tab)</span>
            </TooltipTrigger>
            <TooltipContent>{formatNumber(author.sales)} sales on ThemeForest</TooltipContent>
          </Tooltip>
        </div>
      </Column>
    </TooltipProvider>
  );
}
