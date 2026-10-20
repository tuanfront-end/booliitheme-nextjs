// Toast — one short notice at a time at the foot of the screen for what a press just did, announced politely, dismissed by its close, a swipe or its own clock.
"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { Alert02Icon, Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// One manager for the whole site, so a toast can be raised from any handler
// without a hook: `toast("Link copied")`. The Toaster draws whatever it holds.
const manager = ToastPrimitive.createToastManager();

// Toasters mounted, oldest first. Only the first one draws, so a Toaster in
// the layout and another on a page never show the same notice twice.
const mounted: number[] = [];
const listeners = new Set<() => void>();
let lastId = 0;
let lastToast = 0;
const changed = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

type ToastOptions = {
  /** A second line under the title. */
  description?: React.ReactNode;
  /** A glyph before the words: a tick for done, a warning for what failed. */
  type?: "success" | "error";
  /** Milliseconds before it clears itself; 0 keeps it until dismissed. */
  timeout?: number;
  /** One action beside the words, an Undo. Pressing it also clears the toast. */
  action?: { label: string; onClick: () => void };
};

/** Shows a notice and returns its id, or null when no Toaster is mounted to
 *  show it, so a caller can say it another way. */
function toast(title: React.ReactNode, { description, type, timeout, action }: ToastOptions = {}) {
  if (mounted.length === 0) return null;
  const id = `toast-${++lastToast}`;
  return manager.add({
    id,
    title,
    description,
    type,
    timeout,
    actionProps: action
      ? {
          children: action.label,
          onClick: () => {
            action.onClick();
            manager.close(id);
          },
        }
      : undefined,
  });
}

/** Mount once, in app/layout.tsx. A second one anywhere stays silent. */
function Toaster() {
  const [id] = React.useState(() => ++lastId);
  React.useEffect(() => {
    mounted.push(id);
    changed();
    return () => {
      mounted.splice(mounted.indexOf(id), 1);
      changed();
    };
  }, [id]);
  const first = React.useSyncExternalStore(subscribe, () => mounted[0], () => undefined);
  if (first !== id) return null;

  // One at a time: a newer notice replaces the one showing rather than
  // stacking over it. Base UI announces each politely and gives the region a
  // landmark F6 reaches.
  return (
    <ToastPrimitive.Provider toastManager={manager} limit={1} timeout={4000}>
      <ToastPrimitive.Portal>
        {/* Centred at the foot, clear of the preset panel in the corner; on a
            phone it stands above that panel's row. */}
        <ToastPrimitive.Viewport
          data-slot="toaster"
          className="fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[60] mx-auto flex w-fit max-w-[calc(100vw-2rem)] flex-col items-center outline-none max-sm:bottom-[calc(5rem+env(safe-area-inset-bottom))]"
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

// Ink, like the tooltip: the interface speaking about what it just did rather
// than a surface of the page. Its controls ring in the page's own colour,
// which is the ink's opposite in both halves.
const CONTROL =
  "relative h-9 shrink-0 rounded-control text-sm font-medium text-background press select-none after:absolute after:-inset-0.5 after:content-[''] hover:bg-background/15 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-background";

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      swipeDirection="down"
      data-slot="toast"
      className="flex w-max max-w-full translate-y-(--toast-swipe-movement-y) items-center gap-3 rounded-lg bg-foreground py-2 ps-4 pe-2 text-background shadow-soft-lg transition-[translate,opacity] duration-spring ease-spring select-none data-limited:hidden data-starting-style:translate-y-6 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer data-ending-style:data-[swipe-direction=down]:translate-y-[calc(var(--toast-swipe-movement-y)+150%)] data-swiping:duration-0"
    >
      {item.type === "success" ? (
        <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      ) : item.type === "error" ? (
        <HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      ) : null}
      <ToastPrimitive.Content className="flex min-w-0 flex-col py-1.5">
        <ToastPrimitive.Title className="text-sm font-medium" />
        <ToastPrimitive.Description className="text-sm break-words" />
      </ToastPrimitive.Content>
      <ToastPrimitive.Action className={`${CONTROL} bg-background/10 px-3`} />
      <ToastPrimitive.Close aria-label="Dismiss" className={`${CONTROL} grid w-9 place-items-center`}>
        <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  ));
}

export { Toaster, toast };
