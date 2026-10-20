// QuantityStepper — a number typed or stepped with − and +, held to its range and snapped to its step.
"use client";

import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { numberFormat } from "@/lib/format";

// Three dresses of one control.
//   field    the label inside a tinted pill over the figure, − and + in a white
//            pill at its end, the figure typeable: a calculator's inputs, a
//            nights or rooms count.
//   row      the label and a line on the left, the compact stepper at the
//            right end of the row: a guest picker's adults, children and pets.
//   compact  the stepper alone, its label for screen readers only: two outline
//            circles with the figure between them and no box round the
//            three, the guest-count stepper of the big booking sites — a cart
//            line, an add-on, a seat count.
// In `row` and `compact` the figure is read, not typed, as on those sites:
// counts this small are faster pressed than typed, and an input there would
// take focus on every press and, as a text field, ring on a click.
type Variant = "field" | "row" | "compact";

type QuantityStepperProps = {
  /** Names the figure, and is said in the − and + labels. */
  label: string;
  /** A line under the label in the `row` dress: "Ages 2 to 12". */
  description?: React.ReactNode;
  variant?: Variant;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  /** No ceiling unless given; End jumps to it when there is one. */
  max?: number;
  /** What − and + move by; a press lands on the next multiple of it. */
  step?: number;
  /** How the figure is written: `{ style: "currency", currency: "USD" }`. */
  format?: Intl.NumberFormatOptions;
  /** The key the figure is sent under in a form. */
  name?: string;
  disabled?: boolean;
  className?: string;
};

// The −/+ are the house Button, and how they take focus follows the dress.
//
// In `field` they are out of the tab order, as a spin button's are: the
// figure takes the arrow keys, Page Up and Down, Home and End, so the
// keyboard reaches every value from one stop. They are a ghost at the 36px
// icon size inside a pill.
//
// In `row` and `compact` the figure is not a stop, so each is its own, and
// its ring is the Button's own `:focus-visible` outline — drawn after a key,
// never after a click. Each is a 32px circle — the control seed's corner, so
// a template that squares its controls squares these with them — on a
// hairline in the field edge's grey, the edge going to full ink under the
// pointer and no fill behind it; at an end the edge and the glyph drop to the
// lowest ink, never a fade. Base UI marks the one at an end disabled but
// keeps it focusable, so pressing down to the floor does not drop focus on
// the page. Drawn at 32, the Button's pseudo-element is pushed 4px out on
// every side, so each still answers on 40 by 40.
function StepButton({
  dir,
  label,
  circle,
  disabled,
  onPointerDown,
}: {
  dir: "down" | "up";
  label: string;
  circle: boolean;
  disabled?: boolean;
  onPointerDown?: () => void;
}) {
  const Part = dir === "down" ? NumberField.Decrement : NumberField.Increment;
  return (
    <Part
      aria-label={`${dir === "down" ? "Decrease" : "Increase"} ${label.toLowerCase()}`}
      tabIndex={circle && !disabled ? 0 : -1}
      onPointerDown={onPointerDown}
      render={
        <Button
          variant="ghost"
          size="icon-sm"
          className={
            circle
              ? "size-8 border-input after:-inset-1 hover:bg-transparent enabled:hover:border-foreground disabled:border-border disabled:hover:text-muted-foreground data-disabled:border-border dark:hover:bg-transparent"
              : undefined
          }
        />
      }
    >
      <HugeiconsIcon icon={dir === "down" ? MinusSignIcon : PlusSignIcon} size={16} strokeWidth={1.5} aria-hidden />
    </Part>
  );
}

// In `field` the ring is drawn on the pill the figure sits in whenever the
// figure has keyboard focus, and the figure itself draws none, so nothing is
// ringed twice. A press on − or + puts focus in the figure too — Base UI does
// that so the arrow keys carry on from the press — and a text field always
// matches `:focus-visible`, so the press marks the pill quiet and the ring
// waits for a key. A click into the figure to type rings it, as every house
// text field rings on focus.
const ringed =
  "not-data-quiet:has-focus-visible:outline-2 not-data-quiet:has-focus-visible:outline-offset-2 not-data-quiet:has-focus-visible:outline-ring";

/** Typed or stepped in `field`, stepped in `row` and `compact`. A press snaps
 *  to the step grid, so $43 goes to $45 and not to $48; a typed figure moves
 *  the value as soon as it is inside the range, and leaving the field puts
 *  anything outside it back on the nearest end — an emptied field goes back
 *  to the lowest. A press is announced with the label, since focus stays on a
 *  button whose name does not carry the figure, or goes to the figure. */
function QuantityStepper({
  label,
  description,
  variant = "field",
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max,
  step = 1,
  format,
  name,
  disabled,
  className,
}: QuantityStepperProps) {
  const id = React.useId();
  const lineId = `${id}-line`;
  const [inner, setInner] = React.useState(defaultValue ?? value ?? min);
  const current = value ?? inner;
  const [said, setSaid] = React.useState("");
  const [quiet, setQuiet] = React.useState(false);
  const set = (next: number) => {
    setInner(next);
    onValueChange?.(next);
  };
  const written = (v: number) => numberFormat(format).format(v);
  const circle = variant !== "field";

  // Between the circles the figure is still Base UI's input, since its press
  // and hold steps off that element and a press puts focus there. Read-only
  // and out of the tab order, it is read and never typed, and a focused
  // text field draws nothing here, so a press shows no ring. Its slot is as
  // wide as the widest figure it can show in tabular digits — as wide as the
  // figure it shows when there is no ceiling — and never under two, so the
  // circles sit close, never move as it counts, and line up down a list.
  const widest = Math.max(2, written(min).length, written(max ?? current).length, written(current).length);
  const input = circle ? (
    <NumberField.Input
      data-slot="quantity-stepper-input"
      readOnly
      tabIndex={-1}
      aria-describedby={variant === "row" && description ? lineId : undefined}
      style={{ width: `${widest}ch` }}
      className="pointer-events-none bg-transparent text-center text-base font-medium text-foreground tabular-nums caret-transparent outline-none select-none disabled:text-muted-foreground md:text-sm"
    />
  ) : (
    <NumberField.Input
      data-slot="quantity-stepper-input"
      // A key or a click into the figure brings the ring back.
      onKeyDown={() => setQuiet(false)}
      onPointerDown={() => setQuiet(false)}
      onBlur={() => setQuiet(false)}
      className={cn(
        "w-full min-w-0 bg-transparent font-medium text-foreground tabular-nums outline-none disabled:text-muted-foreground",
        // 16px under md, so a phone does not zoom the page on focus
        "text-base md:text-sm",
      )}
    />
  );
  const steppers = (
    <>
      <StepButton
        dir="down"
        label={label}
        circle={circle}
        disabled={disabled}
        onPointerDown={circle ? undefined : () => setQuiet(true)}
      />
      {circle ? input : null}
      <StepButton
        dir="up"
        label={label}
        circle={circle}
        disabled={disabled}
        onPointerDown={circle ? undefined : () => setQuiet(true)}
      />
    </>
  );

  return (
    <NumberField.Root
      id={id}
      value={current}
      min={min}
      max={max}
      step={step}
      snapOnStep
      format={format}
      name={name}
      disabled={disabled}
      onValueChange={(next, details) => {
        if (next === null) return;
        // A figure on its way somewhere waits until it is in range.
        if (details.reason === "input-change" && (next < min || (max !== undefined && next > max))) return;
        set(next);
        if (details.reason === "increment-press" || details.reason === "decrement-press") {
          setSaid(`${label}: ${written(next)}`);
        }
      }}
      onValueCommitted={(next) => {
        if (next === null) set(min);
      }}
      data-slot="quantity-stepper"
      data-variant={variant}
      // Relative so the hidden label, the form's hidden input and the
      // announcer are placed inside the stepper: positioned off the page's own
      // box instead, they widen any scroller the stepper stands in, and the
      // page scrolls sideways.
      className={cn("relative", variant === "row" && "flex flex-wrap items-center justify-between gap-x-6 gap-y-3", className)}
    >
      {variant === "field" ? (
        <NumberField.Group
          data-slot="quantity-stepper-group"
          data-quiet={quiet || undefined}
          className={cn(
            "flex items-center justify-between gap-2 rounded-control bg-accent py-2 ps-5 pe-2 transition-colors duration-answer ease-answer has-[input:enabled:hover]:bg-muted",
            ringed,
          )}
        >
          <div className="min-w-0 flex-1">
            <label htmlFor={id} className="block text-sm text-muted-foreground">
              {label}
            </label>
            {input}
          </div>
          <div className="flex shrink-0 items-center gap-0.5 rounded-control bg-card p-0.5">{steppers}</div>
        </NumberField.Group>
      ) : (
        <>
          {variant === "row" ? (
            <div className="min-w-0">
              <label htmlFor={id} className="block text-sm font-medium">
                {label}
              </label>
              {description ? (
                <p id={lineId} className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          ) : (
            <label htmlFor={id} className="sr-only">
              {label}
            </label>
          )}
          <NumberField.Group data-slot="quantity-stepper-group" className="inline-flex shrink-0 items-center gap-2.5">
            {steppers}
          </NumberField.Group>
        </>
      )}
      <span aria-live="polite" className="sr-only">
        {said}
      </span>
    </NumberField.Root>
  );
}

export { QuantityStepper };
