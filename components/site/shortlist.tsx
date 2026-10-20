"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useEndEdge } from "@/components/site/direction";
import { CountBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { platforms, projectBySlug, type Project } from "@/lib/data/projects";
import { formatMoney } from "@/lib/format";
import { clearShortlist, toggleShortlist, useShortlist } from "@/lib/shortlist";

// The header's way into the templates a visitor saved while comparing: a
// count on the glyph, and a panel from the reading end listing each with its
// price and the two ways on — the demo and the page.
export function ShortlistButton() {
  const slugs = useShortlist();
  const saved = slugs.map(projectBySlug).filter((p): p is Project => Boolean(p));
  const end = useEndEdge();

  return (
    <Drawer swipeDirection={end}>
      <DrawerTrigger
        render={
          <IconButton
            aria-label={saved.length ? `Shortlist, ${saved.length} saved` : "Shortlist"}
            className="relative"
          />
        }
      >
        <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={1.5} className="size-4" />
        <CountBadge count={saved.length} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-start justify-between gap-4 px-6 pt-6">
          <div>
            <DrawerTitle>Shortlist</DrawerTitle>
            <DrawerDescription>
              {saved.length
                ? `${saved.length} saved in this browser`
                : "Saved templates stay in this browser"}
            </DrawerDescription>
          </div>
          <DrawerClose render={<IconButton aria-label="Close shortlist" size="sm" />}>
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        {saved.length ? (
          <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
            {saved.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 rounded-sm bg-accent p-2">
                <span className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-[10px] bg-muted">
                  <Image src={p.shots[0]} alt="" fill sizes="5rem" className="object-cover object-left-top" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <DrawerClose
                    render={<Link href={`/work/${p.slug}`} />}
                    className="truncate font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {p.name}
                  </DrawerClose>
                  <span className="truncate text-muted-foreground">
                    {p.platforms.map((x) => platforms[x]).join(" + ")}
                    {p.market.price ? ` · ${formatMoney(p.market.price, "USD", { maximumFractionDigits: 0 })}` : ""}
                  </span>
                </span>
                <IconButton aria-label={`Remove ${p.name}`} size="sm" onClick={() => toggleShortlist(p.slug)}>
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-4" />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 items-center px-6">
            <EmptyState
              title="Nothing saved yet"
              text="Press the bookmark on any template to keep it here while you compare."
            />
          </div>
        )}

        <DrawerFooter className="flex-row gap-2 px-6 pb-6">
          {saved.length > 0 && (
            <Button variant="secondary" onClick={clearShortlist}>
              Clear all
            </Button>
          )}
          <DrawerClose render={<Button render={<Link href="/#templates" />} nativeButton={false} />} className="flex-1">
            Browse templates
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
