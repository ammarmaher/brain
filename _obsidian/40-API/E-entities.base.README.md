*** E-entities.base — README ***
*** Companion doc for `E-entities.base` · Obsidian Bases registry · 2026-05-27 ***

# E-entities.base — README

## What this base does

`E-entities.base` is an Obsidian **Bases** registry (Obsidian v1.7+ core feature) over every E-* entity reconciliation note in this vault.

An "entity reconciliation" note compares the PRD-conceptual definition of a Falcon entity (Account, User, Wallet, Contract, etc.) against the actual backend implementation, and counts the drift between them.

It filters on frontmatter `type: entity-reconciliation` and surfaces two views:

| View | Kind | What it shows |
|---|---|---|
| **All entities** | Table | Every E-* entity, sorted by `drift-count` descending (biggest drift first) |
| **High-drift** | Table | Only entities where `drift-count > 5` (priority backlog for PRD↔BE reconciliation) |

Columns surfaced:

- `file.name` — the entity note id (also the link)
- `module` — Falcon module the entity belongs to
- `service` — owning backend service (e.g. `commerce`, `identity`, `charging`)
- `prd` — which PRD documents the entity (e.g. `PRD-01`)
- `drift-count` — number of fields that disagree between PRD and backend
- `verification` — `runtime` · `code-verified` · `unverified`
- `last-verified` — ISO date of last reconciliation

## How to open it in Obsidian

1. Make sure you're on Obsidian v1.7+ (Bases is core, no plugin needed).
2. Open the vault at `C:\Falcon\Brain SK\_obsidian`.
3. In the file explorer, navigate to `40-API/`.
4. Click `E-entities.base`. Obsidian renders the configured views as tabs.
5. Switch between **All entities** and **High-drift** in the view selector.
6. Click any row to jump to the underlying entity note (full PRD↔BE field table lives inside).

## Tuning

YAML is intentionally minimal — visual settings (column widths, conditional formatting on `drift-count`, etc.) are best tuned inside Obsidian's UI. Right-click any view tab → **Edit view** for the GUI editor.

A nice manual tweak: in the GUI, set conditional cell coloring on `drift-count` (e.g. red ≥ 10, amber 5–9, green < 5) for an at-a-glance drift heatmap.

## Companion files

- Source notes: `40-API/E-*.md` (20+ entities as of 2026-05-27)
- Map of contents: `40-API/E-entities-MOC.md` (legacy index)
- Related registries:
  - `30-Validation/V-rules.base` — validation rules
  - `..\Brain Outputs\prd\modules\BR-registry.base` — business rule file registry
