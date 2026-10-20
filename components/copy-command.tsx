"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { reach } from "@/components/reach";

// A command, and a button that puts it on the clipboard.
//
// The command and the button are one component rather than two because the
// failure path needs both. navigator.clipboard is not reliable — it is absent
// outside a secure context, which is where a template gets opened from a phone
// on the LAN, and its permission can simply be denied. A copy button that
// swallows that is a button that does nothing, which is worse than no button.
// So there are three outcomes and each says which one happened: copied, copied
// the old way, or the text selected for the user to press the key themselves.
export function CopyCommand({ command }: { command: string }) {
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  // Deprecated, and still the one that works when the Clipboard API is denied
  // or missing. It needs a focused selection, so the textarea is real and on
  // the page for the length of the call.
  const legacyCopy = () => {
    const field = document.createElement("textarea");
    field.value = command;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  };

  // Last resort, and not a failure message: the command ends up highlighted, so
  // the user is one keystroke from the same place the button would have got
  // them. Saying "copy failed" instead would be true and useless.
  const selectInstead = () => {
    const node = codeRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    setState("selected");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
      return;
    } catch {
      // Falls through: denied permission and an insecure origin both land here.
    }
    if (legacyCopy()) setState("copied");
    else selectInstead();
  };

  return (
    <div className="mt-4 flex items-center gap-2 rounded-sm bg-muted py-1.5 pe-1.5 ps-4">
      <code ref={codeRef} className="flex-1 font-mono text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        className={`${reach} flex shrink-0 items-center gap-1.5 rounded-control bg-foreground px-4 py-2 text-sm font-medium whitespace-nowrap text-background transition-opacity hover:opacity-90`}
      >
        <HugeiconsIcon
          icon={state === "copied" ? Tick02Icon : Copy01Icon}
          size={14}
          strokeWidth={2.2}
        />
        {state === "copied" ? "Copied" : state === "selected" ? "Selected" : "Copy"}
      </button>
    </div>
  );
}
