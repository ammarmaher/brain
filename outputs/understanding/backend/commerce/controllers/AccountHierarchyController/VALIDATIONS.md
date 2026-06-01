# AccountHierarchyController — Validations

## DTO-Level Validation (attribute-based)

**None.** The controller takes `[FromQuery]` primitives:
- `string accountId`
- `int? currency` / `int? balanceDistribution` / `int? walletStructure`

No `[Required]`, `[ThrowIfNotPassed]`, or `[EnumDataType]` attributes appear on the controller signature ([CODE] `AccountHierarchyController.cs:27-32`).

The three integer params are cast to enums **without bounds-checking** — passing an unmapped int (e.g. `currency=999`) silently produces an out-of-range enum value at runtime. The wallet-settings overlay clobbers it when settings exist, so the bug surfaces only on first-paint of unconfigured accounts.

**F-004 candidate (entity drift):** The other Commerce write endpoints decorate enum params with `[ThrowIfNotEnumValue<T>]` — this endpoint omits the guard. Pending question raised.

## Handler-Level Validation (business rules)

`GetAccountHierarchyHandler.ExecuteAsync` runs these checks in order ([CODE] `GetAccountHierarchyHandler.cs:42-101`):

| Step | Source line | Throws |
|---|---|---|
| `AccountId` non-empty | `104-107` | `FalconException(AccountIdRequired)` → 400 |
| Account node exists | `46-51` | `FalconException(NodeNotFound)` → 404 |
| Account node is `eNodeType.Main` | `53-54` | `FalconException(MainNodeOnlyOperation)` → 422 |
| Sub-tree root node exists | `BuildHierarchyAsync` line `116-117` | `FalconException(NodeNotFound)` → 404 |

## Authorization Validation

`[Authorize]` at class level only. **No `FalconOnly` policy.**

### Implicit subtree-isolation

[CODE] `GetAccountHierarchyHandler.cs:66`:
```csharp
var startNodeId = string.IsNullOrEmpty(_currentUser.NodeId) ? query.AccountId : _currentUser.NodeId;
```

- Falcon admins: `_currentUser.NodeId` is typically empty → subtree starts at `query.AccountId` (full account view)
- Client users with a NodeId: subtree clamps to their NodeId (they only see their subtree)
- Client AO at the account root: NodeId == account root → full subtree

### Missing tenant-isolation gate

Compared to `GetSettingsHandler.ValidateClientOwnership` ([CODE] `GetSettingsHandler.cs:65-69`), this handler does **not** raise `OwnerIdNotMatchWithTenantId` when a client user passes another tenant's `accountId`. The subtree narrows to their NodeId, but the account-level metadata (`AccountName`, `AccountIcon`, `TenantId`, `Currency`) is returned unconditionally.

**Halt-and-flag candidate** — see `_pending-questions/wave-5a-AccountHierarchyController-tenant-isolation.md` (raised below).

## Cross-Field Validation

Wallet defaults are layered ([CODE] `GetAccountHierarchyHandler.cs:62-64`):

```
effectiveCurrency      = walletSettings?.Currency      ?? query.Currency           ?? eCurrency.SAR
effectiveBalanceType   = walletSettings?.WalletBalance ?? query.BalanceDistribution ?? eWalletBalanceType.NodeBased
effectiveWalletType    = walletSettings?.WalletType    ?? query.WalletStructure     ?? eWalletBaseType.SingleWallet
```

- The trio is **all-or-nothing in storage** (wallet settings is one document field, persisted via `ConfigureWalletSettings`)
- Per-field overrides are NOT honored once wallet is saved

## Multi-Language Deviation

`AccountName` and `NodeName` are plain `string` in the response. Platform standard is `MultiLanguageName(En, Ar)`. **Same deviation as NodeController findings** — see `controllers/NodeController/VALIDATIONS.md` "Multi-Language Deviation".

## CommChannel-Visibility Filter

Only `Visibility == true` channels are returned, and only when `walletType == MultipleWallets`. Channel names are translated via `ITranslateHelper`. [CODE] `GetAccountHierarchyHandler.cs:71-87`.

## Order of Validations

1. JSON / query-string deserialization (none for primitives)
2. `[ApiController]` 400 short-circuit (irrelevant — no `[Required]`)
3. Handler `ValidateQuery` (AccountIdRequired)
4. Node existence + type check
5. Sub-tree root existence
6. (No tenant-isolation check — see Finding above)

Failures funnel through `ExceptionHandlerMiddleware` into `ServiceOperationResult<T>.Failure(...)`.
