// Map — a live map on free tiles: price pins that gather when they meet and a card on a press, or the world with its cities.
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useDirection } from "@base-ui/react/direction-provider";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import {
  Cancel01Icon,
  CenterFocusIcon,
  FavouriteIcon,
  Tick02Icon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { GeoJSONSource, Map as MapLibreMap, PopupOptions, StyleSpecification } from "maplibre-gl";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { frameInk } from "@/components/ui/filter-rail";
import { cn } from "@/lib/utils";
import { dateFormat } from "@/lib/format";

// MapLibre draws the map from OpenFreeMap's tiles: no key, no quota, so it
// ships in a template that is sold. The library is a megabyte, so it is
// fetched the first time a map mounts and never by a page without one, and
// every map on the page shares the one fetch.
//
// Everything floating on the map is a React element MapLibre places, so a pin
// is a real button with a real name, reached by Tab. Pins that would touch
// gather into one pill that zooms in; zoomed out past `clusterZoom`, pins with
// an `area` gather into one pill per area, hung beside a dot on it. A pin
// pressed opens its card over it. Given `cities` in place of pins, it is the
// world held still, each city a pin on its own clock (see "The world"). The
// container says where it is in
// `data-map` — loading, then ready, or fallback when the map cannot be drawn —
// and the checks wait on it.
//
// Exported as MapView, so a page importing it keeps the global Map.

export type LngLat = [lng: number, lat: number];

export type MapPin = {
  id: string;
  lngLat: LngLat;
  /** What the pill reads: a price, a rating. */
  label: string;
  /** What a screen reader hears: "Courtyard flat in Alfama, from €148 a night". */
  name: string;
  /** Several things at one place share its pin, the count after the label. */
  count?: number;
  /** The number behind the label; a gathered pill reads its lowest. */
  value?: number;
  /** The area it gathers into when the map is zoomed out. */
  area?: string;
  /** Kept by the visitor: a heart before the label. */
  saved?: boolean;
  /** What opens over the pin on a press — a MapCard, usually. */
  card?: React.ReactNode;
};

export type MapArea = { id: string; name: string; short?: string };
/** What floats over the map from outside it — a results panel, a toolbar — in px. */
export type MapInset = { top: number; right: number; bottom: number; left: number };
/** The open part of the map after a move: west, south, east, north. */
export type MapBounds = [west: number, south: number, east: number, north: number];
export type MapHandle = { flyTo: (pin: string) => void; fit: () => void };
export type MapStyleId = "muted" | "streets" | "night";

type MapLibre = typeof import("maplibre-gl");

// ─── The library ─────────────────────────────────────────────────────────────

let library: Promise<MapLibre> | null = null;

function loadLibrary() {
  library ??= Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]).then(([ml]) => {
    // MapLibre looks for its worker beside its own file, which a bundle
    // moves; naming it here has the bundler ship it as a file of its own.
    // The path is relative to this file.
    ml.setWorkerUrl(new URL("../../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);
    return ml;
  });
  library.catch(() => {
    library = null;
  });
  return library;
}

// ─── The basemap in the site's colours ──────────────────────────────────────

const OFM = "https://tiles.openfreemap.org/styles";

/** Muted follows the page's light or dark half; Streets and Night do not. */
const styleUrl = (id: MapStyleId, dark: boolean) =>
  id === "streets" ? `${OFM}/liberty` : id === "night" ? `${OFM}/fiord` : `${OFM}/${dark ? "dark" : "positron"}`;

type Rgba = [number, number, number, number];
let paintCtx: CanvasRenderingContext2D | null = null;

// Any colour the browser can paint, read back through a 1px canvas: the
// basemap's own paints in whatever notation its style is written in, and the
// tokens' oklch() and color-mix(), all land as numbers.
function toRgba(color: string): Rgba | null {
  if (!paintCtx) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    paintCtx = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!paintCtx) return null;
  paintCtx.fillStyle = "#010203";
  paintCtx.fillStyle = color;
  if (paintCtx.fillStyle === "#010203" && color.replace(/\s/g, "") !== "#010203") return null;
  paintCtx.clearRect(0, 0, 1, 1);
  paintCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = paintCtx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

function token(name: string): Rgba {
  const probe = document.createElement("span");
  probe.style.color = `var(${name})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return toRgba(value) ?? [128, 128, 128, 1];
}

const mix = (a: Rgba, b: Rgba, t: number): Rgba => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
  1,
];
const css = ([r, g, b]: Rgba, alpha: number) =>
  `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(alpha.toFixed(3))})`;
const lightness = ([r, g, b]: Rgba) => (r + g + b) / 765;

// Positron and Dark are near-grey; every colour in them moves onto the site's
// neutral ramp by its lightness — land on the page's ground, roads on the
// card, labels on the ink — and water and parks take a whisper of the sky and
// leaf accent colours. Change a token and the map follows on its next load.
function tintStyle(style: StyleSpecification, dark: boolean): StyleSpecification {
  const ground = token("--background");
  const upper = dark ? token("--foreground") : token("--card");
  // Dark draws its roads a shade under its land; on the site's near-black
  // those read as scratches, so they come up a step instead.
  const lower: Rgba = dark ? mix(ground, upper, 0.12) : token("--foreground");
  const water = mix(ground, token("--sky"), dark ? 0.12 : 0.14);
  const park = mix(ground, token("--leaf"), dark ? 0.06 : 0.1);
  const waterInk = token(dark ? "--sky" : "--sky-ink");

  const bgLayer = style.layers.find((l) => l.type === "background");
  const bgPaint = bgLayer?.paint as Record<string, unknown> | undefined;
  const bg = typeof bgPaint?.["background-color"] === "string" ? toRgba(bgPaint["background-color"]) : null;
  const t0 = Math.min(Math.max(bg ? lightness(bg) : dark ? 0.05 : 0.95, 0.02), 0.98);

  const cache = new Map<string, string>();
  const onRamp = (value: string) => {
    const hit = cache.get(value);
    if (hit) return hit;
    const c = toRgba(value);
    if (!c) return value;
    const t = lightness(c);
    const out = css(t < t0 ? mix(lower, ground, t / t0) : mix(ground, upper, (t - t0) / (1 - t0)), c[3]);
    cache.set(value, out);
    return out;
  };
  const fixed = (to: Rgba) => (value: string) => {
    const c = toRgba(value);
    return c ? css(to, c[3]) : value;
  };
  // A paint value is a colour or an expression holding colours; every string
  // in it is tried, and the ones that are not colours pass through.
  const walk = (value: unknown, paint: (v: string) => string): unknown =>
    typeof value === "string" ? paint(value) : Array.isArray(value) ? value.map((v) => walk(v, paint)) : value;

  return {
    ...style,
    layers: style.layers.map((layer) => {
      if (!("paint" in layer) || !layer.paint) return layer;
      const id = layer.id;
      const isLabel = layer.type === "symbol";
      const paintFor = (key: string) =>
        /water/.test(id) && isLabel && key === "text-color"
          ? fixed(waterInk)
          : /water/.test(id) && !isLabel
            ? fixed(water)
            : /park|wood|grass/.test(id) && !isLabel
              ? fixed(park)
              : onRamp;
      const paint = Object.fromEntries(
        Object.entries(layer.paint as Record<string, unknown>).map(([k, v]) =>
          /color/.test(k) ? [k, walk(v, paintFor(k))] : [k, v],
        ),
      );
      return { ...layer, paint } as typeof layer;
    }),
  };
}

const styles = new Map<string, Promise<StyleSpecification>>();

/** One fetch per style for the life of the page. Road shields go: they read a
 *  route number some roads leave empty, and a booking map has no use for them. */
function loadStyle(url: string) {
  let hit = styles.get(url);
  if (!hit) {
    hit = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Map style ${r.status}`);
        return r.json() as Promise<StyleSpecification>;
      })
      .then((style) => ({ ...style, layers: style.layers.filter((l) => !/shield/.test(l.id)) }));
    hit.catch(() => styles.delete(url));
    styles.set(url, hit);
  }
  return hit;
}

/** Every label layer naming a place: a city, a town, a country. */
const placeLabelLayers = (style: StyleSpecification) =>
  style.layers.filter((l) => l.type === "symbol" && "source-layer" in l && l["source-layer"] === "place");

/** A layer's own filter, with the named places left out. */
const withoutNames = (filter: unknown, names: string[]) => {
  const unnamed = ["match", ["get", "name"], names.length ? names : [""], false, true];
  return (filter ? ["all", filter, unnamed] : unnamed) as never;
};

// A place label half under a pill reads as a fragment — "Lis…on" — so the
// basemap's names come off wherever one of the map's own pills stands.
function hidePlaceLabels(style: StyleSpecification, names: string[]): StyleSpecification {
  const ids = new Set(placeLabelLayers(style).map((l) => l.id));
  return {
    ...style,
    layers: style.layers.map((layer) =>
      ids.has(layer.id)
        ? ({ ...layer, filter: withoutNames("filter" in layer ? layer.filter : undefined, names) } as typeof layer)
        : layer,
    ),
  };
}

// ─── Geometry ────────────────────────────────────────────────────────────────

type Rect = { l: number; t: number; w: number; h: number };
type Side = { side: "above" | "below" | "right" | "left"; align: "center" | "start" | "end" };

const meets = (a: Rect, b: Rect, gap: number) =>
  a.l < b.l + b.w + gap && b.l < a.l + a.w + gap && a.t < b.t + b.h + gap && b.t < a.t + a.h + gap;

function boundsOf(points: LngLat[]): [LngLat, LngLat] {
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

const centreOf = (points: LngLat[]): LngLat => [
  points.reduce((n, p) => n + p[0], 0) / points.length,
  points.reduce((n, p) => n + p[1], 0) / points.length,
];

// The camera's padding: what floats over the map, plus the room a pill takes
// beside its point — a pin is centred on its point, an area's pill hangs to
// one side of its dot.
function padFor(i: MapInset, points: LngLat[]) {
  const [[west], [east]] = boundsOf(points);
  if (east - west < 3) return { top: i.top + 32, right: i.right + 48, bottom: i.bottom + 32, left: i.left + 48 };
  return { top: i.top + 64, right: i.right + 72, bottom: i.bottom + 64, left: i.left + 72 };
}

function frame(m: MapLibreMap, points: LngLat[], inset: MapInset, duration: number, maxZoom = 14) {
  if (!points.length) return;
  m.fitBounds(boundsOf(points), { padding: padFor(inset, points), maxZoom, duration });
}

const pinText = (p: MapPin) => p.label + (p.count && p.count > 1 ? ` · ${p.count}` : "");
// A pin's width before it is drawn: its words, the heart, the padding, never under 68px.
const pinWidth = (text: string, heart: boolean) => Math.max(68, 26 + text.length * 8 + (heart ? 20 : 0));
const lowest = (pins: MapPin[]) =>
  pins.reduce((a, b) => ((b.value ?? Infinity) < (a.value ?? Infinity) ? b : a), pins[0]);

// Pins that would touch, 4px apart at the least, merge into one pill at their
// middle, and the merged pill is tried against the rest again, until nothing
// touches. A gathered pill is a press that zooms to the pins inside it.
function gatherPins(map: MapLibreMap, pins: MapPin[], byId: Map<string, MapPin>, gatherLabel: (n: number) => string) {
  type Group = { ids: string[]; x: number; y: number; w: number };
  const groups: Group[] = pins.map((p) => {
    const { x, y } = map.project(p.lngLat);
    return { ids: [p.id], x, y, w: pinWidth(pinText(p), Boolean(p.saved)) };
  });
  const rect = (g: Group): Rect => ({ l: g.x - g.w / 2, t: g.y - 16, w: g.w, h: 32 });
  for (let merges = 0; merges < pins.length; merges++) {
    let pair: [number, number] | null = null;
    for (let i = 0; i < groups.length && !pair; i++)
      for (let j = i + 1; j < groups.length && !pair; j++) if (meets(rect(groups[i]), rect(groups[j]), 4)) pair = [i, j];
    if (!pair) break;
    const [a, b] = [groups[pair[0]], groups[pair[1]]];
    const ids = [...a.ids, ...b.ids];
    const members = ids.map((id) => byId.get(id)!);
    groups.splice(pair[1], 1);
    groups[pair[0]] = {
      ids,
      x: (a.x * a.ids.length + b.x * b.ids.length) / ids.length,
      y: (a.y * a.ids.length + b.y * b.ids.length) / ids.length,
      w: pinWidth(`${lowest(members).label} · ${gatherLabel(ids.length)}`, members.some((m) => m.saved)),
    };
  }
  return groups.filter((g) => g.ids.length > 1).map((g) => g.ids);
}

const SIDES: Side[] = [
  { side: "above", align: "center" },
  { side: "below", align: "center" },
  { side: "right", align: "center" },
  { side: "left", align: "center" },
  { side: "above", align: "start" },
  { side: "above", align: "end" },
  { side: "below", align: "start" },
  { side: "below", align: "end" },
];

// Where an area's pill stands beside its dot. The button carries 4px round
// its pill, so each offset is the pill's (`pillRect`) less those 4px.
const pillOffset = ({ side, align }: Side) => {
  if (side === "right") return "translate(0.375rem, -50%)";
  if (side === "left") return "translate(calc(-100% - 0.375rem), -50%)";
  const x = align === "start" ? "-1rem" : align === "end" ? "calc(-100% + 0.75rem)" : "-50%";
  const y = side === "above" ? "calc(-100% - 0.375rem)" : "0.375rem";
  return `translate(${x}, ${y})`;
};

function pillRect({ side, align }: Side, x: number, y: number, w: number, h: number): Rect {
  if (side === "right") return { l: x + 10, t: y - h / 2, w, h };
  if (side === "left") return { l: x - 10 - w, t: y - h / 2, w, h };
  const l = align === "start" ? x - 12 : align === "end" ? x + 12 - w : x - w / 2;
  return { l, t: side === "above" ? y - 10 - h : y + 10, w, h };
}

// The area pills lay themselves out, since sides set by hand break the moment
// a width changes, and on a buyer's own areas. West to east, each takes the
// first side of its dot that clears the pills already placed and every other
// dot by 4px and stays on the open map, stepping back to the pill before when
// one has nowhere to go. A search that runs long gives up on the open map,
// then on the search, and what is left takes its first side.
function layPills(map: MapLibreMap, centres: [string, LngLat][], compact: boolean, inset: MapInset, box: HTMLElement) {
  const points = centres
    .map(([id, at]) => {
      const pill = box.querySelector<HTMLElement>(`[data-map-pin="area:${CSS.escape(id)}"] > span`);
      const { x, y } = map.project(at);
      return { id, x, y, w: pill?.offsetWidth ?? (compact ? 68 : 120), h: pill?.offsetHeight ?? (compact ? 32 : 40) };
    })
    .sort((a, b) => a.x - b.x);
  const dots = points.map((p) => ({ id: p.id, r: { l: p.x - 8, t: p.y - 8, w: 16, h: 16 } }));
  const open = (r: Rect) =>
    r.l >= inset.left + 4 &&
    r.t >= inset.top + 4 &&
    r.l + r.w <= box.clientWidth - inset.right - 4 &&
    r.t + r.h <= box.clientHeight - inset.bottom - 4;

  const search = (onMap: boolean) => {
    const chosen: Side[] = [];
    const rects: Rect[] = [];
    let steps = 0;
    const place = (i: number): boolean => {
      if (i === points.length) return true;
      const p = points[i];
      for (const s of SIDES) {
        if (++steps > 4000) return false;
        const r = pillRect(s, p.x, p.y, p.w, p.h);
        if (onMap && !open(r)) continue;
        if (rects.some((o) => meets(r, o, 4)) || dots.some((d) => d.id !== p.id && meets(r, d.r, 4))) continue;
        chosen.push(s);
        rects.push(r);
        if (place(i + 1)) return true;
        chosen.pop();
        rects.pop();
      }
      return false;
    };
    return place(0) ? chosen : null;
  };
  const sides = search(true) ?? search(false) ?? points.map(() => SIDES[0]);
  return Object.fromEntries(points.map((p, i) => [p.id, sides[i]]));
}

// ─── Small parts ─────────────────────────────────────────────────────────────

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  React.useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);

// Whether this browser can draw WebGL at all: asked once a page, and null on
// the server and in the frame that hydrates.
let webgl: boolean | undefined;
const canDraw = () => {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
};
const noChange = () => () => {};
const useDrawable = () => React.useSyncExternalStore(noChange, canDraw, () => null);

const ring = "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";
const buttonRing =
  "focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

// The shape every pin on the map wears, the ghosts that stand in for them
// included: a rounded box rather than a pill, so a field of prices reads as
// labels on the drawing rather than buttons dropped on it. 12px keeps a
// straight edge on a 32px pin, and the control seed caps it, so a template
// squared at the seed squares its pins with it. Lifted by the stock xl cast at
// a fifth of its ink: the soft token is too diffuse to hold on busy tiles.
const pinShape = "rounded-[min(var(--radius-control),12px)] shadow-xl/20";

// Every pin on the map, whether a price, an area or a city: no tail, 68px at
// least, lit in the brand and a rung down on hover when it is not. Its edge is
// a control's hairline, quiet — the cast does the lifting — and a lit pin
// thickens it into the pick frame, the cue its pale fill cannot carry alone
// against the card. A picked city keeps its white inside the same frame, the
// tick before its name beside it. Both are the ring; focus is the outline 2px
// clear of it, so a focused pick shows both, apart.
const pill = cn(
  "relative inline-flex min-w-17 items-center justify-center gap-1.5 bg-card whitespace-nowrap text-foreground",
  pinShape,
  frameInk,
  "ring-1 ring-input ring-inset",
  "transition-[background-color,color,box-shadow,scale] duration-answer ease-answer motion-reduce:transition-none",
  "group-hover/pin:[&:not([data-lit])]:bg-muted group-active/pin:scale-[0.97]",
  "data-lit:bg-primary data-lit:text-primary-foreground data-lit:ring-2 data-lit:ring-(--frame-ink)",
  "data-picked:ring-2 data-picked:ring-(--frame-ink)",
  "group-focus-visible/pin:outline-2 group-focus-visible/pin:outline-offset-2 group-focus-visible/pin:outline-ring",
);
// The price leads in the full ink at the emphasis weight; what follows it —
// "· 3 places", an area's count — steps back in ink and weight, and takes the
// lit fill's own ink, because the quiet grey does not hold on the brand.
const after =
  "font-normal text-muted-foreground transition-colors duration-answer ease-answer group-data-lit/pill:text-primary-foreground";

/** A pin as the map draws it, outside a map: the design system draws one per state. */
function MapPinPill({
  lit,
  saved,
  picked,
  size = "pin",
  count,
  children,
  className,
}: {
  lit?: boolean;
  saved?: boolean;
  /** A city picked on a world map: the tick before the name. */
  picked?: boolean;
  size?: "pin" | "area" | "area-compact";
  /** What follows the label in the lighter weight: "· 3", "· 4 places". */
  count?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // A pin reads as one left-to-right phrase, "ATX · 10" or "$184", on a
    // right-to-left page too: mirrored, the count lands before its name.
    <span
      dir="ltr"
      data-lit={lit || undefined}
      data-picked={picked || undefined}
      className={cn(
        pill,
        "group/pill font-medium tabular-nums",
        size === "area" ? "h-10 px-4 text-sm" : size === "area-compact" ? "h-8 px-3 text-xs" : "h-8 px-3 text-sm",
        // A lit pin grows a step over its neighbours; an area pill is the
        // only thing at its place and has nothing to stand out from.
        size === "pin" && "data-lit:scale-110",
        className,
      )}
    >
      {picked && (
        <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} aria-hidden className="-ms-1 shrink-0 text-primary-ink" />
      )}
      {saved && (
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={14}
          strokeWidth={1.8}
          aria-hidden
          className="shrink-0 fill-current text-coral transition-colors duration-answer ease-answer group-data-lit/pill:text-primary-foreground"
        />
      )}
      {children}
      {count != null && <span className={after}>{count}</span>}
    </span>
  );
}

// A pin's own element, handed to MapLibre once and filled by React.
function MapMarker({
  lib,
  map,
  at,
  z,
  children,
}: {
  lib: MapLibre;
  map: MapLibreMap;
  at: LngLat;
  z: number;
  children: React.ReactNode;
}) {
  const [el] = React.useState(() => document.createElement("div"));
  const marker = React.useRef<InstanceType<MapLibre["Marker"]> | null>(null);
  const [lng, lat] = at;
  React.useEffect(() => {
    const m = new lib.Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).addTo(map);
    marker.current = m;
    return () => {
      m.remove();
      marker.current = null;
    };
  }, [lib, map, el, lng, lat]);
  React.useEffect(() => {
    const node = marker.current?.getElement();
    if (node) node.style.zIndex = String(z);
  }, [z, lng, lat]);
  return createPortal(children, el);
}

// A pin is a 32px pill centred on its point, 68px wide at least, so a card
// opening above or below clears it by 8px and one opening beside it clears
// the narrowest pill by the same.
const popupOffset: PopupOptions["offset"] = {
  center: [0, 0],
  top: [0, 24],
  "top-left": [0, 24],
  "top-right": [0, 24],
  bottom: [0, -24],
  "bottom-left": [0, -24],
  "bottom-right": [0, -24],
  left: [42, 0],
  right: [-42, 0],
};

// MapLibre's popup frame gives way to the card inside it: no padding, no tip,
// no white box of its own. Its sheet sits outside the cascade layers, so every
// override here is `!`.
const popupFrame =
  "z-30 [&_.maplibregl-popup-content]:rounded-lg! [&_.maplibregl-popup-content]:bg-transparent! [&_.maplibregl-popup-content]:p-0! [&_.maplibregl-popup-content]:shadow-none! [&_.maplibregl-popup-tip]:hidden!";

const PopupContext = React.createContext<{ close: () => void } | null>(null);

/** Inside a card on the map: how it closes itself and hands focus back to its pin. */
const useMapPopup = () => React.useContext(PopupContext);

function MapPopup({
  lib,
  map,
  at,
  focusOnOpen,
  inset,
  reduced,
  children,
}: {
  lib: MapLibre;
  map: MapLibreMap;
  at: LngLat;
  focusOnOpen: boolean;
  inset: MapInset;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const [el] = React.useState(() => document.createElement("div"));
  const [lng, lat] = at;
  const room = React.useRef(inset);
  React.useEffect(() => {
    room.current = inset;
  });
  React.useEffect(() => {
    // A narrow map has no room for a card beside its pin, so there it opens
    // above the pin, or below one in the top half.
    const container = map.getContainer();
    const narrow = container.clientWidth < 640;
    const popup = new lib.Popup({
      anchor: narrow ? (map.project([lng, lat]).y < container.clientHeight / 2 ? "top" : "bottom") : undefined,
      closeButton: false,
      closeOnClick: false,
      focusAfterOpen: false,
      maxWidth: "none",
      offset: popupOffset,
      className: popupFrame,
    })
      .setLngLat([lng, lat])
      .setDOMContent(el)
      .addTo(map);
    // Once it has its size, the map slides until the card and its pin sit on
    // the open map, clear of whatever floats over it.
    const fit = requestAnimationFrame(() => {
      const drawn = el.firstElementChild?.getBoundingClientRect();
      const frameBox = map.getContainer().getBoundingClientRect();
      if (!drawn) return;
      const pin = map.project([lng, lat]);
      const px = pin.x + frameBox.left;
      const py = pin.y + frameBox.top;
      const left = Math.min(drawn.left, px - 40);
      const top = Math.min(drawn.top, py - 20);
      const card = {
        left,
        top,
        width: Math.max(drawn.right, px + 40) - left,
        height: Math.max(drawn.bottom, py + 20) - top,
      };
      const i = room.current;
      const pad = 12;
      const box = { l: i.left + pad, t: i.top + pad, r: frameBox.width - i.right - pad, b: frameBox.height - i.bottom - pad };
      const l = card.left - frameBox.left;
      const t = card.top - frameBox.top;
      const dx = l < box.l ? l - box.l : l + card.width > box.r ? l + card.width - box.r : 0;
      const dy = t < box.t ? t - box.t : t + card.height > box.b ? t + card.height - box.b : 0;
      if (dx || dy) map.panBy([dx, dy], { duration: reduced ? 0 : 300 });
    });
    return () => {
      cancelAnimationFrame(fit);
      popup.remove();
    };
    // Laid out once per opening; an inset that changes later leaves it be.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lib, map, el, lng, lat]);
  React.useEffect(() => {
    // Focus goes into the card only when a key opened it; a click leaves it on the pin.
    if (focusOnOpen) el.querySelector<HTMLElement>("a[href], button")?.focus({ preventScroll: true });
  }, [el, focusOnOpen]);
  return createPortal(children, el);
}

function ControlButton({ icon, label, onClick }: { icon: IconSvgElement; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), buttonRing)}
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} aria-hidden />
    </button>
  );
}

// Ghost pins while the tiles arrive, where real ones tend to land, so the
// swap reads as the map coming into focus.
const ghosts = [
  [58, 30, 14],
  [72, 22, 12],
  [66, 48, 16],
  [84, 40, 12],
  [40, 62, 14],
  [78, 66, 16],
  [52, 78, 12],
];

function MapSkeleton({
  reason,
  inset,
  ghosts: withGhosts = true,
  onRetry,
}: {
  /** Why it stands in: tiles on their way, tiles that did not come, or a
   *  browser that cannot draw the map. */
  reason: "loading" | "network" | "webgl";
  inset: MapInset;
  /** Price pins standing in while the tiles arrive; a world map has none. */
  ghosts?: boolean;
  onRetry?: () => void;
}) {
  const id = React.useId();
  return (
    <div className="absolute inset-0 overflow-hidden bg-accent">
      <svg aria-hidden className="absolute inset-0 size-full text-border">
        <defs>
          <pattern id={`${id}-streets`} width="96" height="96" patternUnits="userSpaceOnUse">
            <path d="M0 48H96M48 0V96" stroke="currentColor" strokeWidth="2" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-streets)`} />
      </svg>
      {reason === "loading" ? (
        <>
          {withGhosts &&
            ghosts.map(([x, y, w]) => (
            <span
              key={`${x}-${y}`}
              aria-hidden
              // physical: a ghost stands where a pin would, on the map
              style={{ left: `${x}%`, top: `${y}%`, width: `${w * 0.25}rem` }}
              className={cn("absolute h-8 bg-card motion-safe:animate-pulse", pinShape)}
            />
          ))}
          <p role="status" className="sr-only">
            Loading the map
          </p>
        </>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          // physical: the panel the notice centres beside floats on the map's left
          style={inset.left ? { paddingLeft: inset.left + 16 } : undefined}
        >
          <div role="alert" className="max-w-xs rounded-lg bg-card p-5 text-center shadow-soft">
            <p className="text-base font-medium text-foreground">
              {reason === "webgl" ? "This browser cannot draw the map" : "The map did not load"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {reason === "webgl"
                ? "Every place is in the list. Turn on hardware acceleration to see them placed."
                : "The list still works. Check your connection and try the map again."}
            </p>
            {onRetry && reason === "network" && (
              <Button variant="outline" size="sm" onClick={onRetry} className={cn("mt-4", buttonRing)}>
                Load the map again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── The card on a pin ───────────────────────────────────────────────────────

const stretched =
  "outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring";

const disc = cn(
  "relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-card text-foreground shadow-soft press active:shadow-none",
  "after:absolute after:-inset-0.5 after:content-[''] hover:bg-photo-lift-deep",
  ring,
);

/** The card a pin opens: a photograph, a name that links on, a line under it
 *  and a foot with a detail and a price. The whole card is the link; the
 *  close and any `action` sit above it. */
function MapCard({
  href,
  title,
  image,
  badge,
  meta,
  detail,
  price,
  action,
  className,
}: {
  href: string;
  title: string;
  /** A next/image filling the frame, `object-cover`. */
  image?: React.ReactNode;
  /** A word on the photograph: "Guest favourite". */
  badge?: string;
  meta?: React.ReactNode;
  detail?: React.ReactNode;
  price?: React.ReactNode;
  /** A control beside the close — a save heart. */
  action?: React.ReactNode;
  className?: string;
}) {
  const popup = useMapPopup();
  const close = popup && (
    <button type="button" aria-label="Close" onClick={popup.close} className={disc}>
      <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} aria-hidden />
    </button>
  );
  return (
    <article
      data-slot="map-card"
      className={cn(
        "group relative w-[min(18rem,calc(100vw-2rem))] rounded-lg bg-popover text-popover-foreground shadow-soft-lg",
        className,
      )}
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-muted [&_img]:size-full [&_img]:object-cover">
          {image}
          {badge && (
            <span className="absolute start-3 bottom-3 inline-flex h-7 items-center rounded-control bg-card px-2.5 text-xs font-medium text-foreground shadow-soft">
              {badge}
            </span>
          )}
        </div>
      )}
      {image && (action || close) && (
        <div className="absolute inset-x-3 top-3 flex justify-between gap-2">
          {action ?? <span />}
          {close}
        </div>
      )}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 text-base font-medium text-foreground">
            <Link href={href} className={cn(stretched, "transition-colors hover:text-primary-ink")}>
              <span className="line-clamp-2">{title}</span>
            </Link>
          </h3>
          {!image && close}
        </div>
        {meta && <p className="mt-1 truncate text-sm text-muted-foreground">{meta}</p>}
        {(detail || price) && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3">
            <p className="truncate text-sm text-muted-foreground tabular-nums">{detail}</p>
            <p className="shrink-0 text-sm text-muted-foreground tabular-nums">{price}</p>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── The world ───────────────────────────────────────────────────────────────

// A map that only says where — offices, the cities a service runs in, a
// route. With `cities` the map frames the whole world and holds it still, the
// page scrolling through it; each city is a pin with its name and its own
// clock, and `arcs` draws a dashed route between two cities by id. With a way
// to pick one (`selected`, `defaultSelected` or `onSelectedChange`) the cities
// are a radio group; without, they are labels on the drawing. Where a pin
// would meet another or run off the map, every city steps down to a dot,
// picked the same way, its name said rather than shown.

export type MapCity = {
  id: string;
  lngLat: LngLat;
  /** The city: "Lisbon". */
  label: string;
  /** After the name, in the quiet ink: a count, a line. */
  meta?: string;
  /** An IANA zone — "Europe/Lisbon" — for the city's own clock after its name, kept to the minute. */
  timeZone?: string;
};
/** A pin with the name, a dot with the name said, or a pin until pins would crowd. */
export type MapCityLook = "auto" | "pin" | "dot";

/** The inhabited latitudes, Antarctica and the high Arctic left off: on a
 *  stage of 2:1 or wider the world runs edge to edge. */
const WORLD: [LngLat, LngLat] = [
  [-180, -50],
  [180, 72],
];

// The minute, read on the client only — the server's clock is not the
// visitor's — and a formatter per zone for the life of the page.
const everyMinute = (tick: () => void) => {
  const id = window.setInterval(tick, 15_000);
  return () => window.clearInterval(id);
};
const useMinute = () => React.useSyncExternalStore(everyMinute, () => Math.floor(Date.now() / 60_000), () => null);
const clocks = new Map<string, Intl.DateTimeFormat | null>();
function clockIn(timeZone: string, minute: number) {
  if (!clocks.has(timeZone)) {
    try {
      clocks.set(timeZone, dateFormat({ hour: "numeric", minute: "2-digit", timeZone }));
    } catch {
      clocks.set(timeZone, null);
    }
  }
  return clocks.get(timeZone)?.format(minute * 60_000);
}

// An arc bends as it would drawn on the flat map: a curve in Mercator's own
// space, lifted north by a quarter of its length, laid down in 48 steps.
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const latAt = (y: number) => ((2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180) / Math.PI;

function arcLine([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): LngLat[] {
  const rad = Math.PI / 180;
  const p = { x: lng1 * rad, y: mercY(lat1) };
  const q = { x: lng2 * rad, y: mercY(lat2) };
  const c = { x: (p.x + q.x) / 2, y: Math.max(p.y, q.y) + Math.hypot(q.x - p.x, q.y - p.y) * 0.24 };
  return Array.from({ length: 49 }, (_, i) => {
    const t = i / 48;
    const u = 1 - t;
    return [(u * u * p.x + 2 * u * t * c.x + t * t * q.x) / rad, latAt(u * u * p.y + 2 * u * t * c.y + t * t * q.y)];
  });
}

type CityLayout = { spots: Record<string, { x: number; y: number }>; w: number; h: number };

// A city pin's width before it is drawn, with the tick a pick adds counted on
// every one and a clock read at its longest, so neither a pick nor the hour
// turning flips the look.
const cityPinWidth = (c: MapCity) =>
  52 + c.label.length * 7.6 + (c.meta ? 6 + c.meta.length * 7.2 : c.timeZone ? 64 : 0);

// Each pin centred on its city and slid inward where the map's edge would
// cut it; null when the stage cannot hold one, or two would meet.
function pinRects(cities: MapCity[], { spots, w, h }: CityLayout) {
  const rects: Record<string, Rect> = {};
  for (const c of cities) {
    const s = spots[c.id];
    const cw = cityPinWidth(c);
    if (!s || w < cw + 16 || h < 56) return null;
    const x = Math.min(Math.max(s.x, cw / 2 + 8), w - cw / 2 - 8);
    const y = Math.min(Math.max(s.y, 28), h - 28);
    rects[c.id] = { l: x - cw / 2, t: y - 20, w: cw, h: 40 };
  }
  const all = Object.values(rects);
  return all.some((r, i) => all.some((o, j) => j > i && meets(r, o, 4))) ? null : rects;
}

// A city's own element takes the press, the focus and, on a 12px dot, the
// reach to 40px; what it holds is the pin or the dot. On the map it is placed
// absolutely, so the wrapper leaves the position to whoever places it.
const cityWrap = (look: "pin" | "dot") =>
  cn("group/pin flex outline-none", look === "dot" && "size-3 press after:absolute after:-inset-3.5 after:content-['']");

// The dot is the quiet ink on a ring of the card, lifting it off the land; a
// picked one is the brand's fill in a pale brand halo, with a dark centre as
// on a house radio — the cue the pale fill cannot carry alone. No dark rim.
function CityMark({ look, picked, label, meta }: { look: "pin" | "dot"; picked?: boolean; label: string; meta?: string }) {
  if (look === "pin")
    return (
      <MapPinPill size="area" picked={picked} count={meta}>
        {label}
      </MapPinPill>
    );
  return (
    <span
      aria-hidden
      data-map-dot
      className={cn(
        "flex size-3 items-center justify-center rounded-full transition-colors duration-answer ease-answer motion-reduce:transition-none",
        "group-focus-visible/pin:outline-2 group-focus-visible/pin:outline-offset-2 group-focus-visible/pin:outline-ring group-focus-visible/pin:outline-solid",
        picked
          ? "bg-primary ring-4 ring-primary/30 group-hover/pin:bg-primary/80"
          : "bg-foreground/60 ring-4 ring-card group-hover/pin:bg-foreground",
      )}
    >
      {picked && <span className="size-1 rounded-full bg-primary-foreground" />}
    </span>
  );
}

/** A city as the world map draws it, off the map: the design system draws one per state. */
function MapCityMarker({
  look = "pin",
  picked,
  label,
  meta,
}: {
  look?: "pin" | "dot";
  picked?: boolean;
  label: string;
  meta?: string;
}) {
  return (
    <span className={cn("relative", cityWrap(look))}>
      <CityMark look={look} picked={picked} label={label} meta={meta} />
    </span>
  );
}

function MapCities({
  cities,
  layout,
  look,
  pickable,
  picked,
  onPick,
  label,
}: {
  cities: MapCity[];
  layout: CityLayout;
  look: MapCityLook;
  pickable: boolean;
  picked: string | null;
  onPick: (id: string) => void;
  label: string;
}) {
  const minute = useMinute();
  const metaOf = (c: MapCity) => c.meta ?? (c.timeZone && minute !== null ? clockIn(c.timeZone, minute) : undefined);
  const rects = React.useMemo(() => pinRects(cities, layout), [cities, layout]);
  const kind = look === "dot" || (look === "auto" && !rects) ? "dot" : "pin";
  const at = (c: MapCity) => {
    const r = kind === "pin" ? rects?.[c.id] : undefined;
    return r ? { left: r.l + r.w / 2, top: r.t + r.h / 2 } : { left: layout.spots[c.id]?.x, top: layout.spots[c.id]?.y };
  };
  const layer = "pointer-events-none absolute inset-0 z-10";
  // physical: a city sits on its point on the map, which does not turn with the page
  const onPoint = "absolute -translate-1/2";

  if (!pickable)
    return (
      <ul aria-label={label} className={layer}>
        {cities.map((c) => {
          const meta = metaOf(c);
          return (
            <li key={c.id} data-slot="map-city" data-map-pin={`city:${c.id}`} style={at(c)} className={cn(onPoint, "flex")}>
              <CityMark look={kind} label={c.label} meta={meta} />
              {kind === "dot" && <span className="sr-only">{meta ? `${c.label}, ${meta}` : c.label}</span>}
            </li>
          );
        })}
      </ul>
    );

  return (
    <RadioGroup aria-label={label} value={picked} onValueChange={(next) => onPick(next as string)} className={layer}>
      {cities.map((c) => {
        const on = c.id === picked;
        const meta = metaOf(c);
        return (
          <Radio.Root
            key={c.id}
            value={c.id}
            data-slot="map-city"
            data-map-pin={`city:${c.id}`}
            aria-label={meta ? `${c.label}, ${meta}` : c.label}
            style={at(c)}
            className={cn(onPoint, "pointer-events-auto", cityWrap(kind), on && "z-10")}
          >
            <CityMark look={kind} picked={on} label={c.label} meta={meta} />
          </Radio.Root>
        );
      })}
    </RadioGroup>
  );
}

// ─── The map ─────────────────────────────────────────────────────────────────

const NO_INSET: MapInset = { top: 0, right: 0, bottom: 0, left: 0 };
const NO_PINS: MapPin[] = [];
const NO_ARCS: [string, string][] = [];
const ARCS = "map-arcs";

type MapViewProps = {
  pins?: MapPin[];
  /** The world map in place of pins: the whole world held still, a pin per city. */
  cities?: MapCity[];
  /** Dashed routes between two cities, by id. */
  arcs?: [from: string, to: string][];
  /** Pins until two would meet or one would run off the map, then dots; or always one of the two. */
  cityLook?: MapCityLook;
  /** Named areas, for the pills drawn when the map is zoomed out past `clusterZoom`. */
  areas?: MapArea[];
  /** Under this zoom, pins with an area gather into one pill per area. */
  clusterZoom?: number;
  /** The pin whose card is open — on a world map, the city picked. */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (pin: string | null) => void;
  /** The pin lit from outside — a list card under the pointer — or by the map itself. */
  lit?: string | null;
  onLitChange?: (pin: string | null) => void;
  inset?: MapInset;
  mapStyle?: MapStyleId;
  /** False for a map that is a picture: it stays still, its pins are drawing, the page scrolls through it. */
  interactive?: boolean;
  /** For a map inside a scrolling page: the wheel zooms only with Ctrl or ⌘ held, a swipe pans only with two fingers. */
  cooperative?: boolean;
  /** Zoom in, zoom out and fit every pin, stacked at the top end. */
  controls?: boolean;
  /** How a gathered pill counts what it holds: "3 places". */
  gatherLabel?: (count: number) => string;
  /** The open part of the map, after every move — for a "search as I move" or an "N in view". */
  onBoundsChange?: (bounds: MapBounds) => void;
  /** The map's name for a screen reader — on a world map, the cities' too: "Support desks". */
  label?: string;
  /** Laid over the map and its markers: a card standing on the map. */
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<MapHandle>;
};

function MapView({
  pins = NO_PINS,
  cities,
  arcs = NO_ARCS,
  cityLook = "auto",
  areas = [],
  clusterZoom = 8,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  lit: litProp,
  onLitChange,
  inset: insetProp = NO_INSET,
  mapStyle = "muted",
  interactive = true,
  cooperative = false,
  controls = true,
  gatherLabel = (n) => `${n} places`,
  onBoundsChange,
  label = "Map",
  children,
  className,
  ref,
}: MapViewProps) {
  const world = cities !== undefined;
  // The map a listing is browsed on, standing in for the page rather than
  // sitting inside one that scrolls.
  const browse = interactive && !cooperative && !world;
  const box = React.useRef<HTMLDivElement>(null);
  const [lib, setLib] = React.useState<MapLibre | null>(null);
  const [map, setMap] = React.useState<MapLibreMap | null>(null);
  // Null until the browser has said whether it can draw WebGL at all.
  const drawable = useDrawable();
  const [ready, setReady] = React.useState(false);
  const [drawn, setDrawn] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const [zoomedOut, setZoomedOut] = React.useState(true);
  const [width, setWidth] = React.useState(0);
  const [gathers, setGathers] = React.useState<string[][]>([]);
  const [sides, setSides] = React.useState<Record<string, Side>>({});
  const [focusCard, setFocusCard] = React.useState(false);
  const [cityLayout, setCityLayout] = React.useState<CityLayout | null>(null);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const reduced = useReducedMotion();
  const dir = useDirection();

  const [ownSelected, setOwnSelected] = React.useState<string | null>(defaultSelected);
  const selected = selectedProp === undefined ? ownSelected : selectedProp;
  const select = (next: string | null) => {
    if (selectedProp === undefined) setOwnSelected(next);
    onSelectedChange?.(next);
  };
  const [ownLit, setOwnLit] = React.useState<string | null>(null);
  const lit = litProp === undefined ? ownLit : litProp;
  const light = (next: string | null) => {
    if (litProp === undefined) setOwnLit(next);
    onLitChange?.(next);
  };

  // The controls float at the top end; the camera keeps clear of them.
  const inset = React.useMemo<MapInset>(() => {
    if (!interactive || !controls || world) return insetProp;
    const room = 56;
    return dir === "rtl" ? { ...insetProp, left: insetProp.left + room } : { ...insetProp, right: insetProp.right + room };
  }, [insetProp, interactive, controls, world, dir]);

  const byId = React.useMemo(() => new Map(pins.map((p) => [p.id, p])), [pins]);
  const areaCentres = React.useMemo(() => {
    const out: [string, LngLat][] = [];
    for (const a of areas) {
      const inArea = pins.filter((p) => p.area === a.id);
      if (inArea.length) out.push([a.id, centreOf(inArea.map((p) => p.lngLat))]);
    }
    return out;
  }, [areas, pins]);
  const byArea = areaCentres.length > 0 && zoomedOut;

  // The latest of what a MapLibre listener reads, so listeners bind once and
  // never see a stale render.
  const live = React.useRef({ inset, pins, cities, arcs, onBoundsChange });
  React.useEffect(() => {
    live.current = { inset, pins, cities, arcs, onBoundsChange };
  });
  const duration = reduced ? 0 : 900;

  // The place labels taken off the basemap: the areas' and cities' own names always, and
  // every label a pin, a pill or a dot stands on. In refs, so a new style
  // starts with them and an update is one setFilter a label layer. `relabel`
  // is filled in once the pins exist; the map's `idle` calls it.
  const cityNames = (cities ?? []).map((c) => c.label).join("|");
  const always = React.useMemo(
    () => [...areas.map((a) => a.name), ...(cityNames ? cityNames.split("|") : [])],
    [areas, cityNames],
  );
  const hidden = React.useRef<string[]>(always);
  const baseFilters = React.useRef<Map<string, unknown>>(new Map());
  const relabel = React.useRef(() => {});

  // The map itself, once.
  React.useEffect(() => {
    let cancelled = false;
    let made: MapLibreMap | null = null;
    if (!canDraw()) return;

    loadLibrary()
      .then((ml) => {
        if (cancelled || !box.current) return;
        const start = live.current.pins.map((p) => p.lngLat);
        try {
          made = new ml.Map({
            container: box.current,
            ...(world
              ? { bounds: WORLD, fitBoundsOptions: { padding: 0 } }
              : start.length
                ? { bounds: boundsOf(start), fitBoundsOptions: { padding: padFor(live.current.inset, start), maxZoom: 14 } }
                : { center: [0, 20] as LngLat, zoom: 1 }),
            // The world on a phone is under zoom 0.
            minZoom: world ? -2 : 1,
            maxZoom: 17,
            attributionControl: false,
            dragRotate: false,
            pitchWithRotate: false,
            touchPitch: false,
            renderWorldCopies: false,
            // The world map is a picture; its cities are what takes a press.
            interactive: interactive && !world,
            cooperativeGestures: interactive && cooperative && !world,
            // The canvas is the map's own region; this is the name it is read by.
            locale: { "Map.Title": label },
          });
        } catch (err) {
          console.warn("The map could not start:", err);
          setFailed(true);
          return;
        }
        const m = made;
        if (interactive && !world) {
          m.touchZoomRotate.disableRotation();
          m.keyboard.disableRotation();
        }
        const compact = box.current.clientWidth < 640;
        m.addControl(new ml.AttributionControl({ compact }), "bottom-right");

        const report = () => {
          const i = live.current.inset;
          const { clientWidth: w, clientHeight: h } = m.getContainer();
          const nw = m.unproject([Math.min(i.left, w - 1), Math.min(i.top, h - 1)]);
          const se = m.unproject([Math.max(w - i.right, 1), Math.max(h - i.bottom, 1)]);
          live.current.onBoundsChange?.([nw.lng, se.lat, se.lng, nw.lat]);
        };
        m.on("resize", () => setWidth(m.getContainer().clientWidth));
        m.on("moveend", report);
        m.on("zoom", () => setZoomedOut(m.getZoom() < clusterZoom));
        m.once("idle", () => setDrawn(true));
        m.on("idle", () => relabel.current());
        m.once("load", () => {
          // Folded from the start on a narrow map; the (i) opens it.
          if (compact) box.current?.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          setReady(true);
          setZoomedOut(m.getZoom() < clusterZoom);
          setWidth(m.getContainer().clientWidth);
          report();
        });
        // Dark asks for sprites it does not ship; an empty pixel stands in
        // rather than a warning on every load.
        m.setMissingStyleImageResolver((id) => {
          if (!m.hasImage(id)) m.addImage(id, { width: 1, height: 1, data: new Uint8Array(4) });
        });
        setLib(ml);
        setMap(m);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      made?.remove();
      setMap(null);
      setReady(false);
    };
    // Built once; what it reads later comes through `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The style: fetched once per choice, Muted moved onto the tokens of the
  // half the page is in, read a frame after the theme flips.
  React.useEffect(() => {
    if (!map) return;
    let cancelled = false;
    (async () => {
      try {
        const json = await loadStyle(styleUrl(mapStyle, dark));
        await new Promise((r) => requestAnimationFrame(r));
        if (cancelled) return;
        baseFilters.current = new Map(placeLabelLayers(json).map((l) => [l.id, "filter" in l ? l.filter : undefined]));
        const named = hidePlaceLabels(json, hidden.current);
        map.setStyle(mapStyle === "muted" ? tintStyle(named, dark) : named, { diff: false });
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [map, mapStyle, dark, attempt]);

  // A press anywhere on the map that is not a pin or the open card closes it.
  React.useEffect(() => {
    if (!map || world) return;
    const onClick = (ev: { originalEvent: MouseEvent }) => {
      const t = ev.originalEvent.target as HTMLElement | null;
      if (t?.closest("[data-map-pin], .maplibregl-popup")) return;
      select(null);
    };
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  });

  const pinFor = (node: HTMLElement, ids: string[]) =>
    [...node.querySelectorAll<HTMLElement>("[data-map-pin]")].find((el) =>
      (el.dataset.pins ?? "").split("|").some((n) => ids.includes(n)),
    );

  // A pill that gathers places is gone once the zoom it starts passes it, so
  // focus waits on the map while the camera moves, then goes on to the first
  // pin that took its place — looked for each frame until the camera stops
  // and the pin is there.
  function handOn(from: HTMLElement, ids: string[]) {
    // A click on macOS never focuses a button, so focus is the pill or nowhere
    // (<body>), and it goes on with the pill from either. Moved for a pointer,
    // it moves without a ring.
    const at = document.activeElement;
    if (!map || (at !== from && at !== document.body && at !== null)) return;
    const quiet = { preventScroll: true, focusVisible: at === from ? undefined : false };
    map.getCanvas().focus(quiet);
    let frames = 0;
    let held: HTMLElement | undefined;
    // The visitor's next press or key is theirs: the watch ends there.
    let done = false;
    const stop = () => (done = true);
    const end = () => {
      document.removeEventListener("pointerdown", stop, { capture: true });
      document.removeEventListener("keydown", stop, { capture: true });
    };
    document.addEventListener("pointerdown", stop, { capture: true, once: true });
    document.addEventListener("keydown", stop, { capture: true, once: true });
    const look = () => {
      // Watched for four seconds, while focus is the canvas or the pin it was
      // handed to: a later gathering can redraw that pin, and focus then goes
      // on to the one that took its place rather than to <body>.
      const now = document.activeElement;
      const ours = now === map.getCanvas() || (held && (now === held || (now === document.body && !held.isConnected)));
      if (done || ++frames > 240 || !ours) return end();
      const settled = !map.isMoving() && map.getContainer().dataset.gatheredAt === String(map.getZoom());
      const pin = now !== held && settled ? pinFor(map.getContainer(), ids) : undefined;
      if (pin) {
        held = pin;
        pin.focus(quiet);
      }
      requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  }

  const fitAll = () => map && frame(map, pins.map((p) => p.lngLat), inset, duration);

  React.useImperativeHandle(
    ref,
    () => ({
      flyTo: (id) => {
        const p = byId.get(id);
        if (!map || !p) return;
        map.flyTo({
          center: p.lngLat,
          zoom: Math.max(map.getZoom(), 13.5),
          padding: padFor(inset, [p.lngLat]),
          duration,
          essential: false,
        });
      },
      fit: () => fitAll(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, byId, pins, inset, duration],
  );

  // Closing the card hands focus back to its pin, or the pill gathering it,
  // or the map when neither is drawn.
  const close = (id: string) => {
    select(null);
    if (!map) return;
    (pinFor(map.getContainer(), [id]) ?? map.getCanvas()).focus({ preventScroll: true });
  };

  const compact = width - inset.left - inset.right < 600;

  // The area pills' sides, laid again whenever the distances between them change.
  const insetKey = `${inset.top} ${inset.right} ${inset.bottom} ${inset.left}`;
  React.useEffect(() => {
    if (!map || !ready || !byArea) return;
    let f = 0;
    const lay = () => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(() => {
        if (box.current) setSides(layPills(map, areaCentres, compact, live.current.inset, box.current));
      });
    };
    lay();
    map.on("zoomend", lay);
    map.on("resize", lay);
    return () => {
      cancelAnimationFrame(f);
      map.off("zoomend", lay);
      map.off("resize", lay);
    };
  }, [map, ready, byArea, areaCentres, compact, insetKey]);

  // Zoomed in, the pins that would touch are gathered, laid again after each
  // zoom and resize and whenever the pins change.
  React.useEffect(() => {
    if (!map || !ready || byArea) return;
    let f = 0;
    const lay = () => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(() => {
        // The zoom it ran at, for a focus waiting to land on a pin.
        map.getContainer().dataset.gatheredAt = String(map.getZoom());
        setGathers(gatherPins(map, pins, byId, gatherLabel));
      });
    };
    lay();
    map.on("zoomend", lay);
    map.on("resize", lay);
    return () => {
      cancelAnimationFrame(f);
      map.off("zoomend", lay);
      map.off("resize", lay);
    };
    // A new label function each render is not a new layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, byArea, pins, byId]);

  // The world map: the world framed again whenever the stage changes size,
  // and each city's point on it read off after.
  const cityKey = (cities ?? []).map((c) => `${c.id}@${c.lngLat.join(",")}`).join("|");
  React.useEffect(() => {
    if (!map || !ready || !world) return;
    const lay = () => {
      map.fitBounds(WORLD, { padding: 0, duration: 0 });
      const { clientWidth: w, clientHeight: h } = map.getContainer();
      const spots = Object.fromEntries(
        (live.current.cities ?? []).map((c) => {
          const { x, y } = map.project(c.lngLat);
          return [c.id, { x, y }];
        }),
      );
      setCityLayout({ spots, w, h });
    };
    lay();
    map.on("resize", lay);
    return () => {
      map.off("resize", lay);
    };
  }, [map, ready, world, cityKey]);

  // The arcs, a dashed line in the quiet ink under the basemap's labels. A
  // new style drops every layer it did not bring, so they are laid again on
  // each, in the ink of the half the page is in. Not before the first style
  // has loaded, which MapLibre warns about.
  const arcKey = arcs.map((a) => a.join(">")).join("|");
  React.useEffect(() => {
    if (!map || !ready || !world) return;
    const draw = () => {
      const at = new Map((live.current.cities ?? []).map((c) => [c.id, c.lngLat]));
      const data: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
        type: "FeatureCollection",
        features: live.current.arcs.flatMap(([a, b]) => {
          const p = at.get(a);
          const q = at.get(b);
          return p && q
            ? [{ type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: arcLine(p, q) } }]
            : [];
        }),
      };
      const source = map.getSource<GeoJSONSource>(ARCS);
      if (source) {
        source.setData(data);
        return;
      }
      map.addSource(ARCS, { type: "geojson", data });
      const firstLabel = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
      map.addLayer(
        {
          id: ARCS,
          type: "line",
          source: ARCS,
          paint: { "line-color": css(token("--foreground"), 0.45), "line-width": 1.25, "line-dasharray": [3.2, 4] },
        },
        firstLabel,
      );
    };
    map.on("style.load", draw);
    if (map.isStyleLoaded()) draw();
    return () => {
      map.off("style.load", draw);
    };
  }, [map, ready, world, arcKey, cityKey]);

  // Which place labels a pill or a dot stands on right now, from the names and
  // points the tiles carry, wide enough to catch a label set beside its dot.
  React.useEffect(() => {
    relabel.current = () => {
      const node = box.current;
      if (!map || !node || !ready) return;
      const frameBox = node.getBoundingClientRect();
      const taken = [...node.querySelectorAll<HTMLElement>("[data-map-pin] > span, [data-map-dot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - frameBox.left, t: r.top - frameBox.top, w: r.width, h: r.height };
      });
      // What floats over the map from outside it — a panel, the controls —
      // cuts a label as a pill does, so a label it would cut goes too.
      const i = live.current.inset;
      taken.push(
        { l: 0, t: 0, w: i.left, h: frameBox.height },
        { l: 0, t: 0, w: frameBox.width, h: i.top },
        { l: frameBox.width - i.right, t: 0, w: i.right, h: frameBox.height },
        { l: 0, t: frameBox.height - i.bottom, w: frameBox.width, h: i.bottom },
      );
      const names = new Set(always);
      let places: ReturnType<MapLibreMap["querySourceFeatures"]> = [];
      try {
        places = map.querySourceFeatures("openmaptiles", { sourceLayer: "place" });
      } catch {
        return;
      }
      for (const f of places) {
        const name = f.properties?.name as string | undefined;
        if (!name || names.has(name) || f.geometry.type !== "Point") continue;
        const { x, y } = map.project(f.geometry.coordinates as [number, number]);
        const w = name.length * 8 + 16;
        if (taken.some((r) => meets({ l: x - w / 2, t: y - 14, w, h: 28 }, r, 2))) names.add(name);
      }
      const next = [...names].sort();
      if (next.join("|") === [...hidden.current].sort().join("|")) return;
      hidden.current = next;
      for (const [id, base] of baseFilters.current) {
        if (map.getLayer(id)) map.setFilter(id, withoutNames(base, next));
      }
    };
  });
  React.useEffect(() => {
    const f = requestAnimationFrame(() => relabel.current());
    return () => cancelAnimationFrame(f);
  }, [sides, gathers, byArea, pins, compact, ready, cityLayout]);

  const open = selected ? byId.get(selected) : undefined;
  const state = drawable === false || failed ? "fallback" : drawn ? "ready" : "loading";

  // The groups to draw zoomed in: each gathered set, then every pin no set took.
  const groups = React.useMemo(() => {
    const kept = gathers.map((g) => g.filter((id) => byId.has(id))).filter((g) => g.length > 1);
    const taken = new Set(kept.flat());
    return [...kept, ...pins.filter((p) => !taken.has(p.id)).map((p) => [p.id])];
  }, [gathers, pins, byId]);

  return (
    <div data-slot="map" className={cn("relative isolate overflow-hidden rounded-lg bg-accent", className)}>
      <div
        ref={box}
        data-map={state}
        className={cn(
          // A size rather than an inset: MapLibre's own sheet sets the
          // container `position: relative`, and it sits outside the layers.
          // Clipped rather than hidden: a hidden box still scrolls, and a pin
          // focused near its edge scrolled the whole map off its canvas.
          "size-full overflow-clip! font-sans!",
          // The attribution stays on the map in the site's type and ink; on a
          // map narrower than 640px it folds behind MapLibre's own (i).
          "[&_.maplibregl-ctrl-attrib]:bg-card/85! [&_.maplibregl-ctrl-attrib]:text-xs! [&_.maplibregl-ctrl-attrib]:text-muted-foreground! [&_.maplibregl-ctrl-attrib]:backdrop-blur-sm",
          "[&_.maplibregl-ctrl-attrib_a]:text-muted-foreground! [&_.maplibregl-ctrl-attrib_a:hover]:text-foreground!",
          "[&_.maplibregl-ctrl-attrib:not(.maplibregl-compact)]:m-2.5! [&_.maplibregl-ctrl-attrib:not(.maplibregl-compact)]:rounded-control! [&_.maplibregl-ctrl-attrib:not(.maplibregl-compact)]:px-2.5!",
          "[&_.maplibregl-ctrl-attrib.maplibregl-compact]:m-2.5! [&_.maplibregl-ctrl-attrib.maplibregl-compact]:rounded-control! [&_.maplibregl-ctrl-attrib.maplibregl-compact]:bg-card! dark:[&_.maplibregl-ctrl-attrib.maplibregl-compact::after]:invert",
          // MapLibre draws the folded (i) at 24px; the overhang takes its reach to 40.
          "[&_.maplibregl-ctrl-attrib-button]:after:absolute [&_.maplibregl-ctrl-attrib-button]:after:-inset-2 [&_.maplibregl-ctrl-attrib-button]:after:content-['']",
          // Below sm the preset panel's 44px circle holds the screen's
          // bottom-right corner, and a browse map's with it, so the folded (i)
          // stands above the circle, centred on it, its reach 4px clear. A
          // page with a bottom bar lifts the circle instead, and the (i) keeps
          // its corner.
          browse && [
            // physical: the circle holds the right-hand corner in either direction
            "max-sm:[html:not(:has([data-bottom-bar]))_&]:[&_.maplibregl-ctrl-attrib.maplibregl-compact]:mr-[1.625rem]!",
            "max-sm:[html:not(:has([data-bottom-bar]))_&]:[&_.maplibregl-ctrl-attrib.maplibregl-compact]:mb-[calc(4.5rem+env(safe-area-inset-bottom))]!",
          ],
          // The hint a cooperative map shows when the wheel passes it by.
          "[&_.maplibregl-cooperative-gesture-screen]:bg-foreground/45! [&_.maplibregl-cooperative-gesture-screen]:text-base! [&_.maplibregl-cooperative-gesture-screen]:font-medium! [&_.maplibregl-cooperative-gesture-screen]:text-background!",
          // The canvas takes Tab — arrows pan, + and − zoom — so it rings like
          // any control, inside its edge, since the map clips what is past it.
          "[&_.maplibregl-canvas]:outline-none [&_.maplibregl-canvas:focus-visible]:outline-solid! [&_.maplibregl-canvas:focus-visible]:outline-2! [&_.maplibregl-canvas:focus-visible]:-outline-offset-2! [&_.maplibregl-canvas:focus-visible]:outline-ring!",
        )}
      />

      {(!ready || state === "fallback") && (
        <MapSkeleton
          reason={state === "fallback" ? (drawable === false ? "webgl" : "network") : "loading"}
          inset={insetProp}
          ghosts={!world}
          onRetry={() => {
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
        />
      )}

      {lib && map && ready && byArea &&
        areaCentres.map(([areaId, centre]) => {
          const area = areas.find((a) => a.id === areaId)!;
          const inside = pins.filter((p) => p.area === areaId);
          const on = Boolean(lit && byId.get(lit)?.area === areaId);
          const words = (
            <MapPinPill lit={on} size={compact ? "area-compact" : "area"} count={compact ? inside.length : `· ${inside.length}`}>
              {compact ? (area.short ?? area.name) : area.name}
            </MapPinPill>
          );
          return (
            <MapMarker key={`area-${areaId}`} lib={lib} map={map} at={centre} z={on ? 3 : 1}>
              {/* A dot on the area, and its pill to the side that clears every other. */}
              <div className="relative size-0">
                <span
                  aria-hidden
                  data-map-dot
                  // The brand's fill in a light-brand halo, as a city's dot: it only
                  // marks where the pin beside it points, and the pin is read.
                  className="absolute size-3 -translate-1/2 rounded-full bg-primary shadow-soft ring-4 ring-primary/30"
                />
                {interactive ? (
                  <button
                    type="button"
                    data-map-pin={`area:${areaId}`}
                    data-pins={inside.map((p) => p.id).join("|")}
                    aria-label={`${area.name}, ${inside.length} ${inside.length === 1 ? "place" : "places"}. Zoom in`}
                    onClick={(ev) => {
                      frame(map, inside.map((p) => p.lngLat), inset, duration);
                      handOn(ev.currentTarget, inside.map((p) => p.id));
                    }}
                    style={{ transform: pillOffset(sides[areaId] ?? SIDES[0]) }}
                    // physical: a pill hangs off its dot on the map, which does not turn with the page
                    className="group/pin absolute top-0 left-0 p-1 outline-none"
                  >
                    {words}
                  </button>
                ) : (
                  <span
                    aria-hidden
                    data-map-pin={`area:${areaId}`}
                    style={{ transform: pillOffset(sides[areaId] ?? SIDES[0]) }}
                    // physical: a pill hangs off its dot on the map, which does not turn with the page
                    className="absolute top-0 left-0 p-1"
                  >
                    {words}
                  </span>
                )}
              </div>
            </MapMarker>
          );
        })}

      {lib && map && ready && !byArea &&
        groups.map((ids) => {
          const members = ids.map((id) => byId.get(id)!);
          const saved = members.some((p) => p.saved);
          if (members.length > 1) {
            const low = lowest(members);
            const on = ids.some((id) => id === lit || id === selected);
            const words = (
              <MapPinPill lit={on} saved={saved} count={`· ${gatherLabel(members.length)}`}>
                {low.label}
              </MapPinPill>
            );
            const at = centreOf(members.map((p) => p.lngLat));
            return (
              <MapMarker key={ids.join("|")} lib={lib} map={map} at={at} z={on ? 3 : saved ? 2 : 1}>
                {interactive ? (
                  <button
                    type="button"
                    data-map-pin={`group:${ids.join("|")}`}
                    data-pins={ids.join("|")}
                    aria-label={`${gatherLabel(members.length)}, from ${low.label}${saved ? ", one saved" : ""}. Zoom in`}
                    onClick={(ev) => {
                      frame(map, members.map((p) => p.lngLat), inset, duration, 17);
                      handOn(ev.currentTarget, ids);
                    }}
                    className="group/pin flex p-1 outline-none"
                  >
                    {words}
                  </button>
                ) : (
                  <span aria-hidden data-map-pin={`group:${ids.join("|")}`} className="flex p-1">
                    {words}
                  </span>
                )}
              </MapMarker>
            );
          }

          const p = members[0];
          const on = lit === p.id || selected === p.id;
          const words = (
            <MapPinPill lit={on} saved={p.saved} count={p.count && p.count > 1 ? `· ${p.count}` : undefined}>
              {p.label}
            </MapPinPill>
          );
          return (
            <MapMarker key={p.id} lib={lib} map={map} at={p.lngLat} z={on ? 3 : p.saved ? 2 : 1}>
              {interactive ? (
                <button
                  type="button"
                  data-map-pin={p.id}
                  data-pins={p.id}
                  aria-label={`${p.name}${p.saved ? ", saved" : ""}`}
                  aria-expanded={p.card ? selected === p.id : undefined}
                  onClick={(ev) => {
                    setFocusCard(ev.detail === 0);
                    select(selected === p.id ? null : p.id);
                  }}
                  onPointerEnter={() => light(p.id)}
                  onPointerLeave={() => light(null)}
                  onFocus={() => light(p.id)}
                  onBlur={() => light(null)}
                  className="group/pin flex p-1 outline-none"
                >
                  {words}
                </button>
              ) : (
                <span aria-hidden data-map-pin={p.id} className="flex p-1">
                  {words}
                </span>
              )}
            </MapMarker>
          );
        })}

      {lib && map && ready && interactive && open?.card && (
        <MapPopup key={open.id} lib={lib} map={map} at={open.lngLat} focusOnOpen={focusCard} inset={inset} reduced={reduced}>
          <PopupContext.Provider value={{ close: () => close(open.id) }}>
            <div
              onKeyDown={(ev) => {
                if (ev.key === "Escape") {
                  ev.stopPropagation();
                  close(open.id);
                }
              }}
            >
              {open.card}
            </div>
          </PopupContext.Provider>
        </MapPopup>
      )}

      {lib && map && ready && world && cityLayout && (
        <MapCities
          cities={cities}
          layout={cityLayout}
          look={cityLook}
          pickable={interactive && (selectedProp !== undefined || defaultSelected !== null || onSelectedChange !== undefined)}
          picked={selected}
          onPick={select}
          label={label}
        />
      )}

      {interactive && controls && !world && (
        <div
          className="pointer-events-none absolute end-3 top-3 z-20 flex flex-col gap-2"
          style={{ visibility: map ? undefined : "hidden" }}
        >
          <div className="pointer-events-auto flex flex-col gap-1 rounded-control bg-card p-1 shadow-soft">
            <ControlButton icon={ZoomInIcon} label="Zoom in" onClick={() => map?.zoomIn({ duration: reduced ? 0 : 300 })} />
            <ControlButton icon={ZoomOutIcon} label="Zoom out" onClick={() => map?.zoomOut({ duration: reduced ? 0 : 300 })} />
            <ControlButton icon={CenterFocusIcon} label="Show every place" onClick={() => fitAll()} />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export { MapView, MapCard, MapCityMarker, MapPinPill, useMapPopup };
export type { MapViewProps };
