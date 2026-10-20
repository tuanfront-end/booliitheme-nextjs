# presets

The preset panel ships, as in every studio template; its mechanism — the
`preset.json` file, `data-preset` / `data-color` on `<html>`, every block
written twice in one selector list — is the studio's contract, unchanged. What
this style changes is what the presets hold.

## What a preset moves

The display face only. Body, mono, colours, radius, spacing and motion stay
the template's in every preset: the serif is where this style's character
lives, so it is the one thing worth showing a buyer three ways.

| Preset | Display | Body |
|---|---|---|
| Original (no attribute) | Instrument Serif | Instrument Sans |
| Condensed | Noto Serif Display, `font-variation-settings: "wdth" 70` | Instrument Sans |
| Fine | Boska 400 (Fontshare, fetched by the buyer) | Instrument Sans |

Each preset block sets `--font-heading` and its own display leading and
tracking (Noto Serif Display runs wider: tracking −0.02em, one step smaller on
the hero if a line breaks).

A page that breaks under a preset is fixed in the page — a heading reworded,
a line given room — never in the preset.

## The colour row

Original (the brand locked at the colour stop), the other brand candidates the
brand step offered, and Ink — the brand set to the ink itself, marks going
neutral grey. Blocks are written by `brand-hue`, never by hand.

## Floor

- Every page holds its layout under all three presets at 1280 and 390.
- Every colour block exists in both halves.
