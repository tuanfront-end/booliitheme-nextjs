"use client";

import { DirectionProvider, useDirection } from "@base-ui/react/direction-provider";
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

/** The physical edge a panel from the reading end comes in from — the right
 *  in a left-to-right page, the left in a right-to-left one. A drawer's swipe
 *  direction names an edge, so the caller asks for it here. */
export function useEndEdge(): "left" | "right" {
  return useDirection() === "rtl" ? "left" : "right";
}
