import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { GridOverlay } from "@/components/grid-overlay";
import "./globals.css";
import { Direction } from "@/components/site/direction";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Toaster } from "@/components/ui/toast";
import { SkipLink } from "@/components/site/skip-link";
import { organizationLd, webSiteLd } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";

// The three Geist faces, and no others. The generated @theme inline maps
// --font-sans → var(--font-sans), so the body face's next/font variable has to
// be named --font-sans. Geist reads every line, Geist Serif sets the headings
// (`--font-heading` in globals.css), Geist Mono the kickers and addresses.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Geist Serif's variable file and nothing else. `geist/font/serif` declares
// five faces, and each one it declares is preloaded on every route: four of
// them (Regular, Square, Triangle, Heart) are never set in, 183 KB a page.
// Same options as the package's own GeistSerif.
const GeistSerif = localFont({
  src: "../node_modules/geist/dist/fonts/geist-serif/GeistSerifVF.woff2",
  variable: "--font-geist-serif",
  weight: "400",
  fallback: ["Times New Roman", "Times", "serif"],
  adjustFontFallback: "Times New Roman",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The root fallback. Every route that matters exports its own, so this is what
// an unnamed route inherits rather than what the home page shows.
export const metadata: Metadata = {
  // Every relative URL below this point — a canonical, an `og:url`, a sitemap
  // entry — resolves against this.
  metadataBase: new URL(siteUrl),
  title: {
    // Appends the site name to every *child* segment's title; `default`
    // carries the suffix itself, and `pageMeta` switches the home page to
    // `title.absolute`.
    default: `${siteName} — website templates for Next.js, Shopify and WordPress`,
    template: `%s · ${siteName}`,
  },
  description:
    "Website templates for Next.js, Shopify and WordPress, designed and built by one person, drafted with AI and finished by hand.",
};

// viewportFit: without `cover`, iOS reports every `env(safe-area-inset-*)` as
// 0, so the toaster sits under the home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior: Next 16 stopped neutralising the `scroll-behavior:
  // smooth` in globals.css around a route transition; the attribute asks for
  // the pre-16 behaviour back.
  return (
    // suppressHydrationWarning: next-themes writes the mode class onto <html>
    // before React hydrates, so the server's markup and the client's differ by
    // that attribute, on purpose.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${GeistSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Light first, whatever the system says; the header's toggle is the
            one way into the dark half. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* First focusable thing in the document; its target is
              `id="content"` on each `<main>`. */}
          <SkipLink />
          <Direction built="ltr">
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster />
          </Direction>
          {/* The two site-wide objects, here so they are on every route. */}
          <JsonLd
            schema={[
              organizationLd(
                "A one-person studio designing and building website templates for Next.js, Shopify Hydrogen and WordPress.",
              ),
              webSiteLd(),
            ]}
          />
          {/* Development only: the column grid, rulers and guides, and the
              picker, on Shift+G, Shift+R and Shift+C — see
              components/grid-overlay. */}
          <GridOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
