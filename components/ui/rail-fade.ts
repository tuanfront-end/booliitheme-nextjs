// railFade — a sideways rail fades the edge that has more past it, so a cut tab reads as one that scrolls rather than one that is broken.
"use client";

import { useEffect, type RefObject } from "react";

/** Goes on the element that scrolls, beside `useRailFade` on the same node.
 *
 *  A mask, not an overlay, so it fades into any ground — a tint, a card, a
 *  photograph — with no colour to match. Its two stops are 0 until the hook
 *  marks a side, and a marked side fades over 2.5rem. `linear-gradient` has no
 *  logical direction, so the sides are physical: left and right as the eye
 *  sees them, on a page of either direction. */
export const railFade =
  "[mask-image:linear-gradient(to_right,transparent,#000_var(--fade-left,0px),#000_calc(100%-var(--fade-right,0px)),transparent)] data-fade-left:[--fade-left:2.5rem] data-fade-right:[--fade-right:2.5rem]";

/** How far a marked side fades, as the class above writes it — for code that
 *  scrolls an item clear of the fade. */
export const railFadeRem = 2.5;

// A rail a few pixels short of its end reads as at it: subpixel widths leave
// the last scroll a fraction under its maximum.
const SLACK = 4;

/** Marks which sides of a sideways scroller have more past them, as
 *  `data-fade-left` and `data-fade-right`, which `railFade` fades. A rail that
 *  fits carries neither, and an edge at its end stays sharp.
 *
 *  Read on every scroll, whenever the scroller or one of its items changes
 *  size, and whenever its items are swapped. A right-to-left rail counts its
 *  scroll from the right, toward the negative, so the distance travelled is
 *  read without its sign. */
export function useRailFade(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const max = el.scrollWidth - el.clientWidth;
      const travelled = Math.abs(el.scrollLeft);
      const atStart = travelled <= SLACK;
      const atEnd = max <= SLACK || travelled >= max - SLACK;
      const rtl = getComputedStyle(el).direction === "rtl";
      el.toggleAttribute("data-fade-left", rtl ? !atEnd : !atStart);
      el.toggleAttribute("data-fade-right", rtl ? !atStart : !atEnd);
    };
    const resized = new ResizeObserver(read);
    const watch = () => {
      resized.disconnect();
      resized.observe(el);
      for (const child of Array.from(el.children)) resized.observe(child);
    };
    // A rail refilled by a filter keeps its own box, so only its new items
    // say the overflow changed.
    const swapped = new MutationObserver(() => {
      watch();
      read();
    });
    watch();
    read();
    swapped.observe(el, { childList: true });
    el.addEventListener("scroll", read, { passive: true });
    return () => {
      resized.disconnect();
      swapped.disconnect();
      el.removeEventListener("scroll", read);
    };
  }, [ref]);
}
