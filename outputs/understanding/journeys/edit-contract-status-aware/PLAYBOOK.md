*** Journey Playbook — Edit Contract (status-aware) ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Contracts]] · [[Contract Detail]] · [[Edit Contract]] · Charging rate update ***

# Edit Contract (status-aware)

> An existing Contract is opened for edit. The contract's Status determines what is editable:
>
> - **Draft** — fully editable (no commitments yet).
> - **Pending** (Maker/Checker queue) — limited (only the Maker can revise pre-approval).
> - **Active** — restricted; admin override needed for fundamentals; AO can edit metadata + extend end-date.
> - **Expired / Cancelled** — read-only; no edits.
>
> Frontend disables / hides ineligible fields based on Status; backend re-enforces via [[V-contract-edit-status-aware-fields]]. Silently dropping a field on the wire — instead of erroring — is the documented PRD-03 anti-pattern this journey must avoid.

## Actors involved

| Actor | Role |
|---|---|
| Account Owner | Common initiator; can edit own tenant's contracts within Status-allowed bounds |
| Falcon Sys Admin / Product | Higher edit scope; can change Active-contract fields with audit |
| Maker / Checker | If Maker/Checker is in scope, Maker authors revisions; Checker approves |
| Commerce Service | Owns Contract entity; enforces status-aware editability |
| Charging Service | Consumes rate-card change events; updates next-send charging cascade |
| Provisioning Service | Consumes scope changes; activates/deactivates services |
| Access (PES) Service | Gates edit per role + Status + field |

## Pages traversed (in order)

1. [[Contracts]] — User finds the contract via filter / search. `forward-ref (page not yet seeded)`
2. [[Contract Detail]] — User opens the contract; sees current Status + balance + rate-card. `forward-ref`
3. [[Edit Contract]] — Edit form / wizard; fields enabled/disabled per Status. `forward-ref`
4. [[Contract Detail (refreshed)]] — Post-save view with updated fields + new audit row in History.

## Flow playbooks used

- [[Edit Contract Flow]] — `forward-ref (flow not yet seeded)`. Should explicitly enumerate editable fields per Status. Sharing validation with [[Add Contract Flow]] is fine but the playbook needs its own field matrix.
- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)`. Sibling — shares the same V-rule pack.

## Backend services exercised (in order)

- [[Core Gateway Service]] (AO path) or [[System Gateway Service]] (admin path).
- [[Access PES Service]] — verifies actor can edit this contract; field-level decisions in some cases.
- [[Commerce Service]] — loads Contract; computes the editable-field set from Status; applies field-by-field validators ([[V-contract-edit-status-aware-fields]] is the umbrella rule); persists; emits update event.
- [[Charging Service]] — consumes rate-card / amount changes; re-resolves the nearest-expiring-contract cascade.
- [[Provisioning Service]] — consumes scope changes (added/removed Apps or CommChannels).

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `commerce.contract-updated.v1` | Commerce → audit + Charging + Provisioning | `forward-ref (event name TBC)`. Fires on Submit commit. Carries `{contractId, changedFields, oldValues, newValues, actorUserId}`. |
| `commerce.rate-card-changed.v1` | Commerce → Charging | `forward-ref (event name TBC)`. Fires if rate-card rows changed. Charging re-caches rates. |
| `commerce.service-order-changed.v1` | Commerce → Provisioning | `forward-ref (event name TBC)`. Fires if the contract's service scope changed. |

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-contract-edit-status-aware-fields]] | Central rule — both UI gate and backend re-enforce |
| [[V-contract-committed-value-positive]] | If committed value is being edited |
| [[V-contract-rate-per-unit-non-negative]] | If a rate row is being edited |
| [[V-contract-currency-enum]] | Currency typically not editable post-create; backend should reject silently-changed currency on Active |
| [[V-contract-expiration-after-start]] | If end-date is being extended |
| [[V-account-ip-allowlist-enforcement]] | Step 0 gateway enforce |

## Status-aware editability matrix (canonical sketch)

> Verify exact rows against PRD-03 BUSINESS_RULES + Commerce Contract DTO / validators. The matrix below is the best-known sketch derived from V-rules; the [[Edit Contract Flow]] playbook should make this authoritative.

| Field | Draft | Pending | Active | Expired |
|---|---|---|---|---|
| Contract name | edit | edit (Maker) | edit (admin only) | read |
| Committed value | edit | edit (Maker) | admin override (audit) | read |
| Rate-card rows | edit | edit (Maker) | admin override → re-cache cascade | read |
| Currency | edit | edit (Maker) | locked | read |
| Start date | edit | edit (Maker) | locked | read |
| End date | edit | edit (Maker) | extend-only (admin/AO) | read |
| Service scope (CommChannels/Apps) | edit | edit (Maker) | admin override | read |
| Status (e.g. Cancel) | edit → set Draft/Pending | Maker withdraw | admin Cancel | read |

## End-to-end happy-path narrative

**Step 1.** Actor opens [[Contracts]] (`forward-ref`). Finds the target contract. Clicks it.

**Step 2.** [[Contract Detail]] (`forward-ref`) shows the contract + a Status badge + audit history. Edit button is enabled only if Status ≠ Expired/Cancelled AND PES allows.

**Step 3.** Actor clicks Edit → [[Edit Contract]] form opens. Form is rendered with all fields visible, but **per-field disabled state** is driven by the editability matrix for the current Status. Disabled fields show a tooltip explaining why (e.g. "Currency cannot be changed on an Active contract — create a new contract or contact admin").

**Step 4.** Actor edits the allowed fields. Frontend validators apply:
- Committed value: > 0 ([[V-contract-committed-value-positive]]).
- Rate-card rows: each ≥ 0 ([[V-contract-rate-per-unit-non-negative]]).
- End date: if extending, must be > start-date and > today ([[V-contract-expiration-after-start]]).

**Step 5.** Actor clicks Save. Frontend POSTs via gateway: `PATCH /api/contract/{id}` or `PUT /api/contract/{id}` (`forward-ref endpoint`). Commerce:
1. Loads the contract; reads current Status.
2. Calls PES `authorize` to check actor-permission for this contract.
3. Applies [[V-contract-edit-status-aware-fields]]: **for every field in the incoming payload that differs from current state, check if Status allows editing it**. If any field is illegal, return 422 `FieldNotEditableInStatus` (`forward-ref`) with the offending field name(s). **Crucially: do NOT silently drop the field — return error.**
4. If all edits are legal: applies field validators ([[V-contract-*]] rules); persists; writes audit row; emits `commerce.contract-updated.v1`.
5. If rate-card changed: emits `commerce.rate-card-changed.v1` so Charging re-caches.
6. If service scope changed: emits `commerce.service-order-changed.v1`.

**Step 6.** Charging consumes rate change → re-caches rates → next [[Send Campaign]] uses new rates. Provisioning consumes scope change → activates/deactivates services.

**Step 7.** Frontend receives success response. Refreshes [[Contract Detail]]. Toast: "Contract updated." Audit history shows new row with timestamp + actor + fields-changed.

**Journey ends.** Final state:
- **Contract:** updated fields persisted; Status unchanged (unless an explicit Status change was the edit)
- **Audit log:** new row
- **Charging cache:** refreshed if rate-card changed
- **Provisioning:** updated if scope changed

## Failure modes + recovery paths

- **Step 3 Edit button disabled:** Status is Expired/Cancelled OR PES denies. Actor cannot proceed. Recovery: create a new contract via [[Renew Contract]] or escalate to admin.
- **Step 4 validation rejects:** Inline error per field ([[V-contract-committed-value-positive]] etc).
- **Step 5.3 fails ([[V-contract-edit-status-aware-fields]]):** 422 `FieldNotEditableInStatus` with field names. UI re-renders the field as disabled and toasts: "Some fields can't be edited in current status." **The anti-pattern this journey avoids:** silently dropping fields on the wire and returning 200. PRD-03 wants explicit errors.
- **Step 5.4 fails (field-validator error):** Standard 4xx; inline.
- **Step 5.5 fails (audit write or Kafka emit fails):** Treat as 500 + retry-safe; updates are committed inside a transaction with the audit row. Don't return 200 if the audit write failed.
- **Step 6 partial (Charging consumer down):** Contract updated; rates not re-cached. Next Send Campaign uses old rates until Kafka catches up. Should be idempotent for replay.
- **Concurrent edits (two actors edit at once):** Optimistic concurrency via row-version / etag. Late writer gets 409 `ConcurrencyConflict` (`forward-ref`); UI prompts "Refresh and try again."

## Cross-journey dependencies

- **Depends on:** Contract exists; actor has edit permission via PES for the relevant Status.
- **Triggers downstream:** Next [[Send Campaign]] sees new rates. If scope changed, Provisioning activates new services.
- **Sibling:** [[Renew Contract]] is the alternative when edits are blocked by Status.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Contracts list + Contract Detail + Edit Contract form
- [ ] Kafka subscriptions are wired — Charging + Provisioning on `commerce.contract-updated.v1` (+ rate / scope sub-events)
- [ ] Error states from each step propagate correctly — PES Deny, FieldNotEditableInStatus (must NOT silently drop), field-validator errors, ConcurrencyConflict
- [ ] State transitions per actor are tested end-to-end — Status unchanged; fields updated; audit row appended; rate cache refreshed
- [ ] Editability matrix is enforced BOTH in the UI (disabled state + tooltip) AND in the backend ([[V-contract-edit-status-aware-fields]]) — divergence between the two is a bug
- [ ] Silently-dropped-fields anti-pattern is rejected — backend returns 422 with field names, not 200 with a partial diff
- [ ] Optimistic concurrency (etag / row-version) is implemented for concurrent-edit safety
- [ ] Audit history shows actor + timestamp + changed fields for every edit

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
