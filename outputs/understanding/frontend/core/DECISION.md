# @falcon/core — DECISION

## Brain SK final recommendation

**STATUS: READY (production kernel). `@falcon/core` is the canonical home for FE session + PES authorization + route guards. Use it; do not re-implement any of it per-app.**

The area is the load-bearing authorization spine of all three micro-frontends. It is well-architected (fail-closed PES decisions, in-flight dedupe, epoch invalidation, signal cache, MF-safe absolute PES URL). The audit found **no high-risk code defect** — only minor style/cleanup items plus a real **unit-test gap** on security-critical logic. Keep it as the single source for these concerns.

## Use this area for

- **Reading the authenticated identity** → inject `SessionProvider` (`session`/`session$`, `node`/`node$`). `identityUserId` for ownership, `subjectId` for the Zitadel sub, `tenantId` for tenancy.
- **Gating a console remote** → `adminConsoleGuard` / `managementConsoleGuard` on the remote's root route.
- **Gating an individual protected route** → `shellAccessGuard` (or `shellAccessMatchGuard` for `canMatch`) + `data.access: FalconAccess.<area>.<action>()`.
- **Preloading shell-entry permissions** → `shellPrimeAccessGuard` + a `SHELL_CORE_ACCESS` provider.
- **Driving UI visibility from permissions** → `AccessControlFacade.resolveFlags({...})` → signals.

## Avoid this area for

- **Authentication (is-logged-in)** → app-level `authGuard` (`apps/host-shell/.../core/guards/auth.guard.ts`). Not core.
- **Token refresh / login / logout / storage** → app-level `AuthService` (`apps/host-shell/.../core/auth/`). Core only *consumes* the decoded token via `SessionProvider.setFromToken`.
- **HTTP gateway URL rewriting** → `RuntimeBaseUrlInterceptor` (`@falcon` shared-data-access, **L04**). Not core.
- **HTTP error → toast/popup** → `ResponseInterceptor` + `FalconHttpUiDispatcherService` (host-shell app). Not core.
- **New per-resource gating via `RouteAccessService`** → it is legacy, coarse (user-type only), and **default-open** (AUDIT G10). Use `FalconAccess` + `shellAccessGuard` instead.
- **New uses of `adminOrganizationHierarchyGuard`** → `@deprecated`; use `adminConsoleGuard`.

## Preferred API per task

| Task | Preferred | Avoid |
|---|---|---|
| Console-level gate | `adminConsoleGuard` / `managementConsoleGuard` | hand-rolled userType check |
| Route-level gate | `shellAccessGuard` + `data.access` | `adminOrganizationHierarchyGuard`, `RouteAccessService.canAccessPath` |
| Component flags | `AccessControlFacade.resolveFlags()` | `facade.can()` without prior `ensure()` |
| Identity read | `SessionProvider` | re-decoding JWT in app code |
| PES query construction | `FalconAccess.<…>()` factory | inline `{action, resource}` literal |

## Required upgrades before wider use

**None are blockers.** The area is production-quality today. Recommended additive improvements (all in `FINDINGS/L02.md`):

1. **Add core-local unit specs (G5)** for the security-critical paths: `AccessControlFacade.readDecision` default-deny, `accessKey`/dedupe, epoch stale-discard, `CurrentSubjectBuilder` throw paths, `SessionProvider` Zitadel-metadata decode. *(HIGH-RISK-QUEUE only because it touches authz behavior — the test addition itself is safe.)*
2. **Remove the `console.log` in `RouteAccessService.canAccessPath` (G4)** — pure debug noise on a hot path. *(safe-local.)*
3. **Tidy DI/comment style (G1, G2)** — move `AccessControlFacade`/`Client`/`SubjectBuilder` to `inject()`; normalize banner comments. *(safe-local.)*
4. **Decide the fate of `adminOrganizationHierarchyGuard` (G8)** + `RouteAccessService` default-open (G10) — both legacy, both superseded by PES. *(HIGH-RISK-QUEUE — public-API/behavior.)*

## Relationship to other areas

- **Depends on shared-types (L04-adjacent):** `FalconAccess`, `AccessQuery`/`accessKey`, subject builders, `USER_TYPE_STRINGS`, `AppRouteScope`/`APP_ROUTES`, `OrgHierarchyNode`, `ServiceOperationResult`, `Gateway`.
- **Depends on shared-data-access (L04):** `HttpService`, `SHELL_ENV_CONFIG`, `getRuntimeConfigFromWindow`, `useGateway`, and the `RuntimeBaseUrlInterceptor` it deliberately bypasses.
- **Consumed by `@falcon/sdk` (L01) indirectly:** the `FALCON_AUTH` facade (app `AuthService`) drives `SessionProvider`; the facade is the public auth surface, core is the private kernel.
- **Drives app routing in all three apps** (host-shell shell + both remote roots).

## Exact rule for future implementation tasks

1. **New protected route?** `canActivate:[shellAccessGuard]` + `data.access: FalconAccess.<area>.<action>()`. Add the factory to `FalconAccess` first if missing. For sensitive features, pair the guard+`data.access` at BOTH parent and child route (the contracts/contact-groups precedent — closes menu-hiding-only gaps).
2. **New console remote?** Gate its root with a `<console>Guard` (PES `app.<console>` view).
3. **New permission-driven UI?** `AccessControlFacade.resolveFlags({...})` in an `async` init → `signal`. Treat all-false as the safe default (it is fail-closed).
4. **Need identity?** `SessionProvider` only. Never duplicate JWT decoding.
5. **Never** add new uses of `RouteAccessService` (default-open) or `adminOrganizationHierarchyGuard` (deprecated) for per-resource gating.
6. **PES transport** is `AccessControlClient`'s job (absolute `baseURLPes` URL) — never route PES through the gateway.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- The `SCOPE_AUTHORIZATION_RULES` map in `RouteAccessService` (hardcoded scope→userType, [CODE] `route-access.service.ts:34-39`).
- The `/401`/`/error` redirect targets (`APP_ROUTES`, shared-types constants).
- The 30 s token-expiry buffer (in the app `RequestInterceptor`, not core).
- The PES endpoint suffix `/pes/authorize/resources` ([CODE] `access-control.client.ts:37`).
- localStorage keys `falcon_user_session` / `falcon_org_node`.

### 2. What is already dynamic through inputs/config?
- `SHELL_CORE_ACCESS` injection token — host-shell supplies the preload-query list at runtime, branched by user-type ([CODE] `app.config.ts:122-132`).
- `data.access` route data — any `AccessQuery` / array / `(route)=>…` factory drives `shellAccessGuard`.
- `baseURLPes` from `SHELL_ENV_CONFIG` **or** `window.FalconRuntimeConfig` — runtime-resolved, MF-safe.
- PES decisions themselves — entirely server-driven; the FE caches whatever PES returns.

### 3. What is dynamic through slots / templates?
- N/A — no UI.

### 4. What is dynamic through token/theme overrides?
- N/A — no styling.

### 5. What is dynamic through Tailwind classes?
- N/A.

### 6. What is missing to make this reusable across pages?
- Core-local unit tests (G5) so consumers can trust the contract under refactor.
- A shared `isVisualTestMode()` util (G6) instead of the duplicate in core + app.
- Positive validation that `baseURLPes` is absolute (G12).

### 7. What capability should be added to the shared kernel (not page-hacked)?
- The `resolveFlags`→signal pattern is already shared correctly. Pages should NOT cache PES booleans locally — always go through the facade (it dedupes + invalidates on session change). If a page is tempted to memoize, that capability belongs in the facade.
- A typed `data.access` helper / route-builder could reduce inline `data:{access:…}` boilerplate.

### 8. What flags / options would make it better?
- An opt-in "stale-while-revalidate" mode on the facade (currently a session-fingerprint change hard-resets all decisions).
- A debug flag to gate the `console.*` diagnostics (instead of unconditional logs).

### 9. What is the safest upgrade path?
1. **Phase A (zero risk):** delete the `RouteAccessService.canAccessPath` `console.log` (G4); normalize comment/DI style (G1/G2); extract shared `isVisualTestMode()` (G6).
2. **Phase B (additive, safe):** add core-local specs (G5) — pure test additions, no behavior change.
3. **Phase C (behavior — needs approval):** add absolute-URL validation to `AccessControlClient` (G12); add `takeUntilDestroyed` to the facade's session subscription (G3 — harmless but off-pattern).
4. **Phase D (deletion — needs approval):** retire `adminOrganizationHierarchyGuard` (G8) + `RouteAccessService` once confirmed dead; this is a public-API change.

### 10. What is risky to change because other pages depend on it?
- The **fail-closed defaults** (`readDecision`→`deny`, `resolveFlags`-on-throw→all-false). Flipping either to fail-open would silently grant access platform-wide — never change.
- The `accessKey` hashing scheme — every cached decision keys off it; changing the field order/format invalidates the cache contract.
- `SessionProvider`'s `login = null` (sub-first) decision — `CurrentSubjectBuilder` falls back `login ?? subjectId`; changing it would alter the PES subject string for every user.
- The localStorage keys + `normalizeStoredSession` back-fill — changing the shape breaks already-persisted sessions on existing browsers.
- The console-guard PES resources (`app.admin-console` / `app.management-console`) — must stay in lockstep with the backend PES rule store; renaming either side locks every user out of that console.
- The `RuntimeBaseUrlInterceptor` registration order vs `AccessControlClient`'s absolute URL — the client's bypass depends on staying absolute; do not "helpfully" relativize it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L02). Recommendation: READY/production kernel. No blockers; the only HIGH-RISK-QUEUE items are a test-coverage gap (G5) and two legacy-deletion/behavior decisions (G8/G10/G11), none introduced by this pass.
