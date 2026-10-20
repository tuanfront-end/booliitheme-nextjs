import { author, platforms, projects, type Platform } from "@/lib/data/projects";

// Every route and anchor the chrome links to, read by the header, its mobile
// drawer and the footer, so the three never disagree about where a page lives.

export const studioLinks = [
  { label: "Templates", href: "/#templates" },
  { label: "Families", href: "/#families" },
  { label: "License", href: "/#license" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

/** The header bar's own links, after the Templates trigger. */
export const barLinks = studioLinks.filter((l) => ["Families", "License", "Contact"].includes(l.label));

export const marketplaces = [
  { label: "ThemeForest", href: author.url },
  { label: "UI8", href: "https://ui8.net/booliitheme/products" },
];

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/people/Booliitheme/61577223687643/" },
  { label: "X", href: "https://x.com/BooliiT62007" },
  { label: "Dribbble", href: "https://dribbble.com/booliitheme/" },
];

export const email = "booliitheme@gmail.com";

// A headless build appears once, under the platform its buyer installs it on —
// Ncmaz Headless is a WordPress site with a Next.js front end, and the person
// looking for it is looking under WordPress.
const home: Record<string, Platform> = { "ncmaz-headless-wordpress": "wordpress" };

export const templatesByPlatform = (Object.keys(platforms) as Platform[]).map((platform) => ({
  platform,
  label: platforms[platform],
  items: projects.filter((p) => (home[p.slug] ?? p.platforms[0]) === platform),
}));

export const newest = projects[0];
