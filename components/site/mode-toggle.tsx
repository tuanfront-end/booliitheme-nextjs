"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// The way into the dark half, as a disc beside the header's others. Both glyphs
// sit in the disc and the half you are in decides which shows; the one that
// appears turns in from a quarter turn and half its size, so a press reads as
// the sun switching into the moon and back. The glyphs follow the `dark` class
// next-themes writes before the first paint, so they are right from the server
// render; only the label waits for mount.
//
// Keyframes rather than transitions: the provider's disableTransitionOnChange
// strips every transition for the frame the mode flips. The turn is the answer
// to a press, so it waits for the first one: a page load paints the glyph still.
const subscribe = () => () => {};

const turn =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:spin-in-[-90deg] motion-safe:zoom-in-50 motion-safe:duration-spring motion-safe:ease-spring";
const glyph = "size-5";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  const [turned, setTurned] = useState(false);
  const icon = turned ? `${glyph} ${turn}` : glyph;
  const flip = () => {
    setTurned(true);
    setTheme(dark ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={<IconButton variant="soft" aria-label={label} onClick={flip} />}
      >
        <HugeiconsIcon icon={Sun03Icon} strokeWidth={1.5} className={`${icon} dark:hidden`} />
        <HugeiconsIcon icon={Moon02Icon} strokeWidth={1.5} className={`${icon} hidden dark:block`} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
