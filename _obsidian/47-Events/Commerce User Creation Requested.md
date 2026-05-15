---
type: kafka-event
topic: commerce.user-creation-requested.v1
channel: kafka
producer-service: commerce
consumer-services: [identity]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce User Creation Requested ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.user-creation-requested.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce User Creation Requested

> Commerce asks Identity to provision a user in Zitadel.

## At a glance

- **Topic:** `commerce.user-creation-requested.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `UserCreationRequestedEventPublisher`
- **Consumer:** [[Identity Service]] · `UserCreationRequestedConsumer`
- **Trigger:** Add Client wizard Step 5 · Add User wizard

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.user-creation-requested.v1.md)

## Related PRDs

- [[02 User Management]] · [[01 Account Management]]

## Related V-rules

- [[V-user-first-last-name-letters-only]] · [[V-username-format-uniqueness-immutable]] · [[V-password-security-level-enum]]

## Gaps

- KAFKA-GAP-01 — topic-name documentation drift (Identity overview says `commerce.user-created.v1`)
- Payload schema not in DTO_DICTIONARY
- Idempotency not documented

## Tags

#type/kafka-event #prd/01 #prd/02 #service/commerce #service/identity #drift #gap #security

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
