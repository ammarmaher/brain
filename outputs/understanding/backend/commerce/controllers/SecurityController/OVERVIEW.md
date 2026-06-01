# SecurityController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/SecurityController.cs` (36 lines)
> 1 endpoint — east-west IP allowlist projection feed for the Core Gateway.

## Purpose

**East-west endpoint** (service-to-service, no end-user JWT). Returns every tenant's IP allowlist for the Core Gateway to seed its enforcement cache at startup.

Source-of-truth split:
- **Commerce** *owns* the IP allowlist configuration (stored in `Settings.SecuritySettings.AllowedIps`)
- **Core Gateway** *enforces* the IP allowlist in middleware

The Gateway hits this endpoint on startup (and possibly on a periodic refresh schedule) to project all tenant allowlists into its Redis cache (`tenant:{tenantId}:ipAllowlist:v1`). Mid-life updates are propagated via the `TenantIpAllowlistChangedEvent` Kafka event — but the startup seed is the cold-start path.

## Architecture

- Primary-constructor DI (C# 12 style)
- Single handler `IGetAllIpAllowlistsHandler`
- AutoMapper maps `GetAllIpAllowlistsResult` → `GetAllIpAllowlistsResponse`

```csharp
public class SecurityController(
    IGetAllIpAllowlistsHandler _getAllIpAllowlistsHandler,
    IMapper _mapper) : ControllerBase
```

[CODE] `SecurityController.cs:19-22`

## Route Prefix

`/api/Security` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[ApiController]` only — **NO `[Authorize]`**
- Action-level: **`[AllowAnonymous]`**

[CODE] `SecurityController.cs:27-28`:
```csharp
[HttpGet("ip-allowlists")]
[AllowAnonymous]
```

**Anonymous access is intentional** — the source XML comment explicitly states "called at gateway startup, no end-user JWT available."

### Security implications

- **The endpoint is unauthenticated.** Anyone with network access to Commerce can list every tenant's IP allowlist.
- Mitigations expected at deployment level:
  - The Commerce service is on an **internal network** — not exposed to the public internet
  - The Gateway calls `commerce:7045/api/Security/ip-allowlists` over the internal Docker / K8s network
  - Network policy / firewall blocks external traffic to this endpoint
- **F-022 / security drift candidate:** verify deployment hardening. If Commerce is somehow exposed (misconfigured ingress, dev override), this endpoint leaks every tenant's IP whitelist. PRD should declare the security model explicitly.

## Collaborators

| Type | Used For |
|---|---|
| `IGetAllIpAllowlistsHandler` | Single read handler |
| `IRepository<Settings>` (inside handler) | Bulk read of all Settings with `SecuritySettings.AllowedIps != null` |

## Kafka Events

**None produced or consumed.** This endpoint is the **cold-start seed**. Mid-life sync uses `TenantIpAllowlistChangedEvent` published by `UpdateSettingsHandler` (not by this controller).

## Findings

1. **`Enabled` field is computed at query time as `AllowedIps.Count > 0`.** [CODE] `GetAllIpAllowlistsHandler.cs:36-40`:
   ```csharp
   result.Tenants[entry.OwnerId] = new IpAllowlistEntryResult
   {
       Enabled = entry.AllowedIps.Count > 0,
       AllowedIps = entry.AllowedIps
   };
   ```
   There is **no explicit `Enabled` flag persisted** in Mongo — the enable state is derived from list emptiness. This means clearing the list is the only way to disable enforcement. F-004 candidate vs PRD if PRD wants an independent toggle.

2. **AllowAnonymous on Commerce-internal endpoint** — see security discussion above.

3. **No filter / paging** — returns ALL tenants' allowlists. For a platform with thousands of tenants this is heavy. Verify gateway calls this only at startup, not on every middleware invocation.

4. **Dictionary keyed by `OwnerId`** with `StringComparer.Ordinal`. [CODE] `GetAllIpAllowlistsResponse.cs:9`:
   ```csharp
   public Dictionary<string, IpAllowlistEntryDto> Tenants { get; set; } = new(StringComparer.Ordinal);
   ```
   Tenant id matching is case-sensitive — verify all tenant id producers emit consistent casing.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
