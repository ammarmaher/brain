# Core Gateway — Errors

> Source: `Falcon.Core.Gateway/Constants/FalconKeys.cs` — gateway-specific constants are sparse (clusters, headers, Redis keys).

## Gateway-Level Errors

The gateway doesn't define its own `FalconKeys.Error` constants in this scan. Errors at the gateway layer come from:

| Source | Mechanism |
|---|---|
| Auth failure | `Results.Unauthorized()` / `Results.Forbid()` |
| Tenant scoping failure | `Send.UnauthorizedAsync()` (missing JWT tenant claim) or `Send.ForbiddenAsync()` (cross-tenant contract access) |
| IP allowlist failure | Custom middleware returns HTTP 403 with `IpNotAllowed` error code (likely from Commerce's `FalconKeys.Error` since the gateway shares constants) |
| Rate limit exceeded | Framework HTTP 429 |
| Downstream service error | `HttpResponseHandler` extracts the upstream `ServiceOperationResult<T>.Failure` and forwards it with the original HTTP status |
| Downstream service unreachable | YARP returns HTTP 502/503/504 with default body; aggregation endpoints surface a `ServiceOperationResult<T>.Failure("ExternalServiceError")` (likely) |

## Pass-Through Error Behavior

When YARP proxies a request:
1. If the downstream service returns 200 + `ServiceOperationResult.Success`, the client gets the same.
2. If the downstream service returns 4xx/5xx + `ServiceOperationResult.Failure(errors)`, the client gets the same envelope **and the original HTTP status code** preserved.
3. If the downstream connection fails, YARP returns 502 Bad Gateway with no SOR envelope (gateway falls back to YARP default behavior).

## Aggregation Endpoint Error Behavior

`HttpResponseHandler.HandleResponseAsync<T>` returns `{ IsSuccess, ErrorResponse, Result }`:
- On `IsSuccess = false`: aggregation endpoint calls `await errorResponse.ExecuteAsync(HttpContext)` — this re-emits the downstream error to the client unchanged.
- On `IsSuccess = true`: aggregation continues to merge data and emit a 200 with the merged response.

This means cross-service errors (e.g. Identity returns 503 while gateway is aggregating hierarchy) propagate to the client as-is, with the gateway not adding any wrapping.

## Header Constants

| Constant | Value | Purpose |
|---|---|---|
| `Headers.CorrelationId` | `X-Correlation-Id` | Distributed trace id (injected by Middleware) |
| `Headers.TenantId` | `X-Tenant-Id` | Tenant id (injected from JWT before forwarding) |

## Redis Key Helpers

| Helper | Pattern |
|---|---|
| `Redis.IpAllowlistKey(tenantId)` | `tenant:<tenantId>:ipAllowlist:v1` |

The `:v1` suffix allows schema migration of the cached allowlist shape without invalidating existing keys destructively.
