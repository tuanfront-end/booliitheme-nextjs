// TextField — the one box a person types into: its error or counter on the label line, a hint under, slots at both ends.
"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { useRef, useState, type ReactNode, type Ref } from "react";

import { cn } from "@/lib/utils";

type ControlProps = Omit<
  FieldPrimitive.Control.Props,
  "className" | "render" | "prefix" | "children" | "style" | "ref"
>;

export type TextFieldProps = ControlProps & {
  /** Sentence case, a noun: "Email", never "What is your email?". */
  label: string;
  /** Kept for screen readers, dropped from view — for a box whose glyph
   *  already says what it holds, a search. */
  hideLabel?: boolean;
  /** Under the box: what the value is used for, or the rule it is held to. */
  hint?: ReactNode;
  /** Stands at the label line's far end, in place of the counter or aside. */
  error?: ReactNode;
  /** The label line's far end while nothing else stands there: "Optional".
   *  A word about the field, never a control. */
  aside?: ReactNode;
  /** A second thing to do with the field rather than a second thing to type
   *  in it — Show beside a password. Held after the error, so neither moves
   *  the other. */
  action?: ReactNode;
  /** Characters used of `maxLength`, at the label line's end. On by default
   *  for a multiline field that has a `maxLength`. */
  counter?: boolean;
  /** A glyph at the box's start, drawn at 18px. */
  leading?: ReactNode;
  /** Text set before the value: a currency symbol. Presentational and hidden
   *  from screen readers, so the hint says the rule in words. */
  prefix?: ReactNode;
  /** At the box's end: a unit, a glyph, or a 36px control — a Button at
   *  `size="sm"` or `"icon-sm"`, which the box lets in to 2px of its edge. In
   *  a multiline field it stands at the bottom end, where a send button sits. */
  trailing?: ReactNode;
  /** A textarea that grows with its text from `rows` to `maxRows`, then
   *  scrolls. */
  multiline?: boolean;
  /** Lines a multiline field rests at; unset, it opens 96px tall, a few
   *  lines — a form's message box. A composer rests at 1. */
  rows?: number;
  /** Lines a multiline field grows to before it scrolls; unset, it stops at
   *  384px, fifteen lines on a phone. A composer stops at 5. */
  maxRows?: number;
  className?: string;
  /** Drawn under the box and above the hint: a strength meter, a list of
   *  suggestions. */
  children?: ReactNode;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
};

// Built on Base UI's Field, so the label, the hint and the error are wired to
// the control by id without the caller passing one, and every part carries
// `data-disabled`, `data-invalid` and `data-filled`.
//
// The error stands on the label's line rather than under the box. A field that
// errors therefore grows no line, the fields under it stay where they were, and
// the submit button stays under the pointer that pressed it.
//
// The edge is not the input's own. The box is a flex row — glyph, prefix,
// input, trailing — so a slot of any width pushes the text along instead of
// needing a padding guessed for it, and the edge is a ring drawn by a sibling
// laid over the whole box, after the input in the DOM so it can read the
// input's focus as a `peer`. Focus on a control in the trailing slot rings that
// control alone, never the field.
export function TextField({
  label,
  hideLabel,
  hint,
  error,
  aside,
  action,
  counter,
  leading,
  prefix,
  trailing,
  multiline,
  rows,
  maxRows,
  className,
  children,
  ref,
  disabled,
  maxLength,
  value,
  defaultValue,
  onValueChange,
  ...props
}: TextFieldProps) {
  const local = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [typed, setTyped] = useState(() => String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value ?? "").length : typed;
  const counted = Boolean(maxLength) && (counter ?? multiline ?? false);

  const status = error ? (
    // Announced: an error arrives on a press somewhere else on the form, and a
    // reader who has moved on from this field would otherwise hear nothing.
    <FieldPrimitive.Error
      match
      role="alert"
      data-slot="text-field-error"
      className="text-sm text-destructive"
    >
      {error}
    </FieldPrimitive.Error>
  ) : counted ? (
    <span data-slot="text-field-counter" className="text-sm text-muted-foreground tabular-nums">
      <span aria-hidden="true">
        {length} / {maxLength}
      </span>
      <span className="sr-only">
        {length} of {maxLength} characters used
      </span>
    </span>
  ) : aside ? (
    <span data-slot="text-field-aside" className="text-sm text-muted-foreground">
      {aside}
    </span>
  ) : null;

  const setRef = (element: HTMLElement | null) => {
    const node = element as HTMLInputElement | HTMLTextAreaElement | null;
    local.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <FieldPrimitive.Root
      data-slot="text-field"
      invalid={Boolean(error)}
      disabled={disabled}
      className={cn("relative flex min-w-0 flex-col gap-2", className)}
    >
      <div
        data-slot="text-field-header"
        className={cn(
          "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1",
          hideLabel && !status && !action && "sr-only",
        )}
      >
        <FieldPrimitive.Label
          data-slot="text-field-label"
          className={cn(
            "text-sm font-medium text-foreground data-disabled:text-muted-foreground",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </FieldPrimitive.Label>
        {(status || action) && (
          <div className="ms-auto flex items-baseline gap-3">
            {status}
            {action}
          </div>
        )}
      </div>

      <div
        data-slot="text-field-box"
        // The box's padding and its glyphs are not the input, so a press on
        // them would land nowhere: it is handed to the input instead.
        onPointerDown={(e) => {
          if ((e.target as Element).closest("input, textarea, button, a")) return;
          e.preventDefault();
          local.current?.focus();
        }}
        className={cn(
          "group/box relative flex w-full min-w-0 cursor-text bg-card",
          multiline
            ? // A textarea at the pill seed would be a stadium, so it takes
              // the control seed capped at the row radius: 14px at the pill,
              // the seed itself on a squared template.
              "items-stretch rounded-[min(var(--radius-control),calc(var(--radius)*0.6))]"
            : "h-10 items-center gap-2 rounded-control px-4",
          disabled && "cursor-not-allowed bg-accent",
        )}
      >
        {!multiline && leading && (
          <span
            aria-hidden="true"
            data-slot="text-field-leading"
            className="pointer-events-none flex shrink-0 text-muted-foreground [&_svg:not([class*='size-'])]:size-4.5"
          >
            {leading}
          </span>
        )}
        {!multiline && prefix && (
          <span
            aria-hidden="true"
            data-slot="text-field-prefix"
            className="pointer-events-none shrink-0 text-base text-muted-foreground tabular-nums md:text-sm"
          >
            {prefix}
          </span>
        )}
        <FieldPrimitive.Control
          {...props}
          ref={setRef}
          data-slot="text-field-control"
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onValueChange={(next, details) => {
            setTyped(next.length);
            onValueChange?.(next, details);
          }}
          // an address is not a word: no red line under every email
          spellCheck={props.spellCheck ?? (props.type === "email" ? false : undefined)}
          render={multiline ? <textarea rows={rows ?? 3} /> : undefined}
          // A line is the textarea's own line height, `1lh`, so a row counts
          // as 24px on a phone and 20px from tablet up; 20px is its padding.
          style={
            multiline
              ? {
                  minHeight: rows ? `calc(${rows}lh + 20px)` : undefined,
                  maxHeight: maxRows ? `calc(${maxRows}lh + 20px)` : undefined,
                }
              : undefined
          }
          className={cn(
            // 16px on a phone, where iOS zooms the page into anything smaller
            // and never zooms back out; 14px from tablet up, the size of every
            // field's value and placeholder in the kit.
            "peer min-w-0 flex-1 bg-transparent text-base text-foreground md:text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground",
            // Autofill paints the input's own rectangle inside the pill;
            // painted back to the card, it is the box again.
            "autofill:shadow-[inset_0_0_0_100px_var(--card)] autofill:[-webkit-text-fill-color:var(--foreground)]",
            multiline
              ? cn(
                  "field-sizing-content no-scrollbar resize-none px-4 py-2.5",
                  !rows && "min-h-24",
                  !maxRows && "max-h-96",
                )
              : "h-full",
          )}
        />
        <span
          aria-hidden="true"
          data-slot="text-field-ring"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] ring-inset transition-shadow duration-answer ease-answer",
            // Focus is the box's own edge turning 2px in the ring's ink. A
            // ring is a shadow, which forced colours drop, so a transparent
            // outline rides beside it: invisible here, and painted in the
            // system's colour where the shadow is gone.
            "peer-focus-visible:outline-2 peer-focus-visible:outline-transparent",
            // In error the line is red and a step wider when focused, so the
            // field being fixed stands out from the others still wrong.
            error
              ? "ring-2 ring-destructive peer-focus-visible:ring-3"
              : disabled
                ? "ring-1 ring-border"
                : "ring-1 ring-input group-hover/box:ring-foreground/25 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
          )}
        />
        {trailing && (
          <span
            data-slot="text-field-trailing"
            className={cn(
              "flex shrink-0 items-center text-base text-muted-foreground md:text-sm",
              // A multiline box has no padding of its own, the textarea does:
              // its trailing sits at the bottom end, a unit on the last line's
              // baseline and a 36px control centred on a one-line box — 44px
              // on a phone, where the line is 24, and 40 from tablet up.
              multiline ? "self-end pe-4 pb-2.5 has-[button]:p-1 md:has-[button]:p-0.5" : "has-[button]:-me-3.5",
            )}
          >
            {trailing}
          </span>
        )}
      </div>

      {children}

      {hint && (
        <FieldPrimitive.Description
          data-slot="text-field-hint"
          className="text-sm text-muted-foreground"
        >
          {hint}
        </FieldPrimitive.Description>
      )}
    </FieldPrimitive.Root>
  );
}
