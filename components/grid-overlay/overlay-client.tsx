"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { isOpen, type Comment } from "./comment-file";
import { CommentList } from "./comments";
import type { Guides, RouteGuides } from "./guides";
import { Picker } from "./picker";
import { listComments } from "./save-comments";
import { saveGuides } from "./save-guides";

// Tool colours, not the template's: the overlay has to read as an instrument
// laid over the design, never as part of it, so it takes Figma's red columns
// and pink guides rather than the brand or an accent colour.
const COLUMN = "rgb(255 0 0 / 0.1)";
const GUIDE = "rgb(255 0 128)";

const RULER = 20; // px, the ruler's thickness
const SNAP = 6; // px, how close a dragged guide has to come to an edge to take it
const STORE = "grid-overlay"; // localStorage: which layers are on

type Axis = "x" | "y";
type Drag = { axis: Axis; index: number | null; at: number };
const NONE: RouteGuides = { x: [], y: [] };

// Which layers are on. Read from outside React so the server and the first
// client render both see them off — hydration matches — and the browser's
// answer arrives on the next. The URL beats what is stored, and is never
// stored: a screenshot opened with `?grid=1` must not leave the grid on for
// whoever opens the page next. A key pressed in this tab beats both.
type Layers = { grid: boolean; rulers: boolean };
const OFF = JSON.stringify({ grid: false, rulers: false });
const listeners = new Set<() => void>();
let pressed: Layers | null = null;

function layers(): string {
  if (pressed) return JSON.stringify(pressed);
  let stored: Partial<Layers> = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORE) ?? "{}");
  } catch {}
  const q = new URLSearchParams(window.location.search);
  const pick = (name: keyof Layers) => (q.has(name) ? q.get(name) !== "0" : !!stored[name]);
  return JSON.stringify({ grid: pick("grid"), rulers: pick("rulers") });
}

function toggle(name: keyof Layers) {
  const now: Layers = JSON.parse(layers());
  pressed = { ...now, [name]: !now[name] };
  try {
    localStorage.setItem(STORE, JSON.stringify(pressed));
  } catch {}
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function typing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
  );
}

export function OverlayClient({ initial, comments: saved }: { initial: Guides; comments: Comment[] }) {
  const route = usePathname();
  const { grid, rulers }: Layers = JSON.parse(
    useSyncExternalStore(subscribe, layers, () => OFF),
  );
  const [all, setAll] = useState<Guides>(initial);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [view, setView] = useState({ w: 0, h: 0, top: 0 });
  // Pick mode is never stored: a reload that came back with the page's clicks
  // swallowed would read as a broken page.
  const [picking, setPicking] = useState(false);
  // The comments are read from the file on every return to the tab, since the
  // agent marks them done from outside the page. Picking and the list take
  // turns: each one's Esc and Return stay its own.
  const [comments, setComments] = useState(saved);
  const [listing, setListing] = useState(false);
  const closeList = useCallback(() => setListing(false), []);
  const columns = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => void listComments().then(setComments);
    window.addEventListener("focus", read);
    return () => window.removeEventListener("focus", read);
  }, []);

  // Shift+G, Shift+R and Shift+C. Figma's grid key is Ctrl+G, but Chrome takes
  // that for Gemini before the page ever sees it, and no browser binds Shift
  // and a letter. C is the picker's for the comment it opens and for DevTools'
  // own element picker, Cmd+Shift+C. None fires inside a field: there it is a
  // capital being typed.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || typing(e.target)) return;
      const key = e.key.toLowerCase();
      if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      if (key === "g" || key === "r") {
        e.preventDefault();
        toggle(key === "g" ? "grid" : "rulers");
      } else if (key === "c") {
        e.preventDefault();
        setPicking((on) => !on);
        setListing(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The rulers count document px, so they follow the scroll and the width.
  useEffect(() => {
    if (!rulers) return;
    const read = () =>
      setView({
        w: document.documentElement.clientWidth,
        h: window.innerHeight,
        top: window.scrollY,
      });
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [rulers]);

  const mine = all[route] ?? NONE;
  const open = comments.filter(isOpen).length;

  // A dragged guide takes the nearest edge within SNAP px: a column's edge for a
  // vertical guide — read off the drawn columns, so it is the grid the code
  // uses — and the edge of whatever element is under the pointer for either.
  // Alt held drops it exactly where the pointer is.
  const snap = useCallback(
    (axis: Axis, e: PointerEvent, raw: number) => {
      if (e.altKey) return raw;
      const edges: number[] = [];
      if (axis === "x") {
        for (const col of Array.from(columns.current?.children ?? [])) {
          const r = col.getBoundingClientRect();
          if (r.width) edges.push(r.left, r.right);
        }
      }
      const under = document.elementFromPoint(e.clientX, e.clientY);
      if (under && !under.closest("[data-dev-overlay]")) {
        const r = under.getBoundingClientRect();
        if (axis === "x") edges.push(r.left, r.right);
        else edges.push(r.top + window.scrollY, r.bottom + window.scrollY);
      }
      let best = raw;
      let distance = SNAP;
      for (const edge of edges) {
        if (Math.abs(edge - raw) <= distance) {
          best = edge;
          distance = Math.abs(edge - raw);
        }
      }
      return Math.round(best);
    },
    [],
  );

  // Listeners go on once per drag and read the live state through refs: an
  // effect keyed on the pointer position would come off and back on between
  // two moves, and a quick release in that gap is lost with the drag stuck on.
  const live = useRef({ drag, all, route });
  useLayoutEffect(() => {
    live.current = { drag, all, route };
  });
  const dragging = drag !== null;

  useEffect(() => {
    if (!dragging) return;
    const at = (axis: Axis, e: PointerEvent) =>
      axis === "x" ? e.clientX : e.clientY + window.scrollY;
    const onMove = (e: PointerEvent) => {
      const d = live.current.drag;
      if (d) setDrag({ ...d, at: snap(d.axis, e, at(d.axis, e)) });
    };
    // Dropped back on its own ruler, a guide is deleted — Figma's gesture.
    const onUp = (e: PointerEvent) => {
      const { drag: d, all: guides, route: path } = live.current;
      if (!d) return;
      const mine = guides[path] ?? NONE;
      const onRuler = d.axis === "x" ? e.clientX < RULER : e.clientY < RULER;
      const list = [...mine[d.axis]];
      if (d.index !== null) list.splice(d.index, 1);
      if (!onRuler) list.push(snap(d.axis, e, at(d.axis, e)));
      const next = { ...guides, [path]: { ...mine, [d.axis]: list.sort((a, b) => a - b) } };
      setAll(next);
      setDrag(null);
      void saveGuides(next);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [dragging, snap]);

  const start = (axis: Axis, index: number | null) => (e: React.PointerEvent) => {
    e.preventDefault();
    const d = { axis, index, at: axis === "x" ? e.clientX : e.clientY + window.scrollY };
    setDrag(d);
  };

  const clear = () => {
    const next = { ...all };
    delete next[route];
    setAll(next);
    void saveGuides(next);
  };

  // What is drawn: the stored guides with the one being dragged lifted out and
  // drawn at the pointer instead.
  const shown = (axis: Axis) =>
    mine[axis]
      .map((at, index) => ({ at, index }))
      .filter((g) => !(drag?.axis === axis && drag.index === g.index));

  return (
    <>
      {(grid || rulers) && (
        <div
          data-dev-overlay
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90]"
          style={{ opacity: grid ? 1 : 0 }}
        >
          <div
            ref={columns}
            className="column-grid mx-auto h-full w-full max-w-7xl px-6 sm:px-8"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : undefined}
                style={{ background: COLUMN }}
              />
            ))}
          </div>
        </div>
      )}

      {rulers && (
        <div data-dev-overlay aria-hidden className="fixed inset-0 z-[91] pointer-events-none select-none">
          <Ruler axis="x" length={view.w} offset={0} onPointerDown={start("y", null)} />
          <Ruler axis="y" length={view.h} offset={view.top} onPointerDown={start("x", null)} />
          <div
            title="Double-click to clear this page's guides"
            onDoubleClick={clear}
            className="pointer-events-auto absolute top-0 left-0 border-r border-b border-border bg-background"
            style={{ width: RULER, height: RULER }}
          />

          {shown("x").map((g) => (
            <Line key={`x${g.index}`} axis="x" at={g.at} onPointerDown={start("x", g.index)} />
          ))}
          {shown("y").map((g) => (
            <Line
              key={`y${g.index}`}
              axis="y"
              at={g.at - view.top}
              onPointerDown={start("y", g.index)}
            />
          ))}
          {drag && (
            <Line
              axis={drag.axis}
              at={drag.axis === "x" ? drag.at : drag.at - view.top}
              label={drag.at}
            />
          )}

          <Gaps axis="x" list={shown("x").map((g) => g.at)} offset={0} />
          <Gaps axis="y" list={shown("y").map((g) => g.at)} offset={view.top} />
        </div>
      )}

      {picking && <Picker onExit={() => setPicking(false)} onComments={setComments} />}
      {listing && <CommentList comments={comments} onComments={setComments} onClose={closeList} />}

      {/* Always there in development, so the three keys are found without
          reading a file. Centred and 4px off the foot, low enough to pass under
          a button centred at the bottom, and clear of the corners, where Next's
          badge and the font notice sit. The count is there once a comment is
          open, and opens the list. */}
      <p
        data-dev-overlay
        className="pointer-events-none fixed bottom-1 left-1/2 z-[92] -translate-x-1/2 text-[11px] leading-none whitespace-nowrap text-muted-foreground/60"
      >
        <span className={grid ? "text-foreground" : undefined}>Shift G grid</span>
        {" · "}
        <span className={rulers ? "text-foreground" : undefined}>Shift R rulers</span>
        {" · "}
        <span className={picking ? "text-foreground" : undefined}>Shift C pick</span>
        {open > 0 && (
          <>
            {" · "}
            <button
              type="button"
              aria-expanded={listing}
              onClick={() => {
                setListing((on) => !on);
                setPicking(false);
              }}
              className={`pointer-events-auto relative rounded-sm underline-offset-2 after:absolute after:-inset-x-1.5 after:-inset-y-2.5 after:content-[''] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                listing ? "text-foreground" : ""
              }`}
            >
              {open} {open === 1 ? "comment" : "comments"}
            </button>
          </>
        )}
      </p>
    </>
  );
}

// A strip of px along one edge: a tick every 10, a longer one every 50, a
// number every 100. The left ruler counts the document, so it moves with the
// scroll; the top one counts the viewport, which is the page's own width.
function Ruler({
  axis,
  length,
  offset,
  onPointerDown,
}: {
  axis: Axis;
  length: number;
  offset: number;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const across = axis === "x";
  const first = Math.ceil(offset / 100) * 100;
  const marks = [];
  for (let n = first; n - offset < length; n += 100) marks.push(n);
  // One 1px line at the start of a tile, the tile repeated: 50px tiles for the
  // long ticks, 10px for the short, offset by the scroll on the left ruler.
  const tick = `linear-gradient(${across ? "to right" : "to bottom"}, currentColor 1px, transparent 1px)`;
  return (
    <div
      onPointerDown={onPointerDown}
      className={`pointer-events-auto absolute border-border bg-background text-muted-foreground/50 ${
        across ? "top-0 right-0 left-0 cursor-row-resize border-b" : "top-0 bottom-0 left-0 cursor-col-resize border-r"
      }`}
      style={{
        [across ? "height" : "width"]: RULER,
        backgroundImage: `${tick}, ${tick}`,
        backgroundRepeat: across ? "repeat-x" : "repeat-y",
        backgroundSize: across ? "50px 8px, 10px 4px" : "8px 50px, 4px 10px",
        backgroundPosition: across ? "0 100%, 0 100%" : `100% ${-offset}px, 100% ${-offset}px`,
      }}
    >
      {marks.map((n) => (
        <span
          key={n}
          className="absolute text-[9px] leading-none text-muted-foreground tabular-nums"
          style={
            across
              ? { left: n + 3, top: 2 }
              : { top: n - offset + 3, left: 2, writingMode: "vertical-rl", transform: "rotate(180deg)" }
          }
        >
          {n}
        </span>
      ))}
    </div>
  );
}

// One guide: a 1px line inside a 7px hit area, so it can be picked up again.
function Line({
  axis,
  at,
  label,
  onPointerDown,
}: {
  axis: Axis;
  at: number;
  label?: number;
  onPointerDown?: (e: React.PointerEvent) => void;
}) {
  const vertical = axis === "x";
  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute flex justify-center ${onPointerDown ? "pointer-events-auto" : ""} ${
        vertical ? "top-0 bottom-0 w-[7px] cursor-col-resize" : "right-0 left-0 h-[7px] flex-col cursor-row-resize"
      }`}
      style={vertical ? { left: at - 3 } : { top: at - 3 }}
    >
      <div style={{ background: GUIDE, [vertical ? "width" : "height"]: 1 }} className={vertical ? "h-full" : "w-full"} />
      {label !== undefined && (
        <span
          className="absolute rounded-sm px-1 py-0.5 text-[10px] leading-none text-white tabular-nums"
          style={{ background: GUIDE, ...(vertical ? { top: RULER + 4, left: 6 } : { left: RULER + 4, top: 6 }) }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// The distance between each guide and the next on the same axis, set at the
// midpoint — the measurement a pair of guides is usually dropped to take.
function Gaps({ axis, list, offset }: { axis: Axis; list: number[]; offset: number }) {
  const sorted = [...list].sort((a, b) => a - b);
  return sorted.slice(1).map((b, i) => {
    const a = sorted[i];
    const mid = (a + b) / 2 - offset;
    return (
      <span
        key={`${axis}${a}-${b}`}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm bg-background px-1 py-0.5 text-[10px] leading-none tabular-nums"
        style={{ color: GUIDE, ...(axis === "x" ? { left: mid, top: RULER + 14 } : { top: mid, left: RULER + 18 }) }}
      >
        {b - a}
      </span>
    );
  });
}
