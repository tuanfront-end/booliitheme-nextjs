// The first tab stop on every page, and invisible until it is one.
//
// A header with a wordmark, a mega menu and a couple of actions is around nine
// tab stops before the content, and a phone's drawer opens a panel holding
// every route. A keyboard visitor pays that on every page of the site. One
// stop that jumps the lot is the standard answer and the cheapest
// accessibility fix in a product.
//
// It needs a target: `id="content"` on every `<main>`. `seo-check.py` fails
// the build when the fragment lands on nothing.
//
// Not `sr-only` — the whole point is that it is *seen* when it is focused, by a
// sighted person navigating with a keyboard, who is the visitor this helps. So
// it is positioned off the top of the viewport and comes down when it takes
// focus, which is the one case where moving an element on focus is right.
//
// `href` rather than a click handler that scrolls: a fragment moves the
// keyboard's own position, and a scroll does not — the next Tab after a
// scripted scroll goes back to the top of the document, which is exactly the
// thing being skipped.
export function SkipLink() {
  return (
    <a
      href="#content"
      className="fixed top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-full rounded-b-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-none transition-transform duration-answer ease-answer focus-visible:translate-y-0 focus-visible:shadow-soft-lg focus-visible:outline-none"
    >
      Skip to content
    </a>
  );
}
