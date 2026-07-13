---
name: Task History — Contracts rate-matrix → falcon-angular-data-table (MANAGEMENT-CONSOLE, Wave 2)
description: Mirror of the build-green ADMIN contract-details data-table migration into management-console
type: project
agent: ammar-web-platform-ui
date: 2026-06-06
status: completed
branch: polishing-v0.4
repo: C:/Falcon/Falcon/falcon-web-platform-ui
commits: none (NO COMMITS)
---

# Wave 2 — Mgmt mirror of the admin contract-details rate-matrix data-table migration

## Goal
Port the just-completed, build-green ADMIN migration into the MANAGEMENT-CONSOLE copy of the same
section so the mgmt contract-details rate matrix uses `<falcon-angular-data-table>` with the standard
Falcon table chrome + standard pagination footer — identical to admin. Zero DTO/API/model/`libs/**`
changes. No commits.

## What Was Done
- **TS** (`contracts-contract-details-section.component.ts`): replaced the old dynamic-column approach
  (`viewChild` TemplateRefs `priorityCell`/`destCell` → `ColumnDef.template`, `columns`/`viewRows`
  computeds, `cellOf`/`cellIndexFor`, index-based `onCellValueChange`+`writeCellValue`) with admin's
  PROVEN rate-card pattern: `matrixColumns()` (Priority/Type 160px + one per destination, NO `align`,
  no per-col `template`), `matrixRows()` (flattens `row[destination]=ratePerUnit`, reads `mountKick`),
  `emptyMessageText()`, key-based `onCellChange(priority,destination,value)`→`persistCurrentMatrix`→
  `syncRateMatrixIntoRates`. Imports: ADDED `FalconAngularDataTableComponent`/`ColumnDef`/
  `FalconDataTableCellDirective`/`FalconDataTableHeaderCellDirective` + `afterNextRender`/`effect`/
  `Injector`; REMOVED `TemplateRef`/`viewChild`/`ContractRateMatrixRow`. Kept ctor
  `defineFalconTwComponent('falcon-table'|'falcon-input-number')` + the `afterNextRender` mountKick
  effect + all input-number digit caps.
- **HTML** (`contracts-contract-details-section.component.html`): KEPT the mgmt header chrome
  UNCHANGED (outer `rounded-md border` card, `.apps-panel-header` title bar, plain-text `dir="auto"`
  currency, dropdown header block). Replaced ONLY the matrix block with admin's `<falcon-angular-data-table>`
  (+ `falconDataTableHeaderCell`/`falconDataTableCell`-per-destination-in-`@for`, `tableStyleClass="w-full"`,
  paginator, rows 20). Preserved `data-testid="contracts-matrix-table"` (on the table el) + per-cell
  `contracts-matrix-cell-<priority>-<destination>`. Updated 2 stale comments.
- **Spec** (NEW `apps/management-console/tests/contracts/contracts-contract-details-section.component.spec.ts`,
  15 tests): columns built (dest cols `align` undefined), rows flatten, key-based `onCellChange`→rates,
  `formatAmount` (4dp, grouping, trailing-zeros trimmed, null→'-'), deep-dive/legacy-API absent,
  empty matrix. Uses `_support.ts` harness (runInInjectionContext, NO flushEffects); seeds via real
  `createRateMatrixForSelection`.

## Key Decisions
- **Model import kept at `../../models/`** (mgmt depth=2, NOT admin's `../../../`) — verified the mgmt
  components folder is one level shallower and the model file lives at
  `…/contracts-cost-management/models/contracts-display.models.ts`.
- **Public surface byte-faithful** — class `ContractsContractDetailsSectionComponent`, selector
  `app-contracts-contract-details-section`, ALL inputs/outputs/models/computeds unchanged so the mgmt
  view pane (read-only reuse) keeps working with zero edits.
- **Kept the editable branch** for parity with admin even though mgmt is effectively always read-only
  (only the view pane reuses this with `editable=false`).
- **Authored** a new spec rather than updating existing ones — no existing mgmt spec referenced the
  section's old API.

## Files Changed
1. apps/management-console/.../contracts-contract-details-section/contracts-contract-details-section.component.ts (rewritten)
2. apps/management-console/.../contracts-contract-details-section/contracts-contract-details-section.component.html (matrix block + 2 comments)
3. apps/management-console/tests/contracts/contracts-contract-details-section.component.spec.ts (NEW, 15 tests)

## Verification (evidence)
- `node node_modules/nx/dist/bin/nx.js build management-console --configuration=development --skip-nx-cache` → **EXIT 0** (Hash c62e3ff7e620fc36, +7 deps)
- `node node_modules/nx/dist/bin/nx.js test management-console --skip-nx-cache` → **EXIT 0, 583 passed / 25 files / 0 failed** (new spec 15; view-contract 22 + cost-management 25 unchanged)
- `node node_modules/nx/dist/bin/nx.js lint management-console --skip-nx-cache --max-warnings=0` → **EXIT 0** ("All files pass linting")
- First test/lint run surfaced 1 failing assertion + 2 unused imports IN THE NEW SPEC only (no source/regression issue): `formatContractNumber` min0/max4 trims trailing zeros + returns '-' not em-dash; `vi`/`setSignal` unused. Fixed in-spec; re-ran green.

## What Remains / Context for Next Agent
- ⚠️ **Live browser pixel-verify is USER-GATED** (auth credential policy — assistant can't log in):
  confirm full-width 12-col render, LEFT-aligned numeric cells, the standard footer
  `Showing 1 - 4 from 4 · « ‹ 1 of 1 › » · Rows per page 20`, and focus-on-typing (dataKey=priority
  should keep focus across re-render; rate-card proves the pattern).
- NO COMMITS made (branch polishing-v0.4, tree left dirty as required).
- Both consoles (admin Wave 1 + mgmt Wave 2) are now migrated and build/test/lint green.
