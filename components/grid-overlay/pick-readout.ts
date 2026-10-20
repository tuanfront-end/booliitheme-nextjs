// The facts the picker's card shows about one element, in the house's own
// words: the size as a step of the type scale (`text-lg`), the colour as the
// token it came from (`--muted-foreground`). A raw value only appears where
// nothing in the stylesheet produces it — which is itself worth seeing.

export type Readout = {
  tag: string;
  width: number;
  height: number;
  // Only on an element with text of its own.
  type?: { step: string; px: number; weight: number };
  colour?: { token: string | null; css: string; hex: string };
};

// Tailwind's steps in rem, for a project whose stylesheet does not print them
// (v4 writes a theme variable only once a utility uses it).
const STEPS: [string, number][] = [
  ["xs", 0.75], ["sm", 0.875], ["base", 1], ["lg", 1.125], ["xl", 1.25],
  ["2xl", 1.5], ["3xl", 1.875], ["4xl", 2.25], ["5xl", 3], ["6xl", 3.75],
  ["7xl", 4.5], ["8xl", 6], ["9xl", 8],
];

// Read first when several tokens hold the same colour, so text on a card
// reads `--foreground` rather than `--card-foreground`.
const FIRST = ["--foreground", "--muted-foreground", "--primary-ink", "--primary", "--primary-foreground", "--background"];

// The custom properties the page's stylesheets declare, read once a pick mode:
// a hot reload between two modes can add a token.
let declared: string[] | null = null;

export function forget() {
  declared = null;
}

function properties(): string[] {
  if (declared) return declared;
  const names = new Set<string>();
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule)
        for (let i = 0; i < rule.style.length; i++)
          if (rule.style[i].startsWith("--") && !rule.style[i].startsWith("--tw-")) names.add(rule.style[i]);
      if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {} // a stylesheet from another origin keeps its rules to itself
  }
  declared = [...names];
  return declared;
}

// Colour, read by painting it: Chrome hands a computed colour back as `oklch()`,
// `oklab()` or `color-mix()` depending on how it was written, and a 1×1 canvas
// takes every one of them and returns the same four bytes.
const painted = new Map<string, number[] | null>();
let pad: CanvasRenderingContext2D | null = null;
function paint(value: string): number[] | null {
  const known = painted.get(value);
  if (known !== undefined) return known;
  let rgba: number[] | null = null;
  if (CSS.supports("color", value)) {
    pad ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (pad) {
      pad.clearRect(0, 0, 1, 1);
      pad.fillStyle = value;
      pad.fillRect(0, 0, 1, 1);
      rgba = Array.from(pad.getImageData(0, 0, 1, 1).data);
    }
  }
  painted.set(value, rgba);
  return rgba;
}

const near = (a: number[], b: number[], by: number) => a.slice(0, 3).every((v, i) => Math.abs(v - b[i]) <= by);

// `--muted-foreground`, or `--muted-foreground/60` where the element shows an
// opaque token at an alpha — Tailwind's `text-muted-foreground/60`.
function matches(name: string, at: Element, seen: number[]): string | null {
  const value = getComputedStyle(at).getPropertyValue(name).trim();
  const token = value && paint(value);
  if (!token) return null;
  if (Math.abs(token[3] - seen[3]) <= 3 && near(token, seen, 2)) return name;
  if (token[3] === 255 && seen[3] > 0 && near(token, seen, 3)) return `${name}/${Math.round(seen[3] / 2.55)}`;
  return null;
}

function token(el: Element, css: string): string | null {
  const seen = paint(css);
  if (!seen) return null;
  // The class that set it, on the element or the nearest ancestor that sets
  // one: the colour is inherited more often than not.
  for (let node: Element | null = el; node; node = node.parentElement) {
    for (const cls of Array.from(node.classList)) {
      const m = /^text-([a-z][a-z0-9-]*)(?:\/\d+)?$/.exec(cls);
      if (!m) continue;
      const hit = matches(`--${m[1]}`, node, seen) ?? matches(`--color-${m[1]}`, node, seen);
      if (hit) return hit;
    }
  }
  // Set by a rule rather than a class (the base layer's `body`, a heading
  // rule): every colour token the stylesheet declares, the house's roles first.
  const rest = properties().filter((p) => !FIRST.includes(p));
  const order = [...FIRST, ...rest.filter((p) => !p.startsWith("--color-")), ...rest.filter((p) => p.startsWith("--color-"))];
  for (const name of order) {
    const hit = matches(name, el, seen);
    if (hit) return hit;
  }
  return null;
}

function step(px: number): string {
  const root = getComputedStyle(document.documentElement);
  const rem = parseFloat(root.fontSize) || 16;
  const toPx = (value: string, fallback: number) => {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return fallback * rem;
    return value.trim().endsWith("rem") ? n * rem : n;
  };
  const extra = properties()
    .map((p) => /^--text-([a-z0-9]+)$/.exec(p)?.[1])
    .filter((s): s is string => !!s && !STEPS.some(([name]) => name === s));
  for (const [name, fallback] of [...STEPS, ...extra.map((s): [string, number] => [s, NaN])]) {
    const value = toPx(root.getPropertyValue(`--text-${name}`), fallback);
    if (Math.abs(value - px) < 0.25) return `text-${name}`;
  }
  return `text-[${+px.toFixed(1)}px]`;
}

const hex = (rgba: number[]) =>
  "#" +
  rgba
    .slice(0, rgba[3] === 255 ? 3 : 4)
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

const FIELDS = new Set(["input", "textarea", "select"]);
const hasText = (el: Element) =>
  FIELDS.has(el.localName) ||
  Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());

export function readout(el: Element): Readout {
  const rect = el.getBoundingClientRect();
  const out: Readout = { tag: el.localName, width: Math.round(rect.width), height: Math.round(rect.height) };
  if (!hasText(el)) return out;
  const style = getComputedStyle(el);
  const px = parseFloat(style.fontSize);
  out.type = { step: step(px), px: +px.toFixed(1), weight: Number(style.fontWeight) };
  const rgba = paint(style.color);
  out.colour = { token: token(el, style.color), css: style.color, hex: rgba ? hex(rgba) : style.color };
  return out;
}
