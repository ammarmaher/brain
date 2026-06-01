---
type: kafka-event
topic: <topic.name.v1>
channel: <kafka|redis|webhook|grpc>
producer-service: <service>
consumer-services: [<service-1>, <service-2>]
idempotency-documented: <true|false>
dlq-documented: <true|false>
created: <YYYY-MM-DD>
---

*** Kafka Event — <Event Name> ***
*** Channel · <YYYY-MM-DD> ***

# <Event Name>

> One-sentence purpose: what this event signals.

## Topic / channel

- **Topic name (verbatim):** `<exact-name>`
- **Channel type:** Kafka / Redis stream / gRPC / Webhook
- **Schema:** Avro / JSON / Protobuf

## Producer

- **Service:** [[<Service Name>]]
- **Trigger:** what business event causes this to be produced
- **Payload shape:** (cite from DTO_DICTIONARY if surfaced; mark `inferred` otherwise)

## Consumer(s)

- **Service:** [[<Service Name>]] — what they do when they consume

## Idempotency

- How the consumer ensures duplicate events don't double-effect — or `not documented`

## Error path

- What happens if consumption fails (DLQ · retry · poison-pill) — or `not documented`

## Side effects (chain)

- Bullet list of downstream entity/state changes

## Related PRDs

- [[NN <module>]]

## Related V-rules

- [[V-...]]

## Related entity reconciliation

- [[E-...]]

## Gaps / drift

- Anything missing from the documentation

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[47-Events/README|47-Kafka-Events]] · [[AMMAR_BRAIN_HOME]]
