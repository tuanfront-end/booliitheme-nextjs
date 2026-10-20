// What the picker calls an element: `3.2 · EventCard` is the second EventCard
// in the page's third section. The numbers are the audit's — sections counted
// from one as `audit --section 3` counts them, the header H and the footer F —
// so "section 3" means one thing in the picker, an audit report and chat.
//
// The names are read off React's development build: a client component's name
// sits on its fiber, and a server component's in the `_debugInfo` React 19
// hangs on the fiber its output became. Neither exists outside `next dev`,
// which is the only place the picker runs, so the builder writes no attribute
// for it and nothing reaches the zip. See ADR 0038.

const SECTIONS = "main section:not(section section)";
const HEADER = "header:not(main header)";
const FOOTER = "footer:not(main footer)";

// Tags worth stopping on although no component wrote them as its root: what a
// person points at to ask for a change. A bare `div` is not one — a layout
// wrapper is skipped on the way to the thing it wraps.
const LEAF = new Set([
  "a", "button", "img", "svg", "video", "canvas", "iframe", "input", "select",
  "textarea", "label", "hr",
]);

// React's fiber tags: the five a component renders as, and the ones that end
// a walk up from an element because they are the element's parent in the DOM
// (or its parent is elsewhere, through a portal).
const COMPONENT = new Set([0, 1, 11, 14, 15]);
const BOUNDARY = new Set([3, 4, 5, 26, 27]);
const HOSTISH = new Set([5, 6, 26, 27]);

type Info = { name?: unknown; awaited?: unknown; owner?: Info | null };
type Fiber = {
  tag: number;
  type: unknown;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  stateNode: unknown;
  memoizedProps: unknown;
  _debugInfo?: Info[] | null;
  _debugOwner?: Fiber | Info | null;
};

// One component as it rendered here. `key` is the same object for every
// fiber of one instance, so instances can be told apart and counted.
type Part = { name: string; key: object };

export type Name = { index: string; name: string };

function internal(el: Element, prefix: string): unknown {
  const key = Object.keys(el).find((k) => k.startsWith(prefix));
  return key ? (el as unknown as Record<string, unknown>)[key] : undefined;
}

// The fiber a DOM node was created by, or its alternate when that is the one
// on screen: React keeps the node's first fiber and updates only its props.
function fiberOf(el: Element): Fiber | null {
  const f = internal(el, "__reactFiber$") as Fiber | undefined;
  if (!f) return null;
  const props = internal(el, "__reactProps$");
  return f.alternate && f.memoizedProps !== props && f.alternate.memoizedProps === props
    ? f.alternate
    : f;
}

// Both fibers of one instance answer to the first one seen.
const instances = new WeakMap<object, object>();
function keyOf(f: Fiber): object {
  const known = instances.get(f) ?? (f.alternate && instances.get(f.alternate));
  if (known) return known;
  instances.set(f, f);
  if (f.alternate) instances.set(f.alternate, f);
  return f;
}

function typeName(t: unknown): string | null {
  if (typeof t === "function") return (t as { displayName?: string }).displayName || t.name || null;
  if (t && typeof t === "object") {
    const o = t as { displayName?: string; render?: unknown; type?: unknown };
    return o.displayName || typeName(o.render) || typeName(o.type);
  }
  return null;
}

// A component from node_modules — next/link's `LinkComponent`, a base-ui part
// — names nothing: the person edits the template, and the agent greps it. So
// a name counts only when the template's source declares it, which
// `read-names.ts` reads as pick mode starts. A stack cannot say it instead:
// React keeps 10,000 element stacks a second and stubs the rest, so on a long
// page everything hydrated past the budget comes from nowhere.
let declared = new Set<string>();

export function declare(names: string[]) {
  declared = new Set(names);
}

const isInfo = (d: Info): d is Info & { name: string } =>
  typeof d.name === "string" && !("awaited" in d) && declared.has(d.name);

const infosOf = (f: Fiber) => (f._debugInfo ?? []).filter(isInfo);

const isFiber = (o: object): o is Fiber => "tag" in o && "return" in o;

const owns = (f: Fiber, owner: Fiber | Info) =>
  f._debugOwner === owner || (isFiber(owner) && !!owner.alternate && f._debugOwner === owner.alternate);

function nameOf(f: Fiber): string | null {
  const name = typeName(f.type);
  return name && declared.has(name) ? name : null;
}

// The DOM nodes a fiber renders at its top level, stopping at two.
function tops(f: Fiber, out: unknown[] = []): unknown[] {
  if (HOSTISH.has(f.tag)) out.push(f.stateNode);
  else if (f.tag !== 4)
    for (let c = f.child; c && out.length < 2; c = c.sibling) tops(c, out);
  return out;
}

function soleRoot(f: Fiber, el: Element) {
  const t = tops(f);
  return t.length === 1 && t[0] === el;
}

// The components whose top-level output is `el` and nothing else, outermost
// first — the names `el` answers to. One that only passes its children
// through wrote nothing here and is stepped over, as is one the template does
// not declare.
function roots(el: Element): Part[] {
  const host = fiberOf(el);
  if (!host) return [];
  const out: Part[] = [];
  const servers = (f: Fiber) => {
    const list = infosOf(f);
    for (let i = list.length - 1; i >= 0; i--) {
      const info = list[i];
      let sibling = f.return?.child ?? null;
      while (sibling && (sibling === f || !sibling._debugInfo?.includes(info))) sibling = sibling.sibling;
      if (sibling || !soleRoot(f, el)) return false;
      if (owns(f, info)) out.unshift({ name: info.name, key: info });
    }
    return true;
  };
  if (!servers(host)) return out;
  for (let f = host.return; f && !BOUNDARY.has(f.tag); f = f.return) {
    if (COMPONENT.has(f.tag)) {
      if (!soleRoot(f, el)) return out;
      const name = nameOf(f);
      if (name && f.child && owns(f.child, f)) out.unshift({ name, key: keyOf(f) });
    }
    if (!servers(f)) return out;
  }
  return out;
}

// The component whose JSX wrote `el`: where its tag and classes are typed.
function owner(el: Element): Part | null {
  let o = fiberOf(el)?._debugOwner ?? null;
  while (o) {
    if (isFiber(o)) {
      const name = COMPONENT.has(o.tag) && nameOf(o);
      if (name) return { name, key: keyOf(o) };
      o = o._debugOwner ?? null;
    } else {
      if (isInfo(o)) return { name: o.name, key: o };
      o = o.owner ?? null;
    }
  }
  return null;
}

// The section, header or footer `el` belongs to, with its number. An element
// a portal moved to <body> — a drawer, a menu — belongs where its fiber is.
function shell(el: Element): { at: Element; n: string } | null {
  const sections = Array.from(document.querySelectorAll(SECTIONS));
  const header = document.querySelector(HEADER);
  const footer = document.querySelector(FOOTER);
  const number = (node: Element) => {
    if (node === header) return "H";
    if (node === footer) return "F";
    const i = sections.indexOf(node);
    return i < 0 ? null : String(i + 1);
  };
  for (let node: Element | null = el; node; node = node.parentElement) {
    const n = number(node);
    if (n) return { at: node, n };
  }
  for (let f = fiberOf(el)?.return ?? null; f; f = f.return) {
    if (f.tag !== 5 || !(f.stateNode instanceof Element)) continue;
    const n = number(f.stateNode);
    if (n) return { at: f.stateNode, n };
  }
  return null;
}

// Drawn at this width: a section that renders its cards twice — a snap row
// below `xl` and a grid above it, or an invisible copy that holds the
// height — counts the set a person sees.
const visible = (el: Element | null) =>
  !!el && el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true });

function shown(f: Fiber) {
  const node = tops(f)[0];
  return visible(node instanceof Element ? node : node instanceof Node ? node.parentElement : null);
}

// Every instance of a component under `at` on screen, in document order.
function all(at: Element, name: string): object[] {
  const out: object[] = [];
  const add = (key: object, f: Fiber) => !out.includes(key) && shown(f) && out.push(key);
  const root = fiberOf(at);
  const stack = root?.child ? [root.child] : [];
  while (stack.length) {
    const f = stack.pop()!;
    if (f.sibling) stack.push(f.sibling);
    if (f.child) stack.push(f.child);
    for (const info of infosOf(f)) if (info.name === name) add(info, f);
    if (COMPONENT.has(f.tag) && nameOf(f) === name && !wrapped(f, name)) add(keyOf(f), f);
  }
  return out;
}

// The kit's `SelectTrigger` around base-ui's `SelectTrigger`, or a server
// `Button` that returned base-ui's: one instance on screen, counted once.
function wrapped(f: Fiber, name: string) {
  const same = (up: Fiber) => infosOf(up).some((i) => i.name === name);
  if (same(f)) return true;
  for (let up = f.return; up && !BOUNDARY.has(up.tag); up = up.return)
    if ((COMPONENT.has(up.tag) && nameOf(up) === name) || same(up)) return true;
  return false;
}

// A box a person can see as one thing: it paints a surface of its own, or it
// holds two or more things on screen side by side — a copy block, a button
// row, a card's body. A wrapper around a single child is still skipped, so the
// walk does not stop twice on one outline.
const INLINE = new Set(["inline", "contents", "none"]);

function painted(cs: CSSStyleDeclaration) {
  return (
    !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor) ||
    cs.backgroundImage !== "none" ||
    cs.boxShadow !== "none" ||
    ["Top", "Right", "Bottom", "Left"].some(
      (s) => parseFloat(cs.getPropertyValue(`border-${s.toLowerCase()}-width`)) > 0 &&
        cs.getPropertyValue(`border-${s.toLowerCase()}-style`) !== "none",
    )
  );
}

function isGroup(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const cs = getComputedStyle(el);
  if (INLINE.has(cs.display)) return false;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  if (painted(cs)) return true;
  let seen = 0;
  for (const kid of Array.from(el.children)) {
    const k = kid.getBoundingClientRect();
    if (k.width && k.height && visible(kid) && ++seen === 2) return true;
  }
  return false;
}

/** A level is a stop on the ↑ / ↓ walk: a section, the header or footer, the
 *  root of a named component, a kit part or product object, or a box that
 *  groups what it holds. */
export function isLevel(el: Element): boolean {
  return (
    el.matches(`${SECTIONS}, ${HEADER}, ${FOOTER}`) ||
    el.hasAttribute("data-slot") ||
    el.hasAttribute("data-object") ||
    roots(el).length > 0 ||
    isGroup(el)
  );
}

// Two stops with one outline read as a step that did nothing.
const sameBox = (a: Element, b: Element) => {
  const p = a.getBoundingClientRect();
  const q = b.getBoundingClientRect();
  return [p.left - q.left, p.top - q.top, p.width - q.width, p.height - q.height].every((d) => Math.abs(d) < 1);
};

const ownText = (el: Element) =>
  Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());

/** The element at a point that is worth naming, read through the picker's
 *  own `layer`. Hit-testing stops at what is painted on top, and a stretched
 *  link's `::after` covers its whole card, so of everything under the point
 *  the deepest is taken. Then a drawing's shapes give way to the drawing, and
 *  a wrapper to what it wraps. Null over `skip`. */
export function leafAt(x: number, y: number, skip: string, layer: Element | null): Element | null {
  const hits = document.elementsFromPoint(x, y).filter((el) => {
    const r = el.getBoundingClientRect();
    return el !== layer && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });
  if (!hits.length || hits[0].closest(skip)) return null;
  let el = hits.find((h) => !hits.some((o) => o !== h && h.contains(o))) ?? hits[0];
  while (el instanceof SVGElement && el.ownerSVGElement) el = el.ownerSVGElement;
  while (
    el.parentElement &&
    el.parentElement !== document.body &&
    !LEAF.has(el.localName) &&
    !ownText(el) &&
    !isLevel(el)
  )
    el = el.parentElement;
  return el;
}

/** The walk from a leaf up to its section: the leaf, then every level and
 *  every link, button or field above it, the section (or header, or footer)
 *  last. */
export function levels(leaf: Element): Element[] {
  const top = shell(leaf)?.at;
  const path = [leaf];
  for (let el = leaf.parentElement; el && el !== document.body; el = el.parentElement) {
    if (isLevel(el) || LEAF.has(el.localName)) {
      // The outer of two stops that share a box keeps the place: a section's
      // container that fills it, a component root around its own grid.
      // The hovered element itself stays, unless the section shares its box.
      if (!sameBox(el, path[path.length - 1])) path.push(el);
      else if (path.length > 1 || el === top) path[path.length - 1] = el;
    }
    if (el === top) break;
  }
  return path;
}

/** `{ index: "3.2", name: "EventCard" }`. The section's own component takes
 *  the section's number alone; anything else is counted among the instances
 *  of its component in that section. */
export function describe(el: Element): Name {
  const where = shell(el);
  const own = where ? roots(where.at) : [];
  const isOwn = (p: Part) => own.some((r) => r.key === p.key);
  const count = (p: Part | null) => (p && where ? all(where.at, p.name) : []);

  let part: Part | null = roots(el)[0] ?? owner(el);
  let peers = count(part);
  // Written by something outside the section — a page passing children into
  // it — so the nearest name inside the section is the one that finds the file.
  if (part && where && !isOwn(part) && !peers.includes(part.key)) {
    let up: Element | null = el;
    while (up && !roots(up).length) up = up === where.at || up === document.body ? null : up.parentElement;
    part = up ? roots(up)[0] : null;
    peers = count(part);
  }

  const n = where?.n ?? "";
  const nth = (i: number) => (i < 0 || !n ? n : `${n}.${i + 1}`);
  if (part) return { index: isOwn(part) ? n : nth(peers.indexOf(part.key)), name: part.name };

  // No component wrote it as anything React can name: the kit's part or the
  // product object it marks, then the bare tag.
  const attr = ["data-slot", "data-object"].find((a) => el.getAttribute(a));
  if (!attr) return { index: n, name: el.localName };
  const value = el.getAttribute(attr)!;
  const same = where
    ? Array.from(where.at.querySelectorAll(`[${attr}="${CSS.escape(value)}"]`)).filter(visible)
    : [];
  return { index: nth(same.indexOf(el)), name: value };
}
