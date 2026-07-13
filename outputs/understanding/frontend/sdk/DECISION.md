# @falcon/sdk — DECISION

## Brain SK final recommendation

**STATUS: READY / FOUNDATIONAL — KEEP AS-IS for the facade + port pattern. Do not refactor casually.** `@falcon/sdk` is the correct, working host↔remote seam: getter-only facade interfaces + DI tokens + a class-or-value provider helper, shared as an MF **singleton/eager** package so token identity is stable across host + both remotes. The port/adapter ports (`UserDetailsGateway`, `OtpGateway`) correctly keep presentational `@falcon` libs HTTP-free. The medium audit rating is about **hygiene** (orphaned contract, no tests, contract drift), not design.

## Use this library for

- **Any host capability a remote or shared lib needs** (auth token, theme, language, notifications, context) → import the `FALCON_*` token + interface and `inject()`.
- **Any host-owned backend operation a presentational lib must call** → add a **port** here (interface + token + DTOs), implement in host, bind `useExisting`.
- **Imperative / non-Angular access** to the 5 capabilities → `window.FalconSDK?` (typed by this lib, installed by the host bridge).

## Avoid this library for

- Concrete behaviour — it must stay contract-only. Put `@Injectable` services / HTTP in the host (`apps/host-shell/.../core/...`), not here.
- Component code — that's `@falcon/ui-core`.
- Generic domain types unrelated to the host↔remote seam — those belong in `@falcon`'s `shared-types`.
- **`HierarchyFacade`** as a "recommended pattern" — it is currently orphaned (no binder). Use it only if you actually wire `HIERARCHY_FACADE`.

## Preferred wiring (the rule for future tasks)

1. **Remote/lib needs a host capability?** `inject<TFacade>(FALCON_X)`. Never import a `Host*Facade` class or host service across the federation boundary.
2. **New host-owned backend op for a lib?** New port = interface (`Observable<ServiceOperationResult<T>>`, mirror the existing two) + token + camelCase DTOs, all in `@falcon/sdk`; host implements + `{provide:TOKEN, useExisting:HttpService}`.
3. **Always** keep `@falcon/sdk` in the MF `additionalShared` singleton/eager list (`module-federation.config.ts:121-129`). Removing it = token-identity drift = DI breaks in remotes.
4. **Each app** must register `provideFalconFallbackFacades()` for standalone serve (it lives in the app's `mocks/`, not the lib).
5. **Notifier** callers null-safe on `info`/`warn`; **`window.FalconSDK`** consumers null-guard the global.
6. New port DTOs do **not** import `@falcon` classes (keep the `sdk→falcon` edge absent — see the `ServiceOperationResult` precedent).

## Relationship to other areas

- **Implemented BY:** `apps/host-shell/falcon-facades/host-*.facade.ts` (5 facades) + `apps/host-shell/core/user/{UserApiService, ProfileOtpService}` (2 ports). Mocked BY each app's `mocks/falcon-fallback.providers.ts`.
- **Installed onto `window` BY:** `apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts`.
- **Consumed BY:** `@falcon` core (auth/translate/interceptor), both consoles' org-hierarchy state, `@falcon` user-details + OTP features.
- **Shared WITH:** MF singleton/eager alongside `@falcon`.

## Required upgrades before wider use

**None block usage.** The seam is production-quality. Hygiene backlog (all `safe-local` unless noted), in priority order:
1. **G8 — resolve `HierarchyFacade`** (bind it in both consoles' `HierarchyService`, or delete the dead contract). Highest signal: 100+ lines of unconsumed public surface.
2. **G10 — add a `provide-falcon-facades.spec.ts`** (class-vs-value branch + token identity).
3. **G3 — promote the mock facades** into the lib (`provideFalconFallbackFacades`/`@falcon/sdk/testing`) to DRY the two app copies.
4. **G1 — declare optional `…$?: Observable<T>`** on the facade interfaces so the bridge's subscription contract is first-class.
5. **G2 — rename `emmitSubjects`** (HIGH-RISK-QUEUE: public-contract; coordinate interface + host + both mocks).
6. **G5 — single-source the DI ↔ `window.FalconSDK` surface** (HIGH-RISK-QUEUE).
7. **G4/G6/G7/G9** — `getLanguage()` union, `ServiceOperationResult` dedup decision, align `HierarchyFacade` to Observable, kebab-case rename.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- The token-string debug names (frozen `FALCON_FACADE_TOKENS`).
- The 5 facade method signatures (getter-only).
- The two port method sets ("no more" — deliberately fixed).
- The `eUserStatus` / PES semantics baked into `UserDetailsGateway` doc-comments.

### 2. What is dynamic through inputs/options?
- `provideFalconFacades(opts)` accepts **class OR instance** per facade (`useClass`/`useValue` auto-selected by `bindToken`). `[CODE]` `provide-falcon-facades.ts:13-24`.
- Ports are bound by the host to **any** implementation (`useExisting`/`useClass`/`useValue`) — the lib doesn't care which.
- `FalconContext` is an open `[k:string]: any` bag — host attaches arbitrary domain keys.

### 3. What is dynamic through slots / templates?
- N/A (no rendering).

### 4. What is dynamic through token/theme overrides?
- N/A for styling. The *tokens here are DI tokens*, not CSS — every capability is swappable by re-binding the `InjectionToken` (real host vs mock vs test double).

### 5. What is dynamic through "Tailwind classes"?
- N/A.

### 6. What is missing to make it reusable across more apps/frameworks?
- A lib-owned `provideFalconFallbackFacades` (G3) so a new app doesn't copy the mock block.
- A `@falcon/sdk/testing` harness (test doubles) — currently each consumer rolls its own.
- React/Vue DI-less consumption of `window.FalconSDK` is typed but unproven (no wrapper uses it).

### 7. What capability should be promoted (not app-hacked)?
- The `Mock*` facades (G3) — they're identical in two apps.
- The `window.FalconSDK` installer is in the host; its *typing* is here — fine, but the install logic could be a documented host-only contract step.

### 8. What flags / options would make it better?
- Optional `…$?: Observable<T>` on the 3 stateful facades (auth/theme/language/context) to formalize change-streams (G1).
- A dev-time `NullInjector` guard / friendlier error when a `FALCON_*` token is unbound.
- Align `HierarchyFacade` to `Observable<ServiceOperationResult<T>>` if it's revived (G7).

### 9. What is the safest upgrade path?
1. **Phase A (zero-risk, additive):** add `provide-falcon-facades.spec.ts`; add optional `…$?` stream fields to interfaces (additive — existing impls already have them); promote `provideFalconFallbackFacades` into the lib (apps keep importing the same symbol via re-export).
2. **Phase B (decision):** bind or delete `HierarchyFacade` (G8). If binding, both consoles' `HierarchyService implements HierarchyFacade` + provide `HIERARCHY_FACADE`.
3. **Phase C (coordinated, HIGH-RISK-QUEUE):** rename `emmitSubjects` (G2) across interface + host + both mocks in one atomic change; then optionally unify the DI ↔ `window.FalconSDK` surface (G5).
All Phase-A steps are non-breaking; B and C require host + both-remote re-verification because of the MF singleton.

### 10. What is risky to change because others depend on it?
- **The token identities** (`FALCON_AUTH` etc.) — re-creating/renaming a token breaks DI in every federated bundle; the MF singleton assumes one identity.
- **Method signatures** on the facades/ports — host impls + the bridge + mocks + consumer specs all bind to them.
- **`emmitSubjects` spelling** — frozen across 3 places.
- **`ServiceOperationResult` shape** — structurally shared with `@falcon`'s class; drift would silently mistype every port response.
- **Keeping `@falcon/sdk` in MF `additionalShared`** — must never be dropped.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L01). Recommendation: KEEP the pattern, work the hygiene backlog. 2 items are HIGH-RISK-QUEUE (G2 rename, G5 surface-unify); the rest safe-local. All claims trace to source lines cited in OVERVIEW/SURFACE/AUDIT.
