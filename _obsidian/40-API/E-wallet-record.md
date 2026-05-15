*** Entity Reconciliation E-wallet-record — WalletRecord ***
*** PRD: PRD-03 Contract Packaging Charging Billing · Backend service: charging · 2026-05-15 ***

# E-wallet-record — WalletRecord

> Ledger row that links a Wallet balance entry to a specific Contract. Defined in PRD-01 but load-bearing in PRD-03: WalletRecord is how `Contract.valueSar` funds into the Master Wallet on Active, and how the nearest-expiring charging cascade picks the contract to debit first. Records survive `Expired` contracts but are excluded from lump-sums. **Backend has NO public request DTO for WalletRecord — it's a derived/computed projection only.** Backend surfaces the equivalent via `ContractBalanceSummary` (returned by `GET contract-balance-summaries`).

## PRD definition (business-conceptual)

- **PRD module:** Primary definition in PRD-01 [[01 Account Management]]; load-bearing in [[03 Contract Packaging Charging Billing]]
- **Source:** [03 ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **PRD fields:**
  - `id`: opaque id
  - `walletId`: ref → Wallet
  - `contractId`: ref → Contract
  - `valueSar`: decimal — the lump-sum (or fractional) amount this record contributes
  - `createdAt`: auto
- Lifecycle: "Live (records survive Expired contracts but are excluded from lump-sums)"

## Backend DTO mapping

- **Service:** [[Charging Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/charging/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md)
- **Relevant DTOs:**
  - `GetContractBalanceSummariesResponse` — `GET contract-balance-summaries` — returns `List<ContractBalanceSummary> Summaries`
  - `ContractBalanceSummary` (nested) — per DTO_DICTIONARY: `{ ContractId, AvailableAmount, ... }`
  - **No `WalletRecord` request DTO exists** — record creation happens server-side from `ContractLifecycle` Kafka events (Commerce → Charging) and from `DirectDebitRequest` / `ReserveWalletChargeRequest` / `UpdateWalletReservationRequest` deduction flows
- Records are exposed indirectly via:
  - `DirectDebitResponse` → `{ TransactionId, DebitedAmount, RemainingBalance, AlreadyApplied }` — debits create a record under the hood
  - `UpdateWalletReservationResponse` → `{ ReservationId, Status, RatedAmount, QuotaUnits, BilledUnits, AlreadyApplied }` — commit/release writes the record
  - Testing Charging: `TestingChargingLedgerEntryResponse` — admin-side ledger row (paged via `TestingChargingLedgerQuery`)

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `TransactionId` (DirectDebitResponse) / `ReservationId` (UpdateWalletReservationResponse) | opaque → `string` | ⚠ drift — PRD has one `id`; backend uses two id concepts (transaction vs reservation) depending on flow. No unified "record id" surfaced |
| `walletId` | _not on `ContractBalanceSummary`_ | ref → _absent on this DTO_ | ❌ missing on the summary projection. `TransferBalanceEndpointRequest.WalletId` is the only place wallet id appears explicitly on mutation DTOs |
| `contractId` | `ContractId` (ContractBalanceSummary) | ref → `string` | ✅ match — only on the per-contract aggregate projection |
| `valueSar` | `AvailableAmount` (ContractBalanceSummary) | decimal → `decimal` | ⚠ semantic drift — PRD `valueSar` is the **lump-sum the record contributes**; backend `AvailableAmount` is the **remaining balance after debits**. The two are not the same: `AvailableAmount = SUM(positive records) - SUM(debits)`. FE must not conflate them |
| `createdAt` | _not on `ContractBalanceSummary`_ | datetime → _absent on summary_; lives on ledger entries (`TestingChargingLedgerEntryResponse`) | ❌ missing on the production-facing summary projection |
| _none_ | `RemainingBalance` (DirectDebitResponse) | _PRD only models per-record value, not the wallet aggregate_ | ➕ extra — wallet-level remaining balance returned per-debit |
| _none_ | `AlreadyApplied` (DirectDebitResponse, UpdateWalletReservationResponse, ReserveWalletChargeResponse) | _PRD silent_ | ➕ extra — idempotency indicator |
| _none_ | `RatedAmount`, `QuotaUnits`, `BilledUnits` (ReserveWalletChargeResponse, UpdateWalletReservationResponse) | _PRD silent_ | ➕ extra — rating-time projections (quota vs billed) |
| _none_ | `Status` (UpdateWalletReservationResponse) | _PRD says "Live"_ | ⚠ drift — backend reservation lifecycle uses `"Active"`, `"Committed"`, `"Released"`, `"Expired"` (per `OcsReservationStatus`). Not the same as PRD's binary "Live" |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ **No first-class WalletRecord DTO** — backend never returns the `{ id, walletId, contractId, valueSar, createdAt }` row PRD models. The closest analogue is `ContractBalanceSummary` (one aggregate per contract) plus the per-mutation responses (which carry transaction/reservation ids, not record ids)
- ⚠ Semantic drift between PRD `valueSar` and backend `AvailableAmount` — they answer different questions (contribution vs remaining)
- ⚠ ID-concept fragmentation — PRD `id` ↔ backend `TransactionId` (for debits) / `ReservationId` (for reserves) / no id at all on the summary
- ⚠ Status drift — PRD lifecycle is binary "Live"; backend reservation lifecycle is 4-state (`Active`/`Committed`/`Released`/`Expired`). Reservations are an additional layer the PRD doesn't model explicitly
- ❌ `walletId` and `createdAt` not exposed on `ContractBalanceSummary`. Recovering full ledger requires hitting Testing Charging endpoints (admin-only)
- ➕ Backend exposes reservation lifecycle (`reserve → commit | release`) on top of PRD's WalletRecord model. PRD-03 mentions "Send Transaction (charging)" workflow but does not model reservations
- ➕ `AlreadyApplied` idempotency indicator — must be honoured by FE to avoid double-counting on retry
- ❌ Per-record audit trail missing on production endpoints (GAP-CC-30 audit log gap is consistent with this)

## Related validation rules (V-rule notes)

- [[V-charging-insufficient-balance]] — `InsufficientBalance` when debit > available
- [[V-charging-transfer-source-destination]] — transfer-side wallet identity
- [[V-charging-no-applicable-rate]] — rate selection step before record creation

## Pages using this entity

_no pages seeded yet_ — Wallets & Balance Mgmt page (wallet ledger rows) + Contracts list (RemainingBalance column) + Charging Lab (ledger view) are listed in [[Charging Service]].

## Cross-service touches

- **Commerce → Charging:** `ContractLifecycle` Kafka event on `Pending → Active` triggers record creation (Master Wallet funding).
- **Commerce → Charging:** `Active → Expired` triggers exclusion of records from lump-sums (BR-CC-38 in PRD-03 BUSINESS_RULES).
- **Charging Lab / Testing Charging** (admin-only) surfaces per-record ledger rows via `TestingChargingLedgerEntryResponse` (paged).
- **Frontend** Wallets & Balance Mgmt page reads `GetAccountWalletsResponse` for balances + `GetContractBalanceSummariesResponse` for per-contract attribution.

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
