---
name: feedback-falcon-no-native-html-use-components
description: "User mandate — ALWAYS use Falcon custom components, NEVER native HTML (tables/inputs/selects) in the FE"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

2026-06-06 user (verbatim intent): "always use our custom component, don't add the native HTML — this is not valid." Applies to ALL Falcon web-platform FE work.

- Native `<table>/<thead>/<tbody>/<tr>/<td>/<th>`, `<input>`, `<select>` are NOT acceptable. Tabular data MUST use `<falcon-angular-data-table>` (+ `[paginator]`), inputs use `<falcon-angular-input(-number)>` / `<falcon-angular-dropdown>`, etc.

**Why:** It's the platform's Falcon-components-over-raw-UI standard (also encoded in night-shift-audit §2 + [[reference_fe_structure_standard_angular21_2026_06_02]]); the user enforces it strictly on review.

**How to apply:** For a table, copy the proven editable-data-table pattern in `apps/admin-console/.../add-client-wizard/client-applications-step/client-applications-step.component.{html,ts}`: build `ColumnDef[]` (`columns()` computed), put cell content in `*falconDataTableCell="<field>"` templates, wire `[paginator]="true" [rows]="N" [rowsPerPageOptions]`, and add the `afterNextRender` mount-kick + fresh `viewRows()` reference (cells fail to project on `@switch` late-mount otherwise). Required-asterisks go in header templates.

⚠️ `<falcon-angular-data-table>` API gaps (verified 2026-06-06): (1) row-expansion is SINGLE-row only (`[expandedRowId]` + one `row-expansion` slot) — no multi-row; (2) `*falconDataTableCell` needs a STATIC field, so DYNAMIC editable columns must use `ColumnDef.template` (a shared `viewChild` TemplateRef; cell context exposes `{row, field, rowIndex, value}`) — this path had NO other consumers, so test it. Both gaps hit when migrating the contracts rate-MATRIX (resolved by removing the non-SoT deep-dive + using ColumnDef.template). Done in [[project_contract_consumed_offered_C_and_ratetables_2026_06_06]].
