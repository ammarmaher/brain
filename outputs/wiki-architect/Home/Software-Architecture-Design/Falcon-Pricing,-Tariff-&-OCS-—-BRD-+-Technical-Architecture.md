# Falcon Pricing, Tariff & OCS — BRD + Technical Architecture

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Falcon-Pricing,-Tariff-&-OCS-—-BRD-+-Technical-Architecture.md`
**Length:** 1665 lines · **Headings:** 179
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

Two-part document. **Part 1 (BRD)** defines business scope: contracts with embedded tariffs, wallet strategy, monetary buckets, quota buckets, reservations, ledger. **Part 2 (Technical Architecture / HLD)** defines two cooperating bounded contexts — **Commerce** (contract authoring + lifecycle) and **OCS / Charging** (wallet, balance, charging, rating, reservation, settlement, ledger) — plus their Kafka coordination, internal DDD structure (Wallet aggregate root, Bucket entity, Reservation entity, LedgerEntry entity, Domain Policies), interface/application/infrastructure layers, and external integration adapters.

## Key rules / decisions

### Part 1 BRD §3 Core business concepts (`…md:65-339`)

**Contract** carries embedded **Tariff snapshot** (NOT a reference to a reusable plan). Status: `PENDING | ACTIVE | EXPIRED`. Tariff contains Base Tariff, Quotas, Overage Rates.

**Wallet Strategy** (`…md:149-189`) — selected separately, **immutable** after activation:
- **Balance Ownership:** `USER` or `NODE`.
- **Wallet Structure:** `SINGLE` or `MULTIPLE`.
- 4 combinations possible.

**Wallet** identity tuple: `(OwnerType, OwnerId, Channel, Currency)`. Examples:
- `ACCOUNT:ACC-1:ALL:SAR`
- `USER:USR-99:WHATSAPP:SAR`
- `NODE:DEP-2:VOICE:SAR`

Wallet types in business terms: Account Wallet (master), Channel Wallet, User Wallet, Node Wallet.

**Balance Bucket** = atomic balance unit. Types: `CONTRACT_FUNDED`, `QUOTA`. (Other types like `PROMOTIONAL`, `REFUND`, `ADJUSTMENT` are out-of-scope.) Every monetary bucket must be **source-aware** and usually **contract-aware**.

**Reservation / Hold** — temporary hold before settlement. Statuses: `ACTIVE | COMMITTED | RELEASED | EXPIRED`.

**Ledger** — immutable record of all money-changing actions. Stable types: `CREDIT, DEBIT, HOLD, RELEASE, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT`. Extensible reference types: `USAGE, WALLET_TRANSFER, CONTRACT_FUNDING, CHANNEL_PURCHASE, SHORT_CODE_PURCHASE, SUBSCRIPTION_FEE, EXTERNAL_PAYMENT, PROMOTION, MANUAL_ADJUSTMENT`.

### §5 Key business rules (`…md:393-541`)

- **5.1 Contract lifecycle:** `PENDING` doesn't fund wallets; `ACTIVE` funds wallets + creates eligible buckets; `EXPIRED` disables further consumption.
- **5.3 Monetary consumption order:** nearest-expiry eligible bucket first; preserve contract lineage.
- **5.4 Quota consumption order:** quota bucket → overage logic → monetary debit if applicable.
- **5.5 Charging policies:** charge on submit; reserve now/commit later; charge on delivery; reserve estimate / settle exact.
- **5.6 Transfer rules:**
  - In **multiple-wallet mode**, money for a channel **must flow through the corresponding account channel wallet** before reaching a user or node channel wallet. Example: Master Wallet → Account WhatsApp Wallet → User WhatsApp Wallet.
- **5.7 Ledger rule:** **If money value changes, there must be a ledger entry.**

### §5.7 Final Tariff Plan Schema (`…md:543-755`)

Embedded tariff snapshot inside contract:
```json
{
  "contractId": "CTR-1002",
  "accountId": "ACC-1",
  "status": "PENDING",
  "currency": "SAR",
  "committedValue": 10000.00,
  "startDate": "...",
  "endDate": "...",
  "tariffPlan": {
    "tariffPlanId": "TP-CTR-1002",
    "name": "Contract CTR-1002 Tariff",
    "currency": "SAR",
    "rates": [...],
    "quotas": [...],
    "overageRates": [...]
  }
}
```

### Part 2 §6 Architecture overview (`…md:761-825`)

**Major domains:**
- **Commerce Service** — contract authoring, contract lifecycle, tariff snapshot, account/customer master, publishes Kafka events (contract activated, contract expired, …).
- **OCS Service** — wallet & balance, balance authorization, reservation lifecycle, rating, ledger, snapshots.
- **Channel Services** — WhatsApp, Voice, SMS, RCS — issue charging requests to OCS.

### §7 Container coordination (`…md:847-935`)

All services publish/consume via Kafka. Commerce + OCS use MongoDB. WhatsApp/Voice/SMS/RCS + Commerce call OCS over HTTP/gRPC for charging.

### §8 OCS bounded context (`…md:941-995`)

**OCS owns:**
- Wallet aggregate creation/load/update.
- Contract-funded buckets + quota buckets.
- Authorize, reserve, commit/release, debit, credit, transfer (lineage-preserving).
- Publish charging results + balance events.
- Expose wallet/balance APIs.

**OCS does NOT:**
- Author contract wizard UI.
- Own order lifecycle.
- Provision products.
- Deliver actual messages/calls.

### §9 Charging model — separation of concerns (`…md:1001-1045`)

- **Rating:** what should the price be.
- **Authorization:** is sufficient eligible balance available.
- **Reservation:** temporary hold.
- **Settlement / Commit:** held → consumed.
- **Release:** held → returned.
- **Debit:** immediate final consumption (no reservation).

### §10 OCS internal component design (`…md:1052-1518`)

**§10.1 Interface Layer** — controllers: `WalletsController, ReservationsController, DebitsController, CreditsController, TransfersController, BalancesController`.

**§10.2 Application Layer:**
- A. Channel-specific thin handlers: `AuthorizeWhatsappChargeHandler, AuthorizeVoiceChargeHandler, AuthorizeSmsChargeHandler, AuthorizeRcsChargeHandler`. They are thin: validate channel-specific shape → build normalized request → select channel policy → delegate to shared orchestration.
- B. **Shared application services:**
  - `ChargeAuthorizationService` — main reusable authorization engine. Resolves wallet → loads aggregate → identifies buckets → resolves rates → builds allocation plan → reserves → persists wallet/ledger/outbox → updates snapshots → returns result.
  - `ReservationSettlementService` — commit/release.
  - `DirectDebitService` — app/channel/short-code purchase, subscription fee.
  - `TransferService` — lineage-preserving wallet-to-wallet.
  - `ContractFundingService` — on contract activation, create funded + quota buckets.
  - `QuotaConsumptionService` — optional quota-first orchestration.

**§10.3 Domain Layer:**
- **Wallet aggregate root** — owns buckets, reservations, invariants. Methods: `ReserveUsage`, `CommitReservation`, `ReleaseReservation`, `Debit`, `Credit`, `TransferOut`, `TransferIn`, `CreateBucket`.
- **Bucket entity** — `bucketId, walletId, contractId, tariffSnapshotRef, bucketType, serviceScope, totalAmount, availableAmount, reservedAmount, consumedAmount, totalUnits/remainingUnits (quota), effectiveFrom, expiresAt, status`.
- **Reservation entity** — `reservationId, walletId, policyCode, refType, refId, status, allocations[], reservedAmount, createdAt, expiresAt`.
- **LedgerEntry entity** — `ledgerEntryId, walletId, bucketId, contractId, type, refType, refId, amount, currency, createdAt, metadata`.
- **Domain Policies:** `WalletSelectionPolicy, BucketAllocationPolicy, ContractAwareRatingPolicy, ChargingPolicy, FallbackPolicy`.

**§10.4 Infrastructure Layer:**
- Repositories: `WalletRepository, LedgerRepository, ReservationLookupRepository, BalanceSnapshotRepository, OutboxRepository, ContractTariffCacheRepository, WalletStrategyReadModelRepository`.
- Adapters + projections.

### Charging Policy examples (`…md:1448-1471`)

- `WA_DELIVERY_COMMIT` (WhatsApp: reserve at send, commit at delivery).
- `DEBIT_ON_SUBMIT` (charge at submit).
- `VOICE_ESTIMATE_THEN_SETTLE` (estimate at call start, settle on call end).

### FallbackPolicy examples (`…md:1462-1469`)

- channel wallet → account wallet
- user wallet → parent node wallet → account wallet
- no fallback allowed

## Diagrams / images referenced

- `Contract%20Management-b7488998-…jpg` — Contract Management diagram.

## Cross-references

- Commerce publishes contract events to Kafka — consumed by OCS (Charging) per `Account-Management-Module.md` settings sync pattern.
- Wallet strategy is in scope of Account Management (Commerce) — see `Account-Management-Module.md` §"Update Account Settings".
- Charging is core to `High-Level-Architecture.md` §3.4 "Charging Flow" and §3.2 "Messaging Flow".

## Implications for code

**Verified against code:**
- `falcon-core-commerce-svc` ✓ (Commerce service).
- `falcon-core-charging-svc` ✓ (the **OCS** service).
- Both have Kafka producers/consumers ✓.
- Both have MongoDB ✓.
- Both have `Falcon.<Service>.Domain` with `ValueObjects/`, `Entities/`, etc.

**Conflicts / open items:**

1. **Service naming drift** — wiki says **OCS** is the bounded context; code calls it **`falcon-core-charging-svc`** with `Falcon.Charging.*` projects. The wiki uses "OCS" and "Charging" interchangeably (e.g. §8 "OCS bounded context" but §6 "Charging Service" in container diagram). **Soft drift** — accept Charging as the service name.
2. **`WalletsController`, `ReservationsController`, `DebitsController`, `CreditsController`, `TransfersController`, `BalancesController`** — wiki §10.1 enumerates these controllers. Code has only `WalletController` (singular) + `LookupController` + 2 testing controllers (fallback §4.2). **Five controllers missing** — implementation incomplete.
3. **`ChargeAuthorizationService` shared service** — wiki §10.2.B. Verify Charging code has this service. Likely missing.
4. **`Wallet` aggregate root with named methods** (`ReserveUsage, CommitReservation, …`) — verify Charging Domain has this aggregate.
5. **Outbox pattern** — wiki §10.4 lists `OutboxRepository`. Code does not appear to have an outbox dispatcher (fallback §"Clean Architecture" item 4). **Implementation gap.**
6. **Contract-aware rate resolution** — wiki demands `ContractAwareRatingPolicy` per bucket. Unverified.
7. **Multi-wallet transfer rule** — wiki §5.6 mandates channel wallet flow: Master → Account-Channel → User/Node-Channel. Implementation needs this enforcement; verify `TransferService`.
8. **Ledger entry on every money change** — wiki §5.7. Code-level audit needed: every wallet mutation must write `LedgerEntry`.
9. **`tariffPlan` immutability** — once contract is `ACTIVE`, the embedded tariff snapshot must NOT change. Verify with code review.

**Implementation priority:**
- Add the 5 missing controllers (`Reservations, Debits, Credits, Transfers, Balances`).
- Implement `ChargeAuthorizationService` and the 4 channel-specific handlers.
- Implement Wallet aggregate + Bucket + Reservation + LedgerEntry as Domain entities with the prescribed fields.
- Wire outbox pattern for charging events.
