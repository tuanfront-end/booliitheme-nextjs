// ref: product-lists/heading-tabs-and-filter-chips-over-eight-product-cards-with-swatch-rows.png — grid 4-col · even (departed: v1's lede under the heading, which the reference has no slot for; search in the Filter button's place and one facet, Industry, where it has four; the filtered-set summary beside the facet; the portfolio link beside Show more; a compare tray under the grid)
// opens: card · light
"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import {
  CatalogueEmpty,
  CatalogueSearch,
  CatalogueTray,
  PortfolioLink,
  SortSelect,
  catalogueLede,
  catalogueTitle,
  useCatalogue,
} from "@/components/home/catalogue";
import { COMPARE_MAX } from "@/components/home/compare";
import { TemplateTile } from "@/components/home/template-card";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { FacetSelect } from "@/components/ui/facet-select";
import { FilterRail } from "@/components/ui/filter-rail";
import type { Industry, Platform } from "@/lib/data/projects";

// Two rows of four at the widest grid; the rest wait behind Show more.
const FIRST = 8;

export function CatalogueV2() {
  const c = useCatalogue();
  const [all, setAll] = useState(false);
  const rest = c.shown.length - FIRST;
  const list = all ? c.shown : c.shown.slice(0, FIRST);
  const grid = useRef<HTMLUListElement>(null);

  // The button leaves once pressed, so focus moves to the first card it brought.
  const reveal = () => {
    flushSync(() => setAll(true));
    grid.current?.children[FIRST]?.querySelector<HTMLElement>("a[href]")?.focus();
  };

  return (
    <section id="templates" aria-labelledby="templates-title" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-8">
      <SectionHeading id="templates-title" className="max-w-2xl">
        {catalogueTitle}
      </SectionHeading>
      <Lede className="mt-4 max-w-xl">{catalogueLede}</Lede>

      <div className="mt-12 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <FilterRail
          aria-label="Platform"
          options={c.platformOptions}
          value={c.platform}
          onValueChange={(v) => c.setPlatform(v as "all" | Platform)}
          className="min-w-0"
        />
        <CatalogueSearch catalogue={c} className="w-full sm:w-72" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
        <FacetSelect
          label="Industry"
          options={c.industryOptions}
          value={c.picked}
          onValueChange={(v) => c.setPicked(v as Industry[])}
          noun={["template", "templates"]}
        />
        <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums max-sm:order-last max-sm:w-full">
          {c.summary}
        </p>
        <SortSelect catalogue={c} className="ms-auto" />
      </div>

      {c.shown.length > 0 ? (
        <ul ref={grid} className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((p) => (
            <li key={p.slug} className="grid">
              <TemplateTile
                project={p}
                compared={c.compare.includes(p.slug)}
                compareLocked={c.compare.length >= COMPARE_MAX}
                onCompareChange={(on) => c.toggleCompare(p.slug, on)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <CatalogueEmpty catalogue={c} className="mt-8" />
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {rest > 0 && !all ? (
          <Button onClick={reveal}>
            Show {rest} more
            <ArrowDownIcon aria-hidden="true" data-icon="inline-end" />
          </Button>
        ) : null}
        <PortfolioLink />
      </div>

      <CatalogueTray catalogue={c} />
    </section>
  );
}
