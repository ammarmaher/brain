# System Gateway — Overview

> Service: `Falcon.System.Gateway`
> Repository: `C:\Falcon\Falcon\falcon-int-system-gateway-svc`
> Solution: `Falcon.System.Gateway.slnx`

## Purpose

The **Falcon-admin-facing** gateway. Serves authenticated platform administrators (non-tenant-scoped users — Falcon role) from the Admin Console UI. Mirror of the Core Gateway but with:
- `FalconOnly` policy as the default (instead of `ClientOnly`)
- No per-tenant rate limiting (admins have a single shared bucket — verify)
- No IP allowlist consumer (admin traffic is trusted)
- A larger aggregation surface, including the **Testing Charging BFF** (10 endpoints to drive the WhatsApp simulator from the Admin Console without exposing Charging directly to the frontend)

The tenant-id resolution model is **inverted** from Core Gateway:
- Falcon admin JWTs **do not** carry a tenant claim
- For aggregations that need a tenant id, the gateway reads it from the **downstream service's response body** (e.g. Commerce's hierarchy response includes `TenantId`)
- This is documented in `GetAccountHierarchyEndpoint`'s class summary as: *"the tenant id is taken from the Commerce response body (the node the admin requested), which Commerce already authorized via the user-type=Falcon JWT claim"*

## Project Layout

Mirror of Core Gateway:

```
src/Falcon.System.Gateway/
├── Constants/                    <- FalconKeys.cs (clusters, headers)
├── Contracts/Shared/             <- Cross-service DTOs (mirror of Core Gateway's set)
├── Endpoints/Groups/             <- CommerceEndpointGroup, TestingChargingEndpointGroup
├── Features/AccountHierarchy/    <- single endpoint
├── Features/TestingCharging/     <- 10 forwarding endpoints
├── Http/                         <- HttpResponseHandler (likely a copy of Core Gateway's)
├── Infrastructure/Auth/          <- AuthorizationPolicies (defines FalconOnly)
├── Startup/Extensions/           <- AddGatewayServices, AddSerilogLogging, UseMiddlewarePipeline, MapGatewayEndpoints
└── Program.cs
```

**No tests project** (unlike Core Gateway which has one). Test coverage is lower.

## Framework & Style

- **.NET 10**
- **YARP** for pass-through
- **FastEndpoints** for aggregation/forwarding
- Endpoint route prefix: `/api`
- Two groups: `CommerceEndpointGroup` (`/api/commerce/*`, `FalconOnly`) and `TestingChargingEndpointGroup` (`/api/testing/charging/*`, `FalconOnly`)

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5011` |
| https | `https://localhost:7256;http://localhost:5011` |

## Endpoint Surface (Aggregation + BFF)

| Endpoint | Group | Description |
|---|---|---|
| `GET /api/commerce/accounts/{Id}/hierarchy` | `CommerceEndpointGroup` | Cross-service aggregation (Commerce + Identity + Charging). Tenant id from Commerce response. |
| `GET /api/testing/charging/accounts` | `TestingChargingEndpointGroup` | BFF: forwards to Commerce `/api/testing/accounts` |
| `GET /api/testing/charging/accounts/{AccountId}/overview` | TestingCharging | BFF: forwards to Charging |
| `GET /api/testing/charging/accounts/{AccountId}/wallets` | TestingCharging | BFF: forwards to Charging |
| `GET /api/testing/charging/accounts/{AccountId}/reservations` | TestingCharging | BFF: forwards to Charging (preserves query string) |
| `GET /api/testing/charging/accounts/{AccountId}/ledger` | TestingCharging | BFF: forwards to Charging (preserves query string) |
| `GET /api/testing/charging/accounts/{AccountId}/balances` | TestingCharging | BFF: forwards to Charging |
| `GET /api/testing/charging/runs` | TestingCharging | BFF: forwards to Charging (preserves query string) |
| `GET /api/testing/charging/runs/{RunId}` | TestingCharging | BFF: forwards to Charging |
| `POST /api/testing/charging/whatsapp/batches` | TestingCharging | BFF: forwards to Charging — **mutates real wallet balances** |
| `POST /api/testing/charging/whatsapp/batches/{RunId}/deliveries` | TestingCharging | BFF: forwards to Charging — **mutates real wallet balances** |

11 custom endpoints total. The TestingCharging family uses a `TestingChargingForwarding` static helper to:
- Short-circuit with HTTP 404 + `TestingChargingDisabled` if `Settings:TestingCharging:Enabled` is false
- Re-serialize downstream responses as `JsonElement` (no DTO duplication in the gateway)

See [`../GATEWAY_ROUTE_MAP.md`](../GATEWAY_ROUTE_MAP.md) for the unified gateway view.

## YARP Pass-Through Routes

5 routes in `appsettings.json` — see [`GATEWAY_ROUTE_MAP.md`](../GATEWAY_ROUTE_MAP.md).

## Kafka

**No Kafka consumer registered** in this scan. The System Gateway doesn't subscribe to the IP allowlist topic — it doesn't need to enforce per-tenant allowlists because admins are tenant-less.

## No Redis, No Hangfire

System Gateway is the **lightest** service in the platform — no persistence, no background jobs, no async messaging. Pure HTTP routing.

## Authorization Policies

Defined in `Falcon.System.Gateway.Infrastructure.Auth.AuthorizationPolicies`:
- `FalconOnly` — JWT must carry Falcon user type claim

## Startup Flow (`Program.cs`)

```csharp
builder.AddSerilogLogging();
builder.Services.AddGatewayServices(builder.Configuration);  // YARP + FastEndpoints + Auth + HttpClients

app.UseMiddlewarePipeline();
app.UseFastEndpoints(c => {
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
app.MapGatewayEndpoints();   // YARP MapReverseProxy + custom MapXxx
app.MapHealthEndpoints();
await app.RunAsync();
```

## Health

`/health` (anonymous) via `MapHealthEndpoints()`.
