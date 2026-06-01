---
type: graph-cluster
title: Style + Design Token Graph
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 2
node-type: DesignToken
node-count: 0 (Wave 1 seed; Wave 2 extraction)
up: "[[COMPONENT_STYLE_GRAPH_INDEX]]"
parent-moc: "[[../00-MOCs/Tokens]]"
tags: [graph, tokens, styling, theming]
---

# Style + Design Token Graph

> [!warning]
> **Wave 1 = stub.** Design tokens live inside per-component `TOKENS.md` files ([BRAIN-OUT] `understanding/frontend/components/<comp>/TOKENS.md`), NOT in the central `falcon-wiki/40-Tokens/` directory (which is empty per Wave 1 inventory). Wave 2 will extract them.

## Why this is a stub

The inventory agent confirmed:
- `falcon-wiki/40-Tokens/` — **empty** (0 files)
- Tokens are distributed across **63 component `TOKENS.md` files** under Brain Outputs canonical dossiers
- 46 theming audit files in [BRAIN-SK] `36-Theming/` reference token primitives like `--color-falcon-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--falcon-input-icon-input-padding-*`

## Wave 2 extraction strategy

For each of 63 component `TOKENS.md` files:
1. Grep CSS custom property declarations (`--falcon-*: ...`)
2. Each unique property → `CSSVariable` node + `DEFINES_CSS_VARIABLE` edge from owning component
3. Each token "concept" (e.g., button-bg-primary, button-bg-secondary) → `DesignToken` node + `MAPS_TO_TOKEN` edge from CSSVariable to DesignToken
4. Detect cross-component references → emit `USES_TOKEN` / `USES_CSS_VARIABLE` edges
5. Detect SoT overrides (per memory: spacing-7 override 1.75rem → 2.5rem) → emit `OVERRIDES_TOKEN` edge

## Known token categories (from theming audits in Brain SK)

| Category | Pattern | Examples from memory |
|---|---|---|
| Color | `--color-falcon-*` | red-50 (#fef5f5), neutral-100, primary-500, primary-600 |
| Spacing | `--spacing-*` | spacing-2 (8px), spacing-7 (2.5rem override), spacing-8 (48px) |
| Sizing | `--falcon-*-size-*` | input height, button height, row height |
| Radius | `--radius-*` | sm, md, lg, full |
| Shadow | `--shadow-*` | sm, md, lg, dropdown, modal |
| Padding | `--falcon-*-padding-*` | input-icon, table-cell, button-inline |
| Z-index ladder | `--z-*` | drawer 99999, popover 100000, toast 100001 (per memory rev 3 ladder) |
| Loader/skeleton | `--falcon-loader-*`, `--falcon-skeleton-*` | per loader inline config (24 keys) |
| Component-row tokens | `--falcon-table-row-height`, `--falcon-table-cell-padding-inline` 20px | per memory |

## Wave-1 confirmed memory-derived facts

These are pre-extracted from memory entries with [MEMORY] prefix and will become nodes in Wave 2:

| Token / variable | Concept | Source memory |
|---|---|---|
| `--falcon-table-row-height` | single height token for table rows | [MEMORY] `project_data_table_single_height_token_2026_05_19` |
| `--falcon-loader-*` (24 keys) | inline loader config | [MEMORY] `project_falcon_loader_inline_config_2026_05_19` |
| `--falcon-input-icon-input-padding-*` | input icon padding | [MEMORY] `project_icon_left_padding_token_fix_2026_05_20` |
| `--falcon-menu-item-icon-color-hover` | data-table kebab + menu-item hover | [MEMORY] `project_data_table_kebab_and_menu_item_hover_2026_05_20` |
| `--color-falcon-red-50` (#fef5f5) | form-control error bg | [MEMORY] `project_form_control_error_bg_symmetry_2026_05_21` |
| z-index ladder rev 3 | drawer=99999, popover=100000, toast=100001 | [MEMORY] `project_z_index_unified_ladder_2026_05_20_rev3` |

## See also

- [[CSS_VARIABLE_GRAPH]] — CSSVariable detail
- [[TAILWIND_USAGE_GRAPH]] — Tailwind-side
- [[COMPONENT_REGISTRY_GRAPH]] — owning components
- [BRAIN-SK] `36-Theming/` — 46 audit files (theme contracts, palette audits, dark-mode maps)
