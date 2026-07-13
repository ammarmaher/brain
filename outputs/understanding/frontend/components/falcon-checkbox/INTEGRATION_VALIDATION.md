# falcon-checkbox — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — purely presentational.** The component owns no data. The boolean it produces is written into whatever payload the *host flow* owns:
- A consent / opt-in flag → the flow's owning module (Add Client → Commerce; Add User → Identity).
- A filter predicate → no backend at all; it shapes a client-side query string.
- A row-selection set → never sent as a field; it scopes which entity IDs a subsequent bulk call targets.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The checkbox issues no request of its own. Its boolean rides inside the host step's payload — see that flow's dossier (`INTEGRATION_VALIDATION.md` of the owning wizard step). |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-true | a consent / opt-in checkbox with `[required]="true"` | submit while unchecked | field-level "required" (Angular `Validators.requiredTrue` on the host `FormControl`) — `state="error"` + `errorText` render the message |
| `[INFERRED]` no cross-field rule | — | — | A standalone checkbox has no cross-field dependency of its own; any dependency lives in the host step's validators (`validations/validations.ts`). |

> `[CODE]` `API.md:25` — the component exposes `state` + `errorText` but **does not run validators itself**; it renders the *result* of the host `FormControl`'s validation. `Validators.requiredTrue` is the standard Angular validator a builder pairs with `[required]`.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — (inherited) | — | The checkbox has no PES key of its own. It inherits the gate of the **field/section** it renders. When the host field is PES-gated to read-only, the parent step renders the checkbox with `[readonly]="true"` (`API.md:24`). |

`[INFERRED]` Per the `falcon-dropdown` precedent, PES resolution is done by the parent step, never inside the library component.

## State / signal pattern
`[CODE]` `API.md:49-56` Two write paths, mutually exclusive in spirit:
1. **CVA (canonical)** — `[(ngModel)]` / `formControlName`; `writeValue(boolean|null|undefined)` coerces to boolean; `valueChange` emits the boolean.
2. **`checkedInput` (parent-bypass)** — used only by `<falcon-angular-checkbox-group>` so the group can drive selection without per-checkbox CVA registration.

`[CODE]` `API.md:51,68` Toggling **auto-resets `indeterminate`** — the host must re-derive and re-apply it (e.g. in `valueChange`) if the tri-state must persist after interaction. For a table header, the host typically recomputes `indeterminate = someSelected() && !allSelected()` as a `computed` signal off the selection set.

## Skeleton ↔ app-wrapper layering
`[CODE]` falcon-checkbox.component.{ts,html} + falcon-checkbox.tsx
- **Stencil skeleton** — `<falcon-checkbox>` (Shadow, `shadow:true`) / `<falcon-checkbox-tw>` (Light DOM, `shadow:false`). Pure presentational; each wraps a real native `<input type="checkbox">` for full A11y (tsx:175-196). Near-perfect Shadow↔`-tw` parity: same props/events/methods, identical `applyChange`/`@Watch` logic; only class names differ.
- **Angular wrapper** — `<falcon-angular-checkbox>`: CVA host (pure tag-switcher template, NO `<ng-content>`), dual render path (`useTailwind` default `true`), `indeterminate` + `checkedInput` setters, `value$`/`disabled`/`indeterminateState` signals, shared `size`/`state` contract with `<falcon-angular-input>` / `<falcon-angular-dropdown>`.
- Per `feedback_library_skeleton_app_api` — the library never fetches or owns data; the host owns the `FormControl` + PES/validation.

## Integration gotchas
- `[CODE]` **Never bind `[(ngModel)]` and `[checkedInput]` on the same instance** — two owners for one value; they will fight. `checkedInput` is the parent-driven-selection bypass (used by checkbox-group + the wallet allocation table).
- `[CODE]` **`indeterminate` is lost on toggle** (`handleChange` sets it false — ts:119) — a header checkbox that "forgets" its partial state after a click is not a bug; the host must recompute it.
- `[CODE]` **No `disabled` `@Input`** — disabled is driven ONLY via CVA `setDisabledState` (a disabled `FormControl`), which feeds the internal `disabled` signal → `[attr.disabled]` on the Stencil tag (html:16,38). A `[disabled]="true"` template binding silently no-ops; use `readonly` for a non-CVA lock. (GAP G8.)
- `[CODE]` **`falcon-focus` is emitted by both tags but NOT bound by the wrapper** (GAP G7) — attach a native focus listener if a focus signal is needed.
- `[CODE]` **No PrimeIcons** — the check glyph is a built-in inline SVG; do not inject `pi pi-check`.

## Verification
🟢 code-verified from `falcon-checkbox.component.{ts,html}` + `falcon-checkbox.tsx` + `falcon-checkbox-tw.tsx` (read 2026-06-03). CVA + `checkedInput` bypass + indeterminate-reset + CVA-only-disabled all 🟢 confirmed in source. Wiring now feature-grounded (5 live consumers — wallet + Templates wizard). `<ng-content>` rich-label claim removed (false). Backend endpoints 🟡 `[INFERRED]` (checkbox owns no data).
