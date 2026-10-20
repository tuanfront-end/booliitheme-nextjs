// The comment file: `.comments.md` at the repo root, one block a comment,
// written by the picker as each comment is saved and read by the agent when
// it is told to process them. Plain values and string work only, so the page
// and the server action share it.
//
//   ## c12 · new
//   `/events` · 3.2 · EventCard › h3 · 1440 light — text-lg 18/600 · --foreground
//   2026-10-18 14:32
//
//   > The title wraps to three lines at 1280; keep it to two.
//
// The second line is the line the picker copies, so a block's header pastes
// into chat as a pick does. The status is the one thing the agent edits:
// `new`, then `asked` while it waits on an answer in chat, or `done <commit>`.

// The repo root, not app/ or components/: written inside the source tree it
// would be a file the dev server watches, reloading the page on every save.
// Gitignored, because the requests are working notes to an agent; the commits
// that answer them are what the project keeps.
export const COMMENTS_FILE = ".comments.md";

export const HEADER = `# Comments

Left on the page under \`npm run dev\`: Shift+C, click an element, write. One
block each, oldest first. A block's status is \`new\`, \`asked\` or
\`done <commit>\`.
`;

/** Where a pick landed, as plain values: what the copy line is written from,
 *  and what a comment carries to the server, which checks every field. */
export type Spot = {
  route: string;
  /** `3.2`, `H`, `F`, or empty outside the header, main and footer. */
  index: string;
  name: string;
  tag: string;
  /** The viewport's width in px, since an index is true at one width. */
  width: number;
  half: "light" | "dark";
  type?: { step: string; px: number; weight: number };
  /** The token, or the hex where no token matches. */
  colour?: string;
};

export type Comment = {
  id: string;
  status: string;
  line: string;
  time: string;
  text: string;
};

export const label = (s: { index: string; name: string }) => (s.index ? `${s.index} · ${s.name}` : s.name);

export const chain = (s: Spot) => (s.name === s.tag ? label(s) : `${label(s)} › ${s.tag}`);

/** `/events` · 3.2 · EventCard › h3 · 1440 light — text-lg 18/600 · --foreground */
export function spotLine(s: Spot): string {
  let out = `\`${s.route}\` · ${chain(s)} · ${s.width} ${s.half}`;
  if (s.type) out += ` — ${s.type.step} ${s.type.px}/${s.type.weight}`;
  if (s.colour) out += ` · ${s.colour}`;
  return out;
}

/** Not yet taken up by the agent, so the page may still edit or delete it. */
export const isOpen = (c: Comment) => c.status === "new" || c.status === "asked";

const HEAD = /^## (c\d+) · (.*)$/;
const TIME = /^\d{4}-\d\d-\d\d \d\d:\d\d$/;

type Block = Comment & { raw: string };
export type Parsed = { head: string; blocks: Block[] };

/** Every block in file order, each with its own text kept, so a block the
 *  page does not touch is written back exactly as the agent left it. */
export function parse(md: string): Parsed {
  const head: string[] = [];
  const blocks: Block[] = [];
  let at: string[] | null = null;
  const close = () => {
    if (!at) return;
    const [first, ...rest] = at;
    const [, id, status] = HEAD.exec(first)!;
    while (rest.length && !rest.at(-1)!.trim()) rest.pop();
    blocks.push({
      id,
      status: status.trim(),
      line: rest.find((l) => l.startsWith("`")) ?? "",
      time: rest.find((l) => TIME.test(l)) ?? "",
      text: rest
        .filter((l) => l.startsWith(">"))
        .map((l) => l.replace(/^> ?/, ""))
        .join("\n"),
      raw: [first, ...rest].join("\n"),
    });
  };
  for (const l of md.replace(/\r\n?/g, "\n").split("\n")) {
    if (HEAD.test(l)) {
      close();
      at = [l];
    } else if (at) at.push(l);
    else head.push(l);
  }
  close();
  return { head: head.join("\n").trim() ? head.join("\n").trimEnd() + "\n" : HEADER, blocks };
}

/** One comment as its block. The text is quoted line by line, so nothing typed
 *  into it can read as the next block's heading. */
export function block(c: Comment): Block {
  const quote = c.text.split("\n").map((l) => (l ? `> ${l}` : ">"));
  return { ...c, raw: [`## ${c.id} · ${c.status}`, c.line, c.time, "", ...quote].join("\n") };
}

export function print(file: Parsed): string {
  return [file.head.trimEnd(), ...file.blocks.map((b) => b.raw)].join("\n\n") + "\n";
}

export const plain = ({ id, status, line, time, text }: Block): Comment => ({ id, status, line, time, text });
