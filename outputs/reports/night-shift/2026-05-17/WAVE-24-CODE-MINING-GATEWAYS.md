# Wave 24 — Code Mining: Falcon Gateways

**Scope:** `falcon-int-core-gateway-svc` (client-facing, https://localhost:7038) and `falcon-int-system-gateway-svc` (Falcon-admin-facing, https://localhost:7256).
**Method:** Code-only mining. Every claim has a file:line citation. Inferences are explicitly flagged.
**Both gateways:** .NET 10, FastEndpoints + YARP, Zitadel JWT Bearer, Serilog console.

---

## 1. YARP Route Configuration

YARP routes are configured **declaratively** in `appsettings.json` under the `ReverseProxy` section and loaded via `services.AddReverseProxy().LoadFromConfig(...)`. Routes are matched on the request path; both gateways use the convention `/{service}/{**remainder}` → `PathRemovePrefix:/{service}` + `PathPrefix:/api`.

### Core Gateway — Routes

`appsettings.json` — `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\appsettings.json:66-141`

| Route ID | Match path | Cluster (→ destination) | Auth policy | Rate limiter | Transform |
|---|---|---|---|---|---|
| `commerce-proxy` | `/commerce/{**remainder}` | `commerce-cluster` → `http://localhost:7045` | `ClientOnly` | `PerTenant` | strip `/commerce`, prepend `/api` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | `provisioning-cluster` → `http://localhost:7163` | `ClientOnly` | `PerTenant` | strip `/provisioning`, prepend `/api` |
| `charging-proxy` | `/charging/{**remainder}` | `charging-cluster` → `http://localhost:7224` | `ClientOnly` | `PerTenant` | strip `/charging`, prepend `/api` |
| `identity-auth-proxy` (Order=0) | `/identity/auth/{**remainder}` | `identity-cluster` → `http://localhost:7777` | `Anonymous` | — | strip `/identity`, prepend `/api` |
| `identity-proxy` (Order=1) | `/identity/{**remainder}` | `identity-cluster` → `http://localhost:7777` | `ClientOnly` | `PerTenant` | strip `/identity`, prepend `/api` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | `contactgroup-cluster` → `http://localhost:7300` | `ClientOnly` | `PerTenant` | strip `/contactgroup`, prepend `/api` |

Citations:
- Routes block: `appsettings.json:67-141`
- Clusters block (dev addresses in `appsettings.Development.json:22-59`): `appsettings.json:142-194`
- `identity-auth-proxy` is the only Anonymous route — pre-login auth (sign-in, OTP, password reset) lives behind it. `Order=0` ensures it wins over the authenticated `identity-proxy` (`Order=1`) when both patterns match (`appsettings.json:107`).

### System Gateway — Routes

`appsettings.json` — `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\appsettings.json:42-97`

| Route ID | Match path | Cluster (→ destination) | Auth policy |
|---|---|---|---|
| `commerce-proxy` | `/commerce/{**remainder}` | `commerce-cluster` → `https://localhost:7045` | `FalconOnly` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | `provisioning-cluster` → `https://localhost:7163` | `FalconOnly` |
| `charging-proxy` | `/charging/{**remainder}` | `charging-cluster` → `https://localhost:7224` | `FalconOnly` |
| `identity-proxy` | `/identity/{**remainder}` | `identity-cluster` → `http://localhost:7777` | `FalconOnly` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | `contactgroup-cluster` → `http://localhost:7300` | `FalconOnly` |

Citations:
- Routes block: `appsettings.json:43-97`
- Clusters block (dev addresses): `appsettings.Development.json:12-47`
- **No anonymous auth route in System Gateway** — Falcon admins must authenticate before any traffic flows; pre-login flows go via Core Gateway's `identity-auth-proxy`.
- **No rate limiter on System Gateway routes** — Falcon admin traffic is low-volume and trusted; `PerTenant` partitioning wouldn't make sense (admins have no tenant-id claim, see §2).

### YARP cluster timeouts

Both gateways: `HttpRequest.ActivityTimeout = 00:00:30` on every cluster (`appsettings.json:150,160,170,180,190`).

### YARP error handling

YARP forwarder errors are caught in the proxy pipeline (`WebApplicationExtensions.cs:46-79` Core, `WebApplicationExtensions.cs:43-77` System):
- `ForwarderError.RequestTimedOut` → HTTP 504 Gateway Timeout
- All other errors → HTTP 502 Bad Gateway
- Response body: `{ isSuccessful: false, errorMessages: ["Downstream service unavailable: {error}"] }`

---

## 2. Auth Policies — `ClientOnly` and `FalconOnly`

Both policies are claim-based, requiring `user-type` Zitadel-metadata claim to match the expected `eUserType` enum value.

### `ClientOnly` (Core Gateway)

Defined: `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Infrastructure\Auth\AuthorizationPolicies.cs:11`

```csharp
public const string ClientOnly = "ClientOnly";
```

Registered: `ZitadelAuthorizationExtensions.cs:21-22`

```csharp
options.AddPolicy(AuthorizationPolicies.ClientOnly, policy =>
    policy.RequireClaim(ZitadelClaimTypes.UserType, ((int)eUserType.Client).ToString()));
```

→ Requires JWT claim `user-type == "2"` (Client). Enum at `Constants/Enums.cs:13`.

### `FalconOnly` (System Gateway)

Defined: `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Infrastructure\Auth\AuthorizationPolicies.cs:11`

```csharp
public const string FalconOnly = "FalconOnly";
```

Registered: `ZitadelAuthorizationExtensions.cs:21-22`

```csharp
options.AddPolicy(AuthorizationPolicies.FalconOnly, policy =>
    policy.RequireClaim(ZitadelClaimTypes.UserType, ((int)eUserType.Falcon).ToString()));
```

→ Requires JWT claim `user-type == "1"` (Falcon). Enum at `Constants/Enums.cs:11`.

### Fallback policy

Both gateways set a fallback policy of `RequireAuthenticatedUser()` (Core `ZitadelAuthorizationExtensions.cs:17-19`, System `ZitadelAuthorizationExtensions.cs:17-19`). Any route without an explicit policy still requires an authenticated user.

### Policy → PES mapping

**[INFERRED]** Authorization policies in the gateway code are **coarse-grained** (`ClientOnly` / `FalconOnly` only). The fine-grained PES (Permission Evaluation Service / `FalconAccess.adminConsole.*`) is **NOT** enforced at the gateway — there is no PES check in any gateway file. PES is enforced downstream in Commerce / Charging / Provisioning. The gateway's job is to gate the user-type at the perimeter and forward the JWT; per-resource PES decisions happen at the resource owner.

**[CODE]** Confirmation: zero references to `FalconAccess`, `PermissionEvaluation`, or any PES-related symbol in either gateway codebase (verified by directory listing; only auth artifacts are the `ZitadelClaimTypes.UserType` checks above).

### Applied to YARP routes

Per `appsettings.json:70,82,94,118,131` (Core) and `:45,56,67,78,89` (System) — every proxied route declares its `AuthorizationPolicy`. YARP enforces it before forwarding.

### Applied to FastEndpoints aggregation

`CommerceEndpointGroup.cs:19` (Core): `ep.Options(x => x.RequireAuthorization(AuthorizationPolicies.ClientOnly))`
`CommerceEndpointGroup.cs:19` (System): `ep.Options(x => x.RequireAuthorization(AuthorizationPolicies.FalconOnly))`
`TestingChargingEndpointGroup.cs:23` (System): `ep.Options(x => x.RequireAuthorization(AuthorizationPolicies.FalconOnly))`

---

## 3. JWT Validation

Identical wiring on both gateways — Zitadel JWT Bearer using standard `AddJwtBearer()` from `Microsoft.AspNetCore.Authentication.JwtBearer`.

### Core Gateway

`ZitadelExtensions.cs:24-49` — `services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {...})`

Token validation parameters (`ZitadelExtensions.cs:31-41`):
```csharp
options.Authority = zitadelOptions.Authority;         // https discovery
options.RequireHttpsMetadata = startsWith("https");
options.MapInboundClaims = false;
options.TokenValidationParameters = new TokenValidationParameters {
    ValidateIssuer = zitadelOptions.ValidateIssuer,         // true (appsettings.json:26)
    ValidIssuer = zitadelOptions.Authority,
    ValidateAudience = zitadelOptions.ValidateAudience,     // false (appsettings.json:27)
    ValidateLifetime = zitadelOptions.ValidateLifetime,     // true (appsettings.json:28)
    ValidateIssuerSigningKey = zitadelOptions.ValidateIssuerSigningKey,  // true (appsettings.json:29)
    ClockSkew = TimeSpan.FromSeconds(zitadelOptions.ClockSkew),          // 300s (appsettings.json:30)
    RoleClaimType = zitadelOptions.RoleClaimType,           // urn:zitadel:iam:org:project:roles
    NameClaimType = ZitadelClaimTypes.PreferredUsername,
};
```

Public key fetch: `Authority` triggers ASP.NET Core to call OIDC discovery (`{Authority}/.well-known/openid-configuration`) and `jwks_uri` for signing keys. There is no custom JWKS handler — standard middleware behavior.

Backchannel override: when `Zitadel.BackchannelDomain` is configured, `options.BackchannelHttpHandler = new ZitadelBackchannelHandler(domain, isDevelopment)` rewrites the discovery URL host to an internal Docker hostname while preserving the original `Host` header for TLS validation (`ZitadelExtensions.cs:43-48`, handler at `ZitadelBackchannelHandler.cs:23-47`). In Development the handler also bypasses TLS certificate validation (`ZitadelBackchannelHandler.cs:18`).

### System Gateway

Same wiring at `ZitadelExtensions.cs:28-54` with one extra: it accepts **multiple valid issuers** (`ZitadelExtensions.cs:23-26,38-39`) — `ValidIssuers` is built from `Authority`, `Domain`, and `AuthorityDomain`. Helper `GetValidIssuers(...)` deduplicates and trims trailing slashes (`:60-74`). Rationale [INFERRED]: Falcon admin tokens may be issued by a separate Zitadel instance (e.g., internal Zitadel vs. customer-facing IdP) — accept either.

### Audience / Issuer config

| Setting | Core Gateway | System Gateway |
|---|---|---|
| `ValidateIssuer` | true (`appsettings.json:26`) | true (`appsettings.json:26`) |
| `ValidIssuers` | single — `Authority` | multiple — `Authority` ∪ `Domain` ∪ `AuthorityDomain` |
| `ValidateAudience` | false (`appsettings.json:27`) | false (`appsettings.json:27`) |
| `ValidateLifetime` | true (`appsettings.json:28`) | true |
| `ClockSkew` | 300s (5 min) | 300s |
| `RoleClaimType` | `urn:zitadel:iam:org:project:roles` | same |
| `MapInboundClaims` | false (preserve OIDC claim names verbatim) | false |

Both gateways disable audience validation — Zitadel multi-app tokens can carry audiences that vary per resource, so validation is left to downstream services (or relied upon at issuer-trust level).

### Claims transformation

`ZitadelClaimsTransformation.cs` (identical pattern on both — Core `:12-88`, System `:12-91`) is registered as `IClaimsTransformation` and runs after every successful JWT validation:

1. Guard against duplicate transformation by checking for an existing `user-type` claim (`:21-23`).
2. Read the base64-encoded Zitadel `urn:zitadel:iam:user:metadata` claim and decode three fields:
   - `user-type` → `ZitadelClaimTypes.UserType` (Core `:24`, System `:28`)
   - `tenant-id` → `ZitadelClaimTypes.TenantId` (`:25`/`:29`)
   - `node-id` → `ZitadelClaimTypes.NodeId` (`:26`/`:30`)
3. All decoded values are lowercased (`:59`/`:63`).
4. Parse `urn:zitadel:iam:org:project:roles` (a JSON object) and add each property key as a `ClaimTypes.Role` claim (Core `:28-36`, System `:33-37` via `ExtractRolesFromProjectRolesClaim`).
5. Base64 padding fix-up: Zitadel stores metadata without padding, so the code pads to length-mod-4 before decoding (`:54-56`/`:59`).

Custom claim types: `ZitadelClaimTypes.cs:22-25` (both identical) — `user-type`, `tenant-id`, `node-id`.

---

## 4. JWT Forwarding to Backend Services

Both gateways forward the JWT to backend services on **two distinct egress paths**:
- **YARP-proxied routes** (the 5-6 declarative routes from §1) — JWT travels as the original `Authorization` header because YARP, by default, forwards inbound headers untouched.
- **FastEndpoints aggregation routes** (the gateway's own `/api/commerce/...` endpoints) — JWT is injected by a `DelegatingHandler` that pulls it from `HttpContextAccessor`.

### YARP path

YARP's default behavior forwards all inbound request headers to the destination. Both `AddYarpReverseProxy(...)` builders add a request transform (`ServiceCollectionExtensions.cs:128-164` Core, `:83-116` System) that only **mutates two headers** — and does not touch `Authorization`:

- `X-Tenant-Id` (`FalconKeys.Headers.TenantId`) — first stripped from any client-supplied value, then re-injected from the JWT's `tenant-id` claim. Anti-spoofing comment at Core `:139-140`.
- `X-Correlation-Id` — stripped then re-injected from `HttpContext.Items["CorrelationId"]` (set by `CorrelationIdMiddleware`).

`Authorization` passes through unchanged.

### FastEndpoints aggregation path

Gateway endpoints call backend services via named `HttpClient`s registered with `JwtForwardingHandler` as a `DelegatingHandler`:

`ServiceCollectionExtensions.cs:166-190` (Core), `:121-144` (System):
```csharp
services.AddHttpClient(clusterName, c => c.BaseAddress = clientUrl)
        .AddHttpMessageHandler<JwtForwardingHandler>();
```

The base URL for each named client is taken from the same YARP `ReverseProxy:Clusters:{name}:Destinations:destination1:Address` setting and `/api/` is appended (Core `:178-187`, System `:130-143`) — so YARP routes and aggregation endpoints hit identical destination addresses.

`JwtForwardingHandler.cs` (identical on both — Core `:9-39`, System `:10-42`):
```csharp
var authHeader = httpContext.Request.Headers.Authorization.FirstOrDefault();
if (!string.IsNullOrEmpty(authHeader))
    request.Headers.Authorization = AuthenticationHeaderValue.Parse(authHeader);

// Forward X-Correlation-Id from CorrelationIdMiddleware
if (httpContext.Items.TryGetValue("CorrelationId", out var corrId) && corrId is string correlationId)
    request.Headers.TryAddWithoutValidation(FalconKeys.Headers.CorrelationId, correlationId);

// Forward X-Tenant-Id from JWT claims
var tenantId = httpContext.User.FindFirst(ZitadelClaimTypes.TenantId)?.Value;
if (!string.IsNullOrEmpty(tenantId))
    request.Headers.TryAddWithoutValidation(FalconKeys.Headers.TenantId, tenantId);
```

System Gateway's `AddStandardResilienceHandler()` is **also** chained onto these clients (`ServiceCollectionExtensions.cs:142`) — retries, circuit breaker. Core Gateway does **not** add resilience to its aggregation clients (verified at `ServiceCollectionExtensions.cs:184-189`).

### Tenant header anti-spoofing

Both gateways treat `X-Tenant-Id` as a derived, gateway-injected header — never trust the client value. Code pattern (YARP and JwtForwardingHandler both):
1. `Remove(FalconKeys.Headers.TenantId)` strips any client-supplied value (Core `:140`, System `:94`).
2. Re-inject from `httpContext.User.FindFirst(ZitadelClaimTypes.TenantId)?.Value`.

---

## 5. IP Allowlist (Core Gateway only) — CONFIRMS Vol 18a

The IP allowlist is enforced **only on Core Gateway** (the client-facing perimeter). System Gateway has no IP allowlist (Falcon admins are platform-wide, not tenant-scoped).

### Architecture

```
Commerce (owner of allowlist setting)
  ├── boot-time: GET /api/security/ip-allowlists  ──┐
  │                                                 ▼
  │                                  Core Gateway: IpAllowlistSeedingService (IHostedService)
  │                                          → writes to HybridCache (Redis L2)
  │
  └── on change: Kafka publish
       "commerce.tenant-ip-allowlist-changed.v1"  ──┐
                                                    ▼
                                  TenantIpAllowlistChangedConsumer (BackgroundService)
                                          → updates HybridCache

  Request flow:
  Caller → CorrelationIdMiddleware → UseAuthentication → UseAuthorization
        → TenantIpAllowlistMiddleware [extract tenantId from JWT, lookup cache,
                                       check IP against CIDRs, fail-open or 403]
        → UseRateLimiter → YARP/Endpoints
```

### File-level evidence

| Concern | File | Line |
|---|---|---|
| Enforcement middleware | `Middleware/TenantIpAllowlistMiddleware.cs` | full file `:19-230` |
| Pipeline registration | `Startup/Extensions/WebApplicationExtensions.cs` | `:35` |
| Kafka consumer (Redis projection) | `Messaging/Consumers/TenantIpAllowlistChangedConsumer.cs` | full file `:15-98` |
| Boot-time seeding service | `Services/IpAllowlistSeedingService.cs` | full file `:13-70` |
| Avro event schema | `Messaging/AvroEvents/TenantIpAllowlistChangedEvent.cs` | `:9` (inline schema JSON) |
| Cache model | `Models/TenantIpAllowlist.cs` | `:7-17` |
| Topic name | `appsettings.json` | `:58` → `"commerce.tenant-ip-allowlist-changed.v1"` **CONFIRMS Wave 18a** |
| Redis key schema | `Constants/FalconKeys.cs` | `:23` → `tenant:{tenantId}:ipAllowlist:v1` |
| Cache layer | `Startup/Extensions/ServiceCollectionExtensions.cs` | `:192-210` (Redis + `AddHybridCache`) |
| Hosted services registration | `Startup/Extensions/ServiceCollectionExtensions.cs` | `:263-269` |
| Config settings | `Configurations/GatewaySettings.cs` | `:59-66` (IpAllowlistSettings) |

### Enforcement middleware flow (`TenantIpAllowlistMiddleware.cs:28-109`)

1. **Global kill switch** at `:30-34` — if `IpAllowlist.Enabled = false`, pass through.
2. **Anonymous bypass** at `:36-40` — unauthenticated requests bypass (auth has already failed elsewhere if needed).
3. **No tenant claim → bypass** at `:42-47` — Falcon admins or service-to-service traffic without `tenant-id` are not gated by this middleware.
4. **No remote IP → log + pass** at `:49-56`.
5. **IPv6→IPv4 normalization** at `:58-59` — `IsIPv4MappedToIPv6 ? MapToIPv4() : noop`.
6. **Cache lookup** at `:61-73` — `HybridCache.GetOrCreateAsync(IpAllowlistKey(tenantId), _ => null)` returns whatever is cached; the factory deliberately returns null so a miss is detected (i.e., HybridCache is used as a read-through with explicit fallback).
7. **Cache miss fallback** at `:77-86` — call `FetchAndCacheFromCommerceAsync(...)` to hit Commerce `GET setting?ownerId={tenantId}` and cache the result.
8. **Disabled / empty allowlist** at `:89-93` — bypass.
9. **CIDR / exact-IP match** at `:95-99,198-229` — `IPNetwork.TryParse` for CIDRs, `IPAddress.Equals` for bare IPs.
10. **Block** at `:101-108` → HTTP 403 with `ServiceOperationResult<object>.Failure("IpNotAllowed")`.
11. **Fail-open / fail-closed** at `:174-193` — `FailOpenOnRedisError = true` (default, `appsettings.json:63`) means cache errors let traffic through with a warning; `false` returns HTTP 503 with `"ServiceUnavailable"`.

### Redis projection consumer (`TenantIpAllowlistChangedConsumer.cs`)

- Background service (`:19-20`) subscribes to topic `commerce.tenant-ip-allowlist-changed.v1` (`:23` reads from `settings.Value.Kafka.Topics.TenantIpAllowlistChanged`).
- Reads the **full state** from each event (`TenantIpAllowlist` with `Enabled` + `AllowedIps[]`) — no projection state machine needed; the event carries the complete allowlist after change (`:56-63`).
- Writes directly to `HybridCache` (`:65-68`) at key `tenant:{tenantId}:ipAllowlist:v1`.
- Confluent.Kafka `Consume(...)` loop with manual `Commit` on success (`:42,74`), `EnableAutoCommit = false` (`appsettings.json:51`).
- Avro deserialization via `AvroDeserializer<TenantIpAllowlistChangedEvent>` and `CachedSchemaRegistryClient` (`ServiceCollectionExtensions.cs:220-258`).
- `IsolationLevel.ReadCommitted` on consumer config (`:245`).

### Boot-time seeding service (`IpAllowlistSeedingService.cs`)

- `IHostedService.StartAsync` hits `GET commerce/security/ip-allowlists` (`:25`) returning `Dictionary<tenantId, TenantIpAllowlistEntryDto>`.
- For each entry, writes `TenantIpAllowlist` to `HybridCache` (`:44-58`).
- Avoids cold-start cache miss for every tenant when the gateway pod restarts.
- On failure, logs and returns — does **not** block startup (`:63-66`). Middleware's cold-path fallback covers any missing entries.

### Redis storage schema

| Key | `tenant:{tenantId}:ipAllowlist:v1` (`FalconKeys.cs:23`) |
|---|---|
| Value type | `TenantIpAllowlist` (`Models/TenantIpAllowlist.cs:7-17`) |
| Value fields | `bool Enabled`, `List<string> Cidrs`, `DateTime UpdatedAt` |
| Cache layer | `HybridCache` (L1 in-process + L2 Redis via `StackExchangeRedis`, `ServiceCollectionExtensions.cs:196-208`) |
| Connection string source | `GatewaySettings.Redis.ConnectionString` |
| Instance prefix | `FalconCoreGateway_` (`appsettings.json:44`) — added to all keys |

### Avro event schema (`TenantIpAllowlistChangedEvent.cs:9`)

```json
{
  "type": "record",
  "name": "TenantIpAllowlistChangedEvent",
  "namespace": "Falcon.Commerce.Events",
  "fields": [
    {"name": "EventId", "type": "string"},
    {"name": "ReferenceId", "type": "string"},
    {"name": "OccurredAt", "type": "long"},
    {"name": "TenantId", "type": "string"},
    {"name": "Enabled", "type": "boolean"},
    {"name": "AllowedIps", "type": {"type": "array", "items": "string"}}
  ]
}
```

CONFIRMS Vol 18a: Redis projection populated by `commerce.tenant-ip-allowlist-changed.v1` Kafka event. Topic, schema, consumer, middleware, fallback, and key schema all match the Wave 18a finding verbatim.

---

## 6. Rate Limiting (Core Gateway only)

### Algorithm

**Sliding-window** rate limiter (`System.Threading.RateLimiting.RateLimitPartition.GetSlidingWindowLimiter`) — **NOT token bucket**.

`ServiceCollectionExtensions.cs:93-126`:
```csharp
private static IServiceCollection AddFalconRateLimiter(
    this IServiceCollection services, IConfiguration configuration)
{
    var permitLimit     = configuration.GetValue("RateLimiting:PermitLimit",     100);
    var windowInSeconds = configuration.GetValue("RateLimiting:WindowInSeconds",  60);
    var queueLimit      = configuration.GetValue("RateLimiting:QueueLimit",        0);

    services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

        options.OnRejected = async (context, ct) =>
        {
            context.HttpContext.Response.ContentType = "application/json";
            var result = ServiceOperationResult<object>.Failure("TooManyRequests");
            await context.HttpContext.Response.WriteAsJsonAsync(result, ct);
        };

        options.AddPolicy("PerTenant", httpContext =>
        {
            var tenantId = httpContext.User.FindFirst(ZitadelClaimTypes.TenantId)?.Value ?? "anonymous";

            return RateLimitPartition.GetSlidingWindowLimiter(tenantId, _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit       = permitLimit,
                Window            = TimeSpan.FromSeconds(windowInSeconds),
                SegmentsPerWindow = 4,
                QueueLimit        = queueLimit
            });
        });
    });
}
```

### Limits (defaults — overridable per-environment)

| Field | Default | Source |
|---|---|---|
| `PermitLimit` | 100 | `appsettings.json:37` |
| `WindowInSeconds` | 60 | `appsettings.json:38` |
| `QueueLimit` | 0 | `appsettings.json:39` |
| `SegmentsPerWindow` | 4 | hardcoded at `:119` |
| Rejection status | 429 | hardcoded |
| Rejection body | `ServiceOperationResult<object>.Failure("TooManyRequests")` | `:107` |

→ Default budget: **100 requests / 60 seconds per tenant**, evaluated over 4 × 15-second segments (true sliding window).

### Partition key

`tenantId` from JWT claim `ZitadelClaimTypes.TenantId` — or the literal string `"anonymous"` when no claim is present (`:113`).
→ Each tenant gets its own bucket; unauthenticated traffic shares a single `anonymous` bucket.

### Per role/tier?

**No** — the limiter has a single tier ("PerTenant" policy with one set of limits). No role-aware or tenant-tier overrides. **[INFERRED]** Tier-aware limiting (e.g., enterprise vs. free) would need to be added via additional policies or per-tenant overrides; not present today.

### Applied to routes

Every authenticated YARP route in Core Gateway: `RateLimiterPolicy: "PerTenant"` (`appsettings.json:71,83,95,119,132`). The Anonymous `identity-auth-proxy` does **not** declare a rate limiter (`appsettings.json:104-114`). Aggregation endpoints (`/api/commerce/...`) do not call `.RequireRateLimiting(...)` and therefore inherit no rate limit.

### Pipeline position

`app.UseRateLimiter()` is the **last** middleware in `UseMiddlewarePipeline()` before YARP/endpoints (`WebApplicationExtensions.cs:36`) — runs after auth and IP allowlist so tenant identity is available.

### System Gateway

**No rate limiter.** `services.AddFalconRateLimiter()` is not called (compare `ServiceCollectionExtensions.cs:31-49` System vs. `:40-66` Core).

CONFIRMS Vol 18a: per-tenant rate limiting on Core Gateway, sliding-window, defaults 100/60s.

---

## 7. Aggregation Endpoints

Both gateways use FastEndpoints with route prefix `api` (`Program.cs:14`) and CamelCase JSON. Aggregation endpoints live alongside YARP routes — they are exposed on a path that does **not** start with `/commerce`, `/charging`, `/identity`, etc. (those are reserved for YARP), but rather `/api/commerce/...` or `/api/testing/charging/...`.

### Core Gateway — Aggregation endpoints

| Path | Method | Endpoint class | Fan-in services | Auth |
|---|---|---|---|---|
| `/api/commerce/accounts/{Id}/hierarchy` | GET | `GetAccountHierarchyEndpoint` | Commerce + Identity + Charging | `ClientOnly` |
| `/api/commerce/contracts` | GET | `ListAccountContractsEndpoint` | Commerce + Charging | `ClientOnly` |
| `/api/commerce/contracts/{ContractId}` | GET | `GetAccountContractEndpoint` | Commerce + Charging | `ClientOnly` |

Citations:
- `Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs:21-26` (route + group)
- `Features/Contracts/ListAccountContractsEndpoint.cs:21-25` (route)
- `Features/Contracts/GetAccountContractEndpoint.cs:27-30` (route)
- Group: `Endpoints/Groups/CommerceEndpointGroup.cs:16-21` — base path `commerce`, `ClientOnly`

#### `GetAccountHierarchyEndpoint` (Core) — `GetAccountHierarchyEndpoint.cs:14-110`

Account-scoped (tenant from JWT, **not** from route id — see comment `:38-42`). Fan-in:
1. Commerce: `GET accounts/hierarchy?accountId={tenantId}&currency=...&balanceDistribution=...&walletStructure=...` (`:44-49`)
2. **Conditional** Identity fetch when `WalletBalanceType == UserBased` (`:64-81`): `GET user/by-tenant?TenantId={tenantId}&ExcludeRole=4`
3. **Conditional** Charging fetch when `CanSave == false` (`:91-105`): `POST wallet/get-account-wallets` body `{ AccountId, OwnerIds[] }`
4. Map into unified `AccountHierarchyResponse` via `AccountHierarchyMapper.MapToResponse(...)` (`:107`)

Defense-in-depth comment `:67-68`: "Tenant id MUST come from the authenticated user's JWT — the gateway never trusts an upstream response body for tenant scoping."

CONFIRMS Vol 51 §1.2 service ownership: "Commerce owns nodes, Identity owns users, Charging owns wallets" — verbatim in `GetAccountHierarchyEndpoint.cs:13`.

#### `ListAccountContractsEndpoint` (Core) — `ListAccountContractsEndpoint.cs`

`:27-56`: GET commerce/contracts?accountId={tenantFromJwt} → enrich with charging contract-balance-summaries → return `ContractListResponse`. `accountId` is **never** taken from the client (`:14-15`).

#### `GetAccountContractEndpoint` (Core) — `GetAccountContractEndpoint.cs`

`:32-66`: GET commerce/contracts/{id} → reject if `contract.AccountId != currentUser.TenantId` (403 at `:53-55`) → enrich with charging balance → force `CanEdit = false` (account users are read-only — `:63`).

### System Gateway — Aggregation endpoints

| Path | Method | Endpoint class | Fan-in services | Auth |
|---|---|---|---|---|
| `/api/commerce/accounts/{Id}/hierarchy` | GET | `GetAccountHierarchyEndpoint` | Commerce + Identity + Charging | `FalconOnly` |
| `/api/testing/charging/accounts` | GET | `TestingChargingAccountsEndpoint` | Commerce | `FalconOnly` |
| `/api/testing/charging/accounts/{AccountId}/overview` | GET | `TestingChargingOverviewEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/accounts/{AccountId}/wallets` | GET | `TestingChargingWalletsEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/accounts/{AccountId}/reservations` | GET | `TestingChargingReservationsEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/accounts/{AccountId}/ledger` | GET | `TestingChargingLedgerEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/accounts/{AccountId}/balances` | GET | `TestingChargingBalancesEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/runs` | GET | `TestingChargingRunsEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/runs/{RunId}` | GET | `TestingChargingRunDetailsEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/whatsapp/batches` | POST | `TestingChargingCreateWhatsappBatchEndpoint` | Charging | `FalconOnly` |
| `/api/testing/charging/whatsapp/batches/{RunId}/deliveries` | POST | `TestingChargingTriggerWhatsappDeliveriesEndpoint` | Charging | `FalconOnly` |

Citations:
- `Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs:25-29` (route + group `CommerceEndpointGroup`)
- `Features/TestingCharging/TestingChargingEndpoints.cs:53-58,82-87,112-117,137-141,164-168,191-196,217-222,242-247,266-270,295-300`
- Group: `Endpoints/Groups/CommerceEndpointGroup.cs:16-21` — base path `commerce`, `FalconOnly`
- Group: `Endpoints/Groups/TestingChargingEndpointGroup.cs:20-25` — base path `testing/charging`, `FalconOnly`

#### `GetAccountHierarchyEndpoint` (System) — `GetAccountHierarchyEndpoint.cs:21-110`

Same fan-in as Core but with a key difference (documented in class remarks `:14-20`): Falcon admin JWTs **do not carry a tenant-id claim** (admins are platform-wide). Therefore the tenant id used to query Identity is taken from the **Commerce response body** (`commerceResult.TenantId` at `:58-64,70`) — which Commerce already authorized via the `user-type=Falcon` JWT claim. This is the **opposite** of the Core Gateway pattern. If Commerce omits the tenant id on a UserBased account, return 502 `IdentityTenantIdMissing` (`:59-64`).

CONFIRMS Vol 18a: System Gateway adds FastEndpoints aggregation at `GET /api/commerce/accounts/{Id}/hierarchy` (Commerce + Identity + Charging fan-in).

#### Testing Charging Lab BFF (`TestingChargingEndpoints.cs`)

11 endpoints — all gated by `TestingChargingSettings.Enabled` flag (`appsettings.json:36-40`, model at `TestingChargingGatewayModels.cs:5-12`). When disabled, returns 404 `TestingChargingDisabled` (`:24-30`). All endpoints forward the request to Commerce (accounts list) or Charging (everything else) **preserving the downstream response body as `JsonElement`** (`:36-45`) — the gateway acts as a thin BFF so admin-console doesn't call Charging directly and the gateway doesn't duplicate OCS DTOs. Comment at `:272-275` explains the design.

---

## 8. Response Transformation

### YARP-proxied routes

**No transformation** of the response body — YARP streams the downstream response verbatim. The only response-side mutation is YARP's own error envelope when the forwarder fails (`WebApplicationExtensions.cs:62-77` — see §1).

### FastEndpoints aggregation routes

- `GetAccountHierarchyEndpoint`: heavy re-shaping — merges three upstream responses into a unified `AccountHierarchyResponse` (`AccountHierarchyMapper.cs:134-191`). Flattens Commerce hierarchy + Identity users into a tree; joins each node/user with its Charging wallet by `OwnerId` matching (`:201,225`); builds per-channel sub-wallet rows (`:248-263`). Multiple corrective adjustments documented inline:
  - `:166-168` "OCS normalizes channel ids to uppercase; Commerce returns Mongo ids in original casing — match without casing assumptions."
  - `:202-205` Wallet id falls back to node id when a node has no wallet yet (avoids generating fake ids that create orphan OCS wallets).
  - `:227-230` Same fallback for users (use Identity user id when no wallet exists).
- `ListAccountContractsEndpoint`: enriches Commerce's contract list with Charging balance summaries — adds `RemainingBalance` per contract (`ListAccountContractsEndpoint.cs:49-53`).
- `GetAccountContractEndpoint`: same enrichment + forces `CanEdit = false` (`:60-63`).
- `TestingCharging*`: passthrough with `JsonElement` — no transformation (preserve downstream contract).

### Tenant-id and correlation header re-injection (YARP request transforms)

YARP request transforms (`ServiceCollectionExtensions.cs:135-160` Core, `:89-112` System) mutate the **outbound request** headers, not the response. See §4.

---

## 9. Error Handling

### Unhandled exceptions

Both gateways register a global exception handler:

`GlobalExceptionHandler.cs` (Core `:9-32`, System equivalent at `Startup/ExceptionHandlers/GlobalExceptionHandler.cs`):
- Catches all unhandled exceptions
- Logs with correlation id
- Returns HTTP 500 with `ServiceOperationResult<object>.Failure("InternalServerError")` (`:23-28`)

Wired up: `services.AddProblemDetails(); services.AddExceptionHandler<GlobalExceptionHandler>();` (`ServiceCollectionExtensions.cs:68-73` Core, `:54-58` System) — pipeline at `WebApplicationExtensions.cs:32` Core, `:32` System (`app.UseExceptionHandler()`).

### Downstream HTTP failures (aggregation endpoints)

`HttpResponseHandler.cs` (Core full file `:1-78`; identical pattern in System at same path):
- `HttpResponseMessage` not 2xx → map status code to a named error string (`Unauthorized`, `Forbidden`, `NotFound`, `BadRequest`, `InternalServerError`, or `ServiceError:{code}`) and re-emit with the same status code (`:46-51,64-77`).
- Response is 2xx but the deserialized `ServiceOperationResult<T>.IsSuccessful == false` → re-emit as HTTP 400 with the original `ServiceOperationResult<T>` payload (`:53-59`). This preserves the downstream's `errorMessages[]`.
- On success → unwrap `ServiceOperationResult<T>` and return to caller.

### YARP forwarder errors

See §1 — `WebApplicationExtensions.cs:46-79` Core, `:43-77` System. 504 on timeout, 502 otherwise. Custom JSON envelope `{ isSuccessful, errorMessages[] }` matching `ServiceOperationResult<T>` shape.

### Rate limit rejection

Core only — `ServiceCollectionExtensions.cs:104-109`: 429 + `ServiceOperationResult<object>.Failure("TooManyRequests")`.

### IP allowlist rejection

Core only — `TenantIpAllowlistMiddleware.cs:105-108`: 403 + `ServiceOperationResult<object>.Failure("IpNotAllowed")`. Fail-closed mode at `:188-192`: 503 + `"ServiceUnavailable"`.

### ServiceOperationResult passthrough

CONFIRMED — the gateway preserves `ServiceOperationResult<T>` end-to-end:
- YARP routes: untouched body, downstream's `ServiceOperationResult<T>` reaches the client verbatim.
- Aggregation endpoints: `HttpResponseHandler.HandleResponseAsync<T>` deserializes `ServiceOperationResult<T>`, the endpoint then re-wraps the merged result with `ServiceOperationResult<TMerged>.Success(...)` before returning (e.g., `GetAccountHierarchyEndpoint.cs:109` `Send.OkAsync(ServiceOperationResult<AccountHierarchyResponse>.Success(result), ct)`).

---

## 10. CORS

Identical wiring on both gateways. Default policy reads allowed origins from `Cors:AllowedOrigins` configuration array; falls back to `http://localhost:4200` if absent.

### Core Gateway

`ServiceCollectionExtensions.cs:75-91`:
```csharp
options.AddDefaultPolicy(policy =>
{
    var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? ["http://localhost:4200"];

    policy.WithOrigins(allowedOrigins)
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
});
```

Configured at `appsettings.json:33-35` (empty array, environment overrides expected) and `appsettings.Development.json:7-9` (`http://localhost:4200`).

Pipeline position: `WebApplicationExtensions.cs:30` — `app.UseCors()` runs after `UseForwardedHeaders` and `UseHttpsRedirection`, **before** correlation id, auth, and IP allowlist.

### System Gateway

`ServiceCollectionExtensions.cs:63-78` — identical policy. Same config keys, same pipeline position (`WebApplicationExtensions.cs:29`).

### Notes

- `AllowCredentials()` + `WithOrigins(...)` (not `AllowAnyOrigin`) — required when credentials are used; explicit origin list is mandatory.
- Both `AllowAnyMethod` and `AllowAnyHeader` — sufficient for the SPA + JWT flow.

---

## 11. Health Checks

Both gateways expose two endpoints — Kubernetes liveness and readiness:

`WebApplicationExtensions.cs:88-93` (Core), `:83-87` (System):
```csharp
app.MapHealthChecks("/health/live",  new HealthCheckOptions { Predicate = _ => false }).AllowAnonymous();
app.MapHealthChecks("/health/ready").AllowAnonymous();
```

| Endpoint | Verifies | Anonymous |
|---|---|---|
| `GET /health/live` | Process up (no checks — `Predicate = _ => false` excludes all registered checks) | yes |
| `GET /health/ready` | All registered health checks pass | yes |

Health-check **service** registration: `services.AddHealthChecks()` (Core `ServiceCollectionExtensions.cs:58`, System `:45`).

**[INFERRED]** No custom health checks are registered on either gateway — `AddHealthChecks()` is the bare call with no `.AddCheck<T>(...)` chained. So `/health/ready` currently returns `Healthy` once the process is up; it does **not** probe Redis, Kafka, or downstream cluster reachability today. Verified by absence of additional health-check registrations anywhere in either codebase.

---

## 12. Telemetry

### Serilog (both gateways)

`AddSerilogLogging` (Core `ServiceCollectionExtensions.cs:29-35`, System `:20-26`):
```csharp
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    [System only: .WriteTo.Console()]);
```

`appsettings.json:2-22` — Serilog config:
- Console sink
- Default level `Information`
- `Microsoft.AspNetCore` overridden to `Warning`
- Output template includes Timestamp, Level, SourceContext, Message, Exception

### Correlation propagation

`CorrelationIdMiddleware.cs` (both — Core `:9-32`, System `:9-33`):
- Reads `X-Correlation-Id` from inbound request, generates a GUID if absent.
- Stores in `HttpContext.Items["CorrelationId"]`.
- Adds it to the **response** via `Response.OnStarting`.
- `JwtForwardingHandler` and YARP request transforms re-inject it on **outbound** calls to downstream services (see §4) — so a single correlation id traces a request across every hop.
- `GlobalExceptionHandler` includes the correlation id in the exception log (`:15-21`).

### OpenTelemetry / Application Insights

**[CODE] Not configured.** No references to `OpenTelemetry`, `ApplicationInsights`, `Azure.Monitor`, or `Jaeger` exist anywhere in either gateway codebase. The only observability primitive is structured Serilog logging + correlation id propagation. **[INFERRED]** Distributed tracing would need to be added (likely via `OpenTelemetry.Extensions.Hosting` + an OTLP exporter); not present today.

### OpenAPI

Both gateways register OpenAPI:
- `services.AddOpenApi()` (Core `:47`, System `:37`)
- `app.MapOpenApi()` only in Development (Core `WebApplicationExtensions.cs:19-22` allows anonymous; System `:18-21`)
- Core's https launch profile sets `launchUrl: "openapi/v1.json"` (`launchSettings.json:19`)

---

## 13. Configuration

Both gateways are configured exclusively via `appsettings.json` + `appsettings.Development.json` + environment overrides. No code-side hardcoded URLs or secrets.

### Shared structure (both gateways)

| Section | Purpose | Source file |
|---|---|---|
| `Serilog` | Logging config (sinks, levels, format) | `appsettings.json:2-22` |
| `Zitadel` | OIDC authority + token validation rules | `appsettings.json:24-32` |
| `Cors:AllowedOrigins` | CORS origins | `appsettings.json:33-35` |
| `ReverseProxy:Routes` | YARP route table | `appsettings.json:67-141` (Core), `:43-97` (System) |
| `ReverseProxy:Clusters` | YARP destination addresses + per-cluster timeout | `appsettings.json:142-194` (Core), `:99-150` (System) |

### Zitadel section (both gateways — identical schema)

`appsettings.json:24-32` (both):
```json
"Zitadel": {
  "Domain": "",
  "ValidateIssuer": true,
  "ValidateAudience": false,
  "ValidateLifetime": true,
  "ValidateIssuerSigningKey": true,
  "ClockSkew": 300,
  "RoleClaimType": "urn:zitadel:iam:org:project:roles"
}
```

Dev override: `appsettings.Development.json:3-5` — `"Domain": "http://localhost:8080"`. Bound via `ZitadelOptions.cs:11` (`SectionName = "Zitadel"`).

Optional fields not in defaults: `AuthorityDomain`, `BackchannelDomain` (used in some environments — `ZitadelOptions.cs:22,28`).

### Core Gateway — extra sections

`appsettings.json:36-65`:

| Field | Type | Default | Used by |
|---|---|---|---|
| `RateLimiting.PermitLimit` | int | 100 | `ServiceCollectionExtensions.cs:96` |
| `RateLimiting.WindowInSeconds` | int | 60 | `:97` |
| `RateLimiting.QueueLimit` | int | 0 | `:98` |
| `GatewaySettings.Redis.ConnectionString` | string | "" | `:194` (fallback to in-memory cache when empty) |
| `GatewaySettings.Redis.InstanceName` | string | `FalconCoreGateway_` | `:199` |
| `GatewaySettings.Kafka.BootstrapServers` | string[] | [] | `ServiceCollectionExtensions.cs:237` |
| `GatewaySettings.Kafka.SchemaRegistryUrl` | string | "" | `:225` |
| `GatewaySettings.Kafka.Consumer.GroupId` | string | `core-gateway-service` | `:238` |
| `GatewaySettings.Kafka.Consumer.EnableAutoCommit` | bool | false | `:240` |
| `GatewaySettings.Kafka.Consumer.SessionTimeoutMs` | int | 30000 | `:241` |
| `GatewaySettings.Kafka.Consumer.HeartbeatIntervalMs` | int | 3000 | `:242` |
| `GatewaySettings.Kafka.Consumer.AllowAutoCreateTopics` | bool | false | `:243` |
| `GatewaySettings.Kafka.Consumer.MaxPollIntervalMs` | int | 300000 | `:244` |
| `GatewaySettings.Kafka.Topics.TenantIpAllowlistChanged` | string | `commerce.tenant-ip-allowlist-changed.v1` | `TenantIpAllowlistChangedConsumer.cs:23` |
| `GatewaySettings.IpAllowlist.Enabled` | bool | true | `TenantIpAllowlistMiddleware.cs:26,30` |
| `GatewaySettings.IpAllowlist.FailOpenOnRedisError` | bool | true | `:176` |

Schema: `Configurations/GatewaySettings.cs:1-66`.

### System Gateway — extra sections

`appsettings.json:36-40`:

| Field | Type | Default | Used by |
|---|---|---|---|
| `Settings.TestingCharging.Enabled` | bool | true | `TestingChargingEndpoints.cs:22` |

Schema: `Features/TestingCharging/Models/TestingChargingGatewayModels.cs:5-12`.

### YARP route fields (per-route schema)

For each route under `ReverseProxy.Routes`:
- `ClusterId` — links to a cluster definition.
- `AuthorizationPolicy` — `ClientOnly` / `FalconOnly` / `Anonymous`.
- `RateLimiterPolicy` (Core only) — `PerTenant` or omitted.
- `Order` — used only by Core's identity routes to put the anonymous `/auth` route before the authenticated catchall (`:107,120`).
- `Match.Path` — pattern.
- `Transforms` — array of `PathRemovePrefix` + `PathPrefix` typically.

### Port assignments (dev launch profiles)

| Service | HTTPS port | HTTP port |
|---|---|---|
| Core Gateway | `7038` (`launchSettings.json:17`) | `5205` |
| System Gateway | `7256` (`launchSettings.json:17`) | `5011` |
| Commerce (dev) | `7045` | (Core dev `:27`) |
| Provisioning (dev) | `7163` | (Core dev `:33`) |
| Charging (dev) | `7224` | (Core dev `:39`) |
| Identity (dev) | `7777` | (Core dev `:45`) |
| ContactGroup (dev) | `7300` | (Core dev `:51`) |
| Redis (dev) | `6379` | (`:13`) |
| Kafka (dev) | `9092` | (`:17`) |
| Schema Registry (dev) | `8085` | (`:19`) |
| Zitadel (dev) | `8080` | (`:4`) |

---

## 14. Differences — Core vs System Gateway

| Concern | Core Gateway | System Gateway |
|---|---|---|
| **Audience** | External clients (Account Owner, Node Admin, Normal User — `eUserType.Client = 2`) | Falcon internal users (System Admin, Product, Operation — `eUserType.Falcon = 1`) |
| **Default port (dev)** | 7038 (`launchSettings.json:17`) | 7256 (`launchSettings.json:17`) |
| **Auth policy** | `ClientOnly` (`AuthorizationPolicies.cs:11`) | `FalconOnly` (`AuthorizationPolicies.cs:11`) |
| **JWT valid issuers** | Single (`ZitadelExtensions.cs:34`) | Multiple — Authority ∪ Domain ∪ AuthorityDomain (`ZitadelExtensions.cs:38-39`) |
| **Anonymous routes** | `identity-auth-proxy` for pre-login (`appsettings.json:104-114`) | None |
| **Rate limiting** | `PerTenant` sliding-window 100/60s on every authenticated route | **Not configured** |
| **IP allowlist enforcement** | Yes — `TenantIpAllowlistMiddleware` (`WebApplicationExtensions.cs:35`) | **No** |
| **Kafka consumer** | `TenantIpAllowlistChangedConsumer` BackgroundService | **Not present** |
| **Boot-time seeding service** | `IpAllowlistSeedingService` IHostedService | **Not present** |
| **Redis / HybridCache** | Yes — for IP allowlist projection | **Not configured** |
| **HTTP client resilience** | None (Core `ServiceCollectionExtensions.cs:184-189`) | `AddStandardResilienceHandler()` on every aggregation client (`:142`) |
| **Tenant id source for aggregation** | JWT `tenant-id` claim (`CurrentUser.cs:18`) — single source of truth, defense in depth | **Commerce response body** — Falcon admins have no tenant claim; Commerce is authoritative per request (`GetAccountHierarchyEndpoint.cs:14-20,58-64`) |
| **`ICurrentUser` usage** | Heavy — every aggregation endpoint depends on it (`GetAccountContractEndpoint.cs:23`, `ListAccountContractsEndpoint.cs:21`, `GetAccountHierarchyEndpoint.cs:17`) | Defined in `Infrastructure/Auth/` but **not consumed by the hierarchy aggregation endpoint** (`GetAccountHierarchyEndpoint.cs:21` constructor takes only `IHttpClientFactory`) |
| **Aggregation surface** | 3 endpoints: hierarchy + 2 contract endpoints | 1 hierarchy endpoint + **11** Testing Charging Lab BFF endpoints |
| **Testing Charging Lab** | None | 11 endpoints under `/api/testing/charging/*`, gated by `Settings.TestingCharging.Enabled` flag |
| **`AddStandardResilienceHandler`** | Not used | Used on every HTTP client (`ServiceCollectionExtensions.cs:142`) |
| **NuGet dependencies** | Adds `Microsoft.Extensions.Caching.Hybrid`, `Microsoft.Extensions.Caching.StackExchangeRedis`, `Confluent.Kafka`, `Confluent.SchemaRegistry`, `Confluent.SchemaRegistry.Serdes.Avro` (`Falcon.Core.Gateway.csproj:18-22`) | Minimal — no Kafka, no Redis (`Falcon.System.Gateway.csproj`) |
| **Anti-spoofing comment** | Explicit at `ServiceCollectionExtensions.cs:139` | Implicit (`:93-95`) |
| **Identity backchannel call** | `user/by-tenant?TenantId={fromJwt}&ExcludeRole=4` (`:70`) | `user/by-tenant?TenantId={fromCommerceBody}&ExcludeRole=4` (`:70`) |
| **`OpenApi` access in Dev** | Allows anonymous (`WebApplicationExtensions.cs:21`) | No `AllowAnonymous` on MapOpenApi (`:20`) |
| **Routes file** | 6 routes (commerce, provisioning, charging, identity-auth, identity, contactgroup) | 5 routes (commerce, provisioning, charging, identity, contactgroup) — no identity-auth |

### Architectural rationale (cross-referenced in code comments)

Why the gateway split matters (`System.Gateway/Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs:14-20`):

> "The System Gateway serves Falcon admin users whose JWTs do not carry a tenant-id claim (admins are platform-wide). The tenant id used to query Identity is therefore taken from the Commerce response body (the node the admin requested), which Commerce already authorized via the user-type=Falcon JWT claim. This is the opposite of the Core Gateway pattern, which derives tenant id from the JWT because client users are tenant-scoped."

That single comment captures the design intent: **two gateways with mirror-image tenant-scoping rules**. Same fan-in topology, opposite source-of-truth for tenant identity.

---

## Appendix A — File-and-line index by concern

### Pipeline middleware order (Core Gateway, `WebApplicationExtensions.cs:17-39`)

1. `:21` `MapOpenApi().AllowAnonymous()` (Dev only)
2. `:24` `UseForwardedHeaders` (XForwardedFor + XForwardedProto)
3. `:29` `UseHttpsRedirection`
4. `:30` `UseCors`
5. `:31` `UseMiddleware<CorrelationIdMiddleware>`
6. `:32` `UseExceptionHandler`
7. `:33` `UseAuthentication`
8. `:34` `UseAuthorization`
9. `:35` `UseMiddleware<TenantIpAllowlistMiddleware>` **← Core only**
10. `:36` `UseRateLimiter` **← Core only**
11. `Program.cs:12` `UseFastEndpoints` (route prefix `api`)
12. `Program.cs:17` `MapGatewayEndpoints` (YARP)
13. `Program.cs:18` `MapHealthEndpoints`

### Pipeline middleware order (System Gateway, `WebApplicationExtensions.cs:16-36`)

1. `:20` `MapOpenApi` (Dev only, no AllowAnonymous)
2. `:23` `UseForwardedHeaders`
3. `:28` `UseHttpsRedirection`
4. `:29` `UseCors`
5. `:31` `UseMiddleware<CorrelationIdMiddleware>`
6. `:32` `UseExceptionHandler`
7. `:34` `UseAuthentication`
8. `:35` `UseAuthorization`
9. `Program.cs:12` `UseFastEndpoints` (route prefix `api`)
10. `Program.cs:17` `MapGatewayEndpoints` (YARP)
11. `Program.cs:18` `MapHealthEndpoints`

### Quick path map

| Logical concern | Core Gateway file | System Gateway file |
|---|---|---|
| App entry | `Program.cs` | `Program.cs` |
| DI registrations | `Startup/Extensions/ServiceCollectionExtensions.cs` | `Startup/Extensions/ServiceCollectionExtensions.cs` |
| Pipeline + endpoint map | `Startup/Extensions/WebApplicationExtensions.cs` | `Startup/Extensions/WebApplicationExtensions.cs` |
| Auth (JWT) | `Infrastructure/Auth/ZitadelExtensions.cs` | `Infrastructure/Auth/ZitadelExtensions.cs` |
| Auth (Policies) | `Infrastructure/Auth/ZitadelAuthorizationExtensions.cs` | `Infrastructure/Auth/ZitadelAuthorizationExtensions.cs` |
| Policy names | `Infrastructure/Auth/AuthorizationPolicies.cs` | `Infrastructure/Auth/AuthorizationPolicies.cs` |
| Claims transform | `Infrastructure/Auth/ZitadelClaimsTransformation.cs` | `Infrastructure/Auth/ZitadelClaimsTransformation.cs` |
| Custom claim types | `Infrastructure/Auth/ZitadelClaimTypes.cs` | `Infrastructure/Auth/ZitadelClaimTypes.cs` |
| Current user | `Infrastructure/Auth/CurrentUser.cs` + `ICurrentUser.cs` | same |
| JWT forwarding | `Http/JwtForwardingHandler.cs` | `Http/JwtForwardingHandler.cs` |
| Downstream HTTP unwrap | `Http/HttpResponseHandler.cs` | `Http/HttpResponseHandler.cs` |
| Correlation id | `Startup/Middleware/CorrelationIdMiddleware.cs` | `Startup/Middleware/CorrelationIdMiddleware.cs` |
| Global exceptions | `Startup/ExceptionHandlers/GlobalExceptionHandler.cs` | `Startup/ExceptionHandlers/GlobalExceptionHandler.cs` |
| IP allowlist enforcement | `Middleware/TenantIpAllowlistMiddleware.cs` | — |
| Kafka allowlist consumer | `Messaging/Consumers/TenantIpAllowlistChangedConsumer.cs` | — |
| Allowlist seed | `Services/IpAllowlistSeedingService.cs` | — |
| Allowlist Avro schema | `Messaging/AvroEvents/TenantIpAllowlistChangedEvent.cs` | — |
| Allowlist model | `Models/TenantIpAllowlist.cs` | — |
| Hierarchy aggregation | `Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs` | `Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs` |
| Hierarchy mapper | `Features/AccountHierarchy/AccountHierarchyMapper.cs` | `Features/AccountHierarchy/AccountHierarchyMapper.cs` |
| Contract list/details | `Features/Contracts/{List,Get}AccountContract*.cs` | — |
| Testing Charging BFF | — | `Features/TestingCharging/TestingChargingEndpoints.cs` |
| Endpoint groups | `Endpoints/Groups/CommerceEndpointGroup.cs` | `Endpoints/Groups/{CommerceEndpointGroup,TestingChargingEndpointGroup}.cs` |
| Config schema | `Configurations/GatewaySettings.cs` | (inline — `Features/TestingCharging/Models/TestingChargingGatewayModels.cs:5-12`) |
| Constants | `Constants/{FalconKeys,Enums}.cs` | `Constants/{FalconKeys,Enums}.cs` |
| Shared response wrapper | `Contracts/Shared/ServiceOperationResult.cs` | `Contracts/Shared/ServiceOperationResult.cs` |
| Dev appsettings | `appsettings.Development.json` | `appsettings.Development.json` |
| Prod appsettings | `appsettings.json` | `appsettings.json` |
| Launch | `Properties/launchSettings.json` | `Properties/launchSettings.json` |
| Docker | `Dockerfile` | `Dockerfile` |

---

## Confirmations vs. prior findings

- **Vol 18a — Redis projection + Kafka topic** — CONFIRMED. Topic `commerce.tenant-ip-allowlist-changed.v1` (`appsettings.json:58`), full enforcement chain in `TenantIpAllowlistMiddleware` + `TenantIpAllowlistChangedConsumer` + `IpAllowlistSeedingService`.
- **Vol 18a — Per-tenant rate limiting on Core Gateway** — CONFIRMED. Sliding-window, `PerTenant` partition keyed on JWT `tenant-id`, default 100/60s.
- **Vol 18a — System Gateway FastEndpoints aggregation `/api/commerce/accounts/{Id}/hierarchy` (Commerce + Identity + Charging)** — CONFIRMED at `Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs:25-110`.
- **Vol 51 §1.2 service ownership "Commerce owns nodes, Identity owns users, Charging owns wallets"** — CONFIRMED literally in `GetAccountHierarchyEndpoint.cs:13` summary comment, and structurally in the aggregation fan-in.

---

## Open gaps / out-of-band observations

- **No observability beyond logs** — neither gateway emits OpenTelemetry traces or metrics. Application Insights is not wired. Operationally this means a request crossing 3 services has a correlation id in logs but no distributed trace fan-out.
- **Health-check coverage** — `/health/ready` does not probe Redis, Kafka, or downstream YARP clusters (no `.AddCheck<T>` registrations). A degraded Redis would not flip readiness.
- **Resilience asymmetry** — System Gateway adds `AddStandardResilienceHandler()` to its aggregation HTTP clients (retries, circuit breaker); Core Gateway does not. Inconsistent failure behavior on the two gateways.
- **PES is not enforced at the gateway** — only user-type (`ClientOnly` / `FalconOnly`). Fine-grained `FalconAccess.adminConsole.*` checks live downstream.
- **Tenant rate limit has no role/tier differentiation** — single 100/60s budget for every tenant.
- **`identity-auth-proxy` rate-limit gap** — Core Gateway's anonymous `/identity/auth/*` route has **no rate limit**. Login / OTP / password-reset endpoints are unthrottled at the gateway. **[INFERRED]** Identity service may have its own throttling for these.
