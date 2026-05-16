# Routing — wallet-balance-management

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/` (admin-console remote root) | implicit children container | n/a | `adminConsoleGuard` | — | — |
| `/wallet-balance-management` | `WalletBalanceManagementComponent` | yes (`loadComponent`) | `shellAccessGuard` | — | — |

[CODE] `apps/admin-console/src/app/features/routes.ts:53-61`:
```typescript
{
  path: 'wallet-balance-management',
  canActivate: [shellAccessGuard],
  loadComponent: () =>
    import('./wallet-balance-management/wallet-balance-management.component')
      .then(m => m.WalletBalanceManagementComponent),
  data: {
    breadcrumb: 'Wallet & Balance Management',
  },
},
```

[CODE] `apps/admin-console/src/app/app.routes.ts:5-15`:
```typescript
export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [adminConsoleGuard], // Protect all routes under admin-console
    children: [
      // Account Administration routes
      ...accountAdministrationRoutes,
    ],
  },
  { path: '**', redirectTo: '' },
];
```

## Effective deep-link (when mounted from host-shell)
Admin-console is a Module Federation remote, so the effective URL in production is the host route that mounts it + `wallet-balance-management`. [INFERRED] Based on host-shell `app.routes.ts:13-77` the admin-console remote is loaded via the host layout shell at the configured remote path.

## Guard implementations

### `adminConsoleGuard` (parent — entry gate for the remote)
[CODE] `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`:
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
Checks `FalconAccess.adminConsole.enter()` = `{ action: 'view', resource: 'app.admin-console' }` ([CODE] `falcon-access.registry.ts:90`). Unauthorized → `/401`, error → `/error`.

### `shellAccessGuard` (per-route gate)
[CODE] `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52`:
```typescript
export const shellAccessGuard: CanActivateFn = async (route) => {
  const queries = resolveActivateQueries(route);
  return evaluateQueries(queries);
};
```
Reads `data.access` (single query or array). [CODE] `shell-access.guard.ts:84-100`: `await facade.ensure(queries); return queries.every(q => facade.can(q)) ? true : router.createUrlTree([APP_ROUTES.UNAUTHORIZED])`.

[INFERRED] **The wallet-balance-management route declares NO `data.access` value** ([CODE] `routes.ts:53-61` — `data: { breadcrumb: '…' }` only). So `resolveActivateQueries` returns `[]` and `evaluateQueries` short-circuits to `return true`. The fine-grained permission check is enforced in-component via `primeAccess()` (see [[05-PES]]).

## Resolver implementations
None — the component does its own loading in `ngOnInit` (`loadRoot()` and on-node-select `loadWalletData()`).

## Route data
- `breadcrumb: 'Wallet & Balance Management'` — consumed by the breadcrumb component in `LayoutComponent`.
- `access` — NOT supplied (see above).
