# editorial-glow — measurements

Taken 2026-10-20. CSS values are read from the live sites' computed styles;
values marked *px-sampled* are read off the shots in this folder (gru shots are
2× captures of a 1512-wide viewport). The live gru.ai is now a hero alone, and
its Wayback copy loads without its CSS, so every gru section below the hero is
px-sampled.

## gru.ai

| Role | Value | Source |
|---|---|---|
| ground | `#ffffff` | CSS |
| ink | `#1b0a08` (warm near-black) | CSS |
| muted text | ink at 65% (`rgba(27,10,8,.65)` ≈ `#6b605e`) | CSS |
| accent | `#e72887` — eyebrow dot and label, icons, figures, "(Recommended)" | CSS |
| accent tint | `#f8bedb` — the dial's lit arc | px-sampled |
| hairline | `#e8e6e6`, 1px — panel borders, dividers, skeleton bars | px-sampled |
| illustration cell | `#fbfbfb` with a faint grid | px-sampled |
| hero stripes | 1px vertical lines `#f8f7f7`, ~21px apart | px-sampled |
| glow, hero | `#f2a079` peach → `#e98099` rose → `#e292be` pink, grain | px-sampled |
| glow, pricing | column top `#fdeff6` fading to white by ~60%; blob `#fbe1e2`–`#fbebf3` | px-sampled |
| primary button | `linear-gradient(#524c4b, #1b0a08)`, 1px ink border, `inset 0 1px 0 rgba(255,255,255,.3)`, radius 10px (14px label) / 12px (16px label), label 500 | CSS |
| display | Instrument Serif 400, 48px / 1.04, tracking normal | CSS |
| body | Instrument Sans 400, 16px / 1.6; lede 18px / 1.36 | CSS |
| figures | IBM Plex Mono | CSS (`document.fonts`) |
| price | sans, bold, ~2× the plan name | px-sampled |

## mymind.com

| Role | Value |
|---|---|
| display | Louize (205TF, commercial) 32–38px, tracking −0.04em |
| body | Inter / Nunito 16–20px |
| ink / muted | `#000000` / `#4a5465`, `#748297` (cool greys) |
| accent | `#ff5924` orange |
| glow | warm shadows: `rgba(255,167,129,.44) 0 57px 60px -54px`, `rgba(255,128,36,.27) 0 -27px 50px -40px` |
| radius | pills 100px; cards 12–16px; large 36px |

## cartesia.ai

| Role | Value |
|---|---|
| display | PP Kyoto (commercial) 26px 500 |
| body | ABC Diatype (commercial) 14–20px, weights 400 / 465 / 500 |
| figures | IBM Plex Mono |
| ink / muted | `#1e1c1a` / `#525150` (warm) |
| hairline | `#e4e3db` (warm), drawn as a 1px ring shadow on controls |
| ground step | `#f9f9f8` |
| radius | 4 / 6 / 8px — tighter than gru |

## What the three agree on

- A white ground, warm near-black ink, muted text as ink at reduced alpha.
- One saturated accent; every other colour is a tint of it or a glow.
- Hairlines in a warm grey near `#e5e4e0`, 1px, as the main source of structure.
- A serif for display only; body in a neutral grotesk; IBM Plex Mono for figures
  on two of the three.
- Radius small to moderate (4–12px) on structure; pills only on chips.

The two non-gru display faces are commercial and cannot ship in a template.
