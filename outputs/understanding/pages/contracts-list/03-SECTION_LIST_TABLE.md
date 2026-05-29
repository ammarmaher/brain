*** Contracts List — Section: List table ***
*** The 9-column contracts table · 2026-05-18 ***

# Contracts List — List Table

> The 9-column paginated table that lists contracts for the selected account. **Local component** — `<app-contracts-data-table>`, NOT the shared `<falcon-angular-data-table>`.

## Component

[CODE] `apps/admin-console/src/app/shared/components/contracts-data-table/contracts-data-table.component.ts`:

- Selector: `app-contracts-data-table`
- Standalone, OnPush
- Local paginated implementation — NOT lazy-loaded, all rows fetched at once

## Inputs

```typescript
@Input() rows: ContractRow[] = [];
@Input() columns: TableColumn[] = [];
@Input() rowClassFn?: (row: ContractRow) => string;
@Input() loading = false;
```

## Outputs

```typescript
@Output() rowClick = new EventEmitter<ContractRow>();
@Output() kebabAction = new EventEmitter<{ row: ContractRow; action: string }>();
```

## Columns (9 total)

[CODE] `contracts-cost-management.component.ts:261-322` — `buildColumns()`:

| # | Header (en/ar) | Field | Sort? | Format function |
|---|---|---|---|---|
| 1 | # / # | `id` | NO | identity |
| 2 | Contract Name / اسم العقد | `contractName` | NO | string |
| 3 | Farabi Ref Id / معرف فربي | `farabiReferenceId` | NO | string |
| 4 | Creation Date / تاريخ الإنشاء | `createdAt` | NO | `Intl.DateTimeFormat(locale, dd-MMM-yyyy)` |
| 5 | Start Date / تاريخ البدء | `startDate` | NO | same |
| 6 | Expiration Date / تاريخ الانتهاء | `endDate` | NO | same |
| 7 | Value / القيمة | `committedValue` | NO | `Intl.NumberFormat(locale, currency:'SAR')` |
| 8 | Remaining Value / القيمة المتبقية | `remainingValue` | NO | same (or "—" if charging down) |
| 9 | Status / الحالة | `status` | NO | pill (see below) |

> **NO column sort headers** in old-UI. Flagged as GAP-CC-LIST-NOSORT.

## Status pill rendering

[CODE] `view-contract.component.ts:137-146`:

```typescript
getStatusPillClasses(status: string): string {
  switch (status) {
    case 'pending':
      return 'border-falcon-neutral-300 bg-falcon-neutral-75 text-falcon-neutral-900';
    case 'expired':
      return 'border-falcon-red-300 bg-falcon-red-75 text-falcon-red-900';
    case 'active':
      return 'border-falcon-teal-900 bg-falcon-green-150 text-falcon-teal-900';
  }
}
```

## Row coloring

[CODE] `contractRowClass(row)` lines 190-199:

```typescript
contractRowClass(row: ContractRow): string {
  if (row.status === 'pending') return 'bg-falcon-green-25';
  if (row.status === 'expired') return 'bg-falcon-lilac-25';
  return '';
}
```

## Date format

[CODE] `buildColumns()` formatter lines 348-354:

```typescript
const locale = this.translateService.currentLang === 'ar' ? 'ar' : 'en-US';
return new Intl.DateTimeFormat(locale, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(date).replace(/ /g, '-');
// Produces: "15-May-2026" (en) or "15-أيار-2026" (ar)
```

## Kebab actions per row

| Action | Visible when | Effect |
|---|---|---|
| View | always | `mode = 'view'` + `getContract(row.id)` |
| Edit | `row.canEdit === true` | `mode = 'edit'` + load |
| Extend | `row.status === 'expired'` (?) | [INFERRED] extends end date via same `PUT commerce/Contracts/{id}` |
| Delete | (likely PES-gated, not in old-UI) | future endpoint TBD |

[INFERRED] `canEdit` is a server-side flag on `ApiContractResponse` that captures business rule for whether status + role allow edit.

## Click-row behavior

Whole row is clickable — emits `(rowClick)` event → container sets `mode = 'view'`.

## Empty states

| Condition | UI |
|---|---|
| No account selected | `<app-contracts-empty-state title="Select an account" message="...">` |
| No contracts for account | `<app-contracts-empty-state title="No contracts" message="...">` + Add button |
| No wallet strategy | `<app-contracts-empty-state title="Wallet not configured" message="...">` · NO Add button |
| Loading | Skeleton rows |

## Falcon component composition (NEW UI target)

| Element | Falcon component | Customization |
|---|---|---|
| Table | `<falcon-angular-data-table>` (the canonical one) OR keep local | Per [MEMORY] `project_add_client_wizard_plain_table` — plain `<table>` + `@for` is acceptable for simple read-only edit-in-place. For sortable/filterable lists, USE `<falcon-angular-data-table>`. |
| Status pill | `<falcon-tag>` | color per status |
| Kebab menu | `<falcon-menu>` | options per row |
| Row coloring | Tailwind utility class via `[ngClass]` or `[class.*]` bindings |  |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-SECTION_EMPTY_STATES](04-SECTION_EMPTY_STATES.md) · [09-COMPONENTS](09-COMPONENTS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
