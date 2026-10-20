// StoryBars — the run of bars under a spotlight that turns over on its own: one bar a slide, the one on show filling, held by focus, off screen, a hidden tab or a pause.
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

// Run the way a stories viewer runs them: the bars before the one on show are
// full, the one on show fills over `duration` and moves the region on when it
// is full, the ones after are empty. A press on a bar goes to that slide and
// starts its bar again — the bar on show included, which is how a reader gets
// a slide's full time back.
//
// The run holds while keyboard focus is in the region or on the bars, so a
// slide never moves out from under a keyboard, and while the region is off
// screen or the tab is hidden. A pointer over it does not hold it. The pause
// button stops it outright, which is the control WCAG asks for on anything that
// moves by itself for more than five seconds. Under reduced motion — or with
// `autoPlay` off — nothing runs, the bar on show stands full, and the pause
// button is not drawn, since there is nothing to pause.
//
// While the run is moving the live region stays quiet, so a screen reader is
// not read a new slide every few seconds; a press is still announced.

// Each bar is a 40px button around a 4px stroke, so it takes a finger, and the
// bars stand 6px apart so two hover grounds never fuse into one.
const BAR = 40;
const GAP = 6;

// Every class written out whole, because the stylesheet is built from the
// strings it can find. `brand` fills in the bright brand over light tints of
// it; a light brand draws under 3:1 against its own tint, so a brand run sits
// beside a count of where it is — "2 of 4" — that says it in words. `inverse`
// is for a dark band or a scrim over a photograph; the focus ring turns light
// with it, or it would vanish there.
const TONES = {
  ink: {
    track: "bg-foreground/15 group-hover/bar:bg-foreground/30",
    current: "bg-foreground/30 group-hover/bar:bg-foreground/40",
    fill: "bg-foreground",
    ring: "focus-visible:outline-ring",
    pause: "text-foreground hover:bg-accent focus-visible:outline-ring",
  },
  brand: {
    track: "bg-primary/25 group-hover/bar:bg-primary/40",
    current: "bg-primary/40 group-hover/bar:bg-primary/50",
    fill: "bg-primary",
    ring: "focus-visible:outline-ring",
    pause: "text-primary-ink hover:bg-accent focus-visible:outline-ring",
  },
  inverse: {
    track: "bg-background/25 group-hover/bar:bg-background/45",
    current: "bg-background/45 group-hover/bar:bg-background/55",
    fill: "bg-background",
    ring: "focus-visible:outline-background",
    pause: "text-background hover:bg-background/15 focus-visible:outline-background",
  },
} as const;

const motionQuery = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (on) => {
      const q = window.matchMedia(motionQuery);
      q.addEventListener("change", on);
      return () => q.removeEventListener("change", on);
    },
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

export function StoryBars({
  names,
  index,
  onIndexChange,
  controls,
  noun = "slide",
  announce,
  duration = 6000,
  autoPlay = true,
  tone = "ink",
  className,
  children,
}: {
  /** One per slide: each bar's accessible name. */
  names: string[];
  /** The slide on show, counted from 0. */
  index: number;
  onIndexChange: (index: number) => void;
  /** The id of the region the bars move. Focus inside it holds the run, and
   *  the run waits until half of it is on screen. */
  controls?: string;
  /** What a slide is, for the group's name: "stay", "host". */
  noun?: string;
  /** What the live region reads for the slide on show. */
  announce: string;
  /** How long a slide stays before the region moves on, in ms. */
  duration?: number;
  /** Off, the bars are a plain pager: no clock, the bar on show full. */
  autoPlay?: boolean;
  /** The bars' colour: ink, the bright brand, or light over a dark ground. */
  tone?: keyof typeof TONES;
  className?: string;
  /** The region's own icon buttons, set after the pause button. */
  children?: ReactNode;
}) {
  const count = names.length;
  const t = TONES[tone];
  const still = useReducedMotion();
  const live = autoPlay && !still;
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const [shown, setShown] = useState(true);
  // Bumped by a press on the bar already on show, which starts its line again.
  const [round, setRound] = useState(0);
  const running = live && !stopped && !held && seen && shown;

  const go = useRef(onIndexChange);
  useEffect(() => {
    go.current = onIndexChange;
  });

  // Focus and the viewport, read off the region the bars move and off the
  // bars themselves — one of them when the bars sit inside the region.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const own = root.current;
    if (!own) return;
    const region = controls ? document.getElementById(controls) : null;
    const watched = region ? (region.contains(own) ? [region] : [region, own]) : [own];
    // Keyboard focus only: a click on a bar focuses it too, and must not stop
    // the run it just moved.
    const focusIn = (e: FocusEvent) => setHeld((e.target as Element).matches(":focus-visible"));
    const focusOut = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (watched.some((el) => el.contains(to))) return;
      setHeld(false);
    };
    for (const el of watched) {
      el.addEventListener("focusin", focusIn);
      el.addEventListener("focusout", focusOut);
    }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.5 });
    io.observe(region ?? own);
    const vis = () => setShown(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      for (const el of watched) {
        el.removeEventListener("focusin", focusIn);
        el.removeEventListener("focusout", focusOut);
      }
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [controls]);

  // The bar on show fills from the start of its track; a new slide, a new set
  // of slides or a press on it starts it again from empty. It is made paused
  // and played below, so a hold keeps how far it had got. The fill slides in
  // rather than stretching, so both its ends stay round — and on a
  // right-to-left page it slides in from the right.
  const fill = useRef<HTMLSpanElement>(null);
  const clock = useRef<Animation | null>(null);
  const set = names.join("|");
  useEffect(() => {
    const el = fill.current;
    if (!el || !live) return;
    const from = getComputedStyle(el).direction === "rtl" ? "100% 0" : "-100% 0";
    const a = el.animate([{ translate: from }, { translate: "0 0" }], {
      duration,
      easing: "linear",
      fill: "forwards",
    });
    a.pause();
    a.onfinish = () => go.current((index + 1) % count);
    clock.current = a;
    return () => {
      a.onfinish = null;
      a.cancel();
      clock.current = null;
    };
  }, [index, set, count, duration, live, round]);

  useEffect(() => {
    const a = clock.current;
    if (!a) return;
    if (running) a.play();
    else a.pause();
  }, [running, index, set, live, round]);

  return (
    <div
      ref={root}
      data-slot="story-bars"
      className={cn("relative z-10 flex flex-wrap items-center justify-end gap-x-3", className)}
    >
      <div
        role="group"
        aria-label={`Choose ${noun}`}
        style={{ minWidth: count * BAR + (count - 1) * GAP }}
        className="flex flex-1 items-center gap-1.5"
      >
        {names.map((name, i) => {
          const current = i === index;
          const full = i < index || (current && !live);
          return (
            <button
              key={`${i}-${name}`}
              type="button"
              aria-label={name}
              aria-current={current || undefined}
              aria-controls={controls}
              onClick={() => (current ? setRound((r) => r + 1) : onIndexChange(i))}
              className={cn(
                "group/bar flex h-10 min-w-10 flex-1 items-center rounded-control press focus-visible:outline-2 focus-visible:outline-offset-2",
                t.ring,
              )}
            >
              {/* The bar on show keeps a track a step darker, so it still reads
                  as the one in front while the run is held and its fill stands
                  part-way. */}
              <span
                aria-hidden="true"
                className={cn(
                  "relative block h-1 w-full overflow-hidden rounded-full transition-colors",
                  current ? t.current : t.track,
                )}
              >
                <span
                  ref={current ? fill : undefined}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    t.fill,
                    full ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
      {(live || children) && (
        <div className="flex shrink-0 items-center gap-2">
          {live && (
            <ButtonPrimitive
              data-slot="story-bars-pause"
              aria-label={stopped ? "Play the slideshow" : "Pause the slideshow"}
              aria-controls={controls}
              onClick={() => setStopped((s) => !s)}
              className={cn(
                "relative grid size-10 shrink-0 place-items-center rounded-control press focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:size-4",
                t.pause,
              )}
            >
              {stopped ? <PlayIcon aria-hidden /> : <PauseIcon aria-hidden />}
            </ButtonPrimitive>
          )}
          {children}
        </div>
      )}
      <p aria-live={running ? "off" : "polite"} className="sr-only">
        {announce}
      </p>
    </div>
  );
}
