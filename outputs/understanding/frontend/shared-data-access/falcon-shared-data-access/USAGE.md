# falcon-shared-data-access — USAGE

> Real codebase examples (cite file:line), the recommended-new-usage idioms, a Do/Don't table, and the grep-verified Consumer Sweep. All examples source-prefixed.

## Recommended new usage

### 1. A feature API service that must hit a SPECIFIC gateway

```ts
@Injectable({ providedIn: 'root' })
export class MyFeatureService {
  private http = inject(HttpService);              // or raw HttpClient

  load(id: string): Observable<Thing> {
    return this.http
      .get<ServiceOperationResult<Thing>>(`commerce/thing/${id}`, { ...useGateway() })
      .pipe(map(r => (r.isSuccessful && r.result) ? r.result : throwError(...)));
  }
}
```

- `[CODE]` This is the canonical idiom — see `order-status.service.ts:12-26`, `lookup.service.ts:49-64`, `comm-channel-payment.service.ts:26-51`. Spread `...useGateway()` into options; the `RuntimeBaseUrlInterceptor` resolves the base URL to the app default (admin→System, mgmt→Core) or session user-type (host-shell).
- For a **specific** gateway, pass it: `...useGateway(Gateway.ChargingGateway)`. `[CODE]` `useGateway(gateway?)` `runtime-api-config.ts:130-139`.

### 2. Unwrapping the `ServiceOperationResult<T>` envelope

```ts
.pipe(map((res) => (res?.isSuccessful && res.result) ? res.result : EMPTY))
// or throw on failure:
.pipe(map((res) => {
  if (res.isSuccessful && res.result) return res.result;
  throw new Error(res.errorMessages?.[0] || res.errors?.[0] || 'Failed …');
}))
```

- `[CODE]` Two house patterns: **graceful** (`commerce-settings.service.ts:46-49` → empty defaults, `lookup.service.ts:60-63` → `[]` + `catchError`) and **throwing** (`order-status.service.ts:18-25`, `comm-channel-payment.service.ts:39-50`, `application-payment.service.ts:36-47`). Throwing surfaces `errorMessages[0]` for the global `ResponseInterceptor` / inline error pill.

### 3. Suppressing the global error toaster (`silent` / `notShowToaster`)

```ts
service.doPayment(req, { silent: true })   // → attaches header notShowToaster:'true'
```

- `[CODE]` `application-payment.service.ts:33` + `comm-channel-payment.service.ts:35` add `{ headers: { notShowToaster: 'true' } }` when `silent`. The host-shell `ResponseInterceptor` reads this header (`apps/host-shell/src/app/core/interceptors/response-interceptor.ts:54,108`) and SKIPS its automatic error modal/toast — the caller owns the failure UX (e.g. the reorder dialog's inline pill). `AccountValidationService` + `CommerceSettingsService` set the same header on validation/settings reads so a missing/duplicate doesn't pop a global toast.

### 4. Polling an order to completion

```ts
const { data$, stop } = this.poll.watch({
  serviceMethod: () => this.orderStatus.getOrderStatus(orderId),
  intervalSeconds: 2,
  maxDurationMinutes: 5,
  shouldStop: (s) => s.status === ProcessState.Completed || s.status === ProcessState.Failed,
});
```

- `[CODE]` `SimplePollService.watch()` `simple-poll.service.ts:18-50` — `exhaustMap` (no overlap), `takeWhile(..., true)` (inclusive last), `shareReplay(1)`. Always call `stop()` on teardown.

### 5. Opening the acknowledge-required error dialog

```ts
await this.errorDialog.openError({ httpStatus: 409, errorMessages: ['…'], titleKey: 'x.y' });
// continues only after the user dismisses; 401 resolves immediately
```

- `[CODE]` `error-dialog.service.ts:32-44`. The `falcon-error-dialog-host` component (`libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/`) reads `errorDialog.state()` and renders.

### 6. App wiring (one-time, in `app.config.ts`)

- `[CODE]` admin-console: `provideAppDefaultGateway(Gateway.SystemGateway)` `apps/admin-console/src/app/app.config.ts:70`.
- `[CODE]` management-console: `provideAppDefaultGateway(Gateway.CoreGateway)` `apps/management-console/src/app/app.config.ts:65`.
- `[CODE]` host-shell: NO app-default → session fallback `apps/host-shell/src/app/app.config.ts:121`. All three register `RuntimeBaseUrlInterceptor`.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Spread `...useGateway()` into every gateway-routed `HttpClient`/`HttpService` call. | Hardcode a gateway base URL in a feature service. |
| Type the response as `ServiceOperationResult<T>` and unwrap `result`. | Assume the raw body IS `T` (it's the envelope). |
| Pass `{ silent: true }` when the caller renders its own error UI. | Leave a wizard-handled failure to pop the global toaster. |
| Keep a single-app API service in its feature folder. | Add a feature-only service to this shared lib. |
| Import wallet DTOs from `@falcon/wallet`. | Import wallet DTOs from `@falcon` (collision) or re-export them through the area barrel. |
| Use `Helper.parseDateOnly`/`formatDateOnly` for date-only fields. | Use `toISOString()`/`new Date(str)` for date-only (TZ shift). |
| Let `HttpService.get/delete` strip null params. | Manually build query strings with `undefined`/`'null'` values. |
| POST PES via the absolute-URL client (bypasses this interceptor). | Route PES auth through `useGateway()`. |

## Consumer Sweep (grep-verified 2026-06-03)

> `apps/` + `libs/` only; `dist/`, `docs/`, `demos/`, `*.md` excluded from the substantive counts.

**`useGateway` — 231 occ / 47 files** (the gateway idiom). Heaviest: `org-hierarchy-page/services/services.ts` (admin 7 / mgmt 8), add-user `user.service.ts` (admin 10 / mgmt 9), `contact-group-api.service.ts` (admin 6 / mgmt 16), `templates-http-api.service.ts` (admin/mgmt 19 each), host-shell `service-pricing/commerce-gateway.service.ts` (10), `wallet-balance.service.ts` (admin/mgmt/new-wallet-balance 5 each), settings-tab `settings.service.ts` (5), `marketplace-applications.service.ts` (3), `contracts.service.ts` (3), `comms-hub.service.ts` (4), host-shell core `auth-api`/`user-api`/`profile-otp`/`current-user`. Within this lib: `order-status`/`lookup`/`http`/`account-validation`/`commerce-settings`/`application-payment`/`comm-channel-payment`/`runtime-api-config`/`runtime-base-url.interceptor`.

**`HttpService` — 99 occ / 39 files.** Feature services across all three apps + `@falcon/core` `access-control.client.ts` (mixes `HttpService` injection with absolute-URL POST).

**`RuntimeBaseUrlInterceptor` — 14 files.** All three `app.config.ts` (registration) + host-shell `user-api.service.ts`/`profile-otp.service.ts`/`order-status-realtime.service.ts`/`order-status-gateway.util.ts`/`organization-hierarchy-tree/services/services.ts`/`service-pricing/commerce-gateway.service.ts` + admin `contact-group-api.service.ts` + `@falcon/core` `access-control.client.ts` (documents bypassing it) + `apps/host-shell/tests/order-status-gateway.spec.ts`.

**`ServiceOperationResult` — 405 occ / 67 files.** The universal envelope. Every service in this lib + dozens of feature services in all three apps + `libs/sdk/src/types/{user-details.dtos,user-details-gateway.interface,otp-gateway.interface}.ts` + `libs/falcon/src/shared-features/{user-details,service-pricing-table}/…`.

**Domain services (representative consumers):**
- `LookupService` / `Helper`: org-hierarchy `services/services.ts` + `models/models.ts` (admin + mgmt), add-user wizard, add-client wizard, do-payment-priority-popup (`apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts`).
- `OrderStatusService` / `CommChannelPaymentService` / `ApplicationPaymentService` / `SimplePollService`: `do-payment-priority-popup` + order-status realtime (host-shell core/realtime) + the reorder flow.
- `CommerceSettingsService`: settings-tab `services/settings.service.ts` + add-user/add-client wizard signals (password-level/limits/IPs).
- `AccountValidationService`: add-client + add-user wizards (async-unique validators).
- `ErrorDialogService`: `falcon-error-dialog-host.component.{ts,html}` (the shell render host) + features that open it.

**`@falcon/wallet` DTOs:** `apps/{admin,management}-console/src/app/features/{wallet-balance-management,new-wallet-balance}/services/wallet-balance.service.ts` + `new-wallet-balance` adapter/specs.

> Verified live: the `useGateway`+`ServiceOperationResult` pair is the platform-wide HTTP idiom; the interceptor is the single chokepoint that turns a relative path into a per-MFE gateway URL.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Examples lifted from the live service files; consumer counts are raw grep totals (231 `useGateway` / 99 `HttpService` / 14 interceptor / 405 envelope); `notShowToaster`↔`ResponseInterceptor` linkage cross-checked in `apps/host-shell/src/app/core/interceptors/response-interceptor.ts`. No source edited.
