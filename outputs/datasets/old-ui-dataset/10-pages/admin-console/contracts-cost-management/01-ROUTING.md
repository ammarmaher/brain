# Routing — contracts-cost-management

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/admin-console/contracts-cost-management` (mounted under admin-console remote) | `ContractsCostManagementComponent` | yes (`loadComponent`) | inherits parent `adminConsoleGuard` only — **no explicit `shellAccessGuard` on the route** | none | none |

## Route module
- File: `apps/admin-console/src/app/features/routes.ts:43-51`
- Loader (verbatim):
```typescript
{
  path: 'contracts-cost-management',
  loadComponent: () =>
    import('./contracts-cost-management/contracts-cost-management.component')
      .then(m => m.ContractsCostManagementComponent),
  data: {
    breadcrumb: 'Contracts & Cost Management',
  },
},
```
- Parent: `apps/admin-console/src/app/app.routes.ts:6-15` wraps every child in `canActivate: [adminConsoleGuard]`. `[CODE]`

## Guard implementations

### `adminConsoleGuard` (parent — file: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`)
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
Comment in file (line 9-12): *"Defense-in-depth guard for the internal admin-console remote. Host-shell now enforces access before the remote loads, but the remote still verifies the same PBAC entry query when activated."*

### `shellAccessGuard` — NOT applied on this route
[CODE] All other admin-console routes (`organization-hierarchy`, `marketplace-applications`, `wallet-balance-management`, `comm-mgmt`, `contact-groups`) list `canActivate: [shellAccessGuard]`. Contracts route does **not** — `apps/admin-console/src/app/features/routes.ts:43-51`. [INFERRED] Either an oversight or PES is enforced inside the component (none found — see [[05-PES]]).

## Resolver implementations
None. Data is loaded inside the component on `onNodeSelect()` (no `RouterStateSnapshot` involvement).

## Browser-visible URL
[INFERRED] The admin-console app is mounted as a Module-Federation remote under the host-shell at `/admin-console/`, so absolute URL: `/admin-console/contracts-cost-management`.
