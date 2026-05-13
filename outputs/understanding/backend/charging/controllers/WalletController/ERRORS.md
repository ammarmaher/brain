# WalletController — Errors

> Subset of [`charging/ERRORS.md`](../../ERRORS.md) relevant to wallet operations.

## Read Endpoints

| Endpoint | Likely Errors | HTTP Status (inferred) |
|---|---|---|
| `POST /get-account-wallets` | `WalletNotFound`, `WalletSettingsNotFound`, `UnauthorizedUserToPerformThisAction` | 404, 404, 403 |
| `GET /contract-balance-summaries` | `WalletNotFound` | 404 |

## Direct Debit

| Endpoint | Likely Errors |
|---|---|
| `POST /debit` | `InvalidAmount`, `WalletNotFound`, `WalletSettingsNotFound`, `InsufficientBalance`, `WalletVersionConflict` (retry-exhausted) |

## Reserve / Authorize

| Endpoint | Likely Errors |
|---|---|
| `POST /authorize`, `POST /reserve` | `InvalidChargeRequest`, `InvalidIdempotencyKey`, `NoApplicableRate`, `CommChannelSubWalletNotFound`, `InsufficientBalance`, `WalletNotFound`, `WalletSettingsNotFound`, `WalletVersionConflict` |

## Commit / Release

| Endpoint | Likely Errors |
|---|---|
| `POST /commit` | `ReservationNotFound`, `WalletVersionConflict` |
| `POST /release` | `ReservationNotFound`, `WalletVersionConflict` |

`ReservationNotFound` covers:
- Invalid `ReservationId`
- Reservation already committed or released
- Reservation expired (auto-released by the background sweeper)

## Transfer

| Endpoint | Likely Errors |
|---|---|
| `POST /transfer` | `InvalidTransferWallets`, `InvalidWalletIdentity`, `WalletNotFound`, `InsufficientBalance`, `InvalidAmount`, `WalletVersionConflict` |

## Idempotency Path

For mutators, if the same `ReferenceType + ReferenceId` was seen within the idempotency TTL (24h), the handler returns the cached response with `AlreadyApplied = true` — **no exception thrown**.

## Concurrency Conflict

`WalletVersionConflict` is surfaced **only** when the handler's internal retry loop (3 retries with exponential backoff + jitter) is exhausted. Frontend should treat this as transient — display a "please retry" message rather than a hard error.

## Auth Errors

- `Unauthorized` (401) — missing/invalid JWT
- `Forbidden` (403) — JWT valid but user not allowed to operate on this account/wallet
- `UnauthorizedUserToPerformThisAction` (403) — same, more specific message

## Internal Errors

- `InternalServerError` (500) — unhandled exception
- (No `[ErrorHttpStatus]` attribute in Charging — actual mapping done by the exception handler middleware)
