# AccountHierarchyController — DTOs

> Public contract files: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/GetAccountHierarchy*.cs`
> Internal types: `Falcon.Commerce.Application/{Queries,Results/Settings}/GetAccountHierarchy*.cs`

## Request DTO

### `GetAccountHierarchyRequest`

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/GetAccountHierarchyRequest.cs:1-7`

```csharp
public class GetAccountHierarchyRequest
{
    public string AccountId { get; set; }
}
```

**NOT USED by the controller** — the controller signature reads via `[FromQuery]` individual params, not via a bound DTO. The `GetAccountHierarchyRequest` class exists in `Contracts/` but is dead in the controller path. **Finding: dead DTO.**

The controller actually binds four `[FromQuery]` ints and constructs the query manually:

```csharp
var query = new GetAccountHierarchyQuery(
    accountId,
    currency.HasValue ? (eCurrency)currency.Value : null,
    balanceDistribution.HasValue ? (eWalletBalanceType)balanceDistribution.Value : null,
    walletStructure.HasValue ? (eWalletBaseType)walletStructure.Value : null);
```

### Internal Query type

[CODE] `Falcon.Commerce.Application/Queries/GetAccountHierarchyQuery.cs:1-12`

```csharp
public class GetAccountHierarchyQuery(
    string accountId,
    eCurrency? currency = null,
    eWalletBalanceType? balanceDistribution = null,
    eWalletBaseType? walletStructure = null)
{
    public string AccountId { get; set; } = accountId;
    public eCurrency? Currency { get; set; } = currency;
    public eWalletBalanceType? BalanceDistribution { get; set; } = balanceDistribution;
    public eWalletBaseType? WalletStructure { get; set; } = walletStructure;
}
```

No validation attributes — handler does runtime validation only.

## Response DTO

### `GetAccountHierarchyResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/GetAccountHierarchyResponse.cs:5-32`

| Field | Type | Notes |
|---|---|---|
| `AccountId` | string | Account (main) node id — echoes the query |
| `AccountName` | string | Plain string (deviates from platform `MultiLanguageName` standard) |
| `AccountIcon` | string | Base64-encoded image src (data URL or empty) |
| `TenantId` | string | **Used by Gateways to query Identity for user data** — comment in source confirms this is the bridging key |
| `Currency` | `eCurrency` | Effective: wallet-configured value OR query-supplied default OR `SAR` |
| `WalletBalanceType` | `eWalletBalanceType` | Effective: wallet-configured OR query default OR `NodeBased` |
| `WalletType` | `eWalletBaseType` | Effective: wallet-configured OR query default OR `SingleWallet` |
| `CanSave` | bool | `true` only when wallet not yet configured — gates wallet-edit UI |
| `CommChannels` | `List<GetAccountHierarchyCommChannelsResponse>` | Only populated when `WalletType == MultipleWallets`; `null` for `SingleWallet` |
| `Hierarchy` | `AccountHierarchyNodeResponse` | Recursive tree from current user's NodeId (or accountId) |

### Nested `GetAccountHierarchyCommChannelsResponse`

| Field | Type | Notes |
|---|---|---|
| `ChannelId` | string | CommChannel `_id` |
| `CommChannelName` | string | **Translated** to caller's language via `ITranslateHelper` |

### Nested `AccountHierarchyNodeResponse`

| Field | Type | Notes |
|---|---|---|
| `NodeId` | string | Node id |
| `NodeName` | string | Plain string (single language — see Finding) |
| `SubNodes` | `List<AccountHierarchyNodeResponse>` | Recursive child list; empty `[]` at leaves (built from `Path.StartsWith(...)`) |

The tree is built by `BuildHierarchyAsync` ([CODE] `GetAccountHierarchyHandler.cs:110-141`) — single Mongo query for all descendants by path prefix, then in-memory dictionary assembly.

## Cross-Reference to V-rules

This endpoint is the **first call** in the Organization Hierarchy page load. V-rules touching the rendered tree state:
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-001-add-client-account-name.md` — `AccountName` shown in tree heading
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-024-account-quota-readonly.md` — `CanSave` controls quota form mode (Wave 14 settings tab)

## Cross-Reference to Frontend Consumption

[CODE] `apps/admin-console/.../org-hierarchy-page/services/services.ts` `HierarchyService.getAccountHierarchy(...)` — though [MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` confirms current implementation uses **per-tab endpoints** (`/comm-channels/visible/details`, `/applications`), not this aggregated endpoint, for the tab data. This endpoint is for the **tree shell** at first paint.

## Cross-Reference to Add Client wizard

Not consumed by Add Client wizard directly — wizard uses `POST /commerce/Node/create-account` and then redirects to the org-hierarchy page which loads via this endpoint. See [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/08-BACKEND_API.md` for the wizard contract.
