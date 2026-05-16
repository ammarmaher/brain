# PES — contracts-cost-management

## Permission keys used (in this feature)
**None.** [CODE] Searched both feature files and shared files; no `FalconAccess.adminConsole.contracts.*` keys or `accessControlFacade.can(...)` calls inside the feature scope.

## AccessControlFacade usage
- `AccessControlFacade` is **not injected** anywhere in `apps/admin-console/src/app/features/contracts-cost-management/**`. Confirmed by grep — no matches.
- The four shared components (`ContractsAccountsPanelComponent`, `ContractsDataTableComponent`, `ContractsNodeHeaderComponent`, `ContractsEmptyStateComponent`) also do not inject it.

## Route guards
- The feature route at `apps/admin-console/src/app/features/routes.ts:43-51` declares **no `canActivate` of its own**.
- Inherits `adminConsoleGuard` from the parent route in `app.routes.ts:6-15` which enforces `FalconAccess.adminConsole.enter()` = `{ action: 'view', resource: 'app.admin-console' }`.
- [CODE] No `shellAccessGuard` on the contracts route — unlike `marketplace-applications`, `organization-hierarchy`, `wallet-balance-management`, `comm-mgmt`, `contact-groups` which all have `canActivate: [shellAccessGuard]`. [INFERRED] This is either an intentional decision (page is always visible to anyone reaching admin-console) or an oversight.

## Why this matters (context for the new theme)
[INFERRED] All other commercial-side admin pages gate behind PES (visible toggles, action-level checks). Contracts-cost-management appears to assume that arrival at admin-console + finding the menu link is sufficient gating. The menu visibility is host-shell-controlled and likely PES-gated upstream. To verify, check the host-shell sidebar menu definition (out of scope for this dataset).

## FalconAccess registry — relevant cluster (not used here, but documented for cross-page link)
File: `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:122-131`

```typescript
adminConsole: {
  ...
  walletStrategy: {
    view: (): AccessQuery => ({ action: 'view', resource: 'sys.wallet-strategy' }),
    edit: (): AccessQuery => ({ action: 'edit', resource: 'sys.wallet-strategy' }),
  },
  masterWallet: {
    view: (): AccessQuery => ({ action: 'view', resource: 'sys.master-wallet' }),
  },
  wallet: {
    transfer: (): AccessQuery => ({ action: 'transfer', resource: 'sys.wallet' }),
  },
}
```

[CODE] There is **no** `adminConsole.contracts.*` cluster. Likely a future PES gap.

There is a `managementConsole.contract.view` key (`falcon-access.registry.ts:85-87`) — that targets the **client-side** management-console UI, not this admin-console page.

## Eligibility / Subscription checks
- `WalletStrategySettings` is fetched on node-select and is treated as a **soft eligibility gate**:
  - When `walletStrategy === null` → "Add Contract" button disabled + warning banner shown (template lines 80-84, business message key `contractsCostManagement.walletStrategyRequired`).
  - `onAddContract()` returns early if `!isWalletStrategyConfigured` (component lines 103-109).
- `currentContract.canEdit` comes from backend — when false, the in-view "Edit" button is hidden. Computed locally by `canEditContractStatus(status)` (models.ts:579-581): returns `true` for `pending | active | expired`. [INFERRED] Backend likely overrides with stricter rules.
- `hasRestrictedContractCommercialFields(status)` (models.ts:583-585) returns `true` for `active | expired` — used to apply read-only-style class to commercial fields in edit mode. (UI-only restriction; not a permission check.)

## Recommendation for new theme
Add explicit PES guards (or at minimum a `shellAccessGuard` declaration on the route) for:
- View access — `FalconAccess.adminConsole.contracts.view()` (new key)
- Create — `FalconAccess.adminConsole.contracts.create()`
- Edit — `FalconAccess.adminConsole.contracts.edit()`

…and add these to the falcon-access registry. The current feature relies entirely on UI-button-hiding for protection, which is not defense-in-depth.
