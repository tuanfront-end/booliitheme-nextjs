"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Dialog, DialogBody, DialogCloseButton, DialogContent } from "@/components/ui/dialog";

// A template opened from the home page, the way Dribbble opens a shot: a sheet
// rising almost to the top while the address changes to the template's own
// page. Closing it — the button, Escape, the scrim — is Back, so the address
// returns to where the visitor was and Forward opens the sheet again. The
// route under @modal renders it; a fresh load of the address gets the page.
export function TemplateSheet({ steps, children }: { steps: ReactNode; children: ReactNode }) {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:-mb-6 sm:h-[calc(100dvh-2.5rem)] sm:max-h-none sm:max-w-none sm:self-end sm:rounded-b-none sm:rounded-t-xl sm:data-starting-style:translate-y-16 sm:data-ending-style:translate-y-16">
        <div className="flex shrink-0 items-center justify-end gap-1 px-4 pt-4 sm:px-6">
          {steps}
          <DialogCloseButton className="ms-2" />
        </div>
        <DialogBody className="pt-6 pb-16 sm:pt-8">{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}
