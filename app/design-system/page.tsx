import type { Metadata } from "next";

import { Colors } from "@/components/design-system/colors";
import { DosDonts } from "@/components/design-system/dos-donts";
import { Icons } from "@/components/design-system/icons";
import { KitActions } from "@/components/design-system/kit-actions";
import { KitChoice } from "@/components/design-system/kit-choice";
import { KitDates } from "@/components/design-system/kit-dates";
import { KitDisplay } from "@/components/design-system/kit-display";
import { KitFields } from "@/components/design-system/kit-fields";
import { Motion } from "@/components/design-system/motion";
import { PageRoles } from "@/components/design-system/page-roles";
import { DsNav, type NavGroup } from "@/components/design-system/nav";
import { PseudoStates } from "@/components/design-system/pseudo-states";
import { DsGroup, DsSubgroup } from "@/components/design-system/section";
import { Shape } from "@/components/design-system/shape";
import { Signature } from "@/components/design-system/signature";
import { Spacing } from "@/components/design-system/spacing";
import { Typography } from "@/components/design-system/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { pageMeta } from "@/lib/seo";

// The sheet a buyer opens to see what the template is made of. It reads from
// the code the pages run on — the tokens off the stylesheet, every component
// imported from where the pages import it — so nothing here can say one thing
// while the site does another. Out of the search index: it is a reference for
// whoever builds on the template, not a page a visitor lands on.
export const metadata: Metadata = pageMeta({
  title: "Design system",
  description:
    "Every token and component this template is built from, drawn live from the code its pages use.",
  path: "/design-system",
  robots: { index: false, follow: true },
});

const NAV: NavGroup[] = [
  {
    label: "Signature",
    items: [{ id: "signature", label: "Pattern line and the hand" }],
  },
  {
    label: "Foundations",
    items: [
      { id: "colors-ladder", label: "Colour" },
      { id: "typography", label: "Typography" },
      { id: "spacing", label: "Spacing and size" },
      { id: "shape", label: "Radius and depth" },
      { id: "icons", label: "Icons" },
      { id: "motion", label: "Motion" },
    ],
  },
  {
    label: "Components",
    items: [{ id: "page-roles", label: "Page roles" }],
  },
  {
    label: "Actions",
    items: [
      { id: "button", label: "Button" },
      { id: "icon-button", label: "Icon button" },
      { id: "save-toggle", label: "Save toggle" },
      { id: "toggle-button", label: "Toggle button" },
      { id: "share-menu", label: "Share menu" },
      { id: "card-corner", label: "Card corner" },
      { id: "badge", label: "Badge" },
      { id: "tooltip", label: "Tooltip" },
      { id: "toast", label: "Toast" },
    ],
  },
  {
    label: "Fields",
    items: [
      { id: "text-field", label: "Text field" },
      { id: "password-field", label: "Password field" },
      { id: "select", label: "Select" },
      { id: "facet-select", label: "Facet select" },
      { id: "search-field", label: "Search field" },
      { id: "checkbox", label: "Checkbox" },
      { id: "switch", label: "Switch" },
    ],
  },
  {
    label: "Choice and range",
    items: [
      { id: "radio-tiles", label: "Radio tiles" },
      { id: "dot-tabs", label: "Dot tabs" },
      { id: "segmented", label: "Segmented" },
      { id: "filter-rail", label: "Filter rail" },
      { id: "slider", label: "Slider" },
      { id: "range-filter", label: "Range filter" },
      { id: "quantity-stepper", label: "Quantity stepper" },
    ],
  },
  {
    label: "Navigation and display",
    items: [
      { id: "breadcrumb", label: "Breadcrumb" },
      { id: "navigation-menu", label: "Navigation menu" },
      { id: "pagination", label: "Pagination" },
      { id: "carousel-nav", label: "Carousel nav" },
      { id: "story-bars", label: "Story bars" },
      { id: "accordion", label: "Accordion" },
      { id: "dialog", label: "Dialog" },
      { id: "drawer", label: "Drawer" },
      { id: "menu", label: "Menu" },
      { id: "avatar", label: "Avatar" },
      { id: "rating", label: "Rating" },
      { id: "price", label: "Price" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
      { id: "empty-state", label: "Empty state" },
      { id: "link-card", label: "Link card" },
    ],
  },
  {
    label: "Dates and maps",
    items: [
      { id: "calendar", label: "Calendar" },
      { id: "date-picker", label: "Date picker" },
      { id: "slot-picker", label: "Slot picker" },
      { id: "map", label: "Map" },
    ],
  },
  {
    label: "Do's and Don'ts",
    items: [
      { id: "dont-reshape", label: "The kit as it comes" },
      { id: "dont-frame", label: "The pick frame" },
      { id: "dont-brand", label: "Where the brand goes" },
      { id: "dont-lines", label: "Depth from tint" },
    ],
  },
];

export default function DesignSystem() {
  return (
    <main id="content" className="mx-auto w-full max-w-7xl px-6 pt-16 pb-32 sm:px-8 sm:pt-24 sm:pb-40">
      <PseudoStates />
      <header className="max-w-2xl">
        <Eyebrow>Design system</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
          Every part this template is built from
        </h1>
        <Lede className="mt-6 max-w-xl">
          Tokens and components, drawn live from the code the pages run on.
          Switch the mode or the preset in the panel, and the whole sheet
          follows.
        </Lede>
      </header>
      {/* On the page's own column grid, so every block's edge lands on a column
          line: the contents take three columns at lg and two from xl. */}
      <div className="mt-20 lg:column-grid">
        <DsNav groups={NAV} className="lg:col-span-3 xl:col-span-2" />
        <div className="flex flex-col gap-32 lg:col-span-9 xl:col-span-10">
          <DsGroup
            id="signature"
            eyebrow="Signature"
            title="One design, cut for every platform"
            lede="The pattern line is the site's one drawn idea: a tailor's paper pattern, one design cut along a dashed, notched line into each platform it ships on. The ornament hand under it draws every other line and note."
          >
            <Signature />
          </DsGroup>
          <DsGroup
            id="foundations"
            eyebrow="Foundations"
            title="The tokens every page reads"
            lede="Colour, type, space, shape and motion, each written once and read everywhere."
          >
            <Colors />
            <Typography />
            <Spacing />
            <Shape />
            <Icons />
            <Motion />
          </DsGroup>
          <DsGroup
            id="components"
            eyebrow="Components"
            title="Every control the pages draw"
            lede="Each one opens on what it is for and a typical use, then its variants, sizes, states and edge cases. A page takes its controls from here."
          >
            <PageRoles />
            <DsSubgroup id="kit-actions" title="Actions">
              <KitActions />
            </DsSubgroup>
            <DsSubgroup id="kit-fields" title="Fields">
              <KitFields />
            </DsSubgroup>
            <DsSubgroup id="kit-choice" title="Choice and range">
              <KitChoice />
            </DsSubgroup>
            <DsSubgroup id="kit-display" title="Navigation and display">
              <KitDisplay />
            </DsSubgroup>
            <DsSubgroup id="kit-dates" title="Dates and maps">
              <KitDates />
            </DsSubgroup>
          </DsGroup>
          <DsGroup
            id="dos-donts"
            eyebrow="Do's and Don'ts"
            title="Four rules a build breaks most"
            lede="Each pair is drawn with the kit: the house's way, then the version a page drifts into without it."
          >
            <DosDonts />
          </DsGroup>
        </div>
      </div>
    </main>
  );
}
