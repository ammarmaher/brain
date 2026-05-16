# PES — testing-charging

## Permission keys used

| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.adminConsole.enter()` → `{ action: 'view', resource: 'app.admin-console' }` | Inherited parent-route `canActivate: [adminConsoleGuard]` | `apps/admin-console/src/app/app.routes.ts:8` (guard application) + `libs/falcon/src/core/lib/guards/admin-console.guard.ts:17` (key resolution) + `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:89-90` (key definition) |

[CODE] **No in-feature permission key is declared or checked.** The testing-charging route at `apps/admin-console/src/app/features/routes.ts:62-75` declares no `data.access` and no `canActivate: [shellAccessGuard]`. Every other admin-console feature in the same file declares one — organization-hierarchy, comm-mgmt, marketplace-applications, wallet-balance-management, contact-groups all use `shellAccessGuard` either with a specific access query or with breadcrumb-only data.

[INFERRED] This is consistent with the feature's nature as an internal QA / developer tool: gating is enforced at the **app-entry** layer (any user who can enter admin-console can use it) and at the **sidebar visibility** layer (Falcon users only via `requiredUserTypes`), but no per-action PBAC keys exist for the testing surface itself.

## AccessControlFacade usage

[CODE] **Not used directly in the testing-charging feature.** No `import { AccessControlFacade }` or `.can(...)` / `.canSync(...)` / `.ensure(...)` calls appear in:
- `testing-charging.component.ts`
- `testing-charging-api.service.ts`
- `testing-charging.models.ts`

The facade is used **only** indirectly via the inherited `adminConsoleGuard` (`admin-console.guard.ts:15-22`):

```typescript
const facade = inject(AccessControlFacade);
const router = inject(Router);
const query = FalconAccess.adminConsole.enter();
try {
  await facade.ensure(query);
  return facade.can(query)
    ? true
    : router.createUrlTree([APP_ROUTES.UNAUTHORIZED]);
} catch {
  return router.createUrlTree([APP_ROUTES.ERROR]);
}
```

## Route guards

| Guard | Source | Behaviour |
|---|---|---|
| `adminConsoleGuard` | `apps/admin-console/src/app/app.routes.ts:8` (parent) | `libs/falcon/src/core/lib/guards/admin-console.guard.ts` — checks `{ action: 'view', resource: 'app.admin-console' }`; on deny → `/401`; on facade failure → `/error` |
| `shellAccessGuard` | NOT applied to testing-charging | — |

[CODE] Verified: `shellAccessGuard` import + application is present on 5 of the 6 admin-console child routes (`apps/admin-console/src/app/features/routes.ts:11-95`), but **absent on the `testing/charging` child** (`:62-75`).

## Eligibility / Subscription checks

[CODE] One **client-side eligibility filter** exists outside the PBAC system:

- `walletStrategyAccounts` getter (`testing-charging.component.ts:133-135`):
  ```typescript
  get walletStrategyAccounts(): TestingChargingAccount[] {
    return this.accounts.filter(account => account.walletStrategyConfigured);
  }
  ```
- This is a business-state filter (`walletStrategyConfigured: boolean` flag on the account DTO) — accounts without a wallet strategy are hidden from the left-column list. It is not a PBAC permission.

[CODE] The endpoint itself also returns the `walletStrategyConfigured` flag — the backend signals which accounts are eligible for the testing lab. Server-side eligibility is implicit (the endpoint returns all accounts, the UI does the filter).

## User-type visibility (sidebar)

[CODE] `apps/host-shell/src/app/layout/layout.component.ts:397-405`:

```typescript
{
  label: 'Testing Charging Lab',
  path: this.admin_console_PATH_TESTING_CHARGING,
  iconClass: FALCON_ICONS.SETTINGS,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: userType === USER_TYPE_STRINGS.CLIENT_USER
}
```

- The link is shown only when the user's session has `userType === FALCON_USER`
- Client users do not see the link at all; even if they URL-hack to `/admin-console/testing/charging`, the parent `adminConsoleGuard` denies them (client users do not have `view` on `app.admin-console`)

## Feature flags

[INFERRED] The component's failure-state copy reveals a backend feature-flag dependency:

- `testing-charging.component.ts:129`: *"Unable to load testing accounts. Verify TestingCharging is enabled in system-gateway and charging settings."*
- `testing-charging.component.ts:239`: *"Batch creation failed. Check account strategy, active contract rates, Redis state, and wallet balance."*
- `testing-charging.component.ts:258`: *"Delivery trigger failed. Re-open the run to verify if OCS already processed some callbacks."*

So the **TestingCharging** subsystem is enabled/disabled at **both** the system-gateway and the charging service level via configuration — no frontend toggle exists. If the flag is off, the `getAccounts` call returns an error and the UI surfaces the message above.

## Summary

- In-feature permission keys: **0**
- Inherited route guards: **1** (`adminConsoleGuard` from app-level wrapper)
- Eligibility filters: **1** (`walletStrategyConfigured` client-side)
- User-type visibility filter: **1** (`requiredUserTypes: [FALCON_USER]` at sidebar)
- Backend feature flags: **1 implicit** (TestingCharging on system-gateway + charging)
