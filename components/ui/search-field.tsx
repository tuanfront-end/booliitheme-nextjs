// SearchField — a search box whose list suggests as it is typed into, grouped by kind, with trending searches while it is empty.
"use client";

import { Cancel01Icon, Search01Icon, TrendingUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { eyebrowClass } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

export type SearchSuggestion = {
  /** Unique across the list. */
  id: string;
  /** The heading a row sits under — "Places", "Stays". Rows of one group
   *  arrive together. */
  group: string;
  label: string;
  /** A fact held at the row's end: a count, a place and a date. */
  meta?: string;
  /** The row's glyph, a HugeIcons icon; a search glass when left out. */
  icon?: IconSvgElement;
  /** A suggestion naming one item goes straight to it. Without one, taking
   *  the row searches for its words. */
  href?: string;
};

/** The combobox under the search: which row is current, the keys that move
 *  it, the presses that take one, and the ARIA a screen reader follows along
 *  by. What the rows are and what taking one does stay with the caller.
 *
 *  Focus or typing opens the list, the arrow keys walk it, Enter takes the
 *  current row, and Escape or focus leaving `root` closes it without taking
 *  anything. The field keeps its text, so coming back opens the same list.
 *  Spread `root` on what holds the field and the list, `input` on the field,
 *  `listbox` on the list and `option(i)` on each row; a row carries
 *  `data-active` while it is current. */
export function useCombobox<T>({
  rows,
  onType,
  onTake,
}: {
  rows: readonly T[];
  /** The field's text, on every keystroke. */
  onType: (text: string) => void;
  /** A row taken by Enter, a click, or a tap. */
  onTake: (row: T, index: number) => void;
}) {
  const list = useId();
  const [asked, setAsked] = useState(false);
  const [index, setIndex] = useState(-1);

  const open = asked && rows.length > 0;
  // An index left past the end by rows that changed under it is no row.
  const active = open && index < rows.length ? index : -1;
  const id = (i: number) => `${list}-${i}`;

  const show = () => {
    setAsked(true);
    setIndex(-1);
  };
  const close = () => {
    setAsked(false);
    setIndex(-1);
  };
  const take = (i: number) => {
    close();
    onTake(rows[i], i);
  };

  return {
    open,
    active,
    show,
    close,
    root: {
      // Focus moving to a control inside it — the clear button — keeps the
      // list; leaving it altogether closes it.
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      },
    },
    input: {
      role: "combobox",
      "aria-autocomplete": "list" as const,
      "aria-expanded": open,
      "aria-controls": list,
      "aria-activedescendant": active >= 0 ? id(active) : undefined,
      autoComplete: "off",
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        onType(e.target.value);
        show();
      },
      onFocus: () => setAsked(true),
      onClick: () => setAsked(true),
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        // A key that commits an IME composition belongs to the IME, or
        // confirming a word typed in Japanese or Chinese would take a row.
        if (e.nativeEvent.isComposing) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setAsked(true);
          setIndex(Math.min(rows.length - 1, active + 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setIndex(Math.max(-1, active - 1));
        } else if (e.key === "Escape" && open) {
          // The list first; a second Escape reaches whatever holds the
          // field, a dialog or a popover.
          e.stopPropagation();
          close();
        } else if (e.key === "Enter" && active >= 0) {
          // Without a current row, Enter submits the form as typed.
          e.preventDefault();
          take(active);
        }
      },
    },
    listbox: { id: list, role: "listbox" },
    option: (i: number) => ({
      id: id(i),
      role: "option",
      "aria-selected": i === active,
      "data-active": i === active || undefined,
      // mousedown would move focus off the field first, and the blur on
      // `root` would close the list before the click could land
      onMouseDown: (e: MouseEvent) => e.preventDefault(),
      onMouseEnter: () => setIndex(i),
    }),
  };
}

/** The field and its list. Typing hands the text up through `onValueChange`
 *  and the caller answers with `suggestions` for it; an empty field shows
 *  `trending`. Enter with no row picked, or a row without an `href`, calls
 *  `onSubmit` with the words; a row with one goes to it. */
export function SearchField({
  value,
  onValueChange,
  suggestions,
  trending = [],
  onSubmit,
  label = "Search",
  placeholder,
  disabled,
  className,
}: {
  value: string;
  onValueChange: (text: string) => void;
  /** The rows for the text in the field, grouped and in order. */
  suggestions: readonly SearchSuggestion[];
  /** The rows while the field is empty, most searched first; each draws the
   *  trend mark before its meta. */
  trending?: readonly SearchSuggestion[];
  onSubmit: (query: string) => void;
  /** The field's name for a screen reader; it is not drawn. */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const rows = value.trim() ? suggestions : trending;
  const rising = !value.trim();

  const box = useCombobox({
    rows,
    onType: onValueChange,
    onTake: (row, i) => {
      if (row.href) {
        // The row is a link: pressing it lets the link go, so a new tab and
        // a middle click still work. Enter reaches it through the same click.
        document.getElementById(box.option(i).id)?.click();
        return;
      }
      onValueChange(row.label);
      onSubmit(row.label);
    },
  });

  // A list wider than its field can run off the screen when the field sits
  // near one edge of a phone; it moves back in until it clears the 16px
  // gutter, on whichever side it ran off. Measured against the root's client
  // width, which content running past the edge does not widen.
  const listRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.style.translate = "";
    const room = document.documentElement.clientWidth - 16;
    const r = list.getBoundingClientRect();
    if (r.right > room) list.style.translate = `${-Math.min(r.right - room, r.left - 16)}px 0`;
    else if (r.left < 16) list.style.translate = `${Math.min(16 - r.left, room - r.right)}px 0`;
  }, [box.open, rows]);

  // The current row stays in view as the arrow keys walk a long list.
  useEffect(() => {
    if (box.active < 0) return;
    document.getElementById(box.option(box.active).id)?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.active]);

  return (
    <form
      role="search"
      {...box.root}
      onSubmit={(e) => {
        e.preventDefault();
        box.close();
        if (value.trim()) onSubmit(value.trim());
      }}
      className={cn("relative", className)}
    >
      <TextField
        {...box.input}
        ref={input}
        label={label}
        hideLabel
        type="text"
        enterKeyHint="search"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        leading={<HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} />}
        trailing={
          value && !disabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => {
                onValueChange("");
                input.current?.focus();
                box.show();
              }}
            >
              <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
            </Button>
          ) : null
        }
      >
        {box.open && (
          <div
            ref={listRef}
            {...box.listbox}
            aria-label={rising ? "Trending searches" : "Suggestions"}
            data-slot="search-field-list"
            // As wide as the field at least, and wider when a row needs it,
            // so a narrow field never cuts a suggestion short.
            className="no-scrollbar absolute inset-s-0 top-full z-30 mt-2 max-h-[min(28rem,60vh)] w-max max-w-[min(28rem,calc(100vw-2rem))] min-w-full origin-top overflow-y-auto rounded-lg bg-popover p-2 text-popover-foreground shadow-soft-lg duration-spring ease-spring animate-in fade-in-0 zoom-in-95"
          >
            {groups(rows).map(({ name, start, items }) => (
              <div key={name} role="group" aria-labelledby={`${box.listbox.id}-g${start}`}>
                <div
                  id={`${box.listbox.id}-g${start}`}
                  role="presentation"
                  className={cn(eyebrowClass, "px-3 pt-2 pb-2")}
                >
                  {name}
                </div>
                {items.map((row, n) => {
                  const i = start + n;
                  const body = (
                    <>
                      <HugeiconsIcon
                        icon={row.icon ?? Search01Icon}
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                        {row.label}
                      </span>
                      {row.meta && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground tabular-nums">
                          {rising && (
                            <HugeiconsIcon icon={TrendingUpIcon} strokeWidth={1.5} aria-hidden="true" className="size-4 text-primary-ink rtl:-scale-x-100" />
                          )}
                          {row.meta}
                        </span>
                      )}
                    </>
                  );
                  const look =
                    "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-answer ease-answer data-active:bg-accent active:bg-muted";
                  return row.href ? (
                    <Link
                      key={row.id}
                      href={row.href}
                      tabIndex={-1}
                      {...box.option(i)}
                      onClick={() => box.close()}
                      className={look}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      key={row.id}
                      {...box.option(i)}
                      onClick={() => {
                        box.close();
                        onValueChange(row.label);
                        onSubmit(row.label);
                      }}
                      className={look}
                    >
                      {body}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        <span className="sr-only" aria-live="polite">
          {box.open ? `${rows.length} ${rows.length === 1 ? "suggestion" : "suggestions"}` : ""}
        </span>
      </TextField>
    </form>
  );
}

/** Consecutive rows of one group, with the index the group starts at. */
function groups(rows: readonly SearchSuggestion[]) {
  const out: { name: string; start: number; items: SearchSuggestion[] }[] = [];
  rows.forEach((row, i) => {
    const last = out[out.length - 1];
    if (last && last.name === row.group) last.items.push(row);
    else out.push({ name: row.group, start: i, items: [row] });
  });
  return out;
}
