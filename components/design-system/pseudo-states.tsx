"use client";

import { useEffect } from "react";

// The catalog draws a control's hover, pressed and focus states side by side,
// and a browser paints those only while a pointer or a key is on the element.
// So every rule that waits on one is copied once, here, keyed to an attribute:
// inside `data-preview="hover"`, a `hover:` class paints at rest. The copy is
// added to this page alone; the rules the site runs on are left as they are.
const STATES = [
  ["hover", ":hover"],
  ["active", ":active"],
  ["focus", ":focus-visible"],
] as const;

// A selector list split at its own commas, never at one inside `:not(a, b)`.
function parts(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      out.push(list.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(list.slice(start).trim());
  return out;
}

// A rule written on the state alone — `:focus-visible { outline: … }` — means
// the control, which is the first child of a preview tile.
function target(state: string, part: string, pseudo: string): string {
  // The pseudo-class as a selector, never inside an escaped class name
  // (`.has-\[input\:hover\]`), and an argument that would be left empty —
  // `:has(:focus-visible)` — keeps a universal selector in its place.
  const bare = pseudo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rest = part
    .replace(new RegExp(`\\(${bare}\\)`, "g"), "(*)")
    .replace(new RegExp(`(?<!\\\\)${bare}(?![\\w-])`, "g"), "")
    .trim();
  const scope = `[data-preview~="${state}"]`;
  return rest === "" || rest === "*" ? `${scope} > :first-child` : `${scope} ${rest}`;
}

function wrap(rule: CSSRule, inner: string): string {
  if (rule instanceof CSSLayerBlockRule) return `@layer ${rule.name} { ${inner} }`;
  if (rule instanceof CSSMediaRule) return `@media ${rule.conditionText} { ${inner} }`;
  if (rule instanceof CSSSupportsRule) return `@supports ${rule.conditionText} { ${inner} }`;
  return inner;
}

function copies(rules: CSSRuleList, parents: CSSRule[], out: string[]) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      for (const [state, pseudo] of STATES) {
        const hit = parts(rule.selectorText).filter((p) =>
          new RegExp(`(?<!\\\\)${pseudo}(?![\\w-])`).test(p),
        );
        if (!hit.length) continue;
        const selector = hit.map((p) => target(state, p, pseudo)).join(", ");
        const text = `${selector} { ${rule.style.cssText} }`;
        out.push(parents.reduceRight((inner, p) => wrap(p, inner), text));
      }
    } else if ("cssRules" in rule) {
      copies((rule as CSSGroupingRule).cssRules, [...parents, rule], out);
    }
  }
}

export function PseudoStates() {
  useEffect(() => {
    if (document.getElementById("pseudo-states")) return;
    const out: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        copies(sheet.cssRules, [], out);
      } catch {
        // a stylesheet from another origin cannot be read, and holds no control
      }
    }
    const style = document.createElement("style");
    style.id = "pseudo-states";
    document.head.append(style);
    // One rule at a time: a copy the parser refuses — a selector that only
    // made sense with its pseudo-class — drops alone instead of taking the
    // rest of the sheet with it.
    for (const text of out) {
      try {
        style.sheet?.insertRule(text, style.sheet.cssRules.length);
      } catch {
        // skipped
      }
    }
  }, []);
  return null;
}
