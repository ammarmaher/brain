---
name: project-charging-zero-amount-free-service-fix-2026-05-20
description: "GAP-CHARGE-01 closed — DirectDebitHandler short-circuits Amount=0 to a trivial result; Validate permits zero; AllocateOcsMonetaryBucketsPolicy already returned empty list on zero. 5 B5 tests pass, 90/90 charging tests green on .NET 10."
metadata: 
  node_type: memory
  type: project
  originSessionId: d910bef2-cb7b-42b2-abff-1561ebfd03cb
---

🟢 RUNTIME-VERIFIED 2026-05-20. GAP-CHARGE-01 (W9 Phase A) closed in `falcon-core-charging-svc`.

**Root cause:** `DirectDebitHandler.Validate` threw `InvalidAmount` on `Amount <= 0`, which `DeductFalconServiceCostHandler` catch-all (pre-fix) mapped to `InsufficientFunds` — wrong reason for zero-priced free services.

**Fix (charging service only — no Commerce/Identity/realtime changes):**

1. `src/Falcon.Charging.Application/ChargingEngine/Handlers/DirectDebitHandler.cs`
   - `Validate`: changed `Amount <= 0` to `Amount < 0` (zero is valid; negatives still throw `InvalidAmount`).
   - `ExecuteAsync`: added B5 / GAP-CHARGE-01 short-circuit right after `Validate(command)` — for `Amount == 0m` returns a trivial `DirectDebitResult { TransactionId=new ObjectId, DebitedAmount=0m, RemainingBalance=0m, AlreadyApplied=false }` without resolving wallet, computing idempotency key, loading buckets, or invoking `AllocateOcsMonetaryBucketsPolicy`.

2. `src/Falcon.Charging.Domain/WalletBalanceManagement/Policies/AllocateOcsMonetaryBucketsPolicy.cs` — **already fixed pre-session**: lines 28-33 short-circuit `amount == 0m` to empty allocation list; throws `InvalidAmount` only for `amount < 0`.

3. `tests/Falcon.Charging.Tests/Ocs/TransferAndDirectDebitTests.cs` — added 2 tests pinning the new guard:
   - `DirectDebitHandler_ExecuteAsync_ZeroAmount_ReturnsTrivialResultWithoutWalletMovement` — asserts wallet balance unchanged, ledger empty, outbox empty, DebitedAmount=0, AlreadyApplied=false, non-empty TransactionId.
   - `DirectDebitHandler_ExecuteAsync_NegativeAmount_ThrowsInvalidAmount` — locks in the contract that negatives still fail.

**Verification:** `dotnet build` GREEN (0 warnings / 0 errors). `dotnet test` 90/90 PASS in 87 ms. Filtered ZeroAmount/NegativeAmount run: 5/5 PASS.

**Untouched (per user constraint):**
- Commerce (`falcon-core-commerce-svc`) — no changes
- Identity (`falcon-core-identity-svc`) — no changes
- Realtime service — no changes
- `DeductFalconServiceCostHandler` — already had its own zero short-circuit at line 45 (preserved).
- `TransferBalanceHandler.cs:361-362` — still rejects `<= 0`; out of scope for free-service path (transfer is wallet-to-wallet, not service charge).

**Follow-up (not done — user said separately):**
- `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-scenarios.js` — Mitsubishi `APP_IDS[2]` currently seeded as 10 SAR substitute (InActive, OneTimePayment, 10 SAR). Now safe to flip to `priceValue: 0, pricingType: 0` for true SC-05 free-service path.

Related: [[project-apps-services-tabs-mutation-payment-2026-05-18]] (3-reason payment failure popups consume this fix), [[project-edit-price-wallet-signalr-dossier-2026-05-19]] (full edit-price/wallet/SignalR dossier).
