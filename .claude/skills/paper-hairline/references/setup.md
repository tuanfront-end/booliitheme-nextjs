# Setup

The values a project in this style runs on. They are written once into
`app/globals.css` and `app/layout.tsx`; this page is why each is what it is.
Source values are gru.ai's, measured in `refs/_measure.md`.

## Tokens

shadcn's names keep their shadcn meaning, so the kit and preview-kit read them
unchanged. The style adds `brand*`, `texture`, `primary-top` and the two
shadows.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#ffffff` | `#130b0a` | paper — the whole page |
| `--foreground` | `#1b0a08` | `#f5f0ef` | ink |
| `--muted-foreground` | `#6b605e` | `#a99f9d` | the second ink; solid, never an alpha |
| `--card`, `--popover`, `--secondary` | `#ffffff` | `#130b0a` | paper again: structure comes from the hairline |
| `--muted` | `#fbfaf9` | `#1b1211` | the **cell** — an illustration's cell, a skeleton card, a hovered row |
| `--accent` | `#f7f5f4` | `#211716` | shadcn's hover fill for menu items |
| `--border`, `--input` | `#e8e6e6` | `#2e2423` | the **hairline** |
| `--primary` | `#1b0a08` | `#f5f0ef` | the action's fill: ink |
| `--primary-top` | `#524c4b` | `#ffffff` | the top of the action's gradient |
| `--primary-foreground` | `#ffffff` | `#1b0a08` | |
| `--brand` | `#e72887` | `#ff4fa0` | marks: dots, icons, large figures, rings |
| `--brand-ink` | `#c41a6b` | `#ff7ab8` | brand text under 24px (clears 4.5:1) |
| `--brand-soft` | `#f8bedb` | `#5a1a38` | a lit arc, a tint stroke, a selection |
| `--brand-wash` | `#fdeff6` | `#2a0f1c` | the chosen cell's flat ground |
| `--texture` | `#f2f0ef` | `#221816` | stripes, grids, rings drawn on a ground |
| `--ring` | `var(--brand)` | `var(--brand)` | focus |
| `--destructive` | `#c4291c` | `#ff6b5e` | errors only |

`--brand` is the variable a project changes: `brand-hue` derives
`--brand-ink`, `--brand-soft` and `--brand-wash` from it. Never hand-edit the
derived three.

## Radius

`--radius: 12px` (panels, cards, frames) and `--radius-control: 10px`
(buttons, inputs, segmented controls). The 44px button takes 12. Chips and tags
are `rounded-full`. Nested boxes are concentric: the outer radius is the inner
plus the padding between them, so a 10px button 2px inside a frame sits in 12.

## Shadows

Two, both warm, neither on a panel:

```css
--shadow-lift: 0 1px 2px rgb(27 10 8 / .06), 0 2px 6px -2px rgb(27 10 8 / .08);
--shadow-float: 0 2px 6px rgb(27 10 8 / .06), 0 16px 40px -16px rgb(27 10 8 / .22);
```

`lift` — the secondary button, a chip that can be pressed. `float` — anything
over other content: a menu, a popover, a chat field set over a figure.

## Utilities this style adds to `globals.css`

- `btn-ink` — the primary button's recipe below; the kit's `Button` default
  variant wears it.
- `ground-stripes`, `ground-grid`, `ground-rings` — the three ground textures,
  each put on an absolutely positioned layer of its own (the mask fades
  whatever the element holds).
- `text-brand`, `text-brand-ink`, `bg-brand-wash`, `stroke-brand-soft` … — the
  brand tokens as Tailwind colours.

The kit adds `DotTabs` (`components/ui/dot-tabs.tsx`) for the vertical tab list
beside a figure.

## The primary button

```css
background: linear-gradient(to bottom, var(--primary-top), var(--primary));
border: 1px solid var(--primary);
color: var(--primary-foreground);
box-shadow: inset 0 1px 0 rgb(255 255 255 / .3), 0 1px 2px rgb(27 10 8 / .2);
```

The lit top edge and the gradient are what make it read as pressable rather
than a black rectangle. Hover lifts `--primary-top` one step lighter
(`#6a6362`); the arrow, when there is one, moves 2px toward its destination.

## Faces

| Role | Face | Weights | Source |
|---|---|---|---|
| display | Instrument Serif | 400, 400 italic | Google, OFL — `next/font` |
| body | Instrument Sans | 400, 500, 600 | Google, OFL — `next/font` |
| data | IBM Plex Mono | 400, 500 | Google, OFL — `next/font` |
| preset "Condensed" display | Noto Serif Display, `wdth` 70 | 400 | Google, OFL — `next/font`, `preload: false` |
| preset "Fine" display | Boska | 400 | Fontshare — fetched by the buyer, never shipped (`soft-neutral/references/fetched-faces.md`) |

Variables: `--font-heading` (display), `--font-sans` (body), `--font-mono`.

## Floor

- Every token in the table exists in both halves; no component writes a hex.
- The three default faces arrive (check the network tab, not the fallback).
