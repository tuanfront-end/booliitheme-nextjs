# BooliiTheme — brief

**One line** — the storefront of BooliiTheme, a two-person studio selling
storefront, booking and magazine templates built for Next.js, Shopify Hydrogen
and WordPress block themes, to developers and agencies choosing a starter.

**Audience** — template buyers arriving from a ThemeForest item page, a search
for "<industry> Next.js template", or a demo link a colleague sent. They
already believe templates save weeks; they doubt this one runs on *their*
platform, that it is kept up to date, and that the licence covers a client
job. To act — open a live demo, then buy on the marketplace — they must believe
it is production-grade on their stack and still maintained.

**Interactions** — state only, no backend:
- catalogue filter by platform (counts per segment) and by industry chip, sort
  Newest / Best selling, search by name, empty state with a reset
- shortlist (save toggle on every card, persisted in localStorage, a count in
  the header)
- compare up to three templates in a dialog: platform, stack versions,
  industry, price, last update
- the platform switcher: one design, flip between the platforms it ships on
  (home § Families and every detail page)
- screenshot lightbox on the detail page
- copy-to-clipboard on the studio email; a contact form that composes a
  pre-filled `mailto:` by topic

**Studied** — six read, two refused:
- cruip.com · a small studio's Tailwind shelf — the "can't choose? take them
  all" block between rows of products, two-screenshot cards
- themeselection.com · the framework supermarket — framework chips as the
  catalogue's first axis, sales and rating on the card, detail page with
  version, changelog and folder-structure tabs
- lexingtonthemes.com · the curated Astro bookshelf — the quietest card (shot,
  name, "/ category", price), a licence page that opens on can / cannot lists
- themewagon.com · the free library that upsells — the catalogue as the page
- codedthemes.com · an admin kit per framework — "Why us" support block
- ui.aceternity.com/templates · a component library's landing kit — side-by-side
  screenshots on one card
- Not read: Tailwind Plus (login wall), ThemeForest author pages (403).

**Niche objects**
- a browser window · its chrome (three dots, an address bar carrying the real
  demo host) is the listing card's frame
- `package.json` · the dependency line `next@16.0` — a mono version chip, the one
  place `font-mono` is honest, over machine text
- a tailor's paper pattern · one pattern cut in several cloths — the Families
  section's idea and its switcher
- a release note · date + version + one line — the changelog row
- the marketplace price tag · "$29 Regular" — price with the licence named
  beside it, never alone

## Pages

| Route | Job | Floor? | Done |
|---|---|---|---|
| `/` | the storefront: catalogue, families, proof, license | yes | |
| `/work/[slug]` | one template: demo, versions, buy, its other platforms | yes | |
| `/contact` | a pre-sale or custom-work question to the studio | yes | |

## Defaults
- **Market & language** — worldwide marketplace buyers, US/EU heavy · US
  English, `us` spelling · USD; ThemeForest sells in USD.
- **Stance** — *BooliiTheme is the workshop that builds one storefront or
  magazine design for every platform, to a developer choosing where their
  client's site will live, so it always shows that design running on the
  platform they already run.*
  - Voice: a maker talking shop — exact versions, dates, plain verbs, no
    superlatives.
  - Photographs: the products themselves — real screenshots of the running
    demos, at real size, in browser chrome.
  - Feature it invents: the platform switcher (one design, flip its platform).
  - Competitor test: ThemeSelection also ports across *JS frameworks*, for admin
    dashboards; none of the six ports a storefront across Next.js, Shopify and
    WordPress — the sentence does not fit them.
- **Tone** — precise · the exact versions on every card; crafted · each
  platform rebuilt by hand, not converted; candid · the running demo and real
  numbers before any claim.
- **Belief** — "it is production-grade on my stack, and maintained" → the
  catalogue (live demo + versions on every card), Families (the same design on
  my platform), the release log (dates), real marketplace figures.
- **Assets** — real: the studio mark (supplied), 20 product screenshots (`images/work/`, two per
  product), product names, blurbs, demo URLs, stack versions, studio email
  `booliitheme@gmail.com`, Facebook / X / Dribbble links. Figures: only what the
  marketplace shows publicly, cited in `lib/data/` — see § For review. Copy:
  written here. No photography, no faces.
- **Pastel** — 0 · the ten screenshots already carry every colour on the page;
  a pastel ground would fight them.
- **Brand** — candidates from `brand-hue.py --candidates`:
  - honey `oklch(78.5% 0.163 77.582)` · Color Hunt golden-hour, Oct 2026 ·
    continues the yellow of the BooliiTheme logo square and the old card
    underline; stands on white UI screenshots without competing
  - harbor `oklch(57.8% 0.231 260.041)` · Color Hunt azure-lemon · the safe
    developer blue, wants the cool family
  - lagoon `oklch(55.6% 0.095 194.167)` · Color Hunt retro-teal · calm, but
    four of the screenshots are teal-green already
  - plum `oklch(60.5% 0.277 328.621)` · Color Hunt orchid-blush · loud on a
    page of colourful screenshots
  - Provisional pick was honey; **locked at stop 2: Ink** (the user's pick on
    the Switch), action the fill, neutral **warm**. The colour on the page is
    the products' screenshots, the studio mark and the signal colour.
- **Colour** — 3 · brand + three accent-colour decisions — the dials' "design
  studio selling its own craft" row; the screenshots spend most of the chroma.
- **Accent colours** — all seven.
- **Signal colour** — leaf · "live and maintained": the live-demo dot, the
  Updated chip, the shortlist tick.
- **Motion** — 0 · a page not for sale; hover and `<Reveal>` only.

## Shell
- Brand, as first written: `brand-hue.py 'oklch(78.5% 0.163 77.582)'
  --action black --neutral warm --panel-with 'harbor=oklch(57.8% 0.231 260.041)'
  'lagoon=oklch(55.6% 0.095 194.167)' 'plum=oklch(60.5% 0.277 328.621)'` — the
  panel kept harbor, lagoon and Ink. Accents narrowed to leaf, coral, iris,
  lime, sky: the brand sat 2° from `--sun` and 10° from `--peach`.
- **Locked at stop 2:** `brand-hue.py ink --neutral warm --panel-with
  'honey=oklch(78.5% 0.163 77.582)' 'harbor=oklch(57.8% 0.231 260.041)'
  'lagoon=oklch(55.6% 0.095 194.167)'` — the Color row is Ink, honey, harbor.
  All seven accent colours licensed again; `BRANDS` is `["original"]`.
- Switch picks at stop 2 (written into `globals.css` at the harvest): heading
  and body Geist (One family), ground near-white, container radius 24px,
  control radius 12px, header morph.
- Mark: the studio's "iB" tile, supplied by anh as a PNG and redrawn to its
  geometry in `components/site/logo-mark.tsx` and `app/icon.svg`; it sits
  before the script wordmark in the header.
- Container line: `mx-auto w-full max-w-7xl px-6 sm:px-8`; `<main>` gap
  `gap-32 sm:gap-40`.
- Ornament hand: a 1.5px stroke, round caps and joins, elbows on a 6px radius,
  a 4–6 dash for a cut line; ink at `text-muted-foreground/45`, the brand's
  fill only on the node a drawing is about, leaf for anything live; notes in
  the body face at the muted ink.
- Header: `navbars/four-column-mega-menu-under-a-wordmark-left-nav-right-bar.png`
  — Templates mega menu by platform with the newest release as its one picture,
  Families / License / Contact, shortlist, mode toggle, Browse templates; the
  morph to a glass pill on the first scroll; a Drawer from the reading end
  under lg.
- Footer: `footers/cta-strip-over-link-columns-and-a-ghost-wordmark-on-dark.webp`
  — an ink band at the container's width (the `dark` tokens scoped to it),
  the ThemeForest portfolio strip, four link columns, the wordmark as a ghost.
  The section above it never carries a band.
- Switch: `components/dev/` — Brand, the pairing (Studio · One family · Serif
  head, opened on Studio), ground, both radius seeds, the header knob.

## Signature
- **The pattern line** (picked at stop 2 over the marker and the address bar):
  a tailor's paper pattern — one design cut along a dashed, notched line into
  each platform it ships on. It is the Stance drawn: the same design, running
  on the platform the buyer already runs. It carries Families (§ 3), the hero's
  platform-switcher fragment and the detail page's "Also on"; nowhere else, so
  it stays a statement rather than a texture. `PatternLine` in
  `components/design-system/signature.tsx` is its drawing.
- The listing card is the template card: a `BrowserFrame` with the demo host in
  its address bar, crossfading to the second shot on hover.
- Nothing repeats a recent template on purpose — `signature-check.py` found no
  sibling templates to compare against.

## Kit
Beyond the core kit:
- `BrowserFrame` — a screenshot in browser chrome with the demo host in the
  address bar; crossfade to a second shot on hover; `data-picture`
- `VersionChip` — mono `name@version` chip over machine text
- `CompareDialog` — up to three templates side by side; a tray that appears
  once one is picked
- `Lightbox` — the kit's `Dialog` with a carousel of a product's shots
- `PlatformSwitcher` — `Segmented` bound to a family's platforms, with the
  shot, versions and links swapping under it
- `CopyButton` — copy a string, confirm with a toast

## Photography
- **subject** — the products' own demos: the top of each home page and one
  inner page (product detail, listing, article)
- **light** — as captured; never re-graded
- **frame** — browser chrome at the shot's own aspect (~1.06:1), top-left
  anchored crop, 6px inset in its card; no device mockups
- **palette** — whatever the product wears; the chrome around it stays
  near-colourless
- **banned** — stock photography, faces, hands holding devices, upscaled or
  blurred shots, any product not made by BooliiTheme

## House rules
1. The brand is Ink (stop 2): the primary action and every chosen state are
   the page's ink. `controls-check`'s ink-fill rule cannot tell brand from ink
   and is waived in `.soft-neutral.json`.

## For review
- Figures come from Wayback copies of the ThemeForest pages (live pages are
  behind Cloudflare): author 6,126 sales · 4.61 from 217 ratings · Elite Author
  · since June 2021 (24 Mar 2026); per-item price and sales from the portfolio
  of 20 Aug 2025, ratings and last-update dates from 2024 item pages. Anh
  refreshes them from the dashboard in `lib/data/projects.ts`; until then the
  page prints dates absolute, never "N days ago".
- Ciseco WooCommerce has no archived page: no price, sales or date shown.
- Bitpan WooCommerce reuses Bitpan's Next.js screenshots — needs its own pair.
- Buyer review quotes appear only once anh pastes the ones to show.
- The mark is redrawn from a PNG; swap in the original SVG if anh has it.
- "What every download includes" claims (docs, support window, updates) are
  limited to Envato's own policy until anh confirms more.

## Sitemap — /

| # | Section | Job | Must carry | Versions | Done |
|---|---|---|---|---|---|
| 1 | Hero | Say what is sold, on which platforms, and that it runs | Display line naming the three platforms (Next.js, Shopify Hydrogen, WordPress); lede; CTA "Browse templates" (→ § 2) + "See one design on every platform" (→ § 3); counts computed from data: 10 templates · 3 platforms · 5 designs; a stack of three real screenshots; overlays from different families: a rating card (real figure), an "Updated <relative date>" state chip (computed), a platform-switcher fragment | 3 | |
| 2 | Catalogue | Let a buyer find the template for their platform and industry | `Segmented` by platform with computed counts (All · Next.js · WordPress · Shopify); industry chips (Ecommerce · Booking · Blog & magazine · NFT marketplace); search; sort Newest / Best selling; card: `BrowserFrame` with hover crossfade, name, "/ industry", `VersionChip`s, price + licence word, rating · sales, New chip, Live demo (new tab) + Details, save toggle, compare checkbox; compare tray → `CompareDialog`; `EmptyState` with reset | 2 | |
| 3 | Families | Prove the studio's one idea: one design, every platform | Family picker (Ciseco · 3 platforms, Ncmaz · 3, Bitpan · 2); `PlatformSwitcher` swapping the large shot, the versions, a line on what differs per platform (checkout, editor, CMS), demo + details links; "the same design on N platforms" computed | 2 | |
| 4 | Proof | Show the studio is real and trusted | `author` from `lib/data/projects.ts`: 6,126 sales, 4.61 / 5 from 217 ratings, Elite Author, selling since June 2021, 12 items; the best seller (Chisfis, 894 sales) named; reviews only those anh supplies, else none | 1 | |
| 5 | Latest release | Prove maintenance | the newest release large (shot + what it is + versions), beside a release log of the last updates: date, product, version line — dates real, "N days ago" computed | 1 | |
| 6 | Licence & support | Answer "can I use it for a client, and who helps me" | Regular vs Extended as can / cannot lists in plain words (Envato's terms), support window and updates per Envato policy, link to the full licence | 1 | |
| 7 | FAQ | The remaining objections | which platform to choose; headless WordPress vs block theme; Hydrogen needs a Shopify plan; how updates arrive; refunds (Envato policy); custom work | 1 | |
| 8 | Contact | Pre-sale and custom-work questions | topic chips (Pre-sale question · Support · Custom work) composing a `mailto:`; copy-email button; social links | 1 | |

## Anticipations — /
- picking a platform in the catalogue → "6 templates · last updated Dec 2025",
  from the filtered set → § 2
- hovering Live demo → the demo's host and "opens in a new tab", from the demo
  URL → § 2
- picking a family → "also on Shopify Hydrogen and WooCommerce", from the
  family's other platforms → § 3
- reading the price → "Regular licence · one site, for you or one client", from
  the licence data beside the price → § 2, § 6

## Sitemap — /work/[slug]

| # | Section | Job | Must carry | Versions | Done |
|---|---|---|---|---|---|
| 1 | Product hero | Everything needed to decide, above the fold | breadcrumb; name, industry, tagline; `VersionChip`s; price + licence; rating · sales; Updated (computed); Live demo + Buy on ThemeForest; gallery → `Lightbox`; save + compare | 1 | |
| 2 | Also on | The same design on its other platforms | `PlatformSwitcher` for the family; hidden when the family has one platform | 1 | |
| 3 | Stack & requirements | What the buyer installs | versions table per dependency; platform requirements (Node, WordPress, Shopify plan) | 1 | |
| 4 | Licence & support | Same answer as home § 6 | the shared component | 1 | |
| 5 | More templates | Next step if this one is not it | three related by industry, then platform | 1 | |

## Anticipations — /work/[slug]
- opening the demo → the host and the platform it runs on, from the item →
  § 1
- before buying → "Regular licence · one site", and when the item was last
  updated, from the item → § 1

## Sitemap — /contact

| # | Section | Job | Must carry | Versions | Done |
|---|---|---|---|---|---|
| 1 | Contact | Get a question to the studio | topic `Segmented`; name, email, product `Select`, message; send composes a pre-filled `mailto:`; copy email; socials; where support for a purchase lives (the marketplace) | 1 | ref: none — a form built from the kit |

## Refs — /

| # | Section | v | File | Takes |
|---|---|---|---|---|
| 1 | Hero | 1 | `hero-sections/headline-and-client-pill-left-fanned-cards-over-a-peach-slab-right.png` | |
| 2 | Hero | 2 | `hero-sections/dark-badge-copy-left-tilted-card-pair-with-glass-chips-right-logo-row-below.png` | |
| 3 | Hero | 3 | `hero-sections/centred-headline-and-email-pill-over-a-three-card-carousel-with-a-lifted-middle.webp` | |
| 4 | Catalogue | 1 | `product-lists/heading-and-city-tabs-over-four-wide-listing-cards-photo-left-specs-right.png` | |
| 5 | Catalogue | 2 | `product-lists/heading-tabs-and-filter-chips-over-eight-product-cards-with-swatch-rows.png` | |
| 6 | Families | 1 | `feature-sections/centred-heading-and-three-tab-cards-over-photo-left-copy-right.jpeg` | |
| 7 | Families | 2 | `feature-sections/centred-copy-and-link-over-two-tinted-panels-with-ui-illustrations.webp` | |
| 8 | Proof | 1 | `stats/four-staggered-figure-blocks-with-logo-row.png` | |
| 9 | Latest release | 1 | `feature-sections/photo-left-serif-heading-cta-and-four-tick-rows-right.png` | |
| 10 | License & support | 1 | `pricing-sections/two-tier-pair-in-one-shell-with-the-featured-tier-inverted.jpeg` | |
| 11 | FAQ | 1 | `faqs/centred-heading-with-tabs-over-numbered-accordion.png` | |
| 12 | Contact | 1 | `contact-sections/reserve-form-left-render-and-a-contact-card-right.webp` | |

## Build log — /

### 1 · Hero · v1
- Made: `components/home/hero.tsx` — the hero: display line with the five-design disc pill, lede, two actions, the "10 templates" stat, the pinned-versions strip, the column-hairline Field; `components/home/hero-deck.tsx` — Ciseco's three builds fanned over a sun slab, the rating card, the Updated chip and the PatternLine switcher that brings a build to the front; `lib/data/catalogue.ts` — computed catalogue figures (`catalogueCounts`, `newestRelease`, `dated`, `setSummary`, `stackLatest`, `familyName`, `platformOf`, `joinList`)
- Decided: the hero showcases the family with the most builds (Ciseco), in the display line's platform order Next.js · Shopify · WordPress; a branch is the kit `Button` `size="sm"`, `default` when picked, `outline` otherwise, `aria-pressed`; the picked build takes the front slot instantly (motion 0). Platform labels come from `platformOf` (the platform a build installs on). The second action reads "Switch a design's platform" → #families
- Check: waits on §2 and §3 (`#templates`, `#families` anchors) and request 1 (VersionChip mono)

### 2 · Catalogue · v1
- Made: `components/home/catalogue.tsx` — the section: platform rail, industry rail, search, sort, the filtered-set summary, the grid and its EmptyState, `?platform=` read on arrival and on change; `components/home/template-card.tsx` — the listing card (`TemplateCard`, plus `regularLicense`, the price's one-line gloss): BrowserFrame as the live demo's own link with the hover crossfade, build badge + New (leaf), name / industry, VersionChips, rating · sales, price + "Regular license" with an info IconButton → #license and its tooltip, Live demo (tooltip: host · opens in a new tab), Details → /work/<slug>, save (shortlist), compare checkbox; `components/home/compare.tsx` — `CompareTray` (fixed foot pill once one is ticked) and the compare Dialog, three at most (`COMPARE_MAX`)
- Reused: `setSummary` in `lib/data/catalogue.ts` from §1, a `kind` argument added ("4 WordPress templates · last updated Dec 2025")
- Decided: platform and industry are `FilterRail`s (`plain` single, `outline` multiple) rather than `Segmented` — the kit's own line gives a pill row narrowing a list on the page ground to FilterRail; each chip counts what pressing it would leave with the other filters held. Card is a resting surface (`bg-card` + inset hairline, `data-object`), 5fr / 7fr from `sm`, stacked under it; the frame stretches to the card's height from `sm`. The ThemeForest portfolio button stands where the reference's View all is
- Check: waits on §6 (`#license` from the price's info button) and request 1 (VersionChip mono)

### 3 · Families · v1
- Made: `components/home/families.tsx` — centred eyebrow and heading, the family picker, the picked build's large frame (the demo's own link) beside the PatternLine switcher, the build's name and "also on" line, the "What runs where" and "Versions" rows, Live demo + Details; holds `runs`, the one-line per-build note on who runs checkout, editing and content
- Reused: `PatternLine` switcher pattern from §1 (kit `Button` `sm`, `default` picked / `outline`, `aria-pressed`); `lib/data/catalogue.ts` from §1 grew `buildLabel` ("Shopify Hydrogen", "WooCommerce"), `alsoOn` (the anticipation, platform-ordered) and `platformRank`
- Decided: the reference's three tab cards are kit `RadioTiles` (`grid`, 3 columns from `sm`, no mark, aside "3 platforms", the build list as the line); each family remembers its own picked build; under `sm` the switcher's branches read Hydrogen / Headless so they fit the line; the lede and the first row hold `min-h` so a pick never moves the page under it
- Check: waits on request 1 (VersionChip mono)

### 4 · Proof · v1
- Made: `components/home/proof.tsx` — heading with the as-of lede, four staggered figure blocks (sales with the best seller computed, rating, selling since with the author level, items with the catalogue counts), the platforms as flat ink wordmarks with a line of context
- Decided: the four blocks are one accent set at /20 — peach, lime, sky, iris — with ink type on them (the eyebrow takes `eyebrowClass` + `text-foreground` on the tint); the reference's corner squares are peach /35 on the first block (Frame); the platform row is set as wordmarks in the body face, no logo files
- Check: clean
