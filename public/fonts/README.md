# The six faces that are not in this folder

If you have just unzipped this template, this folder holds this file and
nothing else. That is deliberate, and one command fixes it:

```
npm run fonts
```

## Why they are not here

Six of the thirty faces this template can be set in come from
[fontshare.com](https://www.fontshare.com) — Satoshi, Switzer, Cabinet Grotesk,
Chillax, Erode and Melodrama. They are drawn and owned by the Indian Type
Foundry and released under the **ITF Free Font License**, which is free for
personal and commercial use, worldwide, forever, with no fee and no attribution
required.

What it does not allow is passing the files on. Section 02 rules out
distributing them "through another font website, font library, marketplace,
repository, download service, application or platform", and says any third
party who wants to use them "must obtain their own copy directly from
Fontshare". Shipping them inside a template sold on a marketplace is exactly
that, so they are not in the zip you bought and not in the repository.

`npm run fonts` downloads them from Fontshare to your machine, which is the
route the licence describes. You are then the licensee. The full text is at
<https://www.fontshare.com/licenses/itf-ffl>, and the script writes a copy to
`FFL.txt` beside the fonts. Read it before you launch a site on one of these
faces — it is short, and the only clause most people need is the one above.

The other twenty-four faces are SIL Open Font License, are loaded by `next/font`
from `app/layout.tsx` and `app/fonts/`, and travel with the template. Nothing
needs fetching to use those.

## What happens if you never run it

The template works. Every Fontshare face is declared in `app/globals.css` as a
two-name stack with an OFL face of the same register behind it, so a missing
file is a fallback rather than an error:

| Fontshare face | falls back to |
|---|---|
| Satoshi | Geist |
| Switzer | Schibsted Grotesk |
| Cabinet Grotesk | Bricolage Grotesque |
| Chillax | Poppins |
| Erode | Newsreader |
| Melodrama | Italiana |

Each pair was measured together, and their weight, tracking and leading rows
land within one step of each other — so an unfetched build is a finished page
in a slightly different voice, not a broken one. It will not match the preview
screenshots.

There is no `postinstall` hook doing this behind your back, on purpose: an
install should not reach out to a font foundry you did not ask it to.

## Choosing a different face instead

Set the page in an open-source face loaded by `next/font` in `app/layout.tsx`
and nothing needs fetching: you can delete `app/fontshare.css` and its `@import`,
the Fontshare stacks in `app/globals.css`, this folder,
`scripts/fetch-fonts.mjs` and the `fonts` script outright.
