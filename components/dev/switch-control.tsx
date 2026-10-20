// ref: none — n/a (scaffolding that wraps the page and draws no section of its
// own; n/a sits outside the shape count on purpose, and the line is here so a
// missing comment cannot be told from a forgotten one)
"use client";

import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  Children, createContext, useContext, useEffect, useState, useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { reach } from "@/components/reach";
// The panel this draws into, and the registration that locks its Color and
// Preset rows — shipped code, imported by scaffolding, like HeaderMorph.
import { BUILD_SLOT, registerBuild } from "@/components/preset-panel/build-slot";
// Shipped code, imported by scaffolding and never the other way round. The
// note under the file table in switch.md says why.
import { HeaderMorph } from "@/components/site/header-morph";
import { cn } from "@/lib/utils";
import type { Picks } from "./picks";
import { savePicks } from "./save-picks";

// The brand knob flips the preset panel's Color row while the Switch holds
// that row locked. `brand-hue.py … --panel-with` wrote one `[data-color]`
// block per candidate at the end of globals.css — fill, action and ink in both
// halves, the chip alpha and the chart ramp, the template's action style
// carried to each hue — and the ink brand beside them. So this file holds no
// colour: the knob puts a block's name on the wrapper and the cascade does the
// rest, and every value on screen is one the script measured. `original` is
// the brand :root carries and needs no attribute.
//
// Written in at the mount like BRIEF_PASTEL: the names `brand-hue.py` printed
// for the panel, Original first. Original is honey, black action, warm
// neutral; plum was a candidate and is not on the row. Stop 2 locks the brand
// — the script writes the pick into :root — and this list shrinks to
// ["original"], which takes the Brand group off the panel.
const BRANDS: string[] = ["original"];

// Each face's whole row from the per-face table in setup.md. Twenty-one of these
// thirty are OFL from Google; three more are OFL and CC BY from files in
// app/fonts/, with their licence texts beside them because both grants require
// the text to travel with the font.
//
// The last six are the ITF Free Font License faces from fontshare.com, whose
// licence allows every use and forbids passing the files on. They are here
// rather than absent because the licence describes a delivery route rather than
// a ban: the files are gitignored, declared with @font-face against
// public/fonts/, and fetched by an `npm run fonts` the buyer runs, which makes
// the buyer the licensee. references/fetched-faces.md is the whole arrangement.
// Each of their --font-* is a two-name stack, so picking one still renders for
// somebody who never fetched — as the OFL face standing behind it.
//
// `where` is the half of the pairing a face may be picked for. A display face
// has tracking built for 60px and an x-height built to be seen rather than
// read, so offering it as a body face is offering a choice that is wrong
// before it is made.
//
// Every next/font face needs its import in app/layout.tsx and its variable on
// <html> — the switch only re-points --font-sans and --font-heading at one of
// them. A local face names its own `weight` in that import: left open, the
// browser synthesises the emphasis step, which is the one weight the style
// forbids. The six fetched faces are the exception and must stay out of
// layout.tsx: next/font resolves its src at build time and throws on a missing
// file, which is exactly what a buyer who has not run `npm run fonts` has.
// Their @font-face and their stacks live in app/fontshare.css and globals.css.
// Geist points at --font-geist rather than --font-sans, because --font-sans is
// the *role* and this file re-points it: a pairing whose body face is
// Instrument Sans and whose heading face is Geist needs a name for Geist that
// does not move underneath it. That alias is one line in globals.css.
type Face = {
  id: string; label: string; variable: string; where: "both" | "heading";
  body: string; emphasis: string; tight: string; tighter: string; leading: string;
};

const faces: Face[] = [
  // First because it is what :root ships, so the page loads as it sells.
  { id: "geist", label: "Geist", variable: "--font-geist", where: "both",
    body: "400", emphasis: "500", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "gsf", label: "Google Sans Flex", variable: "--font-google-sans-flex", where: "both",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "manrope", label: "Manrope", variable: "--font-manrope", where: "both",
    body: "500", emphasis: "600", tight: "0em", tighter: "-0.025em", leading: "1.04" },
  { id: "poppins", label: "Poppins", variable: "--font-poppins", where: "both",
    body: "400", emphasis: "500", tight: "-0.025em", tighter: "-0.05em", leading: "1.06" },
  { id: "bvp", label: "Be Vietnam Pro", variable: "--font-be-vietnam-pro", where: "both",
    body: "400", emphasis: "500", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "instrument", label: "Instrument Sans", variable: "--font-instrument-sans", where: "both",
    body: "500", emphasis: "600", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "schibsted", label: "Schibsted Grotesk", variable: "--font-schibsted-grotesk", where: "both",
    body: "400", emphasis: "500", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "jakarta", label: "Plus Jakarta Sans", variable: "--font-plus-jakarta-sans", where: "both",
    body: "500", emphasis: "600", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "newsreader", label: "Newsreader", variable: "--font-newsreader", where: "both",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "bricolage", label: "Bricolage Grotesque", variable: "--font-bricolage-grotesque", where: "heading",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "fraunces", label: "Fraunces", variable: "--font-fraunces", where: "heading",
    body: "500", emphasis: "600", tight: "0em", tighter: "-0.025em", leading: "1" },
  // One weight in the file, so its emphasis half is its body half: 600 would be
  // a browser-synthesised bold, which is the one weight the style cannot use.
  { id: "iserif", label: "Instrument Serif", variable: "--font-instrument-serif", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1" },
  // The three loaded from files rather than from Google. Nothing about the
  // switch changes for them — next/font/local hands back the same variable —
  // and all three are heading-only: the first two ship a single weight, and
  // Gatchina's hairlines disappear at body size on a ground this bright.
  { id: "apfel", label: "Apfel Grotezk", variable: "--font-apfel-grotezk", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "amiamie", label: "Amiamie", variable: "--font-amiamie", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "gatchina", label: "Gatchina", variable: "--font-gatchina", where: "heading",
    body: "400", emphasis: "700", tight: "0em", tighter: "-0.025em", leading: "1.02" },
  // The display-serif register in its OFL form. Bodoni Moda holds 400 as its
  // resting weight rather than stepping up to the body band — it carries opsz,
  // which thickens the hairlines at small sizes on its own, and 700 would draw
  // every heading as a slab.
  { id: "bodoni", label: "Bodoni Moda", variable: "--font-bodoni-moda", where: "heading",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1.03" },
  { id: "italiana", label: "Italiana", variable: "--font-italiana", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1" },
  // The tallest minimum on the list: Tailwind's own default clears 1.11 only up
  // to text-3xl, so a Prata headline that wraps at text-5xl is the case the
  // leading column exists for.
  { id: "prata", label: "Prata", variable: "--font-prata", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1.11" },
  { id: "outfit", label: "Outfit", variable: "--font-outfit", where: "both",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  // A flared humanist and its plain reading partner. Faculty Glyphic ships one
  // weight, so its pair repeats and it is heading-only; its fitting is 0.040, a
  // step off the tracking rule, and its 1.06 does not bind at 1. Source Sans 3
  // draws 0.216 at 400, under the body band, so it takes 500/600.
  { id: "glyphic", label: "Faculty Glyphic", variable: "--font-faculty-glyphic", where: "heading",
    body: "400", emphasis: "400", tight: "0em", tighter: "-0.025em", leading: "1.06" },
  { id: "sourcesans", label: "Source Sans 3", variable: "--font-source-sans-3", where: "both",
    body: "500", emphasis: "600", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  // Two singles. Elms Sans draws 0.189 at 400, so its pair is 550/650 like
  // Erode's; it is heading-only. Inter's 400 sits in the band at text size.
  // Both fit near Manrope's 0.065 and take its step off the tracking rule.
  { id: "elms", label: "Elms Sans", variable: "--font-elms-sans", where: "heading",
    body: "550", emphasis: "650", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "inter", label: "Inter", variable: "--font-inter", where: "both",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  // A third single. Familjen Grotesk's 400 sits in the band and it fits at
  // 0.068; the base rule closes up *ted* at 60px, so it takes the looser step.
  { id: "familjen", label: "Familjen Grotesk", variable: "--font-familjen-grotesk", where: "heading",
    body: "400", emphasis: "500", tight: "0em", tighter: "-0.025em", leading: "1" },
  // The six fetched faces. Three carry a weight that is not a multiple of 100:
  // they are variable files, so 525 is a real instance, and the round step
  // nearby was wrong rather than untidy — Chillax at 600 lands 1.32x its body
  // weight, and 500 on Cabinet Grotesk and Erode sits under the ink band.
  { id: "satoshi", label: "Satoshi", variable: "--font-satoshi", where: "both",
    body: "500", emphasis: "600", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "switzer", label: "Switzer", variable: "--font-switzer", where: "both",
    body: "400", emphasis: "500", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "cabinet", label: "Cabinet Grotesk", variable: "--font-cabinet-grotesk", where: "heading",
    body: "525", emphasis: "625", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "chillax", label: "Chillax", variable: "--font-chillax", where: "heading",
    body: "500", emphasis: "550", tight: "-0.025em", tighter: "-0.05em", leading: "1" },
  { id: "erode", label: "Erode", variable: "--font-erode", where: "both",
    body: "550", emphasis: "650", tight: "0em", tighter: "-0.025em", leading: "1" },
  { id: "melodrama", label: "Melodrama", variable: "--font-melodrama", where: "heading",
    body: "600", emphasis: "700", tight: "0em", tighter: "-0.025em", leading: "1.04" },
];

// The pairings, picked rather than enumerated, and for this template picked
// again: the brief's tone is precise · crafted · candid, a studio selling its
// own craft, so the row is the three of setup.md's ten that tone reads into
// rather than one per register a template gets sold in. Studio first and
// opened on — Cabinet Grotesk over Satoshi is the table's own row for an
// agency, a portfolio, product marketing, which is crafted said in type. One
// family is the precise step away: the screenshots are the subject, and the
// type stands back from them. Serif head is the candid one: a release log, a
// changelog and exact versions on every card are a lot to read, and Newsreader
// over Geist is the row for that. Editorial, Warm, Display, Serif body,
// Fashion, Rounded and Humanist are registers this brief does not speak in —
// the Heading and Body rows below still reach every face they use.
//
// Both Studio halves are fetched: until `npm run fonts` has run they render as
// the OFL face behind each stack — Bricolage Grotesque over Geist.
const pairings = [
  { id: "studio", label: "Studio", heading: "cabinet", body: "satoshi" },
  { id: "solo", label: "One family", heading: "geist", body: "geist" },
  { id: "reading", label: "Serif head", heading: "newsreader", body: "geist" },
];

// What a switch nobody has touched opens on: the tone's pairing, so the shell
// is first judged in the type the brief asked for rather than in :root's
// resting Geist. A saved pick wins over it from the first click.
const OPENS_ON = pairings[0];

// Falls back rather than asserting: these ids come off disk, and a face or a
// brand that has since left the list must not take the page down with it.
const face = (id: string | undefined) =>
  faces.find((f) => f.id === id) ?? faces[0];
const brandById = (id: string | undefined) =>
  BRANDS.find((b) => b === id) ?? BRANDS[0];
const groundById = (id: string | undefined) =>
  grounds.find((g) => g.id === id) ?? grounds[0];
const radiusById = (id: string | undefined) =>
  radii.find((r) => r.id === id) ?? radii[0];
const controlById = (id: string | undefined) =>
  controls.find((c) => c.id === id) ?? controls[0];
const headerById = (id: string | undefined) =>
  headers.find((h) => h.id === id) ?? headers[0];
const strengthById = (id: string | undefined) =>
  strengths.find((s) => s.id === id) ??
  strengths.find((s) => s.id === BRIEF_PASTEL) ?? strengths[0];

// A rung is a distance below the page, so a ground is one number and the rest
// of the ladder follows from it. The knob moves the ladder globals.css wrote
// rather than typing one of its own: :root holds the template's neutral
// family — warm, cool, or the brand's hue on a pastel project — and a ladder
// typed here would repaint every template in one family. --card does not move:
// it is the one rung *above* the page, and it is already white.
const RUNGS = ["--accent", "--border", "--muted", "--secondary"] as const;

// Only the top of the ladder is offered. A tinted mid-ladder page is not a
// third option, it is the unsupported case: the rungs move down with the page
// but the card cannot, so every distance inside a card stretches and the
// whisper turns into a block.
const grounds = [
  { id: "page",  label: "Near-white" },
  { id: "white", label: "White" },
] as const;

// White lifts the page to L 100% and every rung by the same OKLCH lightness,
// each keeping its chroma and hue through relative colour syntax, so the
// ladder keeps its family and its steps. Read off :root once, on the client —
// the server has no stylesheet to read — and cached, so the snapshot
// useSyncExternalStore takes is the same object every render. Null on a page
// not written in oklch().
let lifted: CSSProperties | null | undefined;
function whiteGround(): CSSProperties | null {
  if (lifted !== undefined) return lifted;
  const root = getComputedStyle(document.documentElement);
  const page = /^oklch\(\s*([\d.]+)%/.exec(root.getPropertyValue("--background").trim());
  if (!page) return (lifted = null);
  const lift = ((100 - Number(page[1])) / 100).toFixed(4);
  return (lifted = Object.fromEntries([
    ["--background", "oklch(100% 0 0)"],
    ...RUNGS.map((name) => [
      name,
      `oklch(from ${root.getPropertyValue(name).trim()} calc(l + ${lift}) c h)`,
    ]),
  ]) as CSSProperties);
}

// The multipliers globals.css derives the scale with, copied rather than
// imported because CSS cannot be read from here. Checked against this repo's
// `@theme inline` block: the multiplicative formula, sm 0.6 through 4xl 2.6,
// with lg the seed itself. `references/setup.md` § Read the radius scale is
// where which-one-is-this gets settled; a switch on the wrong formula makes
// `rounded-lg` mean one thing under the panel and another after the harvest.
//
// All seven, not the four this style names: a rung left out keeps :root's seed
// while its neighbours move, and `rounded-2xl` quietly stops being concentric
// with the card it sits in.
const RADIUS_STEPS = [
  ["--radius-sm", 0.6], ["--radius-md", 0.8], ["--radius-lg", 1],
  ["--radius-xl", 1.4], ["--radius-2xl", 1.8], ["--radius-3xl", 2.2],
  ["--radius-4xl", 2.6],
] as const;

// The seed, in px, and the whole scale follows from it. `rounded-lg` stays the
// container utility and `rounded-control` stays the control at every setting —
// both rows move what a class *measures*, never which class a thing wears,
// which is what keeps `ref-ledger.py`'s dark-band heuristic reading the same
// page.
//
// First because it is what :root ships, so a fresh clone loads as it sells.
// Then two steps tighter, and Rounded last: it is a different register rather
// than the top of the ramp, and it is the one that needs looking at on small
// boxes — a 36px control at 32px radius is the squircle `shape-effects.md` warns
// about, which is why controls stay pills and never take a rung.
// px here because these are inline styles and nothing reads them back; `rem`
// is what goes into globals.css at the harvest, and it is on the row so the
// conversion is not done twice from memory.
//                                                    rows land   goes back as
const radii = [
  { id: "lg",      label: "Lớn 24px",     seed: 24 },  // 14.4px   1.5rem
  { id: "md",      label: "Vừa 18px",     seed: 18 },  // 10.8px   1.125rem
  { id: "sm",      label: "Nhỏ 12px",     seed: 12 },  //  7.2px   0.75rem
  { id: "rounded", label: "Rounded 32px", seed: 32 },  // 19.2px   2rem
] as const;

// Re-declared as the same `calc()` globals.css writes rather than multiplied
// out here, so the multipliers above are checked against that file as
// expressions rather than as arithmetic somebody has to redo. It resolves
// because substitution happens on the element the property is declared on, and
// the seed is declared right beside them. It also keeps the DOM readable:
// `24 * 0.6` in JS is `14.399999999999999px`, which is not a number anyone
// wants to meet while measuring a corner in devtools.
const scale = (r: (typeof radii)[number]) =>
  Object.fromEntries([
    ["--radius", `${r.seed}px`],
    ...RADIUS_STEPS.map(([name, m]) => [name, `calc(var(--radius) * ${m})`]),
  ]);

// The control seed, and it is a second row rather than a column of the one
// above because it cannot be derived from it: a 40px control has room for a
// corner up to about a third of its height, so the whole band is 0 to ~13px
// plus the pill, and the container seed sits outside that band at every
// setting. `shape-effects.md` § Radius is read against the shortest side carries
// the arithmetic.
//
// Pill first, because it is what `@theme` ships — `calc(infinity * 1px)` is
// what Tailwind's own `rounded-full` resolves to, so a fresh clone loads as it
// sells. Then the two corners inside the band, then square, which is a change
// of register rather than the end of a ramp. Buttons, the select trigger,
// inputs, chips, tabs and the header's scrolled bar all turn together; the
// circles do not, because an avatar, a status dot, a chip's icon disc and a
// slider thumb are `rounded-full` by hand and never read the seed.
//                                                       goes back as
const controls = [
  { id: "pill",   label: "Pill",    r: "calc(infinity * 1px)" }, // already there
  { id: "soft",   label: "Bo 12px", r: "12px" },                 // 0.75rem
  { id: "tight",  label: "Bo 6px",  r: "6px" },                  // 0.375rem
  { id: "square", label: "Vuông",   r: "0px" },                  // 0
] as const;

// The one knob that switches a behaviour rather than a value, so it is the one
// that carries no style object: it provides a boolean and the header does the
// rest. `sections.md` § The header morphs is what each option is.
//
// Morph first, and it is the only knob besides the pairing that does not open
// on what :root ships — there is nothing in :root for a header to be faithful
// to, and the shell is shown to the user at `site-brief` step 6 with this
// panel already up, so it is a default somebody looks at rather than one that
// goes by. A still header is the deliberate step away, which is the right way
// round for a template that will be judged off a grid of thumbnails. Step away
// on the registers that are not sold that way: a payroll tool, an internal
// dashboard, anything a buyer reskins rather than shows.
const headers = [
  { id: "morph",  label: "Morph" },
  { id: "static", label: "Tĩnh" },
] as const;

// Pastel, on a project whose brief set it above 0 — `soft-pastel` is what the
// two strengths are. Written from `.soft-neutral.json` when the switch is
// mounted: null at pastel 0, where the group is not drawn and nothing below
// changes; otherwise the brief's own notch, so a fresh clone loads as it sells.
// There is no "off": a page built with pastel surfaces has no neutral version
// to show, and turning the layer on or off is the user's word in chat, not a
// pick. The knob stays up through both phases and Stop 4 · Colour settles it.
//
// This brief is at pastel 0. Asserted rather than annotated, so TypeScript
// keeps the union instead of narrowing the constant to null and calling every
// comparison against it unintentional.
const BRIEF_PASTEL = null as "whisper" | "candy" | null;

const strengths = [
  { id: "whisper", label: "Whisper", attr: "1" },
  { id: "candy",   label: "Candy",   attr: "2" },
] as const;

// One row per section that carries versions, in page order, written by hand.
// Most sections do not: the sitemap's Versions column gives three to the hero
// and to the one or two sections carrying the product's idea, and one to
// everything else, so this list is two or three rows long and a section built
// once is mounted directly with no <Variant> around it. A slots list with a row
// per section is a page that spread its attention evenly over decisions that
// were never equal.
//
// It is a list of scaffolding, so it is kept where the scaffolding is deleted
// rather than registered from the sections themselves — auto-registration would
// be a mechanism to unpick later, and there is nothing later.
//
// `options` labels the three by what actually differs: the shape, not "A/B/C".
// Empty until the home's sections are built.
const slots: { id: string; label: string; options: string[] }[] = [
  { id: "hero", label: "Hero", options: ["Fanned deck", "Ink band pair", "Centred carousel"] },
  { id: "catalogue", label: "Catalogue", options: ["Wide cards, two up", "Upright tiles, four up"] },
  { id: "families", label: "Families", options: ["Tabs over a split", "Two tinted panels"] },
];

const never = () => () => {};

// `mounted` is what tells a nested <Skin> from the one that owns the page —
// see Skin below.
const Chosen = createContext<{
  mounted: boolean;
  picks: Record<string, number>;
  preview: Record<string, number>;
  setPick: (slot: string, i: number) => void;
}>({ mounted: false, picks: {}, preview: {}, setPick: () => {} });

// The three versions arrive as children so they stay server components: all
// three render on the server, and this only chooses which one is returned. A
// version asked for in the address wins over the pick and is never saved.
export function Variant({ slot, children }: { slot: string; children: ReactNode }) {
  const { picks, preview } = useContext(Chosen);
  const options = Children.toArray(children);
  return <>{options[preview[slot] ?? picks[slot] ?? 0] ?? options[0]}</>;
}

type Ground = (typeof grounds)[number];
type Radius = (typeof radii)[number];
type Control = (typeof controls)[number];
type Header = (typeof headers)[number];
type Strength = (typeof strengths)[number];

type SkinProps = {
  saved: Picks;
  preview?: Record<string, number>;
  children: ReactNode;
};

// In this repo the header and footer are mounted in app/layout.tsx, so that is
// where the one <Skin> goes — around them, and with them around every route:
// the home, /lab and /design-system answer the same knobs from the same file,
// and a brand flipped on the page is a brand flipped on the header too.
//
// A layout never sees the address, though, so `?v=` has to come from the page.
// A page that wraps itself in <Skin saved preview> as switch.md § Mounting it
// shows lands inside the layout's, and a nested Skin is a provider and nothing
// else: it hands its `preview` to the <Variant>s under it and keeps the
// layout's picks. A second wrapper would re-declare every property for
// nothing, and a second portal would draw every knob into the panel twice.
export function Skin({ saved, preview = {}, children }: SkinProps) {
  const outer = useContext(Chosen);
  if (outer.mounted) {
    return <Chosen.Provider value={{ ...outer, preview }}>{children}</Chosen.Provider>;
  }
  return <Root saved={saved} preview={preview}>{children}</Root>;
}

function Root({ saved, preview = {}, children }: SkinProps) {
  const [brand, setBrand] = useState<string>(brandById(saved.brand));
  const [heading, setHeading] = useState<Face>(face(saved.heading ?? OPENS_ON.heading));
  const [body, setBody] = useState<Face>(face(saved.body ?? OPENS_ON.body));
  const [ground, setGround] = useState<Ground>(groundById(saved.ground));
  const [radius, setRadius] = useState<Radius>(radiusById(saved.radius));
  const [control, setControl] = useState<Control>(controlById(saved.control));
  const [header, setHeader] = useState<Header>(headerById(saved.header));
  const [strength, setStrength] = useState<Strength>(strengthById(saved.pastel));
  const [picks, setPicks] = useState<Record<string, number>>(saved.picks ?? {});
  // The mode is the preset panel's Mode row, remembered the way a visitor's
  // is, and read here only to know whether the ground knob may write. In the
  // dark half `.dark` owns the ground and the ladder, and a light value
  // written inline here would win over it.
  const { resolvedTheme } = useTheme();
  const night = resolvedTheme === "dark";
  const white = useSyncExternalStore(never, whiteGround, () => null);

  // One writer. Every control goes through it, so the file on disk is never a
  // subset of what is on screen, and there is no read-modify-write to race.
  // A failed write is swallowed on purpose: this is scaffolding, and a
  // read-only filesystem should cost the pick, not the page.
  const commit = (
    next: Partial<{
      brand: string; heading: Face; body: Face; ground: Ground; radius: Radius;
      control: Control; header: Header; strength: Strength;
      picks: Record<string, number>;
    }>,
  ) => {
    const m = {
      brand, heading, body, ground, radius, control, header, strength, picks,
      ...next,
    };
    setBrand(m.brand);
    setHeading(m.heading);
    setBody(m.body);
    setGround(m.ground);
    setRadius(m.radius);
    setControl(m.control);
    setHeader(m.header);
    setStrength(m.strength);
    setPicks(m.picks);
    void savePicks({
      brand: m.brand, heading: m.heading.id, body: m.body.id,
      ground: m.ground.id, radius: m.radius.id, control: m.control.id,
      header: m.header.id,
      pastel: BRIEF_PASTEL ? m.strength.id : undefined,
      picks: m.picks,
    }).catch(() => {});
  };

  const setPick = (slot: string, i: number) =>
    commit({ picks: { ...picks, [slot]: i } });

  // No pairing state. A pairing is two picks, so the lit pill is derived from
  // them — which also means arriving at a pairing by hand lights it up, and
  // stepping one face off it goes dark with nothing left to reset.
  const pairing = pairings.find(
    (p) => p.heading === heading.id && p.body === body.id,
  );

  // The panel lives in app/layout.tsx outside this wrapper, so the knobs reach
  // it through a portal into the slot it keeps empty for them. Registering is
  // what locks its Color and Preset rows; the cleanup unlocks them.
  const slot = useSyncExternalStore(
    never, () => document.getElementById(BUILD_SLOT), () => null,
  );
  useEffect(() => registerBuild(), []);

  return (
    <Chosen.Provider value={{ mounted: true, picks, preview, setPick }}>
      {/* html already carries font-sans and font-normal, so both variables
          resolve up there and this subtree would inherit the *resolved* face
          and weight rather than its own override. Re-declaring the two
          utilities here makes it read the variables set beside them.

          The brand is the [data-color] block this div names, in both halves;
          Original is :root's own and names none.

          flex-1 and flex-col carry <body>'s column through the wrapper, so the
          header, a route's <main> and the footer stack as they will once the
          wrapper is gone, and a short page still puts the footer at the foot. */}
      <div
        data-pastel={BRIEF_PASTEL ? strength.attr : undefined}
        data-color={brand === "original" ? undefined : brand}
        className="flex min-h-svh flex-1 flex-col bg-background font-sans font-normal"
        style={
          {
            // :root declares these through var(), so they arrive here already
            // resolved to Original's brand. Declared again, they read the
            // block on this div.
            "--ring": "var(--primary-ink)",
            "--sidebar-primary": "var(--primary)",
            "--sidebar-primary-foreground": "var(--primary-foreground)",
            "--font-sans": `var(${body.variable})`,
            "--font-heading": `var(${heading.variable})`,
            "--font-weight-normal": body.body,
            "--font-weight-medium": body.emphasis,
            "--tracking-tight": body.tight,
            "--tracking-tighter": body.tighter,
            // :root has already substituted --leading-display into the three
            // display sizes, so overriding that variable alone changes nothing
            // — the sizes themselves have to be re-declared. These are the
            // *body* face's, for display type that is neither a heading element
            // nor .font-heading; those re-declare them from --heading-leading-display.
            "--text-5xl--line-height": body.leading,
            "--text-6xl--line-height": body.leading,
            "--text-7xl--line-height": body.leading,
            // The heading face's whole row. The base rule in globals.css reads
            // these on every h1–h6 and .font-heading, so the two faces are
            // never set with each other's numbers.
            "--heading-weight-normal": heading.body,
            "--heading-weight-medium": heading.emphasis,
            "--heading-tracking-tight": heading.tight,
            "--heading-tracking-tighter": heading.tighter,
            "--heading-leading-display": heading.leading,
            ...(ground.id === "white" && !night ? white : null),
            ...scale(radius),
            // One property and no rungs, which is the whole difference
            // between the two seeds.
            "--radius-control": control.r,
          } as CSSProperties
        }
      >
        {/* Renders no element, so the page under it is the page that ships —
            the same reason phase two's Skin is a provider and not a wrapper. */}
        <HeaderMorph.Provider value={header.id === "morph"}>
          {children}
        </HeaderMorph.Provider>
      </div>

      {/* The panel sits outside the styled wrapper in the DOM, so
          --font-sans and --radius-control resolve to the root's in here: a
          control that reflows as you switch faces is a control you cannot aim
          at twice, and knobs whose own corners moved with the knob would be a
          ruler that changes shape as you measure with it. */}
      {slot && createPortal(
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-base font-medium">Build</p>
            <p className="text-sm text-muted-foreground">
              Picks the template&apos;s own look and its section versions. Leaves after Stop 4.
            </p>
          </div>
          <Axis id="colors">
            {BRANDS.length > 1 && (
              <Group label="Brand">
                {BRANDS.map((id) => (
                  <Pill key={id} active={brand === id} onClick={() => commit({ brand: id })}>
                    {/* Each dot wears its own block, as the panel's swatches do. */}
                    <span aria-hidden data-color={id}
                          className="size-2.5 rounded-full bg-primary" />
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Pill>
                ))}
              </Group>
            )}

            {BRIEF_PASTEL && (
              <Group label="Pastel">
                {strengths.map((o) => (
                  <Pill key={o.id} active={strength.id === o.id} onClick={() => commit({ strength: o })}>
                    {o.label}
                  </Pill>
                ))}
              </Group>
            )}

            <Group label="Ground">
              {grounds.map((o) => (
                <Pill key={o.id} active={ground.id === o.id} onClick={() => commit({ ground: o })}>
                  {o.label}
                </Pill>
              ))}
            </Group>
          </Axis>

          <Axis id="typography">
            <Group label="Pairing">
              {pairings.map((o) => (
                <Pill
                  key={o.id}
                  active={pairing?.id === o.id}
                  onClick={() =>
                    commit({ heading: face(o.heading), body: face(o.body) })
                  }
                >
                  {o.label}
                </Pill>
              ))}
            </Group>

            <Group label="Heading">
              {faces.map((o) => (
                <Pill key={o.id} active={heading.id === o.id} onClick={() => commit({ heading: o })}>
                  {o.label}
                </Pill>
              ))}
            </Group>

            <Group label="Body">
              {faces
                .filter((o) => o.where === "both")
                .map((o) => (
                  <Pill key={o.id} active={body.id === o.id} onClick={() => commit({ body: o })}>
                    {o.label}
                  </Pill>
                ))}
            </Group>
          </Axis>

          <Axis id="shape-effects">
            {/* The swatch is drawn at the option's own seed, so the pill shows
                the corner rather than naming it — and it is the *container*
                radius on a small square, which is the shape the setting is
                easiest to misjudge from prose alone. */}
            <Group label="Radius">
              {radii.map((o) => (
                <Pill key={o.id} active={radius.id === o.id} onClick={() => commit({ radius: o })}>
                  <span aria-hidden className="size-2.5 border border-current"
                        style={{ borderRadius: `${o.seed / 6}px` }} />
                  {o.label}
                </Pill>
              ))}
            </Group>

            {/* The same knob's second row, and the same trick at the proportions
                of a control: a box a quarter of a 40px button, cornered at a
                quarter of the option's own seed. One `calc()` covers all four
                without a branch — infinity over four is still infinity. */}
            <Group label="Radius · control">
              {controls.map((o) => (
                <Pill key={o.id} active={control.id === o.id} onClick={() => commit({ control: o })}>
                  <span aria-hidden className="h-2.5 w-5 border border-current"
                        style={{ borderRadius: `calc(${o.r} / 4)` }} />
                  {o.label}
                </Pill>
              ))}
            </Group>
          </Axis>

          <Axis id="sections">
            {/* No swatch on these two: the difference is 700ms of a bar at the
                top of the page changing shape, and a pill cannot hold it. It is
                also the one knob whose effect is invisible from where it is
                clicked — the panel is light-dismiss and survives a scroll, so
                judge it scrolled rather than from the top of the page. */}
            <Group label="Header">
              {headers.map((o) => (
                <Pill key={o.id} active={header.id === o.id} onClick={() => commit({ header: o })}>
                  {o.label}
                </Pill>
              ))}
            </Group>

            {slots.map((row) => (
              <SlotRow key={row.id} slot={row} active={picks[row.id] ?? 0}
                       onPick={(i) => setPick(row.id, i)} />
            ))}
          </Axis>
        </div>,
        slot,
      )}
    </Chosen.Provider>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

// The knobs run in the axis order every surface of the workflow shares — the
// brief, DESIGN.md, an audit — under the axis each one decides, so a pick read
// off this panel is already filed where it will be written down.
function Axis({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section aria-label={id} className="flex flex-col gap-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{id}</p>
      {children}
    </section>
  );
}

// One row of the slots list, under `sections`: one pill per version, in the
// order of the children of its <Variant>.
function SlotRow({
  slot, active, onPick,
}: { slot: (typeof slots)[number]; active: number; onPick: (i: number) => void }) {
  return (
    <Group label={slot.label}>
      {slot.options.map((label, i) => (
        <Pill key={label} active={active === i} onClick={() => onPick(i)}>
          {label}
        </Pill>
      ))}
    </Group>
  );
}

function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        reach,
        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors",
        active
          ? "bg-foreground font-medium text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
