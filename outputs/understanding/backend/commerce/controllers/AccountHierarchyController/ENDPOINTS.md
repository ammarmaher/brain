# AccountHierarchyController — Endpoints

> Class route prefix: `/api/accounts/hierarchy` ([CODE] `AccountHierarchyController.cs:13`). Inherits `[Authorize]` from class.

## Read Endpoint

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/accounts/hierarchy?accountId=&currency=&balanceDistribution=&walletStructure=` | `GetAccountHierarchy` | (query string, 4 params) | `GetAccountHierarchyResponse` | `IGetAccountHierarchyHandler.ExecuteAsync(new GetAccountHierarchyQuery(...))` |

### Source

[CODE] `AccountHierarchyController.cs:27-43`

```csharp
[HttpGet]
public async Task<ActionResult<ServiceOperationResult<GetAccountHierarchyResponse>>> GetAccountHierarchy(
    [FromQuery] string accountId,
    [FromQuery] int? currency = null,
    [FromQuery] int? balanceDistribution = null,
    [FromQuery] int? walletStructure = null)
```

### Query parameters

| Param | Type | Required | Notes |
|---|---|---|---|
| `accountId` | string | **Yes** | Account (main) node id |
| `currency` | int? (cast to `eCurrency`) | No | Default wallet currency — used only when wallet not yet configured ([CODE] `GetAccountHierarchyHandler.cs:62`) |
| `balanceDistribution` | int? (cast to `eWalletBalanceType`) | No | Default balance type — used only when wallet not yet configured ([CODE] `GetAccountHierarchyHandler.cs:63`) |
| `walletStructure` | int? (cast to `eWalletBaseType`) | No | Default wallet structure — used only when wallet not yet configured ([CODE] `GetAccountHierarchyHandler.cs:64`) |

The three enum-as-int params are **suggestion defaults** the frontend can pre-fill the wallet form with. They are ignored once the account has a saved `WalletConfiguration`.

### PES Key (Permission Enforcement Service)

| Key | Caller Side |
|---|---|
| _(none — no explicit `falconAccess.*` gate in controller)_ | Implicit Falcon JWT or Client JWT (any authenticated user) |

The endpoint does not declare an `[Authorize(Policy = ...)]` override. Falcon-admin and client users both reach it. Authorization narrowing happens inside the handler via `_currentUser.NodeId` (subtree clamp) but the account metadata is **not** explicitly gated by tenant id. See OVERVIEW.md Finding #2.

### Status Codes

| Status | When |
|---|---|
| 200 | Success — `ServiceOperationResult<GetAccountHierarchyResponse>` |
| 400 | `AccountIdRequired` (empty / missing `accountId`) |
| 404 | `NodeNotFound` (accountId doesn't resolve) |
| 422 | `MainNodeOnlyOperation` (accountId is a sub-node, not Main) |
| 401 | No / invalid JWT |
| 500 | Mongo/translation failures bubble through middleware |

[CODE] `GetAccountHierarchyHandler.cs:51, 54, 104-107`

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
