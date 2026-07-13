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

ACTIVE — Stencil Shadow + Light (`falcon-tree-table-tw`). Angular wrapper `falcon-angular-tree-table` with ControlValueAccessor (CVA) for `[(selectedValue)]` via `[(ngModel)]`. **Showcase / docs-only — NO production feature page renders it (verified 2026-06-03).** The wallet-balance feature *references* `<falcon-angular-tree-table>`/`<falcon-tree-table-tw>` only in code comments (it builds its own grid); the prior dossier's `playground.page.html` consumer is gone (route removed).

## Source file paths

| Layer | Path |
|---|---|
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.tsx` (**596 LOC**) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.css` (361 ln) |
| Stencil Light (`-tw`) | `libs/falcon-ui-core/src/components/falcon-tree-table-tw/falcon-tree-table-tw.tsx` (**668 LOC**) |
| Types | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.types.ts` (52 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.utils.ts` (199 ln — `buildGridTemplate`, `flattenTree`, `findParentId`, `findFirstChildId`, `hasRadioColumn`, `toggleExpanded`, `formatRowId`) |
| Tokens | `libs/falcon-ui-tokens/src/components/tree-table.tokens.css` |
| Tailwind helpers | `libs/falcon-ui-core/src/tailwind/tree-table-tailwind-classes.ts` |
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.ts` (128 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.html` (51 ln) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.css` (11 ln) |
| Angular selector | `falcon-angular-tree-table` |
| Spec/tests | **NONE** — no `.spec.ts` for the Stencil tags, the wrapper, or the (non-trivial) `*.utils.ts` pure fns (GAP FTT-07). |

## Consumers in active source (grep verified 2026-06-03)

`[CODE]` grep `<falcon-angular-tree-table[\s>]` / `<falcon-tree-table[\s>]` / `<falcon-tree-table-tw[\s>]` across `apps/` → **ZERO production render-sites.** All hits are non-render:
- `apps/{host-shell,admin-console}/src/tailwind.css` — Tailwind safelist comments
- `apps/{admin,management}-console/.../wallet-balance-management/wallet-balance-management.component.ts:236/254/298/352` — **code comments only** (the wallet builds its own 3-column grid; it does NOT render the tree-table component)
- `apps/host-shell/src/assets/component-docs/tree-table.md` — docs
- `apps/host-shell/.../falcon-ui-showcase/showcase-data/registry.ts` — showcase tile
- **No production feature page renders it.** GAP — once a production tree-shaped view lands, this is the target. (The Wave-7 `playground.page.html` consumer is gone — route removed.)

## Related components

- `falcon-tree` — tree-only (no per-row data columns); Agent 4 territory
- `falcon-tree-panel` — legacy bespoke Angular tree shell; Agent 4 territory
- `falcon-data-table` — for flat lists
- `falcon-radio` — composed when `selectionMode='radio'`

## Ownership

Stencil core + Angular wrapper (CVA). Maintained as the wallet hierarchy / accounts-tree visual primitive.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08). Source-file table recounted (Shadow 596 ln, `-tw` 668 ln, wrapper 128 ln, utils 199 ln); CVA wrapper confirmed. Consumers re-grepped → **0 production render-sites** (Tailwind-safelist + wallet-comment + showcase/docs only); Wave-7 playground consumer removed.
