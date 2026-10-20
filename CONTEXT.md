# BooliiTheme — context

The vocabulary this project uses about itself. Where a word here disagrees with
a word in a skill document, this file is the one that is current.

## The product

**Template** — one product, in its own repo, sold as a unit. It is stood up by
`create-next-app` and the scaffold in the skills repo, and owns its copy of the
style from that moment: bending the style to its niche is the point, not a
fault in it. Nothing built here travels back on its own.

**Page set** — the pages a template ships. Five are the floor — home, about, a
listing, a detail and a contact — plus a 404. Anything above the floor is the
niche's business and is decided in the brief. Sold-ness is measured against the
floor, so a template short of it is not finished, whatever its home page looks
like.

**Ship check** — the machine-readable half of done, run before a template is
packaged: `npm run check`, which is `eslint` and the build followed by the
shared checkers in `.claude/skills/soft-neutral/scripts/` and the house style's
own forks in `.claude/skills/paper-hairline/scripts/`. The script is the list;
nothing here keeps a second copy of it. Distinct from a **section check**, which
reads one section the moment it is built, and from an **audit**, which reads one
section or page once it is approved.

**Section check** — the machines' read of a section the moment it is built,
run by its builder, and the builder's look at the shots they leave at
1280 × 720, 390 and 320: anything past its frame, cut, out of line or out of step
with the sections beside it, a hover or a focus missing, a copy rule broken.
Every red row is fixed before the user sees the section. No second agent reads
it, which is what separates it from an **audit**.
_Avoid_: quick audit, pre-audit

**Page builder** — the subagent that builds a page's sections one after
another, in page order: every version 1, then the extra versions. Each section
reuses what the ones above it made; the builder runs its **section check**,
commits it and writes its entry in the **build log**. Every five sections, or
once its context has been compacted, it hands off to a fresh page builder. The
session that dispatched it owns the page, the brief, the kit and the audits.
One runs at a time.
_Avoid_: section builder (the one-section agent it replaced), worker

**Build log** — `brief.md` § Build log for a page: one entry per section as
the page builder commits it — each component made, with one line on what it
is for, what it reused, and the choices a later section has to agree with. A
fresh page builder carries on from it, `ls components/` and the page's shots.
_Avoid_: progress notes, hand-over notes

**Approved** — kept by the user: the shell at stop 2, the version of each home
section they chose at stop 3, the home's colour at stop 4, and a later page when they
name it — "chốt trang A", "audit trang A". Moving on to another page approves
nothing, since several pages are built at once in sessions of their own.
Nothing is audited before it is approved, because what the user changes would
otherwise be read twice.
_Avoid_: done, final

**Audit** — the read an approved section or page gets from a second agent
rather than its builder. A **section audit** reads one section's screen faults
— overflow, breakage, misalignment, overlap, sideways scroll — and a checklist
of what no machine reads yet; a **page audit** reads every section's words,
each section laid beside its reference, what shows between sections and the
flows through the page. No fault is two auditors' to find, and pressing every
control is the machines'. It reads what a person checks by eye and by hand; a
screen reader's whole account of a page and the product's figures across pages
are the **survey**'s. The auditor reports and the builder fixes, because the
builder is the one holding the brief. The standard it reads against is the **quality
floor** — the half of done only a reader can run — and the copy rules; the
audit owns the method and points at the standard.

**Static section** — a section whose controls only lead somewhere else: links,
and buttons that open another page. **Interactive section** — one holding a
control that changes something on the page: a tab, a filter, a slider, a
carousel, a toggle, a form, a search. The machines press each of its controls
through every state, and the page audit reads the words of each state.
The machines tell the two apart, from what a press changed.

**Survey** — the hardening skill's read of a finished template before release,
one domain at a time: bundle, images, SEO, accessibility, runtime. It sorts
what it finds into bugs and hardening, after the build rather than inside it,
which is what separates it from an **audit**.

**Upstream fix** — a correction found while building a template that is wrong in
the skills repo too, and is therefore worth carrying back. It travels as an
issue on `tuanfront-end/claude-build-template-skills`, never as a merge: no file
here has a counterpart there to merge along. Told apart from this template's
signature by the signature test in `template` § Upstream fixes — the style being
wrong is upstream, the style being unsuited to this one product is not.

## The palette

**House style** — the visual language this template is built in:
**paper-hairline**, a local style in `.claude/skills/paper-hairline/`
(`docs/adr/0001`). It replaces Soft Neutral here; where a skill says
soft-neutral, it means this.
_Avoid_: theme

**Paper** — the page's one ground, `#ffffff` light and a warm near-black dark,
and the ground of every card and panel on it. Surfaces do not separate by fill.
_Avoid_: near-white, ladder, rung

**Hairline** — the 1px `--border` line that draws all structure: a panel's
outline, the dividers between its cells, a frame around a photograph. Distinct
from a **shadow**, which only things that float or press carry.

**Cell** — the one quiet fill, `bg-muted`: an illustration's cell, a skeleton
card, a hovered row. Small by rule.

**Joined panel** — items that belong together drawn as one outlined box whose
cells share dividers: four plans, six features, a figure beside a grid. The
opposite of a row of separate cards.

**Mark** — a small use of the brand hue that says one thing: an eyebrow's dot
and label, a feature icon, a data figure, the chosen cell's wash, the focus
ring. The brand is only ever a mark, never a fill.

**Floor** — the 4.5:1 contrast minimum for text, 3:1 from 24px and for a state
shown by a mark alone.

**Showcase surface** — a surface the page uses to *tell* the visitor something:
a feature cell, a testimonial, a stat, a pricing tier, a call to action.

**Working surface** — a surface inside a *task* the visitor is doing: searching,
filtering, comparing, choosing, filling in, paying. Its marks belong to state —
selected, invalid, sold out.

## Sections and references

**Container** — the column a section's content is laid out in, and the width a
band is drawn at: 1280px at most, with the gutter inside it.

**Gutter** — the space between the container's edge and its content, on each
side: 24px, then 32px from `sm`.
_Avoid_: margin, page padding

**Column grid** — the columns inside the container that a section's content
spans: 4 below `md`, 8 from `md`, 12 from `lg`, stretching with the page.
_Avoid_: layout grid, 12-col grid

**Column gap** — the space between two columns of the column grid: 16px at 4
columns, 24px at 8, 32px at 12. Distinct from the gutter, which is outside the
first and last column.
_Avoid_: gutter (Figma's word for it)

**Span** — how many columns of the column grid a block takes, and the unit a
build's proportion is chosen in: `5+7`, not `38/62`. A **shape**'s proportion
stays a percentage, because it describes the reference image, not the build.
Rows of peers are spanned at their outer edges only; inside the row they keep
their own gap.
_Avoid_: ratio, percentage width (for a build)

**Offset** — an empty column left on purpose between two spans, the grid's way
of adding air without a made-up px value.

**Ruler** — the px scale along the top and left edge of the viewport that guides
are dragged out of.

**Guide** — a single horizontal or vertical line at a px position, dragged out
of a ruler: a point the design has to line up with, saved per route.
_Avoid_: guideline, snap line

**Reference** — a layout screenshot in `design-refs/`, chosen from its row and
then **opened**. The row narrows the field; the image settles the design.

**Primary reference** — the reference a section takes its one skeleton from:
the grid, the proportions, the rhythm. Every shape rule reads it, and a
section's versions differ by it.

**Donor** — a second reference that gives a section exactly one **take**: an
item's anatomy, matched on Holds, or a surface treatment — the ground, the
depth, how tiles are filled. Two at most, on the hero, the listing card's
section, a signature section, or one no single reference fits. A region of a
donor's layout is never a take: that is a second skeleton.

**Shape** — the geometry of a section as built: kind, proportion, where the mass
sits. Capped at four uses per page and never twice in a row.

**Holds** — what a reference can carry: count and kind of items, what sits inside
one item, and whether the count can change. The part that matches a reference to
a section's content.

**Spent** — a reference file already used by a section on this page. Spent-once
is per page; the ledger resets on the next one.

**Picture** — what the picture rule counts: a photograph, gradient art, or a
screenshot at real size, drawn large enough to be seen as one. Distinct from an
**ornament**, which is texture rather than an image. Three sections is the
most a page that sells lets go by without a picture, two on a template being sold — and *large
enough* rises with it, from 5% of a screenful to 12%.

**Marketplace floors** — the three the `"marketplace"` flag swaps in: a
saturated moment every four sections rather than one per page, two bare
sections in a row rather than three, and 12% of a screenful before a picture
counts as large. They exist because every other floor in this
style was set for a product somebody uses, and a template is bought off a grid
of thumbnails in about two seconds.

**App screen** — a route that is a tool rather than a page that sells: a
dashboard, a checkout, a door scanner, a map listing. Named under `appRoutes` in
`.soft-neutral.json`. The picture rule, the saturated moments and the photograph
do not bind on it; it is judged as a tool. _Avoid_: tool page, dashboard.

**Accent colour** — the seven names Soft Neutral spends on peers (`--leaf`,
`--sun`, …). Kept declared so the kit's class strings still resolve; in this
template they all read the ink, except `--leaf`, which is the brand. Peers are
told apart by icon and label here.
_Avoid_: accent, on its own

**Signal colour** — the brand, spent as the one colour a product gives a meaning
of its own (a verified badge, a tick, a progress bar). Named `"signal": "leaf"`
in `.soft-neutral.json`, and `--leaf` is the brand.

**Ornament** — one of the five kinds paper-hairline draws on a section: line
art, a skeleton mock, a ground texture, a data dial, a fading rail. One a
section at most, drawn in the template's **ornament hand**, `aria-hidden`
unless it carries data.
_Avoid_: mark, drawn mark

**Ornament hand** — the stroke, cap, corner and colour roles every ornament of
this template is drawn in, settled with the shell and written under
`DESIGN.md`'s `## ornaments`.
_Avoid_: style, brush

**Ambient ornament** — an ornament that does not hold still: already moving when its section
arrives on screen, still moving after it leaves. A highlight travelling along a
drawn line, a chart growing from its axis and starting again, a shader panel
behind a heading — three tiers, and the cheapest is an ornament the page already
draws given a clock. A stroke that draws itself once on arrival is **not** one:
it is a reveal, and it spends nothing from the dial.
Recorded in its section's `// ambient:` line — a third ledger beside `// ref:`
and `// ornament:`, needed because an ambient ornament has no file in `design-refs/` to
cite: it names a package, or `own`. Drawn only when the user asks for one, and
capped by the **motion** dial, which a template for sale sets to 3 and a page
built to be looked at leaves at 0.
Distinct from a hover, which answers the pointer, and from a
`<Reveal>`, which fires once — anything that starts *because* the reader
arrived is scroll work and is banned.

**Shot** — a reference that is finished UI with ornaments already on it, in
`design-refs/_drawn-ui-shots/`. Indexed by **Host**, then **Key**, then ornament,
and drawn at random within that filter, because reading an index top to bottom
means the first rows always win.

**Host** — the kind of element an object sits on in the picture: a card, a
band, a gauge, a ground. It is the first filter, and an object is rebuilt on its
own Host or on the one equivalent the style allows.

**Key** — how light the ground under that object is: `light`, `dark` or `both`.
A dark section takes a dark shot, because the colours in a shot were chosen
against the ground it was drawn on.

**Worth** — what a shot is *for*, as against what is in it. Two readings of each
shot, in `design-refs/_drawn-ui-shots/_describe.md`, read before the inventory.

**Recipe** — a reference that is the construction of one object, drawn as
stages with the steps handwritten on it, in `design-refs/_recipes/`. Indexed by
what it **makes**, and chosen deterministically rather than shuffled: it is
reached when the object about to be drawn has more than one layer. Its
handwritten labels and arrows are the author's own pen and are not an ornament the
design carries.

**Photograph** — a real image file, as against a picture the build drew for
itself. The one kind of picture a build cannot produce, and therefore the one it
skips. Every page carries at least one, an app screen aside. `page-check.py`
fails a page that does not, because the alternative — deciding a page ships with no photography — is a
person's decision and not a build's.

**Departure** — a build that differs from its reference in **structure**: an
item count changed, a slot added or dropped, the geometry replaced — a donor's
take is never one. Decided before the section is built, and written as the
word that opens the trailing parenthetical of its `// ref:` line. What the style
always supplies — palette, radius, density, copy — is never a departure, because
it was never the reference's to give.

**Imagery is not on that list, and used to be.** The style supplies the
*treatment* of a picture: the frame, the crop, what floats on it. Whether the
section carries one at all is the reference's, so taking one out is a departure
like any other. While imagery sat in that list, dropping every photograph from
a page read as the style doing its job.

**Drift** — the same gap, found late: at the section's **audit**, in a section
nobody decided to change. Its default is to be fixed. Drift kept on
purpose stops being drift — the `// ref:` line is rewritten and it becomes a
departure. The two are told apart by *when the decision was made*, never by how
large the gap is.

**Ledger** — the record of which primary reference and donors each section
came from, at what shape, and whether it departed — kept in the components' own
`// ref:` lines and read back by script, never by hand. What it says about departure is a reading,
not a rule: a page that followed every reference and a page that departed from
every one are both allowed, and both worth looking at.

## Type

**Row** — the three numbers a typeface brings with it: its weight **pair**, its
tracking offset and its minimum leading. Kept one per face in the setup notes'
per-face table and bound in `globals.css`, so that a rule elsewhere can stay
relational and a component can name a role rather than a number. Swapping a face
is its import and its row. A page carries two rows at once, one per half of the
**pairing**.

**Pair** — the two weights a face is set in, body and emphasis. 400/500 on most
faces; Manrope, Instrument Sans, Plus Jakarta Sans and Fraunces read thin at the
same number and take 500/600, and Instrument Serif has one weight in the file so
both halves are 400. Three faces sit off the hundreds entirely — Cabinet Grotesk
at 525/625, Chillax at 500/550, Erode at 550/650 — because they are variable
files where the round step nearby measured wrong, not because the number is
untidy. The emphasis half is the ceiling — the style has two weights, and which
two is the face's business.

**Pairing** — the two *faces* a page is set in: the **heading face**
(Instrument Serif) on `h1`, `h2` and `.font-heading`, the **body face**
(Instrument Sans) everywhere else, `h3`–`h6` included. A preset swaps the
heading face only.

**Section heading** — the heading that opens a section: 36px on a phone, 44px
from `sm`, 48px from `lg`, in the serif at 400. The hero's display line is not
one, and sits a step above it at every width.

**Body copy** — anything read through: a sentence, a description, a title over
it, the claim over a stat. **14px**, the one reading size, ranked by weight and
ink rather than by size. The lede under a section heading is the one line at
16px.

**Product object** — a thing the product sells or keeps, shown as one unit: a
course or tutor card, a listing, a pricing tier, a booking, a table row — or
filled in, as a form. The text inside it is that thing's data. Independent of
**showcase** and **working surface**: a pricing tier is both a showcase surface
and a product object, and takes its colour from the first and its type from the
second. Distinct from a tile carrying part of the section's case — a feature, a
testimonial, a stat — whose copy is **body copy**.

**Meta line** — a short fact about one item, read in passing but read: the
school on a course card, "340 graduates hired", the role under a quoted name,
the fine print under a call to action. 14px. Told apart from a **caption** by
whether anybody reads it rather than recognises it.

**Caption** — a few words naming something the reader is already looking at,
recognised rather than read: an eyebrow, a chip or badge, an axis tick or a
legend, a unit, a label heading a value the way a column head does. The only
role set at 12px, and set in the body face. A line that wraps, or has a verb in
it, has stopped being one — and a form field's label never was: it is read
before anything is typed, so it is 14px, in sentence case.

**Machine text** — text a machine produced and a reader checks character by
character: a timestamp, an ID, a hash, a URL, a path, a line of code. The one
kind of text set in mono; anywhere else mono is a costume. A price, a count or a
percentage is not one — somebody chose it, and it lines up with tabular figures
instead.

## Controls

**Reach** — the hit area behind a control, held at 40px while the control itself
is drawn at 36px. The two are separate numbers; collapsing them into one is what
inflates a page. Carried by a pseudo-element rather than by padding, which would
move the drawn edge.

**Large height** — 44px, and the top end of control sizing rather than a step on
it. One control on a page is drawn there, its **call to action**; every other
control is drawn at 36 and reaches 40. A page that draws them all at 44 has a
plateau rather than a peak, and that is the inflation the split undoes.

**Pre-revision** — a page built to the rules this revision corrects and kept as
evidence rather than migrated. It says so in a `// pre-revision:` line of its
own, and `palette-check.py` skips its tree for the per-page rules and reports
that it skipped it. The marker lives in the page because an exemption list in
the script would be a second place to forget.

**Soft shadow** — the project's two shadow tokens. `shadow-soft` is a hairline
ring and the faintest lift, for the secondary button and a pressable chip;
`shadow-soft-lg` adds a float for menus, popovers and dialogs. A panel or a card
carries neither.

## The bench

**`/lab`** — the route where a rule is tested before it is written down. A type
specimen and four sections; thirty faces on the heading half and fifteen
on the body half, ten pairings, three grounds, all switchable. Every finding in the style's current
revision was made by changing one of those controls and looking at the same
component again.

**`/bench`** — the route where the *build process* would be tested rather than
a rule: one page carried end to end through the brief, the shuffle, the ledger
and the per-page rules. `/lab` answers *does this rule hold*; `/bench` would
answer *does the process survive a page*, and four sections cannot reach the
per-page caps, so the first is not evidence for the second. **It does not exist
yet** — ADR 0002 in the skills repo is what is waiting on it. Named here because
a word with no referent is worse found in a build than in a glossary.
