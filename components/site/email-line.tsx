"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { email } from "@/lib/nav";
import { cn } from "@/lib/utils";

// The studio's address under a dotted rule, the way the references set it, and
// beside it a press that copies it — a visitor with no mail app set up still
// leaves with the address. A refused clipboard falls back to the mail app.
export function EmailLine({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1", className)}>
        <a
          href={`mailto:${email}`}
          className="inline-flex h-10 items-center text-sm font-medium underline decoration-muted-foreground/50 decoration-dotted decoration-2 underline-offset-[6px] press hover:text-muted-foreground focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {email}
        </a>
        <Tooltip>
          <TooltipTrigger render={<IconButton size="sm" aria-label={copied ? "Address copied" : "Copy address"} onClick={copy} />}>
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} strokeWidth={1.5} aria-hidden className="size-4" />
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied" : "Copy address"}</TooltipContent>
        </Tooltip>
        {/* The button's own name changes, which a screen reader does not
            announce unprompted; a polite status line says it. */}
        <span role="status" className="sr-only">
          {copied ? "Address copied" : ""}
        </span>
      </div>
    </TooltipProvider>
  );
}
