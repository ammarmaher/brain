# System Gateway — Errors

> Source: `Falcon.System.Gateway/Constants/FalconKeys.cs` — sparse, just clusters and headers.

## Gateway-Level Error Codes (Custom)

| Code | Origin | When | HTTP Status |
|---|---|---|---|
| `TestingChargingDisabled` | `TestingChargingForwarding.SendDisabledAsync` | `Settings:TestingCharging:Enabled = false` and a TestingCharging endpoint was called | 404 |
| `IdentityTenantIdMissing` | `GetAccountHierarchyEndpoint` | Commerce response has empty `TenantId` when `WalletBalanceType == UserBased` (degraded service) | 502 Bad Gateway |

These are gateway-emitted codes — they aren't in any downstream service's `FalconKeys.Error` catalog. The gateway should provide localization entries for them or the frontend must hard-code the meaning.

## Pass-Through Error Behavior

Same as Core Gateway:
1. Downstream `200 + ServiceOperationResult.Success` → client gets same.
2. Downstream `4xx/5xx + ServiceOperationResult.Failure` → client gets the **same envelope and HTTP status**.
3. Downstream unreachable → YARP returns 502 with default body (no SOR envelope).

For aggregation endpoints using `HttpResponseHandler`, downstream errors are re-emitted via `errorResponse.ExecuteAsync(HttpContext)` — preserving status and body.

## Header Constants

| Constant | Value |
|---|---|
| `Headers.CorrelationId` | `X-Correlation-Id` |
| `Headers.TenantId` | `X-Tenant-Id` |

## Cluster Constants

| Constant | Value |
|---|---|
| `Clusters.Commerce` | `commerce-cluster` |
| `Clusters.Provisioning` | `provisioning-cluster` |
| `Clusters.Charging` | `charging-cluster` |
| `Clusters.Identity` | `identity-cluster` |
| `Clusters.ContactGroup` | `contactgroup-cluster` |
