// SlotPicker — days and the open times on each, booked from one button that says what it books.
"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { frameInk } from "@/components/ui/filter-rail";
import { railFade, useRailFade } from "@/components/ui/rail-fade";
import { cn } from "@/lib/utils";
import { dateFormat } from "@/lib/format";

// Two layouts of one control. The default is a card's: a row of days, the
// zone the times are in, the day's times in a grid with the taken ones shut,
// and one button carrying the pick — "Book Tue, Oct 13 at 8:00 AM". `week` is
// a page's: a week at a time behind a pager, seven columns of times, and the
// length of the meeting beside the pager. Both end on the same confirmation,
// drawn in the cell the picker stood in, so the card keeps its height.
//
// The days and their times come in through props, already in the visitor's
// zone; nothing here reads a clock.

/** One time on offer. `id` is unique across every day. */
export type Slot = { id: string; label: string; taken?: boolean };
/** A day and its times. */
export type SlotDay = { id: string; date: Date; slots: Slot[] };

const weekday = dateFormat({ weekday: "short" });
const longDay = dateFormat({ weekday: "short", month: "short", day: "numeric" });
const spokenDay = dateFormat({ weekday: "long", month: "long", day: "numeric" });
const span = dateFormat({ month: "short", day: "numeric" });

const ring = "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

// The buttons below come from Button, whose own focus ring is a half-strength
// one; each takes the house ring over it.
const buttonRing =
  "focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

// A row of options on the card: a white bar on its hairline, the picked one
// white inside two pixels of the pick frame's ink (`frameInk`). Both states
// hover down a rung; the frame is what keeps the picked one told apart.
const track = "flex gap-1 rounded-control bg-card p-1 ring-1 ring-border ring-inset";
const option = cn(
  "flex shrink-0 items-center justify-center rounded-[calc(var(--radius-control)-4px)] text-sm whitespace-nowrap select-none press",
  frameInk,
  "hover:bg-accent data-checked:ring-2 data-checked:ring-(--frame-ink) data-checked:ring-inset",
  "data-disabled:cursor-not-allowed data-disabled:text-muted-foreground hover:data-disabled:bg-transparent",
  ring,
);

/** One time, in either layout. The design system draws it alone. */
function SlotChip({
  dense,
  className,
  ...props
}: React.ComponentProps<typeof Radio.Root> & {
  /** The week's chip: smaller type in a narrower column, on a tint. */
  dense?: boolean;
}) {
  return (
    <Radio.Root
      data-slot="slot"
      className={cn(
        "flex items-center justify-center rounded-control whitespace-nowrap tabular-nums select-none press",
        frameInk,
        dense
          ? cn(
              "h-9 bg-accent px-1 text-xs font-medium hover:bg-muted",
              "data-checked:bg-card data-checked:ring-2 data-checked:ring-(--frame-ink) data-checked:ring-inset hover:data-checked:bg-accent",
              "data-disabled:bg-transparent data-disabled:text-muted-foreground data-disabled:line-through hover:data-disabled:bg-transparent",
              reach,
            )
          : cn(
              "h-10 px-2 text-sm ring-1 ring-border ring-inset hover:bg-accent",
              "data-checked:ring-2 data-checked:ring-(--frame-ink)",
              "data-disabled:bg-accent data-disabled:text-muted-foreground data-disabled:ring-0 hover:data-disabled:bg-accent",
            ),
        "data-disabled:cursor-not-allowed",
        ring,
        className,
      )}
      {...props}
    />
  );
}

type Confirmation = {
  /** "Call booked", "Viewing requested". */
  title: string;
  /** What follows the day and time: "with Ana. The link arrives by email." */
  line?: (day: SlotDay, slot: Slot) => React.ReactNode;
  /** A second way on, beside the way back: an "Add to calendar". */
  action?: React.ReactNode;
  /** The way back to the picker. */
  again?: string;
};

type SlotPickerProps = {
  days: SlotDay[];
  variant?: "default" | "week";
  /** The picked time's id. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (slot: string | null) => void;
  /** The zone the times are in, as the visitor reads it: "GMT+7". */
  zone?: string;
  /** The week's lengths, in minutes. The caller hands in the days that suit the one picked. */
  durations?: number[];
  duration?: number;
  defaultDuration?: number;
  onDurationChange?: (minutes: number) => void;
  /** The button's words for a pick. */
  bookLabel?: (day: SlotDay, slot: Slot) => string;
  /** One line under the button. */
  note?: (day: SlotDay, slot: Slot) => React.ReactNode;
  /** Runs on Book. A promise holds the button in its loading state, and a
   *  rejection shows its message over it and keeps the picker. */
  onBook?: (day: SlotDay, slot: Slot) => void | Promise<void>;
  confirmation?: Confirmation;
  /** Opens on the confirmation, for a page that already holds a booking. */
  defaultBooked?: boolean;
  className?: string;
};

const firstFree = (days: SlotDay[]) => {
  for (const d of days) {
    const s = d.slots.find((x) => !x.taken);
    if (s) return s.id;
  }
  return null;
};

const findFree = (days: SlotDay[], id: string | null) => {
  for (const d of days) {
    const s = d.slots.find((x) => x.id === id && !x.taken);
    if (s) return { day: d, slot: s };
  }
  return null;
};

function SlotPicker({
  days,
  variant = "default",
  value: controlled,
  defaultValue,
  onValueChange,
  zone,
  durations = [30, 60, 90],
  duration: controlledLength,
  defaultDuration,
  onDurationChange,
  bookLabel = (d, s) => `Book ${longDay.format(d.date)} at ${s.label}`,
  note,
  onBook,
  confirmation = { title: "Booked", again: "Pick another time" },
  defaultBooked = false,
  className,
}: SlotPickerProps) {
  const id = React.useId();
  const week = variant === "week";

  // A picker that opens with its call to action shut asks the reader to work
  // out what unlocks it, so with nothing handed in it opens on the first time free.
  const [own, setOwn] = React.useState<string | null>(() => (defaultValue === undefined ? firstFree(days) : defaultValue));
  const wanted = controlled === undefined ? own : controlled;
  // What went wrong with the last Book, cleared by the next pick.
  const [failed, setFailed] = React.useState<string | null>(null);
  const pick = (next: string | null) => {
    if (controlled === undefined) setOwn(next);
    onValueChange?.(next);
    setFailed(null);
  };

  const [ownLength, setOwnLength] = React.useState(defaultDuration ?? durations[0]);
  const length = controlledLength ?? ownLength;

  // The pick as the days now offer it. When the days change under it — a
  // longer meeting thins the week out — a time that has gone is cleared
  // rather than moved: a booking quietly slid from 6:00 to 4:30 is the worse
  // of the two, and the grid redrawing with fewer times says what happened.
  const at = React.useMemo(() => findFree(days, wanted), [days, wanted]);

  // The default layout's day: the picked time's, or the one last pressed.
  const [dayId, setDayId] = React.useState<string | null>(null);
  const day = days.find((d) => d.id === dayId) ?? at?.day ?? days.find((d) => d.slots.some((s) => !s.taken)) ?? days[0];

  // The week's page: seven days a page, opening on the pick's.
  const pages = Math.max(1, Math.ceil(days.length / 7));
  const [page, setPage] = React.useState(() => {
    const i = at ? days.indexOf(at.day) : 0;
    return Math.max(0, Math.floor(i / 7));
  });
  const shown = days.slice(page * 7, page * 7 + 7);

  const [booked, setBooked] = React.useState<{ day: SlotDay; slot: Slot } | null>(() =>
    defaultBooked && at ? at : null,
  );
  const [busy, setBusy] = React.useState(false);
  const heading = React.useRef<HTMLParagraphElement>(null);
  const bookButton = React.useRef<HTMLButtonElement>(null);
  const moved = React.useRef(false);
  // The week and the day strip each scroll on a phone, and fade the edge
  // with more past it.
  const weekRail = React.useRef<HTMLDivElement>(null);
  const dayRail = React.useRef<HTMLDivElement>(null);
  useRailFade(weekRail);
  useRailFade(dayRail);

  React.useEffect(() => {
    if (!moved.current) return;
    if (booked) heading.current?.focus();
    else bookButton.current?.focus();
  }, [booked]);

  const book = async () => {
    if (!at || busy) return;
    setFailed(null);
    try {
      const done = onBook?.(at.day, at.slot);
      if (done instanceof Promise) {
        setBusy(true);
        await done;
      }
      moved.current = true;
      setBooked(at);
    } catch (err) {
      setFailed(err instanceof Error && err.message ? err.message : "That time has just gone. Pick another.");
    } finally {
      setBusy(false);
    }
  };

  const spoken = (d: SlotDay, s: Slot) => `${spokenDay.format(d.date)}, ${s.label}${s.taken ? ", taken" : ""}`;

  const footer = (
    <div className="mt-auto flex flex-col gap-3 pt-5">
      {failed && (
        <p role="alert" className="text-sm text-destructive">
          {failed}
        </p>
      )}
      <Button
        ref={bookButton}
        className={cn("w-full", buttonRing)}
        disabled={!at || busy}
        aria-busy={busy || undefined}
        onClick={book}
      >
        {busy && (
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-current border-e-transparent"
          />
        )}
        {busy ? "Booking…" : at ? bookLabel(at.day, at.slot) : "Choose a time"}
      </Button>
      {note && at && <p className="text-center text-sm text-muted-foreground">{note(at.day, at.slot)}</p>}
    </div>
  );

  const picker = week ? (
    <>
      {/* The pager reads from the start and the lengths from the end; once
          the row wraps they stack, each where it began. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous week"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className={buttonRing}
          >
            <ChevronLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
          </Button>
          <p aria-live="polite" className="min-w-32 text-center text-sm font-medium tabular-nums">
            {shown.length ? span.formatRange(shown[0].date, shown[shown.length - 1].date) : ""}
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next week"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
            className={buttonRing}
          >
            <ChevronRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
        {durations.length > 1 && (
          <RadioGroup
            aria-label="Length"
            value={String(length)}
            onValueChange={(v) => {
              const n = Number(v);
              if (controlledLength === undefined) setOwnLength(n);
              onDurationChange?.(n);
            }}
            className={track}
          >
            {durations.map((m) => (
              <Radio.Root key={m} value={String(m)} data-slot="slot-length" className={cn(option, "h-8 px-3 tabular-nums", reach)}>
                {m} min
              </Radio.Root>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Each column has a floor rather than a seventh of the width: seven
          wall-clock times do not fit a phone at any padding, so the week
          scrolls there, and wherever there is room the columns share it.
          The scroller is padded by what a chip paints past itself and pulled
          back by as much, so it scrolls on one axis only. */}
      <RadioGroup
        aria-label={zone ? `Times in your zone, ${zone}` : "Times"}
        value={at?.slot.id ?? null}
        onValueChange={(v) => pick(v as string)}
        ref={weekRail}
        className={cn(
          "no-scrollbar -mx-1 mt-3 -mb-2 grid auto-cols-[minmax(3.5rem,1fr)] grid-flow-col gap-1 overflow-x-auto px-1 py-2",
          railFade,
        )}
      >
        {shown.map((d) => (
          <div key={d.id} role="group" aria-label={spokenDay.format(d.date)} className="min-w-0">
            <p aria-hidden className="text-center text-xs text-muted-foreground">
              {weekday.format(d.date)}
            </p>
            <p aria-hidden className="mt-0.5 text-center text-sm font-medium tabular-nums">
              {d.date.getDate()}
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              {d.slots.length ? (
                d.slots.map((s) => (
                  <SlotChip key={s.id} dense value={s.id} disabled={s.taken} aria-label={spoken(d, s)}>
                    {s.label.replace(":00", "")}
                  </SlotChip>
                ))
              ) : (
                <span className="relative h-9 rounded-control border border-dashed">
                  <span className="sr-only">No times</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      {zone && <p className="mt-3 text-sm text-muted-foreground">Times in your zone, {zone}</p>}
    </>
  ) : (
    <>
      <RadioGroup
        aria-label="Day"
        value={day?.id ?? null}
        onValueChange={(v) => {
          const next = days.find((d) => d.id === v);
          if (!next) return;
          setDayId(next.id);
          // A new day is a new pick: its first time free, so the button
          // under the grid always says what it books.
          pick(next.slots.find((s) => !s.taken)?.id ?? null);
        }}
        ref={dayRail}
        className={cn(track, "no-scrollbar w-full overflow-x-auto", railFade)}
      >
        {days.map((d) => {
          const full = d.slots.every((s) => s.taken);
          return (
            <Radio.Root
              key={d.id}
              value={d.id}
              data-slot="slot-day"
              disabled={full}
              aria-label={`${spokenDay.format(d.date)}${full ? ", fully booked" : ""}`}
              className={cn(option, "h-10 flex-1 basis-auto px-3 tabular-nums")}
            >
              {weekday.format(d.date)} {d.date.getDate()}
            </Radio.Root>
          );
        })}
      </RadioGroup>
      <p id={`${id}-slots`} className="mt-4 text-sm text-muted-foreground">
        {zone ? `Times in your zone, ${zone}` : "Times in your time zone"}
      </p>
      <RadioGroup
        aria-labelledby={`${id}-slots`}
        value={at && at.day.id === day?.id ? at.slot.id : null}
        onValueChange={(v) => pick(v as string)}
        className="mt-2 grid grid-cols-2 gap-2 @[18rem]:grid-cols-3"
      >
        {day?.slots.map((s) => (
          <SlotChip key={s.id} value={s.id} disabled={s.taken} aria-label={spoken(day, s)}>
            {s.label}
          </SlotChip>
        ))}
      </RadioGroup>
    </>
  );

  return (
    <div data-slot="slot-picker" className={cn("@container grid grid-cols-1", className)}>
      {/* The picker and the confirmation share one cell, so whichever is
          showing, the card keeps the height it had. */}
      <div inert={Boolean(booked)} className={cn("flex min-w-0 flex-col [grid-area:1/1]", booked && "invisible")}>
        {picker}
        {footer}
      </div>
      {/* A booking, so a product object: its line is the booking's data at
          14px, which may run to two lines, rather than copy making a case. */}
      <div
        data-object
        inert={!booked}
        aria-hidden={!booked || undefined}
        className={cn("flex flex-col justify-center rounded-sm bg-accent p-6 [grid-area:1/1]", !booked && "invisible")}
      >
        <p ref={heading} tabIndex={-1} className="flex items-center gap-2 text-base font-medium outline-none">
          <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2} aria-hidden className="shrink-0 text-primary-ink" />
          {confirmation.title}
        </p>
        <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
          {booked && (
            <>
              <span className="font-medium text-foreground">
                {longDay.format(booked.day.date)}, {booked.slot.label}
              </span>
              {confirmation.line ? <> {confirmation.line(booked.day, booked.slot)}</> : "."}
            </>
          )}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {confirmation.action}
          <Button
            variant={confirmation.action ? "ghost" : "outline"}
            size="sm"
            className={cn(reach, buttonRing)}
            onClick={() => {
              moved.current = true;
              setBooked(null);
            }}
          >
            {confirmation.again ?? "Pick another time"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { SlotPicker, SlotChip };
export type { SlotPickerProps };
