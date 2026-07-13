# falcon-custom-table-footer — OVERVIEW

> [!note] Angular-only composite (no Stencil twin)
> Unlike most `falcon-ui-core` components, `falcon-custom-table-footer` is a **pure Angular standalone component** — there is NO Stencil Shadow tag, no `-tw` Light twin, and no `falcon-ui-tokens` component file of its own. It is a thin composition layer that wraps `<falcon-angular-paginator>` and arranges it in a 3-section footer. Adapt the usual dual-render dossier accordingly.

## Component purpose

`[CODE]` falcon-custom-table-footer.component.ts:1-11 — A **3-section pagination footer** for `<falcon-angular-data-table>`. Layout: `[Showing X-Y from Z]  [« ‹ [page] of N › »]  [Rows per page ▾]`. It owns the page math (total pages / first / last) and composes `<falcon-angular-paginator>` for the center nav cluster. Promoted from `apps/admin-console` into the library in **Wave 19 (19th iter, 2026-05-14)** so the data-table can render it INTERNALLY — consumers pass values once to the data-table, which forwards them to this footer.

## Business / UI use case

`[BRAIN-OUT]` The default footer band under every paginated Falcon data table: it tells the operator *which slice* of a paged dataset they are viewing ("Showing 41 - 60 from 195"), lets them step through pages, and lets them pick the page size. It is the **internal** footer of `<falcon-angular-data-table>` (`showCustomFooter` defaults `true`), replacing the bare Stencil paginator footer with a richer three-region band.

## When to use it / when NOT to use it

**Use it:**
- Implicitly — it is the default footer of `<falcon-angular-data-table>` (`[showCustomFooter]="true"` by default). You normally never mount it yourself.
- Directly (rare) only if you are building a custom table shell that wants this exact 3-section footer without the full data-table.

**Do NOT use it for:**
- A standalone numeric strip with no "Showing X of Y" / "Rows per page" chrome → use `<falcon-angular-paginator>` directly.
- A simple "load more" or infinite-scroll list → not a paginated-footer pattern.
- Mounting as a SIBLING next to a data-table — `[CODE]` falcon-data-table.component.html:69 explicitly warns the footer is "entirely internal — no separate footer component should be mounted as a sibling."

## Status

`[CODE]` **ACTIVE / library-promoted (Wave 19).** Modern signals-first Angular: `input.required()` / `input()` / `output()` / `computed()`, standalone, `OnPush`. It is the **DEFAULT** data-table footer. Not deprecated.

## Replaces

- `[CODE]` The per-app footer that previously lived in `apps/admin-console` (promoted into the library in Wave 19).
- The bare Stencil paginator footer of `<falcon-angular-data-table>` (now opt-in via `[showCustomFooter]="false"`).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.ts` (71 ln) |
| Angular component HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html` (45 ln) |
| Angular component CSS | **NONE** — the component has no `styleUrl`; it is styled entirely by Tailwind utilities + a `host: { class: 'block w-full' }`. |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/index.ts` (2 ln) |
| Stencil Shadow / Light | **NONE** — Angular-only composite. |
| Types | **NONE** — primitives only (`number` / `boolean` / `string` / `readonly number[]`). |
| Token file | **NONE** of its own. Reads `--falcon-table-row-height` (from `libs/falcon-ui-tokens/src/components/table.tokens.css:109`, = 52px) + theme utilities (`bg-falcon-neutral-30`, `text-falcon-neutral-600`, etc.). |
| Composed atom | `<falcon-angular-paginator>` (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/`). |
| Spec / e2e | **NONE.** |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-custom-table-footer` |
| Class | `FalconAngularCustomTableFooterComponent` |

> NOTE the batch slug is `falcon-custom-table-footer` (folder + barrel name); the rendered SELECTOR is `falcon-angular-custom-table-footer` (the `-angular-` infix that every Angular wrapper uses).

## Known consumers (grep verified 2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-custom-table-footer` → exactly **1 render consumer**:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html:71` — `<falcon-angular-data-table>` renders it internally inside an `@if (showCustomFooter)` block (default true), forwarding `totalRecords` / `currentPage` / `rows` / `rowsPerPageOptions` / `_isEmpty()` (disabled) + the three footer labels, and re-emitting its `(pageChange)` / `(rowsChange)`.

Class-import references: `angular-wrapper/index.ts:64` (barrel `export *`) + `falcon-data-table.component.ts:70/131` (import + `imports:` array). No app-level direct consumer.

## Related components

- `<falcon-angular-data-table>` — the SOLE consumer; renders this as its internal footer.
- `<falcon-angular-paginator>` — composed by this footer for the center nav cluster (this footer is paginator's SOLE wrapper consumer — see paginator dossier).
- `<falcon-angular-dropdown>` — the rows-per-page region SHOULD use this Falcon atom but currently uses a native `<select>` (GAP).

## Ownership / responsibility

`libs/falcon-ui-core` (Angular wrapper layer). Owned by the Falcon UI team. It owns the footer page-math (`totalPages`/`first`/`last` computeds) and the 3-section layout; it owns NO tokens (reuses table + theme tokens) and NO backend wiring.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED). New 9-file dossier built from scratch. Source: `.component.ts` (71 ln) + `.component.html` (45 ln) + `index.ts` (2 ln). Confirmed Angular-only composite (no Stencil/`-tw`/types/css/own-tokens), modern signals API, sole consumer = `<falcon-angular-data-table>` (default footer), composes `<falcon-angular-paginator>`.
