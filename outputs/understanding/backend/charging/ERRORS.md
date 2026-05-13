# Charging Service — Error Catalog

> Source-of-truth: `Falcon.Charging.Domain/Constants/FalconKeys.cs` (the `Error` nested class).
> Unlike Commerce, Charging does **not** decorate error codes with `[ErrorHttpStatus]` — the middleware likely uses a default mapping or a switch in the exception handler.

## Error Codes

| Code | Description |
|---|---|
| `DuplicateTenantName` | Conflict; tenant name already exists |
| `InternalServerError` | Catch-all server error |
| `UnauthorizedUserToPerformThisAction` | Caller lacks permissions |
| `NoAnyCommChannelWalletWasFound` | No comm-channel wallet for the account |
| `WalletSettingsNotFound` | Wallet config absent (Commerce hasn't published yet, or sync failed) |
| `WalletNotFound` | Wallet entity missing |
| `InvalidTransferWallets` | Source/destination combo invalid (same id, currency mismatch, …) |
| `InsufficientBalance` | Not enough quota to charge / transfer / debit |
| `CommChannelSubWalletNotFound` | Owner-level sub-wallet for a comm-channel missing |
| `InvalidAmount` | Amount ≤ 0 or otherwise invalid |
| `InvalidWalletIdentity` | Wallet id shape / scope invalid |
| `InvalidIdempotencyKey` | Idempotency key malformed |
| `InvalidChargeRequest` | Charge request shape invalid (missing required fields, etc.) |
| `WalletVersionConflict` | Optimistic-concurrency lost — retried up to `MaxOptimisticRetries` (default 3) inside the handler before surfacing this |
| `ReservationNotFound` | Reservation id invalid or already finalized/expired |
| `NoApplicableRate` | Requested `ApplicationId/ChannelId/Priority/Destination/Unit` combo has no contract rate |

## Error Surface Mapping (inferred)

Without `[ErrorHttpStatus]`, the exception handler likely maps by code suffix:

| Code Pattern | Likely HTTP Status |
|---|---:|
| `*NotFound` | 404 |
| `Duplicate*` | 409 |
| `Insufficient*`, `Invalid*` | 422 |
| `Unauthorized*` | 403 |
| `InternalServerError` | 500 |
| `*VersionConflict` | 409 (Concurrency) — but verify; could also be 503 with `Retry-After` |

**Verify** by triggering each case in dev. The middleware logic is in `Falcon.Charging.Api.Middlewares` (not deep-read in this scan).

## Exception Type

`FalconException(FalconKeys.Error.<Code>, optional message)` — same shape as Identity/Commerce.

## Localization

Like every service, error codes are looked up in `Resources/ErrorMessages.{en,ar}.resx` via `ErrorLocalizer`. `app.ValidateErrrosResourceCompleteness()` fails startup on missing translations.

## Idempotency-as-Success Pattern

Note the **`AlreadyApplied` boolean** in `DirectDebitResponse`, `ReserveWalletChargeResponse`, `UpdateWalletReservationResponse`. When the handler detects a duplicate (`ReferenceType + ReferenceId` seen before), it returns success with `AlreadyApplied = true` and the original transaction id — rather than throwing. This is by design and **must not** be treated as an error by the frontend.

## Reservation Lifecycle Errors

`ReservationNotFound` is thrown when:
- Reservation id doesn't exist
- Reservation has expired (auto-released by sweeper)
- Reservation has already been committed/released

Frontend should retry the full reserve-commit cycle when it sees this on a `Commit`, not just retry `Commit`.

## Rate Errors

`NoApplicableRate` is thrown when the OCS rate-engine can't resolve a price for the requested combination. The frontend cannot fix this — it indicates a contract configuration gap. Show a user-friendly "Service not configured" message and surface it to ops.
