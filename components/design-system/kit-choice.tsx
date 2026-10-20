"use client";

import { useState, type ReactNode } from "react";
import {
  BankIcon,
  BeachIcon,
  Car01Icon,
  CarParking01Icon,
  CreditCardIcon,
  GridViewIcon,
  Home01Icon,
  KitchenUtensilsIcon,
  LeftToRightListBulletIcon,
  MapsIcon,
  SwimmingIcon,
  Ticket01Icon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { StateGrid } from "@/components/design-system/state-grid";
import { FilterChip, FilterRail } from "@/components/ui/filter-rail";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { DotTabs } from "@/components/ui/dot-tabs";
import { RadioTiles } from "@/components/ui/radio-tiles";
import { RangeFilter } from "@/components/ui/range-filter";
import { Segmented, SegmentedPanel } from "@/components/ui/segmented";
import { Slider } from "@/components/ui/slider";
import { formatMoney } from "@/lib/format";

// The controls a visitor picks with: one of a few, a stretch of a scale, a
// count. Every specimen is live — press it, drag it, type into it — and the
// copy is a booking marketplace's, rewritten in the template's voice at stop 2.

const usd = (v: number) => formatMoney(v, undefined, { maximumFractionDigits: 0 });

// A figure and what it is per, the figure leading.
function Per({ amount, unit }: { amount: string; unit: string }) {
  return (
    <>
      <span className="font-medium">{amount}</span>
      <span className="text-muted-foreground"> / {unit}</span>
    </>
  );
}

// A small heading over a specimen's second part.
function Caption({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

// A state cell. The sheet paints a rule written on a state alone — the global
// focus ring — on a cell's first child, and these controls take focus on a
// part inside them, so the first child is a box-less wrapper and the ring
// each control draws on its own focused part is the one that shows.
function cell(control: ReactNode) {
  return <div className="contents">{control}</div>;
}

/* ── Radio tiles ─────────────────────────────────────────────── */

const RATES = [
  {
    value: "saver",
    title: "Non-refundable",
    description: "The lowest rate. Paid today, and it cannot be changed.",
    aside: <Per amount="$184" unit="night" />,
  },
  {
    value: "flexible",
    title: "Free cancellation",
    description: "Cancel up to 48 hours before check-in for a full refund.",
    aside: <Per amount="$206" unit="night" />,
  },
  {
    value: "later",
    title: "Pay at the property",
    description: "Nothing charged now. Pay the host on arrival.",
    aside: <Per amount="$212" unit="night" />,
  },
];

const PAYMENT = [
  { value: "card", title: "Card", description: "Debit or credit", icon: CreditCardIcon },
  { value: "bank", title: "Bank transfer", description: "Clears in a working day", icon: BankIcon },
];

const ARRIVAL = [
  { value: "early", title: "Before 6 pm", description: "Met by the host" },
  { value: "late", title: "After 6 pm", description: "Let yourself in" },
];

function RadioTilesBlock() {
  return (
    <DsBlock
      id="radio-tiles"
      title="Radio tiles"
      when="one of a few options needs a line or a price beside it: a rate, a way to pay."
      source="components/ui/radio-tiles.tsx"
      variants={
        <Specimen className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <RadioTiles
            label="Pay with"
            name="payment"
            layout="grid"
            from="sm"
            mark={false}
            defaultValue="card"
            options={PAYMENT}
          />
          <RadioTiles
            label="When will you arrive?"
            name="arrival"
            layout="grid"
            required
            error="Choose an arrival time so the host can plan the handover."
            options={ARRIVAL}
          />
        </Specimen>
      }
      states={
        <StateGrid
          rows={[
            {
              label: "Tile",
              render: (s) => cell(
                <RadioTiles
                  aria-label="When to pay"
                  className="w-32"
                  options={[{ value: "later", title: "Pay later", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Picked",
              render: (s) => cell(
                <RadioTiles
                  aria-label="When to pay"
                  className="w-32"
                  defaultValue="later"
                  options={[{ value: "later", title: "Pay later", disabled: s === "disabled" }]}
                />
              ),
            },
          ]}
        />
      }
    >
      <Specimen>
        <RadioTiles
          label="Choose a rate"
          hint="Prices are per night, before taxes."
          name="rate"
          defaultValue="flexible"
          options={RATES}
        />
      </Specimen>
    </DsBlock>
  );
}

/* ── Dot tabs ────────────────────────────────────────────────── */

const KINDS = [
  { value: "storefront", label: "Storefront" },
  { value: "booking", label: "Booking" },
  { value: "magazine", label: "Magazine" },
  { value: "custom", label: "Custom work" },
];

const KIND_NOTES: Record<string, string> = {
  storefront: "Filters, a cart drawer and a checkout that keeps its state on refresh.",
  booking: "A date range, a guest stepper and a map that follows the list.",
  magazine: "Issue pages, an author archive and a reading-time line on every card.",
  custom: "Send the brief; we answer with a scope and a date within two days.",
};

function DotTabsBlock() {
  const [kind, setKind] = useState("storefront");
  return (
    <DsBlock
      id="dot-tabs"
      title="Dot tabs"
      when="three to six kinds of one thing switch the figure beside them, read top to bottom."
      source="components/ui/dot-tabs.tsx"
      states={
        <StateGrid
          rows={[
            {
              label: "Tab",
              render: (s) => cell(
                <DotTabs
                  aria-label="Template kinds"
                  value=""
                  onValueChange={() => {}}
                  items={[{ value: "booking", label: "Booking", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Current",
              render: (s) => cell(
                <DotTabs
                  aria-label="Template kinds"
                  value="booking"
                  onValueChange={() => {}}
                  items={[{ value: "booking", label: "Booking", disabled: s === "disabled" }]}
                />
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="grid gap-8 sm:grid-cols-[200px_1fr]">
        <DotTabs aria-label="Template kinds" items={KINDS} value={kind} onValueChange={setKind} controls="dot-tabs-panel" />
        <p id="dot-tabs-panel" role="tabpanel" className="text-sm text-muted-foreground">
          {KIND_NOTES[kind]}
        </p>
      </Specimen>
    </DsBlock>
  );
}

/* ── Segmented ───────────────────────────────────────────────── */

const VIEWS = [
  { value: "grid", label: "Grid", icon: GridViewIcon },
  { value: "list", label: "List", icon: LeftToRightListBulletIcon },
  { value: "map", label: "Map", icon: MapsIcon },
];

const VIEW_NOTES: Record<string, string> = {
  grid: "Three stays to a row, photo first, for browsing by eye.",
  list: "One stay to a row, its price, rating and dates side by side.",
  map: "Every stay as a pin with its price; the list follows the map.",
};

const MODES = [
  { value: "stays", label: "Stays", icon: Home01Icon },
  { value: "experiences", label: "Experiences", icon: Ticket01Icon },
  { value: "cars", label: "Car rentals", icon: Car01Icon },
];

const MODE_NOTES: Record<string, string> = {
  stays: "Homes, rooms and cabins, priced per night.",
  experiences: "Tours, classes and tastings run by locals.",
  cars: "Pick up at the airport or in town, return anywhere.",
};

function SegmentedBlock() {
  const [basis, setBasis] = useState("night");
  const [mode, setMode] = useState("stays");
  const [flex, setFlex] = useState("1");
  return (
    <DsBlock
      id="segmented"
      title="Segmented"
      when="two to five options fit one track, as tabs over a panel or as a value."
      source="components/ui/segmented.tsx"
      variants={
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Specimen className="flex flex-col gap-3">
            <Caption>Brand, for the one choice a page turns on</Caption>
            <Segmented
              variant="brand"
              aria-label="Search for"
              name="search-for"
              value={mode}
              onValueChange={setMode}
              options={MODES}
            />
            <p className="text-sm text-muted-foreground">{MODE_NOTES[mode]}</p>
          </Specimen>
          <Specimen className="flex flex-col gap-3">
            <Caption>Framed, on a tint or beside other framed controls</Caption>
            <Segmented
              variant="framed"
              aria-label="How flexible are your dates?"
              name="flexibility"
              value={flex}
              onValueChange={setFlex}
              options={[
                { value: "0", label: "Exact dates" },
                { value: "1", label: "± 1 day" },
                { value: "3", label: "± 3 days" },
                { value: "7", label: "± 7 days" },
              ]}
            />
            <p className="text-sm text-muted-foreground tabular-nums">
              {flex === "0"
                ? "Check in 12 June, check out 15 June."
                : `Check in any day from ${12 - Number(flex)} to ${12 + Number(flex)} June, for 3 nights.`}
            </p>
          </Specimen>
        </div>
      }
      states={
        <StateGrid
          rows={[
            {
              label: "Option",
              render: (s) => cell(
                <Segmented
                  aria-label="Prices shown"
                  value=""
                  options={[{ value: "night", label: "Per night", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Picked",
              render: (s) => cell(
                <Segmented
                  aria-label="Prices shown"
                  value="night"
                  options={[{ value: "night", label: "Per night", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Option, outlined",
              render: (s) => cell(
                <Segmented
                  variant="brand"
                  aria-label="Prices shown"
                  value=""
                  options={[{ value: "night", label: "Per night", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Picked, brand",
              render: (s) => cell(
                <Segmented
                  variant="brand"
                  aria-label="Prices shown"
                  value="night"
                  options={[{ value: "night", label: "Per night", disabled: s === "disabled" }]}
                />
              ),
            },
            {
              label: "Picked, framed",
              render: (s) => cell(
                <Segmented
                  variant="framed"
                  aria-label="Prices shown"
                  value="night"
                  options={[{ value: "night", label: "Per night", disabled: s === "disabled" }]}
                />
              ),
            },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen>
          <Segmented kind="tabs" aria-label="Show results as" options={VIEWS} defaultValue="grid">
            {VIEWS.map((v) => (
              <SegmentedPanel key={v.value} value={v.value} className="mt-6">
                <p className="text-base text-muted-foreground">{VIEW_NOTES[v.value]}</p>
              </SegmentedPanel>
            ))}
          </Segmented>
        </Specimen>
        <Specimen className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Caption>Prices shown</Caption>
            <Segmented
              aria-label="Prices shown"
              name="basis"
              value={basis}
              onValueChange={setBasis}
              options={[
                { value: "night", label: "Per night" },
                { value: "total", label: "Total for 3 nights" },
              ]}
            />
            <p className="text-sm text-muted-foreground tabular-nums">
              Cabin by the lake · {basis === "night" ? "$206 a night" : "$618 for 3 nights"}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Caption>Type of place</Caption>
            <Segmented
              aria-label="Type of place"
              name="place"
              size="lg"
              fill
              defaultValue="any"
              options={[
                { value: "any", label: "Any", count: 248 },
                { value: "room", label: "Rooms", count: 96 },
                { value: "home", label: "Homes", count: 152 },
              ]}
            />
          </div>
        </Specimen>
      </div>
    </DsBlock>
  );
}

/* ── Filter rail ─────────────────────────────────────────────── */

const TYPES = [
  { value: "all", label: "All", count: 248, noun: "stays" },
  { value: "beachfront", label: "Beachfront", count: 52, noun: "beachfront stays" },
  { value: "cabins", label: "Cabins", count: 36, noun: "cabins" },
  { value: "city", label: "City", count: 61, noun: "city stays" },
  { value: "countryside", label: "Countryside", count: 44, noun: "countryside stays" },
  { value: "lakeside", label: "Lakeside", count: 21, noun: "lakeside stays" },
  { value: "treehouses", label: "Treehouses", count: 9, noun: "treehouses" },
  { value: "camping", label: "Camping", count: 0, noun: "campsites", disabled: true },
];

const AMENITIES = [
  { value: "wifi", label: "Wifi", icon: Wifi01Icon },
  { value: "pool", label: "Pool", icon: SwimmingIcon },
  { value: "parking", label: "Free parking", icon: CarParking01Icon },
  { value: "kitchen", label: "Kitchen", icon: KitchenUtensilsIcon },
  { value: "beach", label: "Beach access", icon: BeachIcon },
];

const BEDROOMS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
];

function FilterRailBlock() {
  const [type, setType] = useState("all");
  const [bedrooms, setBedrooms] = useState("2");
  const [amenities, setAmenities] = useState<string[]>(["wifi", "kitchen"]);
  const picked = TYPES.find((t) => t.value === type) ?? TYPES[0];
  return (
    <DsBlock
      id="filter-rail"
      title="Filter rail"
      when="a list narrows by type, amenity or size, each chip with its count."
      source="components/ui/filter-rail.tsx"
      variants={
        <div className="flex flex-col gap-4">
          <Specimen>
            <Caption>Outline, any number of them on</Caption>
            <FilterRail
              multiple
              variant="outline"
              bleed="panel"
              aria-label="Amenities"
              options={AMENITIES}
              value={amenities}
              onValueChange={setAmenities}
              className="mt-3"
            />
          </Specimen>
          <Specimen>
            <Caption>Framed, one of a scale</Caption>
            <FilterRail
              variant="framed"
              bleed="panel"
              aria-label="Bedrooms"
              options={BEDROOMS}
              value={bedrooms}
              onValueChange={setBedrooms}
              className="mt-3"
            />
            <p className="mt-5 text-sm text-muted-foreground tabular-nums">
              {bedrooms === "any"
                ? "Any number of bedrooms"
                : `${bedrooms === "5" ? "5 or more" : bedrooms} ${bedrooms === "1" ? "bedroom" : "bedrooms"}, at least`}
            </p>
          </Specimen>
        </div>
      }
      states={
        <StateGrid
          rows={[
            {
              label: "Chip",
              render: (s) => cell(
                <FilterChip count={36} disabled={s === "disabled"}>
                  Cabins
                </FilterChip>
              ),
            },
            {
              label: "Picked",
              render: (s) => cell(
                <FilterChip defaultPressed count={248} disabled={s === "disabled"}>
                  All
                </FilterChip>
              ),
            },
            {
              label: "Outline",
              render: (s) => cell(
                <FilterChip variant="outline" disabled={s === "disabled"}>
                  Free parking
                </FilterChip>
              ),
            },
            {
              label: "Framed",
              render: (s) => cell(
                <FilterChip variant="framed" count={61} disabled={s === "disabled"}>
                  City
                </FilterChip>
              ),
            },
            {
              label: "Framed, picked",
              render: (s) => cell(
                <FilterChip variant="framed" defaultPressed count={36} disabled={s === "disabled"}>
                  Cabins
                </FilterChip>
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="bg-background">
        {/* Inside a card that pads 16 on a phone, so the rail bleeds into that
            padding rather than the page gutter past it. */}
        <FilterRail aria-label="Type of stay" bleed="panel" options={TYPES} value={type} onValueChange={setType} />
        <p className="mt-5 text-sm text-muted-foreground tabular-nums">
          {type === "all" ? `Showing all ${picked.count} stays` : `Showing ${picked.count} ${picked.noun}`}
        </p>
      </Specimen>
    </DsBlock>
  );
}

/* ── Slider ──────────────────────────────────────────────────── */

function SliderBlock() {
  return (
    <DsBlock
      id="slider"
      title="Slider"
      when="a value sits on a scale and its exact figure matters less: distance, minutes."
      source="components/ui/slider.tsx"
      states={
        <StateGrid
          rows={[
            {
              label: "Single",
              render: (s) => cell(
                <Slider
                  label="Rooms"
                  defaultValue={[2]}
                  min={1}
                  max={6}
                  disabled={s === "disabled"}
                  className="w-32"
                />
              ),
            },
            {
              label: "Range",
              render: (s) => cell(
                <Slider
                  label="Budget"
                  hideHeader
                  defaultValue={[40, 360]}
                  min={0}
                  max={400}
                  step={10}
                  format={usd}
                  disabled={s === "disabled"}
                  // room above for the bubble the hover and focus cells raise
                  className="w-32 pt-8"
                />
              ),
            },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen className="flex flex-col gap-8">
          <Slider
            label="Distance from the centre"
            defaultValue={[5]}
            min={0}
            max={20}
            format={(v) => `${v} km`}
          />
          <Slider
            label="Walk to the beach, at most"
            defaultValue={[15]}
            min={5}
            max={60}
            step={5}
            format={(v) => `${v} min`}
          />
        </Specimen>
        <Specimen className="flex flex-col justify-center">
          <Slider
            label="Price per night"
            defaultValue={[80, 260]}
            min={0}
            max={500}
            step={10}
            format={(v) => (v >= 500 ? "$500+" : usd(v))}
            thumbLabels={["Lowest price per night", "Highest price per night"]}
          />
        </Specimen>
      </div>
    </DsBlock>
  );
}

/* ── Range filter ────────────────────────────────────────────── */

// Stays per $25 a night, $0 to $600, the last share holding everything above.
const PRICE_BINS = [3, 8, 16, 25, 33, 38, 36, 31, 26, 21, 17, 14, 11, 9, 8, 6, 5, 4, 4, 3, 2, 2, 0, 7];
// Stays per kilometre from the centre.
const DISTANCE_BINS = [22, 31, 28, 24, 19, 15, 12, 10, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 0, 1, 1];

// The stays a range keeps, read off the same shares the bars are drawn from,
// so the count and the brand-filled bars always agree.
function kept(bins: number[], min: number, max: number, range: [number, number]) {
  const width = (max - min) / bins.length;
  return bins.reduce((sum, n, i) => {
    const lo = min + i * width;
    return lo + width > range[0] && lo <= range[1] ? sum + n : sum;
  }, 0);
}

function RangeFilterBlock() {
  const [price, setPrice] = useState<[number, number]>([80, 320]);
  const [distance, setDistance] = useState<[number, number]>([0, 5]);
  return (
    <DsBlock
      id="range-filter"
      title="Range filter"
      when="a range filters results, drawn over where they sit: price, distance."
      source="components/ui/range-filter.tsx"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Specimen>
          <RangeFilter
            label="Price per night"
            description="Before taxes and the cleaning fee."
            bins={PRICE_BINS}
            min={0}
            max={600}
            step={10}
            prefix="$"
            openMax
            format={usd}
            value={price}
            onValueChange={setPrice}
            presets={[
              { label: "Under $100", range: [0, 100] },
              { label: "$100 to $250", range: [100, 250] },
              { label: "$250 and up", range: [250, 600] },
            ]}
            count={kept(PRICE_BINS, 0, 600, price)}
            countLabel={(n) => (n === 0 ? "No stays at that price" : `${n} ${n === 1 ? "stay" : "stays"}`)}
          />
        </Specimen>
        <Specimen>
          <RangeFilter
            label="Distance from the centre"
            description="As the crow flies, from the old town square."
            bins={DISTANCE_BINS}
            min={0}
            max={25}
            suffix="km"
            format={(v) => `${v} km`}
            value={distance}
            onValueChange={setDistance}
            presets={[
              { label: "Walkable", range: [0, 2] },
              { label: "Under 5 km", range: [0, 5] },
              { label: "Out of town", range: [10, 25] },
            ]}
            count={kept(DISTANCE_BINS, 0, 25, distance)}
            countLabel={(n) => (n === 0 ? "No stays that far out" : `${n} ${n === 1 ? "stay" : "stays"}`)}
          />
        </Specimen>
      </div>
    </DsBlock>
  );
}

/* ── Quantity stepper ────────────────────────────────────────── */

const GUESTS = [
  { label: "Adults", description: "Ages 13 or above", min: 1, max: 16, start: 2 },
  { label: "Children", description: "Ages 2 to 12", min: 0, max: 10, start: 1 },
  { label: "Infants", description: "Under 2", min: 0, max: 5, start: 0 },
  { label: "Pets", description: "Service animals are always welcome", min: 0, max: 3, start: 0 },
];

const EXTRAS = [
  { label: "Breakfast for two", price: 24, per: "a morning", max: 3, start: 2 },
  { label: "Airport pickup", price: 45, per: "a ride", max: 2, start: 1 },
  { label: "Extra bed", price: 18, per: "a night", max: 2, start: 0 },
];

function QuantityStepperBlock() {
  const [extras, setExtras] = useState(EXTRAS.map((x) => x.start));
  const [nights, setNights] = useState(3);
  const [rooms, setRooms] = useState(1);
  const [budget, setBudget] = useState(180);
  return (
    <DsBlock
      id="quantity-stepper"
      title="Quantity stepper"
      when="a count is small and exact: guests, nights, rooms, breakfasts."
      source="components/ui/quantity-stepper.tsx"
      variants={
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Specimen>
            <Caption>Row, a list of counts · Who is coming?</Caption>
            <div className="mt-2 divide-y divide-border">
              {GUESTS.map((g) => (
                <QuantityStepper
                  key={g.label}
                  variant="row"
                  label={g.label}
                  description={g.description}
                  defaultValue={g.start}
                  min={g.min}
                  max={g.max}
                  className="py-4"
                />
              ))}
            </div>
          </Specimen>
          <Specimen>
            <Caption>Compact, beside a line it counts · Add to your stay</Caption>
            <ul className="mt-2 divide-y divide-border">
              {EXTRAS.map((x, i) => (
                <li key={x.label} className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{x.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                      {usd(x.price)} {x.per}
                    </p>
                  </div>
                  <QuantityStepper
                    variant="compact"
                    label={x.label}
                    value={extras[i]}
                    onValueChange={(n) => setExtras((all) => all.map((v, j) => (j === i ? n : v)))}
                    min={0}
                    max={x.max}
                  />
                  <p className="w-16 text-end text-sm font-medium tabular-nums">{usd(extras[i] * x.price)}</p>
                </li>
              ))}
            </ul>
          </Specimen>
        </div>
      }
      states={
        <StateGrid
          rows={[
            {
              label: "Compact",
              render: (s) => cell(
                <QuantityStepper
                  variant="compact"
                  label="Quantity"
                  defaultValue={2}
                  min={1}
                  max={9}
                  disabled={s === "disabled"}
                />
              ),
            },
            {
              label: "At the floor",
              render: (s) => cell(
                <QuantityStepper
                  variant="compact"
                  label="Quantity"
                  defaultValue={1}
                  min={1}
                  max={9}
                  disabled={s === "disabled"}
                />
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex max-w-xl flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuantityStepper label="Nights" value={nights} onValueChange={setNights} min={1} max={28} />
          <QuantityStepper label="Rooms" value={rooms} onValueChange={setRooms} min={1} max={8} />
        </div>
        <QuantityStepper
          label="Budget per room, per night"
          value={budget}
          onValueChange={setBudget}
          min={50}
          max={1000}
          step={10}
          format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
        />
        <p className="mt-3 text-sm text-muted-foreground tabular-nums">
          {nights} {nights === 1 ? "night" : "nights"} · {rooms} {rooms === 1 ? "room" : "rooms"} ·{" "}
          <span className="font-medium text-foreground">{usd(nights * rooms * budget)}</span> before fees
        </p>
      </Specimen>
    </DsBlock>
  );
}

export function KitChoice() {
  return (
    <>
      <RadioTilesBlock />
      <DotTabsBlock />
      <SegmentedBlock />
      <FilterRailBlock />
      <SliderBlock />
      <RangeFilterBlock />
      <QuantityStepperBlock />
    </>
  );
}
