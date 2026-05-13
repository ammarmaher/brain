# falcon-data-table — OVERVIEW

## Purpose

Production-grade Angular data table. The CANONICAL Angular consumer for tabular data in Falcon apps. Composes `<falcon-table-tw>` (Light DOM Stencil core) via the **Strategy E projection orchestrator** — subscribes to the Stencil `falcon-cells-mounted` event and mounts Angular `EmbeddedViewRef` root-nodes directly into `<td data-cell-mount=…>` cells. This is how `<ng-template falconDataTableCell="…">` projection works.

## Business / UI use case

Any Angular list view requiring sortable columns, row selection, paginated/lazy data, row-action menu, custom per-column cell templates, and Falcon visual chrome — admin users list, hierarchy tree leaves, billing entries, audit logs, etc.

## When to use it

- Every new Angular list / table page.
- When you need `<ng-template falconDataTableCell>` per-column custom templates (e.g. coloured status pill, avatar, action buttons inside a cell).
- When you need row-action `⋮` menu wired to per-row visibility / disabled / enable-flag.
- When you need server-side pagination (`[lazy]="true"` + `(lazyLoad)` event).
- When you want Falcon-styled global filter via `[showGlobalFilter]="true"` + `[globalFilterFields]="[…]"`.

## When NOT to use it

- Tree-shaped data → use `<falcon-angular-tree-table>` (CSS Grid recursive).
- Org hierarchy with nested actions → use `<falcon-organization-hierarchy-tree-tw>` (Light DOM only).
- Cross-framework mounts → use `<falcon-table-tw>` (Stencil tag) directly.
- Form controls — this is not a form input. No `[(ngModel)]`. Selection is two-way via `[(selection)]` only.

## Status

- **ACTIVE — production-critical.** Replaced legacy `<falcon-data-table>` (PrimeNG `p-table` wrapper) in Wave PR-7.
- **Heavy production use** across admin-console + management-console org-hierarchy pages.

## Paths

- **Angular wrapper:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (672 LOC)
- **Angular template:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html` (51 lines)
- **Projection directives:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts` (43 lines, four directives)
- **Types:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.types.ts`
- **Barrel:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/index.ts`
- **Angular selector:** `falcon-angular-data-table`
- **Composed Stencil tag:** `<falcon-table-tw>` (Light DOM, with `hostsExternalCells=""`)
- **Tokens consumed:** `libs/falcon-ui-tokens/src/components/data-table.tokens.css` (207 lines — wraps the legacy `<falcon-data-table>` token surface) + `libs/falcon-ui-tokens/src/components/table.tokens.css`

## Angular projection directives

Four standalone directives (one file) — all imported automatically when the parent imports `FalconAngularDataTableComponent`:

| Selector | Purpose |
|---|---|
| `[falconDataTableCell]` | Per-column body-cell `<ng-template>` — `<ng-template falconDataTableCell="status" let-value="value" let-row="row" let-rowIndex="rowIndex">` |
| `[falconDataTableHeaderCell]` | Per-column header `<ng-template>` |
| `[falconDataTableEmpty]` | Empty-state slot |
| `[falconDataTableLoading]` | Loading-body slot |

The template context passes: `$implicit = row`, `row`, `value = row[field]`, `field`, `rowIndex` — see `falcon-data-table.component.ts:460-471`.

## Consumers in active source

Verified via grep over `apps/`:

1. **admin-console — organization-hierarchy users list:**
   `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html:147-196`
   - Uses `[data]`, `[columns]`, `[rowMenuItems]`, `[paginator]="true"`, `[loading]`, `[lazy]`, `[totalRecords]`, `[rows]`, `emptyMessageKey`, `(lazyLoad)`, `(rowAction)`.
   - Inside: `<ng-template falconDataTableCell="status" let-value="value">` renders a status chip per state.

2. **management-console — organization-hierarchy-page users list:**
   `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html`
   - Same pattern as admin-console.

3. **State services:**
   - `apps/admin-console/.../organization-hierarchy/services/hierarchy-page-state.service.ts:218-230` — declares `userColumns: ColumnDef[]` + `userRowMenuItems: FalconDataTableMenuItem[]`.
   - `apps/admin-console/.../organization-hierarchy/services/services.ts` references types.
   - `apps/management-console/.../organization-hierarchy-page/services/hierarchy-page-state.service.ts` parallels.
   - `apps/admin-console/.../organization-hierarchy/models/models.ts` + `apps/management-console/.../organization-hierarchy-page/models/models.ts` declare `FalconDataTableRowAction<User>` etc.

## Related components

- `falcon-table` — the underlying Stencil core (Strategy E projection target)
- `falcon-paginator` — composed in the footer
- `falcon-angular-menu` — row-action menu (the `⋮` popup)
- `falcon-empty-state` — composable via `<ng-template falconDataTableEmpty>` (consumer-provided; default falls back to text via `emptyMessageKey` / `emptyMessage`)
- `falcon-angular-status-badge` / `falcon-angular-tag` — typical cell templates (consumer-provided)
- `falcon-angular-avatar` — typical user-row cell

## Ownership

Strategic Falcon wrapper — Wave PR-7 onwards. The Angular team owns the projection orchestrator; the Stencil core (`<falcon-table-tw>`) owns the rendering substrate; the directive file owns the slot semantics. Migration target for every legacy PrimeNG `<p-table>` consumer.
