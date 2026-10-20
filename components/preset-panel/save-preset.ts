"use server";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { DIRECTIONS, NAME, type Saved } from "./saved";

// Writes preset.json while you run `npm run dev`, and does nothing anywhere
// else. A server action is a public endpoint, and one that wrote files on a
// live server would be a hole in it — so production returns before touching
// the disk, and in development the two values are checked as names first.
export async function savePreset(next: Saved) {
  if (process.env.NODE_ENV !== "development") return;
  if (!NAME.test(next.preset) || !NAME.test(next.color)) return;
  if (next.direction !== undefined && !DIRECTIONS.includes(next.direction)) return;
  const { preset, color, direction } = next;
  await writeFile(
    path.join(process.cwd(), "preset.json"),
    JSON.stringify(direction ? { preset, color, direction } : { preset, color }, null, 2) + "\n",
    "utf8",
  );
}
