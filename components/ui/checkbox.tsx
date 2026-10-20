// Checkbox — a box ticked to agree or to turn one option of many on, alone or with its sentence, a note and an error.
"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// 20px drawn and 40px reached, through a pseudo-element rather than padding, so
// the box keeps its size in a line of type. Square where a radio is round —
// the control seed capped at 6px, so it follows a squared template and never
// turns into a circle at the pill.
//
// The empty box is edged in the quiet ink at 80%: 3.7:1 on a card in the light
// half and 5.1:1 in the dark, over the 3:1 a control's edge needs. The hairline
// it used to wear measured 1.15:1 and all but vanished in the dark. Ticked, it
// takes the brand's fill with the fill's own ink on it, so the tick reads on a
// light brand as well as a dark one; indeterminate is drawn the same with a
// bar, since it is "some of these are on".
//
// It answers to its label's hover whether the label wraps it or stands before
// it, and to a refusal with a red edge that a tick clears.
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[min(var(--radius-control),6px)] border border-muted-foreground/80 bg-card text-primary-foreground press",
        "after:absolute after:-inset-2.5 after:content-['']",
        "not-data-disabled:hover:border-foreground/80 not-data-disabled:[label:hover_&]:border-foreground/80 not-data-disabled:[label:hover~&]:border-foreground/80",
        "not-data-disabled:data-checked:border-primary not-data-disabled:data-checked:bg-primary not-data-disabled:data-indeterminate:border-primary not-data-disabled:data-indeterminate:bg-primary",
        "not-data-disabled:data-checked:hover:bg-primary/80 not-data-disabled:data-checked:[label:hover_&]:bg-primary/80 not-data-disabled:data-checked:[label:hover~&]:bg-primary/80 not-data-disabled:data-indeterminate:hover:bg-primary/80 not-data-disabled:data-indeterminate:[label:hover_&]:bg-primary/80",
        "aria-invalid:not-data-checked:border-destructive aria-invalid:not-data-checked:ring-1 aria-invalid:not-data-checked:ring-destructive aria-invalid:not-data-checked:ring-inset",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        // Locked: lower ink, never a faded box — the edge drops to the
        // hairline and a tick stays legible on the deepest rung.
        "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-muted data-disabled:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {/* Mounted in every state and faded, never removed. An inline box takes
          its baseline from what is inside it: empty, from its bottom edge;
          ticked, from the tick. Unmounting the tick moved the box 1.5px in any
          line it stood in — a table cell, a sentence — and grew that line by
          3px each press. Both glyphs stay laid over each other, so a bar going
          to empty fades out as a bar rather than turning into a tick. */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="group/indicator grid place-items-center *:[grid-area:1/1] *:opacity-0 *:transition-[opacity,scale] *:duration-answer *:ease-answer *:motion-safe:scale-75"
      >
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={3}
          aria-hidden="true"
          className="size-3.5 group-data-checked/indicator:opacity-100 group-data-checked/indicator:motion-safe:scale-100"
        />
        <HugeiconsIcon
          icon={MinusSignIcon}
          strokeWidth={3}
          aria-hidden="true"
          className="size-3.5 group-data-indeterminate/indicator:opacity-100 group-data-indeterminate/indicator:motion-safe:scale-100"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/** The box with its sentence: the whole sentence presses it. A `description`
 *  sits under the sentence in the quieter ink; an `error` under both, red, in
 *  place of nothing — the box's edge turns with it, and the reason is read out
 *  as it appears. */
function CheckboxField({
  label,
  description,
  error,
  className,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, "children" | "className"> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  className?: string;
}) {
  const id = useId();
  const described = [description && `${id}-note`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div data-slot="checkbox-field" className={cn("flex flex-col gap-2", className)}>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 text-sm text-foreground",
          props.disabled && "cursor-not-allowed text-muted-foreground",
        )}
      >
        <Checkbox
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span>{label}</span>
          {description && (
            <span id={`${id}-note`} className="text-muted-foreground">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="ps-8 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Checkbox, CheckboxField };
