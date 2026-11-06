import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Column } from "@/components/site/column";
import { forSale, TemplateDetail, TemplateSteps, templateHref } from "@/components/templates/detail";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";

// A template's own page: what a shared link, a refresh or a search result
// opens. The home page's cards open the same template in a sheet instead —
// app/@modal/(.)templates/[slug].
export const dynamicParams = false;

export function generateStaticParams() {
  return forSale.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = forSale.find((t) => t.slug === slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name}, ${p.tagline.toLowerCase()}`, description: p.about, path: templateHref(p) });
}

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const p = forSale.find((t) => t.slug === slug);
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
