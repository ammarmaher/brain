# falcon-filter-panel — OVERVIEW

## Purpose

Horizontal row of typed filter inputs (text / select / date / daterange) with optional Apply + Clear All actions. Sits above a list/table and emits per-field change events + full filter values on apply.

## Business / UI use case

Admin filter strip. Pre-PR-3, this is the way to filter lists in Falcon — the table's built-in global filter (PR-3) covers only one search input. For multi-field filtering (status select + date range + free-text), use this component above the table.

## When to use it

- Multi-field filter UI above a list / table.
- Filter values driven by external state (signals / store).
- Standalone — not composed inside the table.

## When NOT to use it

- For a single search input above a table — use the table's `[showGlobalFilter]` + `[globalFilterFields]` PR-3 feature.
- For per-column filtering — not supported; the table itself reserved `internalFilters` state (`falcon-table-tw.tsx:181`) but no UI ships.

## Status

ACTIVE — Stencil Shadow + Light (`<falcon-filter-panel-tw>`). Angular wrapper `<falcon-angular-filter-panel>` (output-only, no CVA — no single value).

## Paths

| Layer | Path |
|---|---|
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-filter-panel/falcon-filter-panel.tsx` (192 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-filter-panel/falcon-filter-panel.css` (135 ln — token-with-fallback) |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-filter-panel-tw/falcon-filter-panel-tw.tsx` (205 ln) |
| Stencil Light CSS | _none_ — `[CODE]` the `-tw` variant has no styleUrl (`shadow:false`, classes only) |
| Types | `libs/falcon-ui-core/src/components/falcon-filter-panel/falcon-filter-panel.types.ts` (28 ln) |
| Tokens | `libs/falcon-ui-tokens/src/components/filter-panel.tokens.css` (70 ln) |
| Tailwind helpers | `libs/falcon-ui-core/src/tailwind/filter-panel-tailwind-classes.ts` (96 ln) |
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-filter-panel/falcon-filter-panel.component.ts` (73 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-filter-panel/falcon-filter-panel.component.html` (34 ln — pure tag-switcher) |
| Angular selector | `falcon-angular-filter-panel` |
| Spec/tests | _none found_ (FFP-04) |

## Consumers (grep verified 2026-06-03)

- `[CODE]` **0 consumers** — `<falcon-angular-filter-panel>` / `<falcon-filter-panel>` / `<falcon-filter-panel-tw>` appear in NO `apps/` or `libs/falcon` file (re-confirmed B12, unchanged since Wave 7).
- `[CODE]` Only the TYPES are re-exported from the main `falcon-ui-core` barrel (`index.ts:105/109` → `FalconFilterPanelDensity` + the types file). The wrapper class itself is reachable via `@falcon/ui-core/angular` but is imported by nobody.
- Built but **unadopted** — showcase/playground only (and no showcase render found in apps/ this pass).

## Related components

- `falcon-input` / `falcon-dropdown` — atoms that this component composes internally (native today; Falcon-atom migration deferred)
- `falcon-table` / `falcon-data-table` — typically rendered below this strip
- `falcon-button` — Apply / Clear All buttons

## Ownership

Stencil core + Angular wrapper. The filter types are public contract — see API.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). Paths + line counts re-confirmed; 0 consumers re-verified (grep, both selectors, apps + libs/falcon); only the TYPES are barrel-exported (index.ts:105/109). Status NEEDS-UPGRADE (native atoms) carried forward from DECISION.
