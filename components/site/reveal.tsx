// ref: none — n/a (a wrapper the page puts round a section; it draws nothing of its own)
"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The JavaScript half of the section reveal. The other half is the
// `[data-reveal]` rules in `app/globals.css`, and the comment above them is
// where the arrangement is argued — read it before changing anything here.
//
// The contract: nothing in this file may hide content it cannot bring back.
// Three things enforce it, and each one is here because a specific version
// without it failed.
//
// **The observer is attached before anything is hidden.** `pending` is only
// ever written from inside a callback, so callbacks that never arrive leave
// every section exactly as the server drew it. Writing `pending` up front and
// relying on the observer to undo it looks equivalent and is not: it makes the
// whole page below the fold invisible the moment the callback does not land,
// and it does it silently.
//
// **Nothing arms while the document is hidden.** An IntersectionObserver in a
// tab that is not being rendered reports every target as not intersecting,
// because there is no viewport to intersect — so the callback above writes
// `pending` on a lie and the sections stay at opacity 0 until something forces
// a fresh computation. Cmd-clicking a link, restoring a session and the
// browser's own prerender all open a document in exactly that state.
//
// **The root's top edge is pushed far above the page.** An observer fires on
// threshold crossings, so a section travelling from below the fold to above the
// viewport inside one frame crosses none — an in-page anchor, the skip link, a
// restored scroll position. Extending the root upwards makes *above the fold*
// inside the root, so the jump is a change like any other. It buys that with
// geometry rather than with a scroll listener per section, each of which would
// read layout on every scroll event.
//
// It is not `animation-timeline: view()`, which needs no JavaScript at all and
// is the better technique. Its hidden state is CSS, so a browser that supports
// the property but resolves the timeline differently renders a blank section —
// the same failure, arrived at from the other direction.
//
// Printing is answered in `globals.css` rather than here: a print render never
// scrolls, so the observer never fires and whatever was `pending` prints as a
// section-sized blank.
const ROOT_MARGIN = "100000px 0px -10% 0px";

// One observer for the page, not one per section. Every Reveal asks the same
// question with the same margins, and an observer with identical options
// watches any number of targets. Built on the first arm and torn down when the
// last target leaves, so a route with no reveal on it carries no observer.
const arrivals = new Map<Element, () => void>();
let io: IntersectionObserver | null = null;

function watch(el: Element, tick: () => void) {
  arrivals.set(el, tick);
  // Built on first use, never at module load: this file is imported by a server
  // render too, and IntersectionObserver does not exist there.
  io ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) arrivals.get(entry.target)?.();
    },
    { rootMargin: ROOT_MARGIN },
  );
  io.observe(el);
}

function unwatch(el: Element) {
  arrivals.delete(el);
  io?.unobserve(el);
  if (io && arrivals.size === 0) {
    io.disconnect();
    io = null;
  }
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  /** For the wrapper, not the section. Rarely needed — the box is transparent
   *  and full-width, and the section inside keeps its own container. */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Answered here rather than left to the blanket rule in globals.css, so a
    // reader who prefers less motion never takes the pending state at all.
    // That rule is the second line of defence, not the first.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A tenth of the viewport is held back so a section starts its rise once it
    // is properly arriving rather than the instant its first pixel clears the
    // fold. Anything past that line — including scrolled clean off the top —
    // answers yes.
    const arrived = () =>
      el.getBoundingClientRect().top < window.innerHeight * 0.9;

    // Two ways out, and they are not the same arrival. The observer is a reader
    // scrolling, and the rise is the section announcing itself. `focusin` is a
    // keyboard tabbing straight into a section nobody has scrolled to: nothing
    // arrived, so there is nothing to announce, and a fade under a focus ring
    // is time spent hiding a control the user has already reached. Deleting the
    // attribute is the instant version and needs no second rule — with no
    // attribute neither rule in globals.css applies, which is the state this
    // section would have been in had the reveal never armed it.
    const settle = (how: "rise" | "jump") => {
      if (how === "rise") el.dataset.reveal = "shown";
      else delete el.dataset.reveal;
      unwatch(el);
      el.removeEventListener("focusin", onFocus);
    };
    function onFocus() {
      settle("jump");
    }

    const arm = () => {
      el.addEventListener("focusin", onFocus);
      watch(el, () => {
        if (el.dataset.reveal === undefined) {
          // First delivery, which the spec guarantees and which is the whole
          // reason the DOM is untouched until now. A section already on screen
          // is left alone: hiding it here is the flash above the fold that this
          // arrangement exists to prevent.
          if (arrived()) return settle("jump");
          el.dataset.reveal = "pending";
          return;
        }
        if (arrived()) settle("rise");
      });
    };

    const armWhenVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", armWhenVisible);
      arm();
    };

    if (document.visibilityState === "visible") arm();
    else document.addEventListener("visibilitychange", armWhenVisible);

    return () => {
      document.removeEventListener("visibilitychange", armWhenVisible);
      unwatch(el);
      el.removeEventListener("focusin", onFocus);
    };
  }, []);

  // The transform is transient by design: `shown` sets it back to `none`, so
  // the wrapper stops being a containing block the moment it has finished. It
  // is one while it runs, though, and a `sticky` element inside a transformed
  // ancestor stops sticking — which is why motion.md rules a section holding one
  // out of the reveal rather than warning about it.
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
