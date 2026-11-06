import type { Metadata, Viewport } from "next";
import {
  Be_Vietnam_Pro,
  Bodoni_Moda,
  Bricolage_Grotesque,
  Elms_Sans,
  Faculty_Glyphic,
  Familjen_Grotesk,
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Google_Sans_Flex,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  Italiana,
  Manrope,
  Newsreader,
  Noto_Serif_Display,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Prata,
  Schibsted_Grotesk,
  Source_Sans_3,
} from "next/font/google";
import localFont from "next/font/local";
import { GeistSerif } from "geist/font/serif";
import { ThemeProvider } from "next-themes";
import { DemoBuyLink } from "@/components/demo/buy-link"; // demo-only
import { FontNotice } from "@/components/font-notice";
import { GridOverlay } from "@/components/grid-overlay";
import { PresetPanel, PresetScript } from "@/components/preset-panel";
import "./globals.css";
import { Direction } from "@/components/site/direction";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Toaster } from "@/components/ui/toast";
import { SkipLink } from "@/components/site/skip-link";
import { direction, preset } from "@/lib/preset";
import { organizationLd, webSiteLd } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";

// The generated @theme inline maps --font-sans → var(--font-sans), so the
// next/font variable has to be named --font-sans, not --font-geist-sans.
// Geist is the body face: every reading line on the page is set in it.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The other ten faces the style has to survive, loaded under their own
// variables. Nothing uses them until /lab points --font-sans or --font-heading
// at one.
const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Geometric, wide apertures, and a lowercase built from near-circles — the
// register Poppins holds, drawn with less of Poppins' width and a shorter
// ascender. Variable across the whole 100–900, so the weight pair is a real
// instance at both steps.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  // A preset face: the harvest keeps it, and nothing downloads it until a
  // preset that names it is picked.
  preload: false,
});

// Poppins and Be Vietnam Pro are static families, so the set has to be named,
// and the set is their weight pair — nothing between the named steps exists on
// a static face, and neither row reaches past 500.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// The five added for the heading/body split. All variable, so no weight list:
// the pair is whatever the row asks for and the file already carries it.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// Data figures — yields, counts, versions — and nothing else.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// The display face of the Condensed preset, held at width 70.
const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  // A preset face: the harvest keeps it, and nothing downloads it until a
  // preset that names it is picked.
  preload: false,
});

// Three faces carry an optical-size axis, and next/font ships only `wght`
// unless the axis is asked for by name. Asked for, `font-optical-sizing: auto`
// — the browser default — moves the cut with the size on its own: Newsreader
// gets its text cut in a paragraph and its display cut in a headline, which is
// the whole reason to reach for these three rather than a static serif.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  axes: ["opsz"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Two more the pairings reach for, off the shortlist rather than on it: one
// editorial display serif and one warm body sans. Instrument Serif ships a
// single weight, which is why it is a heading face and nothing else — its
// emphasis half is its body half, so nothing on the page asks the browser to
// synthesise a bold it does not have.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

// Three display serifs, the register the fashion faces in the font folder were
// reaching for and the one none of them could be licensed into. All OFL, so
// they arrive the ordinary way and cost nothing at packaging time.

// A real Didone, and the fourth face on the list carrying an optical size axis:
// at 9pt the hairlines thicken enough to survive, at 96 they thin out to the
// contrast the design is about. Asking for opsz is what makes that automatic.
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Wide, light and nearly a masthead — the closest OFL face to the fashion-logo
// look. One weight, so its emphasis half is its body half.
const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"],
});

// The sturdy end of the same register: Didone contrast on a heavier skeleton,
// so it holds at a section head where Italiana would go faint. Static, one
// weight, and the only one of the three that draws Vietnamese.
const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
});

// One more pair, both OFL from Google. Faculty Glyphic is a humanist with
// flared, glyphic terminals and a tall x-height; it ships a single weight, so
// it names `400` (next/font throws without a weight on a static family) and its
// emphasis half is its body half, which is why it is a heading face only. Source
// Sans 3 is the successor to Source Sans Pro under the same Adobe design —
// Google Fonts no longer serves the old name — and is variable, so the pair is
// whatever the row asks for.
const facultyGlyphic = Faculty_Glyphic({
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
  weight: ["400"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

// Two singles, both OFL from Google and both variable. Elms Sans is a geometric
// sans with a single-storey a and g, and it is heading-only: its 400 draws
// 0.189, far under the body band, so its pair is 550/650. It also draws
// Vietnamese. Inter asks for opsz like Newsreader does, so a paragraph gets
// its text cut and a headline its Display cut, which is fitted tighter.
const elmsSans = Elms_Sans({
  variable: "--font-elms-sans",
  subsets: ["latin", "vietnamese"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Familjen Grotesk, OFL from Google and variable on wght only. A grotesque with
// a single-storey a and g, heading-only; its 400 lands in the body band, so the
// pair stays 400/500. It draws Vietnamese.
const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen-grotesk",
  subsets: ["latin", "vietnamese"],
});

// Three local faces, the ones that survived the licence check on the font
// folder. next/font/local self-hosts them exactly like the google loader does,
// so nothing here depends on a CDN either — the only difference is that the
// files and their licence texts sit in app/fonts/ and travel with a sale.
//
// The six Fontshare faces are deliberately not here. Their licence forbids
// passing the files on, so they are fetched rather than shipped and declared in
// app/fontshare.css instead: a next/font loader throws on a missing file, and
// theirs is a file that is allowed to be missing.
//
// All three are heading-only, and all three ship a single usable weight, so
// each names its own `weight` rather than leaving it open: an undeclared weight
// lets the browser synthesise the emphasis step, which is the one weight this
// style does not allow.

// Soft grotesque with a drawn, slightly irregular skeleton — the register the
// twelve neutrals do not have. One weight in the family, so its emphasis half
// is its body half, same as Instrument Serif.
const apfelGrotezk = localFont({
  src: "./fonts/ApfelGrotezk-Regular.woff2",
  variable: "--font-apfel-grotezk",
  weight: "400",
  display: "swap",
});

// Aileron re-cut by Mirat-Masson: a neo-grotesque in the Helvetica line. The
// family has 300 and 900 too, and neither is loaded — 900 is past the style's
// ceiling and 300 is under its floor, so 400 is the whole face here.
const amiamie = localFont({
  src: "./fonts/Amiamie-Regular.woff2",
  variable: "--font-amiamie",
  weight: "400",
  display: "swap",
});

// High-contrast Art Nouveau display serif. It ships a real 700, so this is the
// one local face whose two halves are two different files.
const gatchina = localFont({
  src: [
    { path: "./fonts/Gatchina-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Gatchina-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gatchina",
  display: "swap",
});

// The root fallback. Every route that matters exports its own, so this is what
// an unnamed route inherits rather than what the home page shows.
export const metadata: Metadata = {
  // Every relative URL below this point — a canonical, an `og:url`, a sitemap
  // entry — resolves against this. Without it Next throws on the first
  // relative one, which is the error saying out loud what the field is for: a
  // path is not an address, and a crawler is the reader who cannot supply the
  // missing half.
  metadataBase: new URL(siteUrl),
  title: {
    // Appends the site name to every *child* segment's title, so no page has
    // to type it. It does not apply to the title written here, which is why
    // `default` exists and carries the suffix itself — and why `pageMeta`
    // switches the home page to `title.absolute`.
    default: `${siteName} — one design, built for Next.js, Shopify and WordPress`,
    template: `%s · ${siteName}`,
  },
  description:
    "Storefront, booking and magazine templates from BooliiTheme, each design built for Next.js, Shopify Hydrogen and WordPress block themes.",
};

// viewportFit: without `cover`, iOS reports every `env(safe-area-inset-*)` as
// 0, so the toaster and the preset panel sit under the home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior: Next 16 stopped neutralising the `scroll-behavior:
  // smooth` in globals.css around a route transition, so without the attribute
  // the new page renders at once and then animates up from wherever the old one
  // was parked — which reads as the page scrolling itself to a random section.
  // The attribute asks for the pre-16 behaviour back.
  return (
    // suppressHydrationWarning: next-themes writes the mode class onto <html>
    // before React hydrates, and on the live demo PresetScript writes the
    // visitor's preset, so the server's markup and the client's differ by
    // exactly those attributes, on purpose. `preset` is preset.json's look.
    <html
      {...preset}
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${GeistSerif.variable} ${geistMono.variable} ${googleSansFlex.variable} ${manrope.variable} ${outfit.variable} ${poppins.variable} ${beVietnamPro.variable} ${instrumentSans.variable} ${plexMono.variable} ${notoSerifDisplay.variable} ${schibstedGrotesk.variable} ${bricolageGrotesque.variable} ${newsreader.variable} ${fraunces.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable} ${apfelGrotezk.variable} ${amiamie.variable} ${gatchina.variable} ${bodoniModa.variable} ${italiana.variable} ${prata.variable} ${facultyGlyphic.variable} ${sourceSans3.variable} ${elmsSans.variable} ${inter.variable} ${familjenGrotesk.variable} h-full antialiased`}
    >
      <head>
        <PresetScript />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Light first, whatever the system says: the preview a buyer meets is
            the light half. `enableSystem` and `defaultTheme="system"` hand the
            choice to the visitor's setting instead; a media product may open
            on `defaultTheme="dark"`. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {/* First focusable thing in the document. A fork's header is nine tab
            stops before its content on every route; this is one that jumps
            them. Its target is `id="content"` on each `<main>`. */}
        <SkipLink />
        <Direction built={direction}>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Toaster />
        </Direction>
        {/* The two site-wide objects, here so they are on every route. Every
            schema a fork adds points an `@id` at one of them — an article at
            its publisher, an offer at its provider — and a reference to
            something the page never published resolves to nothing. */}
        <JsonLd
          schema={[
            organizationLd(
              "A template studio building storefront, booking and magazine designs for Next.js, Shopify Hydrogen and WordPress.",
            ),
            webSiteLd(),
          ]}
        />
        {/* Development only, and silent once public/fonts/ is populated — see
            components/font-notice.tsx. Nothing to remove before shipping. */}
        <FontNotice />
        {/* Development only: the column grid, rulers and guides, and the
            picker, on Shift+G, Shift+R and Shift+C — see
            components/grid-overlay. */}
        <GridOverlay />
        {/* The mode, the brand color and the preset, in the bottom-right
            corner while you run `npm run dev` and on the live demo — see
            components/preset-panel. A production build leaves it out unless
            NEXT_PUBLIC_DEMO=1 is set, which is how the live demo is built. */}
        <PresetPanel>
          <DemoBuyLink /> {/* demo-only */}
        </PresetPanel>
        </ThemeProvider>
      </body>
    </html>
  );
}
