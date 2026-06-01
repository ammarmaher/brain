# SettingController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/SettingController.cs` (75 lines)
> 4 endpoints — owns the Settings tab data plane (Wave 14 Settings tab consumer).

## Purpose

Owns the **tenant `Settings` document** persistence + read API. The Settings document holds three independent sub-documents:

- `SecuritySettings` — `PasswordSecurityLevel` enum + `AllowedIps` list (IP allowlist source of truth — Core Gateway enforces, Commerce owns)
- `QuotaSettings` — `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevels`, `BalanceTransferLimitPercentage` (Falcon-only writes)
- `WalletSettings` — `Currency`, `WalletBalanceType`, `WalletType` (set-once via `POST wallets`; cannot be re-configured)

Frontend consumer: **Wave 14 Settings tab** — see [MEMORY] `project_settings_tab_standalone_wave14_2026_05_17`.

## Architecture

- Constructor injection (legacy style, 5 dependencies)
- AutoMapper used on Update + ConfigureWallet for request → command, result → response
- `GetWallet` bypasses mapping for null case ([CODE] `SettingController.cs:70-71`)

```csharp
public SettingController(
    IMapper mapper,
    IGetSettingsHandler getSettingHandler,
    IUpdateSettingsHandler updateSettinghandler,
    IConfigureWalletSettingsHandler configureWalletSettingsHandler,
    IGetWalletSettingsHandler getWalletSettingsHandler)
```

[CODE] `SettingController.cs:26-38`

## Route Prefix

`/api/Setting` (via `[Route("api/[controller]")]`). PascalCase per ASP.NET default.

## Authorization

- Class-level: `[ApiController]` only (note: **NO `[Authorize]` on the class**)
- Action-level: `[Authorize(Policy = FalconOnly)]` ONLY on `POST /wallets`

This is a **divergence from NodeController** — there is no class-level `[Authorize]` attribute. The other actions (`GET`, `PUT`, `GET wallets/{ownerId}`) rely on **upstream gateway policy + handler-side checks** for authorization.

**F-004 finding:** verify against gateway `commerce-proxy` routes whether `/api/Setting` is gated at the gateway. If yes, the missing class `[Authorize]` is defensive-in-depth gap; if no, this is **anonymous access** to setting reads. Pending question raised.

## Collaborators

| Type | Used For |
|---|---|
| `IRepository<Settings>` | Settings document CRUD |
| `IRepository<Node>` | Tenant-id resolution + node-type check (Main only) |
| `ICurrentUser` | UserType (Falcon vs Client) + TenantId binding |
| `INodeAggregator` | Current node-level count for `CurrentNodeLevels` |
| `IIdentityClient` | Current user-count for `CurrentNormalUserLimit` (east-west call to Identity) |
| `IEventPublisher<TenantIdentitySettingsSyncEvent>` | Kafka — sync settings to Identity service |
| `IEventPublisher<TenantIpAllowlistChangedEvent>` | Kafka — push IP allowlist changes to Core Gateway |
| `IEventPublisher<WalletConfiguredEvent>` | Kafka — notify Charging that wallet is configured |
| `HybridCache` | Invalidates `allowed_ips_{ownerId}` cache key on security update |

## Kafka Events Produced

| Event | When | Consumer |
|---|---|---|
| `TenantIdentitySettingsSyncEvent` | Every `PUT /api/Setting` | Identity service (password policy + max-user limits sync) |
| `TenantIpAllowlistChangedEvent` | `PUT /api/Setting` when `SecuritySettings` mutated | Core Gateway (overwrites Redis `tenant:{tenantId}:ipAllowlist:v1`) |
| `WalletConfiguredEvent` | `POST /api/Setting/wallets` success | Charging service (creates wallet, initial balance) |

[CODE] `UpdateSettingsHandler.cs:110-130`, `ConfigureWalletSettingsHandler.cs:79-90`.

## Findings

1. **No class-level `[Authorize]`** — see above. Pending question raised.

2. **Double-map bug in `GET /api/Setting`.** [CODE] `SettingController.cs:45`:
   ```csharp
   return Ok(ServiceOperationResult<GetSettingsResponse>.Success(
       _mapper.Map<GetSettingsResponse>(_mapper.Map<GetSettingsResponse>(result))));
   ```
   The outer `_mapper.Map<GetSettingsResponse>(...)` is invoked **twice**. The inner produces a `GetSettingsResponse`; the outer maps `GetSettingsResponse → GetSettingsResponse` which is a no-op identity copy (if registered) or potentially an exception. **Code smell at minimum, possibly a runtime cost penalty.** Verify AutoMapper profile registration.

3. **camelCase property names on request DTO violate C# convention.** [CODE] `UpdateSettingsRequest.cs:8-10`:
   ```csharp
   public string? ownerId { get; set; }
   public SecuritySettingsRequest? securitySettings { get; set; }
   public QuotaSettingsRequest? quotaSettings { get; set; }
   ```
   This works at the JSON binding layer (camelCase wire shape) but mismatches the Pascal-cased C# convention used everywhere else in the codebase. The same shape is mirrored on the response DTO. Frontend wire is camelCase regardless of C# property casing.

4. **Wallet settings is set-once.** `ConfigureWalletSettings` raises `WalletSettingsAlreadyConfigured` if the document already has a `WalletSettings` field. There is **no `UpdateWalletSettings` endpoint** — the only way to change strategy is to delete the settings doc directly (no API path). Confirms PRD assumption.

5. **`GET /wallets/{ownerId}` returns null when wallet not configured.** [CODE] `GetWalletSettingsHandler.cs:47-48` — explicitly documented as expected behavior, not an error. The frontend must treat null as "not yet configured" rather than "404".

6. **Falcon-admin reading own settings has special quota behavior.** When `_currentUser.UserType == Falcon && ownerId == null`, `GetQuotaSettings` returns `null` rather than throwing ([CODE] `GetSettingsHandler.cs:87-93`). The frontend then renders only Security + IP sections for Falcon root.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
