"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// The way into the dark half, as a disc beside the header's others. The site
// opens light whatever the visitor's system says — the provider in
// app/layout.tsx — and a press here is remembered. The glyph is the half you
// are in: a sun by day, a moon by night. Both wait for the
// page to mount, since the server cannot know which was stored.
const subscribe = () => () => {};

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip>
      <TooltipTrigger
        render={<IconButton variant="secondary" aria-label={label} onClick={() => setTheme(dark ? "light" : "dark")} />}
      >
        <HugeiconsIcon
          icon={dark ? Moon02Icon : Sun03Icon}
          strokeWidth={1.5}
          className="size-5"
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
