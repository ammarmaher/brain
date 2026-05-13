# falcon-table — OVERVIEW

## Purpose

Native HTML `<table>`-based data grid with sortable headers, row selection, skeleton loading, empty-state, pagination, frozen columns, sticky actions, scrollable mode, lazy server-side mode, global filter, and ARIA `role="grid"`. Shipped as the canonical Falcon table primitive — the rendering substrate behind `<falcon-angular-data-table>` (which projects custom Angular cells on top).

## Business / UI use case

Generic tabular data display for client/admin lists, billing entries, user lists, audit logs — anywhere a Falcon page needs a sortable, paginated, selectable grid that visually matches `admin/styles.css` `.users-table-wrap`.

## When to use it

- **Wrapped by Falcon — almost never used directly in app templates.** The expected entry point is `<falcon-angular-data-table>`, which composes `<falcon-table-tw>` plus Strategy E projection so consumers can use `<ng-template falconDataTableCell="…">`. See [`falcon-data-table/OVERVIEW.md`](../falcon-data-table/OVERVIEW.md).
- Stencil tag (`<falcon-table>` / `<falcon-table-tw>`) is suitable when working framework-agnostic (React/Vue) or when the `render()` per-column function is sufficient and you do not need Angular cell templates.
- `<falcon-angular-table>` (the basic Angular wrapper) is `@deprecated` per its own JSDoc (line 5-9 of `falcon-table.component.ts`).

## When NOT to use it

- Do NOT use `<falcon-angular-table>` for new pages — it lacks per-cell Angular templates, no row-action menu, no lazy-load wiring beyond raw `(falcon-page-change)`. Use `<falcon-angular-data-table>` instead.
- Do NOT use Stencil `<falcon-table-tw>` directly inside Angular when you need Angular templates for cells — the `hostsExternalCells=true` projection orchestrator only ships inside `<falcon-angular-data-table>`.
- Do NOT use this for tree-shaped data — that is `<falcon-angular-tree-table>` (CSS Grid recursive expandable rows).

## Status

- **ACTIVE (Stencil core):** `<falcon-table>` Shadow + `<falcon-table-tw>` Light are both shipped and consumed via `<falcon-angular-data-table>`. The Light variant is the Strategy E projection host (`hostsExternalCells` + `falcon-cells-mounted` event).
- **`<falcon-angular-table>` (basic wrapper) is `@deprecated`** — JSDoc at `falcon-table.component.ts:5-9` directs consumers to `<falcon-angular-data-table>`.
- Replaced legacy `<falcon-data-table>` (PrimeNG `p-table` wrapper) in Wave PR-7.

## Paths

- **Stencil Shadow DOM:** `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx` (685 LOC)
- **Stencil Light DOM (`-tw`):** `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` (810 LOC)
- **Stencil tags:** `<falcon-table>` (Shadow) and `<falcon-table-tw>` (Light)
- **Types:** `libs/falcon-ui-core/src/components/falcon-table/falcon-table.types.ts`
- **Tokens:** `libs/falcon-ui-tokens/src/components/table.tokens.css`
- **Tailwind helpers:** `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts`
- **Angular wrapper (basic, deprecated):** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts`
- **Angular selector (basic wrapper):** `falcon-angular-table`
- **Canonical Angular consumer:** `<falcon-angular-data-table>` (see sibling component folder)

## Consumers

- Direct consumers of `<falcon-angular-table>` or `<falcon-table>` raw in `apps/` — **NONE FOUND** (verified via grep against `apps/`).
- `<falcon-table-tw>` is consumed indirectly through `<falcon-angular-data-table>` in:
  - `apps/admin-console/.../organization-hierarchy/components/organization-hierarchy-menu.component.html`
  - `apps/management-console/.../organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html`
- Playground / showcase only — `apps/host-shell/src/app/playground/playground.page.html`

## Related components

- `falcon-angular-data-table` — preferred Angular consumer (Strategy E projection wrapper)
- `falcon-paginator` — composed in the footer when `paginated=true`
- `falcon-empty-state` — visually adjacent but not yet composed by `<falcon-table>` (default empty-cell rendering is bare text — see GAPS_AND_UPGRADES.md)
- `falcon-tree-table` — for tree-shaped data
- `falcon-filter-panel` — for filter UI above the table

## Ownership

Stencil core (Shadow + Light) + Angular basic wrapper. Maintained as the rendering substrate behind `<falcon-angular-data-table>`. Per JSDoc and active source: the Light-DOM `<falcon-table-tw>` is the source of truth (Stencil receives object props natively, emits projection mount-points when `hostsExternalCells=true`).
