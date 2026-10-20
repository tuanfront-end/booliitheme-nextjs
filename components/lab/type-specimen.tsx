// ref: none — n/a (a bench specimen, not a section: it exists so the heading
// face and the body face can be judged against each other at every size the
// style actually sets, and it never ships)

import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeading } from "@/components/site/section-heading";

// One block per decision the pair has to survive. The sizes are the style's
// own type roles — display at text-6xl, the section heading's three widths, a
// tile's 20 over 16, a product object's 18 / 14 / 12 — so what is being read
// here is the row, not a poster.
export function TypeSpecimen() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow>
            Type specimen
          </Eyebrow>
          <h1 className="max-w-[16ch] text-5xl tracking-tighter sm:text-6xl">
            Two faces, one page, and the seam between them
          </h1>
          <p className="max-w-[62ch] text-base text-muted-foreground">
            The heading is set in the heading face and carries no weight
            utility; everything under it is the body face at its own pair. If
            the two disagree about width, x-height or warmth, the disagreement
            shows up in this gap.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {/* Also the wrap test: at 48 in half a row it turns a line, and the
                display leading in the row is a minimum the only way to see
                bind is a heading that actually wraps. */}
            <SectionHeading>A section heading at 30, 36 and 48</SectionHeading>
            <p className="text-base text-muted-foreground">
              Body copy runs here at the size the style sets it, which is the
              only size long-form text is allowed to take. Read three lines of
              it: a face that looks handsome at 60px can still be tiring at 16,
              and the second line is where that turns up.
            </p>
            <p className="text-base">
              <span className="font-medium">Thursday</span>
              <span className="text-muted-foreground">
                {" "}
                · the emphasis step of the body face, beside its normal one
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border bg-card p-8">
            <h3 className="text-xl font-medium tracking-tight">
              A tile head at 20
            </h3>
            <p className="text-base text-muted-foreground">
              Under text-3xl a heading keeps its emphasis step, so this line is
              the heading face at its medium — the one place a display face has
              to behave like an interface face.
            </p>
            <p className="text-base tabular-nums">
              <span className="font-medium">1,284</span>
              <span className="text-muted-foreground"> lessons · </span>
              <span className="font-medium">4.9</span>
              <span className="text-muted-foreground"> average · </span>
              <span className="font-medium">$38</span>
              <span className="text-muted-foreground">/hour</span>
            </p>
          </div>
        </div>

        {/* The bottom of the scale, where a pair shows its x-heights: a
            product object's data at 14 under its title at 18, a meta line, and
            a caption at 12 — each on the line it is allowed. */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { chip: "Beginner", title: "Colour for screens", meta: "Northwind School · 6 weeks" },
            { chip: "Bestseller", title: "Type that holds a page", meta: "Aldine Studio · 4 weeks" },
            { chip: "New", title: "Grids without the grid", meta: "Northwind School · 3 weeks" },
          ].map((course) => (
            <article
              key={course.title}
              data-object
              className="flex flex-col gap-3 rounded-lg border bg-card p-6"
            >
              <span className="w-fit rounded-control bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {course.chip}
              </span>
              <h3 className="text-lg font-medium tracking-tight">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground">{course.meta}</p>
              <p className="text-sm tabular-nums">
                <span className="font-medium">24</span>
                <span className="text-muted-foreground"> lessons · </span>
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground"> from 312 reviews</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
