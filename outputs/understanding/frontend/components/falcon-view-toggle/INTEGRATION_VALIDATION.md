# falcon-view-toggle — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

`[CODE]` **None.** The component is purely presentational and drives only client-side view state. It owns no data and calls no endpoint. The data it toggles the *view* of (the org-hierarchy tree) is fetched elsewhere — the hierarchy tree comes from the org-hierarchy state slice / Commerce hierarchy endpoints (`[MEMORY]` wallet/hierarchy integration: `GET api/commerce/accounts/{id}/hierarchy`), but the toggle never touches that pipeline; it only flips `structureView`.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| _(none)_ | — | — | — | — | `[CODE]` The toggle emits `valueChange` → host `structureView.set()`. No HTTP, no DTO, no gateway. |

> `[INFERRED]` Switching to `chart` flips `showOrgChart()` (tree-state.signals.ts:124) which the template uses to render `<falcon-org-chart>` vs the list — a pure view swap of already-loaded data. No refetch is triggered by the toggle itself.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| _(none)_ | — | — | `[CODE]` No validation. It is a view switcher, not a form control; there is no `errorMessage`/`state` axis and no CVA. |

> `[CODE]` falcon-view-toggle.component.ts has no validators and no error surface. The only "guard" is the consumer-side unsaved-changes veto in `onStructureViewChange` (org-hierarchy-page-menu.component.ts:259-273) — that is page logic, not component validation.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| _(none on the component)_ | switch view | The toggle itself has no `disabled` input and no PES gate. |

`[CODE]` The component exposes **no `disabled` input** (API.md), so it cannot even be PES-gated at the component level today (GAP G3). Whether a user sees the org-hierarchy page at all is gated upstream by the org-hierarchy route guards / `adminConsoleGuard` / `managementConsoleGuard` — but once on the page, the List/Tree toggle is always enabled. `[INFERRED]` This is acceptable because choosing a view layout is not a permissioned action.

## State / signal pattern

`[CODE]` falcon-view-toggle.component.ts:
- Inputs: `options = input.required<readonly FalconViewToggleOption<TKey>[]>()` (ts:40) and `value = model.required<TKey>()` (ts:41).
- The `value` `model()` is the single source of two-way truth; `setValue(next)` (ts:43-45) is the only writer and is guarded (`if (this.value() !== next) this.value.set(next)`).
- `OnPush` (ts:36). No subscriptions, no lifecycle hooks, no `DestroyRef` needed — nothing to tear down (zoneless-safe).
- **Integration pattern at the live site:** the host owns `structureView = signal<StructureView>('tree')` (tree-state.signals.ts:122) and binds one-way `[value]="state.structureView()"` + `(valueChange)`, so the component's internal `model` is overwritten on every CD pass by the authoritative host signal — this is what makes the veto/snap-back work.

## Skeleton ↔ app-wrapper layering

`[CODE]` **N/A — there is no skeleton/wrapper split.** This is a single Angular component, not a Stencil-skeleton + Angular-wrapper pair (contrast falcon-input's `<falcon-input>` Shadow + `<falcon-input-tw>` + `<falcon-angular-input>` triad). There is no `componentOnReady` race, no `defineFalconTwComponent`, no `useTailwind` switch. The component renders plain `<div>`/`<button>`/`<svg>` directly.

## Integration gotchas

- `[CODE]` **Use one-way `[value]`+`(valueChange)` when a change must be vetoable** — `[(value)]` (two-way) commits the model immediately and bypasses any host guard. The live org-hierarchy site deliberately uses one-way so the unsaved-changes guard can block the switch and the next CD pass snaps the pill back (html:121-123 comment).
- `[CODE]` **Keep state keys decoupled from labels** — `key: 'tree'/'chart'` vs label `List/Tree` is intentional (tree-state.signals.ts:41). Downstream (`showOrgChart()`) keys off `chart`; renaming keys to match labels breaks it.
- `[CODE]` **No CVA** — cannot be a `formControlName`. Drive it with a signal + `[(value)]`, or one-way+`(valueChange)`.
- `[CODE]` **`$any($event)` cast at the live site** (html:134) — because the handler param is widened; the emitted value is actually typed `TKey`. New code should use a correctly-typed handler instead of `$any`.
- `[CODE]` **Generic key type** — `FalconViewToggleComponent<TKey>` infers `TKey` from `options`; if you bind `value` to a wider `string` signal, TS may complain. Type the host signal to the same key union as the options.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — confirmed no backend wiring, no validation, no PES gate, no skeleton/wrapper layering. The signal pattern (`input.required` + `model.required` + guarded `setValue`) and the live one-way+veto integration (`onStructureViewChange`, org-hierarchy-page-menu.component.ts:259-273) re-confirmed in source. Upstream hierarchy-data endpoints cross-referenced from `[MEMORY]` but are NOT touched by this component.
