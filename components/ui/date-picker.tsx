// DatePicker — a field that opens presets beside a month; picking either fills the field and closes it.
"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import type { DateRange, Matcher } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { frameInk } from "@/components/ui/filter-rail";
import { cn } from "@/lib/utils";
import { dateFormat } from "@/lib/format";

// The "When" of a search bar, and any date a form asks for. The field is a
// small label over the value it holds; pressed, it opens a column of presets,
// each a name over its real dates, beside a month. Picking either fills the
// field and closes it, and focus goes back to the field. A preset is a name
// for dates inside the popup; every trigger shows the dates alone — beside a
// label, a second name for the same day is noise.

/** What the field holds: a day, or a stay from `from` to `to`, and the
 *  preset it was picked by, if any. */
export type DateValue = { from: Date; to?: Date; preset?: string };

/** A preset: its name, and the dates it stands for. */
export type DatePreset = { id: string; label: string; from: Date; to?: Date };

const sameDay = (a?: Date, b?: Date) => Boolean(a && b) && a!.toDateString() === b!.toDateString();

const dayFormat = dateFormat({ weekday: "short", month: "short", day: "numeric" });
const spanFormat = dateFormat({ month: "short", day: "numeric" });

/** "Fri, Oct 9" for a day, "Oct 9 – 11" or "Oct 30 – Nov 1" for a span. */
export function formatDates({ from, to }: { from: Date; to?: Date }) {
  return to && !sameDay(from, to) ? spanFormat.formatRange(from, to) : dayFormat.format(from);
}

const atDay = (from: Date, add: number) => {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + add);
  return d;
};

/** Tonight, tomorrow and this weekend, from the day given. The weekend runs
 *  Friday to Sunday: from Friday on it is the one under way, and on a
 *  weekday it is the one coming. */
export function quickDates(today: Date): DatePreset[] {
  const dow = today.getDay();
  const weekend =
    dow === 0
      ? { from: atDay(today, 0) }
      : dow >= 5
        ? { from: atDay(today, 0), to: atDay(today, 7 - dow) }
        : { from: atDay(today, 5 - dow), to: atDay(today, 7 - dow) };
  return [
    { id: "tonight", label: "Tonight", from: atDay(today, 0) },
    { id: "tomorrow", label: "Tomorrow", from: atDay(today, 1) },
    { id: "weekend", label: "This weekend", ...weekend },
  ];
}

// The ring every focusable part wears: full strength, off the edge.
const ring = "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

// Three dresses, the Select's own split. `card` is a hero's field: a white
// card on its hairline, the label, the value large, and a line under it with
// the dates a preset stands for. `field` sits among a form's fields, a pill
// with a quiet label over the date. `bare` sits inside a bar that draws its
// own frame and shows itself only on hover. A menu trigger does not shrink on a
// press — its popup would move with it — so each moves its fill instead.
const trigger = cva(
  cn(
    "group/date relative w-full min-w-0 text-start select-none disabled:cursor-not-allowed",
    "transition-[background-color,box-shadow,border-color] duration-answer ease-answer",
    ring,
  ),
  {
    variants: {
      variant: {
        card: cn(
          "grid grid-cols-[minmax(0,1fr)_auto] content-start items-center gap-x-2 gap-y-1 rounded-lg border bg-card px-5 py-4",
          "hover:enabled:shadow-soft active:enabled:bg-accent data-popup-open:shadow-soft",
          "aria-invalid:border-destructive",
        ),
        field: cn(
          "flex min-h-14 items-center gap-3 rounded-control border border-input bg-card px-6 py-2",
          "hover:enabled:bg-accent active:enabled:bg-muted data-popup-open:bg-accent",
          "disabled:bg-accent aria-invalid:border-destructive",
        ),
        bare: cn(
          "flex min-h-14 items-center gap-3 rounded-control px-6 py-2",
          "hover:enabled:bg-accent active:enabled:bg-muted data-popup-open:bg-accent",
        ),
      },
    },
    defaultVariants: { variant: "card" },
  },
);

type DatePickerProps = {
  /** The small label over the value: "When", "Check in". */
  label: string;
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  onValueChange?: (value: DateValue | null) => void;
  /** Tonight, tomorrow, this weekend — `quickDates(today)` writes these. */
  presets?: DatePreset[];
  /** A day, or a stay from a first night to a last. */
  mode?: "single" | "range";
  variant?: "card" | "field" | "bare";
  /** What the field reads with nothing picked: "Add a date", or "Add dates" for a stay. */
  placeholder?: string;
  /** Days that cannot be picked, drawn struck through: the ones gone, the ones booked out. */
  disabledDays?: Matcher | Matcher[];
  /** The line under the month saying what a struck-through day means. */
  legend?: React.ReactNode;
  today?: Date;
  startMonth?: Date;
  endMonth?: Date;
  numberOfMonths?: number;
  disabled?: boolean;
  /** Said under the field and on it to a screen reader, when what is picked will not do. */
  error?: string;
  className?: string;
};

function DatePicker({
  label,
  value: controlled,
  defaultValue = null,
  onValueChange,
  presets = [],
  mode = "single",
  variant = "card",
  placeholder,
  disabledDays,
  legend,
  today,
  startMonth,
  endMonth,
  numberOfMonths,
  disabled,
  error,
  className,
}: DatePickerProps) {
  const id = React.useId();
  const [own, setOwn] = React.useState<DateValue | null>(defaultValue);
  const value = controlled === undefined ? own : controlled;
  const [open, setOpen] = React.useState(false);
  // The first night of a stay, held while the last is still to come. Closing
  // drops it: half a stay is not a value.
  const [draft, setDraft] = React.useState<DateRange | undefined>();
  const popup = React.useRef<HTMLDivElement>(null);

  const commit = (next: DateValue | null) => {
    if (controlled === undefined) setOwn(next);
    onValueChange?.(next);
    setDraft(undefined);
    setOpen(false);
  };

  // A pick that lands on a preset's dates takes its name, so the popup marks
  // "Tomorrow" whichever way tomorrow was chosen. The trigger shows the date
  // alone: a relative word beside it is a second thing to read.
  const named = (from: Date, to?: Date): DateValue => {
    const hit = presets.find((p) => sameDay(p.from, from) && (p.to ? sameDay(p.to, to ?? from) : !to || sameDay(to, from)));
    return { from, to, preset: hit?.id };
  };

  const dates = value ? formatDates(value) : "";
  const empty = placeholder ?? (mode === "range" ? "Add dates" : "Add a date");
  const shown = value ? dates : empty;
  const errorId = error ? `${id}-error` : undefined;

  const icon = (
    <HugeiconsIcon icon={Calendar04Icon} size={14} strokeWidth={1.8} aria-hidden className="shrink-0 text-primary-ink" />
  );
  const chevron = (
    <ChevronDownIcon
      aria-hidden
      className="size-4 shrink-0 text-muted-foreground transition-transform duration-answer ease-answer group-data-popup-open/date:rotate-180 motion-reduce:transition-none"
    />
  );

  return (
    <div data-slot="date-picker" className={cn("relative min-w-0", className)}>
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setDraft(undefined);
        }}
      >
        <Popover.Trigger
          data-slot="date-picker-trigger"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={trigger({ variant })}
        >
          {variant === "card" ? (
            <>
              <span className="col-span-2 text-sm text-muted-foreground group-disabled/date:text-muted-foreground">
                {label}
              </span>
              <span
                className={cn(
                  "flex h-9 min-w-0 items-center truncate text-xl tracking-tight",
                  value ? "text-foreground group-disabled/date:text-muted-foreground" : "text-muted-foreground",
                )}
              >
                {shown}
              </span>
              {chevron}
              <span
                className={cn(
                  "col-span-2 flex min-w-0 items-center gap-1.5 text-xs",
                  error ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {!error && icon}
                <span className="truncate tabular-nums">
                  {error ?? (value ? "Change dates" : "Pick a day")}
                </span>
              </span>
            </>
          ) : (
            <>
              {/* The label is the quiet half and the date the loud one, a
                  step of ink and a step of weight apart; with nothing picked
                  the line under the label is a placeholder, so it drops the
                  weight and the ink with it. */}
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span
                  className={cn(
                    "truncate text-base tabular-nums md:text-sm",
                    value ? "font-medium text-foreground group-disabled/date:text-muted-foreground" : "text-muted-foreground",
                  )}
                >
                  {value ? dates : empty}
                </span>
              </span>
              {chevron}
            </>
          )}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={16} className="isolate z-50">
            <Popover.Popup
              ref={popup}
              data-slot="date-picker-popup"
              // It opens on what is chosen: the preset's card, or else the
              // picked day, or else the day the month offers first.
              initialFocus={() =>
                popup.current?.querySelector<HTMLElement>('[data-preset][aria-pressed="true"]') ??
                popup.current?.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]') ??
                true
              }
              className={cn(
                "max-w-[calc(100vw-2rem)] origin-(--transform-origin) rounded-xl bg-popover p-4 text-popover-foreground shadow-soft-lg outline-none sm:rounded-2xl sm:p-6",
                "transition-[opacity,scale] duration-spring ease-spring",
                "data-starting-style:scale-[0.98] data-starting-style:opacity-0",
                "data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer",
              )}
            >
              <Popover.Title className="sr-only">{label}</Popover.Title>
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
                {presets.length > 0 && (
                  // On a phone the presets are short rows over the month;
                  // from sm, a column of cards beside it.
                  <div role="group" aria-label="Quick picks" className="flex flex-col gap-2 sm:w-44 sm:shrink-0 sm:gap-3">
                    {presets.map((p) => {
                      const on = value?.preset === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          data-slot="date-picker-preset"
                          data-preset=""
                          aria-pressed={on}
                          onClick={() => commit({ from: p.from, to: p.to, preset: p.id })}
                          className={cn(
                            "flex min-w-0 items-baseline justify-between gap-3 rounded-sm border px-4 py-3 text-start transition-colors hover:bg-accent active:bg-muted",
                            "sm:flex-col sm:items-start sm:justify-start sm:gap-1 sm:rounded-lg sm:p-5",
                            ring,
                            // The picked card is framed in ink, two pixels: a
                            // state shown by its edge alone has to read.
                            frameInk,
                            "border-border aria-pressed:border-transparent aria-pressed:ring-2 aria-pressed:ring-inset aria-pressed:ring-(--frame-ink)",
                          )}
                        >
                          <span className="max-w-full truncate text-sm font-medium text-foreground sm:text-base">{p.label}</span>
                          <span className="max-w-full truncate text-sm text-muted-foreground tabular-nums">
                            {formatDates(p)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="min-w-0">
                  {mode === "range" ? (
                    <Calendar
                      mode="range"
                      // A stay is a night at least; a press on a whole stay
                      // starts a new one from that day; and a stay may not
                      // run over a night that cannot be booked.
                      min={1}
                      resetOnSelect
                      excludeDisabled
                      selected={draft ?? (value ? { from: value.from, to: value.to ?? value.from } : undefined)}
                      defaultMonth={draft?.from ?? value?.from ?? today}
                      onSelect={(range) => {
                        if (range?.from && range.to) commit(named(range.from, range.to));
                        else setDraft(range);
                      }}
                      disabled={disabledDays}
                      legend={legend}
                      today={today}
                      startMonth={startMonth}
                      endMonth={endMonth}
                      numberOfMonths={numberOfMonths}
                    />
                  ) : (
                    <Calendar
                      mode="single"
                      // A preset is shown on its card, not in the month: the
                      // month holds a day someone pressed.
                      selected={value && !value.preset ? value.from : undefined}
                      defaultMonth={value?.from ?? today}
                      onSelect={(day) => day && commit(named(day))}
                      disabled={disabledDays}
                      legend={legend}
                      today={today}
                      startMonth={startMonth}
                      endMonth={endMonth}
                      numberOfMonths={numberOfMonths}
                    />
                  )}
                </div>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      {error && variant !== "card" && (
        <p id={errorId} className="mt-2 ps-6 text-sm text-destructive">
          {error}
        </p>
      )}
      {error && variant === "card" && (
        <span id={errorId} className="sr-only">
          {error}
        </span>
      )}
    </div>
  );
}

export { DatePicker };
export type { DatePickerProps };
