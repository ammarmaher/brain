---
type: architecture-rules
audit-source: `core`, `language`, `shared-ui`, `shared-data-access`, `shared-types`, `shared-utils`. Theme is CSS-only and lives at `@falcon/theme` (no TS exports). | medium | `libs/falcon/src/index.ts` |
rule-count: 8
created: 2026-05-15
---
*** Architecture Rule Set — Barrel Exports ***
*** SoT: Brain Outputs/understanding/frontend/architecture/BARREL_EXPORTS_AUDIT.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Barrel Exports

> Inventory of every `index.ts` / `index.css` barrel in the Falcon frontend and what each re-exports. Defines the canonical import path per symbol family — critical because ~14 Angular wrappers are NOT re-exported via `@falcon` and must be imported from `@falcon/ui-core/angular`.

## Source-of-truth file
- [BARREL_EXPORTS_AUDIT](../../outputs/understanding/frontend/architecture/BARREL_EXPORTS_AUDIT.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-barrel-01 | `@falcon` barrel re-exports 6 sub-folders: `core`, `language`, `shared-ui`, `shared-data-access`, `shared-types`, `shared-utils`. Theme is CSS-only and lives at `@falcon/theme` (no TS exports). | medium | `libs/falcon/src/index.ts` |
| AR-barrel-02 | `@falcon/ui-core/angular` is the canonical Angular wrapper barrel — 49 component folders re-exported. New Angular code MUST import wrappers from here. | high | `libs/falcon-ui-core/src/angular-wrapper/index.ts` |
| AR-barrel-03 | Per-component direct alias `@falcon/ui-core/angular/<name>` maps to `libs/falcon-ui-core/src/angular-wrapper/components/<name>/index.ts` — preferred in library-internal code (lean barrels, crisper Nx graph). | medium | `tsconfig.base.json` paths |
| AR-barrel-04 | 14 wrappers are NOT re-exported via `@falcon` and MUST come from `@falcon/ui-core/angular`: avatar, badge, card, status-badge, empty-state, icon, input-number, drawer, search-input, grid-input, combobox, filter-panel, menu, wizard, select, data-table. | high | `libs/falcon/src/shared-ui/index.ts` absences |
| AR-barrel-05 | `@falcon/ui-tokens/*` is pure CSS — NOT a TS barrel. `index.css` imports 6 primitive layers (colors/spacing/radius/shadow/typography/motion) + semantic + themes + density + RTL + 46 component-token files. | high | `libs/falcon-ui-tokens/src/index.css` |
| AR-barrel-06 | `@falcon/theme` carries the Tailwind v4 `@theme` SSOT (`falcon-tailwind-tokens.css` ~264 tokens) + icon font. `tokens.ts` mirror is auto-generated (do NOT edit by hand). | high | `libs/falcon-theme/src/index.css` + `tokens.ts` |
| AR-barrel-07 | `@falcon/sdk` exports cross-shell facade contracts (`FALCON_AUTH`/`FALCON_THEME`/etc. tokens, `Falcon*Facade` interfaces, `provideFalconFacades`). Apps consume facades from `@falcon/sdk`, NOT from feature code. | high | `libs/sdk/src/index.ts` |

## Forbidden patterns
- Importing a wrapper from `@falcon` when it's not in the re-export list (will compile but Nx graph + tree-shaking suffer).
- Editing `libs/falcon-theme/src/tokens.ts` by hand — regenerate with `nx run falcon-theme:generate-tokens-ts`.
- Adding new exports to `@falcon` for the 14 non-re-exported wrappers (keep them at `@falcon/ui-core/angular` only).
- Importing component-scoped tokens directly without going through the consumer app's `tailwind.css`.

## Recommended patterns
- Apps: `@import "../../../libs/falcon-ui-tokens/src/index.css"` in `tailwind.css`.
- Apps: `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` in `tailwind.css`.
- TS: `import { ... } from '@falcon/ui-core/angular'` for wrappers; `import { ... } from '@falcon'` for core/language/types/utils/legacy bespoke.

## Canonical import paths per family

| Symbol family | Recommended import |
|---|---|
| Falcon session / guards / route access / translate / validators / utils / shared-types | `@falcon` |
| Falcon Angular form-control + layout/feedback wrappers | `@falcon/ui-core/angular` |
| Stencil tag types | `@falcon/ui-core` or `@falcon/ui-core/angular` |
| Cross-shell facades | `@falcon/sdk` |
| Theme + tokens | `@falcon/theme`, `@falcon/theme/tokens`, `@falcon/ui-tokens/*` |

## Related component notes
- [[Falcon Data Table]] · [[Falcon Drawer]] · [[Falcon Search Input]] — examples of wrappers reachable only via `@falcon/ui-core/angular`.

## Tags

#type/architecture-rules

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
