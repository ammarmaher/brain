---
name: session-backup-contracts-wizard-rate-card-falcon-data-table-migration-matrix-flagged
description: Migrated the Contract wizard RATE CARD step (both consoles) from native <table> to <falcon-angular-data-table> + pagination; FLAGGED the CONTRACT DETAILS MATRIX (did not migrate) due to two data-table API gaps.
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-06
  status: completed
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

## What Was Done
- **TASK 1 — RATE CARD: MIGRATED (both apps).** Replaced the native `<table>/<thead>/<tbody>/<tr>/<td>/<th>`
  with `<falcon-angular-data-table>` + pagination, preserving every original binding.
  - admin: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/rate-card-step/rate-card-step.component.{html,ts}`
  - mgmt:  `apps/management-console/src/app/features/contracts-cost-management/components/contracts-rate-card-section/contracts-rate-card-section.component.{html,ts}`
  - Columns (ColumnDef[]) built in `.ts` as a lang-reactive `columns()` computed:
    `[{field:'name', headerKey:t('…rateCard.name'), width:'160px'}, {field:'priceUnit', headerKey:t('…rateCard.priceUnit')}, {field:'priceValue', headerKey:t('…rateCard.priceValue')}]`.
  - Required `*` asterisks moved onto `*falconDataTableHeaderCell="priceUnit"` / `="priceValue"` HEADER
    templates (editable only) — they ride the header, not a static `<th>`.
  - Cells projected via `*falconDataTableCell="name|priceUnit|priceValue"` (moved EXISTING Falcon content
    verbatim: channel-locked `<falcon-angular-dropdown>` w/ priceUnitOptionsFor(row); `<falcon-angular-input-number>`
    decimal mode min0/max999999.9999/4-frac/groupWhileTyping/blockExcessFractionDigits + riyal icon
    (admin iconLeft, mgmt iconRight); read-only riyal-glyph money via formatAmount()).
  - Pagination: `[paginator]="true" [rows]="defaultRowsPerPage(=20)" [rowsPerPageOptions]="[10,20,50]"` —
    copies the authoritative client-applications-step pattern (default custom footer, no manual page
    handlers). SoT CwStep2 pageSize 20. Rate card has ≤5 rows so it never visually paginates; the Stencil
    table slices internally ONLY when showCustomFooter=false, so with the default footer paging is the
    platform-uniform "Showing X-Y from Z" footer (same as the contracts LIST + client-apps step).
  - Added `[scrollable]="false"` (wizard panel already has `overflow-y-auto p-6`; avoids a nested 70vh scroll).
  - Added the `afterNextRender` MOUNT-KICK + fresh-reference `viewRows()` (steps mount via `@switch`; without
    this the Stencil cells render stale on step entry — the documented client-applications-step race).
  - Pre-registered `falcon-table` alongside `falcon-dropdown`/`falcon-input-number` in the ctor `Promise.all`.
  - NO new i18n keys (reused existing; both en+ar already cover them). NO service/model/DTO/validation changes.
  - Public API (selector `app-contracts-rate-card-section`, `[rows]`/`[(rows)]`/`[editable]`) UNCHANGED →
    the read-only view/edit pane reuse (`[editable]="false"`) keeps working untouched.

## What Remains
- **Matrix migration is INTENTIONALLY NOT DONE (FLAGGED).** See "Key Decisions". If we later extend the
  data-table API (multi-row expansion + a proven dynamic-editable-column path), the matrix can migrate.
- Live pixel verification pending auth login (no dev server was started; builds only).

## Key Decisions
- **TASK 2 — MATRIX: FLAGGED, not migrated** (per the task's "FLAG don't HACK" rule). Two concrete
  `<falcon-angular-data-table>` API gaps:
  1. **Multi-row expansion gap (deep-dive).** The admin matrix deep-dive expands MULTIPLE priority rows at
     once (`expandedPriorities: Set` in contract-details-step.component.ts). The data-table row-expansion is
     **single-row only**: `[expandedRowId]: string|number|null` + ONE `<slot name="row-expansion">`
     (Stencil `falcon-table-tw.tsx` line 1634 `String(rid)===String(this.expandedRowId)` + line 1643 single
     slot). Migrating would regress multi-expand → single-expand. The shadow-rows API DOES support multi but
     is purpose-built for inline EDIT-FORMS with column-anchored arrows (FalconDataTableShadowColDirective),
     NOT a full-width read-only breakdown panel — a fragile mismatch. (NOTE: mgmt matrix has NO deep-dive at
     all — admin/mgmt already diverge here; admin deep-dive is a 2026-06-06 placeholder re-presenting REAL
     per-destination rates, zero invented data.)
  2. **Dynamic editable columns path is zero-consumer.** The `*falconDataTableCell` directive needs a STATIC
     field, so the 11 DYNAMIC destination columns can't use it. The supported route is `ColumnDef.template`
     (a shared TemplateRef on every destination column; `lookupTemplate()` honors `col.template` first; the
     cell ctx exposes `{row, field, rowIndex, value}` and Stencil stamps `data-cell-mount={col.key}` so a
     shared template resolves the right cell via `row.cells.find(c=>c.destination===field)`). This is
     TECHNICALLY viable but has **ZERO existing consumers anywhere** (apps, libs, showcase, falcon-studio —
     grep-verified). Combined with the `@switch` late-mount cell-hydration race, migrating the editable
     matrix means shipping an unproven path + a behavior regression = exactly the fragile solution to avoid.
  - Also did NOT touch the inner deep-dive breakdown sub-table in isolation: removing only it leaves the outer
    native table anyway, further breaks admin/mgmt parity (mgmt has none), and adds risk for a placeholder.
- Rate-card `dataKey` left at default `'id'` (rows have no id; cells read row fields directly via template
  context, and the rate-card never uses selection/expansion/row-actions, so dataKey is irrelevant here).

## Files Changed (4 — all template/ts, NO models/services/i18n)
- apps/admin-console/.../contracts-add-wizard/rate-card-step/rate-card-step.component.html
- apps/admin-console/.../contracts-add-wizard/rate-card-step/rate-card-step.component.ts
- apps/management-console/.../contracts-rate-card-section/contracts-rate-card-section.component.html
- apps/management-console/.../contracts-rate-card-section/contracts-rate-card-section.component.ts

## Build + Test
- admin-console `nx build --configuration=development` → EXIT 0 (verified).
- management-console build → (pending in this session's last step).
- Contracts specs are signal/logic-based (NOT DOM-query) — none reference the rate-card native table DOM;
  matrix specs (contract-matrix-deepdive, contract-number-input) stay valid since the matrix is untouched.

## Context for Next Agent
- Branch polishing-v0.4. NO COMMITS (left in working tree per instructions).
- Authoritative editable-data-table pattern = client-applications-step (add-client wizard). The contracts
  LIST uses `[paginator]="hasRows()"`.
- If asked to migrate the matrix: first decide multi vs single expansion with product, then EITHER extend the
  data-table for multi-row full-width expansion OR drop multi-expand to single. And prove the dynamic
  `ColumnDef.template` editable path (no existing consumer) — wire a `viewChild` TemplateRef into the columns
  computed, replicate the afterNextRender mount-kick, and keep admin/mgmt in parity (mgmt currently lacks the
  deep-dive entirely).
