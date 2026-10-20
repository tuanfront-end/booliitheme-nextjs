// The column grid, rulers and guides, and the picker, drawn over the page while
// it is being built: Shift+G for the grid, Shift+R for rulers, Shift+C to pick
// an element and write a comment on it or copy its name, or `?grid=1` /
// `?rulers=1` on the URL for a screenshot taken without a keyboard.
//
// Development only, like the font notice: in a production build this returns
// nothing and the overlay's code is never built. The import sits behind the
// guard for that: a static one puts the client code in every build's chunks,
// sent to no page but shipped all the same. Nothing to remove before shipping,
// and nothing a visitor can switch on.
export async function GridOverlay() {
  if (process.env.NODE_ENV !== "development") return null;
  const [{ readGuides }, { listComments }, { OverlayClient }] = await Promise.all([
    import("./guides"),
    import("./save-comments"),
    import("./overlay-client"),
  ]);
  return <OverlayClient initial={readGuides()} comments={await listComments()} />;
}
