<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### House style

Soft Neutral, since the v3 rebuild (`docs/adr/0002`). The local
`.claude/skills/paper-hairline/` belonged to v2 and stays for its history only.
Where this template departs from Soft Neutral — the 14px reading size, Geist
Mono kickers — the reason sits in `.soft-neutral.json` under `waive`.

### Design language

`DESIGN.md` is the template's design language, shipped to the buyer as it
stands. Its front matter is generated from `app/globals.css`, and its kit list
under `## Components` from the first line of each file in `components/ui/` — run
`npm run design` after editing either; `npm run check` fails while they
disagree. The prose is the house style applied to this template: keep it true
when a rule here changes, and never write a dial, a ref line or anything from
`brief.md` into it.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Comment file

"xử lý comments", "process the comments": `.comments.md` holds the requests the
user wrote on the page with the picker. Follow
`.claude/skills/template/references/comments.md`.
