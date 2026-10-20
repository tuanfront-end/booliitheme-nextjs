"use client";

import Link from "next/link";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// The header's mega menu, drawn small: one trigger opening two columns, and a
// plain link beside it in the trigger's own clothes.
export function NavigationMenuBlock() {
  return (
    <DsBlock
      id="navigation-menu"
      title="Navigation menu"
      when="the header has to reach more pages than a bar can hold — grouped under one trigger, with the keyboard model of a site nav rather than of a menu."
      source="components/ui/navigation-menu.tsx"
      edges={
        <Specimen>
          <p className="text-sm text-muted-foreground">
            A long name truncates inside its column rather than widening the panel; a chip after it
            keeps its place at the row&apos;s end. Under lg the same routes move to the Drawer.
          </p>
        </Specimen>
      }
    >
      <Specimen className="min-h-24">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[30rem] grid-cols-2 divide-x divide-border">
                  <div className="px-2">
                    <NavigationMenuLabel>Next.js</NavigationMenuLabel>
                    <ul>
                      <li>
                        <NavigationMenuLink render={<Link href="#navigation-menu" />}>Ciseco</NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink render={<Link href="#navigation-menu" />}>Chisfis</NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                  <div className="px-2">
                    <NavigationMenuLabel>WordPress</NavigationMenuLabel>
                    <ul>
                      <li>
                        <NavigationMenuLink render={<Link href="#navigation-menu" />} className="justify-between gap-3">
                          <span className="truncate">Bitpan WooCommerce</span>
                          <Badge tone="leaf">New</Badge>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href="#navigation-menu" />} className={navigationMenuTriggerStyle}>
                License
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Specimen>
    </DsBlock>
  );
}
