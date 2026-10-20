// Prints a notice when a declared face has no file, then gets out of the way.
//
// Wired into `dev` and `build` rather than into a postinstall hook. The reason
// is coverage: `npm install` is run once and its output scrolls past, while
// `npm run dev` is the first thing anyone types and `npm run build` is what a
// deploy log shows — which is the only channel that reaches somebody who pushed
// straight to Vercel without running the site locally.
//
// It never fails the command. A missing font is a difference from the preview,
// not a broken build, and a template that refuses to start over one would be
// worse than the problem.

import { missingFetchedFaces } from "../lib/fetched-fonts.mjs";

const missing = missingFetchedFaces();
if (missing.length === 0) process.exit(0);

// Colour only for a terminal that asked for it. A deploy log is not a TTY, and
// the notice matters most there, so the text has to carry it on its own.
const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const bold = (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s);
const dim = (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s);
const rule = dim("─".repeat(66));

const names = missing.map((face) => face.family).join(", ");
const count = missing.length === 1 ? "1 font is" : `${missing.length} fonts are`;

console.log(`
${rule}
  ${bold(`${count} missing, and the page will not match the preview.`)}

  ${names}

  These are free for any commercial use, but their licence does not
  allow them to be handed on — so they are not in this template, and
  you fetch your own copy in one command:

      ${bold("npm run fonts")}

  ${dim("Everything works without it: each face falls back to an open-source")}
  ${dim("one. Licence and detail — public/fonts/README.md")}
${rule}
`);
