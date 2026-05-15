---
type: kafka-event
topic: commerce.identity-settings-sync.v1
channel: kafka
producer-service: commerce
consumer-services: [identity]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Commerce Identity Settings Sync ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.identity-settings-sync.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Identity Settings Sync

> Tenant identity settings (password policy, login policy) changed in Commerce; Identity + Zitadel sync.

## At a glance

- **Topic:** `commerce.identity-settings-sync.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `TenantIdentitySettingsSyncEventPublisher`
- **Consumer:** [[Identity Service]] · `IdentitySettingsSyncConsumer`
- **Trigger:** Add Client wizard Settings step · Settings page update

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.identity-settings-sync.v1.md)

## Related PRDs

- [[02 User Management]] · [[01 Account Management]]

## Related V-rules

- [[V-password-security-level-enum]] · [[V-password-complexity-per-security-level]] · [[V-login-lockout-3-wrong-attempts]]

## Gaps

- Zitadel propagation failure path not documented (3-way split-brain risk)
- UI confirms "settings saved" but actual policy is eventually consistent

## Tags

#type/kafka-event #prd/01 #prd/02 #service/commerce #service/identity #security

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
