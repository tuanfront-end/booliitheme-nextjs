import { formatMonth } from "@/lib/format";
import { families, platforms, projects, type Dependency, type Family, type Project } from "@/lib/data/projects";

// Figures the home page prints about the catalogue as a whole, computed from
// `projects` so a template added or a date refreshed there moves every line
// that quotes it. Nothing here is typed by hand.

/** Ciseco — the name a family goes by, read off its first build. */
export const familyName = (family: Family) =>
  projects.find((p) => p.family === family)!.name.split(" ")[0];

/** Templates, platforms and designs in the catalogue: 10 · 3 · 5. */
export function catalogueCounts(list: Project[] = projects) {
  return {
    templates: list.length,
    platforms: new Set(list.flatMap((p) => p.platforms)).size,
    designs: new Set(list.map((p) => p.family)).size,
  };
}

/** The families built on more than one platform — "Ciseco, Ncmaz and Bitpan". */
export const multiPlatformFamilies = families.filter((f) => f.builds.length > 1);

/** Items whose marketplace page showed an update date, newest first. */
export const dated = projects
  .filter((p): p is Project & { market: { updated: string } } => Boolean(p.market.updated))
  .slice()
  .sort((a, b) => b.market.updated.localeCompare(a.market.updated));

/** The newest dated release. */
export const newestRelease = dated[0];

/** "6 templates · last updated Dec 2025" — the summary of a filtered set. */
export function setSummary(list: Project[], kind?: string) {
  const n = list.length;
  const last = list.map((p) => p.market.updated).filter(Boolean).sort().at(-1);
  const count = `${n} ${kind ? `${kind} ` : ""}${n === 1 ? "template" : "templates"}`;
  return last ? `${count} · last updated ${formatMonth(last)}` : count;
}

const compare = (a = "", b = "") => a.localeCompare(b, undefined, { numeric: true });

/** Every dependency the catalogue ships, at the newest version any template pins. */
export const stackLatest: Dependency[] = (() => {
  const seen = new Map<string, Dependency>();
  for (const dep of projects.flatMap((p) => p.stack)) {
    const held = seen.get(dep.name);
    if (!held || compare(dep.version, held.version) > 0) seen.set(dep.name, dep);
  }
  return [...seen.values()];
})();

/** "Next.js, Shopify Hydrogen and WordPress" style list joining. */
export function joinList(items: string[]) {
  return new Intl.ListFormat("en-US", { style: "long", type: "conjunction" }).format(items);
}

/** The label a build goes by in a platform switcher: the platform it installs on. */
export const platformOf = (p: Project) => platforms[p.platforms.at(-1)!];
