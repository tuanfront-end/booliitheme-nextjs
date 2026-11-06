# BooliiTheme

The personal site of BooliiTheme, one person who designs and builds website
templates for Next.js, Shopify and WordPress. Built with Next.js 16, React 19,
Tailwind CSS 4 and Base UI, set in Geist, Geist Serif and Geist Mono.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Intro, every template, About, Stack, the CV panel |
| `/templates/[slug]` | One page per template (15 templates and side projects). From the home page a card opens the same template in a sheet over the page; a shared link or a refresh opens the page itself. |
| `/cv` | The CV as an A4 sheet, the one `public/booliitheme-cv.pdf` is printed from |
| `/design-system` | Every token and component, drawn live. Not indexed. |
| `/lab` | A bench of sections the style most often fails on. Not indexed. |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # the production build
npm run check    # lint, build, and the design-system checks; must exit 0 before a release
```

`npm run design` regenerates `DESIGN.md` from `app/globals.css` and `components/ui/`
after either changes. `npm run cv` reprints the PDF from a running production
server (macOS, Chrome), and `npm run shots` recaptures every template's demo
pictures into `images/live/`.

## Where things live

- **Templates and their copy:** `lib/data/projects.ts`, one entry each. The
  home grid, the sheet, the template pages and the sitemap all read it.
- **Pictures:** `images/`, imported statically so Next sizes and optimises them.
- **Theme:** `app/globals.css` (tokens) and `components/ui/` (the kit).
- **Numbers and dates:** `lib/format.ts`.

## Deploy

Made for Vercel. Crawler-facing URLs (sitemap, canonical, share cards) come from
`NEXT_PUBLIC_SITE_URL`, falling back to `VERCEL_PROJECT_PRODUCTION_URL`; set the
first if the site is on a domain of its own.
