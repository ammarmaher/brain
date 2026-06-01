*** Contracts List — Kafka side effects ***
*** Read-only page · 2026-05-18 ***

# Contracts List — Kafka Side Effects

> **The Contracts List is read-only — it produces NO Kafka events.** This file documents the events the list passively consumes (via re-fetch on navigation) and the upstream events that update the projection it reads.

## Events this page produces

None.

## Events this page eventually reflects (background, via projection)

### From Commerce

| Topic | Producer | Effect on list |
|---|---|---|
| `commerce.contract-created.v1` | Commerce (`POST /api/Contracts` handler) | New row appears on next list refresh |
| `commerce.contract-updated.v1` | Commerce (`PUT /api/Contracts/{id}` handler) | Row updates on next list refresh |
| `commerce.contract-status-changed.v1` | Commerce (cron: pending→active on start date, active→expired on end date) | Row coloring + status pill change on next refresh |

### From Charging (drives `remainingValue` column)

| Topic | Producer | Consumer | Effect |
|---|---|---|---|
| `commerce.order-created.v1` | Commerce | Charging (debits wallet → updates ContractBalance projection) | `remainingValue` decreases |
| `charging.order-payment-processed.v1` | Charging | Charging itself (projection updater) | Same |
| `commerce.contract-funded.v1` | Commerce (when wallet is funded against a contract) | Charging | `remainingValue` increases on first activation |

[INFERRED] Topics named conventionally per [MEMORY] platform standards. Verify in Commerce/Charging source.

## Status auto-transitions (cron-driven, NOT Kafka-driven)

[INFERRED] Commerce runs a periodic job that flips contract statuses:

```
pending → active   when today >= startDate
active → expired   when today > endDate
```

The job emits `commerce.contract-status-changed.v1` on each transition. List reflects on next fetch.

## Live refresh strategy

Current old-UI: NO live refresh. User must manually navigate away and back (or click a different node) to re-fetch.

[INFERRED] NEW UI improvement: subscribe to Kafka events via SignalR or SSE to push status changes to the FE in real-time. Out of scope for Phase 1.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
