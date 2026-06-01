---
type: architecture-note
domain: api / messaging
created: 2026-05-19
source: Round-3 Opus 4.7 deep-dive (Kafka agent + Avro agent)
---
# Kafka & Avro Architecture — Falcon

Deep-dive reference for how Kafka and Avro actually work in Falcon. Source of truth is the code;
this note holds the key facts + links. Full detail: the deep-dive report under
`reports/signalr-realtime-deep-dive-report/`.

## Kafka — broker & cluster
- `confluentinc/cp-kafka:7.6.1`, **single broker, ZooKeeper-mode**. Replication factor 1 (dev).
- Listeners: `kafka:29092` (in-cluster) / `127.0.0.1:9092` (host).
- `kafka-init` provisions **14 topics**. Broker `auto.create.topics=true` in dev; producers/consumers set `AllowAutoCreateTopics=false`.
- Retention: cluster default 7 days.

## Kafka — producer
- `KafkaAvroProducer<T>` → `ProduceAsync`. Config: `Acks=All`, `EnableIdempotence=true`, `Partitioner=Consistent`.
- **Message key = `ReferenceId` = `OrderId`** for the do-payment events → per-order ordering preserved.
- No transactional outbox — a publish failure is caught + logged; an event **can be missed**.

## Kafka — consumer
- `BackgroundService` loop; `EnableAutoCommit=false`, manual `Commit` after processing; `IsolationLevel=ReadCommitted`.
- Platform default `AutoOffsetReset=Earliest`. A **realtime** consumer should use **`Latest`** (never replay stale events).
- DLQ is a **no-op stub** — `PublishToDeadLetterAsync` only logs.

## Kafka — findings
- ⚠️ **`commerce.order-finalized.v1` is NOT in `kafka-init`** — survives in dev only by broker auto-create; must be provisioned explicitly for staging/prod.
- ⚠️ **Consumer-group collision** — Commerce and Charging both use group `commerce-service` (safe only because topic sets are disjoint; latent bug). A new service must use its own unique group.
- The do-payment events: `commerce.order-created.v1` → `charging.order-payment-processed.v1` → `commerce.order-finalized.v1`.

## Avro & Schema Registry
- Confluent Schema Registry; subject naming = default **TopicNameStrategy** → `<topic>-value`.
- Producers auto-register the schema on first publish; consumers resolve writer-vs-reader by the embedded 4-byte schema id.
- Declared `BACKWARD` compatibility level is **config-only — enforced by zero lines of code**.
- Two C# Avro patterns: reflection-based `AvroEventBase` (gateways, scalars only) and hand-written `ISpecificRecord` (everything with unions / nested records — required for `OrderFinalizedEvent`).
- **The C# namespace must equal the Avro record full-name** (`Falcon.Commerce.Events`) or the Confluent deserializer throws.

## Avro — findings
- ⚠️ **No shared contracts package.** `EventContext` is hand-copied across **8 repos**; `OrderFinalizedEvent` across **3**.
- ⚠️ **Live writer/reader field drift** on `charging.order-payment-processed.v1` (writer 6 fields, reader 7) — safe today only because the extra field is trailing + defaulted (BACKWARD).
- `AvroDeserializer<T>.AsSyncOverAsync()` is mandatory — the consumer's sync `Consume()` needs a sync deserializer.

## Related
- [[Realtime-SignalR-Architecture]] — the realtime design that consumes `commerce.order-finalized.v1`
- Deep-dive report: `reports/signalr-realtime-deep-dive-report/REALTIME_SIGNALR_REPORT.html`

#type/architecture #kafka #avro #messaging
