"use client";
// ref: navbars/four-column-mega-menu-under-a-wordmark-left-nav-right-bar.png — panel 4-col · right-heavy

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { HeaderMorph } from "@/components/site/header-morph";
import { Logo } from "@/components/site/logo";
import { LogoMark } from "@/components/site/logo-mark";
import { MobileNav } from "@/components/site/mobile-nav";
import { ModeToggle } from "@/components/site/mode-toggle";
import { ShortlistButton } from "@/components/site/shortlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatDay } from "@/lib/format";
import { barLinks, marketplaces, newest, templatesByPlatform } from "@/lib/nav";
import { cn } from "@/lib/utils";

// At rest the bar is the container line and nothing else; past the first
// scroll it pulls in to a glass pill. The <header> keeps one height for the
// life of the page — 64px, 72px from sm — and the pill shrinks inside it, so
// nothing below moves and the threshold cannot oscillate.
export function SiteHeader() {
  const morph = useContext(HeaderMorph);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 sm:h-18">
      <div
        data-scrolled={morph && scrolled ? "true" : undefined}
        className={cn(
          "mx-auto flex h-14 w-full max-w-7xl items-center gap-3 rounded-control px-6 sm:h-16 sm:gap-6 sm:px-8",
          "transition-[max-width,height,margin,padding,background-color,border-color,box-shadow] duration-morph ease-sheet motion-reduce:duration-0",
          "data-[scrolled=true]:mt-3 data-[scrolled=true]:h-12 data-[scrolled=true]:max-w-[calc(100%-1.5rem)] data-[scrolled=true]:bg-card/60 data-[scrolled=true]:ps-5 data-[scrolled=true]:pe-1 data-[scrolled=true]:shadow-soft-lg data-[scrolled=true]:ring-1 data-[scrolled=true]:ring-white/50 data-[scrolled=true]:backdrop-blur-xl data-[scrolled=true]:backdrop-saturate-125 data-[scrolled=true]:ring-inset sm:data-[scrolled=true]:h-14 sm:data-[scrolled=true]:max-w-5xl sm:data-[scrolled=true]:pe-2",
        )}
      >
        <Link
          href="/"
          className="-mx-2 flex h-10 shrink-0 items-center gap-2 rounded-sm px-2 text-foreground press hover:bg-accent active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <LogoMark className="size-9 shrink-0" />
          <Logo className="h-6 w-auto max-[359px]:hidden" />
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
              <NavigationMenuContent>
                <TemplatesPanel />
              </NavigationMenuContent>
            </NavigationMenuItem>
            {barLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink render={<Link href={link.href} />} className={navigationMenuTriggerStyle}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ms-auto flex items-center gap-1">
          <ShortlistButton />
          <ModeToggle />
          <Button render={<Link href="/#templates" />} nativeButton={false} size="sm" className="ms-2 hidden sm:inline-flex">
            Browse templates
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

// Every template, under the platform its buyer installs it on, with the
// marketplaces beside the shortest column and the newest release as the one
// picture in the panel. Column rules are the reference's; each column is a
// rail of rows rather than a card.
function TemplatesPanel() {
  const [nextjs, wordpress, shopify] = templatesByPlatform;

  return (
    <div className="grid w-[65rem] max-w-full grid-cols-4 divide-x divide-border">
      <PanelColumn label={nextjs.label} items={nextjs.items} />
      <PanelColumn label={wordpress.label} items={wordpress.items} />
      <div className="flex flex-col gap-4 px-2">
        <PanelColumn label={shopify.label} items={shopify.items} className="px-0" />
        <div>
          <NavigationMenuLabel>Marketplaces</NavigationMenuLabel>
          <ul>
            {marketplaces.map((m) => (
              <li key={m.label}>
                <NavigationMenuLink
                  render={<a href={m.href} target="_blank" rel="noopener noreferrer" />}
                  className="justify-between"
                >
                  {m.label}
                  <ArrowUpRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  <span className="sr-only">(opens in a new tab)</span>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ps-2">
        <NavigationMenuLink
          render={<Link href={`/work/${newest.slug}`} />}
          className="group/latest flex-col items-stretch gap-3 rounded-[16px] p-2 hover:bg-accent"
        >
          <span className="relative block aspect-[4/3] overflow-hidden rounded-[8px] border border-border bg-muted">
            <Image
              src={newest.shots[0]}
              alt=""
              fill
              sizes="13rem"
              className="object-cover object-left-top"
            />
          </span>
          <span className="flex flex-col gap-1 px-1 pb-1">
            <Badge tone="leaf" className="self-start">
              Latest release
            </Badge>
            <span className="font-medium">{newest.name}</span>
            <span className="text-muted-foreground">
              {newest.market.updated
                ? `Updated ${formatDay(new Date(newest.market.updated), { month: "short", day: "numeric", year: "numeric" })}`
                : newest.tagline}
            </span>
          </span>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function PanelColumn({
  label,
  items,
  className,
}: {
  label: string;
  items: (typeof templatesByPlatform)[number]["items"];
  className?: string;
}) {
  return (
    <div className={cn("px-2", className)}>
      <NavigationMenuLabel>{label}</NavigationMenuLabel>
      <ul>
        {items.map((p) => (
          <li key={p.slug}>
            <NavigationMenuLink render={<Link href={`/work/${p.slug}`} />} className="justify-between gap-3">
              <span className="truncate">{p.name}</span>
              {p.isNew && <Badge tone="leaf">New</Badge>}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
