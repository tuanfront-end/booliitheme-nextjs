"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowsPointingOutIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { Column } from "@/components/site/column";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { forSale, isNextOnly, price, Shot, templateHref } from "@/components/templates/detail";
import { joinList } from "@/lib/data/catalogue";
import { platforms } from "@/lib/data/projects";

const lead = forSale.filter(isNextOnly);
const rest = forSale.filter((p) => !isNextOnly(p));
// "WordPress and Shopify" — what the folded builds are built on, off the data.
const restOn = joinList([...new Set(rest.map((p) => platforms[p.platforms.at(-1)!]))]);

// The pointer over the grid on a mouse: an ink pill saying what a press does,
// riding the pointer in place of the arrow and growing in as it enters a card.
// The cards move it by writing its transform straight to the element, so it
// keeps up with the pointer without a render a frame. A touch screen never sees
// it, and it is `inert`: a pointer, not part of the page.
function ViewCursor({ ref }: { ref: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      aria-hidden
      inert
      data-on="false"
      className="pointer-events-none fixed top-0 left-0 z-40 -mt-5 -ms-5 opacity-0 data-[on=true]:opacity-100"
    >
      <span className="flex h-10 origin-top-left scale-50 items-center gap-1.5 rounded-full bg-foreground ps-4 pe-3 text-sm font-medium text-background shadow-soft-lg transition-[scale] duration-spring ease-spring [[data-on=true]>&]:scale-100 motion-reduce:transition-none">
        View
        <ArrowsPointingOutIcon className="size-4" />
      </span>
    </span>
  );
}

function follow(cursor: HTMLSpanElement | null, e: React.PointerEvent, on?: boolean) {
  if (e.pointerType !== "mouse" || !cursor) return;
  cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
  if (on !== undefined) cursor.dataset.on = String(on);
}

// Every template I sell as a picture, its name and its price, two to a row,
// the Next.js ones first. The WordPress and Shopify builds wait folded behind
// the tile that closes the grid, and open in place of it. A card opens its
// template in a sheet over the page, the way Dribbble opens a shot, with the
// address changing to the template's own page.
export function Templates() {
  const [all, setAll] = useState(false);
  const cursor = useRef<HTMLSpanElement>(null);
  // The tile takes itself off the page when pressed, so focus moves to the
  // first card it unfolded rather than dropping to the top of the document.
  const firstRest = useRef<HTMLAnchorElement>(null);
  const unfold = () => {
    setAll(true);
    requestAnimationFrame(() => firstRest.current?.focus());
  };
  const shown = all ? forSale : lead;

  return (
    <Column as="section" id="templates" aria-labelledby="templates-title">
      <Eyebrow>(01) Templates</Eyebrow>
      <SectionHeading id="templates-title" className="mt-3">
        Every template I sell
      </SectionHeading>

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-16">
        {shown.map((p) => (
          <li key={p.slug}>
            <Link
              href={templateHref(p)}
              scroll={false}
              onPointerEnter={(e) => follow(cursor.current, e, true)}
              onPointerMove={(e) => follow(cursor.current, e)}
              onPointerLeave={(e) => follow(cursor.current, e, false)}
              onClick={() => cursor.current?.setAttribute("data-on", "false")}
              ref={p === rest[0] ? firstRest : undefined}
              className="group/shot block rounded-lg press focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring pointer-fine:cursor-none"
            >
              <Shot p={p} sizes="(min-width: 640px) 30rem, 100vw" />
              <span className="mt-4 flex items-baseline justify-between gap-4 px-1 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground tabular-nums">{price(p)}</span>
              </span>
            </Link>
          </li>
        ))}
        {!all && (
          <li>
            {/* The grid's last tile, the size of a card's picture: how many
                more there are, what they are built on, and the press that
                unfolds them in its place. */}
            <div className="flex aspect-[5/3] flex-col items-center justify-center gap-2 rounded-lg bg-accent text-center">
              <p className="font-heading text-4xl tracking-tighter">+{rest.length} more</p>
              <p className="text-sm text-muted-foreground">The {restOn} builds</p>
              <Button variant="secondary" className="mt-4" onClick={unfold}>
                Show all templates
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </div>
          </li>
        )}
      </ul>
      <ViewCursor ref={cursor} />
    </Column>
  );
}
