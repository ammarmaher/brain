# @falcon/sdk — AUDIT (best-practice rubric §5)

Scope note: `@falcon/sdk` is a **contract-only** library (interfaces, tokens, one provider helper, ambient typings). Component-centric rubric dimensions (B Stencil dual-render, D accessibility) are **N/A** and marked so. The audit weights **A (Angular-21 idioms in the provider helper)**, **C (house rules)**, **E (cross-framework)**, and **F (completeness/drift)** — the dimensions that actually apply to a seam library.

## Rubric scorecard

| Dim | Verdict | One-line basis |
|---|---|---|
| **A — Angular 21** | 🟡 minor | `provideFalconFacades` is correct modern `makeEnvironmentProviders`/`EnvironmentProviders`; the lib is component-free so OnPush/signals/control-flow are N/A. Minor: tokens are string-keyed without `providedIn`/factory (acceptable for host-supplied seams, but means hard NullInjector on misconfig). |
| **B — Stencil dual-render** | ⚪ N/A | No components, no Stencil, no `-tw` twin. |
| **C — Falcon house rules** | 🟡 minor | No SCSS/CSS/hex/px (no styling at all) ✅; terse `*** ***` banners present on most files ✅; kebab-case files mostly ✅. Deviations: `HierarchyFacade.ts` is **PascalCase filename** (G9); justified `any` in `FalconContext` (compliant); some files lack the banner. |
| **D — Accessibility** | ⚪ N/A | Renders nothing. |
| **E — Cross-framework parity** | 🟠 medium | The 5 facades + `window.FalconSDK` are **Angular-only** consumable through DI; React/Vue wrappers (`libs/falcon-ui-react`/`vue`) consume `@falcon/ui-core` components, NOT `@falcon/sdk` facades. The `window.FalconSDK` global is the *intended* framework-neutral path but is typing-only here and host-installed (G5 divergence risk). |
| **F — Completeness / drift** | 🟠 medium | **Zero tests** in the whole lib (G10); **`HierarchyFacade` is exported-but-orphaned** (G8); contract↔impl drift (host facades expose observables + setters the interfaces don't declare, G1); a typo is frozen into the public contract (G2). |

**Area verdict: 🟠 (medium).** The core facade/port seam is well-designed and correctly wired (singleton/eager MF sharing, port/adapter keeps libs HTTP-free, dual DI+window surfaces). The medium rating is driven by an **orphaned public contract**, **no test coverage**, and **contract-vs-implementation drift** — all documentation/consistency issues, none of them runtime-breaking, and **all `safe-local`** (no fix this pass).

---

## A — Angular 21 (provider helper)

- `[CODE]` `provide-falcon-facades.ts:1,26-27` — uses `makeEnvironmentProviders` + `EnvironmentProviders` return type (modern, tree-shakable, correct for `app.config.ts` `providers[]`). ✅
- `[CODE]` `bindToken` dual `useClass`/`useValue` via `typeof impl === 'function'` (`:21-24`) — clean, no `any`. ✅
- No NgModules, no decorators in the lib (it's pure TS contracts). Zoneless-safe by construction. ✅
- 🟡 The 5 facade tokens + 2 port tokens are plain `new InjectionToken<T>(name)` with **no `factory`/`providedIn`** → a remote served without `provideFalconFallbackFacades()` (or without the host) throws `NullInjectorError`. This is by-design (the host MUST supply them) but there is no `factory` default and no dev-time guard message. The mgmt smoke test compensates with `{optional:true}` reads (`facade-smoke.initializer.ts:9-12`).

## C — Falcon house rules

- ✅ **No styling** — zero `.css`/`.scss`/hex/px/inline-style anywhere (contract lib).
- ✅ **Justified `any`** — `FalconContext[k:string]: any` carries an inline `eslint-disable` + rationale (`falcon-facades.interfaces.ts:33`), matching [MEMORY] gate-01 "any → type-or-justified-disable" doctrine.
- ✅ **Terse banners** — `*** ***` headers on `HierarchyFacade.ts`, `user-details.dtos.ts`, both gateway interfaces, both tokens, `otp.dtos.ts`. 🟡 `falcon-facades.interfaces.ts`, `falcon-facades.tokens.ts`, `provide-falcon-facades.ts`, `window-sdk.types.ts` have **no banner comment** (minor inconsistency).
- 🟡 **G9 — filename casing.** `facades/HierarchyFacade.ts` is PascalCase; every other source file is kebab-case (`provide-falcon-facades.ts`, `falcon-facades.tokens.ts`, …) and the house standard is kebab-case for services/models. `safe-local`.
- ✅ DRY within the lib; ports are deliberately minimal ("no more" comments).

## E — Cross-framework parity

- 🟠 **G5 — dual surface divergence.** Capabilities are exposed twice: (1) DI tokens (`FALCON_*`, getter-only) and (2) `window.FalconSDK` (adds `onXChange` subscriptions, makes `notify.info/warn` required). The two can drift — e.g. `FalconNotifierFacade.info?` is optional but `FalconWindowSdk.notify.info` is required; the bridge papers over it with `?.() ?? success(...)`. There is no single source generating both. The React/Vue wrappers don't consume either, so the framework-neutral promise of `window.FalconSDK` is currently aspirational (host-only installer). `HIGH-RISK-QUEUE` only if a future change tries to unify them (public-contract change).

## F — Completeness / consistency / drift

- 🔴-leaning-🟠 **G10 — zero tests.** `[CODE]` no `*.spec.ts` under `libs/sdk/src` (Glob = 12 files, all production). The provider helper's class-vs-value branch, the token identities, and the port shapes are validated only transitively by consumer specs. For a foundational seam, a tiny `provide-falcon-facades.spec.ts` (asserting `useClass` vs `useValue` selection) would be cheap insurance. `safe-local`.
- 🟠 **G8 — orphaned `HierarchyFacade` contract.** Exported from the barrel (`index.ts:11`) but `Grep 'HierarchyFacade|HIERARCHY_FACADE'` finds **only the SDK file + `docs/_plans/*`** — no `implements`/`inject` in `apps/` or `libs/falcon/`. The org-hierarchy feature shipped with per-app state signals instead. So 100+ lines of contract (11 methods + 12 types + a token) are dead public surface. Decide: bind it (admin/mgmt `HierarchyService implements HierarchyFacade` + `HIERARCHY_FACADE`) or delete it. `safe-local` (dead-export).
- 🟡 **G1 — contract↔impl drift (additive).** Host facades expose members the interfaces don't declare: `HostAuthFacade.accessToken$/idToken$` (used by the bridge), `HostThemeFacade.setTheme/theme$`, `HostLanguageFacade.setLanguage/language$`, `HostContextFacade.setContext/context$`. The interfaces are getter-only; the `onXChange` bridge depends on the **undeclared** observable fields. A consumer typed to the interface can't see them (correct encapsulation) but the bridge reaches past the type. Consider an optional `…$?: Observable<T>` on the interfaces to make the subscription contract first-class. `safe-local`.
- 🟡 **G2 — typo frozen into public API.** `FalconAuthFacade.emmitSubjects()` (double-m) — `[CODE]` `falcon-facades.interfaces.ts:10`, mirrored in `HostAuthFacade.emmitSubjects` (`host-auth.facade.ts:32`) and `MockAuth.emmitSubjects` (`falcon-fallback.providers.ts:65`). Renaming touches the interface + both apps' mocks + host facade → `HIGH-RISK-QUEUE` (public-contract change), though low-severity.
- 🟡 **G4 — `getLanguage(): string`** not a `'en'|'ar'` union though the platform is bilingual en/ar with RTL. Loosens type safety for callers. `safe-local`.
- 🟡 **G6 — `ServiceOperationResult` duplication.** Deliberately re-declared in `user-details.dtos.ts:8-13` (call-free) to avoid a `sdk→falcon` import edge — documented at `:6-7`. Acceptable trade-off but a structural duplicate that can silently drift from `@falcon`'s class. `safe-local`.
- 🟡 **G7 — `HierarchyFacade` uses `Promise`** while `UserDetailsGateway`/`OtpGateway` use `Observable<ServiceOperationResult<T>>` (`HierarchyFacade.ts:87-99`). Inconsistent async style across the three contracts in one lib. (Compounds G8 — if rebuilt, align to Observable.) `safe-local`.
- 🟡 **G3 — mock facades live in apps, not the SDK.** `provideFalconFallbackFacades` + the 5 `Mock*` classes are duplicated in `apps/admin-console/mocks/` and `apps/management-console/mocks/`. A `@falcon/sdk/testing` (or `provideFalconFallbackFacades` exported from the lib) would DRY it and let a 3rd consumer reuse it. `safe-local`.

## HIGH-RISK-QUEUE items (do NOT fix this pass)

| # | Item | Why high-risk |
|---|---|---|
| G2 | Rename `emmitSubjects` → `emitSubjects` | Public-contract rename; touches interface + host facade + both app mocks; MF singleton means a half-renamed surface breaks DI at runtime. |
| G5 | Unify DI facades ↔ `window.FalconSDK` surface | Public-contract change to the framework-neutral global; affects host bridge + any imperative consumer. |

Everything else (G1, G3, G4, G6, G7, G8, G9, G10) is **`safe-local`** — documentation/consistency/dead-export/test additions with no runtime blast radius.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L01). Each gap cites a read source line. Test-absence verified by Glob (12 prod files, 0 specs). Orphan + drift verified by cross-repo grep. Area verdict 🟠 medium; 2 HIGH-RISK-QUEUE (G2, G5), 8 safe-local.
