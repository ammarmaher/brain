*** Q-tickets.base — README ***
*** Companion doc for `Q-tickets.base` · Obsidian Bases registry · 2026-05-27 ***

# Q-tickets.base — README

## What this base does

`Q-tickets.base` is an Obsidian **Bases** registry (Obsidian v1.7+ core feature) over every Q-* question ticket in this folder.

A "Q ticket" is a pending business question — usually a PRD gap, an undocumented behavior, or a contradiction surfaced during a delivery wave — that has to be answered before downstream work can proceed.

It filters on frontmatter `type` being `pending-question` (open) or `pending-question-resolution` (resolved or being resolved) and surfaces three views:

| View | Kind | What it shows |
|---|---|---|
| **All open** | Table | Tickets with `status == OPEN` (or `open`), sorted by `priority` ASC then `due` ASC |
| **Blocked** | Card | Tickets where `blocked-on` is non-empty (waiting on a person, doc, or other ticket) |
| **Recently resolved** | Table | Tickets with `status == RESOLVED`, newest `resolved` date first |

Columns surfaced:

- `file.name` — ticket file (also the link)
- `question-id` — short identifier (e.g. `Q-UM-07`, `Q-AM-16`)
- `module` — Falcon module the question concerns
- `status` — `OPEN` · `RESOLVED` · `WONT_FIX`
- `priority` — `high` · `medium` · `low`
- `blocked-on` — array of blockers (people, PRDs, other tickets, BE drift items)
- `due` — optional ISO due date
- `last-verified` — ISO date of last status check

## How to open it in Obsidian

1. Make sure you're on Obsidian v1.7+ (Bases is core, no plugin needed).
2. Open the vault that contains this folder (typically `C:\Falcon\Brain SK\_obsidian` if the authority dataset is symlinked in, or open the folder directly as a standalone vault).
3. Navigate to `Brain Outputs/datasets/authority-dataset/_pending-questions/`.
4. Click `Q-tickets.base`. Obsidian renders the views as tabs.
5. Switch between **All open**, **Blocked**, **Recently resolved**.
6. Click any row to jump to the ticket note (full question + resolution narrative lives inside).

## Tuning

A few items that may need GUI tuning later:

- **`blocked-on` non-empty filter** — written here as `blocked-on.length > 0`. If your Obsidian build emits an error on that predicate, edit the filter in the GUI to "blocked-on is not empty" once the GUI option appears.
- **`resolved` column** — listed in the order block of "Recently resolved" but not declared in the top-level `properties` map (kept commented out). Add `resolved:` to `properties` if you want a friendly `displayName: Resolved` later.
- **Status casing** — the filter accepts both `OPEN` and `open` for the open view, and `RESOLVED` for the resolved view, matching the historic mix in this folder. Normalize the frontmatter and the filters can be simplified.

## Companion files

- Source notes: `Q-*.md` siblings (e.g. `Q-UM-07-RESOLVED-2026-05-19.md`)
- Related registries:
  - `..\..\..\Brain SK\_obsidian\30-Validation\V-rules.base` — validation rules
  - `..\..\..\Brain SK\_obsidian\40-API\E-entities.base` — entity reconciliations
  - `..\..\..\Brain Outputs\prd\modules\BR-registry.base` — business rule files

## Tasks-plugin tracking

- [-] [[Q-tickets.base.README]] Q-tickets.base — README (companion doc, not a ticket) 🔽
