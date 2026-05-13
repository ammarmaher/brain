# falcon-empty-state — OVERVIEW

## Purpose

Visual placeholder for empty lists / searches / dashboards. Icon + title + description + action slot. Architect §5.12.1 foundation. Wave 9.E.

## Business / UI use case

"No users found", "No results match your search", "Welcome — invite teammates to get started" — any state where a list or page has no data and the user needs guidance toward an action.

## When to use it

- Empty data-table state (project via `<ng-template falconDataTableEmpty>`).
- Empty dashboard / search-result page.
- First-run / zero-state pages.

## When NOT to use it

- Loading states (use the table's `[loading]` skeleton instead).
- Permanent labels / static UI.

## Status

ACTIVE — Stencil Shadow + Light. Angular wrapper `<falcon-angular-empty-state>` with dual-render-path.

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-empty-state-tw/falcon-empty-state-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/empty-state.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/empty-state-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/falcon-empty-state.component.ts`
- Angular selector: `falcon-angular-empty-state`

## Consumers

- No direct `<falcon-angular-empty-state>` use found in `apps/` via grep.
- Playground / showcase only.

## Related components

- `<falcon-data-table>` — composed via `<ng-template falconDataTableEmpty>`
- `<falcon-table>` core — does NOT compose this yet (gap noted in `falcon-table/GAPS_AND_UPGRADES.md` FT-05)
- `<falcon-angular-button>` — typical action inside the empty state action slot

## Ownership

Stencil + Angular wrapper. Wave 9.E foundation. The Stencil component declares an `action` slot for the action button.
