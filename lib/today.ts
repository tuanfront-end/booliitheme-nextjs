// The day every demo opens on. A route is prerendered once and served for
// months, so a date written into the page is a day that passes; and the server
// cannot read the visitor's clock, so a part that waits for it paints an empty
// box first. The server draws the day the page was built instead, the
// hydrating render reads that same day so the two agree, and the render after
// moves to the visitor's own.
//
//   app/stays/[slug]/page.tsx   <Booking builtOn={builtOn()} />
//   booking.tsx ("use client")  const today = useToday(builtOn);
//                               const checkIn = addDays(today, stay.checkIn);
//
// Mock data stores offsets — `checkIn: 3`, `departs: 1` — never dates; only
// history, a review or a past order, is written as a date.

// `React.` rather than a named import: a server component imports `builtOn`
// from this file, and Next refuses a named client-hook import anywhere in the
// server's graph. The hook itself only ever runs in a client component.
import * as React from "react";

/** A day as year, month (1–12) and date. Numbers rather than a Date, so the
 *  server's timezone cannot move the day the browser reads back. */
export type Day = readonly [year: number, month: number, date: number];

/** The day the page is built. Call it in a server component and hand the
 *  three numbers to the client component that draws the dates. */
export function builtOn(): Day {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()];
}

const never = () => () => {};
const keyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/** Today at midnight: the build's day on the server and through hydration,
 *  the visitor's own on every render after. */
export function useToday(built: Day): Date {
  const key = React.useSyncExternalStore(never, () => keyOf(new Date()), () => built.join("-"));
  return React.useMemo(() => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [key]);
}

/** The day `days` after `from`, or before it when negative: an offset from the
 *  mock data made a date, `addDays(today, stay.checkIn)`. */
export function addDays(from: Date, days: number): Date {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
}
