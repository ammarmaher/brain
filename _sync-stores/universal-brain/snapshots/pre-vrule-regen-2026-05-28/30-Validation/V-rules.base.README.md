*** V-rules.base — README ***
*** Companion doc for `V-rules.base` · Obsidian Bases registry · 2026-05-27 ***

# V-rules.base — README

## What this base does

`V-rules.base` is an Obsidian **Bases** registry (Obsidian v1.7+ core feature, similar to a Notion database) over every validation-rule note in this vault.

It filters on frontmatter `type: validation-rule` and surfaces the rules as three browsable views:

| View | Kind | What it shows |
|---|---|---|
| **All V-rules** | Table | Every V-rule, sorted by `module` then `status` |
| **Live rules only** | Card | Only rules where `status` is `live` or `triangulated` (canonical, in-force) |
| **Superseded** | Table | Rules with `status == superseded`, newest `last-verified` first |

Columns surfaced (when present in the note's frontmatter):

- `file.name` — the V-rule id (also serves as the link)
- `module` — Falcon module the rule belongs to (e.g. `account-mgmt`, `user-mgmt`, `charging`)
- `feature` — narrower feature scope (e.g. `add-client`, `login`, `password-policy`)
- `status` — `live` · `triangulated` · `superseded` · `proposed`
- `verification` — `runtime` · `code-verified` · `unverified`
- `last-verified` — ISO date the rule was last reconciled against runtime or code
- `drift` — boolean: does this rule disagree with current implementation?
- `severity` — `high` · `medium` · `low`

## How to open it in Obsidian

1. Make sure you're on Obsidian v1.7+ (Bases is core, no plugin needed).
2. Open the vault at `C:\Falcon\Brain SK\_obsidian`.
3. In the file explorer, navigate to `30-Validation/`.
4. Click `V-rules.base`. Obsidian renders the configured views as tabs.
5. Switch between **All V-rules**, **Live rules only**, **Superseded** in the view selector.
6. Click any row to jump to the underlying V-rule note.

## Tuning

The YAML in `V-rules.base` is intentionally minimal — visual settings (column widths, card image fields, conditional formatting) are best tuned inside Obsidian's UI. Right-click any view tab → **Edit view** for the GUI editor.

If Obsidian reports a filter or property it doesn't recognize, edit `V-rules.base` in any text editor and comment the offending line with a leading `#`. The vault won't crash on unknown keys — it simply skips them.

## Companion files

- Source notes: `30-Validation/V-*.md` (29+ V-rules as of 2026-05-27)
- Map of contents: `30-Validation/V-rules-MOC.md` (legacy index — Bases is the live replacement)
- Related registries:
  - `40-API/E-entities.base` — entity reconciliation registry
  - `..\Brain Outputs\datasets\authority-dataset\_pending-questions\Q-tickets.base` — question tickets
