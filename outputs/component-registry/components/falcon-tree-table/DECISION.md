# falcon-tree-table — DECISION

## Brain SK final recommendation

### USE FOR

- Tree-shaped tabular data (wallet hierarchy, accounts tree, multi-level aggregations).
- Single-select-across-tree via radio mode.
- Wallet `multi-N` patterns from React V0.2 reference.

### AVOID FOR

- Flat list views → `<falcon-angular-data-table>`.
- Org-hierarchy chrome (root header + recursive list + sticky menu) → `<falcon-organization-hierarchy-tree-tw>`.
- Multi-select trees — not supported yet (FTT-02 gap).
- Tree views needing Angular components inside cells — projection not supported in the Angular wrapper yet (FTT-01 gap).

## Preferred variant

Light DOM (`<falcon-tree-table-tw>`) via the Angular wrapper with `[useTailwind]="true"` (default).

## Required upgrades before wider use

| ID | Priority |
|---|---|
| FTT-01 Strategy E projection in Angular wrapper | **P1** |
| FTT-07 Utils unit tests | **P1** |

## Relationship to other components

- `falcon-tree` (Agent 4) — tree without data columns; simpler use case.
- `falcon-tree-panel` legacy (Agent 4) — bespoke Angular shell.
- `falcon-data-table` — sibling for flat data, has Strategy E projection.
- `falcon-radio` — composed inside radio cells.
- `falcon-organization-hierarchy-tree-tw` — bespoke org-hierarchy chrome with root header + sticky menu (different visual language).

## Exact rule for future implementation tasks

1. For any tree-with-data-columns, use `<falcon-angular-tree-table>` with `selectionMode="radio"` or `'none'`.
2. Bind selected value via `[(selectedValue)]` or Reactive Forms `formControlName` (CVA).
3. Manage `expandedIds` via signal — forward `(expandChange)` events.
4. Use `column.type='custom'` + per-row Stencil slot for custom content (until the Angular wrapper adopts Strategy E).
5. Don't use this for org-hierarchy — use the bespoke `<falcon-organization-hierarchy-tree-tw>`.

## Status

**NEEDS-UPGRADE** for wide adoption. The Stencil core is mature, but the Angular wrapper lacks `<ng-template>` projection. Multi-select is missing. Until FTT-01 lands, the component is fine for wallet-style data but limited for action-rich tree views.

## Dynamic capability assessment

1. **Static today:** No multi-select, no row actions, no sort, no pagination, no virtual scroll, no Angular template projection, no lazy expand.
2. **Dynamic via inputs/outputs:** nodes, columns, expandedIds, selectedValue (CVA), density, selectionMode, disabled, helperText, errorMessage, groupLabel, ariaLabel, radioName, useTailwind, rootClass.
3. **Dynamic via slots:** Stencil per-row named slot (`cell-{columnKey}-{nodeId}`) for `column.type='custom'`. NOT via Angular `<ng-template>`.
4. **Dynamic via tokens:** Full token surface — ~50 vars.
5. **Dynamic via Tailwind classes:** `rootClass` on the wrapper. No per-column `cellClass` / `headerClass` field on `FalconTreeColumn`.
6. **Missing for reuse:** Strategy E template projection in Angular wrapper.
7. **Add to shared component:** All gaps (FTT-01 to FTT-08).
8. **Better flags/options:** Multi-select, lazy expand, row actions, sort, virtual scroll, expand-on-select.
9. **Safest upgrade path:** Adopt Strategy E first (FTT-01), then multi-select (FTT-02), then row actions (FTT-06). Sort + virtual scroll are larger.
10. **Risky to change:**
   - Per-row slot naming scheme (`cell-{columnKey}-{nodeId}`) — consumers (playground / showcase) rely on it. Don't rename.
   - Inline `grid-template-columns` style — consumer CSS overrides depend on its presence.
   - `selectedValue` two-way contract (CVA + valueChange) — don't change semantics.
   - Keyboard nav implementation — well-engineered; arrow-key handling must match WAI-ARIA treegrid pattern strictly.

**Verdict:** Mature Stencil core. Angular wrapper has a clear path to feature-parity with `<falcon-data-table>` by adopting Strategy E.
