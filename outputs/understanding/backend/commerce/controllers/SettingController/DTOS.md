# SettingController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/{Update,Get,Configure}Settings*.cs`
> Internal commands/queries: `Falcon.Commerce.Application/{Commands,Queries}/...`

## Request DTOs

### `UpdateSettingsRequest`

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/UpdateSettingsRequest.cs:1-28`

```csharp
public class UpdateSettingsRequest
{
    public string? ownerId { get; set; }           // ! camelCase property name
    public SecuritySettingsRequest? securitySettings { get; set; }
    public QuotaSettingsRequest? quotaSettings { get; set; }
}

public class SecuritySettingsRequest
{
    [ThrowIfNotEnumValue<ePasswordSecurityLevel>]
    public ePasswordSecurityLevel PasswordSecurityLevel { get; set; }
    public List<string>? AllowedIps { get; set; }
}

public class QuotaSettingsRequest
{
    public int MaxNormalUserLimit { get; set; }
    public int MaxSystemUserLimit { get; set; }
    public int MaxNodeLevels { get; set; }
    public decimal BalanceTransferLimitPercentage { get; set; }
}
```

| Field | Type | Validation | Notes |
|---|---|---|---|
| `ownerId` | string? | None | Tenant id of the account whose settings to update |
| `securitySettings` | `SecuritySettingsRequest?` | None at DTO level | Optional — null skips security update |
| `securitySettings.PasswordSecurityLevel` | `ePasswordSecurityLevel` | `[ThrowIfNotEnumValue<>]` | `Normal=1`, `High=2`, `Critical=3` (verify mapping) |
| `securitySettings.AllowedIps` | `List<string>?` | None | CIDR or exact IP strings; empty list disables allowlist |
| `quotaSettings` | `QuotaSettingsRequest?` | None | Optional — null skips quota update |
| `quotaSettings.MaxNormalUserLimit` | int | None | Default 0; Falcon-only writes |
| `quotaSettings.MaxSystemUserLimit` | int | None | Default 0; Falcon-only writes |
| `quotaSettings.MaxNodeLevels` | int | None | Default 0; Falcon-only writes |
| `quotaSettings.BalanceTransferLimitPercentage` | decimal | None | Falcon-only writes |

### `ConfigureWalletSettingsRequest`

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/ConfigureWalletSettingsRequest.cs:1-23`

```csharp
public class ConfigureWalletSettingsRequest
{
    [Required] public string OwnerId { get; set; }
    [Required] [EnumDataType(typeof(eCurrency))] public eCurrency Currency { get; set; }
    [Required] [EnumDataType(typeof(eWalletBalanceType))] public eWalletBalanceType WalletBalanceType { get; set; }
    [Required] [EnumDataType(typeof(eWalletBaseType))] public eWalletBaseType WalletType { get; set; }
}
```

| Field | Type | Validation |
|---|---|---|
| `OwnerId` | string | `[Required]` — account (Main) node id |
| `Currency` | `eCurrency` | `[Required] [EnumDataType]` — `1=SAR` per platform default |
| `WalletBalanceType` | `eWalletBalanceType` | `[Required] [EnumDataType]` — `1=UserBased`, `2=NodeBased` (verify) |
| `WalletType` | `eWalletBaseType` | `[Required] [EnumDataType]` — `1=SingleWallet`, `2=MultipleWallets` |

## Response DTOs

### `GetSettingsResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/GetSettingsResponse.cs:1-29`

```csharp
public class GetSettingsResponse
{
    public SecuritySettingsResponse? SecuritySettings { get; set; }
    public QuotaSettingsResponse? QuotaSettings { get; set; }
}

public class SecuritySettingsResponse
{
    [ThrowIfNotEnumValue<ePasswordSecurityLevel>]
    public ePasswordSecurityLevel PasswordSecurityLevel { get; set; }
    public List<string>? AllowedIps { get; set; }
}

public class QuotaSettingsResponse
{
    public int MaxNormalUserLimit { get; set; }
    public int MaxSystemUserLimit { get; set; }
    public int MaxNodeLevels { get; set; }
    public decimal BalanceTransferLimitPercentage { get; set; }
    public int CurrentNodeLevels { get; set; }
    public int CurrentSystemUserLimit { get; set; }
    public int CurrentNormalUserLimit { get; set; }
}
```

| Field | Source |
|---|---|
| `SecuritySettings.PasswordSecurityLevel` | Settings.SecuritySettings.PasswordSecurityLevel |
| `SecuritySettings.AllowedIps` | Settings.SecuritySettings.AllowedIps (or empty list) |
| `QuotaSettings.MaxNormalUserLimit` | Settings.QuotaSettings.MaxNormalUserLimit |
| `QuotaSettings.MaxSystemUserLimit` | Settings.QuotaSettings.MaxSystemUserLimit |
| `QuotaSettings.MaxNodeLevels` | Settings.QuotaSettings.MaxNodeLevels |
| `QuotaSettings.BalanceTransferLimitPercentage` | Settings.QuotaSettings.BalanceTransferLimitPercentage |
| `QuotaSettings.CurrentNodeLevels` | `INodeAggregator.GetMaxNodeLevelAsync(tenantId)` — runtime computed |
| `QuotaSettings.CurrentSystemUserLimit` | **Hard-coded `0`** (see Finding) |
| `QuotaSettings.CurrentNormalUserLimit` | `IIdentityClient.GetUserCountAsync(tenantId, [NormalUser])` — east-west to Identity |

**Finding:** `CurrentSystemUserLimit` is set to literal `0` ([CODE] `GetSettingsHandler.cs:122`). No system-user count query is wired — TODO / partial implementation. PRD V-rule may require this; flag as drift.

### `UpdateSettingsResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/UpdateSettingsResponse.cs:1-9`

```csharp
public class UpdateSettingsResponse
{
    public string? ownerId { get; set; }           // camelCase
    public SecuritySettingsResponse? securitySettings { get; set; }
    public QuotaSettingsResponse? quotaSettings { get; set; }
}
```

Echoes the update (with merged `Current*` quota fields from the read path).

### `ConfigureWalletSettingsResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/ConfigureWalletSettingsResponse.cs:1-12`

```csharp
public class ConfigureWalletSettingsResponse
{
    public string OwnerId { get; set; }
    public eCurrency Currency { get; set; }
    public eWalletBalanceType WalletBalanceType { get; set; }
    public eWalletBaseType WalletType { get; set; }
}
```

### `GetWalletSettingsResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/GetWalletSettingsResponse.cs:1-11`

```csharp
public class GetWalletSettingsResponse
{
    public eCurrency Currency { get; set; }
    public eWalletBalanceType WalletBalanceType { get; set; }
    public eWalletBaseType WalletType { get; set; }
}
```

(No `OwnerId` field on the read shape; the caller passed it as path parameter.)

## Internal Command/Query Types

| Internal Type | Used By |
|---|---|
| `GetSettingsQuery(string? OwnerId)` | `GET /api/Setting` |
| `GetWalletSettingsQuery(string OwnerId)` | `GET /api/Setting/wallets/{ownerId}` |
| `UpdateSettingsCommand` (mapped from `UpdateSettingsRequest`) | `PUT /api/Setting` |
| `ConfigureWalletSettingsCommand` (mapped from `ConfigureWalletSettingsRequest`) | `POST /api/Setting/wallets` |

Mapping profiles live in `Falcon.Commerce.Api/Mappings/Manual/ToCommand/` and `ToResponse/`.

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/`:
- V-026 — password security level enum (gating `SecuritySettings.PasswordSecurityLevel`)
- V-027 — allowed-ips list validation (CIDR / IP format) — note: **no V-rule enforcement in the DTO**; verify FE pre-validates
- V-024 — account quota read-only when `CanSave=false` (from AccountHierarchy)
- V-028 — wallet set-once (gating `ConfigureWallet`)

## Cross-Reference to PRD

[BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/02-prd/PRD-Settings.md` (if present) — match `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevels`, `BalanceTransferLimitPercentage` against PRD field names.

## Cross-Reference to Frontend

[CODE] `apps/admin-console/.../settings-tab/services/settings.service.ts` — issues `GET /commerce/setting?ownerId=<id>` + `PUT /commerce/setting`.
[MEMORY] `project_settings_tab_standalone_wave14_2026_05_17` documents the state-slice consumer.
