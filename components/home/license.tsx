// ref: pricing-sections/two-tier-pair-in-one-shell-with-the-featured-tier-inverted.jpeg — panel 2-tier · right-heavy (departed: a centred eyebrow, heading and lede over the shell, which the reference has no slot for)
// opens: panel · light
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import {
  Cancel01Icon,
  CustomerSupportIcon,
  Download04Icon,
  LicenseIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fragment, type ReactNode } from "react";

import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { joinList, priceRange, regularLicense } from "@/lib/data/catalogue";
import { projects } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

const LICENSE_URL = "https://themeforest.net/licenses/standard";

type Row = { can: boolean; text: string };

type Tier = {
  id: string;
  name: string;
  forWho: string;
  figure: string;
  figureNote: string;
  price: ReactNode;
  priceNote: string;
  fine: ReactNode;
  action: { label: string; href: string };
  promo: { icon: typeof Tick02Icon; title: string; body: string; className: string };
  rows: Row[];
};

const { min, max, lowest, highest } = priceRange;
const verb = (names: string[]) => (names.length > 1 ? "are" : "is");
const middle = projects.filter((p) => p.market.price != null && p.market.price !== min && p.market.price !== max);
const middlePrices = [...new Set(middle.map((p) => p.market.price!))].sort((a, b) => a - b);

const tiers: Tier[] = [
  {
    id: "regular",
    name: "Regular license",
    forWho: "For a site you build for yourself or one client",
    figure: "1 site",
    figureNote: "Free for its visitors: a store, a magazine, a blog",
    price: (
      <>
        <span className="whitespace-nowrap">
          <Price amount={min} />
          <span aria-hidden="true">–</span>
          <span className="sr-only"> to </span>
          <Price amount={max} />
        </span>
      </>
    ),
    priceNote: regularLicense,
    fine: (
      <>
        {joinList(lowest)} {verb(lowest)} <Price amount={min} className="text-foreground" />, {joinList(highest)}{" "}
        {verb(highest)} <Price amount={max} className="text-foreground" />, and the other {middle.length}{"\u00a0"}templates
        sit at{" "}
        {middlePrices.map((n, i) => (
          <Fragment key={n}>
            {i > 0 ? (i === middlePrices.length - 1 ? " or " : ", ") : null}
            <Price amount={n} className="text-foreground" />
          </Fragment>
        ))}
        .
      </>
    ),
    action: { label: "Browse templates", href: "#templates" },
    promo: {
      icon: CustomerSupportIcon,
      title: "6 months of support included",
      body: "Ask us on the item page's Support tab. Extend to 12 months at checkout or later.",
      className: "bg-muted",
    },
    rows: [
      { can: true, text: "Build one site, for yourself or one client" },
      { can: true, text: "Charge your client for building it" },
      { can: true, text: "Change any design, code or content" },
      { can: true, text: "Every future update, from your Downloads page" },
      { can: false, text: "Charge visitors to use the site" },
      { can: false, text: "Reuse it on a second site" },
    ],
  },
  {
    id: "extended",
    name: "Extended license",
    forWho: "For one product your end users pay to use",
    figure: "1 product",
    figureNote: "Its end users pay to use it: a SaaS, a membership",
    price: "On the item page",
    priceNote: "Each item page lists it beside Regular",
    fine: "A charge for a download, a login or a subscription is what moves a product from Regular to Extended.",
    action: { label: "Ask before you buy", href: "#contact" },
    promo: {
      icon: Download04Icon,
      title: "Every future update included",
      body: "Download each new version again from your Downloads page on ThemeForest.",
      className: "bg-leaf/15",
    },
    rows: [
      { can: true, text: "Build one product your end users pay for" },
      { can: true, text: "Sell memberships, subscriptions or access" },
      { can: true, text: "Change any design, code or content" },
      { can: true, text: "6 months of support, extendable to 12" },
      { can: false, text: "Resell the template itself, edited or not" },
      { can: false, text: "Reuse it in a second product" },
    ],
  },
];

// Two licenses in one shell, read row against row: who each is for, how many
// end products it covers, the price, the fine print with the license's own
// text, an action, the inclusion it leads with, and what it allows and does
// not. Extended is the inverted tier, as the reference inverts its upper one;
// it wears the dark half's tokens through its own `dark` class. From `md` the
// two share the shell's rows (subgrid), so every part starts level with its
// counterpart whatever the copy runs to.
export function License() {
  return (
    <section id="license" aria-labelledby="license-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Eyebrow>License &amp; support</Eyebrow>
        <SectionHeading id="license-title" className="mt-4 text-balance">
          Building for a client?
          <br className="max-sm:hidden" /> One Regular license per site
        </SectionHeading>
        <Lede className="mt-5 max-w-xl text-balance">
          Envato writes the terms and sells both licenses on ThemeForest. Questions about a template you bought come to
          us, through its item page.
        </Lede>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-2 rounded-xl border-6 border-muted bg-background p-2 sm:mt-16 md:grid-cols-2 md:gap-y-0">
        {tiers.map((t, i) => (
          <TierColumn key={t.id} tier={t} inverted={i === 1} />
        ))}
      </div>
    </section>
  );
}

function TierColumn({ tier: t, inverted }: { tier: Tier; inverted: boolean }) {
  const titleId = `license-${t.id}`;
  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col rounded-md p-5 text-foreground sm:p-8 md:row-span-7 md:grid md:grid-rows-subgrid lg:p-10",
        inverted && "dark bg-card shadow-soft-lg",
      )}
    >
      <header>
        <h3 id={titleId} className="font-heading text-2xl font-medium tracking-tight">
          {t.name}
        </h3>
        <p className="mt-2 text-muted-foreground">{t.forWho}</p>
        <Badge className="mt-5">
          <HugeiconsIcon icon={LicenseIcon} strokeWidth={2} aria-hidden="true" />
          Envato license
        </Badge>
      </header>

      <div className="pt-8">
        <p className="font-heading text-4xl tracking-tighter">{t.figure}</p>
        <p className="mt-2">{t.figureNote}</p>
      </div>

      <div className="pt-8">
        <p className="font-heading text-2xl font-medium tracking-tight">{t.price}</p>
        <p className="mt-1 text-muted-foreground">{t.priceNote}</p>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-muted-foreground">{t.fine}</p>
        <Button
          variant="link"
          size="sm"
          render={<a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
          className="mt-1"
        >
          Read the full license
          <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
          <span className="sr-only">on ThemeForest (opens in a new tab)</span>
        </Button>
      </div>

      <div className="pt-6">
        <Button render={<a href={t.action.href} />} nativeButton={false} className="w-full">
          {t.action.label}
        </Button>
      </div>

      <div className="pt-6">
        <div className={cn("flex h-full flex-col gap-4 rounded-sm p-4 sm:flex-row sm:p-5", t.promo.className)}>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card">
            <HugeiconsIcon icon={t.promo.icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <h4 className="font-medium">{t.promo.title}</h4>
            <p className="mt-1 text-muted-foreground">{t.promo.body}</p>
          </div>
        </div>
      </div>

      <ul aria-label={`What the ${t.name} allows`} className="flex flex-col gap-3 pt-8">
        {t.rows.map((r) => (
          <li key={r.text} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={r.can ? Tick02Icon : Cancel01Icon}
              size={18}
              strokeWidth={1.5}
              aria-hidden="true"
              className={cn("mt-0.5 shrink-0", r.can ? "text-foreground" : "text-muted-foreground")}
            />
            <span className={cn(!r.can && "text-muted-foreground")}>
              <span className="sr-only">{r.can ? "Allowed: " : "Not allowed: "}</span>
              {r.text}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
