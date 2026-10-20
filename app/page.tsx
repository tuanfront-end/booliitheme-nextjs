import type { Metadata } from "next";
import Link from "next/link";

import { pageMeta } from "@/lib/seo";

// Through `pageMeta`, as every route is, so the title, the description, the
// canonical, the Open Graph block and the Twitter block come off the same two
// strings. Setting them one at a time is how a page ends up with a correct
// `<title>` and somebody else's `og:title` — see the block at the top of
// `lib/seo.ts`.
export const metadata: Metadata = pageMeta({
  title: "New template",
  description: "Stood up and not yet written. `site-brief` replaces this file.",
  path: "/",
});

// A placeholder, and the only file here that is meant to be thrown away without
// being read. It exists so a repo that has just been stood up builds, passes the
// gate, and shows the palette rather than the generator's marketing page.
// `site-brief` writes the real home page over it.
export default function Home() {
  return (
    <main id="content" className="mx-auto w-full max-w-[720px] px-6 pt-24 pb-24 sm:px-8 sm:pt-40 sm:pb-40">
      <h1 className="text-4xl tracking-tighter">New template</h1>
      <p className="mt-4 text-base text-muted-foreground">
        The style is in place and nothing has been decided yet. Run{" "}
        <code className="font-mono text-sm">site-brief</code> to pick what this
        is, who it is for and what the page set looks like. It writes over this
        file first.
      </p>

      <Link
        href="/lab"
        className="mt-16 block rounded-lg border bg-card p-8 transition-colors duration-answer ease-answer hover:bg-accent active:bg-muted"
      >
        <span className="text-xl font-medium tracking-tight">Lab</span>
        <span className="mt-2 block text-base text-muted-foreground">
          A type specimen and the sections a pick is judged on, where a face and
          a hue are chosen before the build starts. It comes off before the
          template ships.
        </span>
      </Link>
    </main>
  );
}
