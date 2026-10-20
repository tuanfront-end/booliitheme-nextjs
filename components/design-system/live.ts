"use client";

import { useSyncExternalStore } from "react";

// The sheet reads every value off the page as the browser resolved it, so what
// it prints is what the pages draw — never a copy that can fall behind. The
// panel changes the mode, the preset and the colour by writing attributes on
// <html>, so one observer on those is enough to read everything again.
let version = 0;
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!observer) {
    observer = new MutationObserver(() => {
      version++;
      listeners.forEach((l) => l());
    });
    observer.observe(document.documentElement, { attributes: true });
  }
  return () => {
    listeners.delete(listener);
  };
}

/** A number that moves whenever <html> changes; 0 on the server. */
export function useLive() {
  return useSyncExternalStore(subscribe, () => version + 1, () => 0);
}

/** A custom property as resolved on `el`, `var()` references substituted. */
export function readVar(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(`--${name}`).trim();
}

let probe: CanvasRenderingContext2D | null = null;

/** Any CSS colour as sRGB bytes — painted to one pixel and read back, which is
 *  the only conversion that agrees with the browser on hsl, oklch and
 *  color-mix alike. Translucent colours are laid over `ground`. */
export function rgb(color: string, ground = "#fff"): [number, number, number] {
  probe ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 })
    .getContext("2d", { willReadFrequently: true });
  if (!probe) return [0, 0, 0];
  probe.fillStyle = ground;
  probe.fillRect(0, 0, 1, 1);
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]) {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** WCAG contrast of two CSS colours, the second read as the ground. */
export function contrast(ink: string, ground: string) {
  const g = rgb(ground);
  const hex = `rgb(${g.join(",")})`;
  const [a, b] = [luminance(rgb(ink, hex)), luminance(g)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
