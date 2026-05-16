# Routing — host-shell core

## Static top-level Routes (app.routes.ts:13-78)

| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `''` (root) | `LayoutComponent` (parent) | no | `authGuard`, `shellPrimeAccessGuard` | — | — | — |
| `''` (child of root) | `DashboardComponent` | no | (inherits) | — | — | `breadcrumb: 'Dashboard'` |
| `'shell'` (child of root) | `ShellComponent` | no | (inherits) | — | — | `breadcrumb: 'Shell '` |
| `'auth-view'` (child of root) | `AuthViewComponent` | no | `shellAccessGuard` | — | — | `breadcrumb: 'Auth View'`, `access: FalconAccess.authView.view()` |
| `'profile'` (child of root) | `UserProfileComponent` | no | (inherits) | — | — | `breadcrumb: 'User Profile'` |
| `'profile/:nodeId'` (child of root) | `UserProfileComponent` | no | (inherits) | — | `nodeId` | `breadcrumb: 'User Profile'` |
| `'401'` (top-level) | `UnauthorizedComponent` | no | — | — | — | `breadcrumb: 'Unauthorized'` |
| `'not-found'` (top-level) | `NotFoundComponent` | no | — | — | — | `breadcrumb: 'Not Found'` |
| `'error'` (top-level) | `ErrorComponent` | no | — | — | — | `breadcrumb: 'Error'` |
| `'login'` (top-level) | (LoginLayoutComponent shell) | **yes** | — | — | — | (loads `features/auth/auth.routes#AUTH_ROUTES`) |
| `'**'` | redirect to `''` | no | — | — | — | — |

## Lazy auth-flow Routes (features/auth/auth.routes.ts:10-32)

| Path | Component | Guards | Notes |
|---|---|---|---|
| `'login/'` | `LoginLayoutComponent` (parent) | — | branding + footer + language selector |
| `'login/'` (default child) | `GetStartedComponent` | — | username/password form |
| `'login/verify-otp'` | `EnterOtpComponent` | `otpGuard` | OTP input |
| `'login/change-password'` | `ChangePasswordComponent` | `changePasswordGuard` | First-login password change |
| `'login/forgot-password'` | `ForgotPasswordFlowComponent` | — | 3-step flow (request OTP → verify OTP → set password) |

## Dynamic Module-Federation Routes (loaded at runtime by `RemoteRouteService`)

The host's `RemoteRouteService` (`core/services/remote-route.service.ts`) fetches `/assets/module-federation.manifest.json` on bootstrap, registers Enhanced MF or Native Federation remotes, and builds `Route` objects with `canMatch: [shellAccessMatchGuard]`. The 4 manifest-defined remotes are:

| Remote name | Route path | Exposed module | Required access | exposeType | entryType |
|---|---|---|---|---|---|
| `management_console` | `/management-console` | `./management-console` | `app.management-console:view` | routes | remoteEntry |
| `admin_console` | `/admin-console` | `./admin-console` | `app.admin-console:view` | routes | remoteEntry |
| `External-app` (demo) | `/user-settings` | `./users` | `microapp.user-settings:view` | component | remoteEntry |
| `mfe-app` (user-app) | `/survey-container` | `./survey` | `microapp.survey-container:view` | module | remoteEntry |

In prod (`module-federation.manifest.prod.json:1-56`), demo-app + user-app are `active: false`; only management-console + admin-console are loaded.

## Route module loader
- File: `apps/host-shell/src/app/app.routes.ts:74-76`
- Loader: `loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)`

## Router configuration (app.config.ts:51-53)
- `provideRouter(appRoutes, withDisabledInitialNavigation())` — initial navigation deferred until after MF runtime config + remote routes are loaded.
- `{provide: LocationStrategy, useClass: HashLocationStrategy}` — uses hash-based URLs (`#/...`).

## Guard implementations

### `authGuard` (`core/guards/auth.guard.ts:10-23`)
```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authenticated) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
```
- Reads `AuthService.authenticated` getter (`auth.service.ts:56-58`) which calls `tokenStorage.hasValidAccessToken()`.
- Decision logic: valid JWT in sessionStorage AND `exp * 1000 > Date.now()`.

### `shellPrimeAccessGuard` (from `@falcon`)
- Imported in `app.routes.ts:3` — implementation lives in `libs/falcon/src/lib/access-control/shell-prime-access.guard.ts`.
- Reads `SHELL_CORE_ACCESS` token (set in `app.config.ts:72-81`):
  - userType=2 (CLIENT_USER) → `[FalconAccess.managementConsole.enter()]`
  - other types (Falcon user) → `[FalconAccess.adminConsole.enter()]`

### `shellAccessGuard` (from `@falcon`)
- Reads `route.data.access` (an `AccessQuery` or `AccessQuery[]`) and checks via `AccessControlFacade.ensure()` + `.can()`.

### `shellAccessMatchGuard` (from `@falcon`, applied via `canMatch` on dynamic remote routes)
- Applied to dynamic MF remotes in `remote-route.service.ts:149, 203, 234, 265, 297`.
- Reads `route.data.access` (`AccessQuery[]`) and `route.data.remoteName`.

### `otpGuard` (`features/auth/guards/otp.guard.ts:10-20`)
- Allows `/login/verify-otp` only when `AuthFlowStateService.getTempSession().sessionId` exists; else redirects to `/login`.

### `changePasswordGuard` (`features/auth/guards/change-password.guard.ts:10-20`)
- Allows `/login/change-password` only when `sessionId` exists AND `firstLogin === true`; else redirects to `/login`.

## Resolver implementations
None at the host level. Remote routes may declare their own.
