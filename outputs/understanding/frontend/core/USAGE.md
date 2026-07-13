# @falcon/core — USAGE

> Real codebase examples (file:line) + recommended new usage + Do/Don't + grep-verified Consumer Sweep.

## 1. Gating a whole console remote (console guards)

```ts
// apps/admin-console/src/app/app.routes.ts:1-15
import { adminConsoleGuard } from '@falcon';
export const appRoutes: Routes = [
  { path: '', canActivate: [adminConsoleGuard], children: [ /* … */ ] },
];
```
[CODE] `apps/admin-console/src/app/app.routes.ts:14` · [CODE] `apps/management-console/src/app/app.routes.ts:25` (`managementConsoleGuard`). One guard per remote; resolves `app.<console>` `view` via PES.

## 2. Preloading shell-entry permissions (`shellPrimeAccessGuard` + token)

```ts
// apps/host-shell/src/app/app.routes.ts:13
{ path: '', component: LayoutComponent, canActivate: [authGuard, shellPrimeAccessGuard], children: [...] }
```
Paired with the `SHELL_CORE_ACCESS` provider, which picks the query by user-type:
```ts
// apps/host-shell/src/app/app.config.ts:122-132
{ provide: SHELL_CORE_ACCESS, deps: [SessionProvider],
  useFactory: (sp: SessionProvider) =>
    String(sp.session?.userType ?? '').trim() === USER_TYPE_STRINGS.CLIENT_USER
      ? [FalconAccess.managementConsole.enter()]
      : [FalconAccess.adminConsole.enter()] }
```
[CODE] `apps/host-shell/src/app/app.config.ts:122-132`. Note `authGuard` (authentication) runs FIRST, then `shellPrimeAccessGuard` (authorization preload). `authGuard` is **app-level** (`apps/host-shell/.../core/guards/auth.guard.ts`), not core.

## 3. Per-route defense-in-depth (`shellAccessGuard` + `data.access`)

```ts
// apps/management-console/src/app/app.routes.ts:93-100
{ path: 'contracts-cost-management',
  canActivate: [shellAccessGuard],
  data: { access: FalconAccess.managementConsole.contract.view() },
  loadChildren: () => import('./features/contracts-cost-management/...') }
```
[CODE] `apps/management-console/src/app/app.routes.ts:94,112`. The query factory comes from `FalconAccess` (shared-types), the guard from `@falcon/core`. `data.access` accepts a single `AccessQuery`, an array, or a `(route)=>AccessQuery` function. Used in 12 `*.routes.ts` files (Consumer Sweep §B).

## 4. In-component permission flags (`AccessControlFacade.resolveFlags`)

```ts
// pattern across feature services (e.g. add-user-wizard.component.ts)
private acl = inject(AccessControlFacade);
async ngOnInit() {
  const flags = await this.acl.resolveFlags({
    canAddUser: FalconAccess.adminConsole.user.add(),
    canAssignGroup: FalconAccess.adminConsole.userPermissionGroup.assign(),
  });
  this.canAddUser.set(flags.canAddUser); // fail-closed: all false if PES throws
}
```
[CODE] consumers: `apps/admin-console/.../add-user-wizard/add-user-wizard.component.ts`, `apps/admin-console/.../new-wallet-balance/services/wallet.service.ts`, `apps/host-shell/.../service-pricing/service-pricing.component.ts`, `apps/host-shell/.../organization-hierarchy-tree/...`, `libs/falcon/src/shared-features/user-details/signals/signals.ts`. `resolveFlags` is the preferred component API — it `ensure`s + reads in one call and is **fail-closed** (all-false on error). [CODE] `access-control.facade.ts:68-83`

## 5. Reading the session

```ts
// apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts
private session = inject(SessionProvider);
const tenant = this.session.session?.tenantId;
// reactive:
this.session.session$.pipe(takeUntilDestroyed()).subscribe(s => { /* … */ });
```
[CODE] consumers: `auth.service.ts` (writes via `setFromToken`/`clear`), `order-status-realtime.service.ts`, `remote-route.service.ts`, layout, dashboard, org-hierarchy services. Prefer `session$` + `takeUntilDestroyed()` in components; the synchronous `session` getter is fine in services/guards.

## 6. Fetching the org node

```ts
// apps/host-shell/src/app/core/auth/auth.service.ts (post-login)
this.nodeService.getNode().subscribe(res => {
  if (res.isSuccessful && res.data?.[0]) this.sessionProvider.setNode(res.data[0]);
});
```
[CODE] `node.service.ts:23-28` returns `ServiceOperationResult<OrgHierarchyNode[]>`; AuthService stores the first element via `SessionProvider.setNode()`.

## Recommended NEW usage

1. **New protected route** → `canActivate:[shellAccessGuard]` + `data.access: FalconAccess.<area>.<action>()`. Add the query factory to `FalconAccess` if it does not exist (do NOT hand-roll `{action,resource}` inline). Pair at BOTH parent + child route for true defense-in-depth (the contracts/contact-groups precedent).
2. **New UI flag** → inject `AccessControlFacade`, `resolveFlags({...})` in an `async` init, drive a `signal`. Never `can()` without a prior `ensure`/`resolveFlags` (it returns `false` until the decision is cached).
3. **Reading identity** → `SessionProvider`. Use `identityUserId` for ownership comparisons, `subjectId` for the Zitadel sub, `tenantId` for tenancy. Do NOT re-decode the JWT yourself.
4. **DI** → use `inject()` (the area itself does; `SessionProvider`/`NodeService`/`AccessControlClient` use a mix — see AUDIT G1).

## Do / Don't

| Do | Don't |
|---|---|
| Use `FalconAccess.<…>()` factories for every query. | Inline `{ action:'view', resource:'…' }` (drifts from the registry; breaks `accessKey` dedupe consistency). |
| `resolveFlags()` for component flags. | Call `facade.can()` before `ensure()` (returns false-negative). |
| Pair `shellAccessGuard` parent+child for sensitive features. | Rely on menu-hiding alone (the R-1 gap the contracts feature explicitly closed — `app.routes.ts:89-91`). |
| Prefer PES guards (`adminConsoleGuard`) for new gates. | Add new uses of `adminOrganizationHierarchyGuard` (`@deprecated`) or `RouteAccessService` for per-resource gating. |
| Let `AccessControlClient` build the absolute PES URL. | Route PES through `useGateway()`/relative URLs (the client throws on purpose). |
| Use `identityUserId` for ownership, `subjectId` for sub. | Use `session.login` (forced `null`; sub-first authz). |

## Consumer Sweep — 2026-06-03 (grep-verified)

Total: **92 files / 310 occurrences** matching `\b(adminConsoleGuard|managementConsoleGuard|adminOrganizationHierarchyGuard|shellPrimeAccessGuard|shellAccessGuard|shellAccessMatchGuard|SHELL_CORE_ACCESS|AccessControlFacade|AccessControlStore|AccessControlClient|CurrentSubjectBuilder|SessionProvider|RouteAccessService|NodeService|UserSession)\b` across `apps/` + `libs/` (`.ts`). Source-files (excludes the 15 core files themselves):

### A. `AccessControlFacade` — 36 files (33 app + 1 lib + 2 specs, minus 3 core)
Headline consumers: `apps/admin-console/.../new-wallet-balance/services/wallet.service.ts`, `apps/{admin,management}-console/.../wallet-balance-management/...`, `apps/{admin,management}-console/.../contact-groups/{models,contact-group-detail,contact-groups-list}`, `apps/{admin,management}-console/.../org-hierarchy-page/.../settings-tab/signals` + `falcon-org-info-panel/signals`, `apps/management-console/.../org-hierarchy-page/services/{state/users-state.signals,hierarchy-page-state.service}`, `apps/{admin,management}-console/.../add-user-wizard/add-user-wizard.component.ts`, `apps/management-console/.../balance-transfer.component.ts`, `apps/host-shell/.../service-pricing/service-pricing.component.ts`, `apps/host-shell/.../organization-hierarchy-tree/organization-hierarchy-tree.component.ts`, `apps/host-shell/.../layout/layout.component.ts`, `libs/falcon/src/shared-features/user-details/signals/signals.ts`. Specs: `apps/admin-console/tests/contracts/...`, `apps/admin-console/.../new-wallet-balance/__tests__/pes-gating.spec.ts`.

### B. `shellAccessGuard` / `shellAccessMatchGuard` — 12 `*.routes.ts` files
`apps/{admin,management}-console/src/app/app.routes.ts`, `apps/{admin,management}-console/.../contact-groups/contact-groups.routes.ts`, `apps/{admin,management}-console/.../contracts-cost-management/...routes.ts`, `apps/{admin,management}-console/.../org-hierarchy-page/...routes.ts`, `apps/management-console/.../{marketplace-applications,comms-hub,wallet-balance-management,new-wallet-balance}/...routes.ts`.

### C. Console guards — 3 files
`apps/admin-console/src/app/app.routes.ts` (`adminConsoleGuard`), `apps/management-console/src/app/app.routes.ts` (`managementConsoleGuard`); `adminOrganizationHierarchyGuard` exported but **no live route consumer found** (deprecated; only the definition + barrel).

### D. `SHELL_CORE_ACCESS` — 1 file
`apps/host-shell/src/app/app.config.ts` (provider) + `apps/host-shell/src/app/app.routes.ts` (`shellPrimeAccessGuard` consumes it).

### E. `SessionProvider` — broad (~25+ files)
host-shell: `app.config.ts`, `auth/auth.service.ts`, `user/{user-api,current-user}.service.ts`, `realtime/{order-status-realtime.service,order-status-gateway.util}`, `services/remote-route.service.ts`, `layout/{layout.component,model/models}`, `shared-components/{organization-hierarchy-tree,service-pricing}/...`, `dashboard.component.ts`. Plus org-hierarchy services in both remotes, `RuntimeBaseUrlInterceptor` (L04, injects `SessionProvider` for the gateway fallback). `UserSession` type imported in models across both remotes.

### F. `RouteAccessService` / `NodeService` — low (legacy/narrow)
`RouteAccessService` chiefly via the deprecated guard + layout nav-link checks. `NodeService` via `auth.service.ts`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L02). Examples cite live file:line. Consumer Sweep is the union of two greps (broad symbol count = 92 files/310 occ; `AccessControlFacade`-only = 36 files; `shellAccessGuard` in routes = 12 files), de-duplicated against the 15 core source files.
