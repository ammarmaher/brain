*** Entity Reconciliation E-wallet — Wallet ***
*** PRD: PRD-03 Contract Packaging Charging Billing · Backend service: charging · 2026-05-15 ***

# E-wallet — Wallet

> The OCS wallet — the runtime balance container that Contract.valueSar funds when a contract transitions to Active. PRD-01 (Account Management) defines the Wallet shape; PRD-03 uses Wallet as the destination of Contract funding and as the source of the nearest-expiring charging cascade. Charging service is the system of record. Backend exposes a **three-tier wallet hierarchy** (Master / Comm-Channel / Owner sub-wallet) that the PRD compresses into a single "Wallet" concept.

## PRD definition (business-conceptual)

- **PRD module:** Primary definition in PRD-01 [[01 Account Management]]; load-bearing in [[03 Contract Packaging Charging Billing]]
- **Source:** [03 ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md) — WalletRecord row references "Wallet (01)"
- **PRD fields** (compact summary — full schema in PRD-01):
  - `id`: opaque id
  - `ownerId`/`accountId`/`commChannelId`: scope identifiers
  - `balance`: decimal — derived from sum of WalletRecord rows (PRD says lump-sum of Active contract WalletRecords)
  - `currency`: `eCurrency` — SAR in current scope
- Lifecycle: Wallet is created at Account create (Master), per CommChannel (during contract activation), per Owner (during user create).

## Backend DTO mapping

- **Service:** [[Charging Service]] (primary system of record). Read-model also surfaces through [[Commerce Service]] gateway aggregations.
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/charging/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md)
- **Relevant DTOs (response side — no public Wallet CRUD; Wallets are created server-side from contract/account events):**
  - `GetAccountWalletsResponse` — `POST /Wallet/get-account-wallets` — the top-level reply
  - `GetMasterWalletResponse` (nested) — Master wallet
  - `GetAccountCommChannelWalletResponse` (nested) — per-CommChannel wallet
  - `GetAccountOwnerWalletResponse` (nested) — per-Owner wallet
  - `GetAccountCommChannelSubWalletResponse` (nested) — per-Owner+CommChannel sub-wallet
- **Relevant DTOs (mutation side — operate on wallet by id, not by entity shape):**
  - `DirectDebitRequest` — `POST /Wallet/debit` — system-priced direct debit
  - `ReserveWalletChargeRequest` — `POST /Wallet/authorize` and `/reserve`
  - `TransferBalanceRequest` — `POST /Wallet/transfer`

## Field reconciliation

### Master Wallet (PRD top-level "Wallet" ↔ `GetMasterWalletResponse`)

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `Id` (GetMasterWalletResponse) | opaque → `string` | ✅ match |
| `balance` | `Balance` (GetMasterWalletResponse) | decimal → `decimal?` (nullable) | ⚠ drift — backend balance is **nullable**. PRD models balance as always present. Likely means "balance not yet computed" or "no records yet" |
| `currency` | _not on per-wallet response_ | enum → _absent_ | ❌ missing — currency lives at the request level (`DirectDebitRequest.Currency`, `ReserveWalletChargeRequest.Currency`, `TransferBalanceRequest.Currency`), not on the wallet response DTO. FE must read currency from elsewhere (likely account context) |
| `accountId` | _not on response_ | ref → _absent_ | ⚠ drift — implicit from the `POST /get-account-wallets` request `AccountId`; not echoed in the response |

### Comm-Channel Wallet (`GetAccountCommChannelWalletResponse`)

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `Id` | opaque → `string` | ✅ match |
| `commChannelId` | `CommChannelId` | ref → `string` | ✅ match |
| `balance` | `Balance` | decimal → `decimal` (**not nullable** here, unlike Master) | ⚠ internal inconsistency — Master is `decimal?` but CommChannel is `decimal`. Same concept, different rigour |

### Owner Wallet (`GetAccountOwnerWalletResponse`)

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `Id` | opaque → `string` | ✅ match |
| `ownerId` | `OwnerId` | ref → `string` | ✅ match |
| `balance` | `Balance` | decimal → `decimal?` (nullable again) | ⚠ same nullability drift as Master |
| _PRD silent_ | `CommChannelSubWallets: List<GetAccountCommChannelSubWalletResponse>` | _no_ | ➕ extra — backend nests sub-wallets one level deeper than PRD models |

### CommChannel Sub-Wallet (`GetAccountCommChannelSubWalletResponse`) — backend-only concept

| Backend DTO field | Notes |
|---|---|
| `CommChannelId` | ref |
| `walletId` (**sic — lowercase `w`**) | ⚠ drift — backend DTO_DICTIONARY explicitly flags the lowercase-`w` casing. JSON serializer config may rescue this but FE typings must mirror exactly |
| `Balance` | non-nullable decimal |

### Mutation DTOs

| DTO | Field | Currency binding |
|---|---|---|
| `DirectDebitRequest` | `AccountId, Amount, eCurrency Currency, ReferenceType, ReferenceId, Description?, ServiceId?` | `eCurrency` — but **no `[EnumDataType]` attribute** on Charging (cross-service drift vs Commerce) |
| `ReserveWalletChargeRequest` | `AccountId, OwnerId, Channel, eCurrency Currency, ApplicationId, Priority="NONE", Destination="ANY", Unit, decimal Quantity, PolicyCode, ReferenceType, ReferenceId, ChargeKind="Usage", QuotaCode?, SubService?, UsageCode?, ReservationTtlSeconds=300` | same cross-service drift; ships with hard-coded defaults |
| `TransferBalanceRequest` | `Amount, eCurrency Currency, Description, Source: TransferBalanceEndpointRequest, Destination: TransferBalanceEndpointRequest` | same cross-service drift |
| `TransferBalanceEndpointRequest` (nested) | `WalletId, ChannelId` | identifies which wallet leg participates |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ **Structural drift (high)** — PRD models "Wallet" as one entity; backend models a three-tier hierarchy (Master → CommChannel → Owner → CommChannelSubWallet). FE must understand the wallet tree to render balances correctly
- ⚠ Nullability inconsistency — `Balance` is `decimal?` on Master + Owner but `decimal` on CommChannel + Sub-wallet
- ⚠ Casing bug — `GetAccountCommChannelSubWalletResponse.walletId` is **lowercase `w`** (per DTO_DICTIONARY explicit note). Documented; FE typings must mirror
- ⚠ Cross-service currency drift — Charging mutation DTOs bind `eCurrency` with no `[EnumDataType]` attribute, unlike Commerce. See [[V-contract-currency-enum]] for the documented drift
- ❌ `currency` field is not present on the per-wallet response — FE must read it from request context or account hierarchy response
- ❌ No public Wallet CRUD endpoints — wallets are created server-side from `WalletConfigured` Kafka events (Commerce → Charging). PRD models wallet creation lifecycle but backend exposes only the read side + mutation operations
- ➕ Backend exposes `CommChannelSubWallets` nested under Owner; PRD's compressed "Wallet" concept doesn't model this depth
- ➕ Backend exposes balance-mutation DTOs (`DirectDebitRequest`, `ReserveWalletChargeRequest`, `TransferBalanceRequest`) — PRD-03 implies these via the charging cascade but doesn't enumerate the request shapes

## Related validation rules (V-rule notes)

- [[V-charging-insufficient-balance]] — `InsufficientBalance` raised when balance below requested charge
- [[V-charging-transfer-source-destination]] — source ≠ destination wallet identity check on `TransferBalanceRequest`
- [[V-charging-no-applicable-rate]] — fires when `ReserveWalletChargeRequest` combo finds no matching contract rate
- [[V-contract-currency-enum]] — cross-service drift: Charging Currency has no `[EnumDataType]`

## Pages using this entity

_no pages seeded yet_ — Wallets & Balance Mgmt page + Organization Hierarchy CommChannels & Services tab pricing rows + Charging Lab / Testing Charging are listed in [[Charging Service]].

## Cross-service touches

- **Commerce → Charging:** `WalletConfigured` Kafka event creates wallets at account create / sub-node create. `ContractLifecycle` event triggers Master Wallet funding on contract `Pending → Active`.
- **Commerce gateway aggregations** read wallet balances and project them onto `GetAccountHierarchyResponse.WalletBalanceType` / `WalletType` for hierarchy UI.
- **Charging Lab / Testing Charging** (admin-only, gated by `Settings:TestingCharging:Enabled`) returns `TestingChargingWalletSnapshotResponse` and `TestingChargingBalancesResponse` for simulator runs.

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
