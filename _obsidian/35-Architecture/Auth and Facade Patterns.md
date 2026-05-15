---
type: architecture-rules
audit-source: Auth and Facade Patterns
rule-count: 8
created: 2026-05-15
---
*** Architecture Rule Set — Auth and Facade Patterns ***
*** SoT: Brain Outputs/understanding/frontend/architecture/AUTH_AND_FACADE_PATTERNS.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Auth and Facade Patterns

> Composition-root differences between host and remotes. Host registers concrete facade implementations; remotes use `provideFalconFallbackFacades()` mocks (host wins when remote loads inside it). HTTP interceptor chain is ordered: Request (JWT) → RuntimeBaseUrl → Response (errors/refresh). Frontend NEVER calls Zitadel directly — all auth flows through Identity Gateway.

## Source-of-truth file
- [AUTH_AND_FACADE_PATTERNS](../../outputs/understanding/frontend/architecture/AUTH_AND_FACADE_PATTERNS.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-auth-01 | Host composition root MUST register `provideFalconFacades({ auth, theme, language, notifier, context })` with concrete `Host*Facade` implementations. | high | `apps/host-shell/src/app/app.config.ts` |
| AR-auth-02 | Remote composition roots MUST register `provideFalconFallbackFacades()` so they boot in standalone-dev mode; host wins when remote is loaded inside it. | high | `apps/{admin,management}-console/mocks/falcon-fallback.providers.ts` |
| AR-auth-03 | HTTP interceptor order MUST be: `RequestInterceptor` (JWT attach + 30s refresh buffer) → `RuntimeBaseUrlInterceptor` (gateway rewrite) → `ResponseInterceptor` (error toast + 401 refresh). | high | `app.config.ts` HTTP_INTERCEPTORS multi:true |
| AR-auth-04 | Frontend MUST NEVER call Zitadel directly — all auth flows go through `AuthApiService` using `Gateway.IdentityGateway`. | high | Memory `feedback_frontend_auth_identity_service.md` (STRICT) · `auth-api.service.ts` · 0 Zitadel references in `apps/` |
| AR-auth-05 | `SHELL_CORE_ACCESS` factory routes by `SessionProvider.session.userType`: `CLIENT_USER` → `[FalconAccess.managementConsole.enter()]`; all other → `[FalconAccess.adminConsole.enter()]`. | high | `app.config.ts:74-84` |
| AR-auth-06 | RequestInterceptor MUST skip auth endpoints (URL contains `/auth/` or `auth/`) — they are `[AllowAnonymous]`. | medium | `request-interceptor.ts:24-61` |
| AR-auth-07 | RequestInterceptor MUST proactively refresh tokens within 30s of expiry; `X-Token-Retried` header guards against infinite refresh loops. | high | `request-interceptor.ts:24-61` |
| AR-auth-08 | All facades MUST be injected via the `FALCON_AUTH` / `FALCON_THEME` / `FALCON_LANGUAGE` / `FALCON_NOTIFIER` / `FALCON_CONTEXT` `InjectionToken`s — never inject `Host*Facade` directly. | high | Cross-shell SDK contract |
| AR-auth-09 | New auth-protected routes MUST sit under host-shell's `LayoutComponent` children so `authGuard + shellPrimeAccessGuard` apply automatically; MF entries MUST set `requiredAccess: [...]` for `shellAccessMatchGuard`. | high | `app.routes.ts` + manifest schema |

## Forbidden patterns
- Direct Zitadel API calls (`zitadel.com` substring, OAuth2/OIDC client SDKs) — 0 matches verified.
- Injecting `HostAuthFacade` concrete class instead of `FALCON_AUTH` token.
- Hardcoded URLs that bypass `RuntimeBaseUrlInterceptor` and gateway selection.
- Registering animations as a shared MF library (causes RUNTIME-006 — see [[Module Federation]]).

## Recommended patterns
- Use `useGateway(Gateway.X)` HTTP context to drive `RuntimeBaseUrlInterceptor` base URL rewriting.
- `notShowToaster: 'true'` request header to suppress error/success toasts on specific calls.
- `HostWindowSdkBridge` (host) exposes facade state on `window.__falconHost*` keys for cross-framework remotes.
- For Reactive Forms component-level checks: `FalconAccess.<resource>.<action>()` against `RouteAccessService`.

## Related component notes
- [[Falcon Input]] · [[Falcon Button]] — CVA wrappers consumed inside auth-flow features.

## Related backend service
- [[Identity Service]] — owns auth + Zitadel federation.

## Tags

#type/architecture-rules #service/identity

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
