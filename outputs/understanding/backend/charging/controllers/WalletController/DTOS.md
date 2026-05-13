# WalletController — DTOs

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Charging dictionary. The subset relevant to `WalletController`:

## Request DTOs

| DTO | Fields | Endpoint |
|---|---|---|
| `GetAccountWalletsRequest` | `string AccountId, List<string> OwnerIds` | `POST /get-account-wallets` |
| `DirectDebitRequest` | `string AccountId, decimal Amount, eCurrency Currency, string ReferenceType, string ReferenceId, string? Description, string? ServiceId` | `POST /debit` |
| `ReserveWalletChargeRequest` | `string AccountId, OwnerId, Channel, eCurrency Currency, ApplicationId, Priority="NONE", Destination="ANY", Unit, decimal Quantity, PolicyCode, ReferenceType, ReferenceId, ChargeKind=OcsChargeKinds.Usage, string? QuotaCode, SubService?, UsageCode? (legacy), int ReservationTtlSeconds=300` | `POST /authorize`, `POST /reserve` |
| `UpdateWalletReservationRequest` | `string ReservationId` | `POST /commit`, `POST /release` |
| `TransferBalanceRequest` | `decimal Amount, eCurrency Currency, string Description, TransferBalanceEndpointRequest Source, TransferBalanceEndpointRequest Destination` | `POST /transfer` |
| `TransferBalanceEndpointRequest` (nested) | `string WalletId, string ChannelId` | `TransferBalanceRequest.Source`, `.Destination` |

## Response DTOs

| DTO | Fields | Endpoint |
|---|---|---|
| `GetAccountWalletsResponse` | `MasterWallet, CommChannelWallets[], OwnerWallets[]` (each owner has nested `CommChannelSubWallets[]`) | `POST /get-account-wallets` |
| `GetMasterWalletResponse` (nested) | `string Id, decimal? Balance` | nested |
| `GetAccountCommChannelWalletResponse` (nested) | `string Id, string CommChannelId, decimal Balance` | nested |
| `GetAccountOwnerWalletResponse` (nested) | `string Id, string OwnerId, decimal? Balance, List<GetAccountCommChannelSubWalletResponse> CommChannelSubWallets` | nested |
| `GetAccountCommChannelSubWalletResponse` (nested) | `string CommChannelId, string walletId` *(sic — lowercase property name)*, `decimal Balance` | nested |
| `GetContractBalanceSummariesResponse` | `List<ContractBalanceSummary> Summaries` (each `{ ContractId, AvailableAmount }`) | `GET /contract-balance-summaries` |
| `DirectDebitResponse` | `string TransactionId, decimal DebitedAmount, decimal RemainingBalance, bool AlreadyApplied` | `POST /debit` |
| `ReserveWalletChargeResponse` | `string ReservationId, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, DateTime ExpiresAt, bool AlreadyApplied` | `POST /authorize`, `POST /reserve` |
| `UpdateWalletReservationResponse` | `string ReservationId, string Status, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, bool AlreadyApplied` | `POST /commit`, `POST /release` |
| `TransferBalanceResponse` | `bool Success, string Message, string TransactionId` | `POST /transfer` |

## Internal Command Types (in `Falcon.Charging.Application/Commands`)

| Command | Mapped From | Used By |
|---|---|---|
| `GetAccountWalletsQuery` | direct (no AutoMapper) | `GetAccountWallets` |
| `GetContractBalanceSummariesQuery` | direct | `GetContractBalanceSummaries` |
| `DirectDebitCommand` | `DirectDebitRequest` | `DirectDebit` |
| `ReserveWalletChargeCommand` | `ReserveWalletChargeRequest` | `Authorize`, `Reserve` |
| `CommitWalletReservationCommand` | `UpdateWalletReservationRequest` | `Commit` |
| `ReleaseWalletReservationCommand` | `UpdateWalletReservationRequest` | `Release` |
| `TransferBalanceCommand` | `TransferBalanceRequest` | `TransferBalance` |

## Field Naming Bug

`GetAccountCommChannelSubWalletResponse.walletId` has a lowercase first letter in the C# property declaration. Combined with framework camelCase policy, this likely serializes as `walletid` on the wire (one word). All other properties serialize as `walletId` (camelCase from PascalCase). Frontend should handle this gracefully — but the canonical fix is to rename to `WalletId`.
