import type { StaticImageData } from "next/image";

import bitpan2 from "@/images/work/bitpan2.png";
import chisfis2 from "@/images/work/chisfis2.png";
import ciscryp2 from "@/images/work/ciscryp2.png";
import ciseco2 from "@/images/work/ciseco2.png";
import cisecoFse2 from "@/images/work/cisecoFSE2.png";
import cisecoH2 from "@/images/work/cisecoh2.png";
import cisecoH22 from "@/images/work/cisecoh2-2.png";
import ncmaz2 from "@/images/work/ncmaz2.png";
import ncmazFaust2 from "@/images/work/ncmazfaust2.png";
import ncmazFse2 from "@/images/work/ncmazfse2.png";
import bitpanWoocommerceLiveDesktop from "@/images/live/bitpan-woocommerce-desktop.jpg";
import bitpanWoocommerceLiveMobile from "@/images/live/bitpan-woocommerce-mobile.jpg";
import cisecoWoocommerceLiveDesktop from "@/images/live/ciseco-woocommerce-desktop.jpg";
import cisecoWoocommerceLiveMobile from "@/images/live/ciseco-woocommerce-mobile.jpg";
import ncmazWordpressLiveDesktop from "@/images/live/ncmaz-wordpress-desktop.jpg";
import ncmazWordpressLiveMobile from "@/images/live/ncmaz-wordpress-mobile.jpg";
import ncmazHeadlessWordpressLiveDesktop from "@/images/live/ncmaz-headless-wordpress-desktop.jpg";
import ncmazHeadlessWordpressLiveMobile from "@/images/live/ncmaz-headless-wordpress-mobile.jpg";
import ncmazLiveDesktop from "@/images/live/ncmaz-desktop.jpg";
import ncmazLiveMobile from "@/images/live/ncmaz-mobile.jpg";
import cisecoLiveDesktop from "@/images/live/ciseco-desktop.jpg";
import cisecoLiveMobile from "@/images/live/ciseco-mobile.jpg";
import chisfisLiveDesktop from "@/images/live/chisfis-desktop.jpg";
import chisfisLiveMobile from "@/images/live/chisfis-mobile.jpg";
import bitpanLiveDesktop from "@/images/live/bitpan-desktop.jpg";
import bitpanLiveMobile from "@/images/live/bitpan-mobile.jpg";
import ciscrypLiveDesktop from "@/images/live/ciscryp-desktop.jpg";
import ciscrypLiveMobile from "@/images/live/ciscryp-mobile.jpg";
import ofenLiveDesktop from "@/images/live/ofen-desktop.jpg";
import ofenLiveMobile from "@/images/live/ofen-mobile.jpg";
import saalLiveDesktop from "@/images/live/saal-desktop.jpg";
import saalLiveMobile from "@/images/live/saal-mobile.jpg";
import waypointLiveDesktop from "@/images/live/waypoint-desktop.jpg";
import waypointLiveMobile from "@/images/live/waypoint-mobile.jpg";
import doorlistLiveDesktop from "@/images/live/doorlist-desktop.jpg";
import doorlistLiveMobile from "@/images/live/doorlist-mobile.jpg";
import ceepiiLiveDesktop from "@/images/live/ceepii-desktop.jpg";
import ceepiiLiveMobile from "@/images/live/ceepii-mobile.jpg";
import loopmereLiveDesktop from "@/images/live/loopmere-desktop.jpg";
import loopmereLiveMobile from "@/images/live/loopmere-mobile.jpg";

// Every figure below is one ThemeForest shows publicly, read off an archived
// copy of the page named in `asOf` — the live pages sit behind a bot wall.
// A field left out is one no page showed; the UI prints nothing in its place
// rather than a guess.

export type Platform = "nextjs" | "wordpress" | "shopify";
export type Industry = "ecommerce" | "booking" | "magazine" | "nft" | "real-estate" | "education" | "events" | "media";
export type Family = "ciseco" | "ncmaz" | "bitpan" | "chisfis" | "ciscryp" | "ofen" | "saal" | "waypoint" | "doorlist" | "loopmere" | "ceepii";

export const platforms: Record<Platform, string> = {
  nextjs: "Next.js",
  wordpress: "WordPress",
  shopify: "Shopify",
};

export const industries: Record<Industry, string> = {
  ecommerce: "Ecommerce",
  booking: "Booking",
  magazine: "Blog & magazine",
  nft: "NFT marketplace",
  "real-estate": "Real estate",
  education: "Education",
  events: "Events & tickets",
  media: "Media",
};

export type Dependency = { name: string; version?: string };

export type Market = {
  url: string;
  price?: number;
  sales?: number;
  rating?: number;
  ratings?: number;
  updated?: string;
  asOf: string;
};

export type Project = {
  slug: string;
  name: string;
  family: Family;
  /** What the platform switcher calls this build of the family's design. */
  build: string;
  platforms: Platform[];
  industry: Industry;
  tagline: string;
  /** Two sentences on who the template is for and what it does, shown when
   *  it is opened. */
  about: string;
  demo: string;
  /** The home page first; a second shot, when there is one, is an inner page. */
  shots: StaticImageData[];
  /** The live demo captured at 1440 × 900 and 390 × 844, shown in the device
   *  mockup. Absent while a demo is down. */
  live?: { desktop: StaticImageData; mobile: StaticImageData };
  stack: Dependency[];
  isNew?: boolean;
  /** The Polar checkout every Buy button on the site goes to, and the price
   *  it charges in USD. */
  checkout?: { url: string; price: number };
  /** A site of the studio's own, shown beside the templates and not for sale. */
  personal?: boolean;
  market: Market;
};

const tf = (path: string) => `https://themeforest.net/item/${path}`;
const polar = (link: string, price: number) => ({ url: `https://buy.polar.sh/${link}`, price });

/** What the site asks for a template: its Polar price, else its marketplace price. */
export const priceOf = (p: Project) => p.checkout?.price ?? p.market.price;

/** Newest first — the order the catalogue opens on. */
export const projects: Project[] = [
  {
    slug: "doorlist",
    name: "Doorlist",
    family: "doorlist",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "events",
    tagline: "Event ticketing marketplace template",
    about:
      "Doorlist is for a ticket marketplace. Visitors search by what, where and when, open an event and choose their tickets.",
    demo: "https://doorlist-eight.vercel.app",
    shots: [doorlistLiveDesktop],
    live: { desktop: doorlistLiveDesktop, mobile: doorlistLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    isNew: true,
    checkout: polar("polar_cl_gRBg19pFFQbrN5TFAJQVI09p6Y2oHRs749tBw2ZJqws", 49),
    market: {
      url: "https://themeforest.net/user/booliitheme",
      price: 49,
      asOf: "2026-10-21",
    },
  },
  {
    slug: "waypoint",
    name: "Waypoint",
    family: "waypoint",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "education",
    tagline: "AI course marketplace template",
    about:
      "Waypoint is for an online course marketplace with an AI tutor beside every lesson. Learners find a course by subject and ask questions while they watch.",
    demo: "https://waypoint-puce-seven.vercel.app",
    shots: [waypointLiveDesktop],
    live: { desktop: waypointLiveDesktop, mobile: waypointLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    checkout: polar("polar_cl_ChFvoSYiZKrUXfVh1d40ecmMQFrM9K4o1ukER3wJZO2", 39),
    market: {
      url: "https://themeforest.net/user/booliitheme",
      price: 49,
      asOf: "2026-10-21",
    },
  },
  {
    slug: "ofen",
    name: "Ofen",
    family: "ofen",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "real-estate",
    tagline: "Real estate brokerage template",
    about:
      "Ofen is for a residential brokerage, an estate agency or a property listing site. Twelve routes ship built and filled, with search, a compare frame, a viewing scheduler and a payment calculator.",
    demo: "https://template-ofen.vercel.app",
    shots: [ofenLiveDesktop],
    live: { desktop: ofenLiveDesktop, mobile: ofenLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    checkout: polar("polar_cl_jvuNIyDeM1vIt29es6yLhvA25Iwio8VU5rCiV4Sxvn1", 39),
    market: {
      url: "https://themeforest.net/user/booliitheme",
      price: 39,
      asOf: "2026-10-21",
    },
  },
  {
    slug: "saal",
    name: "Saal",
    family: "saal",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "education",
    tagline: "Tutor marketplace template",
    about:
      "Saal is a directory of tutors rather than a catalogue of courses. Visitors filter a roster, read profiles, compare three side by side and book a slot from a real availability grid.",
    demo: "https://template-saal.vercel.app",
    shots: [saalLiveDesktop],
    live: { desktop: saalLiveDesktop, mobile: saalLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    checkout: polar("polar_cl_BW7YSAPrUkVLE13S7Dl5X9nGnvw0QjURV0t9v0IBK79", 39),
    market: {
      url: "https://themeforest.net/user/booliitheme",
      price: 39,
      asOf: "2026-10-21",
    },
  },
  {
    slug: "ceepii",
    name: "Ceepii",
    family: "ceepii",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "booking",
    tagline: "Stays, cars and flights booking template",
    about:
      "Ceepii is for a booking site that rents stays, cars and experiences and sells flights. Each of the four has its own home, search, category and listing pages, with an add-listing flow, account pages and right-to-left support.",
    demo: "https://ceepii-nextjs-template.vercel.app",
    shots: [ceepiiLiveDesktop],
    live: { desktop: ceepiiLiveDesktop, mobile: ceepiiLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    checkout: polar("polar_cl_r0L4rCW06jNlucvhgPVMIg1UiafyQbyuUKCmX4dFrOJ", 39),
    market: {
      url: "https://themeforest.net/user/booliitheme",
      asOf: "2026-11-06",
    },
  },
  {
    slug: "bitpan-woocommerce",
    name: "Bitpan WooCommerce",
    family: "bitpan",
    build: "WooCommerce block theme",
    platforms: ["wordpress"],
    industry: "ecommerce",
    tagline: "Multipurpose WooCommerce block theme",
    about:
      "Bitpan's design as a WooCommerce block theme. The whole shop is edited in the WordPress site editor, with no page builder.",
    demo: "https://bitpan-fse.booliitheme.com",
    shots: [bitpanWoocommerceLiveDesktop, bitpan2],
    live: { desktop: bitpanWoocommerceLiveDesktop, mobile: bitpanWoocommerceLiveMobile },
    stack: [
      { name: "WordPress", version: "6.9" },
      { name: "WooCommerce", version: "10.4" },
      { name: "Full Site Editing" },
      { name: "Interactivity API" },
    ],
    isNew: true,
    checkout: polar("polar_cl_wbxS6yMPU9b1ykSe87Bd2FpxjP8V6pc48JDzS42ADqA", 39),
    market: {
      url: tf("bitpan-multipurpose-woocommerce-fse-block-theme/60678648"),
      price: 39,
      sales: 8,
      updated: "2025-12-12",
      asOf: "2026-01-28",
    },
  },
  {
    slug: "ciseco-woocommerce",
    name: "Ciseco WooCommerce",
    family: "ciseco",
    build: "WooCommerce block theme",
    platforms: ["wordpress"],
    industry: "ecommerce",
    tagline: "Multipurpose WooCommerce block theme",
    about:
      "Ciseco's design as a WooCommerce block theme, for a shop that runs on WordPress. Every template and part is edited in the site editor.",
    demo: "https://ciseco-fse.booliitheme.com",
    shots: [cisecoWoocommerceLiveDesktop, cisecoFse2],
    live: { desktop: cisecoWoocommerceLiveDesktop, mobile: cisecoWoocommerceLiveMobile },
    stack: [
      { name: "WordPress", version: "6.9" },
      { name: "WooCommerce", version: "10.4" },
      { name: "Full Site Editing" },
      { name: "Interactivity API" },
    ],
    isNew: true,
    checkout: polar("polar_cl_fizjgo16XKrRTLAmhjwjyg5LUc58hMJWhQUcY11Z6bk", 39),
    market: {
      url: tf("ciseco-multipurpose-woocommerce-fse-block-theme/60978921"),
      asOf: "2026-01-28",
    },
  },
  {
    slug: "ncmaz-wordpress",
    name: "Ncmaz WordPress",
    family: "ncmaz",
    build: "WordPress block theme",
    platforms: ["wordpress"],
    industry: "magazine",
    tagline: "News and magazine block theme",
    about:
      "Ncmaz as a WordPress block theme, for a blog, a news site or a magazine. Writers stay in the WordPress editor they already know.",
    demo: "https://ncmaz-fse.booliitheme.com",
    shots: [ncmazWordpressLiveDesktop, ncmazFse2],
    live: { desktop: ncmazWordpressLiveDesktop, mobile: ncmazWordpressLiveMobile },
    stack: [
      { name: "WordPress", version: "6.8" },
      { name: "Full Site Editing" },
      { name: "Gutenberg blocks" },
      { name: "Interactivity API" },
    ],
    checkout: polar("polar_cl_qQX5vqOnvDlh7JAXnxs85yCmEx6KNhn41VaIX2WjA6s", 39),
    market: {
      url: tf("ncmaz-blog-magazine-wordpress-theme/34122841"),
      price: 39,
      sales: 866,
      rating: 4.65,
      ratings: 57,
      updated: "2024-07-25",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "ncmaz-headless-wordpress",
    name: "Ncmaz Headless",
    family: "ncmaz",
    build: "Headless WordPress",
    platforms: ["nextjs", "wordpress"],
    industry: "magazine",
    tagline: "Next.js front end for a headless WordPress",
    about:
      "Ncmaz's front end in Next.js, reading its posts from a headless WordPress. Editors keep WordPress; readers get a fast site.",
    demo: "https://ncmaz-faust-delta.vercel.app",
    shots: [ncmazHeadlessWordpressLiveDesktop, ncmazFaust2],
    live: { desktop: ncmazHeadlessWordpressLiveDesktop, mobile: ncmazHeadlessWordpressLiveMobile },
    stack: [
      { name: "WordPress", version: "6.8" },
      { name: "Next.js", version: "14" },
      { name: "Tailwind CSS", version: "3" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_WgG1OzbF7yUX8oq1dY2aZrA1B8uv99MClwq7b0DS472", 49),
    market: {
      url: tf("ncmaz-nextjs-headless-wordpress-blog-magazine/47815656"),
      price: 49,
      sales: 341,
      rating: 4.38,
      ratings: 16,
      updated: "2024-08-02",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "ciseco-hydrogen",
    name: "Ciseco Hydrogen",
    family: "ciseco",
    build: "Shopify Hydrogen",
    platforms: ["shopify"],
    industry: "ecommerce",
    tagline: "Headless storefront for Shopify Hydrogen",
    about:
      "Ciseco as a headless Shopify storefront on Hydrogen. Products, cart and checkout come from the Shopify store behind it.",
    demo: "https://ciseco-nextjs.vercel.app",
    shots: [cisecoH2, cisecoH22],
    stack: [
      { name: "Shopify Hydrogen" },
      { name: "React", version: "18" },
      { name: "Tailwind CSS", version: "3" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_yz7wtrLEevKorf9wHXE6Q7SquNaL9CDIIQmPW1zP6Mj", 49),
    market: {
      url: tf("ciseco-hydrogen-shopifys-headless-storefront-template/52088296"),
      price: 49,
      sales: 106,
      updated: "2024-07-31",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "ncmaz",
    name: "Ncmaz",
    family: "ncmaz",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "magazine",
    tagline: "Blog, news and magazine template",
    about:
      "Ncmaz is a Next.js template for a blog, a news site or a magazine. It ships home layouts with category, author and article pages.",
    demo: "https://ncmaz-nextjs.vercel.app",
    shots: [ncmazLiveDesktop, ncmaz2],
    live: { desktop: ncmazLiveDesktop, mobile: ncmazLiveMobile },
    stack: [
      { name: "Next.js", version: "14" },
      { name: "React", version: "18" },
      { name: "Tailwind CSS", version: "3" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_L70X4wesYPQCQFWcjfIg18CFWhGWvmN99HaqO0MMK5p", 39),
    market: {
      url: tf("ncmaz-blog-news-magazine-nextjs-template/44412092"),
      price: 29,
      sales: 486,
      rating: 4.43,
      ratings: 7,
      updated: "2023-11-19",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "ciseco",
    name: "Ciseco",
    family: "ciseco",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "ecommerce",
    tagline: "Shop and ecommerce template",
    about:
      "Ciseco is a Next.js template for an online shop. It covers collections, product pages, the cart and checkout.",
    demo: "https://ciseco-nextjs.vercel.app",
    shots: [cisecoLiveDesktop, ciseco2],
    live: { desktop: cisecoLiveDesktop, mobile: cisecoLiveMobile },
    stack: [
      { name: "Next.js", version: "15" },
      { name: "React", version: "19" },
      { name: "Tailwind CSS", version: "4" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_9lk6dfw8VeQ8meZJnt4Xd23D5BokEUZHOolno2dzDZf", 39),
    market: {
      url: tf("ciseco-shop-ecommerce-nextjs-template/44210635"),
      price: 29,
      sales: 663,
      rating: 4.5,
      ratings: 10,
      updated: "2024-05-17",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "chisfis",
    name: "Chisfis",
    family: "chisfis",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "booking",
    tagline: "Online booking template for stays, cars and experiences",
    about:
      "Chisfis is a Next.js booking template for stays, car rentals and experiences. It runs from search to listing to checkout.",
    demo: "https://chisfis-nextjs.vercel.app",
    shots: [chisfisLiveDesktop, chisfis2],
    live: { desktop: chisfisLiveDesktop, mobile: chisfisLiveMobile },
    stack: [
      { name: "Next.js", version: "15" },
      { name: "React", version: "19" },
      { name: "Tailwind CSS", version: "4" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_OXvYo8NIarrH6Xl5RXktEPbL7S212cZbl9ByX05S1SA", 39),
    market: {
      url: tf("chisfis-online-booking-nextjs-template/43399526"),
      price: 29,
      sales: 894,
      rating: 4.45,
      ratings: 20,
      updated: "2024-07-20",
      asOf: "2026-03-24",
    },
  },
  {
    slug: "bitpan",
    name: "Bitpan",
    family: "bitpan",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "ecommerce",
    tagline: "Multipurpose ecommerce template",
    about:
      "Bitpan is a multipurpose ecommerce template in Next.js. Its pages suit a shop of almost any kind.",
    demo: "https://bitpan-ecommerce-nextjs-template.vercel.app",
    shots: [bitpanLiveDesktop, bitpan2],
    live: { desktop: bitpanLiveDesktop, mobile: bitpanLiveMobile },
    stack: [
      { name: "Next.js", version: "15" },
      { name: "React", version: "19" },
      { name: "Tailwind CSS", version: "4" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_s2L3FaBAvpxrWOH1SMUobhbKUfUtqfzy9eiyA06o2fw", 39),
    market: {
      url: tf("bitpan-multipurpose-ecommerce-nextjs-template/57992846"),
      price: 29,
      sales: 6,
      asOf: "2025-08-20",
    },
  },
  {
    slug: "ciscryp",
    name: "Ciscryp",
    family: "ciscryp",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "nft",
    tagline: "NFT marketplace template",
    about:
      "Ciscryp is a Next.js template for an NFT marketplace. It covers collections, item pages and creator profiles.",
    demo: "https://ciscryp-nextjs.vercel.app",
    shots: [ciscrypLiveDesktop, ciscryp2],
    live: { desktop: ciscrypLiveDesktop, mobile: ciscrypLiveMobile },
    stack: [
      { name: "Next.js", version: "14" },
      { name: "React", version: "18" },
      { name: "Tailwind CSS", version: "3" },
      { name: "TypeScript", version: "5" },
    ],
    checkout: polar("polar_cl_LfmyzTro1CWZV5ZtBr03fbu8GLz6jRO7SNcLR4XBoAo", 39),
    market: {
      url: tf("ciscryp-nft-marketplace-react-template/36906743"),
      price: 19,
      sales: 408,
      rating: 4.29,
      ratings: 7,
      updated: "2023-11-19",
      asOf: "2025-08-20",
    },
  },
  {
    slug: "loopmere",
    name: "Loopmere",
    family: "loopmere",
    build: "Next.js",
    platforms: ["nextjs"],
    industry: "media",
    tagline: "A site for listening to ambient mixes",
    about:
      "Loopmere is a site of my own, not a template: a place to listen to ambient mixes, or to make one by setting each sound's level and letting it play.",
    demo: "https://loopmere.vercel.app",
    shots: [loopmereLiveDesktop],
    live: { desktop: loopmereLiveDesktop, mobile: loopmereLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    personal: true,
    market: {
      url: "https://themeforest.net/user/booliitheme",
      asOf: "2026-10-21",
    },
  },
];

/** The studio on ThemeForest, read off its archived profile. */
export const author = {
  url: "https://themeforest.net/user/booliitheme",
  sales: 6126,
  rating: 4.61,
  ratings: 217,
  items: 12,
  since: "2021-06",
  level: "Elite Author",
  asOf: "2026-03-24",
};

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

/** The family's other builds — the platform switcher's options. */
export const familyOf = (project: Project) =>
  projects.filter((p) => p.family === project.family);

export const families = (["ciseco", "ncmaz", "bitpan"] as const).map((family) => ({
  family,
  builds: projects.filter((p) => p.family === family),
}));
