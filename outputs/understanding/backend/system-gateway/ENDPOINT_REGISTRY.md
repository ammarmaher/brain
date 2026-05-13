# System Gateway — Endpoint Registry

## Aggregation Endpoints (FastEndpoints)

### `CommerceEndpointGroup` → `/api/commerce/*` (FalconOnly)

| Method | Route | Handler | Aggregates | Notes |
|---|---|---|---|---|
| GET | `/api/commerce/accounts/{Id}/hierarchy` | `GetAccountHierarchyEndpoint` | Commerce + Identity + Charging | Tenant id taken from Commerce response (admins have no tenant claim). Optional query: `currency`, `balanceDistribution`, `walletStructure`. |

### `TestingChargingEndpointGroup` → `/api/testing/charging/*` (FalconOnly)

10 endpoints, all gated by `Settings:TestingCharging:Enabled` (return HTTP 404 + `TestingChargingDisabled` when off):

| Method | Route | Handler | Forwards To | Notes |
|---|---|---|---|---|
| GET | `/api/testing/charging/accounts` | `TestingChargingAccountsEndpoint` | Commerce `testing/accounts` | Query string preserved |
| GET | `/api/testing/charging/accounts/{AccountId}/overview` | `TestingChargingOverviewEndpoint` | Charging `testing/charging/accounts/{id}/overview` | |
| GET | `/api/testing/charging/accounts/{AccountId}/wallets` | `TestingChargingWalletsEndpoint` | Charging `testing/charging/accounts/{id}/wallets` | |
| GET | `/api/testing/charging/accounts/{AccountId}/reservations` | `TestingChargingReservationsEndpoint` | Charging `testing/charging/accounts/{id}/reservations` | Query string preserved |
| GET | `/api/testing/charging/accounts/{AccountId}/ledger` | `TestingChargingLedgerEndpoint` | Charging `testing/charging/accounts/{id}/ledger` | Query string preserved |
| GET | `/api/testing/charging/accounts/{AccountId}/balances` | `TestingChargingBalancesEndpoint` | Charging `testing/charging/accounts/{id}/balances` | |
| GET | `/api/testing/charging/runs` | `TestingChargingRunsEndpoint` | Charging `testing/charging/runs` | Query string preserved |
| GET | `/api/testing/charging/runs/{RunId}` | `TestingChargingRunDetailsEndpoint` | Charging `testing/charging/runs/{runId}` | |
| POST | `/api/testing/charging/whatsapp/batches` | `TestingChargingCreateWhatsappBatchEndpoint` | Charging `testing/charging/whatsapp/batches` | **Mutates real wallet balances** |
| POST | `/api/testing/charging/whatsapp/batches/{RunId}/deliveries` | `TestingChargingTriggerWhatsappDeliveriesEndpoint` | Charging `testing/charging/whatsapp/batches/{id}/deliveries` | **Mutates real wallet balances** |

The TestingCharging BFF uses `TestingChargingForwarding` static helper:
- `IsDisabled(settings)` — checks the feature flag
- `SendDisabledAsync(ctx, ct)` — emits `ServiceOperationResult<JsonElement>.Failure("TestingChargingDisabled")` with HTTP 404
- `SendForwardedAsync(ctx, response, ct)` — re-serializes the downstream `JsonElement` as the gateway response

This avoids duplicating Charging's TestingCharging DTOs in the gateway.

## YARP Pass-Through Routes

| Route ID | Match Path | Auth Policy | Cluster | Path Transform |
|---|---|---|---|---|
| `commerce-proxy` | `/commerce/{**remainder}` | `FalconOnly` | `commerce-cluster` | strip `/commerce`, prepend `/api` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | `FalconOnly` | `provisioning-cluster` | strip `/provisioning`, prepend `/api` |
| `charging-proxy` | `/charging/{**remainder}` | `FalconOnly` | `charging-cluster` | strip `/charging`, prepend `/api` |
| `identity-proxy` | `/identity/{**remainder}` | `FalconOnly` | `identity-cluster` | strip `/identity`, prepend `/api` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | `FalconOnly` | `contactgroup-cluster` | strip `/contactgroup`, prepend `/api` |

No `identity-auth-proxy` (Anonymous) — Falcon admins must already be authenticated to talk to the System Gateway.

## Cluster Destinations (Dev)

| Cluster | Dev Destination |
|---|---|
| commerce-cluster | `https://localhost:7045` |
| provisioning-cluster | `https://localhost:7163` |
| charging-cluster | `https://localhost:7224` |
| identity-cluster | `http://localhost:7777` |
| contactgroup-cluster | `http://localhost:7300` |

Note: Commerce, Provisioning, Charging are routed via **https** in System Gateway dev (Core Gateway uses http). Identity + ContactGroup stay http.

## Health

`/health` via `MapHealthEndpoints()` (anonymous).
