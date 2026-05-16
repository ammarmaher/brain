# Services & APIs — testing-charging

## Services

| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `TestingChargingApiService` | `apps/admin-console/src/app/features/testing-charging/services/testing-charging-api.service.ts` | `providedIn: 'root'` (`:18`) | Wraps all 10 testing-charging HTTP endpoints and unwraps `ServiceOperationResult<T>` |

[CODE] The service uses Angular's `inject(HttpClient)` (`:20`) and stores `private readonly baseUrl = 'api/testing/charging';` (`:21`).

[CODE] All endpoints share the same `useGateway()` HttpContext (`libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137`), which the `RuntimeBaseUrlInterceptor` then prefixes with `Gateway.SystemGateway` because the admin-console app sets `provideAppDefaultGateway(Gateway.SystemGateway)` at `apps/admin-console/src/app/app.config.ts:52`.

[CODE] The service exposes a private `unwrap<T>` helper at `:107-109`:

```typescript
private unwrap<T>(source: Observable<ServiceOperationResult<T>>): Observable<T> {
  return source.pipe(map(response => response.result));
}
```

Every method returns `Observable<T>` rather than `Observable<ServiceOperationResult<T>>` — error envelopes are stripped before they reach the component, which means errors only surface as RxJS `error` callbacks (no granular handling of `isSuccessful: false` + error codes).

## HTTP endpoints called

| # | Method | URL pattern | Service.method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|---|
| 1 | GET | `api/testing/charging/accounts?search={s}&page={p}&pageSize={ps}` | `TestingChargingApiService.getAccounts(search, page=1, pageSize=50)` | query params only | `TestingChargingPagedResponse<TestingChargingAccount>` | `:23-33` |
| 2 | GET | `api/testing/charging/accounts/{accountId}/overview` | `TestingChargingApiService.getOverview(accountId)` | path param only | `TestingChargingOverview` | `:35-40` |
| 3 | GET | `api/testing/charging/accounts/{accountId}/wallets` | `TestingChargingApiService.getWallets(accountId)` | path param only | `TestingChargingWallet[]` | `:42-47` |
| 4 | GET | `api/testing/charging/accounts/{accountId}/reservations?page={p}&pageSize={ps}` | `TestingChargingApiService.getReservations(accountId, page=1, pageSize=50)` | path + query | `TestingChargingPagedResponse<TestingChargingReservation>` | `:49-55` |
| 5 | GET | `api/testing/charging/accounts/{accountId}/ledger?page={p}&pageSize={ps}` | `TestingChargingApiService.getLedger(accountId, page=1, pageSize=50)` | path + query | `TestingChargingPagedResponse<TestingChargingLedgerEntry>` | `:57-63` |
| 6 | GET | `api/testing/charging/accounts/{accountId}/balances` | `TestingChargingApiService.getBalances(accountId)` | path param only | `TestingChargingBalances` | `:65-70` |
| 7 | GET | `api/testing/charging/runs?accountId={id}&page={p}&pageSize={ps}` | `TestingChargingApiService.getRuns(accountId, page=1, pageSize=25)` | query params | `TestingChargingPagedResponse<TestingChargingRun>` | `:72-82` |
| 8 | GET | `api/testing/charging/runs/{runId}` | `TestingChargingApiService.getRun(runId)` | path param only | `TestingChargingRun` (with full `messages[]`) | `:84-89` |
| 9 | POST | `api/testing/charging/whatsapp/batches` | `TestingChargingApiService.createWhatsappBatch(request)` | `TestingChargingCreateWhatsappBatchRequest` | `TestingChargingRun` | `:91-97` |
| 10 | POST | `api/testing/charging/whatsapp/batches/{runId}/deliveries` | `TestingChargingApiService.triggerDeliveries(runId, request)` | `TestingChargingTriggerDeliveryRequest` | `TestingChargingRun` | `:99-105` |

[CODE] All `accountId` and `runId` path parameters are wrapped in `encodeURIComponent(...)` before interpolation — see e.g. `:37`, `:44`, `:88`, `:101`.

[CODE] All responses are typed as `ServiceOperationResult<T>` and pass through `unwrap<T>` which projects `.result` — endpoints **do** return the platform-standard wrapper.

## Base URL resolution

[CODE] The service writes relative paths (`api/testing/charging/...`) and relies on the `RuntimeBaseUrlInterceptor` to prefix the gateway base URL at request time.

Resolution chain (per `RuntimeBaseUrlInterceptor.resolveGatewayUrl()` at `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts:63-80`):

1. Every method calls `useGateway()` without a specific `Gateway` argument → no `SPECIFIC_GATEWAY_CONTEXT` override
2. `USE_GATEWAY_CONTEXT` is `true` → interceptor enters gateway-resolution branch
3. `APP_DEFAULT_GATEWAY` provider injects `Gateway.SystemGateway` (set at `apps/admin-console/src/app/app.config.ts:52`)
4. Interceptor maps `Gateway.SystemGateway` → `RuntimeEnvironmentConfig.baseURLSystemGateway` (via `GATEWAY_PATH_MAP` at `runtime-api-config.ts:117`)
5. Final URL = `${baseURLSystemGateway}/api/testing/charging/...`

[INFERRED] So in production every endpoint resolves to **`https://<system-gateway-host>/api/testing/charging/...`** — i.e. these are System-Gateway-proxied endpoints, not Core-Gateway. The naming convention `api/testing/...` is **internal admin-facing** and is consistent with the rest of the admin-console which also targets System Gateway.

## Auth / interceptors

[CODE] Identified at app config level (`apps/admin-console/src/app/app.config.ts`):

- `RuntimeBaseUrlInterceptor` — registered as `HTTP_INTERCEPTORS` multi-provider at `:53-57` — prefixes gateway URL
- `withInterceptorsFromDi()` (`:42`) — wires DI-based interceptors

No custom auth header is added in the service; the JWT Bearer token flow is presumed to be added by a host-shell-level interceptor (the testing-charging feature itself does not configure auth interception).

## Backend service mapping

[INFERRED] All endpoints route through **falcon-int-system-gateway-svc** (the Falcon-internal System Gateway) per the `Gateway.SystemGateway` default for admin-console. The pattern `/api/testing/charging/*` is the gateway's reverse-proxy / aggregation prefix.

[INFERRED] The downstream backend is **falcon-core-charging-svc**, since:
- All operations (accounts, wallets, buckets, reservations, ledger, balances, runs, batches, deliveries) are OCS concepts owned by the Charging service
- The `error` strings reference OCS and Redis state explicitly (`testing-charging.component.ts:239`: *"Check account strategy, active contract rates, Redis state, and wallet balance."*)
- The error string also mentions `system-gateway` and `charging` settings (`testing-charging.component.ts:129`: *"Verify TestingCharging is enabled in system-gateway and charging settings."*)

[INFERRED] The "TestingCharging" subsystem is a **feature-flagged controller** behind a System-Gateway YARP route, mounted only when both the gateway and the charging service have `TestingCharging` enabled in their settings — this aligns with the "Testing traffic mutates real OCS balances" warning shown in the UI (`testing-charging.component.html:5,67`).

## Concurrency strategy

[CODE] `forkJoin` is used to fan out the 6 detail endpoints simultaneously when an account is selected (`testing-charging.component.ts:202-209`):

```typescript
forkJoin({
  overview:     this.api.getOverview(accountId),
  wallets:      this.api.getWallets(accountId),
  reservations: this.api.getReservations(accountId),
  ledger:       this.api.getLedger(accountId),
  balances:     this.api.getBalances(accountId),
  runs:         this.api.getRuns(accountId),
})
```

Each refresh hits 6 endpoints in parallel. `getRun(runId)` is called separately when a run card is clicked (`:267-270`). `getAccounts()` is called on init and on search/refresh.

[INFERRED] Worst-case end-to-end load on a fresh selection: 1 accounts call + 6 detail calls + 1 run detail call = **8 concurrent endpoints touched on first selection** (since `selectAccount` chains `loadAccountDetails` and `syncSelectedRunAfterRefresh` may also call `selectRun`).
