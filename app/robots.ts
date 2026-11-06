import type { MetadataRoute } from "next";

import { abs } from "@/lib/site";

// The same exclusions `sitemap.ts` makes — and they have to be the same ones.
// A `Disallow` here on a path the sitemap submits is the two files disagreeing
// in the two places a crawler checks before it reads a single page.
//
// Nothing is disallowed on purpose: /design-system keeps itself out of the
// index with its own `noindex`, and a crawler only reads that on a page
// robots.txt lets it fetch.
//
// A disallowed path is not a private one. Everything under one is served to
// anybody who asks; the rule says only that there is nothing there worth a
// search result — an empty saved list, a checkout with nothing picked, an
// account screen showing one made-up reading. Real access control is a thing a
// template does not have and should not pretend to.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
