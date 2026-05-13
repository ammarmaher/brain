# Charging Service — DTO Dictionary

> Source: `Falcon.Charging.Contracts/Models/{RequestsDtos,ResponseDtos}/`. Testing DTOs live in `Falcon.Charging.Application/TestingCharging/Models/`.

## Cross-Cutting Types

| Type | Shape | Notes |
|---|---|---|
| `ServiceOperationResult<T>` | `struct { bool IsSuccessful; List<string> ErrorMessages; T? Result; }` | Standard wrapper (own implementation — same shape as Commerce's). |
| `Hook<T>` | `class { T Value; string Name; }` | Lookup table responses. |
| `MultiLanguage` | `class { string En; string Ar; }` (`Falcon.Charging.Contracts.Models.Shared`) | For multi-language fields. Implements `ITranslate` from `Falcon.Charging.Domain.Interfaces`. |
| `IUnitOfWorkTrigger` | marker interface | Used by `UnitOfWorkFilter` to commit Mongo + Kafka outbox atomically. |

## Request DTOs

| Name | Used By | Fields |
|---|---|---|
| `GetAccountWalletsRequest` | `POST /Wallet/get-account-wallets` | `string AccountId, List<string> OwnerIds` |
| `DirectDebitRequest` | `POST /Wallet/debit` | `string AccountId, decimal Amount, eCurrency Currency, string ReferenceType, string ReferenceId, string? Description, string? ServiceId` |
| `ReserveWalletChargeRequest` | `POST /Wallet/authorize`, `POST /Wallet/reserve` | `string AccountId, OwnerId, Channel, eCurrency Currency, ApplicationId, Priority="NONE", Destination="ANY", Unit, decimal Quantity, PolicyCode, ReferenceType, ReferenceId, ChargeKind=OcsChargeKinds.Usage, string? QuotaCode, SubService?, UsageCode? (legacy alias for QuotaCode), int ReservationTtlSeconds=300` |
| `UpdateWalletReservationRequest` | `POST /Wallet/commit`, `POST /Wallet/release` | `string ReservationId` |
| `TransferBalanceRequest` | `POST /Wallet/transfer` | `decimal Amount, eCurrency Currency, string Description, TransferBalanceEndpointRequest Source, TransferBalanceEndpointRequest Destination` |
| `TransferBalanceEndpointRequest` (nested) | both sides of transfer | `string WalletId, string ChannelId` |

## Response DTOs

| Name | Used By | Fields |
|---|---|---|
| `GetAccountWalletsResponse` | `GET wallets` | `GetMasterWalletResponse MasterWallet, List<GetAccountCommChannelWalletResponse> CommChannelWallets, List<GetAccountOwnerWalletResponse> OwnerWallets` |
| `GetMasterWalletResponse` | nested | `string Id, decimal? Balance` |
| `GetAccountCommChannelWalletResponse` | nested | `string Id, string CommChannelId, decimal Balance` |
| `GetAccountOwnerWalletResponse` | nested | `string Id, string OwnerId, decimal? Balance, List<GetAccountCommChannelSubWalletResponse> CommChannelSubWallets` |
| `GetAccountCommChannelSubWalletResponse` | nested | `string CommChannelId, string walletId` *(sic — lowercase `w`)*, `decimal Balance` |
| `GetContractBalanceSummariesResponse` | `GET contract-balance-summaries` | `List<ContractBalanceSummary> Summaries` (each `{ ContractId, AvailableAmount, ... }`) |
| `DirectDebitResponse` | `POST /debit` | `string TransactionId, decimal DebitedAmount, decimal RemainingBalance, bool AlreadyApplied` (idempotent retry indicator) |
| `ReserveWalletChargeResponse` | `POST /authorize`, `POST /reserve` | `string ReservationId, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, DateTime ExpiresAt, bool AlreadyApplied` |
| `UpdateWalletReservationResponse` | `POST /commit`, `POST /release` | `string ReservationId, string Status, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, bool AlreadyApplied` |
| `TransferBalanceResponse` | `POST /transfer` | `bool Success, string Message, string TransactionId` |
| `LookupValueResponse` | `GET /Lookup/{id}` | (Hook-wrapped key/value/name) |
| `ExistResponse` | (unused in Charging endpoints) | `bool Exists` |

## Testing Charging DTOs (`Application/TestingCharging/Models/`)

| Name | Direction | Notes |
|---|---|---|
| `TestingChargingAccountOverviewResponse` | response | Account-level OCS state summary |
| `TestingChargingWalletSnapshotResponse` | response | Per-wallet snapshot used by Charging Lab UI |
| `TestingChargingReservationQuery` | request | Filtering for reservations list |
| `TestingChargingReservationResponse` | response | Reservation row |
| `TestingChargingLedgerQuery` | request | Filtering for ledger list |
| `TestingChargingLedgerEntryResponse` | response | Ledger entry row |
| `TestingChargingBalancesResponse` | response | Balances rollup |
| `TestingChargingPagedRequest` | request | `int Page, int PageSize` |
| `TestingChargingPagedResponse<T>` | response | Generic paged wrapper |
| `TestingChargingRunResponse` | response | Simulator run state |
| `TestingChargingCreateWhatsappBatchRequest` | request | Inputs for new WhatsApp run (batch size, target account, etc.) |
| `TestingChargingTriggerDeliveryRequest` | request | Inputs to push delivery confirmation events |

## Domain Enums

`eCurrency` (in `Falcon.Charging.Domain.Constants`). Status/reservation states are strings (`Status` field uses string values like `"Active"`, `"Committed"`, `"Released"`, `"Expired"` — confirm against `OcsReservationStatus` constants in `FalconValues`).

## `OcsChargeKinds`

A constants class (likely under `Falcon.Charging.Domain.Constants.OcsChargeKinds`) with `Usage`, possibly `Subscription`, `Recurring` values. Used as default for `ChargeKind` in `ReserveWalletChargeRequest`.

## Multi-Language Compliance

`MultiLanguage` is defined and available; not consumed by any of the user-facing Charging DTOs we've seen (mostly numeric/transactional). Lookup endpoint may return multilingual `LookupValueResponse.Name` — verify when needed.
