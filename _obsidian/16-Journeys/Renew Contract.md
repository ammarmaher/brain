*** Journey note — Renew Contract ***
*** Vault file: 16-Journeys/Renew Contract.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\renew-contract\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# Renew Contract

> An Active contract is approaching expiry. The AO (or Falcon admin) creates a successor Contract. On activation, Charging refills the Master Wallet's bucket for the new contract. Old contract balances persist until that contract expires; the nearest-expiring-contract pointer (used by [[Send Campaign]] charging cascade) re-resolves automatically.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/renew-contract/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/renew-contract/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Contracts]] — `forward-ref (page not yet seeded)` — AO sees expiring contract
2. [[Add Contract]] — `forward-ref (flow not yet seeded)` — wizard / form
3. [[Contract Detail]] — `forward-ref (page not yet seeded)` — post-create view

## Flow playbooks used (in order)

- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)`
- [[Contract Renewal Flow]] — `forward-ref (flow not yet seeded)` — renewal-specific UX (could wrap Add Contract)
- [[Activate Contract Flow]] — `forward-ref (flow not yet seeded)` — server-side on start-date

## Kafka events fired

- `commerce.contract-created.v1` — `forward-ref (event name TBC)` — Commerce → audit (on Submit)
- `commerce.contract-activated.v1` — Commerce → Charging + Provisioning + audit (on start-date / payment)
- `commerce.wallet-funded.v1` — `forward-ref (event name TBC)` — Charging → audit (bucket created)
- `commerce.service-order-created.v1` — Commerce → Provisioning (if contract enables new services)

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]
