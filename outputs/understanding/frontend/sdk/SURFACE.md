# @falcon/sdk — SURFACE (public API / exports)

Everything re-exported from `libs/sdk/src/index.ts` via `@falcon/sdk`. The barrel is a flat `export *` of 9 modules in 3 groups. `[CODE]` `libs/sdk/src/index.ts:8-26`.

## 0. Barrel map

| Group | Re-exported module | Symbols |
|---|---|---|
| Falcon facades | `types/falcon-facades.interfaces` | `FalconTheme`, `FalconAuthFacade`, `FalconThemeFacade`, `FalconLanguageFacade`, `FalconNotifierFacade`, `FalconContext`, `FalconContextFacade` |
| Falcon facades | `tokens/falcon-facades.tokens` | `FALCON_FACADE_TOKENS`, `FALCON_AUTH`, `FALCON_THEME`, `FALCON_LANGUAGE`, `FALCON_NOTIFIER`, `FALCON_CONTEXT` |
| Falcon facades | `facades/provide-falcon-facades` | `ProvideFalconFacadesOptions`, `provideFalconFacades()` |
| Falcon facades | `facades/HierarchyFacade` | `HierarchyNodeType`, `HierarchyUserStatus`, `ClientNode`, `User`, `NodeDossier`, `NewClientPayload`, `NewSubNodePayload`, `NewUserPayload`, `ChangeNodeNamePayload`, `HierarchyPermissions`, `HierarchyInvalidateScope`, `HierarchyFacade`, `HIERARCHY_FACADE` |
| Falcon facades | `window-sdk/falcon-window-sdk.types` | `Unsubscribe`, `FalconWindowSdk` (+ ambient `Window.FalconSDK?`) |
| User-details port | `types/user-details.dtos` | `ServiceOperationResult<T>`, `UserResponse`, `ProfilePictureInfo`, `UpdateUserProfileRequest`, `UpdateUserRoleRequest`, `RoleCatalogItem`, `RoleOption` |
| User-details port | `types/user-details-gateway.interface` | `UserDetailsGateway` |
| User-details port | `tokens/user-details-gateway.token` | `USER_DETAILS_GATEWAY` |
| OTP port | `types/otp.dtos` | `VerificationCodeResponse`, `VerifyEmailRequest`, `VerifyPhoneRequest`, `ConfirmOtpRequest` |
| OTP port | `types/otp-gateway.interface` | `OtpField`, `OtpGateway` |
| OTP port | `tokens/otp-gateway.token` | `OTP_GATEWAY` |

**Counts:** 5 facade interfaces (+1 `HierarchyFacade` = 6 contracts) · 5 facade `InjectionToken`s + 1 frozen token-string map (`FALCON_FACADE_TOKENS`) + `HIERARCHY_FACADE` + 2 port tokens = **8 `InjectionToken`s** · 1 provider helper (`provideFalconFacades`) · 1 `window.FalconSDK` global typing surface · 2 gateway ports (`UserDetailsGateway`, `OtpGateway`) · ~20 data-shape interfaces/type-aliases.

---

## 1. Facade interfaces — `types/falcon-facades.interfaces.ts`

The 5 cross-cutting host capabilities a remote/lib may consume. All **getter-only** contracts — observables/setters are host-impl extras, NOT in the interface (see AUDIT G1).

| Interface | Members `[CODE] :line` | Notes |
|---|---|---|
| `FalconAuthFacade` | `getAuthenticationObject(): {accessToken,idToken}` · `getAccessToken(): string\|null` · `getIdToken(): string\|null` · `emmitSubjects(): void` | `:3-12`. **Typo** in `emmitSubjects` (should be `emit`) — frozen into the contract (AUDIT G2). Comment line :11 admits "optional callback/observable updates may exist in host impl" — i.e. `accessToken$`/`idToken$` are host extras NOT in the type. |
| `FalconThemeFacade` | `getTheme(): FalconTheme` | `:14-16`. `FalconTheme = 'light' \| 'dark'` (`:1`). No `setTheme` in the contract (host adds it). |
| `FalconLanguageFacade` | `getLanguage(): string` | `:18-20`. String, not a `'en'\|'ar'` union (AUDIT G4). |
| `FalconNotifierFacade` | `success(msg,title?)` · `error(msg,title?)` · `info?(msg,title?)` · `warn?(msg,title?)` | `:22-27`. `info`/`warn` are **optional** (`?`) — callers must `?.()` (host bridge does: `notify.info: this.notifier.info?.(m,t) ?? this.notifier.success(...)`). |
| `FalconContext` | `tenantId?` · `user?{id?,name?,email?}` · `env?` · `[k:string]: any` | `:29-35`. Open-ended bag; the `any` index signature carries an inline `eslint-disable` with a justification comment (`:33`) — house-rule-compliant per [MEMORY] gate01 "any→type-or-justified-disable" pattern. |
| `FalconContextFacade` | `getContext(): FalconContext` | `:37-39`. |

## 2. Facade tokens — `tokens/falcon-facades.tokens.ts`

`[CODE]` `:11-38`. Five `new InjectionToken<TFacade>(debugName)` constants, each debug-named from a frozen string map:

```ts
FALCON_FACADE_TOKENS = Object.freeze({ AUTH:'FALCON_AUTH', THEME:'FALCON_THEME',
  LANGUAGE:'FALCON_LANGUAGE', NOTIFIER:'FALCON_NOTIFIER', CONTEXT:'FALCON_CONTEXT' } as const)
```

| Token `[CODE] :line` | Generic | Debug name |
|---|---|---|
| `FALCON_AUTH` `:20` | `FalconAuthFacade` | `'FALCON_AUTH'` |
| `FALCON_THEME` `:24` | `FalconThemeFacade` | `'FALCON_THEME'` |
| `FALCON_LANGUAGE` `:28` | `FalconLanguageFacade` | `'FALCON_LANGUAGE'` |
| `FALCON_NOTIFIER` `:32` | `FalconNotifierFacade` | `'FALCON_NOTIFIER'` |
| `FALCON_CONTEXT` `:36` | `FalconContextFacade` | `'FALCON_CONTEXT'` |

These are **string-keyed** `InjectionToken`s (no `providedIn`/`factory`), so a missing provider throws `NullInjectorError` unless `{optional:true}` is passed — exactly what the mgmt smoke test does (`injector.get(FALCON_AUTH, null, {optional:true})`, `[CODE]` `facade-smoke.initializer.ts:9-12`).

## 3. Provider helper — `facades/provide-falcon-facades.ts`

`[CODE]` `:26-34`. `provideFalconFacades(opts): EnvironmentProviders` — the **host** wiring helper.

- **`ProvideFalconFacadesOptions`** (`:13-19`): one property per token (`auth/theme/language/notifier/context`), each typed `FacadeClass<T> | T` — accepts **either a class (→ `useClass`) or an instance/value (→ `useValue`)**.
- **`bindToken<T>(token, impl)`** (`:21-24`): `typeof impl === 'function' ? {provide,useClass} : {provide,useValue}`. Internal, not exported.
- Wraps the 5 bindings in `makeEnvironmentProviders([...])`.
- Host usage binds the 5 `Host*Facade` **classes** (`useClass`): `[CODE]` `apps/host-shell/src/app/app.config.ts:101-107`.
- **Does NOT bind the two ports** — `USER_DETAILS_GATEWAY` / `OTP_GATEWAY` are wired separately by the host as `{provide, useExisting: <HttpService>}` (`app.config.ts:110,113`). `provideFalconFacades` only knows the 5 cross-cutting facades.

## 4. `window.FalconSDK` global — `window-sdk/falcon-window-sdk.types.ts`

`[CODE]` `:5-38`. **Typings only** — declares the shape of the runtime global the host installs (the installer `HostWindowSdkBridge` lives in `apps/host-shell/falcon-sdk/`, NOT here). Provides a **callback/observable-free, plain-JS** facade for non-Angular or imperative consumers.

| Sub-namespace | Members `[CODE]` | Maps to host facade |
|---|---|---|
| `auth` | `getToken(): string\|null` · `onTokenChange(cb): Unsubscribe` `:6-9` | `HostAuthFacade.getAccessToken` / `accessToken$` |
| `language` | `getLanguage()` · `onLanguageChange(cb): Unsubscribe` `:11-14` | `HostLanguageFacade` / `language$` |
| `theme` | `getTheme(): FalconTheme` · `onThemeChange(cb): Unsubscribe` `:16-19` | `HostThemeFacade` / `theme$` |
| `context` | `getContext(): FalconContext` · `onContextChange(cb): Unsubscribe` `:21-24` | `HostContextFacade` / `context$` |
| `notify` | `success/error/info/warn(message,title?)` `:26-31` | `HostNotifierFacade` (note: here `info`/`warn` are **required**, unlike the optional `FalconNotifierFacade`) |

- `Unsubscribe = () => void` (`:3`).
- Ambient `declare global { interface Window { FalconSDK?: FalconWindowSdk } }` (`:34-38`) — the `?` means consumers must null-check `window.FalconSDK`.
- **Two parallel surfaces:** the DI tokens (Angular consumers) and `window.FalconSDK` (imperative consumers) expose the *same five capabilities* but with different ergonomics — DI is getter-only, `window` adds `onXChange` subscriptions. This duplication is intentional but a divergence risk (AUDIT G5).

## 5. User-details port — `types/user-details-gateway.interface.ts` + DTOs + token

The exact backend operations the shared `<app-user-details-page>` needs — "no more" (`[CODE]` interface header `:15`). Host implements (`UserApiService`), binds via `USER_DETAILS_GATEWAY`.

### `UserDetailsGateway` (`:16-84`)
| Method | Backend call (from doc-comment) | Returns |
|---|---|---|
| `getMe()` | GET `api/user/me` (self, token-resolved; avoids nullable `identityUserId` claim → fixes the "no tabs" blank-profile bug) | `Observable<ServiceOperationResult<UserResponse>>` |
| `getById(id, includeDeleted?)` | GET `api/user/{id}` | `…<UserResponse>` |
| `updateUserProfile(id, payload)` | PUT `api/user/{id}/profile` | `…<boolean>` |
| `updateUserRole(id, payload)` | PUT `api/user/{id}/role` | `…<boolean>` |
| `changeStatus(userId, newStatus)` | PUT `api/user/status` (middle step of profile→status→role save chain) | `…<object>` |
| `canSkipPendingVerification()` | actor fact (Falcon/AccountOwner/NodeAdmin → save Pending w/o OTP) | `boolean` (sync) |
| `isFalconUser()` | actor fact (Falcon usertype) | `boolean` (sync) |
| `isSystemAdmin()` | actor fact (roleKey==='sys-admin'; only actor allowed Deleted→Active restore, PES R17) | `boolean` (sync) |
| `getRoleCatalog(targetUserType, tenantId?)` | GET `{baseURLPes}/pes/roles` (language-aware RoleOption[], sorted) | `Observable<RoleOption[]>` |

`[CODE]` doc-comments encode the PES/business semantics in prose: eUserStatus enum (1 Pending/2 Active/3 Suspended/4 Locked/5 Deleted), BR-UM-08 transition, Deleted→Active Falcon-only / sys-admin-only rule, targetUserType 'system'|'account' normalization. This is the **port that carries actor-gating into the HTTP-free lib** (3 sync `boolean` methods are not HTTP — they delegate to host `CurrentUserService`).

### DTOs — `types/user-details.dtos.ts`
- `ServiceOperationResult<T=unknown>` (`:8-13`) — `{isSuccessful, result:T, errorCodes:unknown[], errors:string[]}`. **Structural duplicate** of `@falcon`'s class, kept call-free here to avoid a `libs/sdk → libs/falcon` edge (`:6-7` comment). (AUDIT G6 — duplication.)
- `UserResponse` (`:16-35`), `ProfilePictureInfo` (`:38-41`), `UpdateUserProfileRequest` (`:47-55`), `UpdateUserRoleRequest` (`:58-60`), `RoleCatalogItem` (`:65-72`), `RoleOption` (`:77-82`). All camelCase, mirror C# DTOs; relocated from `libs/falcon` 2026-05-18 so the SDK owns the contract.
- `USER_DETAILS_GATEWAY` token: `[CODE]` `tokens/user-details-gateway.token.ts:8-10`.

## 6. OTP port — `types/otp-gateway.interface.ts` + DTOs + token

The 3 backend operations the shared `<app-otp-dialog>` needs. Host implements (`ProfileOtpService`), binds via `OTP_GATEWAY`.

### `OtpGateway` (`:15-32`)
| Method | Backend call | Returns |
|---|---|---|
| `sendOtp(field, value)` | POST `/user/me/verify-{email\|phone}` | `…<VerificationCodeResponse>` |
| `verifyOtp(field, code)` | POST `/user/me/verify-{…}/confirm` | `…<boolean>` |
| `resendOtp(field)` | POST `/user/me/verify-{…}/resend` (empty body) | `…<VerificationCodeResponse>` |

- `OtpField = 'email' | 'phone'` (`:12`) — string union mirroring the `@falcon` `VerifiableField` enum, kept a literal union so `libs/sdk` needs no `libs/falcon` import.

### DTOs — `types/otp.dtos.ts`
- `VerificationCodeResponse` (`:7-11`) — `{otpCodeLength, otpExpiresInSeconds, devOtpCode:string|null}` (drives the dialog's box count + countdown).
- `VerifyEmailRequest{email}` (`:14-16`), `VerifyPhoneRequest{phoneNumber}` (`:19-21`), `ConfirmOtpRequest{code}` (`:24-26`).
- Reuses `ServiceOperationResult` from `user-details.dtos` (`otp-gateway.interface.ts:7`) — cross-port DTO dependency.
- `OTP_GATEWAY` token: `[CODE]` `tokens/otp-gateway.token.ts:8`.

## 7. Hierarchy facade — `facades/HierarchyFacade.ts`

`[CODE]` `:86-102`. A **Promise-based** org-hierarchy contract (note: the only contract here using `Promise`, not `Observable` — divergence from the two RxJS ports, AUDIT G7).

- Types: `HierarchyNodeType = 'root'|'client'|'sub-node'` (`:7`), `HierarchyUserStatus = 'active'|'pending'|'suspended'|'locked'|'deleted'` (`:8`), `ClientNode` (`:10-18`), `User` (`:20-29`), `NodeDossier` (17 string fields, sourced from React `hierarchy.jsx:954-998`, `:31-50`), payloads `NewClientPayload`/`NewSubNodePayload`/`NewUserPayload`/`ChangeNodeNamePayload` (`:52-75`), `HierarchyPermissions{canCreateUser,canCreateNode,canEditNode}` (`:77-81`), `HierarchyInvalidateScope = 'tree'|'users'|'info'|'all'` (`:83`).
- `HierarchyFacade` (11 methods: `getTree/getUsers/getInfoPanel/permissions/createClient/createSubNode/changeNodeName/createUser/invalidate` + W8 additive `addNode/editNode`).
- `HIERARCHY_FACADE` token (`:102`).
- **⚠ ORPHAN:** `[CODE]` grep `HierarchyFacade|HIERARCHY_FACADE` across the whole repo returns the SDK file itself + **planning docs only** (`docs/_plans/*`) — **zero `inject(HIERARCHY_FACADE)` or `implements HierarchyFacade` in `apps/` or `libs/falcon/`**. The org-hierarchy feature shipped with **local per-app state signals** (`apps/*/.../org-hierarchy-page/services/state/*.signals.ts`) instead of binding this token. So the contract is **exported-but-unconsumed dead surface** (AUDIT G8, `safe-local`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L01). Every exported symbol traced to its source line; barrel cross-checked at `index.ts:8-26`. `HierarchyFacade` orphan status grep-verified (consumers = planning docs only). Token count = 8 InjectionToken (5 facade + HIERARCHY_FACADE + 2 ports).
