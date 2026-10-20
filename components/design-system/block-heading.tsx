"use client";

import { createContext, use, type ReactNode } from "react";

// A block's title sits one level under whatever opens it: an h3 straight under
// a part, an h4 under a run's heading. The run says so once, through context,
// so a kit's blocks are written the same wherever they are mounted.
const Level = createContext<"h3" | "h4">("h3");

export function NestedBlocks({ children }: { children: ReactNode }) {
  return <Level value="h4">{children}</Level>;
}

export function BlockHeading({ id, children }: { id: string; children: ReactNode }) {
  const className = "text-xl font-medium tracking-tight";
  return use(Level) === "h4" ? (
    <h4 id={id} className={className}>
      {children}
    </h4>
  ) : (
    <h3 id={id} className={className}>
      {children}
    </h3>
  );
}
