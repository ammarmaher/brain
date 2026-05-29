# InformationController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/InformationController.cs` (47 lines)
> 2 endpoints — owns main-node "Account Information" reads + writes (Edit Account / Edit Client flow).

## Purpose

Provides the **main-node account information panel**:
- Account name (Falcon-only edit), AccountId, FinanceId (Falcon-only)
- Profile picture
- Official data: VAT, BudgetNo (LicenseNo), EntityName, AnotherId, AuthorityLetterType, ClassificationCategory, ClassificationSubCategory, Sector
- Address: Country, City, District, Street, BuildingNumber, PostalCode, AdditionalAddress

Frontend consumer: **Organization Hierarchy "Account Info" tab / drawer panel** (when a main node is selected).

## Architecture

- Constructor injection (3 dependencies)
- AutoMapper used on update for request → command, result → response
- Read endpoint uses Mongo projection directly into the result DTO (no separate Result class)

```csharp
public InformationController(
    IMapper mapper,
    IUpdateMainNodeInfoHandler updateMainNodeInfoHandler,
    IGetMainNodeInfoHandler getMainNodeInfoHandler)
```

[CODE] `InformationController.cs:23-28`

## Route Prefix

`/api/Information` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[ApiController]` only — **NO `[Authorize]`**
- No action-level overrides

**Finding (drift candidate):** This controller has the same `[Authorize]`-missing pattern as `SettingController`. Identity protection comes from the gateway upstream + handler-side checks. F-004 pending question raised at the SettingController level applies here too.

## Collaborators

| Type | Used For |
|---|---|
| `IRepository<Node>` (inside both handlers) | Node CRUD + duplicate-name check (Falcon-only) |
| `ICurrentUser` (UpdateHandler) | UserType branching — Falcon edits full info; Client edits limited fields |
| `ConfigurationSettings` (UpdateHandler) | Image validation rules for profile picture |

## Kafka Events

**None.** (Address/Info changes do NOT publish events — there's no Identity sync trigger here. This means **Identity does not learn about Account address changes** automatically. F-004 candidate if PRD requires Identity to have address. Verify.)

## Findings

1. **No `[Authorize]` at class level** — same gap as SettingController. See pending-question for SettingController.

2. **Falcon vs Client branching is implicit, not policy-level.** [CODE] `UpdateMainNodeInfoHandler.cs:35-46, 72-75`:
   - Falcon admin: can edit `AccountName`, `FinanceId`, duplicate-name check fires
   - Client: cannot edit `AccountName`, `FinanceId` — those Set(...) calls are gated `if (_currentUser.UserType == eUserType.Falcon)`
   - **Drift:** PRD V-rule should declare which fields each role can edit. Currently the contract is silent for Client users on those fields.

3. **Duplicate name check uses regex with `RegexOptions.IgnoreCase`** ([CODE] `UpdateMainNodeInfoHandler.cs:37-42`). The `NodeQueryHelpers.BuildExactIgnoreCasePattern` builds an escaped pattern. **Performance note:** the regex runs unindexed across the `Node` collection. For tenants with thousands of nodes this is O(N) on each Falcon AccountName edit.

4. **`GetMainNodeInfoHandler` uses inline projection — no separate Result class.** [CODE] `GetMainNodeInfoHandler.cs:18-91`. The projection guards every `n.AccountDetails != null && n.AccountDetails.OfficialData != null ...` to avoid null-deref because Mongo returns plain projections. The result type `GetMainNodeInfoResult` is used directly (no AutoMapper round-trip for the projection). The controller then maps via AutoMapper to `GetMainNodeInfoResponse`.

5. **Commented-out role check.** [CODE] `UpdateMainNodeInfoHandler.cs:32-33`:
   ```csharp
   //if (_currentUser.Roles?.Contains(eUserRoles.NodeAdmin) == true || _currentUser.Roles?.Contains(eUserRoles.NormalUser) == true)
   //    throw new FalconException(FalconKeys.Error.UnauthorizedUserToPerformThisAction);
   ```
   Originally `NodeAdmin` and `NormalUser` couldn't update. Commented out — now any authenticated user can hit Update. Either PRD intent has changed or this is a regression. **F-004 candidate.**

6. **`UpdateMainNodeInfoResponse` has all non-nullable fields but `Get` returns nullable.** Compare:
   - `GetMainNodeInfoResponse.AccountName` is `string?`
   - `UpdateMainNodeInfoResponse.AccountName` is `string` (non-null)

   The asymmetry implies Update assumes successful write replaces nulls with valid strings — but the handler doesn't enforce non-null. A client sending `{}` could persist empty strings.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
