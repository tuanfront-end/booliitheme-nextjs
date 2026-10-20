// Which fetched faces are declared but not on disk.
//
// Read out of app/fontshare.css rather than listed here, so the notice cannot
// drift from the truth: add a face to that file and it is checked, delete the
// file because the project picked an OFL face instead and every notice in the
// project goes quiet on its own. There is no second list to remember.
//
// Plain .mjs with JSDoc rather than .ts, because two callers need it and one of
// them is a node script that runs before next build — a module the build step
// has to compile first cannot be the thing that warns the build step.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const CSS = "app/fontshare.css";
const DIR = "public/fonts";

/** @typedef {{ family: string, file: string }} FetchedFace */

/**
 * Every face app/fontshare.css declares, in declaration order.
 * @param {string} [root] repo root; defaults to the working directory
 * @returns {FetchedFace[]}
 */
export function declaredFetchedFaces(root = process.cwd()) {
  let css;
  try {
    css = readFileSync(path.join(root, CSS), "utf8");
  } catch {
    // No such file is the ordinary case for a project that picked an OFL face.
    return [];
  }

  /** @type {FetchedFace[]} */
  const faces = [];
  for (const [, block] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const family = block.match(/font-family:\s*["']([^"']+)["']/)?.[1];
    const file = block.match(/url\(\s*["']?\/fonts\/([^"')]+)["']?\s*\)/)?.[1];
    if (family && file) faces.push({ family, file });
  }
  return faces;
}

/**
 * The declared faces whose file is not in public/fonts/.
 * @param {string} [root] repo root; defaults to the working directory
 * @returns {FetchedFace[]}
 */
export function missingFetchedFaces(root = process.cwd()) {
  const declared = declaredFetchedFaces(root);
  if (declared.length === 0) return [];

  /** @type {Set<string>} */
  let present;
  try {
    present = new Set(readdirSync(path.join(root, DIR)));
  } catch {
    present = new Set();
  }
  return declared.filter((face) => !present.has(face.file));
}
