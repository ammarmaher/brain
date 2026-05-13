# falcon-table — OVERVIEW

## What this is

The Falcon UI native-`<table>` component — the largest component in the library at **685 LOC** (Stencil source). Supports sortable headers (single + multi), row selection (single/multi), skeleton-loading body, empty-state cell, optional pagination footer composing `<falcon-paginator>`, frozen columns + sticky-actions, scrollable sticky thead, global filter strip, lazy server-side mode, responsive layouts.

Designed for **PrimeNG `<p-table>` feature parity** so the post-Wave-PR-8 codebase can fully retire the PrimeNG table without losing capability.

## Render paths

- **Shadow DOM** — `<falcon-table>` at `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx` (`shadow: true`, 685 LOC).
- **Light DOM** — `<falcon-table-tw>` at `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` (`shadow: false`).
- **Angular wrapper (table)** — `<falcon-angular-table>` at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts` — thin CVA-less wrapper that switches between the two render paths.
- **Angular wrapper (data-table)** — `<falcon-angular-data-table>` at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (672 LOC + cell directive) — **Strategy E projection orchestrator** that composes `<falcon-table-tw>` (Light DOM only) and adds per-column custom template support via `FalconDataTableCellDirective`.

These are TWO sibling components, not duplicates:

| Component | Render path | Purpose |
|---|---|---|
| `<falcon-angular-table>` | Shadow OR Light (toggleable via `useTailwind`) | Thin wrapper around `<falcon-table>` / `<falcon-table-tw>`. Use when you don't need Angular templates per cell. |
| `<falcon-angular-data-table>` | Light DOM only (composes `<falcon-table-tw>`) | Strategy E projection wrapper with custom Angular cell templates. **Replaced the legacy PrimeNG-style `<falcon-data-table>` in Wave PR-7.** Heavy production use across admin + management consoles. |

## Why it exists

- Replaces every PrimeNG `<p-table>` after Wave PR-8.
- Single source of design tokens (`--falcon-table-*`) drives both render paths so Studio can restyle at runtime.
- Cross-framework — same Stencil tags are wrapped for React + Vue.

## Where it lives

| Layer | Path |
|---|---|
| Stencil Shadow tag | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx` (685 LOC) |
| Stencil Light tag | `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` |
| Stencil styles | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.types.ts` |
| Angular wrapper (table) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.{ts,html,css}` |
| Angular wrapper (data-table) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (672 LOC) + `falcon-data-table-cell.directive.ts` + `falcon-data-table.types.ts` |
| Component tokens | `libs/falcon-ui-tokens/src/components/table.tokens.css` + `data-table.tokens.css` |
| Re-export (Angular) | `libs/falcon/src/shared-ui/index.ts:242-261` |

## Standing rules / decisions

- The PR sequence is documented in source comments:
  - **PR-2** added PrimeNG-feature-parity surface: `dataKey`, `scrollable`, `styleClass` / `tableStyleClass` / `rowStyleClass`, `column.render` / `headerClass` / `cellClass` / `maxWidth`, row-action trigger, `aria-busy` on tbody.
  - **PR-3** added lazy server-side mode, paginator integration (`currentPageReportTemplate` / `paginatorTemplate`), global filter strip, frozen columns + sticky-actions, scrollable sticky thead, `rowStyleClass` callback union, `responsiveLayout: 'scroll' | 'stack'`.
  - **PR-7** deleted the legacy PrimeNG-style `<falcon-data-table>` Angular wrapper. Consumers now use `<falcon-angular-data-table>` from `@falcon/ui-core/angular` (Strategy E projection wrapper around `<falcon-table-tw>`, Light DOM).
- ARIA contract: `role="grid"` + `aria-rowcount` + per-`<th>` `aria-sort` + per-`<tr>` `aria-selected` + `aria-busy` on tbody.
- **Row ID resolution** — uses the configured `dataKey` field, falls back to `id`, then to numeric row index. Implemented in `resolveRowId()` helper.
- **`paginatorTemplate` carries PrimeNG-shaped tokens** like `'CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink RowsPerPageDropdown'`. This is intentional for drop-in replacement.
- The Strategy E projection wrapper (`falcon-angular-data-table`) uses Angular content projection to inject custom cell templates via `[falconCell]` directive without breaking the Stencil component's encapsulation.
