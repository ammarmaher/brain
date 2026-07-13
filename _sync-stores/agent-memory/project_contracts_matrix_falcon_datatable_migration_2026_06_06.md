---
name: project_contracts_matrix_falcon_datatable_migration_2026_06_06
description: "Contract-Details rate matrix migrated from native-HTML <table> to <falcon-angular-data-table> in BOTH consoles — pattern, verification, gotchas."
metadata: 
  node_type: memory
  type: project
  originSessionId: e50c7e16-3501-490d-b10e-af7dc0d5ae9c
---

The Add-Contract wizard **Contract-Details rate matrix** (Priority/Type × 11 destination countries, every cell an editable rate) was migrated from a hand-rolled native-HTML `<table>` to the platform **`<falcon-angular-data-table>`** in BOTH consoles (orchestrated 2026-06-06: claude + 2 ammar-web-platform-ui agents + a /loop test gate). Matches the user's screenshot = standard Falcon table chrome + standard footer `Showing 1 - 4 from 4 · « ‹ 1 of 1 › » · Rows per page 20`.

**Files (NO commits, branch polishing-v0.4):**
- admin: `apps/admin-console/.../contracts-add-wizard/contract-details-step/contract-details-step.component.{ts,html}`
- mgmt: `apps/management-console/.../components/contracts-contract-details-section/contracts-contract-details-section.component.{ts,html}`
- specs: admin `tests/contracts/contract-matrix-deepdive.spec.ts` + `contract-number-input.spec.ts` (UPDATED to new API); mgmt `tests/contracts/contracts-contract-details-section.component.spec.ts` (NEW, 15).
- Plan/report: `C:\Falcon\plans\contracts-matrix-falcon-table\PLAN.md`.

**The pattern (copied from the proven sibling `rate-card-step` — same wizard, also editable input-number cells in a Falcon table):**
- `matrixColumns()` = `{field:'priorityType', headerKey:'…contractDetails.priorityType', width:'160px'}` + `...destinationHeaders().map(d => ({field:d.destination, headerKey:d.label}))` (11 DYNAMIC cols, NO `align` → left, matches screenshot).
- `matrixRows()` flattens each `ContractRateMatrixRow` → `{priority, labelKey, cells, [dest.code]: ratePerUnit}` so the table's native `value = row[field]` feeds each cell. `dataKey="priority"`.
- Cell templates are PROJECTED `<ng-template [falconDataTableCell]="dest.destination" let-row let-value="value">` generated inside `@for(dest of destinationHeaders())` — works because the lib collects them via `contentChildren(FalconDataTableCellDirective,{descendants:true})` (a reactive signal). Editable → `<falcon-angular-input-number>` (caps `[max]=999999.9999`, 4dec, `blockExcessFractionDigits` PRESERVED); read-only → `formatAmount(value)`. Priority header via `<ng-template falconDataTableHeaderCell="priorityType">`.
- Write path RE-KEYED to stable codes: `onCellChange(priority, destination, value)` → immutable map by priority+destination → `matrix.set` → `persistCurrentMatrix` → `syncRateMatrixIntoRates`. **MUST NOT use the table's `rowIndex` — it is the PAGINATED index, not the matrix index.** Replaced the old index-based `onCellValueChange(rowIndex,cellIndex)`.
- `[paginator]="true"` (NOT showCustomFooter/lazy) → Stencil footer `'Showing {first} - {last} from {totalRecords}'` + RowsPerPageDropdown = the screenshot footer (English, no new i18n — same as rate-card). `defaultRowsPerPage=20`, `rowsPerPageOptions=[10,20,50]`, `[scrollable]="false"`, `tableStyleClass="w-full"`.
- Copied the rate-card **projection-race fix**: ctor `defineFalconTwComponent('falcon-table'|'falcon-input-number')` + `effect(()=>{ void matrix(); afterNextRender(()=> mountKick.update(n=>n+1)) })`; `matrixRows()` reads `mountKick()` for fresh refs (the step mounts via `@switch` so cells hydrate late).

**Key decisions:** (1) **Deep-dive DROPPED** (user chose "match screenshot" — plain Priority/Type labels; it was an admin-only placeholder re-showing the same rates, no backend breakdown). Removed `chevronIcon/expandedPriorities/isExpanded/toggleExpanded` + icon imports. mgmt never had it. (2) **ZERO model/DTO/lib change** — `ContractRateMatrixState/Row/Cell`, `createRateMatrixForSelection`, `syncRateMatrixIntoRates`, all catalogs untouched; POST `commerce/Contracts` body assembly (from `rates[]`) byte-identical. (3) **No `libs/**` edit needed** — the data table already supports dynamic cols + per-field projected templates + frozen + interactive cells + client pagination. (4) Migrating the ONE section auto-migrates the view/edit/wizard panes (they reuse selector `app-contracts-contract-details-section`); read-only path renders text cells in the same table.

**Verified:** admin `nx build` EXIT 0 + 743 tests (35 files); mgmt `nx build` EXIT 0 + 583 tests (25 files); `nx lint` EXIT 0 both (agent-run); orchestrator RE-RAN both vitest suites → 743 + 583 GREEN (the /loop gate). ⚠️ **Live pixel-verify PENDING login** (credential policy): full-width 12-col render, left-aligned cells, the standard footer, and focus-stays-on-typing (high confidence — `dataKey="priority"` keys EmbeddedViewRef reuse; rate-card proves it). NO COMMITS.

Related: [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_contracts_value_digitcap_enforce_2026_06_06]] · [[project_contracts_list_column_width_ellipsis_2026_06_06]] · [[project_contracts_wizard_deepdive_borderless_2026_06_06]] (the deep-dive this task removed).
