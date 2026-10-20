# motion

Slow and few. The `motion` notch (`dials.md`) decides how many of these run.

| Moment | Value | From notch |
|---|---|---|
| section reveal | fade + 12px rise, 600ms, `cubic-bezier(.2,.7,.2,1)`, once | 1 |
| fading rail (chips that drift and fade out) | 40s linear loop, paused on hover | 1 |
| hover / press on controls | 160ms ease-out | 0 — always |
| a tab's figure changing | crossfade 300ms, no slide | 0 |
| data dial | the hand sweeps to its value once on reveal, 1.2s | 2 |

Every looping or entering motion stops under `prefers-reduced-motion`; the end
state shows at once.

## Floor

- Nothing loops faster than 20s.
- Reduced motion leaves a complete, static page.
