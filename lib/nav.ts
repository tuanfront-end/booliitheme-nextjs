import { author } from "@/lib/data/projects";

// Every place the chrome links to, read by the header and the footer, so the
// two never disagree about where something lives.

export const sections = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/#templates" },
  { label: "Write to us", href: "/#contact" },
] as const;

export const marketplaces = [
  { label: "ThemeForest", href: author.url },
  { label: "UI8", href: "https://ui8.net/booliitheme/products" },
];

export const socials = [
  { label: "Dribbble", href: "https://dribbble.com/booliitheme/" },
  { label: "X", href: "https://x.com/BooliiT62007" },
  { label: "Facebook", href: "https://www.facebook.com/people/Booliitheme/61577223687643/" },
];

export const email = "booliitheme@gmail.com";
