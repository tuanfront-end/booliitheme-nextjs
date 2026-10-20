// ref: product-lists/heading-and-city-tabs-over-four-wide-listing-cards-photo-left-specs-right.png — grid 2-col · even (departed: a second control row for industry chips, search and sort, which the reference's one tab row has no room for; a compare tray under the grid)
// opens: card · light
"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { COMPARE_MAX, CompareTray } from "@/components/home/compare";
import { TemplateCard } from "@/components/home/template-card";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterRail } from "@/components/ui/filter-rail";
import { SearchField } from "@/components/ui/search-field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { catalogueCounts, platformOf, setSummary } from "@/lib/data/catalogue";
import { author, industries, platforms, projects, type Industry, type Platform } from "@/lib/data/projects";
import { formatNumber } from "@/lib/format";

type PlatformPick = "all" | Platform;
type Sort = "newest" | "sales";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "sales", label: "Best selling" },
];

const isPlatform = (v: string | null): v is Platform => v !== null && v in platforms;
const counts = catalogueCounts();

export function Catalogue() {
  const params = useSearchParams();
  const asked = params.get("platform");
  const [platform, setPlatform] = useState<PlatformPick>(isPlatform(asked) ? asked : "all");
  const [picked, setPicked] = useState<Industry[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [compare, setCompare] = useState<string[]>([]);

  // The footer's "/?platform=wordpress#templates" lands here from anywhere on
  // the site, this page included, so a new value is taken whenever it arrives.
  useEffect(() => {
    if (isPlatform(asked)) setPlatform(asked);
  }, [asked]);

  const words = query.trim().toLowerCase();
  const matches = (p: (typeof projects)[number], by: { platform?: boolean; industry?: boolean }) =>
    (!by.platform || platform === "all" || p.platforms.includes(platform)) &&
    (!by.industry || picked.length === 0 || picked.includes(p.industry)) &&
    (!words || p.name.toLowerCase().includes(words));

  const shown = useMemo(() => {
    const list = projects.filter((p) => matches(p, { platform: true, industry: true }));
    return sort === "sales"
      ? list.slice().sort((a, b) => (b.market.sales ?? -1) - (a.market.sales ?? -1))
      : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, picked, words, sort]);

  // Each chip counts what pressing it would leave, with the other filters held.
  const byIndustry = projects.filter((p) => matches(p, { industry: true }));
  const byPlatform = projects.filter((p) => matches(p, { platform: true }));
  const platformOptions = [
    { value: "all", label: "All", count: byIndustry.length },
    ...(["nextjs", "wordpress", "shopify"] as Platform[]).map((value) => ({
      value,
      label: platforms[value],
      count: byIndustry.filter((p) => p.platforms.includes(value)).length,
    })),
  ];
  const industryOptions = (Object.keys(industries) as Industry[]).map((value) => ({
    value,
    label: industries[value],
    count: byPlatform.filter((p) => p.industry === value).length,
  }));

  const suggestions = words
    ? projects
        .filter((p) => p.name.toLowerCase().includes(words))
        .map((p) => ({ id: p.slug, group: "Templates", label: p.name, meta: platformOf(p), href: `/work/${p.slug}` }))
    : [];

  const reset = () => {
    setPlatform("all");
    setPicked([]);
    setQuery("");
  };

  const toggleCompare = (slug: string, on: boolean) =>
    setCompare((list) => (on ? [...list, slug].slice(-COMPARE_MAX) : list.filter((s) => s !== slug)));

  return (
    <section id="templates" aria-labelledby="templates-title" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-8">
      <SectionHeading id="templates-title" className="max-w-2xl">
        Find the build for the platform you run
      </SectionHeading>
      <Lede className="mt-4 max-w-xl">
        Every card opens its live demo and prints the versions it pins. Save a few to your shortlist, or tick up to
        three cards and set them side by side.
      </Lede>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <FilterRail
          aria-label="Platform"
          options={platformOptions}
          value={platform}
          onValueChange={(v) => setPlatform(v as PlatformPick)}
          className="min-w-0"
        />
        <Button
          variant="outline"
          render={<a href={author.url} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
        >
          All {author.items} items on ThemeForest
          <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterRail
          multiple
          variant="outline"
          aria-label="Industry"
          options={industryOptions}
          value={picked}
          onValueChange={(v) => setPicked(v as Industry[])}
          className="min-w-0"
        />
        <div className="flex gap-3">
          <SearchField
            value={query}
            onValueChange={setQuery}
            suggestions={suggestions}
            onSubmit={setQuery}
            label="Search templates by name"
            placeholder="Search by name"
            className="min-w-0 flex-1 lg:w-64 lg:flex-none"
          />
          <Select items={SORTS} value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent label="Sort">
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p aria-live="polite" className="mt-8 text-sm text-muted-foreground tabular-nums">
        {setSummary(shown, platform === "all" ? undefined : platforms[platform])}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-4 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {shown.map((p) => (
            <li key={p.slug} className="grid">
              <TemplateCard
                project={p}
                compared={compare.includes(p.slug)}
                compareLocked={compare.length >= COMPARE_MAX}
                onCompareChange={(on) => toggleCompare(p.slug, on)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          title={words ? `No template named “${query.trim()}”` : "No template fits all of these"}
          text={`The catalogue holds ${formatNumber(counts.templates)} templates. Clear the filters to see every one again.`}
        >
          <Button onClick={reset}>Show all templates</Button>
        </EmptyState>
      )}

      <CompareTray
        picked={compare.map((s) => projects.find((p) => p.slug === s)!)}
        onRemove={(slug) => toggleCompare(slug, false)}
        onClear={() => setCompare([])}
      />
    </section>
  );
}
