---
name: data-table-alignment-contract-v1
description: Falcon Data-Table Alignment Contract v1 — unified header/body inline padding + opt-in headerInset matrix; eliminates the 17-vs-20px header drift on every Falcon table
metadata: 
  node_type: memory
  type: project
  originSessionId: 83decaa1-c904-45aa-815b-66087b5c865e
---

# Falcon Data-Table Alignment Contract v1 — 2026-05-20

🟢 BUILD-GREEN 2026-05-20 (admin-console hash `4c3cbbe166bab6a4`, 25.1s). 🔴 NOT runtime-verified — requires browser open on Add Client wizard Step 3/4 to confirm header X = body content X.

**Bug pattern**: Add Client Step 3 (CommChannels) + Step 4 (Applications) showed visibly misaligned column headers vs body content for the Price Type / Price Value / Status columns. Two compounding root causes:

1. **[CODE]** `libs/falcon-ui-tokens/src/components/table.tokens.css:52` declared `--falcon-table-header-padding-inline: 17px` while line 102 declared `--falcon-table-cell-padding-inline: 20px`. Δ = 3 px → every header outer-left lived 3 px LEFT of every body cell content edge on EVERY Falcon table (Users, Apps, Services, Comms-Hub, Contact-Groups, all wizard tables).
2. **Chromed-control internal padding**: `falcon-angular-dropdown sm` adds 1 px border + 10 px padding (dropdown.tokens.css:90); `falcon-angular-input sm` same; `falcon-angular-status-badge sm` adds 1 px + 6 px (status-badge.tokens.css:80). The control's outer-left lands at the cell content edge, but its inner text sits further right and was uncompensated.

**Why:** A data-table is only credible when columns visually align. The mismatched tokens were a latent bug since the table tokens were authored; the matrix question (header-vs-inner-text) had no API answer at all.

**How to apply:** The contract is shipped as three layers — apply in this order whenever you build a Falcon data-table:

### Layer 1 — One inline-padding contract (active by default platform-wide)
Both header `<th>` and body `<td>` consume `--falcon-table-cell-padding-inline` (20 px). The legacy `--falcon-table-header-padding-inline` is now `var(--falcon-table-cell-padding-inline)` (back-compat alias). [CODE] `table.tokens.css:57`. No consumer action required — every table on the platform now aligns at the OUTER edge.

### Layer 2 — `headerInset` opt-in per column (API shipped, currently unused)
New optional field on `ColumnDef` ([CODE] `falcon-data-table.types.ts:39`) AND `FalconTableColumnExt` ([CODE] `falcon-table.types.ts:52`). When set, the `<th>` renders inline `padding-inline-start: calc(var(--falcon-table-cell-padding-inline) + Npx)`. Body cell padding unaffected. Use to pull the header LABEL rightward to land over the INNER text of a chromed control.

### Layer 3 — Cell-template doctrine
Inside `<ng-template falconDataTableCell>`:
- **NEVER** add `pl-*` / `ms-*` / `px-*` on the immediate child — the `<td>` already owns inline padding; inner padding stacks and breaks the contract.
- Layout-only wrappers (`flex`, `flex-col`, `items-center`, `gap-1`) are fine.

## Matrix (size=sm defaults)

| Cell content kind | `headerInset` |
|---|---:|
| Plain text / number / date | 0 |
| `falcon-angular-status-badge` | 0 |
| `falcon-angular-switch` | 0 |
| `falcon-angular-input` (`iconLeft` slot) | 0 |
| `falcon-angular-input` (no iconLeft) | 11 |
| `falcon-angular-dropdown` | 11 |

At size=md add +2 px to the dropdown/input numbers (12 px control padding instead of 10 px). The contract is parametric on size; never hard-code.

## Files touched

- [CODE] `libs/falcon-ui-tokens/src/components/table.tokens.css:52-57` — header padding aliased to cell padding
- [CODE] `libs/falcon-ui-core/src/components/falcon-table/falcon-table.types.ts:46-52` — `headerInset` on `FalconTableColumnExt`
- [CODE] `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:1355-1370` — `<th>` inline style composition
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.types.ts:37-39` — `headerInset` on `ColumnDef`
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:629` — forward through `adaptColumns()`
- [BRAIN-OUT] `Brain Outputs/understanding/frontend/components/falcon-data-table/ALIGNMENT-CONTRACT.md` (NEW) — full doctrine doc

## Build status

- `nx build falcon-ui-tokens` — GREEN
- `nx build falcon-ui-core` — GREEN, 44.94s (pre-existing reserved-prop warnings only)
- `nx build admin-console` — GREEN, hash `4c3cbbe166bab6a4`, 25.1s

## Visual change scope

Approved by Ammar as a platform-wide visual baseline shift per [[feedback_visual_baseline_guardrail_2026_05_20]]. Every Falcon table's column-header outer-left shifts 3 px right (17 → 20 px). Header label X = body content X on every column. Per-column inner-text alignment is available via `headerInset` opt-in.

## Wizard step consumers — explicitly UNCHANGED

Per Ammar's choice of OUTER-edge alignment as the default policy, NO wizard step component sets `headerInset`. The `client-comm-channels-step` and `client-applications-step` columns get the universal token fix for free; the matrix is shipped as API for any future consumer that needs inner-text alignment.

## See also

- [[project_shadow_row_col_alignment_fix_2026_05_20_v2]] — earlier fix that anchored shadow content to `--falcon-table-cell-padding-inline` (the SoT this contract now extends to headers too)
- [[project_data_table_single_height_token_2026_05_19]] — the single `--falcon-table-row-height` contract; same one-token-owns-the-band pattern as Layer 1 here
- [[feedback_visual_baseline_guardrail_2026_05_20]] — guardrail rule that gates platform-wide visual changes
- [BRAIN-OUT] `Brain Outputs/understanding/frontend/components/falcon-data-table/ALIGNMENT-CONTRACT.md` — full doctrine

## Triggers to recall

`data-table alignment` / `falcon table column alignment` / `header-vs-body alignment` / `headerInset` / `cell-padding-inline contract` / `Alignment Contract v1`.
