---
type: page-dataset
app: host-shell
feature: _core
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Host-Shell Core (Routing / Interceptors / Guards / Layout)

## TL;DR
Host-Shell is the Module-Federation host application that loads remote micro-frontends (admin-console, management-console, demo-app, user-app), owns the top-level routing, global HTTP interceptors (auth/refresh-token/response toasts), the authenticated session/JWT lifecycle, the LayoutComponent (sidebar + breadcrumb + topbar + user-profile menu), and bootstraps the PrimeNG theme + RTL language sync. Auth tokens come from Identity Service via `auth/login` → `auth/verify-otp` → `auth/refresh-token`; subsequent business calls are forwarded to Core/System/Charging gateways with a JWT Bearer header.

## Manifest
- [[01-ROUTING]] — 8 top-level routes, 2 guards (authGuard, shellPrimeAccessGuard), dynamic MF remotes via RemoteRouteService
- [[02-COMPONENTS]] — 9 core components (App, LayoutComponent, SidebarComponent, BreadcrumbComponent, ThemeToggleComponent, LanguageToggleComponent, UserProfileMenuComponent, ChangePasswordModalComponent)
- [[03-SERVICES-APIS]] — 7 services (AuthService, AuthApiService, TokenStorageService, UserApiService, ChangePasswordService [layout], PrimeNGThemeService, RemoteRouteService), 19 endpoints
- [[04-DTOS]] — 29 DTOs (auth + user + node-of-federation + nav)
- [[05-PES]] — 5 host-level PES queries (managementConsole.enter, adminConsole.enter, managementConsole.accountHierarchy.view, adminConsole.accountHierarchy.view, managementConsole.services.view, managementConsole.contract.view) + `shellPrimeAccessGuard`, `shellAccessGuard`, `shellAccessMatchGuard`
- [[06-VALIDATIONS]] — 3 (change-password modal form rules)
- [[07-CROSS-PAGE]] — 12 inbound deps (`@falcon`, `@falcon/sdk`, MF runtime), 6 outbound services
- [[08-RULES-APPLIED]] — Module-Federation host, Zone.js (NOT zoneless), HashLocationStrategy, no SCSS-only restrictions (uses SCSS heavily), still uses `*ngIf/*ngFor` and `[ngClass]`

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/app.routes.ts` | Top-level Routes definition |
| `apps/host-shell/src/app/app.config.ts` | Providers, interceptors, runtime config |
| `apps/host-shell/src/app/app.ts` | Root component (RouterOutlet + Toast) |
| `apps/host-shell/src/app/app.html` | Root template (1-line router-outlet) |
| `apps/host-shell/src/app/core/auth/auth.service.ts` | JWT lifecycle, refresh-token coordinator |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts` | 7 backend auth endpoints |
| `apps/host-shell/src/app/core/auth/auth.models.ts` | Auth DTOs (LoginRequest, etc.) |
| `apps/host-shell/src/app/core/auth/token-storage.service.ts` | sessionStorage token persistence |
| `apps/host-shell/src/app/core/guards/auth.guard.ts` | Root `authGuard` |
| `apps/host-shell/src/app/core/interceptors/request-interceptor.ts` | Attach Bearer + proactive refresh |
| `apps/host-shell/src/app/core/interceptors/response-interceptor.ts` | 401 → refresh; toast errors |
| `apps/host-shell/src/app/core/services/prime-ng-theme.service.ts` | Theme + RTL sync to <html> |
| `apps/host-shell/src/app/core/services/remote-route.service.ts` | Dynamic MF remote route builder |
| `apps/host-shell/src/app/core/services/remote-config.ts` | Remote definition types |
| `apps/host-shell/src/app/core/user/user-api.service.ts` | UserController endpoints (8) |
| `apps/host-shell/src/app/core/user/user.models.ts` | User DTOs (UserResponse, CreateUserRequest, etc.) |
| `apps/host-shell/src/app/layout/layout.component.ts` | Sidenav + topbar shell |
| `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | Nav rendering + active-route expansion |
| `apps/host-shell/src/app/layout/components/breadcrumb/breadcrumb.component.ts` | Route-driven breadcrumbs |
| `apps/host-shell/src/app/layout/components/language-toggle/language-toggle.component.ts` | ar/en switcher |
| `apps/host-shell/src/app/layout/components/theme-toggle/theme-toggle.component.ts` | dark/light switcher |
| `apps/host-shell/src/app/layout/components/user-profile-menu/user-profile-menu.component.ts` | Dropdown menu w/ language+theme+profile+logout |
| `apps/host-shell/src/app/layout/components/user-profile-menu/change-password-modal/change-password-modal.component.ts` | Inline change-password dialog |
| `apps/host-shell/module-federation.config.ts` | host MF config (empty remotes, dynamic load) |
| `apps/host-shell/src/assets/module-federation.manifest.json` | dev MF manifest (4 remotes) |
| `apps/host-shell/src/assets/module-federation.manifest.prod.json` | prod MF manifest |
| `apps/host-shell/src/environments/environment.ts` | Dev gateway base URLs |
| `apps/host-shell/src/environments/environment.prod.ts` | Prod gateway base URLs |
