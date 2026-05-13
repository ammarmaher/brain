# Core Gateway — Overview

> Service: `Falcon.Core.Gateway`
> Repository: `C:\Falcon\Falcon\falcon-int-core-gateway-svc`
> Solution: `Falcon.Core.Gateway.slnx`

## Purpose

The **Client-facing** gateway. Serves authenticated end-user (account/tenant-scoped) traffic from the Web Platform UI. Two responsibilities:
1. **YARP reverse proxy** — strip the `/<service>` prefix, prepend `/api/`, forward to the right cluster. ~90% of traffic.
2. **Custom aggregation endpoints** (FastEndpoints) — fan-out + merge across Commerce + Identity + Charging for endpoints that need cross-service data. ~10% of traffic. All registered under `/api/commerce/*` to mirror the Commerce service URL space but with `ClientOnly` policy enforcement at the gateway.

Plus a critical **security cross-cut**:
- **IP allowlist enforcement** — Redis-cached per-tenant allowlist, refreshed on `commerce.tenant-ip-allowlist-changed.v1` Kafka events.
- **Per-tenant rate limiting** — `PerTenant` policy (`PermitLimit: 100`, `WindowInSeconds: 60`, `QueueLimit: 0`).

## Project Layout

Single project — no separate Application/Domain/Infrastructure split:

```
src/Falcon.Core.Gateway/
├── Constants/                    <- FalconKeys.cs (clusters, headers, Redis key helpers)
├── Contracts/Shared/             <- DTOs shared between gateway aggregations
├── Endpoints/Groups/             <- CommerceEndpointGroup
├── Features/                     <- AccountHierarchy/, Contracts/ (each with their own DTOs + endpoint class)
├── Http/                         <- HttpResponseHandler (envelope unwrap + error propagation)
├── Infrastructure/Auth/          <- AuthorizationPolicies, ICurrentUser
├── Messaging/Consumers/          <- TenantIpAllowlistChangedConsumer
├── Middlewares/                  <- IP allowlist middleware (likely)
├── Startup/Extensions/           <- AddGatewayServices, AddSerilogLogging, UseMiddlewarePipeline, MapGatewayEndpoints
└── Program.cs
tests/Falcon.Core.Gateway.Tests/  <- xUnit (TenantIpAllowlistChangedConsumerTests)
```

## Framework & Style

- **.NET 10**
- **YARP** (Microsoft's reverse proxy) for the 90% pass-through layer
- **FastEndpoints** for the 10% aggregation layer
- Endpoint route prefix: `/api`
- Group: `CommerceEndpointGroup` → `/api/commerce/*` with class-level `ClientOnly` policy
- HttpClient factory injected into endpoints, with named clients `FalconKeys.Clusters.{Commerce,Charging,Identity,Provisioning,ContactGroup}`

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5205` |
| https | `https://localhost:7038;http://localhost:5205` |

`launchBrowser=true` opens `openapi/v1.json` in dev — useful for testing aggregation endpoints in isolation.

## Endpoint Surface (Aggregations)

3 custom aggregation endpoints in `Features/`:
- `GetAccountHierarchyEndpoint` → `GET /api/commerce/accounts/{Id}/hierarchy`
- `GetAccountContractEndpoint` → `GET /api/commerce/contracts/{ContractId}`
- `ListAccountContractsEndpoint` → `GET /api/commerce/contracts`

All three have **`ClientOnly` policy** and all read the tenant id from `currentUser.TenantId` (JWT claim).

## YARP Pass-Through Routes

6 routes defined in `appsettings.json:ReverseProxy:Routes` — see [`GATEWAY_ROUTE_MAP.md`](../GATEWAY_ROUTE_MAP.md) for the full table.

## Kafka

| Direction | Topic | Consumer | Purpose |
|---|---|---|---|
| consume | `commerce.tenant-ip-allowlist-changed.v1` | `TenantIpAllowlistChangedConsumer` | Refresh Redis IP allowlist cache when Commerce signals a change |

Consumer group: `core-gateway-service`.

## Redis

- `GatewaySettings:Redis:ConnectionString` — populates `FalconKeys.Redis.IpAllowlistKey(tenantId) = "tenant:<id>:ipAllowlist:v1"` cache
- Instance name: `FalconCoreGateway_`

## IP Allowlist Behavior

- `GatewaySettings:IpAllowlist:Enabled: true` (default)
- `GatewaySettings:IpAllowlist:FailOpenOnRedisError: true` (default) — if Redis is down, the gateway **allows** the request rather than blocks it. Liveness-over-security tradeoff that should be reviewed for production.

## Authorization Policies

Defined in `Falcon.Core.Gateway.Infrastructure.Auth.AuthorizationPolicies`:
- `Anonymous` — no auth (used for `identity-auth-proxy` route)
- `ClientOnly` — JWT must have tenant claim (the gateway audience)
- `PerTenant` (rate limiter policy) — bucket per tenant id

## Startup Flow (`Program.cs`)

```csharp
builder.AddSerilogLogging();
builder.Services.AddGatewayServices(builder.Configuration);  // YARP + FastEndpoints + Auth + Kafka + Redis + HttpClients

app.UseMiddlewarePipeline();                                  // CORS, IP allowlist, rate limit, auth, etc.
app.UseFastEndpoints(c => {
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
app.MapGatewayEndpoints();   // YARP MapReverseProxy + any custom MapXxx calls
app.MapHealthEndpoints();
await app.RunAsync();
```

## Health

`MapHealthEndpoints()` exposes `/health` (anonymous).
