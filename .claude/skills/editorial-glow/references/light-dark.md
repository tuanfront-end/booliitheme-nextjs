# light-dark

Both halves ship; the page opens light (studio ADR 0025).

The dark half is the same page in warm low light, not an inverted one:

- Paper becomes `#130b0a`, a near-black with the ink's warmth; ink becomes
  `#f5f0ef`. Grey stays the ink thinned.
- The hairline stays a hairline: `#2e2423`, visible but quiet. Structure is
  still drawn, never filled.
- The primary button turns to paper: the gradient runs `#ffffff` → `#f5f0ef`
  with ink text, and keeps its lit top edge.
- The brand moves lighter (`#ff4fa0`, small text `#ff7ab8`) so marks hold 3:1
  and text 4.5:1 on dark paper.
- Line art swaps its stroke to the dark ink at 70%; skeleton bars become
  `--border`; textures use the dark `--texture`.

A photograph is the same file in both halves.

## Floor

- Every token in `setup.md` has a dark value; nothing reads light-on-light or
  dark-on-dark after the switch.
