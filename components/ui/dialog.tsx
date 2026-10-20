// Dialog — a panel a visitor opens on purpose over the page: a sheet rising from the foot of a phone, centred from `sm`, with a header, a scrolling body and a footer.
"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

// The full filter set, a comparison, a booking's details — opened on purpose,
// with the page left inert behind a light scrim. On a phone it rises from the
// foot of the screen, where a thumb already is; from `sm` it sits in the middle
// of the page. One component for both, so the two never drift apart in radius,
// scrim or close control.
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-backdrop"
        className="fixed inset-0 z-50 min-h-dvh bg-black/10 transition-opacity duration-sheet ease-sheet supports-backdrop-filter:backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
      />
      <DialogPrimitive.Viewport
        data-slot="dialog-viewport"
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      >
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            // A floating surface: the popover rung and its cast, no border.
            // The sheet squares its bottom corners where it meets the edge of
            // the screen, and stops short of the top so the page still shows
            // behind it.
            "relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-t-xl bg-popover text-popover-foreground shadow-soft-lg outline-none",
            "sm:max-h-[min(54rem,calc(100dvh-3rem))] sm:max-w-lg sm:rounded-lg",
            "transition-[translate,opacity] duration-sheet ease-sheet motion-reduce:transition-none",
            "data-starting-style:translate-y-10 data-starting-style:opacity-0 data-ending-style:translate-y-10 data-ending-style:opacity-0",
            "sm:data-starting-style:translate-y-3 sm:data-ending-style:translate-y-3",
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

/** The title row: the title and its line under it, the close control at the
 *  end. A hairline under it, because the body below scrolls. */
function DialogHeader({
  className,
  children,
  closeLabel = "Close",
  ...props
}: React.ComponentProps<"div"> & { closeLabel?: string }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5 sm:px-8", className)}
      {...props}
    >
      {/* 6px down, so the title's line sits level with the 36px close. */}
      <div className="flex min-w-0 flex-col gap-1 pt-1.5">{children}</div>
      <DialogCloseButton label={closeLabel} />
    </div>
  );
}

/** The part that scrolls. Its bar is hidden: inside a rounded panel it lands a
 *  few pixels in from the corner and is the most visible scrollbar on the
 *  page. */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8", className)}
      {...props}
    />
  );
}

/** The actions, at the end of the row. A tertiary action that belongs at the
 *  start — "Clear all" — takes `me-auto`. On a phone the row clears the home
 *  indicator. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-4",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** The dismiss control every panel carries: an icon on the control seed,
 *  36px drawn and 40px reached, resting on a rung and darkening one step when
 *  pointed at. */
function DialogCloseButton({ className, label = "Close" }: { className?: string; label?: string }) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      aria-label={label}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center rounded-control bg-muted text-foreground press hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "after:absolute after:-inset-0.5 after:content-['']",
        className,
      )}
    >
      <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" className="size-4" />
    </DialogPrimitive.Close>
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
