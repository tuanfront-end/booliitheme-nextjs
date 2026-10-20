"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState, type Ref } from "react";
import { isOpen, type Comment } from "./comment-file";
import { deleteComment, editComment, listComments } from "./save-comments";

// Drawn in the template's own tokens and kit edges (component-states.md
// § Every edge has one job), so the box and the list read in either half:
// focus an outline, a field's hairline an inset ring that turns 2px in the
// ring's ink when it takes the cursor, a divider a border.
const BASE =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-control text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none";
const TOOL = `${BASE} px-3 hover:bg-muted hover:text-foreground`;
const DANGER = `${BASE} px-3 hover:bg-destructive/10 hover:text-destructive`;
export const ICON = `${BASE} w-9 hover:bg-muted hover:text-foreground`;

/** A comment's text field: Return saves, Shift+Return breaks the line, Esc
 *  cancels. The cursor lands at the end of what is already there. */
export function Note({
  ref,
  value,
  onChange,
  onSubmit,
  onCancel,
  label,
  busy,
}: {
  ref?: Ref<HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  label: string;
  /** Saving: the text stays focused and unchanged until the file answers. */
  busy?: boolean;
}) {
  const own = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = own.current;
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
  }, []);
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        ref={(el) => {
          own.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        value={value}
        readOnly={busy}
        aria-busy={busy}
        aria-label={label}
        placeholder="What should change here?"
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // An input method's Return confirms the word being typed (Telex,
          // pinyin), not the comment.
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        className="block max-h-48 min-h-20 w-full resize-none rounded-[min(var(--radius-control),calc(var(--radius)*0.6))] bg-transparent px-3 py-2 text-base text-foreground ring-1 ring-border ring-inset field-sizing-content placeholder:text-muted-foreground hover:ring-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-2 focus-visible:outline-transparent read-only:text-muted-foreground md:text-sm"
      />
      <p className="px-1 text-xs text-muted-foreground">Return to save, Shift+Return for a new line</p>
    </div>
  );
}

/** The open comments, from the legend's count: each can be edited or
 *  deleted until the agent takes it up. Done ones stay in the file only.
 *  Centred over the legend, and higher on a phone, where the list spans the
 *  screen and Next's badge holds the bottom-left corner. */
export function CommentList({
  comments,
  onComments,
  onClose,
}: {
  comments: Comment[];
  onComments: (list: Comment[]) => void;
  onClose: () => void;
}) {
  const open = comments.filter(isOpen);
  const done = comments.length - open.length;
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [missed, setMissed] = useState<string | null>(null);

  // Read again on opening: the agent may have marked some done since.
  useEffect(() => {
    void listComments().then(onComments);
  }, [onComments]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || (e.target instanceof Element && e.target.closest("textarea"))) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Refused when the agent took the comment up in the meantime: the list is
  // read again so it shows where things stand.
  const run = async (id: string, act: () => Promise<Comment[] | null>) => {
    setBusy(true);
    const list = await act().catch(() => null);
    setBusy(false);
    if (list) {
      onComments(list);
      setEditing(null);
      setMissed(null);
    } else {
      setMissed(id);
      void listComments().then(onComments);
    }
  };

  return (
    <div
      data-dev-overlay
      role="region"
      aria-label="Comments"
      className="fixed bottom-6 left-1/2 z-[97] flex max-h-[min(34rem,calc(100dvh-6rem))] max-sm:bottom-16 w-[min(26rem,calc(100vw-1rem))] -translate-x-1/2 flex-col rounded-lg bg-popover text-popover-foreground shadow-soft-lg ring-1 ring-border ring-inset"
    >
      <div className="flex items-center gap-2 py-1.5 ps-4 pe-1.5">
        <p className="flex-1 text-sm font-medium">
          Comments <span className="font-normal text-muted-foreground tabular-nums">{open.length} open</span>
        </p>
        <button type="button" onClick={onClose} aria-label="Close comments" className={ICON}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      {open.length ? (
        <ol className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border">
          {open.map((c) => (
            <li key={c.id} className="flex flex-col gap-1.5 px-4 py-3 not-first:border-t not-first:border-border">
              <div className="-me-2.5 flex items-center gap-1">
                <p className="flex-1 text-sm font-medium tabular-nums">
                  {c.id} <span className="font-normal text-muted-foreground">· {c.status}</span>
                </p>
                {editing?.id === c.id ? (
                  <button type="button" onClick={() => setEditing(null)} className={TOOL}>
                    Cancel
                  </button>
                ) : (
                  <>
                    <button type="button" disabled={busy} onClick={() => setEditing({ id: c.id, text: c.text })} className={TOOL}>
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(c.id, () => deleteComment(c.id))}
                      className={DANGER}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground [overflow-wrap:anywhere]">{c.line.replaceAll("`", "")}</p>
              {editing?.id === c.id ? (
                <Note
                  value={editing.text}
                  onChange={(text) => setEditing({ id: c.id, text })}
                  onSubmit={() => editing.text.trim() && run(c.id, () => editComment(c.id, editing.text))}
                  onCancel={() => setEditing(null)}
                  label={`Edit ${c.id}`}
                  busy={busy}
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">{c.text}</p>
              )}
              {missed === c.id && (
                <p role="status" className="text-xs text-destructive">
                  Not changed: the agent has it now, or the dev server stopped.
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Nothing open. Shift+C, click an element and write what should change.
        </p>
      )}

      {done > 0 && (
        <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          {done} done, kept in <code>.comments.md</code>
        </p>
      )}
    </div>
  );
}
