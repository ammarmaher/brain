# falcon-shared-data-access — AUDIT (best-practice rubric §5)

> Rubric dims: **A** Angular-21 · **B** Stencil dual-render (N/A — no UI) · **C** Falcon house rules · **D** Accessibility (N/A — no UI) · **E** Cross-framework parity (N/A) · **F** Completeness/consistency/drift. Score PASS / 🟡 minor / 🟠 medium / 🔴 high-risk, evidence source-prefixed. **No fixes applied** (READ-ONLY pass, SPEC §0).

## A — Angular 21

**Grade: 🟡 GOOD (one DI-style mix).**

- ✅ All 10 service classes are `@Injectable({ providedIn: 'root' })` standalone-tree-shakeable singletons — `[CODE]` every `*.service.ts:@Injectable`. No NgModules.
- ✅ `inject()` used in the modern services: `account-validation.service.ts:14`, `lookup.service.ts:27`, `order-status`/`comm-channel-payment`/`application-payment`/`commerce-settings.service.ts`, and the interceptor (`runtime-base-url.interceptor.ts:17-20`, all `inject(..., {optional:true})`).
- ✅ Signals where appropriate: `ErrorDialogService.state = signal<…>(null)` (`error-dialog.service.ts:24`) — correct zoneless-friendly state holder.
- ✅ Zoneless-safe: pure RxJS + signals, no `zone.run`, no change-detection assumptions.
- 🟡 **A1 — `HttpService` uses constructor parameter-DI, not `inject()`** (`http.service.ts:14-19`: `constructor(private http: HttpClient, @Optional() @Inject(HTTP_BASE_URL) baseURL?)`). It is the ONE class here still on constructor DI (everything else uses `inject()`). Defensible (`@Optional() @Inject` reads cleanly as a ctor param), but off the house `inject()` convention. **safe-local.**
- 🟡 **A2 — `RuntimeBaseUrlInterceptor` is the legacy class-based `HttpInterceptor`, not a functional `HttpInterceptorFn`** (`runtime-base-url.interceptor.ts:15-16`). Angular 15+ prefers `provideHttpClient(withInterceptors([fn]))`. Class interceptors are fully supported and the team registers it via `withInterceptorsFromDi()` `[INFERRED from app.config registration]`, so this is a style/modernization note, not a defect. **safe-local.**
- ✅ No subscription-teardown concern: services return cold `Observable`s for callers to manage; `SimplePollService` hands back an explicit `stop()`; `ErrorDialogService` holds no subscription. (The interceptor `inject`s `SessionProvider` but only reads `.session` synchronously — no subscription.)

## B — Stencil dual-render

**N/A.** No UI components in this area. (The `falcon-error-dialog-host` that renders `ErrorDialogService` lives in `shared-ui`, not here.)

## C — Falcon house rules

**Grade: 🟡 GOOD (banner-style + comment-discipline nits; `any` defaults justified).**

- ✅ **No SCSS / no Tailwind / no UI primitives** — pure TS data layer, nothing to violate.
- ✅ **Terse `*** ***` banner comments** used well in `commerce-settings.service.ts:1-4`, `application-payment.service.ts:1-2`, `comm-channel-payment.service.ts:1-4`, `error-dialog.service.ts:1-8`, and the interceptor's Wave guards (`runtime-base-url.interceptor.ts:41-60,107-121`) — exemplary source-prefixed audit trail tying each guard to its Wave + the bug it fixed.
- ✅ **`any` is justified, not lazy** — every `<T = any>` on `HttpService` + the `// eslint-disable-next-line … --` rationale (`http.service.ts:21,48,73,98,142`) explains the HttpClient-mirroring default. No free `any`.
- 🟡 **C1 — `helper.ts` uses JSDoc `/** */` + no banner** (`helper.ts:39-43,115-122,142-147`) rather than the `*** ***` house banner; mixed comment styles across the area. Cosmetic. **safe-local.**
- 🟡 **C2 — raw `console.warn`/`console.error` in three places** — `helper.ts:62` (base64 decode failure), interceptor `:114` (empty-URL guard) + the thrown-error message `:52-59`. All are legitimate diagnostics for a transport layer (the interceptor ones are deliberately loud to surface the localhost-bug regression), but there is no logger abstraction. Note only. **safe-local.**
- 🟡 **C3 — `removeNullValuesFromQueryParams` reaches into the private `params['map']`** (`http.service.ts:135`) to delete keys, instead of rebuilding via the public `HttpParams` API. Works, but couples to an Angular internal that could change across majors. **safe-local.**

## F — Completeness / consistency / drift

**Grade: 🟠 MEDIUM (zero lib-level tests + two consistency seams + a contract risk).**

- 🟠 **F1 — No `*.spec.ts` anywhere in `shared-data-access/`.** `[CODE]` Confirmed: the only gateway test is `apps/host-shell/tests/order-status-gateway.spec.ts` (app-level). The **`RuntimeBaseUrlInterceptor`'s 4-priority resolution + hard-fail guard** (the exact logic that fixed the "every call hits localhost" P0) is untested at unit level, as are `HttpService.removeNullValuesFromQueryParams`, `SimplePollService` stop/max-duration, `ErrorDialogService` 401-suppress + promise-chaining, and `Helper.parseDateOnly` TZ-safety. **safe-local (additive tests)** — but the interceptor coverage is operationally important.
- 🟠 **F2 — Two unwrap conventions for `ServiceOperationResult` coexist** — **graceful** (`commerce-settings`→empty-default, `lookup`→`[]`+`catchError`) vs **throwing** (`order-status`/`comm-channel-payment`/`application-payment`). Both are intentional (silent reads vs user-actioned writes), but there is no documented rule, so new services pick arbitrarily. Note + document the convention. **safe-local.**
- 🟠 **F3 — Error-message extraction is inconsistent across the throwing services.** `order-status.service.ts:23` reads only `response.errors?.[0]`; `comm-channel-payment`/`application-payment` read `errorMessages?.[0] || errors?.[0]`. The envelope has BOTH `errorMessages` (localized) and `errors`; `OrderStatusService` ignores the localized `errorMessages`, so an order-status failure surfaces a non-localized/empty message where the payment services surface the localized one. **HIGH-RISK-QUEUE** (behavior/UX divergence on an error path — align by reading `errorMessages` first, but verify no caller depends on the current string).
- 🟠 **F4 — `RuntimeEnvironmentConfig` declares `baseURLPes` + `baseURLIdentityGateway`, but `GATEWAY_PATH_MAP` only maps 4 gateways and `useGateway(Gateway.IdentityGateway)` is effectively unused** (`account-validation.service.ts:57-60` Wave-10 comment explicitly says it STOPPED using `Gateway.IdentityGateway` because it "silently fell back to localhost", switching to plain `useGateway()` + `identity/` path that the System/Core YARP strips). So `IdentityGateway` is in the enum + map + config but the one caller that used it was migrated away. `baseURLPes` is consumed only by `@falcon/core` `access-control.client.ts` (absolute POST), never via this config's gateway map. Dead-ish surface to confirm. **HIGH-RISK-QUEUE** (removing an enum member / config field is a public-contract change touching every app's `environment.ts` + the window bridge — confirm no runtime config relies on `IdentityGateway` before any cleanup).
- 🟠 **F5 — The `validators/effective-date.rules.ts` module sits in `shared-data-access` but is a pure form-validation rule** — it has no HTTP/transport concern and conceptually belongs with the validations registry in `shared-utils` (L03). Its only consumer is `falcon-effective-date.directive.ts` (`shared-ui`). Mislocated; the barrel re-exports it as data-access public API. **safe-local** (relocation = barrel change, low risk but cross-lib).
- 🟡 **F6 — `Helper` is a grab-bag service** (date-only, base64, deepClone, enum→options, lookup→UI, pricing-type) with no single responsibility; some methods (`parseDateOnly`/`formatDateOnly`/`getDateFromStringOrDash`) overlap conceptually with date utilities elsewhere `[INFERRED]`. Cohesion smell, not a bug. **safe-local.**
- 🟡 **F7 — `deepClone` uses `JSON.parse(JSON.stringify())`** (`helper.ts:67-69`) — drops `Date`/`Map`/`undefined`/functions and throws on cycles. Fine for the plain DTOs it clones, but an undocumented footgun if reused on richer objects. Note. **safe-local.**
- ✅ **F8 — Barrel completeness PASS.** `[CODE]` `index.ts:2-5` re-exports services/runtime-config/interceptors/validators; the services sub-barrel names all 9 services + 2 types (`index.ts:1-10`); `@falcon` re-exports the area. The `lib/wallet/` exclusion from the area barrel is **deliberate + documented** (`wallet/index.ts:1-15` — collision avoidance), not an omission.
- ✅ **F9 — `@falcon/wallet` DTO superset is internally consistent** — `transfer.models.ts` imports `Currency`/`WalletBalanceType`/`NodeType` from `wallet-balance.models.ts`; the `path?` + `isSameEndpoint` additive extensions are documented as mgmt-console supersets (`:79-92,248-264`). No drift between the two files.

## E — Cross-framework parity
**N/A** (no React/Vue surface for a data layer).

## Tally

- **A = 🟡 GOOD** (A1 ctor-DI on `HttpService`, A2 class-interceptor style; both safe-local).
- **C = 🟡 GOOD** (C1 banner style, C2 console calls, C3 private-`map` reach; all safe-local; `any` defaults exemplary).
- **F = 🟠 MEDIUM** (F1 zero lib tests, F2/F3 unwrap+error-message divergence, F4 unused IdentityGateway surface, F5 mislocated validator; F3+F4 are HRQ).
- **B / D / E = N/A.**
- **Area overall: 🟡 GOOD with 🟠 medium drift.** Zero 🔴. The transport core is well-hardened (Wave 8/10 guards) and exemplary-commented; the medium findings are coverage + two consistency seams + an error-message contract risk.

## HIGH-RISK-QUEUE (2)
- **F3** — `OrderStatusService` reads `errors[0]` only, diverging from the payment services' `errorMessages[0] || errors[0]` → non-localized order-status error. Align after confirming no caller string-matches.
- **F4** — `Gateway.IdentityGateway` + `baseURLIdentityGateway` are config/enum surface whose only caller was migrated away (Wave 10); confirm truly dead before any removal (public contract across 3 apps + window bridge).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Every finding cites a source line; the IdentityGateway-deprecation reasoning lifted verbatim from `account-validation.service.ts:57-60`; error-message divergence compared across the three throwing services; no `*.spec.ts` in the lib confirmed by directory enumeration. No source edited.
