"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { StarIcon } from "@heroicons/react/24/solid";
import { Video01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { StateGrid } from "@/components/design-system/state-grid";
import { Calendar, CalendarDay } from "@/components/ui/calendar";
import { DatePicker, formatDates, quickDates, type DatePreset } from "@/components/ui/date-picker";
import { MapCard, MapCityMarker, MapPinPill, MapView, type MapArea, type MapPin } from "@/components/ui/map";
import { SlotChip, SlotPicker, type SlotDay } from "@/components/ui/slot-picker";
import { dateFormat } from "@/lib/format";

// Dates and maps: the month, the date field that opens on it, the times a day
// offers, the map with its pins and with the world. Every demo reads the visitor's own
// today, on the client — a month drawn from the server's clock is a day out
// for half the world — so the parts that need it stand in a quiet tile for
// the frame before it is known.

const never = () => () => {};

function useToday() {
  const key = React.useSyncExternalStore(never, () => new Date().toDateString(), () => null);
  return React.useMemo(() => (key ? new Date(key) : null), [key]);
}

// The visitor's zone as a clock shows it, "GMT+7"; unknown on the server.
function useZone() {
  return React.useSyncExternalStore(
    never,
    () =>
      dateFormat({ timeZoneName: "shortOffset" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value,
    () => undefined,
  );
}

const addDays = (from: Date, n: number) => {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d;
};
const addMonths = (from: Date, n: number) => new Date(from.getFullYear(), from.getMonth() + n, 1);
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const longDay = dateFormat({ weekday: "short", month: "short", day: "numeric" });

// The nights already sold out, counted from today: none in the first two
// weeks, where the presets and the sample stays fall, a scatter after them.
const SOLD_OUT = [15, 16, 22, 27, 28, 34, 41, 47, 48];
const soldOut = (today: Date) => SOLD_OUT.map((n) => addDays(today, n));

const wait = (ms: number) => new Promise<void>((done) => window.setTimeout(done, ms));

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-sm text-muted-foreground">{children}</p>;
}

// The tile a demo stands in while the visitor's today is not yet known.
function Waiting({ className }: { className: string }) {
  return <div aria-hidden className={`rounded-lg bg-accent ${className}`} />;
}

// ─── Calendar ────────────────────────────────────────────────────────────────

// A month is seven 40px days, which a 320px phone cannot fit inside a card
// inside the page's gutter; there its card takes the gutter's width instead.
const MONTH = "max-[359px]:-mx-6 max-[359px]:rounded-none";

function CalendarDemos({ today }: { today: Date }) {
  const [night, setNight] = React.useState<Date | undefined>(() => addDays(today, 3));
  const [stay, setStay] = React.useState<DateRange | undefined>(() => ({ from: addDays(today, 4), to: addDays(today, 7) }));
  const [far, setFar] = React.useState<Date | undefined>(() => addMonths(today, 5));
  const booked = [addDays(today, 10), addDays(today, 11)];
  const nights = stay?.from && stay.to ? Math.round((stay.to.getTime() - stay.from.getTime()) / 86_400_000) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Specimen className={MONTH}>
          <Caption>One night, the past and sold-out ones struck through</Caption>
          <Calendar
            mode="single"
            selected={night}
            onSelect={setNight}
            today={today}
            disabled={[{ before: today }, ...soldOut(today)]}
            startMonth={today}
            endMonth={addMonths(today, 11)}
          />
        </Specimen>
        <Specimen className={MONTH}>
          <Caption>Month and year lists, for a date far off</Caption>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={far}
            onSelect={setFar}
            defaultMonth={far}
            today={today}
            disabled={{ before: today }}
            startMonth={today}
            endMonth={addMonths(today, 23)}
          />
        </Specimen>
      </div>
      <Specimen className={MONTH}>
        <Caption>A stay over two months, a booked night closing the way</Caption>
        <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Check in</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{stay?.from ? longDay.format(stay.from) : "Add a date"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Check out</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{stay?.to ? longDay.format(stay.to) : "Pick the day you leave"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Nights</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{nights || "None yet"}</dd>
          </div>
        </dl>
        <Calendar
          mode="range"
          numberOfMonths={2}
          min={1}
          resetOnSelect
          excludeDisabled
          selected={stay}
          onSelect={setStay}
          today={today}
          disabled={[{ before: today }, ...booked, ...soldOut(today)]}
          startMonth={today}
          endMonth={addMonths(today, 11)}
          legend="Struck-through nights are booked; a stay can't run across one."
        />
      </Specimen>
    </div>
  );
}

function CalendarBlock() {
  const today = useToday();
  return (
    <DsBlock
      id="calendar"
      title="Calendar"
      when="a visitor picks a night or a stay from a month, past and taken nights struck out."
      source="components/ui/calendar.tsx"
      states={
        <StateGrid
          rows={[
            { label: "Day", render: (s) => <CalendarDay disabled={s === "disabled"}>14</CalendarDay> },
            { label: "Today", render: (s) => <CalendarDay today disabled={s === "disabled"}>12</CalendarDay> },
            {
              label: "Picked",
              render: (s) => (
                <CalendarDay picked="single" disabled={s === "disabled"}>
                  17
                </CalendarDay>
              ),
            },
          ]}
        />
      }
    >
      {today ? <CalendarDemos today={today} /> : <Waiting className="h-[48rem]" />}
    </DsBlock>
  );
}

// ─── Date picker ─────────────────────────────────────────────────────────────

function DateDemos({ today }: { today: Date }) {
  const presets = quickDates(today);
  const dow = today.getDay();
  const friday = addDays(today, dow === 0 ? 5 : dow >= 5 ? 0 : 5 - dow);
  // A stay's presets are stays: tonight is one night, a weekend two.
  const stays: DatePreset[] = [
    { id: "tonight", label: "Tonight", from: today, to: addDays(today, 1) },
    { id: "weekend", label: "This weekend", from: friday, to: addDays(friday, 2) },
    { id: "week", label: "A week away", from: addDays(today, 7), to: addDays(today, 14) },
  ];
  const shared = {
    today,
    disabledDays: [{ before: today }, ...soldOut(today)],
    startMonth: today,
    endMonth: addMonths(today, 11),
  };

  return (
    <Specimen>
      <Caption>A hero field, a form field and a stay; each opens on what it holds</Caption>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DatePicker label="When" presets={presets} defaultValue={{ from: presets[0].from, preset: "tonight" }} {...shared} />
        <DatePicker label="Check in" variant="field" presets={presets} {...shared} />
        <DatePicker
          label="Your stay"
          variant="field"
          mode="range"
          presets={stays}
          defaultValue={{ from: stays[1].from, to: stays[1].to, preset: "weekend" }}
          {...shared}
        />
      </div>
    </Specimen>
  );
}

function DateBlock() {
  const today = useToday();
  const presets = today ? quickDates(today) : [];
  const sample = (variant: "card" | "field" | "bare", s: string) => (
    <DatePicker
      label="When"
      variant={variant}
      presets={presets}
      // Held rather than seeded: today is not known on the first frame.
      value={presets[0] ? { from: presets[0].from, preset: "tonight" } : null}
      disabled={s === "disabled"}
      error={s === "error" ? "Pick a night first" : undefined}
      // The first thing in a state cell takes the page's own focus ring in
      // the preview; the wrapper is not what takes focus, the field is.
      className="w-56 outline-none"
    />
  );
  const rows = [
    { label: "Card", render: (s: string) => sample("card", s) },
    { label: "Field", render: (s: string) => sample("field", s) },
    { label: "Bare", render: (s: string) => sample("bare", s) },
  ];
  return (
    <DsBlock
      id="date-picker"
      title="Date picker"
      when="a date fills a field from a quick pick or a month: tonight, this weekend, the 14th."
      source="components/ui/date-picker.tsx"
      states={
        <>
          {/* Six states of a field this wide do not fit one row, so the grid
              runs over two: the pointer's states, then the field's own. */}
          <StateGrid states={["rest", "hover", "active"]} rows={rows} />
          <StateGrid states={["focus", "disabled", "error"]} rows={rows} />
        </>
      }
    >
      {today ? <DateDemos today={today} /> : <Waiting className="h-56" />}
    </DsBlock>
  );
}

// ─── Slot picker ─────────────────────────────────────────────────────────────

const CALL_TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];
const CALL_TAKEN = [[3], [0, 4], [2]];

// The next three days, from tomorrow, six times each, a few already taken.
const callDays = (today: Date): SlotDay[] =>
  [1, 2, 3].map((ahead, i) => {
    const date = addDays(today, ahead);
    return {
      id: dayKey(date),
      date,
      slots: CALL_TIMES.map((label, j) => ({ id: `${dayKey(date)}·${label}`, label, taken: CALL_TAKEN[i].includes(j) })),
    };
  });

// Three weeks of a host's open times, Monday to Sunday, written out rather
// than generated so the week has the uneven shape a real diary does.
const WEEKS: string[][][] = [
  [["9:00 AM", "4:30 PM", "6:00 PM"], ["4:00 PM", "7:30 PM"], ["10:00 AM", "3:30 PM", "5:00 PM", "6:30 PM"], ["4:30 PM"], ["9:30 AM", "1:00 PM", "5:30 PM"], ["10:30 AM", "12:00 PM"], []],
  [["4:00 PM", "6:00 PM"], ["9:00 AM", "5:00 PM"], ["3:00 PM"], ["4:30 PM", "6:30 PM"], ["10:00 AM", "2:00 PM", "5:00 PM"], ["11:00 AM"], ["1:00 PM", "4:00 PM"]],
  [["9:30 AM", "4:00 PM"], ["4:30 PM", "6:00 PM", "7:30 PM"], ["10:00 AM", "5:30 PM"], [], ["9:00 AM", "3:30 PM", "6:00 PM"], ["10:00 AM", "12:30 PM"], ["2:00 PM"]],
];
const WEEK_TAKEN = new Set(["0-2-3:30 PM", "1-4-2:00 PM", "2-1-6:00 PM"]);

// A longer visit needs a longer gap, so fewer of the week's times survive it.
const weekDays = (today: Date, length: number): SlotDay[] => {
  const monday = addDays(today, (8 - today.getDay()) % 7 || 7);
  return WEEKS.flatMap((week, w) =>
    week.map((times, d) => {
      const date = addDays(monday, w * 7 + d);
      const kept = length === 30 ? times : times.filter((_, i) => i % (length === 60 ? 2 : 3) === 0);
      return {
        id: dayKey(date),
        date,
        slots: kept.map((label) => ({ id: `${dayKey(date)}·${label}`, label, taken: WEEK_TAKEN.has(`${w}-${d}-${label}`) })),
      };
    }),
  );
};

function CallCard({ today, zone, booked }: { today: Date; zone?: string; booked?: boolean }) {
  return (
    <div className="flex w-full max-w-sm flex-col rounded-lg bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chip text-primary-ink">
          <HugeiconsIcon icon={Video01Icon} size={18} strokeWidth={1.7} aria-hidden />
        </span>
        <div className="min-w-28 flex-1">
          <p className="truncate text-sm font-medium">Talk to a host</p>
          <p className="truncate text-sm text-muted-foreground">A 20-minute video call</p>
        </div>
        <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-control bg-leaf/15 px-2.5 text-xs font-medium text-leaf-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
          Open now
        </span>
      </div>
      <SlotPicker
        className="mt-5 flex-1"
        days={callDays(today)}
        zone={zone}
        defaultBooked={booked}
        onBook={() => wait(900)}
        confirmation={{
          title: "Call booked",
          line: () => "with the host team. The video link arrives by email an hour before.",
          again: "Pick another time",
        }}
      />
    </div>
  );
}

function SlotDemos({ today }: { today: Date }) {
  const zone = useZone();
  const [length, setLength] = React.useState(30);
  const days = React.useMemo(() => weekDays(today, length), [today, length]);
  return (
    <Specimen className="bg-accent">
      <Caption>A card&apos;s day row, the same card once booked, and a page&apos;s week</Caption>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CallCard today={today} zone={zone} />
        <CallCard today={today} zone={zone} booked />
      </div>
      <div className="mt-6 max-w-2xl rounded-lg bg-card p-5 shadow-soft sm:p-6">
        <SlotPicker
          variant="week"
          days={days}
          duration={length}
          onDurationChange={setLength}
          zone={zone}
          onBook={() => wait(900)}
          confirmation={{
            title: "Visit booked",
            line: () => "with Ana Ribeiro, your host. She meets you at the door.",
          }}
        />
      </div>
    </Specimen>
  );
}

function SlotBlock() {
  const today = useToday();
  const chip = (dense: boolean, picked: boolean, s: string) => (
    <RadioGroup value={picked ? "slot" : null} aria-label="Time" className="outline-none">
      <SlotChip dense={dense} value="slot" disabled={s === "disabled"} className={dense ? "w-20" : "w-24"}>
        {dense ? "4 PM" : "4:00 PM"}
      </SlotChip>
    </RadioGroup>
  );
  return (
    <DsBlock
      id="slot-picker"
      title="Slot picker"
      when="a visitor books a time a host has open: a call, a viewing, a table."
      source="components/ui/slot-picker.tsx"
      states={
        <StateGrid
          rows={[
            { label: "Time", render: (s) => chip(false, false, s) },
            { label: "Picked", render: (s) => chip(false, true, s) },
            { label: "In a week", render: (s) => chip(true, false, s) },
            { label: "Week, picked", render: (s) => chip(true, true, s) },
          ]}
        />
      }
    >
      {today ? <SlotDemos today={today} /> : <Waiting className="h-[56rem]" />}
    </DsBlock>
  );
}

// ─── Map ─────────────────────────────────────────────────────────────────────

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=75`;
const PHOTOS = [
  { src: photo("photo-1600607687939-ce8a6c25118c"), alt: "A living room with a slatted wood wall" },
  { src: photo("photo-1600585152220-90363fe7e115"), alt: "A white kitchen island with four stools under black pendants" },
  { src: photo("photo-1600596542815-ffad4c1539a9"), alt: "A white flat-roofed house above a curved swimming pool" },
  { src: photo("photo-1512917774080-9991f1c4c750"), alt: "A low concrete house alongside a long swimming pool" },
  { src: photo("photo-1570129477492-45c003edd2be"), alt: "A grey-shingled house with a white wraparound porch" },
  { src: photo("photo-1564013799919-ab600027ffc6"), alt: "A white house with a balcony above a swimming pool" },
];

const AREAS: MapArea[] = [
  { id: "lisbon", name: "Lisbon", short: "LIS" },
  { id: "porto", name: "Porto", short: "OPO" },
  { id: "madrid", name: "Madrid", short: "MAD" },
  { id: "seville", name: "Seville", short: "SVQ" },
];

type Stay = {
  id: string;
  area: string;
  at: [number, number];
  title: string;
  guests: string;
  price: number;
  rating: string;
  reviews: number;
  badge?: string;
  saved?: boolean;
};

const STAYS: Stay[] = [
  { id: "alfama", area: "lisbon", at: [-9.1302, 38.7118], title: "Courtyard flat in Alfama", guests: "2 guests · 1 bedroom", price: 148, rating: "4.92", reviews: 128, badge: "Guest favourite" },
  { id: "graca", area: "lisbon", at: [-9.1312, 38.7162], title: "Terrace room above Graça", guests: "2 guests · 1 bedroom", price: 126, rating: "4.81", reviews: 64 },
  { id: "baixa", area: "lisbon", at: [-9.1372, 38.7101], title: "Loft on Rua Augusta", guests: "4 guests · 2 bedrooms", price: 172, rating: "4.88", reviews: 203 },
  { id: "chiado", area: "lisbon", at: [-9.1426, 38.7106], title: "Studio off Largo do Chiado", guests: "2 guests · studio", price: 98, rating: "4.76", reviews: 91, saved: true },
  { id: "principe", area: "lisbon", at: [-9.1487, 38.7171], title: "Garden flat in Príncipe Real", guests: "3 guests · 2 bedrooms", price: 210, rating: "4.95", reviews: 57, badge: "New this month" },
  { id: "belem", area: "lisbon", at: [-9.2066, 38.6975], title: "River house in Belém", guests: "6 guests · 3 bedrooms", price: 184, rating: "4.9", reviews: 142 },
  { id: "ribeira", area: "porto", at: [-8.6131, 41.1407], title: "Ribeira flat on the river", guests: "2 guests · 1 bedroom", price: 112, rating: "4.87", reviews: 176 },
  { id: "cedofeita", area: "porto", at: [-8.6186, 41.1527], title: "Cedofeita loft with a balcony", guests: "3 guests · 1 bedroom", price: 94, rating: "4.73", reviews: 48 },
  { id: "foz", area: "porto", at: [-8.6751, 41.1531], title: "Beach house in Foz", guests: "5 guests · 3 bedrooms", price: 236, rating: "4.96", reviews: 39 },
  { id: "malasana", area: "madrid", at: [-3.7046, 40.4261], title: "Corner flat in Malasaña", guests: "2 guests · 1 bedroom", price: 132, rating: "4.84", reviews: 118 },
  { id: "latina", area: "madrid", at: [-3.7111, 40.4111], title: "Studio by La Latina market", guests: "2 guests · studio", price: 88, rating: "4.7", reviews: 210 },
  { id: "salamanca", area: "madrid", at: [-3.6801, 40.4301], title: "Suite on Calle de Serrano", guests: "4 guests · 2 bedrooms", price: 264, rating: "4.93", reviews: 72 },
  { id: "santa-cruz", area: "seville", at: [-5.9891, 37.3861], title: "Patio house in Santa Cruz", guests: "4 guests · 2 bedrooms", price: 118, rating: "4.91", reviews: 155 },
  { id: "triana", area: "seville", at: [-6.0031, 37.3831], title: "Triana flat by the bridge", guests: "3 guests · 1 bedroom", price: 142, rating: "4.8", reviews: 87 },
];

function StayCard({ stay, image, dates }: { stay: Stay; image: (typeof PHOTOS)[number]; dates: string }) {
  return (
    <MapCard
      href="#map"
      title={stay.title}
      image={<Image src={image.src} alt={image.alt} fill sizes="288px" />}
      badge={stay.badge}
      meta={`${stay.guests} · ${dates}`}
      detail={
        <span className="inline-flex items-center gap-1">
          <StarIcon aria-hidden className="size-4 text-sun" />
          <span className="text-foreground">{stay.rating}</span> · {stay.reviews} reviews
        </span>
      }
      price={
        <>
          <span className="font-medium text-primary-ink">€{stay.price}</span> a night
        </>
      }
    />
  );
}

// The world map's desks: each city on its own clock, a route through them.
const DESKS = [
  { id: "san-francisco", label: "San Francisco", lngLat: [-122.4194, 37.7749] as [number, number], timeZone: "America/Los_Angeles", hours: "7 AM to 7 PM" },
  { id: "lisbon", label: "Lisbon", lngLat: [-9.1393, 38.7223] as [number, number], timeZone: "Europe/Lisbon", hours: "8 AM to 8 PM" },
  { id: "singapore", label: "Singapore", lngLat: [103.8198, 1.3521] as [number, number], timeZone: "Asia/Singapore", hours: "9 AM to 7 PM" },
  { id: "sydney", label: "Sydney", lngLat: [151.2093, -33.8688] as [number, number], timeZone: "Australia/Sydney", hours: "8 AM to 6 PM" },
];
const ROUTE: [string, string][] = [
  ["san-francisco", "lisbon"],
  ["lisbon", "singapore"],
  ["singapore", "sydney"],
];

function WorldDemo() {
  const [desk, setDesk] = React.useState("lisbon");
  const picked = DESKS.find((d) => d.id === desk)!;
  return (
    <Specimen>
      <Caption>The world: each city on its own clock, dots where pins would crowd, arcs by id</Caption>
      <MapView
        cities={DESKS}
        arcs={ROUTE}
        selected={desk}
        onSelectedChange={(id) => id && setDesk(id)}
        label="Support desks"
        className="aspect-[2/1] w-full"
      />
      <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{picked.label}</span> answers from {picked.hours}, Monday to
        Saturday, on its own clock.
      </p>
    </Specimen>
  );
}

function MapDemos({ today }: { today: Date }) {
  const dates = formatDates({ from: addDays(today, 4), to: addDays(today, 7) });
  const pins: MapPin[] = React.useMemo(
    () =>
      STAYS.map((s, i) => ({
        id: s.id,
        lngLat: s.at,
        label: `€${s.price}`,
        value: s.price,
        name: `${s.title}, €${s.price} a night`,
        area: s.area,
        saved: s.saved,
        card: <StayCard stay={s} image={PHOTOS[i % PHOTOS.length]} dates={dates} />,
      })),
    [dates],
  );
  const one = pins.slice(0, 1).map((p) => ({ ...p, card: undefined }));

  return (
    <div className="flex flex-col gap-6">
      <MapView
        pins={pins}
        areas={AREAS}
        cooperative
        label="Stays in Portugal and Spain"
        className="h-[32rem] ring-1 ring-border"
      />
      <Specimen>
        <Caption>As a picture: still, its pin part of the drawing, the page scrolling through it</Caption>
        <MapView pins={one} interactive={false} label="Where the flat is" className="h-64" />
      </Specimen>
      <WorldDemo />
    </div>
  );
}

function MapBlock() {
  const today = useToday();
  const pin = (body: React.ReactNode) => <span className="group/pin inline-flex p-1 outline-none">{body}</span>;
  const city = (look: "pin" | "dot", picked: boolean) => (
    <MapCityMarker look={look} picked={picked} label="Lisbon" meta="3:03 PM" />
  );
  return (
    <DsBlock
      id="map"
      title="Map"
      when="a place decides the choice: stays priced on a street map, desks on the world."
      source="components/ui/map.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus"]}
          rows={[
            { label: "Price", render: () => pin(<MapPinPill>€148</MapPinPill>) },
            { label: "Saved", render: () => pin(<MapPinPill saved>€98</MapPinPill>) },
            { label: "Lit", render: () => pin(<MapPinPill lit>€172</MapPinPill>) },
            { label: "Gathered", render: () => pin(<MapPinPill count="· 3 places">€98</MapPinPill>) },
            { label: "Area", render: () => pin(<MapPinPill size="area" count="· 6">Lisbon</MapPinPill>) },
            { label: "City", render: () => city("pin", false) },
            { label: "City, picked", render: () => city("pin", true) },
            { label: "Narrow", render: () => city("dot", false) },
            { label: "Narrow, picked", render: () => city("dot", true) },
          ]}
        />
      }
    >
      {today ? <MapDemos today={today} /> : <Waiting className="h-[52rem]" />}
    </DsBlock>
  );
}

export function KitDates() {
  return (
    <>
      <CalendarBlock />
      <DateBlock />
      <SlotBlock />
      <MapBlock />
    </>
  );
}
