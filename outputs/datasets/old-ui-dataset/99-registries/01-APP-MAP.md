---
title: App Route Map — Old UI (origin/main @ 803ac1d1)
type: registry
registry: app-map
source: aggregated from 10-pages/ deep-dives (origin/main @ 803ac1d1)
extracted: 2026-05-16
extracted-by: aggregation-agent
total_apps: 3
total_static_routes: 33
total_dynamic_remotes: 4
---

# Old UI — App Route Map

## TL;DR
- **3 Angular applications**: `host-shell` (port 4200), `admin-console` (Falcon-user remote), `management-console` (Client-user remote).
- **Hosting model**: host-shell loads admin-console + management-console as **dynamic Module Federation remotes** at runtime via `RemoteRouteService` + `module-federation.manifest.json`. Two dev-only remotes additionally declared (`External-app` → `/user-settings`, `mfe-app` → `/survey-container`); both `active: false` in prod manifest.
- **Path conventions**: hash-based URLs (`HashLocationStrategy` provided in host `app.config.ts:53`). Top-level segments: `/login/*`, `/profile/*`, `/auth-view`, `/shell`, `/401`, `/not-found`, `/error`, `/admin-console/*`, `/management-console/*` (the last two attached dynamically).
- **Guard chain (defense-in-depth)**:
  1. host root → `authGuard` + `shellPrimeAccessGuard`
  2. dynamic remote `canMatch` → `shellAccessMatchGuard`
  3. remote-app root → `adminConsoleGuard` OR `managementConsoleGuard`
  4. per-route → `shellAccessGuard` reads `data.access` (no-op when absent)

---

## host-shell (port 4200) — `apps/host-shell/src/app/app.routes.ts`

App-level providers:
- `provideRouter(appRoutes, withDisabledInitialNavigation())` — initial nav deferred until MF remotes register.
- `{ provide: LocationStrategy, useClass: HashLocationStrategy }` — hash-routing.
- No `provideAppDefaultGateway()` at host level — gateway selection deferred per call.

Layout-shell guard chain (`apps/host-shell/src/app/app.routes.ts:13-78`): `authGuard` (`core/guards/auth.guard.ts:10-23`) then `shellPrimeAccessGuard` (from `@falcon`, picks `SHELL_CORE_ACCESS` token based on userType).

| # | Path | Component | Lazy? | Guards (in order) | Data | Source |
|---|---|---|---|---|---|---|
| 1 | `''` (root) | `LayoutComponent` | no | `authGuard`, `shellPrimeAccessGuard` | — | `app.routes.ts:13-78` |
| 2 | `''` (child of root) | `DashboardComponent` | no | (inherits) | `breadcrumb: 'Dashboard'` | `app.routes.ts:19-24` |
| 3 | `shell` (child) | `ShellComponent` (Demo) | no | (inherits) | `breadcrumb: 'Shell '` | `app.routes.ts:25-30` |
| 4 | `auth-view` (child) | `AuthViewComponent` (Demo) | no | `shellAccessGuard` | `breadcrumb: 'Auth View'`, `access: FalconAccess.authView.view()` | `app.routes.ts:31-38` |
| 5 | `profile` (child) | `UserProfileComponent` | no | (inherits) | `breadcrumb: 'User Profile'` | `app.routes.ts:39-44` |
| 6 | `profile/:nodeId` (child) | `UserProfileComponent` | no | (inherits) | `breadcrumb: 'User Profile'`, `nodeId` param | `app.routes.ts:45-52` |
| 7 | `401` (top-level) | `UnauthorizedComponent` | no | — | `breadcrumb: 'Unauthorized'` | `app.routes.ts:57-61` |
| 8 | `not-found` (top-level) | `NotFoundComponent` | no | — | `breadcrumb: 'Not Found'` | `app.routes.ts:62-66` |
| 9 | `error` (top-level) | `ErrorComponent` | no | — | `breadcrumb: 'Error'` | `app.routes.ts:67-71` |
| 10 | `login` (top-level) | `LoginLayoutComponent` shell | **yes** (`loadChildren`) | — | loads `features/auth/auth.routes#AUTH_ROUTES` | `app.routes.ts:73-76` |
| 11 | `**` | redirect to `''` | no | — | — | `app.routes.ts:77` |

### Lazy auth-flow routes (`features/auth/auth.routes.ts:10-32`)

| # | Path | Component | Guards | Source |
|---|---|---|---|---|
| 12 | `login/` (parent) | `LoginLayoutComponent` | — | `auth.routes.ts:10-32` |
| 13 | `login/` (default child) | `GetStartedComponent` | — | (same) |
| 14 | `login/verify-otp` | `EnterOtpComponent` | `otpGuard` | `otp.guard.ts:10-20` |
| 15 | `login/change-password` | `ChangePasswordComponent` | `changePasswordGuard` | `change-password.guard.ts:10-20` |
| 16 | `login/forgot-password` | `ForgotPasswordFlowComponent` | — | (same) |

### Cross-app deep-link query/state contract for `/profile`

`/profile` and `/profile/:nodeId` accept query params `?mode=view|edit|add|add-wizard`, `?nodeId=<id>`, `?orgNodeId=<id>` and history state `{ showTree?: boolean, orgNodeLabel?: string, orgNodeIconUrl?: string, expandPath?: string[], sourceRoute?: string, selectNodeId?: string }`. Wired by `OrganizationHierarchyComponent.onUserSelected` and mgmt's equivalent; reads via `UserProfileComponent.onRouteParamsChanged` (`user-profile.component.ts:980-994`).

---

## admin-console (Falcon-user MF remote) — `apps/admin-console/src/app/app.routes.ts`

App-level providers:
- `provideAppDefaultGateway(Gateway.SystemGateway)` (`app.config.ts:52`) — every `useGateway()` without arg resolves to **System Gateway**.
- Module-Federation: `apps/admin-console/module-federation.config.ts` — `exposes: { './admin-console': '...' }`.

Root guard (`app.routes.ts:5-15`):
```typescript
{ path: '', canActivate: [adminConsoleGuard], children: [...accountAdministrationRoutes] }
{ path: '**', redirectTo: '' }
```

Defined at `apps/admin-console/src/app/features/routes.ts` (7 feature routes).

| # | Path | Component | Lazy? | Guards | data.access | Breadcrumb | Source |
|---|---|---|---|---|---|---|---|
| 17 | `organization-hierarchy` | `OrganizationHierarchyComponent` | `loadComponent` | `shellAccessGuard` | `FalconAccess.adminConsole.accountHierarchy.view()` | `Organization Hierarchy` | `routes.ts:11-22` |
| 18 | `comm-mgmt` | `CommsHubComponent` | `loadComponent` | `shellAccessGuard` | **NONE** (guard no-op) | `CommChannels & Services` | `routes.ts:23-32` |
| 19 | `marketplace-applications` | `MarketplaceApplicationsComponent` | `loadComponent` | `shellAccessGuard` | **NONE** (guard no-op) | `Marketplace & Applications` | `routes.ts:33-42` |
| 20 | `contracts-cost-management` | `ContractsCostManagementComponent` | `loadComponent` | **none on route** | — | `Contracts & Cost Management` | `routes.ts:43-51` |
| 21 | `wallet-balance-management` | `WalletBalanceManagementComponent` | `loadComponent` | `shellAccessGuard` | **NONE** (guard no-op) | `Wallet & Balance Management` | `routes.ts:52-61` |
| 22 | `testing` → `charging` (nested) | `TestingChargingComponent` | `loadComponent` | **none on child** | — | `Testing Charging Lab` | `routes.ts:62-75` |
| 23 | `contact-groups` | `ContactGroupsComponent` | `loadComponent` | `shellAccessGuard` | **NONE** (guard no-op) | `Contact Groups` | `routes.ts:77-86` |
| 24 | `contact-groups/:groupId` | `ContactGroupDetailsComponent` | `loadComponent` | `shellAccessGuard` | **NONE** (guard no-op) | `Contact Group Details` | `routes.ts:87-95` |

### Effective gating (after route registration)
- All routes inherit `adminConsoleGuard` (`{action:'view', resource:'app.admin-console'}`) — single entry-gate.
- Only `organization-hierarchy` actually enforces a route-level PES key; every other route is "anyone in admin-console can reach it". Component-level `AccessControlFacade.resolveFlags({...})` calls do the real per-action gating.

---

## management-console (Client-user MF remote) — `apps/management-console/src/app/app.routes.ts`

App-level providers:
- `provideAppDefaultGateway(Gateway.CoreGateway)` (`app.config.ts:52`) — every `useGateway()` without arg resolves to **Core Gateway**.
- Module-Federation: `apps/management-console/module-federation.config.ts` — `exposes: { './management-console': '...' }`.

Root guard (`app.routes.ts:1-29`):
```typescript
{ path: '', canActivate: [managementConsoleGuard], children: [
  ...accountAdministrationRoutes,    // /organization-hierarchy (the unique mgmt feature)
  ...commsHubRoutes,                 // /comm-mgmt
  ...marketplaceApplicationsRoutes,  // /marketplace-applications
  ...contractsCostManagementRoutes,  // /contracts-cost-management
  ...walletBalanceManagementRoutes,  // /wallet-balance-management
  ...contactGroupsRoutes,            // /contact-groups
]}
```

| # | Path | Component | Lazy? | Guards | data.access | Notes / Source |
|---|---|---|---|---|---|---|
| 25 | `organization-hierarchy` | `OrganizationHierarchyComponent` | **eager** (`component:`) | `shellAccessGuard` | `FalconAccess.managementConsole.accountHierarchy.view()` | `account-administration/routes.ts:18-28` — the ONE feature unique to mgmt |
| 26 | `comm-mgmt` (parent renders `CommsHubComponent`) | `CommsHubComponent` | **eager** | `shellAccessGuard` | `FalconAccess.managementConsole.services.view()` | Includes 3 placeholder children redirected to `/not-found`: `whatsapp-business`, `voice-service`, `ai` |
| 27 | `comm-mgmt/whatsapp-business` | (redirect → `/not-found`) | — | — | — | placeholder |
| 28 | `comm-mgmt/voice-service` | (redirect → `/not-found`) | — | — | — | placeholder |
| 29 | `comm-mgmt/ai` | (redirect → `/not-found`) | — | — | — | placeholder |
| 30 | `marketplace-applications` | `MarketplaceApplicationsComponent` | **eager** | `shellAccessGuard` | `FalconAccess.managementConsole.services.view()` | mgmt-only AI Agent Builder route placeholder declared but not implemented |
| 31 | `contracts-cost-management` | `ContractsCostManagementComponent` | `loadComponent` | **none on route** | `FalconAccess.managementConsole.contract.view()` (declared but unenforced — no guard) | view-only; reuses admin-console contracts via cross-app sibling import |
| 32 | `wallet-balance-management` | `WalletBalanceManagementComponent` | **eager** | **NO `shellAccessGuard`** (only app-level guard) | — | most permissive route in mgmt |
| 33 | `contact-groups` (parent) | `ContactGroupsComponent` | `loadComponent` | `shellAccessGuard` | — | 3 nested children below |
| 33a | `contact-groups/` (default child) | `ContactGroupsListComponent` | `loadComponent` | (inherits) | — | list |
| 33b | `contact-groups/create` | `CreateContactGroupComponent` | `loadComponent` | (inherits) | — | 5-step create wizard (admin doesn't have this) |
| 33c | `contact-groups/:groupId` | `ContactGroupDetailsComponent` | `loadComponent` | (inherits) | — | detail (also unique-shape vs admin) |

---

## Dynamic Module Federation manifest — `apps/host-shell/src/assets/module-federation.manifest.json`

Resolved at bootstrap by `RemoteRouteService` (`core/services/remote-route.service.ts:33-44, 149/203/234/265/297`). Each remote receives `canMatch: [shellAccessMatchGuard]` reading `data.access` and `data.remoteName`.

| Remote name | Route path | Exposed module | `data.access` (`AccessQuery`) | `exposeType` | `entryType` | Prod active? |
|---|---|---|---|---|---|---|
| `management_console` | `/management-console` | `./management-console` | `app.management-console:view` | `routes` | `remoteEntry` | yes |
| `admin_console` | `/admin-console` | `./admin-console` | `app.admin-console:view` | `routes` | `remoteEntry` | yes |
| `External-app` (demo) | `/user-settings` | `./users` | `microapp.user-settings:view` | `component` | `remoteEntry` | **no** (`active: false` in `module-federation.manifest.prod.json:1-56`) |
| `mfe-app` (user-app) | `/survey-container` | `./survey` | `microapp.survey-container:view` | `module` | `remoteEntry` | **no** |

---

## Guard implementations (cross-app)

### `authGuard` — `apps/host-shell/src/app/core/guards/auth.guard.ts:10-23`
```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authenticated) return true;
  return router.createUrlTree(['/login']);
};
```

### `shellPrimeAccessGuard` (from `@falcon`)
Reads `SHELL_CORE_ACCESS` token. Token factory (`apps/host-shell/src/app/app.config.ts:72-81`):
- `userType=2` (CLIENT_USER) → `[FalconAccess.managementConsole.enter()]`
- other → `[FalconAccess.adminConsole.enter()]`

### `shellAccessGuard` — `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-100`
Reads `route.data['access']` (a `AccessQuery` or `AccessQuery[]`), `await facade.ensure(queries)`, returns `true` iff every `facade.can(q)` resolves truthy. Empty queries → `true` (no-op).

### `shellAccessMatchGuard` (from `@falcon`)
Applied via `canMatch` on dynamic remote routes. Same eval logic as `shellAccessGuard` but at module-load time.

### `adminConsoleGuard` — `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`
Checks `FalconAccess.adminConsole.enter()` (`{action:'view', resource:'app.admin-console'}`). On miss → `APP_ROUTES.UNAUTHORIZED`; on throw → `APP_ROUTES.ERROR`.

### `managementConsoleGuard` (from `@falcon`)
Mirror of `adminConsoleGuard` but for `FalconAccess.managementConsole.enter()`.

### `otpGuard` — `features/auth/guards/otp.guard.ts:10-20`
Allows `/login/verify-otp` only when `AuthFlowStateService.getTempSession().sessionId` exists.

### `changePasswordGuard` — `features/auth/guards/change-password.guard.ts:10-20`
Allows `/login/change-password` only when `sessionId && firstLogin === true`.

---

## Cross-app navigation patterns

- **Admin → User Profile**: `router.navigate(['/profile'], { queryParams: { nodeId, orgNodeId, mode? }, state: { showTree, expandPath, orgNodeLabel, orgNodeIconUrl, sourceRoute } })` — from `organization-hierarchy.component.ts:411-429` (admin) and `account-administration/.../organization-hierarchy.component.ts:165+` (mgmt).
- **Add-user wizard from org tree**: `?mode=add-wizard&nodeId={nodeId}&orgNodeId={nodeId}`.
- **Return-from-profile auto-expand**: `/profile`'s tree-onClick navigates back to the source route with `state: { selectNodeId, expandPath }` — receiver components read `window.history.state` in `ngOnInit`.
- **Module Federation remote loading**: `module-federation.manifest.json` (4 declared, 2 active in prod). Loaded by `loadRemoteModule({ remoteEntry, exposedModule, exposeType })` and merged into router state.

## Routing inconsistencies / surprises

- **`shellAccessGuard` declared without `data.access`** on 5 of 7 admin-console feature routes and on `contracts-cost-management` + `wallet-balance-management` mgmt-side — guard runs but evaluates zero queries and short-circuits to `return true`. Effective gating is in-component via `AccessControlFacade.resolveFlags()`. Flagged as GAP-OLDUI-01.
- **`testing/charging` route** declares neither `shellAccessGuard` nor `data.access` — only the app-level `adminConsoleGuard`. Falcon-user-only visibility is enforced by the sidebar `requiredUserTypes: [FALCON_USER]`, not the router.
- **Admin lazy / Mgmt eager** — admin-console uses `loadComponent` for every feature, mgmt-console uses synchronous `component:` for 4 of 6 features (account-administration, comm-mgmt, marketplace-applications, wallet-balance-management). Inconsistent bundling strategy.
- **Mgmt `contract.view` declared but unenforced** — `contracts-cost-management` mgmt-side sets `data.access: FalconAccess.managementConsole.contract.view()` but never applies `shellAccessGuard`, so the key is informational only.
- **Mgmt `wallet-balance-management` has zero route-level PES** — relies entirely on app-level `managementConsoleGuard` plus server-driven `canSave: boolean` in the wallet response.
- **No common `catch-all** in admin/mgmt remote roots — both redirect `**` to `''`, so a stray sub-path like `/admin-console/garbage` lands on the remote's empty root (which has no default component) rather than `/not-found`.
- **Mgmt comms-hub placeholder children** redirect to `/not-found` — placeholder routes for `whatsapp-business`/`voice-service`/`ai` that exist only as future scaffolding.
