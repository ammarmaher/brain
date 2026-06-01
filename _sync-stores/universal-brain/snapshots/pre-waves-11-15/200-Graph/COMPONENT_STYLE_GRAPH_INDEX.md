---
type: graph-index
title: Component-Style-Token Sub-Graph Index
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 2
up: "[[00_START_HERE]]"
tags: [graph, components, styles, tokens]
---

# Component ↔ Style ↔ Token — Sub-Graph Index

> [!summary]
> This index roots the **component-styling subgraph** — the densest cluster in the Falcon knowledge graph. Wave 1 seeds 63 `Component` nodes + 76 cross-vault component dossiers. Wave 2 expands DesignToken + CSSVariable + TailwindClass + VisualState + Variant + Size relationships.

## Subgraph structure

```
Component  ── DEFINES_TOKEN ──>  DesignToken
Component  ── USES_TOKEN ──>     DesignToken (of another component)
Component  ── OVERRIDES_TOKEN ── DesignToken (consumer override pattern)
Component  ── DEFINES_CSS_VARIABLE ─> CSSVariable
Component  ── USES_CSS_VARIABLE ──>   CSSVariable
Component  ── USES_TAILWIND_CLASS ──> TailwindClass
Component  ── HAS_VARIANT ─────>      Variant
Component  ── HAS_SIZE ─────>         Size
Component  ── HAS_STATE ────>         VisualState
Component  ── HAS_STYLE_SOURCE ─>     CSSFile | SCSSFile
Component  ── WRAPS ────────>         StencilComponent  (only WrapperComponent → Stencil)
DesignToken ── MAPS_TO_TOKEN ──>      CSSVariable
ThemeMode  ── AFFECTS_VISUAL_AREA ──> Component
```

## Wave 1 evidence sources (already indexed)

| Source | Path | Content |
|---|---|---|
| Canonical component dossiers | [BRAIN-OUT] `understanding/frontend/components/<comp>/` | 9 files per component: `OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`, `BUSINESS.md`, `INTEGRATION_VALIDATION.md`, `RECOGNITION.md` |
| Wiki projections | [VAULT] `30-Components/<comp>.md` | 63 files (kebab-case), projection metadata pointing to canonical |
| Brain SK projections | [BRAIN-SK] `60-Components/<Comp>.md` | 76 files (Title Case), graph-vault projection |
| Theming audits | [BRAIN-SK] `36-Theming/*.md` | 46 files: color palette audit, hover/focus state map, spacing/radius/shadow maps, Tailwind audit, token references |

## Wave 1 node count (this subgraph)

| Node type | Count | Where seeded |
|---|---:|---|
| `Component` | 63 | [[COMPONENT_REGISTRY_GRAPH]] |
| `WrapperComponent` | TBD Wave 2 | classification by `falcon-angular-*` pattern |
| `StencilComponent` | TBD Wave 2 | classification by `falcon-*-tw` pattern |
| `DesignToken` | TBD Wave 2 | extracted from per-component `TOKENS.md` |
| `CSSVariable` | TBD Wave 2 | extracted from `TOKENS.md` + `36-Theming/` |
| `TailwindClass` | TBD Wave 2 | extracted from theme Tailwind audit |
| `ThemeMode` | 2 (light, dark) | per memory: dark-mode phases A-G implemented 2026-05-17 |
| `VisualState` | TBD Wave 2 | hover/focus/active/disabled/loading |
| `Variant` | TBD Wave 2 | per-component API.md |
| `Size` | TBD Wave 2 | per-component API.md (xs/sm/md/lg/xl) |

## Wave-1 confirmed edges (this subgraph)

Per component dossier presence, each component has:
- `EVIDENCED_BY` → 3 doc files (Brain Outputs canonical + Wiki projection + Brain SK projection)
- `DOCUMENTED_IN` → 9 canonical sub-files (OVERVIEW, API, USAGE, TOKENS, etc.)
- `PARENT_MOC` → [[../00-MOCs/Components]]
- `IN_MODULE` → not applicable (components are cross-module reusables)
- `DISCOVERED_IN_WAVE` → Wave 001

That's 5 confirmed edges per component × 63 = **315 confirmed edges** seeded for this subgraph in Wave 1, all evidenced by file presence.

## What Wave 2 will add to this subgraph

Estimated new edges in Wave 2: **~2,000+**
- USES_TOKEN: avg 15/component × 63 = ~945
- DEFINES_CSS_VARIABLE: avg 5/component × 63 = ~315
- USES_CSS_VARIABLE: avg 8/component × 63 = ~504
- HAS_VARIANT / HAS_SIZE / HAS_STATE: avg 6/component × 63 = ~378
- WRAPS: ~25 wrappers × 1 stencil each = ~25

After Wave 2 this subgraph alone should reach **>0.65 coverage** (vs Wave 1 = 0.30).

## See also

- [[COMPONENT_REGISTRY_GRAPH]] — the full component node list
- [[STYLE_TOKEN_GRAPH]] — token-side detail (Wave 2 fills)
- [[CSS_VARIABLE_GRAPH]] — CSS-var detail (Wave 2 fills)
- [[TAILWIND_USAGE_GRAPH]] — Tailwind utility usage (Wave 2 fills)
