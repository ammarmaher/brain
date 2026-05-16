# Routing — testing-charging

## Routes

| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/admin-console/testing/charging` | `TestingChargingComponent` | yes (`loadComponent`) | `adminConsoleGuard` (inherited from `app.routes.ts:8`) | none | none |

[CODE] The feature is registered as a **nested child route** — parent `path: 'testing'` (no component) with one child `path: 'charging'`. Source: `apps/admin-console/src/app/features/routes.ts:62-75`:

```typescript
{
  path: 'testing',
  children: [
    {
      path: 'charging',
      loadComponent: () =>
        import('./testing-charging/testing-charging.component')
          .then(m => m.TestingChargingComponent),
      data: {
        breadcrumb: 'Testing Charging Lab',
      },
    },
  ],
},
```

[CODE] No `canActivate: [shellAccessGuard]` is declared on this route, and no `data.access` is set — unlike every other admin-console feature (`organization-hierarchy`, `comm-mgmt`, `marketplace-applications`, `wallet-balance-management`, `contact-groups`) which all declare `shellAccessGuard`. Source: `apps/admin-console/src/app/features/routes.ts:11-95`.

## Route module

- Feature loader: `loadComponent: () => import('./testing-charging/testing-charging.component').then(m => m.TestingChargingComponent)` — `apps/admin-console/src/app/features/routes.ts:67-69`
- Parent route mount: `apps/admin-console/src/app/app.routes.ts:5-15` — wraps every admin-console child under `canActivate: [adminConsoleGuard]`
- Full path resolution: `${APP_ROUTES.admin_console_BASE}/testing/charging` → `/admin-console/testing/charging` (constant from `libs/falcon/src/shared-types/lib/constants/route-scope.constants.ts:17`)

## Guard implementations

### adminConsoleGuard (inherited — applies to every admin-console route)

[CODE] File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`:

```typescript
export const adminConsoleGuard: CanActivateFn = async () => {
  const facade = inject(AccessControlFacade);
  const router = inject(Router);
  const query = FalconAccess.adminConsole.enter();   // { action: 'view', resource: 'app.admin-console' }

  try {
    await facade.ensure(query);
    return facade.can(query)
      ? true
      : router.createUrlTree([APP_ROUTES.UNAUTHORIZED]);
  } catch {
    return router.createUrlTree([APP_ROUTES.ERROR]);
  }
};
```

- Verb: `view`
- Resource: `app.admin-console`
- Resolves: `FalconAccess.adminConsole.enter()` (defined at `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:89-90`)
- On deny: `UrlTree → /401` (constant `APP_ROUTES.UNAUTHORIZED`)
- On failure: `UrlTree → /error`

### shellAccessGuard — NOT applied

[INFERRED] Because no `data.access` is configured on the `charging` route and no `shellAccessGuard` is listed in `canActivate`, the only PBAC gate enforced at the route level is the parent `adminConsoleGuard`. The feature is effectively "anyone with `view` on `app.admin-console` AND a Falcon user (per the sidebar `requiredUserTypes` filter) can reach it." This matches the **Falcon-internal QA tool** intent — there is no per-resource permission for the testing surface itself.

## Resolver implementations

None — data is fetched in the component's `ngOnInit` via `loadAccounts()` and on-demand via `selectAccount() → loadAccountDetails()`.

## Breadcrumb

[CODE] `data.breadcrumb: 'Testing Charging Lab'` — `apps/admin-console/src/app/features/routes.ts:72`. Picked up by the host-shell breadcrumb component walking route data.

## Sidebar navigation entry

[CODE] `apps/host-shell/src/app/layout/layout.component.ts:397-405`:

```typescript
{
  label: 'Testing Charging Lab',
  path: this.admin_console_PATH_TESTING_CHARGING,   // '/admin-console/testing/charging'
  iconClass: FALCON_ICONS.SETTINGS,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: userType === USER_TYPE_STRINGS.CLIENT_USER
},
```

- Icon: `FALCON_ICONS.SETTINGS`
- Section: `Account Administration`
- Visibility: hidden for client users; shown to Falcon users only
- No `access:` query → no extra PBAC required for the link itself (visibility is purely user-type based)
