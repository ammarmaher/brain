---
name: Add Client Step 3/4 — independent data-table per tab
description: Step 3 (CommChannels) and Step 4 (Applications) each render their OWN falcon-angular-data-table inline. The shared client-service-row-table component was deleted. Per-row validation lives in each step's validations/validations.ts.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
# Add Client Step 3/4 — independent data-table per tab (2026-05-19, v2.0)

> History: Wave 7.15 plain-`<table>` rebuild → reverted to a shared
> `client-service-row-table` data-table component → SPLIT into two independent
> inline implementations (user instruction: no shared render-by-variant component).

## Current state

The shared `client-service-row-table/` folder was DELETED. `client-comm-channels-step`
(Step 3) and `client-applications-step` (Step 4) each render their OWN
`<falcon-angular-data-table>` directly in their own template — deliberate twins, each
self-documented, neither depends on the other.

- 5 columns via a `columns` `ColumnDef[]` computed (visibility/name/priceType/priceValue/
  status); editable cells project via `falconDataTableCell` templates: visibility =
  `<falcon-angular-switch>`, priceType = `<falcon-angular-dropdown>`, priceValue =
  `<falcon-angular-input>` (SAR glyph in `icon-left` slot). ZERO native HTML inputs/tables.
- `[paginator]="true"`, `[rows]="10"`. Every editable cell is `h-[52px]` with a reserved
  fixed-height error line → all rows equal height.
- Each step reads its rows from the wizard form value (`value().channels` / `value().apps`)
  and writes back via `value.update`.

## The zoneless data-table cell gotchas (REQUIRED consumer-side patterns)

`<falcon-angular-data-table>` re-projects `falconDataTableCell` templates ONLY when the
`[data]` REFERENCE changes (`data` is a plain @Input; its `ngOnChanges` gates the Stencil
re-render). The orchestrator REUSES embedded views and only patches context, so:

1. **Never call a component METHOD in a cell template** (e.g. `[state]="showError(row)"`).
   It will not re-run when a separate signal changes — only on `[data]` ref change. Bake
   derived state into the row data: a `viewRows` computed maps `rows() + touched()` → rows
   with `priceTypeError`/`priceValueError` baked in; template binds
   `[state]="row.priceTypeError ? 'error' : 'default'"`.

2. **NEVER rely on `[disabled]` for a Stencil-backed control inside a data-table cell.**
   On a reused embedded view a `true→true` disabled value never re-fires the wrapper's
   setter, and on first mount it loses the Stencil hydration race — the dropdown/switch
   render ENABLED until a user click forces a CD tick. ROOT-CAUSE FIX: render the control
   ONLY for the state that needs it — `@if (row.visible === true) { <dropdown/> } @else
   { dash }`. A hidden row then has NO control to be wrongly clickable. This is how the
   Step 3/4 priceType/priceValue cells work, mirroring the Status column + comm-channels-tab.

3. **Post-mount kick** — `effect(() => { void rows(); afterNextRender(() =>
   mountKick.update(...), {injector}); })`; `viewRows` reads `mountKick`. Re-projects every
   cell once the DOM settles after each async data change.

## Validation

Each step owns `validations/validations.ts` with pure per-row predicates: `isRowActive`
(`visible === true`), `isPriceTypeMissing`, `isPriceValueInvalid`, `isRowValid`,
`areAllRowsValid`. A row is validated ONLY while visible — a visible row MUST have a price
type + non-negative price value. Each step keeps a `touched` Set; `revealErrors()`
(WizardStepHost) flips every touch key when the wizard blocks Next.

## Build
admin-console GREEN — hash `f5074ecb8dc48649` (~22s), 2026-05-19.

## Triggers to recall
`add client step 3/4 data table` / `client-comm-channels-step` / `client-applications-step` /
`service row validation` / `data-table cell zoneless re-projection`.
