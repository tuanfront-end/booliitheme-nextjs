# colors

Paper, two inks, the hairline, one brand hue and its glow. Values are in
`setup.md` § Tokens; this file is how they are spent.

## Paper and ink

The page is `bg-background` from header to footer, and so is every card and
panel on it. A surface separates by its hairline, never by a fill. The cell
(`bg-muted`) is the one exception, and it is small: the illustration cell of a
feature panel, a skeleton document, a hovered row.

Ink is warm near-black; grey is that ink at about two thirds. There is no third
ink: a quieter line uses `text-muted-foreground` at a smaller size, and an
inactive tab is muted ink beside a hollow dot, not a paler grey.

## The brand hue is spent in marks

A mark is small and says one thing:

- the eyebrow — a 6px dot and its label, `text-brand-ink`;
- a feature icon's stroke, `text-brand`;
- a data figure set large ("~80%+", "300,000"), `text-brand` from 24px up;
- the recommended or chosen item's word ("(Recommended)") and its column's
  `bg-brand-wash` fading to paper;
- the focus ring;
- a dial's or a chart's lit segment, `brand-soft` for the track.

The action is ink, never brand. A band, a card, a section ground or a button in
the brand hue is the wrong style.

Status colours: a product that must tell states apart uses ink for neutral,
`text-brand-ink` for the one state the product cares about, and `destructive`
for errors. Categories are told apart by icon and label, not by hue.

## The glow pair

The glow is the page's one mass of colour: a soft, grainy field running from a
warm neighbour of the brand hue into the brand hue itself.

Derived from `--brand` in OKLCH, so a new brand moves the glow with it:

| Stop | Hue | L | C |
|---|---|---|---|
| `--glow-warm` | brand − 40° | 0.78 | 0.11 |
| `--glow-mid` | brand − 15° | 0.71 | 0.13 |
| `--glow-cool` | brand + 5° | 0.73 | 0.11 |

At gru's `#e72887` that lands on peach, rose and pink. On a green brand it
lands on lime, leaf and teal — cartesia's shots show the system holding in a
hue far from pink.

How it is drawn is `ornaments.md` § Glow.

## Contrast without heaviness

- Body on paper: ink ≈ 18:1, muted ≈ 6:1.
- Brand `#e72887` on paper is 4.2:1 — fine for an icon, a dot or a figure at
  24px+, short of 4.5 for small text. Small brand text is `text-brand-ink`.
- Text never sits on the glow's strongest stop; the glow sits beside or behind
  a figure, and copy over its fade is checked where it lands.

## Floor

- No hex in a component; every colour is a token.
- One saturated hue on the page outside photographs.
- Brand never fills a control, a band or a card.
- Every text run clears 4.5:1 (3:1 at 24px+) where it actually sits, glow
  included.
