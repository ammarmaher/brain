# Charging Service — Endpoint Registry

> All controllers use `[Route("api/[controller]")]`. `[controller]` token resolves to the class name minus `Controller`. All controllers have `[Authorize]` at class level (Testing has it too).

## `WalletController` — `/api/Wallet` (8 endpoints)

See [`controllers/WalletController/`](controllers/WalletController/) for the drill-down.

| Method | Route | Action | Request DTO | Response (T in SOR) |
|---|---|---|---|---|
| POST | `/api/Wallet/get-account-wallets` | `GetAccountWallets` | `GetAccountWalletsRequest` | `GetAccountWalletsResponse` |
| GET | `/api/Wallet/contract-balance-summaries?accountId=` | `GetContractBalanceSummaries` | (query) | `GetContractBalanceSummariesResponse` |
| POST | `/api/Wallet/debit` | `DirectDebit` | `DirectDebitRequest` | `DirectDebitResponse` |
| POST | `/api/Wallet/authorize` | `Authorize` | `ReserveWalletChargeRequest` | `ReserveWalletChargeResponse` |
| POST | `/api/Wallet/reserve` | `Reserve` | `ReserveWalletChargeRequest` | `ReserveWalletChargeResponse` |
| POST | `/api/Wallet/commit` | `Commit` | `UpdateWalletReservationRequest` | `UpdateWalletReservationResponse` |
| POST | `/api/Wallet/release` | `Release` | `UpdateWalletReservationRequest` | `UpdateWalletReservationResponse` |
| POST | `/api/Wallet/transfer` | `TransferBalance` | `TransferBalanceRequest` | `TransferBalanceResponse` |

## `LookupController` — `/api/Lookup` (1 endpoint)

| Method | Route | Action | Query | Response (T) |
|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` | `Get` | (route + query) | `List<Hook<LookupValueResponse>>` |

Mirror of Commerce's `LookupController`.

## `TestKafkaController` — `/api/test/kafka` (2 endpoints, **AllowAnonymous**)

| Method | Route | Action | Request | Response | Notes |
|---|---|---|---|---|---|
| POST | `/api/test/kafka/publish` | `PublishTestEvent` | `TestKafkaPublishRequest { Message }` | `{ eventId, referenceId }` (not wrapped in SOR) | Dev/test only |
| GET | `/api/test/kafka/health` | `Health` | (none) | `"Kafka test endpoint is healthy"` | Dev/test |

Note: this controller is `[AllowAnonymous]` and bypasses the `ServiceOperationResult<T>` envelope. Should be feature-gated in production builds.

## `Testing/TestingChargingController` — `/api/testing/charging` (9 endpoints)

All endpoints require auth and are 404'd if `Settings:TestingCharging:Enabled` is false.

| Method | Route | Action | Request | Response (T) |
|---|---|---|---|---|
| GET | `/api/testing/charging/accounts/{accountId}/overview` | `GetOverview` | (route) | `TestingChargingAccountOverviewResponse` |
| GET | `/api/testing/charging/accounts/{accountId}/wallets` | `GetWallets` | (route) | `List<TestingChargingWalletSnapshotResponse>` |
| GET | `/api/testing/charging/accounts/{accountId}/reservations` | `GetReservations` | (route + `TestingChargingReservationQuery`) | `TestingChargingPagedResponse<TestingChargingReservationResponse>` |
| GET | `/api/testing/charging/accounts/{accountId}/ledger` | `GetLedger` | (route + `TestingChargingLedgerQuery`) | `TestingChargingPagedResponse<TestingChargingLedgerEntryResponse>` |
| GET | `/api/testing/charging/accounts/{accountId}/balances` | `GetBalances` | (route) | `TestingChargingBalancesResponse` |
| GET | `/api/testing/charging/runs?accountId=&page=&pageSize=` | `GetRuns` | (query) | `TestingChargingPagedResponse<TestingChargingRunResponse>` |
| GET | `/api/testing/charging/runs/{runId}` | `GetRun` | (route) | `TestingChargingRunResponse` |
| POST | `/api/testing/charging/whatsapp/batches` | `CreateWhatsappBatch` | `TestingChargingCreateWhatsappBatchRequest` | `TestingChargingRunResponse` |
| POST | `/api/testing/charging/whatsapp/batches/{runId}/deliveries` | `TriggerWhatsappDeliveries` | `TestingChargingTriggerDeliveryRequest` | `TestingChargingRunResponse` |

These endpoints **mutate real wallet balances** — the WhatsApp simulator drives end-to-end reserve/commit/release flows. Only call from a controlled test environment.

## Health Endpoint

| Method | Route | Source |
|---|---|---|
| GET | `/health` | `MapHealthChecks("/health").AllowAnonymous()` |
