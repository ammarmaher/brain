# @falcon/core — AUDIT (best-practice rubric §5)

> Scored PASS / 🟡 minor / 🟠 medium / 🔴 high-risk. Evidence source-prefixed. **We fix NOTHING this pass** — findings feed `FINDINGS/L02.md`.
> Dimensions B (Stencil dual-render) and E (React/Vue parity) are **N/A** — this is a pure Angular service/guard area with no UI component, no Stencil twin, no cross-framework wrapper. D (accessibility) is also N/A (no rendered markup). The applicable dimensions are **A (Angular 21), C (Falcon house rules), F (completeness/drift)**.

## Headline

**Area grade: 🟡 (solid, production-grade, no high-risk defect).** The access-control sub-area is genuinely well engineered — fail-closed decisions, in-flight dedupe, epoch-based stale-result discard, signal-backed cache, an MF-aware absolute-URL escape hatch with a loud throw. The findings are **mostly minor**: leftover `console.log`/`console.warn` debug noise, a constructor `session$` subscription without explicit teardown (benign for a root singleton but off-pattern), constructor-DI mixed with `inject()`, and the deprecated `adminOrganizationHierarchyGuard` still exported. **Zero 🔴.** Several 🟠 are correctness-adjacent (default-open `canAccessPath`, unbounded localStorage trust).

## A — Angular 21

| Check | Verdict | Evidence |
|---|---|---|
| Functional guards (`CanActivateFn`/`CanMatchFn`) | **PASS** | All 6 guards are functional + `inject()`-based. [CODE] `shell-access.guard.ts:36,52,58` · `guards/*.guard.ts`. No class guards. |
| `inject()` over constructor-DI | **🟡 G1** | Mixed. Guards + `RouteAccessService` + `NodeService` use `inject()` ([CODE] `route-access.service.ts:26-27`, `node.service.ts:18`). But `AccessControlFacade` ([CODE] `:35-40`), `AccessControlClient` ([CODE] `:12`), `CurrentSubjectBuilder` ([CODE] `:14`) use **constructor parameter DI**. `AccessControlClient` even mixes both (`inject(SHELL_ENV_CONFIG)` field + `constructor(private http)`). Inconsistent with the house `inject()` doctrine. |
| Signals for internal state | **PASS** | `AccessControlStore` uses `signal<Record<…>>` + immutable `update`. [CODE] `access-control.store.ts:9,28-35`. (Session uses RxJS `BehaviorSubject` — defensible: it is a cross-cutting stream consumed reactively, predates signals; see G7.) |
| Zoneless-safe | **PASS** | No `setTimeout`-driven CD, no `NgZone`, no `markForCheck`. Async work is promise/RxJS; signals + `BehaviorSubject` notify correctly under `provideZonelessChangeDetection()` ([CODE] `app.config.ts:92`). |
| Proper teardown (`DestroyRef`/`takeUntilDestroyed`) | **🟠 G3** | `AccessControlFacade` constructor does `sessionProvider.session$.subscribe(...)` with **no unsubscribe / no `takeUntilDestroyed`**. [CODE] `access-control.facade.ts:42-53`. For a `providedIn:'root'` singleton this never leaks in practice (lives for app lifetime), but it is off-pattern and would leak if the service were ever provided at a narrower scope. Same shape — but bounded — in `SessionProvider` (no subscription; just `BehaviorSubject`s it owns). |
| `@if/@for` (no `*ngIf/*ngFor`) | **PASS (N/A)** | No templates in this area. |
| No NgModules / standalone | **PASS** | All `@Injectable({providedIn:'root'})`; no modules. |
| New `input()/output()/model()` vs legacy `@Input/@Output` | **PASS (N/A)** | No component I/O. |
| CVA correctness | **PASS (N/A)** | No form controls. |

## C — Falcon house rules

| Check | Verdict | Evidence |
|---|---|---|
| Terse `*** ***` banner comments | **🟡 G2** | `shell-access.guard.ts` + `access-control.client.ts` use the `*** ***` banner well. But `access-control.facade.ts` uses **`//` prose comments** ("inFlight is a map…", "If the fingerprint changes…") [CODE] `:29,41`, and `session-provider.service.ts` uses JSDoc `/** */` throughout — neither is the `*** ***` house style. Cosmetic. |
| Tokens over literals / no hardcoded UI | **PASS (N/A)** | No CSS/markup. The only "magic numbers" are the 30 s refresh buffer (in the app interceptor, not core) and the `colonIndex !== 1` subject-grammar parse (intrinsic, correct). |
| `console.*` debug left in | **🟠 G4** | `RouteAccessService.canAccessPath` logs **on every call**: `console.log('canAccessPath', path, userType, userType)` (note the duplicated arg). [CODE] `route-access.service.ts:48`. Plus `console.warn` in the deprecated guard `:36,51`. `SessionProvider` has ~9 `console.warn/error` (storage failures, decode failure) — those are arguably legitimate diagnostics, but the `RouteAccessService.log` is pure debug noise shipping to production. |
| DRY / minimal | **PASS / 🟡** | Access-control is tight + DRY. Minor: `isVisualTestMode()` is **duplicated verbatim** in `shell-access.guard.ts:70-77` AND app-level `auth.guard.ts:13-20` (the app file even comments "Mirrors the same gate"). Could be a shared util (G6). |
| Falcon components over native | **PASS (N/A)** | No UI. |

## F — Completeness / consistency / drift

| Check | Verdict | Evidence |
|---|---|---|
| Barrel completeness | **PASS** | `core/index.ts` exports interfaces + 3 services + `access-control` (which re-exports the 6 ACL units incl. guard) + 3 guards. `@falcon` re-exports core (`index.ts:21`). Everything reachable. |
| Specs present | **🟠 G5** | **No `*.spec.ts` inside `libs/falcon/src/core`.** The PES decision logic (`readDecision` fail-closed default, `accessKey` dedupe, epoch invalidation, `fetchAndStore` stale-discard, subject-builder throw paths) is **security-critical and untested at the unit level here.** Coverage exists only indirectly via app feature specs (`pes-gating.spec.ts` in new-wallet-balance, `users-state-visible-tabs.spec.ts`). A regression in `readDecision`'s default-deny or the epoch guard would not be caught by a core-local test. |
| Deprecated member still exported | **🟡 G8** | `adminOrganizationHierarchyGuard` is `@deprecated` ([CODE] `admin-organization-hierarchy.guard.ts:18`) and has **no live route consumer** (Consumer Sweep §C), yet is still in the barrel. Safe to remove once confirmed dead, but that is a deletion decision (HIGH-RISK-QUEUE — public API change). |
| Naming consistency | **PASS** | `kebab-case` files; `PascalCase` classes; `camelCase` guard fns. Folder layout (services / access-control / guards) is clean. |
| Scope-label drift (interceptors) | **🟡 G9** | The L02 batch label + task brief claim core holds the interceptors; the live tree does not (they are L04 + host-shell app). Documented in OVERVIEW/SURFACE. This is an **inventory-doc drift**, not a code defect — flagged so the synthesis `AUDIT-REPORT.md` does not re-assert the wrong location. |

## Correctness observations (not house-rule, but worth flagging)

| # | Observation | Verdict | Evidence |
|---|---|---|---|
| G10 | `RouteAccessService.canAccessPath` is **default-OPEN**: a path matching no scope returns `true`. [CODE] `route-access.service.ts:62-63`. Combined with its coarse user-type-only model, it is strictly weaker than the PES guards. It is legacy + narrowly used, but any NEW reliance on it for a sensitive path would silently allow. | 🟠 | `:47-64` |
| G11 | `SessionProvider.loadSessionFromStorage` trusts whatever is in **localStorage** with only a `tenantId\|\|userType` presence check — no signature/expiry validation. [CODE] `:182-199`. A tampered `falcon_user_session` would seed the session until the next token decode. The real authority is the JWT (re-set on each login + refresh) and PES is server-authoritative, so impact is limited, but the persisted blob is attacker-writable in the browser. | 🟠 | `:182-199`, `:302-322` |
| G12 | `AccessControlClient` reads `baseURLPes` and POSTs an **absolute** URL specifically to bypass `RuntimeBaseUrlInterceptor`. Correct + well-commented, but it means PES calls do NOT pass the gateway rewrite — if `baseURLPes` is ever misconfigured to a relative value, the `.trim()` guard throws (good) but there is no positive validation that it is absolute. | 🟡 | `access-control.client.ts:26-38` |
| G13 | `getAuthorizationUserTypeName` (shared-types) maps only `'1'`→system, `'2'`→account; `CurrentSubjectBuilder.build()` **throws** for any other userType. [CODE] `current-subject.builder.ts:22-25`. A session with userType `3`/`4` (NodeAdmin/NormalUser per the platform doc) would make every PES guard throw → `/error`. Verify those user types never reach the protected shell (likely true — only `1`/`2` are "valid user-type values" per [CODE] `user-type.constants.ts:9-10`). | 🟡 | `:22-25` |

## Risk-class summary

- **safe-local (fix later, low risk):** G1 (DI style), G2 (comment style), G4 (`console.log` removal), G6 (dedupe `isVisualTestMode`), G9 (doc-drift note). 
- **HIGH-RISK-QUEUE (need human triage — behavior / security / public-API / coverage):** G3 (teardown — behavior-adjacent), G5 (missing security-critical unit tests), G8 (remove deprecated guard — public API), G10 (default-open legacy authz), G11 (unvalidated localStorage session), G12/G13 (PES URL / userType-throw robustness).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L02). Every verdict cites a source line. B/E marked N/A with rationale (no Stencil twin / no cross-framework wrapper — confirmed by the absence of any `.tsx`/react/vue artifact under `libs/falcon/src/core`). No fixes applied; tree untouched.
