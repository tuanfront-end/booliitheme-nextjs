# ornaments

Five kinds. A section carries one at most. Each is drawn in this project's own
hand — the shots in `refs/` show the kind and its job, never a shape to copy.

## Line art

A monochrome drawing in ink at 70%, 1–1.25px strokes, white or cell fills,
often isometric: a stack, a device, a building, a diagram of the product. At
most three brand marks inside it (a glyph on a key, a dot on a node). Drawn as
inline SVG, scaled with the cell.

## Skeleton mock

The product shown without its words: a card on paper with a real title line,
real figures (mono, brand), and every paragraph as hairline-grey bars of varied
length. Sits on a cell with a ground texture; may carry one floating control
(a chat field with `shadow-float`) overlapping its lower edge.

## Ground texture

Drawn in `--texture` on paper or cell, always masked to fade at its edges:

- vertical hairline stripes, ~21px apart (gru's hero);
- a dot or line grid (gru's illustration cell);
- concentric rings or arcs radiating from a corner (gru's mock ground).

A ground texture is the quietest ornament; it sits on paper or the cell, never
under copy.

## Data dial

A real visualisation used as the section's figure: a clock face, a gauge, a
timeline arc. Ticks in brand, the lit segment in `brand-soft`, numerals in a
light oblique. Cropped by the viewport on one side; a hairline leader runs from
its pointer to a serif label and a two-line explanation. It shows true data
from the page (times, steps, counts), never decoration with numbers on it.

## Fading rail

A single row of chips or icon-plus-label items that runs off its container and
fades to paper with a mask (`mask-image: linear-gradient(to right, #000 60%,
transparent)`). Drifts at notch 1+ (`motion.md`). Says "and more" without a
"+12 more" label.

## Floor

- One ornament per section.
- Every ornament is the project's own drawing; nothing traced from `refs/`.
- Ornaments are `aria-hidden` unless they carry data; a data dial has a text
  equivalent beside it.
