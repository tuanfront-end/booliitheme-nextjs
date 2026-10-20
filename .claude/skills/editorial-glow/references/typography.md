# typography

Three faces with three jobs. The serif speaks, the grotesk explains, mono
reports.

## The serif — display

Instrument Serif, weight 400, leading 1.04, tracking −0.01em. It is condensed,
so a display line holds more words per line than a grotesk at the same size:
use that for one-line headings, not for bigger type.

| Role | Size | Notes |
|---|---|---|
| hero display | 48 → 64 (`sm`) → 72 (`lg`) | the page's one line at this size |
| `SectionHeading` | 36 → 44 (`sm`) → 48 (`lg`) | ten words at most |
| plan or product name set large | 36–44 | inside a panel cell |
| figure-label | 28–36 | a time, a date, a number named in words |

The serif's italic is one inline phrase at most — a word in a heading, the
"(Recommended)" beside a plan name — never a whole line. It is never bold,
never under 24px, never in a button, a label, a nav or body copy.

## The grotesk — everything read

Instrument Sans, and **14px is its size**. Titles, descriptions, list items,
buttons, tabs, chips, nav, footnotes — one size, ranked by weight and ink
instead of by size. A title is 14 at 500 in ink; the line under it is 14 at
400 in muted. Size steps are spent only where the role is not reading.

| Role | Size / leading | Weight |
|---|---|---|
| lede (under a section heading) | 16 / 1.5 | 400, muted |
| everything read: item title, description, list item, button, tab, chip, nav, field | 14 / 1.55 | 500 for a title, a button and a chosen tab; 400 elsewhere |
| eyebrow | 12, uppercase, tracking 0.04em | 500, `text-brand-ink`, after a 6px brand dot |
| footnote | 12 / 1.5 | 400, muted; the term it defines in ink |
| price figure | 40–48, tracking −0.02em | 600 — the only 600 on the page |
| price unit ("/Month") | 14 | 400, muted, on the figure's baseline |

## Mono — data

IBM Plex Mono for figures the product produced: yields, counts, versions, an
order number, a timestamp in a mock. Brand-coloured when set large, ink in a
table. Never for an eyebrow, a label, a nav item or a button.

## Rhythm

- A header block is eyebrow → 16px → heading → 8px → lede.
- A block below the header block reads at one size, 14; hierarchy inside it
  is weight and ink.
- Prose runs 45–75 characters. A lede holds one line at 1280.

## Floor

- The serif at 400 only, never under 24px, never on chrome.
- Every reading line in the grotesk is 14px, the lede 16; 600 only on a price.
- Mono only over machine text.
- The last line of a wrapped block runs two thirds of the longest at desktop
  (studio rule, `soft-neutral/references/copy.md`).
