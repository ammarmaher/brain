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

- **ACTIVE — production-critical.**
- `[CODE]` **This is the NEW cross-framework Angular wrapper, NOT a survivor of the deleted PrimeNG facade.** The legacy `<falcon-data-table>` (PrimeNG `p-table` wrapper) was **deleted in Wave PR-7** (eslint.config.mjs:295 records the migration guard: "The legacy `<falcon-data-table>` facade was deleted in Wave PR-7"). The current `falcon-angular-data-table` is a wrapper-only unit (no Stencil twin) that composes the new cross-framework `<falcon-table-tw>` Stencil core via Strategy E. It carries a "1:1 API surface with the legacy `<falcon-data-table>`" comment in its barrel (PR-4) — that means it preserves the OLD public API shape, not that it IS the old component.
- **Heavy production use** across admin-console + management-console org-hierarchy pages, templates pages, contact-groups, contracts-cost-management, and `libs/falcon` shared features.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (**1612 LOC** — recount 2026-06-03; grew ~2.4× since the prior dossier's "672", from shadow-rows + custom-footer + empty-data integration) |
| Angular template HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html` (85 ln) |
| Projection directives | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts` (179 ln — **7 directives**, not 4: the 4 cell/header/empty/loading + `FalconDataTableShadowDirective` + `FalconDataTableShadowActionsDirective` + `FalconDataTableShadowColDirective`) |
| Types | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.types.ts` (158 ln) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/index.ts` |
| Angular selector | `falcon-angular-data-table` |
| Composed Stencil tag | `<falcon-table-tw>` (Light DOM, with `hosts-external-cells=""`). **There is NO `falcon-data-table` Stencil component** — this is a wrapper-only unit (see Status). |
| Tokens consumed | `libs/falcon-ui-tokens/src/components/data-table.tokens.css` + `libs/falcon-ui-tokens/src/components/table.tokens.css` (whose `:where()` scope explicitly includes the `falcon-data-table*` host tags) |

`[CODE]` Public import path is `@falcon/ui-core/angular`; the `@falcon-ui-core/...` deep paths in code blocks are internal source paths.

## Angular projection directives

**Seven** standalone directives (one file, `falcon-data-table-cell.directive.ts`) — all imported automatically when the parent imports `FalconAngularDataTableComponent`:

| Selector | Purpose |
|---|---|
| `[falconDataTableCell]` | Per-column body-cell `<ng-template>` — `<ng-template falconDataTableCell="status" let-value="value" let-row="row" let-rowIndex="rowIndex">` |
| `[falconDataTableHeaderCell]` | Per-column header `<ng-template>` |
| `[falconDataTableEmpty]` | Empty-state slot |
| `[falconDataTableLoading]` | Loading-body slot |
| `[falconDataTableShadow]` | Shadow-row body `<ng-template>` (Wave 20) — context `FalconDataTableShadowContext<T>` |
| `[falconDataTableShadowActions]` | Shadow-row trailing-action `<ng-template>` (default Edit/Delete/Save/Cancel when not projected) |
| `[falconDataTableShadowCol]` | `[CODE]` Wave shadow-col-vars (2026-05-16) — absolutely-positions a projected shadow field above its matching parent column via `--shadow-col-{key}-left/-width` CSS vars |

The cell template context passes: `$implicit = row`, `row`, `value = row[field]`, `field`, `rowIndex`.

## Consumers in active source (grep verified 2026-06-03)

`[CODE]` grep `<falcon-angular-data-table[\s>]` across `*.html` → **10 real render-sites** (folder is now `org-hierarchy-page/`, not the stale `organization-hierarchy/`):

1. `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html` (×2 each — users list)
2. `apps/{admin,management}-console/.../templates-page/components/templates-list.component.html` + `templates-details/templates-details.component.html` (×4)
3. `apps/management-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html`
4. `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/{client-comm-channels-step, client-applications-step}.component.html` (×2)
5. `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html` (the shared pricing table)

Plus `comm-mkt-view` (libs/falcon) and `contracts-cost-management` (both consoles) reference the wrapper indirectly via shared components. See USAGE.md Consumer Sweep for the full enumerated list. (NOTE: the prior dossier's `organization-hierarchy/.../organization-hierarchy-menu.component.html:147-196` path is gone — folder renamed.)

## Related components

- `falcon-table` — the underlying Stencil core (Strategy E projection target)
- `falcon-paginator` — composed in the footer
- `falcon-angular-menu` — row-action menu (the `⋮` popup)
- `falcon-empty-state` — composable via `<ng-template falconDataTableEmpty>` (consumer-provided; default falls back to text via `emptyMessageKey` / `emptyMessage`)
- `falcon-angular-status-badge` / `falcon-angular-tag` — typical cell templates (consumer-provided)
- `falcon-angular-avatar` — typical user-row cell

## Ownership

Strategic Falcon wrapper — Wave PR-7 onwards. The Angular team owns the projection orchestrator; the Stencil core (`<falcon-table-tw>`) owns the rendering substrate; the directive file owns the slot semantics. Migration target for every legacy PrimeNG `<p-table>` consumer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08). Wrapper recounted at 1612 LOC (was "672"); 7 projection directives (was 4); confirmed wrapper-only (no Stencil twin) — the NEW cross-framework wrapper, NOT a survivor (legacy PrimeNG facade deleted Wave PR-7 per eslint.config.mjs:295). Consumer sweep re-run → 10 HTML render-sites on `org-hierarchy-page/` paths.
