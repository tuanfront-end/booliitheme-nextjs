---
version: alpha
name: booliitheme
colors:
  background: "oklch(99.3% 0.001 67.81)"
  foreground: "oklch(21.7% 0.004 67.625)"
  card: "oklch(100% 0 0)"
  card-foreground: "oklch(21.7% 0.004 67.625)"
  popover: "oklch(100% 0 0)"
  popover-foreground: "oklch(21.7% 0.004 67.625)"
  primary: "oklch(25% 0.005 67.7)"
  primary-foreground: "oklch(100% 0 0)"
  primary-ink: "oklch(25% 0.005 67.7)"
  action: "oklch(25% 0.005 67.7)"
  action-foreground: "oklch(100% 0 0)"
  action-hover: "oklch(20% 0.005 67.7)"
  secondary: "oklch(93.2% 0.002 67.794)"
  secondary-foreground: "oklch(21.7% 0.004 67.625)"
  muted: "oklch(94.7% 0.002 67.8)"
  muted-foreground: "oklch(51.3% 0.008 67.644)"
  accent: "oklch(97.4% 0.001 67.808)"
  accent-foreground: "oklch(21.7% 0.004 67.625)"
  border: "oklch(95.5% 0.002 67.804)"
  input: "oklch(87.8% 0.004 67.777)"
  ring: "oklch(25% 0.005 67.7)"
  destructive: "oklch(48.6% 0.156 28.366)"
  chart-1: "oklch(25% 0.005 67.7)"
  chart-2: "oklch(37% 0.005 67.7)"
  chart-3: "oklch(49% 0.005 67.7)"
  chart-4: "oklch(78.4% 0.008 67.713)"
  chart-5: "oklch(88.6% 0.004 67.772)"
  leaf: "oklch(76.5% 0.177 163.223)"
  leaf-ink: "oklch(50.8% 0.118 165.612)"
  sun: "oklch(82.8% 0.189 84.429)"
  sun-ink: "oklch(55.5% 0.163 48.998)"
  coral: "oklch(71.2% 0.194 13.428)"
  coral-ink: "oklch(51.4% 0.222 16.935)"
  iris: "oklch(70.2% 0.183 293.541)"
  iris-ink: "oklch(49.1% 0.27 292.581)"
  lime: "oklch(84.1% 0.238 128.85)"
  lime-ink: "oklch(53.2% 0.157 131.589)"
  sky: "oklch(74.6% 0.16 232.661)"
  sky-ink: "oklch(50% 0.134 242.749)"
  peach: "oklch(75% 0.183 55.934)"
  peach-ink: "oklch(47% 0.157 37.304)"
typography:
  heading:
    fontFamily: Geist Serif
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: Geist Serif
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: Geist
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Geist
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4286
  label:
    fontFamily: Geist
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4286
  caption:
    fontFamily: Geist
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3333
rounded:
  sm: "14.4px"
  md: "19.2px"
  lg: "24px"
  xl: "33.6px"
  2xl: "43.2px"
  3xl: "52.8px"
  4xl: "62.4px"
  control: "9999px"
  full: "9999px"
omitted:
  - section: spacing
    reason: "Tailwind's default 4px scale; the rules for using it are under Layout & Spacing"
  - section: components
    reason: "Each component's states live in components/ui; the rules are under Components"
---

# Design language

Read this before adding or changing anything a visitor sees, and build in it.
The values live in `app/globals.css`; the front matter above is generated from
that file by `npm run design`, so edit the CSS and run it — never the front
matter. Below are the rules for using the values, in twelve sections: the first
eight are what a component needs to look right, the last four what a page needs
to not look templated.

## Overview

Bright and almost colourless. Surfaces are five near-whites that separate by
tint rather than by borders or heavy shadow. Controls are pills, containers are
generously rounded, and density is airy. One vivid brand hue is spent at full
strength on a control's chosen state and the primary button, and nowhere else.
The feeling is calm and friendly without turning cute: friendly from the radius
and the air, precise from the restraint in colour and type.

Every token and component below is drawn live at `/design-system`, in every
state; a control a page needs is taken from there, and one it lacks is added
there first.

<!-- fill: the stance — who this demo is to its user, in one sentence, and the voice it gives every string; then one sentence telling a buyer to write their own product's in its place, so a new page keeps one voice -->

<!-- fill: the signature move — what this template is remembered by, where it appears, and how a new section carries it — in two or three sentences -->

## Colors
<!-- axis: colors -->

- **Surfaces are a ladder, measured below the page.** `bg-card` and `bg-popover`
  are the one step above it; `bg-background` is the page; then `bg-accent` (the
  whisper surface: rails, table headers, inputs), `border`, `bg-muted` (resting
  rows, chips, secondary buttons) and `bg-secondary` (the deepest well). A raised
  element is one step lighter than its parent.
- **Nothing sits on its own colour.** A chip, an input or a secondary button is
  at least one step away from what is behind it. A white card on the page needs a
  hairline — the two differ by almost nothing.
- **A section band is `bg-accent` or `bg-foreground`**, drawn at the container's
  width, never two in a row.
- **The brand hue has a token for every strength.** `bg-action
  text-action-foreground` for the primary button — this template's action
  style, kept when the hue turns, and by default the fill itself, so the button
  and the chosen states beside it are one colour. `bg-primary
  text-primary-foreground` for a control's chosen state — checked, picked,
  selected, the filled part of a bar, a light box — bright where the hue allows. `text-primary-ink` for brand-coloured text,
  links, focus and thin outlines, never a fill: as one it reads heavy and dated.
  `bg-chip` for a tinted disc or chip. `--chart-1..3` for an ordered series.
  `brand-art` and `brand-art-soft` for gradient art inside a card.
- **Seven accent colours tell peers apart:** leaf, sun, coral, iris, lime, sky, peach. A
  chip or badge is `bg-{hue}/15 text-{hue}-ink`; a full `bg-{hue}` fill is for a
  set — a bento, a pie, a row of crests — and never carries its own ink. Leaf
  means done and coral a problem; a rating is sun.
- **Two ink levels, never three.** `text-foreground` and
  `text-muted-foreground`. Lowering ink with opacity drops it under 4.5:1.
- **Colour rides the glyph, not the label.** A status dot or ring beside an ink
  label, never coloured text.

<!-- budget:colors -->
- The brand hue, and one accent-colour decision a page — a set of peers drawn one hue each is one decision.
- The signal colour is `leaf` (Tailwind emerald): outside a chip, a set and an ornament, it and the brand are the page's only colours.
- Accent colours in use: `leaf` (emerald), `sun` (amber), `coral` (rose), `iris` (violet), `lime` (lime), `sky` (sky), `peach` (orange) — no other.
- At least one saturated moment on every page that sells: gradient art, a photograph or a tinted band; an app screen, such as a dashboard or a checkout, is exempt.
<!-- /budget -->

## light-dark
<!-- axis: light-dark -->

- **Both halves ship, and the site opens light.** `next-themes` puts `dark` on
  `<html>` when the visitor presses `ModeToggle` in the header, and remembers it.
  To follow the visitor's system setting instead, set `enableSystem` and
  `defaultTheme="system"` on the provider in `app/layout.tsx`.
- **The dark half is its own ladder, in the `.dark` block of `globals.css`.**
  Every surface sits a step *above* a near-black page — the card nearest, then
  the tint, the hairline, the resting row and the deepest well — so the same
  classes (`bg-card`, `bg-muted`, `hover:bg-accent`) are right in both halves.
- **Read the tokens; never paint the dark half by hand.** No `dark:bg-…` or
  `dark:text-…` on a component: the `.dark` block already carries every colour.
  A `dark:` that changes what is shown — `dark:hidden` on a logo, `dark:invert`
  on a monochrome mark — is fine.
- **Chips keep their class string.** `bg-{hue}/15 text-{hue}-ink` reads a lighter
  ink in the dark half on its own.

## Typography
<!-- axis: typography -->

- **Two faces at most.** `font-sans` for body, `font-heading` for headings —
  often the same face. `font-mono` only over machine text: a timestamp, an ID, a
  URL, code. Never on a label, an eyebrow or a button.
- **Two weights.** Normal and `font-medium`, and from `text-3xl` up the weight
  comes off entirely.
- **Sized by how a line is read.** 16px is body copy. 14px is a product
  object's data and a one-line meta line. 12px is a caption of a few words, and
  an eyebrow, which is `Eyebrow`: `text-xs uppercase tracking-widest
  text-muted-foreground`. A section heading is `SectionHeading`: 30, 36 from
  `sm`, 48 from `lg`.
- **Two to three sizes in a block, three to four across a section.** The lede
  under a heading is `Lede`, at `text-base`.
- **Stay on the Tailwind scale.** An arbitrary size only above 36px, in even
  pixels. Leave `leading-*` and `tracking-[…]` off: both are bound to the face in
  `globals.css`.
- **Hierarchy inside a line comes from weight and ink, not size:**
  `**Thursday**, 5 February` — medium foreground, then normal muted, one size.
- **`tabular-nums`** on times, durations, prices, counts and IDs.
- **A page holds under every preset.** The presets at the end of `globals.css`
  swap both faces and their rows, so a component names `font-sans` or
  `font-heading` and never a family, and a heading is worded to survive a wider
  face.

## Layout & Spacing
<!-- axis: spacing-scale -->

- **Airy.** Padding and row height run about 1.4× a dashboard. Space around a
  group always exceeds the space within it.
- **A control is 40px tall** (`h-10`), never under 36; 44 for a section's one
  call to action. Its inline padding is half its height and is set on the
  Button's `size`, never at the call site.
- **Sections carry no vertical padding.** One `gap-32 sm:gap-40` on `<main>`
  spaces them, and a `Divider` marks a boundary. The gutter is `px-6 sm:px-8`.
- **Content spans a column grid** — 4 columns, 8 from `md`, 12 from `lg`, with a
  16/24/32px gap — through `column-grid` and `col-span-*`. A split is `6+6`
  until the content argues for `5+7`; a row of cards spans the grid at its
  outer edges and keeps its own tighter gap inside.
- **A section's header block clears its content by `mt-head`** (48px, 64 from
  `sm`), the same in every section.
- **Give things a `max-w-*`, not a percentage.** Prose runs 45–75 characters.
- **Every tap target clears 40px**, and nothing spills sideways at 390px.
- **Every side is start or end** — `ms-*`, `ps-*`, `inset-s-*`, `text-start`,
  `rounded-s-*`, `border-s` — so the page also lays out right to left. A side
  kept on purpose, a map pin or a media control, says `// physical: <why>`; a
  translate or a gradient's direction says what it does under `rtl:`.

## icons
<!-- axis: icons -->

- **HugeIcons, stroke-rounded,** from `@hugeicons/react` and
  `@hugeicons/core-free-icons`: 16px at stroke 1.5 beside text, 18px leading a
  nav row, 12px at stroke 2 inside a chip.
- **Heroicons for four glyphs:** arrows, chevrons and play/pause from
  `24/outline` at `size-4`; a rating star from `24/solid`.
- Never a third family, and never an emoji standing in for an icon.

## Shapes
<!-- axis: shape-effects -->

- **`rounded-control` on everything interactive** — buttons, inputs, chips,
  tabs. `rounded-lg` on containers, `rounded-sm` on rows inside a card,
  `rounded-full` only on true circles. A nested corner is concentric: the
  parent's radius is the child's plus the padding between them. A card's
  photograph sits 6px inside its edge, 4px on a small card, never flush.
- **One depth cue, never two.** A resting card takes a hairline (`border`).
  Something that has left the surface — a dropdown, popover, modal, dragged item —
  takes `shadow-soft-lg`; a raised control `shadow-soft`; Tailwind's own scale,
  thinned (`shadow-xl/20`), where neither reaches. The soft pair draws its own
  ring, so no border beside it; a stock shadow takes a quiet hairline.
- **A card's edge carries its hairline and nothing else** — no coloured bar
  across the top, no stripe down a side.
- **The presets move both radius seeds**, so a corner is `rounded-control` or a
  `rounded-*` step, never a pixel value.

## Components
<!-- axis: component-states -->

The kit, generated by `npm run design` from each file's first line:
<!-- kit -->
- **Accordion** `components/ui/accordion.tsx` — a list of questions that open one answer at a time, ruled by hairlines or with the open row on a tint, numbered when the order means something.
- **Avatar** `components/ui/avatar.tsx` — a person's face at four sizes, their initials on the brand's tint until it loads, a status badge, and a group with a count of the rest.
- **Badge** `components/ui/badge.tsx` — a status or price chip, a hue's tint under its own ink on a card, a pastel surface or a photograph; and CountBadge, the count that rides a control's corner.
- **Breadcrumb** `components/ui/breadcrumb.tsx` — the trail above a detail page's title, one link per step back and the page itself marked, published as structured data from the same list.
- **Button** `components/ui/button.tsx` — every call to action and every command on the site: six variants, three heights, and a loading state that keeps its label.
- **Calendar** `components/ui/calendar.tsx` — a month to pick a day or a stay from, the days that cannot be had struck through.
- **CardCorner** `components/ui/card-corner.tsx` — the arrow disc in a link card's corner that comes in when the card is hovered or its link is reached by keyboard, saying the whole card goes somewhere.
- **CarouselNav** `components/ui/carousel-nav.tsx` — the previous and next arrows of a sideways rail: disabled at its ends, a page per press, and not drawn when nothing overflows.
- **Checkbox** `components/ui/checkbox.tsx` — a box ticked to agree or to turn one option of many on, alone or with its sentence, a note and an error.
- **DatePicker** `components/ui/date-picker.tsx` — a field that opens presets beside a month; picking either fills the field and closes it.
- **Dialog** `components/ui/dialog.tsx` — a panel a visitor opens on purpose over the page: a sheet rising from the foot of a phone, centred from `sm`, with a header, a scrolling body and a footer.
- **DotTabs** `components/ui/dot-tabs.tsx` — a short vertical list of tabs beside the figure it switches, the current one in ink with a filled dot, the rest muted with a hollow one.
- **Drawer** `components/ui/drawer.tsx` — a sheet that slides in from any edge and is swiped away: snap points, a handle, and drawers stacked inside drawers.
- **EmptyState** `components/ui/empty-state.tsx` — what a list shows when there is nothing in it: a glyph, what emptied it, what to do, and the actions that bring results back.
- **FacetSelect** `components/ui/facet-select.tsx` — a filter pill that picks any number of one facet's options, each row counting the results it would leave.
- **FilterRail** `components/ui/filter-rail.tsx` — a row of pill chips that narrows a list, each with its count, in three dresses, scrolling sideways on a phone.
- **IconButton** `components/ui/icon-button.tsx` — one glyph as a control, a circle at the pill seed and a rounded square at a squared one, its spoken name required by its type.
- **LinkCard** `components/ui/link-card.tsx` — a card that goes to one page and presses across its whole face: the title's link stretched over it, its own controls standing above.
- **Map** `components/ui/map.tsx` — a live map on free tiles: price pins that gather when they meet and a card on a press, or the world with its cities.
- **Menu** `components/ui/menu.tsx` — a list of actions on one thing, opened from a button beside it: items, links, groups under a label, and separators.
- **NavigationMenu** `components/ui/navigation-menu.tsx` — the header's mega menu: a trigger in the bar opening a panel of grouped links, with the keyboard model of a site nav rather than of a menu.
- **Pagination** `components/ui/pagination.tsx` — the numbered pages of a result set: seven slots at most, the page on show marked, and the end arrows drawn disabled.
- **PasswordField** `components/ui/password-field.tsx` — a masked TextField with Show on its label line and, where a password is being chosen, a four-step strength meter.
- **Price** `components/ui/price.tsx` — an amount of money as every page prints it: the figure in its currency and locale, a muted unit after it, cents only under ten, and Free at zero.
- **Progress** `components/ui/progress.tsx` — how far along something is, a label and its value over a bar that fills from the start: a booking's steps, a host's profile, a course.
- **QuantityStepper** `components/ui/quantity-stepper.tsx` — a number typed or stepped with − and +, held to its range and snapped to its step.
- **RadioTiles** `components/ui/radio-tiles.tsx` — a pick-one choice drawn as tiles, each a title with an optional line, glyph and price, in a list or a grid.
- **railFade** `components/ui/rail-fade.ts` — a sideways rail fades the edge that has more past it, so a cut tab reads as one that scrolls rather than one that is broken.
- **RangeFilter** `components/ui/range-filter.tsx` — a range picked over where the results sit: a histogram on a two-thumb slider, typeable ends, quick picks and the count it leaves.
- **Rating** `components/ui/rating.tsx` — a score out of five drawn as stars, the next star filled to the score's fraction, and read out as one image.
- **SaveToggle** `components/ui/save-toggle.tsx` — the heart that keeps a listing on a visitor's list: a disc on a photograph, a heart and its count in a card's footer, or a labelled Save pill.
- **SearchField** `components/ui/search-field.tsx` — a search box whose list suggests as it is typed into, grouped by kind, with trending searches while it is empty.
- **Segmented** `components/ui/segmented.tsx` — a few options in one track, the pick lifted, brand-filled or framed; switches a panel as tabs or sets a value as radios.
- **Select** `components/ui/select.tsx` — the one dropdown: a trigger dressed by variant for the ground it stands on, over a list that opens on its value.
- **ShareMenu** `components/ui/share-menu.tsx` — a share button whose menu sends a listing's link: a preview of what is shared, Copy link, mail, messages, four networks and the device's own sheet.
- **Skeleton** `components/ui/skeleton.tsx` — the resting shape of content still on its way: a block on the muted rung with a slow pulse that stops under reduced motion.
- **Slider** `components/ui/slider.tsx` — one value or a range on a rail: a label and its reading above, 24px white thumbs ringed in the light brand under the pointer, a value bubble on a range.
- **SlotPicker** `components/ui/slot-picker.tsx` — days and the open times on each, booked from one button that says what it books.
- **StoryBars** `components/ui/story-bars.tsx` — the run of bars under a spotlight that turns over on its own: one bar a slide, the one on show filling, held by focus, off screen, a hidden tab or a pause.
- **Switch** `components/ui/switch.tsx` — an on/off setting that takes effect the moment it is pressed, sized for a form row or a line of small print.
- **TextField** `components/ui/text-field.tsx` — the one box a person types into: its error or counter on the label line, a hint under, slots at both ends.
- **Toast** `components/ui/toast.tsx` — one short notice at a time at the foot of the screen for what a press just did, announced politely, dismissed by its close, a swipe or its own clock.
- **ToggleButton** `components/ui/toggle-button.tsx` — a labelled two-state control such as Follow or Compare: pressed shows a check and swaps the fill, in a quiet or a lead tone.
- **Tooltip** `components/ui/tooltip.tsx` — a few words of ink over an icon-only control, shown on hover and on keyboard focus; never the only place something is said.
- **useRail** `components/ui/use-rail.ts` — the state a sideways rail's arrows read: which ends it has reached, a step of one page either way, and whether it overflows at all.
<!-- /kit -->

- **Every control has six states:** rest, hover, pressed, `focus-visible`,
  disabled, and loading where it fetches or submits. Every list has an empty
  state and every form an error state.
- **Hover moves one step on the ladder.** A filled control shades itself
  (`bg-primary/80`, the primary button `bg-action-hover`); a toggle that is on
  hovers as on, not as off.
- **Pressed:** a control takes `press` and sinks 3%; anything larger — a card
  link, a row — moves its fill one step below its hover with `active:bg-*`.
- **Disabled is lower ink**, not lower opacity, and never dims a focus ring: a
  focus ring, and a state shown by a mark alone — a pick frame, a tick —
  clears 3:1, so the brand rings in `primary-ink`, and a bright fill under 3:1
  carries a state only beside a cue that clears it: a tick, the label's ink
  and weight, a number.
- **Every edge has one job:** focus is `outline-2 outline-offset-2
  outline-ring`; a control's resting hairline is `ring-1 ring-inset
  ring-input`, and its hover moves that ink; a pick is `ring-2 ring-inset` in
  `--frame-ink`, the brand's ink, at every pick the kit draws; invalid is
  `ring-2 ring-inset ring-destructive`; a `border` is a divider or a
  checkbox's own edge. Whole pixels only.
- **One component each:** every control comes from `components/ui/` and is
  drawn on `/design-system` in every state — every dropdown the Select, every
  range the Slider, the mobile menu the Drawer, every call to action a `Button`
  variant with its icon inside. Its `variant` and `size` dress it, and its call
  site only places it — a margin, a grid span, the width of its slot. A control
  or a look the kit lacks is added there before a page uses it. Hoverable
  neighbours never touch.
- **A card that goes to a page is one target:** its title link stretches over
  it (`after:absolute after:inset-0`), its other controls sit `relative z-10`.
- **A sideways rail fades the edge with more past it** — a tab rail, a chip
  row, a card rail — over 2.5rem, and keeps an edge at its end sharp:
  `railFade` on the scroller and `useRailFade` on its ref, from
  `components/ui/rail-fade.ts`.

## motion
<!-- axis: motion -->

- **Every length and curve is a token:** `duration-answer ease-answer` for the
  page answering a pointer, `-spring` for a release or a menu opening, `-sheet`
  for a drawer, `-morph` for the header, `-arrive` for the reveal. A bare
  `transition-*` already reads `answer`. Never a number.
- **The pointer gets the motion, not the scroll.** A quiet `<Reveal>` on two or
  three sections at most; nothing parallaxes, pins or scrubs.
- **Transform and opacity only**, and the page is complete with motion reduced.

<!-- budget:motion -->
- At most one thing moves on its own a page. At most one of them is a shader.
<!-- /budget -->

## sections
<!-- axis: sections -->

- **Every section carries one point of interest past its words** — a picture, a
  figure, a drawn detail, a control that does something.
- **A large image in a marketing section carries a fragment of the product**
  layered over it — a state, a number, a rating, a message the product would
  send — each on its own surface with `shadow-soft-lg`, clear of the subject's
  face. Not on a grid of cards from a CMS.
- **The parts every section repeats are components already** — `Eyebrow`,
  `SectionHeading`, `Lede`, `Button` — and the second use of anything else
  makes one. Reuse the header, the footer and `Divider` rather than drawing new
  ones.
- **Alike items do one job.** Tiles drawn alike are worth the same press; a row
  of peers on pastel wears a hue each, no two neighbours alike.

## ornaments
<!-- axis: ornaments -->

- **Something on the page is drawn**: a dashed connector, a dot grid fading at
  one edge, gradient art inside a card, crop marks, a slight tilt. One or two a
  section where its shape asks for one; no page owes any.
- **Every ornament is drawn in one hand**, so a new one sits with the rest:
<!-- fill: the ornament hand — the stroke weight, the cap, the corner and the colour roles every ornament here is drawn in — in one or two sentences -->
- **An ornament is decoration**: `aria-hidden="true"` and `pointer-events-none`.
  Ornaments may spend colour; chrome may not.

## imagery
<!-- axis: imagery -->

- **Real photographs, framed.** A fixed aspect on the frame and `object-cover`
  on the image; never stretched, never a placeholder meant to be swapped later.
- **Logos are ink:** flat `text-muted-foreground`, sized by height with a
  capped width, no box around each — the six marks in `public/logos/`.
- **A photograph beside a form is a tile**, never the ground the form sits on.

<!-- fill: the photography direction this template was shot to — subject, light, frame, palette — in two or three sentences -->

<!-- budget:imagery -->
- No more than 3 sections in a row without a large picture, and a real photograph on every page.
<!-- /budget -->

## copy
<!-- axis: copy -->

- **Real copy in the product's own language.** No lorem, and no sentence that
  says nothing.
- **A section heading runs ten words at most**; a caption or a stat label two
  lines.
- **The last line of a wrapped block runs at least two thirds of the longest**,
  and blocks in a row end on the same line — fixed in the words first, with
  `text-balance` for a heading, copy that changes after it is written, or a
  short centred block.
- **A button names its action**, and the same action keeps the same name across
  the page.
- **Every number, price, date, time and unit is formatted by `lib/format.ts`**,
  never by a locale typed into a component, so the site moves to another
  market in that one file.

## Do's and Don'ts

Four are drawn with the kit at `/design-system#dos-donts`, each beside the way a
page gets it wrong:

- Do take the Select as the kit gives it, dressed by its `variant` and `size`;
  never reshape it with a class or a label typed before its value.
- Do draw a pick as a 2px inset frame in the brand's ink (`--frame-ink`); never
  a 1px frame in the bright fill or an outline.
- Do spend the brand at full strength on the primary button (`bg-action`) and a
  control's chosen state (`bg-primary`) alone; never as white text on a
  saturated block anywhere else.
- Do separate surfaces by one step of tint; never a border and a shadow on one
  element.

And the ones no picture shows:

- Do give every section a picture, a figure or a drawn detail.
- Don't use a gradient as a surface — a button, a nav, a section ground — or as a
  loose blurred wash.
- Don't add a third ink level, a third icon family or a second Select.
- Don't put a weight on display type or `font-mono` on chrome.
- Don't type a duration, a curve, a hex or a shadow into a class string.
