# falcon-shared-data-access — SURFACE (full public API / export inventory)

> Every exported symbol of `@falcon` `shared-data-access`, source-prefixed with signature + one-line purpose. Area barrel: `libs/falcon/src/shared-data-access/index.ts` (services + runtime-config + interceptors + validators). The **`lib/wallet/` sub-module is NOT in this barrel** — it ships via the dedicated `@falcon/wallet` path alias — but it is documented here (§5) because it physically lives in this lib.

## Barrel order

`[CODE]` `index.ts:2-5`: `./lib/services` → `./lib/runtime-config` → `./lib/interceptors` → `./lib/validators`. (No `./lib/wallet`.) The whole area is re-exported by `@falcon` (`libs/falcon/src/index.ts`).

---

## 1. Services — `lib/services/`

`[CODE]` Sub-barrel `index.ts:1-10` re-exports: `HttpService`+`HTTP_BASE_URL`, `AccountValidationService`, `LookupService`, `Helper`, `SimplePollService`, `OrderStatusService`, `CommChannelPaymentService`, `ApplicationPaymentService`, `CommerceSettingsService`+`GetSettingsResponse` (type), `ErrorDialogService`+`ErrorDialogState` (type).

### `http.service.ts` (188 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `HTTP_BASE_URL` | `const = 'HTTP_BASE_URL'` (string token) | Optional injection token for the base URL. | `:6` |
| `HttpService` | `@Injectable({providedIn:'root'})` class | `HttpClient` wrapper. Constructor `(http: HttpClient, @Optional() @Inject(HTTP_BASE_URL) baseURL?)`. | `:8-19` |
| `.get<T=any>(url, options?)` | `Observable<T>` | GET; strips null/`'undefined'`/`'null'`/`''` query params if `HttpParams`; routes through `buildUrl`. | `:22-46` |
| `.post<T=any>(url, body, options?)` | `Observable<T>` | POST via `buildUrl`. | `:49-71` |
| `.put<T=any>(url, body, options?)` | `Observable<T>` | PUT via `buildUrl`. | `:74-96` |
| `.delete<T=any>(url, options?)` | `Observable<T>` | DELETE; optional `body` in options; strips null params. | `:99-128` |
| `.patch<T=any>(url, body, options?)` | `Observable<T>` | PATCH via `buildUrl`. | `:143-165` |

*Private:* `removeNullValuesFromQueryParams` (mutates `params['map']`) `:130-140`; `buildUrl(url, context?)` — returns `url` as-is if absolute (`https?://`) or asset (`/assets/`), or if `USE_GATEWAY_CONTEXT` set (interceptor handles it), else `baseURL + url` `:167-178`; `isAbsoluteUrl`/`isAssetUrl` `:180-186`.

> `[CODE]` `<T = any>` default on all 5 verbs is a deliberate, eslint-justified choice (`:21` etc.) — "response type supplied by callers via `<T>`; `any` default mirrors `HttpClient`".

### `lookup.service.ts` (65 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `LookupService.getLookup` | `(lookupId: string, args?: {name?; code?}): Observable<Hook<LookupValueResponse>[]>` | GET `commerce/Lookup/{lookupId}` (Commerce via `useGateway()`); unwraps envelope; `catchError → []`. | `:49-64` |
| `LookupService.getLookupValues` | `(id, name?, code?): Observable<Hook<LookupValueResponse>[]>` | `@deprecated` legacy alias → `getLookup`. | `:34-40` |

Backend: **Commerce** (`commerce/Lookup/{id}`). `[CODE]` `apiEndpoint='Lookup'` `:28`.

### `account-validation.service.ts` (78 ln) — `@Injectable({providedIn:'root'})`, raw `HttpClient`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `AccountValidationService.checkAccountNameExists` | `(accountName: string): Observable<boolean>` | GET `commerce/Node/ValidateAccountName?accountName=` (`notShowToaster`); empty→`of(false)`; unwraps `result`. | `:16-41` |
| `AccountValidationService.isUserExist` | `(username, email?, phoneNumber?): Observable<boolean>` | POST `identity/user/exist` (`notShowToaster`); unwraps `result.exists`. | `:43-75` |

Backends: **Commerce** (`commerce/Node/…`) + **Identity** (`identity/user/exist` — System/Core YARP strips the `/identity/` prefix). `[CODE]` Wave-10 note `:11-13,57-60`: switched to raw `HttpClient` + dynamic `useGateway()` to match `UserApiService` (prior `Gateway.IdentityGateway` silently fell back to localhost).

### `commerce-settings.service.ts` (51 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `GetSettingsResponse` | `interface { passwordSecurityLevel; maxNormalUserLimit; maxSystemUserLimit; maxNodeLevel; balanceTransferLimit; allowedIPs: readonly string[] }` (all readonly) | Mirrors Commerce `SettingsInfo`/`NodeSettingsDto`; `0` in any `*Limit` = unbounded. | `:15-22` |
| `CommerceSettingsService.getSettings` | `(): Observable<GetSettingsResponse>` | GET `commerce/Settings/Get` (`notShowToaster`); on any failure → `EMPTY_SETTINGS` (`:24-31`) so consumers never block. | `:39-50` |

Backend: **Commerce** via `useGateway()`.

### `order-status.service.ts` (27 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `OrderStatusService.getOrderStatus` | `(orderId: string): Observable<GetOrderStatusResponse>` | GET `commerce/Node/order/{orderId}/status`; unwraps; throws `errors[0]` on failure. | `:12-26` |

Backend: **Commerce** via `useGateway()`. (Paired with `SimplePollService` to poll order completion.)

### `comm-channel-payment.service.ts` (74 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `CommChannelPaymentService.doPayment` | `(request: DoPaymentCommunicationChannelRequest, options?: {silent?}): Observable<DoPaymentCommunicationChannelResponse>` | POST `commerce/node/comm-channel/do-payment`; `silent`→`notShowToaster`; unwraps or throws `errorMessages[0]`/`errors[0]`. | `:26-51` |
| `CommChannelPaymentService.getVisibleCommChannels` | `(nodeId: string): Observable<VisibleCommunicationChannelResponse[]>` | GET `commerce/Node/{nodeId}/comm-channels/visible`; unwraps or throws. | `:53-73` |

Backend: **Commerce** `NodeController` via `useGateway()`. `[CODE]` header `:1-4`.

### `application-payment.service.ts` (49 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `ApplicationPaymentService.doPayment` | `(request: DoPaymentApplicationRequest, options?: {silent?}): Observable<DoPaymentApplicationResponse>` | POST `commerce/node/application/do-payment`; `silent`→`notShowToaster`; unwraps or throws `errorMessages[0]`/`errors[0]`/'Failed to initiate payment'. | `:23-48` |

Backend: **Commerce** `NodeController` via `useGateway()`. Mirror of `CommChannelPaymentService.doPayment` (minus `commChannelId`).

### `simple-poll.service.ts` (51 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `PollConfig<T>` | `interface { serviceMethod: () => Observable<T>; intervalSeconds?; maxDurationMinutes?; shouldStop: (data:T)=>boolean }` | Poll spec. | `:5-14` |
| `SimplePollService.watch<T>` | `(config: PollConfig<T>): { data$: Observable<T>; stop: () => void }` | `timer(0,intervalMs)→startWith(0)→takeUntil(stop$)→exhaustMap(serviceMethod)→takeWhile(!shouldStop, inclusive)→shareReplay(1)`; optional max-duration `timer` auto-stops. | `:18-50` |

Default interval = 2s; no max-duration unless `maxDurationMinutes` given. Pure RxJS, no HTTP.

### `error-dialog.service.ts` (54 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `ErrorDialogState` | `interface { readonly httpStatus: number; readonly errorMessages: readonly string[]; readonly titleKey? }` | Dialog state shape. | `:12-19` |
| `ErrorDialogService.state` | `signal<ErrorDialogState \| null>(null)` | Active dialog state (read by the host component). | `:24` |
| `ErrorDialogService.openError` | `(opts: ErrorDialogState): Promise<void>` | Set state; resolve on `dismiss()` so caller can await acknowledgement. **401 short-circuits to `Promise.resolve()`** (D7 — global interceptor handles re-auth). Resolves any in-flight promise first. | `:32-44` |
| `ErrorDialogService.dismiss` | `(): void` | Clear state + resolve pending promise. | `:47-53` |

> Presentation-agnostic by design (`:1-8`) — the host component lives in `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/` (moved there per the L02/cycle-resolution "Fix B"; `[MEMORY] project_fe_cycle01_resolved_leaf_extraction_2026_06_03`).

### `helper.ts` (179 ln) — `@Injectable({providedIn:'root'})`

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `Helper.mapLookupToUi` | `(list: Hook<LookupValueResponse>[]): Hook<string>[]` | Map lookup wrappers → `{value:id, name}`. | `:14-19` |
| `Helper.enumToOptions` | `(enumObj, i18nKeyMap: Record<number,string>, translate: TranslateService): Hook<number>[]` | Numeric enum → translated, value-sorted options. | `:22-37` |
| `Helper.decodeBase64` | `(value: string): string` | Decode if base64-shaped, else return as-is; `console.warn` + original on failure. | `:44-65` |
| `Helper.deepClone<T>` | `(obj: T): T` | `JSON.parse(JSON.stringify(obj))`. | `:67-69` |
| `Helper.getPricingTypeI18nKey` | `(value: unknown): string \| null` | `PricingType` (num or label string) → `enum.pricingType.*` key. | `:71-87` |
| `Helper.toPricingType` | `(value: unknown): PricingType \| null` | Coerce num/label-string → `PricingType`. | `:89-105` |
| `Helper.getPricingTypeLabel` | `(value: unknown, translate): string` | Translated pricing-type label (falls back to `String(value)`). | `:107-113` |
| `Helper.parseDateOnly` | `(input: string \| null \| undefined): Date \| null` | Extract `YYYY-MM-DD` → **local** Date (no TZ shift). | `:123-140` |
| `Helper.formatDateOnly` | `(date: Date \| null \| undefined): string` | Date → `YYYY-MM-DD` (no `toISOString`). | `:148-158` |
| `Helper.getDateFromStringOrDash` | `(value: string \| null): string` | ISO/`YYYY-MM-DD` → `dd/mm/yyyy`, or `'----'`. | `:160-176` |

---

## 2. Runtime config — `lib/runtime-config/runtime-api-config.ts` (139 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `UploadConfig` | `interface { allowedExtensions: string[]; maxSizeKB: number }` | File-upload constraint. | `:5-8` |
| `DEFAULT_UPLOAD_CONFIG` | `UploadConfig` = `{jpg,png,webp,jpeg,gif,bmp,x-icon}, 1024KB` | Default upload constraint. | `:10-13` |
| `RuntimeEnvironmentConfig` | `interface { baseURL; baseURLPes; baseURLCoreGateway; baseURLSystemGateway; baseURLChargingGateway; baseURLIdentityGateway; upload? }` | The per-app gateway URL map. | `:15-23` |
| `SHELL_ENV_CONFIG` | `InjectionToken<RuntimeEnvironmentConfig>` | The env config token. | `:25` |
| `DEFAULT_BASE_URL` | `InjectionToken<string>` | Non-gateway default base. | `:26` |
| `UPLOAD_CONFIG` | `InjectionToken<UploadConfig>` | Upload constraint token. | `:27` |
| `APP_DEFAULT_GATEWAY` | `InjectionToken<Gateway>` | Per-MFE default gateway (admin→System, mgmt→Core). | `:37` |
| `USE_GATEWAY_CONTEXT` | `HttpContextToken<boolean>` (default `false`) | "Use a gateway for this request." | `:39` |
| `SPECIFIC_GATEWAY_CONTEXT` | `HttpContextToken<Gateway \| null>` (default `null`) | Specific gateway override. | `:40` |
| `RUNTIME_CONFIG_WINDOW_KEY` | `const = 'FalconRuntimeConfig'` | `window` bridge key. | `:42` |
| `provideShellEnvConfig` | `(config): Provider[]` | Provide `SHELL_ENV_CONFIG` + `DEFAULT_BASE_URL`(=`env.baseURL`) + `UPLOAD_CONFIG`. | `:44-58` |
| `provideAppDefaultGateway` | `(gateway: Gateway): Provider` | Provide `APP_DEFAULT_GATEWAY`. | `:65-67` |
| `exposeRuntimeConfigOnWindow` | `(config): Provider` | `APP_INITIALIZER` → write config to `window`. | `:69-75` |
| `provideShellEnvFromWindow` | `(fallback): Provider[]` | `SHELL_ENV_CONFIG` from `window` (fallback to arg) + `DEFAULT_BASE_URL` + `UPLOAD_CONFIG`. | `:77-94` |
| `getRuntimeConfigFromWindow` | `(): RuntimeEnvironmentConfig \| null` | SSR-safe `window[key]` read. | `:96-103` |
| `setRuntimeConfigOnWindow` | `(config): void` | SSR-safe `window[key]` write. | `:105-110` |
| `GATEWAY_PATH_MAP` | `Record<Gateway, GatewayConfigKey>` | `{CoreGateway→baseURLCoreGateway, SystemGateway→baseURLSystemGateway, ChargingGateway→baseURLChargingGateway, IdentityGateway→baseURLIdentityGateway}`. | `:118-123` |
| `useGateway` | `(gateway?: Gateway): { context: HttpContext }` | Set `USE_GATEWAY_CONTEXT=true` (+`SPECIFIC_GATEWAY_CONTEXT` if given). The platform's gateway-selection idiom. | `:130-139` |

*Private type:* `GatewayConfigKey` (`:113`).

---

## 3. Interceptors — `lib/interceptors/runtime-base-url.interceptor.ts` (149 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `RuntimeBaseUrlInterceptor` | `@Injectable()` `implements HttpInterceptor` | Rewrites relative request URLs onto the resolved gateway base. | `:15-16` |
| `.intercept` | `(request, next): Observable<HttpEvent<unknown>>` | Skip absolute/asset URLs; resolve base; HARD-FAIL throw if `useGateway` set but no base resolves (Wave-10 guard `:41-60`); else clone with `{normalizedBase}{normalizedPath}` (idempotent if already prefixed). | `:22-74` |

**Resolution priority** (`[CODE]` `:32-39,84-101`): (1) `SPECIFIC_GATEWAY_CONTEXT` override → `resolveGatewayConfigUrl`; (2) `APP_DEFAULT_GATEWAY` token; (3) session user-type fallback (`resolveGatewayFromSession` `:128-136`: Falcon→`baseURLSystemGateway`, else→`baseURLCoreGateway`); (4) no `useGateway` → `defaultBaseUrl`.

*Private:* `resolveGatewayUrl`, `resolveGatewayConfigUrl` (with Wave-8 `console.error` empty-URL guard `:107-121`), `resolveGatewayFromSession`, `isAbsoluteUrl`, `isAssetUrl`, `trimTrailingSlash`. Injects `DEFAULT_BASE_URL`, `SHELL_ENV_CONFIG`, `APP_DEFAULT_GATEWAY`, `SessionProvider` — all `{optional:true}` via `inject()`.

---

## 4. Validators — `lib/validators/effective-date.rules.ts` (88 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `ValidationErrors` | `type = Record<string, boolean>` | Reactive-forms error map. | `:3` |
| `EffectiveDateRuleInput` | `interface { visibility: boolean; status?: FalconItemStatus \| null; currentPricingType: PricingType; renewDate?: Date \| null; effectiveDate?: Date \| null }` | Rule input. | `:5-11` |
| `startOfToday` | `(): Date` | Local midnight today. | `:13-16` |
| `endOfDay` | `(date: Date): Date` | Local 23:59:59.999 of a date. | `:18-28` |
| `isValidEffectiveDateForPeriodicChange` | `(effectiveDate: Date, targetDayOfMonth: number): boolean` | True iff `effectiveDate.day === expectedDay` (day-before the renew day, month-clamped). | `:30-48` |
| `validateEffectiveDate` | `(input: EffectiveDateRuleInput): ValidationErrors \| null` | Only validates when `visibility && status∈{Active,Expired}`; requires future date; for Monthly/Yearly requires renew-day alignment. Returns `effectiveDateRequired`/`effectiveDateMustBeInFuture`/`invalidEffectiveDateForPeriodicPricingChange` or `null`. | `:50-88` |

Pure functions — no Angular/DI/HTTP. Consumed by `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts`.

---

## 5. Wallet wire contract — `lib/wallet/` (`@falcon/wallet` alias, NOT the area barrel)

`[CODE]` `lib/wallet/index.ts:16-17` re-exports both files. SHARED CONTRACT (promoted W1 2026-06-02) — field names are the wire contract, MUST NOT be renamed; reused verbatim from the admin-console donor (the superset). Exposed via `@falcon/wallet` because `NodeType`/`WalletType` collide with `shared-types`.

### `wallet-balance.models.ts` (321 ln)

**Enums:** `Currency` (SAR=1, Points=2) `:28-31`; `WalletBalanceType` (NodeBased=1, UserBased=2) `:39-42`; `WalletType` (SingleWallet=1, MultipleWallets=2) `:50-53`; `WalletStructure` (const+type alias of `WalletType`, mgmt back-compat) `:60-61`; `NodeType` (Organization=1, Service=2, User=3) `:66-70`.

**Const:** `WALLET_BALANCE_TRANSLATION_KEYS` (currency/balanceDistribution/walletStructure/nodeType → i18n keys) `:79-97`.

**Interfaces:** `IChannel` `:107-111`; `IChannelBalance` `:117-126`; `IWalletAccountInfo` `:132-136`; `IWalletSummary` (`masterWalletId`/`totalBalance`/`currency`/`channelWallet?`/`walletBalanceType`/`walletType`) `:142-153`; `IBalanceNode` (tree node: `id`/`parentId?`/`nodeType`/`name`/`expandable`/`icon?`/`balance?`/`channelBalances?`/`disabled?`/`path?`/`children?`) `:159-189`; `IWalletChannelBalance` `:191-195`; `IBalanceChange` `:202-208`; `IWalletQuery` `:217-223`; `IWalletDataResponse` (`accountInfo`/`channels`/`summary`/`node`/`canSave`) `:229-236`; `ISaveBalancesRequest` (`ownerId`/`currency`/`walletBalanceType`/`walletType`/`changes?`) `:241-251`.

**Type aliases:** `DraftKey = string` `:262`; `DraftMap = Map<DraftKey, number\|null>` `:267`.

**Functions:** `createDraftKey(nodeId, channelId?)` `:278-280`; `parseDraftKey(key)` `:286-292`; `getCurrencyTranslationKey` `:297-299`; `getBalanceDistributionTranslationKey` `:304-306`; `getWalletStructureTranslationKey` `:311-313`; `getNodeTypeTranslationKey` `:318-320`.

### `transfer.models.ts` (265 ln)

**Enums:** `TransferMode` (SingleWallet=1, MultipleWallets=2) `:36-39`; `EntityType` (string: MASTER='1', NODE='2', USER='3', COMM_CHANNEL='4' — **backend wire**) `:44-49`; `TransferEntityType` (UI: MasterWallet/Node/User/CommChannelWallet) `:54-59`; `TransferErrorCode` (9 string codes) `:149-159`.

**Interfaces:** `ITransferEntity` (`id`/`name`/`type`/`icon?`/`channelId?`/`balance?`/`nodeType?`/`path?`/`channelBalances?`) `:68-92`; `ITransferWallet` `:97-102`; `ITransferEndpoint` (`walletId?`/`channelId?` — **the wire endpoint**) `:107-113`; `ITransferRequest` (`amount`/`currency`/`description?`/`source`/`destination`) `:118-133`; `ITransferResponse` (`success`/`message?`/`transactionId?`/`errorCode?`) `:138-144`; `ITransferContext` (UI dialog ctx: `mode`/`fromMasterWallet`/`isFalconUser`/`preSelectedSource?`/`sourceEntities`/`destinationEntities`/`availableWallets`/`masterWallet`/`currency`/`balanceDistribution`/`channels`) `:164-201`.

**Functions:** `isDescriptionRequired(sourceType, destinationType, mode)` `:211-228`; `toBackendEntityType(uiType): EntityType` `:233-246`; `isSameEndpoint(source, destination): boolean` (mgmt-console guard, additive) `:252-264`.

> Embedded business rules A–D documented in the file header `:13-25` (balance-type filtering, multiple-wallet hierarchy, master-wallet usage, no same source/dest). `[MEMORY] reference_wallet_backend_integration_contract_2026_06_02` — these DTOs equal backend `TransferBalanceRequest`/`AccountHierarchyResponse` field-for-field; wire `walletId` lowercase.

## Export count summary

- **Services:** 9 classes (`HttpService`, `LookupService`, `AccountValidationService`, `CommerceSettingsService`, `OrderStatusService`, `CommChannelPaymentService`, `ApplicationPaymentService`, `SimplePollService`, `ErrorDialogService`, `Helper`) + `HTTP_BASE_URL` token + 2 types (`GetSettingsResponse`, `ErrorDialogState`) + `PollConfig<T>` → **~13 exported symbols** (≈30 public methods across the classes).
- **Runtime-config:** **20 exported symbols** — 3 interfaces/types, 6 tokens, 7 provider/window fns, `useGateway`, `GATEWAY_PATH_MAP`, `DEFAULT_UPLOAD_CONFIG`, `RUNTIME_CONFIG_WINDOW_KEY`.
- **Interceptor:** 1 class (`RuntimeBaseUrlInterceptor`).
- **Validators:** 6 exported symbols (2 types + 4 fns).
- **Wallet (`@falcon/wallet`, separate alias):** ~9 enums + ~18 interfaces/types + ~9 helper fns + 1 const + 1 const-alias → **~38 exported symbols**.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Every signature + line number lifted from source; gateway resolution priority traced through the interceptor; `useGateway` context idiom + `GATEWAY_PATH_MAP` confirmed; the wallet barrel's deliberate exclusion from the area barrel verified. No source edited.
