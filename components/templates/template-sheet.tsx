"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

// A template opened from the home page, the way Dribbble opens a shot: a sheet
// rising almost to the top while the address changes to the template's own
// page. Closing it — the button, Escape, the scrim — is Back, so the address
// returns to where the visitor was and Forward opens the sheet again. The
// route under @modal renders it; a fresh load of the address gets the page.
//
// The motion is the dialog's own: the sheet mounts closed and opens a frame
// later, so it has a starting style to rise from, and a close waits for the
// fall to finish before it goes Back. It is mounted by the layout over the
// template route, so walking to the next template keeps it and swaps only the
// page inside — the arrows, the close and the scrolling body.
export function TemplateSheet({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen} onOpenChangeComplete={(isOpen) => !isOpen && router.back()}>
      <DialogContent className="sm:-mb-6 sm:h-[calc(100dvh-2.5rem)] sm:max-h-none sm:max-w-none sm:self-end sm:rounded-b-none sm:rounded-t-xl sm:data-starting-style:translate-y-16 sm:data-ending-style:translate-y-16">
        {children}
      </DialogContent>
    </Dialog>
  );
}
