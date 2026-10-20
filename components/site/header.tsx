"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/logo";
import { LogoMark } from "@/components/site/logo-mark";
import { MobileNav } from "@/components/site/mobile-nav";
import { ModeToggle } from "@/components/site/mode-toggle";
import { Button } from "@/components/ui/button";
import { barLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex h-10 items-center rounded-control px-3 text-sm text-muted-foreground press hover:text-foreground";

// Paper, the logo, three anchors and one action. Past the first scroll the bar
// draws its hairline underneath, and nothing else about it changes.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-colors duration-answer ease-answer",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-6 sm:px-8">
        <Link
          href="/"
          aria-label="BooliiTheme, home"
          className="-mx-2 flex h-10 shrink-0 items-center gap-2 rounded-control px-2 text-foreground press hover:bg-accent"
        >
          <LogoMark className="size-8 shrink-0" />
          <Logo aria-hidden className="h-5 w-auto max-[359px]:hidden" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center">
            {barLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <ModeToggle />
          <Button render={<Link href="/#contact" />} nativeButton={false} size="sm" className="ms-2 hidden sm:inline-flex">
            Message us
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
