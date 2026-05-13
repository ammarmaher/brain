# WalletController — Endpoints

> Class route prefix: `/api/Wallet` (via `[Route("api/[controller]")]`). All endpoints inherit `[Authorize]` from class. All endpoints return `ServiceOperationResult<T>`.

| Method | Route | Action | Request DTO | Response (T) | Handler |
|---|---|---|---|---|---|
| POST | `/api/Wallet/get-account-wallets` | `GetAccountWallets` | `GetAccountWalletsRequest { AccountId, OwnerIds[] }` | `GetAccountWalletsResponse` | `IGetAccountWalletsHandler.ExecuteAsync(new GetAccountWalletsQuery { AccountId, OwnerIds })` |
| GET | `/api/Wallet/contract-balance-summaries?accountId=` | `GetContractBalanceSummaries` | (query) | `GetContractBalanceSummariesResponse` | `IGetContractBalanceSummariesHandler.ExecuteAsync(new GetContractBalanceSummariesQuery { AccountId })` |
| POST | `/api/Wallet/debit` | `DirectDebit` | `DirectDebitRequest` | `DirectDebitResponse { TransactionId, DebitedAmount, RemainingBalance, AlreadyApplied }` | `IDirectDebitHandler.ExecuteAsync(_mapper.Map<DirectDebitCommand>(request))` |
| POST | `/api/Wallet/authorize` | `Authorize` | `ReserveWalletChargeRequest` | `ReserveWalletChargeResponse { ReservationId, RatedAmount, QuotaUnits, BilledUnits, ExpiresAt, AlreadyApplied }` | `IReserveWalletChargeHandler.ExecuteAsync(_mapper.Map<ReserveWalletChargeCommand>(request))` |
| POST | `/api/Wallet/reserve` | `Reserve` | `ReserveWalletChargeRequest` | `ReserveWalletChargeResponse` | Same handler as `Authorize` |
| POST | `/api/Wallet/commit` | `Commit` | `UpdateWalletReservationRequest { ReservationId }` | `UpdateWalletReservationResponse { ReservationId, Status, RatedAmount, QuotaUnits, BilledUnits, AlreadyApplied }` | `ICommitWalletReservationHandler.ExecuteAsync(_mapper.Map<CommitWalletReservationCommand>(request))` |
| POST | `/api/Wallet/release` | `Release` | `UpdateWalletReservationRequest { ReservationId }` | `UpdateWalletReservationResponse` | `IReleaseWalletReservationHandler.ExecuteAsync(_mapper.Map<ReleaseWalletReservationCommand>(request))` |
| POST | `/api/Wallet/transfer` | `TransferBalance` | `TransferBalanceRequest` | `TransferBalanceResponse { Success, Message, TransactionId }` | `ITransferBalanceHandler.ExecuteAsync(_mapper.Map<TransferBalanceCommand>(request))` |

## Verb Convention

The controller uses **kebab-case** on action paths even though the class name and route token are PascalCase (`Wallet`). Frontend URLs:

```
POST /charging/Wallet/get-account-wallets
GET  /charging/Wallet/contract-balance-summaries
POST /charging/Wallet/debit
POST /charging/Wallet/authorize
POST /charging/Wallet/reserve
POST /charging/Wallet/commit
POST /charging/Wallet/release
POST /charging/Wallet/transfer
```

## Endpoint Count

- GET: 1
- POST: 7
- Total: 8
