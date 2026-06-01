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
`[CODE]` `OVERVIEW.md:28-35`
- **Stencil skeleton** — `<falcon-checkbox>` (Shadow DOM) / `<falcon-checkbox-tw>` (Light DOM). Pure presentational; wraps a real native `<input type="checkbox">` for full A11y (`API.md:73`).
- **Angular wrapper** — `<falcon-angular-checkbox>`: CVA host, dual render path (`useTailwind` default `true`), `indeterminate` + `checkedInput` setters, shared `size`/`state` contract with `<falcon-angular-input>` / `<falcon-angular-dropdown>`.
- Per the `feedback_library_skeleton_app_api` doctrine, the library component never fetches or owns data — the host step owns the `FormControl` and any PES/validation logic.

## Integration gotchas
- `[CODE]` `USAGE.md:70` / `API.md:69` **Never bind `[(ngModel)]` and `[checkedInput]` on the same instance** — two owners for one value; they will fight. `checkedInput` is the checkbox-group escape hatch only.
- `[CODE]` `API.md:68` **`indeterminate` is lost on toggle** — a header checkbox that "forgets" its partial state after a click is not a bug; the host must recompute it.
- `[CODE]` `USAGE.md:72` **No PrimeIcons** — the check glyph is a built-in Falcon icon asset; do not inject `pi pi-check`.
- `[INFERRED]` Per the `falcon-dropdown` `[disabled]` trap — if a future build adds a `disabled` input, prefer the property binding `[disabled]="true"` over `[attr.disabled]` so the wrapper setter fires (this component currently exposes `readonly`, not `disabled`).

## Verification
🟡 CODE-DERIVED from the 6 UI dossier files + `[CODE]` `falcon-checkbox.component.ts` / `falcon-checkbox.tsx` API surface. No production consumer beyond playground (`USAGE.md:84`), so wiring is not ✅ VERIFIED end-to-end. A full-fidelity pass should read `falcon-checkbox.component.ts` CVA implementation directly.
