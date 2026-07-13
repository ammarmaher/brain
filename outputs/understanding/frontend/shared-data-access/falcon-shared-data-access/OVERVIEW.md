# falcon-shared-data-access — OVERVIEW

> Non-component area dossier (SWEEP-SPEC §7 lighter 5-file set: OVERVIEW · SURFACE · USAGE · AUDIT · DECISION). This is `@falcon` `shared-data-access` — the HTTP transport layer for the whole web platform: the `HttpService` wrapper, the **runtime gateway-resolution config + `RuntimeBaseUrlInterceptor`**, a small set of cross-feature domain API services, the `ServiceOperationResult<T>` envelope consumers, and the wallet wire-DTO sub-module exposed via `@falcon/wallet`. Not a UI component — mirror falcon-input tone, skip the B (Stencil) and E (cross-framework) rubric dimensions; D (a11y) is N/A.

## Area purpose

Three cohabiting transport concerns under one lib:

1. **The HTTP plumbing** (`lib/services/http.service.ts` + `lib/runtime-config/` + `lib/interceptors/`) — `HttpService` is a thin Angular `HttpClient` wrapper that strips null query params and prepends a configured base URL; the **runtime-config** module owns the multi-gateway addressing model (`useGateway()`, `Gateway` enum → `RuntimeEnvironmentConfig` key map, DI tokens, `window.FalconRuntimeConfig` bridge); the **`RuntimeBaseUrlInterceptor`** rewrites every relative request URL onto the correct micro-frontend gateway at runtime, with hard-fail guards against the "every API call hits localhost:4200" bug class.
2. **Cross-feature domain API services** (`lib/services/`) — small, shared HTTP services that more than one feature needs: `LookupService` (country/city lookups), `AccountValidationService` (account-name + username uniqueness), `CommerceSettingsService` (password-level / limits / allowed-IPs), `OrderStatusService` + `CommChannelPaymentService` + `ApplicationPaymentService` (the do-payment / order-poll trio), the `Helper` utility service, the `SimplePollService` (generic RxJS poller), and the presentation-agnostic `ErrorDialogService` state holder.
3. **The wallet wire contract** (`lib/wallet/`) — the shared single-source-of-truth DTOs/enums/pure-helpers for the wallet & balance feature, deliberately exposed via the **dedicated `@falcon/wallet` deep alias** (NOT the shared-data-access barrel) because `NodeType`/`WalletType` collide by-name with `shared-types` enums. The API-calling `WalletBalanceService` was REMOVED from this lib — each app owns its own copy and imports only the DTOs from here.

`[CODE]` Barrel `libs/falcon/src/shared-data-access/index.ts:2-5` re-exports `./lib/services`, `./lib/runtime-config`, `./lib/interceptors`, `./lib/validators` — **the `./lib/wallet` folder is intentionally NOT in this barrel** (it ships through its own path alias). The whole area is re-exported through `@falcon` (the top-level `libs/falcon/src/index.ts` barrel).

## Business / UI use case

- **Every authenticated API call in the platform** flows through this layer: feature services either inject `HttpService` (legacy/default-base path) or call raw `HttpClient` with `...useGateway()`, and the `RuntimeBaseUrlInterceptor` rewrites the URL to the right gateway. `[CODE]` `useGateway` is consumed in **231 occurrences across 47 files** (grep 2026-06-03) — it is the platform's gateway-selection idiom.
- **Multi-tenant / multi-user-type addressing**: `[CODE]` admin-console provides `provideAppDefaultGateway(Gateway.SystemGateway)` (`apps/admin-console/src/app/app.config.ts:70`) so Falcon-admin calls hit the System Gateway; management-console provides `Gateway.CoreGateway` (`apps/management-console/src/app/app.config.ts:65`) so Client calls hit the Core Gateway; host-shell provides NO app-default and the interceptor falls back to **session user-type detection** (`apps/host-shell/src/app/app.config.ts:121`) — Falcon→System, everyone else→Core.
- **The `ServiceOperationResult<T>` envelope is the backend's universal response contract** — `[CODE]` consumed in **405 occurrences across 67 files** (it actually lives in `shared-types`, but every service in THIS lib unwraps it: `{ isSuccessful, result, errorMessages, errors, errorCodes }`).
- **Do-payment flows** (reorder dialog, comm-channel + application payment) use `CommChannelPaymentService`/`ApplicationPaymentService`, then poll order completion via `OrderStatusService` + `SimplePollService`.
- **Validation affordances**: `AccountValidationService.checkAccountNameExists` / `isUserExist` back the async-unique validators in the Add Client / Add User wizards.
- **The error-dialog UX**: `ErrorDialogService` is the decoupled state holder a feature opens; `[CODE]` the app-shell-mounted `falcon-error-dialog-host` (`libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/`) renders the actual dialog. 401s are deliberately swallowed (the global ResponseInterceptor handles re-auth).

## When to use it / when NOT to use it

**Use it for:**
- Any feature that needs the SAME API surface in BOTH consoles (lookups, settings, account/username validation, do-payment, order status) → the shared domain services here.
- Targeting a specific backend gateway for one call → `...useGateway(Gateway.ChargingGateway)` (or no-arg `useGateway()` to take the app/session default).
- A generic interval poll that stops on a predicate → `SimplePollService.watch()`.
- Surfacing a must-acknowledge backend error → `ErrorDialogService.openError()`.
- Stripping null/empty query params automatically → `HttpService.get/delete` (it does this for you).
- Date-only parse/format that must NOT timezone-shift, base64 decode, enum→options, lookup→UI mapping → `Helper`.

**Do NOT use it for:**
- Feature-specific API services that only ONE app uses — keep those in the feature folder (e.g. `wallet-balance.service.ts` lives per-app, NOT here, by explicit design — `[CODE]` `lib/wallet/index.ts:5-7`).
- PES authorization calls — those bypass this layer and POST an absolute URL straight to the PES gateway (`@falcon/core` `access-control.client.ts`, see L02).
- The `RequestInterceptor` (JWT attach) / `ResponseInterceptor` (error toaster + envelope normalize) — those are **host-shell app-level**, NOT in this lib (`apps/host-shell/src/app/core/interceptors/`). Only the `RuntimeBaseUrlInterceptor` lives here.
- New imports of the validators sub-module's `effective-date.rules` if a registry validator already covers it — this is a pure date-rule module, not the validations registry (that's `shared-utils`, L03).

## Status

**ACTIVE / PREFERRED (transport + shared services + runtime gateway config).** The runtime-config + interceptor were hardened across Waves 8 & 10 (2026-05-17) to hard-fail on unresolved gateways. `AccountValidationService` was migrated Wave 10 from `HttpService` to raw `HttpClient` to match the canonical `UserApiService.getMe()` pattern. No deprecated symbols in the barrel; the wallet DTOs were promoted to a shared contract W1 (2026-06-02).

## Replaces

- `[CODE]` The API-calling `WalletBalanceService` that previously lived in this lib was REMOVED (no HTTP services belong in `libs/`); apps own their copy now (`lib/wallet/index.ts:4-6`).
- `[INFERRED]` Per-feature ad-hoc `HttpClient` base-URL prefixing — superseded by the centralized `RuntimeBaseUrlInterceptor` + `useGateway()` context idiom. (Flagged: not stated verbatim in code; inferred from the interceptor's Wave-10 hard-fail comments describing the prior "relative URL hits page origin" bug.)

## Source file paths

| File | Lines | Purpose |
|---|---|---|
| `libs/falcon/src/shared-data-access/index.ts` | 6 | Area barrel — services + runtime-config + interceptors + validators (NOT wallet). |
| `lib/services/index.ts` | 11 | Services sub-barrel — 9 named service/helper re-exports + 2 types. |
| `lib/services/http.service.ts` | 188 | `HttpService` — `HttpClient` wrapper; get/post/put/delete/patch; null-param strip; `buildUrl()` base-prefix + gateway/asset/absolute bypass. `HTTP_BASE_URL` token. |
| `lib/services/lookup.service.ts` | 65 | `LookupService` — `commerce/Lookup/{id}` → `Hook<LookupValueResponse>[]`; Commerce via `useGateway()`. |
| `lib/services/account-validation.service.ts` | 78 | `AccountValidationService` — `checkAccountNameExists` (`commerce/Node/ValidateAccountName`) + `isUserExist` (`identity/user/exist`); raw `HttpClient`. |
| `lib/services/commerce-settings.service.ts` | 51 | `CommerceSettingsService` — `commerce/Settings/Get` → `GetSettingsResponse` (pwd-level/limits/IPs); empty-default fallback. |
| `lib/services/order-status.service.ts` | 27 | `OrderStatusService` — `commerce/Node/order/{id}/status` → `GetOrderStatusResponse`. |
| `lib/services/comm-channel-payment.service.ts` | 74 | `CommChannelPaymentService` — `commerce/node/comm-channel/do-payment` + `commerce/Node/{id}/comm-channels/visible`. |
| `lib/services/application-payment.service.ts` | 49 | `ApplicationPaymentService` — `commerce/node/application/do-payment` (+`silent` toaster-suppress). |
| `lib/services/simple-poll.service.ts` | 51 | `SimplePollService.watch()` — generic `timer→exhaustMap→takeWhile` poller with stop()+max-duration. |
| `lib/services/error-dialog.service.ts` | 54 | `ErrorDialogService` — signal-based error-dialog state holder; `openError()` returns acknowledgement Promise; 401 suppressed. `ErrorDialogState` type. |
| `lib/services/helper.ts` | 179 | `Helper` — lookup→UI map, enum→options, base64 decode, deepClone, pricing-type i18n/label, date-only parse/format. |
| `lib/runtime-config/index.ts` | 1 | Runtime-config sub-barrel. |
| `lib/runtime-config/runtime-api-config.ts` | 139 | **Gateway addressing core** — `RuntimeEnvironmentConfig`, DI tokens (`SHELL_ENV_CONFIG`/`DEFAULT_BASE_URL`/`UPLOAD_CONFIG`/`APP_DEFAULT_GATEWAY`), `useGateway()`, `GATEWAY_PATH_MAP`, `provideShellEnvConfig`/`provideShellEnvFromWindow`/`provideAppDefaultGateway`/`exposeRuntimeConfigOnWindow`, window bridge. |
| `lib/interceptors/index.ts` | 1 | Interceptors sub-barrel. |
| `lib/interceptors/runtime-base-url.interceptor.ts` | 149 | **`RuntimeBaseUrlInterceptor`** — rewrites relative URLs onto the resolved gateway; 4-priority resolution; Wave-8/10 hard-fail + console.error guards. |
| `lib/validators/index.ts` | 1 | Validators sub-barrel. |
| `lib/validators/effective-date.rules.ts` | 88 | Pure date-rule fns — `validateEffectiveDate`, `isValidEffectiveDateForPeriodicChange`, `startOfToday`/`endOfDay`; `EffectiveDateRuleInput`/`ValidationErrors`. |
| `lib/wallet/index.ts` | 18 | **`@falcon/wallet` barrel** (NOT the area barrel) — re-exports the two wallet model files. |
| `lib/wallet/wallet-balance.models.ts` | 321 | Wallet wire DTOs/enums/helpers — `Currency`/`WalletBalanceType`/`WalletType`/`NodeType`, `IWalletDataResponse` + tree/summary/channel interfaces, draft-key + i18n-key helpers. |
| `lib/wallet/transfer.models.ts` | 265 | Transfer wire DTOs/enums/helpers — `ITransferRequest`/`ITransferEndpoint`/`ITransferContext`, `TransferMode`/`EntityType`/`TransferEntityType`/`TransferErrorCode`, `isDescriptionRequired`/`toBackendEntityType`/`isSameEndpoint`. |
| `@falcon` re-export | — | `libs/falcon/src/index.ts` (`export * from './shared-data-access'`). |
| Spec/tests | NONE in lib | No `*.spec.ts` under `shared-data-access/` (AUDIT F-class). Gateway behavior is tested at app level: `apps/host-shell/tests/order-status-gateway.spec.ts`. |

## Selectors / tokens (DI surface)

| Symbol | Purpose |
|---|---|
| `HTTP_BASE_URL` (string token) | Optional `@Inject` base URL for `HttpService` (when not gateway-routed). |
| `SHELL_ENV_CONFIG` | `InjectionToken<RuntimeEnvironmentConfig>` — the per-app gateway URL map. |
| `DEFAULT_BASE_URL` | `InjectionToken<string>` — the non-gateway default base. |
| `APP_DEFAULT_GATEWAY` | `InjectionToken<Gateway>` — micro-frontend's default gateway (admin→System, mgmt→Core). |
| `UPLOAD_CONFIG` | `InjectionToken<UploadConfig>` — allowed extensions + max size. |
| `USE_GATEWAY_CONTEXT` / `SPECIFIC_GATEWAY_CONTEXT` | `HttpContextToken`s the interceptor reads. |
| `useGateway(gateway?)` | Returns `{ context }` to spread into an `HttpClient` call. |
| `provideShellEnvConfig` / `provideShellEnvFromWindow` / `provideAppDefaultGateway` / `exposeRuntimeConfigOnWindow` | Provider factories wired in each app's `app.config.ts`. |

## Known consumers (grep verified 2026-06-03)

- `[CODE]` `useGateway`: **231 occ / 47 files** — every feature API service in both consoles + host-shell core services (auth, user, profile-otp, service-pricing, org-hierarchy-tree, contact-group, templates, contracts, marketplace, comms-hub, wallet).
- `[CODE]` `HttpService`: **99 occ / 39 files** — feature services across all three apps (org-hierarchy, settings, add-user/add-client wizards, contact-groups, contracts, wallet-balance-management, comms-hub, marketplace) + host-shell service-pricing/org-hierarchy-tree + `@falcon/core` `access-control.client.ts`.
- `[CODE]` `RuntimeBaseUrlInterceptor`: **14 files** — registered in all three `app.config.ts`; referenced by host-shell `user-api`/`profile-otp`/`order-status-realtime`/`order-status-gateway.util`/`service-pricing`/`org-hierarchy-tree`, admin `contact-group-api`, `@falcon/core` `access-control.client.ts` (which POSTs absolute to bypass it), and the gateway spec.
- `[CODE]` `ServiceOperationResult`: **405 occ / 67 files** — the universal envelope; every domain service here + dozens of feature services + 3 SDK type files.
- `[CODE]` `LookupService`/`AccountValidationService`/`CommerceSettingsService`/`OrderStatusService`/`CommChannelPaymentService`/`ApplicationPaymentService`/`SimplePollService`/`ErrorDialogService`: consumed by the org-hierarchy wizards, settings tab, do-payment priority popup (`apps/host-shell/src/app/shared-components/do-payment-priority-popup/`), and `falcon-error-dialog-host` (the shell host for `ErrorDialogService`). See USAGE Consumer Sweep.
- `[CODE]` `@falcon/wallet` DTOs: the per-app `wallet-balance.service.ts` + `new-wallet-balance` services in admin + mgmt (`useGateway` count rows above).

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related areas

- `@falcon` **shared-types** (L04 sibling) — the SoT for `ServiceOperationResult`, `Gateway`, all the DTOs these services consume (`GetOrderStatusResponse`, `DoPayment*`, `VisibleCommunicationChannelResponse`, `Hook`/`LookupValueResponse`, `FalconItemStatus`, `USER_TYPE_STRINGS`). Every service file imports from `../../../shared-types`.
- `@falcon` **core** (L02) — `RuntimeBaseUrlInterceptor` injects `SessionProvider` (`../../../core`) for the user-type fallback; `USER_TYPE_STRINGS` discriminates Falcon vs Client. `access-control.client.ts` deliberately bypasses this interceptor.
- `@falcon` **language** (L03) — `Helper` injects `TranslateService` for pricing-type labels.
- **host-shell app interceptors** (`apps/host-shell/src/app/core/interceptors/`) — the `RequestInterceptor` (JWT) and `ResponseInterceptor` (error toaster + `errorMessages`/`ErrorMessages` envelope normalize + `notShowToaster` suppress) compose with the `RuntimeBaseUrlInterceptor` to form the full HTTP pipeline. They are app-level, not in this lib.
- `@falcon/sdk` — wallet/transfer DTOs and the gateway config indirectly back the facades (context/notify), though the SDK does not import this lib directly.

## Ownership / responsibility

`libs/falcon` (`@falcon`). The gateway addressing contract is owned jointly with each app's `environment.ts` (`baseURL*Gateway` values) + the `window.FalconRuntimeConfig` runtime override. The wire DTOs in `lib/wallet/` are owned jointly with the backend (`AccountHierarchyResponse` / `TransferBalanceRequest` field-for-field — `[MEMORY] reference_wallet_backend_integration_contract_2026_06_02`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04 sweep). All 21 source files read in full; barrel coverage (wallet NOT barreled) confirmed; gateway resolution priority + per-app `provideAppDefaultGateway` wiring verified against the three `app.config.ts`; consumer counts grep'd; `notShowToaster`/error-envelope behavior cross-checked in the host-shell `ResponseInterceptor`. One `[INFERRED]` flag (Replaces §2). No source edited.
