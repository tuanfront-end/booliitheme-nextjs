// ref: pricing-sections/centred-toggle-three-cards-middle-raised-with-photo-header.png — centred-stack 3-col · focal centre
"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

import { reach } from "@/components/reach";
import { SectionHeading } from "@/components/site/section-heading";
import { photos } from "@/lib/data/photos";

type Tier = {
  name: string;
  blurb: string;
  monthly: number;
  cta: string;
  action: "quiet" | "current" | "primary";
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    blurb: "For hobbyists, students and early-stage creators.",
    monthly: 0,
    cta: "Current plan",
    action: "current",
    features: [
      "Access to the basic asset library",
      "15-second video animation",
      "Up to 10 scenes a month",
      "Watermarked exports",
      "Basic AI prompts",
    ],
  },
  {
    name: "Creator",
    blurb: "For creators and startups who need polish.",
    monthly: 20,
    cta: "Upgrade to Creator",
    action: "primary",
    features: [
      "Everything in Free",
      "Unlimited 3D scene generation",
      "Premium asset library",
      "Animations up to 30 seconds",
      "20+ video AI models",
    ],
  },
  {
    name: "Studio",
    blurb: "For teams and studios that need power and speed.",
    monthly: 40,
    cta: "Get Studio",
    action: "quiet",
    features: [
      "Everything in Creator",
      "Unlimited 3D scene generation",
      "Full premium asset library",
      "Animations up to 60 seconds",
      "Unlimited video AI models",
    ],
  },
];

// Inside the price box, which is bg-muted. A quiet button rises to the card
// colour rather than sitting on its own tint.
// The page's one primary action, so it takes the brand token rather than the
// ink one. It used to read bg-foreground, and under a near-black brand the two
// were a three-point difference nobody could see — which is how a bench whose
// job is judging a hue ended up drawing none of it. The split makes the
// mistake visible and the fix is the token that was always right.
const button = {
  quiet: "bg-card text-foreground",
  current: "bg-card text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
} as const;

export function PricingTiers() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24">
      <SectionHeading className="text-center">Choose your plan</SectionHeading>

      {/* The chip sits beside the track rather than inside it: a chip's fill is
          an alpha, so on the track's bg-muted this ink misses the floor. */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 rounded-control bg-muted p-1">
          {[
            { id: false, label: "Pay monthly" },
            { id: true, label: "Pay yearly" },
          ].map((option) => (
            <button
              key={String(option.id)}
              type="button"
              onClick={() => setYearly(option.id)}
              aria-pressed={yearly === option.id}
              className={
                yearly === option.id
                  ? `flex h-9 items-center rounded-[calc(var(--radius-control)-4px)] bg-card px-4 text-sm font-medium shadow-soft ${reach}`
                  : `flex h-9 items-center rounded-[calc(var(--radius-control)-4px)] px-4 text-sm text-muted-foreground transition-colors hover:text-foreground ${reach}`
              }
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="rounded-control bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf-ink">
          Save 20% yearly
        </span>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-start">
        {tiers.map((tier) => {
          const focal = tier.action === "primary";
          const price = yearly ? Math.round(tier.monthly * 0.8) : tier.monthly;

          // A tier is a product object: its blurb and its feature list are
          // the plan's data, set at 14 — which is what `data-object` says.
          return (
            <div
              key={tier.name}
              data-object
              className={
                focal
                  ? "overflow-hidden rounded-lg bg-muted shadow-soft-lg md:-mt-6 md:-mb-6"
                  : "overflow-hidden rounded-lg bg-muted"
              }
            >
              {focal ? (
                <div className="relative h-24 overflow-hidden">
                  <Image
                    src={photos.mistOverQuiraing.src}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover object-[50%_30%]"
                  />
                  {/* Ink never goes straight onto a photograph — the scrim is
                      what the name is actually legible against. */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent rtl:bg-linear-to-l" />
                  <h3 className="absolute px-6 pt-5 text-xl tracking-tight text-white">
                    {tier.name}
                  </h3>
                </div>
              ) : (
                <div className="px-6 pt-5 pb-4">
                  <h3 className="text-xl tracking-tight">{tier.name}</h3>
                </div>
              )}

              <div className="m-1.5 mt-0 rounded-md border bg-card p-6">
                <p className="min-h-12 text-sm text-muted-foreground">
                  {tier.blurb}
                </p>

                <div className="mt-6 rounded-sm bg-accent p-4">
                  {/* One figure in three parts, so it reads in this order on a
                      right-to-left page too, and w-fit lets it sit at the
                      start of either. */}
                  <div dir="ltr" className="flex w-fit items-start gap-1.5 px-2">
                    <span className="mt-2 text-xs text-muted-foreground">
                      $
                    </span>
                    <span className="text-5xl tracking-tighter tabular-nums">
                      {price}
                    </span>
                    <span className="mt-2 text-xs text-muted-foreground">
                      USD /<br />
                      month
                    </span>
                  </div>

                  {/* 44px is the page's one call to action, and this is the
                      page: the focal tier holds it while the other two sit at
                      36. Three at 44 would be a plateau rather than a peak. */}
                  <button
                    type="button"
                    className={`mt-4 w-full rounded-control text-sm font-medium ${
                      button[tier.action]
                    } ${focal ? "h-11" : `h-9 ${reach}`}`}
                  >
                    {tier.cta}
                  </button>
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={16}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-muted-foreground"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
