"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useEndEdge } from "@/components/site/direction";
import { Eyebrow } from "@/components/site/eyebrow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { marketplaces, studioLinks, templatesByPlatform } from "@/lib/nav";

// The header under lg: every link the mega menu and the bar carry, in one
// panel from the reading end. The mode toggle stays in the bar beside this
// button, so a visitor who went dark on a phone leaves it from where they are.
const row =
  "flex min-h-10 items-center justify-between gap-3 rounded-sm px-3 text-base text-foreground transition-colors duration-answer ease-answer hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";

export function MobileNav() {
  const end = useEndEdge();

  return (
    <Drawer swipeDirection={end}>
      <DrawerTrigger render={<IconButton aria-label="Open menu" className="lg:hidden" />}>
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={1.5} className="size-4" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-center justify-between px-6 pt-5">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose render={<IconButton aria-label="Close menu" />}>
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <nav
          aria-label="Main"
          className="flex flex-1 flex-col gap-8 overflow-y-auto px-3 pt-4 pb-12 [mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]"
        >
          <ul>
            {studioLinks.map((link) => (
              <li key={link.href}>
                <DrawerClose render={<Link href={link.href} />} className={row}>
                  {link.label}
                </DrawerClose>
              </li>
            ))}
          </ul>

          {templatesByPlatform.map((group) => (
            <div key={group.platform}>
              <Eyebrow className="px-3 pb-2">{group.label}</Eyebrow>
              <ul>
                {group.items.map((p) => (
                  <li key={p.slug}>
                    <DrawerClose render={<Link href={`/work/${p.slug}`} />} className={row}>
                      {p.name}
                      {p.isNew && <Badge tone="leaf">New</Badge>}
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <Eyebrow className="px-3 pb-2">Marketplaces</Eyebrow>
            <ul>
              {marketplaces.map((m) => (
                <li key={m.label}>
                  <a href={m.href} target="_blank" rel="noopener noreferrer" className={row}>
                    {m.label}
                    <ArrowUpRightIcon aria-hidden="true" className="size-4 text-muted-foreground rtl:-scale-x-100" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <DrawerFooter className="px-6 pb-6">
          <DrawerClose render={<Button render={<Link href="/#templates" />} nativeButton={false} size="lg" />}>
            Browse templates
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
