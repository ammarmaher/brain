# @falcon/sdk — USAGE

## How the contract is wired (the canonical 3-layer pattern)

The SDK defines the **seam**; three layers complete it.

### Layer 1 — Host provides the implementations (once, at root)

```ts
// apps/host-shell/src/app/app.config.ts:101-113
provideFalconFacades({
  auth: HostAuthFacade, theme: HostThemeFacade, language: HostLanguageFacade,
  notifier: HostNotifierFacade, context: HostContextFacade,
}),
{ provide: USER_DETAILS_GATEWAY, useExisting: UserApiService },
{ provide: OTP_GATEWAY,          useExisting: ProfileOtpService },
```
The 5 facades bind via `provideFalconFacades` (→ `useClass`). The 2 ports bind directly via `useExisting` to the host's HTTP services. `[CODE]` confirmed.

### Layer 2 — Host installs the imperative global

`HostWindowSdkBridge.install()` builds a `FalconWindowSdk` object from the 5 injected `Host*Facade`s and assigns `window.FalconSDK`. Observables (`accessToken$`, `language$`, …) back the `onXChange` callbacks via `subscribeMaybe` (no-op unsubscribe if the facade has no stream). `[CODE]` `apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts:20-59`.

### Layer 3 — Remotes / shared libs consume the contract

```ts
// libs/falcon/.../auth/auth.service.ts:4,20  (host core also consumes the contract)
import { FALCON_AUTH, FalconAuthFacade } from '@falcon/sdk';
private readonly authFacad = inject<FalconAuthFacade>(FALCON_AUTH);

// libs/falcon/.../language/translate.service.ts:6,16
private languageFacade = inject<FalconLanguageFacade>(FALCON_LANGUAGE);

// libs/falcon/.../user-details/signals/signals.ts:130
private readonly userApi = inject(USER_DETAILS_GATEWAY);

// libs/falcon/.../shared-ui/.../otp-dialog/otp-dialog.component.ts:65
private readonly gateway = inject(OTP_GATEWAY);
```
`[CODE]` all four confirmed.

### Standalone-dev fallback (NOT in this lib)

When a remote is served alone, the app registers mock facades so the tokens still resolve:
```ts
// apps/admin-console/src/app/app.config.ts:47  (and management-console likewise)
provideFalconFallbackFacades(),   // defined in apps/<app>/mocks/falcon-fallback.providers.ts:178
```
`MockAuth`/`MockTheme`/`MockLanguage`/`MockNotifier`/`MockContextFacade` implement the 5 facade interfaces with `sessionStorage`/`localStorage`-backed reads + `console.*` notifications. `[CODE]` `apps/admin-console/mocks/falcon-fallback.providers.ts:31-201`. **This lives in the app, not `@falcon/sdk`** — so a 3rd consumer wanting standalone facades must copy it (AUDIT G3).

## Recommended usage (for future tasks)

1. **Need a host capability from a remote/shared-lib?** `inject<TFacade>(FALCON_X)`. NEVER import a `Host*Facade` class or a host service directly — that breaks MF singleton + bundles a second copy.
2. **Need a backend operation from a presentational lib?** Define/extend a **port** (interface + token + DTOs in `@falcon/sdk`), implement it in the host (`apps/host-shell/.../core/...`), and bind with `useExisting`. Keep the lib HTTP-free.
3. **Notifier callers** must treat `info`/`warn` as optional: `notifier.info?.(msg) ?? notifier.success(msg)` (the bridge does exactly this).
4. **Imperative / non-Angular code** (e.g. an injected script) reads `window.FalconSDK?` with a null-guard, never assumes it exists.
5. **DTO shapes** belong in `@falcon/sdk` (camelCase, mirror the C# DTO); do not re-import `@falcon`'s `ServiceOperationResult` class into a port (it would re-introduce the `sdk→falcon` edge the duplication was added to avoid).

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `inject(FALCON_AUTH)` in remotes/libs | `inject(HostAuthFacade)` (host class) from a remote |
| Bind facades once at host root via `provideFalconFacades` | Re-provide the tokens inside a remote's `app.config` (token-identity drift) |
| Add a new port (interface+token+DTO) for a new host-owned backend op | Inject `HttpClient` into a `libs/falcon` presentational component |
| `provideFalconFallbackFacades()` in each app for standalone serve | Ship a remote that assumes the host is always present (NullInjector crash) |
| Promote the `Mock*` providers into `@falcon/sdk` if a 3rd app appears | Duplicate the mock block a third time (DRY) |
| Use `HierarchyFacade` ONLY if you actually bind `HIERARCHY_FACADE` | Treat the exported `HierarchyFacade` as "the way" — it is currently orphaned |

## Consumer Sweep (grep-verified 2026-06-03)

`[CODE]` `Grep '@falcon/sdk'` across `C:\Falcon\Falcon\falcon-web-platform-ui` = **49 files** (incl. docs/specs). Runtime + test code grouped by what they import:

**Host facade wiring + global bridge (host-shell):**
- `apps/host-shell/src/app/app.config.ts` — binds all 7 tokens.
- `apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts` — installs `window.FalconSDK`.
- `apps/host-shell/falcon-facades/host-{auth,theme,language,notifier,context}.facade.ts` — 5 `implements FalconXFacade`.
- `apps/host-shell/src/app/core/user/{user-api.service.ts, user.models.ts, profile-otp.service.ts}` — port impls + DTO re-use.

**Facade-token injectors (`FALCON_*`):** (24 files match `FALCON_AUTH|…|FALCON_CONTEXT`)
- `apps/host-shell/src/app/core/auth/auth.service.ts` (`FALCON_AUTH`), `core/realtime/order-status-realtime.service.ts`, `core/interceptors/request-interceptor.ts`, `layout/components/topbar/topbar.component.ts`, `features/auth/login-layout/login-layout.component.ts`.
- `libs/falcon/src/language/lib/services/translate.service.ts` (`FALCON_LANGUAGE`).
- `apps/{admin,management}-console/src/app/features/org-hierarchy-page/services/state/{users-state,node-drawer-state}.signals.ts`.
- `libs/falcon/src/shared-utils/lib/validations/falcon-validation.token.ts`, `libs/falcon/src/index.ts` (re-export surface).

**Port injectors:**
- `libs/falcon/src/shared-features/user-details/signals/signals.ts` (`inject(USER_DETAILS_GATEWAY)`), `…/user-details/components/user-details-page.component.{ts,html}`, `…/user-details/index.ts`, `…/user-details/models/*`.
- `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.ts` (`inject(OTP_GATEWAY)`), `libs/falcon/src/shared-ui/index.ts` (re-export).

**Mocks + smoke test:**
- `apps/{admin,management}-console/mocks/falcon-fallback.providers.ts`, `apps/management-console/debug/facade-smoke.initializer.ts`.

**MF + build config:** `apps/{host-shell,admin-console,management-console}/module-federation.config.ts`, `apps/host-shell/vite.config.mts`, `tsconfig.base.json`.

**Tests:** `apps/admin-console/tests/users-state-visible-tabs.spec.ts`, `apps/management-console/tests/org-hierarchy/users-state-visible-tabs.spec.ts` (consume `FALCON_*` indirectly).

**Docs (non-code):** `README.md`, `front-end-arch.md`, `Doc/…architecture…v2.md`, `docs/_plans/*`, `docs/archive/WAVE-A-OLD-STRUCTURE.md`, the two `libs/falcon-ui-core/*.md` recon notes.

**Orphan:** `HierarchyFacade` / `HIERARCHY_FACADE` — consumers = `docs/_plans/*` only; zero app/lib runtime binding (see SURFACE §7 + AUDIT G8).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L01). 3-layer wiring traced through host `app.config.ts`, the bridge, and 4 representative injectors. Consumer count (49) + per-symbol injectors grep-verified. Mock-provider location (apps, not lib) confirmed.
