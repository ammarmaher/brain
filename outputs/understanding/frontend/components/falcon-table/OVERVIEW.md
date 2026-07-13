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

## Source file paths

| Layer | Path |
|---|---|
| Stencil Shadow DOM | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx` (**690 LOC** — recount 2026-06-03) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css` (474 ln) |
| Stencil Light DOM (`-tw`) | `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` (**1702 LOC** — recount 2026-06-03; grew ~2× since prior dossier, from the shadow-row + row-expansion + actions twin-slot work) |
| Stencil Light CSS (`-tw`) | `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.css` (162 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.types.ts` (**227 ln** — incl. shadow-row + `headerInset` Alignment-Contract field) |
| Tokens | `libs/falcon-ui-tokens/src/components/table.tokens.css` (gate-12 `:where()` scope ALSO covers the `falcon-data-table*` host tags) |
| Tailwind helpers | `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` |
| Angular wrapper (basic, deprecated) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts` (207 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.html` (50 ln) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.css` (4 ln) |
| Stencil Light spec | `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.shadow.spec.ts` (**346 ln, 16 specs** — Jest `newSpecPage`; shadow-row internals — ADDED Wave 22A; the prior dossier's "no spec exists" claim is now STALE) |
| Angular selector (basic wrapper) | `falcon-angular-table` |
| Canonical Angular consumer | `<falcon-angular-data-table>` (own dossier — the consumer surface) |

`[CODE]` Public import path is `@falcon/ui-core/angular` (`[MEMORY]` FE structure standard); the `@falcon-ui-core/...` deep paths in this dossier's code blocks are the internal source paths.

## Consumers (grep verified 2026-06-03)

- `[CODE]` **Direct `<falcon-angular-table>` (basic wrapper) usage: ZERO.** grep `<falcon-angular-table[\s>]` across the workspace returns ONLY comments / eslint guard / app.config doc-comments / `data-table-skeleton-defaults.token.ts` references — **no render-site anywhere**. The Wave-7 "1 = playground" consumer is gone (playground route removed). The deprecated basic wrapper is now genuinely unused.
- `[CODE]` **Direct `<falcon-table>` Shadow raw usage in `apps/`: NONE.**
- `<falcon-table-tw>` is consumed indirectly through `<falcon-angular-data-table>` (10 real HTML render-sites — see that dossier's Consumer Sweep) AND **directly** as a Stencil tag by the wallet feature (`apps/{admin,management}-console/.../wallet-balance-management/wallet-balance-management.component.ts` projects body content into `<falcon-tree-table-tw>` / `<falcon-card-tw>`, not `<falcon-table-tw>`).

## Related components

- `falcon-angular-data-table` — preferred Angular consumer (Strategy E projection wrapper)
- `falcon-paginator` — composed in the footer when `paginated=true`
- `falcon-empty-state` — visually adjacent but not yet composed by `<falcon-table>` (default empty-cell rendering is bare text — see GAPS_AND_UPGRADES.md)
- `falcon-tree-table` — for tree-shaped data
- `falcon-filter-panel` — for filter UI above the table

## Ownership

Stencil core (Shadow + Light) + Angular basic wrapper. Maintained as the rendering substrate behind `<falcon-angular-data-table>`. Per JSDoc and active source: the Light-DOM `<falcon-table-tw>` is the source of truth (Stencil receives object props natively, emits projection mount-points when `hostsExternalCells=true`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08 sweep). Source-file table recounted on disk (Shadow 690 ln, `-tw` 1702 ln, types 227 ln); a 16-spec Stencil spec now exists (`falcon-table-tw.shadow.spec.ts`); the basic `<falcon-angular-table>` wrapper has ZERO render consumers. The flagship FT-01 P0 PrimeIcon finding is **RESOLVED in live source** — see GAPS_AND_UPGRADES.md / API.md.
