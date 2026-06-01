# falcon-switch — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — purely presentational.** The component owns no data. The boolean it produces is written into whatever the *host flow* owns:
- **Commerce** — service / application enable-disable state (the `applications-table` switch flips a service's live state; the actual mutation is a Commerce call owned by the table's state slice — see `project_commchannels_apps_tabs_backend_integration_plan` in `[MEMORY]`, where `eFalconServiceAction.Enable=3` / `Disable=2` are the backend actions).
- **Commerce** — Add Client service-row opt-in is part of the Add Client wizard payload (Commerce-owned).
- **Identity / Commerce** — settings preference toggles persist as account configuration.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| Service enable / disable | `[INFERRED]` POST per `[MEMORY]` `commchannels_apps_tabs` plan | Commerce | `eFalconServiceAction` Enable=3 / Disable=2 | System Gateway (`useGateway()`) | The switch *triggers* the call; the call is owned by the table's `CommerceActionsService` wrapper, not the switch. |
| Settings preference | `[INFERRED]` `PUT commerce/setting` | Commerce | settings DTO | System Gateway | Switch boolean rides inside the Settings tab payload (`[MEMORY]` `project_settings_tab_standalone_wave14`). |

> The switch itself issues **no request**. It emits a boolean; the host state slice maps that boolean to a backend action.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[INFERRED]` Required-true | a switch with `[required]="true"` | submit while off | field-level "required" (Angular `Validators.requiredTrue` on the host control) — `state="error"` + `errorText` render the message |
| `[INFERRED]` no cross-field rule | — | — | A standalone switch carries no cross-field dependency; any dependency lives in the host step's `validations/validations.ts`. |

> `[CODE]` `API.md:24` — the component exposes `state` + `errorText` but **runs no validators**; it renders the host `FormControl`'s validation result. A required switch is uncommon (most switches are optional preferences) — the typical switch is unvalidated.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — (inherited) | — | The switch has no PES key of its own. It inherits the gate of the **service / setting** it toggles. `[INFERRED]` Per `[MEMORY]` `commchannels_apps_tabs` plan, service-action availability is FSM-computed per row via `availableActions[]` + per-action PES (`adminConsole.services.*`); when an action is unavailable the parent renders the switch disabled. |

`[INFERRED]` Per the `falcon-dropdown` precedent, PES resolution is the parent step's job, never inside the library component.

## State / signal pattern
`[CODE]` `API.md:39,52` Two write paths, mutually exclusive in spirit:
1. **CVA (canonical)** — `[(ngModel)]` / `formControlName`; `valueChange` emits the boolean.
2. **`checkedInput` (parent-bypass)** — parent-driven binding; the host slice owns the value (e.g. a table row driving the switch from its row model).

`[INFERRED]` For a backend-confirmed toggle the recommended pattern is: bind via `checkedInput` from the row's confirmed state signal → on `valueChange`, gate `[disabled]` (and ideally show a sibling spinner — `GAPS_AND_UPGRADES.md` G3) → fire the Commerce action → re-set the confirmed-state signal on success, leave it unchanged on failure. This keeps the visible switch in sync with the backend truth.

## Skeleton ↔ app-wrapper layering
`[CODE]` `OVERVIEW.md:27-34`
- **Stencil skeleton** — `<falcon-switch>` (Shadow DOM) / `<falcon-switch-tw>` (Light DOM). Built atop a real native `<input type="checkbox">` with `role="switch"` + `aria-checked` (`API.md:69-72`). Three coexisting visual variants: `dot-knob`, `hidden-input`, `channel-pill`.
- **Angular wrapper** — `<falcon-angular-switch>`: CVA host, dual render path (`useTailwind` default `true`), `checkedInput` setter, shared `size`/`state` contract with the other form controls.
- Per `feedback_library_skeleton_app_api`, the library component never fetches data; the host slice owns the call and any PES/validation logic.

## Integration gotchas
- `[CODE]` `USAGE.md:79` **Never bind `[(ngModel)]` and `[checkedInput]` on the same instance** — two owners for one value.
- `[CODE]` `GAPS_AND_UPGRADES.md:9-13` **No loading state** — for an async-confirmed toggle, gate `[disabled]` during the call yourself; the switch will not show pending on its own.
- `[CODE]` `USAGE.md:78` **`textOn`/`textOff` only apply to `channel-pill`** — setting them on `dot-knob` / `hidden-input` is a silent no-op.
- `[INFERRED]` Optimistic flip without backend confirmation can desync — re-derive the switch's bound value from the confirmed server state after the call resolves.
- `[INFERRED]` Per the `falcon-dropdown` `[disabled]` trap — prefer the property binding `[disabled]="true"` over `[attr.disabled]` so the wrapper setter fires.

## Verification
🟡 CODE-DERIVED from the 6 UI dossier files + `[CODE]` consumer grep + `[MEMORY]` `commchannels_apps_tabs` integration plan. Backend wiring rows are `[INFERRED]` (the plan is 🟡 PLANNED, not yet landed). A full-fidelity pass should read `falcon-switch.component.ts` CVA implementation directly.
