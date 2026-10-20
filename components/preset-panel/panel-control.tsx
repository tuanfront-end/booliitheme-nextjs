"use client";

import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { type CSSProperties, type ReactNode, useState, useSyncExternalStore } from "react";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUILD_SLOT, building, subscribeBuild } from "./build-slot";
import { savePreset } from "./save-preset";
import { DIRECTIONS, NAME, ORIGINAL, STORAGE_KEY, type Direction, type Saved } from "./saved";

const PANEL = "preset-panel";
type Attr = "preset" | "color";
type Options = { presets: string[]; colors: string[]; original: CSSProperties };

const never = () => () => {};
const label = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

// Every preset and color app/globals.css defines, found by reading the
// stylesheets for `[data-preset="…"]` and `[data-color="…"]`. Adding one is a
// CSS block and nothing else: the panel lists it the next time it opens.
function defined(attr: Attr): string[] {
  const found = new Set<string>();
  const pattern = new RegExp(`\\[data-${attr}="([a-z0-9-]+)"\\]`, "g");
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        for (const match of rule.selectorText.matchAll(pattern)) found.add(match[1]);
      }
      if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // A stylesheet from another origin, which cannot hold these blocks.
    }
  }
  found.delete(ORIGINAL);
  return [ORIGINAL, ...found];
}

// Original is the template with no preset set, so showing it while another one
// is applied means taking the attribute off <html>, reading it, and putting it
// back: one synchronous style pass, with nothing painted in between. Original
// does not change while the page is open, so this runs once.
function originalLook(): CSSProperties {
  const html = document.documentElement;
  const was = html.getAttribute("data-preset");
  html.removeAttribute("data-preset");
  const style = getComputedStyle(html);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const look = {
    "--font-heading": read("--font-heading") || read("--font-sans"),
    "--heading-weight-normal": read("--heading-weight-normal"),
    "--radius": read("--radius"),
    "--radius-control": read("--radius-control"),
  } as CSSProperties;
  if (was !== null) html.setAttribute("data-preset", was);
  return look;
}

// A template not yet written to read both ways carries no `dir`, and the
// panel leaves direction out of everything it saves.
function current(): Saved {
  const { dataset, dir } = document.documentElement;
  const now: Saved = { preset: dataset.preset ?? ORIGINAL, color: dataset.color ?? ORIGINAL };
  if (dir) now.direction = dir === "rtl" ? "rtl" : "ltr";
  return now;
}

function paint(next: Saved) {
  const html = document.documentElement;
  for (const attr of ["preset", "color"] as const) {
    const value = next[attr];
    if (value === ORIGINAL || !NAME.test(value)) html.removeAttribute(`data-${attr}`);
    else html.setAttribute(`data-${attr}`, value);
  }
  if (next.direction) html.dir = next.direction;
}

export function PanelControl({
  saved,
  store,
  children,
}: {
  saved: Saved;
  // Where a pick is kept: preset.json in development, the visitor's browser on
  // the live demo.
  store: "file" | "browser";
  children?: ReactNode;
}) {
  const [picked, setPicked] = useState<Saved>(saved);
  const [options, setOptions] = useState<Options | null>(null);
  const locked = useSyncExternalStore(subscribeBuild, building, () => false);
  const mounted = useSyncExternalStore(never, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  // The stylesheets are read when the panel first opens rather than on load,
  // and <html> is read every time, since it is what the page is showing.
  const open = () => {
    if (!options) {
      setOptions({ presets: defined("preset"), colors: defined("color"), original: originalLook() });
    }
    setPicked(current());
  };

  const keep = (next: Saved) => {
    setPicked(next);
    paint(next);
    if (store === "file") {
      savePreset(next).catch(() => {});
      return;
    }
    try {
      if (next.preset === ORIGINAL && next.color === ORIGINAL && next.direction !== "rtl")
        localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked, as it can be inside the marketplace's preview frame:
      // the pick still holds for as long as the page is open.
    }
  };

  // From <html> rather than from state: paint() writes it at once, so two picks
  // made before a render still build on each other.
  const choose = (attr: Attr, id: string) => keep({ ...current(), [attr]: id });
  const turn = (direction: Direction) => keep({ ...current(), direction });
  // Reset puts back the template as it was designed, and that reads left to
  // right.
  const reset = () =>
    keep({ preset: ORIGINAL, color: ORIGINAL, ...(saved.direction && { direction: "ltr" as const }) });
  const untouched =
    picked.preset === ORIGINAL && picked.color === ORIGINAL && picked.direction !== "rtl";

  return (
    <>
      {/* The corner is the control seed plus the padding, so the group stays
          concentric with the buttons inside it at every preset. A page that
          pins its own bar to the bottom of a phone screen marks it
          data-bottom-bar, and the group moves up to clear it. */}
      <div
        data-preset-panel
        className={cn(
          // physical: the corner Next's dev indicator leaves free, in either direction
          "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex items-center gap-1",
          // A hairline ring under the shadow lifts the white group off a white page.
          "rounded-[calc(var(--radius-control)+0.25rem)] bg-popover p-1 shadow-soft-lg ring-1 ring-border ring-inset",
          // physical: the same corner from sm
          "sm:right-6 sm:bottom-6 [html:has([data-bottom-bar])_&]:max-sm:bottom-24",
          // On a phone the group is a 44px round icon button, so it covers as
          // little of the page's foot as it can: a 2px rim around the 40px
          // button, which keeps the whole tap floor.
          "max-sm:rounded-full max-sm:p-0.5",
        )}
      >
        {children}
        <Button
          variant="ghost"
          popoverTarget={PANEL}
          onClick={open}
          // Folded on a phone it is a 40px disc, not a control with a corner,
          // so it stays round whatever the Radius knob says.
          className="max-sm:rounded-full max-sm:size-10 max-sm:px-0!"
        >
          <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={1.5} data-icon="inline-start" className="size-5" />
          <span className="max-sm:sr-only">Customize</span>
        </Button>
      </div>

      {/* Native popover: light dismiss, Escape and the top layer come with it,
          and the page stays live underneath, so every pick is seen on the page
          it changes. inset-auto first, because the browser's own [popover]
          rule centres it with `inset: 0; margin: auto`. */}
      <div
        id={PANEL}
        popover="auto"
        role="dialog"
        aria-labelledby="preset-panel-title"
        data-preset-panel
        className={cn(
          "fixed inset-auto m-0 overflow-y-auto border-0 bg-popover p-5 text-popover-foreground shadow-soft-lg",
          // physical: above its button, in the same corner
          "right-6 bottom-24 max-h-[min(40rem,calc(100svh-8rem))] w-[22rem] rounded-lg",
          "max-sm:inset-x-3 max-sm:bottom-3 max-sm:max-h-[60svh] max-sm:w-auto",
          "translate-y-2 opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-answer ease-answer",
          "open:translate-y-0 open:opacity-100 starting:open:translate-y-2 starting:open:opacity-0 motion-reduce:transition-none",
        )}
      >
        {/* The Switch renders into this while a template is being built, and
            it stays empty and hidden in every template that has shipped. */}
        <div id={BUILD_SLOT} className="mb-6 border-b pb-6 empty:hidden" />

        <div className="flex items-center justify-between gap-4">
          <p id="preset-panel-title" className="text-base font-medium">
            Presets
          </p>
          <Button variant="ghost" size="sm" disabled={untouched} onClick={reset}>
            Reset
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Everything here ships with the template.</p>

        <div className="mt-6 flex flex-col gap-6">
          <Row label="Mode">
            <Segmented options={["light", "dark"] as const} value={mode} onPick={setTheme} name={label} />
          </Row>

          {/* Only on a template written to read both ways — preset.json says
              so by carrying `direction`. */}
          {saved.direction && (
            <Row label="Direction">
              <Segmented
                options={DIRECTIONS}
                value={picked.direction ?? "ltr"}
                onPick={turn}
                name={(d) => d.toUpperCase()}
              />
            </Row>
          )}

          {/* Outside the fieldset, so the reason reads at full ink while the
              rows it explains are dimmed. */}
          {locked && (
            <p className="-mb-3 text-sm text-muted-foreground">
              Unlocks at the harvest, when the look above becomes Original.
            </p>
          )}
          <fieldset disabled={locked} className="flex min-w-0 flex-col gap-6 disabled:opacity-50">

            {/* Each swatch wears its own data-color, so the block that colors
                the page colors the swatch too, in whichever mode is showing. */}
            <Row label="Color" value={label(picked.color)}>
              <div className="flex flex-wrap gap-1">
                {options?.colors.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={label(id)}
                    aria-pressed={picked.color === id}
                    onClick={() => choose("color", id)}
                    className="grid size-10 place-items-center rounded-full hover:bg-muted"
                  >
                    <span
                      data-color={id}
                      className={cn(
                        "size-7 rounded-full bg-primary",
                        picked.color === id && "ring-2 ring-foreground ring-offset-2 ring-offset-popover",
                      )}
                    />
                  </button>
                ))}
              </div>
            </Row>

            {/* Each tile wears its own data-preset for the same reason: the Aa
                is set in that preset's heading face, the tile's corner is its
                container radius, and the small bar is its control. Original has
                no block to wear, so it carries the values read off <html>. */}
            <Row label="Preset" value={label(picked.preset)}>
              <div className="grid grid-cols-2 gap-2">
                {options?.presets.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={picked.preset === id}
                    onClick={() => choose("preset", id)}
                    data-preset={id === ORIGINAL ? undefined : id}
                    style={id === ORIGINAL ? options.original : undefined}
                    className={cn(
                      "press flex h-24 flex-col justify-between rounded-lg p-3 text-start",
                      picked.preset === id ? "bg-card ring-2 ring-foreground" : "bg-accent hover:bg-muted",
                    )}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span aria-hidden className="font-heading text-2xl">
                        Aa
                      </span>
                      <span aria-hidden className="mt-1 h-4 w-8 rounded-control border border-foreground/40" />
                    </span>
                    <span className="text-sm">{label(id)}</span>
                  </button>
                ))}
              </div>
            </Row>
          </fieldset>
        </div>

        {/* The sheet every pick above can be read on at once: every token and
            every control, drawn from the code the pages use. */}
        <Link
          href="/design-system"
          className={cn(
            reach,
            "mt-6 flex items-center justify-between gap-2 rounded-control text-sm font-medium transition-colors hover:text-primary-ink",
          )}
        >
          Design system: every token and component
          <ArrowRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {store === "file" ? "Saved to preset.json" : "Preview only, saved in this browser"}
          </p>
          <details className="group mt-2">
            <summary
              className={cn(
                reach,
                "flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden",
              )}
            >
              Keep or remove this panel
              <ChevronDownIcon aria-hidden className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>Shows while you run the site locally and on the live demo. Production builds leave it out.</li>
              <li>
                Locally, each pick is saved to <code className="font-mono">preset.json</code>, and your build ships
                with it.
              </li>
              <li>
                To remove it, delete <code className="font-mono">components/preset-panel</code> and the lines in{" "}
                <code className="font-mono">app/layout.tsx</code> that name it. The saved look stays.
              </li>
            </ul>
          </details>
        </div>
      </div>
    </>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onPick,
  name,
}: {
  options: readonly T[];
  value: T;
  onPick: (option: T) => void;
  name: (option: T) => string;
}) {
  return (
    <div className="flex rounded-[calc(var(--radius-control)+0.25rem)] bg-muted p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onPick(option)}
          className={cn(
            "press h-9 flex-1 rounded-control text-sm",
            value === option
              ? "bg-card font-medium text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {name(option)}
        </button>
      ))}
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
        {label}
        {value && <span className="text-foreground">{value}</span>}
      </p>
      {children}
    </div>
  );
}
