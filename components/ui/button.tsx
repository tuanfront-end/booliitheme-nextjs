// Button — every call to action and every command on the site: six variants, three heights, and a loading state that keeps its label.
import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The focus ring is full strength: 2px of --ring, 2px off the edge. It is an
// outline rather than a box-shadow ring because the gap an outline leaves is
// transparent, so it shows around a pill on any ground; a shadow ring needs an
// offset colour and paints the page's white around a button on a dark band.
// --ring is the brand's ink, which clears 4.5:1 on the page. The halo shadcn generates,
// ring-ring/50, measured 1.2:1 and was not a ring anyone could see.
//
// The default variant is the primary button, and it wears --action rather
// than the brand's fill. A template decides what its main call to action looks
// like — the fill itself by default, so the button and the chosen states are
// one colour; black; or, under a fill light by nature, a deep shade of the hue
// with white type — and that is one token in globals.css, while every chosen
// state in the kit keeps the bright --primary.
//
// Disabled lowers the ink, not the opacity, so it reads as off in both halves
// instead of letting the page show through. It is written on data-disabled as
// well as :disabled, because a button that stays focusable while disabled
// carries the attribute and not the property. Loading is the exception:
// aria-busy keeps the fill and the ink, since the press landed and the button
// is working rather than refusing.
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap press select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:text-muted-foreground data-disabled:pointer-events-none data-disabled:not-aria-busy:text-muted-foreground aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-action text-action-foreground hover:bg-action-hover disabled:bg-muted data-disabled:not-aria-busy:bg-muted",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // The quietest fill: one rung under the page, for a row of tools that
        // sits on the page's own ground, like the header's discs. It hovers to
        // the muted rung, so the press still answers.
        soft:
          "bg-accent text-foreground hover:bg-muted aria-expanded:bg-muted",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "text-primary-ink underline-offset-4 hover:underline",
      },
      size: {
        // Inline padding is set here, not at the call site: 20px at 40px tall,
        // 24px at 44. Anything wider reads as a button holding its label at
        // arm's length. `sm` is the house's floor, drawn at 36 — a header
        // action, a secondary control — and carried to a 40px target by a
        // pseudo-element the height of a default button (spacing-scale.md
        // § A control is 40px, and never under 36). A template that draws
        // nothing under 40 says so as an override, in its own copy.
        //
        // A leading glyph — an icon, a step disc, an avatar — carries
        // `data-icon="inline-start"`, and the start padding drops a step
        // under the end's: a glyph's own whitespace reads as inset. A round
        // glyph in a pill wants the concentric inset instead, (height −
        // glyph) / 2: `ps-2` for a 20px disc in a 36px pill.
        //
        // No size corrects the corner. --radius-control is bounded by the
        // shortest control on the page, so every size reads the one token.
        //
        // A link draws no box, so it holds no padding: its label lines up
        // with the text of the column it stands in, and it keeps its size's
        // height for the reach — see the compound variant below.
        default:
          "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4",
        sm: "h-9 gap-1 px-4 after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-[''] has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5",
        // The three IconButton draws. 36 is the one drawn under the floor,
        // and a pseudo-element 3px out on every side carries it to 40 on both
        // axes, since a square is short both ways where a pill is short one.
        // 3, not 2: it is placed from inside the 1px border, so 34 + 6.
        icon: "size-10",
        "icon-sm": "size-9 after:absolute after:-inset-[3px] after:content-['']",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        class: "px-0 has-data-[icon=inline-end]:pe-0 has-data-[icon=inline-start]:ps-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Working on a press. A spinner takes the glyph's place, or leads the
     *  label when there is none; the label stays, focus stays on the button,
     *  and further presses are ignored until it clears. */
    loading?: boolean;
  };

const ICON_ONLY = new Set(["icon", "icon-sm", "icon-lg"]);

/** The loading glyph: a faint ring and a quarter of it turning. Sized by the
 *  button it stands in, 1em anywhere else. */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      className={cn("animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.25" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

// The spinner stands where the label's glyph stood, carrying its data-icon so
// the padding that glyph set stays put. A label with no glyph gains one at
// its start: the button grows by a glyph and a gap, and the words never move
// off its start edge.
function withSpinner(children: React.ReactNode) {
  let swapped = false;
  const out = React.Children.map(children, (child) => {
    if (!swapped && React.isValidElement<{ "data-icon"?: string }>(child) && child.props["data-icon"]) {
      swapped = true;
      return <Spinner data-icon={child.props["data-icon"]} />;
    }
    return child;
  });
  return swapped ? out : [<Spinner key="spinner" data-icon="inline-start" />, ...(out ?? [])];
}

function isLink(node: unknown): node is React.ReactElement<Record<string, unknown> & { className?: string }> {
  return (
    React.isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    "href" in node.props
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  loading = false,
  disabled,
  focusableWhenDisabled,
  children,
  ...props
}: ButtonProps) {
  const look = buttonVariants({ variant, size });

  // A link keeps a link's role. Through Base UI's Button it would be given
  // role="button" and Space to press, which tells a screen reader it acts on
  // this page when it goes to another. `<Button render={<Link href />}>` is
  // still the way to write one: the element is dressed and handed back.
  if (isLink(render)) {
    return React.cloneElement(render, {
      "data-slot": "button",
      ...props,
      className: cn(look, render.props.className, typeof className === "string" ? className : undefined),
      children,
    });
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      render={render}
      // Base UI assumes the rendered element is a real <button> and warns when
      // it is not. The flag is derived from what `render` was handed rather
      // than repeated at every call site; passing it explicitly still wins.
      nativeButton={nativeButton ?? (!React.isValidElement(render) || render.type === "button")}
      disabled={disabled || loading}
      // Focus stays on a button that starts loading, so a keyboard user is not
      // dropped to the top of the page while it works.
      focusableWhenDisabled={focusableWhenDisabled || loading}
      aria-busy={loading || undefined}
      className={
        typeof className === "function"
          ? (state) => cn(look, className(state))
          : cn(look, className)
      }
      {...props}
    >
      {loading ? (ICON_ONLY.has(size ?? "default") ? <Spinner /> : withSpinner(children)) : children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, Spinner, type ButtonProps };
