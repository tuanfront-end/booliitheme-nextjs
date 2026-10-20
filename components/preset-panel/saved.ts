// What the panel saves: a preset and a color, each "original" or the name of a
// block in app/globals.css, and — on a template written to read both ways — a
// direction. The same shape as preset.json.
export type Saved = { preset: string; color: string; direction?: Direction };
export type Direction = "ltr" | "rtl";

export const DIRECTIONS: Direction[] = ["ltr", "rtl"];

export const ORIGINAL = "original";

// Where the live demo keeps a visitor's picks. Nothing writes a file there, so
// they stay in the browser that made them.
export const STORAGE_KEY = "preset-panel";

// A name a block can carry. Checked before anything is written to <html>, to
// localStorage or to disk.
export const NAME = /^[a-z0-9-]{1,32}$/;
