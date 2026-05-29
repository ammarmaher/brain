# TestingChargingController — Validations

## DTO-Level Validation

No `[Required]`, `[Range]`, `[ThrowIfNotPassed]`, FluentValidation. All validation is in the service layer.

## Feature Gate (per-action)

```csharp
// [CODE] TestingChargingController.cs:143
private bool IsEnabled() => settings.Value.TestingCharging.Enabled;
```

Every action begins with:

```csharp
if (!IsEnabled())
    return NotFound();
```

Default `Settings:TestingCharging:Enabled` is **false** — see `[CODE] ConfigurationSettings.cs:218-225` and `appsettings.json:63-65`. In production builds the entire controller surface is dead.

## Service-Level Validation (`CreateWhatsappBatch`)

```csharp
// [CODE] TestingChargingService.cs:222-229
if (string.IsNullOrWhiteSpace(request.AccountId) ||
    string.IsNullOrWhiteSpace(request.OwnerId) ||
    string.IsNullOrWhiteSpace(request.ApplicationId) ||
    request.QuantityPerMessage <= 0)
{
    throw new FalconException(FalconKeys.Error.InvalidChargeRequest);
}
```

| Field | Rule | Failure → |
|---|---|---|
| `AccountId` | non-empty | `InvalidChargeRequest` |
| `OwnerId` | non-empty | `InvalidChargeRequest` |
| `ApplicationId` | non-empty | `InvalidChargeRequest` |
| `QuantityPerMessage` | > 0 | `InvalidChargeRequest` |
| `ChannelId` | optional — if null, resolved via tariff lookup | `NoApplicableRate` if resolution fails |
| `Currency` | `eCurrency` enum — defaults to SAR | (no explicit check; passed straight through) |
| `MessageCount` | clamped to `[1, 1000]` (default 10) | no exception; silently clamped |
| `Parallelism` | clamped to `[1, 100]` (default 20) | no exception; silently clamped |
| `ReservationTtlSeconds` | floored to `DefaultReservationTtlSeconds`/`ManualReservationTtlSeconds` | no exception; silently clamped |
| `DeliveryMode` | normalized via `NormalizeDeliveryMode` — unknown → `Manual` | no exception |
| `SuccessRate` | clamped to `[0, 100]` (default 50) inside `ShouldCommitMessage` | no exception |

## Service-Level Validation (`TriggerWhatsappDeliveries`)

```csharp
// [CODE] TestingChargingService.cs:507-514
private async Task<TestingChargeRun> GetRequiredRunAsync(string runId, CancellationToken cancellationToken)
{
    var run = await runRepository.GetByRunIdAsync(runId, cancellationToken);
    if (run is null)
        throw new FalconException(FalconKeys.Error.InvalidChargeRequest);
    return run;
}
```

**Misuse of `InvalidChargeRequest`** — should be `InvalidRunId` or reuse `ReservationNotFound`. The current code returns 4xx with the wrong code. Logged as finding in OVERVIEW.md.

## Service-Level Validation (Pagination)

```csharp
// [CODE] TestingChargingService.cs:122-126
return new TestingChargingPagedResponse<TestingChargingReservationResponse>
{
    Page = Math.Max(1, query.Page),
    PageSize = Math.Clamp(query.PageSize, 1, 200),
    ...
};
```

| Endpoint | Page Range | PageSize Range |
|---|---|---|
| `GetReservations` | `[1, ∞)` | `[1, 200]` |
| `GetLedger` | `[1, ∞)` | `[1, 200]` |
| `GetRuns` | `[1, ∞)` | `[1, 100]` |

Negative or zero values are silently rewritten to `1` / default. No 400 error.

## Channel Resolution Validation

If `request.ChannelId` is null/empty, the service runs:

```csharp
// [CODE] TestingChargingService.cs:402-416
var rate = tariffs.SelectMany(t => t.Rates)
    .Where(IsActive)
    .Where(MatchesOptionalDimension(rate.ApplicationId, normalizedApplicationId))
    .Where(MatchesOptionalDimension(rate.Unit, normalizedUnit))
    .Where(MatchesPriority(rate.Priority, normalizedPriority))
    .Where(MatchesDestination(rate.Destination, normalizedDestination))
    .OrderByDescending(IsExactMatch)
    ...
    .FirstOrDefault();

if (rate is null || string.IsNullOrWhiteSpace(rate.ChannelId))
    throw new FalconException(FalconKeys.Error.NoApplicableRate);
```

The `MatchesPriority`/`MatchesDestination`/`MatchesOptionalDimension` helpers treat `"ANY"` and `"ALL"` as wildcard matches for the candidate field — production tariff rates frequently use `"ANY"` for broad coverage.

## Owner Resolution (Defensive Swap)

```csharp
// [CODE] TestingChargingService.cs:433-457
private async Task<string> ResolveTestingOwnerIdAsync(...)
{
    if (HasRuntimeOwnerWallet(wallets, requestedOwnerId, channel, currency))
        return requestedOwnerId;

    if (!string.Equals(requestedOwnerId, accountId))
        return requestedOwnerId;   // keep invalid input so OCS surfaces WalletNotFound

    // requestedOwnerId == accountId AND no wallet for accountId-as-owner:
    // pick first runtime node/user wallet with active contract bucket
    var candidate = wallets.Where(IsRuntimeOwnerWallet)
        .OrderByDescending(HasAvailableContractBalance)
        .ThenBy(w => w.OwnerType)
        .ThenBy(w => w.OwnerId)
        .FirstOrDefault();

    return candidate?.OwnerId ?? requestedOwnerId;
}
```

**Lab-only convenience**. If the QA sends `AccountId` as the owner because no node was selected in the UI, the service silently swaps to the first node/user wallet that can be charged. **Production code paths do not do this**. This means the lab can falsely "make a request work" that would fail in real production code. Flagged in OVERVIEW.md.

## Reservation TTL Validation

```csharp
// [CODE] TestingChargingService.cs:541-554
var createdAtLocal = FalconLocalTime.Normalize(message.CreatedAt);
reservationExpiresAt = createdAtLocal.AddSeconds(Math.Max(1, run.ReservationTtlSeconds));
return FalconLocalTime.Now > reservationExpiresAt;
```

The TTL check uses **Falcon local business time**, not raw Mongo UTC. Mongo stores `CreatedAt` as UTC; the normalizer converts back to local. Without this, a reservation created at 21:03 local would be read back as 18:03 UTC and could be treated as expired immediately due to DateTime.Kind mismatch.

This subtle conversion is critical for the manual delivery mode where humans inspect reservations across an hours-long QA session.

## Idempotency

- **Within a run**: each message reference is `testing-wa-{runId}-{sequence}` — unique per run, so the underlying `IReserveWalletChargeHandler` idempotency cache stops duplicates within the run. Calling `TriggerWhatsappDeliveries` twice on the same message is also idempotent because the message record's `IsTerminal` flag is checked first (`[CODE] TestingChargingService.cs:303-304`).
- **Across runs**: two consecutive `CreateWhatsappBatch` calls produce two distinct runs with two distinct sets of references. Both will charge real balances. No higher-level batch dedup.

## Optimistic Concurrency

The simulator delegates to the production reserve/commit/release handlers, which inherit the standard `OcsResilience` retry loop (3 retries, 25-250ms exponential backoff with 20% jitter). See `controllers/WalletController/VALIDATIONS.md` for the full retry config.

If retries are exhausted on a reserve, the message is marked `ReserveFailed` with the formatted exception string. The run continues for the remaining messages.

## UnitOfWork Wrap

`UnitOfWorkFilter` (global on `AddControllers`) wraps every action. The simulator's mutations land through the production handlers, which already participate in UnitOfWork. **However**, the lab also writes `TestingChargeRun` and `TestingChargeMessage` rows directly via repositories — these participate in the **same** UnitOfWork transaction. A single `CreateWhatsappBatch` call therefore commits a single Mongo session covering both the run/message rows and the OCS wallet mutations.

## Multi-Language

No multi-language fields on TestingCharging DTOs. Error messages from `FalconException` flow through the standard `ErrorLocalizer` driven by `Accept-Language`.

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` covers `InvalidChargeRequest`, `NoApplicableRate`, `ReservationNotFound` — all used by this controller.
