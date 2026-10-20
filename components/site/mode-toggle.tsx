"use client";

import { ContrastIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

// The way into the dark half. The site opens light whatever the visitor's
// system says — the provider in app/layout.tsx — and a press here is
// remembered. One half-filled disc in both halves, so the glyph is drawn from
// the first paint; only the label, which names the way a press goes, waits for
// the page to mount and read the stored mode.
const subscribe = () => () => {};

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  // Read only once mounted: the server renders the light label, and a label
  // that already said "light mode" on the first client render would not match.
  const dark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <HugeiconsIcon icon={ContrastIcon} strokeWidth={1.5} className="size-4" />
    </Button>
  );
}
