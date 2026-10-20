// ref: none — bench · even (the pastel bench: every role at whichever strength the knob holds)
import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  CodeIcon,
  PaintBoardIcon,
  Tick02Icon,
  TranslateIcon,
} from "@hugeicons/core-free-icons";

import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";

// Every class string is written out whole. Tailwind finds utilities by reading
// the source, so `bg-${hue}-surface` would build a page with no pastel on it.
const swatches = [
  { name: "leaf", surface: "bg-leaf-surface", mark: "bg-leaf-mark" },
  { name: "sun", surface: "bg-sun-surface", mark: "bg-sun-mark" },
  { name: "coral", surface: "bg-coral-surface", mark: "bg-coral-mark" },
  { name: "iris", surface: "bg-iris-surface", mark: "bg-iris-mark" },
  { name: "lime", surface: "bg-lime-surface", mark: "bg-lime-mark" },
  { name: "sky", surface: "bg-sky-surface", mark: "bg-sky-mark" },
  { name: "peach", surface: "bg-peach-surface", mark: "bg-peach-mark" },
];

const stats = [
  { value: "4.9", label: "Average rating across 2,300 reviews", soft: "from-coral-soft", mark: "bg-coral-mark" },
  { value: "38k", label: "Learners who finished a course this year", soft: "from-sky-soft", mark: "bg-sky-mark" },
  { value: "120", label: "Courses taught by working designers", soft: "from-iris-soft", mark: "bg-iris-mark" },
  { value: "92%", label: "Of learners finish what they start", soft: "from-peach-soft", mark: "bg-peach-mark" },
];

const categories = [
  { name: "Design", icon: PaintBoardIcon, surface: "bg-iris-surface" },
  { name: "Code", icon: CodeIcon, surface: "bg-sky-surface" },
  { name: "Business", icon: Briefcase01Icon, surface: "bg-sun-surface" },
  { name: "Language", icon: TranslateIcon, surface: "bg-lime-surface" },
];

const plan = [
  "Every course, and every new one",
  "A certificate for each course you finish",
  "Lessons offline on your phone",
  "Cancel in any month",
];

const questions = [
  {
    q: "Can I switch courses halfway?",
    a: "Yes. Your progress stays where you left it, and the course picks up from that lesson whenever you come back.",
  },
  {
    q: "Do certificates expire?",
    a: "No. Each one carries the date you finished and a link anyone can open to check it.",
  },
  {
    q: "Is there a student price?",
    a: "Half price with a school email address, for as long as the address works.",
  },
  {
    q: "What happens if I miss a week?",
    a: "Nothing. Lessons wait for you, and the plan moves the rest of the week forward.",
  },
];

export function PastelShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-8">
        <Eyebrow>
          Soft Pastel
        </Eyebrow>
        <SectionHeading className="mt-4 max-w-2xl text-balance">
          Colour where the page presents, white where people work
        </SectionHeading>
        <Lede className="mt-6 max-w-xl">
          Seven hues with four roles each. The strength switch in the panel
          below moves every surface on this page between its two steps.
        </Lede>

        {/* The raw palette at this strength: the surface fill, with its mark
            step as the dot. The one place on the bench a hue is shown alone. */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map((s) => (
            <div
              key={s.name}
              className={`flex h-28 flex-col justify-between rounded-lg p-4 ${s.surface}`}
            >
              <span aria-hidden className={`size-3 rounded-full ${s.mark}`} />
              <span className="text-sm font-medium">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Three peers, three hues. Each card holds a white panel carrying a
            piece of the product, so chips keep the ground they were measured
            on, and the copy on the pastel is foreground ink alone. */}
        <div className="mt-head grid gap-4 md:grid-cols-3">
          <article className="flex flex-col rounded-lg bg-peach-surface p-3">
            <div className="flex h-44 flex-col justify-center gap-4 rounded-sm bg-card p-5">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Calendar03Icon} className="size-5 text-muted-foreground" />
                <p className="text-sm">
                  <span className="font-medium">Tuesday</span>{" "}
                  <span className="text-muted-foreground">18:00 · Colour theory</span>
                </p>
              </div>
              <span className="w-fit rounded-control bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf-ink">
                Booked
              </span>
            </div>
            <div className="px-3 pt-5 pb-3">
              <h3 className="text-xl font-medium tracking-tight">Plan the week</h3>
              <p className="mt-2 text-base">
                Pick the evenings you can study, and each course fits its
                lessons around them.
              </p>
            </div>
          </article>

          <article className="flex flex-col rounded-lg bg-leaf-surface p-3">
            <div className="flex h-44 flex-col justify-center gap-4 rounded-sm bg-card p-5">
              <p className="text-sm">
                <span className="font-medium">Lesson 4</span>{" "}
                <span className="text-muted-foreground">of 12</span>
              </p>
              <div className="h-2 rounded-control bg-muted">
                <div className="h-2 w-1/3 rounded-control bg-leaf" />
              </div>
            </div>
            <div className="px-3 pt-5 pb-3">
              <h3 className="text-xl font-medium tracking-tight">Practise in short sets</h3>
              <p className="mt-2 text-base">
                Twelve-minute lessons, each ending on an exercise marked the
                moment you send it.
              </p>
            </div>
          </article>

          <article className="flex flex-col rounded-lg bg-coral-surface p-3">
            <div className="flex h-44 flex-col justify-center gap-4 rounded-sm bg-card p-5">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Award01Icon} className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">Colour theory, level 2</p>
              </div>
              <span className="w-fit rounded-control bg-coral/15 px-2.5 py-1 text-xs font-medium text-coral-ink">
                Certificate ready
              </span>
            </div>
            <div className="px-3 pt-5 pb-3">
              <h3 className="text-xl font-medium tracking-tight">Finish with proof</h3>
              <p className="mt-2 text-base">
                A certificate with your name, your hours and a link an employer
                can open to check it.
              </p>
            </div>
          </article>
        </div>

        {/* Gradient tiles: the soft step fading into the page, with a square of
            the mark step in the corner — the pale reference's own move. */}
        <div className="mt-head grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.value}
              className={`relative overflow-hidden rounded-lg bg-linear-to-b to-transparent px-6 pt-8 pb-6 ${s.soft}`}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute top-0 inset-e-0 size-10 ${s.mark}`}
              />
              <p className="text-5xl tracking-tighter tabular-nums">{s.value}</p>
              <p className="mt-10 max-w-48 text-base text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* A band, a white card standing on it, and the page's one brand block.
            The card keeps its fill and lifts with the soft shadow, because on a
            tinted ground there is no rung above white to step to. */}
        <div className="mt-head grid gap-4 lg:grid-cols-5">
          <div className="flex items-center justify-center rounded-lg bg-iris-band p-8 lg:col-span-3">
            <div data-object className="w-full max-w-sm rounded-lg bg-card p-8 shadow-soft">
              <p className="text-sm font-medium">Unlimited</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl tracking-tighter tabular-nums">$29</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Tick02Icon} className="size-4 text-iris-ink" />
                    {line}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full">Start learning</Button>
            </div>
          </div>

          <div className="rounded-lg bg-primary p-8 text-primary-foreground lg:col-span-2">
            <h3 className="text-2xl tracking-tight">Questions, answered</h3>
            <div className="mt-6 divide-y divide-primary-foreground/20">
              {questions.map((item, i) => (
                <details key={item.q} open={i === 0} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                    {item.q}
                    <ChevronDownIcon className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-base">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Pastel tiles a visitor clicks. They lift rather than deepen: the
            next step down is the mark step, which at the stronger strength is
            already past pastel. */}
        <div className="mt-head grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c.name}
              href={`#${c.name.toLowerCase()}`}
              className={`group flex h-40 flex-col justify-between rounded-lg p-6 transition-shadow hover:shadow-soft ${c.surface}`}
            >
              <HugeiconsIcon icon={c.icon} className="size-6" />
              <span className="flex items-center justify-between text-base font-medium">
                {c.name}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
