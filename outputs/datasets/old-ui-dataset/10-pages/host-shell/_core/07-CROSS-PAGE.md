# Cross-page dependencies — host-shell core

## Inbound (host-core depends on)

### From `@falcon` (unified workspace library)
- `SessionProvider` — JWT-derived session info (`session.userType`, `session.tenantId`, `session.name`, `session.node`).
- `NodeService` — fetches the user's organization-hierarchy node after login (`auth.service.ts:144-152`).
- `AccessControlFacade` — PES query/cache for `can()`/`ensure()`. Used by `LayoutComponent` for nav-item gating.
- `RouteAccessService` — computes `safePath` per nav item.
- `FalconAccess` — typed query builder for permissions.
- `APP_ROUTES`, `AppRouteScope` — route constants for nav items.
- `USER_TYPE_STRINGS`, `UserTypeString` — user-type enum constants.
- `FALCON_ICONS`, `FalconIconComponent`, `SvgIconComponent`, `SVG_ICON_NAMES`, `getSvgIcon` — icon system.
- `TranslateService`, `TranslatePipe` — i18n.
- `Helper`, `Hook<T>`, `UserStatus`, `UserStatusI18n`, `VerifiableField`, `OtpScreenState`, `OTP_DEFAULTS`, `FALCON_ROOT_NODE`, `FlowStep`, `FalconMobileNumberComponent`, `OrgHierarchyNode`, `OrgNodeAction`, `OrganizationHierarchyTreeComponent`, `FalconUploaderComponent`, `FalconDividerComponent`, `AttachmentRequestModel` — shared types + UI primitives.
- `HttpService` — typed HttpClient wrapper with `useGateway()` context.
- `ServiceOperationResult<T>` — platform response envelope (used everywhere).
- `Gateway` enum, `useGateway(gateway?)` — HTTP-context tag for `RuntimeBaseUrlInterceptor`.
- `dedupeAccessQueries`, `AccessQuery` — PES helpers.
- `provideShellEnvConfig`, `exposeRuntimeConfigOnWindow`, `SHELL_ENV_CONFIG`, `SHELL_CORE_ACCESS`, `HTTP_BASE_URL`, `RuntimeBaseUrlInterceptor`, `createFalconPrimeNGConfig`, `translateInitializerProvider` — bootstrapping primitives consumed in `app.config.ts`.

### From `@falcon/sdk` (cross-app facade contracts)
- `FALCON_AUTH` token + `FalconAuthFacade` — cross-MFE auth event hub.
- `FALCON_THEME` token + `FalconThemeFacade`, `FalconTheme` — theme state.
- `FALCON_LANGUAGE` token + `FalconLanguageFacade` — language state.
- `FALCON_CONTEXT` token + `FalconContextFacade` — host context (used by Demo `ShellComponent`).
- `FALCON_NOTIFIER` token + `FalconNotifierFacade` — host-wide notifications.
- `FALCON_FACADE_TOKENS` — registry of all facade tokens (used in Demo `FacadeStatusComponent`).
- `provideFalconFacades({ auth, theme, language, notifier, context })` — provider factory in `app.config.ts:56-62`.

### Host-shell-only facades (`apps/host-shell/falcon-facades/`)
- `HostAuthFacade` (provides token via `auth.service` events + token-storage)
- `HostThemeFacade` (sessionStorage `theme$` BehaviorSubject)
- `HostLanguageFacade` (sessionStorage `language$` BehaviorSubject)
- `HostNotifierFacade`
- `HostContextFacade`

### From PrimeNG
- `ToastModule`, `MessageService`, `ConfirmationService` (registered globally in `app.config.ts:87-89`)
- `ConfirmDialogModule` (LayoutComponent uses `<p-confirmDialog>`)
- `ButtonModule`, `DialogModule`, `InputTextModule`, `SelectModule` (used by login flow + change-password modal)
- `InputOtpModule` (EnterOtpComponent + ForgotPasswordFlowComponent + ProfileOtpModalComponent)

### From Module Federation runtime
- `@module-federation/enhanced/runtime`: `registerRemotes`, `loadRemote`
- `@nx/angular/mf`: `setRemoteDefinitions`, `loadRemoteModule`

### From `jwt-decode`
- `jwt_decode<JwtPayload>(token)` to read `exp` claim for token-expiry checks (`auth.service.ts:8, 290-297`, `token-storage.service.ts:2, 41-43`).

## Outbound (other features depend on host-core)

### `AuthService` (root)
- Consumed by `AuthViewComponent.logout()`, `UserProfileMenuComponent.logout()`, `ChangePasswordModalComponent.onSave()` (auto-logout after success).
- Consumed by interceptors (request + response) for token attach/refresh.

### `AuthApiService` (root)
- Consumed by feature-level wrappers: `LoginService` (`get-started`), `OtpService` (`enter-otp`), `ChangePasswordService` (`auth/change-password`), `ForgotPasswordFlowService`.

### `TokenStorageService` (root)
- Consumed by `AuthService`.
- `[INFERRED]` Also read indirectly by `HostAuthFacade` via the same sessionStorage keys (`access_token`, `refresh_token`), so cross-MFE auth state stays in sync.

### `UserApiService` (root)
- Consumed by `LayoutComponent.loadUserProfile()` (`getMe()`).
- Consumed by `UserProfileService` (re-exports via screen wrapper).
- Consumed by `UserWizardService.createUser()` (add-user wizard).

### `PrimeNGThemeService` (root)
- Auto-instantiated via constructor injection in root `App` component (`app.ts:17`).

### `RemoteRouteService` (root)
- Used at bootstrap (after `withDisabledInitialNavigation()` defers initial nav) to register MF remotes and build dynamic Route[]. `[INFERRED]` Wiring happens via `APP_INITIALIZER` or `provideAppInitializer` somewhere in `@falcon` (not visible at host-shell level).

## Shared state
- **Reads:**
  - `SessionProvider.session$` (Observable) — for `userType`-driven nav.
  - `SessionProvider.session?.tenantId` — for role catalog calls.
  - `SessionProvider.node?.label/url` — for layout tenant display.
  - `FalconAuthFacade.emmitSubjects()` is called on every login/refresh to notify other MFEs.
- **Writes:**
  - `SessionProvider.setFromToken(accessToken)` on login + refresh.
  - `SessionProvider.setNode(node)` after `/Node` fetch.
  - `SessionProvider.clear()` on logout.
  - sessionStorage `access_token`, `refresh_token`, `falcon_auth_flow`, `auth_redirect`.

## Navigation entry points
- Login page (URL `#/login`).
- Default redirect for unmatched routes: `''` (handled by `{ path: '**', redirectTo: '' }`).
- Cross-MFE deep links: `/admin-console/...`, `/management-console/...`, `/user-settings`, `/survey-container`.
- Direct internal: `/profile`, `/profile/:nodeId`, `/auth-view`, `/shell`, `/error`, `/not-found`, `/401`.

## Module-Federation contract
- Host name: `'host-shell'` (`module-federation.config.ts:16`).
- Remotes: registered dynamically at runtime — `module-federation.config.ts:17` declares `remotes: []` (none statically).
- Eager shared libraries: `@angular/*`, `rxjs`, `zone.js`, `primeng/*`, `primeicons`, `@falcon`, `@falcon/sdk`, `jwt-decode`, `ngx-intl-tel-input`, `google-libphonenumber`, `uuid`, `tslib`, `lodash(-es)`, `moment`, `date-fns`, `axios`, `jquery`.
- Lazy shared: any other npm package falls to `eager: false`.
- Animations packages explicitly excluded from sharing (avoids RUNTIME-006 errors): `module-federation.config.ts:27-32`.
