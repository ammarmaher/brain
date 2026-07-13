# falcon-checkbox-group — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None of its own** — the component is presentational. Its *option list* is business reference data owned elsewhere:
- **Identity** — `[INFERRED]` the permission catalogue (the user-role wizard use) is owned by the Identity service.
- `[INFERRED]` Settings-toggle and filter-criterion options are owned by whichever service the consuming page queries.
- `[INFERRED]` Exact endpoints are not recorded in the dossiers — the owning module is whatever supplies `options` to the consumer.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `options` (checkbox list) | bound `@Input() options` from parent | (consumer's module) | `[CODE] falcon-checkbox-group.component.ts:45` — plain `@Input`; the component never fetches. |
| selected values | CVA write of `Array<string \| number>` into the parent form | (the flow's owning module) | `[CODE] falcon-checkbox-group.component.ts:77-79,98-113` — component emits the array only. |

`[CODE] falcon-checkbox-group.component.ts:45` — unlike `falcon-multi-select`, `options` is a **plain `@Input`** with no `pushOptions()` race-guard. This is correct: the group composes Angular `<falcon-angular-checkbox>` children directly (`falcon-checkbox-group.component.ts:32` `imports: [FalconAngularCheckboxComponent]`), so there is no Stencil `@Prop` initializer to clobber the binding.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-set | the bound field | `[CODE] GAPS_AND_UPGRADES.md` G6 — **no `required` input** on the component | a mandatory-set rule must be a parent `Validators.required` / `minLength(1)`. |
| Min/max count | the bound field | `[CODE] GAPS_AND_UPGRADES.md` G5 — **no min/max enforcement** | "pick 2–5" must be a parent `Validators` rule. |

`[CODE] falcon-checkbox-group.component.ts:59` — `errorText` renders a group-level validation message; `helperText` renders a hint. `[CODE] GAPS_AND_UPGRADES.md` G4 — note the `errorText` vs `errorMessage` naming inconsistency with other controls. There is no `state` input — error styling is driven by presence of `errorText`.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | — | The group has no PES key of its own. Where it renders a PES-gated field, the parent resolves PES and binds `[disabled]` on the group (or sets per-option `disabled`). `[CODE] falcon-checkbox-group.component.ts:94-96` — `isDisabled()` ORs group `disabled`, CVA disabled, and per-option `disabled`. |

## State / signal pattern
`[CODE] falcon-checkbox-group.component.ts:70-71` — two signals: `selected` (`signal<Array<string|number>>`) and `cvaDisabled` (`signal<boolean>`). CVA: `writeValue` clones the incoming array into `selected`; `registerOnChange` fires on every toggle; `setDisabledState` sets `cvaDisabled`. `[CODE] falcon-checkbox-group.component.ts:48-53` — `selectedValues` is a setter/getter that mirrors the same `selected` signal, so `[selectedValues]` two-way binding and CVA stay consistent.
`[CODE] falcon-checkbox-group.component.ts:98-113` — `handleToggle` computes the next array (add / remove / no-op), sets the signal, fires `onChange` + `selectedValuesChange` + `onTouched`. `[CODE] falcon-checkbox-group.component.ts:115` — `trackByValue` keys the `@for` by `option.value` for stable rendering.

## Skeleton ↔ app-wrapper layering
- **Angular wrapper is the primary path.** `[CODE] falcon-checkbox-group.component.ts` `<falcon-angular-checkbox-group>` is a **pure Angular component** that composes many `<falcon-angular-checkbox>` instances — the group is layout + multi-binding logic, not a visual primitive.
- **Stencil pair exists but is not the Angular code path.** `[CODE] src/components/falcon-checkbox-group/` ships `<falcon-checkbox-group>` (Shadow) + `<falcon-checkbox-group-tw>` (Light) for cross-framework parity, and `ngOnInit` calls `defineFalconTwComponent('falcon-checkbox-group')` (`falcon-checkbox-group.component.ts:117-119`) to register it — but the Angular composition, not the Stencil tag, renders in Angular apps.
- `[CODE] falcon-checkbox-group.types.ts` — CODE-DERIVED CORRECTION: the **Stencil** type `FalconCheckboxGroupOption` has `value: string`, while the **Angular wrapper** type `FalconCheckboxGroupOption` (`falcon-checkbox-group.component.ts:20-24`) has `value: string | number`. The wrapper's wider type is the one Angular consumers use; the existing `API.md` correctly lists `string | number`.
- Per `feedback_library_skeleton_app_api` — options are fetched by the app/state layer; the library never calls HTTP.

## Integration gotchas
- `[CODE] falcon-checkbox-group.component.ts:90` — selection membership uses `Array.includes` — O(N) per render (`GAPS_AND_UPGRADES.md` performance note); fine for ≤ ~50 options.
- `[CODE] falcon-checkbox-group.component.ts:48,77` — both the `selectedValues` setter and `writeValue` **clone** the incoming array (`[...next]`) — mutating the array you passed in will not retroactively change the group; always bind a fresh array.
- `[CODE] falcon-checkbox-group.component.ts:62` — `useTailwind` is forwarded to **each child checkbox**, not consumed by the group itself.
- `[CODE] GAPS_AND_UPGRADES.md` G4 — `errorText` not `errorMessage` — inconsistent with other form controls; alias if you build a generic form-field wrapper.
- `[CODE]` html:14-19 — the options container IS `role="group"` with `[attr.aria-label]="groupLabel ?? null"` (confirmed 2026-06-03 — resolves the prior "verify" flag). It uses `aria-label`, not `aria-labelledby` pointing at the rendered `.falcon-checkbox-group-label` span — a minor a11y refinement (the label text is duplicated rather than referenced).

## What it CAN do (integration)
- `[CODE] falcon-checkbox-group.component.ts` — Participate in Reactive Forms / `ngModel` via array-valued CVA, **and** support `[selectedValues]` two-way binding for non-Forms consumers.
- `[CODE] falcon-checkbox-group.component.ts:59` — Render its own group-level error (`errorText`) and helper (`helperText`) text.
- `[CODE] falcon-checkbox-group.component.ts:86-88` — Honor CVA `setDisabledState` and propagate disabled to every child.

## What it CANNOT do (integration)
- `[CODE] falcon-checkbox-group.component.ts` — It cannot fetch its own data — no service injection.
- `[CODE] GAPS_AND_UPGRADES.md` G5/G6 — It cannot enforce required / min / max — those must be parent validators.
- `[CODE] GAPS_AND_UPGRADES.md` G2 — It cannot do a "Select all" bulk write.
- `[CODE] GAPS_AND_UPGRADES.md` G1 — It cannot render per-option descriptions / icons / templates.

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` G1 — Per-option `description` + `FalconCheckboxGroupItemTemplateDirective` for richer permission rows.
- `[CODE] GAPS_AND_UPGRADES.md` G5/G6 — `required` / `minSelected` / `maxSelected` inputs so validation lives in the control.
- `[CODE] GAPS_AND_UPGRADES.md` G2 — `showSelectAll` tri-state row for parity with `falcon-multi-select`.
- `[CODE] GAPS_AND_UPGRADES.md` G4 — alias `errorText` → `errorMessage`.
- `[CODE] GAPS_AND_UPGRADES.md` G7/G8 — `'grid'` orientation + roving keyboard focus across the group.

## Verification
🟢 code-verified from `falcon-checkbox-group.component.{ts,html}` + both Stencil group tags + `falcon-checkbox-group.types.ts` (read 2026-06-03). Pure-Angular composition (no Stencil tag rendered), array-clone, no-pushOptions-guard, `value:string` (Stencil) vs `string|number` (wrapper) drift, and `role="group"`+`aria-label` all 🟢 confirmed. Consumer count corrected 1→0 (grep-verified — showcase-only). Backend endpoints 🟡 `[INFERRED]` (group owns no data).
