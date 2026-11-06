// Reads every template's stack off its own repo, so the versions an open
// template lists are the ones its buyers get: the newest release tag, or the
// default branch where a repo has none. A Next.js, Vite or Hydrogen build is
// read from its package.json; a WordPress theme from the headers of its
// style.css. Written to lib/data/stack.json, which lib/data/projects.ts reads.
//
//   npm run stack                 # every template
//   npm run stack -- ofen saal    # just these slugs
//
// The repos are private, so this runs here, through the GitHub CLI signed in
// on this machine, rather than at build time on Vercel.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "tuanfront-end";
const OUT = "lib/data/stack.json";

// slug → repo, read off the data file rather than kept twice.
const source = readFileSync("lib/data/projects.ts", "utf8");
const repos = [...source.matchAll(/slug: "([^"]+)",\s*repo: "([^"]+)"/g)].map(([, slug, repo]) => ({ slug, repo }));
const only = process.argv.slice(2);
const todo = only.length ? repos.filter((r) => only.includes(r.slug)) : repos;

// What a buyer reads, in the order they read it, and how much of each version:
// a Next.js minor changes what a buyer can do, a React or Tailwind one does not.
const packages = [
  ["@shopify/hydrogen", "Shopify Hydrogen", 2],
  ["next", "Next.js", 2],
  ["@faustwp/core", "Faust.js", 1],
  ["react", "React", 1],
  ["tailwindcss", "Tailwind CSS", 1],
  ["typescript", "TypeScript", 1],
];

// The theme headers WordPress itself reads — "Tested up to", never "Requires
// at least": the newest version the release was checked on.
const headers = [
  [/^Tested up to:\s*(.+)$/im, "WordPress"],
  [/^WC tested up to:\s*(.+)$/im, "WooCommerce"],
];

const gh = (path) => execFileSync("gh", ["api", path], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const json = (path) => JSON.parse(gh(path));

function file(repo, path, ref) {
  try {
    const { content } = json(`repos/${OWNER}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
    return Buffer.from(content, "base64").toString("utf8");
  } catch {
    return null;
  }
}

// "^16.3.5" → "16.3" at two parts, "^4" → "4" at one.
const trim = (range, parts) => range.match(/\d+(?:\.\d+)*/)?.[0].split(".").slice(0, parts).join(".");

const semver = (tag) => tag.match(/^v?(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number);

function release(repo) {
  const tags = json(`repos/${OWNER}/${repo}/tags?per_page=100`)
    .map((t) => ({ name: t.name, v: semver(t.name) }))
    .filter((t) => t.v)
    .sort((a, b) => b.v[0] - a.v[0] || b.v[1] - a.v[1] || b.v[2] - a.v[2]);
  return tags[0]?.name ?? json(`repos/${OWNER}/${repo}`).default_branch;
}

function read(repo, ref) {
  const pkg = file(repo, "package.json", ref);
  if (pkg) {
    const p = JSON.parse(pkg);
    const deps = { ...p.dependencies, ...p.devDependencies };
    return packages
      .filter(([id]) => deps[id])
      .map(([id, name, parts]) => ({ name, version: trim(deps[id], parts) }));
  }
  const style = file(repo, "style.css", ref);
  if (style) {
    return headers
      .map(([pattern, name]) => ({ name, version: style.match(pattern)?.[1] && trim(style.match(pattern)[1], 2) }))
      .filter((d) => d.version);
  }
  throw new Error("no package.json or style.css at the repo root");
}

const stacks = (() => {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return {};
  }
})();

const today = new Date().toISOString().slice(0, 10);
let failed = 0;

for (const { slug, repo } of todo) {
  try {
    const ref = release(repo);
    const stack = read(repo, ref);
    stacks[slug] = { repo, ref, read: today, stack };
    console.log(`${slug.padEnd(26)} ${ref.padEnd(8)} ${stack.map((d) => `${d.name} ${d.version}`).join(", ")}`);
  } catch (error) {
    failed++;
    console.error(`${slug.padEnd(26)} ${repo}: ${error.stderr?.trim() || error.message}`);
  }
}

// Every slug the data file names, in its order; one this run could not read
// keeps the stack it was last read at.
const sorted = Object.fromEntries(repos.filter((r) => stacks[r.slug]).map((r) => [r.slug, stacks[r.slug]]));
writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`\nWrote ${OUT}${failed ? ` · ${failed} not read` : ""}`);
process.exit(failed ? 1 : 0);
