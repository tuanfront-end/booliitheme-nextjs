// What a crawler reads: the `<head>` tags a link preview draws, and the
// JSON-LD a search engine parses. Together, because they are the same claim
// written twice — a page whose card says one thing and whose structured data
// says another is the defect neither surface shows you.
//
// `references/seo.md` in the `soft-neutral` skill is why each rule below
// exists. The short version of the one that shapes this file:
//
// **Next merges metadata shallowly.** A page that sets `title` and no
// `openGraph` inherits the parent's *whole* `openGraph`, `og:title` included.
// So an Open Graph block written once in `app/layout.tsx` does not give every
// route its own card — it gives every route the home page's card, under its
// own correct `<title>`. Both tags are present, every validator passes, and
// every share of every inner page is mislabelled.
//
// One helper builds all of it instead. A route that wants any of these fields
// gets all of them, off the same two strings, so they cannot come apart.

import type { Metadata } from "next";

import { abs, siteName, siteUrl } from "@/lib/site";

// ---------------------------------------------------------------------------
// The <head>
// ---------------------------------------------------------------------------

type PageMeta = {
  /** Without the site name. `title.template` in the root layout appends it to
   *  every child segment, and `og:title` below appends it by hand, because a
   *  template does not reach Open Graph. */
  title: string;
  description: string;
  /** The route from the root, no host. This is the canonical, and it is
   *  required rather than optional: a page with no canonical is the page a
   *  filtered URL outranks. */
  path: string;
  /** `article` on a route that is one. Everything else is a page. */
  type?: "website" | "article";
  /** Set on a route a search engine should not land anyone on — a checkout
   *  mid-flow, an account screen, somebody's own saved list. Keep `follow`
   *  true: the links out of those pages go to pages that should rank. */
  robots?: Metadata["robots"];
  /** An absolute image URL for the card; the site's own card otherwise. */
  image?: string;
  /** `article` only. */
  published?: string;
  authors?: string[];
};

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  robots,
  image,
  published,
  authors,
}: PageMeta): Metadata {
  // The one string both cards print. It carries the suffix that `<title>` gets
  // from the template, because a share card is read with nothing around it —
  // a tab has the whole browser to say where you are, a card in a chat window
  // has nothing.
  const social = `${title} · ${siteName}`;
  // A page's `openGraph` replaces its parent's whole, so the site's card in
  // app/opengraph-image.png reaches a route only when it is named here.
  // The site's own card is 1200×630; a card named by `image` is the caller's,
  // whose size this file does not know.
  const images = image
    ? [image]
    : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: `${siteName}: website templates by one person` }];

  return {
    // `title.template` applies to *child* segments, and `app/layout.tsx` and
    // `app/page.tsx` are the same one — the manual says so outright. Left
    // alone, the suffix lands on every inner route and the home page ships
    // bare, which is the shape every defect in this file has: correct on every
    // page you think to check.
    //
    // `absolute` rather than writing the suffix into the home page's own
    // title, because `social` already is that string and two of them is the
    // duplicate this helper exists to stop.
    title: path === "/" ? { absolute: social } : title,
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      title: social,
      description,
      url: path,
      siteName,
      locale: "en_US",
      type,
      images,
      ...(type === "article" && { publishedTime: published, authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: images.map((i) => (typeof i === "string" ? i : i.url)),
    },
  };
}

// ---------------------------------------------------------------------------
// The JSON-LD
// ---------------------------------------------------------------------------
//
// Three builders here, because three is what every site has: who runs it, what
// the site is, and where the reader is standing. **A fork writes its own for
// the thing it actually sells** — a Person with an AggregateRating, a Product
// with an Offer, an Article with an author — and writes them to one rule:
//
//   read the same data the page renders.
//
// Structured data is the one part of a page where writing what you cannot
// prove is worse than writing nothing: a search engine penalises markup that
// disagrees with the page under it. A rating built off the row the header
// prints cannot disagree with it. A rating typed into a schema can.
//
// The corollary is knowing when to write nothing. `ItemList` on a listing is
// the tempting one and a paginated or filtered listing cannot honour it: what
// the markup would describe is one state of a control rather than the contents
// of the page.

/** Every schema object carries `@type` and arbitrary further fields. Typed
 *  loosely on purpose: `schema-dts` is a large dependency for a handful of
 *  shapes, and the shapes are checked by `seo-check.py` against the
 *  vocabulary rather than by a type. */
export type Schema = { "@type": string; [key: string]: unknown };

/** Who runs the site. Mounted once in the root layout, so every route has it
 *  and every other schema can point an `@id` at it. */
export const organizationLd = (description: string): Schema => ({
  "@type": "Organization",
  "@id": abs("/#organization"),
  name: siteName,
  url: siteUrl,
  description,
});

/** The site itself. Pass a `search` path with `{search_term_string}` in it
 *  where the product has a search a visitor actually performs — and point it
 *  at the page that performs it rather than at a `/search` route that does not
 *  exist, because a `target` landing on a 404 is a dead control one surface
 *  out. */
export const webSiteLd = (search?: string): Schema => ({
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: siteUrl,
  name: siteName,
  publisher: { "@id": abs("/#organization") },
  ...(search && {
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: abs(search) },
      "query-input": "required name=search_term_string",
    },
  }),
});

/** The trail a page already draws above its h1, off the same array.
 *
 *  Emit this from the breadcrumb *component* rather than from each page: every
 *  trail on the site then publishes markup and no page has to remember. Derive
 *  a second trail from the URL instead and you have two lists free to disagree.
 *
 *  The last crumb has no `href` — it is where the reader already is — and gets
 *  no `item`, which is what Google's own reference does with the final entry. */
export const breadcrumbLd = (
  trail: { label: string; href?: string }[],
): Schema => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.label,
    ...(crumb.href && { item: abs(crumb.href) }),
  })),
});

/** The person behind the site — what the home page says in its first line.
 *  `sameAs` is the marketplace author page, the one profile the data file
 *  holds. */
export const personLd = (name: string, jobTitle: string, sameAs: string[]): Schema => ({
  "@type": "Person",
  "@id": abs("/#person"),
  name,
  url: siteUrl,
  jobTitle,
  worksFor: { "@id": abs("/#organization") },
  sameAs,
});

/** A description that fits a search result: the whole text when it does, else
 *  the sentences that fit, else the words that fit. The page keeps its full
 *  copy; only the tag is cut. */
export function clip(text: string, max = 160) {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  if (out.trim().length >= 70) return out.trim();
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
