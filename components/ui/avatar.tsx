// Avatar — a person's face at four sizes, their initials on the brand's tint until it loads, a status badge, and a group with a count of the rest.
"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 24 in a dense row, 32 beside a line of text, 40 beside a name and a role, 56
// at the head of a profile card. A face is a circle at every radius setting,
// so `rounded-full` is written by hand here rather than the control seed.
//
// A hairline is drawn over the edge, blended rather than painted, so a
// photograph shot on white still has a rim against a white card and a dark
// one does not grow a grey ring.
const avatarVariants = cva(
  "group/avatar relative inline-flex shrink-0 rounded-full select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
  {
    variants: {
      size: {
        sm: "size-6",
        default: "size-8",
        lg: "size-10",
        xl: "size-14",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

/** Initials while the photograph loads, or for someone who has none: ink of
 *  the brand on the brand's chip tint, set a step under the circle's size. */
function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-chip text-xs font-medium text-primary-ink uppercase",
        "group-data-[size=lg]/avatar:text-sm group-data-[size=xl]/avatar:text-base",
        className,
      )}
      {...props}
    />
  );
}

// A status is a mark and nothing else, so it is drawn in an ink — a hue's
// `-ink` or the brand's — which clears 3:1 against the ring around it where
// the light fill would not. The ring takes the ground the avatar stands on.
const BADGE = {
  brand: "bg-primary-ink text-background",
  online: "bg-leaf-ink",
  away: "bg-sun-ink",
  busy: "bg-coral-ink",
} as const;

/** The dot on the circle's lower corner. `label` names it to a screen reader
 *  ("Online", "Verified host"); without one it is decoration. A glyph inside —
 *  a tick for a verified host — shows from the 40px size up. */
function AvatarBadge({
  tone = "brand",
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof BADGE; label?: string }) {
  return (
    <span
      data-slot="avatar-badge"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "absolute inset-e-0 bottom-0 z-10 grid place-items-center rounded-full ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=default]/avatar:size-2.5 group-data-[size=lg]/avatar:size-3.5 group-data-[size=xl]/avatar:size-4.5",
        "[&>svg]:hidden group-data-[size=lg]/avatar:[&>svg]:block group-data-[size=lg]/avatar:[&>svg]:size-2.5 group-data-[size=xl]/avatar:[&>svg]:block group-data-[size=xl]/avatar:[&>svg]:size-3",
        BADGE[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Faces overlapping in a row, each ringed in the ground so the overlap reads
 *  as a stack rather than as one shape. The overlap grows with the size. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        "has-data-[size=sm]:-space-x-1.5 has-data-[size=lg]:-space-x-2.5 has-data-[size=xl]:-space-x-3.5",
        className,
      )}
      {...props}
    />
  );
}

/** The rest of the group as a number, sized to the faces beside it. A count of
 *  what is there, so it is text: the muted ink on the resting rung. */
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground tabular-nums ring-2 ring-background",
        "group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:text-sm group-has-data-[size=xl]/avatar-group:size-14 group-has-data-[size=xl]/avatar-group:text-base",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
