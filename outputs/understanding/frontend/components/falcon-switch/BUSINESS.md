# falcon-switch — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Lets an operator **flip a capability on or off** — the canonical control for a *standing configuration choice* rather than a one-time form answer. In business terms a switch represents a setting that *stays in effect*: a feature flag, a notification preference, whether a service / application row is currently enabled, whether an account is active. The switch metaphor signals "this is a live state you are changing", as opposed to a checkbox's "this is a fact you are recording on a form".

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[CODE]` Application rows carry an enable/disable state | `[CODE]` `USAGE.md:93-94` — `applications-table.component.{html,ts}` | The service/application table renders a switch per row; flipping it is the operator's *enable / disable* decision on that service. |
| `[CODE]` Add Client wizard ships per-service enable toggles | `[CODE]` `USAGE.md:95-96` — `add-client-wizard/client-service-row-table` | During Add Client Step (service selection), each candidate service row has a switch — it is how the operator opts a new client into / out of a service before the client exists. |
| `[INFERRED]` Settings preferences are standing toggles | `[INFERRED]` from `OVERVIEW.md:9,46` (settings pages) | Notification / alert preferences are switches because the value persists as account configuration, not a per-submission answer. |

## Business constraints baked in
- `[CODE]` `API.md:63` / `GAPS_AND_UPGRADES.md:25` **Strictly boolean — no tri-state.** A switch can only express on or off; "indeterminate / unknown" is impossible by design. If a setting has a third state, a switch is the wrong control.
- `[CODE]` `API.md:27` **`value` (`'on'`) is the native form token, not the business answer** — the business answer is the boolean from `valueChange` / CVA.
- `[CODE]` `API.md:29-30,65` **`channel-pill` ON/OFF labels (`textOn`/`textOff`) are display-only** — they render the *current state in words* (e.g. "Active"/"Inactive"); they are not selectable options and have no effect on `dot-knob` / `hidden-input` variants.
- `[CODE]` `GAPS_AND_UPGRADES.md:9-13` **No built-in loading state.** A server-confirmed toggle (a feature flag the backend must acknowledge) has no native "pending" affordance — the host must gate `[disabled]` while the call is in flight. Treating a switch as instantly committed when the backend can still reject it is a business correctness risk.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Application / service enable-disable | admin-console org-hierarchy `applications-table` | One switch per service row — the live enable/disable state of that service for the node. |
| Add Client — service selection | admin-console `add-client-wizard/client-service-row-table` | Per-service opt-in switch — sets which services the new client starts with. |
| Settings preferences | admin / management console settings pages | Standing notification / alert preference toggles persisted as account config. |
| Filter panels | admin-console org-hierarchy tabs | Boolean filter facet ("active only"). |
| UI showcase / playground | host-shell `falcon-ui-showcase`, `playground.page` | Demonstration only — not a business flow. |

## Business gotchas
- A switch flipped in the UI is **not necessarily committed** — if the backend owns the truth (service enable/disable, feature flag), the operator's flip is a *request*. The host must reflect the confirmed state after the call, and revert on failure. Optimistic flips that silently desync from the backend are a real-world bug.
- `channel-pill` `textOn`/`textOff` strings are translatable display copy — they describe the state, they are not a two-option picker. Do not model a binary *choice between two named things* (e.g. "Monthly" vs "Yearly") as a switch — that is a radio / dropdown decision.
- A switch is for a **standing setting**; a checkbox is for a **form-time fact** (`BUSINESS.md` of falcon-checkbox). Picking the wrong one mis-signals the persistence semantics to the operator.

## Verification
🟡 CODE-DERIVED from the 6 UI dossier files + `[CODE]` consumer grep (`USAGE.md:91-99`, 7 files). The service enable/disable and Add Client service-row uses are 🟡 CODE-DERIVED — present in admin-console source; not independently confirmed as ✅ VERIFIED working features in `[MEMORY]`.
