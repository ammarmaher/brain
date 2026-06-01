---
type: graph-cluster
title: Tailwind Usage Graph
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 2
node-type: TailwindClass
node-count: 0 (Wave 1 seed)
up: "[[COMPONENT_STYLE_GRAPH_INDEX]]"
tags: [graph, tailwind, styling]
---

# Tailwind Usage Graph

> [!warning]
> **Wave 1 = stub.** Tailwind classes are consumed widely across components. Wave 2 extracts them from theming audits + per-component USAGE.md.

## Source of truth

- [BRAIN-SK] `36-Theming/` has a **Tailwind audit** file (per agent inventory — 46 files in this dir).
- Per-component Tailwind class usage is documented in [BRAIN-OUT] `understanding/frontend/components/<comp>/USAGE.md` (example/snippet sections).
- Migration history: many components were converted from SCSS → Tailwind (per memory entries: `project_falcon_tree_panel_tailwind_2026_05_18`, `project_falcon_photo_uploader_tailwind_2026_05_17`).

## Wave 2 extraction plan

For each `USAGE.md`:
1. Parse code fences for class attributes
2. Tokenize each class to a Tailwind utility OR a custom Falcon utility
3. Create `TailwindClass` node per unique class + `USES_TAILWIND_CLASS` edge from component
4. Cross-reference with the master Tailwind audit file to confirm class is in design system (vs ad-hoc)

## Known cross-cutting Tailwind rules (from [MEMORY])

| Rule | Source |
|---|---|
| Wizard data-table cells use `grid grid-rows-[1fr_auto_1fr]` for vertical centering | [MEMORY] `project_wizard_data_table_vertical_centering_2026_05_20` |
| Shadow-row col alignment uses `--falcon-table-cell-padding-inline` 20px (not legacy 14px) | [MEMORY] `project_shadow_row_col_alignment_fix_2026_05_20_v2` |
| Shadow-row Cancel/Save vertically center via `top-1/2 -translate-y-1/2` | [MEMORY] `project_shadow_row_actions_md_buttons_and_vcenter_2026_05_20` |
| `*ngIf`/`*ngFor` → `@if`/`@for` (control-flow migration) | [BRAIN-OUT] DECISION-PROTOCOL F-018 |
| PrimeNG → Falcon UI Core equivalents | [BRAIN-OUT] DECISION-PROTOCOL F-016 |
| SCSS → Tailwind | [BRAIN-OUT] DECISION-PROTOCOL F-017 |

## See also

- [[STYLE_TOKEN_GRAPH]]
- [[CSS_VARIABLE_GRAPH]]
- [BRAIN-SK] `36-Theming/` (when Wave 2 reads it for the audit file)
