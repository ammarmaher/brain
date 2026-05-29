# WAVE-11 Code Mining — Wallet, Balance, Multi-Contract Deduction, Addons

**Source service:** `Falcon\falcon-core-charging-svc` (.NET 10, MongoDB, Kafka, Redis hot-state)
**Phase 1 OCS aggregate model** has supplanted the legacy per-channel Charging Wallet documents. All facts cited are `[CODE]` from the live source tree.

---

## §1 Wallet entity model

**The legacy `WalletRecord` per-contract entity does NOT exist as a top-level Mongo document.** Phase 1 stores everything in a single OCS aggregate root: `OcsWallet`, with embedded `Buckets[]`. Each contract becomes a `OcsWalletBucket` of type `ContractFunded`.

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\WalletBalanceManagement\Entities\OcsWallet.cs:19-56`: aggregate root with `WalletId`, `AccountId`, `OwnerType` (Account|User|Node), `OwnerId`, `Channel`, `Currency`, `Version` (optimistic concurrency), `Buckets[]`, `Reservations[]`, `CreatedAt`, `UpdatedAt`.

[CODE] `OcsWallet.cs:147-157`: deterministic id format — `{OwnerType}:{OwnerId}:{Channel}:{Currency}` (e.g. `ACCOUNT:ACC-1:ALL:SAR`, `ACCOUNT:ACC-1:WHATSAPP:SAR`).

[CODE] `OcsWallet.cs:746-812`: `OcsWalletBucket` (embedded) — `BucketId`, `ContractId`, `TariffSnapshotRef`, `BucketType` (ContractFunded|Quota), `ServiceScope`, `QuotaCode`, `QuotaCategory`, `SubService`, `Unit`, **`TotalAmount` / `AvailableAmount` / `ReservedAmount` / `ConsumedAmount`**, `TotalUnits` / `RemainingUnits` (sub-service), `EffectiveFrom`, `ExpiresAt`, `Status` (Active|Inactive|Expired).

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\Persistence\Ocs\OcsCollectionNames.cs:7-19`: MongoDB collection names — `wallets`, `wallet_ledger`, `wallet_balance_snapshots`, `reservation_lookup`, `wallet_strategy_read_model`, `contract_tariff_cache`, `consumed_event_receipts`, `wallet_outbox`, `contract_balance_summary`, `wallet_mutation_receipts`.

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\Constants\Enums .cs:42-48`: legacy `eWalletType { MasterWallet=1, NodeWallet=2, UserWallet=3, CommChannelWallet=4 }` is still defined but **not used as a top-level Mongo doc in phase 1**. The OCS model uses `eOcsWalletOwnerType { Account, User, Node }` (`Enums .cs:113-118`) and channel is a string field (`"ALL"` for single-wallet/master, otherwise the channel code).

[CODE] `Enums .cs:120-131`: `eOcsBucketType { ContractFunded, Quota }`, `eOcsBucketStatus { Active, Inactive, Expired }`.

[CODE] `Enums .cs:56-66`: `eWalletBalanceType { NodeBased=1, UserBased=2 }`, `eWalletBaseType { SingleWallet=1, MultipleWallets=2 }` — the immutable wallet strategy.

> CONFIRMS W-TT-01 (wallets are not direct Mongo docs per contract — each contract is a bucket inside an OCS aggregate). Phase-1 funding goes only to `ACCOUNT:{accountId}:ALL` (the master wallet).

---

## §2 Action implementations

### 2.1 Charge (T2 adds balance from contract activation)
- **Command:** `ProjectContractActivatedCommand` consumed from Kafka `contract.lifecycle` topic.
- **Consumer:** [CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\ContractLifecycleProjection\Messaging\Kafka\Consumers\ContractLifecycleEventConsumer.cs:43-117` (LifecycleType="ACTIVATED").
- **Process:** [CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Application\ContractLifecycleProjection\Processes\ProjectContractLifecycleProcess.cs:53-128` `ExecuteActivationAsync`.
- **Domain method:** [CODE] `OcsWallet.cs:99-145` `ApplyContractFunding(contractId, committedValue, effectiveFrom, expiresAt, tariffSnapshotRef)` — creates one `ContractFunded` bucket with `TotalAmount = AvailableAmount = committedValue`, `ReservedAmount = ConsumedAmount = 0`, `Status = Active`. Replay-safe: a duplicate activation reconciles metadata but never re-credits money (line 137 comment).

### 2.2 Transfer (T2 / AO moves balance between wallets)
- **Command:** `TransferBalanceCommand` [CODE] `Commands\TransferCommand.cs:5-18`.
- **Handler:** [CODE] `Falcon.Charging.Application\WalletBalanceManagement\Handlers\TransferBalanceHandler.cs:84-200` — loads source + destination wallets, runs `_resolveOcsTransferWalletsPolicy.Execute(...)` for path validation, calls `_allocateOcsMonetaryBucketsPolicy.Execute(source, amount, now)` for per-contract slicing, then `sourceWallet.ApplyTransferOut(allocations)` + `destinationWallet.ApplyTransferIn(allocations)` inside one Mongo transaction.
- **Domain methods:** [CODE] `OcsWallet.cs:376-391` `ApplyTransferOut` (decreases `TotalAmount` AND `AvailableAmount` on source), `OcsWallet.cs:401-421` `ApplyTransferIn` (creates/increments dest bucket per source contract).
- **Path validation:** [CODE] `Domain\WalletBalanceManagement\Policies\ResolveOcsTransferWalletsPolicy.cs:21-90`. Falcon-only:`ACCOUNT:ALL ↔ ACCOUNT:CHANNEL`. Channel ↔ channel requires matching channel string. Single-wallet allows `ACCOUNT ↔ USER/NODE` directly.

### 2.3 Deduct (do-transaction / contract-expiration)
- **Generic command:** `DirectDebitCommand` [CODE] `Commands\DirectDebitCommand.cs:5-18` — `AccountId`, `Amount`, `Currency`, `ReferenceType`, `ReferenceId`, `AllowCommChannelWalletFallback`, `CommChannelPriorityIds[]`.
- **Handler:** [CODE] `Application\ChargingEngine\Handlers\DirectDebitHandler.cs:93-223` `ExecuteAsync` — idempotency receipt check → wallet load → `_allocateOcsMonetaryBucketsPolicy.Execute` → `wallet.ApplyDebit(allocations)` → `PrepareForMutation` (version++) → CAS write via `TryReplaceAsync(wallet, expectedVersion)` → ledger + outbox + snapshot + summary upserts → optional CommChannel fallback path (lines 240-371).
- **Domain method:** [CODE] `OcsWallet.cs:357-369` `ApplyDebit(allocations)` — moves `Amount` from `AvailableAmount` → `ConsumedAmount` per bucket. **TotalAmount stays put** (audit invariant; differs from transfer-out).
- **Contract expiration:** [CODE] `Process\ProjectContractLifecycleProcess.cs:134-197` `ExecuteExpiryAsync` for `LifecycleType="EXPIRED"`. **Note:** expiration does NOT trigger a deduction — it calls [CODE] `OcsWallet.cs:321-333` `ExpireContractBuckets(contractId, expiresAt)` which only flips `Status = Expired`. The balance is preserved for audit (line 318). Future deductions are blocked because the allocator skips non-Active buckets (see §3).

### 2.4 Purchase (activate/renew CommChannel/Application — system-priced)
- **Commerce side:** [CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Application\Services\Handlers\CreateFalconServiceOrderHandler.cs:46-104` builds `Order.CreatePending` and publishes `FalconServiceOrderCreatedEvent` with `CommChannelPriorityIds`.
- **Charging side:** [CODE] `Application\ChargingEngine\Handlers\DeductFalconServiceCostHandler.cs:32-59` consumes the Kafka event and calls `_directDebitHandler.ExecuteAsync(new DirectDebitCommand { ReferenceType = "SERVICE_ORDER", ReferenceId = orderId, AllowCommChannelWalletFallback = true, CommChannelPriorityIds = command.CommChannelPriorityIds })`.
- **Outcome event:** [CODE] `DeductFalconServiceCostHandler.cs:66-72` publishes `FalconServiceOrderPaymentProcessedEvent { OrderStatus, OrderFailureReason }` back to Commerce.

### 2.5 Consume Addons (sub-services)
- **No standalone `Addon` entity exists.** Sub-services are modeled as `OcsWalletBucket` rows of type `Quota` with `QuotaCategory = "SUB_SERVICE"`, sitting on the **account master wallet** (`ACCOUNT:{accountId}:ALL:SAR`).
- **Constants:** [CODE] `Domain\Constants\OcsChargeKinds.cs:14-29` — `OcsChargeKinds.SubService = "SUB_SERVICE"`, `OcsQuotaCategories.SubService = "SUB_SERVICE"`.
- **Provision:** [CODE] `OcsWallet.cs:245-315` `EnsureQuotaBucket(contractId, quotaCode, channel, includedAmount, includedUnits, unit, quotaCategory, subService, effectiveFrom, expiresAt, ...)` — when `QuotaCategory == "SUB_SERVICE"`, fields `TotalUnits` + `RemainingUnits` are populated; for `"USAGE"` it is `TotalAmount` + `AvailableAmount`.
- **Consume:** [CODE] `Domain\ChargingEngine\Policies\BuildOcsUsageReservationPlanPolicy.cs:130-190` `BuildSubServicePlan` — consumes `RemainingUnits` of the matching quota bucket first, then prices uncovered units via the overage rate (`_resolveContractChargeRatePolicy.ResolveOverageRate`), then debits the contract-funded bucket.

> CONFIRMS MC-TT-12: addons consume quota units first, then overage charges hit the contract-funded master wallet.

---

## §3 Nearest-expiring contract loop (BR-CC-31)

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\WalletBalanceManagement\Policies\AllocateOcsMonetaryBucketsPolicy.cs:24-69` `AllocateOcsMonetaryBucketsPolicy.Execute(wallet, amount, currentTime)`:

```csharp
var eligibleBuckets = wallet.Buckets
    .Where(bucket =>
        bucket.BucketType == eOcsBucketType.ContractFunded &&
        bucket.Status == eOcsBucketStatus.Active &&
        NormalizeInstant(bucket.EffectiveFrom) <= timestamp &&
        NormalizeInstant(bucket.ExpiresAt) >= timestamp &&
        (bucket.AvailableAmount ?? 0m) > 0m &&
        !string.IsNullOrWhiteSpace(bucket.ContractId))
    .OrderBy(bucket => bucket.ExpiresAt)         // <-- nearest-expiry first
    .ThenBy(bucket => bucket.EffectiveFrom)
    .ThenBy(bucket => bucket.BucketId)
    .ToList();

foreach (var bucket in eligibleBuckets)
{
    if (remaining <= 0) break;
    var allocatable = Math.Min(bucket.AvailableAmount ?? 0m, remaining);
    if (allocatable <= 0) continue;
    allocations.Add(OcsMonetaryBucketAllocation.Create(bucket, allocatable));
    remaining -= allocatable;
}

if (remaining > 0)
    throw new FalconException(FalconKeys.Error.InsufficientBalance);
```

> CONFIRMS BR-CC-31 / W-TT-08: nearest-expiring contract is consumed first; in BuildOcsUsageReservationPlanPolicy this is also the candidate order via `ResolveSortExpiry` (`BuildOcsUsageReservationPlanPolicy.cs:421-432`) + `.OrderBy(candidate => candidate.SortExpiresAt)` (line 229).

There is **no separate `WalletDomainService` / `BalanceCalculator`** — the allocation IS the domain service. Same policy is reused by:
- `DirectDebitHandler` (`DirectDebitHandler.cs:127, 391, 409`) — for purchase debits.
- `TransferBalanceHandler` (`TransferBalanceHandler.cs:124`) — for transfer outs.
- `BuildOcsUsageReservationPlanPolicy` — for usage reserve (per-contract candidate loop).

---

## §4 Atomicity guard

### 4.1 "Total available < Needed Amount" abort
[CODE] `AllocateOcsMonetaryBucketsPolicy.cs:61-62`:
```csharp
if (remaining > 0)
    throw new FalconException(FalconKeys.Error.InsufficientBalance);
```
This is the single guard. It throws AFTER the per-bucket allocation loop has tried every eligible contract bucket — so it's a "scan all candidates, fail if shortfall" check rather than a pre-flight `sum < amount`.

A pre-flight comparison **does** exist in the CommChannel-fallback path: [CODE] `DirectDebitHandler.cs:264-274` computes `masterBalance` + `commTotal`, calls `_resolveWalletFundingDecisionPolicy.Execute(commTotal, masterBalance, amount, hasCommPriorities)`, and throws `DirectDebitOrderFailureException(InsufficientFunds)` if `Source == Fail` (line 272-273) — see §6/§9.

### 4.2 Transactional
[CODE] `Application\Interfaces\IUnitOfWork.cs:5-13` — `BeginAsync`, `CommitAsync`, `AbortAsync`, `HasActiveTransaction`, `Session`.
[CODE] `Infrastructure\Persistence\MongoUnitOfWork.cs:8-50` — **MongoDB ClientSession with transaction**:
```csharp
_session = await _client.StartSessionAsync();
_session.StartTransaction();
// CommitAsync: _session.CommitTransactionAsync()
// AbortAsync:  _session.AbortTransactionAsync()
```
Every handler wraps mutation in `_unitOfWork.BeginAsync()` / `CommitAsync()` / `AbortAsync()`. Pattern in [CODE] `DirectDebitHandler.cs:151-220` and `TransferBalanceHandler.cs:132-197`. Cross-wallet transfer commits both source + destination CAS writes in the same transaction (`TransferBalanceHandler.cs:139, 142`).

Optimistic concurrency: [CODE] `OcsWallet.cs:83-89` `PrepareForMutation(utcNow)` increments `Version++` before write; `TryReplaceAsync(wallet, expectedVersion)` is the compare-and-swap. Conflict → `FalconKeys.Error.WalletVersionConflict` → retry via `IOcsRetryBackoffHelper`.

> CONFIRMS W-TT-15: atomicity is MongoDB session-based, all-or-nothing per handler.

---

## §5 Master Wallet aggregation

**Master Wallet is a STORED entity** (not a computed view). Specifically: the `OcsWallet` document with `OwnerType=Account, Channel="ALL"`.

[CODE] `Domain\ContractLifecycleProjection\Policies\ResolveContractFundingWalletPolicy.cs:22-37`:
```csharp
public ContractFundingWalletTarget Execute(string accountId, eCurrency currency)
{
    var ownerId = accountId.Trim();
    const string channel = "ALL";
    return new ContractFundingWalletTarget {
        OwnerType = eOcsWalletOwnerType.Account,
        OwnerId = ownerId,
        Channel = channel,
        WalletId = OcsWallet.BuildWalletId(eOcsWalletOwnerType.Account, ownerId, channel, currency)
    };
}
```
**Phase 1 rule (line 19):** "contract funding lands on the account master wallet only. Channel/user/node wallets receive contract lineage later through explicit transfers."

The per-contract VIEW is computed: [CODE] `Domain\WalletBalanceManagement\Entities\ContractBalanceSummary.cs:48-72` `FromWallets(IEnumerable<OcsWallet>)` GROUPS BY `ContractId` and SUMS `TotalAmount`/`AvailableAmount`/`ReservedAmount`/`ConsumedAmount` across every wallet that still holds a `ContractFunded` bucket for that contract. **Persisted as `contract_balance_summary` collection** — refreshed on every wallet mutation (e.g. `DirectDebitHandler.cs:184, 331-333`).

The total `MasterWallet.AvailableAmount` is `wallet.Buckets.Where(b => b.BucketType == ContractFunded).Sum(b => b.AvailableAmount)` (mirrored in `WalletBalanceSnapshot.FromWallet` at `WalletBalanceSnapshot.cs:54-69`).

There is no filter on `IsActive == true` at master-wallet level — the active check is per-bucket (`Status == Active`).

> CONFIRMS W-TT-03: Master Wallet is the `ACCOUNT:*:ALL:*` document; per-contract balances are summarized to `contract_balance_summary` for fast reads.

---

## §6 CommChannel wallet priority ordering

### 6.1 Storage
The priority list is NOT a persisted entity on the wallet/account side. It is a **per-call request input** carried on the `DoPaymentCommunicationChannelRequest` / `DoPaymentApplicationRequest` / `CreateFalconServiceOrderCommand`:

[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Contracts\Models\Shared\CommChannelPriority.cs:1-8`:
```csharp
public class CommChannelPriority
{
    public int CommChannelPriorityId { get; set; }
    public string ChannelId { get; set; }
}
```

[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Application\Commands\CreateFalconServiceOrderCommand.cs:1-14` — `List<CommChannelPriority> CommChannelPriorityIds`.

[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Contracts\Models\RequestsDtos\DoPaymentApplicationRequest.cs:5-10` — passed in by the UI per-payment.

### 6.2 Source list (which channels are eligible)
[CODE] `Application\Services\Handlers\GetVisibleCommunicationChannelsHandler.cs:37-46` reads the visible channels from `Node.CommChannels.Where(c => c.Visibility)`. UI lets the AO/Falcon-User reorder these into the priority list.

### 6.3 Consumption during deduction
[CODE] `DirectDebitHandler.cs:420-439` `ResolvePriorityWallets`:
```csharp
foreach (var priority in priorities)
{
    var channel = NormalizeChannel(priority.ChannelId);
    if (!emitted.Add(channel)) continue;
    if (walletsByChannel.TryGetValue(channel, out var wallet))
        yield return wallet;
}
```
**Iteration order is the order received in the request** (no sort by `CommChannelPriorityId` — the int field exists but the loop walks the list as supplied).

Funding gate: [CODE] `Domain\WalletBalanceManagement\Policies\ResolveWalletFundingDecisionPolicy.cs:6-35`:
```csharp
// 1) Master covers fully
if (masterBalance >= amount)            return WalletFundingDecision.Master();
// 3) Combined covers
if (masterBalance > 0 && (masterBalance + commTotal) >= amount)
    return hasCommPriorities
        ? WalletFundingDecision.Both()
        : WalletFundingDecision.Fail(eOrderFailureReason.CommChannelPriorityOrderRequired);
// 2) Comm covers fully
if (commTotal >= amount)
    return hasCommPriorities
        ? WalletFundingDecision.CommChannel()
        : WalletFundingDecision.Fail(eOrderFailureReason.CommChannelPriorityOrderRequired);
// 4) Not enough
return WalletFundingDecision.Fail(eOrderFailureReason.InsufficientFunds);
```

> CONFIRMS W-TT-09 / MC-TT-07: the priority list is supplied per-request (not stored), iterated in request order, and **missing priorities are a HARD ABORT** with `CommChannelPriorityOrderRequired` whenever the master alone can't cover the cost.

---

## §7 Addons

### 7.1 Entity
No separate `Addon` collection or class. Sub-services / addons are `OcsWalletBucket` of type `Quota` with `QuotaCategory = "SUB_SERVICE"`.

[CODE] `OcsWallet.cs:763-791` bucket fields:
- `QuotaCode` — addon identifier (e.g. "WHATSAPP_TEMPLATE", "SHORT_CODE").
- `SubService` — sub-service slug.
- `Unit` — unit type (e.g. "TEMPLATE", "NUMBER").
- `TotalUnits` / `RemainingUnits` — allowance counters.
- `EffectiveFrom` / `ExpiresAt` — activation/expiry dates.

### 7.2 Recurrence Charge (RC)
**RC is NOT stored as a flag on the addon bucket.** It is modeled at the Commerce layer as the contract's `PricingType` — `Monthly`, `Yearly`, `OneTimePayment` (the comm-channel / application `ePricingType` enum). When a service is renewed, Commerce creates a **new order** which triggers a new `DirectDebitCommand` via `CreateFalconServiceOrderHandler` → `FalconServiceOrderCreatedEvent` → `DeductFalconServiceCostHandler`. The recurring deduction is therefore an event-driven re-purchase, not a wallet-level RC tag.

For addon **OVERAGE** pricing (consumption beyond the included quota), the rate is read from the contract tariff:
[CODE] `Application\ContractLifecycleProjection\Processes\ProjectContractLifecycleProcess.cs:239-247` — `OverageRates[] { SubService, ChannelId, Unit, UnitPrice, BillingCycle, Status }` flows from `ContractActivated` event and lands in `ContractTariffCache.OverageRates`.

### 7.3 Activation/Expired dates interaction
- **Activation:** [CODE] `OcsWallet.cs:245-315` `EnsureQuotaBucket(..., effectiveFrom, expiresAt, ...)` — sets `bucket.EffectiveFrom` + `bucket.ExpiresAt` from contract dates.
- **Eligibility check:** [CODE] `BuildOcsUsageReservationPlanPolicy.cs:268-271`: `NormalizeInstant(bucket.EffectiveFrom) <= timestamp && NormalizeInstant(bucket.ExpiresAt) >= timestamp` — bucket must be within window AND `Status == Active`.
- **Expiry:** [CODE] `OcsWallet.cs:321-333` `ExpireContractBuckets(contractId, expiresAt)` flips `Status = Expired` on **every bucket linked to the contract** (both monetary AND quota — same loop). Historical balances are preserved (line 318-319 comment: "preserves auditability while making the contract ineligible for future consumption").

> CONFIRMS MC-TT-14 / MC-TT-15: addon activation/expiration is governed by the parent contract's lifecycle; addon expiry is a status flip, not a balance reset.

---

## §8 Contract expiration

### 8.1 Trigger pattern: **Kafka event, not a scheduler in Charging**

The Charging service does NOT own a Quartz / Hangfire job that scans for expired contracts. Expiration is published by Commerce as a `ContractLifecycleEvent { LifecycleType="EXPIRED" }` and projected by Charging.

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\ContractLifecycleProjection\Messaging\Kafka\Consumers\ContractLifecycleEventConsumer.cs:119-134` consumes the `EXPIRED` lifecycle:
```csharp
if (string.Equals(message.LifecycleType, ContractLifecycleEvent.ExpiredType, StringComparison.OrdinalIgnoreCase))
{
    await process.ExecuteExpiryAsync(new ProjectContractExpiredCommand { ... });
    return true;
}
```

### 8.2 The ONE scheduled BackgroundService in Charging
[CODE] `Falcon.Charging.Infrastructure\ReservationSettlement\Workers\ReservationExpiryWorker.cs:18-86` — a `BackgroundService` that expires **reservations** (not contracts). Uses `IOptions<ConfigurationSettings>.OcsReservationExpiry { BatchSize, PollIntervalMs }` polling loop:
```csharp
while (!stoppingToken.IsCancellationRequested) {
    var result = await process.ExecuteAsync(new ExpireWalletReservationsCommand {
        CurrentTime = DateTime.Now, BatchSize = _settings.BatchSize }, stoppingToken);
    if (result.CandidateCount > 0) continue;  // drain backlog
    await Task.Delay(_settings.PollIntervalMs, stoppingToken);
}
```

**No Hangfire, no Quartz, no Kafka delayed-delivery.** The scheduling is a plain `BackgroundService` poll for reservations; contract expirations are Kafka-event-driven from Commerce.

> CONFIRMS W-TT-11 (partial): the expiration "scheduler" is upstream in Commerce; Charging reacts to a published event.

---

## §9 Funding decision

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\Constants\WalletFundingDecision.cs:3-28`:
```csharp
public sealed class WalletFundingDecision
{
    public WalletFundingSource Source { get; }
    public eOrderFailureReason? FailureReason { get; }

    public static WalletFundingDecision Master()       => new(WalletFundingSource.Master);
    public static WalletFundingDecision CommChannel()  => new(WalletFundingSource.CommChannel);
    public static WalletFundingDecision Both()         => new(WalletFundingSource.Both);
    public static WalletFundingDecision Fail(eOrderFailureReason reason) => new(WalletFundingSource.Fail, reason);
}
```

[CODE] `Enums .cs:104-110` — `WalletFundingSource { Master=1, CommChannel=2, Both=3, Fail=4 }`.

Policy that produces it: [CODE] `Domain\WalletBalanceManagement\Policies\ResolveWalletFundingDecisionPolicy.cs:8-34` (see §6 for full body).

Consumption in deduction: [CODE] `DirectDebitHandler.cs:266-282` builds `WalletDebitPlan[]` (one per wallet touched) based on `decision.Source`:
- `Master` only → debit master wallet only.
- `Both` → debit master first (capped at `masterBalance`), spill to CommChannel wallets in priority order.
- `CommChannel` → skip master, spill straight into channel wallets.
- `Fail` → throw `DirectDebitOrderFailureException(decision.FailureReason)`.

Per-allocation per-contract lineage is preserved: each plan's `Allocations` are `OcsMonetaryBucketAllocation[]` carrying `BucketId`, `ContractId`, `TariffSnapshotRef` (see [CODE] `Domain\WalletBalanceManagement\Models\OcsMonetaryBucketAllocation.cs:16-37`).

> CONFIRMS MC-TT-10: `FundingDecision` is a Source enum + optional FailureReason — slim, source-of-money discriminator, NOT a full settlement object. The "where the money came from per contract" detail lives on the `OcsMonetaryBucketAllocation[]` carried by the `WalletDebitPlan`.

---

## §10 Idempotency

### 10.1 Mutation-key strategy
[CODE] `Falcon.Charging.Domain\Services\Policies\WalletMutationIdempotencyPolicy.cs:11-37`:
```csharp
var segments = new[] {
    operation.ToString().ToUpperInvariant(),   // DEBIT | RESERVE | COMMIT | RELEASE | EXPIRE | …
    Normalize(walletId),
    Normalize(referenceType),                  // "SERVICE_ORDER", "WALLET_TRANSFER", "CONTRACT_FUNDING"…
    Normalize(referenceId),                    // orderId, transferId, contractId
    Normalize(secondaryReference)
};
return string.Join(':', segments.Where(s => !string.IsNullOrWhiteSpace(s)));
```
Deterministic key — retries / duplicate Kafka deliveries / consumer replays all converge on the same receipt (line 25-26 comment).

### 10.2 Receipt persistence
[CODE] `Domain\LedgerIntegration\Entities\WalletMutationReceipt.cs:12-83` — collection `wallet_mutation_receipts` (`OcsCollectionNames.cs:16`). Unique index on `idempotencyKey`. Fields: `IdempotencyKey`, `WalletId`, `Operation`, `ReferenceType`, `ReferenceId`, `WalletVersion`, `ResultCode`, `ResponseJson` (cached return value!), `AvailableBalance`, `ReservedBalance`, `ConsumedBalance`.

### 10.3 Guard pattern
[CODE] `DirectDebitHandler.cs:104-109`:
```csharp
var existingReceipt = await _walletMutationReceiptRepository.GetByIdempotencyKeyAsync(idempotencyKey, cancellationToken);
if (existingReceipt is not null) {
    _ocsObservabilityService.RecordIdempotencyHit("direct-debit", target.WalletId, ...);
    return BuildResultFromReceipt(existingReceipt);
}
```
Same pattern in `ReserveWalletChargeHandler.cs:100-105`. After commit, `_walletMutationReceiptRepository.AddAsync(receipt)` (line 186) — duplicate-key on `idempotencyKey` triggers second lookup → return cached response (`DirectDebitHandler.cs:202-209`).

### 10.4 Event-driven idempotency (contract lifecycle)
[CODE] `Domain\LedgerIntegration\Entities\WalletOutboxMessage.cs` + `Domain\LedgerIntegration\Entities\ConsumedEventReceipt.cs` — collection `consumed_event_receipts`. Key = `ConsumerName + EventId`. [CODE] `ProjectContractLifecycleProcess.cs:64-68` checks for existing receipt before doing work, then inserts at the END of the transaction (lines 92-94) so concurrent consumers race on the unique-key insert.

> CONFIRMS W-TT-13: idempotency is `(operation, walletId, refType, refId)` for wallet mutations, `(consumerName, eventId)` for Kafka projections. **No client-supplied trace-id** is required — the wallet+reference pair is the natural key.

---

## §11 Cross-contract pricing math — Vol 44 §2.3 (1.25 + 0.125 = 1.375 SAR)

**No literal `1.25` / `0.125` / `1.375` constants found in source.** Searched: `Falcon\falcon-core-charging-svc` for those numbers — zero matches. The numbers are illustrative in the Vol 44 prose, not coded.

The **mechanism** is in place, however. The math comes from the policy at [CODE] `BuildOcsUsageReservationPlanPolicy.cs:296-330` `AllocateUsageQuota` + `BuildOcsUsageReservationPlanPolicy.cs:358-392` `AllocateMonetary`. Walk-through:

1. Per-contract candidate loop (`BuildOcsUsageReservationPlanPolicy.cs:71-106`) iterates contracts by nearest expiry.
2. For each contract, `AllocateUsageQuota` computes `maxQuotaQuantity = TruncateQuantity(availableAmount / unitPrice)` (line 309) and consumes `min(remainingQuantity, maxQuotaQuantity)` from the quota bucket. `amount = decimal.Round(quantityToAllocate * unitPrice, 6, MidpointRounding.AwayFromZero)` (line 314).
3. If quota exhausted, `AllocateMonetary` (line 375) does the same `quantityToAllocate * unitPrice` rounded to 6dp against the contract-funded bucket.

So for "1.25 + 0.125 = 1.375" — that pattern arises when contract A funds the first slice at its unit price and contract B (smaller available, possibly different rate after contract A is exhausted) funds the second slice. The plan returns `RatedAmount = quotaAllocations.Sum(.Amount) + monetaryAllocations.Sum(.Amount)` (line 121) — a sum across **multiple contracts**. That sum is the verbatim mechanism Vol 44 §2.3 describes; the specific numeric example (1.25 + 0.125) is a hypothetical, not coded as a fixture.

**Lines that produce per-contract money:**
```csharp
// BuildOcsUsageReservationPlanPolicy.cs:313-316  (usage quota slice)
var amount = decimal.Round(quantityToAllocate * unitPrice, 6, MidpointRounding.AwayFromZero);
if (amount > availableAmount) amount = availableAmount;

// BuildOcsUsageReservationPlanPolicy.cs:375-377  (monetary slice for uncovered)
var amount = decimal.Round(quantityToAllocate * resolvedRate.UnitPrice, 6, MidpointRounding.AwayFromZero);
if (amount > availableAmount) amount = availableAmount;

// BuildOcsUsageReservationPlanPolicy.cs:121  (cross-contract sum)
RatedAmount = quotaAllocations.Sum(a => a.Amount) + monetaryAllocations.Sum(a => a.Amount),
```

> PARTIALLY CONFIRMS MC-TT-08: the cross-contract sum mechanic exists; the literal 1.25/0.125 example does not appear in code (it is a documentation illustration only).

---

## §12 Errors — wallet-related FalconError codes

[CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\Constants\FalconKeys.cs:9-27`:

```csharp
public const string DuplicateTenantName = nameof(DuplicateTenantName);
public const string InternalServerError = nameof(InternalServerError);
public const string UnauthorizedUserToPerformThisAction = nameof(UnauthorizedUserToPerformThisAction);
public const string NoAnyCommChannelWalletWasFound = nameof(NoAnyCommChannelWalletWasFound);
public const string WalletSettingsNotFound = nameof(WalletSettingsNotFound);
public const string WalletNotFound = nameof(WalletNotFound);
public const string InvalidTransferWallets = nameof(InvalidTransferWallets);
public const string InsufficientBalance = nameof(InsufficientBalance);
public const string CommChannelSubWalletNotFound = nameof(CommChannelSubWalletNotFound);
public const string InvalidAmount = nameof(InvalidAmount);
public const string InvalidWalletIdentity = nameof(InvalidWalletIdentity);
public const string InvalidIdempotencyKey = nameof(InvalidIdempotencyKey);
public const string InvalidChargeRequest = nameof(InvalidChargeRequest);
public const string WalletVersionConflict = nameof(WalletVersionConflict);
public const string ReservationNotFound = nameof(ReservationNotFound);
public const string NoApplicableRate = nameof(NoApplicableRate);
```

The order-failure reasons (for `DoPayment` API response):
[CODE] `Enums .cs:81-86`:
```csharp
public enum eOrderFailureReason {
    None = 0,
    InsufficientFunds = 1,
    CommChannelPriorityOrderRequired = 2
}
```

**Key mapping (Vol 44 references):**
- `InsufficientBalance` → after allocator loop, no eligible bucket can cover the shortfall (`AllocateOcsMonetaryBucketsPolicy.cs:62`, `OcsWallet.cs:364, 385, 443, 453, 533, 581`).
- `InsufficientFunds` → `eOrderFailureReason` returned in `DoPayment` response body, raised by `ResolveWalletFundingDecisionPolicy.cs:33` when both master + comm-channel pools combined still fall short.
- `CommChannelPriorityOrderRequired` → `ResolveWalletFundingDecisionPolicy.cs:22, 28` when comm-channel funds are needed but the request did not supply a priority list (`hasCommPriorities == false`).
- `WalletNotConfigForTheNode` — **not found in code as a constant**; the closest equivalents are `WalletSettingsNotFound` (raised when `WalletStrategyReadModel` missing, e.g. `TransferBalanceHandler.cs:91-92, ReserveWalletChargeHandler.cs:340`) and `WalletNotFound` (raised when the `wallets` document itself is absent).
- `WalletVersionConflict` → optimistic-concurrency loss, triggers `IOcsRetryBackoffHelper.DelayAsync` + retry up to `MaxAttempts`.
- `InvalidTransferWallets` → `ResolveOcsTransferWalletsPolicy` rejects an illegal source→destination path (`ResolveOcsTransferWalletsPolicy.cs:32, 50, 67, 88`).
- `InvalidIdempotencyKey` / `InvalidWalletIdentity` / `InvalidAmount` / `InvalidChargeRequest` — input validation guards.
- `NoApplicableRate` → `BuildOcsUsageReservationPlanPolicy.cs:111, 178` when no contract candidate has a rate that resolves.
- `ReservationNotFound` → `OcsWallet.cs:514` (`GetRequiredReservation`).

> CONFIRMS MC-TT-11: error vocabulary matches Vol 44 — note that "WalletNotConfigForTheNode" cited in the prompt is actually the Commerce-layer name; in Charging it is `WalletSettingsNotFound`.

---

## Cross-reference: collection layout for the per-account picture

| Concept                       | Collection                  | Doc shape                                                         | File                                            |
| ----------------------------- | --------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| OCS aggregate (master + channel wallets) | `wallets`                   | `OcsWallet` w/ `Buckets[]` + `Reservations[]`                     | `OcsWallet.cs`                                  |
| Per-contract account view     | `contract_balance_summary`  | `ContractBalanceSummary` GROUPBY contractId                       | `ContractBalanceSummary.cs`                     |
| Wallet snapshot (fast read)   | `wallet_balance_snapshots`  | `WalletBalanceSnapshot.FromWallet(wallet)`                        | `WalletBalanceSnapshot.cs`                      |
| Idempotency receipts          | `wallet_mutation_receipts`  | `WalletMutationReceipt` (unique on `idempotencyKey`)              | `WalletMutationReceipt.cs`                      |
| Per-allocation audit log      | `wallet_ledger`             | `WalletLedgerEntry` (one row per contract slice per op)           | `Domain\LedgerIntegration\Entities\WalletLedgerEntry.cs` |
| Outbox for downstream events  | `wallet_outbox`             | `WalletOutboxMessage`                                             | `Domain\LedgerIntegration\Entities\WalletOutboxMessage.cs` |
| Reservation TTL index         | `reservation_lookup`        | `ReservationLookup` (used by `ReservationExpiryWorker`)           | `Domain\ReservationSettlement\Entities\ReservationLookup.cs` |
| Wallet strategy (immutable)   | `wallet_strategy_read_model`| `WalletStrategyReadModel` per account                             | `WalletStrategyReadModel.cs`                    |
| Contract tariff (snapshot)    | `contract_tariff_cache`     | `ContractTariffCache` (Rates / Quotas / OverageRates / UnitConv.) | `Domain\RatingEngine\Entities\ContractTariffCache.cs`    |
| Kafka idempotency             | `consumed_event_receipts`   | `ConsumedEventReceipt` (key = `consumer + eventId`)               | `Domain\LedgerIntegration\Entities\ConsumedEventReceipt.cs` |
| Redis hot state mirror        | (Redis)                     | Lua-script-mediated counters via `RedisRealTimeWalletStateRepository` | `Infrastructure\RealTimeChargingCore\Redis\*`    |

---

## Closing notes for Vol 45 Wallet Specialist

1. **Phase 1 is "all funding lives on the account master wallet"** — this is repeated in policy comments (`ResolveContractFundingWalletPolicy.cs:19`, `ResolveDirectDebitWalletPolicy.cs:11-15`, `ResolveOcsChargeWalletsPolicy.cs:17`). Future phases will distribute funding across owner wallets — the bucket-level lineage is already in place to support that.
2. **There is no `WalletDomainService`** in the Falcon sense. The orchestration sits in `OcsWallet` (aggregate root mutations) + policy classes (`Allocate*`, `Resolve*`). Handlers are application-layer thin orchestrators.
3. **CommChannel priority is NOT persistent** — it's a transactional input, supplied per `DoPayment` request. The "Priority Order" page in the UI is therefore a request-builder, not a settings page.
4. **Master Wallet is `ACCOUNT:{accountId}:ALL:{currency}`** — channel and currency are part of the deterministic wallet id (`OcsWallet.BuildWalletId`, line 147-157).
5. **No "RC" flag on the wallet/bucket** — recurrence is a Commerce contract concept that fires new orders → new debits.
6. **Vol 44 §2.3's 1.25/0.125/1.375 numerals are illustrative** — the cross-contract sum mechanism in `BuildOcsUsageReservationPlanPolicy` produces that pattern but the specific values don't appear as code.
