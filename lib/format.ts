// Every number, price, date, time and unit the template prints is formatted
// here, so moving the site to another market is this block and nothing else.
// It ships set for the US and Europe in US English: dollars, months spelled out
// ("Oct 17"), a 12-hour clock, and miles and square feet wherever a unit shows.
// Set LOCALE to "en-GB" and CURRENCY to "GBP" for a British site, "de-DE" and
// "EUR" for a German one — the clock, the separators and the month names follow.
export const LOCALE = "en-US";
export const CURRENCY = "USD";
export const UNITS: "us" | "metric" = "us";

const numbers = new Map<string, Intl.NumberFormat>();
const dates = new Map<string, Intl.DateTimeFormat>();

/** An `Intl.NumberFormat` in the site's locale, built once per set of options. */
export function numberFormat(options: Intl.NumberFormatOptions = {}) {
  const key = JSON.stringify(options);
  let format = numbers.get(key);
  if (!format) numbers.set(key, (format = new Intl.NumberFormat(LOCALE, options)));
  return format;
}

/** An `Intl.DateTimeFormat` in the site's locale, built once per set of options. */
export function dateFormat(options: Intl.DateTimeFormatOptions = {}) {
  const key = JSON.stringify(options);
  let format = dates.get(key);
  if (!format) dates.set(key, (format = new Intl.DateTimeFormat(LOCALE, options)));
  return format;
}

/** 1,240 — a count or a figure. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return numberFormat(options).format(value);
}

/** $1,240.00 — money in the site's currency unless another is named. */
export function formatMoney(amount: number, currency = CURRENCY, options?: Intl.NumberFormatOptions) {
  return numberFormat({ style: "currency", currency, ...options }).format(amount);
}

/** Oct 17 — a day, its month spelled out; pass options for a weekday or a year. */
export function formatDay(date: Date, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return dateFormat(options).format(date);
}

/** 7:30 PM — a time of day on the locale's own clock. */
export function formatTime(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return dateFormat({ hour: "numeric", minute: "2-digit", ...options }).format(date);
}

/** 12 mi, or 19 km on a metric site — a distance given in miles. */
export function formatDistance(miles: number) {
  return UNITS === "us"
    ? formatNumber(miles, { style: "unit", unit: "mile", maximumFractionDigits: 1 })
    : formatNumber(miles * 1.609344, { style: "unit", unit: "kilometer", maximumFractionDigits: 1 });
}

/** 850 sq ft, or 79 m² on a metric site — an area given in square feet. */
export function formatArea(squareFeet: number) {
  return UNITS === "us"
    ? `${formatNumber(Math.round(squareFeet))} sq ft`
    : `${formatNumber(Math.round(squareFeet * 0.09290304))} m²`;
}

/** Dec 12, 2025 — a release or update date, printed whole. Dates on this site
 *  are what the marketplace showed when it was read, so they are never turned
 *  into "N days ago". */
export function formatDate(iso: string) {
  return dateFormat({ month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

/** Dec 2025 — the same date at the month. */
export function formatMonth(iso: string) {
  return dateFormat({ month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

/** ciseco-nextjs.vercel.app — a demo's host, the part a browser's bar shows. */
export function hostOf(url: string) {
  return new URL(url).host;
}
