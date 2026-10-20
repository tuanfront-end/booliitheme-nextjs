// NavigationMenu — the header's mega menu: a trigger in the bar opening a panel of grouped links, with the keyboard model of a site nav rather than of a menu.
"use client";

import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { eyebrowClass } from "@/components/site/eyebrow";
import { cn } from "@/lib/utils";

// Dressed as Menu's popup is — the container corner, the popover cast with no
// ring of its own, rows on `rounded-sm` that take `bg-accent` under the pointer
// — so the header's two kinds of popup read as one family. The panel opens on
// the spring and closes on the answer; moving between triggers resizes it on
// the sheet curve rather than snapping.
function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props & Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex max-w-max flex-1 items-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, ...props }: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />;
}

// A ghost button in the bar: 40px, the control seed, the muted fill on hover
// and while its panel is open — the open state is the hover's resting look, so
// it keeps that rung rather than darkening further.
const navigationMenuTriggerStyle =
  "inline-flex h-10 w-max items-center justify-center gap-1 rounded-control px-4 text-sm font-medium text-foreground press hover:bg-muted active:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-popup-open:bg-muted";

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle, "group/trigger", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-transform duration-answer ease-answer group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-2 transition-opacity duration-answer ease-answer data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 10,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={16}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-sheet ease-sheet data-instant:transition-none motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow-soft-lg outline-none transition-[opacity,scale,width,height] duration-spring ease-spring data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

// A row in the panel. The ring sits inside it, as Menu's rows do, so the
// keyboard's place is drawn within the popup's edge.
function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex min-h-10 items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-foreground transition-colors duration-answer ease-answer hover:bg-accent active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-active:bg-accent [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** The small heading over one column of the panel. */
function NavigationMenuLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="navigation-menu-label" className={cn(eyebrowClass, "px-3 pt-2 pb-2", className)} {...props} />;
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
};
