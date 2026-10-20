import saved from "@/preset.json";

// The look this site is built with, from preset.json at the repo root. The
// preset panel writes that file while you run `npm run dev`, and it is plain
// JSON you can edit by hand. "original" is the template as designed and sets
// nothing; any other name points at a block at the end of app/globals.css.
//
// Read here and spread onto <html> in app/layout.tsx, rather than inside the
// panel, so the saved look survives the panel being deleted.
const look = saved as { preset: string; color: string; direction?: string };

// "rtl" lays every page out right to left. A template carries the key only once
// it is written to read both ways, so without it the page is left to right and
// says nothing.
export const direction = look.direction === "rtl" ? "rtl" : "ltr";

export const preset = {
  "data-preset": look.preset === "original" ? undefined : look.preset,
  "data-color": look.color === "original" ? undefined : look.color,
  dir: look.direction === undefined ? undefined : direction,
};
