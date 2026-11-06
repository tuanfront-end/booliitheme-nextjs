import type { MetadataRoute } from "next";

import { listed, templateHref } from "@/components/templates/detail";
import { abs } from "@/lib/site";

// Every page a search engine should land somebody on, which is not every route
// in the app. A fork extends this from its own data — a listing's rows produce
// the listing's URLs — so a buyer replacing the mock data gets their own
// sitemap rather than one that still names ours.
//
// **What is left out has to match `robots.ts` and the page's own `robots`
// field.** Three files naming the same routes, each individually correct while
// saying something different, is the fault `seo-check.py` cross-reads for: a
// sitemap that submits a page the page itself asks not to index is a site
// arguing with itself in the first file a crawler opens.
//
// `/lab` is the starter's own page and is not in the product.
//
// **`lastModified` goes on rows that have a date and nowhere else.** A build
// stamping `new Date()` across every route tells a crawler the whole site
// changed on deploy, and a sitemap caught in that has all its dates ignored —
// including the true ones.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), priority: 1, changeFrequency: "weekly" },
    { url: abs("/cv"), priority: 0.5, changeFrequency: "monthly" },
    ...listed.map((p) => ({ url: abs(templateHref(p)), priority: 0.8 })),
  ];
}
