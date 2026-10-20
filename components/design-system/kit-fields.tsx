// KitFields — the sheet's field group: every control a form or a filter is built from, in each state it has.
"use client";

import {
  Building03Icon,
  Bus01Icon,
  Car01Icon,
  Coins01Icon,
  Home01Icon,
  Location01Icon,
  Mail01Icon,
  SentIcon,
  TaxiIcon,
  Ticket01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";

import { DsBlock, Specimen } from "@/components/design-system/section";
import { StateGrid, type DsState } from "@/components/design-system/state-grid";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxField } from "@/components/ui/checkbox";
import { FacetSelect, type FacetOption } from "@/components/ui/facet-select";
import { PasswordField } from "@/components/ui/password-field";
import { SearchField, type SearchSuggestion } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/ui/text-field";
import { photos } from "@/lib/data/photos";
import { cn } from "@/lib/utils";

const glyph = (icon: typeof Mail01Icon) => <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} />;

// A caption over one ground of a specimen: which dress, on what.
function Ground({ name, className, children }: { name: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <p className="text-sm text-muted-foreground">{name}</p>
      {children}
    </div>
  );
}

// A grid cell's first child takes the sheet's copy of the page-wide focus
// ring, which is right for a control that is itself focused and wrong for a
// field, whose focus is the input inside it: the cell's wrapper takes it and
// draws nothing, and the field shows its own ring.
function Cell({ children }: { children: ReactNode }) {
  return <div className="outline-none">{children}</div>;
}

// ── Text field ──────────────────────────────────────────────────────────

function TextFieldBlock() {
  const [code, setCode] = useState("SPRING24");
  const [applied, setApplied] = useState(false);
  return (
    <DsBlock
      id="text-field"
      title="Text field"
      when="a form needs a typed value: a name, an email, a code, a message."
      source="components/ui/text-field.tsx"
      variants={
        <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          <TextField
            label="Message to the host"
            multiline
            maxLength={500}
            defaultValue="We land at 9 pm. Could we check in after 10, and is there parking near the building?"
            className="md:col-span-2"
          />
          <Composer />
        </Specimen>
      }
      states={
        <StateGrid
          states={["rest", "hover", "focus", "error", "disabled"]}
          rows={[
            {
              label: "Empty",
              render: (s: DsState) => (
                <Cell>
                  <TextField
                    label="City"
                    className="w-34"
                    error={s === "error" ? "Add a city" : undefined}
                    disabled={s === "disabled"}
                  />
                </Cell>
              ),
            },
            {
              label: "Filled",
              render: (s: DsState) => (
                <Cell>
                  <TextField
                    label="City"
                    className="w-34"
                    defaultValue={s === "error" ? "Lisbn" : "Lisbon"}
                    error={s === "error" ? "Unknown city" : undefined}
                    disabled={s === "disabled"}
                  />
                </Cell>
              ),
            },
          ]}
        />
      }
      edges={
        <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          <Ground name="A long label and its error wrap the label line, and the box holds its place.">
            <TextField
              label="Name as it appears on your passport"
              defaultValue="Ana Ribeiro"
              error="Add your middle name too"
              className="max-w-xs"
            />
          </Ground>
          <Ground name="A value longer than the box scrolls inside it.">
            <TextField
              label="Email"
              type="email"
              dir="ltr"
              defaultValue="ana.conceicao.ribeiro.albuquerque@example.com"
              leading={glyph(Mail01Icon)}
              className="max-w-xs"
            />
          </Ground>
        </Specimen>
      }
    >
      <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          dir="ltr"
          defaultValue="ana.ribeiro@example.com"
          leading={glyph(Mail01Icon)}
          hint="Your booking confirmation goes here."
        />
        <TextField
          label="Nightly rate"
          prefix="$"
          inputMode="numeric"
          defaultValue="185"
          hint="In US dollars, before taxes and the cleaning fee."
        />
        <TextField
          label="Promo code"
          dir="ltr"
          value={code}
          onValueChange={(v) => {
            setCode(v.toUpperCase());
            setApplied(false);
          }}
          hint={applied ? "10% off this stay, taken off at checkout." : "One code a booking."}
          trailing={
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!code.trim() || applied}
              onClick={() => setApplied(true)}
            >
              {applied ? "Applied" : "Apply"}
            </Button>
          }
        />
        <TextField label="Company" aside="Optional" placeholder="For the invoice" />
      </Specimen>
    </DsBlock>
  );
}

// The same field as a composer: it rests at one line, grows to five, and
// holds its send button at the bottom end. Enter sends and Shift+Enter breaks
// the line, except while an input method is composing, where Enter commits
// the word.
function Composer() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!draft.trim()) return;
    setDraft("");
    setSent(true);
  };
  return (
    <TextField
      label="Reply to Marta"
      multiline
      rows={1}
      maxRows={5}
      placeholder="Write a message"
      value={draft}
      onValueChange={(v) => {
        setDraft(v);
        setSent(false);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
        e.preventDefault();
        send();
      }}
      hint={sent ? "Sent. Marta usually replies within the hour." : "Enter sends, Shift+Enter starts a new line."}
      trailing={
        <Button type="button" size="icon-sm" aria-label="Send" disabled={!draft.trim()} onClick={send}>
          <HugeiconsIcon icon={SentIcon} size={16} strokeWidth={1.5} />
        </Button>
      }
      className="md:col-span-2"
    />
  );
}

// ── Password field ──────────────────────────────────────────────────────

function PasswordFieldBlock() {
  const [fresh, setFresh] = useState("lisbon");
  return (
    <DsBlock
      id="password-field"
      title="Password field"
      when="someone signs in or chooses a password. Choosing one adds a strength meter."
      source="components/ui/password-field.tsx"
    >
      <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
        <PasswordField label="Password" defaultValue="harbour-light-29" />
        <PasswordField
          label="New password"
          meter
          defaultValue="fado-nights-in-alfama"
          hint="Eight characters or more. A phrase is easier to remember."
        />
        <PasswordField
          label="New password"
          meter
          value={fresh}
          onValueChange={setFresh}
          error={fresh.length < 8 ? "Use at least 8 characters" : undefined}
        />
        <PasswordField
          label="Password"
          disabled
          defaultValue="signed-in-with-google"
          hint="You sign in with Google, so there is no password to change."
        />
      </Specimen>
    </DsBlock>
  );
}

// ── Select ──────────────────────────────────────────────────────────────

const SORT = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price, low to high" },
  { value: "price-high", label: "Price, high to low" },
  { value: "rating", label: "Guest rating" },
];
const CITIES = [
  { value: "lisbon", label: "Lisbon" },
  { value: "porto", label: "Porto" },
  { value: "madeira", label: "Madeira" },
];
const ROOMS = [
  { value: "queen", label: "Queen room" },
  { value: "twin", label: "Twin room" },
  { value: "family", label: "Family suite" },
];
const LONG_ROOMS = [
  { value: "queen", label: "Queen room" },
  { value: "garden", label: "Family suite with a garden terrace" },
];
const ARRIVAL = [
  { value: "noon", label: "Before noon" },
  { value: "afternoon", label: "After 3 pm" },
  { value: "late", label: "After 10 pm" },
];
const TRANSFER = [
  { value: "car", label: "Rental car", icon: Car01Icon },
  { value: "taxi", label: "Taxi", icon: TaxiIcon },
  { value: "shuttle", label: "Shuttle bus", icon: Bus01Icon },
];
const REGIONS = [
  { value: "skye", label: "Isle of Skye" },
  { value: "lakes", label: "Lake District" },
  { value: "snowdonia", label: "Snowdonia" },
  { value: "cairngorms", label: "Cairngorms" },
];
const PRICES = [
  { value: "any", label: "Any price" },
  { value: "150", label: "Under $150" },
  { value: "300", label: "Under $300" },
];
const GUESTS = [
  { value: "1", label: "1 adult" },
  { value: "2", label: "2 adults" },
  { value: "2+1", label: "2 adults, 1 child" },
  { value: "4", label: "4 adults" },
];
const PLACES = [
  { value: "lisbon", label: "Lisbon, Portugal" },
  { value: "porto", label: "Porto, Portugal" },
  { value: "seville", label: "Seville, Spain" },
];

type Option = { value: string; label: string; icon?: IconSvgElement };

// A row's glyph and the value's are one: the value shows the glyph of the row
// it came from, and both mark it as leading, so each steps in by its inset.
const optionGlyph = (icon?: IconSvgElement) =>
  icon ? <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} aria-hidden data-icon="inline-start" /> : null;

function OptionValue({ items }: { items: Option[] }) {
  return (
    <SelectValue>
      {(value: string) => {
        const o = items.find((item) => item.value === value);
        return o ? (
          <>
            {optionGlyph(o.icon)}
            {o.label}
          </>
        ) : null;
      }}
    </SelectValue>
  );
}

// The list every demo opens, written the way a page writes one: its items in a
// group under a label in the trigger's words, which also names the listbox.
function SelectList({
  label,
  items,
  ...props
}: Omit<ComponentProps<typeof SelectContent>, "children" | "label"> & {
  label: string;
  items: Option[];
}) {
  return (
    <SelectContent label={label} {...props}>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {items.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {optionGlyph(o.icon)}
            {o.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
}

function SelectBlock() {
  return (
    <DsBlock
      id="select"
      title="Select"
      when="the choice is one of a list too long for tiles: a sort, a city, a room."
      source="components/ui/select.tsx"
      variants={
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Ground name="Filled, on a tint">
                <div className="divide-y divide-border rounded-lg bg-accent px-5">
                  {[
                    { label: "Arrival", line: "Fri 14 Nov", items: ARRIVAL, value: "afternoon" },
                    { label: "Getting there", line: "Lisbon airport, 25 min", items: TRANSFER, value: "taxi" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">{row.label}</p>
                        <p className="text-base">{row.line}</p>
                      </div>
                      <Select items={row.items} defaultValue={row.value}>
                        <SelectTrigger variant="filled" size="sm" aria-label={row.label}>
                          <OptionValue items={row.items} />
                        </SelectTrigger>
                        <SelectList label={row.label} items={row.items} />
                      </Select>
                    </div>
                  ))}
                </div>
              </Ground>

              <Ground name="Photo, on a photograph">
                <div className="relative aspect-[16/7] overflow-hidden rounded-lg">
                  <Image
                    src={photos.mistOverQuiraing.src}
                    alt={photos.mistOverQuiraing.alt}
                    fill
                    sizes="(min-width: 1024px) 460px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-s-4 top-4">
                    <Select items={REGIONS} defaultValue="skye">
                      <SelectTrigger variant="photo" aria-label="Stays in">
                        <SelectValue className="font-medium" />
                      </SelectTrigger>
                      <SelectList label="Stays in" items={REGIONS} />
                    </Select>
                  </div>
                </div>
              </Ground>

              <Ground name="Bare, in a bar that draws its own frame">
                <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-3">
                  {[
                    { label: "Where", icon: Location01Icon, items: CITIES, value: "lisbon" },
                    { label: "Guests", icon: UserGroupIcon, items: GUESTS, value: "2" },
                    { label: "Price a night", icon: Coins01Icon, items: PRICES, value: "any" },
                  ].map((cell, i) => (
                    <div key={cell.label} className={i ? "border-t border-border sm:border-t-0 sm:border-s" : undefined}>
                      <Select items={cell.items} defaultValue={cell.value}>
                        <SelectTrigger variant="bare" size="lg" icon={cell.icon} aria-label={cell.label}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectList label={cell.label} alignItemWithTrigger={false} align="start" items={cell.items} />
                      </Select>
                    </div>
                  ))}
                </div>
              </Ground>

              <Ground name="Tile, on a tint">
                <div className="grid grid-cols-1 gap-2.5 rounded-xl bg-accent p-2.5 sm:grid-cols-2">
                  <Select items={PLACES} defaultValue="lisbon">
                    <SelectTrigger
                      variant="tile"
                      label="Where"
                      aria-label="Where"
                      meta={
                        <>
                          <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} />
                          <span className="truncate tabular-nums">1,284 stays this month</span>
                        </>
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectList variant="list" label="Where" items={PLACES} />
                  </Select>
                  <Select items={GUESTS} defaultValue="2">
                    <SelectTrigger
                      variant="tile"
                      label="Guests"
                      aria-label="Guests"
                      meta={
                        <>
                          <HugeiconsIcon icon={UserGroupIcon} size={16} strokeWidth={1.5} />
                          <span className="truncate">Cots free on request</span>
                        </>
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectList variant="list" label="Guests" items={GUESTS} />
                  </Select>
                </div>
              </Ground>
            </div>

            <Ground name="Field, beside the text fields of a form" className="mt-6">
              <Specimen className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <TextField label="Full name" defaultValue="Ana Ribeiro" autoComplete="name" />
                <Select items={ROOMS} defaultValue="queen">
                  <div className="flex flex-col gap-2">
                    <SelectFieldLabel>Room</SelectFieldLabel>
                    <SelectTrigger size="field" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </div>
                  <SelectList label="Room" items={ROOMS} />
                </Select>
              </Specimen>
            </Ground>
        </>
      }
      states={
        <StateGrid
          states={["rest", "hover", "focus", "disabled", "error"]}
          rows={[
            {
              label: "Outline",
              render: (s: DsState) => (
                <Select items={SORT} defaultValue="recommended" disabled={s === "disabled"}>
                  <SelectTrigger aria-label="Sort by" aria-invalid={s === "error" || undefined}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectList label="Sort by" items={SORT} />
                </Select>
              ),
            },
            {
              label: "Tonal",
              render: (s: DsState) => (
                <Select items={CITIES} defaultValue="lisbon" disabled={s === "disabled"}>
                  <SelectTrigger variant="tonal" aria-label="City" aria-invalid={s === "error" || undefined}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectList label="City" items={CITIES} />
                </Select>
              ),
            },
            {
              label: "Field",
              render: (s: DsState) => (
                <Select items={ROOMS} defaultValue="queen" disabled={s === "disabled"}>
                  <SelectTrigger
                    size="field"
                    aria-label="Room"
                    aria-invalid={s === "error" || undefined}
                    className="w-36"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectList label="Room" items={ROOMS} />
                </Select>
              ),
            },
          ]}
        />
      }
      edges={
        <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          <Ground name="A long value ends in an ellipsis; the open list shows it whole.">
            <Select items={LONG_ROOMS} defaultValue="garden">
              <div className="flex flex-col gap-2">
                <SelectFieldLabel>Room</SelectFieldLabel>
                <SelectTrigger size="field" className="w-52">
                  <SelectValue />
                </SelectTrigger>
              </div>
              <SelectList label="Room" items={LONG_ROOMS} />
            </Select>
          </Ground>
          <Ground name="Nothing chosen yet: the placeholder stays a step quieter than a value.">
            <Select items={ARRIVAL}>
              <div className="flex flex-col gap-2">
                <SelectFieldLabel>Arrival</SelectFieldLabel>
                <SelectTrigger size="field" className="w-52">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
              </div>
              <SelectList label="Arrival" items={ARRIVAL} />
            </Select>
          </Ground>
        </Specimen>
      }
    >
      <Specimen className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-base">
          <span className="font-medium tabular-nums">248</span>
          <span className="text-muted-foreground"> stays in Lisbon</span>
        </p>
        <Select items={SORT} defaultValue="recommended">
          <SelectTrigger aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectList label="Sort by" items={SORT} align="end" />
        </Select>
      </Specimen>
    </DsBlock>
  );
}

// ── Facet select ────────────────────────────────────────────────────────

const TYPES: FacetOption[] = [
  { value: "apartment", label: "Apartment", count: 642 },
  { value: "house", label: "House", count: 388 },
  { value: "cabin", label: "Cabin", count: 117 },
  { value: "boat", label: "Boat", count: 0 },
];
const AMENITIES: FacetOption[] = [
  { value: "wifi", label: "Wi-Fi", count: 1102 },
  { value: "kitchen", label: "Kitchen", count: 864 },
  { value: "washer", label: "Washer", count: 512 },
  { value: "parking", label: "Free parking", count: 236 },
  { value: "hot-tub", label: "Hot tub", count: 41 },
];
const LANGUAGES: FacetOption[] = [
  { value: "en", label: "English", count: 1190 },
  { value: "pt", label: "Portuguese", count: 958 },
  { value: "fr", label: "French", count: 304 },
  { value: "es", label: "Spanish", count: 287 },
];

function Facet({
  initial = [],
  ...props
}: Omit<Parameters<typeof FacetSelect>[0], "value" | "onValueChange"> & { initial?: string[] }) {
  const [value, setValue] = useState(initial);
  return <FacetSelect {...props} value={value} onValueChange={setValue} />;
}

function FacetSelectBlock() {
  const [types, setTypes] = useState<string[]>(["apartment"]);
  const [amenities, setAmenities] = useState<string[]>(["wifi", "kitchen"]);
  const [languages, setLanguages] = useState<string[]>([]);
  const on = types.length + amenities.length + languages.length;
  return (
    <DsBlock
      id="facet-select"
      title="Facet select"
      when="a filter takes several values at once. Each row counts what it would show."
      source="components/ui/facet-select.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "focus", "disabled"]}
          rows={[
            {
              label: "Nothing set",
              render: (s: DsState) => (
                <Facet label="Amenities" options={AMENITIES} noun={["stay", "stays"]} disabled={s === "disabled"} />
              ),
            },
            {
              label: "Two set",
              render: (s: DsState) => (
                <Facet
                  label="Amenities"
                  options={AMENITIES}
                  noun={["stay", "stays"]}
                  initial={["wifi", "kitchen"]}
                  disabled={s === "disabled"}
                />
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col gap-5">
        {/* A filter row: one line that scrolls on a phone, padded by what a
            trigger's ring draws past it. */}
        <div className="no-scrollbar -mx-1 -my-3 flex gap-3 overflow-x-auto px-1 py-3 sm:flex-wrap">
          <FacetSelect
            label="Property type"
            options={TYPES}
            value={types}
            onValueChange={setTypes}
            noun={["stay", "stays"]}
            ground="card"
          />
          <FacetSelect
            label="Amenities"
            options={AMENITIES}
            value={amenities}
            onValueChange={setAmenities}
            noun={["stay", "stays"]}
            ground="card"
          />
          <FacetSelect
            label="Host language"
            options={LANGUAGES}
            value={languages}
            onValueChange={setLanguages}
            noun={["stay", "stays"]}
            ground="card"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="tabular-nums">
            {on ? `${on} ${on === 1 ? "filter" : "filters"} on` : "Showing all 1,284 stays"}
          </span>
          {on > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setTypes([]);
                setAmenities([]);
                setLanguages([]);
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      </Specimen>
    </DsBlock>
  );
}

// ── Search field ────────────────────────────────────────────────────────

const TRENDING: SearchSuggestion[] = [
  { id: "t-lisbon-may", group: "Trending searches", label: "Lisbon in May", meta: "2.4k searches" },
  { id: "t-hot-tub", group: "Trending searches", label: "Cabins with a hot tub", meta: "1.8k searches" },
  { id: "t-kyoto", group: "Trending searches", label: "Kyoto ryokan", meta: "960 searches" },
  { id: "t-cornwall", group: "Trending searches", label: "Dog-friendly in Cornwall", meta: "740 searches" },
];

const CATALOGUE: SearchSuggestion[] = [
  { id: "p-lisbon", group: "Places", label: "Lisbon, Portugal", meta: "1,284 stays", icon: Location01Icon },
  { id: "p-lyon", group: "Places", label: "Lyon, France", meta: "612 stays", icon: Location01Icon },
  { id: "p-lima", group: "Places", label: "Lima, Peru", meta: "430 stays", icon: Location01Icon },
  { id: "p-ljubljana", group: "Places", label: "Ljubljana, Slovenia", meta: "208 stays", icon: Location01Icon },
  { id: "p-kyoto", group: "Places", label: "Kyoto, Japan", meta: "877 stays", icon: Location01Icon },
  {
    id: "s-alfama",
    group: "Stays",
    label: "Alfama loft over the river",
    meta: "$186 a night",
    icon: Home01Icon,
    href: "#search-field",
  },
  {
    id: "s-lapa",
    group: "Stays",
    label: "Lapa townhouse with a garden",
    meta: "$240 a night",
    icon: Home01Icon,
    href: "#search-field",
  },
  {
    id: "s-gion",
    group: "Stays",
    label: "Gion machiya, sleeps four",
    meta: "$310 a night",
    icon: Building03Icon,
    href: "#search-field",
  },
  {
    id: "e-fado",
    group: "Experiences",
    label: "Fado night in Mouraria",
    meta: "Lisbon, Fri 14 Nov",
    icon: Ticket01Icon,
    href: "#search-field",
  },
  {
    id: "e-tea",
    group: "Experiences",
    label: "Tea ceremony in Higashiyama",
    meta: "Kyoto, daily",
    icon: Ticket01Icon,
    href: "#search-field",
  },
];

/** The rows for some text: three of a kind at most, in the order the groups
 *  are written. A real catalogue answers this from its own index. */
function suggest(text: string) {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const per: Record<string, number> = {};
  return CATALOGUE.filter(
    (s) =>
      (s.label.toLowerCase().includes(q) || s.meta?.toLowerCase().includes(q)) &&
      (per[s.group] = (per[s.group] ?? 0) + 1) <= 3,
  );
}

function Search({ disabled }: { disabled?: boolean }) {
  const [text, setText] = useState("");
  const rows = useMemo(() => suggest(text), [text]);
  return (
    <SearchField
      value={text}
      onValueChange={setText}
      suggestions={rows}
      trending={TRENDING}
      onSubmit={setText}
      label="Search stays"
      placeholder="Search stays"
      disabled={disabled}
      className="w-44"
    />
  );
}

function SearchFieldBlock() {
  const [text, setText] = useState("");
  const [searched, setSearched] = useState<string | null>(null);
  const rows = useMemo(() => suggest(text), [text]);
  return (
    <DsBlock
      id="search-field"
      title="Search field"
      when="a visitor knows what they want by name. It suggests as they type, by kind."
      source="components/ui/search-field.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "focus", "disabled"]}
          rows={[
            {
              label: "Empty",
              render: (s: DsState) => (
                <Cell>
                  <Search disabled={s === "disabled"} />
                </Cell>
              ),
            },
          ]}
        />
      }
    >
      <Specimen className="flex flex-col gap-4">
        <SearchField
          value={text}
          onValueChange={setText}
          suggestions={rows}
          trending={TRENDING}
          onSubmit={(q) => setSearched(q)}
          label="Search stays"
          placeholder="City, stay or experience"
          className="w-full max-w-md"
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {searched ? `Showing stays for “${searched}”.` : "Try “li” or “ky”, or open it empty for what is trending."}
        </p>
      </Specimen>
    </DsBlock>
  );
}

// ── Checkbox ────────────────────────────────────────────────────────────

const AMENITY_BOXES = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "kitchen", label: "Kitchen" },
  { value: "washer", label: "Washer" },
  { value: "parking", label: "Free parking" },
];

function CheckboxBlock() {
  const [picked, setPicked] = useState(["wifi", "kitchen"]);
  const [drops, setDrops] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [tried, setTried] = useState(true);
  const all = picked.length === AMENITY_BOXES.length;
  return (
    <DsBlock
      id="checkbox"
      title="Checkbox"
      when="a choice stands on its own: an amenity in a set, an agreement, an email."
      source="components/ui/checkbox.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus", "disabled"]}
          rows={(["Unchecked", "Checked", "Indeterminate"] as const).map((label) => ({
            label,
            render: (s: DsState) => (
              <Checkbox
                aria-label={`${label} example`}
                defaultChecked={label === "Checked"}
                indeterminate={label === "Indeterminate"}
                disabled={s === "disabled"}
              />
            ),
          }))}
        />
      }
    >
      <Specimen className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">Amenities</legend>
          <CheckboxField
            label="All amenities"
            checked={all}
            indeterminate={!all && picked.length > 0}
            onCheckedChange={() => setPicked(all ? [] : AMENITY_BOXES.map((a) => a.value))}
          />
          <div className="flex flex-col gap-3 ps-8">
            {AMENITY_BOXES.map((a) => (
              <CheckboxField
                key={a.value}
                label={a.label}
                checked={picked.includes(a.value)}
                onCheckedChange={(on) =>
                  setPicked((p) => (on ? [...p, a.value] : p.filter((v) => v !== a.value)))
                }
              />
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-5">
          <CheckboxField
            label="Email me when the price drops"
            description="One email a week at most, for stays you saved."
            checked={drops}
            onCheckedChange={setDrops}
          />
          <CheckboxField
            label="I agree to the house rules and the cancellation policy"
            checked={agreed}
            onCheckedChange={(on) => {
              setAgreed(on);
              if (on) setTried(false);
            }}
            error={tried && !agreed ? "Agree to the house rules to book this stay." : undefined}
          />
          <CheckboxField label="Travelling for work" disabled description="Turned on by your company account." defaultChecked />
          <div>
            <Button size="sm" onClick={() => setTried(true)}>
              {agreed ? "Booking requested" : "Request to book"}
            </Button>
          </div>
        </div>
      </Specimen>
    </DsBlock>
  );
}

// ── Switch ──────────────────────────────────────────────────────────────

const SETTINGS = [
  {
    label: "Show the total price",
    line: "Cleaning and service fees included, before taxes.",
    on: true,
  },
  {
    label: "Instant book only",
    line: "Stays you can book without waiting for the host to reply.",
    on: false,
  },
  {
    label: "Pets allowed",
    line: "Hosts who welcome a dog or a cat, with any fee shown up front.",
    on: false,
  },
];

function SwitchBlock() {
  return (
    <DsBlock
      id="switch"
      title="Switch"
      when="a setting takes effect the moment it flips, with no Save after it."
      source="components/ui/switch.tsx"
      states={
        <StateGrid
          states={["rest", "hover", "active", "focus", "disabled"]}
          rows={[
            { label: "Off", on: false, size: "default" as const },
            { label: "On", on: true, size: "default" as const },
            { label: "Off, small", on: false, size: "sm" as const },
            { label: "On, small", on: true, size: "sm" as const },
          ].map((row) => ({
            label: row.label,
            render: (s: DsState) => (
              <Switch
                aria-label={`${row.label} example`}
                size={row.size}
                defaultChecked={row.on}
                disabled={s === "disabled"}
              />
            ),
          }))}
        />
      }
    >
      <Specimen className="py-0 sm:py-0">
        <ul className="divide-y divide-border">
          {SETTINGS.map((s) => (
            <li key={s.label}>
              <label className="flex cursor-pointer items-start justify-between gap-6 py-5">
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-sm text-muted-foreground">{s.line}</span>
                </span>
                <Switch defaultChecked={s.on} className="mt-0.5" />
              </label>
            </li>
          ))}
          <li className="py-5">
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
              <Switch size="sm" />
              Email me when a saved stay drops in price
            </label>
          </li>
        </ul>
      </Specimen>
    </DsBlock>
  );
}

export function KitFields() {
  return (
    <>
      <TextFieldBlock />
      <PasswordFieldBlock />
      <SelectBlock />
      <FacetSelectBlock />
      <SearchFieldBlock />
      <CheckboxBlock />
      <SwitchBlock />
    </>
  );
}
