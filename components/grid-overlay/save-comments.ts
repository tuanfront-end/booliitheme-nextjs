"use server";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  block,
  COMMENTS_FILE,
  isOpen,
  parse,
  plain,
  print,
  spotLine,
  type Comment,
  type Parsed,
  type Spot,
} from "./comment-file";

// A server action is a public endpoint in a production build, so the guard is
// the first line of every action rather than a convention: outside `next dev`
// each one reads and writes nothing, and answers null. The payload is rebuilt
// field by field before it is written, so whatever is posted, a block holds a
// route, a name, a few numbers and the quoted text.

const ROUTE = /^\/[^\s`]{0,200}$/;
const INDEX = /^(?:(?:[HF]|\d{1,3})(?:\.\d{1,4})?)?$/;
const NAME = /^[\w$.:-]{1,80}$/;
const TAG = /^[a-z][a-z0-9-]{0,40}$/;
const STEP = /^text-(?:[a-z0-9-]{1,20}|\[\d{1,4}(?:\.\d)?px\])$/;
const COLOUR = /^(?:--[\w-]{1,60}(?:\/\d{1,3})?|#[0-9a-f]{6}(?:[0-9a-f]{2})?)$/;
const ID = /^c\d{1,6}$/;
const LONGEST = 4000;

const whole = (n: unknown, min: number, max: number) =>
  typeof n === "number" && Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : null;

function cleanSpot(v: unknown): Spot | null {
  const s = (v ?? {}) as Record<string, unknown>;
  const str = (k: string, re: RegExp) => (typeof s[k] === "string" && re.test(s[k]) ? (s[k] as string) : null);
  const route = str("route", ROUTE);
  const index = str("index", INDEX);
  const name = str("name", NAME);
  const tag = str("tag", TAG);
  const width = whole(s.width, 0, 20000);
  const half = s.half === "dark" ? "dark" : s.half === "light" ? "light" : null;
  if (route === null || index === null || !name || !tag || width === null || !half) return null;
  const spot: Spot = { route, index, name, tag, width, half };
  const t = (s.type ?? {}) as Record<string, unknown>;
  const px = typeof t.px === "number" && t.px > 0 && t.px < 1000 ? Math.round(t.px * 10) / 10 : null;
  const weight = whole(t.weight, 1, 1000);
  if (typeof t.step === "string" && STEP.test(t.step) && px !== null && weight !== null)
    spot.type = { step: t.step, px, weight };
  const colour = str("colour", COLOUR);
  if (spot.type && colour) spot.colour = colour;
  return spot;
}

function cleanText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const text = v.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return text && text.length <= LONGEST ? text : null;
}

// Local time to the minute: when it was written, for the person reading the
// file, not an ordering — blocks are in the order they were saved.
function now() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const file = () => path.join(process.cwd(), COMMENTS_FILE);

// A missing file is the ordinary case — no comment written yet.
async function load(): Promise<Parsed> {
  try {
    return parse(await readFile(file(), "utf8"));
  } catch {
    return parse("");
  }
}

// The agent edits the same file, so every change reads it fresh and writes it
// back whole, one change at a time: two saves in quick succession must not
// each read the file before the other has written.
let queue: Promise<unknown> = Promise.resolve();
function change(edit: (f: Parsed) => boolean): Promise<Comment[] | null> {
  const run = queue.then(async () => {
    const f = await load();
    if (!edit(f)) return null;
    await writeFile(file(), print(f), "utf8");
    return f.blocks.map(plain);
  });
  queue = run.catch(() => {});
  return run;
}

export async function listComments(): Promise<Comment[]> {
  if (process.env.NODE_ENV !== "development") return [];
  return (await load()).blocks.map(plain);
}

/** Appended as `new`, numbered one past the highest number in the file. */
export async function addComment(spot: Spot, text: string): Promise<Comment[] | null> {
  if (process.env.NODE_ENV !== "development") return null;
  const at = cleanSpot(spot);
  const words = cleanText(text);
  if (!at || !words) return null;
  return change((f) => {
    const n = Math.max(0, ...f.blocks.map((b) => Number(b.id.slice(1)))) + 1;
    f.blocks.push(block({ id: `c${n}`, status: "new", line: spotLine(at), time: now(), text: words }));
    return true;
  });
}

/** Only while it is open. An `asked` comment edited is the answer, so it
 *  comes back `new` for the next pass. */
export async function editComment(id: string, text: string): Promise<Comment[] | null> {
  if (process.env.NODE_ENV !== "development") return null;
  const words = cleanText(text);
  if (typeof id !== "string" || !ID.test(id) || !words) return null;
  return change((f) => {
    const i = f.blocks.findIndex((b) => b.id === id);
    if (i < 0 || !isOpen(f.blocks[i])) return false;
    f.blocks[i] = block({ ...f.blocks[i], status: "new", text: words });
    return true;
  });
}

/** Only while it is open: a done comment is the record of a commit. */
export async function deleteComment(id: string): Promise<Comment[] | null> {
  if (process.env.NODE_ENV !== "development") return null;
  if (typeof id !== "string" || !ID.test(id)) return null;
  return change((f) => {
    const i = f.blocks.findIndex((b) => b.id === id);
    if (i < 0 || !isOpen(f.blocks[i])) return false;
    f.blocks.splice(i, 1);
    return true;
  });
}
