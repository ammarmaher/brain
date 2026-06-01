# SecurityController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/ResponseDtos/Security/GetAllIpAllowlistsResponse.cs`
> Internal result: `Falcon.Commerce.Application/Results/Security/GetAllIpAllowlistsResult.cs`

## Request DTO

**None.**

### Internal Query Type

[CODE] `Falcon.Commerce.Application/Queries/Security/GetAllIpAllowlistsQuery.cs`:

```csharp
public class GetAllIpAllowlistsQuery { }  // marker type
```

## Response DTO

### `GetAllIpAllowlistsResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/Security/GetAllIpAllowlistsResponse.cs:7-22`

```csharp
public sealed class GetAllIpAllowlistsResponse
{
    public Dictionary<string, IpAllowlistEntryDto> Tenants { get; set; }
        = new(StringComparer.Ordinal);
}

public sealed class IpAllowlistEntryDto
{
    public bool Enabled { get; set; }
    public List<string> AllowedIps { get; set; } = new();
}
```

| Field | Type | Notes |
|---|---|---|
| `Tenants` | `Dictionary<string, IpAllowlistEntryDto>` | Keyed by `OwnerId` (tenant id), `StringComparer.Ordinal` |
| `Tenants[].Enabled` | bool | **Derived**: `AllowedIps.Count > 0` (see OVERVIEW.md Finding #1) |
| `Tenants[].AllowedIps` | `List<string>` | CIDR or exact IP strings |

### Internal Result Type

[CODE] `Falcon.Commerce.Application/Results/Security/GetAllIpAllowlistsResult.cs` — mirror of response shape with `IpAllowlistEntryResult` instead of `IpAllowlistEntryDto`. Mapped via AutoMapper.

## Cross-Reference to Entity

[CODE] `Falcon.Commerce.Domain/Entities/Settings/Settings.cs` (inferred):
```csharp
public class Settings
{
    public string? Id { get; set; }
    public string OwnerId { get; set; }                  // = tenantId for the Main node
    public SecurityConfiguration? SecuritySettings { get; set; }
    public QuotaConfiguration? QuotaSettings { get; set; }
    public WalletConfiguration? WalletSettings { get; set; }
}

public class SecurityConfiguration
{
    public ePasswordSecurityLevel? PasswordSecurityLevel { get; set; }
    public List<string>? AllowedIps { get; set; }
}
```

The handler reads `Settings.SecuritySettings.AllowedIps` and rolls every non-null entry into the response dictionary.

## Cross-Reference

- [VAULT] `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` — IP allowlist enforcement model
- [CODE] `falcon-int-core-gateway-svc/src/...` — Gateway IP allowlist middleware (the consumer of this endpoint)
- [CODE] `Falcon.Commerce.Application/Events/TenantIpAllowlistChangedEvent.cs` — Kafka counterpart for mid-life updates
