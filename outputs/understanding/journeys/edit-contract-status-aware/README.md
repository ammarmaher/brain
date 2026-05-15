*** Journey — Edit Contract (status-aware) ***
*** Folder index · 2026-05-15 ***
*** Crosses: Contracts list · Contract Detail · Edit Contract form ***

# Edit Contract (status-aware) — folder index

> A user opens an existing Contract and tries to edit it. The set of editable fields depends on the contract's current Status (Draft / Pending / Active / Expired / Cancelled). [[V-contract-edit-status-aware-fields]] is the central rule: Draft is fully editable; Active is restricted (mostly to admin overrides); Expired is read-only. The journey is chosen as the optional 7th because PRD-03 surfaces this as a high-risk validation point — silently dropping an edit because Status disallows it is a common user-confusion source.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** AO / Falcon admin opens an existing Contract from the Contracts list and clicks Edit.
- **Outcome:** Editable subset of fields is updated; backend re-validates; ledger event emitted for audit; if rate-card changed and contract is Active, downstream charging cascade picks up new rates on next send.
- **Pages traversed:** Contracts list → Contract Detail → Edit Contract form → Contract Detail (refreshed).
- **Flow playbooks used:** [[Edit Contract Flow]] (forward-ref) · [[Add Contract Flow]] (forward-ref — shared validation).
- **Services exercised:** Commerce (primary) → Charging (consumes rate updates) → Provisioning (if services scope changes) → Access PES.
- **Kafka events fired:** `commerce.contract-updated.v1` (forward-ref) · `commerce.rate-card-changed.v1` (forward-ref).

## Cross-journey relations

- **Depends on:** Contract exists (created via [[Add Contract Flow]] in [[New Tenant Onboarding]] or [[Renew Contract]]).
- **Triggers downstream:** Next [[Send Campaign]] picks up new rates.
- **Sibling:** [[Renew Contract]] is the "add a successor" alternative when an Active contract cannot be edited deeply.

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
