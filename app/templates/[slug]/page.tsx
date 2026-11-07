import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Column } from "@/components/site/column";
import { listed, TemplateDetail, TemplateSteps, templateHref } from "@/components/templates/detail";
import { Button } from "@/components/ui/button";
import { clip, pageMeta } from "@/lib/seo";
import { ogSize } from "@/lib/og/size";
import { siteName } from "@/lib/site";

// A template's own page: what a shared link, a refresh or a search result
// opens. The home page's cards open the same template in a sheet instead —
// app/(home)/@modal/(.)templates/[slug].
export const dynamicParams = false;

export function generateStaticParams() {
  return listed.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = listed.find((t) => t.slug === slug);
  if (!p) return {};
  // The tagline rides along while the tab still fits a search result (60
  // characters with the site name the template appends); otherwise the name
  // alone. The description is cut to a result's 160, the page keeps its copy.
  const full = `${p.name}, ${p.tagline}`;
  const title = `${full} · ${siteName}`.length <= 60 ? full : p.name;
  // The template's own card, drawn by ./opengraph-image off its live captures;
  // without them that route answers with the site's card, so name it outright.
  const image = p.live
    ? { url: `${templateHref(p)}/opengraph-image`, ...ogSize, alt: `${p.name}, on a desktop and a phone` }
    : undefined;
  return pageMeta({ title, description: clip(p.about), path: templateHref(p), image });
}

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const p = listed.find((t) => t.slug === slug);
  if (!p) notFound();

  return (
    <main id="content" className="pb-12">
      <Column innerClassName="flex items-center justify-between gap-4 pt-6 pb-10">
        <Button variant="ghost" render={<Link href="/#templates" />} nativeButton={false}>
          <ArrowLeftIcon data-icon="inline-start" className="rtl:-scale-x-100" />
          All templates
        </Button>
        <div className="flex gap-1">
          <TemplateSteps p={p} />
        </div>
      </Column>
      <Column>
        <TemplateDetail
          p={p}
          title={<h1 className="text-4xl tracking-tighter sm:text-5xl">{p.name}</h1>}
          description={<p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>}
        />
      </Column>
    </main>
  );
}
