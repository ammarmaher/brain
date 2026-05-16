# Rules / patterns — host-shell core

## Observed (good)

- **Standalone components** everywhere — `standalone: true` on every host component (App, Layout, Sidebar, Breadcrumb, ThemeToggle, LanguageToggle, UserProfileMenu, ChangePasswordModal).
- **Signal-based auth state** — `AuthService._isAuthenticated = signal<boolean>(false); isAuthenticated = this._isAuthenticated.asReadonly();` (`auth.service.ts:52-53`).
- **`takeUntilDestroyed(destroyRef)`** consistently used in subscriptions (LayoutComponent, ThemeToggle, LanguageToggle, UserProfileMenu, ChangePasswordModal, AuthService).
- **Token-expiry buffer + retry-guard** — proactive refresh 30 s before expiry; `X-Token-Retried` header prevents loops.
- **Refresh-token coordination via BehaviorSubject** — concurrent 401s queue and replay with the new token instead of triggering N refreshes.
- **OnPush change detection** in `SidebarComponent` — explicit `cdr.markForCheck()` on relevant events.
- **`HashLocationStrategy`** chosen explicitly (compatible with static hosting of MF remotes).
- **Centralized HTTP toast** — `ResponseInterceptor` extracts errors from `ServiceOperationResult` envelope (camelCase + PascalCase) so feature components don't need to display their own messages.
- **`notShowToaster: 'true'` header** as the suppression mechanism — login/OTP screens use it to render inline errors instead of toasts.
- **Dynamic gateway selection** — `useGateway()` HTTP context tag + `RuntimeBaseUrlInterceptor` keeps gateway selection a header concern, not a baseURL concern.
- **Module-Federation manifest as data**, not code — `module-federation.manifest.json` lets ops toggle remotes via deploy without rebuilding the host.
- **PES guard wired to route data** — `route.data.access: FalconAccess.X.Y()` + `shellAccessGuard` is the canonical pattern.
- **MultiLanguageName via TranslateService** + `TranslatePipe` everywhere.
- **i18n key + facade pattern** — no hardcoded English strings inside templates that have `TranslatePipe`.
- **`provideAnimations()`** registered explicitly (`app.config.ts:52`).

## Observed (bad — would be flagged by the night-shift digest)

- **Uses Zone.js** (`provideZoneChangeDetection({ eventCoalescing: true })`) — NOT zoneless. (`app.config.ts:50`)
- **PrimeNG** is heavily used throughout (Toast, ConfirmDialog, Dialog, Select, Button, InputText, InputOtp). The wider Falcon platform is moving to a falcon-ui-core component library, but host-shell still depends on PrimeNG.
- **Heavy use of `*ngIf` / `*ngFor` / `[ngClass]`** instead of `@if/@for/@switch` (e.g. `dashboard.component.html`, `sidebar.component.html` via `NgFor, NgIf, NgClass` imports, layout `<ng-template>` blocks).
- **`@Input()` / `@Output()` decorators** instead of `input()/output()` signals (Sidebar, UserProfileMenu, ChangePasswordModal, Breadcrumb).
- **`@ViewChild()` decorator** rather than `viewChild()` signal queries.
- **SCSS files** everywhere — every component has a `.component.scss`. The Falcon UI rule for new code is "Tailwind utilities + tokens only, no SCSS", but host-shell pre-dates the rule.
- **Inline styles** in route-level fallback components (`UnauthorizedComponent`, `ErrorComponent` use `styles: [...]` blocks with hex colors hardcoded — `#1d4ed8`, `#ffffff`, `#1f2937`, etc.). Violates "no hardcoded values" rule.
- **`HostListener('document:click', ...)`** for outside-click in `UserProfileMenuComponent` — would be flagged in favor of CDK overlay or click-outside directive.
- **Direct `document.documentElement` mutation** in PrimeNGThemeService and ThemeToggleComponent — typed-platform-agnostic alternatives (Renderer2) not used.
- **`localStorage` fallback writes** in `LanguageToggleComponent.toggleLanguage()` and `ThemeToggleComponent.toggleTheme()` — bypasses the facade if `setLanguage`/`setTheme` is missing. Indicates the facade contract is leaky.
- **`setTimeout`** without `runOutsideAngular` in `EnterOtpComponent.resetOtpForRetry`, `ChangePasswordModalComponent.onSave` (logout delay) — minor change-detection noise.
- **Mixed Form approaches** — host uses both Reactive (`GetStartedComponent`, `ChangePasswordComponent` (auth feature)) and template-driven (`ChangePasswordModalComponent` (layout), `UserProfileComponent`, `PersonalInformationStepComponent`).
- **`(window.history.state as Record<string, unknown>)`** read in `UserProfileComponent.onRouteParamsChanged()` — relies on browser history API directly; would be better channeled through a router data abstraction.
- **`console.log/warn/error`** scattered (LayoutComponent, RemoteRouteService, ResponseInterceptor) — would be replaced by a proper logger.
- **`alert`-free** (good) but `console.error` is the only error sink for some failure paths (`prime-ng-theme.service.ts`, `theme-toggle.component.ts`).
- **`pi pi-*` icon strings hardcoded** in dashboard mock data + not-found component (`pi pi-users`, `pi pi-check-circle`, `pi pi-home`). The Falcon rebuild plans for `<falcon-icon>` everywhere.
- **`as any` casts** in interceptors and components (e.g. `(res as any).errorMessages?.[0]` in `GetStartedComponent`, `EnterOtpComponent`, `ForgotPasswordFlowComponent`, `OrgHierarchyApiService`).

## Patterns worth porting

- **`AuthFlowStateService`** persisted in `sessionStorage` with default state merge — clean way to hold transient multi-screen state (credentials + sessionId + OTP config) across page refresh.
- **`useGateway()` HTTP context + `RuntimeBaseUrlInterceptor`** — gateway selection as metadata, not URL. Cleanly composes with token-attach.
- **`ResponseInterceptor.handleSuccessResponse()`** — handles both camelCase (`isSuccessful`) and PascalCase (`IsSuccessful`) keys; survives if backend casing drifts.
- **`ProfileOtpModalComponent` `enterInputState(otpLength, expirySeconds)`** — single state-transition method for the modal lifecycle, makes the OTP screen states (`Sending → Input → Verifying → Success | Error | Expired`) explicit.
- **`scheduleSessionTimeout` runs outside Angular zone** — avoids one CD tick per second for an idle timer.

## Anti-patterns to NOT port to new theme

- **HashLocationStrategy** unless required by static hosting — prefer PathLocationStrategy + server-side fallback.
- **`document.querySelector('.p-inputotp input')`** in `EnterOtpComponent.focusFirstInput()` — DOM-walking inside Angular.
- **Mutating PrimeNG state via class-toggling on `<html>`** (`PrimeNGThemeService.applyTheme`, `ThemeToggleComponent.applyTheme`) — better via CSS custom properties scoped to a root token theme.
- **Building dynamic Routes by string-matching exposed module names** (`RemoteRouteService.findComponent/findModule/findRoutes` heuristics) — brittle. A typed contract on the remote side (export `routes: Routes`) would be safer.
- **Layout component is doing too much** — `LayoutComponent` (562 lines) owns nav-item construction, PES gating, user-profile load, breadcrumb tracking, and admin-console navigation. Should split into smaller services + a thinner shell.
- **`Demo/` folder** ships as a feature — `auth-view`, `facade-status`, `shell` are development affordances and would be excluded in a clean rebuild.

## Configuration / bootstrap notes

- `app.config.ts:51`: `withDisabledInitialNavigation()` — required so MF remote routes register before the router decides 404. Re-enable initial navigation manually after `RemoteRouteService.reloadRemotes()` resolves.
- `app.config.ts:53`: `HashLocationStrategy` provided globally.
- `app.config.ts:54`: `providePrimeNG(createFalconPrimeNGConfig())` — a `@falcon` helper that pre-wires the Aura preset + ripple + zIndex stack.
- Two interceptor classes are registered via `HTTP_INTERCEPTORS` multi-token, but the order matters: `RequestInterceptor` (attach token, proactive refresh), `RuntimeBaseUrlInterceptor` (gateway prefix), `ResponseInterceptor` (toast + 401 refresh) — interceptors execute in registration order on request and reverse on response.
