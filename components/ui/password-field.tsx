// PasswordField — a masked TextField with Show on its label line and, where a password is being chosen, a four-step strength meter.
"use client";

import { useState } from "react";

import { reach } from "@/components/reach";
import { TextField, type TextFieldProps } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

/** The shortest password the meter will score at all. A form that refuses
 *  shorter ones should refuse on this number, or the meter and the refusal
 *  hold two opinions about one password. */
export const PASSWORD_MIN = 8;

const WORDS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

/** What the four segments read. Length first and character classes second, on
 *  purpose: a long lowercase phrase is a better password than a short one with
 *  a symbol bolted on, and a meter that says otherwise teaches the wrong
 *  lesson. A hint, not a claim about entropy — only a form's own rule
 *  refuses. */
export function passwordStrength(value: string) {
  if (value.length < PASSWORD_MIN) return { score: 0, word: WORDS[0] };
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(value)).length;
  let score = 1;
  if (value.length >= 12) score += 1;
  if (classes >= 2) score += 1;
  if (value.length >= 16 && classes >= 3) score += 1;
  return { score, word: WORDS[score] };
}

export type PasswordFieldProps = Omit<
  TextFieldProps,
  "type" | "action" | "multiline" | "prefix" | "trailing" | "counter" | "children"
> & {
  /** The four segments under the box, on the screen where a password is
   *  chosen. Over a sign-in field a meter would be the page grading a password
   *  it already knows the answer to. */
  meter?: boolean;
};

export function PasswordField({
  meter,
  value,
  defaultValue,
  onValueChange,
  autoComplete,
  hint,
  onKeyUp,
  onBlur,
  ...props
}: PasswordFieldProps) {
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  const [typed, setTyped] = useState(() => String(defaultValue ?? ""));
  const current = value !== undefined ? String(value ?? "") : typed;
  const read = passwordStrength(current);

  return (
    <TextField
      {...props}
      type={shown ? "text" : "password"}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next, details) => {
        setTyped(next);
        onValueChange?.(next, details);
      }}
      autoComplete={autoComplete ?? (meter ? "new-password" : "current-password")}
      autoCapitalize="none"
      spellCheck={false}
      // The one thing a password box can tell a reader that a text box
      // cannot, and the reason half of all failed sign-ins fail. Read off the
      // key event rather than guessed, and dropped on blur: a warning about a
      // field nobody is in is a warning about nothing.
      onKeyUp={(e) => {
        setCaps(e.getModifierState("CapsLock"));
        onKeyUp?.(e);
      }}
      onBlur={(e) => {
        setCaps(false);
        onBlur?.(e);
      }}
      hint={caps ? "Caps Lock is on." : hint}
      // On the label's line rather than inside the box: inside, it would sit
      // on the ring a refused field draws and be carved out of the field's
      // own click target. Up here it is a plain control with its own reach.
      action={
        <button
          type="button"
          data-slot="password-field-toggle"
          disabled={props.disabled}
          onClick={() => setShown((s) => !s)}
          // Pressed with a pointer, focus stays in the box, so the next key
          // still types.
          onPointerDown={(e) => e.preventDefault()}
          className={cn(
            reach,
            "-mx-1.5 rounded-control px-1.5 text-sm font-medium text-muted-foreground press enabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed",
          )}
        >
          {shown ? "Hide" : "Show"}
          <span className="sr-only"> password</span>
        </button>
      }
    >
      {meter && (
        <div data-slot="password-meter" className="flex items-center gap-3">
          {/* Four segments in the brand's ink and nothing else. A meter running
              red to amber to green spends three vivid hues on a hint, so the
              count carries the reading and the word beside it says what the
              count means. Ink rather than the fill, because a light brand is
              a whisper on a white card and a meter has to be read. */}
          <div aria-hidden="true" className="flex flex-1 gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-answer ease-answer",
                  step <= read.score ? "bg-primary-ink" : "bg-muted",
                )}
              />
            ))}
          </div>
          {/* Polite: it changes on every keystroke, and a region that
              interrupts on each one is unusable. */}
          <span aria-live="polite" className="w-20 text-end text-sm text-muted-foreground">
            {current ? read.word : ""}
          </span>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {caps ? "Caps Lock is on" : ""}
      </span>
    </TextField>
  );
}
