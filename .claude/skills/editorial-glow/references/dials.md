# dials

Notches live in `.soft-neutral.json` (the file keeps its name because the
shared checkers read it). This style adds one key and redefines two.

```json
{ "house": "editorial-glow", "colour": 3, "motion": 1, "marketplace": false, "spelling": "us" }
```

- **`house`** — `"editorial-glow"`. The forked checkers read their rules from
  it; a file without it is a Soft Neutral project.
- `accents`, `signal`, `neutral` and `pastel` are Soft Neutral's and are absent
  here; `pastel` above 0 is an error.

## colour — how much brand and glow a page spends

| Notch | Brand marks | Glow |
|---|---|---|
| 0 | none — eyebrows and icons in ink | none |
| 1 | eyebrows, icons, focus | none |
| 2 | + data figures, the chosen item, lit segments | none |
| 3 (default) | as 2 | one, anchored |
| 4 | as 2 | two, in different sections |
| 5 | as 2 | one may become a field behind a whole hero figure (mymind's ring) |

## motion — how much moves on its own

| Notch | What runs |
|---|---|
| 0 | hover and press only |
| 1 (default) | + section reveals, the fading rail |
| 2 | + glow drift, a data dial's sweep |
| 3–5 | reserved; a brief asking for more motion is a taste call for the user |

## marketplace and spelling

Unchanged from the studio: `marketplace` raises the shipping floors, `spelling`
picks US or UK copy.

## Floor

- `house` is set and the notches above are the ones the page spends.
