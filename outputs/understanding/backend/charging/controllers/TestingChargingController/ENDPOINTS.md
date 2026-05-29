# TestingChargingController — Endpoints

> Class route prefix: `/api/testing/charging` (hardcoded — no `[controller]` token). Class-level `[Authorize]`. Class-level `IsEnabled()` gate — every action returns `404` when `Settings:TestingCharging:Enabled == false`. All success responses return `ServiceOperationResult<T>`.

## Reads (5)

| Method | Route | Action | Request | Response (T) | Service Method |
|---|---|---|---|---|---|
| GET | `/api/testing/charging/accounts/{accountId}/overview` | `GetOverview` | (route) | `TestingChargingAccountOverviewResponse` | `ITestingChargingService.GetOverviewAsync(accountId, ct)` |
| GET | `/api/testing/charging/accounts/{accountId}/wallets` | `GetWallets` | (route) | `List<TestingChargingWalletSnapshotResponse>` | `GetWalletsAsync(accountId, ct)` |
| GET | `/api/testing/charging/accounts/{accountId}/reservations` | `GetReservations` | (route + `TestingChargingReservationQuery`) | `TestingChargingPagedResponse<TestingChargingReservationResponse>` | `GetReservationsAsync(accountId, query, ct)` |
| GET | `/api/testing/charging/accounts/{accountId}/ledger` | `GetLedger` | (route + `TestingChargingLedgerQuery`) | `TestingChargingPagedResponse<TestingChargingLedgerEntryResponse>` | `GetLedgerAsync(accountId, query, ct)` |
| GET | `/api/testing/charging/accounts/{accountId}/balances` | `GetBalances` | (route) | `TestingChargingBalancesResponse` | `GetBalancesAsync(accountId, ct)` |

## Runs (2)

| Method | Route | Action | Request | Response (T) | Service Method |
|---|---|---|---|---|---|
| GET | `/api/testing/charging/runs?accountId=&page=&pageSize=` | `GetRuns` | (query) | `TestingChargingPagedResponse<TestingChargingRunResponse>` | `GetRunsAsync(accountId, request, ct)` |
| GET | `/api/testing/charging/runs/{runId}` | `GetRun` | (route) | `TestingChargingRunResponse` | `GetRunAsync(runId, ct)` |

## Simulator (2)

| Method | Route | Action | Request | Response (T) | Service Method |
|---|---|---|---|---|---|
| POST | `/api/testing/charging/whatsapp/batches` | `CreateWhatsappBatch` | `TestingChargingCreateWhatsappBatchRequest` | `TestingChargingRunResponse` | `CreateWhatsappBatchAsync(request, ct)` |
| POST | `/api/testing/charging/whatsapp/batches/{runId}/deliveries` | `TriggerWhatsappDeliveries` | (route + `TestingChargingTriggerDeliveryRequest`) | `TestingChargingRunResponse` | `TriggerWhatsappDeliveriesAsync(runId, request, ct)` |

## Frontend URLs

```
GET  /charging/testing/charging/accounts/{accountId}/overview
GET  /charging/testing/charging/accounts/{accountId}/wallets
GET  /charging/testing/charging/accounts/{accountId}/reservations?page=&pageSize=&walletId=&status=&refId=
GET  /charging/testing/charging/accounts/{accountId}/ledger?page=&pageSize=&walletId=&contractId=&refType=&refId=&ledgerType=&from=&to=
GET  /charging/testing/charging/accounts/{accountId}/balances
GET  /charging/testing/charging/runs?accountId=&page=&pageSize=
GET  /charging/testing/charging/runs/{runId}
POST /charging/testing/charging/whatsapp/batches
POST /charging/testing/charging/whatsapp/batches/{runId}/deliveries
```

The URL has `/charging/charging/` twice — once from the System/Core Gateway prefix to the service, once from the controller route. Working as intended (the second `charging` is the lab namespace inside the service).

## Query Parameter Detail

### `TestingChargingReservationQuery` (extends `TestingChargingPagedRequest`)
| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | int | 1 | clamped server-side to ≥1 |
| `pageSize` | int | 50 | clamped server-side to `[1, 200]` |
| `walletId` | string? | null | optional filter |
| `status` | string? | null | reservation status (`Active`/`Committed`/`Released`/`Expired`) |
| `refId` | string? | null | reference id substring match |

### `TestingChargingLedgerQuery` (extends `TestingChargingPagedRequest`)
| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | int | 1 | |
| `pageSize` | int | 50 | clamped `[1, 200]` |
| `walletId` | string? | null | |
| `contractId` | string? | null | |
| `refType` | string? | null | |
| `refId` | string? | null | |
| `ledgerType` | string? | null | `Reserve`/`Commit`/`Release`/`Debit`/`Credit` (verify enum) |
| `from` | DateTime? | null | Earliest `CreatedAt` |
| `to` | DateTime? | null | Latest `CreatedAt` |

### `GetRuns` query (inline — not a typed query object)
| Param | Type | Default | Notes |
|---|---|---|---|
| `accountId` | string? | null | filter to one account |
| `page` | int | 1 (server: `page <= 0 ? 1 : page`) | |
| `pageSize` | int | 50 (server: `pageSize <= 0 ? 50 : pageSize`), clamped to 100 | |

## Endpoint Count

- GET: 7
- POST: 2
- Total: 9

## 404-On-Disabled Behavior

Every action **first** calls `IsEnabled()` and returns `NotFound()` (HTTP 404, empty body) if `Settings:TestingCharging:Enabled == false`. The framework's `ServiceOperationResult` envelope is **not** used for this 404 — it is a raw `404 Not Found` with no body. Frontend handling:

- 404 from this controller's URL pattern = **feature disabled**, not URL typo
- Other endpoints' 404 = "resource not found" with envelope

## Special Routing

The wildcard `IsEnabled()` check happens **inside** each action. If you misspell the URL (e.g. `/api/testing/charrging/...`), the framework routing returns 404 **before** entering the action. From the FE side both look identical — a 404 with no body. The distinction is not visible to the consumer.
