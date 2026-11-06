// Calendar — a month to pick a day or a stay from, the days that cannot be had struck through.
"use client";

import * as React from "react";
import { useDirection } from "@base-ui/react/direction-provider";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DayPicker, type DayButtonProps, type DayProps, type DropdownProps } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDay } from "@/lib/format";

// react-day-picker is the engine — selection, single and range, the month and
// year dropdowns, the keyboard (arrows, Page Up and Down, Home and End) and the
// labels a screen reader hears. Everything drawn is the house's: one month
// read as a quiet grid, today in the brand's ink, the picked day a filled
// circle of the brand and a stay a band of tint between two. A day that can be
// had looks like any day; only the ones that cannot are marked, lighter and
// struck through, so the month reads at a glance without a key.

// The ring every focused part of the month wears, at full strength and off the
// edge so it shows on a round day. Written out because the buttons below read
// buttonVariants, whose own ring is a half-strength one.
const ring =
  "focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring";

// A day: 36px drawn, 40px pressed through the pseudo-element, round at the
// control seed so a squared preset squares the days with every other control.
const day =
  "relative flex size-9 items-center justify-center rounded-control text-sm tabular-nums text-foreground press outline-none select-none " +
  "after:absolute after:-inset-0.5 after:content-[''] " +
  "hover:bg-accent " + ring + " " +
  "data-today:font-medium data-today:text-primary-ink " +
  // A picked day, or either end of a stay, is a circle of the brand fill —
  // a selected state, which is the fill's job; ink here is the one colour a
  // change of brand never reaches. It hovers by shading what it is, never by
  // going back to the open day's look.
  "data-[picked=single]:bg-primary data-[picked=single]:text-primary-foreground hover:data-[picked=single]:bg-primary/80 " +
  "data-[picked=end]:bg-primary data-[picked=end]:text-primary-foreground hover:data-[picked=end]:bg-primary/80 " +
  // A night inside a stay stands on the band its cell draws, so it rises to
  // the card on hover rather than sinking into the band.
  "hover:data-[picked=middle]:bg-card " +
  // A day gone or booked out drops below the quiet ink and is struck through,
  // and holds still under the pointer. The strike is what says it: lighter ink
  // alone reads as a weekend or a day in another month.
  "disabled:cursor-not-allowed disabled:text-muted-foreground/70 disabled:line-through hover:disabled:bg-transparent " +
  "aria-disabled:cursor-not-allowed aria-disabled:text-muted-foreground/70 aria-disabled:line-through hover:aria-disabled:bg-transparent " +
  // Today shut is shut first: its brand ink would say it can be booked.
  "disabled:data-today:text-muted-foreground/70 aria-disabled:data-today:text-muted-foreground/70";

type Picked = "single" | "end" | "middle";

/** One day, as the month draws it. The calendar renders these itself; the
 *  design system draws them alone, one per state. */
function CalendarDay({
  picked,
  today,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  /** A day picked alone, either end of a stay, or a night inside one. */
  picked?: Picked;
  today?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="calendar-day"
      data-picked={picked}
      data-today={today || undefined}
      className={cn(day, className)}
      {...props}
    />
  );
}

// The day react-day-picker hands over, mapped onto the look above. The
// engine moves focus by marking a day `focused`; the button takes it here,
// which is the one thing its own day button did that this one must keep.
// `day` is taken off only so it never lands on the button as an attribute.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CalendarDayButton({ day: _day, modifiers, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const picked: Picked | undefined =
    modifiers.range_start || modifiers.range_end
      ? "end"
      : modifiers.range_middle
        ? "middle"
        : modifiers.selected
          ? "single"
          : undefined;

  return (
    <CalendarDay
      ref={ref}
      picked={picked}
      today={modifiers.today}
      {...props}
    />
  );
}

// A stay is a band of the muted rung behind its nights, from the middle of
// the first day to the middle of the last, each end round at the control
// seed. Drawn on the cell, so the band runs on unbroken under the days.
// `day` is taken off only so it never lands on the cell as an attribute.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CalendarCell({ day: _day, modifiers, className, ...props }: DayProps) {
  const band = modifiers.hidden
    ? null
    : modifiers.range_middle
      ? "before:inset-x-0"
      : modifiers.range_start && !modifiers.range_end
        ? "before:start-1/2 before:end-0"
        : modifiers.range_end && !modifiers.range_start
          ? "before:start-0 before:end-1/2"
          : null;
  return (
    <td
      className={cn(
        className,
        band && [
          "before:absolute before:inset-y-0.5 before:bg-muted before:content-['']",
          "first:before:rounded-s-(--radius-control) last:before:rounded-e-(--radius-control)",
          band,
        ],
      )}
      // The engine types its cell's props as a div's and renders them on a td.
      {...(props as React.ComponentProps<"td">)}
    />
  );
}

// The month and the year as the house Select, rather than the native list
// react-day-picker draws by default: the same popup, keys and typeahead as
// every other dropdown, and a list in the page's colours.
function CalendarDropdown({ options = [], value, onChange, disabled, "aria-label": label }: DropdownProps) {
  const items = options.map((o) => ({ value: String(o.value), label: o.label }));
  return (
    <Select
      items={items}
      value={value === undefined ? null : String(value)}
      disabled={disabled}
      onValueChange={(next) => {
        if (next == null) return;
        // The engine reads `target.value` off a select's change event, and
        // nothing else; this is the whole of the event it needs.
        onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger size="sm" variant="bare" aria-label={label}>
        <SelectValue className="font-medium" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((o) => (
            <SelectItem key={o.value} value={String(o.value)} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** One line under the month, ruled off: what a struck-through day means. */
  legend?: React.ReactNode;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = "label",
  legend,
  formatters,
  labels,
  components,
  ...props
}: CalendarProps) {
  // Base UI's provider follows `dir` on <html>; the engine needs it handed in
  // so the arrow keys walk the way the month is laid out.
  const dir = useDirection();

  return (
    <DayPicker
      dir={dir}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      footer={legend}
      className={cn("[--cell-size:--spacing(10)]", className)}
      formatters={{
        // One letter a column, the way a printed month heads them; the full
        // name is on each column for a screen reader.
        formatWeekdayName: (date, _options, lib) =>
          lib ? lib.format(date, "ccccc") : formatDay(date, { weekday: "narrow" }),
        formatMonthDropdown: (date) => formatDay(date, { month: "long" }),
        ...formatters,
      }}
      labels={{
        labelMonthDropdown: () => "Month",
        labelYearDropdown: () => "Year",
        ...labels,
      }}
      classNames={{
        root: "relative w-fit",
        months: "relative flex flex-col gap-8 sm:flex-row",
        month: "flex flex-col gap-2",
        nav: "absolute end-0 top-0 z-10 flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          ring,
          "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          ring,
          "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground",
        ),
        // The month's name sits left of the arrows, never under them.
        month_caption: "flex h-9 items-center ps-2 pe-20",
        caption_label: "text-sm font-medium",
        // The bare triggers pad their words 16px in; the row steps back so
        // the month's name starts where the plain caption's does.
        dropdowns: "-ms-4 flex items-center",
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "flex h-8 w-(--cell-size) items-center justify-center text-xs font-normal text-muted-foreground",
        weeks: "",
        week: "flex",
        day: "relative flex size-(--cell-size) items-center justify-center p-0",
        hidden: "invisible",
        footer: "mt-3 border-t px-2 pt-3 text-sm text-muted-foreground",
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rest }) => (
          <div data-slot="calendar" ref={rootRef} className={className} {...rest} />
        ),
        Chevron: ({ className, orientation }) =>
          orientation === "left" ? (
            <ChevronLeftIcon aria-hidden className={cn("size-4 rtl:-scale-x-100", className)} />
          ) : orientation === "right" ? (
            <ChevronRightIcon aria-hidden className={cn("size-4 rtl:-scale-x-100", className)} />
          ) : (
            <ChevronDownIcon aria-hidden className={cn("size-4", className)} />
          ),
        Day: CalendarCell,
        DayButton: CalendarDayButton,
        Dropdown: CalendarDropdown,
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar, CalendarDay, CalendarDayButton };
export type { CalendarProps };
