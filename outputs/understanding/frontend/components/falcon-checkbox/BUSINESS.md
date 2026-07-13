# falcon-checkbox — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Lets a user record a single explicit **yes/no decision** — the canonical boolean form control in Falcon. In business terms it is how an operator *commits a binary fact*: "I accept these terms", "send marketing emails", "include this row in the bulk action". It is also the building block of the **tri-state "select all"** affordance — the way a table header tells the operator "everything / nothing / some" of a multi-row set is currently selected.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Explicit consent must be a discrete affirmative act | `[INFERRED]` from `OVERVIEW.md:9` ("I agree" use case) | A checkbox starts **unchecked** — consent is never pre-granted; the operator must actively check it. `[required]="true"` makes the form refuse submission until they do. |
| Bulk operations target a confirmed row set | `[CODE]` `OVERVIEW.md:11,48` (`<falcon-angular-table>` header tri-state) | Header checkbox uses `indeterminate` to make "partial selection" a *visible business state*, so a bulk action can never silently apply to the wrong scope. |
| Multi-value choices are a group decision, not N independent ones | `[CODE]` `OVERVIEW.md:18` / `DECISION.md:15` | A set of related options must go through `<falcon-angular-checkbox-group>` — the group owns the one shared value. A raw checkbox loop is a business modelling error (each box would carry its own disconnected fact). |

## Business constraints baked in
- `[CODE]` `API.md:51` **Unchecked by default** — `writeValue` coerces `null`/`undefined` to `false`. A boolean fact with no recorded answer is treated as "no", never "unknown". A builder must not assume a missing value means "pending".
- `[CODE]` `API.md:68` **Indeterminate is a transient display state, not a stored value** — it is *lost on user toggle* (matches native). It can never be persisted as a third business value; the underlying fact is always strictly boolean. If a flow needs a true tri-value answer, a checkbox is the wrong control.
- `[CODE]` `API.md:30,54-55` **`checkedInput` is a parent-bypass, reserved for `<falcon-angular-checkbox-group>`** — when a group owns the selection, the child checkbox surrenders its own CVA. Using `checkedInput` *and* CVA on the same instance is a contradiction (`USAGE.md:70`) — two owners for one fact.
- `[CODE]` `API.md:27` **`value` (`'on'` default) is the native form-submit token**, not the business answer — the business answer is the boolean from `valueChange` / CVA.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Wallet channel allocation | new-wallet-balance allocation table (admin) + client view (mgmt) | Per-channel header checkbox toggles whether a channel participates in the wallet split; the "at least one channel" rule guards the last toggle (`[CODE]` wb-allocation-table.component.html:120-125). |
| Template message-structure options | Templates wizard step 2 (admin + mgmt) | Boolean opt-ins (security recommendation, expiry-enabled, …) that reveal dependent fields when checked (`[CODE]` step2-message-structure.component.html:92,104,129). |
| Contact-group preview/configure | create-contact-group preview step (mgmt) | A configure-time boolean toggle (`[CODE]` preview-configure-step.component.html:36). |
| Bulk row selection / tri-state header | tables | Header tri-state "select all" + per-row include/exclude — defines which rows a bulk action applies to. |
| Wizard consent / opt-in fields | wizards | Standalone boolean fields the operator must affirmatively set before the step validates. |

## Business gotchas
- A checkbox left unchecked is a **recorded "no"**, not "unanswered" — do not build flows that distinguish the two on a checkbox. Use a dropdown with an explicit "Not specified" option if "unknown" must be representable.
- An `indeterminate` header is **informational only** — it does not carry into the payload. The payload is built from the actual per-row selection set, never from the header's visual state.
- A required checkbox that blocks submission ("I agree") is a *deliberate consent gate* — do not "fix" a stuck form by removing `[required]`; the gate is the business rule.
- Using a raw `*ngFor` of checkboxes to model a multi-value field bypasses the group's shared-value contract — the resulting payload shape will not match what the backend expects (see `<falcon-angular-checkbox-group>`).

## Verification
🟢 code-verified against `falcon-checkbox.component.ts` (read 2026-06-03) + the live consumers. Consumer count corrected 1→5 — the channel-toggle (wallet) + opt-in (Templates wizard) uses are real production features, so the boolean-fact / guarded-toggle semantics are now feature-grounded (not playground-only). Consent-gate / requiredTrue pattern 🟡 code-derived (no live `[required]` consent checkbox cited).
