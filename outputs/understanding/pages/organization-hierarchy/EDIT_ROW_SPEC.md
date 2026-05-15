# Edit Row Spec — Comm Channels & Services (LOCKED, awaiting user sign-off)

> **Status:** DRAFT — pending Ammar approval. Round 6 will not start until this spec is signed off.
> **Author:** Adnan (extracted from user rejection of Round 5).
> **Last updated:** 2026-05-15.

This document is the **single source of truth** for what the comm-channels edit-row must do. Any prior implementation (Wave 14 top-drawer, Round 3 flat-stripe-at-top, Round 5 row-expansion-above-thead) is **rejected**.

---

## Trigger

User clicks the Actions kebab on a row → menu opens → user clicks **Edit Price Type** OR **Edit Price Value**.

## Structural anchor (the part Rounds 1–5 got wrong)

The edit form **MUST** render in the DOM **directly below the row being edited**, between that row and the next data row. Not at the top of the table. Not below the table. Not as a fixed drawer. **Inline, between the edited row and the next.**

Mechanism: Falcon Data Table row-expansion API. Render a single `<tr>` with `colspan="<n>"` that hosts a `<ng-template>` projected via the table's expansion slot.

## Edit-row layout

The edit-row visually mirrors the table header structure:

```
┌────────────┬──────────┬────────────┬──────────────┬─────────────────┬─────────────────┬──────────────┬─────────┬─────────┐
│ Visibility │ Name     │ Price Type │ Price Value  │ First Activation│ Activation Date │ Renew Date   │ Status  │ Action  │  ← real header
├────────────┼──────────┼────────────┼──────────────┼─────────────────┼─────────────────┼──────────────┼─────────┼─────────┤
│   [tog]    │ SMS Gtw  │ Monthly    │ ₪ 4,500      │  2/1/2024       │  2/1/2025       │  2/1/2026    │ Active  │  ⋮      │  ← edited data row
├────────────┴──────────┴────────────┴──────────────┴─────────────────┴─────────────────┴──────────────┴─────────┴─────────┤
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐    │  ← inline expand-row
│ │           (empty)    (empty) │ [dropdown ]│ [number    ] │ (empty)         │ [datepicker]    │ (empty)      │ (empty) │   [Cancel] [Save] │
│ │                              │ New Price  │ New Price    │                 │ Effective       │              │         │                   │
│ │                              │ Type       │ Value        │                 │ Date            │              │         │                   │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘    │
├────────────┬──────────┬────────────┬──────────────┬─────────────────┬─────────────────┬──────────────┬─────────┬─────────┤
│   [tog]    │ Whatsapp │ Monthly    │ ₪ 3,200      │  ...            │  ...            │  ...         │ Active  │  ⋮      │  ← next data row
└────────────┴──────────┴────────────┴──────────────┴─────────────────┴─────────────────┴──────────────┴─────────┴─────────┘
```

Notes:

- The edit-row spans the full table width via `colspan`.
- Each input sits **under the column it relates to**:
  - Price Type column → dropdown (`<falcon-angular-dropdown>`)
  - Price Value column → number input (`<falcon-angular-input type="number">`)
  - Activation Date column → calendar (`<falcon-angular-date-picker>`)
  - Other columns → empty cell (preserve column widths)
- Field labels (`New Price Type`, `New Price Value`, `Effective Date`) sit above their inputs as small captions or inline.
- The expand-row background is a soft tint (`#F3F8F5` or equivalent token `--falcon-table-expand-row-bg`) — NOT a bubble, NOT a notch, NOT a separate card.
- **Cancel** and **Save** buttons are right-aligned within the expand-row, typically under the Status/Action columns.

## Save behavior

1. Click Save.
2. The edit-row collapses (the `<tr>` is removed from the DOM or hidden).
3. A **chevron / expand-toggle indicator** appears in the **Actions column** of the edited data row (alongside or replacing the kebab while a staged change exists). Suggested icon: `chevron-down` from the Falcon icon font.
4. Clicking the chevron **re-expands** the row to show the staged change as a read-only summary (the dropdown / value / date the user entered).
5. The edited values persist in component state (no backend wire — matches React SoT, in-memory only — see `org-hierarchy-page-menu.component.ts:318` comment).
6. The data row itself does NOT yet display the new value in its main cells. The new value lives in the expand-row staging area until a separate "commit changes" action elsewhere on the page (out of scope for this spec) promotes it.

## Cancel behavior

1. Click Cancel.
2. The edit-row collapses with no staged state.
3. No chevron appears (because there's nothing to inspect).
4. No network call.

## Multiple-edit behavior

User can edit Price Type and Price Value on the **same row** in sequence:

- After saving Price Value, click kebab → Edit Price Type → the same expand-row re-opens with the Price Type field now active, Price Value showing the staged value as read-only context.
- Both staged changes coexist under one chevron.
- The chevron expansion shows both staged fields.

User can edit Price on **different rows**:

- Each row independently shows its own chevron when it has a staged change.
- Opening one row's edit-row does NOT collapse another row's chevron-summary.

## Component contract

`falcon-angular-data-table` (or `falcon-table-tw` host) MUST support:

```html
<falcon-angular-data-table
  [rows]="rows"
  [columns]="columns"
  [expandedRowId]="editingRowId"
>
  <ng-template falconRowExpansion let-row>
    <!-- Edit form rendered here -->
  </ng-template>
</falcon-angular-data-table>
```

Required API:

- `[expandedRowId]` two-way bound input (or `[(expandedRowId)]`) controlling which row is expanded.
- `<ng-template falconRowExpansion>` directive marker for the projected template.
- The rendered template MUST be in a `<tr><td colspan="N">` wrapper auto-generated by the table — consumer does NOT write the `<tr>`.
- Backward compatible: tables not using row-expansion render normally with no expand-row markup.

If the existing `falcon-table-tw` Stencil component cannot satisfy this contract: **upgrade the Stencil component** in `libs/falcon-ui-core` with a backward-compatible slot/event. Author the upgrade in the Falcon library, NOT in the feature consumer.

## Chevron / Action column

The Action column hosts:

- The kebab menu (existing) — always present.
- The chevron toggle — present ONLY when the row has a staged change.

Suggested DOM:

```html
<td class="actions-cell">
  <button class="action-chevron" *ngIf="row.hasStagedChange" (click)="toggleStagedView(row.id)">
    <falcon-icon name="chevron-down" />
  </button>
  <button class="action-kebab" (click)="openMenu(row.id)">
    <falcon-icon name="more-vertical" />
  </button>
</td>
```

Chevron animation: 200 ms rotate 0 → 180 deg when expanded.

## Test values (Ammar to confirm)

Round 6 will run these canonical test cases. **Ammar please confirm or supply alternates:**

| TC | Row | Edit type | Value | Expected staged state |
|---|---|---|---|---|
| TC1 | SMS Gateway | Price Value | 4500 → 5000 | Chevron appears; expand shows New Price Value 5000 |
| TC2 | WhatsApp Business | Price Type | Monthly → Quarterly | Chevron appears; expand shows New Price Type Quarterly + Effective Date prompt |
| TC3 | Email Relay | both | Yearly → Monthly + 8400 → 7500 | Chevron expand shows both staged fields |
| TC4 | Voice IVR (Expired status) | Price Value | 7800 → 8500 | Same as TC1 (status doesn't change behavior) |
| TC5 | Open TC1, then Cancel | n/a | n/a | No chevron appears |
| TC6 | TC1, then click chevron | n/a | n/a | Row re-expands; staged state visible |
| TC7 | TC1, then edit a 2nd row | SMS Gateway 4500→5000, then WhatsApp 3200→3500 | n/a | Both rows have independent chevrons |

## Acceptance criteria (Round 6 must satisfy ALL)

1. Chrome-MCP screenshot of dest with edit-row open visually matches the user's source-of-truth screenshot for the same row, same edit type.
2. The edit-row is in the DOM directly below the edited row (verified via DOM snapshot: edit-row TR's `previousElementSibling` is the edited row's TR).
3. After Save, chevron is visible in the Actions cell of the edited row (DOM-verified).
4. Clicking the chevron re-expands the row to show staged values.
5. Cancel produces no chevron and no staged state.
6. Multiple edits across multiple rows coexist as independent chevrons.
7. All 7 test cases above pass with screenshot evidence per case.
8. Build green: `nx build admin-console` + `nx build falcon-ui-core`.
9. User signs off — no agent self-report counts.
