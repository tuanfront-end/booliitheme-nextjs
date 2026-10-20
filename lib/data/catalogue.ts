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

/** What a build is called beside its family's others: "Shopify Hydrogen", "WooCommerce". */
export const buildLabel = (p: Project) => p.build.replace(/ block theme$/, "");

/** "Shopify Hydrogen and WooCommerce" — where else a build's design ships. */
export const alsoOn = (p: Project) =>
  joinList(
    projects
      .filter((q) => q.family === p.family && q.slug !== p.slug)
      .sort((a, b) => platformRank(a) - platformRank(b))
      .map(buildLabel),
  );

/** Next.js, then Shopify, then WordPress — the order the display line names them;
 *  a headless build after the plain one on its platform. */
const PLATFORM_ORDER = ["nextjs", "shopify", "wordpress"];
export const platformRank = (p: Project) => PLATFORM_ORDER.indexOf(p.platforms[0]) * 2 + p.platforms.length - 1;

// One line per build on what its platform does differently from the others:
// who runs the checkout, where the words are edited, what the pages read from.
export const runs: Record<string, string> = {
  ciseco: "Next.js renders every page, cart and checkout from local demo data, ready to point at your own store API.",
  "ciseco-hydrogen": "Shopify runs checkout, payments and stock; Hydrogen draws the storefront from the Storefront API.",
  "ciseco-woocommerce": "WooCommerce runs the cart and checkout, and every page is edited in the Site Editor with blocks.",
  ncmaz: "Next.js renders posts from local demo data, ready to point at the CMS or API you already use.",
  "ncmaz-headless-wordpress": "WordPress keeps the editor and the posts; the Next.js front end reads them over GraphQL.",
  "ncmaz-wordpress": "Everything stays in WordPress: posts in the block editor, page layouts in the Site Editor.",
  bitpan: "Next.js renders every page, cart and checkout from local demo data, ready to point at your own store API.",
  "bitpan-woocommerce": "WooCommerce runs the cart and checkout, and every page is edited in the Site Editor with blocks.",
};
