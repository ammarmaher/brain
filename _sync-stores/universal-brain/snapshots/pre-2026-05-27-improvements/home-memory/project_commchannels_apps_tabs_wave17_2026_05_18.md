---
name: CommChannels + Apps Tabs — Wave 17 (Mocks deleted, API loading live, error pipeline verified)
description: Both tabs now load from Commerce backend via state slices + ServiceRow→ApplicationRow adapter. Mock data deleted. Error pipeline verified — 400 → business toast, others → popup confirm.
type: project
originSessionId: 2e67055a-ab2f-4c7a-a9e8-929adeb9f8b1
---
🟢 LANDED 2026-05-18 (Wave 17). `nx build admin-console` GREEN `664f95b8ae986bbc`/21.55s.

## What landed

### Files added (Wave 17 specific)
- `apps/admin-console/.../tab-components/applications-table/models/models.ts` — type-only stub for `ApplicationRow`/`ApplicationStatus`/`ApplicationPriceType`/`ApplicationScheduledChange` (relocated from the old mock file)
- `apps/admin-console/.../tab-components/_shared/models/application-row.adapter.ts` — `serviceRowsToApplicationRows` adapter that maps backend `ServiceRow` (camelCase wire types, FalconItemStatus/PricingType enums, ISO date strings) → legacy `ApplicationRow` (string severity, string priceType, M/D/YYYY display strings) so the table render contract stays decoupled from the wire shape

### Files modified
- `apps/admin-console/.../services/mock-applications.ts` → shrunk to a TYPE-ONLY shim re-exporting from `applications-table/models/models.ts`. ALL mock data + `getMockApps`/`getMockChannels` helpers DELETED.
- `comm-channels-tab/comm-channels-tab.component.{ts,html}` → injects `CommChannelsTabStateSlice`, `effect()` on `nodeId()` triggers `state.load(id)`, `computed tableRows = serviceRowsToApplicationRows(state.rows())` feeds the table
- `apps-services-tab/apps-services-tab.component.{ts,html}` → symmetric with `AppsServicesTabStateSlice`

### Files untouched
- `applications-table.component.{ts,html}` — render contract preserved. The shim keeps its `mock-applications` import valid (now resolves to type-only re-exports). Phase 4 mutation handlers will refactor this component to use `CommerceActionsService` directly.

## Error pipeline — VERIFIED already configured

`apps/host-shell/src/app/core/http-ui/falcon-http-ui.config.ts:23-67`:

| Status | Surface | Title | Notes |
|---|---|---|---|
| 400 Bad Request | **toast** (top-right error) | "Bad request" | Business-validation inline message, 12s auto-dismiss |
| 401 | n/a — owned by AuthService refresh-token flow | — | Never reaches dispatcher |
| 403 Forbidden | **popup** | "Access denied" | Permission rejection — must acknowledge |
| 404 Not Found | **popup** | "Not found" | — |
| 422 Unprocessable Entity | **toast** (warning) | — | Business-rule rejection |
| 4xx (catch-all) | **popup** | — | 405/409/410/415/429/… |
| 5xx (all server errors) | **popup** | "Server error" | Non-recoverable |
| network (status 0) | **popup** | "Connection lost" | — |
| applicationError (HTTP 200 + isSuccessful:false) | **toast** (error) | "Validation error" | SOR envelope failure |
| default | **popup** | — | Final fallback |

Implementation: `apps/host-shell/src/app/core/interceptors/response-interceptor.ts:39-116`. Honors `notShowToaster: 'true'` header for silent calls. My `commerce-gateway.service.ts` sets that header **only** on `do-payment` POSTs (Phase 4 will own those failure dialogs); ALL other GETs + mutations route through the global pipeline.

## ServiceRow → ApplicationRow adapter field map

```
ServiceRow.visibility (bool)             → ApplicationRow.visible
ServiceRow.pricingType (PricingType|null)→ ApplicationRow.priceType ('OneTime'/'Monthly'/'Yearly'/'Quarterly')
   • Monthly=1 → 'Monthly', Yearly=2 → 'Yearly', OneTimePayment=3 → 'OneTime', null → 'OneTime' (safe default)
ServiceRow.priceValue                    → same
ServiceRow.firstActivationDate (ISO|null)→ ApplicationRow.firstActivation (M/D/YYYY|null)
ServiceRow.activationDate                → ApplicationRow.activation
ServiceRow.renewDate                     → ApplicationRow.renew
ServiceRow.status (FalconItemStatus)     → ApplicationRow.status ('active'/'expired'/'inactive'/'disable'/null)
   • Active=2 → 'active', Expired=3 → 'expired', InActive=1 → 'inactive', Disabled=4 → 'disable', None=0 → null
ServiceRow.scheduledChanges (readonly)   → ApplicationRow.scheduledChanges (mutable per row)
```

## Auto-revert blocker (resolved)

Initial Wave 17 wiring attempt was blocked by auto-revert of 5 protected files: `mock-applications.ts` + both tab `.{ts,html}` + applications-table. After user paused the auto-revert mechanism, the wiring landed in one tight pass with no further reverts.

## Behavior change

✓ Mocks DELETED (file content + helper functions)
✓ Both tabs load from Commerce backend on mount + on every nodeId change
✓ Loading / error states wired through canonical state slice (`mode: idle | loading | view | error`)
✓ Cancellable in-flight subscription (Phase 2 defends against rapid tree clicks)
✓ Global error pipeline routes 400 → inline business toast, 4xx/5xx/network → popup

## Trigger

`comm channels backend integration done` / `apps services backend integration done` / `wave 17 commchannels` / `serviceRowsToApplicationRows adapter`
