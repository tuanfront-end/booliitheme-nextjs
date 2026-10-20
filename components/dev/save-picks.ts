"use server";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { PICKS_FILE, type Picks } from "./picks";

// Whole-object writes, not merges: the client holds the complete state and
// sends it, so there is one writer and no read-modify-write to race.
export async function savePicks(picks: Picks) {
  await writeFile(
    path.join(process.cwd(), PICKS_FILE),
    JSON.stringify(picks, null, 2) + "\n",
    "utf8",
  );
}
