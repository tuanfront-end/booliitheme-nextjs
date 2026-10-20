# shape-effects

Structure is drawn with a 1px **hairline**; depth is almost absent.

## Joined panels

Items that belong together share one outlined box: `rounded-lg border
overflow-hidden`, its cells divided by `divide-x` / `divide-y` in
`border-border`. Four plans, six features, a figure beside a grid — one panel.
A row of separate floating cards is the other style.

A panel may give one cell a role: the **figure cell** (`bg-muted`, often with a
ground texture) holding an illustration or a mock; the **chosen cell**
(`bg-brand-wash` fading to paper by ~60% of its height, sometimes a glow behind
its figure).

## Radius

12 on panels, cards and frames; 10 on controls; 12 on the 44px button;
`rounded-full` on chips and tags only. Concentric when nested.

## Depth

- A panel or card: hairline only, no shadow.
- Something that floats over content: `shadow-float`, no border needed.
- The secondary button and a pressable chip: hairline plus `shadow-lift` —
  the one place a border and a shadow meet, because it is a control, not a
  surface.
- The primary button: its own recipe in `setup.md`.

## Grain

The glow carries a fine noise (an SVG `feTurbulence` at 3–5% opacity, or a
tiled noise PNG) so it reads as light, not as a CSS gradient. Grain lives on
the glow only.

## Floor

- Panels are outlined and unshadowed; their cells share dividers.
- No pill on a button or input.
- Nested radii are concentric.
