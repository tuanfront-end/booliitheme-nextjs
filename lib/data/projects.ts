import type { StaticImageData } from "next/image";

import bitpan from "@/images/work/bitpan.png";
import bitpan2 from "@/images/work/bitpan2.png";
import chisfis from "@/images/work/chisfis.png";
import chisfis2 from "@/images/work/chisfis2.png";
import ciscryp from "@/images/work/ciscryp.png";
import ciscryp2 from "@/images/work/ciscryp2.png";
import ciseco from "@/images/work/ciseco.png";
import ciseco2 from "@/images/work/ciseco2.png";
import cisecoFse from "@/images/work/cisecoFSE1.png";
import cisecoFse2 from "@/images/work/cisecoFSE2.png";
import cisecoH2 from "@/images/work/cisecoh2.png";
import cisecoH22 from "@/images/work/cisecoh2-2.png";
import ncmaz from "@/images/work/ncmaz.png";
import ncmaz2 from "@/images/work/ncmaz2.png";
import ncmazFaust from "@/images/work/ncmazfaust.png";
import ncmazFaust2 from "@/images/work/ncmazfaust2.png";
import ncmazFse from "@/images/work/ncmazfse.png";
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
import loopmereLiveDesktop from "@/images/live/loopmere-desktop.jpg";
import loopmereLiveMobile from "@/images/live/loopmere-mobile.jpg";

// Every figure below is one ThemeForest shows publicly, read off an archived
// copy of the page named in `asOf` — the live pages sit behind a bot wall.
// A field left out is one no page showed; the UI prints nothing in its place
// rather than a guess.

export type Platform = "nextjs" | "wordpress" | "shopify";
export type Industry = "ecommerce" | "booking" | "magazine" | "nft" | "real-estate" | "education" | "events" | "media";
export type Family = "ciseco" | "ncmaz" | "bitpan" | "chisfis" | "ciscryp" | "ofen" | "saal" | "waypoint" | "doorlist" | "loopmere";

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
  demo: string;
  /** The home page first; a second shot, when there is one, is an inner page. */
  shots: StaticImageData[];
  /** The live demo captured at 1440 × 900 and 390 × 844, shown in the device
   *  mockup. Absent while a demo is down. */
  live?: { desktop: StaticImageData; mobile: StaticImageData };
  stack: Dependency[];
  isNew?: boolean;
  /** The Polar checkout every Buy button on the site goes to. */
  checkout?: string;
  /** A site of the studio's own, shown beside the templates and not for sale. */
  personal?: boolean;
  market: Market;
};

const tf = (path: string) => `https://themeforest.net/item/${path}`;

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
    demo: "https://doorlist-eight.vercel.app",
    shots: [doorlistLiveDesktop],
    live: { desktop: doorlistLiveDesktop, mobile: doorlistLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    isNew: true,
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
    demo: "https://waypoint-puce-seven.vercel.app",
    shots: [waypointLiveDesktop],
    live: { desktop: waypointLiveDesktop, mobile: waypointLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
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
    demo: "https://template-ofen.vercel.app",
    shots: [ofenLiveDesktop],
    live: { desktop: ofenLiveDesktop, mobile: ofenLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
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
    demo: "https://template-saal.vercel.app",
    shots: [saalLiveDesktop],
    live: { desktop: saalLiveDesktop, mobile: saalLiveMobile },
    stack: [{ name: "Next.js", version: "16.3" }, { name: "React", version: "19" }, { name: "Tailwind CSS", version: "4" }],
    market: {
      url: "https://themeforest.net/user/booliitheme",
      price: 39,
      asOf: "2026-10-21",
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
    demo: "https://bitpan-fse.booliitheme.com",
    shots: [bitpan, bitpan2],
    live: { desktop: bitpanWoocommerceLiveDesktop, mobile: bitpanWoocommerceLiveMobile },
    stack: [
      { name: "WordPress", version: "6.9" },
      { name: "WooCommerce", version: "10.4" },
      { name: "Full Site Editing" },
      { name: "Interactivity API" },
    ],
    isNew: true,
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
    demo: "https://ciseco-fse.booliitheme.com",
    shots: [cisecoFse, cisecoFse2],
    live: { desktop: cisecoWoocommerceLiveDesktop, mobile: cisecoWoocommerceLiveMobile },
    stack: [
      { name: "WordPress", version: "6.9" },
      { name: "WooCommerce", version: "10.4" },
      { name: "Full Site Editing" },
      { name: "Interactivity API" },
    ],
    isNew: true,
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
    demo: "https://ncmaz-fse.booliitheme.com",
    shots: [ncmazFse, ncmazFse2],
    live: { desktop: ncmazWordpressLiveDesktop, mobile: ncmazWordpressLiveMobile },
    stack: [
      { name: "WordPress", version: "6.8" },
      { name: "Full Site Editing" },
      { name: "Gutenberg blocks" },
      { name: "Interactivity API" },
    ],
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
    demo: "https://ncmaz-faust-delta.vercel.app",
    shots: [ncmazFaust, ncmazFaust2],
    live: { desktop: ncmazHeadlessWordpressLiveDesktop, mobile: ncmazHeadlessWordpressLiveMobile },
    stack: [
      { name: "WordPress", version: "6.8" },
      { name: "next", version: "14" },
      { name: "tailwindcss", version: "3" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://ciseco-h2.booliitheme.com",
    shots: [cisecoH2, cisecoH22],
    stack: [
      { name: "Shopify Hydrogen" },
      { name: "react", version: "18" },
      { name: "tailwindcss", version: "3" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://ncmaz-nextjs.vercel.app",
    shots: [ncmaz, ncmaz2],
    live: { desktop: ncmazLiveDesktop, mobile: ncmazLiveMobile },
    stack: [
      { name: "next", version: "14" },
      { name: "react", version: "18" },
      { name: "tailwindcss", version: "3" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://ciseco-nextjs.vercel.app",
    shots: [ciseco, ciseco2],
    live: { desktop: cisecoLiveDesktop, mobile: cisecoLiveMobile },
    stack: [
      { name: "next", version: "15" },
      { name: "react", version: "19" },
      { name: "tailwindcss", version: "4" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://chisfis-nextjs.vercel.app",
    shots: [chisfis, chisfis2],
    live: { desktop: chisfisLiveDesktop, mobile: chisfisLiveMobile },
    stack: [
      { name: "next", version: "15" },
      { name: "react", version: "19" },
      { name: "tailwindcss", version: "4" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://bitpan-ecommerce-nextjs-template.vercel.app",
    shots: [bitpan, bitpan2],
    live: { desktop: bitpanLiveDesktop, mobile: bitpanLiveMobile },
    stack: [
      { name: "next", version: "15" },
      { name: "react", version: "19" },
      { name: "tailwindcss", version: "4" },
      { name: "typescript", version: "5" },
    ],
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
    demo: "https://ciscryp-nextjs.vercel.app",
    shots: [ciscryp, ciscryp2],
    live: { desktop: ciscrypLiveDesktop, mobile: ciscrypLiveMobile },
    stack: [
      { name: "next", version: "14" },
      { name: "react", version: "18" },
      { name: "tailwindcss", version: "3" },
      { name: "typescript", version: "5" },
    ],
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
    tagline: "Ambient sound, mixed by you",
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
