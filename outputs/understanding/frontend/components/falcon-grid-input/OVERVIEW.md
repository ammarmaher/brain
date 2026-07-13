# falcon-grid-input — OVERVIEW

## Component purpose

In-grid cell editor with spreadsheet-style keyboard semantics: **Enter** commits, **Escape** cancels (reverts to `originalValue` + emits `falconGridCancel`), **Tab / Shift+Tab** commits + emits `falconGridNavigate` so the host moves focus to the next/previous cell, and **blur** commits (same as Enter, de-duped by an internal `committed` flag). It is a **§5.12.2 "Specialized composed input"** — a thin Stencil component that composes `<falcon-input variant="grid" size="sm" clearable={false}>` (Shadow) / `<falcon-input-tw variant="grid" size="sm">` (Light) and puts all key handling on its `<Host onKeyDown>` (`[CODE]` falcon-grid-input.tsx:129-147).

## Business / UI use case

- In-place editing of price / cost / quota cells in a data matrix without opening a form or drawer.
- Tab-through bulk editing of many cells in sequence (operator never lifts hands from the keyboard).
- The live consumers are the **Contracts cost-management price/cost matrix** in both consoles (admin add-wizard step + management details-section), where each editable matrix cell is a `<falcon-angular-grid-input>` (`[CODE]` contract-details-step.component.html:106-111 / contracts-contract-details-section.component.html:106-111).

## When to use it / when NOT to use it

**Use it for:** inline cell editors inside data tables / grids / matrices.

**Do NOT use it for:**
- Form fields → `<falcon-angular-input>`.
- Numeric with steppers / format / decimals → `<falcon-angular-input-number>` (grid-input is **string-only**, no numeric mode).
- Multi-line cells → `<falcon-angular-textarea>`.
- A dropdown picker inside a cell → `<falcon-angular-dropdown>` in a cell template.

## Status

**ACTIVE / PREFERRED for grid edit cells (Wave 5).** **Now adopted** — 2 live feature consumers as of 2026-06-03 (was zero at Wave 7). Both consumers replaced a bespoke `app-contracts-number-input` with this platform component (`[CODE]` contract-details-step.component.ts:26-30).

## Replaces

- `[CODE]` The donor's bespoke `app-contracts-number-input` (one-way `[value]` + `(valueChange)` → number) in the contracts cost-management feature (`[CODE]` contract-details-step.component.ts:26-30). grid-input bridges by carrying a STRING and committing via `(falconGridCommit)`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-grid-input/falcon-grid-input.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-grid-input/falcon-grid-input.component.html` |
| Angular wrapper CSS | **none** — wrapper host-binds `block w-full` via `@HostBinding('class')`, no `.component.css`. |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-grid-input/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-grid-input/falcon-grid-input.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-grid-input/falcon-grid-input.css` (`:host{display:block}` + root `display:block` only). |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-grid-input-tw/falcon-grid-input-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-grid-input/falcon-grid-input.types.ts` |
| Utils | **none** (no `*.utils.ts`). |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/grid-input-tailwind-classes.ts` (single export `falconGridInputRootClasses()` — currently unused even by the `-tw` twin). |
| Component token file | `libs/falcon-ui-tokens/src/components/grid-input.tokens.css` (~22 lines — 2 orphan focus-ring tokens). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-grid-input` |
| Stencil Shadow tag | `<falcon-grid-input>` |
| Stencil Light tag | `<falcon-grid-input-tw>` |

## Known consumers (grep verified 2026-06-03)

- `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/contract-details-step/contract-details-step.component.html:106` (+ `.ts`) — editable price/cost matrix cell.
- `apps/management-console/src/app/features/contracts-cost-management/components/contracts-contract-details-section/contracts-contract-details-section.component.html:106` (+ `.ts`) — the mirrored Client-side matrix cell.

> `[CODE]` Both use `[value]="cellDisplayValue(cell)"` + `[originalValue]="cellDisplayValue(cell)"` + `[autoFocus]="false"` + `(falconGridCommit)="onCellCommit(...)"`. No `<falcon-angular-data-table>` custom-cell usage exists yet (the prior dossier speculated this).

## Related components

- **Composes:** `<falcon-input variant="grid" size="sm">` (Shadow) / `<falcon-input-tw variant="grid" size="sm">` (Light). The compact field, border, focus look come from the inherited input primitive; grid-input owns only the keyboard contract + root wrapper.
- **Siblings:** `<falcon-angular-input>` (form fields), `<falcon-angular-input-number>` (numeric), `<falcon-angular-textarea>` (multi-line), `<falcon-angular-dropdown>` (in-cell pickers).
- **Host integration:** rendered from a table's editable-cell branch; the host owns which cell is editing + cell-to-cell focus.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract lives in `libs/falcon-ui-tokens` (2 focus-ring tokens; field tokens are the shared `--falcon-input-*` set).

## Verification
🟢 code-verified against `falcon-grid-input.component.ts/.html` + `falcon-grid-input.tsx` + `falcon-grid-input-tw.tsx` + `grid-input.tokens.css` (read 2026-06-03). Consumer list 🟢 grep-verified (2 contracts consumers) + cited HTML. Corrects prior "Known consumers" that listed data-table/table speculatively.
