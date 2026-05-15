---
type: journey
journey-name: Wallet Transfer
crosses-pages: [wallet, transfer-form, wallet-refreshed, implementationknowledgemap, backendindex, validationindex]
prds-involved: []
created: 2026-05-15
---
*** Journey note — Wallet Transfer ***
*** Vault file: 16-Journeys/Wallet Transfer.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\wallet-transfer\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# Wallet Transfer

> Balance moves between wallet aggregates within a single Account, bounded by the source-destination matrix (Master ↔ CommChannel by Falcon usertype; CommChannel ↔ User/Node and User ↔ User by AO/NA in own scope; Master Wallet exempt from Balance Transfer Limit %). Backend enforces via [[V-charging-transfer-source-destination]]; double-write ledger entries are created on commit.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/wallet-transfer/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/wallet-transfer/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Wallet]] — `forward-ref (page not yet seeded)` — wallet tree + balances
2. [[Transfer Form]] — `forward-ref (page not yet seeded)` — source / destination / amount
3. [[Wallet (refreshed)]] — `forward-ref` — same page post-transfer

## Flow playbooks used (in order)

- [[Wallet View Flow]] — `forward-ref (flow not yet seeded)`
- [[Transfer Wallet Flow]] — `forward-ref (flow not yet seeded)`

## Kafka events fired

- `charging.transfer-completed.v1` — `forward-ref (event name TBC)` — Charging → audit + wallet UIs
- `commerce.wallet-balance-changed.v1` — `forward-ref (event name TBC)` — Charging → Commerce (or vice-versa) — wallet metadata cache
- `charging.transfer-failed.v1` — `forward-ref (event name TBC)` — Charging → audit + alerting

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]

## Tags

#type/journey
