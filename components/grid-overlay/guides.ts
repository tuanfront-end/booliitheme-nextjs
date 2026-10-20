import { readFileSync } from "node:fs";
import path from "node:path";

// The repo root, not app/ or components/: written inside the source tree it
// would be a file the dev server watches, reloading the page on every drop.
// Gitignored, because guides are one person's working marks, not the project's.
export const GUIDES_FILE = ".guides.json";

// Per route. `x` is a vertical guide at that many px from the viewport's left
// edge; `y` a horizontal one at that many px from the top of the document, so it
// stays on the content it was dropped against when the page scrolls.
export type RouteGuides = { x: number[]; y: number[] };
export type Guides = Record<string, RouteGuides>;

// A missing or unparseable file is the ordinary case — a fresh clone — so it
// reads as no guides rather than an error.
export function readGuides(): Guides {
  try {
    const parsed: unknown = JSON.parse(
      readFileSync(path.join(process.cwd(), GUIDES_FILE), "utf8"),
    );
    return parsed && typeof parsed === "object" ? (parsed as Guides) : {};
  } catch {
    return {};
  }
}
