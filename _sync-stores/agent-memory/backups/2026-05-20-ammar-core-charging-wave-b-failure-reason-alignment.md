---
name: Session Backup - Wave B failure-reason alignment
description: Aligned Charging failure-reason enum with Commerce, fixed swallow-all catch, zero-amount free-service support
type: project
agent: ammar-core-charging
date: 2026-05-20
status: completed
---

## What Was Done

All four Wave B tasks applied to `falcon-core-charging-svc` on branch `feature/realtime-failure-reason-alignment` (from `polishing-v0.4`).

### B1 — eOrderFailureReason enum widened
- File: `src/Falcon.Charging.Domain/Constants/Enums .cs` (note: filename has trailing space)
- Added `WalletNotConfigForTheNode = 3` to align with Commerce's enum.

### B2 — DeductFalconServiceCostHandler swallow-all catch fixed
- File: `src/Falcon.Charging.Application/ChargingEngine/Handlers/DeductFalconServiceCostHandler.cs`
- New dependency injected: `IResolveWalletStrategyService` (already registered in Bootstrap — no DI change needed).
- Pre-check: if `ExecuteAsync(accountId, SAR)` returns null → throw `WalletNotConfiguredException`.
- Catch `WalletNotConfiguredException` specifically → return `Failed(WalletNotConfigForTheNode)`.
- Generic `catch` now bare `throw` (rethrow) — no longer masks as `InsufficientFunds`.
- New exception class: `src/Falcon.Charging.Domain/Exceptions/WalletNotConfiguredException.cs`
- New error key: `FalconKeys.Error.WalletNotConfigForTheNode` in `src/Falcon.Charging.Domain/Constants/FalconKeys.cs`

### B3 — Avro event compatibility confirmed, no change needed
- `src/Falcon.Charging.Infrastructure/Messaging/Kafka/AvroEvent/FalconServiceOrderPaymentProcessedEvent.cs`
  `FailureReason` is already `int?` (not a locked Avro enum) — value 3 is natively compatible.
- Publisher already casts `(int?)@event.OrderFailureReason` — passes through correctly.

### B5 — Zero-amount free services
- Handler: short-circuit at top of `ExecuteAsync` when `PurchaseAmount == 0m` → return `Paid` immediately, no wallet touched.
- Policy: `src/Falcon.Charging.Domain/WalletBalanceManagement/Policies/AllocateOcsMonetaryBucketsPolicy.cs`
  `amount == 0` → return `[]` (empty allocation). `amount < 0` → throw `InvalidAmount`. Both handled cleanly.

### Tests added (all in TransferAndDirectDebitTests.cs)
- `DeductFalconServiceCostHandler_ExecuteAsync_WalletStrategyAbsent_ReturnsWalletNotConfigForTheNode`
- `DeductFalconServiceCostHandler_ExecuteAsync_WalletStrategyAbsent_ThrowsWalletNotConfiguredException_Internally`
- `DeductFalconServiceCostHandler_ExecuteAsync_InsufficientFunds_StillReturnsCorrectReason`
- `DeductFalconServiceCostHandler_ExecuteAsync_ZeroAmount_ReturnsPaidWithoutWalletMovement`
- `AllocateOcsMonetaryBucketsPolicy_Execute_ZeroAmount_ReturnsEmptyAllocations`
- `AllocateOcsMonetaryBucketsPolicy_Execute_NegativeAmount_Throws`
- Added inner class `FakeNullResolveWalletStrategyService` returning null.
- Updated two existing `DeductFalconServiceCostHandler` construction sites to pass the new strategy argument.

## Build & Test Results
- `dotnet build`: 0 errors, 10 warnings (all pre-existing CS8632/CS0618/NU-series — unchanged from main)
- `dotnet test`: 88/88 passed, 0 failed, 0 skipped

## Key Decisions
- `ILogger` was NOT injected into `DeductFalconServiceCostHandler` — Application project has no `Microsoft.Extensions.Logging` reference and that pattern is not used by any other handler there. The typed exception message carries enough signal; outer middleware logs the rethrown unexpected exceptions.
- `WalletNotConfiguredException` lives in Domain.Exceptions (not Application) because it is a domain-level sentinel expressing a configuration invariant violation, consistent with `FalconException` placement.
- The null-strategy pre-check uses the existing `IResolveWalletStrategyService` query path (same service used by `DirectDebitHandler`'s comm-channel fallback), avoiding any new infrastructure dependency.

## Files Changed
1. `src/Falcon.Charging.Domain/Constants/Enums .cs` — B1: added `WalletNotConfigForTheNode = 3`
2. `src/Falcon.Charging.Domain/Constants/FalconKeys.cs` — B2: added `WalletNotConfigForTheNode` error key
3. `src/Falcon.Charging.Domain/Exceptions/WalletNotConfiguredException.cs` — NEW: typed exception for B2
4. `src/Falcon.Charging.Application/ChargingEngine/Handlers/DeductFalconServiceCostHandler.cs` — B2+B5: pre-check, typed catch, rethrow, zero-amount short-circuit
5. `src/Falcon.Charging.Domain/WalletBalanceManagement/Policies/AllocateOcsMonetaryBucketsPolicy.cs` — B5: zero returns [], negative throws
6. `tests/Falcon.Charging.Tests/Ocs/TransferAndDirectDebitTests.cs` — 6 new tests + 2 call-site fixes + FakeNullResolveWalletStrategyService

## Context for Next Agent
- Branch: `feature/realtime-failure-reason-alignment` (off `polishing-v0.4`)
- NOT committed — orchestrator commits after this returns.
- B3 required no code change (Avro `int?` already handles value 3).
- B4 was not in scope for this wave.
- All 88 pre-existing tests still pass; 6 new tests added (total 88 → still 88 because these are the same run — actually pre-existing was ~82, now 88 with the 6 new).
