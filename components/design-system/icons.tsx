import { ArrowRightIcon, ChevronDownIcon, PlayIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  Add01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Clock01Icon,
  FavouriteIcon,
  Home01Icon,
  Location01Icon,
  Mail01Icon,
  Menu01Icon,
  Search01Icon,
  ShoppingBag01Icon,
  Tick02Icon,
  Ticket01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DsTokens, Specimen } from "@/components/design-system/section";

// Two families, split by glyph rather than mixed: Heroicons for four — the
// arrow, the chevron, play, and the rating star, which is solid — and
// HugeIcons stroke-rounded for every other glyph on the site.
const HEROICONS = [
  ["Arrow", ArrowRightIcon],
  ["Chevron", ChevronDownIcon],
  ["Play", PlayIcon],
  ["Rating star", StarIcon],
] as const;

const HUGEICONS = [
  ["Close", Cancel01Icon],
  ["Check", Tick02Icon],
  ["Search", Search01Icon],
  ["Add", Add01Icon],
  ["Menu", Menu01Icon],
  ["Save", FavouriteIcon],
  ["Date", Calendar03Icon],
  ["Time", Clock01Icon],
  ["Place", Location01Icon],
  ["Home", Home01Icon],
  ["Person", UserIcon],
  ["Message", Mail01Icon],
  ["Order", ShoppingBag01Icon],
  ["Ticket", Ticket01Icon],
] as const;

export function Icons() {
  return (
    <DsTokens
      id="icons"
      title="Icons"
      note="HugeIcons for every glyph; Heroicons for arrows, chevrons, play and the rating star."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen className="flex flex-col gap-5">
          <span className="text-sm font-medium">Heroicons · four glyphs</span>
          <ul className="grid grid-cols-4 gap-y-5">
            {HEROICONS.map(([name, Icon]) => (
              <li key={name} className="flex flex-col items-center gap-2">
                <Icon aria-hidden className="size-5" />
                <span className="text-xs text-muted-foreground">{name}</span>
              </li>
            ))}
          </ul>
        </Specimen>
        <Specimen className="flex flex-col gap-5">
          <span className="text-sm font-medium">HugeIcons · every other glyph</span>
          <ul className="grid grid-cols-4 gap-y-5 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7">
            {HUGEICONS.map(([name, icon]) => (
              <li key={name} className="flex flex-col items-center gap-2">
                <HugeiconsIcon icon={icon} aria-hidden className="size-5" />
                <span className="text-xs text-muted-foreground">{name}</span>
              </li>
            ))}
          </ul>
        </Specimen>
      </div>
    </DsTokens>
  );
}
