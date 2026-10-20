# colors

Paper, two inks, the hairline and one brand hue. Values are in
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
- the recommended or chosen item's word ("(Recommended)") and its cell's flat
  `bg-brand-wash`;
- the focus ring;
- a dial's or a chart's lit segment, `brand-soft` for the track.

The action is ink, never brand. A band, a card, a section ground or a button in
the brand hue is the wrong style.

Status colours: a product that must tell states apart uses ink for neutral,
`text-brand-ink` for the one state the product cares about, and `destructive`
for errors. Categories are told apart by icon and label, not by hue.

## No gradient grounds

Every ground is flat: paper, the cell, or the chosen cell's `brand-wash`. A
gradient never fills a section, a panel, a cell or a figure's backdrop — no
glow, no wash fading to paper, no blurred field behind a product. Colour comes
from marks and from photographs, nothing else.

## Contrast without heaviness

- Body on paper: ink ≈ 18:1, muted ≈ 6:1.
- Brand `#e72887` on paper is 4.2:1 — fine for an icon, a dot or a figure at
  24px+, short of 4.5 for small text. Small brand text is `text-brand-ink`.

## Floor

- No hex in a component; every colour is a token.
- One saturated hue on the page outside photographs.
- Brand never fills a control, a band or a card.
- Every text run clears 4.5:1 (3:1 at 24px+) where it actually sits.
- No gradient on any ground.
