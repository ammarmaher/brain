# Routes & Module Federation Audit

---

## 1. `apps/host-shell/src/app/app.routes.ts`

```ts
export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, shellPrimeAccessGuard],
    children: [
      // Account Administration routes - accessible without restrictions
      // ...accountAdministrationRoutes,
    ],
  },
  // Auth-free preview route — for layout visual verification only. NO canActivate.
  { path: 'preview',  loadComponent: () => import('./preview-page.component').then((m) => m.PreviewPageComponent) },
  // Auth-free Falcon UI playground — permanent component lab. NO canActivate.
  { path: 'playground', loadComponent: () => import('./playground/playground.page').then((m) => m.PlaygroundPage) },
  // Auth-free Falcon UI Showcase — native gallery + library demo. NO canActivate.
  { path: 'falcon-ui-showcase', loadChildren: () => import('./features/falcon-ui-showcase/falcon-ui-showcase.routes').then((m) => m.FALCON_UI_SHOWCASE_ROUTES) },
  // Studio route removed in Wave 2 (revamp v3.1) — libs/falcon-studio kept on disk
  // Auth-free preview SHELL — sidebar + topbar + child routes
  { path: 'preview-shell', loadComponent: () => import('./preview-shell.component').then((m) => m.PreviewShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'org-hierarchy' },
      { path: 'org-hierarchy', loadChildren: () => loadRemoteModule('admin_console', './admin-console').then(...) },
      { path: 'org-hierarchy-prime', loadChildren: () => loadRemoteModule('admin_console', './admin-console').then(...) },
    ],
  },
  // DEV-ONLY preview routes — remove before production
  { path: 'preview-hierarchy', loadChildren: () => loadRemoteModule('admin_console', './admin-console').then(...) },
  { path: 'preview-hierarchy-prime', loadChildren: () => loadRemoteModule('admin_console', './admin-console').then(...) },
  { path: '401', component: UnauthorizedComponent, data: { breadcrumb: 'Unauthorized' } },
  { path: 'not-found', component: NotFoundComponent, data: { breadcrumb: 'Not Found' } },
  { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
  { path: 'login', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  { path: '**', redirectTo: '' },
];
```

### Notable

- **`LayoutComponent` root with `canActivate: [authGuard, shellPrimeAccessGuard]`** — authenticated users land here. The children array is currently EMPTY; remote routes get pushed in at runtime by `applyRemoteRoutes()` in `bootstrap.ts`.
- **`authGuard`** is at `apps/host-shell/src/app/core/guards/auth.guard.ts`. Functional `CanActivateFn` that reads `AuthService.authenticated` and redirects to `/login` if not. Includes a `?visual-test=1` bypass that persists to sessionStorage.
- **`shellPrimeAccessGuard`** comes from `@falcon` (`libs/falcon/src/core/lib/access-control/`). Validates the user holds `SHELL_CORE_ACCESS` (admin-console enter or management-console enter, computed in `app.config.ts:74-84` from the session's userType).
- **Auth-free routes:** `/preview`, `/playground`, `/falcon-ui-showcase`, `/preview-shell/**`, `/preview-hierarchy[-prime]` — no guards. These are DEV-only lab/preview surfaces.
- **HashLocationStrategy** registered via `{provide: LocationStrategy, useClass: HashLocationStrategy}` in `app.config.ts:57`. Likely preserves deep links across MF route swaps.
- **`withDisabledInitialNavigation()`** in `provideRouter()` so `bootstrap.ts` can register remote routes BEFORE the `**` catch-all redirects (RUNTIME bug fix from earlier wave).
- **`'**' → ''`** — catch-all goes to root, which renders LayoutComponent (if authenticated) or redirects to login.

### Breadcrumb data

```ts
data: { breadcrumb: 'Unauthorized' }
data: { breadcrumb: 'Not Found' }
data: { breadcrumb: 'Error' }
// Inside management-console:
data: { breadcrumb: 'Organization Hierarchy' }
// Inside admin-console feature routes:
data: { breadcrumb: 'Organization Hierarchy' }
```

The host-shell `topbar.component.ts` reads this metadata to render breadcrumbs.

---

## 2. `apps/admin-console/src/app/app.routes.ts`

```ts
export const appRoutes: Routes = [
  {
    path: '',
    // canActivate: [adminConsoleGuard], // Protect all routes under admin-console
    children: [
      { path: 'organization-hierarchy', loadChildren: () => import('./features/organization-hierarchy/organization-hierarchy.routes') },
      { path: 'organization-hierarchy-page', loadChildren: () => import('./features/organization-hierarchy-page/organization-hierarchy-page.routes') },
      { path: '', pathMatch: 'full', redirectTo: 'organization-hierarchy' },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const routes = appRoutes;
export default appRoutes;
```

### Notable

- **`adminConsoleGuard` is COMMENTED OUT** (line 7) — known deviation. The intent ("Protect all routes under admin-console") is documented in source but the guard call is disabled. Access control happens upstream via the host-shell's `shellAccessMatchGuard` registered on each remote route (`canMatch: [shellAccessMatchGuard]` with `data: { access: def.requiredAccess }` — see `core/services/remote-route.service.ts:141-145`).
- **Three exports** (`appRoutes`, `routes`, `default`) — required by the host's `RemoteRouteService.findRoutes()` which tries `m.remoteRoutes ?? m.default ?? m.appRoutes ?? m.routes` in order.
- Both `organization-hierarchy/` and `organization-hierarchy-page/` use `loadChildren: () => import('./features/.../...routes')`.

---

## 3. `apps/management-console/src/app/app.routes.ts`

```ts
export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [managementConsoleGuard], // Protect all routes under management-console
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'organization-hierarchy-page',
        loadChildren: () =>
          import('./features/organization-hierarchy-page/organization-hierarchy-page.routes').then(
            (m) => m.organizationHierarchyPageRoutes,
          ),
        data: { breadcrumb: 'Organization Hierarchy' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const routes = appRoutes;
export default appRoutes;
```

### Notable

- **`managementConsoleGuard`** IS active here (unlike `adminConsoleGuard` in admin-console which is commented out). Comes from `@falcon`.
- **Empty child `redirectTo: 'dashboard'`** — but no `dashboard` route is declared. This is likely intentional — `dashboard` is meant to be a future feature; the redirect creates a 404 → catch-all → blank.
- Only one feature wired: `organization-hierarchy-page`.

---

## 4. Remote-route service (active = `apps/host-shell/src/app/core/services/remote-route.service.ts`)

Two `remote-route.service.ts` files exist. The ACTIVE one is at `core/services/` — verified because `bootstrap.ts:6` imports `from './app/core/services/remote-route.service'`. The other at app root (`apps/host-shell/src/app/remote-route.service.ts`) is dead code that should be removed.

### Active service signature

```ts
@Injectable({ providedIn: 'root' })
export class RemoteRouteService {
  private readonly _remoteRoutes$ = new BehaviorSubject<Routes>([]);
  readonly remoteRoutes$ = this._remoteRoutes$.asObservable();
  private readonly loadedRemoteStyleUrls = new Set<string>();
  private readonly devRemoteStyleVersion = Date.now().toString();
  private readonly manifestProvider = inject(REMOTE_MANIFEST_PROVIDER);

  async reloadRemotes(): Promise<Routes> { ... }
  private registerAndBuildRoutes(remotes: RemoteDefinition[]): Routes { ... }
  private createRemoteRoute(def: RemoteDefinition): Route { ... }

  private createEnhancedMFRoute(def, id): Route { ... }
  private createNativeFederationRoute(def): Route { ... }
  private createComponentRoute(def): Route { ... }
  private createModuleRoute(def): Route { ... }
  private createRoutesRoute(def): Route { ... }
  private createRoutingModuleRoute(def): Route { ... }

  private async ensureRemoteStyles(def): Promise<void> { ... }
  private getRemoteStyleUrls(def): string[] { ... }
  private loadStylesheet(remoteName, href): Promise<void> { ... }
  private withDevCacheBuster(href): string { ... }

  private normalizeLoadChildrenReturn(...) { ... }
  private isValidLoadChildrenReturn(value): boolean { ... }
  private findComponent(m): any { ... }
  private findModule(m): any { ... }
  private findRoutes(m): any { ... }
  private findRoutingModule(m): any { ... }

  debugRemoteExports(def): void { ... }
}
```

### Per-route guard injection

Every route produced by `createRemoteRoute()` carries:

```ts
canMatch: [shellAccessMatchGuard],
data: {
  access: def.requiredAccess ?? [],
  remoteName: def.name,
}
```

So a remote is reachable only if the user holds the access claim declared in the manifest's `requiredAccess` array — `view app.admin-console` or `view app.management-console` in the active config.

### Remote stylesheet hydration

`ensureRemoteStyles()` loads each remote's `styles.css` from the remote's `remoteEntry` origin BEFORE the remote's JS executes. Dev-mode adds a cache buster so HMR updates aren't blocked by browser caching. Prevents an FOUC during remote-route navigation.

### Expose types supported (`RemoteExposeType` enum)

```ts
export enum RemoteExposeType {
  Component     = 'component',     // exposes a single standalone component → loadComponent
  Module        = 'module',        // exposes an NgModule → loadChildren (returns module)
  Routes        = 'routes',        // exposes a Routes array → loadChildren (returns array)
  RoutingModule = 'routingModule', // exposes a RoutingModule with forChild() → loadChildren
}
```

The two active remotes use `exposeType: 'routes'`.

### Entry types supported (`RemoteEntryType` enum)

```ts
export enum RemoteEntryType {
  Manifest    = 'manifest',    // Enhanced MF mf-manifest.json
  RemoteEntry = 'remoteEntry', // Classic webpack 5 / Native Federation remoteEntry.js
}
```

Both active remotes use `remoteEntry`. The Enhanced MF path is wired but unused.

---

## 5. `apps/host-shell/src/bootstrap.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { appRoutes } from './app/app.routes';
import { RemoteRouteService } from './app/core/services/remote-route.service';
import { HostWindowSdkBridge } from '../falcon-sdk/host-window-sdk.bridge';
import 'iconify-icon';

(window as any).__appType__ = 'host';

const ngRuntimeGlobals = globalThis as typeof globalThis & { ngDevMode?: boolean; ngJitMode?: boolean; };
if (typeof ngRuntimeGlobals.ngDevMode === 'undefined') ngRuntimeGlobals.ngDevMode = false;
if (typeof ngRuntimeGlobals.ngJitMode === 'undefined') ngRuntimeGlobals.ngJitMode = false;

function applyRemoteRoutes(router: Router, remoteRoutes: Routes): void {
  const root = { ...appRoutes[0] };
  root.children = [...(appRoutes[0].children ?? []), ...remoteRoutes];
  router.resetConfig([root, ...appRoutes.slice(1)]);
}

bootstrapApplication(App, appConfig)
  .then(async (ref) => {
    const injector = ref.injector;
    const remoteRouteService = injector.get(RemoteRouteService);
    const router = injector.get(Router);
    const HostSettings = injector.get(HostWindowSdkBridge);

    // 1. Load remote MFE routes BEFORE initial navigation
    const remoteRoutes = await remoteRouteService.reloadRemotes();
    applyRemoteRoutes(router, remoteRoutes);

    // 2. Trigger initial navigation with the full route config
    router.initialNavigation();

    // 3. Subscribe for any future dynamic route updates
    remoteRouteService.remoteRoutes$.subscribe((updatedRoutes) => {
      applyRemoteRoutes(router, updatedRoutes);
    });

    HostSettings.install();
  })
  .catch((err) => console.error(err));
```

### Critical sequence

1. `await remoteRouteService.reloadRemotes()` — registers remotes + builds the dynamic Route[] before any navigation.
2. `applyRemoteRoutes()` — pushes the dynamic routes as **children of LayoutComponent** (`appRoutes[0]`). This means remote routes inherit the host's `[authGuard, shellPrimeAccessGuard]`.
3. `router.initialNavigation()` — only NOW does the router begin matching the current URL. Without this, the catch-all `**` would have fired during the synchronous part of bootstrap.
4. Subscribe to `remoteRoutes$` for any future hot-swap (e.g. when a new remote is enabled at runtime).
5. `HostWindowSdkBridge.install()` — exposes host SDK state on `window.__falconHost*` for cross-shell consumers.

---

## 6. Auth flow at startup

1. `app.config.ts` registers `provideHttpClient(withFetch(), withInterceptorsFromDi())` + 3 HTTP interceptors via `HTTP_INTERCEPTORS` token (multi):
   - **RequestInterceptor** (`core/interceptors/request-interceptor.ts`) — adds JWT bearer + ngrok-skip header. Detects expired tokens (30s buffer) → triggers refresh via `AuthService.refreshTokenIfNeeded()`.
   - **RuntimeBaseUrlInterceptor** (from `@falcon/shared-data-access`) — rewrites URLs per gateway selection (`useGateway(Gateway.X)`).
   - **ResponseInterceptor** — extracts error messages from `ServiceOperationResult<T>` body / HTTP errors; pushes to `FalconMessageService` toast queue. 401 → refresh flow.
2. `translateInitializerProvider` (APP_INITIALIZER from `@falcon/language`) — preloads i18n JSON before the first render.
3. `provideFalconFacades({ auth: HostAuthFacade, theme: HostThemeFacade, language: HostLanguageFacade, notifier: HostNotifierFacade, context: HostContextFacade })` — binds the concrete host implementations.
4. `SHELL_CORE_ACCESS` factory inspects `SessionProvider.session.userType` — falcon user type:
   - `CLIENT_USER` → `[FalconAccess.managementConsole.enter()]`
   - other → `[FalconAccess.adminConsole.enter()]`
5. `shellPrimeAccessGuard` ensures the user holds one of those access claims before rendering the LayoutComponent.

---

## 7. Guards inventory

| Guard | Location | Type | Used by |
|---|---|---|---|
| `authGuard` | `apps/host-shell/src/app/core/guards/auth.guard.ts` | `CanActivateFn` | host-shell LayoutComponent root |
| `shellPrimeAccessGuard` | `@falcon` (libs/falcon/src/core/lib/access-control/) | `CanActivateFn` | host-shell LayoutComponent root |
| `shellAccessMatchGuard` | `@falcon` | `CanMatchFn` | injected by `RemoteRouteService` on every remote route |
| `managementConsoleGuard` | `@falcon` | `CanActivateFn` | management-console root path |
| `adminConsoleGuard` | `@falcon` | `CanActivateFn` | **COMMENTED OUT** at admin-console/app.routes.ts:7 |
| `adminOrganizationHierarchyGuard` | `@falcon` (from `libs/falcon/src/core/index.ts`) | `CanActivateFn` | declared but usage UNCLEAR — search reveals it as an export only |
| `otpGuard` | `apps/host-shell/src/app/features/auth/guards/otp.guard.ts` | `CanActivateFn` | auth/verify-otp route |
| `changePasswordGuard` | `apps/host-shell/src/app/features/auth/guards/change-password.guard.ts` | `CanActivateFn` | auth/change-password route |

GAP/UNKNOWN: `adminOrganizationHierarchyGuard` is exported from `@falcon/core` but the active code does not consume it on the admin-console org-hierarchy route. Either the guard's logic moved to `shellAccessMatchGuard` or it's vestigial.

---

## 8. `loadChildren` vs `loadComponent`

- **`loadChildren`** is used for feature route bundles (entry returns a `Routes` array or NgModule). All wave-level features (`/features/<x>/<x>.routes.ts`) use `loadChildren`.
- **`loadComponent`** is used for single-component routes — `playground.page`, `preview-page`, `preview-shell.component`. Cleaner than wrapping in a routes array.
- Remote MF loads use `loadRemoteModule()` from `@nx/angular/mf` (Native Federation path). Within `RemoteRouteService.createRoutesRoute()`, the loaded module is unwrapped to a routes array which Angular's `loadChildren` accepts directly.

---

## 9. Per-route `data` payloads

Used for:

- **Breadcrumbs** — `data: { breadcrumb: '...' }` consumed by host-shell topbar.
- **MF access** — `data: { access: AccessQuery[], remoteName: string }` consumed by `shellAccessMatchGuard`.
- **Module Federation tracing** — `remoteName` carries through to logs.
