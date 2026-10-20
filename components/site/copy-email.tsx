"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

// The studio's address, and a press that puts it on the clipboard. The
// Clipboard API is missing outside a secure context and can be denied, so a
// refusal falls back to opening the mail app rather than doing nothing. The
// glyph turning to a tick is the confirmation; a toast would take focus away
// from the row when it is dismissed.
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
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
    <Button variant="ghost" onClick={copy} className={className}>
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} strokeWidth={1.5} data-icon="inline-start" />
      {email}
      <span className="sr-only">{copied ? "(copied)" : "(copy to clipboard)"}</span>
    </Button>
  );
}
