# Charging Service — Validations

## DTO-Level Validation

The Charging DTOs (`Falcon.Charging.Contracts/Models/RequestsDtos/`) **do not** use FluentValidation or DataAnnotations. Most fields are bare `string` / `decimal` / enum properties — validation happens **entirely at handler level**.

Notable exceptions:
- `ReserveWalletChargeRequest` ships with hard-coded defaults (`Priority="NONE"`, `Destination="ANY"`, `ChargeKind=OcsChargeKinds.Usage`, `ReservationTtlSeconds=300`) — these act as soft validation defaults rather than rules.
- Currency is bound as enum but no `[EnumDataType]` is applied — a malformed value yields a 400 from the framework binder if it can't parse, or silently 0 otherwise (verify by sending `currency="foo"`).

## Handler-Level Validation

Each handler (`IGetAccountWalletsHandler`, `IDirectDebitHandler`, `IReserveWalletChargeHandler`, `ICommitWalletReservationHandler`, `IReleaseWalletReservationHandler`, `ITransferBalanceHandler`, `IGetContractBalanceSummariesHandler`) is responsible for:

1. **Idempotency** — `ReferenceType + ReferenceId` (or a separate idempotency key) is checked against `IdempotencyTtlSeconds` Redis cache. Repeat calls return `AlreadyApplied = true` and the original transaction id.
2. **Account / wallet existence** — `WalletNotFound`, `NoAnyCommChannelWalletWasFound`, `CommChannelSubWalletNotFound`
3. **Balance availability** — `InsufficientBalance`
4. **Transfer wallet identity** — `InvalidTransferWallets`, `InvalidWalletIdentity` (source ≠ destination, currency match, …)
5. **Rate evaluation** — `NoApplicableRate` when the requested `ApplicationId/ChannelId/Priority/Destination` combo doesn't match any contract rate
6. **Optimistic concurrency** — `WalletVersionConflict` after exhausting `OcsResilience:MaxOptimisticRetries` (default 3); the handler retries internally with exponential backoff (`BaseRetryDelayMs=25`, `MaxRetryDelayMs=250`, jitter 0.2)
7. **Charge request shape** — `InvalidChargeRequest`, `InvalidAmount`, `InvalidIdempotencyKey`

## UnitOfWork Filter

`UnitOfWorkFilter` (registered globally on `AddControllers`):
1. Before action — opens a Mongo session / transaction
2. After action successful — commits Mongo + flushes Kafka outbox
3. On exception — aborts Mongo session

DTOs implementing `IUnitOfWorkTrigger` (marker interface in `Falcon.Charging.Contracts`) are eligible for this wrap. **Verify** which actions opt-in; `WalletController` actions likely all do (mutating endpoints).

## Reservation TTL & Expiry

- `ReservationTtlSeconds` (request-time, default 300s)
- Background sweeper (`OcsReservationExpiry`) — every 5s, batch size 50, marks expired reservations and releases held quotas

A reservation that times out **before** `Commit` or `Release` is auto-released — the frontend should be prepared for `ReservationNotFound` if it calls `Commit` after the TTL.

## Real-Time Charging Core

- `RealTimeCharging:Enabled` toggles the Redis-stream-based hot-channel pipeline
- Hot channels: `["WHATSAPP", "SMS", "VOICE"]` — these go through `ocs:realtime-events` stream with a different (faster) path
- Other channels use the standard Mongo-only path

## Multi-Language Compliance

No user-facing multi-language fields on the request side. `LookupValueResponse.Name` may use `MultiLanguage`.

## ServiceOperationResult Conformance

All endpoints return `ServiceOperationResult<T>` — conformant.

## Test Endpoints

`TestKafkaController.PublishTestEvent` returns a raw anonymous object `{ eventId, referenceId }` **not wrapped** in `ServiceOperationResult<T>`. Deviation; acceptable for a dev-only endpoint, but if exposed in production it's a contract leak.

## Testing Charging Controller

`TestingChargingController` honors a global enabled flag (`Settings:TestingCharging:Enabled`). When disabled, every endpoint returns HTTP 404 with no body — silent gate (no `ServiceOperationResult<T>` envelope on the 404). Verify whether the gateway's downstream-aware response wrapping converts this.
