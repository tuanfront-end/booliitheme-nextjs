---
version: alpha
name: booliitheme
colors:
  background: "#ffffff"
  foreground: "#1b0a08"
  card: "#ffffff"
  card-foreground: "#1b0a08"
  popover: "#ffffff"
  popover-foreground: "#1b0a08"
  primary: "#1b0a08"
  primary-foreground: "#ffffff"
  primary-ink: "#1b0a08"
  action: "#1b0a08"
  action-foreground: "#ffffff"
  action-hover: "#3a2d2b"
  secondary: "#f7f5f4"
  secondary-foreground: "#1b0a08"
  muted: "#fbfaf9"
  muted-foreground: "#6b605e"
  accent: "#f7f5f4"
  accent-foreground: "#1b0a08"
  border: "#e8e6e6"
  input: "#e3e0df"
  ring: "#e72887"
  destructive: "#c4291c"
  chart-1: "#1b0a08"
  chart-2: "#6b605e"
  chart-3: "#b4acaa"
  chart-4: "#e72887"
  chart-5: "#e8e6e6"
  primary-top: "#524c4b"
  brand: "#e72887"
  brand-ink: "#c41a6b"
  brand-soft: "#f8bedb"
  brand-wash: "#fdeff6"
  texture: "#f2f0ef"
typography:
  heading:
    fontFamily: Instrument Serif
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: Instrument Serif
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: Instrument Sans
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Instrument Sans
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4286
  label:
    fontFamily: Instrument Sans
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4286
  caption:
    fontFamily: Instrument Sans
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3333
rounded:
  sm: "7.2px"
  md: "9.6px"
  lg: "12px"
  xl: "16.8px"
  2xl: "21.6px"
  3xl: "26.4px"
  4xl: "31.2px"
  control: "10px"
  full: "9999px"
omitted:
  - section: spacing
    reason: "Tailwind's default 4px scale; the rules for using it are under Layout & Spacing"
  - section: components
    reason: "Each component's states live in components/ui; the rules are under Components"
---

# Design language

Read this before adding or changing anything a visitor sees, and build in it.
This template runs on the Paper Hairline language.
The values live in `app/globals.css`; the front matter above is generated from
that file by `npm run design`, so edit the CSS and run it — never the front
matter. Below are the rules for using the values, in twelve sections: the first
eight are what a component needs to look right, the last four what a page needs
to not look templated.

## Overview

A page like a well-set report. Paper white from top to bottom, a warm
near-black ink, and a grey that is that ink thinned. Display lines are a
condensed serif at regular weight; everything read is one quiet sans at one
size, 14px, ranked by weight and ink. Structure is drawn, not tinted: content
sits in panels outlined by a 1px hairline, and a panel's cells share their
dividers. One brand hue is spent in marks only — an eyebrow, an icon, a figure,
the chosen plan — and every ground is flat. The primary button is the ink, made
pressable by a faint gradient and a lit top edge.

Every token and component below is drawn live at `/design-system`, in every
state; a control a page needs is taken from there, and one it lacks is added
there first.

<!-- fill: the stance — who this demo is to its user, in one sentence, and the voice it gives every string; then one sentence telling a buyer to write their own product's in its place, so a new page keeps one voice -->

<!-- fill: the signature move — what this template is remembered by, where it appears, and how a new section carries it — in two or three sentences -->

## Colors
<!-- axis: colors -->

- **Paper, everywhere.** `bg-background` is the page, and `bg-card` and
  `bg-popover` are the same white: a surface separates by its hairline
  (`border`), never by a fill. `bg-muted` is the cell — an illustration's cell,
  a skeleton card, a hovered row — and the only quiet fill.
- **Two inks, never three.** `text-foreground` and `text-muted-foreground`,
  both solid. A quieter line is the muted ink, not a paler grey.
- **The action is the ink.** The primary button is `bg-action` drawn by
  `btn-ink` — a gradient from `--primary-top` and a lit top edge. The brand hue
  never fills a button, a band or a card.
- **The brand hue is a mark.** `text-brand` on an icon, a dot or a figure from
  24px; `text-brand-ink` on small brand text, which is what clears 4.5:1;
  `bg-brand-wash` on the chosen cell; `brand-soft` on a lit arc or a
  selection; `--ring` is the brand. Change `--brand` in `app/globals.css` and
  the whole page follows.
- **Categories are told apart by icon and label, not hue.** The kit's seven
  accent names (`leaf`, `sun`, …) are kept so nothing breaks, and all read the
  ink — except `leaf`, the page's signal, which is the brand.

<!-- budget:colors -->
- The brand hue on eyebrows, feature icons, data figures, the chosen item and its cell's wash, lit segments and the focus ring — always a mark, never a fill.
- Every ground is flat: no gradient behind a section, a cell or a figure. The primary button's own gradient is the one on the page.
- One saturated hue on a page outside photographs.
<!-- /budget -->

## light-dark
<!-- axis: light-dark -->

- **Both halves ship, and the site opens light.** `next-themes` puts `dark` on
  `<html>` when the visitor presses `ModeToggle` in the header, and remembers it.
  To follow the visitor's system setting instead, set `enableSystem` and
  `defaultTheme="system"` on the provider in `app/layout.tsx`.
- **The dark half is the same page in low light**, in the `.dark` block of
  `globals.css`: paper becomes a warm near-black, ink becomes paper, the
  hairline stays a hairline, the primary button turns to paper with ink type,
  and the brand lifts so its marks and its text still clear their floors.
- **Read the tokens; never paint the dark half by hand.** No `dark:bg-…` or
  `dark:text-…` on a component. A `dark:` that changes what is shown —
  `dark:hidden` on a logo — is fine.

## Typography
<!-- axis: typography -->

- **Three faces, three jobs.** `font-heading` (Instrument Serif) for display;
  `font-sans` (Instrument Sans) for everything read; `font-mono` (IBM Plex Mono)
  for data figures only — a version, a count, a yield. Never mono on a label,
  an eyebrow or a button.
- **The serif is for display, at weight 400.** `h1`, `h2` and `.font-heading`
  wear it; `h3`–`h6` stay in the sans at 500. Never under 24px, never bold,
  never in a button or a nav. Its italic is one inline phrase at most.
- **14px is the reading size.** Titles, descriptions, list items, buttons,
  tabs, chips and nav are all `text-sm`, ranked by `font-medium` and ink rather
  than by size. The lede under a section heading is 16px; an eyebrow and a
  footnote are 12px. A price figure is the one 600 on the page.
- **A section heading is `SectionHeading`**: 36, 44 from `sm`, 48 from `lg`;
  a hero line 48, 64, 72.
- **`tabular-nums`** on times, durations, prices, counts and IDs.
- **A page holds under every preset.** The presets at the end of `globals.css`
  swap the display face only, so a heading is worded to survive a wider serif.

## Layout & Spacing
<!-- axis: spacing-scale -->

- **White is the material.** Space around a group always exceeds the space
  within it, and a section's header block clears its content by 64–96px.
- **A control is 40px tall** (`h-10`), never under 36; 44 for a section's one
  call to action. Its inline padding is set on the Button's `size`, never at
  the call site.
- **Sections carry no vertical padding.** One gap on `<main>` spaces them,
  128px, 160 from `lg`.
- **A header block is left-aligned** — eyebrow, serif heading, one line of
  lede — unless the section's figure is centred under it.
- **Content spans a column grid** — 4 columns, 8 from `md`, 12 from `lg` —
  through `column-grid` and `col-span-*`. A split is unequal (`5+7`, `4+8`), and
  a figure may crop off the viewport's edge; copy never does.
- **Give things a `max-w-*`, not a percentage.** Prose runs 45–75 characters.
- **Every tap target clears 40px**, and nothing spills sideways at 390px.
- **Every side is start or end** — `ms-*`, `ps-*`, `inset-s-*`, `text-start`,
  `rounded-s-*`, `border-s` — so the page also lays out right to left.

## icons
<!-- axis: icons -->

- **HugeIcons, stroke-rounded,** from `@hugeicons/react` and
  `@hugeicons/core-free-icons`, at stroke 1.5: 20px in the brand beside a
  feature title, 16–20px in ink or muted in chrome.
- **Heroicons for four glyphs:** arrows, chevrons and play/pause from
  `24/outline` at `size-4`; a rating star from `24/solid`.
- Line icons only, one colour each; never a filled glyph in a coloured disc,
  never an emoji standing in for an icon.

## Shapes
<!-- axis: shape-effects -->

- **Joined panels.** Items that belong together share one outlined box —
  `rounded-lg border overflow-hidden` — its cells divided by `divide-x` /
  `divide-y`. Four plans, six features, a figure beside a grid: one panel, not
  a row of floating cards.
- **12px on panels, cards and frames; 10px on controls** (`rounded-control`);
  `rounded-full` on chips, tags and true circles only. Never a pill button or
  a pill input. A nested corner is concentric.
- **Hairlines, not shadows.** A panel or a card takes its border and no
  shadow. `shadow-soft` (a hairline ring and the faintest lift) is for the
  secondary button and a pressable chip; `shadow-soft-lg` for what floats — a
  menu, a popover, a dialog.
- **Every ground is flat.** No gradient behind a section, a cell or a figure;
  the primary button's own is the one gradient on a page.
- **A card's edge carries its hairline and nothing else.**

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
- **A state changes ink, a hairline or a mark — rarely a fill.** The primary
  lightens its gradient on hover; the secondary's hairline darkens; a panel row
  hovers to the cell; a chosen cell takes the brand wash and a brand mark; a
  current tab is ink with a filled dot.
- **Pressed:** a control takes `press` and sinks 3%.
- **Disabled is lower ink**, not lower opacity. A focus ring, and a state shown
  by a mark alone, clears 3:1.
- **Every edge has one job:** focus is `outline-2 outline-offset-2
  outline-ring` in the brand; a resting hairline is `border` or `ring-1
  ring-inset ring-input`; invalid is `ring-2 ring-inset ring-destructive`.
- **One component each:** every control comes from `components/ui/` and is
  drawn on `/design-system` in every state. A control the kit lacks is added
  there before a page uses it. Hoverable neighbours never touch.
- **A card that goes to a page is one target:** its title link stretches over
  it (`after:absolute after:inset-0`), its other controls sit `relative z-10`.
- **A sideways rail fades the edge with more past it**, through `railFade`
  from `components/ui/rail-fade.ts`.

## motion
<!-- axis: motion -->

- **Slow and few.** A section reveals once on scroll; a fading rail of chips
  drifts at 40s a loop; a data dial sweeps to its value once. Hover and press
  answer in the `answer` tokens. Nothing loops faster than 20s.
- **Every length and curve is a token** — `duration-answer ease-answer`,
  `-spring`, `-sheet`, `-morph`, `-arrive` — never a number.
- **Transform and opacity only**, and the page is complete with motion reduced.

<!-- budget:motion -->
- Sections reveal once on scroll and a fading rail may drift; nothing loops faster than 20s.
<!-- /budget -->

## sections
<!-- axis: sections -->

- **Every section opens on its header block** and carries exactly one body: a
  joined panel, a figure, a split, or a list beside its figure.
- **No two neighbours share a body.** A panel section is followed by a figure
  section.
- **The parts every section repeats are components already** — `Eyebrow`,
  `SectionHeading`, `Lede`, `Button` — and the second use of anything else
  makes one.

## ornaments
<!-- axis: ornaments -->

- **Five kinds, one a section at most:** line art (a monochrome drawing at
  1–1.25px, often isometric); a skeleton mock (the product without its words,
  real figures in mono); a ground texture (hairline stripes, a dot grid,
  concentric rings, always faded at its edges); a data dial (a real figure
  cropped off the viewport, a leader to a serif label); a fading rail of chips.
- **Every ornament is drawn in one hand**, so a new one sits with the rest:
<!-- fill: the ornament hand — the stroke weight, the cap, the corner and the colour roles every ornament here is drawn in — in one or two sentences -->
- **An ornament is decoration**: `aria-hidden="true"` and `pointer-events-none`,
  unless it carries data, which then has a text equivalent beside it.

## imagery
<!-- axis: imagery -->

- **Photographs are framed objects.** A hairline frame at 12px or a panel's
  cell, a fixed aspect and `object-cover`; true colour, no tint over it, no
  gradient behind it; never full bleed and never a section's ground.
- **Logos are ink:** flat `text-muted-foreground`, sized by height, no box
  around each.

<!-- fill: the photography direction this template was shot to — subject, light, frame, palette — in two or three sentences -->

<!-- budget:imagery -->
- Every photograph sits in a hairline frame or a panel cell, in true colour, never full bleed and never a section's ground.
<!-- /budget -->

## copy
<!-- axis: copy -->

- **Real copy in the product's own language.** No lorem, and no sentence that
  says nothing.
- **Headings are short declaratives with a turn**, ten words at most; the lede
  is one sentence that makes the heading concrete.
- **An eyebrow names the section's job** in two to four words.
- **The last line of a wrapped block runs at least two thirds of the longest**,
  and blocks in a row end on the same line.
- **A button names its action**, and the same action keeps the same name across
  the page. A claim may carry a `*` or `†`, defined under its panel.
- **Every number, price, date, time and unit is formatted by `lib/format.ts`**.

## Do's and Don'ts

- Do draw a group as one hairline panel with shared dividers; never a row of
  shadowed cards.
- Do spend the brand as a mark — an icon, a figure, an eyebrow, the chosen
  cell; never as a button's or a band's fill.
- Do set every reading line at 14px and rank it by weight and ink; never a
  third size to make a title stand out.
- Do keep the serif for display at 400; never under 24px, never bold.
- Don't put a gradient behind anything; the primary button's is the only one.
- Don't add a third ink level, a third icon family or a second Select.
- Don't put `font-mono` on chrome.
- Don't type a duration, a curve, a hex or a shadow into a class string.
