"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

// Base UI's sliders, menus, selects and keyboard navigation read the direction
// from this provider rather than from the page, so it follows `dir` on <html>:
// what preset.json built, or what the preset panel set since.
const watch = (change: () => void) => {
  const seen = new MutationObserver(change);
  seen.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
  return () => seen.disconnect();
};
const read = () => (document.documentElement.dir === "rtl" ? "rtl" : "ltr");

export function Direction({ built, children }: { built: "ltr" | "rtl"; children: ReactNode }) {
  const direction = useSyncExternalStore(watch, read, () => built);
  return <DirectionProvider direction={direction}>{children}</DirectionProvider>;
}
