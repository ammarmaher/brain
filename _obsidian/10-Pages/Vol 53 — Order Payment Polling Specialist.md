---
type: atlas-volume-graph-node
volume: 53
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-53-ORDER-PAYMENT-POLLING-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol53
  - specialist/order
  - specialist/payment
  - specialist/polling
---

# Vol 53 — Order Status & Payment Polling Specialist Guide

> The runtime model for DoPayment: order entity, SimplePollService (2s × 30min), the 3 failure-reason dialogs, end-to-end saga across Commerce + Charging + Provisioning.

## What's in it

11 sections:
- §1 Why orders + polling (TOCTOU race + 30-min generous timeout)
- §2 Order entity lifecycle (3 states: Pending/Active/Failed)
- §3 Payment saga end-to-end (9-step)
- §4 Race conditions catalog
- §5 UX patterns (3 dialogs)
- §6 Integration points with Wallet/Campaigns/User/PES
- §7 Edge cases
- §8 Endpoint surface
- §9 PR review checklist
- §10 Cross-references
- §11 5 new open questions (Q-ORD-01..05)

## Headline truths

> Order is async; FE polls `GET /api/order/{id}/status` every 2 seconds for up to 30 minutes via `SimplePollService`. Three failure-reason dialogs: `CommChannelPriorityOrderRequired` · `InsufficientFunds` · `WalletNotConfigForTheNode`. The saga produces Kafka events: `commerce.order-created.v1` → Charging → `charging.order-payment-processed.v1` → Commerce → Provisioning (currently incomplete — see Vol 51 §V51-PROVISIONING-ADDENDUM).

## See also

- [[WALLET-SPECIALIST-HUB]] — `ResolveWalletFundingDecisionPolicy` underlies this
- [[Vol 54 — Reservation TTL Specialist]] — reservations underlie the order saga
- [[Vol 55 — Marketplace Visibility Pricing Specialist]] — order is the runtime for stuck-state recovery
- [[VOL-44-TRUTH-TAUTOLOGIES]] §CommChannel + §Marketplace
- [[ATLAS_MASTER_INDEX]]
