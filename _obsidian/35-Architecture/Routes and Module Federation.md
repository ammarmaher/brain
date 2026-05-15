---
type: architecture-rules
audit-source: [authGuard, shellPrimeAccessGuard]` and empty `children: []` — remote routes get pushed in at runtime. | high | `apps/host-shell/src/app/app.routes.ts` |
rule-count: 2
created: 2026-05-15
---
*** Architecture Rule Set — Routes and Module Federation ***
*** SoT: Brain Outputs/understanding/frontend/architecture/ROUTES_AND_MF_AUDIT.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Routes and Module Federation

> Host route tree exists in `apps/host-shell/src/app/app.routes.ts` with empty children for `LayoutComponent`; `bootstrap.ts` awaits `RemoteRouteService.reloadRemotes()` BEFORE `router.initialNavigation()`. Each remote exposes a `Routes` array via triple-export. Per-remote routes inherit host's `[authGuard, shellPrimeAccessGuard]`; `shellAccessMatchGuard` enforces `requiredAccess` at canMatch time.

## Source-of-truth file
- [ROUTES_AND_MF_AUDIT](../../outputs/understanding/frontend/architecture/ROUTES_AND_MF_AUDIT.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-route-01 | Host `app.routes.ts` MUST register `LayoutComponent` as root with `canActivate: [authGuard, shellPrimeAccessGuard]` and empty `children: []` — remote routes get pushed in at runtime. | high | `apps/host-shell/src/app/app.routes.ts` |
| AR-route-02 | `provideRouter()` MUST use `withDisabledInitialNavigation()` so bootstrap can register remote routes BEFORE the `**` catch-all fires. | high | `app.config.ts` |
| AR-route-03 | `bootstrap.ts` MUST `await remoteRouteService.reloadRemotes()` BEFORE `router.initialNavigation()` — sequence is critical. | high | `apps/host-shell/src/bootstrap.ts` |
| AR-route-04 | Every dynamic remote route created by `RemoteRouteService.createRemoteRoute()` MUST carry `canMatch: [shellAccessMatchGuard]` + `data: { access: def.requiredAccess ?? [], remoteName: def.name }`. | high | `core/services/remote-route.service.ts:141-145` |
| AR-route-05 | Each remote MUST export routes 3 ways from `entry.routes.ts`: named (`remoteRoutes`), default, and original `routes` — feeds `findRoutes()` priority `m.remoteRoutes ?? m.default ?? m.appRoutes ?? m.routes`. | high | `apps/<remote>/src/app/remote-entry/entry.routes.ts` |
| AR-route-06 | Auth-free DEV routes (`/preview`, `/playground`, `/falcon-ui-showcase`, `/preview-shell/**`, `/preview-hierarchy[-prime]`) MUST live as siblings to `LayoutComponent` — NOT children — so they bypass guards. | medium | `app.routes.ts` |
| AR-route-07 | Host MUST use `HashLocationStrategy` (registered via `{provide: LocationStrategy, useClass: HashLocationStrategy}` in `app.config.ts:57`) to preserve deep links across MF route swaps. | medium | `app.config.ts:57` |
| AR-route-08 | `loadChildren` is used for feature routes returning `Routes` array or NgModule; `loadComponent` is used for single-component routes (preview, playground). Remote MF loads use `loadRemoteModule()` from `@nx/angular/mf`. | medium | observed |

## Guard inventory

| Guard | Location | Type | Used by |
|---|---|---|---|
| `authGuard` | `host-shell/src/app/core/guards/auth.guard.ts` | `CanActivateFn` | host LayoutComponent root |
| `shellPrimeAccessGuard` | `@falcon` | `CanActivateFn` | host LayoutComponent root |
| `shellAccessMatchGuard` | `@falcon` | `CanMatchFn` | every remote route (injected by `RemoteRouteService`) |
| `managementConsoleGuard` | `@falcon` | `CanActivateFn` | management-console root path |
| `adminConsoleGuard` | `@falcon` | `CanActivateFn` | **COMMENTED OUT** at admin-console `app.routes.ts:7` — access enforced upstream by `shellAccessMatchGuard` |
| `otpGuard` | `host-shell/src/app/features/auth/guards/otp.guard.ts` | `CanActivateFn` | auth/verify-otp route |
| `changePasswordGuard` | `host-shell/src/app/features/auth/guards/change-password.guard.ts` | `CanActivateFn` | auth/change-password route |

## Forbidden patterns
- Synchronous `router.initialNavigation()` before remotes are loaded — causes `**` catch-all to fire before remote routes register.
- Hardcoded `remotes: [{...}]` array in `module-federation.config.ts` — must stay empty (`[]`).
- Exposing a remote that returns a single component when `loadChildren` expects a routes array — use `exposeType: 'component'` and `loadComponent` instead.
- Bypassing `useGateway()` HTTP context — required for `RuntimeBaseUrlInterceptor` to rewrite base URLs.

## Per-route `data` payloads
- **Breadcrumb:** `data: { breadcrumb: '...' }` — consumed by host topbar.
- **MF access:** `data: { access: AccessQuery[], remoteName: string }` — consumed by `shellAccessMatchGuard`.

## Critical bootstrap sequence
1. `await remoteRouteService.reloadRemotes()` — registers remotes + builds dynamic Route[].
2. `applyRemoteRoutes()` — pushes dynamic routes as **children of LayoutComponent** (`appRoutes[0]`). Remote routes inherit `[authGuard, shellPrimeAccessGuard]`.
3. `router.initialNavigation()` — only NOW does router begin matching.
4. Subscribe to `remoteRoutes$` for hot-swap on runtime remote enable.
5. `HostWindowSdkBridge.install()`.

## Known divergence
- `adminConsoleGuard` is commented out in admin-console `app.routes.ts:7` — relies on host's `shellAccessMatchGuard` for access control.
- `adminOrganizationHierarchyGuard` is exported from `@falcon/core` but the active org-hierarchy route does NOT consume it — GAP/UNKNOWN status (logic may have moved to `shellAccessMatchGuard` or it's vestigial).

## Dead code flagged
- `apps/host-shell/src/app/remote-route.service.ts` (older sibling at app root) — DEAD CODE. `bootstrap.ts:6` imports from `./app/core/services/remote-route.service` only.
- `apps/host-shell/src/app/remote-config.ts` (older sibling) — same.

## Related
- See [[Module Federation]] for share-map and manifest schema.
- See [[Auth and Facade Patterns]] for `SHELL_CORE_ACCESS` factory + interceptor chain.

## Tags

#type/architecture-rules #gap

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
