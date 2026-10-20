"use client";

import { useSyncExternalStore } from "react";

// The shortlist: the templates a visitor has saved while comparing, kept in
// this browser only. One store every save toggle, the header's count and the
// shortlist panel read, so saving on a card moves the count in the header in
// the same frame. Storage can be missing or refuse a write — a private window,
// blocked site data — and then the list lives for the visit and nothing breaks.

const KEY = "booliitheme:shortlist";
const EMPTY: string[] = [];

let slugs: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (slugs) return slugs;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    slugs = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    slugs = [];
  }
  return slugs;
}

function write(next: string[]) {
  slugs = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Kept in memory for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab saving or clearing moves this one too.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    slugs = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved slugs, newest first. Empty on the server and on the first paint. */
export function useShortlist() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleShortlist(slug: string) {
  const current = read();
  write(current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current]);
}

export function clearShortlist() {
  write([]);
}
