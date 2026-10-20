"use server";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// Folders that hold no source of the template's own: dependencies, the build,
// git and the agents' folders (every dot folder), and files served as they are.
const SKIP = new Set(["node_modules", "public", "design-refs", "dist", "out"]);
const SOURCE = /\.(tsx|jsx|ts|js|mjs)$/;

// `function EventCard`, `const EventCard =`, `class EventCard`, and a
// `displayName` set by hand: every name a component of the template can
// carry. A type or an interface is not a component and is not read.
const DECLARED = /\b(?:function\*?|class|const|let|var)\s+([A-Z][\w$]*)|\.displayName\s*=\s*["'`]([\w$.]+)/g;

// The component names the template's source declares. The picker names only
// these, so a name it shows is one `grep` finds, and next/link's
// `LinkComponent` or a base-ui part gives way to the template component that
// used it.
//
// A server action is a public endpoint in a production build, so the guard is
// the first line rather than a convention: outside `next dev` it reads nothing.
export async function readNames(): Promise<string[]> {
  if (process.env.NODE_ENV !== "development") return [];
  const names = new Set<string>();
  const walk = async (dir: string) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || SKIP.has(entry.name)) continue;
      const at = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(at);
      else if (SOURCE.test(entry.name))
        for (const m of (await readFile(at, "utf8")).matchAll(DECLARED)) names.add(m[1] ?? m[2]);
    }
  };
  await walk(process.cwd());
  return [...names];
}
