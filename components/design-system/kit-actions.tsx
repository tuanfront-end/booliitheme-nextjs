"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Calendar03Icon,
  CalendarAdd02Icon,
  FilterHorizontalIcon,
  Location01Icon,
  Mail01Icon,
  Notification03Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { StateGrid, type DsState } from "@/components/design-system/state-grid";
import { Badge, CountBadge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardCorner, cardCornerGroup } from "@/components/ui/card-corner";
import { IconButton } from "@/components/ui/icon-button";
import { SaveToggle } from "@/components/ui/save-toggle";
import { ShareMenu } from "@/components/ui/share-menu";
import { Toaster, toast } from "@/components/ui/toast";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { photos } from "@/lib/data/photos";
import { cn } from "@/lib/utils";

// The actions: what a visitor presses to act on a listing, and the small
// signs around them. Every specimen is the component the pages import, fed a
// booking marketplace's own words, so the sheet cannot say one thing while a
// page does another. Each block opens on the control where a page would put
// it, and its grid puts it in every state it has.

const PHOTO = photos.mistOverQuiraing.src;
const LISTING = {
  title: "Quiraing sunrise hike",
  meta: "Isle of Skye · Sat 14 Nov",
  url: "/design-system#share-menu",
  alt: photos.mistOverQuiraing.alt,
};

const TOOLS = [
  { label: "Add to calendar", icon: CalendarAdd02Icon },
  { label: "Get directions", icon: Location01Icon },
  { label: "Print the itinerary", icon: PrinterIcon },
];

const PRESSED: DsState[] = ["rest", "hover", "active", "focus"];
const ALL: DsState[] = ["rest", "hover", "active", "focus", "disabled", "loading"];

/** A labelled line inside a specimen card. Captioned controls of different
 *  heights stand on one baseline with `align="end"`. */
function Row({
  label,
  align = "center",
  stack = false,
  children,
}: {
  label: string;
  align?: "center" | "end";
  /** Separate uses rather than one set: each takes its own line on a phone,
   *  where three in a wrapping row would read as a filter row that broke. */
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="text-sm text-muted-foreground sm:w-36 sm:shrink-0">{label}</span>
      <div
        className={cn(
          "flex min-w-0 flex-1 gap-3",
          stack ? "flex-col items-start sm:flex-row sm:flex-wrap" : "flex-wrap",
          align === "end" ? "sm:items-end" : "sm:items-center",
          !stack && (align === "end" ? "items-end" : "items-center"),
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** A control with the few words that name it underneath. */
function Captioned({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-xs text-muted-foreground">{caption}</span>
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────

const BUTTONS = [
  { label: "Primary", variant: "default", text: "Reserve" },
  { label: "Secondary", variant: "secondary", text: "Message" },
  { label: "Outline", variant: "outline", text: "Share" },
  { label: "Ghost", variant: "ghost", text: "Clear" },
  { label: "Destructive", variant: "destructive", text: "Cancel" },
  { label: "Link", variant: "link", text: "View map" },
] as const;

/** Press it: it works for a moment with its label still on, then lets go. */
function LoadingDemo() {
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 1800);
    return () => window.clearTimeout(timer);
  }, [busy]);
  return (
    <Button loading={busy} onClick={() => setBusy(true)}>
      Request to book
      <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
    </Button>
  );
}

function ButtonBlock() {
  return (
    <DsBlock
      id="button"
      title="Button"
      when="a press does something: book, send, apply. Each view has one primary."
      source="components/ui/button.tsx"
      variants={
        <Specimen className="flex flex-col gap-8">
          <Row label="With a glyph">
            <Button variant="outline">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.5} aria-hidden="true" data-icon="inline-start" />
              Add dates
            </Button>
            <Button>
              Continue to payment
              <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
          </Row>
          <Row label="Soft, on the page">
            <Button variant="soft">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.5} aria-hidden="true" data-icon="inline-start" />
              Add dates
            </Button>
          </Row>
          <Row label="As a link">
            <Button variant="secondary" render={<Link href="#button" />}>
              Browse stays
              <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
            <Button variant="link" render={<Link href="#button" />}>
              Read the house rules
            </Button>
          </Row>
          <Row label="Press to load">
            <LoadingDemo />
          </Row>
        </Specimen>
      }
      sizes={
        <Specimen>
          <Row label="Three heights" align="end">
            <Captioned caption="sm · 40, compact">
              <Button size="sm" variant="outline">
                <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={1.5} aria-hidden="true" data-icon="inline-start" />
                Filters
              </Button>
            </Captioned>
            <Captioned caption="default · 40">
              <Button variant="secondary">Check availability</Button>
            </Captioned>
            <Captioned caption="lg · 44, main action">
              <Button size="lg">Reserve for $412</Button>
            </Captioned>
          </Row>
        </Specimen>
      }
      states={
        <StateGrid
          states={ALL}
          rows={BUTTONS.map((b) => ({
            label: b.label,
            render: (s) => (
              <Button variant={b.variant} disabled={s === "disabled"} loading={s === "loading"}>
                {b.text}
              </Button>
            ),
          }))}
        />
      }
      edges={
        <Specimen className="flex flex-col gap-8">
          <Row label="A long label">
            <Captioned caption="It stays on one line and the button grows. Cut the words, never the button.">
              <Button variant="secondary">Request to book for four guests</Button>
            </Captioned>
          </Row>
          <Row label="Full width on a phone">
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Button size="lg" className="w-full">
                Reserve for $412
              </Button>
              <Button variant="secondary" className="w-full">
                Message the host
              </Button>
            </div>
          </Row>
        </Specimen>
      }
    >
      <Specimen className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-base">
            <span className="font-medium tabular-nums">$412</span>
            <span className="text-muted-foreground"> for 3 nights</span>
          </p>
          <p className="text-sm text-muted-foreground">Free cancellation until 10 March</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">Message the host</Button>
          <Button>Reserve</Button>
        </div>
      </Specimen>
    </DsBlock>
  );
}

// ── Icon button ──────────────────────────────────────────────────────────

const ICON_BUTTONS = [
  { label: "Ghost", variant: "ghost" },
  { label: "Outline", variant: "outline" },
  { label: "Secondary", variant: "secondary" },
  { label: "Primary", variant: "default" },
] as const;

function IconButtonBlock() {
  const glyph = <HugeiconsIcon icon={CalendarAdd02Icon} strokeWidth={1.5} aria-hidden="true" />;
  return (
    <DsBlock
      id="icon-button"
      title="Icon button"
      when="one glyph says the whole action, and its label says it to a screen reader."
      source="components/ui/icon-button.tsx"
      sizes={
        <Specimen>
          <Row label="Three sizes" align="end">
            <Captioned caption="sm · 36, reaches 40">
              {/* The dashed square is the 40px the pseudo-element answers. */}
              <span className="relative inline-flex">
                <IconButton size="sm" variant="outline" aria-label="Add to calendar">
                  {glyph}
                </IconButton>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-0.5 rounded-control border border-dashed border-primary-ink"
                />
              </span>
            </Captioned>
            <Captioned caption="default · 40">
              <IconButton variant="outline" aria-label="Add to calendar">
                {glyph}
              </IconButton>
            </Captioned>
            <Captioned caption="lg · 44">
              <IconButton size="lg" variant="outline" aria-label="Add to calendar">
                {glyph}
              </IconButton>
            </Captioned>
          </Row>
        </Specimen>
      }
      states={
        <StateGrid
          states={ALL}
          rows={ICON_BUTTONS.map((b) => ({
            label: b.label,
            render: (s) => (
              <IconButton
                variant={b.variant}
                aria-label="Add to calendar"
                disabled={s === "disabled"}
                loading={s === "loading"}
              >
                {glyph}
              </IconButton>
            ),
          }))}
        />
      }
    >
      <Specimen className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-medium">{LISTING.title}</h4>
          <p className="text-sm text-muted-foreground">{LISTING.meta} · 5:45 AM</p>
        </div>
        <div className="flex items-center gap-2">
          {TOOLS.map((t) => (
            <IconButton key={t.label} variant="ghost" aria-label={t.label}>
              <HugeiconsIcon icon={t.icon} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          ))}
        </div>
      </Specimen>
    </DsBlock>
  );
}

// ── Save toggle ──────────────────────────────────────────────────────────

/** A swatch of photograph for a disc to stand on, as it does on a card. */
function PhotoTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative grid size-16 place-items-center overflow-hidden rounded-sm outline-none">
      <Image src={PHOTO} alt="" fill sizes="64px" className="object-cover" />
      <span className="relative inline-flex">{children}</span>
    </span>
  );
}

function SaveToggleBlock() {
  const forms = [
    { label: "Disc", variant: "disc", saved: false },
    { label: "Disc, saved", variant: "disc", saved: true },
    { label: "Count", variant: "count", saved: false },
    { label: "Count, saved", variant: "count", saved: true },
    { label: "Pill", variant: "pill", saved: false },
    { label: "Pill, saved", variant: "pill", saved: true },
  ] as const;

  return (
    <DsBlock
      id="save-toggle"
      title="Save toggle"
      when="a visitor keeps a stay or a host to come back to. Saved is a coral heart."
      source="components/ui/save-toggle.tsx"
      variants={
        <Specimen className="flex flex-col gap-8">
          <Captioned caption="Count, in a card's footer">
            <div className="flex w-full max-w-sm items-center justify-between border-y border-border py-3">
              <span className="text-sm text-muted-foreground">Sat 14 Nov · 5:45 AM</span>
              <SaveToggle variant="count" count={486} label={LISTING.title} />
            </div>
          </Captioned>
          <Captioned caption="Pill, beside a page title">
            <div className="flex flex-wrap items-center gap-3">
              <SaveToggle variant="pill" label={LISTING.title} />
              <ShareMenu labelled url={LISTING.url} title={LISTING.title} meta={LISTING.meta} image={PHOTO} />
            </div>
          </Captioned>
        </Specimen>
      }
      states={
        <StateGrid
          states={PRESSED}
          rows={forms.map((f) => ({
            label: f.label,
            render: () => {
              const control = (
                <SaveToggle variant={f.variant} defaultPressed={f.saved} count={486} label={LISTING.title} />
              );
              return f.variant === "disc" ? <PhotoTile>{control}</PhotoTile> : control;
            },
          }))}
        />
      }
    >
      <Specimen>
        <Captioned caption="Disc, on a photograph">
          <div className="relative aspect-[4/3] w-64 max-w-full overflow-hidden rounded-md">
            <Image src={PHOTO} alt={LISTING.alt} fill sizes="256px" className="object-cover" />
            <SaveToggle label={LISTING.title} className="absolute top-3 inset-e-3" />
          </div>
        </Captioned>
      </Specimen>
    </DsBlock>
  );
}

// ── Toggle button ────────────────────────────────────────────────────────

function ToggleButtonBlock() {
  const tones = [
    { label: "Quiet", tone: "quiet", pressed: false },
    { label: "Quiet, pressed", tone: "quiet", pressed: true },
    { label: "Lead", tone: "lead", pressed: false },
    { label: "Lead, pressed", tone: "lead", pressed: true },
  ] as const;

  return (
    <DsBlock
      id="toggle-button"
      title="Toggle button"
      when="one press turns a thing on until the next: follow, compare, price alerts."
      source="components/ui/toggle-button.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus", "disabled"]}
          rows={tones.map((t) => ({
            label: t.label,
            render: (s) => (
              <ToggleButton
                tone={t.tone}
                defaultPressed={t.pressed}
                disabled={s === "disabled"}
                pressedLabel="Following"
              >
                Follow
              </ToggleButton>
            ),
          }))}
        />
      }
    >
      <Specimen className="flex flex-col gap-8">
        <Row label="Quiet inside a block, lead for a page" stack>
          <ToggleButton>Compare</ToggleButton>
          <ToggleButton
            icon={<HugeiconsIcon icon={Notification03Icon} strokeWidth={1.5} aria-hidden="true" />}
            pressedLabel="Alerts on"
          >
            Price alerts
          </ToggleButton>
          <ToggleButton tone="lead" size="lg" pressedLabel="Following Marta">
            Follow Marta
          </ToggleButton>
        </Row>
      </Specimen>
    </DsBlock>
  );
}

// ── Share menu ───────────────────────────────────────────────────────────

function ShareMenuBlock() {
  return (
    <DsBlock
      id="share-menu"
      title="Share menu"
      when="a listing is worth sending on: a link, a message, the phone's own sheet."
      source="components/ui/share-menu.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "focus"]}
          rows={[
            {
              label: "Glyph",
              render: () => <ShareMenu url={LISTING.url} title={LISTING.title} meta={LISTING.meta} image={PHOTO} />,
            },
            {
              label: "Labelled",
              render: () => (
                <ShareMenu labelled url={LISTING.url} title={LISTING.title} meta={LISTING.meta} image={PHOTO} />
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-medium tracking-tight">{LISTING.title}</h4>
          <p className="text-sm text-muted-foreground">Guided · 4 hours · from $68 a person</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SaveToggle variant="pill" label={LISTING.title} />
          <ShareMenu labelled url={LISTING.url} title={LISTING.title} meta={LISTING.meta} image={PHOTO} align="end" />
        </div>
      </Specimen>
    </DsBlock>
  );
}

// ── Card corner ──────────────────────────────────────────────────────────

/** The house's one-target card: the title's link stretched over the face. */
const STRETCHED =
  "outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring";

function MiniCard() {
  return (
    <div
      className={cn(
        cardCornerGroup,
        "relative flex h-28 w-44 flex-col justify-end rounded-md bg-accent p-4 transition-colors active:bg-muted",
      )}
    >
      <Link href="#card-corner" className={cn(STRETCHED, "text-sm font-medium after:rounded-md")}>
        Coastal stays
      </Link>
      <span className="text-sm text-muted-foreground">214 places</span>
      <CardCorner />
    </div>
  );
}

function CardCornerBlock() {
  return (
    <DsBlock
      id="card-corner"
      title="Card corner"
      when="a whole card is one link and has to say so where it is pointed at or tabbed to."
      source="components/ui/card-corner.tsx"
      states={
        <StateGrid states={["rest", "hover", "focus"]} rows={[{ label: "Link card", render: () => <MiniCard /> }]} />
      }
    >
      <Specimen className="flex justify-center bg-background">
        <article
          className={cn(
            cardCornerGroup,
            "relative flex w-full max-w-xs flex-col rounded-lg bg-card p-1.5 ring-1 ring-border ring-inset",
          )}
        >
          {/* 6px in from the card's edge, and rounded 6px less than it, so the
              two corners stay parallel round the turn. */}
          <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-lg)-0.375rem)]">
            <Image
              src={PHOTO}
              alt={LISTING.alt}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-answer ease-answer group-hover/corner:scale-103 motion-reduce:transition-none"
            />
            <Badge tone="brand" ground="photo" className="absolute top-3 inset-s-3">
              Guest favourite
            </Badge>
            <CardCorner />
          </div>
          <div className="flex flex-col gap-1 px-3.5 pt-4 pb-3">
            <h4 className="text-base font-medium">
              <Link href="#card-corner" className={cn(STRETCHED, "after:rounded-lg")}>
                {LISTING.title}
              </Link>
            </h4>
            <p className="text-sm text-muted-foreground">Guided · 4 hours · from $68</p>
          </div>
          <div className="mx-3.5 flex items-center justify-between border-t border-border py-3">
            <span className="text-sm text-muted-foreground">Sat 14 Nov · 5:45 AM</span>
            <SaveToggle variant="count" count={486} label={LISTING.title} />
          </div>
        </article>
      </Specimen>
    </DsBlock>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────

// Ordered so peach never stands beside sun: they sit 28° apart.
const CHIPS: { tone: BadgeTone; label: string; dot?: boolean }[] = [
  { tone: "brand", label: "Guest favourite" },
  { tone: "leaf", label: "Available tonight", dot: true },
  { tone: "sky", label: "Just listed" },
  { tone: "iris", label: "Top-rated host" },
  { tone: "sun", label: "2 rooms left" },
  { tone: "coral", label: "Going fast" },
  { tone: "peach", label: "Weekend deal" },
  { tone: "lime", label: "Eco-certified" },
  { tone: "neutral", label: "Sold out" },
];

function BadgeBlock() {
  return (
    <DsBlock
      id="badge"
      title="Badge"
      when="a card carries a short fact: a status, a deal, how many are left."
      source="components/ui/badge.tsx"
      variants={
        <Specimen className="flex flex-col gap-8">
          <Row label="On a tinted band">
            <div className="flex flex-wrap gap-2 rounded-md bg-accent p-4">
              {CHIPS.filter((c) => ["brand", "leaf", "sun", "neutral"].includes(c.tone)).map((c) => (
                <Badge key={c.tone} tone={c.tone} ground="pastel">
                  {c.label}
                </Badge>
              ))}
            </div>
          </Row>
          <Row label="On a photograph">
            <div className="relative h-28 w-full max-w-md overflow-hidden rounded-md">
              <Image src={PHOTO} alt={LISTING.alt} fill sizes="448px" className="object-cover" />
              <div className="absolute top-3 inset-s-3 flex flex-wrap gap-2">
                <Badge tone="brand" ground="photo">
                  Guest favourite
                </Badge>
                <Badge tone="coral" ground="photo">
                  Going fast
                </Badge>
                <Badge tone="neutral" ground="photo">
                  Sold out
                </Badge>
              </div>
            </div>
          </Row>
          <Row label="A count on a control">
            <div className="flex items-center gap-4">
              <Button variant="outline" aria-label="Filters, 3 applied">
                <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={1.5} aria-hidden="true" data-icon="inline-start" />
                Filters
                <CountBadge count={3} className="ring-card" />
              </Button>
              <IconButton variant="outline" aria-label="Messages, 12 unread">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.5} aria-hidden="true" />
                <CountBadge count={12} className="ring-card" />
              </IconButton>
            </div>
          </Row>
        </Specimen>
      }
    >
      <Specimen>
        <Row label="On a card, a hue's tint under its own ink">
          {CHIPS.map((c) => (
            <Badge key={c.tone} tone={c.tone} dot={c.dot}>
              {c.label}
            </Badge>
          ))}
        </Row>
      </Specimen>
    </DsBlock>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────

function TooltipBlock() {
  return (
    <DsBlock
      id="tooltip"
      title="Tooltip"
      when="an icon-only control needs its name in words. Never the only place a fact lives."
      source="components/ui/tooltip.tsx"
    >
      {/* Room above the row for the tooltip that opens with the page. */}
      <Specimen className="pt-16 sm:pt-20">
        <Row label="Point at one">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              {TOOLS.map((t, i) => (
                <Tooltip key={t.label} defaultOpen={i === 0}>
                  <TooltipTrigger render={<IconButton variant="outline" aria-label={t.label} />}>
                    <HugeiconsIcon icon={t.icon} strokeWidth={1.5} aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>{t.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </Row>
      </Specimen>
    </DsBlock>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────

function ToastBlock() {
  return (
    <DsBlock
      id="toast"
      title="Toast"
      when="a press has finished and the visitor should hear it did: copied, removed, failed."
      source="components/ui/toast.tsx"
      edges={
        <Specimen>
          <Row label="Press to see" stack>
            <Captioned caption="A long notice wraps inside its width, and its close stays put.">
              <Button
                variant="outline"
                onClick={() =>
                  toast("Your request for the Fireside loft in Alfama went to Ana", {
                    type: "success",
                    description: "She usually answers within the hour. Nothing is charged until she accepts.",
                  })
                }
              >
                A long notice
              </Button>
            </Captioned>
            <Captioned caption="A second press replaces the first, so two never stack.">
              <Button
                variant="outline"
                onClick={() => {
                  toast("Saved to Lisbon in March", { type: "success" });
                  window.setTimeout(() => toast("Saved to Weekend ideas", { type: "success" }), 600);
                }}
              >
                Two in a row
              </Button>
            </Captioned>
          </Row>
        </Specimen>
      }
    >
      <Specimen>
        <Row label="Raise one">
          <Button variant="outline" onClick={() => toast("Link copied", { type: "success" })}>
            A confirmation
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Removed from your saved trips", {
                action: { label: "Undo", onClick: () => toast("Back in your saved trips", { type: "success" }) },
              })
            }
          >
            One with Undo
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Couldn't reach the host", {
                type: "error",
                description: "Check your connection and send it again.",
              })
            }
          >
            An error
          </Button>
        </Row>
      </Specimen>
    </DsBlock>
  );
}

export function KitActions() {
  return (
    <>
      {/* The sheet's own Toaster, for the toast and share specimens. Only the
          first one mounted draws, so a Toaster in the layout makes this one
          silent rather than doubling every notice. */}
      <Toaster />
      <ButtonBlock />
      <IconButtonBlock />
      <SaveToggleBlock />
      <ToggleButtonBlock />
      <ShareMenuBlock />
      <CardCornerBlock />
      <BadgeBlock />
      <TooltipBlock />
      <ToastBlock />
    </>
  );
}
