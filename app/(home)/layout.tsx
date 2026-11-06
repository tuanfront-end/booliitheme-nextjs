// The home and the sheet a template opens in over it. The @modal slot lives in
// this group rather than the root, so only a card pressed on the home is
// intercepted: on a template's own page the arrows and the three at its foot
// go to the next page as any link does.
export default function HomeLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
