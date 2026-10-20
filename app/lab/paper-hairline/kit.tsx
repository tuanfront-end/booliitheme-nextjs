import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Header } from "./section-header";
import { PlatformSegmented } from "./showcase";

// The kit at a glance, in both halves.
export function Kit() {
  return (
    <section>
      <Header eyebrow="The kit" title="Controls, faces and tokens" lede="What every section above is built from, in the light half and the dark one." />
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {["", "dark"].map((half) => (
          <div key={half} className={`${half} rounded-lg border border-border bg-background p-8 text-foreground`}>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button disabled>Disabled</Button>
              <a href="#plans" className="text-sm underline-offset-4 hover:underline">
                Text link
              </a>
            </div>
            <div className="mt-6">
              <PlatformSegmented />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Storefront", "Booking", "Magazine"].map((c, i) => (
                <Badge key={c} tone={i === 0 ? "brand" : "neutral"}>
                  {c}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex h-10 items-center gap-2 rounded-control border border-input px-3 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} />
              <span className="text-sm">Search templates</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
              <div>
                <p className="text-xs text-muted-foreground">Original</p>
                <p className="font-heading mt-1 text-[40px]/[var(--heading-leading-display)]">Booking, done</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Condensed</p>
                <p className="font-heading mt-1 text-[40px]/[var(--heading-leading-display)]" data-preset="condensed">Booking, done</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {["background", "foreground", "muted-foreground", "border", "muted", "brand", "brand-soft", "brand-wash"].map((t) => (
                <div key={t}>
                  <span className="block h-10 rounded-md border border-border" style={{ background: `var(--${t})` }} />
                  <p className="font-mono mt-1 text-xs text-muted-foreground">{t}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
