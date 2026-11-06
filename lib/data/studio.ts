import { author } from "@/lib/data/projects";
import { formatMonth, formatNumber } from "@/lib/format";

// Who the studio is and what it works with, read by the home page's About and
// Stack sections and by the CV, so the page and the PDF never tell two stories.

/** The three paragraphs of About. The first is set in the page's ink. */
export const about = [
  "I design and build website templates for storefronts, booking sites, magazines and marketplaces, and sell them on ThemeForest, UI8 and here.",
  "AI agents draw my first layouts, using skills I write for them. The weeks after go into what no draft gets right: the spacing, the type, the states.",
  "Need a site no template covers? I’ll design and build it for you.",
];

/** ThemeForest's own figures for the author page, and the month they were read. */
export const figures: [string, string][] = [
  ["Selling since", formatMonth(author.since)],
  ["Author level", author.level],
  ["Sales", formatNumber(author.sales)],
  ["Average rating", `${author.rating.toFixed(2)} from ${author.ratings}`],
];
export const figuresAsOf = `On ThemeForest, ${formatMonth(author.asOf)}`;

/** What I work with, by the part of the job it does. */
export const stack: [string, string[]][] = [
  ["Design", ["Figma", "Paper", "Framer"]],
  ["AI & agents", ["Claude", "Claude Code", "Agent skills", "MCP"]],
  ["Front end", ["Next.js", "React", "TypeScript"]],
  ["Styling", ["Tailwind CSS", "shadcn/ui", "Base UI"]],
  ["Platforms", ["WordPress", "WooCommerce", "Shopify Hydrogen"]],
  ["Shipping", ["Vercel", "GitHub", "Polar"]],
];

/** The CV, as the file the home page hands out. Rebuilt by `npm run cv`. */
export const cvFile = "/booliitheme-cv.pdf";
