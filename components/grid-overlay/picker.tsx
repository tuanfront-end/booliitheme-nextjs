"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chain, label, spotLine, type Comment, type Spot } from "./comment-file";
import { ICON, Note } from "./comments";
import { declare, describe, leafAt, levels, type Name } from "./pick-names";
import { forget, readout, type Readout } from "./pick-readout";
import { readNames } from "./read-names";
import { addComment } from "./save-comments";

// The tool colour, for the reason the grid takes Figma's red: the outline is
// an instrument laid over the design, so it takes Figma's selection blue
// rather than the brand or an accent.
const PICK = "rgb(13 153 255)";

// What the pointer is never aimed through: the other layers' rulers and
// guides, the preset panel, Next's own overlay.
const CHROME = "[data-preset-panel], nextjs-portal, [data-dev-overlay]";

// The page's pointer events, kept from it while picking: a pick must not
// follow the link, open the drawer or focus the field it lands on, and a menu
// already open must not read the press as one outside it and close.
const SWALLOWED = ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick", "auxclick"] as const;

const GAP = 6; // px between the outline and the card
const EDGE = 8; // px the card keeps from the viewport's edge

// What is shown: the walk from the leaf under the pointer up to its section,
// how far up it the user has stepped, and that one element's measurements.
type Shown = { path: Element[]; depth: number; rect: DOMRect; name: Name; read: Readout };

function show(path: Element[], depth: number): Shown {
  const el = path[depth];
  return { path, depth, rect: el.getBoundingClientRect(), name: describe(el), read: readout(el) };
}

// The pick as plain values: the copy line is written from it, and a comment
// carries it to the server as it was when the comment was written.
function spotOf({ name, read }: Shown, route: string): Spot {
  return {
    route,
    index: name.index,
    name: name.name,
    tag: read.tag,
    width: window.innerWidth,
    half: document.documentElement.classList.contains("dark") ? "dark" : "light",
    type: read.type,
    colour: read.colour ? (read.colour.token ?? read.colour.hex) : undefined,
  };
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // The clipboard API wants the document focused; a hidden field does not.
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("data-dev-overlay", "");
    field.style.cssText = "position:fixed;opacity:0";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

type Toast = { text: string; id: number; top: boolean };

// At the foot, unless the pick and its card are down there.
const toastFor = (text: string, rect?: DOMRect): Toast => ({
  text,
  id: Date.now(),
  top: !!rect && rect.top + rect.bottom > window.innerHeight,
});

/** Pick mode: Shift+C in overlay-client mounts it, Esc or Shift+C again
 *  unmounts it. It stays on across picks. A pick opens a comment box on the
 *  element, and the box's copy button is the quick copy for chat. */
export function Picker({ onExit, onComments }: { onExit: () => void; onComments: (list: Comment[]) => void }) {
  const route = usePathname();
  const [shown, setShown] = useState<Shown | null>(null);
  // The box: the pick as it was when the box opened, and what is typed in it.
  const [writing, setWriting] = useState<Spot | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const live = useRef({ route, onExit, writing, draft });
  useLayoutEffect(() => {
    live.current = { route, onExit, writing, draft };
  });

  useEffect(() => {
    // Read again each time the mode starts: a component written since the
    // last time is named, and a hot reload may have swapped a token.
    forget();
    let ready = false;
    let current: Shown | null = null;
    let leaf: Element | null = null;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const set = (next: Shown | null) => {
      current = next;
      setShown(next);
    };

    // Held while the box is open, so the outline stays on what it is about.
    const aim = (x: number, y: number) => {
      const next = ready && !live.current.writing && leafAt(x, y, CHROME, layer.current);
      if (!next || next === leaf) return;
      leaf = next;
      set(show(levels(next), 0));
    };

    const pick = () => {
      if (!current) return;
      setDraft("");
      setWriting(spotOf(current, live.current.route));
    };

    // ↑ and ↓ step through the levels only, one element measured per step.
    const walk = (by: number) => {
      if (!current) return;
      const depth = Math.min(Math.max(current.depth + by, 0), current.path.length - 1);
      if (depth !== current.depth) set(show(current.path, depth));
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      aim(e.clientX, e.clientY);
    };

    // A scroll moves the page under a still pointer: aim again, re-measure.
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pointer) aim(pointer.x, pointer.y);
        if (current) set({ ...current, rect: current.path[current.depth].getBoundingClientRect() });
      });
    };

    const swallow = (e: Event) => {
      if (e.target !== layer.current) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.type !== "click") return;
      // A click away from an open box: words typed in it keep it open, and
      // an empty one gives way to the new pick.
      if (live.current.writing) {
        if (live.current.draft.trim()) {
          field.current?.focus();
          return;
        }
        live.current.writing = null;
        leaf = null;
      }
      aim((e as MouseEvent).clientX, (e as MouseEvent).clientY);
      pick();
    };

    // Captured on the window, so a carousel's arrows or a drawer's Esc never
    // see a key the picker answers. Keys typed into the box are the box's.
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest("[data-dev-overlay]")) return;
      const open = !!live.current.writing;
      const act =
        e.key === "Escape" ? () => (open ? setWriting(null) : live.current.onExit())
        : open ? (e.key === "Enter" ? () => field.current?.focus() : null)
        : e.key === "ArrowUp" ? () => walk(1)
        : e.key === "ArrowDown" ? () => walk(-1)
        : e.key === "Enter" ? pick
        : null;
      if (!act) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!e.repeat || e.key.startsWith("Arrow")) act();
    };

    void readNames().then((names) => {
      declare(names);
      ready = true;
      if (pointer) aim(pointer.x, pointer.y);
    });

    window.addEventListener("pointermove", onMove, { capture: true, passive: true });
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("keydown", onKey, true);
    for (const type of SWALLOWED) window.addEventListener(type, swallow, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey, true);
      for (const type of SWALLOWED) window.removeEventListener(type, swallow, true);
    };
  }, []);

  // Saved the moment Return is pressed: the file is the comment's only home.
  const save = async () => {
    const spot = writing;
    if (!spot || !draft.trim() || saving) return;
    setSaving(true);
    const list = await addComment(spot, draft).catch(() => null);
    setSaving(false);
    if (!list) {
      setToast(toastFor("Not saved: is the dev server still running?", shown?.rect));
      return;
    }
    onComments(list);
    setWriting(null);
    setToast(toastFor(`Saved ${list.at(-1)?.id} on ${label(spot)}`, shown?.rect));
  };

  const copyLine = () => {
    if (!writing) return;
    void copy(spotLine(writing));
    setToast(toastFor(`Copied ${label(writing)}`, shown?.rect));
    if (draft.trim()) field.current?.focus();
    else setWriting(null);
  };

  // The card beside the outline, or the box in its place: below it, else
  // above it, else inside its visible part when it is taller than the screen —
  // and never over the preset control in the bottom-right corner. Placed
  // before paint, so a step up or down moves it without a frame in the wrong
  // place.
  useLayoutEffect(() => {
    const box = card.current;
    if (!box || !shown) return;
    const { rect } = shown;
    const place = () => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      // Stepped up to something scrolled out of view: nothing to stand beside.
      box.style.visibility = rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw ? "hidden" : "";
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      const x = (at: number) => Math.min(Math.max(at, EDGE), vw - w - EDGE);
      const avoid = Array.from(document.querySelectorAll("[data-preset-panel]"))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width && r.height);
      type At = { x: number; y: number };
      const fits = (p: At) => p.y >= EDGE && p.y + h <= vh - EDGE;
      const over = (p: At, o: DOMRect) =>
        p.x < o.right + GAP && p.x + w > o.left - GAP && p.y < o.bottom + GAP && p.y + h > o.top - GAP;
      const tries = [
        { x: x(rect.left), y: rect.bottom + GAP },
        { x: x(rect.left), y: rect.top - GAP - h },
        { x: x(rect.left + EDGE), y: Math.min(Math.max(rect.top, 0) + EDGE, vh - h - EDGE) },
      ];
      let at = tries.find((p) => fits(p) && !avoid.some((o) => over(p, o))) ?? tries.find(fits) ?? tries[2];
      const hit = avoid.find((o) => over(at, o));
      if (hit) at = { x: x(hit.left - GAP - w), y: at.y };
      box.style.transform = `translate(${Math.round(at.x)}px, ${Math.round(at.y)}px)`;
    };
    place();
    if (!writing) return;
    // The box grows with its text, and is placed again as it does.
    const grow = new ResizeObserver(place);
    grow.observe(box);
    return () => grow.disconnect();
  }, [shown, writing]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const r = shown?.rect;
  const read = shown?.read;
  return (
    <>
      {/* Laid over the page so the page takes no hover while it is read: the
          readout gives a link's colour at rest, not under the pointer. The
          rulers and Next's badge sit above it and keep working. */}
      <div ref={layer} data-dev-overlay aria-hidden className="fixed inset-0 z-[89] cursor-crosshair" />

      {r && (
        <div
          data-dev-overlay
          aria-hidden
          className="pointer-events-none fixed z-[94]"
          style={{
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            boxShadow: `inset 0 0 0 1px ${PICK}`,
            background: "rgb(13 153 255 / 0.08)",
          }}
        />
      )}

      {writing ? (
        <div
          ref={card}
          data-dev-overlay
          className="fixed top-0 left-0 z-[95] flex w-[min(20rem,calc(100vw-1rem))] flex-col gap-2 rounded-lg bg-popover p-2 text-popover-foreground shadow-soft-lg ring-1 ring-border ring-inset"
        >
          <div className="flex items-center gap-1 ps-2">
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{chain(writing)}</p>
            <button
              type="button"
              onClick={copyLine}
              aria-label="Copy the line for chat"
              title="Copy the line for chat"
              className={ICON}
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <Note
            ref={field}
            value={draft}
            onChange={setDraft}
            onSubmit={save}
            onCancel={() => setWriting(null)}
            label={`Comment on ${label(writing)}`}
            busy={saving}
          />
        </div>
      ) : shown && read && (
        <div
          ref={card}
          data-dev-overlay
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[95] flex max-w-[min(20rem,calc(100vw-1rem))] flex-col gap-1 rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-soft-lg ring-1 ring-border ring-inset"
        >
          <p className="truncate text-sm font-medium">{label(shown.name)}</p>
          <p className="text-muted-foreground tabular-nums">
            {read.tag} · {read.width} × {read.height}
          </p>
          {read.type && (
            <p className="tabular-nums">
              {read.type.step} · {read.type.px} / {read.type.weight}
            </p>
          )}
          {read.colour && (
            <p className="flex min-w-0 items-center gap-1.5">
              <span
                className="size-2.5 shrink-0 rounded-[3px] border border-foreground/15"
                style={{ background: read.colour.css }}
              />
              <span className="truncate">{read.colour.token ?? read.colour.hex}</span>
            </p>
          )}
        </div>
      )}

      {toast && (
        <p
          key={toast.id}
          data-dev-overlay
          role="status"
          className={`pointer-events-none fixed inset-x-0 z-[96] mx-auto w-fit max-w-[calc(100vw-2rem)] truncate rounded-lg bg-foreground px-3 py-1.5 text-sm text-background shadow-soft-lg ${
            toast.top
              ? "top-[calc(1rem+env(safe-area-inset-top))]"
              : "bottom-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:bottom-[calc(5rem+env(safe-area-inset-bottom))]"
          }`}
        >
          {toast.text}
        </p>
      )}
    </>
  );
}
