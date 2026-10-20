// KitDisplay — the sheet's display group: the controls that show, page through, disclose and stand in for content, each in its variants and its states.
"use client";

import * as React from "react";
import Image from "next/image";
import { useDirection } from "@base-ui/react/direction-provider";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  BedDoubleIcon,
  Building03Icon,
  Calendar03Icon,
  CalendarRemove01Icon,
  House03Icon,
  Location01Icon,
  Logout01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Settings01Icon,
  Share08Icon,
  Tick02Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavigationMenuBlock } from "@/components/design-system/kit-navigation-menu";
import { DsBlock, Specimen } from "@/components/design-system/section";
import { StateGrid, type DsState } from "@/components/design-system/state-grid";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CarouselArrow, CarouselNav } from "@/components/ui/carousel-nav";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkCard, LinkCardLink, LinkCardMedia } from "@/components/ui/link-card";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Pagination, PaginationButton } from "@/components/ui/pagination";
import { Price } from "@/components/ui/price";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { railFade } from "@/components/ui/rail-fade";
import { Rating } from "@/components/ui/rating";
import { SaveToggle } from "@/components/ui/save-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { StoryBars } from "@/components/ui/story-bars";
import { useRail } from "@/components/ui/use-rail";
import { cn } from "@/lib/utils";

// The words are a booking marketplace's — stays and experiences in Lisbon — so
// every control is seen holding the kind of content it will hold, never a
// placeholder. Each block's links point back at the block itself.

// The sheet's focus preview rings the first child of a state cell. A control
// drawn inside a wrapper puts this first, so the ring lands only on the part
// that takes focus.
function Cell({ children }: { children: React.ReactNode }) {
  return <div className="outline-none">{children}</div>;
}

// A state the control does not have, in its column.
const none = (
  <span aria-hidden="true" className="text-sm text-muted-foreground">
    —
  </span>
);

function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
const face = (id: string) =>
  `https://images.unsplash.com/${id}?w=160&h=160&fit=crop&crop=faces&q=75`;

// --- Breadcrumb --------------------------------------------------------------

function BreadcrumbBlock() {
  return (
    <DsBlock
      id="breadcrumb"
      title="Breadcrumb"
      when="a detail page sits under pages a visitor may want to climb back to."
      source="components/ui/breadcrumb.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus"]}
          rows={[
            {
              label: "Step back",
              render: () => (
                <Cell>
                  <Breadcrumb structuredData={false} trail={[{ label: "Lisbon", href: "#breadcrumb" }]} />
                </Cell>
              ),
            },
          ]}
        />
      }
      edges={
        <Specimen className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="max-w-72">
              <Breadcrumb
                structuredData={false}
                trail={[
                  { label: "Experiences", href: "#breadcrumb" },
                  { label: "Lisbon", href: "#breadcrumb" },
                  { label: "Food and drink", href: "#breadcrumb" },
                  { label: "A tasca crawl through Mouraria with a local cook" },
                ]}
              />
            </div>
            <Caption>Short of room, the trail wraps and the page&apos;s own name truncates.</Caption>
          </div>
          <div className="flex flex-col gap-3">
            <Breadcrumb
              structuredData={false}
              trail={[{ label: "Stays", href: "#breadcrumb" }, { label: "Fireside loft in Alfama" }]}
            />
            <Caption>One step up is still a trail, so it keeps its place above the title.</Caption>
          </div>
        </Specimen>
      }
    >
      <Specimen>
        <Breadcrumb
          structuredData={false}
          trail={[
            { label: "Stays", href: "#breadcrumb" },
            { label: "Portugal", href: "#breadcrumb" },
            { label: "Lisbon", href: "#breadcrumb" },
            { label: "Fireside loft in Alfama" },
          ]}
        />
        <h4 className="mt-4 text-2xl tracking-tight">Fireside loft in Alfama</h4>
      </Specimen>
    </DsBlock>
  );
}

// --- Pagination --------------------------------------------------------------

function PaginationBlock() {
  const [page, setPage] = React.useState(2);
  const [reviews, setReviews] = React.useState(1);
  const from = (page - 1) * 12 + 1;
  const to = Math.min(140, page * 12);
  return (
    <DsBlock
      id="pagination"
      title="Pagination"
      when="results run past one page and a visitor jumps to one by its number."
      source="components/ui/pagination.tsx"
      variants={
        <Specimen className="flex flex-col items-center gap-3">
          <Pagination page={reviews} pageCount={3} onPageChange={setReviews} label="Review pages" />
          <Caption>Three pages need no gaps, and the first arrow waits disabled.</Caption>
        </Specimen>
      }
      states={
        <StateGrid
          rows={[
            {
              label: "Page",
              render: (s: DsState) =>
                s === "disabled" ? none : <PaginationButton aria-label="Page 3">3</PaginationButton>,
            },
            {
              label: "Page on show",
              render: (s: DsState) =>
                s === "disabled" ? (
                  none
                ) : (
                  <PaginationButton aria-label="Page 2" aria-current="page">
                    2
                  </PaginationButton>
                ),
            },
            {
              label: "Arrow",
              render: (s: DsState) => (
                <PaginationButton kind="step" aria-label="Next page" disabled={s === "disabled"}>
                  <ChevronRightIcon aria-hidden className="rtl:-scale-x-100" />
                </PaginationButton>
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col items-center gap-3">
        <Pagination page={page} pageCount={12} onPageChange={setPage} label="Stay result pages" />
        <Caption>
          Stays <span className="tabular-nums">{from}–{to}</span> of <span className="tabular-nums">140</span>
        </Caption>
      </Specimen>
    </DsBlock>
  );
}

// --- Carousel nav ------------------------------------------------------------

const RIVER_STAYS = [
  { name: "Fireside loft", place: "Alfama", price: 180 },
  { name: "Harbour studio", place: "Cais do Sodré", price: 132 },
  { name: "Garden flat", place: "Estrela", price: 156 },
  { name: "Tiled townhouse", place: "Graça", price: 214 },
  { name: "River room", place: "Belém", price: 98 },
  { name: "Rooftop suite", place: "Chiado", price: 268 },
  { name: "Courtyard house", place: "Mouraria", price: 190 },
  { name: "Boatyard cabin", place: "Seixal", price: 120 },
];

function StayTile({ stay }: { stay: (typeof RIVER_STAYS)[number] }) {
  return (
    <li className="flex w-56 shrink-0 snap-start flex-col rounded-md bg-accent p-5">
      <p className="text-base font-medium">{stay.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{stay.place}, Lisbon</p>
      <Price amount={stay.price} per="night" className="mt-8 text-sm" />
    </li>
  );
}

function CarouselNavBlock() {
  // The ref goes to the rail and the rest to its arrows.
  const { ref: riverRef, ...river } = useRail<HTMLUListElement>();
  const { ref: fitsRef, ...fits } = useRail<HTMLUListElement>();
  return (
    <DsBlock
      id="carousel-nav"
      title="Carousel nav"
      when="a row of peers runs past the edge: stays, reviews, photos. Fits, and it hides."
      source="components/ui/carousel-nav.tsx · use-rail.ts · rail-fade.ts"
      states={
        <StateGrid
          rows={[
            {
              label: "Arrow",
              render: (s: DsState) => (
                <CarouselArrow direction="next" aria-label="Next stays" disabled={s === "disabled"} />
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col gap-12">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div>
              <h4 className="text-xl font-medium tracking-tight">Stays by the water</h4>
              <Caption className="mt-1">Eight places a short walk from the river</Caption>
            </div>
            <CarouselNav
              rail={river}
              controls="kit-river-rail"
              previousLabel="Previous stays"
              nextLabel="Next stays"
            />
          </div>
          <ul
            id="kit-river-rail"
            ref={riverRef}
            aria-label="Stays by the water"
            className={cn("no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto", railFade)}
          >
            {RIVER_STAYS.map((stay) => (
              <StayTile key={stay.name} stay={stay} />
            ))}
          </ul>
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <Caption>Two stays fit the row, so no arrows are drawn beside it.</Caption>
            <CarouselNav rail={fits} controls="kit-fits-rail" previousLabel="Previous stays" nextLabel="Next stays" />
          </div>
          <ul
            id="kit-fits-rail"
            ref={fitsRef}
            aria-label="Stays in Belém"
            className={cn("no-scrollbar mt-4 flex gap-4 overflow-x-auto", railFade)}
          >
            {RIVER_STAYS.slice(4, 6).map((stay) => (
              <StayTile key={stay.name} stay={stay} />
            ))}
          </ul>
        </div>
      </Specimen>
    </DsBlock>
  );
}

// --- Story bars --------------------------------------------------------------

const EXPERIENCES = [
  {
    name: "Sunrise kayak on the Tagus",
    meta: "Belém · 2 hours",
    price: 48,
    line: "Paddle out under the bridge before the ferries start, then coffee and pastries on the slipway with the crew.",
  },
  {
    name: "Fado night in a tasca",
    meta: "Alfama · 3 hours",
    price: 65,
    line: "Dinner at a twelve-seat table, then four singers in the small room where the songs of the city began.",
  },
  {
    name: "Tile painting with a ceramicist",
    meta: "Graça · 2½ hours",
    price: 54,
    line: "Paint two azulejos in a working studio, then the ceramicist fires them and posts them home to you.",
  },
  {
    name: "Sintra by e-bike",
    meta: "Sintra · 5 hours",
    price: 89,
    line: "Three palaces and the coast road, with the long climbs taken off your legs.",
  },
];

const EXPERIENCE_NAMES = EXPERIENCES.map((e) => e.name);

// Each run sits under its count, the words that say what a light brand's bar
// cannot say on its own at 3:1.
function StaticBars({ tone, label }: { tone: "ink" | "brand" | "inverse"; label: string }) {
  const [index, setIndex] = React.useState(1);
  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          "flex items-baseline justify-between gap-4 text-sm",
          tone === "inverse" ? "text-background" : "text-muted-foreground",
        )}
      >
        <span>{label}</span>
        <span className="shrink-0 tabular-nums">
          {index + 1} of {EXPERIENCES.length}
        </span>
      </p>
      <StoryBars
        autoPlay={false}
        tone={tone}
        names={EXPERIENCE_NAMES}
        index={index}
        onIndexChange={setIndex}
        noun="experience"
        announce={`Experience ${index + 1} of ${EXPERIENCES.length}`}
      />
    </div>
  );
}

function StoryBarsBlock() {
  const [index, setIndex] = React.useState(0);
  const shown = EXPERIENCES[index];
  return (
    <DsBlock
      id="story-bars"
      title="Story bars"
      when="a few slides take turns in one frame, each held long enough to read."
      source="components/ui/story-bars.tsx"
      variants={
        <Specimen className="flex flex-col gap-6">
          <StaticBars tone="ink" label="Ink, the default" />
          <StaticBars tone="brand" label="The brand, bright on its own tint" />
          <div className="rounded-md bg-foreground p-4">
            <StaticBars tone="inverse" label="Light, on a dark band or a scrim" />
          </div>
          <Caption>Autoplay off or reduced motion: a full bar, no pause.</Caption>
        </Specimen>
      }
    >
      <Specimen>
        <div id="kit-spotlight" className="flex max-w-2xl flex-col rounded-md bg-accent p-6 sm:p-8">
          <Caption>
            Experience <span className="tabular-nums">{index + 1}</span> of{" "}
            <span className="tabular-nums">{EXPERIENCES.length}</span>
          </Caption>
          <h4 className="mt-3 text-2xl tracking-tight">{shown.name}</h4>
          <p className="mt-2 max-w-md text-base text-muted-foreground">{shown.line}</p>
          <p className="mt-6 text-sm">
            <span className="text-muted-foreground">{shown.meta} · </span>
            <Price amount={shown.price} per="person" />
          </p>
          <StoryBars
            className="mt-auto pt-8"
            names={EXPERIENCE_NAMES}
            index={index}
            onIndexChange={setIndex}
            controls="kit-spotlight"
            noun="experience"
            announce={`Experience ${index + 1} of ${EXPERIENCES.length}: ${shown.name}`}
          />
        </div>
      </Specimen>
    </DsBlock>
  );
}

// --- Accordion ---------------------------------------------------------------

const BOOKING_QUESTIONS = [
  {
    q: "What does the nightly price include?",
    a: "The room, cleaning and the service fee. Only the city tax is paid on arrival, and every listing shows its amount beside the price before you book.",
  },
  {
    q: "Can I cancel after booking?",
    a: "Most stays refund in full up to 48 hours before check-in; the policy sits under each price.",
  },
  {
    q: "When is my card charged?",
    a: "When the host accepts. A request that is declined, or left a day without an answer, is never charged.",
  },
];

const HOST_QUESTIONS = [
  {
    q: "Is every host's ID checked?",
    a: "Before their first listing goes live, each host shows a government ID and a phone number. Their profile says when each was checked.",
  },
  {
    q: "Can I message a host before booking?",
    a: "Yes, from the listing page. Most hosts answer within the hour, and each one's usual reply time is shown beside their name.",
  },
  {
    q: "What if the place is not as listed?",
    a: "Tell us within a day of check-in and we find you a comparable stay, or refund the nights you did not use. Either way, you choose.",
  },
];

function OneQuestion({ tone, open = false }: { tone: "line" | "tint"; open?: boolean }) {
  return (
    <Cell>
      <Accordion tone={tone} defaultValue={open ? ["pets"] : []} className="w-56">
        <AccordionItem value="pets">
          <AccordionTrigger>Pets allowed?</AccordionTrigger>
          <AccordionPanel>Yes, up to two.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Cell>
  );
}

function AccordionBlock() {
  return (
    <DsBlock
      id="accordion"
      title="Accordion"
      when="a reader scans questions by their titles and opens the one they have."
      source="components/ui/accordion.tsx"
      variants={
        <Specimen className="flex flex-col gap-4">
          <code className="font-mono text-xs text-muted-foreground">tone=&quot;tint&quot;</code>
          <Accordion tone="tint" defaultValue={[0]} className="max-w-2xl">
            {HOST_QUESTIONS.map((item, i) => (
              <AccordionItem key={item.q} value={i}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionPanel>{item.a}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Specimen>
      }
      states={
        <StateGrid
          states={["hover", "active", "focus"]}
          rows={[
            { label: "Line", render: () => <OneQuestion tone="line" /> },
            { label: "Tint", render: () => <OneQuestion tone="tint" /> },
            { label: "Tint, open", render: () => <OneQuestion tone="tint" open /> },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col gap-4">
        <code className="font-mono text-xs text-muted-foreground">tone=&quot;line&quot; numbered</code>
        <Accordion numbered defaultValue={[0]} className="max-w-2xl">
          {BOOKING_QUESTIONS.map((item, i) => (
            <AccordionItem key={item.q} value={i}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionPanel>{item.a}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Specimen>
    </DsBlock>
  );
}

// --- Dialog ------------------------------------------------------------------

const CHARGES: [string, number][] = [
  ["Three nights", 540],
  ["Cleaning", 45],
  ["Service fee", 62],
];

function DialogBlock() {
  const [review, setReview] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [said, setSaid] = React.useState<string | null>(null);
  return (
    <DsBlock
      id="dialog"
      title="Dialog"
      when="a decision needs the screen to itself: review a booking, confirm a cancel."
      source="components/ui/dialog.tsx"
    >
      <Specimen className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog open={review} onOpenChange={setReview}>
            <DialogTrigger render={<Button />}>Review your stay</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fireside loft in Alfama</DialogTitle>
                <DialogDescription>Three nights, 12–15 March, two guests</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <dl className="divide-y divide-border text-sm">
                  {CHARGES.map(([what, amount]) => (
                    <div key={what} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">{what}</dt>
                      <dd>
                        <Price amount={amount} />
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 py-3 text-base">
                    <dt className="font-medium">Total</dt>
                    <dd>
                      <Price amount={647} />
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-muted-foreground">
                  Free cancellation until 10 March. Nothing is charged until Ana accepts.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" className="me-auto" />}>Not yet</DialogClose>
                <Button
                  onClick={() => {
                    setReview(false);
                    setSaid("Request sent. Ana usually answers within the hour.");
                  }}
                >
                  Request to book
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={cancel} onOpenChange={setCancel}>
            <DialogTrigger render={<Button variant="secondary" />}>Cancel a booking</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel this booking?</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="text-base text-muted-foreground">
                  You get <Price amount={540} className="text-foreground" /> back: the nights, not the service fee. Ana
                  hears from us straight away.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogClose render={<Button variant="secondary" />}>Keep it</DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCancel(false);
                    setSaid("Booking cancelled. $540 is on its way back to your card.");
                  }}
                >
                  Cancel booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Caption>
          <span aria-live="polite">{said ?? "Open either one. On a phone it rises from the foot of the screen."}</span>
        </Caption>
      </Specimen>
    </DsBlock>
  );
}

// --- Drawer ------------------------------------------------------------------

const GUESTS = [
  { who: "Adults", age: "13 and over", count: 2 },
  { who: "Children", age: "2 to 12", count: 1 },
  { who: "Infants", age: "Under 2", count: 0 },
];

const SAVED = [
  { name: "Fireside loft", place: "Alfama", price: 180 },
  { name: "Tiled townhouse", place: "Graça", price: 214 },
  { name: "Boatyard cabin", place: "Seixal", price: 120 },
];

function DrawerBlock() {
  // A drawer from a side leaves from the end of the line, which is the left
  // on a right-to-left page.
  const end = useDirection() === "rtl" ? "left" : "right";
  return (
    <DsBlock
      id="drawer"
      title="Drawer"
      when="a panel belongs to an edge: guests from the foot, saved stays from the side."
      source="components/ui/drawer.tsx"
    >
      <Specimen className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button variant="secondary" />}>Who&apos;s coming</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto flex w-full max-w-md flex-col">
                <DrawerHeader className="px-6 pt-6">
                  <DrawerTitle>Who&apos;s coming</DrawerTitle>
                  <DrawerDescription>Fireside loft sleeps four</DrawerDescription>
                </DrawerHeader>
                <ul className="divide-y divide-border px-6 py-4">
                  {GUESTS.map((g) => (
                    <li key={g.who} className="flex items-baseline justify-between gap-4 py-4">
                      <span>
                        <span className="block text-base font-medium">{g.who}</span>
                        <span className="text-sm text-muted-foreground">{g.age}</span>
                      </span>
                      <span className="text-base tabular-nums">{g.count}</span>
                    </li>
                  ))}
                </ul>
                <div className="px-6 pb-2">
                  <Drawer>
                    <DrawerTrigger render={<Button variant="link" />}>Bringing a pet?</DrawerTrigger>
                    <DrawerContent>
                      <div className="mx-auto flex w-full max-w-md flex-col">
                        <DrawerHeader className="px-6 pt-6">
                          <DrawerTitle>Pets at Fireside loft</DrawerTitle>
                          <DrawerDescription>One dog under 15 kg, with a $25 cleaning fee</DrawerDescription>
                        </DrawerHeader>
                        <p className="px-6 py-4 text-base text-muted-foreground">
                          Ana keeps a bed and two bowls by the door. Assistance animals are always welcome and never
                          charged.
                        </p>
                        <DrawerFooter className="px-6 pt-2 pb-6">
                          <DrawerClose render={<Button />}>Got it</DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
                <DrawerFooter className="px-6 pt-2 pb-6">
                  <DrawerClose render={<Button />}>Done</DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer swipeDirection={end}>
            <DrawerTrigger render={<Button variant="secondary" />}>Saved stays</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="px-6 pt-6">
                <DrawerTitle>Saved stays</DrawerTitle>
                <DrawerDescription>Three places for March</DrawerDescription>
              </DrawerHeader>
              <ul className="divide-y divide-border px-6 py-4">
                {SAVED.map((s) => (
                  <li key={s.name} className="flex items-baseline justify-between gap-4 py-4">
                    <span>
                      <span className="block text-base font-medium">{s.name}</span>
                      <span className="text-sm text-muted-foreground">{s.place}, Lisbon</span>
                    </span>
                    <Price amount={s.price} per="night" className="text-sm" />
                  </li>
                ))}
              </ul>
              <DrawerFooter className="px-6 pb-6">
                <DrawerClose render={<Button variant="secondary" />}>Close</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Drawer snapPoints={["16rem", 1]} showSwipeHandle>
            <DrawerTrigger render={<Button variant="secondary" />}>Stays on the map</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto flex w-full max-w-md flex-col">
                <DrawerHeader className="px-6 pt-6">
                  <DrawerTitle>Eight stays in this area</DrawerTitle>
                  <DrawerDescription>Drag up for the whole list</DrawerDescription>
                </DrawerHeader>
                <ul className="divide-y divide-border px-6 py-4">
                  {RIVER_STAYS.map((s) => (
                    <li key={s.name} className="flex items-baseline justify-between gap-4 py-4">
                      <span>
                        <span className="block text-base font-medium">{s.name}</span>
                        <span className="text-sm text-muted-foreground">{s.place}, Lisbon</span>
                      </span>
                      <Price amount={s.price} per="night" className="text-sm" />
                    </li>
                  ))}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <Caption>
          From the foot with a handle and a second drawer inside it, from the end of the line, and with a snap point
          that holds a peek of the list.
        </Caption>
      </Specimen>
    </DsBlock>
  );
}

// --- Menu --------------------------------------------------------------------

function MenuBlock() {
  const [picked, setPicked] = React.useState<string | null>(null);
  const pick = (what: string) => () => setPicked(what);
  return (
    <DsBlock
      id="menu"
      title="Menu"
      when="one thing has more actions than fit beside it: a trip, an account."
      source="components/ui/menu.tsx"
    >
      <Specimen className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md bg-accent p-4 ps-5">
          <div>
            <p className="text-base font-medium">Fireside loft in Alfama</p>
            <p className="text-sm text-muted-foreground">12–15 March · two guests</p>
          </div>
          <div className="flex items-center gap-2">
            <Menu>
              <MenuTrigger render={<Button variant="outline" size="icon" aria-label="Actions for this trip" />}>
                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
              </MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuLabel>This trip</MenuLabel>
                  <MenuItem onClick={pick("Change dates")}>
                    <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.5} />
                    Change dates
                  </MenuItem>
                  <MenuItem onClick={pick("Message Ana")}>
                    <HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={1.5} />
                    Message Ana
                  </MenuItem>
                  <MenuItem onClick={pick("Share the trip")}>
                    <HugeiconsIcon icon={Share08Icon} size={16} strokeWidth={1.5} />
                    Share the trip
                  </MenuItem>
                  <MenuItem disabled>
                    <HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={1.5} />
                    Leave a review after your stay
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuItem onClick={pick("Cancel booking")}>
                  <HugeiconsIcon icon={CalendarRemove01Icon} size={16} strokeWidth={1.5} />
                  Cancel booking
                </MenuItem>
              </MenuContent>
            </Menu>
            <Menu>
              <MenuTrigger render={<Button variant="outline" />}>Account</MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuLabel>Signed in as Maya</MenuLabel>
                  <MenuLinkItem href="#menu">
                    <HugeiconsIcon icon={Ticket01Icon} size={16} strokeWidth={1.5} />
                    Your trips
                  </MenuLinkItem>
                  <MenuLinkItem href="#menu">
                    <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={1.5} />
                    Account settings
                  </MenuLinkItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuItem onClick={pick("Sign out")}>
                  <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} />
                  Sign out
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>
        <Caption>
          <span aria-live="polite">
            {picked ? `You picked “${picked}”.` : "A row the keyboard is on takes the ring as well as the tint."}
          </span>
        </Caption>
      </Specimen>
    </DsBlock>
  );
}

// --- Avatar ------------------------------------------------------------------

const PEOPLE = [
  { name: "Naomi Alvarez", initials: "NA", src: face("photo-1659481993364-4512775ed911") },
  { name: "Peter Lindqvist", initials: "PL", src: face("photo-1609371497456-3a55a205d5eb") },
  { name: "Grace Okonkwo", initials: "GO", src: face("photo-1701728667207-54b43dbdab97") },
];

const SIZES = ["sm", "default", "lg", "xl"] as const;

function AvatarBlock() {
  return (
    <DsBlock
      id="avatar"
      title="Avatar"
      when="a person stands beside what they did: hosted it, reviewed it, are going."
      source="components/ui/avatar.tsx"
      variants={
        <Specimen className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Caption>Initials while the photo loads, or for someone with none</Caption>
            <Avatar size="lg">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>A status, named to a screen reader</Caption>
            <div className="flex items-end gap-6">
              <Avatar size="default">
                <AvatarImage src={PEOPLE[1].src} alt={PEOPLE[1].name} />
                <AvatarFallback>{PEOPLE[1].initials}</AvatarFallback>
                <AvatarBadge tone="away" label="Away" />
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src={PEOPLE[2].src} alt={PEOPLE[2].name} />
                <AvatarFallback>{PEOPLE[2].initials}</AvatarFallback>
                <AvatarBadge tone="online" label="Online" />
              </Avatar>
              <Avatar size="xl">
                <AvatarImage src={PEOPLE[0].src} alt={PEOPLE[0].name} />
                <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
                <AvatarBadge tone="brand" label="Verified host">
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} aria-hidden="true" />
                </AvatarBadge>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>A group, with the rest counted</Caption>
            <AvatarGroup role="img" aria-label="Naomi, Peter, Grace and 12 others are going">
              {PEOPLE.map((p) => (
                <Avatar key={p.name} size="lg">
                  <AvatarImage src={p.src} alt="" />
                  <AvatarFallback>{p.initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+12</AvatarGroupCount>
            </AvatarGroup>
          </div>
        </Specimen>
      }
      sizes={
        <Specimen className="flex flex-col gap-4">
          <Caption>sm · 24, default · 32, lg · 40, xl · 56</Caption>
          <div className="flex items-end gap-4">
            {SIZES.map((size) => (
              <Avatar key={size} size={size}>
                <AvatarImage src={PEOPLE[0].src} alt={PEOPLE[0].name} />
                <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Specimen>
      }
    >
      <Specimen className="flex items-center gap-4">
        <Avatar size="xl">
          <AvatarImage src={PEOPLE[0].src} alt="" />
          <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-base font-medium">Hosted by {PEOPLE[0].name}</p>
          <p className="text-sm text-muted-foreground">Hosting since 2019 · replies within the hour</p>
        </div>
      </Specimen>
    </DsBlock>
  );
}

// --- Rating ------------------------------------------------------------------

function RatingBlock() {
  return (
    <DsBlock
      id="rating"
      title="Rating"
      when="a score out of five sits beside the number it pictures."
      source="components/ui/rating.tsx"
      variants={
        <Specimen className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Caption>Two tones only: the brand by default, or ink</Caption>
            <div className="flex flex-wrap items-center gap-6">
              {(["brand", "ink"] as const).map((tone) => (
                <span key={tone} className="flex items-center gap-2 text-sm">
                  <Rating value={4.5} tone={tone} />
                  <span className="font-medium tabular-nums">4.5</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>A fraction fills the next star to its share</Caption>
            <div className="flex flex-wrap items-center gap-6">
              {[3.5, 4.2, 4.75].map((v) => (
                <span key={v} className="flex items-center gap-2 text-sm">
                  <Rating value={v} />
                  <span className="tabular-nums text-muted-foreground">{v}</span>
                </span>
              ))}
            </div>
          </div>
        </Specimen>
      }
      sizes={
        <Specimen className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Caption>sm, inside a line of text</Caption>
            <p className="flex items-center gap-2 text-sm">
              <Rating value={4.87} />
              <span className="font-medium tabular-nums">4.87</span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>md, beside a larger figure</Caption>
            <div className="flex items-end gap-4">
              <span className="font-heading text-5xl tracking-tighter tabular-nums">4.9</span>
              <div className="flex flex-col gap-1 pb-1">
                <Rating value={4.9} size="md" />
                <span className="text-sm text-muted-foreground">
                  from <span className="tabular-nums">1,204</span> stays
                </span>
              </div>
            </div>
          </div>
        </Specimen>
      }
      edges={
        <Specimen className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Caption>No reviews yet: no stars, since five empty ones read as a zero</Caption>
            <p className="flex items-center gap-2 text-sm">
              <Badge tone="brand">New</Badge>
              <span className="text-muted-foreground">No reviews yet</span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>A single review: the count stands beside the score, so 5.0 reads as one</Caption>
            <p className="flex items-center gap-2 text-sm">
              <Rating value={5} />
              <span className="font-medium tabular-nums">5.0</span>
              <span className="text-muted-foreground">
                · <span className="tabular-nums">1</span> review
              </span>
            </p>
          </div>
        </Specimen>
      }
    >
      <Specimen>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <Rating value={4.87} />
          <span className="font-medium tabular-nums">4.87</span>
          <span className="text-muted-foreground">
            · <span className="tabular-nums">312</span> reviews
          </span>
        </p>
      </Specimen>
    </DsBlock>
  );
}

// --- Price -------------------------------------------------------------------

const PRICES: {
  amount: number;
  currency: string;
  locale: string;
  per?: string;
  says: string;
}[] = [
  { amount: 180, currency: "USD", locale: "en-US", per: "night", says: "A stay, by the night" },
  { amount: 152, currency: "EUR", locale: "de-DE", per: "night", says: "The locale places the sign" },
  { amount: 18000, currency: "JPY", locale: "ja-JP", per: "night", says: "No minor unit at any size" },
];

const EDGE_PRICES: typeof PRICES = [
  { amount: 0, currency: "USD", locale: "en-US", says: "Zero prints as Free" },
  { amount: 4.5, currency: "GBP", locale: "en-GB", per: "person", says: "Under ten keeps its pence" },
  { amount: 12480, currency: "USD", locale: "en-US", per: "month", says: "A long figure groups its digits" },
];

function PriceList({ items }: { items: typeof PRICES }) {
  return (
    <Specimen className="px-6 py-2 sm:px-8 sm:py-2">
      <ul className="divide-y divide-border">
        {items.map((p) => (
          <li
            key={`${p.currency}-${p.amount}`}
            className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:items-baseline sm:gap-6"
          >
            <Price amount={p.amount} currency={p.currency} locale={p.locale} per={p.per} className="text-base" />
            <code className="font-mono text-xs text-muted-foreground">
              {p.currency} · {p.locale}
            </code>
            <span className="text-sm text-muted-foreground">{p.says}</span>
          </li>
        ))}
      </ul>
    </Specimen>
  );
}

function PriceBlock() {
  return (
    <DsBlock
      id="price"
      title="Price"
      when="money is shown in a currency and a locale, its unit a step quieter."
      source="components/ui/price.tsx"
      variants={<PriceList items={PRICES} />}
      edges={<PriceList items={EDGE_PRICES} />}
    >
      <Specimen>
        <p className="text-base">
          <Price amount={180} per="night" />
          <span className="text-sm text-muted-foreground"> · before taxes and fees</span>
        </p>
      </Specimen>
    </DsBlock>
  );
}

// --- Progress ----------------------------------------------------------------

function ProgressBlock() {
  const [step, setStep] = React.useState(2);
  return (
    <DsBlock
      id="progress"
      title="Progress"
      when="a task is part done and the share matters: a profile, an upload, a booking."
      source="components/ui/progress.tsx"
    >
      <Specimen className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Progress value={60}>
            <ProgressLabel>Your host profile</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={100}>
            <ProgressLabel>Photos uploaded</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
        <div className="flex flex-col gap-6">
          <Progress value={step} min={0} max={4} getAriaValueText={(_, v) => `Step ${v} of 4`}>
            <ProgressLabel>Booking</ProgressLabel>
            <ProgressValue>{(_, v) => `Step ${v} of 4`}</ProgressValue>
          </Progress>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" disabled={step <= 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
              Back
            </Button>
            <Button disabled={step >= 4} onClick={() => setStep((s) => Math.min(4, s + 1))}>
              Next step
            </Button>
          </div>
        </div>
      </Specimen>
    </DsBlock>
  );
}

// --- Skeleton ----------------------------------------------------------------

function SkeletonBlock() {
  return (
    <DsBlock
      id="skeleton"
      title="Skeleton"
      when="content is on its way and its shape is known: a card, a list of reviews."
      source="components/ui/skeleton.tsx"
    >
      <Specimen className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div aria-busy="true" className="flex flex-col rounded-lg bg-card ring-1 ring-border ring-inset">
          <span className="sr-only">Loading a stay</span>
          <Skeleton className="mx-1.5 mt-1.5 aspect-[4/3] rounded-[calc(var(--radius-lg)-0.375rem)]" />
          <div className="flex flex-col p-4">
            <Skeleton shape="line" className="w-24" />
            <Skeleton shape="line" className="mt-4 w-3/4" />
            <Skeleton shape="line" className="mt-3 w-1/2" />
            <div className="mt-4 flex items-center justify-between border-t pt-3.5">
              <Skeleton shape="line" className="w-16" />
              <Skeleton shape="line" className="w-20" />
            </div>
          </div>
        </div>
        <div aria-busy="true" className="flex flex-col gap-6 lg:col-span-2">
          <span className="sr-only">Loading reviews</span>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-start gap-4">
              <Skeleton shape="circle" className="size-10 shrink-0" />
              <div className="flex flex-1 flex-col gap-3 pt-1">
                <Skeleton shape="line" className="w-40" />
                <Skeleton shape="line" className="w-full" />
                <Skeleton shape="line" className="w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Specimen>
    </DsBlock>
  );
}

// --- Empty state -------------------------------------------------------------

const ALL_FILTERS = ["Pets allowed", "Under $80"];

function EmptyStateBlock() {
  const [filters, setFilters] = React.useState(ALL_FILTERS);
  // The counts agree with the sentence: dropping "Pets allowed" brings back
  // exactly the fourteen it promises.
  const found = filters.length === 2 ? 0 : filters.length === 1 ? 14 : 140;
  return (
    <DsBlock
      id="empty-state"
      title="Empty state"
      when="a list comes back empty and one action can bring results back."
      source="components/ui/empty-state.tsx"
      edges={
        <Specimen className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Caption>A long title balances over its lines and the text keeps its measure.</Caption>
            <EmptyState
              titleAs="h4"
              title="No stays in Ponta Delgada are free for all six nights you picked"
              text="Shorten the stay by a night, or look at São Miguel as a whole."
              className="h-full"
            >
              <Button variant="secondary">Search São Miguel</Button>
            </EmptyState>
          </div>
          <div className="flex flex-col gap-3">
            <Caption>Nothing to do about it: no button, and the text says when it fills.</Caption>
            <EmptyState
              titleAs="h4"
              title="No reviews yet"
              text="Ana's first guests arrive on 12 March. Their reviews land here a day after they leave."
              className="h-full"
            />
          </div>
        </Specimen>
      }
    >
      <Specimen className="flex flex-col gap-6">
        <Caption>
          {filters.length ? `Stays in Lisbon, filtered by ${filters.join(" and ")}` : "Stays in Lisbon, no filters"}
        </Caption>
        {found === 0 ? (
          <EmptyState
            title="No stays match both of these"
            text="Drop Pets allowed and 14 stays under $80 come back."
          >
            <Button onClick={() => setFilters(["Under $80"])}>Remove Pets allowed</Button>
            <Button variant="secondary" onClick={() => setFilters([])}>
              Clear all filters
            </Button>
          </EmptyState>
        ) : (
          <div className="flex flex-col items-center rounded-lg bg-accent px-6 py-16 text-center sm:py-20">
            <p className="text-xl font-medium tracking-tight">
              <span className="tabular-nums">{found}</span> stays to look through
            </p>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              The list is back. Put both filters on again to see the empty state.
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => setFilters(ALL_FILTERS)}>
              Put both filters back
            </Button>
          </div>
        )}
      </Specimen>
    </DsBlock>
  );
}

// --- Link card ---------------------------------------------------------------

type CardStay = {
  id: string;
  title: string;
  kind: string;
  kindIcon: typeof House03Icon;
  place: string;
  rating: number | null;
  price: number;
  src: string | null;
  alt: string;
  badge: string | null;
};

const CARD_STAYS: CardStay[] = [
  {
    id: "fireside",
    title: "Fireside loft in Alfama",
    kind: "Entire loft",
    kindIcon: House03Icon,
    place: "Alfama, Lisbon",
    rating: 4.92,
    price: 180,
    src: unsplash("photo-1600210491892-03d54c0aaf87", 800),
    alt: "A white sofa beside a fireplace",
    badge: "Guest favourite",
  },
  {
    id: "coffered",
    title: "Coffered flat on the Avenida",
    kind: "Entire flat",
    kindIcon: Building03Icon,
    place: "Avenida, Lisbon",
    rating: 4.81,
    price: 156,
    src: unsplash("photo-1598928506311-c55ded91a20c", 800),
    alt: "Pale sofas facing built-in cabinets under a coffered ceiling",
    badge: null,
  },
  {
    id: "arched",
    title: "Arched-mirror studio",
    kind: "Studio",
    kindIcon: BedDoubleIcon,
    place: "Ribeira, Porto",
    rating: 4.7,
    price: 118,
    src: unsplash("photo-1616047006789-b7af5afb8c20", 800),
    alt: "A tan leather sectional under an arched mirror",
    badge: null,
  },
];

const EDGE_STAYS: (CardStay & { edge: string })[] = [
  {
    ...CARD_STAYS[0],
    id: "long-title",
    title: "Fireside loft in Alfama with a terrace over the river and the castle walls",
    edge: "A long title wraps, and the footer stays at the foot.",
  },
  {
    ...CARD_STAYS[1],
    id: "no-photo",
    src: null,
    edge: "No photograph: the frame keeps its 4:3 on the muted rung.",
  },
  {
    ...CARD_STAYS[2],
    id: "no-reviews",
    rating: null,
    badge: "New",
    edge: "No reviews yet: the footer says so in place of the stars.",
  },
];

function StayCard({ stay }: { stay: (typeof CARD_STAYS)[number] }) {
  return (
    <LinkCard>
      <LinkCardMedia>
        {stay.src && (
          <Image
            src={stay.src}
            alt={stay.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {stay.badge && (
          <Badge tone="neutral" ground="pastel" className="absolute inset-s-3 top-3 text-foreground shadow-soft">
            {stay.badge}
          </Badge>
        )}
      </LinkCardMedia>
      {/* The card's own control, raised over the link's layer, so a press on
          the heart saves the stay instead of opening it. Set 12px inside the
          photo, which itself sits 6px in. */}
      <SaveToggle label={stay.title} className="absolute inset-e-4.5 top-4.5 z-10" />
      <div className="flex flex-1 flex-col p-4">
        <Badge tone="brand">
          <HugeiconsIcon icon={stay.kindIcon} strokeWidth={2} aria-hidden="true" />
          {stay.kind}
        </Badge>
        <h4 className="mt-3 text-base font-medium">
          <LinkCardLink href="#link-card">{stay.title}</LinkCardLink>
        </h4>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
          {stay.place}
        </p>
        {/* Held to the foot, so a title that runs to two lines moves no
            footer out of line with its neighbours'. */}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t pt-3.5 text-sm">
            {stay.rating ? (
              <span className="flex items-center gap-1.5">
                <Rating value={stay.rating} />
                <span className="font-medium tabular-nums">{stay.rating}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">No reviews yet</span>
            )}
            <Price amount={stay.price} per="night" />
          </div>
        </div>
      </div>
    </LinkCard>
  );
}

function LinkCardBlock() {
  const small = CARD_STAYS[2];
  return (
    <DsBlock
      id="link-card"
      title="Link card"
      when="a card goes to one page: a stay, a course, an event. Its own buttons sit above."
      source="components/ui/link-card.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus"]}
          rows={[
            {
              label: "Small card",
              render: () => (
                <Cell>
                  <LinkCard size="sm" className="w-44">
                    <LinkCardMedia>
                      <Image src={small.src!} alt={small.alt} fill sizes="176px" className="object-cover" />
                    </LinkCardMedia>
                    <div className="p-3">
                      <h4 className="text-sm font-medium">
                        <LinkCardLink href="#link-card">{small.title}</LinkCardLink>
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">{small.place}</p>
                    </div>
                  </LinkCard>
                </Cell>
              ),
            },
          ]}
        />
      }
      edges={
        <Specimen className="grid grid-cols-1 gap-6 bg-background sm:grid-cols-2 lg:grid-cols-3">
          {EDGE_STAYS.map((stay) => (
            <div key={stay.id} className="flex flex-col gap-3">
              <Caption>{stay.edge}</Caption>
              <div className="grid flex-1">
                <StayCard stay={stay} />
              </div>
            </div>
          ))}
        </Specimen>
      }
    >
      <Specimen className="grid grid-cols-1 gap-6 bg-background sm:grid-cols-2 lg:grid-cols-3">
        {CARD_STAYS.map((stay) => (
          <StayCard key={stay.id} stay={stay} />
        ))}
      </Specimen>
    </DsBlock>
  );
}

export function KitDisplay() {
  return (
    <>
      <BreadcrumbBlock />
      <NavigationMenuBlock />
      <PaginationBlock />
      <CarouselNavBlock />
      <StoryBarsBlock />
      <AccordionBlock />
      <DialogBlock />
      <DrawerBlock />
      <MenuBlock />
      <AvatarBlock />
      <RatingBlock />
      <PriceBlock />
      <ProgressBlock />
      <SkeletonBlock />
      <EmptyStateBlock />
      <LinkCardBlock />
    </>
  );
}
