---
type: index
folder: 47-Events
created: 2026-05-15
---
*** 47-Events folder index ***
*** Created 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Vault graph layer over Brain Outputs/understanding/integration/events/ ***

# 47-Events — Kafka + Redis + Webhook Topology

> Vault graph nodes for every event in the Falcon platform. Brain Outputs holds the source-of-truth contracts; these notes are graph nodes linking events ↔ services ↔ PRDs ↔ V-rules ↔ entities.

## Master index → producer-to-consumer

See [Event Topology README in Brain Outputs](../../../Brain%20Outputs/understanding/integration/events/README.md) for the full table + Mermaid + gaps.

## Events (Kafka)

### Commerce-produced (9)
- [[Commerce User Creation Requested]] → Identity
- [[Commerce User Wallet Create]] → Charging
- [[Commerce SubNode Wallet Create]] → Charging
- [[Commerce Comm-Channel Shown]] → Charging
- [[Commerce Comm-Channel Init]] → Templates *(producer-doc gap)*
- [[Commerce Comm-Channel Visibility Changed]] → Templates *(producer-doc gap)*
- [[Commerce Order Created]] → Charging
- [[Commerce Wallet Configured]] → Charging
- [[Commerce Contract Lifecycle]] → Charging
- [[Commerce Identity Settings Sync]] → Identity
- [[Commerce Tenant IP Allowlist Changed]] → Core Gateway

### Charging-produced (2)
- [[Charging Order Payment Processed]] → Commerce
- [[Charging OCS Wallet Events]] → Ledger (external)

### Identity-produced (3)
- [[Identity User Events]] → Access PES (· Charging?)
- [[Identity User Checker Assigned]] → Templates *(producer-doc gap)*
- [[Identity User Checker Assignments Updated]] → Templates *(producer-doc gap)*

### Contact Group-produced (1)
- [[Contact Group Import Requested]] → self-consume + external campaign tooling

### Dev-only (1)
- [[Commerce Test Event]] — `commerce.test-event`, dev-only round-trip — KAFKA-GAP-06

## Non-Kafka channels

- [[OCS Realtime Events Stream]] — Redis stream `ocs:realtime-events` for Charging hot path
- [[Zitadel Webhook]] — inbound HTTP webhook → Identity

## Tags

#type/index #gap #security

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
