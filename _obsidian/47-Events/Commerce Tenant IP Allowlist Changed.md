---
type: kafka-event
topic: commerce.tenant-ip-allowlist-changed.v1
channel: kafka
producer-service: commerce
consumer-services: [core-gateway]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Commerce Tenant IP Allowlist Changed ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.tenant-ip-allowlist-changed.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Tenant IP Allowlist Changed

> Tenant IP allowlist updated; Core Gateway invalidates its Redis cache so the next request reflects the new list.

## At a glance

- **Topic:** `commerce.tenant-ip-allowlist-changed.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `TenantIpAllowlistChangedEventPublisher`
- **Consumer:** [[Core Gateway Service]] · `TenantIpAllowlistChangedConsumer` (consumer group `core-gateway-service`)
- **Trigger:** Tenant Settings → IP allowlist save

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.tenant-ip-allowlist-changed.v1.md)

## Related PRDs

- [[01 Account Management]] · [[02 User Management]]

## Related V-rules

- [[V-account-ip-allowlist-enforcement]]

## Gaps

- Out-of-order delivery — no version-number check documented (older snapshot could overwrite newer)
- Fail-open on Redis error (`FailOpenOnRedisError: true`) — liveness over security
- DLQ not defined
- System Gateway has no consumer (intentional — admin traffic is tenant-less)

## Tags

#type/kafka-event #prd/01 #prd/02 #service/commerce #service/core-gateway #security

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
