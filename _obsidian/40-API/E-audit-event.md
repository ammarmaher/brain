---
type: entity
id: E-audit-event
title: Audit Event (cross-module state-change record)
status: stub
created: 2026-05-18
source: Business deep-dive mining 2026-05-18 (GAP-BIZ-X-07)
priority: high
tags: [entity, cross-module, audit, compliance, stub, "#status/draft", "#module/cross-cutting", "#verification/unverified", "#layer/be"]
module: cross-cutting
feature: audit-event
verification: unverified
last-verified: 2026-05-18
up: "[[E-entities-MOC]]"
parent: "[[E-entities-MOC]]"
layer: be
---

# E-audit-event — Audit Event

> [!warning] **STUB — Authoring required**
> Cross-module audit-trail concern cited by BR-AM-36, BR-CC-30, BR-CGM-28. Each module currently invents action-tracking ad-hoc. No platform-level entity until this stub. Closes GAP-BIZ-X-07 + GAP-BIZ-CC-09.

## One-line shape

An Audit Event is an **append-only record of every cross-module state-changing action** with a shared `correlationId` so flows that touch multiple services can be reconstructed end-to-end.

## Provisional fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key (UUID v7 recommended for time-ordering) |
| `at` | datetime | UTC ISO-8601 |
| `actor` | actorRef | `{userType: 'Falcon'\|'Client'\|'System', userId?: string, tenantId?: string, role: string}` |
| `correlationId` | string | Cross-service trace; SAME id across all events in a single flow (BR-X-AUDIT-EVENT-01) |
| `causationId` | string? | Parent event id (when this event was caused by another) |
| `eventType` | string | Dotted name e.g. `commerce.account.created`, `identity.user.locked`, `charging.contract.activated` |
| `targetEntity` | string | E-* type name e.g. `Account`, `User`, `Contract` |
| `targetId` | string | The id of the affected entity |
| `previousState` | json? | Snapshot or diff of prior state (Q-CC-NEW-12 will decide per-field vs event-only) |
| `newState` | json? | Snapshot or diff of new state |
| `changeSummary` | string | Human-readable one-liner |
| `tenantId` | string? | When tenant-scoped |
| `serviceName` | string | Which microservice emitted (commerce / identity / charging / provisioning) |
| `httpRequestId` | string? | Origin request id |
| `kafkaOffset` | string? | When emitted via Kafka (cross-link to event sourcing) |

## Cross-module use cases

| Source | Event type pattern |
|---|---|
| 01 Account creation (Add Client wizard) | `commerce.account.created`, `commerce.account-settings.created`, `commerce.wallet.configured` |
| 01 Account info edit (Wave 15) | `commerce.account.info-edited` (with previous/new) |
| 01 CommChannel/App actions | `commerce.comm-channel.{visibility-changed, price-changed, activated, expired, disabled}` |
| 01 Wallet transfers | `commerce.wallet.transferred` (contractIds[], amount) |
| 02 User lifecycle | `identity.user.{created, status-changed, locked, deleted, restored}` |
| 02 Password ops | `identity.user.{password-changed, password-reset, forgot-password-completed}` |
| 02 OTP failures | `identity.otp.failed` (counter increment) |
| 03 Contract lifecycle | `charging.contract.{created, activated, expired, extended, edited}` |
| 03 Send Transaction | `charging.send-transaction.{succeeded, failed}` |
| 04 Contact Group ops | `commerce.contact-group.{created, edited, deleted, shared, downloaded}` |
| 05 Template ops | `commerce.template.{created, submitted, approved, rejected, paused-by-meta}` |
| Future: refund / hierarchy-move / account-suspend | TBD per BR-X-* registration |

## Cross-module references

- **01-account-management** — BR-AM-36 (every balance action tagged)
- **03-contract-packaging-charging-billing** — BR-CC-30 (every balance action contract-tagged), BR-CC-46 (OPEN — audit log granularity)
- **04-contact-group-management** — BR-CGM-28 (soft-delete audit), GAP-CGM-29 (Falcon download audit trail)
- **BR-X-AUDIT-EVENT-01** (proposed) — platform-wide invariant

## Open questions

- Q-CC-NEW-12 — Per-field old/new values (yes) vs event-only (no)?
- Q-X-NEW-13 — Shared correlationId mandatory across all cross-module events?
- Retention policy — how long to keep audit events?
- Storage — single audit DB, per-service log, or Kafka topic + sink?

## Backend reality

**[INFERRED]** Multiple per-service audit shapes likely exist today (commerce/identity each with own audit table). Platform-wide entity NOT verified against `[CODE]`. Memory note `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17` confirms action-tracking was invented ad-hoc.

## Bound by BR rules

- BR-AM-36 (consumer)
- BR-CC-30 (consumer)
- BR-CC-46 (OPEN — granularity decision)
- BR-CGM-28 (consumer)
- BR-X-AUDIT-EVENT-01 (proposed normative rule)
- BR-X-PERMISSION-GROUP-01 (audit for PG creation/change)

## See also

- `[[E-permission-group]]` — audit-event consumer
- `[[E-notification]]` — distinct from audit (notification = outbound delivery; audit = state-change record)
- [BRAIN-OUT] `Brain Outputs/datasets/cross-module-business-rules/BR-X-AUDIT-EVENT-01-audit-event-spine.md` (to be authored)

## Authoring status

- 🟡 Provisional shape
- ⏳ Awaiting Q-CC-NEW-12 (per-field vs event-only)
- ⏳ Awaiting Q-X-NEW-13 (mandatory correlationId)
- ⏳ Architecture decision needed: centralised audit DB vs per-service vs Kafka spine
