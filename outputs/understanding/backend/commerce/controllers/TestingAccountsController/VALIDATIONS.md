# TestingAccountsController — Validations

## DTO-Level Validation

**None.** All query params are nullable / int defaults.

## Authorization Validation

- `[Authorize]` at class level → caller must have valid JWT
- No `FalconOnly` policy
- **Feature flag**: `settings.Value.TestingCharging.Enabled` — returns 404 when off

## Handler-Level Validation

[CODE] `TestingListAccountsHandler.cs:30-96` — no business validation. Only parameter normalization:

```csharp
var page = Math.Max(1, query.Page);
var pageSize = Math.Clamp(query.PageSize, 1, 100);
var search = query.Search?.Trim();
```

## Cross-Field Validation

None.

## Order of Validations

1. Feature flag check (controller) → 404 if off
2. `[Authorize]` JWT check → 401 on miss
3. Parameter normalization (clamp page + pageSize, trim search)
4. Handler issues paginated query → assembly

## Filter Logic

[CODE] `TestingListAccountsHandler.cs:44-56`:

```csharp
Expression<Func<Node, bool>> filter = string.IsNullOrWhiteSpace(search)
    ? node =>
        node.NodeType == eNodeType.Main &&
        !node.IsDeleted &&
        ((node.Id != null && configuredWalletStrategyOwnerIds.Contains(node.Id)) ||
         (node.TenantId != null && configuredWalletStrategyOwnerIds.Contains(node.TenantId)))
    : node =>
        node.NodeType == eNodeType.Main &&
        !node.IsDeleted &&
        ((node.Id != null && configuredWalletStrategyOwnerIds.Contains(node.Id)) ||
         (node.TenantId != null && configuredWalletStrategyOwnerIds.Contains(node.TenantId))) &&
        node.Name != null &&
        node.Name.ToLower().Contains(search.ToLower());
```

Key invariants enforced by filter:
- `NodeType == Main` — sub-nodes excluded
- `!IsDeleted` — soft-deleted accounts excluded
- Wallet strategy configured (either by Id OR by TenantId — dual-key compat)
- (search) Case-insensitive substring on `Name`

**Drift candidate:** the filter requires `WalletStrategyConfigured == true` — accounts without configured wallets are completely hidden, even though the response DTO has `WalletStrategyConfigured: false` as a valid wire value. The conditional renders the field useless (always `true`). Verify intent — if QA needs to see unconfigured accounts, this is a bug.

## Findings

1. **`WalletStrategyConfigured` field is dead** — see Drift above. Always `true` because the filter drops `false` rows.

2. **`OwnerId / TenantId` dual key** — same fallback used in `GetAccountHierarchyHandler` (Wave 5a) and `TestingListAccountsHandler` (here). Suggests historical data inconsistency that the codebase compensates for.

3. **No tenant isolation check** — any authenticated user (Falcon or Client) sees ALL accounts. Acceptable for QA tool, but if the JWT happens to be a Client JWT in dev, the Client sees Falcon-managed data. Production protection is the feature flag (off in prod).

## Cross-Reference to V-rules

No V-rules apply — this is a testing-only endpoint.
