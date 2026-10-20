# component-states

A state changes ink, a hairline or a mark — rarely a fill.

| Control | Rest | Hover | Chosen / current | Disabled |
|---|---|---|---|---|
| primary button | ink gradient, lit edge | `--primary-top` one step lighter, arrow nudges 2px | — | 40% opacity, no shadow |
| secondary button | paper, hairline, lift | hairline → ink at 20% | — | muted ink, no lift |
| text link | ink, no underline | underline, 1px, offset 4 | — | — |
| vertical tab (gru's list) | muted ink, hollow 6px dot | ink | ink, filled ink dot | — |
| segmented / filter | muted ink in a hairline track | ink | paper pill on the track with lift, ink | — |
| panel row / cell | paper | `bg-muted` | `bg-brand-wash` + brand mark | — |
| chip | hairline outline, muted | ink | ink fill, paper text | — |
| field | hairline | hairline → ink at 30% | focus ring | `bg-muted` |

**Focus** is a 2px `--ring` (brand) outline at 2px offset on every control, in
both halves.

**Pressed** on a button: translate 1px down, the lit edge drops to 15%.

Hover exists only on what can be clicked.

## Floor

- Every control has rest, hover, focus and disabled; the chosen state of a set
  is visible without colour alone (fill, weight or the dot).
- A current state shown by the dot alone clears 3:1.
- Focus is visible in both halves.
