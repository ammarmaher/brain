---
type: atlas-volume-graph-node
volume: 51
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-51-CROSS-BC-SAGA-MAP.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol51
  - specialist/saga
  - specialist/kafka
  - specialist/cross-bc
---

# Vol 51 — Cross-Bounded-Context Saga Map

> Map of every Kafka topic, outbox/inbox pattern, saga compensation, and cross-service handshake.

## What's in it

11 sections:
- §1 Service topology (7-service map) + ownership matrix
- §2 Kafka topic inventory (Commerce/Identity/Provisioning/Charging producers + consumers)
- §3 Outbox pattern + Inbox pattern (with code-mining queue)
- §4 6 saga patterns (User Creation, CommChannel Purchase, Contract Expiry, Account Soft-Delete, Template Submission, Send Transaction)
- §5 6 failure modes catalog
- §6 Idempotency patterns (WalletMutationReceipt + general)
- §7 Saga mental model (4-question test + owns-vs-uses rule + publish-before-respond)
- §8 Audit trail across services (correlationId + causationId chain)
- §9 PR review checklist (12 items)
- §10 Cross-references
- §11 10 new open questions (Q-SAGA-01..10)

## Headline truth

> **Identity owns User entity** (not Commerce). Cross-BC flow uses **outbox-in-same-txn** (Commerce DB) → Kafka publisher → consumer with inbox dedup. Charging's `WalletMutationReceipt` is the canonical idempotency pattern. Contract expiration is Kafka-driven via `ProjectContractLifecycleProcess.ExecuteExpiryAsync`. Send transactions follow the canonical 6-step saga: validate destination → check template → fund via Charging → POST to provider → webhook to BSA → refund-on-failure compensation.

## See also

- [[WALLET-SPECIALIST-HUB]] — Charging is the wallet authoritative
- [[USER-LIFECYCLE-SPECIALIST-HUB]] — Identity-as-User-owner reversal explained
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — Send saga
- [[Vol 40 — Module 06 BSA]] — BSA transaction states
- [[ATLAS_MASTER_INDEX]]
