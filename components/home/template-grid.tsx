"use client";

import { useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowsPointingOutIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";

// The pointer over the grid on a mouse: an ink pill saying what a press does,
// riding the pointer in place of the arrow and growing in as it enters a card.
// The grid writes its transform straight to the element, so it keeps up with
// the pointer without a render a frame. A touch screen never sees it, and it is
// `inert`: a pointer, not part of the page.
function ViewCursor({ ref }: { ref: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      aria-hidden
      inert
      data-on="false"
      className="pointer-events-none fixed top-0 left-0 z-40 -mt-5 -ms-5 opacity-0 data-[on=true]:opacity-100"
    >
      <span className="flex h-10 origin-[20px_20px] scale-50 items-center gap-1.5 rounded-full bg-foreground ps-4 pe-3 text-sm font-medium text-background shadow-soft-lg transition-[scale] duration-spring ease-spring [[data-on=true]>&]:scale-100 motion-reduce:transition-none">
        View
        <ArrowsPointingOutIcon className="size-4" />
      </span>
    </span>
  );
}

const loadRest = () => import("./template-rest").then((m) => m.TemplateRest);

// The grid's frame: the cards it is given, the tile that closes it, and the
// pill that follows a mouse over the cards. The pill is driven from the list
// rather than from each card, so the cards stay server markup. The rest of the
// builds come in when the tile is pressed, in its place.
export function TemplateGrid({ children, count, on }: { children: ReactNode; count: number; on: string }) {
  const [Rest, setRest] = useState<ComponentType | null>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const follow = (e: React.PointerEvent, over?: boolean) => {
    const pill = cursor.current;
    if (e.pointerType !== "mouse" || !pill) return;
    const card = over ?? (e.target as Element).closest("[data-card]") !== null;
    pill.style.translate = `${e.clientX}px ${e.clientY}px`;
    // A move over a card turns it on too: closing the sheet over a card leaves
    // the pointer there with no enter to wake the pill.
    pill.dataset.on = String(card);
  };

  const unfold = async () => {
    // The tile stays until the cards are there to take its place.
    const Cards = await loadRest();
    setRest(() => Cards);
    // The tile takes itself off the page when pressed, so focus moves to the
    // first card it unfolded rather than dropping to the top of the document.
    requestAnimationFrame(() => list.current?.querySelector<HTMLElement>("[data-first]")?.focus());
  };

  return (
    <>
      <ul
        ref={list}
        onPointerMove={follow}
        onPointerLeave={(e) => follow(e, false)}
        onClick={() => cursor.current?.setAttribute("data-on", "false")}
        className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-16"
      >
        {children}
        {Rest ? (
          <Rest />
        ) : (
          <li>
            {/* The grid's last tile, the size of a card's picture: how many
                more there are, what they are built on, and the press that
                unfolds them in its place. */}
            <div className="flex aspect-[5/3] flex-col items-center justify-center gap-2 rounded-lg bg-accent text-center">
              <p className="font-heading text-4xl tracking-tighter">+{count} more</p>
              <p className="text-sm text-muted-foreground">The {on} builds</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={unfold}
                onPointerEnter={loadRest}
                onFocus={loadRest}
              >
                Show all templates
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </div>
          </li>
        )}
      </ul>
      <ViewCursor ref={cursor} />
    </>
  );
}
