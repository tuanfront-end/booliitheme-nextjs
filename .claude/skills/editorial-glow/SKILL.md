---
name: editorial-glow
description: The Editorial Glow house style for building UI — a paper-white page, warm ink, a condensed serif for display, structure drawn in hairlines, one brand hue spent in marks and one soft glow. Use it for every page, section or component built in a project whose AGENTS.md names editorial-glow as its house style, in place of soft-neutral, including requests that sound technical ("build a pricing page", "style this table").
---

# Editorial Glow

The house style of this project. Where any skill says to load or follow
`soft-neutral`, load this instead; `AGENTS.md` names the few soft-neutral files
that stay shared. Never open `soft-neutral/SKILL.md` or its look files
(`colors`, `shape-effects`, `typography`, `spacing-scale`, `component-states`,
`ornaments`, `imagery`, `light-dark`, `presets`, `dials`, `icons`, `motion`):
their tinted ladder and pills are the opposite of this style and leak into
whatever is built next.

Stack: Next.js + Tailwind v4 + shadcn/ui, tokens in `app/globals.css` under
shadcn's own names plus the few this style adds — `references/setup.md`.

The style fixes the page, the type, the structure and how colour is spent.
Layout, the hero idea, the one memorable figure on a page, motion and copy are
open.

## The style in one paragraph

A page like a well-set report. Paper white from top to bottom, warm near-black
ink, and grey that is that ink thinned. Display lines are a condensed serif at
regular weight; everything else is a quiet grotesk; figures that are data are
mono. Structure is drawn, not tinted: content sits in panels outlined by a 1px
**hairline**, and a panel's cells share their dividers instead of floating as
separate cards. One brand hue is spent in **marks** — the eyebrow's dot and
label, an icon's stroke, a figure, the chosen plan — and one soft **glow** of
that hue and its warm neighbour is the only mass of colour on the page. The
primary button is ink, made tactile with a faint gradient and a lit top edge.
Lots of white; nothing shouts.

## Personality

Composed · literate · quietly warm. Not cute, not neon, not corporate.

The serif and the white make it literate; the glow and the warm ink keep it
from turning cold. Too much glow and it becomes a wellness ad; no glow and
hairlines alone read as a spreadsheet.

---

## Setup and the one-time files

- `references/setup.md` — the tokens, faces, radius pair, the two shadows and
  the button recipe. Read it when standing a project up, when `globals.css`
  changes, or when a value looks wrong.
- `references/dials.md` — the `colour` and `motion` notches in
  `.soft-neutral.json` and the `house` key. Read it when the defaults are set
  or a check cites a notch.
- `references/presets.md` — the preset panel's three faces and the colour row.
  Read it before touching `preset.json` or the preset blocks in `globals.css`.

## The twelve axes

The same twelve axes, in the same order, as every studio document:
`colors` · `light-dark` · `typography` · `spacing-scale` · `icons` ·
`shape-effects` · `component-states` · `motion` · `sections` · `ornaments` ·
`imagery` · `copy`. Each line below is the axis in brief; its file in
`references/` holds the rules and ends on `## Floor`, what an audit holds a
section to. Read the floor while building, not after.

- **colors** — paper, two inks, the hairline, one brand hue with an ink for
  small text, the glow pair. Brand is a mark, never a fill: the action is ink.
  → `references/colors.md`
- **light-dark** — both halves ship. Dark is warm near-black paper with paper
  ink; the hairline and the glow carry over. → `references/light-dark.md`
- **typography** — the serif for display only, at weight 400; the grotesk for
  everything read; mono for data figures. → `references/typography.md`
- **spacing-scale** — wide margins, a left-aligned header block, big air
  between a header and its panel. → `references/spacing-scale.md`
- **icons** — HugeIcons stroke-rounded at a fine stroke, in the brand hue
  beside a feature; Heroicons for arrows. → `references/icons.md`
- **shape-effects** — hairlines over shadows; joined panels; radius 12 on
  structure, 10 on controls, pills only on chips. → `references/shape-effects.md`
- **component-states** — hover thickens ink or the hairline; chosen is ink plus
  a mark; the brand ring is focus. → `references/component-states.md`
- **motion** — slow and few: a reveal, a drifting glow, a fading rail.
  → `references/motion.md`
- **sections** — header block, then one panel or one figure; asymmetry and
  cropping over centred stacks. → `references/sections.md`
- **ornaments** — six kinds: glow, line art, skeleton mock, ground texture,
  data dial, fading rail. One per section. → `references/ornaments.md`
- **imagery** — photographs in hairline frames, true colour, never full bleed.
  → `references/imagery.md`
- **copy** — shared with the studio: soft-neutral's `references/copy.md`, plus
  the voice notes in `references/sections.md` § Voice.

## Bright lines

The studio's four measured lines bind here unchanged (skills repo ADR 0030).
They are repeated rather than pointed at because their home is
`soft-neutral/SKILL.md`, which this style keeps out of context.

- **Text clears 4.5:1** on its ground, 3:1 at 24px and up. The brand hue on
  white does not reach 4.5:1 at the source value; small brand text is
  `text-brand-ink`.
- **A focus ring clears 3:1** against what is beside it, in both halves.
- **A state shown by a mark alone clears 3:1** — the current dot, a tick, a
  chosen tile's ring.
- **A hit area clears 40px**, whatever height the control is drawn at.

## The craft floor

Every section is held to these; each has its fuller passage in the axis file.

- **Two inks, three weights.** `text-foreground` and `text-muted-foreground`.
  The grotesk runs at 400 and 500; 600 belongs to a price figure and nothing
  else. The serif runs at 400 only — no bold, no medium.
- **The serif is for display.** A hero line, a section heading, a plan or
  product name set large, a figure-label like "7:30 AM". Never under 24px,
  never body copy, never a button or a label.
- **Hairlines carry the structure.** `border-border` at 1px. A panel of several
  items is one outlined box divided inside (`divide-x`, `divide-y`), not a row
  of separate cards. A panel never also casts a shadow.
- **Brand is spent in marks.** The eyebrow, a feature icon, a data figure, the
  chosen or recommended item, the focus ring. It never fills a button, a band
  or a card.
- **One glow per page** at the default notch, anchored to something — a figure,
  the recommended column, the hero subject — and faded to paper before the
  section's edge.
- **Controls are 40px, 44 for a section's one call to action.** Radius 10, 12 on
  the 44px size. The primary is ink; the secondary is paper with a hairline and
  the lift shadow.
- **A section opens on its header block** — eyebrow, serif heading of ten words
  at most, one-sentence lede that holds one line at 1280 — left-aligned unless
  the section's figure is centred under it.
- **Figures are mono and brand-coloured** when they are data the product
  produced (a yield, a count, a version); a price is the grotesk at 600 in ink.
- **Real images or none**, framed per `references/imagery.md`.
- **Page roles are components before the first section** — `Eyebrow`,
  `SectionHeading`, `Lede`, `Button`, `Panel` — and anything else at its second
  use.

The checks that hold these run in `npm run check`; `package.json` is the list.

## Gates

Shared with the studio, read from `soft-neutral/references/`:

→ **`direction.md`** before writing any side, inset, alignment, rounded edge,
translate, gradient direction or onward arrow.

→ **`seo.md`** while writing a route's `metadata`, a sitemap, `robots`,
structured data, or a control labelled only by the heading beside it.

## Where to spend creativity

- The hero's figure: a glow given a shape, a line drawing, a product cropped
  off the edge.
- The one data-as-ornament moment a page is remembered by.
- Layout rhythm: splits, offsets, a figure cropped by the viewport — this is
  not a centred-stack system.
- Copy — an editorial page with generic words is the cheapest-looking thing
  there is.

Spend boldness once per screen; let hairlines and white do the rest.

## What breaks the style

These stop a page reading as Editorial Glow:

- A tinted ground, grey cards without outlines, or depth built from fills —
  that is Soft Neutral's ladder.
- A pill button or a pill input. Pills are chips and tags only.
- The brand hue as a fill on a button, a band, a card or a section.
- A second saturated hue anywhere outside a photograph.
- A glow with no anchor: a wash across a whole section, behind body copy, or
  under the header.
- A dark band mid-page. The page is paper end to end; dark is the dark half.
- A shadow on a panel or card, or a border and a declared shadow together on
  one element — the lift shadow belongs to the secondary button and to things
  that float (a menu, a popover, a chat field over a figure).
- The serif bold, the serif under 24px, the serif in a button.
- Pure `#000` ink or shadows. Ink is warm.
- `font-mono` over chrome — an eyebrow, a label, a nav item. Mono is for data.
- A coloured bar across the top of a card.
- Emoji standing in for icons.
