// Price — an amount of money as every page prints it: the figure in its currency and locale, a muted unit after it, cents only under ten, and Free at zero.
import { CURRENCY, LOCALE } from "@/lib/format";
import { cn } from "@/lib/utils";

// Every figure that is money renders through this, so a buyer changing the
// currency or the locale changes it once and the whole template follows — a
// `$38` typed into copy is a price that stays behind.
//
// Whole units from ten up, cents below it: $38 and $4.50 are both how a price
// in those ranges is written, and rounding the second to $5 would be a
// different claim. A currency with no minor unit keeps none at any size.
//
// Zero is "Free" rather than $0: a currency sign in front of a nought is a
// price where there is meant to be none. A page whose argument is the zero —
// "we add $0 to the rate" — passes `freeLabel={null}` to print the figure.
//
// Split weight rather than split size, which is the house line: the figure is
// the answer and carries the weight, the unit is muted at the same size. The
// whole phrase reads left to right on either page, so it carries `dir="ltr"`.
const formats = new Map<string, Intl.NumberFormat>();

function format(amount: number, currency: string, locale: string) {
  const base = `${locale}|${currency}`;
  let whole = formats.get(base);
  if (!whole) {
    whole = new Intl.NumberFormat(locale, { style: "currency", currency });
    formats.set(base, whole);
  }
  const minor = whole.resolvedOptions().maximumFractionDigits ?? 2;
  const digits = Math.abs(amount) < 10 ? minor : 0;
  const key = `${base}|${digits}`;
  let shown = formats.get(key);
  if (!shown) {
    shown = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formats.set(key, shown);
  }
  return shown.format(amount);
}

function Price({
  amount,
  currency = CURRENCY,
  locale = LOCALE,
  per,
  freeLabel = "Free",
  className,
}: {
  /** In the currency's major unit: 38, 4.5, 0. */
  amount: number;
  /** An ISO 4217 code: "USD", "EUR", "GBP". */
  currency?: string;
  /** Where the sign goes and what separates the thousands: "en-US", "de-DE". */
  locale?: string;
  /** The unit the price is for — "night", "person", "hr" — printed as /night. */
  per?: string;
  /** What zero prints as; `null` prints the figure instead. */
  freeLabel?: string | null;
  className?: string;
}) {
  const free = amount === 0 && freeLabel != null;
  return (
    <span data-slot="price" dir="ltr" className={cn("tabular-nums", className)}>
      <span data-slot="price-amount" className="font-medium">
        {free ? freeLabel : format(amount, currency, locale)}
      </span>
      {per && !free && (
        <span data-slot="price-per" className="font-normal text-muted-foreground">
          <span aria-hidden="true">/</span>
          {/* " per " for a screen reader, hidden in the line rather than by
              `sr-only`. An absolutely placed word escapes a scrolling rail's
              clip and widens the whole page; and positioning the price to hold
              it would lift the figure over a link card's stretched link, so a
              press on the price would open nothing. */}
          <span className="inline-block size-px -m-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
            {" per "}
          </span>
          {per}
        </span>
      )}
    </span>
  );
}

export { Price };
