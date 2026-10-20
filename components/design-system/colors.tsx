"use client";

import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, type ReactNode, useMemo } from "react";

import { contrast, readVar, rgb, useLive } from "@/components/design-system/live";
import { DsTokens, Specimen } from "@/components/design-system/section";
import { cn } from "@/lib/utils";

// The rungs, top down. Depth on this site is tint rather than shadow, so the
// ladder is drawn as one strip: the steps only read beside each other.
const LADDER = [
  { token: "card", role: "Cards" },
  { token: "background", role: "The page" },
  { token: "accent", role: "Bands and hovers" },
  { token: "muted", role: "Rows and chips" },
  { token: "secondary", role: "The deepest well" },
  { token: "border", role: "Hairlines" },
] as const;

const TEXT = [
  { token: "foreground", role: "Text" },
  { token: "muted-foreground", role: "Quiet text" },
] as const;

// Seven hues that tell peers apart. Each class is written out whole, because
// the stylesheet is built from the strings it can find in the source.
const ACCENTS = [
  { name: "leaf", fill: "bg-leaf", chip: "bg-leaf/15 text-leaf-ink" },
  { name: "sun", fill: "bg-sun", chip: "bg-sun/15 text-sun-ink" },
  { name: "coral", fill: "bg-coral", chip: "bg-coral/15 text-coral-ink" },
  { name: "iris", fill: "bg-iris", chip: "bg-iris/15 text-iris-ink" },
  { name: "lime", fill: "bg-lime", chip: "bg-lime/15 text-lime-ink" },
  { name: "sky", fill: "bg-sky", chip: "bg-sky/15 text-sky-ink" },
  { name: "peach", fill: "bg-peach", chip: "bg-peach/15 text-peach-ink" },
] as const;

// A translucent ground: `ground` at `alpha` laid over the page, at `dark` in
// the dark half where the two differ. An alpha written as a token's name is
// read off that token.
type Tint = { alpha: string; dark?: string };
const BRAND_CHIP: Tint = { alpha: "chip-alpha" };

type Pair = { ink: string; ground: string; floor: number; label: string; tint?: Tint };

// What has to clear a floor no template may lower — the bright lines. Every
// ground a brand, a preset or the dark half moves is on it, since nothing else
// on the sheet reads them.
const PAIRS: Pair[] = [
  { ink: "foreground", ground: "background", floor: 4.5, label: "Text on the page" },
  { ink: "muted-foreground", ground: "background", floor: 4.5, label: "Quiet text on the page" },
  { ink: "muted-foreground", ground: "muted", floor: 4.5, label: "Quiet text on a chip" },
  { ink: "card-foreground", ground: "card", floor: 4.5, label: "Text on a card" },
  { ink: "popover-foreground", ground: "popover", floor: 4.5, label: "Text in a popup" },
  { ink: "secondary-foreground", ground: "secondary", floor: 4.5, label: "Text in the deepest well" },
  { ink: "accent-foreground", ground: "accent", floor: 4.5, label: "Text on a band or a hover" },
  {
    ink: "destructive",
    ground: "destructive",
    tint: { alpha: "10%", dark: "20%" },
    floor: 4.5,
    label: "A destructive button's label",
  },
  { ink: "primary-foreground", ground: "primary", floor: 4.5, label: "A label on the fill" },
  { ink: "action-foreground", ground: "action", floor: 4.5, label: "The primary button's label" },
  { ink: "primary-ink", ground: "background", floor: 4.5, label: "Brand ink on the page" },
  ...ACCENTS.map((a) => ({
    ink: `${a.name}-ink`,
    ground: a.name,
    tint: { alpha: "15%" },
    floor: 4.5,
    label: `The ${a.name} chip's ink`,
  })),
  { ink: "ring", ground: "background", floor: 3, label: "The focus ring on the page" },
  { ink: "ring", ground: "card", floor: 3, label: "The focus ring on a card" },
];

// The five tokens a brand is written in. A [data-color] block sets all five;
// Original is the one that sets them on :root.
const BRAND_TOKENS = ["primary", "primary-foreground", "primary-ink", "action", "action-foreground"] as const;

function eachRule(visit: (rule: CSSStyleRule) => void) {
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) visit(rule);
      if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // A stylesheet from another origin, which cannot hold these blocks.
    }
  }
}

// The Color row as the stylesheet defines it: Original first, then every
// `[data-color="…"]` block in the order globals.css writes them, Ink among
// them. Read here rather than imported from the preset panel, which a buyer
// may delete; the blocks stay either way.
function colorRow(): string[] {
  const found = new Set<string>();
  eachRule((rule) => {
    for (const match of rule.selectorText.matchAll(/\[data-color="([a-z0-9-]+)"\]/g)) found.add(match[1]);
  });
  found.delete("original");
  return ["original", ...found];
}

// Original's five tokens, read off the :root and .dark rules. Its own
// [data-color] block carries the fill alone, so a sample wearing it under
// another colour would inherit that colour's action and ink. Each value goes
// on the sample inline, where a var(--primary) resolves against the fill
// beside it.
function originalBrand(dark: boolean): CSSProperties {
  const out: Record<string, string> = {};
  const read = (selector: string) =>
    eachRule((rule) => {
      if (rule.selectorText !== selector) return;
      for (const token of BRAND_TOKENS) {
        const value = rule.style.getPropertyValue(`--${token}`).trim();
        if (value) out[`--${token}`] = value;
      }
    });
  read(":root");
  if (dark) read(".dark");
  return out as CSSProperties;
}

const title = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

// A colour is printed as the sRGB it paints. The stylesheet is compiled with a
// hex fallback and a lab() over it where the browser takes one, so the raw
// value reads as hex in one half and lab() in the other; read back through the
// canvas, both print the same way. Anything that is not a colour — the chip's
// alpha — prints as written.
function printed(value: string) {
  if (!value || !CSS.supports("color", value)) return value || "—";
  return `#${rgb(value).map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function Value({ token }: { token: string }) {
  const live = useLive();
  return (
    <code className="truncate font-mono text-xs text-muted-foreground">
      {live ? printed(readVar(token)) : "\u00a0"}
    </code>
  );
}

function Swatch({ token, role, className }: { token: string; role: string; className?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className={cn("h-20 rounded-md ring-1 ring-foreground/10 ring-inset", className)}
        style={{ background: `var(--${token})` }}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{role}</span>
        <code className="truncate font-mono text-xs text-muted-foreground">--{token}</code>
        <Value token={token} />
      </div>
    </div>
  );
}

function alphaOf(tint: Tint) {
  const dark = document.documentElement.classList.contains("dark");
  const alpha = (dark && tint.dark) || tint.alpha;
  return alpha.endsWith("%") ? alpha : readVar(alpha);
}

// A `tint` is laid over the page first, since a canvas would otherwise lay it
// over white and measure a chip the dark half never draws.
function Ratio({
  ink,
  ground,
  floor,
  tint,
}: {
  ink: string;
  ground: string;
  floor: number;
  tint?: Tint;
}) {
  const live = useLive();
  if (!live) return <span className="text-sm text-muted-foreground">—</span>;
  // A canvas cannot read var(), so each end is resolved off <html> first.
  const under = tint
    ? `rgb(${rgb(`color-mix(in oklab, ${readVar(ground)} ${alphaOf(tint)}, transparent)`, readVar("background")).join(",")})`
    : readVar(ground);
  const r = contrast(readVar(ink), under);
  const ok = r >= floor;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm tabular-nums">
      <HugeiconsIcon
        icon={ok ? Tick02Icon : Cancel01Icon}
        aria-hidden="true"
        className={cn("size-4", ok ? "text-leaf-ink" : "text-destructive")}
      />
      {r.toFixed(2)}:1
      <span className="sr-only">{ok ? "clears" : "falls under"} {floor}:1</span>
    </span>
  );
}

// The share of a tinted ground, as the class that draws it writes it: /15.
function TintAlpha({ tint }: { tint: Tint }) {
  const live = useLive();
  return <>/{live ? parseFloat(alphaOf(tint)) : parseFloat(tint.alpha)}</>;
}

// What the template's action is, said in the words the palette is written in:
// the fill itself, the page's ink, or a deep shade of the hue.
function ActionStyle() {
  const live = useLive();
  if (!live) return <>The primary button</>;
  const action = readVar("action");
  const style =
    action === readVar("primary")
      ? "the fill itself"
      : action === readVar("foreground")
        ? "the page's ink"
        : "a deep shade";
  return <>The primary button, {style}</>;
}

// One role of the brand: its colour with the type it carries, and that pair
// measured. Ink is never a fill, so its swatch is the page with the ink as a
// 2px edge and as the letters — the two things it draws.
function Role({
  name,
  use,
  token,
  ground,
  ink,
  className,
  chip,
}: {
  name: string;
  use: ReactNode;
  token: string;
  ground: string;
  ink: string;
  className: string;
  chip?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div aria-hidden="true" className={cn("flex h-28 items-end rounded-md p-4", className)}>
        <span className="text-3xl tracking-tight">Aa</span>
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{name}</span>
          <Ratio ink={ink} ground={chip ? "primary" : ground} floor={4.5} tint={chip ? BRAND_CHIP : undefined} />
        </div>
        <span className="truncate text-sm text-muted-foreground">{use}</span>
        <code className="mt-1 truncate font-mono text-xs text-muted-foreground">--{token}</code>
        <Value token={token} />
      </div>
    </div>
  );
}

function ColorRow() {
  const live = useLive();
  const row = useMemo(() => (live ? colorRow() : []), [live]);
  const dark = live > 0 && document.documentElement.classList.contains("dark");
  const original = useMemo(() => (live ? originalBrand(dark) : {}), [live, dark]);
  const showing = live ? (document.documentElement.dataset.color ?? "original") : null;

  return (
    <Specimen>
      <ul className="flex flex-wrap gap-x-12 gap-y-8">
        {row.map((id) => (
          <li
            key={id}
            data-color={id === "original" ? undefined : id}
            style={id === "original" ? original : undefined}
            className="flex flex-col gap-3"
          >
            {/* Fill, action, ink — the ink as the thin edge it draws. */}
            <div aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-9 rounded-full bg-primary ring-1 ring-foreground/10 ring-inset" />
              <span className="size-9 rounded-full bg-action ring-1 ring-foreground/10 ring-inset" />
              <span className="size-9 rounded-full ring-2 ring-primary-ink ring-inset" />
            </div>
            <span className="flex items-baseline gap-2 text-sm">
              <span className="font-medium">{title(id)}</span>
              {showing === id && <span className="text-muted-foreground">Showing</span>}
            </span>
          </li>
        ))}
      </ul>
    </Specimen>
  );
}

export function Colors() {
  return (
    <div className="flex flex-col gap-16">
      <DsTokens
        id="colors-ladder"
        title="The surface ladder"
        note="Near-whites a step apart, the page near the top, so cards separate by tint."
        source="app/globals.css"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {LADDER.map((s) => (
            <Swatch key={s.token} {...s} />
          ))}
        </div>
      </DsTokens>

      <DsTokens
        id="colors-brand"
        title="Brand"
        note="One hue in three roles: what a control fills, the primary button, and the ink."
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <Role
            name="Fill"
            use="A chosen state, progress, a chip"
            token="primary"
            ground="primary"
            ink="primary-foreground"
            className="bg-primary text-primary-foreground ring-1 ring-foreground/10 ring-inset"
          />
          <Role
            name="Action"
            use={<ActionStyle />}
            token="action"
            ground="action"
            ink="action-foreground"
            className="bg-action text-action-foreground ring-1 ring-foreground/10 ring-inset"
          />
          <Role
            name="Ink"
            use="Brand text, the focus ring, an edge"
            token="primary-ink"
            ground="background"
            ink="primary-ink"
            className="text-primary-ink ring-2 ring-primary-ink ring-inset"
          />
          <Role
            name="Chip"
            use="A tint of the fill, under ink"
            token="chip-alpha"
            ground="background"
            ink="primary-ink"
            chip
            className="bg-chip text-primary-ink"
          />
        </div>
      </DsTokens>

      <DsTokens
        id="colors-row"
        title="The Color row"
        note="Every brand the preset panel offers, as fill, action and ink. Ink is always one."
        source="app/globals.css"
      >
        <ColorRow />
      </DsTokens>

      <DsTokens
        id="colors-text"
        title="Text"
        note="Two levels of text on every rung; anything quieter is set smaller, never fainter."
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {TEXT.map((s) => (
            <Swatch key={s.token} {...s} />
          ))}
        </div>
      </DsTokens>

      <DsTokens
        id="colors-accents"
        title="Seven accent colours"
        note="Seven hues that tell peers apart — a chip, a set, an ornament — never a second brand."
      >
        <Specimen className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {ACCENTS.map((a) => (
            <div key={a.name} className="flex flex-col items-start gap-3">
              <div className={cn("size-12 rounded-full", a.fill)} />
              <span className={cn("rounded-control px-2.5 py-0.5 text-xs font-medium capitalize", a.chip)}>
                {a.name}
              </span>
            </div>
          ))}
        </Specimen>
      </DsTokens>

      <DsTokens
        id="colors-contrast"
        title="Contrast"
        note="Measured live in this mode. Text clears 4.5:1, a focus ring 3:1, under any preset."
      >
        <Specimen className="p-0 sm:p-0">
          <table className="w-full text-start">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th scope="col" className="px-6 py-3 font-normal">Pair</th>
                <th scope="col" className="hidden px-6 py-3 font-normal sm:table-cell">Tokens</th>
                <th scope="col" className="px-6 py-3 text-end font-normal">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map((p) => (
                <tr key={`${p.ink}-${p.ground}`} className="border-t border-border">
                  <td className="px-6 py-3 text-sm">{p.label}</td>
                  <td className="hidden px-6 py-3 sm:table-cell">
                    <code className="font-mono text-xs text-muted-foreground">
                      --{p.ink} on --{p.ground}
                      {p.tint && <TintAlpha tint={p.tint} />}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-end">
                    <Ratio {...p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Specimen>
      </DsTokens>
    </div>
  );
}
