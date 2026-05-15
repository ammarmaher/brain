*** Journey — Renew Contract ***
*** Folder index · 2026-05-15 ***
*** Crosses: Contracts list · Add Contract · Auto-activation · Master Wallet refill ***

# Renew Contract — folder index

> An Active contract is approaching expiry. The AO (or admin) creates a successor Contract before the old one expires. Backend auto-activates the new contract on its start-date, refills the Master Wallet's nearest-expiring bucket, and ensures business continuity. Existing balances on the old contract persist until expiry.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** AO notices an Active contract approaching expiry (typically via a Falcon dashboard reminder) and creates a successor Contract; OR a Falcon admin proactively adds a contract on behalf of the tenant.
- **Outcome:** New Active Contract overlaps or replaces the old one. Master Wallet refilled. Nearest-expiring contract for charging cascade points at the right bucket.
- **Pages traversed:** Contracts list → Add Contract (form/wizard) → Contract detail (Active).
- **Flow playbooks used:** [[Add Contract Flow]] (forward-ref) · [[Contract Renewal Flow]] (forward-ref).
- **Services exercised:** Commerce → Charging → Provisioning → Access PES.
- **Kafka events fired:** `commerce.contract-created.v1` (forward-ref) · `commerce.contract-activated.v1` · `commerce.wallet-funded.v1` (forward-ref) · `commerce.service-order-created.v1`.

## Cross-journey relations

- **Depends on:** Tenant `Active` ([[New Tenant Onboarding]] completed); old contract `Active` and approaching expiry.
- **Triggers downstream:** Continued [[Send Campaign]] flow against new contract.
- **Sibling:** [[Edit Contract Status Aware]] — partial edits respecting Status (Draft / Active / Expired) cannot be done equally.

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
