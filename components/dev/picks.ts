import { readFile } from "node:fs/promises";
import path from "node:path";

// The repo root, not app/ or components/. Written inside the source tree it
// would be a file the dev server watches, rewriting itself on every click.
// The scaffold's .gitignore already covers it: one person's working state,
// not the project's.
export const PICKS_FILE = ".switch-picks.json";

export type Picks = {
  brand?: string; heading?: string; body?: string; ground?: string; radius?: string;
  control?: string; header?: string; pastel?: string;
  // slot id → index of the chosen child of <Variant>. A slot the user never
  // touched is absent, and absent means 0 — the harvest has to read it that
  // way or every untouched section looks undecided.
  picks?: Record<string, number>;
};

// A missing or unparseable file is the ordinary case, not an error: it is what
// a fresh clone looks like. Return nothing and let the defaults stand.
export async function readPicks(): Promise<Picks> {
  try {
    const raw = await readFile(path.join(process.cwd(), PICKS_FILE), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Picks) : {};
  } catch {
    return {};
  }
}

// `?v=hero:2,pricing:3` — a version put on screen by its number in the
// sitemap, for an audit to read. Read on the server with the picks and never
// written, so looking at version two is not choosing it, and an auditor
// reading one never moves what the user picked.
export function versions(v?: string | string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const pair of (Array.isArray(v) ? v.join(",") : v ?? "").split(",")) {
    const [slot, n] = pair.split(":");
    const i = Number(n) - 1;
    if (slot && Number.isInteger(i) && i >= 0) out[slot] = i;
  }
  return out;
}
