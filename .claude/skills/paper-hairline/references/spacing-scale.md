# spacing-scale

White is the material. A section spends more space around its blocks than the
reference's density suggests, then removes.

| Gap | Value |
|---|---|
| page gutter | 24 (390) → 48 (`md`) → 112 (`xl`), content max 1280 |
| between sections | 128 → 160 (`lg`) |
| header block → its panel or figure | 64 → 96 (`lg`) |
| eyebrow → heading → lede | 16 → 8 |
| panel cell padding | 32 → 40 (`lg`) |
| icon → item title (inline) | 12; title → line 4 |
| a list of footnotes under a panel | 24 above, 4 between |

Sections carry no vertical padding of their own; the page's stack sets the gap,
so two sections never double it.

A header block is left-aligned on the content's left edge. A figure may break
the gutter — cropped by the viewport's edge, as gru's dial is — but copy never
does.

Controls follow the studio's sizes: 40px tall, 44 for a section's one call to
action; inline padding 16 / 20 / 24 on the size variant.

## Floor

- No section reads cramped at 1280: every header block has its 64px+ to the
  content.
- Copy stays inside the gutter at every width from 320; only figures may
  crop.
- A hit area is 40px or more.
