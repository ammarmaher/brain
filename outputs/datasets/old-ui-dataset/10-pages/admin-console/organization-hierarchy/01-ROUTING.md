# Routing — organization-hierarchy

## Routes
| Path | Component | Lazy? | Guards (in order) | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `/organization-hierarchy` (under admin-console remote) | `OrganizationHierarchyComponent` | yes (`loadComponent`) | `adminConsoleGuard` (root) → `shellAccessGuard` (route) | none | none | `{ breadcrumb: 'Organization Hierarchy', access: FalconAccess.adminConsole.accountHierarchy.view() }` |

Source citations:
- `apps/admin-console/src/app/features/routes.ts:11-22` — `organization-hierarchy` declaration:
  - `path: 'organization-hierarchy'`
  - `canActivate: [shellAccessGuard]`
  - `loadComponent: () => import('./organization-hierarchy/organization-hierarchy.component').then(m => m.OrganizationHierarchyComponent)`
  - `data.access: FalconAccess.adminConsole.accountHierarchy.view()` — resource `'sys.acc-hierarchy'`, action `'view'` (`libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:91-93`)
- `apps/admin-console/src/app/app.routes.ts:5-15` — root route applies `adminConsoleGuard` to all children, then mounts `...accountAdministrationRoutes`.

## Route module
- File: `apps/admin-console/src/app/features/routes.ts:1-96`
- Loader pattern (per night-shift digest): `loadComponent: () => import('./organization-hierarchy/organization-hierarchy.component').then(m => m.OrganizationHierarchyComponent)`
- Exported as default & named in `apps/admin-console/src/app/app.routes.ts:17-19` (`export const routes = appRoutes; export default appRoutes;`) so Module Federation's `remote-route.service.ts findRoutes` method can discover it.

## Guard implementations

### `adminConsoleGuard` (root canActivate)
- File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`
- Logic: defense-in-depth — `facade.ensure(FalconAccess.adminConsole.enter())`, then `facade.can(query)`; on miss redirects to `APP_ROUTES.UNAUTHORIZED`; on throw redirects to `APP_ROUTES.ERROR`. Host-shell has already enforced this before loading the remote — this is the second-layer check.
- Dependencies: `AccessControlFacade`, `Router`, `FalconAccess.adminConsole.enter()` (resource `app.admin-console`, action `view` — `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:90`).

### `shellAccessGuard` (per-route canActivate)
- File: `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52`
- Logic: pulls `route.data['access']` (an `AccessQuery` or function), normalizes to a query array, runs `evaluateQueries(...)`. `evaluateQueries` (lines 84-100) `await facade.ensure(queries)`, returns `true` iff every `facade.can(query)` resolves truthy; on partial miss redirects to `APP_ROUTES.UNAUTHORIZED`; on throw redirects to `APP_ROUTES.ERROR`.
- For this route the access query is `FalconAccess.adminConsole.accountHierarchy.view()` → `{ action: 'view', resource: 'sys.acc-hierarchy' }`.

## Resolver implementations
None. All state hydrates inside the component's `ngOnInit` (`OrganizationHierarchyComponent.ngOnInit` — file `organization-hierarchy.component.ts:135-152`):
1. Read `window.history.state` for `selectNodeId` + `expandPath` (used when returning from `/profile`).
2. Pre-set `selectedNodeId` if `pendingSelectNodeId`.
3. `primeAccess()` → resolves `canAddAccount` (`FalconAccess.adminConsole.account.add()`) and `canEditAccountProfile` (`FalconAccess.adminConsole.accountProfile.edit()`).
4. `loadRoot()` — kicks off the first network call sequence.

## Sibling routes (in same `accountAdministrationRoutes`)
| Path | Component | Guard |
|---|---|---|
| `comm-mgmt` | `CommsHubComponent` | `shellAccessGuard` |
| `marketplace-applications` | `MarketplaceApplicationsComponent` | `shellAccessGuard` |
| `contracts-cost-management` | `ContractsCostManagementComponent` | none |
| `wallet-balance-management` | `WalletBalanceManagementComponent` | `shellAccessGuard` |
| `testing/charging` | `TestingChargingComponent` | none |
| `contact-groups` | `ContactGroupsComponent` | `shellAccessGuard` |
| `contact-groups/:groupId` | `ContactGroupDetailsComponent` | `shellAccessGuard` |

`organization-hierarchy` itself does not have nested child routes — every interaction (add node / edit node / add client wizard / add user) is handled in-page via drawer / wizard / `router.navigate(['/profile'])`.

## Cross-app deep-link
`onUserSelected(user)` (file `organization-hierarchy.component.ts:411-429`) navigates to `/profile` with query params `nodeId, orgNodeId` and history state `{ showTree, expandPath, orgNodeLabel, orgNodeIconUrl, sourceRoute }` — `/profile` is in a different app (host-shell) but reuses the same tree via history state when the user returns. Capture this in `07-CROSS-PAGE.md`.
