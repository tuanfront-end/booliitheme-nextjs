// Who the site is, and where it lives. Two values every crawler-facing field
// resolves against: `siteName` is the one a fork changes first, and `siteUrl`
// mostly finds itself.
//
// The order is the deploy story. On Vercel the middle line is set for you, so
// the demo and a buyer who presses Deploy both get correct absolute URLs with
// nothing configured, and the custom domain once one is attached.
// NEXT_PUBLIC_SITE_URL overrides it, for any host that is not Vercel.
//
// The last resort is `.example.com` on purpose rather than localhost or a
// plausible-looking domain: `example.com` is reserved by the IANA and can never
// be registered, so a bare build cannot point a canonical or a sitemap at
// somebody else's live site.
//
// VERCEL_PROJECT_PRODUCTION_URL is the production domain on every environment,
// deliberately: a preview build that advertised its own throwaway hostname in a
// sitemap would be asking Google to index it.
//
// `siteUrl` feeds crawler-facing fields only. Copy on the screen that shows an
// address writes the placeholder out itself, so the demo never prints its own
// vercel.app host.
export const siteName = "Soft Neutral";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://example.example.com");

/** An absolute URL from a site path.
 *
 *  `metadataBase` does this for the metadata fields on its own, so `pageMeta`
 *  hands them a path. JSON-LD gets no such help — it is a string in a script
 *  tag, and `"/about"` in an `@id` is a claim about whatever host happens to
 *  be serving it. */
export const abs = (path: string) => new URL(path, siteUrl).toString();
