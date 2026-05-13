# Auth + Facade Patterns — Host vs Remote

---

## 1. Host composition root — `apps/host-shell/src/app/app.config.ts`

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),                                  // 1. Zoneless
    provideRouter(appRoutes, withDisabledInitialNavigation()),         // 2. Router defers init nav
    provideAnimationsAsync(),                                          // 3. Async animations (zoneless requirement)
    {provide: LocationStrategy, useClass: HashLocationStrategy},       // 4. Hash routing

    PrimeNGThemeService,                                               // 5. Legacy-named theme + RTL sync

    provideFalconFacades({                                             // 6. Concrete facades
      auth: HostAuthFacade,
      theme: HostThemeFacade,
      language: HostLanguageFacade,
      notifier: HostNotifierFacade,
      context: HostContextFacade
    }),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),          // 7. HTTP with DI interceptors
    translateInitializerProvider,                                      // 8. APP_INITIALIZER for i18n preload

    ...provideShellEnvConfig(hostRuntimeConfig),                       // 9. Env config tokens
    exposeRuntimeConfigOnWindow(hostRuntimeConfig),                    // 10. window.__falconEnv__

    // Host has NO APP_DEFAULT_GATEWAY — falls back to session.userType detection
    {
      provide: SHELL_CORE_ACCESS,
      deps: [SessionProvider],
      useFactory: (sessionProvider: SessionProvider) => {
        const userType = String(sessionProvider.session?.userType ?? '').trim();
        return userType === USER_TYPE_STRINGS.CLIENT_USER
          ? [FalconAccess.managementConsole.enter()]
          : [FalconAccess.adminConsole.enter()];
      },
    },

    // HTTP interceptors — multi:true via HTTP_INTERCEPTORS token
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor,        multi: true },
    FalconMessageService,                                              // Singleton for toast queue
    { provide: HTTP_BASE_URL, useValue: hostRuntimeConfig.baseURL },
    { provide: HTTP_INTERCEPTORS, useClass: RuntimeBaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor,       multi: true },

    // Wave 8 — manifest provider binding (one-line swap to API source)
    { provide: REMOTE_MANIFEST_PROVIDER, useExisting: JsonFileRemoteManifestProvider },
  ],
};
```

### Interceptor chain (order matters)

Angular runs `HTTP_INTERCEPTORS` in registration order. The Falcon order is:

1. **RequestInterceptor** — attach JWT bearer token. Refresh if expiring within 30s.
2. **RuntimeBaseUrlInterceptor** — rewrite URL based on selected gateway (`useGateway(Gateway.X)` context). Resolves relative URLs to the env-driven gateway base URL.
3. **ResponseInterceptor** — extract messages from response body. Push to `FalconMessageService` toast queue. 401 → refresh-token flow (skips auth endpoints).

### `translateInitializerProvider`

```ts
// libs/falcon/src/language/lib/translate.initializer.ts
export const translateInitializerProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [TranslateService],
  useFactory: (svc: TranslateService) => () => svc.preload(),
};
```

Blocks app render until i18n JSON is loaded. Memory `feedback_brain_skill` confirms.

### `SessionProvider`

`@falcon` exports `SessionProvider` — central session source consumed by `SHELL_CORE_ACCESS` factory + by `AuthService`. Hydrated from JWT decode of the stored access_token.

---

## 2. Remote composition root — `apps/admin-console/src/app/app.config.ts`

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(appRoutes),                            // No withDisabledInitialNavigation — remote doesn't load remotes
    provideFalconFallbackFacades(),                      // Mocks for standalone-dev mode
    translateInitializerProvider,
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    ...provideShellEnvFromWindow({                       // Read env from window.__falconEnv__ (set by host)
      baseURL: '',
      baseURLPes: '',
      baseURLCoreGateway: '',
      baseURLSystemGateway: '',
      baseURLChargingGateway: '',
      baseURLIdentityGateway: '',
    }),
    provideAppDefaultGateway(Gateway.SystemGateway),     // Admin-console defaults to SystemGateway
    { provide: HTTP_INTERCEPTORS, useClass: RuntimeBaseUrlInterceptor, multi: true },
  ],
};
```

### Per-remote differences from host

| Concern | Host | admin-console | management-console |
|---|---|---|---|
| `provideZonelessChangeDetection()` | ✓ | ✓ | ✓ |
| `provideAnimationsAsync()` | ✓ | ✓ | **MISSING (divergence)** |
| `withDisabledInitialNavigation()` on router | ✓ | — | — |
| LocationStrategy | HashLocationStrategy | default (PathLocationStrategy) | default |
| Facade source | `provideFalconFacades({...host implementations})` | `provideFalconFallbackFacades()` (mocks) | `provideFalconFallbackFacades()` (mocks) |
| Env config source | `provideShellEnvConfig(staticObject)` | `provideShellEnvFromWindow(defaults)` | `provideShellEnvFromWindow(defaults)` |
| Default gateway | none (factory-based) | `Gateway.SystemGateway` | `Gateway.CoreGateway` |
| HTTP interceptors | Request + RuntimeBaseUrl + Response + FalconMessageService | RuntimeBaseUrl only | RuntimeBaseUrl only |
| MF manifest provider | `REMOTE_MANIFEST_PROVIDER` bound | — | — |

**Divergence flag:** management-console missing `provideAnimationsAsync()` means animations cannot be used in mgmt features in standalone-dev mode. Likely intentional today since mgmt has no animated UI, but should be added for consistency.

---

## 3. Fallback facades — `apps/{admin,management}-console/mocks/falcon-fallback.providers.ts`

```ts
// MockAuth implements FalconAuthFacade — reads from sessionStorage
@Injectable({ providedIn: 'root' })
export class MockAuth implements FalconAuthFacade {
  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
  private idTokenSubject = new BehaviorSubject<string | null>(this.getIdToken());
  accessToken$ = this.accessTokenSubject.asObservable();
  idToken$ = this.idTokenSubject.asObservable();
  getAccessToken(): string | null { return sessionStorage.getItem('access_token'); }
  getIdToken(): string | null { return sessionStorage.getItem('id_token'); }
  getAuthenticationObject() { return { accessToken: this.getAccessToken(), idToken: this.getIdToken() }; }
  emmitSubjects() { /* host-only writer */ }
}

// MockTheme — toggles <html class="app-{dark|light}"> + data-theme attr
@Injectable({ providedIn: 'root' })
export class MockTheme implements FalconThemeFacade {
  // localStorage 'theme' key
  // Applies <html data-theme="light|dark"> + class
}

// MockLanguage — toggles <html lang/dir/class p-rtl>
@Injectable({ providedIn: 'root' })
export class MockLanguage implements FalconLanguageFacade {
  // localStorage 'lang' key
  // Applies <html lang="en" dir="ltr"> or <html lang="ar" dir="rtl" class="p-rtl">
}

// MockNotifier — console.log/error/info/warn
@Injectable({ providedIn: 'root' })
export class MockNotifier implements FalconNotifierFacade { ... }

// MockContextFacade — fixed tenant + user from MOCK_CONTEXT constant
@Injectable({ providedIn: 'root' })
export class MockContextFacade implements FalconContextFacade { ... }

export function provideFalconFallbackFacades(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FALCON_AUTH,     useFactory: () => new MockAuth() },
    { provide: FALCON_THEME,    useFactory: () => new MockTheme() },
    { provide: FALCON_LANGUAGE, useFactory: () => new MockLanguage() },
    { provide: FALCON_NOTIFIER, useFactory: () => new MockNotifier() },
    { provide: FALCON_CONTEXT,  useFactory: () => new MockContextFacade() },
  ]);
}
```

When the remote is loaded INSIDE the host shell at runtime, the host's `provideFalconFacades({ auth: HostAuthFacade, ... })` wins because the host is the root injector. The fallback only kicks in for standalone-dev mode (`nx serve admin-console` directly).

---

## 4. Host facade implementations

### `apps/host-shell/falcon-facades/host-auth.facade.ts`

```ts
@Injectable({ providedIn: 'root' })
export class HostAuthFacade implements FalconAuthFacade {
  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
  private idTokenSubject = new BehaviorSubject<string | null>(this.getIdToken());
  accessToken$ = this.accessTokenSubject.asObservable();
  idToken$ = this.idTokenSubject.asObservable();

  private readItem(itemKey:string): string | null {
    return sessionStorage.getItem(itemKey);
  }
  getAccessToken(): string | null { return this.readItem('access_token'); }
  getIdToken(): string | null { return this.readItem('id_token'); }
  getAuthenticationObject() {
    return { accessToken: this.getAccessToken(), idToken: this.getIdToken() };
  }
  emmitSubjects() {
    this.accessTokenSubject.next(this.getAccessToken());
    this.idTokenSubject.next(this.getIdToken());
  }
}
```

Same shape as MockAuth — both read from sessionStorage. The difference: `HostAuthFacade.emmitSubjects()` is invoked by `AuthService` after successful login to broadcast the new token to any subscriber (remote child apps).

### Other host facades

| Facade | File | Purpose |
|---|---|---|
| `HostAuthFacade` | `apps/host-shell/falcon-facades/host-auth.facade.ts` | Token storage + emit. |
| `HostThemeFacade` | `host-theme.facade.ts` | Theme switching synced with `PrimeNGThemeService`. |
| `HostLanguageFacade` | `host-language.facade.ts` | Language switching synced with `TranslateService`. |
| `HostNotifierFacade` | `host-notifier.facade.ts` | Forwards calls to `FalconMessageService.add()`. |
| `HostContextFacade` | `host-context.facade.ts` | Reads tenant/user from session. |

---

## 5. Identity Service path — **frontend NEVER calls Zitadel directly**

Memory rule `feedback_frontend_auth_identity_service.md` (STRICT): all auth flows go through Falcon Identity at `auth.falconhub.space/api/`.

### Verified in `apps/host-shell/src/app/core/auth/auth-api.service.ts`

```ts
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'auth';
  private readonly gatewayContext = useGateway(Gateway.IdentityGateway);

  /** POST auth/login — toast suppressed; component shows inline error banner */
  login(payload: LoginRequest): Observable<ServiceOperationResult<LoginStepResult>> { ... }
  // verify-otp, resend-otp, forgot-password, set-password, first-login-setup
}
```

All auth endpoints go through `Gateway.IdentityGateway` which `RuntimeBaseUrlInterceptor` rewrites to `environment.baseURLIdentityGateway` (e.g. `auth.falconhub.space/api/`).

**Zitadel grep** — 0 references in `apps/` source. ✓ Verified.

---

## 6. SHELL_CORE_ACCESS computation

```ts
{
  provide: SHELL_CORE_ACCESS,
  deps: [SessionProvider],
  useFactory: (sessionProvider: SessionProvider) => {
    const userType = String(sessionProvider.session?.userType ?? '').trim();
    return userType === USER_TYPE_STRINGS.CLIENT_USER
      ? [FalconAccess.managementConsole.enter()]
      : [FalconAccess.adminConsole.enter()];
  },
}
```

Logic:

- **Client users** (B2C / tenant-side) → require `view app.management-console`.
- **All other users** (B2B / Falcon admins) → require `view app.admin-console`.

`shellPrimeAccessGuard` (from `@falcon`) consumes `SHELL_CORE_ACCESS` to gate the host's LayoutComponent.

---

## 7. Token attachment + refresh flow

### Attachment (`request-interceptor.ts:24-61`)

```ts
intercept(request: HttpRequest<unknown>, next: HttpHandler) {
  let req = request;

  if (environment.useNgrok) {
    req = req.clone({ setHeaders: { 'ngrok-skip-browser-warning': 'true' } });
  }

  const token = this.auth.getAccessToken();

  // Skip auth endpoints (they are [AllowAnonymous])
  const url = req.url || '';
  if (url.toLowerCase().includes('/auth/') || url.toLowerCase().includes('auth/')) {
    return next.handle(req);
  }

  if (token) {
    const tokenExpiryDate = this.authTokenService.getTokenExpirationDate(token);
    if (this.isTokenExpired(tokenExpiryDate)) {
      if (req.headers.has('X-Token-Retried')) {
        this.authTokenService.logout();
        return throwError(() => new Error('Token expired after retry'));
      }
      return this.authTokenService.refreshTokenIfNeeded(req, next, ...);
    }
  }
  return next.handle(this.authTokenService.addTokenToRequest(req, token));
}
```

- 30-second proactive refresh buffer
- `X-Token-Retried` header guards against infinite refresh loops
- Auth endpoints (`/auth/...`) bypass the bearer attachment

### Response (`response-interceptor.ts`)

- 401 → refresh-token flow (delegates to `AuthService.refreshTokenIfNeeded`)
- HTTP-200 `ServiceOperationResult<T>` body with `isSuccessful: false` → push error message
- HTTP 5xx / 404 / 403 / 0 (network) → generic "contact administrator" toast with status code
- `notShowToaster: 'true'` request header suppresses error/success toasts
- Bulk action responses iterate `errorsResponse[]` separately

---

## 8. Recommended pattern for new auth-protected features

1. Inject `AuthService` only inside the host. Remotes inject `FALCON_AUTH` facade.
2. Use `useGateway(Gateway.X)` context for HTTP calls — `RuntimeBaseUrlInterceptor` handles the base URL.
3. Never call Identity Service / Zitadel directly. Use `AuthApiService` (host) or `FALCON_AUTH` facade (remote).
4. Add the route under host-shell's protected tree (`LayoutComponent` children) so `authGuard + shellPrimeAccessGuard` apply automatically.
5. Component-level access control via `FalconAccess.<resource>.<action>()` checks against `RouteAccessService`.
6. Add `requiredAccess: [...]` to the MF manifest entry so `shellAccessMatchGuard` blocks the remote at canMatch time.

---

## 9. Cross-shell SDK bridge — `HostWindowSdkBridge`

`apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts` (referenced in `bootstrap.ts:7,41,59`) exposes the host's facade state on `window.__falconHost*` keys so cross-framework remotes (future React / Vue micro-apps) can read auth/theme/language without going through the Angular DI tree.

The contract lives in `libs/sdk/src/window-sdk/falcon-window-sdk.types.ts`.

This is the bridge that makes the platform multi-framework — not in the Angular sense but in the "any framework remote can plug in" sense.
