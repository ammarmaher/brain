# falcon-tree-table — OVERVIEW

## Purpose

CSS Grid-based recursive expandable table for tree-shaped tabular data. NOT a real `<table>` — a single grid container holds the header row + every visible (expanded) row. Indentation via `padding-inline-start: depth * --falcon-tree-table-indent-step`. Mirrors `admin/wallet.css:366-456` `multi-2` / `multi-3` / `multi-4` / `multi-5` patterns through a dynamic `grid-template-columns` calculation.

## Business / UI use case

Wallet hierarchy, accounts tree-of-balances, any tree-with-per-row-columns view where a flat data-table can't represent the parent-child relationships.

## When to use it

- Tree data with same-shaped columns at every depth.
- Single-select radio mode (`selectionMode='radio'`) — only ONE row across the entire tree may be selected at a time.
- Wallet `multi-N` patterns from React V0.2 reference.

## When NOT to use it

- Flat tabular data → `<falcon-angular-data-table>`.
- Org hierarchy with different visual chrome per depth (root header + child list) → `<falcon-organization-hierarchy-tree-tw>`.
- Selectable-multi → not supported (selection is `'none' | 'radio'` only).

## Status

ACTIVE — Stencil Shadow + Light (`falcon-tree-table-tw`). Angular wrapper `falcon-angular-tree-table` with ControlValueAccessor (CVA) for `[(selectedValue)]` via `[(ngModel)]`. Currently consumed only in playground + showcase (not yet in any production feature page).

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.tsx` (597 LOC)
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-tree-table-tw/falcon-tree-table-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.types.ts`
- Utils: `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.utils.ts` (`buildGridTemplate`, `flattenTree`, `findParentId`, `findFirstChildId`, `hasRadioColumn`, `toggleExpanded`, `formatRowId`)
- Tokens: `libs/falcon-ui-tokens/src/components/tree-table.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/tree-table-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.ts`
- Angular selector: `falcon-angular-tree-table`

## Consumers in active source

- `apps/host-shell/src/app/playground/playground.page.html` (playground)
- `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` (showcase tile)
- `apps/host-shell/src/assets/component-docs/tree-table.md` (docs)
- `apps/admin-console/src/tailwind.css` (Tailwind safelist inline)
- **No production feature page consumer.** GAP — once a production tree-shaped view lands, this is the target.

## Related components

- `falcon-tree` — tree-only (no per-row data columns); Agent 4 territory
- `falcon-tree-panel` — legacy bespoke Angular tree shell; Agent 4 territory
- `falcon-data-table` — for flat lists
- `falcon-radio` — composed when `selectionMode='radio'`

## Ownership

Stencil core + Angular wrapper (CVA). Maintained as the wallet hierarchy / accounts-tree visual primitive.
