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

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-filter-panel/falcon-filter-panel.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-filter-panel-tw/falcon-filter-panel-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-filter-panel/falcon-filter-panel.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/filter-panel.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/filter-panel-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-filter-panel/falcon-filter-panel.component.ts`
- Angular selector: `falcon-angular-filter-panel`

## Consumers

- Not yet consumed in production feature pages (verified via grep over apps/).
- Playground + showcase only.

## Related components

- `falcon-input` / `falcon-dropdown` — atoms that this component composes internally (native today; Falcon-atom migration deferred)
- `falcon-table` / `falcon-data-table` — typically rendered below this strip
- `falcon-button` — Apply / Clear All buttons

## Ownership

Stencil core + Angular wrapper. The filter types are public contract — see API.md.
