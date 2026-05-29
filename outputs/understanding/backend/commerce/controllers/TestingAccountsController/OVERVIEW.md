# TestingAccountsController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/Testing/TestingAccountsController.cs` (44 lines)
> 1 endpoint — **testing-only** account list for the Charging Lab BFF.

## Purpose

Returns paginated account rows for the **Charging Lab** internal tooling (a QA / simulation harness used by Falcon engineers to validate charging logic without touching production data).

Exposes:
- Account metadata (id, tenant id, name)
- Subscribed applications (with status)
- Subscribed owners (resolved from Identity for `UserBased` wallets, from Commerce nodes for `NodeBased`)
- Wallet strategy state (`WalletStrategyConfigured` boolean + currency / balance type / structure when configured)
- Contract counts (active vs total)

Critical clarification from the XML comment ([CODE] `TestingListAccountsHandler.cs:17-19`):
> "Business clarification: contract creation still validates wallet strategy in Commerce; this testing query only exposes whether the strategy exists so QA can choose valid accounts."

## Architecture

- Primary-constructor DI (C# 12 style)
- Handler uses **5 repositories** + Identity client (heaviest read in Commerce)
- Configuration gate: `settings.Value.TestingCharging.Enabled` — endpoint returns 404 when feature flag is off

```csharp
public sealed class TestingAccountsController(
    ITestingListAccountsHandler testingListAccountsHandler,
    IOptions<ConfigurationSettings> settings)
    : ControllerBase
```

[CODE] `TestingAccountsController.cs:20-23`

## Route Prefix

`/api/testing/accounts` — note the **lowercase, slash-separated, /testing prefix** intentional convention. The source XML comment:
> "The route is prefixed with /api/testing so it is visually separated from production account APIs."

## Authorization

- Class-level: `[ApiController] [Authorize]`
- No action-level overrides → any authenticated JWT
- Feature-flag gate: `settings.Value.TestingCharging.Enabled` (false → 404)

The endpoint is JWT-protected but **not** restricted to Falcon admins. Anyone with a valid JWT and `TestingCharging.Enabled = true` can hit it. F-022 candidate for production — verify the flag defaults to `false` in production `appsettings.json`.

## Collaborators

| Type | Used For |
|---|---|
| `IRepository<Node>` | Main-node search + pagination + tenant-scoped node names |
| `IRepository<Settings>` | Wallet-strategy state per account |
| `IRepository<Contract>` | Active + total contract counts |
| `IRepository<Application>` | Translated application names |
| `IIdentityClient` | User-based wallet owner names (east-west to Identity) |
| `ITranslateHelper` | Application name translation |

## Kafka Events

**None.** Pure read endpoint.

## Findings

1. **Heavy read fan-out per page.** Each row issues:
   - `settingsRepository.GetAsync(...)` for wallet settings
   - `contractRepository.CountAsync(...)` × 2 (total + active)
   - `applicationRepository.GetListAsync(...)` for app names
   - (UserBased) `identityClient.GetUsersByTenantAsync(...)` for owner names
   - (NodeBased) `nodeRepository.GetListAsync(...)` for sub-node names

   Page size capped at 100 via `Math.Clamp(query.PageSize, 1, 100)`. Even at page-size=100, this is 100 × (4–5) repo calls = up to 500 round-trips per page. **Acceptable for testing, unacceptable for production.** The page-cap is the only governor.

2. **Wallet settings lookup uses dual-key fallback.** [CODE] `TestingListAccountsHandler.cs:191-198`:
   ```csharp
   return settingsRepository.GetAsync(setting =>
       (account.TenantId != null && setting.OwnerId == account.TenantId) ||
       (account.Id != null && setting.OwnerId == account.Id));
   ```
   Reads keyed by `TenantId` (current convention) OR `Id` (legacy/testing convention). Documented in the comment — explicit compat with older test data.

3. **`SubscribedOwners` resolution branches by `WalletBalanceType`.** [CODE] `TestingListAccountsHandler.cs:149-189`:
   - `NodeBased` → Commerce node tree (resolves to node `Id` + `Name`)
   - `UserBased` → Identity service east-west call → user `Id` + `FirstName + LastName`
   - Anything else → empty list

4. **Sort: alphabetic by `account.Name` (case-sensitive).** [CODE] `TestingListAccountsHandler.cs:62`: `accounts.OrderBy(account => account.Name)`. **Then** per-row sort by status, then by id. Stable within-page sort.

5. **Filter uses `node.Name.ToLower().Contains(search.ToLower())`** — case-insensitive substring search. [CODE] `TestingListAccountsHandler.cs:56`. C# `string.ToLower()` may be locale-sensitive; verify Mongo provider translation.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
