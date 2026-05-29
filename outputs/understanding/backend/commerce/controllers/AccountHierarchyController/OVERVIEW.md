# AccountHierarchyController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/AccountHierarchyController.cs` (45 lines)
> Smallest controller in Commerce by line count (1 endpoint), but central to UI shell-and-tree rendering.

## Purpose

Exposes the **hydrated account hierarchy** in a single trip — combines:
- Account node metadata (name, icon, tenantId)
- Wallet strategy (currency, balance type, base type) — sourced from Settings if configured, otherwise echoes query defaults
- Visible CommChannels at the account root (only when `WalletBaseType.MultipleWallets`)
- A recursively-built tree of sub-nodes rooted at the **current user's NodeId** (Falcon admins see the whole tree, sub-node admins see only their subtree)

Frontend consumer: org-hierarchy page first-paint, [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/`.

## Architecture

- **Primary-constructor DI** (uses C# 12 `_handler, _mapper` parameter convention)
- Single handler: `IGetAccountHierarchyHandler` ([CODE] `GetAccountHierarchyHandler.cs:20-141`)
- AutoMapper maps `GetAccountHierarchyResult` → `GetAccountHierarchyResponse`

```csharp
public class AccountHierarchyController(
    IGetAccountHierarchyHandler _getAccountHierarchyHandler,
    IMapper _mapper) : ControllerBase
```

[CODE] `AccountHierarchyController.cs:16`

## Route Prefix

`/api/accounts/hierarchy` — **note the lowercase, slash-separated form**; deviates from the `/api/[controller]` token used elsewhere ([CODE] `AccountHierarchyController.cs:13`).

## Authorization

- Class-level: `[Authorize]` + `[ApiController]`
- No action-level override → both Falcon and Client JWTs accepted
- **Tenant-isolation enforced inside the handler**, not at the route. Client users hitting another tenant's `accountId` will pass authorization but fail at the handler (no explicit check in the current handler — see Findings #2)

## Collaborators

| Type | Used For |
|---|---|
| `IRepository<Settings>` | Wallet configuration lookup by `OwnerId == accountNode.TenantId` |
| `IRepository<Node>` | Account node metadata + recursive tree-build via `Path.StartsWith(...)` |
| `IRepository<CommunicationChannel>` | Translated channel names for visible-channels list |
| `ICurrentUser` | Subtree-root resolution (`startNodeId = _currentUser.NodeId ?? query.AccountId`) |
| `ITranslateHelper` | Locale-aware translation of `MultiLanguageName` to caller's language |

## Kafka Events

**None produced or consumed** — pure read endpoint.

## Findings

1. **Falcon-admin "open its account" semantics.** When `_currentUser.UserType == Falcon` and `query.AccountId == falconRootId`, the handler still builds a full subtree starting at the account root. There is no `GetQuotaSettingsAsync` quota return for the Falcon root (returns null). The frontend Settings tab (Wave 14) gates `accountQuota.edit()` on this null state. [CODE] `GetSettingsHandler.cs:87-93` confirms the special case lives in `GetSettings`, not in `GetAccountHierarchy`.

2. **No explicit tenant-isolation check in `GetAccountHierarchyHandler`.** The handler trusts the caller-provided `query.AccountId`. A client user sending another tenant's `accountId` is not rejected at the handler — sub-tree filtering relies on `_currentUser.NodeId` clamping the visible subtree, but the account-level metadata (name, icon, currency) IS leaked. **F-004 candidate (entity drift)** — verify against `GetSettingsHandler` which has explicit `ValidateClientOwnership`. See pending-question file.

3. **`isFirstTime = walletSettings is null` toggles `CanSave`.** This signals to the frontend that the wallet strategy can still be edited. After first save, `CanSave = false` → form goes read-only. This is the only field that gates wallet-config editability; PRD V-rule should reference it.

4. **`MultipleWallets` only path returns CommChannels list.** [CODE] `GetAccountHierarchyHandler.cs:71-87`. `SingleWallet` accounts get `commChannels = null` despite the response DTO declaring `List<GetAccountHierarchyCommChannelsResponse>`. Frontend must handle null vs empty.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
