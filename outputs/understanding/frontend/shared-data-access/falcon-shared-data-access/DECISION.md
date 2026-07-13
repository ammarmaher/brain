# falcon-shared-data-access — DECISION

## Brain SK final recommendation

**STATUS: READY (canonical transport layer). Use for all gateway-routed HTTP + the shared cross-feature domain services. The gateway-resolution model is production-hardened; treat it as the single chokepoint for base-URL addressing.**

## Use this area for

- **Any HTTP call that must target a Falcon backend gateway** — spread `...useGateway()` (app/session default) or `...useGateway(Gateway.X)` (specific) into the request; let `RuntimeBaseUrlInterceptor` resolve the base.
- **Cross-feature domain reads/writes shared by both consoles** — lookups, account/username validation, commerce settings, order status, do-payment (comm-channel + application).
- **Generic predicate-stopped polling** — `SimplePollService.watch()`.
- **Acknowledge-required backend-error UX** — `ErrorDialogService.openError()`.
- **The `ServiceOperationResult<T>` envelope unwrap** — every backend response is this shape.
- **Date-only / base64 / enum-option / pricing-type helpers** — `Helper`.
- **Wallet wire DTOs** — import from `@falcon/wallet` (NOT `@falcon`).

## Avoid this area for

- **Single-app feature API services** → keep in the feature folder (the wallet `WalletBalanceService` precedent — removed from here on purpose).
- **PES authorization** → `@falcon/core` `access-control.client.ts` (absolute POST, bypasses this interceptor).
- **JWT attach / global error toaster** → host-shell app interceptors (`RequestInterceptor`/`ResponseInterceptor`), NOT this lib.
- **New form-validation rules** → the validations registry in `shared-utils` (L03). (The `effective-date.rules` here is a legacy exception — F5.)

## Preferred idiom / render path

- **`useGateway()` + `ServiceOperationResult<T>` + `map`-unwrap** is the mandatory shape for new gateway services.
- **Throwing unwrap** for user-actioned writes (so `errorMessages[0]` surfaces); **graceful default** (`of([])`/empty + `catchError`) for silent reads that must not block render.
- **`{ silent: true }` / `notShowToaster`** whenever the caller renders its own inline error.
- Inject `HttpService` for default-base or gateway calls; use **raw `HttpClient`** only when you must skip `buildUrl()` (the `AccountValidationService` / `UserApiService.getMe()` pattern).

## Required upgrades before wider use

**None block usage.** The two HIGH-RISK-QUEUE items (F3 order-status error-message divergence; F4 unused `IdentityGateway` surface) and the lack of lib-level interceptor tests (F1) are improvements, not blockers. The interceptor's Wave 8/10 hard-fail guards already make the worst failure mode (silent localhost fallback) loud.

## Relationship to other areas

- **Consumes `@falcon` shared-types** (L04 sibling) for `ServiceOperationResult`, `Gateway`, and all DTOs — tight coupling by design.
- **Consumes `@falcon/core` `SessionProvider`** (L02) for the host-shell user-type gateway fallback.
- **Consumes `@falcon` language `TranslateService`** (L03) in `Helper`.
- **Composed with host-shell app interceptors** (`Request`/`Response`) to form the full HTTP pipeline — they are app-level, not here.
- **Feeds `@falcon/wallet`** consumers (per-app wallet services) the wire DTOs.

## Exact rule for future implementation tasks

1. **New gateway API service?** `@Injectable({providedIn:'root'})`, `inject(HttpService)` (or raw `HttpClient` if you must bypass `buildUrl`), return `Observable<ServiceOperationResult<T>>`, `map`-unwrap.
2. **Pick the gateway** with `...useGateway()` (default) or `...useGateway(Gateway.ChargingGateway)` — never hardcode a base URL.
3. **Throw `errorMessages[0] || errors[0]`** on failed writes; return an empty default + `catchError` on silent reads.
4. **Add `{ silent: true }`** when your caller shows its own error pill.
5. **Keep single-app services out of this lib**; only promote when a SECOND app needs the exact surface.
6. **Import wallet DTOs from `@falcon/wallet`**, never `@falcon`.
7. **Never widen the gateway enum / `RuntimeEnvironmentConfig`** without checking every `environment.ts` + the `window.FalconRuntimeConfig` bridge (F4).
8. **If you touch the interceptor**, preserve the 4-priority resolution + the hard-fail throw — they exist to keep the localhost-fallback P0 from regressing.

---

## Dynamic capability assessment

### 1. What is static today?
- The 4-entry `GATEWAY_PATH_MAP` (`runtime-api-config.ts:118-123`) — gateway↔config-key wiring is compile-time.
- The base-URL prefixing algorithm in `HttpService.buildUrl` + the interceptor's URL-rewrite (relative→`{base}{path}`).
- The `DEFAULT_UPLOAD_CONFIG` extension allow-list + 1024KB cap.
- `Helper`'s pricing-type label maps + the date-format outputs (`dd/mm/yyyy`).
- `ErrorDialogService`'s 401-suppress rule.

### 2. What is already dynamic through inputs/config?
- **Per-app gateway default** via `provideAppDefaultGateway(Gateway.X)` (admin→System, mgmt→Core).
- **Per-call gateway override** via `useGateway(Gateway.X)`.
- **Runtime env config** swappable at boot via `provideShellEnvFromWindow` reading `window.FalconRuntimeConfig` (no rebuild to retarget gateways).
- **Session-driven fallback** (host-shell): Falcon→System, else→Core, recomputed per request from `SessionProvider`.
- **`silent` toaster-suppress** on the payment services.
- **Poll interval + max-duration + stop-predicate** on `SimplePollService`.

### 3. What is dynamic through slots / templates?
- N/A (no UI). `ErrorDialogService` is deliberately presentation-agnostic so ANY host can render its `state()` signal (the shipped host is `falcon-error-dialog-host`, but a server-rendered fallback or test snapshot could consume the same signal — `error-dialog.service.ts:1-8`).

### 4. What is dynamic through token/theme overrides?
- N/A (no styling). DI-token overrides ARE the extension seam: `SHELL_ENV_CONFIG`, `DEFAULT_BASE_URL`, `APP_DEFAULT_GATEWAY`, `UPLOAD_CONFIG`, `HTTP_BASE_URL` can all be re-provided per app/test.

### 5. What is dynamic through (Tailwind) classes?
- N/A.

### 6. What is missing to make this reusable across pages?
- A documented single rule for graceful-vs-throwing unwrap (F2) + consistent `errorMessages`-first extraction (F3).
- Lib-level specs for the interceptor's resolution matrix (F1).
- A typed `doPayment` error model (the payment services `throw new Error(string)` — callers can't branch on a code; `TransferErrorCode` exists for transfers but there's no equivalent for do-payment).

### 7. What capability should be added to the shared layer (not a page hack)?
- A shared `unwrapServiceResult<T>(opts: { onEmpty?; throwLocalized? })` operator so every service unwraps identically (kills F2/F3 drift). Pages currently re-implement the `map`-unwrap.
- A retry/backoff policy hook on `HttpService` for idempotent GETs (today each caller adds its own or none).

### 8. What flags / options would make it better?
- `useGateway(gateway?, { absolute?: boolean })` to formalize the PES "skip the interceptor" case instead of POSTing an absolute URL from a sibling lib.
- `SimplePollService.watch({ resetOn$ })` to restart polling on an external trigger.
- `ErrorDialogService.openError({ actions? })` for multi-button acknowledgement.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** add a shared `unwrapServiceResult` RxJS operator + adopt it in NEW services; document the graceful-vs-throwing rule (F2). Add lib specs for the interceptor (F1).
2. **Phase B (low risk):** align `OrderStatusService` to `errorMessages[0] || errors[0]` after confirming no caller string-matches (F3).
3. **Phase C (contract — queue):** confirm `Gateway.IdentityGateway`/`baseURLIdentityGateway` are dead, then remove from enum + map + every `environment.ts` + window bridge in lock-step (F4).
4. **Phase D (cohesion):** relocate `effective-date.rules` to `shared-utils` validations (F5); split `Helper` into focused utils (F6).

### 10. What is risky to change because other pages depend on it?
- **The `RuntimeBaseUrlInterceptor` resolution priority** — 47 files + 231 `useGateway` call sites depend on it; any change to the 4-step order or the hard-fail throw risks re-introducing the localhost-fallback P0.
- **The `ServiceOperationResult<T>` unwrap contract** — 67 files unwrap `result`/`isSuccessful`; changing the envelope shape or the `<T = any>` default would ripple monorepo-wide.
- **The gateway enum / `RuntimeEnvironmentConfig` keys** — wired into every `environment.ts` + `window.FalconRuntimeConfig`; removing/renaming a member breaks runtime config (F4).
- **`Helper.parseDateOnly`/`formatDateOnly` TZ-safety** — date-only fields depend on the no-`toISOString` behavior; "fixing" it to use native Date parsing would re-introduce timezone shifts.
- **The `@falcon/wallet` deep-alias isolation** — folding wallet DTOs into `@falcon` would cause the documented `NodeType`/`WalletType` duplicate-export break monorepo-wide.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Recommendation = READY (canonical transport). Idioms + the 4-priority resolution + per-app gateway wiring verified against source; the 10-axis assessment cross-references the AUDIT findings (F1–F9) and the 231/99/14/405 consumer counts. No source edited.
