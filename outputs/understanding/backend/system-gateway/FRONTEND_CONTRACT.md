# System Gateway — Frontend Contract

## Audience

Used by the **Admin Console UI** (Falcon administrative tooling — `apps/admin-console` and `apps/management-console` in the Angular workspace). Falcon admin users authenticate via Identity (Core Gateway path `/identity/auth/*`), then use the **System Gateway** for subsequent admin operations.

## URL Convention

```
<system-gateway>/<service-prefix>/<service-internal-path>
```

| Service Prefix | Routes To | Auth |
|---|---|---|
| `/commerce/*` | Commerce `/api/*` | FalconOnly |
| `/charging/*` | Charging `/api/*` | FalconOnly |
| `/provisioning/*` | Provisioning `/api/*` | FalconOnly |
| `/identity/*` | Identity `/api/*` | FalconOnly |
| `/contactgroup/*` | Contact Group `/api/*` | FalconOnly |

Plus the **aggregation endpoints**:
- `GET /api/commerce/accounts/{Id}/hierarchy`
- `GET /api/testing/charging/...` (10 TestingCharging BFF endpoints)

## Authentication

`Authorization: Bearer <jwt>` required for everything.

Admin JWTs come from Identity — same login flow as client users, but with Falcon user-type claim. Use:
- `POST /identity/auth/login` (through **Core Gateway** at `<core-gateway>/identity/auth/login`, since System Gateway has no Anonymous auth-proxy route)
- Then talk to System Gateway with the resulting access token

## Aggregations

| Endpoint | Use For |
|---|---|
| `GET /commerce/accounts/{accountId}/hierarchy?currency=&balanceDistribution=&walletStructure=` | Admin Console hierarchy view — pass the target tenant's account id as `{accountId}`. The gateway pulls Commerce hierarchy → enriches with Identity users → overlays Charging balances. |

## Testing Charging BFF (Charging Lab)

These endpoints power the QA "Charging Lab" feature in the Admin Console. They forward to Charging's `/api/testing/charging/*` and Commerce's `/api/testing/accounts` while keeping the Admin Console isolated from downstream URLs.

```
GET  /testing/charging/accounts?search=&page=&pageSize=
GET  /testing/charging/accounts/{accountId}/overview
GET  /testing/charging/accounts/{accountId}/wallets
GET  /testing/charging/accounts/{accountId}/reservations?... (paged + filters)
GET  /testing/charging/accounts/{accountId}/ledger?... (paged + filters)
GET  /testing/charging/accounts/{accountId}/balances
GET  /testing/charging/runs?accountId=&page=&pageSize=
GET  /testing/charging/runs/{runId}
POST /testing/charging/whatsapp/batches
POST /testing/charging/whatsapp/batches/{runId}/deliveries
```

**Important warning**: the POST endpoints **mutate real wallet balances**. They drive a WhatsApp simulator that exercises reserve/commit/release end-to-end. Use only in controlled test environments.

When `Settings:TestingCharging:Enabled = false`, all 10 endpoints return HTTP 404 with `errorMessages: ["TestingChargingDisabled"]` (or the localized message). Frontend should treat 404 + `TestingChargingDisabled` as "feature off, hide the Charging Lab section".

## Response Wrapper

All endpoints return `ServiceOperationResult<T>` (camelCase JSON). The TestingCharging BFF responses use `ServiceOperationResult<JsonElement>` — frontend gets the raw Charging payload inside `result`.

## Tenant ID Handling

Admin JWTs have **no tenant claim**. So:
- For passthrough routes (`/commerce/*`, etc.): the downstream service must accept admin requests without `X-Tenant-Id`. Most Falcon services do (Commerce check is `Authorize(Policy=FalconOnly)` on admin actions; client-tenant-scoping is bypassed).
- For aggregations: the gateway reads tenant id from the downstream response (e.g. Commerce's `GetAccountHierarchyResponse.TenantId`). Frontend doesn't need to do anything special.

For Admin Console UIs that operate on a **selected target tenant**, the frontend should pass the tenant's account id in URL paths or query params (e.g. `/commerce/accounts/{accountId}/hierarchy`).

## Status Codes

- Same propagation behavior as Core Gateway.
- `502 Bad Gateway + IdentityTenantIdMissing` is gateway-emitted; means Commerce returned an incomplete response — surfaceable as a service-degradation message.

## CORS

`Cors:AllowedOrigins` in config (defaults to `http://localhost:4200` in dev).

## Rate Limiting

No `RateLimiting` config in System Gateway's `appsettings.json` — admin actions appear to be unrate-limited. Verify against production deployments.

## OpenAPI

In dev: `https://localhost:7256/openapi/v1.json`. Aggregation endpoints are listed; YARP routes are not in the OpenAPI doc.

## Frontend Routing Strategy

The Angular `apps/admin-console` and `apps/management-console` typically:
1. Authenticate via Core Gateway's `/identity/auth/login` (because System Gateway has no Anonymous auth)
2. Switch base URL to System Gateway for subsequent admin operations
3. May still call some Core Gateway endpoints (e.g. `/identity/auth/refresh-token`) for token refresh

The Angular environment files (`environments/environment.*.ts`) should define both `coreGatewayUrl` and `systemGatewayUrl` to support this dual-base setup.
