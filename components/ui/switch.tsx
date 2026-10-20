// Switch — an on/off setting that takes effect the moment it is pressed, sized for a form row or a line of small print.
"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Off is the deepest rung, on is the brand's bright fill. The ink shade read as
// a heavy, dated track, so it is kept for the marks. The fill cannot carry the
// state alone — a light brand, lime or sun, sits near 1.5:1 on a white card —
// so on also draws a tick in the thumb, the mark that clears 3:1, and the
// thumb stays light on its shadow in both themes so its place reads too.
//
// Each state has its own ladder, so the two never race: off darkens a rung on
// hover and another while pressed; on shades what it already is, /80 then /70,
// the primary button's move. It answers to its label's hover whether the label
// wraps it or stands before it, so a settings row lights the switch from
// anywhere on its words — written under `:where()`, so a press on the switch
// itself outranks the hover of the label around it. The track wears the
// control seed and the thumb the seed less the 2px between them, so a squared
// template gets a squared switch.
//
// 40px reach on both sizes, through a pseudo-element: `default` is 24px drawn,
// `sm` 20px beside a line of small print.
const switchVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center rounded-control bg-secondary p-0.5 press after:absolute after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "not-data-disabled:not-data-checked:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_10%)] not-data-disabled:not-data-checked:[:where(label:hover)_&]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_10%)] not-data-disabled:not-data-checked:[:where(label:hover)~&]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_10%)]",
    "not-data-disabled:not-data-checked:active:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_16%)]",
    "data-checked:bg-primary not-data-disabled:data-checked:hover:bg-primary/80 not-data-disabled:data-checked:[:where(label:hover)_&]:bg-primary/80 not-data-disabled:data-checked:[:where(label:hover)~&]:bg-primary/80",
    "not-data-disabled:data-checked:active:bg-primary/70",
    // Locked, the track sinks to the muted rung, and an on one keeps a trace
    // of the brand so a setting that cannot change still says which way it is.
    "data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:data-checked:bg-[color-mix(in_oklab,var(--primary)_35%,var(--muted))]",
  ],
  {
    variants: {
      size: {
        default: "h-6 w-10 after:-inset-2",
        sm: "h-5 w-8 after:-inset-x-2 after:-inset-y-2.5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Light in both themes: the card is near-black in the dark one, and
          // a dark thumb on a dark track would leave its place nothing to
          // show against. Locked, it sinks to the card and loses its lift.
          "group/thumb pointer-events-none grid place-items-center rounded-[calc(var(--radius-control)-2px)] bg-fixed-light text-primary-ink shadow-soft transition-transform duration-spring ease-spring dark:not-data-disabled:text-fixed-dark data-disabled:bg-card data-disabled:text-muted-foreground data-disabled:shadow-none",
          size === "sm"
            ? "size-4 data-checked:translate-x-3 rtl:data-checked:-translate-x-3"
            : "size-5 data-checked:translate-x-4 rtl:data-checked:-translate-x-4",
        )}
      >
        {/* The tick takes the thumb's ink: the brand's on the light thumb, the
            fixed dark one in the dark half, whose brand ink is a light shade;
            locked, the quiet ink on the sunk thumb. */}
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2.5}
          aria-hidden="true"
          className={cn(
            "opacity-0 transition-[opacity,scale] duration-answer ease-answer motion-safe:scale-50",
            "group-data-checked/thumb:opacity-100 group-data-checked/thumb:motion-safe:scale-100",
            size === "sm" ? "size-2.5" : "size-3",
          )}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
