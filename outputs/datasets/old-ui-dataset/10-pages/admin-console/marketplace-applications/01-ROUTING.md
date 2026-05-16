# Routing — marketplace-applications

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/admin-console/marketplace-applications` (mounted under admin-console remote) | `MarketplaceApplicationsComponent` | yes (`loadComponent`) | parent `adminConsoleGuard` + own `shellAccessGuard` (no-op — see below) | none | none |

## Route module
- File: `apps/admin-console/src/app/features/routes.ts:33-42`
- Loader (verbatim):
```typescript
{
  path: 'marketplace-applications',
  canActivate: [shellAccessGuard],
  loadComponent: () =>
    import('./marketplace-applications/marketplace-applications.component')
      .then(m => m.MarketplaceApplicationsComponent),
  data: {
    breadcrumb: 'Marketplace & Applications',
  },
},
```
- Parent: `apps/admin-console/src/app/app.routes.ts:6-15` wraps every child in `canActivate: [adminConsoleGuard]`.

## Guard implementations

### `adminConsoleGuard` (parent)
File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`. See [[contracts-cost-management/01-ROUTING|sibling]] for full quote — enforces `FalconAccess.adminConsole.enter()` = `{ action: 'view', resource: 'app.admin-console' }`.

### `shellAccessGuard` — declared but effectively a no-op for this route
File: `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52` + `59-67`.

```typescript
export const shellAccessGuard: CanActivateFn = async (route) => {
  const queries = resolveActivateQueries(route);
  return evaluateQueries(queries);
};

function resolveActivateQueries(route: ActivatedRouteSnapshot): AccessQuery[] {
  const access = route.data['access'] as ActivateRouteAccess | undefined;
  if (!access) {
    return [];
  }
  ...
}

async function evaluateQueries(queries: AccessQuery[]): Promise<boolean | UrlTree> {
  if (!queries.length) {
    return true;
  }
  ...
}
```

The route declares `data: { breadcrumb: '...' }` but **does not declare `data.access`**, so `resolveActivateQueries` returns `[]` and `evaluateQueries` short-circuits to `true`. The guard runs but enforces nothing — only the breadcrumb metadata is meaningful here.

[INFERRED] The author likely intended to add `data.access: FalconAccess.adminConsole.services.view()` (similar to `organization-hierarchy` which sets `data.access: FalconAccess.adminConsole.accountHierarchy.view()`). This is a PES gap. Actual PES gating happens inside the component via `primeAccess()` → `AccessControlFacade.resolveFlags({...})` ([[05-PES]]) — but those flags only hide buttons, they do not block route activation.

## Resolver implementations
None. Data is loaded inside `ngOnInit` (`primeAccess()` + `loadRoot()`).

## Browser-visible URL
[INFERRED] `/admin-console/marketplace-applications`.

## Comparison with sibling routes
| Route | Has `data.access`? | Effective PES gate at route level? |
|---|---|---|
| `organization-hierarchy` | yes (`FalconAccess.adminConsole.accountHierarchy.view()`) | yes |
| `marketplace-applications` | **no** | no (only `adminConsoleGuard`) |
| `comm-mgmt` | no | no |
| `contracts-cost-management` | no (and no `shellAccessGuard` either) | no |
| `wallet-balance-management` | no | no |
| `contact-groups` | no | no |
