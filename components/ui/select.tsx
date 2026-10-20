// Select — the one dropdown: a trigger dressed by variant for the ground it stands on, over a list that opens on its value.
"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { cva, type VariantProps } from "class-variance-authority"

import { reach } from "@/components/reach"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

// A value too long for its trigger ends in an ellipsis, so the value is a
// block that truncates. A placeholder reads a step quieter than a value, so
// an empty select never passes for a chosen one. A glyph leading it sits inline on the label's line,
// where preflight's `display: block` would stand it on a line of its own.
function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "min-w-0 flex-1 truncate text-start data-placeholder:text-muted-foreground",
        "[&>svg]:me-2 [&>svg]:inline-block [&>svg]:align-[-0.1875em] [&>svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

// The label of the whole control, above a `field` trigger in a form. Base UI
// wires it to the trigger and focuses the trigger when it is pressed — not
// SelectLabel below, which heads a group inside the open list. Set as the
// TextField's label is, so a select in a row of fields reads as one of them.
function SelectFieldLabel({ className, ...props }: SelectPrimitive.Label.Props) {
  return (
    <SelectPrimitive.Label
      data-slot="select-field-label"
      className={cn(
        "text-sm font-medium text-foreground select-none data-disabled:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// A pill floating on a photograph. Neither soft shadow holds on every frame,
// so its cast is wider and warmer, tinted with the brand's hue rather than
// black — read off --primary with relative colour syntax, so it turns with the
// hue knob. Its lightness and chroma are fixed, the chroma capped at the
// brand's own so the ink brand casts a neutral shadow rather than a brown one. Hovered, the face steps one rung down (`photo-lift`, which the dark
// half holds still) and the cast grows under it.
const photoCast =
  "shadow-[0_1px_3px_oklch(from_var(--primary)_0.27_min(c,0.03)_h/0.14),0_10px_24px_-8px_oklch(from_var(--primary)_0.23_min(c,0.03)_h/0.4)]"
const photoLift =
  "enabled:hover:bg-photo-lift enabled:hover:shadow-[0_2px_6px_oklch(from_var(--primary)_0.27_min(c,0.03)_h/0.18),0_16px_32px_-8px_oklch(from_var(--primary)_0.23_min(c,0.03)_h/0.5)] data-popup-open:bg-photo-lift"

// Where a trigger stands decides how it is dressed, and the dress is a variant
// here — never a class at the call site, which is how one project grows two
// selects. A trigger has no press: the list is anchored to it and would move
// with it. Open, it holds its hover and turns its chevron.
//
//   outline — on the page
//   filled  — a white pill on a tinted panel; it lifts on hover, since a fill
//             step down would land on the panel's own tint
//   photo   — the same pill on a photograph, with its own cast and a
//             near-white focus ring the brand's would sink into
//   bare    — a cell of a bar that draws its own frame, a search bar's
//             "Where": it fills the cell and takes the frame's corners, so its
//             hover fills the cell exactly. The cell's glyph is its `icon`
//   tonal   — the brand's chip tint, for the one select a whole section is
//             read through (the city every count under it is in)
//   tile    — a whole white card that is the trigger, on a tinted panel: its
//             `label` above a 20px value, its `meta` line under it
//
// Every size starts its value 16px in, and the open list lines its rows up
// with that inset — see SelectContent. A value led by a glyph marked
// `data-icon="inline-start"` starts 12px in, the chevron's inset, as a
// Button's leading icon does: a glyph's own whitespace reads as inset. Its
// rows lead with the same glyph and step in by the same 4px — see SelectItem.
// `icon` is the field's own glyph rather than the value's — a search bar
// cell's location pin — drawn here at the TextField's leading size, so no call
// site sets one. It stands before the value, so its list opens below:
// `alignItemWithTrigger={false}` on the SelectContent.
// `field` is the TextField's box, edge and focus included, so a select in a
// form is one of its fields; `lg` is 48px tall, for a select that leads a
// section. At every size the value is a field's: 16px on a phone, where iOS
// zooms into anything smaller, 14px from tablet up. A tile's value is display
// type and holds 20px.
const triggerVariants = cva(
  "group relative flex w-fit items-center justify-between gap-1.5 text-start text-base whitespace-nowrap md:text-sm select-none transition-[background-color,box-shadow,border-color,color] duration-answer ease-answer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:text-muted-foreground data-placeholder:text-muted-foreground aria-invalid:border-transparent aria-invalid:ring-2 aria-invalid:ring-destructive aria-invalid:ring-inset has-data-[icon=inline-start]:ps-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        outline:
          "rounded-control border border-input bg-transparent enabled:hover:bg-accent data-popup-open:bg-accent",
        filled:
          "rounded-control border border-transparent bg-card enabled:hover:shadow-soft data-popup-open:shadow-soft",
        photo: cn(
          "rounded-control border border-transparent bg-card [--ring:var(--fixed-light)]",
          photoCast,
          photoLift
        ),
        bare: "w-full rounded-[inherit] border border-transparent bg-transparent enabled:hover:bg-accent data-popup-open:bg-accent",
        tonal:
          "rounded-control border border-transparent bg-chip enabled:hover:bg-[color-mix(in_oklab,var(--primary)_calc(var(--chip-alpha)+6%),transparent)] data-popup-open:bg-[color-mix(in_oklab,var(--primary)_calc(var(--chip-alpha)+6%),transparent)]",
        tile: "grid w-full grid-cols-[minmax(0,1fr)_auto] content-start gap-x-2 gap-y-1 rounded-lg border border-transparent bg-card text-xl md:text-xl enabled:hover:shadow-soft data-popup-open:shadow-soft *:data-[slot=select-value]:tracking-tight",
      },
      size: {
        sm: cn("h-9 ps-4 pe-3", reach),
        default: "h-10 ps-4 pe-3",
        field: "h-10 ps-4 pe-3",
        lg: "h-12 gap-2 ps-4 pe-4",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        size: "field",
        class:
          "border-transparent bg-card ring-1 ring-input ring-inset enabled:hover:bg-card enabled:not-aria-invalid:not-focus-visible:not-data-popup-open:hover:ring-foreground/25 data-popup-open:bg-card data-popup-open:ring-2 data-popup-open:ring-ring focus-visible:outline-offset-0 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-ring aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-destructive disabled:bg-accent disabled:ring-border",
      },
      // A tile is as tall as its three lines, at any size.
      { variant: "tile", class: "h-auto px-5 py-4 has-data-[icon=inline-start]:ps-5" },
    ],
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

function SelectTrigger({
  className,
  size = "default",
  variant = "outline",
  label,
  meta,
  icon,
  children,
  ...props
}: SelectPrimitive.Trigger.Props &
  VariantProps<typeof triggerVariants> & {
    /** The field's glyph, before the value: what the cell asks, not what
     *  was picked. A glyph per option leads the value inside SelectValue. */
    icon?: IconSvgElement
    /** The trigger's own caption, above the value in a `tile`. Every other
     *  trigger holds its value alone, and its caption heads the open list as
     *  its SelectLabel. */
    label?: React.ReactNode
    /** A `tile`'s line under the value: a count, a note, led by a glyph. */
    meta?: React.ReactNode
  }) {
  const tile = variant === "tile"
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      className={cn(triggerVariants({ variant, size }), className)}
      {...props}
    >
      {tile && label != null && (
        <span data-slot="select-trigger-label" className="col-span-2 text-sm text-muted-foreground">
          {label}
        </span>
      )}
      {icon && (
        <HugeiconsIcon
          icon={icon}
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          data-icon="inline-start"
          className="size-4.5 text-muted-foreground"
        />
      )}
      {children}
      {/* data-popup-open, not data-open: Base UI marks the trigger of an open
          popup with its own attribute, and the group- prefix reads it off the
          trigger this icon sits inside. */}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-answer ease-answer group-data-[variant=tonal]:text-primary-ink group-data-popup-open:rotate-180 motion-reduce:transition-none" />
        }
      />
      {tile && meta != null && (
        <span
          data-slot="select-trigger-meta"
          className="col-span-2 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground [&_svg]:text-primary-ink"
        >
          {meta}
        </span>
      )}
    </SelectPrimitive.Trigger>
  )
}

// Two ways the list opens.
//
//   default — over the trigger, the chosen row on top of it, so the value
//             does not jump when the list opens. Base UI lands the chosen
//             row's text exactly on the trigger's value, so the row's inset
//             decides where the popup's edge lands: 20px (6 of popup, 14 of
//             row) against the trigger's 17 (1 of border, 16 of padding) puts
//             the edge 3px outside the trigger's, and the popup runs 6px wider,
//             so it overhangs both ends by 3px and covers the trigger whole.
//             Nothing stands before the value to move it: a caption heads the
//             list as its SelectLabel. Only a list long enough to fight the
//             viewport opens below, with alignItemWithTrigger={false}.
//   list    — below a tile or a field card, start-aligned and 26rem wide from
//             640px, with roomier rows and eyebrow group labels: the shape of
//             the search's suggestion list, so a select and a search in one
//             row open as one kind of panel.
//
// Never narrower than the trigger, `w-(--anchor-width)`, and never narrower
// than 180px, so a short pill still opens a list its options sit in on one
// line. A list that needs more room takes a wider `min-w-*` here.
const contentVariants = {
  default: "",
  list: "p-2 sm:w-[max(26rem,var(--anchor-width))] max-w-[calc(100vw-2rem)] [&_[data-slot=select-label]]:px-3 [&_[data-slot=select-label]]:pt-2 [&_[data-slot=select-label]]:pb-2 [&_[data-slot=select-label]]:tracking-widest [&_[data-slot=select-label]]:uppercase [&_[data-slot=select-item]]:ps-3",
} as const

function SelectContent({
  className,
  children,
  variant = "default",
  label,
  side = "bottom",
  sideOffset,
  align,
  alignOffset = 0,
  alignItemWithTrigger,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    variant?: keyof typeof contentVariants
    /** The list's accessible name, in the trigger's words: Base UI names the
     *  trigger and leaves the listbox it opens unnamed. */
    label?: string
  }) {
  const list = variant === "list"
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset ?? (list ? 8 : 4)}
        align={align ?? (list ? "start" : "center")}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger ?? !list}
        // the page's own gutter, so a list opened near a phone's edge keeps
        // the margin every other block on it keeps
        collisionPadding={16}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-variant={variant}
          data-align-trigger={alignItemWithTrigger ?? !list}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-45 data-[align-trigger=true]:w-[calc(var(--anchor-width)+6px)] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1.5 no-scrollbar bg-popover text-popover-foreground shadow-soft-lg duration-answer ease-answer data-open:duration-spring data-open:ease-spring data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            contentVariants[variant],
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List aria-label={label}>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

// Every list carries a group and its label — the label is the only place a
// filter that shows a value rather than its field says which question the
// list answers.
function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// Rows are 40px, the reach every other control on the page clears. Two
// additions to what shadcn generates: `indicator` moves the tick to the row's
// leading edge, where a row's glyph would sit, and `trailing` renders outside
// ItemText — anything inside it is cloned into the trigger, so a per-row count
// put there would show up beside the chosen value. A row with its tick at the
// start sets its text 18px deeper, so its list opens below the trigger. A row
// led by a glyph marked `data-icon="inline-start"` starts 4px nearer its edge,
// as the trigger of a glyph-led value does, so the list still covers it evenly.
//
// The highlight is data-highlighted rather than the registry's focus:. Base UI
// keeps DOM focus on the popup and marks the active row with an attribute, so
// a focus: rule here would never paint.
function SelectItem({
  className,
  children,
  indicator = "end",
  trailing,
  ...props
}: SelectPrimitive.Item.Props & {
  indicator?: "start" | "end"
  trailing?: React.ReactNode
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-sm py-2.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        indicator === "start" ? "pe-2 ps-8" : "pe-8 ps-3.5 has-data-[icon=inline-start]:ps-2.5",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute flex size-4 items-center justify-center",
          indicator === "start" ? "inset-s-2" : "inset-e-2"
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      {/* A glyph leading the row sits inline, as it does in SelectValue, so
          a row and the value it becomes start at the same place. */}
      <SelectPrimitive.ItemText className="min-w-0 [&>svg]:me-2 [&>svg]:inline-block [&>svg]:align-[-0.1875em]">
        {children}
      </SelectPrimitive.ItemText>
      {trailing}
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
