# @falcon/core — OVERVIEW

> Non-component library area (SPEC §7, lighter 5-file set: `OVERVIEW · SURFACE · USAGE · AUDIT · DECISION`).
> Batch **L02**. Source root: `libs/falcon/src/core/`. Re-exported by the `@falcon` barrel.

## Purpose

`@falcon/core` is the **authorization + session kernel** of the Falcon web platform. It holds the three things every micro-frontend (host-shell, admin-console, management-console) needs *before* it can render a protected screen:

1. **Session** — decode the JWT into a typed `UserSession`, persist it, and stream it (`SessionProvider`). [CODE] `lib/services/session-provider.service.ts`
2. **Access control (PES/PBAC)** — ask the Policy Engine Service (PES) "can this subject do this action on this resource?", cache the answer, and expose it as a synchronous `can()` plus an async `ensure()`/`resolveFlags()` (`AccessControlFacade` + `Store` + `Client` + `CurrentSubjectBuilder`). [CODE] `lib/access-control/*`
3. **Route guards** — functional `CanActivateFn`/`CanMatchFn` that gate the protected shell, each console remote, and per-route `data.access` queries. [CODE] `lib/access-control/shell-access.guard.ts` + `lib/guards/*`

It is the FE half of the PES contract. The actual policy decisions live in the backend PES service; this area builds the request, sends it via the dedicated `baseURLPes` host, reads the boolean back, and turns it into route allow/deny + UI flag maps.

## Business / UI use case

- [CODE] `apps/host-shell/src/app/app.routes.ts:13` — the protected shell (`LayoutComponent`) is gated by `[authGuard, shellPrimeAccessGuard]`. `shellPrimeAccessGuard` preloads the console-entry PES query so the sidebar/landing renders with correct permissions.
- [CODE] `apps/admin-console/src/app/app.routes.ts:14` — entire admin remote behind `adminConsoleGuard` (`view` on `app.admin-console`).
- [CODE] `apps/management-console/src/app/app.routes.ts:25` — entire mgmt remote behind `managementConsoleGuard` (`view` on `app.management-console`).
- [CODE] mgmt/admin feature routes pair `shellAccessGuard` + `data.access = FalconAccess.<...>` for defense-in-depth (e.g. `apps/management-console/src/app/app.routes.ts:94` contracts-cost `contract.view()`; `:112` contact-groups `contactGroup.view('acc')`).
- [CODE] In-component flag gating: `apps/admin-console/.../new-wallet-balance/services/wallet.service.ts` and many feature services call `AccessControlFacade.resolveFlags({...})` to drive button/field visibility (USAGE.md Consumer Sweep).

## When to use / when NOT

| Use `@falcon/core` when… | Do NOT use it for… |
|---|---|
| You need the current user's identity/tenant/type from the JWT → inject `SessionProvider`. | HTTP base-URL rewriting / gateway routing → that is `RuntimeBaseUrlInterceptor` in **`@falcon` shared-data-access (L04)**, NOT core. |
| You need a route gated by a PES decision → use `shellAccessGuard` + `data.access`, or a console guard. | JWT *refresh* / login / logout / token storage → that is **app-level `AuthService`** in `apps/host-shell/src/app/core/auth/` (NOT this lib). |
| You need a yes/no permission flag inside a component → inject `AccessControlFacade`, call `resolveFlags()`. | Authentication (is-logged-in) gating → that is **app-level `authGuard`** in `apps/host-shell/src/app/core/guards/auth.guard.ts` (NOT this lib). |
| You need the user's org node → `SessionProvider.node` / `NodeService.getNode()`. | Toast/error rendering on HTTP failure → `ResponseInterceptor` + `FalconHttpUiDispatcherService`, **app-level** in host-shell. |
| You need a coarse user-type→scope check without PES (legacy) → `RouteAccessService`. | New per-resource gating → prefer `FalconAccess` + `shellAccessGuard` over `RouteAccessService` (the latter is type-coarse and predates PES). |

## ⚠️ Scope clarification — interceptors are NOT in this area

The L02 batch label in `00-INVENTORY-AND-BATCHES.md:56` reads "falcon/core: guards + interceptors + services", and the task brief names `RequestInterceptor`, `RuntimeBaseUrlInterceptor`, `ResponseInterceptor`. **Verified against the live tree, `libs/falcon/src/core/` contains NO interceptor.** The HTTP interceptors physically live in three different places and are documented here only as cross-references:

| Interceptor | Actual location | Owning batch | Role (one line) |
|---|---|---|---|
| `RuntimeBaseUrlInterceptor` | [CODE] `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts` | **L04** (shared-data-access) | Rewrites relative URLs → the right gateway base (`useGateway()` context, app-default gateway, or session user-type fallback). Hard-fails when a gateway can't resolve. |
| `RequestInterceptor` | [CODE] `apps/host-shell/src/app/core/interceptors/request-interceptor.ts` | host-shell app | Attaches Bearer token; proactive refresh 30 s before expiry; skips `/auth/` + pre-signed S3 URLs; adds ngrok header. |
| `ResponseInterceptor` | [CODE] `apps/host-shell/src/app/core/interceptors/response-interceptor.ts` | host-shell app | The 200-with-`isSuccessful:false` → app-error pipeline; 4xx/5xx → `dispatchError` (toast/popup); 401 → refresh-token; `notShowToaster` escape hatch. |

The **interceptor *order*** (relevant because `AccessControlClient` deliberately sends an absolute PES URL to dodge `RuntimeBaseUrlInterceptor`) is wired in [CODE] `apps/host-shell/src/app/app.config.ts:133-151`: `RequestInterceptor` → `RuntimeBaseUrlInterceptor` → `ResponseInterceptor` (DI registration order; `withInterceptorsFromDi()` runs them request-side in registration order). Full detail of the error pipeline lives in the host-shell `http-ui` dossier, not here.

This OVERVIEW documents only what `libs/falcon/src/core` actually exports; SURFACE.md lists the cross-references explicitly so the picture is complete.

## Status

**PRODUCTION — actively wired in all three apps.** [CODE] `@falcon` barrel `libs/falcon/src/index.ts:21` (`export * from './core'`). 92 consuming files / 310 symbol occurrences across `apps/` + `libs/` (USAGE.md Consumer Sweep, 2026-06-03). One member is explicitly `@deprecated` (`adminOrganizationHierarchyGuard`).

## Replaces

- [CODE] `lib/guards/admin-organization-hierarchy.guard.ts:18` — `@deprecated Use adminConsoleGuard instead`. The PES-based `adminConsoleGuard` supersedes the user-type-string `adminOrganizationHierarchyGuard`. The old guard (and `RouteAccessService`'s coarse scope rules) predate the PES/PBAC model; `FalconAccess` + `shellAccessGuard` is the current doctrine.

## Full source-file path table

| File | Lines | Layer | Role |
|---|---|---|---|
| [CODE] `libs/falcon/src/core/index.ts` | 18 | barrel | Public API of `@falcon/core` (interfaces, services, guards). |
| [CODE] `libs/falcon/src/core/lib/user-session.interface.ts` | 24 | type | `UserSession` shape decoded from JWT. |
| [CODE] `libs/falcon/src/core/lib/services/session-provider.service.ts` | 337 | service | JWT decode → `UserSession`; localStorage persist; `session$`/`node$` streams. |
| [CODE] `libs/falcon/src/core/lib/services/route-access.service.ts` | 165 | service | Coarse user-type→scope authorization (legacy, pre-PES). |
| [CODE] `libs/falcon/src/core/lib/services/node.service.ts` | 29 | service | `GET commerce/Node` via `useGateway()` → org hierarchy node. |
| [CODE] `libs/falcon/src/core/lib/access-control/index.ts` | 6 | barrel | Re-exports the 6 access-control units. |
| [CODE] `libs/falcon/src/core/lib/access-control/access-control.types.ts` | 33 | type | `PesSubject`, `PesAuthorizeResource(s)Request/Response`, `AccessDecisionEntry`. |
| [CODE] `libs/falcon/src/core/lib/access-control/access-control.store.ts` | 44 | service | Signal-backed decision cache (`can`/`decision`/`setMany`/`reset`/`snapshot`). |
| [CODE] `libs/falcon/src/core/lib/access-control/access-control.client.ts` | 40 | service | HTTP POST to `${baseURLPes}/pes/authorize/resources` (absolute, MF-safe). |
| [CODE] `libs/falcon/src/core/lib/access-control/current-subject.builder.ts` | 57 | service | Builds the canonical PES `PesSubject` from the session. |
| [CODE] `libs/falcon/src/core/lib/access-control/access-control.facade.ts` | 216 | service | `can`/`decision`/`ensure`/`resolveFlags`; in-flight dedupe; epoch invalidation on session change. |
| [CODE] `libs/falcon/src/core/lib/access-control/shell-access.guard.ts` | 120 | guards + token | `SHELL_CORE_ACCESS` token + `shellPrimeAccessGuard`/`shellAccessGuard`/`shellAccessMatchGuard` + visual-test bypass. |
| [CODE] `libs/falcon/src/core/lib/guards/admin-console.guard.ts` | 27 | guard | `adminConsoleGuard` — PES `app.admin-console` view. |
| [CODE] `libs/falcon/src/core/lib/guards/management-console.guard.ts` | 27 | guard | `managementConsoleGuard` — PES `app.management-console` view. |
| [CODE] `libs/falcon/src/core/lib/guards/admin-organization-hierarchy.guard.ts` | 55 | guard | `adminOrganizationHierarchyGuard` — **@deprecated**, user-type `'1'` check. |

Total: **15 source files** (1 barrel + 14 units across 3 sub-areas: services, access-control, guards).

## Selectors / tags

None — this is a service/guard/type area (no Angular components, no Stencil elements).

## Known consumers (headline)

- [CODE] `apps/host-shell/src/app/app.config.ts` — provides `SHELL_CORE_ACCESS`, registers interceptors, injects `SessionProvider`.
- [CODE] `apps/host-shell/src/app/app.routes.ts:3,13` — `shellPrimeAccessGuard`.
- [CODE] `apps/admin-console/src/app/app.routes.ts:2,14` — `adminConsoleGuard`.
- [CODE] `apps/management-console/src/app/app.routes.ts:2,25` — `managementConsoleGuard`, `shellAccessGuard`, `FalconAccess`.
- [CODE] `apps/host-shell/src/app/core/auth/auth.service.ts` — drives `SessionProvider.setFromToken()`/`clear()` on login/logout.
- [CODE] `apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts` — reads `SessionProvider.session.tenantId`.
- ~30 feature services across both remotes inject `AccessControlFacade` (USAGE.md Consumer Sweep).

## Related areas

- **`@falcon` shared-types (L04-adjacent)** — `FalconAccess` registry, `AccessQuery`/`accessKey`/`dedupeAccessQueries`, `USER_TYPE_STRINGS`, `AppRouteScope`/`APP_ROUTES`/`isPathInScope`, `buildSystemUserPolicySubject`/`buildAccountUserPolicySubject`/`getAuthorizationUserTypeName`, `OrgHierarchyNode`, `ServiceOperationResult`, `Gateway`. Core depends on all of these. [CODE] `libs/falcon/src/shared-types/lib/...`
- **`@falcon` shared-data-access (L04)** — `HttpService`, `SHELL_ENV_CONFIG`, `getRuntimeConfigFromWindow`, `useGateway`, `RuntimeBaseUrlInterceptor`. `AccessControlClient` + `NodeService` depend on these.
- **`@falcon/sdk` (L01)** — `FALCON_AUTH` facade; the app `AuthService` (not core) implements it. The session lifecycle is driven from the auth facade → `SessionProvider`.
- **host-shell `http-ui` (app)** — `FalconHttpUiDispatcherService` + `FALCON_HTTP_UI_CONFIG`; the 4xx→toast pipeline `ResponseInterceptor` delegates to.

## Ownership

Falcon platform FE team (Ammar Web-Platform-UI). Authorization/PES contract is co-owned with the backend PES service team (rules live server-side; this area is the FE consumer).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L02). All 15 source files read in full; barrel re-export confirmed (`@falcon` index:21); interceptor non-location verified by Grep (interceptors live in L04 + host-shell app, not core). Consumer footprint Grep-counted (92 files / 310 occurrences).
