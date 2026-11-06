import { author } from "@/lib/data/projects";
import { formatMonth, formatNumber } from "@/lib/format";

// Who the studio is and what it works with, read by the home page's About and
// Stack sections and by the CV, so the page and the PDF never tell two stories.

/** The three paragraphs of About. The first is set in the page's ink. */
export const about = [
  "We design and build website templates for storefronts, booking sites, magazines and marketplaces, and sell them on ThemeForest, UI8 and here.",
  "AI draws our first layouts. The weeks after go into what a draft gets wrong: the spacing, the type, and the states a buyer only finds after an hour of use.",
  "When a team needs a site that no template covers, we design and build it for them, from the very first sketch to the day it launches.",
];

/** ThemeForest's own figures for the author page, and the month they were read. */
export const figures: [string, string][] = [
  ["Selling since", formatMonth(author.since)],
  ["Author level", author.level],
  ["Sales", formatNumber(author.sales)],
  ["Average rating", `${author.rating.toFixed(2)} from ${author.ratings}`],
];
export const figuresAsOf = `On ThemeForest, ${formatMonth(author.asOf)}`;

/** What we work with, by the part of the job it does. */
export const stack: [string, string[]][] = [
  ["Design", ["Figma", "Claude"]],
  ["Front end", ["Next.js", "React", "TypeScript"]],
  ["Styling", ["Tailwind CSS", "shadcn/ui", "Base UI"]],
  ["Platforms", ["WordPress", "WooCommerce", "Shopify Hydrogen"]],
  ["Shipping", ["Vercel", "GitHub", "Polar"]],
];

/** The CV, as the file the home page hands out. Rebuilt by `npm run cv`. */
export const cvFile = "/booliitheme-cv.pdf";
