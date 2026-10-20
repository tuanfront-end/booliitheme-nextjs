import type { ReactNode } from "react";
import saved from "@/preset.json";
import { PanelControl } from "./panel-control";
import { NAME, STORAGE_KEY, type Saved } from "./saved";

// The preset panel: a button in the bottom-right corner that opens the mode,
// the brand color and the preset this template ships with.
//
// It shows while you run `npm run dev` and on the live demo, which is built
// with NEXT_PUBLIC_DEMO=1. A production build of your own site leaves it out,
// so there is nothing to remove before you deploy. To remove it for good,
// delete this folder and the lines in app/layout.tsx that name it — the look it
// saved to preset.json stays.
// preset.json as the panel reads it: its direction, when it has one, narrowed
// to the two the panel can set.
const look = saved as { preset: string; color: string; direction?: string };
const initial: Saved = {
  preset: look.preset,
  color: look.color,
  ...(look.direction !== undefined && { direction: look.direction === "rtl" ? "rtl" : "ltr" }),
};

const DEVELOPMENT = process.env.NODE_ENV === "development";
const DEMO = !DEVELOPMENT && process.env.NEXT_PUBLIC_DEMO === "1";

// `children` is the lead segment of the button: the live demo's buy link,
// which packaging removes. Your copy renders the panel button on its own.
export function PresetPanel({ children }: { children?: ReactNode }) {
  if (!DEVELOPMENT && !DEMO) return null;
  return (
    <PanelControl saved={initial} store={DEVELOPMENT ? "file" : "browser"}>
      {children}
    </PanelControl>
  );
}

// On the live demo a visitor's picks are kept in their browser, and this puts
// them back on <html> before the first paint, so a reload does not flash the
// original look first. In development the picks are in preset.json, which the
// server already rendered, so there is nothing to restore.
export function PresetScript() {
  if (!DEMO) return null;
  const restore = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null"),h=document.documentElement,n=${NAME};if(s){["preset","color"].forEach(function(k){var v=s[k];if(typeof v!=="string"||!n.test(v))return;v==="original"?h.removeAttribute("data-"+k):h.setAttribute("data-"+k,v)});if(h.hasAttribute("dir")&&(s.direction==="ltr"||s.direction==="rtl"))h.dir=s.direction}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: restore }} />;
}
