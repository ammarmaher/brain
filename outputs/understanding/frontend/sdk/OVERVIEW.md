# @falcon/sdk — OVERVIEW

> Non-component library area (SPEC §7 lighter 5-file set: OVERVIEW · SURFACE · USAGE · AUDIT · DECISION). Mirrors the falcon-input dossier tone; adapts the structure for a *contract-only* library.

## Purpose

`@falcon/sdk` is the **host↔remote contract library** for the Falcon Module-Federation platform. It contains **only abstractions** — TypeScript interfaces, DI `InjectionToken`s, one provider helper, and ambient global typings. It owns **zero runtime behaviour**: no `@Injectable` services, no HTTP, no component, no logic beyond the `provideFalconFacades()` binding helper. `[CODE]` `libs/sdk/src/index.ts:1` banner — "Public API Surface of @falcon/sdk".

It exists so that:
- **Remotes** (admin-console, management-console) and **shared libs** (`@falcon`'s user-details / OTP features) can call host-owned capabilities (auth token, theme, language, notifications, context, user-details HTTP, OTP HTTP) **through an interface they import**, never a concrete host class.
- The **host-shell** supplies the concrete implementations once at root, and Module Federation shares `@falcon/sdk` as a **singleton/eager** package so every federated bundle resolves the *same* `InjectionToken` identity. `[CODE]` `apps/host-shell/module-federation.config.ts:121-129` (`'@falcon/sdk'` → `singleton:true, eager:true, strictVersion:false, requiredVersion:false`).

This is the concrete realization of the platform's **Facade Pattern (host-remote communication)** described in the agent brief, and the **Port/Adapter** boundary that keeps presentational libs HTTP-free.

## Business / architectural use case

- **Decoupling federated bundles from host internals.** A remote must not `import { AuthService } from 'host-shell'` (it would bundle a second copy + break MF). Instead it imports `FALCON_AUTH` from `@falcon/sdk` and `inject()`s the contract. `[CODE]` `apps/host-shell/src/app/core/auth/auth.service.ts:4,20` (`inject<FalconAuthFacade>(FALCON_AUTH)`).
- **Presentational libraries stay backend-free.** The shared `@falcon` user-details page and OTP dialog depend on **ports** (`USER_DETAILS_GATEWAY`, `OTP_GATEWAY`), and the host binds the real HTTP services to those tokens. `[CODE]` `libs/sdk/src/types/user-details-gateway.interface.ts:1-4`; `libs/sdk/src/types/otp-gateway.interface.ts:1-4`.
- **Standalone-dev ergonomics.** When a remote is served alone (no host), the apps register *mock* facades so the contracts still resolve. NOTE: the mock provider lives in the **apps**, not in this lib (see §SURFACE / AUDIT G3). `[CODE]` `apps/admin-console/mocks/falcon-fallback.providers.ts:178` (`provideFalconFallbackFacades()`).

## What lives here / what does NOT

**Lives here (4 concern groups):**
| Group | Files |
|---|---|
| Falcon facades (5 cross-cutting capabilities) | `types/falcon-facades.interfaces.ts` · `tokens/falcon-facades.tokens.ts` · `facades/provide-falcon-facades.ts` |
| `window.FalconSDK` global bridge typings | `window-sdk/falcon-window-sdk.types.ts` |
| User-details port (interface + token + DTOs) | `types/user-details-gateway.interface.ts` · `tokens/user-details-gateway.token.ts` · `types/user-details.dtos.ts` |
| OTP port (interface + token + DTOs) | `types/otp-gateway.interface.ts` · `tokens/otp-gateway.token.ts` · `types/otp.dtos.ts` |
| Hierarchy facade contract (org-hierarchy port) | `facades/HierarchyFacade.ts` |

**Does NOT live here:** the concrete `Host*Facade` classes (live in `apps/host-shell/falcon-facades/`), the mock `Mock*`/`provideFalconFallbackFacades` (live in each app's `mocks/`), the `HostWindowSdkBridge` that installs `window.FalconSDK` (host), and the HTTP services `UserApiService`/`ProfileOtpService` (host `core/user/`). The SDK is the *seam*, not the *implementation*.

## Status

**ACTIVE / FOUNDATIONAL.** Loaded eagerly into every federated bundle. Stable contract surface — changes here ripple across host + both remotes + the shared `@falcon` features, so it is a high-blast-radius file (see DECISION). `[BRAIN-OUT]` repo is Angular 21.2.9 zoneless + webpack-MF (`reference_fe_structure_standard_angular21_2026_06_02`).

## Source file paths

| Concern | Path | Lines |
|---|---|---|
| Public barrel | `libs/sdk/src/index.ts` | 27 |
| Facade interfaces | `libs/sdk/src/types/falcon-facades.interfaces.ts` | 39 |
| Facade tokens | `libs/sdk/src/tokens/falcon-facades.tokens.ts` | 38 |
| `provideFalconFacades()` | `libs/sdk/src/facades/provide-falcon-facades.ts` | 34 |
| Hierarchy facade contract | `libs/sdk/src/facades/HierarchyFacade.ts` | 102 |
| `window.FalconSDK` typings | `libs/sdk/src/window-sdk/falcon-window-sdk.types.ts` | 38 |
| User-details DTOs | `libs/sdk/src/types/user-details.dtos.ts` | 82 |
| User-details gateway port | `libs/sdk/src/types/user-details-gateway.interface.ts` | 84 |
| `USER_DETAILS_GATEWAY` token | `libs/sdk/src/tokens/user-details-gateway.token.ts` | 11 |
| OTP DTOs | `libs/sdk/src/types/otp.dtos.ts` | 27 |
| OTP gateway port | `libs/sdk/src/types/otp-gateway.interface.ts` | 33 |
| `OTP_GATEWAY` token | `libs/sdk/src/tokens/otp-gateway.token.ts` | 9 |

**Spec/tests:** `[CODE]` NONE — there is no `*.spec.ts` anywhere under `libs/sdk/src` (Glob over `libs/sdk/src/**/*` returns 12 files, all listed above). Contracts are exercised only transitively via app/lib consumer specs. See AUDIT F.

## Import path / selectors

- Public import: `@falcon/sdk` (TS-path alias in `tsconfig.base.json`; never relative to `libs/sdk`).
- No selectors/tags — this lib renders nothing.

## Known consumers (grep-verified 2026-06-03)

`[CODE]` `@falcon/sdk` is imported by **49 files** across the repo (`Grep '@falcon/sdk'`). Of those, the load-bearing *runtime* consumers are:
- **Host-shell** binds all 7 tokens: `provideFalconFacades({...})` + `USER_DETAILS_GATEWAY`/`OTP_GATEWAY` `useExisting`. `[CODE]` `apps/host-shell/src/app/app.config.ts:101-113`.
- **Facade-token injectors:** `auth.service.ts`, `translate.service.ts` (`FALCON_LANGUAGE`), `topbar.component.ts`, `login-layout.component.ts`, `order-status-realtime.service.ts`, `request-interceptor.ts`, both consoles' `users-state.signals.ts` + `node-drawer-state.signals.ts`.
- **Port injectors:** `libs/falcon/.../otp-dialog.component.ts:65` (`inject(OTP_GATEWAY)`), `libs/falcon/.../user-details/signals/signals.ts:130` (`inject(USER_DETAILS_GATEWAY)`).
- **Mock providers + smoke test:** both apps' `mocks/falcon-fallback.providers.ts`, `management-console/debug/facade-smoke.initializer.ts`.

See USAGE.md Consumer Sweep for the full enumerated list + per-symbol breakdown.

## Related areas

- **Concrete host facades:** `apps/host-shell/falcon-facades/host-{auth,theme,language,notifier,context}.facade.ts` (L-future / host batch).
- **`@falcon` core** (L02): `SessionProvider`, interceptors, guards consume the auth facade indirectly.
- **`@falcon` user-details + OTP features** (L05): the presentational consumers of the two ports.
- **falcon-ui-core message orchestrator:** `HostNotifierFacade` delegates to `FalconNotificationService` (`@falcon/ui-core/angular`).

## Ownership

`libs/sdk` — the platform contract library. Owned by the host-shell / platform-architecture team (it defines the host↔remote boundary). Any change requires re-validating host + both remotes because the MF singleton means a token-identity drift breaks DI everywhere.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L01 sweep). All 12 source files read in full; consumer list grep-verified (`@falcon/sdk` = 49 files); MF singleton/eager sharing confirmed at `module-federation.config.ts:121-129`. `provideFalconFallbackFacades` confirmed to live in apps' `mocks/`, NOT in `libs/sdk` (corrects the batch brief's assumption).
