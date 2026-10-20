import type { Schema } from "@/lib/seo";

// One or more schema.org objects, printed into the page as the script tag a
// crawler looks for. A server component with no state and no client cost: the
// tag is in the HTML that arrives, which is the only place it is any use.
//
// `@graph` rather than one tag per object. A page that publishes an
// Organization, a WebSite and a BreadcrumbList in three separate scripts is
// publishing three unrelated documents, and the `@id` references between them —
// an article pointing at its publisher, an offer pointing at its provider —
// are what `@graph` is for. One tag, one context, and the references resolve.
export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  const graph = Array.isArray(schema) ? schema : [schema];

  return (
    <script
      type="application/ld+json"
      // Escaping `<` is the whole of the risk here and it is not theoretical:
      // every string in this payload comes out of a data file a buyer edits,
      // and a `</script>` typed into one would otherwise close this tag and
      // open a scripting hole in every page that renders it. `<` is valid
      // inside a JSON string and parses back to the same character.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
