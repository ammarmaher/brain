---
type: graph-cluster
title: CSS Variable Graph
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 2
node-type: CSSVariable
node-count: 0 (Wave 1 seed)
up: "[[COMPONENT_STYLE_GRAPH_INDEX]]"
tags: [graph, css-variables, theming]
---

# CSS Variable Graph

> [!warning]
> **Wave 1 = stub.** CSS variables are declared inside per-component dossiers and global theme files. Wave 2 extracts them.

## Where CSS variables live

| Layer | Source | Pattern |
|---|---|---|
| Per-component declarations | [BRAIN-OUT] `understanding/frontend/components/<comp>/TOKENS.md` | `--falcon-<component>-<token>` |
| Theme primitives | [BRAIN-SK] `36-Theming/Falcon Color Palette Audit.md` etc. | `--color-falcon-*`, `--radius-*`, `--shadow-*` |
| Dark-mode counterparts | per memory: dark-mode wave C added 6 new dark counterparts in SSOT | `--*-dark` suffix or theme-mode-scoped |
| Tailwind theme extension | (real code at `Falcon/falcon-web-platform-ui/.../tailwind.config.ts`) | exposed via `theme.extend.colors` etc. |

## Wave 2 extraction plan

Grep targets (read-only; will run via Agent subagents to keep main context lean):

```
\-\-falcon-[a-z\-]+\:        # per-component CSS vars
\-\-color-falcon-[a-z\-0-9]+ # color primitives
\-\-spacing-[a-z0-9\-]+      # spacing primitives
\-\-radius-[a-z0-9\-]+       # radius primitives
\-\-shadow-[a-z0-9\-]+       # shadow primitives
\-\-z-[a-z0-9\-]+            # z-index ladder
```

For each match:
- Create a `CSSVariable` node (id `cssvar:<name>`)
- `DEFINES_CSS_VARIABLE` edge from the declaring file/component
- `MAPS_TO_TOKEN` edge to the corresponding `DesignToken` (where one exists)
- `USES_CSS_VARIABLE` edges from consumers (found via second grep pass)

## Known declarations carried in from [MEMORY]

These memory entries explicitly named CSS vars that became platform rules:

| CSS variable | Declared | Memory entry |
|---|---|---|
| `--falcon-table-row-height` | data-table row height SoT | [MEMORY] `project_data_table_single_height_token_2026_05_19` |
| `--color-falcon-red-50` = `#fef5f5` | form-control error bg token | [MEMORY] `project_form_control_error_bg_symmetry_2026_05_21` |
| `--spacing-7` overridden to `2.5rem` (Tailwind default 1.75rem) | icon-padding correction | [MEMORY] `project_icon_left_padding_token_fix_2026_05_20` |
| `--spacing-8` overridden to `48px` | shadow-row price input | [MEMORY] `project_shadow_row_price_input_padding_fix_2026_05_20` |
| `--falcon-menu-item-icon-color-hover` | menu kebab hover | [MEMORY] `project_data_table_kebab_and_menu_item_hover_2026_05_20` |

## See also

- [[STYLE_TOKEN_GRAPH]]
- [[TAILWIND_USAGE_GRAPH]]
- [[COMPONENT_REGISTRY_GRAPH]]
