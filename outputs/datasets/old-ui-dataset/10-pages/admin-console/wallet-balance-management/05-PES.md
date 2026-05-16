# PES — wallet-balance-management

## Permission keys used

| Key path | Resolves to AccessQuery | Where checked | File:line |
|---|---|---|---|
| `FalconAccess.adminConsole.enter()` | `{ action: 'view', resource: 'app.admin-console' }` | parent route guard | `apps/admin-console/src/app/app.routes.ts:8` → `libs/falcon/src/core/lib/guards/admin-console.guard.ts:17` ; registry def at `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:90` |
| `FalconAccess.adminConsole.walletStrategy.view()` | `{ action: 'view', resource: 'sys.wallet-strategy' }` | container `primeAccess()` → `canViewWalletStrategy` | `wallet-balance-management.component.ts:878`; registry def `falcon-access.registry.ts:123` |
| `FalconAccess.adminConsole.walletStrategy.edit()` | `{ action: 'edit', resource: 'sys.wallet-strategy' }` | container `primeAccess()` → `canEditWalletStrategy` (also gates Save button visibility + click) | `wallet-balance-management.component.ts:879`; registry def `falcon-access.registry.ts:124` |
| `FalconAccess.adminConsole.masterWallet.view()` | `{ action: 'view', resource: 'sys.master-wallet' }` | container `primeAccess()` → `canViewMasterWallet` (gates Master Wallet card) | `wallet-balance-management.component.ts:880`; registry def `falcon-access.registry.ts:127` |
| `FalconAccess.adminConsole.wallet.transfer()` | `{ action: 'transfer', resource: 'sys.wallet' }` | container `primeAccess()` → `canTransferWallet` (gates per-row Transfer button + Master Wallet Transfer button + onTransferSubmit) | `wallet-balance-management.component.ts:881`; registry def `falcon-access.registry.ts:130` |

[CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:89-132` (extract):
```typescript
adminConsole: {
  enter: (): AccessQuery => ({ action: 'view', resource: 'app.admin-console' }),
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
},
```

## AccessControlFacade usage

[CODE] `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts:876-884`:
```typescript
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canViewWalletStrategy: FalconAccess.adminConsole.walletStrategy.view(),
    canEditWalletStrategy: FalconAccess.adminConsole.walletStrategy.edit(),
    canViewMasterWallet:   FalconAccess.adminConsole.masterWallet.view(),
    canTransferWallet:     FalconAccess.adminConsole.wallet.transfer(),
  }));
  this.cdr.markForCheck();
}
```

Pattern: `AccessControlFacade.resolveFlags({ flagName: AccessQuery })` returns a `{ flagName: boolean }` object that is `Object.assign`'d onto `this`. All four flags become regular instance fields that the template binds to (`*ngIf="canViewMasterWallet"`, `*ngIf="canViewWalletStrategy || canEditWalletStrategy"`, `[disabled]="!canDoActions || !canTransferWallet"` etc).

[INFERRED] `resolveFlags()` evaluates each query against the current authenticated user's policy subject (likely a backend roundtrip through Identity service). Confirmed by similar pattern in sibling features.

## Per-button / per-region gating

| UI surface | Gate |
|---|---|
| Master Wallet card (entire card incl. transfer icon, balance, channel inputs) | `*ngIf="canViewMasterWallet"` ([CODE] `wallet-balance-management.component.html:197`) |
| Master Wallet transfer icon | `[disabled]="!canDoActions || !canTransferWallet"` ([CODE] `:204`) — `canDoActions = !response.result.canSave` ([CODE] container `:621`) |
| Settings card (currency / balance type / wallet type) | `*ngIf="canViewWalletStrategy || canEditWalletStrategy"`; `[class.wb-settings-disabled]="isSettingsDisabled"` (= `!canEditWalletStrategy \|\| !canSave`) ([CODE] `:239`); inner inputs `[disabled]="isSettingsDisabled"` ([CODE] `:250, :271, :292`) |
| Save button | `*ngIf="isSaveEnabled"` (= `canEditWalletStrategy && canSave`) + `[disabled]="(isLoading$ \| async) \|\| (isSaving$ \| async) \|\| !isSaveEnabled"` ([CODE] `:180-188`) + early-return in `saveChanges()` ([CODE] container `:434-437`) |
| Per-row Transfer button | `[disabled]="!isCellEditable(node.data) \|\| !canTransferWallet"` ([CODE] `:428`) |
| Transfer submit | `onTransferSubmit()` early-returns when `!canTransferWallet` ([CODE] container `:495-498`) |
| Master Wallet button click | `onMasterWalletTransferClick()` early-returns when `!isFalconUser \|\| !canTransferWallet` ([CODE] container `:479-482`) |

## Route guards
1. Parent route ([CODE] `app.routes.ts:8`): `canActivate: [adminConsoleGuard]` — enforces `app.admin-console` view permission. Redirects to `/401` if denied, `/error` on failure.
2. Feature route ([CODE] `features/routes.ts:54`): `canActivate: [shellAccessGuard]` — **but no `data.access` is set**, so the guard short-circuits to `return true`. Effectively a no-op for this route. (See [[01-ROUTING]] for proof.)

## Eligibility / Subscription checks
None observed in this feature.

## `canSave` server-side override
Response field `IWalletDataResponse.canSave: boolean` ([CODE] `wallet-balance.models.ts:206`) is consumed at [CODE] container `:633`:
```typescript
this.canSave = response.result?.canSave;
```
…and folded into the `isSaveEnabled` getter. This is a server-driven extra gate on top of PES — the backend can disable Save even for a user with `walletStrategy.edit` permission (likely when the selected node is the Falcon root or another non-editable scope).

## Falcon-user-only gating
- `onMasterWalletTransferClick()` ([CODE] container `:479-482`) requires `isFalconUser`. `isFalconUser` is computed from `sessionProvider.session?.userType === USER_TYPE_STRINGS.FALCON_USER`. So Client users cannot trigger the Master Wallet transfer entry-point even if they hold `wallet.transfer` permission.
- Master Wallet itself shows only when `canViewMasterWallet` is true — also typically Falcon-scoped, but this is a separate PBAC resource.

## Permission count (final)
**5 distinct AccessQuery permissions** consulted:
1. `app.admin-console / view` (route entry)
2. `sys.wallet-strategy / view`
3. `sys.wallet-strategy / edit`
4. `sys.master-wallet / view`
5. `sys.wallet / transfer`
