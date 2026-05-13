# System Gateway — DTO Dictionary

> Source: `Falcon.System.Gateway/Contracts/Shared/` + `Falcon.System.Gateway/Features/{AccountHierarchy,TestingCharging}/Models/`.

## Account Hierarchy DTOs

(Mirror of Core Gateway — likely identical shapes.)

| Name | Direction |
|---|---|
| `GetAccountHierarchyRequest` | request |
| `AccountHierarchyResponse` | response |
| `CommerceGetAccountHierarchyResponse` | internal |
| `ChargingGetAccountWalletsRequest` / `Response` | internal |
| `IdentityTenantUserResponse` | internal |
| `AccountHierarchyMapper` | static logic |

## Testing Charging DTOs

| Name | Direction | Notes |
|---|---|---|
| `TestingChargingAccountRouteRequest` | request | Carries `{ string AccountId }` from the route — shared by 5+ endpoints |
| `TestingChargingRunRouteRequest` | request | Carries `{ string RunId }` from the route |
| `TestingChargingRunsRequest` | request | Carries the query string (account filter, page, pageSize) |
| `TestingChargingCreateWhatsappBatchRequest` | request | Body forwarded to Charging unchanged |
| `TestingChargingTriggerDeliveryRouteRequest` | request | Combines `{ string RunId }` (route) + body (forwarded unchanged) |
| `TestingChargingSettings` | options | `{ bool Enabled }` — bound from `Settings:TestingCharging` |
| `JsonElement` (raw response) | response payload | Charging's response body is re-serialized as `JsonElement` and forwarded — no gateway-side schema |

## ServiceOperationResult

`ServiceOperationResult<T>` is used to wrap gateway-side errors (e.g. the `TestingChargingDisabled` 404 response). Successful forward responses pass through the raw Charging response.

## Forwarding Helper

`TestingChargingForwarding` (static):
- `IsDisabled(IOptions<TestingChargingSettings>) → bool` — checks the feature flag
- `SendDisabledAsync(HttpContext, CancellationToken)` → sends `ServiceOperationResult<JsonElement>.Failure("TestingChargingDisabled")` with HTTP 404
- `SendForwardedAsync(HttpContext, HttpResponseMessage, CancellationToken)` → uses `HttpResponseHandler.HandleResponseAsync<JsonElement>` to extract the downstream payload; on failure executes the error response; on success forwards the JSON payload with HTTP 200

This is a deliberate **BFF pattern**: the gateway is a thin envelope, no schema awareness.
