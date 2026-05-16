# Cross-page dependencies — testing-charging

## Inbound (this feature depends on)

### From `@falcon` lib

| Symbol | Used as | Source | File:line |
|---|---|---|---|
| `ServiceOperationResult<T>` | Response envelope type for every HTTP call | `libs/falcon/src/shared-types/lib/models/service-operation-result.model.ts:1-7` | `testing-charging-api.service.ts:3` |
| `useGateway()` | HttpContext factory — marks every request for gateway-base-url prefixing | `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137` | `testing-charging-api.service.ts:3` |

[CODE] Both symbols are imported via the single barrel import `from '@falcon'`. The feature consumes **nothing else** from the `@falcon` library — no facades, no signal stores, no UI components, no directives, no pipes, no constants.

### From the host-shell (app-level wiring)

| Symbol | Role | File |
|---|---|---|
| `RuntimeBaseUrlInterceptor` | HTTP_INTERCEPTORS provider — rewrites relative URLs to `{baseURLSystemGateway}/api/testing/charging/...` | `apps/admin-console/src/app/app.config.ts:53-57` |
| `APP_DEFAULT_GATEWAY` (= `Gateway.SystemGateway`) | Defines default gateway for `useGateway()` | `apps/admin-console/src/app/app.config.ts:52` |
| `SHELL_ENV_CONFIG` (via `provideShellEnvFromWindow`) | Runtime environment object with all gateway URLs | `apps/admin-console/src/app/app.config.ts:44-51` |
| `adminConsoleGuard` | Parent route `canActivate` — `view` on `app.admin-console` | `apps/admin-console/src/app/app.routes.ts:8` |

### From Angular core / common

| Symbol | Used for |
|---|---|
| `HttpClient`, `HttpParams` | HTTP requests in `TestingChargingApiService` |
| `Component`, `OnInit`, `inject`, `Injectable` | Standard component / service decoration |
| `CommonModule` | `*ngIf`, `*ngFor`, `*ngFor` track-by, `number` pipe |
| `FormsModule` | `[(ngModel)]` two-way binding on simulator inputs |
| `forkJoin`, `finalize`, `map` (rxjs) | Parallel fetch + cleanup + unwrap |

### Inbound shared state

[CODE] **None.** The feature does not read any external state service. The only environment plumbing it reads is the `RuntimeBaseUrlInterceptor` → `SHELL_ENV_CONFIG.baseURLSystemGateway`, which is configured in app.config and consumed transparently by the interceptor — the component / service never reference it directly.

## Outbound (other features depend on this)

[CODE] **None.** The feature is fully self-contained:

- No `providedIn: 'root'` services exposed for cross-feature consumption (the one service `TestingChargingApiService` is technically root-provided but is not imported anywhere outside this feature folder — verified by grep across the worktree)
- No `EventEmitter`, no `Subject`, no `BehaviorSubject` exposed for cross-component coordination
- No `<app-testing-charging>` child usage anywhere outside its own route
- No routes that contribute to other features' nav or breadcrumbs

[CODE] Cross-folder grep for `TestingCharging` confirms only the 5 in-feature files plus 1 route file (`apps/admin-console/src/app/features/routes.ts`) and 1 sidebar file (`apps/host-shell/src/app/layout/layout.component.ts`) reference it. **No backward dependency exists.**

## Shared state

### Reads

- `SessionProvider.session.userType` — *indirectly*, only via the host-shell sidebar's visibility filter (`requiredUserTypes: [FALCON_USER]` + `hidden: userType === CLIENT_USER` at `layout.component.ts:403-404`). The feature component itself does not inject `SessionProvider`.

### Writes

- **None.** The feature does not write to any shared state service.

## Navigation entry points

[CODE] Entry points:

| Source | Path | File:line |
|---|---|---|
| Sidebar nav `Testing Charging Lab` (Falcon users only) | `/admin-console/testing/charging` | `apps/host-shell/src/app/layout/layout.component.ts:79, 397-405` |
| Direct URL | `/admin-console/testing/charging` | — |

[CODE] No deep links (no params), no notification-driven entries, no programmatic `router.navigate(['testing', 'charging'])` calls elsewhere — verified by absence of any `testing/charging` string outside the 7 known files.

## Notable architectural isolation

[INFERRED] The feature is the **most isolated page in admin-console**:
- Other admin features (org-hierarchy, contact-groups, wallet-balance-management) inject layout services, business rules, hierarchy state, organization services, and the `<falcon-tree-panel>` component
- testing-charging injects exactly **one** service and uses only **two** symbols from `@falcon`
- This isolation is consistent with its role as a sandboxed QA / dev surface, not a customer-facing feature

[INFERRED] This isolation also makes it a low-risk "port template" — rebuilding the page on the new theme requires no migration of shared dependencies, only:
1. The 10-endpoint service contract (which is gateway-stable)
2. The 14 DTOs (which are server-authoritative)
3. A new component tree under the new design system

The recent `effectiveFromLocalDateTime` / `expiresAtLocalDateTime` / `businessTimeZone` additions on `TestingChargingBucket` are the only schema motion landed since `origin/main`.
