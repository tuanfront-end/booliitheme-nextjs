// Menu — a list of actions on one thing, opened from a button beside it: items, links, groups under a label, and separators.
"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { eyebrowClass } from "@/components/site/eyebrow";
import { cn } from "@/lib/utils";

// Dressed as the Select's popup is — the same corner, padding, cast and 40px
// rows — so a list that picks a value and a list that does something read as
// one family. The trigger is the caller's: a `Button` handed to `render`, so
// it carries the press, the ring and the size every other button does, and
// stays put when pressed because a popup is anchored to it.
const Menu = MenuPrimitive.Root;
const MenuTrigger = MenuPrimitive.Trigger;

function MenuContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={16}
        className="isolate z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(
            "no-scrollbar max-h-(--available-height) min-w-52 origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-1.5 text-popover-foreground shadow-soft-lg outline-none",
            // Opens on the spring, toward the reader; closes on the answer.
            "transition-[scale,opacity] duration-spring ease-spring data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

// A row is highlighted under the pointer and under the arrow keys alike, and
// the highlight is a whisper. So the row the keyboard is on also takes the
// ring, inset so it stays inside the popup — a fill a step off white is no
// focus indicator on its own. The glyph sits a step back in the muted ink and
// comes forward with the row.
//
// A destructive row stays in ink: the page's colours are the brand and the
// signal colour, and the undo that follows a delete is what makes it safe.
const itemClass =
  "flex min-h-10 cursor-default items-center gap-2.5 rounded-sm px-3 py-2 text-sm select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-foreground [&_svg:not([class*='size-'])]:size-4";

function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item data-slot="menu-item" className={cn(itemClass, className)} {...props} />;
}

/** A row that goes somewhere — "Your trips", "Account". A real link, so it
 *  opens in a new tab on a modified click and is read as one. */
function MenuLinkItem({ className, ...props }: MenuPrimitive.LinkItem.Props) {
  return <MenuPrimitive.LinkItem data-slot="menu-link-item" className={cn(itemClass, className)} {...props} />;
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...props}
    />
  );
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

/** The small heading over a group: the eyebrow, since a menu draws its own. */
function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      className={cn(eyebrowClass, "px-3 pt-2.5 pb-1.5", className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
};
