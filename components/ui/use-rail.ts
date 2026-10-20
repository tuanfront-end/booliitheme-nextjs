// useRail — the state a sideways rail's arrows read: which ends it has reached, a step of one page either way, and whether it overflows at all.
"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { useRailFade } from "@/components/ui/rail-fade";

export type Rail<T extends HTMLElement = HTMLElement> = {
  /** Goes on the element that scrolls. */
  ref: RefObject<T | null>;
  /** Whether the rail sits at its first and at its last item. */
  ends: { start: boolean; end: boolean };
  /** Nothing overflows, so there is nowhere to step to and no arrow to draw. */
  none: boolean;
  /** Scroll one visible width toward the end (1) or back toward the start (-1). */
  page: (dir: 1 | -1) => void;
};

/** A row that scrolls sideways under two arrows.
 *
 *  The ends are read after paint, on every scroll, whenever the rail's own box
 *  changes size and whenever its items are swapped, so a rail refilled by a
 *  filter disables the right arrow rather than the one it had before.
 *
 *  It starts as "at the start, with more to come", which is the common case, so
 *  a rail that does overflow draws its arrows in the first paint instead of
 *  popping them in after hydration.
 *
 *  It marks the sides that have more past them as well, so the rail fades
 *  them once it carries `railFade` beside the ref.
 *
 *  Take the ref off as you call it — `const { ref, ...rail } = useRail()`,
 *  then `<ul ref={ref}>` and `<CarouselNav rail={rail} />`. The whole object
 *  handed around with its ref inside reads, to the React Compiler's lint, as a
 *  ref touched during render. */
export function useRail<T extends HTMLElement>(): Rail<T> {
  const ref = useRef<T>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  useRailFade(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // scrollLeft runs from 0 toward the negative on a right-to-left page, so
      // the distance travelled is read without its sign.
      const travelled = Math.abs(el.scrollLeft);
      const start = travelled <= 1;
      const end = travelled + el.clientWidth >= el.scrollWidth - 1;
      setEnds((was) => (was.start === start && was.end === end ? was : { start, end }));
    };
    const frame = requestAnimationFrame(measure);
    const swapped = new MutationObserver(measure);
    swapped.observe(el, { childList: true });
    const resized = new ResizeObserver(measure);
    resized.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      swapped.disconnect();
      resized.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, []);

  const page = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // "Next" moves toward the end of the row, which is leftward on a
    // right-to-left page, so the step reads the direction before it moves.
    const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * sign * el.clientWidth, behavior: still ? "auto" : "smooth" });
  }, []);

  return { ref, ends, none: ends.start && ends.end, page };
}
