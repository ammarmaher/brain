# TestingChargingController — Drill-down

> File: `falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/Testing/TestingChargingController.cs` (~144 lines)
> The Charging Lab — a QA/developer surface that exposes read views over OCS state and drives a WhatsApp-traffic simulator through the **real** reserve/commit/release handlers.

## Purpose

Provides **9 entry points** grouped into three families:

### Read views (5 endpoints)
1. `GetOverview` — account-level KPIs (totals, wallet count, bucket count, reservation counts, last ledger timestamp, latest run summary).
2. `GetWallets` — per-wallet snapshots with embedded bucket breakdown.
3. `GetReservations` — paged reservation list per account, with rated/quota/billed unit detail.
4. `GetLedger` — paged ledger entries with rich filter set (`walletId`, `contractId`, `refType`, `refId`, `ledgerType`, `from`, `to`).
5. `GetBalances` — projections (wallet snapshots + contract summaries) — the read-model view, may lag Redis real-time state.

### Run management (2 endpoints)
6. `GetRuns` — paged list of testing-traffic runs across accounts.
7. `GetRun` — single run with full message-level detail.

### Simulator (2 endpoints)
8. `CreateWhatsappBatch` — creates a `TestingChargeRun` and reserves N messages through `IReserveWalletChargeHandler`. If `DeliveryMode != Manual`, immediately triggers deliveries.
9. `TriggerWhatsappDeliveries` — applies mock delivery outcomes (delivered → real `commit`; failed → real `release`).

## Critical Property: Real OCS Mutation

The simulator **does not bypass** any production rule. The class-level XML comment is explicit:

> The simulator delegates to the existing reserve/commit/release handlers; it does not bypass rating, quota, wallet mutation, idempotency, ledger, or outbox rules.

A QA WhatsApp batch creates real reservations, real ledger entries, and real outbox messages. **Calling this controller on a production database mutates production balances.** The `Settings:TestingCharging:Enabled` gate is the only safeguard.

## Architecture

Constructor (primary syntax) injects:
- `ITestingChargingService testingChargingService` — application service that owns all 9 operations
- `IOptions<ConfigurationSettings> settings` — to read the `TestingCharging.Enabled` gate

Every action begins with:

```csharp
if (!IsEnabled())
    return NotFound();
// [CODE] TestingChargingController.cs:143
private bool IsEnabled() => settings.Value.TestingCharging.Enabled;
```

When `TestingCharging.Enabled` is `false` (the production default), every endpoint returns `404 Not Found` — not `403 Forbidden`. This is **intentional camouflage**: an attacker probing the API cannot distinguish "endpoint exists but disabled" from "endpoint does not exist". They learn nothing about Charging Lab being present.

## Authorization

Class level: `[Authorize]`. JWT required. No per-action policy override. Any authenticated user (client or Falcon) can call the simulator **if the gate is on**.

The XML doc comment recommends keeping the gate off outside local/QA (`[CODE] ConfigurationSettings.cs:221-224`), but does **not** enforce Falcon-admin-only access. If the gate is enabled in production by mistake, any authenticated user could fire the simulator. Recommend adding a Falcon-admin policy check as defense in depth.

## Service Dependencies

`TestingChargingService` (in `Falcon.Charging.Application.TestingCharging.Services`) injects:

- `IOcsWalletRepository` — read OCS wallets by account or reservation id
- `IWalletLedgerRepository` — read ledger rows with the paged query model
- `IWalletBalanceSnapshotRepository` — read the projected wallet snapshots
- `IReservationLookupRepository` — read paged reservation list
- `IContractBalanceSummaryRepository` — read per-contract summaries
- `IContractTariffCacheRepository` — read active tariffs (for channel id resolution)
- `ITestingChargeRunRepository` — write/read `TestingChargeRun` aggregates
- `ITestingChargeMessageRepository` — write/read per-message records
- `IReserveWalletChargeHandler` — production reserve handler
- `ICommitWalletReservationHandler` — production commit handler
- `IReleaseWalletReservationHandler` — production release handler

The simulator **never** calls the data-store directly for mutations — it only routes through the production handlers, ensuring it cannot drift from real-world rating/quota/idempotency logic.

## Simulator Flow — `CreateWhatsappBatch`

1. Clamp `MessageCount` to `[1, 1000]`, `Parallelism` to `[1, 100]`, default `DeliveryMode` to `Manual`.
2. Validate `AccountId`, `OwnerId`, `ApplicationId`, `QuantityPerMessage > 0` else throw `InvalidChargeRequest`.
3. Resolve the **concrete activated channel id** — if `ChannelId` is null/empty, find the active tariff row matching `applicationId`/`priority`/`destination`/`unit` and use its `ChannelId`. Else `NoApplicableRate`. See `[CODE] TestingChargingService.cs:389-419`.
4. Resolve the **owner id that can actually be charged** — if the caller sent `AccountId` as the owner but the strategy is NODE/USER, find the first runtime owner wallet with an active contract bucket on the channel. See `[CODE] TestingChargingService.cs:433-457`.
5. Create `TestingChargeRun` and N `TestingChargeMessage` rows (one per message). Each message ref is `testing-wa-{runId}-{sequence}` for safe retries.
6. For each message: call `IReserveWalletChargeHandler.ExecuteAsync(...)`. On success → `MarkReserved(...)`. On exception → `MarkReserveFailed(formatted)`.
7. Refresh counters on the run, persist.
8. If `DeliveryMode != Manual`, immediately call `TriggerWhatsappDeliveriesAsync(...)` with the same request.

## Simulator Flow — `TriggerWhatsappDeliveries`

1. Load run and messages by `runId`. Optionally filter to specific `Sequences`.
2. For each non-terminal reserved message:
   - If `IsReservationPastTestingTtl` → `MarkDeliveryFailed("ReservationExpired: ...")`. Reservation TTL is computed against Falcon local time, not raw Mongo UTC — see `[CODE] TestingChargingService.cs:541-554`.
   - Else compute `ShouldCommitMessage(sequence, deliveryMode, successRate)`:
     - `AutoDelivered` → true (commit)
     - `AutoFailed` → false (release)
     - `MixedBySuccessRate` → `((sequence - 1) % 100) < successRate` deterministic
     - default → true
   - If commit → `ICommitWalletReservationHandler.ExecuteAsync({ ReservationId })` then `MarkCommitted()`
   - Else → `IReleaseWalletReservationHandler.ExecuteAsync({ ReservationId })` then `MarkReleased()`
   - On exception → `MarkDeliveryFailed(formatted)` — formatting prepends TTL diagnostic if `ReservationNotFound` came from late delivery on an expired reservation.
3. Refresh counters, persist.

## Channel Resolution Quirk

Even though the lab is WhatsApp-specific, OCS wallets store **the activated communication-channel id** (e.g. `"695A...D0E2"`), not the logical label `"WHATSAPP"`. The simulator resolves the real channel from the active tariff row so wallet selection works correctly. The class-level XML comment on `ResolveTestingWhatsappChannelAsync` calls this out — `[CODE] TestingChargingService.cs:382-388`.

This means **a stale tariff cache will cause the simulator to fail with `NoApplicableRate`** even though a wallet exists. Cache refresh is implicit; verify the projection lag against `ContractTariffCacheProjector` consumer.

## Special TTL Rule — Manual Mode

```csharp
// [CODE] TestingChargingService.cs:532-539
return deliveryMode == TestingChargingDeliveryModes.Manual
    ? Math.Max(normalizedTtl, ManualReservationTtlSeconds)   // ≥ 3600s
    : normalizedTtl;
```

Manual batches force TTL to at least 3600 seconds (1 hour) regardless of what the request asked for. The XML doc explains: a human needs time to inspect reserve results before clicking "Trigger Delivered". Without this clamp, manual batches would expire while the QA looks at them.

## Code Smells / Findings

1. **404 on disabled** is good security hygiene but **inconsistent with the rest of the platform** — Falcon usually returns `403 Forbidden` for policy-denied actions. Make sure FE error handling treats 404 here as "feature off", not "endpoint missing".
2. **No `Settings:TestingCharging:Enabled` flip per environment** — single boolean. Cannot enable just for one tenant or one user. Acceptable for a dev tool.
3. **Owner resolution is QA-only** — if the lab can silently swap `OwnerId` for a node/user when the caller sends an account id, real production code paths cannot. This is intentional convenience for QA but makes the simulator's behavior **diverge slightly** from production code. The XML comment at `[CODE] TestingChargingService.cs:422-432` notes this is intentional.
4. **No simulator idempotency at the run level** — calling `CreateWhatsappBatch` twice creates two distinct runs. The per-message reference id (`testing-wa-{runId}-{sequence}`) is unique per run, so individual reserve calls are idempotent within a run, but two runs against the same account/owner will produce two sets of charges.
5. **`Falcon Lab` route uses sub-folder routing** — `[Route("api/testing/charging")]` with no `[controller]` token. Distinct from the `[Route("api/[controller]")]` convention used by Wallet and Lookup.
6. **Returns `404` from `GetRequiredRunAsync` when `runId` is invalid** — but the inner code throws `FalconException(FalconKeys.Error.InvalidChargeRequest)`. The error code is wrong: it should be a "not found" code (`InvalidRunId` or reusing `ReservationNotFound`). See `[CODE] TestingChargingService.cs:507-514`.
7. **Mixed channel-id normalization** — `NormalizeRequired` uppercases the channel id; if the activated channel id in MongoDB stores mixed case, the comparison against tariff rates uses case-insensitive lookup. Acceptable but adds a small risk of mismatch with non-normalized data.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
