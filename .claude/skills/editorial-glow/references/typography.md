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

Instrument Sans.

| Role | Size / leading | Weight |
|---|---|---|
| lede | 18 / 1.4 | 400, muted |
| body | 16 / 1.6 | 400 |
| item title (a feature, a row) | 18 / 1.35 | 500 |
| meta, button, nav | 14–16 | 500 for buttons, 400 elsewhere |
| eyebrow | 13, uppercase, tracking 0.02em | 500, `text-brand-ink`, after a 6px brand dot |
| price figure | 40–48, tracking −0.02em | 600 — the only 600 on the page |
| price unit ("/Month") | 16 | 400, muted, on the figure's baseline |
| footnote | 14 / 1.5 | 400, muted; the term it defines in ink |

## Mono — data

IBM Plex Mono for figures the product produced: yields, counts, versions, an
order number, a timestamp in a mock. Brand-coloured when set large, ink in a
table. Never for an eyebrow, a label, a nav item or a button.

## Rhythm

- A header block is eyebrow → 16px → heading → 8px → lede.
- One role, one size: two to three sizes in a block, three to four in a
  section.
- Prose runs 45–75 characters. A lede holds one line at 1280.

## Floor

- The serif at 400 only, never under 24px, never on chrome.
- Two weights of the grotesk in any block; 600 only on a price.
- Mono only over machine text.
- The last line of a wrapped block runs two thirds of the longest at desktop
  (studio rule, `soft-neutral/references/copy.md`).
