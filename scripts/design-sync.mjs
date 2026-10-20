// Writes DESIGN.md's front matter from app/globals.css, its budget lines from
// .soft-neutral.json when that file is present, and its kit list from the first
// line of each file in components/ui.
//
//   npm run design               rewrite DESIGN.md
//   npm run design -- --check    exit 1 when DESIGN.md is out of date, or a
//                                kit file is missing from /design-system
//   npm run design -- --selftest the sheet's coverage, on a kit made up for it
//
// One direction only. The values live in globals.css, where a shadcn project
// keeps them; DESIGN.md's front matter is a reading of that file in the shape
// Google's DESIGN.md spec defines, so a coding agent or a design tool gets the
// real numbers. Edit the CSS, then run this — never edit the front matter.
//
// The prose below the front matter is written by hand and left alone, except
// between `<!-- budget:… -->` and `<!-- /budget -->`, which carry the limits a
// page is built to. Without .soft-neutral.json those lines are kept as they
// are.
//
// The other exception is between `<!-- kit -->` and `<!-- /kit -->`: a line for
// each file in components/ui, read off the `// Name — sentence` that file opens
// with. Change the sentence in the file, never in DESIGN.md.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const CSS = join(ROOT, "app/globals.css");
const LAYOUT = join(ROOT, "app/layout.tsx");
const DESIGN = join(ROOT, "DESIGN.md");
const DIALS = join(ROOT, ".soft-neutral.json");
const TAILWIND = join(ROOT, "node_modules/tailwindcss/theme.css");
// The kit's folder as the list prints it, with or without src/.
const KIT_DIRS = ["components/ui", "src/components/ui"];

// --- reading the CSS ---------------------------------------------------------

// Every custom property, keyed by the block it is declared in. Comments are
// dropped first; nesting is followed so a rule inside @layer still counts.
function declarations(text) {
  const out = [];
  const stack = [];
  const src = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const token = /([^{};]+)\{|\}|([^{};]+);/g;
  let m;
  while ((m = token.exec(src))) {
    if (m[1] !== undefined) stack.push(m[1].trim().replace(/\s+/g, " "));
    else if (m[0] === "}") stack.pop();
    else {
      const d = m[2].trim();
      if (!d.startsWith("--")) continue;
      const i = d.indexOf(":");
      out.push({ block: stack.join(" > "), name: d.slice(0, i).trim(), value: d.slice(i + 1).trim().replace(/\s+/g, " ") });
    }
  }
  return out;
}

// The page's own values: `:root` and the @theme blocks. A pastel strength or a
// heading-only rebinding is a variation on these, and stays in the prose.
function table() {
  const vars = new Map();
  if (existsSync(TAILWIND)) {
    for (const d of declarations(readFileSync(TAILWIND, "utf8"))) vars.set(d.name, d.value);
  }
  for (const d of declarations(readFileSync(CSS, "utf8"))) {
    if (d.block === ":root" || d.block.startsWith("@theme")) {
      // `@theme inline` maps a utility onto a :root value of the same name
      // (`--font-sans: var(--font-sans)`); the :root one is the value.
      if (d.value === `var(${d.name})`) continue;
      vars.set(d.name, d.value);
    }
  }
  return vars;
}

function resolve(vars, value, depth = 0) {
  if (value == null || depth > 12) return value;
  return value.replace(/var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, name, fallback) => {
    if (vars.has(name)) return resolve(vars, vars.get(name), depth + 1);
    return fallback !== undefined ? resolve(vars, fallback.trim(), depth + 1) : `var(${name})`;
  });
}

// --- values in the spec's shapes ---------------------------------------------

function hex(n) {
  return Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
}

// hsl(h s% l%) or hsl(h s% l% / a) to #rrggbb[aa]; oklch() and hex pass as
// they are, since the spec reads both. Anything else is not a colour this file
// can state, and is left out rather than guessed.
function colour(value) {
  if (!value) return null;
  const v = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(v) || /^oklch\(/i.test(v)) return v;
  const m = v.match(/^hsla?\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?))?\s*\)$/i);
  if (!m) return null;
  const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  let out = `#${hex(f(0) * 255)}${hex(f(8) * 255)}${hex(f(4) * 255)}`;
  if (m[4] !== undefined) {
    const a = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4];
    if (a < 1) out += hex(a * 255);
  }
  return out;
}

// A length in px, the unit the spec's examples use. `calc(var(--radius) * k)`
// is the radius ladder; `calc(infinity * 1px)` is the pill.
function length(value) {
  if (!value) return null;
  const v = value.trim();
  if (/infinity/.test(v)) return "9999px";
  const calc = v.match(/^calc\(\s*([\d.]+)(rem|px)\s*\*\s*([\d.]+)\s*\)$/);
  if (calc) return px(+calc[1] * +calc[3], calc[2]);
  const plain = v.match(/^([\d.]+)(rem|px)$/);
  if (plain) return px(+plain[1], plain[2]);
  if (v === "0") return "0px";
  return null;
}

function px(n, unit) {
  const value = unit === "rem" ? n * 16 : n;
  return `${+value.toFixed(2)}px`;
}

// Unitless where the CSS writes a ratio, as `calc(1.25 / 0.875)`.
function ratio(value) {
  if (!value) return null;
  const v = value.trim();
  const calc = v.match(/^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/);
  if (calc) return +(+calc[1] / +calc[2]).toFixed(4);
  if (/^[\d.]+$/.test(v)) return +v;
  return null;
}

// The family a font variable carries. next/font names it in layout.tsx —
// `Plus_Jakarta_Sans({ variable: "--font-plus-jakarta-sans" })` — and a fetched
// face names itself in globals.css as a quoted string at the head of a stack.
function family(vars, name) {
  const raw = vars.get(name);
  if (raw) {
    const quoted = raw.match(/^\s*"([^"]+)"/);
    if (quoted) return quoted[1];
    const via = raw.match(/^var\((--font-[\w-]+)/);
    if (via && via[1] !== name) return family(vars, via[1]);
  }
  if (existsSync(LAYOUT)) {
    const layout = readFileSync(LAYOUT, "utf8");
    const loader = new RegExp(`(\\w+)\\(\\{[^}]*?variable:\\s*"${name}"`).exec(layout);
    if (loader && loader[1] !== "localFont") return loader[1].replace(/_/g, " ");
  }
  return name.replace(/^--font-/, "").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

// --- the front matter ---------------------------------------------------------

// The house style the template runs on, from `.soft-neutral.json`'s `house`
// key. Without it the template is Soft Neutral; with "paper-hairline" the
// colour list and the budget lines are that style's.
const HOUSE = (() => {
  try { return JSON.parse(readFileSync(DIALS, "utf8")).house ?? "soft-neutral"; } catch { return "soft-neutral"; }
})();

const SHARED_COLOURS = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "primary-ink", "action", "action-foreground", "action-hover",
  "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "border", "input", "ring", "destructive",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
];
const COLOURS = HOUSE === "paper-hairline"
  ? [...SHARED_COLOURS, "primary-top", "brand", "brand-ink", "brand-soft", "brand-wash", "texture"]
  : [...SHARED_COLOURS, ...["leaf", "sun", "coral", "iris", "lime", "sky", "peach"].flatMap((h) => [h, `${h}-ink`])];

const RADII = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

function frontMatter() {
  const vars = table();
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const v = (name) => resolve(vars, vars.get(name));

  const colors = {};
  for (const name of COLOURS) {
    const c = colour(v(`--${name}`));
    if (c) colors[name] = c;
  }

  const body = family(vars, "--font-sans");
  // `--font-heading` reads itself with the body as fallback until a pairing
  // writes one into :root.
  const set = vars.get("--font-heading") ?? "";
  const heading = !set || set.startsWith("var(--font-heading") ? body : family(vars, "--font-heading");
  const size = (step) => length(v(`--text-${step}`));
  const lead = (step) => ratio(v(`--text-${step}--line-height`));
  const typography = {
    heading: {
      fontFamily: heading, fontSize: size("5xl"),
      fontWeight: +v("--heading-weight-normal") || 400,
      lineHeight: ratio(v("--heading-leading-display")) ?? 1,
      letterSpacing: v("--heading-tracking-tighter"),
    },
    title: {
      fontFamily: heading, fontSize: size("xl"),
      fontWeight: +v("--heading-weight-medium") || 500,
      lineHeight: lead("xl"), letterSpacing: v("--heading-tracking-tight"),
    },
    body: { fontFamily: body, fontSize: size("base"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("base") },
    "body-sm": { fontFamily: body, fontSize: size("sm"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("sm") },
    label: { fontFamily: body, fontSize: size("sm"), fontWeight: +v("--font-weight-medium") || 500, lineHeight: lead("sm") },
    caption: { fontFamily: body, fontSize: size("xs"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("xs") },
  };

  const rounded = {};
  for (const step of RADII) {
    const r = length(v(`--radius-${step}`));
    if (r) rounded[step] = r;
  }
  rounded.control = length(v("--radius-control")) ?? "9999px";
  rounded.full = "9999px";

  const doc = {
    version: "alpha",
    name: pkg.name,
    ...(pkg.description ? { description: pkg.description } : {}),
    colors, typography, rounded,
    omitted: [
      { section: "spacing", reason: "Tailwind's default 4px scale; the rules for using it are under Layout & Spacing" },
      { section: "components", reason: "Each component's states live in components/ui; the rules are under Components" },
    ],
  };
  return `---\n${yaml(doc)}---\n`;
}

// Enough YAML for this shape: maps, a list of maps, strings and numbers.
function yaml(node, indent = "") {
  let out = "";
  for (const [key, value] of Object.entries(node)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      out += `${indent}${key}:\n`;
      for (const item of value) {
        const lines = yaml(item, `${indent}    `).split("\n").filter(Boolean);
        out += `${indent}  - ${lines[0].trim()}\n`;
        for (const line of lines.slice(1)) out += `${indent}    ${line.trim()}\n`;
      }
    } else if (typeof value === "object") {
      out += `${indent}${key}:\n${yaml(value, `${indent}  `)}`;
    } else {
      out += `${indent}${key}: ${scalar(value)}\n`;
    }
  }
  return out;
}

function scalar(value) {
  if (typeof value === "number") return String(value);
  const s = String(value);
  return /^[\w .-]+$/.test(s) && !/^[\d.-]/.test(s) ? s : JSON.stringify(s);
}

// --- the budget lines ---------------------------------------------------------

// Each accent colour's name over its Tailwind family; `families` in
// .soft-neutral.json moves one or adds a name, as `_dials.py` reads it.
const FAMILIES = { leaf: "emerald", sun: "amber", coral: "rose", iris: "violet",
  lime: "lime", sky: "sky", peach: "orange" };

function dials() {
  if (!existsSync(DIALS)) return null;
  const raw = JSON.parse(readFileSync(DIALS, "utf8"));
  const families = { ...FAMILIES, ...(raw.families ?? {}) };
  return {
    colour: raw.colour ?? 3, motion: raw.motion ?? 0,
    pastel: raw.pastel ?? 0, marketplace: !!raw.marketplace, families,
    // `secondary` is the older name of `signal`, and is still read.
    accents: raw.accents ?? Object.keys(families), signal: raw.signal ?? raw.secondary ?? null,
  };
}

// Paper Hairline spends no accent colours and no saturated moments: one brand
// hue in marks, flat grounds, photographs framed.
function hairlineBudgets(d) {
  const colors = [
    ["- No brand colour at all: eyebrows, icons and figures are the ink.",
      "- The brand hue on eyebrows, feature icons and the focus ring, and nowhere else.",
      "- The brand hue on eyebrows, feature icons, data figures, the chosen item and its cell's wash, lit segments and the focus ring — always a mark, never a fill."][Math.min(d.colour, 2)],
    "- Every ground is flat: no gradient behind a section, a cell or a figure. The primary button's own gradient is the one on the page.",
    "- One saturated hue on a page outside photographs.",
  ];
  const motion = [["- Nothing moves on its own; hover and press answer in 160ms.",
    "- Sections reveal once on scroll and a fading rail may drift; nothing loops faster than 20s.",
    "- Sections reveal, a fading rail drifts, a data dial sweeps once; nothing loops faster than 20s."][Math.min(d.motion, 2)]];
  const imagery = ["- Every photograph sits in a hairline frame or a panel cell, in true colour, never full bleed and never a section's ground."];
  return { colors, motion, imagery };
}

function budgets(d) {
  if (HOUSE === "paper-hairline") return hairlineBudgets(d);
  const decisions = ["no accent colour anywhere", "no accent-colour decision", "one accent-colour decision",
    "up to three accent-colour decisions", "up to four accent-colour decisions, and an accent colour may ground a whole section",
    "accent-colour decisions without a cap"][d.colour];
  const colors = [
    d.colour === 0
      ? "- Colour is the brand hue on the primary action and nowhere else."
      : `- The brand hue, and ${decisions} a page — a set of peers drawn one hue each is one decision.`,
    d.signal
      ? `- The signal colour is \`${d.signal}\` (Tailwind ${d.families[d.signal] ?? "?"}): outside a chip, a set and an ornament, it and the brand are the page's only colours.`
      : "- No signal colour: outside a chip, a set and an ornament, the brand is the page's only colour.",
    d.colour > 0 ? `- Accent colours in use: ${d.accents.map((a) => `\`${a}\` (${d.families[a]})`).join(", ")} — no other.` : null,
    d.pastel === 1 ? "- The surfaces a page presents with wear pastel at whisper strength: `bg-{hue}-band`, `bg-{hue}-surface`." : null,
    d.pastel === 2 ? "- The surfaces a page presents with wear pastel at candy strength — `data-pastel=\"2\"` on `<html>`." : null,
    d.marketplace
      ? "- One saturated moment — gradient art, a photograph, a tinted band — in every four sections of a page that sells; an app screen, such as a dashboard or a checkout, is exempt."
      : "- At least one saturated moment on every page that sells: gradient art, a photograph or a tinted band; an app screen, such as a dashboard or a checkout, is exempt.",
  ];
  const moving = ["Nothing moves on its own.", "At most one thing moves on its own a page.",
    "At most two things move on their own a page.",
    "At most two things move on their own a page, and one of them may ground a section.",
    "At most three things move on their own a page, and one of them may ground a section.",
    "Things may move on their own without a cap, and one may ground a section."][d.motion];
  const motion = [`- ${moving}${d.motion ? " At most one of them is a shader." : ""}`];
  const imagery = [
    `- No more than ${d.marketplace ? 2 : 3} sections in a row without a large picture, and a real photograph on every page.`,
  ];
  return { colors, motion, imagery };
}

// --- the kit list -------------------------------------------------------------

// Every file in the core kit opens with `// Name — one sentence` saying what
// the piece is, and DESIGN.md carries those lines so an agent that needs a
// control finds the one that exists before it draws another. A file that opens
// with anything else is listed by its path alone, and counted.
function kit() {
  const dir = KIT_DIRS.find((d) => existsSync(join(ROOT, d)));
  if (!dir) return null;
  let undocumented = 0;
  const lines = readdirSync(join(ROOT, dir)).filter((f) => /\.tsx?$/.test(f)).sort().map((file) => {
    const opening = readFileSync(join(ROOT, dir, file), "utf8").split("\n", 1)[0].trim();
    const m = opening.match(/^\/\/ (\S+) — (.+)$/);
    if (!m) undocumented++;
    return m ? `- **${m[1]}** \`${dir}/${file}\` — ${m[2]}` : `- \`${dir}/${file}\``;
  });
  return { lines, undocumented };
}

// --- the kit on the sheet ------------------------------------------------------

// Every file in components/ui is drawn on /design-system in its states, so a
// control is approved before a page wears it. A file the sheet never imports
// is one nobody has looked at, and the next section that needs it meets it
// unseen. Only the sheet's own files count: a kit file another kit file
// imports is still not on it. A project without the sheet is not asked.
const SHEET_DIRS = ["app/design-system", "components/design-system"];

function unshown(root = ROOT) {
  const dir = KIT_DIRS.find((d) => existsSync(join(root, d)));
  if (!dir) return [];
  const base = dir.startsWith("src/") ? "src/" : "";
  const sheet = SHEET_DIRS.map((d) => join(root, base + d)).filter((d) => existsSync(d));
  if (!sheet.length) return [];
  const source = sheet
    .flatMap((d) => readdirSync(d, { recursive: true }).map((f) => join(d, f)))
    .filter((f) => /\.(tsx?|jsx?|mdx)$/.test(f))
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");
  return readdirSync(join(root, dir))
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => !new RegExp(`/ui/${f.replace(/\.tsx?$/, "")}["']`).test(source))
    .sort()
    .map((f) => `${dir}/${f}`);
}

function selftest() {
  const root = mkdtempSync(join(tmpdir(), "design-sync-"));
  const put = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  try {
    put("components/ui/button.tsx", "// Button — a call to action.\n");
    put("components/ui/select.tsx", "// Select — one dropdown.\n");
    // drawn only inside the kit: a facet select built on the Select
    put("components/ui/facet-select.tsx", 'import { Select } from "@/components/ui/select";\n');
    put("components/ui/use-rail.ts", "export function useRail() {}\n");
    put("app/design-system/page.tsx", "import { KitActions } from \"@/components/design-system/kit-actions\";\n");
    put("components/design-system/kit-actions.tsx",
      'import { Button } from "@/components/ui/button";\nimport { useRail } from \'@/components/ui/use-rail\';\n');
    const missing = unshown(root);
    const want = ["components/ui/facet-select.tsx", "components/ui/select.tsx"];
    if (JSON.stringify(missing) !== JSON.stringify(want)) {
      console.error(`design selftest: got ${JSON.stringify(missing)}, want ${JSON.stringify(want)}`);
      process.exit(1);
    }
    rmSync(join(root, "app"), { recursive: true });
    rmSync(join(root, "components/design-system"), { recursive: true });
    if (unshown(root).length) {
      console.error("design selftest: a project without the sheet was asked about it");
      process.exit(1);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  console.log("design selftest: a kit file is on the sheet only when the sheet imports it");
}

// --- putting it together -------------------------------------------------------

function write(current, list) {
  let next = current.replace(/^---\n[\s\S]*?\n---\n/, "");
  next = frontMatter() + next;
  const d = dials();
  if (d) {
    const lines = budgets(d);
    next = next.replace(/(<!-- budget:([\w-]+) -->\n)[\s\S]*?(<!-- \/budget -->)/g, (whole, open, axis, close) =>
      lines[axis] ? `${open}${lines[axis].filter(Boolean).join("\n")}\n${close}` : whole);
  }
  if (list) {
    next = next.replace(/(<!-- kit -->\n)[\s\S]*?(<!-- \/kit -->)/, (_, open, close) =>
      `${open}${list.lines.map((line) => `${line}\n`).join("")}${close}`);
  }
  return next;
}

function main() {
  if (process.argv.includes("--selftest")) return selftest();
  const check = process.argv.includes("--check");
  if (!existsSync(DESIGN)) {
    console.error("design: no DESIGN.md at the repo root — the template scaffold carries one");
    process.exit(1);
  }
  const current = readFileSync(DESIGN, "utf8");
  const list = kit();
  const next = write(current, list);
  const unfilled = (next.match(/<!-- fill: [^>]*-->/g) || []).length;
  const sources = ["app/globals.css", dials() && ".soft-neutral.json", list && "components/ui"].filter(Boolean).join(", ");
  const notes = (unfilled ? ` · ${unfilled} section(s) still to fill` : "") +
    (list?.undocumented ? ` · ${list.undocumented} kit file(s) undocumented` : "");
  const missing = unshown();
  const off = `design: ${missing.length} kit file(s) that /design-system never imports — ` +
    `${missing.join(", ")}: draw each on the sheet in its states`;

  if (check) {
    const drifted = next !== current;
    if (drifted) {
      console.error("design: DESIGN.md has drifted from app/globals.css or components/ui — run `npm run design`");
    }
    if (missing.length) console.error(off);
    if (drifted || missing.length) process.exit(1);
    console.log(`design: DESIGN.md matches ${sources}${notes}`);
    return;
  }
  if (missing.length) console.error(off);
  writeFileSync(DESIGN, next);
  console.log(`design: DESIGN.md written from ${sources}${notes}`);
}

main();
