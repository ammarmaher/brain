*** Kafka Event — Contact Group Import Requested ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: contact-group/SERVICE_OVERVIEW.md ***

# contactgroup.import-requested.v1

> Contact Group emits this event when an upload-session is finalized. The same service consumes it internally for async-durable processing. (Producer/consumer-on-same-topic pattern — the service triggers itself via Kafka for at-least-once durability.)

## Topic / channel

- **Topic name (verbatim):** `contactgroup.import-requested.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Contact Group Service]]
- **Publisher class:** `ImportJobRequestedEventPublisher`
- **Trigger:** Upload session finalized — the user has submitted the 4-step Create Contact Group wizard and the CSV/XLSX has been validated. The service writes an event instead of starting the long-running import inline.
- **Payload shape:** `inferred` — likely `{ TenantId, ContactGroupId, UploadSessionId, FileLocation (S3 key / pre-signed URL), ColumnMapping, RowCount, RequestedByUserId, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Contact Group Service]] (same service) — `ImportJobRequestedConsumer`
  - Reads the file from S3, parses rows, persists contacts to the `ContactGroupRecord` collection.
  - This is a **self-consume durability pattern** — using Kafka as a durable queue for an internal background job, rather than an in-memory queue that would lose state on crash.
- **External downstream:** documentation says "Notify downstream consumers (likely campaign tooling)" but no external consumer is in scope.

## Idempotency

- **Not documented at the Kafka layer.** Contact Group does use a Redis-backed idempotency cache ("`Redis:ConnectionString` — distributed locks, idempotency cache (verify)") but whether the import consumer uses it on the `UploadSessionId` is not stated.

## Error path

- **Not documented.** Hangfire-based background cleanup exists for orphaned upload sessions, suggesting that partial-import failures are eventually cleaned up — but the immediate retry / DLQ behavior on the Kafka consumer is unstated.

## Side effects (chain)

- Contact Group rows materialize in Mongo.
- The Contact Group becomes downloadable via the pre-signed S3 URL endpoints.
- Background Hangfire cleanup removes orphaned upload sessions and soft-deleted groups.

## Related PRDs

- [[04 Contact Group Management]] — primary

## Related V-rules

- [[V-contact-group-file-type-allowlist]] — validated upstream on upload
- [[V-contact-group-file-size-cap]] — likewise
- [[V-contact-group-name-required-format]] — likewise
- [[V-contact-group-column-name-shape]] — likewise
- [[V-contact-group-share-policy-mode-mutex]] — share policy is set later, separate flow

## Related entity reconciliation

- E-ContactGroup ↔ E-ContactGroupColumn ↔ E-ContactGroupRecord ↔ E-UploadSession

## Gaps / drift

- **KAFKA-GAP-10** — No documented external consumer. The "campaign tooling" downstream is not in the 9-service inventory. Either it's planned, external, or the documentation is aspirational.
- Self-consume pattern is unusual — verify the consumer group config is intentional (probably `contactgroup-service` consumer group, as per the service's group id).

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
