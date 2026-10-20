#!/usr/bin/env python3
"""The typography rules, read back out of the markup that ships.

`palette-check.py` reads one file and does arithmetic; it is right or wrong with
no middle. This one reads many files and matches strings, so it is built the
other way round: everything it calls an error is a *token*, present or absent,
and everything that needs to know what a thing is *for* it prints and leaves
alone.

Three kinds of finding, and the split is the point:

    error     a token that cannot be right under any reading — an odd font
              size, a weight above the pair, a `leading-*` override, an arrow
              or a play glyph imported from the wrong family
    census    every size in the file with its lines, always printed, because
              the size budget is per block and per section and no regex knows
              where a block ends
    listed    `font-mono` locations — mono is legal over machine output and
              wrong over chrome, and only a reader can tell which is which

The one counting rule it does enforce is a ceiling far above the budget: the
budget is 3–4 sizes for a section's own copy and 2–3 inside a block, so a
legal section lands at 6 only if its blocks reuse nothing. Past 6 there is no
reading of the rules that passes, and that is the only place counting can be
red without guessing.

The caption rung splits the same way. Counting `text-xs` proves nothing — four
of them in a file is four eyebrows and chips as easily as it is a paragraph set
at 12px — so the ratio against `text-sm` is printed beside the census and left
to a reader. What is red is the one shape no reading rescues: a measure or a
clamp on a 12px element, which is a paragraph wearing a caption's size. The rest
of the type roles are layout — whether a line wraps, whether it sits inside a
product object, whether a mono string is machine text — and `responsive-check.py`
fails them on the rendered page.

Responsive pairs collapse first. `text-5xl sm:text-6xl` is one role wearing two
sizes, and counting it as two makes a careful section score worse than a
careless one.

`--errors` prints the errors alone. The census and the `font-mono` list are the
half that wants a reader, and a page built in batches does not want that reading
five times over — it wants it once, when a section's type looks busy. Nothing
automatic is lost: the ceiling is its own branch and stays red without it.

A House rule over one of these errors — a hero h1 at `font-medium` because the
user wanted the weight — is waived by the error's rule, the words before its
dash: `"type-check: weight comes off from text-3xl up"` in `.soft-neutral.json`
(`_dials.py` § A House rule). A waived error still prints, with its reason.

    python3 .claude/skills/soft-neutral/scripts/type-check.py
    python3 .claude/skills/soft-neutral/scripts/type-check.py --errors
    python3 .claude/skills/soft-neutral/scripts/type-check.py components/home
"""

import re
import sys
from pathlib import Path

# Fork of soft-neutral's type-check for the Paper Hairline house style. The one
# change: a price figure is the page's one 600, so `font-semibold` passes on a
# class string that also carries `tabular-nums` — the marker every figure wears.
# Helpers still come from soft-neutral's scripts folder.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "soft-neutral" / "scripts"))
import _dials  # noqa: E402
from _repo import DEV_CHROME, find_repo  # noqa: E402

REPO = find_repo()

# Named steps, and the ones that count as display. `text-3xl` is 30px, which is
# where a letterform already carries every bit of emphasis it needs and
# `font-medium` starts reading as shouting rather than as importance.
NAMED = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl",
         "5xl", "6xl", "7xl", "8xl", "9xl"]
DISPLAY = {"3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"}

# Arbitrary sizes are allowed above this only, in px only, even only. Below it
# the scale is dense enough that an arbitrary value is a named step plus a
# rounding error; above it the steps run 36 → 48 → 60 and there is no nearer one.
ARB_FLOOR = 36

# The lookbehind keeps the size out of a custom property name: a component that
# re-declares --text-5xl--line-height to swap a face is not writing a size, and
# counting it inflates that file's census by three.
SIZE = re.compile(r"(?<![-\w])(?:([a-z0-9]+):)?text-(" + "|".join(NAMED) + r")\b")
# The trailing group is the `/` line-height modifier in any of its three forms.
ARB = re.compile(
    r"(?:([a-z0-9]+):)?text-\[([^\]]+)\](/(?:\[[^\]]+\]|\([^)]+\)|[\w.-]+))?"
)
LENGTH = re.compile(r"^(\d+(?:\.\d+)?)(px|rem|em|ch|vw|vh|pt|%)$")
# Same lookbehind as SIZE, and for a sharper reason: the opening this file
# grants for a display size is written
# `text-[54px]/[var(--heading-leading-display)]`, and without the guard the
# `leading-` inside that variable name matched as an override — so the script
# failed the one syntax the skill prescribes.
LEADING = re.compile(r"(?<![-\w])(?:[a-z0-9]+:)?leading-[\w\[\]()./-]+")
ARB_TRACKING = re.compile(
    r"(?:[a-z0-9]+:)?tracking-(?:\[[^\]]*\]|\([^)]*\))"
)
OFF_PAIR = re.compile(
    r"\bfont-(semibold|bold|extrabold|black|light|extralight|thin)\b"
)
MONO = re.compile(r"\bfont-mono\b")
THEME_SIZE = re.compile(r"--text-([a-z0-9-]+)\s*:\s*([\d.]+)(px|rem)")

# The glyphs the style hands to Heroicons, read back out of the HugeIcons import
# they should never appear in. Arrows and chevrons carry no carve-out anywhere,
# and neither does the play/pause pair — a transport control swaps one for the
# other, so a mixed pair is invisible in the markup and obvious on the first
# click. `Play` is spelt out rather than left as `Play\w*` because
# `PlayListIcon` and `PlayStoreIcon` are HugeIcons' own and are not transport
# controls. The rating star stays a reading: `icons.md` sends a favourite or a
# "featured" mark to HugeIcons and only the rating to Heroicons, and no regex
# knows which one a `Star*` is.
HUGE_IMPORT = re.compile(
    r'import\s*\{([^}]*)\}\s*from\s*["\']@hugeicons/core-free-icons["\']', re.S
)
HERO_GLYPH = re.compile(
    r"\b(Arrow\w*|Chevron\w*|(?:Play|Pause)(?:Circle|Square)?\d*Icon)\b"
)

CEILING = 6

# `text-xs` is the bottom rung and a caption size — an eyebrow, a chip, a unit,
# a column head. Everything above it pushes down: two ink levels with no opacity
# underneath leave size as the only way to make something quieter, and the
# budget rewards spending few sizes, so the rung a page reaches for when it
# means `text-sm` is this one. Reading it needs the copy, and the ratio is
# printed for that. Under CAPTION_FLOOR even the ratio is noise — an eyebrow
# and a chip in one component is the size doing its job.
CAPTION_FLOOR = 3

# A measure or a clamp says the element holds more than one line of copy, and
# more than one line of copy is not a caption at any density. This is the half
# of the caption rule a regex can own outright: `max-w-32 text-xs` is a
# paragraph set at 12px however few words happen to sit in it today.
MEASURE = re.compile(
    r"(?<![-\w])(?:[a-z0-9]+:)?"
    r"(max-w-(?!(?:none|full|fit|min|max)\b)[\w./\[\]()-]+|line-clamp-\d+)"
)


def strip_comments(src):
    """Comments in these files quote utilities on purpose — the ledger line at
    the top of every section names its reference, and the notes below it argue
    about `bg-card` and `font-medium`. Scanning them would flag the prose that
    explains the rule as a breach of it. Newlines are kept so lines still line
    up with the file."""
    src = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), src,
                 flags=re.S)
    return re.sub(r"(?<!:)//[^\n]*", "", src)


def chunks(src):
    """Every string literal in the file, with its line. A className is one, and
    so is each arm of a `cn()` call and each literal run of a template string —
    which is what makes the checks work per element rather than per file. A
    literal that holds no utilities matches nothing and costs nothing."""
    for m in re.finditer(r'"([^"\n]*)"|\'([^\'\n]*)\'|`([^`]*)`', src, re.S):
        raw = next(g for g in m.groups() if g is not None)
        line = src.count("\n", 0, m.start()) + 1
        for part in re.split(r"\$\{[^}]*\}", raw):
            if part.strip():
                yield line, part


def arbitrary_sizes(chunk):
    """Only the `text-[…]` values that are lengths. `text-[#fff]` and
    `text-[var(--x)]` are colours wearing the same prefix."""
    for m in ARB.finditer(chunk):
        length = LENGTH.match(m.group(2).strip())
        if length:
            yield m, float(length.group(1)), length.group(2), m.group(3)


def sizes_in(chunk):
    """Named sizes as (breakpoint, step), arbitrary ones as (breakpoint, px)."""
    named = [(m.group(1), m.group(2)) for m in SIZE.finditer(chunk)]
    arb = [(m.group(1), f"[{value:g}{unit}]")
           for m, value, unit, _ in arbitrary_sizes(chunk)]
    return named + arb


def check(path):
    src = strip_comments(path.read_text())
    errors, mono, census = [], [], {}
    distinct = set()

    for line, chunk in chunks(src):
        found = sizes_in(chunk)
        base = {step for bp, step in found if not bp}
        # A breakpoint size sitting beside a bare one is the same role at
        # another width. On its own — a size that only ever appears under `md:`
        # — it is a role of its own and counts.
        distinct |= base if base else {step for _, step in found}
        for _, step in found:
            census.setdefault(step, []).append(line)

        for m, value, unit, modifier in arbitrary_sizes(chunk):
            token = m.group(0)
            if unit != "px":
                errors.append((line, token, f"{unit} — arbitrary sizes are px, "
                                            "so evenness is arithmetic"))
            elif value <= ARB_FLOOR:
                errors.append((line, token, f"{value:g}px is at or under the "
                                            "dense end of the scale — use the "
                                            "named step"))
            elif value != int(value) or int(value) % 2:
                errors.append((line, token, f"{value:g}px is not an even "
                                            "number of pixels"))
            if not modifier:
                errors.append((line, token, "no line-height — an arbitrary "
                                            "size inherits 1.5 where the "
                                            "display scale runs 1.0; write "
                                            "/[var(--heading-leading-display)] "
                                            "on a heading or .font-heading, "
                                            "/[var(--leading-display)] on "
                                            "display type that is neither"))

        if any(step == "xs" for _, step in found):
            for m in MEASURE.finditer(chunk):
                errors.append((line, f"text-xs + {m.group(1)}",
                               "a measure or a clamp is more than one line, "
                               "and a caption is one — copy is text-base"))

        if "font-medium" in chunk:
            # An arbitrary size is only display when it is one. Below 36px it
            # is already an error of its own, and calling it display too would
            # report one mistake twice under the wrong name.
            arb_display = {f"[{v:g}{u}]" for _, v, u, _ in arbitrary_sizes(chunk)
                           if u == "px" and v > ARB_FLOOR}
            heavy = [step for _, step in found
                     if step in DISPLAY or step in arb_display]
            if heavy:
                errors.append((line, f"font-medium + text-{heavy[0]}",
                               "weight comes off from text-3xl up — the size "
                               "is the emphasis"))

        for m in LEADING.finditer(chunk):
            errors.append((line, m.group(0), "Tailwind pairs a leading with "
                                             "every named step; the override "
                                             "applies at every breakpoint"))
        for m in ARB_TRACKING.finditer(chunk):
            errors.append((line, m.group(0), "arbitrary tracking — bind it "
                                             "once in globals.css or in a "
                                             "component"))
        for m in OFF_PAIR.finditer(chunk):
            if m.group(1) == "semibold" and "tabular-nums" in chunk:
                continue
            errors.append((line, m.group(0), "outside the face's weight pair"))
        for _ in MONO.finditer(chunk):
            mono.append(line)

    for m in re.finditer(r'from\s+["\']lucide-react["\']', src):
        errors.append((src.count("\n", 0, m.start()) + 1, "lucide-react",
                       "superseded — icons are HugeIcons"))

    for block in HUGE_IMPORT.finditer(src):
        line = src.count("\n", 0, block.start()) + 1
        for m in HERO_GLYPH.finditer(block.group(1)):
            errors.append((line, m.group(1),
                           "arrows, chevrons and play/pause are Heroicons "
                           "24/outline — a second family drawing the same "
                           "shape as the rest of the page"))

    return errors, mono, census, distinct


def check_theme(path):
    """A step added to `@theme` is a font size the project can produce, so it
    answers to the same evenness rule as one written inline."""
    if not path.exists():
        return []
    errors = []
    for m in THEME_SIZE.finditer(path.read_text()):
        px = float(m.group(2)) * (16 if m.group(3) == "rem" else 1)
        if px != int(px) or int(px) % 2:
            errors.append((f"--text-{m.group(1)}", f"{px:g}px is odd"))
    return errors


# A page built to the rules this revision corrects and kept as evidence rather
# than migrated carries the marker itself, exactly as it does for
# `palette-check.py`. An exemption list in here would be a second place to
# forget.
PRE_REVISION = re.compile(r"^//\s*pre-revision:", re.M)
IMPORT = re.compile(r'from\s+["\']@/(components/[\w/.-]+)["\']')


def tree(entry, seen=None):
    """Every project file an entry point pulls in, followed through `@/`
    imports. Extensionless, as TypeScript writes them."""
    seen = seen if seen is not None else set()
    if entry in seen or not entry.exists():
        return seen
    seen.add(entry)
    for m in IMPORT.finditer(entry.read_text()):
        for ext in (".tsx", ".ts"):
            child = REPO / (m.group(1) + ext)
            if child.exists():
                tree(child, seen)
                break
    return seen


def frozen():
    """Files reachable only from pages carrying the marker. A component shared
    with a live page is not frozen — it is shared, and the live page's rules
    still apply to it."""
    marked, live = set(), set()
    for page in sorted((REPO / "app").rglob("page.tsx")):
        (marked if PRE_REVISION.search(page.read_text()) else live).add(page)
    reached = set()
    for page in marked:
        reached |= tree(page)
    kept = set()
    for page in live:
        kept |= tree(page)
    return reached - kept


def sources(argv):
    roots = [Path(a) for a in argv] or [REPO / "components", REPO / "app"]
    files = []
    for root in roots:
        if root.is_file():
            files.append(root)
        else:
            files += [f for f in sorted(root.rglob("*.tsx")) + sorted(root.rglob("*.jsx"))
                      if not any(d in f.resolve().as_posix() for d in DEV_CHROME)]
    return [f for f in files if "node_modules" not in f.parts]


def rule(why):
    """The name a waiver keys an error by: its words before the dash."""
    return why.split(" — ")[0].strip()


def waive(errors, root=None):
    """`errors` split into the ones still red and the ones a House rule waives,
    each of those carrying its reason."""
    red, held = [], []
    for line, token, why in errors:
        house = _dials.waived(root or REPO, "type-check", rule(why))
        (held.append((line, token, why, house)) if house
         else red.append((line, token, why)))
    return red, held


def main(argv, errors_only=False):
    files = sources(argv)
    if not files:
        print("no .tsx under", ", ".join(argv) or "components/, app/")
        return 1

    skip = frozen() if not argv else set()
    failed = 0
    for path in files:
        if path in skip:
            continue
        errors, mono, census, distinct = check(path)
        errors, held = waive(errors)
        over = len(distinct) > CEILING
        captions, body = len(census.get("xs", [])), len(census.get("sm", []))
        caption_heavy = captions >= CAPTION_FLOOR and captions > body
        rel = path.relative_to(REPO) if REPO in path.parents else path

        # The two readings are what --errors drops, so a file carrying
        # nothing else stops being printed at all.
        if not (errors or held or over or (not errors_only and (census or mono))):
            continue

        print(f"\n{rel}")
        for line, token, why in sorted(errors):
            print(f"  ✗ {line:>4}  {token:<28} {why}")
        for line, token, why, house in sorted(held):
            print(f"  · {line:>4}  {token:<28} {why}  (waived: {house})")
        if over:
            print(f"  ✗        {len(distinct)} sizes in one file — over the "
                  f"ceiling of {CEILING}, which no block-and-section budget "
                  f"reaches")

        if census and not errors_only:
            order = {s: i for i, s in enumerate(NAMED)}
            rows = sorted(census.items(),
                          key=lambda kv: order.get(kv[0], len(NAMED)))
            print(f"  · {len(distinct)} sizes:", end="")
            for step, lines in rows:
                seen = sorted(set(lines))
                shown = ", ".join(str(n) for n in seen[:4])
                more = f" +{len(seen) - 4}" if len(seen) > 4 else ""
                print(f"\n      text-{step:<8} ×{len(lines):<3} {shown}{more}",
                      end="")
            print()
        if caption_heavy and not errors_only:
            print(f"  · text-xs ×{captions} against text-sm ×{body} — read the "
                  f"12px lines: a caption is a few words recognised, a meta "
                  f"line text-sm, body copy text-base")
        if mono and not errors_only:
            seen = sorted(set(mono))
            print(f"  · font-mono ×{len(mono)} at {', '.join(map(str, seen))}"
                  f" — legal over machine output, wrong over chrome")

        if errors or over:
            failed += 1

    theme = check_theme(REPO / "app/globals.css")
    for name, why in theme:
        print(f"\napp/globals.css\n  ✗ {name:<33} {why}")

    if skip:
        print(f"\nskipped {len(skip)} files under a `// pre-revision:` page — "
              f"saying so, because silence would read the same as clean")
    print(f"\n{len(files) - len(skip)} files, {failed} with errors")
    return 1 if failed or theme else 0


def selftest():
    ok = "flex text-xs text-4xl sm:text-5xl tracking-tighter"
    bad = ("text-[15px] text-[54px] text-[53px]/[1] text-[3.375rem]/[1] "
           "text-4xl font-medium leading-relaxed tracking-[0.16em] font-bold")

    errors, _, _, distinct = check_src(ok)
    assert errors == [], errors
    assert distinct == {"4xl", "xs"}, distinct   # sm: folded into its base

    errors, _, _, _ = check_src(bad)
    reasons = " ".join(why for _, _, why in errors)
    assert "dense end" in reasons                # text-[15px]
    assert "even" in reasons                     # text-[53px]
    assert "line-height" in reasons              # text-[54px] bare
    assert "px, so evenness" in reasons or "arbitrary sizes are px" in reasons
    assert "emphasis" in reasons                 # font-medium + text-4xl
    assert "every breakpoint" in reasons         # leading-relaxed
    assert "bind it once" in reasons             # tracking-[…]
    assert "weight pair" in reasons              # font-bold

    # The display opening, each face's leading through its own variable.
    for src in ("text-[54px]/[var(--heading-leading-display)]",
                "text-[54px]/[var(--leading-display)]"):
        assert check_src(src)[0] == [], (src, check_src(src)[0])

    # The prose that explains a rule is not a breach of it.
    assert check_src('// font-bold and leading-relaxed are out')[0] == []
    assert check_src('const url = "https://x.dev"')[0] == []

    # The Heroicons exceptions, read out of the import they must not sit in.
    huge = 'import { ArrowRight01Icon, PlayIcon } from "@hugeicons/core-free-icons"'
    names = [tok for _, tok, _ in check_src(huge)[0]]
    assert names == ["ArrowRight01Icon", "PlayIcon"], names
    # HugeIcons' own, and not transport controls or arrows.
    ok_huge = ('import { PlayListIcon, PlayStoreIcon, Star01Icon } '
               'from "@hugeicons/core-free-icons"')
    assert check_src(ok_huge)[0] == [], check_src(ok_huge)[0]
    # Heroicons is where they belong, so the same names are clean there.
    hero = 'import { PlayIcon, ChevronDownIcon } from "@heroicons/react/24/outline"'
    assert check_src(hero)[0] == [], check_src(hero)[0]

    # --errors gates printing, not checking, so it fails quiet in the one
    # direction that matters: a flag silently ignored reads as a flag that
    # works, and every batch keeps paying for the census it asked to drop.
    import io, contextlib, tempfile
    with tempfile.TemporaryDirectory() as tmp:
        d = Path(tmp)
        (d / "clean.tsx").write_text('<p className="text-sm text-4xl" />')
        (d / "broken.tsx").write_text('<p className="text-[15px]" />')

        def run(**kw):
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                code = main([str(d)], **kw)
            return code, out.getvalue()

        full_code, full = run()
        lean_code, lean = run(errors_only=True)

    assert full_code == lean_code == 1          # the flag changes no verdict
    assert "·" in full and "clean.tsx" in full  # census printed, clean file listed
    assert "·" not in lean                      # both readings gone
    assert "clean.tsx" not in lean              # a census-only file drops out
    assert "broken.tsx" in lean and "✗" in lean # the errors survive

    # A measure on a caption is the red half. The eyebrow beside it carries the
    # same size and no measure, and stays clean — the check is per element.
    caption = check_src("max-w-32 text-xs text-muted-foreground")[0]
    assert [why for _, _, why in caption] == [
        "a measure or a clamp is more than one line, and a caption is one — "
        "copy is text-base"
    ], caption
    assert check_src("line-clamp-2 text-xs")[0], "a clamp is copy too"
    assert check_src("text-xs uppercase tracking-widest")[0] == []
    assert check_src("max-w-32 text-sm")[0] == []
    assert check_src("mx-auto max-w-xl text-base")[0] == []
    # `none`, `full` and the intrinsic keywords cap a box, they do not set a
    # measure — a chip that may not outgrow its cell is still a chip.
    assert check_src("max-w-full text-xs")[0] == []
    assert check_src("max-w-fit text-xs")[0] == []

    # The overlay's ruler labels are sized for a 20px ruler: a walk over
    # components/ passes them, and a file named outright is still read.
    with tempfile.TemporaryDirectory() as tmp:
        comp = Path(tmp) / "components"
        for name in ("grid-overlay/overlay-client.tsx", "dev/switch-control.tsx",
                     "site/hero.tsx"):
            (comp / name).parent.mkdir(parents=True, exist_ok=True)
            (comp / name).write_text('<span className="text-[9px] leading-none" />')
        assert [f.name for f in sources([str(comp)])] == ["hero.tsx"]
        ruler = comp / "grid-overlay/overlay-client.tsx"
        assert sources([str(ruler)]) == [ruler]

    # The ratio is the reading half: printed, never a verdict, and dropped by
    # --errors with the rest of what wants a reader.
    with tempfile.TemporaryDirectory() as tmp:
        d = Path(tmp)
        (d / "heavy.tsx").write_text(
            '<p className="text-xs" /><p className="text-xs" />'
            '<p className="text-xs" /><p className="text-sm" />')
        (d / "quiet.tsx").write_text(
            '<p className="text-xs" /><p className="text-xs" />')

        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            ratio_code = main([str(d)])
        full_report = out.getvalue()
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            main([str(d)], errors_only=True)
        lean_report = out.getvalue()

    assert ratio_code == 0                        # a reading fails nothing
    assert "text-xs ×3 against text-sm ×1" in full_report
    assert "against text-sm" not in lean_report   # --errors drops the reading
    assert "×2 against" not in full_report        # under the floor, no reading

    # A House rule waives an error by its rule; the rest of the file stays red.
    import json, tempfile
    heavy = [e for e in errors if e[2].startswith("weight comes off")]
    assert heavy, errors
    with tempfile.TemporaryDirectory() as t:
        (Path(t) / _dials.FILE).write_text(json.dumps({"waive": {
            "type-check: weight comes off from text-3xl up": "House rule 1"}}))
        red, held = waive(errors, Path(t))
        assert [h[3] for h in held] == ["House rule 1"] * len(heavy), held
        assert len(red) == len(errors) - len(heavy) and red
    assert waive(errors, Path("/nonexistent"))[1] == [], "no file waives nothing"

    print(f"selftest ok — {len(errors)} findings on the fixture, "
          f"{len(NAMED)} named steps, ceiling {CEILING}")


def check_src(src):
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".tsx", delete=False) as fh:
        raw = "//" in src or "http" in src or src.startswith("import ")
        fh.write(src if raw else f'export const x = <p className="{src}" />')
        tmp = Path(fh.name)
    try:
        return check(tmp)
    finally:
        tmp.unlink()


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        selftest()
    else:
        sys.exit(main([a for a in sys.argv[1:] if not a.startswith("-")],
                      "--errors" in sys.argv))
