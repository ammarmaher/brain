*** Journey note — Edit Contract (status-aware) ***
*** Vault file: 16-Journeys/Edit Contract Status Aware.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\edit-contract-status-aware\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# Edit Contract (status-aware)

> A user opens an existing Contract for edit. The set of editable fields depends on the contract's current Status (Draft / Pending / Active / Expired / Cancelled). [[V-contract-edit-status-aware-fields]] is the central rule; the anti-pattern this journey explicitly avoids is silently dropping illegal fields on the wire — backend must return 422 with field names instead of 200 with a partial diff.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/edit-contract-status-aware/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/edit-contract-status-aware/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Contracts]] — `forward-ref (page not yet seeded)` — list + filter
2. [[Contract Detail]] — `forward-ref (page not yet seeded)` — view + Edit button
3. [[Edit Contract]] — `forward-ref (page not yet seeded)` — form with status-aware disabled state
4. [[Contract Detail (refreshed)]] — `forward-ref` — post-save view with audit row

## Flow playbooks used (in order)

- [[Edit Contract Flow]] — `forward-ref (flow not yet seeded)`
- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)` — sibling, shares V-rule pack

## Kafka events fired

- `commerce.contract-updated.v1` — `forward-ref (event name TBC)` — Commerce → audit + Charging + Provisioning (on Submit commit)
- `commerce.rate-card-changed.v1` — `forward-ref (event name TBC)` — Commerce → Charging (re-cache)
- `commerce.service-order-changed.v1` — `forward-ref (event name TBC)` — Commerce → Provisioning (scope change)

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]
