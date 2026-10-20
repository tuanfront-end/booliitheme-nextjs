import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DsState = "rest" | "hover" | "active" | "focus" | "disabled" | "loading" | "error";

const LABEL: Record<DsState, string> = {
  rest: "Rest",
  hover: "Hover",
  active: "Pressed",
  focus: "Focus",
  disabled: "Disabled",
  loading: "Loading",
  error: "Error",
};

// A control in every state it has, side by side, the way a component set is
// laid out in a design file. Hover, pressed and focus are painted at rest by
// <PseudoStates />, which copies the stylesheet's own rules under
// `data-preview`; disabled, loading and error are the component's own props,
// so `render` receives the state and passes it on. The control is the first
// child of each cell, which is what a rule written on the state alone targets.
export function StateGrid({
  states = ["rest", "hover", "active", "focus", "disabled"],
  rows,
  className,
}: {
  states?: DsState[];
  rows: { label: string; render: (state: DsState) => ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-x-0 border-spacing-y-4 text-start">
        <thead>
          <tr>
            <th scope="col" className="w-36 pe-4 text-start text-xs font-normal text-muted-foreground">
              <span className="sr-only">Variant</span>
            </th>
            {states.map((s) => (
              <th key={s} scope="col" className="pe-6 text-start text-xs font-normal text-muted-foreground">
                {LABEL[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="pe-4 text-start align-middle text-sm font-normal">
                {row.label}
              </th>
              {states.map((s) => (
                <td key={s} className="pe-6 align-middle">
                  {/* Relative, so whatever a control places off its own box —
                      a hidden label, an announcer — is placed inside the
                      scroller and never widens the page behind it. */}
                  <div
                    data-preview={["hover", "active", "focus"].includes(s) ? s : undefined}
                    className="relative inline-flex"
                  >
                    {row.render(s)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
