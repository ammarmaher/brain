# WalletController — Validations

## DTO-Level Validation

No `[Required]`, `[Range]`, `[ThrowIfNotPassed]`, FluentValidation, or any other DTO-level validation on the WalletController request DTOs. All validation is handler-side.

## Handler-Level Validation

| Handler | Validates | Throws |
|---|---|---|
| `IGetAccountWalletsHandler` | `AccountId` exists, OwnerIds belong to the account | `WalletNotFound`, `WalletSettingsNotFound` |
| `IGetContractBalanceSummariesHandler` | `AccountId` exists | `WalletNotFound` |
| `IDirectDebitHandler` | Amount > 0, currency matches account, account has wallet, balance ≥ amount | `InvalidAmount`, `WalletNotFound`, `WalletSettingsNotFound`, `InsufficientBalance` |
| `IReserveWalletChargeHandler` | Charge request shape, idempotency, rate applicability, balance check, TTL bounds | `InvalidChargeRequest`, `InvalidIdempotencyKey`, `NoApplicableRate`, `InsufficientBalance`, `CommChannelSubWalletNotFound`, `WalletVersionConflict` (after retry exhaustion) |
| `ICommitWalletReservationHandler` | Reservation exists, status is Active (not expired/committed/released), final delivery context valid | `ReservationNotFound`, `WalletVersionConflict` |
| `IReleaseWalletReservationHandler` | Same as commit | `ReservationNotFound`, `WalletVersionConflict` |
| `ITransferBalanceHandler` | Source ≠ destination, currency match, balance ≥ amount, both wallets exist | `InvalidTransferWallets`, `InvalidWalletIdentity`, `WalletNotFound`, `InsufficientBalance`, `InvalidAmount` |

## Idempotency Check

For mutating endpoints (`DirectDebit`, `Authorize/Reserve`, `Transfer`):

1. Handler reads `ReferenceType + ReferenceId` from the request.
2. Looks up Redis idempotency cache (TTL: `RealTimeCharging:IdempotencyTtlSeconds` = 86400s = 24h).
3. If found: returns the cached response with `AlreadyApplied = true`.
4. If not found: executes the operation, persists the response in cache, returns with `AlreadyApplied = false`.

`Commit` and `Release` are idempotent on the reservation id (the reservation document itself tracks its status — calling commit on an already-committed reservation returns the existing committed response).

## Optimistic Concurrency

OCS wallet documents have a `Version` field. Concurrent mutations against the same wallet detect a version mismatch on save. The handler retries automatically:

- `OcsResilience:MaxOptimisticRetries: 3`
- `OcsResilience:BaseRetryDelayMs: 25`
- `OcsResilience:MaxRetryDelayMs: 250`
- `OcsResilience:RetryJitterRatio: 0.2`

After exhausting retries, `WalletVersionConflict` is thrown — surfaced to the frontend with an HTTP status (likely 409 Conflict).

## Reservation TTL

`reservationTtlSeconds` in the request defaults to 300 (5 minutes). Hard upper bound is configurable (`RealTimeCharging:ReservationTtlSeconds = 300` at config level). Handler may clamp the request value — verify.

## Real-Time Hot Channels

Channels in `RealTimeCharging:HotChannels = ["WHATSAPP", "SMS", "VOICE"]` go through the Redis stream pipeline. Other channels use the slower Mongo-only path. Same validation rules apply on both paths.

## UnitOfWork Wrap

`UnitOfWorkFilter` (global on `AddControllers`) wraps every action in a Mongo session + Kafka outbox flush. The filter likely checks for `IUnitOfWorkTrigger` interface on DTOs to decide whether to commit (mutators) or skip (reads).

## No Authorization Beyond Class-Level `[Authorize]`

Wallet actions trust the caller's identity — no per-action `Policy` check. Tenant/owner ownership validation is done inside handlers via `IAccessCurrentUser` (verify); a Falcon admin can call `TransferBalance` between any two wallets but a client user is limited to wallets in their tenant.

## Multi-Language

No multi-language fields on any WalletController DTO.

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` fails service startup if any error code in `FalconKeys.Error` lacks an English or Arabic translation.
