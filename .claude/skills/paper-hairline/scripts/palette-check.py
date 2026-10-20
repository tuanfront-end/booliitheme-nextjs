#!/usr/bin/env python3
"""The Paper Hairline palette, measured in both halves.

Replaces soft-neutral's palette-check for this house style. That script
measures a tinted surface ladder and seven accent colours; this style has
neither. It has paper, two inks, the hairline, one brand hue spent in marks,
and no gradient grounds — so it asks five things:

    inks        every text token clears 4.5:1 on every ground it may sit on
    marks       the brand and the focus ring clear 3:1 on paper
    action      the primary button's label clears 4.5:1 on both ends of its
                gradient
    hairline    the border is visible on paper (reported, never failed: a
                hairline is decoration)
    grounds     no class string in app/ or components/ paints a gradient —
                `bg-linear-*`, `bg-radial-*`, `bg-conic-*`; the button's own
                gradient lives in `btn-ink`, not in a class

Colour maths and the var() chains come from soft-neutral's `_color.py`.

    python3 palette-check.py             # the gate
    python3 palette-check.py --selftest
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "soft-neutral" / "scripts"))
import _color  # noqa: E402
from _repo import find_repo  # noqa: E402

DECL = re.compile(r"(--[\w-]+)\s*:\s*([^;]+);")
GRADIENT = re.compile(r"(?<![\w-])(?:[a-z0-9-]+:)*bg-(?:linear|radial|conic|gradient)-[\w\[\]()./%-]+")
# Scaffolding that never ships: the build switch and the bench.
SKIP = ("components/dev/", "components/lab/", "app/lab/")

INKS = ("--foreground", "--muted-foreground")
GROUNDS = ("--background", "--card", "--popover", "--muted", "--accent", "--secondary", "--brand-wash")
BRAND_TEXT_GROUNDS = ("--background", "--card", "--brand-wash")


def blocks(css: str, selector: str) -> dict:
    """Every declaration in top-level `selector { … }` blocks, later wins."""
    out: dict = {}
    for m in re.finditer(r"(?m)^" + re.escape(selector) + r"\s*\{", css):
        depth, i = 1, m.end()
        while depth and i < len(css):
            depth += {"{": 1, "}": -1}.get(css[i], 0)
            i += 1
        body = re.sub(r"/\*.*?\*/", "", css[m.end():i - 1], flags=re.S)
        body = re.sub(r"@variant[^{]*\{[^}]*\}", "", body)
        out.update({k[2:]: v.strip() for k, v in DECL.findall(body)})
    return out


def measure(tokens: dict, half: str) -> tuple[list, list]:
    rgb = lambda name: _color.parse(f"var({name})", tokens)  # noqa: E731
    fails, notes = [], []

    def need(fg, bg, floor, what):
        a, b = rgb(fg), rgb(bg)
        if a is None or b is None:
            fails.append(f"{half}: {fg} on {bg} — unreadable value")
            return
        r = _color.contrast(a, b)
        (fails if r < floor else notes).append(f"{half}: {what} {fg} on {bg} {r:.2f} (floor {floor})")

    for ink in INKS:
        for g in GROUNDS:
            need(ink, g, 4.5, "ink")
    for g in BRAND_TEXT_GROUNDS:
        need("--brand-ink", g, 4.5, "brand text")
    for g in ("--background", "--card"):
        need("--brand", g, 3.0, "mark")
        need("--ring", g, 3.0, "focus")
    need("--primary-foreground", "--primary", 4.5, "action")
    need("--primary-foreground", "--primary-top", 4.5, "action")
    need("--destructive", "--background", 4.5, "error")
    a, b = rgb("--border"), rgb("--background")
    if a and b:
        notes.append(f"{half}: hairline --border on --background {_color.contrast(a, b):.2f}")
    return fails, notes


def gradients(repo: Path) -> list:
    found = []
    for base in ("app", "components"):
        for f in sorted((repo / base).rglob("*.tsx")):
            rel = f.relative_to(repo).as_posix()
            if rel.startswith(SKIP):
                continue
            for n, line in enumerate(f.read_text().splitlines(), 1):
                for m in GRADIENT.finditer(line):
                    found.append(f"{rel}:{n} {m.group(0)}")
    return found


def run(repo: Path) -> int:
    css = (repo / "app" / "globals.css").read_text()
    light = blocks(css, ":root")
    dark = dict(light, **blocks(css, ".dark"))
    fails, notes = [], []
    for half, tokens in (("light", light), ("dark", dark)):
        f, n = measure(tokens, half)
        fails += f
        notes += n
    grounds = gradients(repo)
    print("PAPER HAIRLINE PALETTE\n" + "-" * 60)
    for line in fails:
        print("  ✗ " + line)
    for line in grounds:
        print("  ✗ a gradient ground — " + line)
    closest = sorted((n for n in notes if "floor" in n), key=lambda s: float(s.split()[-3]))[:3]
    for line in closest:
        print("  · closest: " + line)
    for line in (n for n in notes if "hairline" in n):
        print("  · " + line)
    if not fails and not grounds:
        print("  clear — every ink, brand text, mark, ring and action clears its floor in both halves, and no ground is a gradient")
    return 1 if fails or grounds else 0


def selftest() -> int:
    css = """:root { --background: #ffffff; --foreground: #1b0a08; --muted-foreground: #6b605e;
      --card: #fff; --popover: #fff; --muted: #fbfaf9; --accent: #f7f5f4; --secondary: #f7f5f4;
      --brand: #e72887; --brand-ink: #c41a6b; --brand-wash: #fdeff6; --ring: var(--brand);
      --primary: #1b0a08; --primary-top: #524c4b; --primary-foreground: #fff; --destructive: #c4291c;
      --border: #e8e6e6; }"""
    f, _ = measure(blocks(css, ":root"), "light")
    assert not f, f
    bad = css.replace("--brand-ink: #c41a6b", "--brand-ink: #e72887")
    f, _ = measure(blocks(bad, ":root"), "light")
    assert any("brand text" in x for x in f), "brand at its source value must fail as small text"
    assert GRADIENT.search('className="md:bg-linear-to-b from-x"')
    assert not GRADIENT.search('className="slide-in-from-top-2"')
    print("selftest ok — the inks pass, a brand ink at the fill's value fails, gradients are found")
    return 0


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        raise SystemExit(selftest())
    raise SystemExit(run(find_repo()))
