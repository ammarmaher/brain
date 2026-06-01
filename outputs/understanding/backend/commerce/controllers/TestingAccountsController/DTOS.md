# TestingAccountsController — DTOs

> Internal: `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs` (this controller's DTOs live in the **Application** layer, not Contracts — unusual)

## Request DTO

### `TestingAccountListQuery`

[CODE] `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs:9-14`

```csharp
public class TestingAccountListQuery
{
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
```

Note: this is used as both the query and the response wire shape — the testing endpoint does **not** map through Contracts/. Frontend-equivalent doesn't apply.

## Response DTO

### `TestingAccountListResponse`

[CODE] `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs:16-22`

```csharp
public class TestingAccountListResponse
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public long TotalCount { get; set; }
    public List<TestingAccountListItemResponse> Items { get; set; } = [];
}
```

### `TestingAccountListItemResponse`

[CODE] `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs:24-38`

```csharp
public class TestingAccountListItemResponse
{
    public string AccountId { get; set; }
    public string TenantId { get; set; }
    public string AccountName { get; set; }
    public List<TestingAccountApplicationResponse> SubscribedApplications { get; set; } = [];
    public List<TestingAccountOwnerResponse> SubscribedOwners { get; set; } = [];
    public bool WalletStrategyConfigured { get; set; }
    public string? Currency { get; set; }
    public string? WalletBalanceType { get; set; }
    public string? WalletStructure { get; set; }
    public int ActiveContractCount { get; set; }
    public int TotalContractCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

| Field | Type | Source |
|---|---|---|
| `AccountId` | string | `Node.Id` |
| `TenantId` | string | `Node.TenantId` |
| `AccountName` | string | `Node.Name` |
| `SubscribedApplications` | `List<TestingAccountApplicationResponse>` | Resolved from `Node.Applications[]` + Application name lookup |
| `SubscribedOwners` | `List<TestingAccountOwnerResponse>` | Resolved by wallet balance type (Node or User-based) |
| `WalletStrategyConfigured` | bool | `Settings.WalletSettings != null` |
| `Currency` | string? | `Settings.WalletSettings.Currency.ToString()` (enum name) |
| `WalletBalanceType` | string? | enum name |
| `WalletStructure` | string? | enum name |
| `ActiveContractCount` | int | Count of `Contract.Status == Active` for this account |
| `TotalContractCount` | int | All contracts for this account |
| `CreatedAt` | DateTime | Account creation timestamp |

**Currency / WalletBalanceType / WalletStructure are emitted as enum NAMES (strings), not ints.** This is a deviation from the rest of Commerce which emits enum INTS. Drift candidate if downstream parsers expect ints.

### `TestingAccountApplicationResponse`

[CODE] `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs:40-45`

```csharp
public class TestingAccountApplicationResponse
{
    public string ApplicationId { get; set; }
    public string ApplicationName { get; set; }
    public string Status { get; set; }
}
```

`Status` is the enum name string (`"Active"`, `"InActive"`, `"Expired"`, `"Disabled"`).

### `TestingAccountOwnerResponse`

[CODE] `Falcon.Commerce.Application/Testing/Models/TestingAccountModels.cs:47-52`

```csharp
public class TestingAccountOwnerResponse
{
    public string OwnerId { get; set; }
    public string OwnerName { get; set; }
    public string OwnerType { get; set; }            // "NODE" or "USER"
}
```

## Cross-Reference

- [CODE] `Falcon.Commerce.Application/Services/Handlers/Testing/TestingListAccountsHandler.cs:21-198` — full implementation
- [CODE] `Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` — `TestingCharging.Enabled` flag
- Charging Lab BFF (consumer) — verify in `falcon-core-charging-svc` or a separate tooling repo
