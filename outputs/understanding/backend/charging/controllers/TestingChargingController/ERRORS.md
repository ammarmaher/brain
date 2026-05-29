# TestingChargingController — Errors

> Subset of [`charging/ERRORS.md`](../../ERRORS.md) relevant to the Charging Lab.

## Feature-Gate Error (Special)

| Endpoint | HTTP Status | Body | Trigger |
|---|---|---|---|
| All 9 endpoints | 404 | empty | `Settings:TestingCharging:Enabled == false` |

**Important** — this 404 is `NotFound()` from MVC, not a `FalconException` with envelope. The response has **no `ServiceOperationResult` envelope** — it is a raw 404. Frontend distinguishing "feature disabled" from "URL not found" is impossible from the response alone.

The naming intentionally makes it look like a routing miss to obscure the feature's existence to unauthorized observers.

## Read Endpoints

| Endpoint | Likely Errors |
|---|---|
| `GET /accounts/{accountId}/overview` | `Unauthorized`, `Forbidden` |
| `GET /accounts/{accountId}/wallets` | `Unauthorized`, `Forbidden` |
| `GET /accounts/{accountId}/reservations` | `Unauthorized`, `Forbidden` |
| `GET /accounts/{accountId}/ledger` | `Unauthorized`, `Forbidden` |
| `GET /accounts/{accountId}/balances` | `Unauthorized`, `Forbidden` |
| `GET /runs` | `Unauthorized`, `Forbidden` |

All reads are forgiving: an unknown `accountId` returns empty results (not a 404). Only authentication failures (401) and feature-gate (404) produce non-200 responses.

## `GetRun` (single)

| HTTP Status | Code | Trigger |
|---|---|---|
| 4xx | `InvalidChargeRequest` | `runId` does not exist (likely 400 or 422 depending on middleware) |
| 401 | `Unauthorized` | Missing JWT |

**Bug** — `InvalidChargeRequest` is the wrong code for "run not found". Should be a "not found" code, or reuse `ReservationNotFound`. See OVERVIEW.md finding #6.

## `CreateWhatsappBatch`

| HTTP Status | Code | Trigger |
|---|---|---|
| 4xx | `InvalidChargeRequest` | Missing `AccountId`/`OwnerId`/`ApplicationId`, or `QuantityPerMessage <= 0` |
| 4xx | `NoApplicableRate` | `ChannelId` not provided AND no active tariff rate matches application/priority/destination/unit |
| 4xx | `WalletNotFound` | OwnerId-Channel-Currency triple has no wallet (raised by `IReserveWalletChargeHandler`) |
| 4xx | `InsufficientBalance` | Any individual message reserve fails on balance — recorded per-message; **does not** fail the whole call |
| 4xx | `WalletVersionConflict` | Retries exhausted on optimistic concurrency — recorded per-message |
| 4xx | `CommChannelSubWalletNotFound` | Channel sub-wallet missing for owner — recorded per-message |
| 4xx | `InvalidIdempotencyKey` | (theoretical) idempotency cache state inconsistent |
| 4xx | `InvalidChargeRequest` (from handler) | Validation inside `IReserveWalletChargeHandler` — recorded per-message |
| 500 | `InternalServerError` | Unhandled exception in the simulator (logged, surfaces in response unenvelope) |

**Critical** — `CreateWhatsappBatch` itself returns `200 OK` even if every message in the batch fails to reserve. The failures are captured per-message as `ReservationStatus = "ReserveFailed"` with `Error = <formatted message>`. The overall HTTP envelope shows success. Frontend MUST inspect `result.messages[].reservationStatus` to detect actual failures, not just HTTP 200.

The only way to fail the whole `CreateWhatsappBatch` call is one of:
- The top-level field validation (`InvalidChargeRequest` for missing/empty required fields, or `QuantityPerMessage <= 0`)
- The channel resolution step (`NoApplicableRate`)
- Persistence failure on `runRepository.AddAsync` or `messageRepository.AddManyAsync` (`InternalServerError`)

## `TriggerWhatsappDeliveries`

| HTTP Status | Code | Trigger |
|---|---|---|
| 4xx | `InvalidChargeRequest` | `runId` does not exist (per `GetRequiredRunAsync` bug) |
| 4xx | `ReservationNotFound` | Reservation expired (auto-released by background sweeper) — recorded per-message |
| 4xx | `WalletVersionConflict` | Retries exhausted on commit/release — recorded per-message |

Same pattern as `CreateWhatsappBatch`: per-message failures are recorded in `MarkDeliveryFailed(formatted)`, and `formatted` adds a TTL diagnostic if the underlying cause was `ReservationNotFound` from a late delivery on an expired reservation:

```csharp
// [CODE] TestingChargingService.cs:556-567
return formatted.Contains(FalconKeys.Error.ReservationNotFound, ...) &&
       IsReservationPastTestingTtl(run, message, out var reservationExpiresAt)
    ? $"{formatted}. The reservation TTL was {run.ReservationTtlSeconds} seconds and expired at {reservationExpiresAt:O}; recreate the batch with a larger TTL before triggering delivery."
    : formatted;
```

## Idempotency Path

For `CreateWhatsappBatch`: per-message reference id `testing-wa-{runId}-{sequence}` is unique per run; underlying handler's 24h Redis cache deduplicates within the window. A retried `CreateWhatsappBatch` (same run) with the same `runId` is **not possible** — the run id is server-generated as a new id per call. To "retry" the QA must call `TriggerWhatsappDeliveries({runId})` against the existing run.

## Auth Errors

| HTTP Status | Code | Trigger |
|---|---|---|
| 401 | `Unauthorized` | Missing/invalid JWT |
| 403 | `Forbidden` | (rare — class-level `[Authorize]` only checks authentication, not authorization claim) |

The lab does **not** enforce a Falcon-admin policy. Any authenticated user can call the simulator **if the feature gate is on**.

## Internal Errors

| HTTP Status | Code | Trigger |
|---|---|---|
| 500 | `InternalServerError` | Unhandled exception (Mongo down, Redis down, tariff cache empty, etc.) |

## Frontend Error Surface

| HTTP Status | Backend Code | Frontend Action |
|---|---|---|
| 200 (with per-message failures inside `result.messages[]`) | mixed | Inspect each message's `reservationStatus`/`deliveryStatus`/`error`. Render per-message grid with red rows for failures. |
| 4xx (envelope) | `InvalidChargeRequest`, `NoApplicableRate` | Show top-level error toast — request fundamentally broken |
| 404 (empty body) | (feature gate) | Show "Charging Lab disabled" — admin must flip `TestingCharging:Enabled` |
| 401 | `Unauthorized` | Redirect to login |
| 500 | `InternalServerError` | Generic error toast, log for ops |

## Error Code Bugs in Service

1. **`GetRequiredRunAsync`** throws `InvalidChargeRequest` for "run not found". Should be `ReservationNotFound` (closest match) or a new `RunNotFound` code.

2. **Per-message exceptions are stringified, not coded** — `FormatTestingException` joins `error.ErrorCode + error.Description` into a plain string. The FE cannot programmatically classify the error code; it must parse the string. See `[CODE] TestingChargingService.cs:492-505`.

## Error Resource Completeness

`app.ValidateErrrosResourceCompleteness()` requires every `FalconKeys.Error.*` code surfaced by this controller to have En/Ar translations. Used codes:

- `InvalidChargeRequest`
- `NoApplicableRate`
- `ReservationNotFound`

Plus all codes raised by the underlying reserve/commit/release handlers — see `WalletController/ERRORS.md`.
