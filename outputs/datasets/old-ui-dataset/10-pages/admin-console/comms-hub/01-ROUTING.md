# Routing — comms-hub

## Final URL

`/admin-console/comm-mgmt` — confirmed by:
- Admin-console base path is `/admin-console` ([CODE] `libs/falcon/src/shared-types/lib/constants/route-scope.constants.ts:17` — `admin_console_BASE: '/admin-console'`).
- Feature is mounted under that base at child path `comm-mgmt` ([CODE] `apps/admin-console/src/app/features/routes.ts:24` — `path: 'comm-mgmt'`).
- Host-shell constructs the same link string for navigation: [CODE] `apps/host-shell/src/app/layout/layout.component.ts:75` — `admin_console_PATH_COMM_MGMT = \`${APP_ROUTES.admin_console_BASE}/comm-mgmt\``.

Note that the **path segment is `comm-mgmt`**, not `comms-hub`. The folder name in source is `comms-hub` only as the implementation namespace.

## Routes

| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `''` (admin-console root) | (none — wrapper) | n/a | `adminConsoleGuard` | none | none |
| `comm-mgmt` (child) | `CommsHubComponent` | yes (`loadComponent`) | `shellAccessGuard` | none | none |

## Route module

- File: `apps/admin-console/src/app/features/routes.ts:23-32`
- Loader:
  ```typescript
  {
    path: 'comm-mgmt',
    canActivate: [shellAccessGuard],
    loadComponent: () =>
      import('./comms-hub/comms-hub.component')
        .then(m => m.CommsHubComponent),
    data: {
      breadcrumb: 'CommChannels & Services',
    },
  }
  ```
- **No `data.access` block** — unlike the sibling `organization-hierarchy` route which passes `access: FalconAccess.adminConsole.accountHierarchy.view()` ([CODE] `apps/admin-console/src/app/features/routes.ts:18-21`). For `comm-mgmt`, `shellAccessGuard` runs but with zero queries, which means it short-circuits to `return true` ([CODE] `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:85-87`). Capability gating is therefore deferred to the component (see PES doc).
- Parent route: `apps/admin-console/src/app/app.routes.ts:5-15` — all admin-console routes are wrapped in `canActivate: [adminConsoleGuard]`.

## Guard implementations

### `adminConsoleGuard` (parent-level)

File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`

```typescript
export const adminConsoleGuard: CanActivateFn = async () => {
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
};
```

Resolves `FalconAccess.adminConsole.enter()` → `{ action: 'view', resource: 'app.admin-console' }` ([CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:90`). Forces a `facade.ensure` pre-flight, then returns `UrlTree('/401')` on negative decision.

### `shellAccessGuard` (route-level)

File: `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52, 84-100`

```typescript
export const shellAccessGuard: CanActivateFn = async (route) => {
  const queries = resolveActivateQueries(route);
  return evaluateQueries(queries);
};

async function evaluateQueries(queries: AccessQuery[]): Promise<boolean | UrlTree> {
  if (!queries.length) return true;
  const facade = inject(AccessControlFacade);
  const router = inject(Router);
  try {
    await facade.ensure(queries);
    return queries.every((query) => facade.can(query))
      ? true
      : router.createUrlTree([APP_ROUTES.UNAUTHORIZED]);
  } catch {
    return router.createUrlTree([APP_ROUTES.ERROR]);
  }
}
```

Reads `route.data['access']` ([CODE] `shell-access.guard.ts:60`). Because `comm-mgmt` does **not** provide a `data.access`, the resolved queries array is empty and the guard immediately returns `true`.

## Resolver implementations

**None.** The component owns its own data loading via `ngOnInit → loadRoot()` (tree) and `onNodeSelect → loadData()` (table). See `comms-hub.component.ts:226-236` and `comms-hub.component.ts:1111-1142`.

## Navigation entry point

Host-shell builds nav items that point at `/admin-console/comm-mgmt` for Falcon users — [CODE] `apps/host-shell/src/app/layout/layout.component.ts:75`. (The mirror `management_console_PATH_COMM_MGMT` for client users is at line 81.)
