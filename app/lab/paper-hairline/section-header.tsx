import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";

export function Header({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionHeading className="mt-4">{title}</SectionHeading>
      <Lede className="mt-2">{lede}</Lede>
    </div>
  );
}
