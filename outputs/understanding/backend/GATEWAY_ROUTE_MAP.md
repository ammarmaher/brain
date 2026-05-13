# Gateway Route Map

> **Critical** for frontend integration. Tells you which gateway each public URL hits, what auth policy guards it, and where it is forwarded.
> Source-of-truth: `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/appsettings.json` (production routes) + `appsettings.Development.json` (dev destinations) + `Endpoints/` + `Features/` (custom aggregations).

## Two Gateways, Two Audiences

| Gateway | Port (dev https) | Audience | Auth Policy (default) | Tenant Resolution |
|---|---:|---|---|---|
| **Core Gateway** (`Falcon.Core.Gateway`) | 7038 | **Client** users (account-scoped, multi-tenant browsers) | `ClientOnly` | Tenant id from JWT claim (`X-Tenant-Id` injected from `currentUser.TenantId`). |
| **System Gateway** (`Falcon.System.Gateway`) | 7256 | **Falcon admin** users (platform-wide, no tenant claim) | `FalconOnly` | Tenant id pulled from response bodies of downstream calls (admins are tenant-less by design). |

Both gateways:
- Run YARP as the **default 90% pass-through proxy** and FastEndpoints handlers as the **10% custom aggregation layer**.
- Inject CORS `http://localhost:4200` in dev.
- Use the same five clusters (`commerce-cluster`, `charging-cluster`, `provisioning-cluster`, `identity-cluster`, `contactgroup-cluster`).
- Apply the same path-rewrite pattern: strip the public-facing prefix (`/commerce`, `/charging`, …) and add `/api/`.

## Core Gateway — YARP Routes (Production Config)

Routes from `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/appsettings.json` (`ReverseProxy:Routes`):

| Route ID | Match Path | Order | Auth Policy | Rate Limiter | Cluster | Transforms |
|---|---|---:|---|---|---|---|
| `identity-auth-proxy` | `/identity/auth/{**remainder}` | 0 | **Anonymous** | none | `identity-cluster` | strip `/identity`, prepend `/api` |
| `identity-proxy` | `/identity/{**remainder}` | 1 | `ClientOnly` | `PerTenant` | `identity-cluster` | strip `/identity`, prepend `/api` |
| `commerce-proxy` | `/commerce/{**remainder}` | — | `ClientOnly` | `PerTenant` | `commerce-cluster` | strip `/commerce`, prepend `/api` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | — | `ClientOnly` | `PerTenant` | `provisioning-cluster` | strip `/provisioning`, prepend `/api` |
| `charging-proxy` | `/charging/{**remainder}` | — | `ClientOnly` | `PerTenant` | `charging-cluster` | strip `/charging`, prepend `/api` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | — | `ClientOnly` | `PerTenant` | `contactgroup-cluster` | strip `/contactgroup`, prepend `/api` |

`identity-auth-proxy` is listed with `Order: 0` so the anonymous auth endpoints (`/identity/auth/login`, `/identity/auth/forgot-password`, …) match **before** the authenticated `/identity/*` catch-all.

### Cluster destinations (dev)

From `appsettings.Development.json`:

| Cluster | Dev Destination |
|---|---|
| `commerce-cluster` | `http://localhost:7045` |
| `provisioning-cluster` | `http://localhost:7163` |
| `charging-cluster` | `http://localhost:7224` |
| `identity-cluster` | `http://localhost:7777` |
| `contactgroup-cluster` | `http://localhost:7300` |

All clusters share `HttpRequest.ActivityTimeout = 00:00:30`.

### Core Gateway — Custom Aggregation Endpoints

Defined in `Falcon.Core.Gateway/Features/*`, registered via `MapGatewayEndpoints()`. **All grouped under `/api/commerce/`** with the `ClientOnly` policy. These short-circuit the YARP `commerce-proxy` route for the matched paths because they need cross-service data aggregation.

| Method | Public Path | Group / Auth | Aggregates | Description |
|---|---|---|---|---|
| GET | `/api/commerce/accounts/{Id}/hierarchy` | `CommerceEndpointGroup` (`ClientOnly`) | Commerce + Identity + Charging | Calls Commerce hierarchy → if `WalletBalanceType=UserBased` calls Identity `user/by-tenant` to merge user names into nodes → if `!CanSave` calls Charging `wallet/get-account-wallets` to fetch balances. Returns unified `AccountHierarchyResponse`. |
| GET | `/api/commerce/contracts` | `CommerceEndpointGroup` (`ClientOnly`) | Commerce + Charging | Lists account contracts (account id derived from JWT tenant claim) and overlays per-contract remaining balance from Charging `wallet/contract-balance-summaries`. |
| GET | `/api/commerce/contracts/{ContractId}` | `CommerceEndpointGroup` (`ClientOnly`) | Commerce + Charging | Returns a single contract; **enforces** that `contract.AccountId == JWT.TenantId` (defense in depth). Overlays remaining balance from Charging summaries. Forces `CanEdit = false`. |

### Core Gateway — Kafka Consumer

Topic `commerce.tenant-ip-allowlist-changed.v1` (group `core-gateway-service`). Updates the Redis-backed `IpAllowlistKey(tenantId) = tenant:<id>:ipAllowlist:v1` cache used by the IP allowlist middleware.

## System Gateway — YARP Routes (Production Config)

Routes from `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/appsettings.json`:

| Route ID | Match Path | Auth Policy | Cluster | Transforms |
|---|---|---|---|---|
| `commerce-proxy` | `/commerce/{**remainder}` | `FalconOnly` | `commerce-cluster` | strip `/commerce`, prepend `/api` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | `FalconOnly` | `provisioning-cluster` | strip `/provisioning`, prepend `/api` |
| `charging-proxy` | `/charging/{**remainder}` | `FalconOnly` | `charging-cluster` | strip `/charging`, prepend `/api` |
| `identity-proxy` | `/identity/{**remainder}` | `FalconOnly` | `identity-cluster` | strip `/identity`, prepend `/api` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | `FalconOnly` | `contactgroup-cluster` | strip `/contactgroup`, prepend `/api` |

System Gateway does **not** define an anonymous `identity-auth-proxy` — falcon admins must already hold a Falcon JWT to talk to System Gateway.

### Cluster destinations (dev)

| Cluster | Dev Destination |
|---|---|
| `commerce-cluster` | `https://localhost:7045` |
| `provisioning-cluster` | `https://localhost:7163` |
| `charging-cluster` | `https://localhost:7224` |
| `identity-cluster` | `http://localhost:7777` |
| `contactgroup-cluster` | `http://localhost:7300` |

(Identity + ContactGroup stay http, the others use https in System Gateway dev — diverges from Core Gateway which is http everywhere.)

### System Gateway — Custom Aggregation Endpoints

Two endpoint groups: `CommerceEndpointGroup` (`FalconOnly`) and `TestingChargingEndpointGroup` (`FalconOnly`).

| Method | Public Path | Group | Aggregates | Description |
|---|---|---|---|---|
| GET | `/api/commerce/accounts/{Id}/hierarchy` | `CommerceEndpointGroup` | Commerce + Identity + Charging | Same shape as Core Gateway equivalent, but tenant id is pulled from the Commerce response (Falcon admins have no tenant claim). |
| GET | `/api/testing/charging/accounts` | `TestingCharging` | Commerce | Forwards to Commerce `testing/accounts{?search,page,pageSize}`. Returns 404 when `Settings:TestingCharging:Enabled` is false. |
| GET | `/api/testing/charging/accounts/{AccountId}/overview` | `TestingCharging` | Charging | Forwards to Charging `testing/charging/accounts/{id}/overview`. |
| GET | `/api/testing/charging/accounts/{AccountId}/wallets` | `TestingCharging` | Charging | Forwards to Charging `testing/charging/accounts/{id}/wallets`. |
| GET | `/api/testing/charging/accounts/{AccountId}/reservations` | `TestingCharging` | Charging | Forwards Charging reservations with query string. |
| GET | `/api/testing/charging/accounts/{AccountId}/ledger` | `TestingCharging` | Charging | Forwards Charging ledger. |
| GET | `/api/testing/charging/accounts/{AccountId}/balances` | `TestingCharging` | Charging | Forwards Charging balances. |
| GET | `/api/testing/charging/runs` | `TestingCharging` | Charging | Forwards Charging runs (paginated). |
| GET | `/api/testing/charging/runs/{RunId}` | `TestingCharging` | Charging | Forwards Charging run details. |
| POST | `/api/testing/charging/whatsapp/batches` | `TestingCharging` | Charging | Forwards Charging WhatsApp simulator batch creation. **Mutates real wallet balances** — Falcon-only enforced at policy + feature flag. |
| POST | `/api/testing/charging/whatsapp/batches/{RunId}/deliveries` | `TestingCharging` | Charging | Forwards Charging trigger deliveries. |

The Testing Charging BFF endpoints intentionally re-serialize the downstream response as `JsonElement` so the gateway does not duplicate Charging's DTO definitions.

## Frontend URL Cheat-Sheet

For frontend devs working against either gateway, the URL building rule is:

```
<gateway-base-url>/<service-prefix>/<service-internal-path>
```

Examples (Core Gateway in dev, `https://localhost:7038`):

| Frontend Call | Hits | Gets Forwarded To |
|---|---|---|
| `POST /identity/auth/login` | identity-auth-proxy (Anonymous) | `Identity Service /api/auth/login` |
| `POST /identity/auth/verify-otp` | identity-auth-proxy (Anonymous) | `Identity Service /api/auth/verify-otp` |
| `GET /identity/user/me` | identity-proxy (ClientOnly + PerTenant) | `Identity Service /api/user/me` |
| `GET /commerce/accounts/{id}/hierarchy` | **GW aggregation** | Commerce + Identity + Charging |
| `GET /commerce/contracts` | **GW aggregation** | Commerce + Charging |
| `GET /commerce/Node?nodeId=...` | commerce-proxy (ClientOnly) | `Commerce Service /api/Node?nodeId=...` |
| `POST /charging/Wallet/transfer` | charging-proxy (ClientOnly) | `Charging Service /api/Wallet/transfer` |
| `POST /contactgroup/contact-groups` | contactgroup-proxy (ClientOnly) | `Contact Group Service /api/contact-groups` |

## Production Caveats

- Cluster `Address` is empty in `appsettings.json` and **must** be set per environment (development overrides via `appsettings.Development.json` for local dev only).
- `Zitadel.Domain` is empty in both gateways' base config — must be set per environment.
- Rate limiter `RateLimiting` (Core Gateway): `PermitLimit: 100`, `WindowInSeconds: 60`, `QueueLimit: 0` — apply per-tenant via `PerTenant` policy.
- IP allowlist: enabled by default (`GatewaySettings:IpAllowlist:Enabled: true`), fail-open on Redis error (`FailOpenOnRedisError: true`).
