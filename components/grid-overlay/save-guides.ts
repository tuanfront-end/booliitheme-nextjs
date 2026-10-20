"use server";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { GUIDES_FILE, type Guides } from "./guides";

const px = (list: unknown) =>
  Array.isArray(list)
    ? list.filter((n): n is number => Number.isFinite(n)).map(Math.round)
    : [];

// A server action is a public endpoint in a production build, so the guard is
// the first line rather than a convention: outside `next dev` it writes nothing.
// The payload is rebuilt from numbers only, so whatever is posted, the file can
// hold nothing but route keys and px positions.
export async function saveGuides(guides: Guides) {
  if (process.env.NODE_ENV !== "development") return;

  const clean: Guides = {};
  for (const [route, g] of Object.entries(guides ?? {})) {
    const x = px(g?.x);
    const y = px(g?.y);
    if (route.startsWith("/") && (x.length || y.length)) clean[route] = { x, y };
  }

  // Whole-object writes: the client holds every route's guides and sends them
  // all, so there is one writer and no read-modify-write to race.
  await writeFile(
    path.join(process.cwd(), GUIDES_FILE),
    JSON.stringify(clean, null, 2) + "\n",
    "utf8",
  );
}
