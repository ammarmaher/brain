---
type: investigation-gap-report
title: "Shared Service-Pricing component — gap analysis: polishing-v0.4 vs origin/main"
date: 2026-05-21
branch_under_review: polishing-v0.4
reference_branch: origin/main
author: ammar-web-platform-ui (investigation-only)
component_under_review: "<app-service-pricing> (host-shell shared) + <falcon-service-pricing-table> (falcon lib)"
verification_policy: source-prefix-rule (every claim cited)
---

# Executive Summary

The Wave 2 consolidation (2026-05-19) folded FOUR near-identical per-tab admin-console components into ONE `<app-service-pricing>` shared wrapper + ONE `<falcon-service-pricing-table>` presentation lib, both `kind`-parameterised (`'application'` | `'comm-channel'`). All five legacy `commerce/node/*` endpoints the OLD `CommerceGatewayService` hit (visibility, price-type, price-value, enable, disable, delete-new-*, do-payment) are still hit by the NEW gateway — every URL, method, payload key, and PES gate matches. The OLD-vs-NEW URL-base case (`commerce/node` vs `commerce/Node`) and the list-URL choice are the ONLY behavioural deltas: NEW comm-channel list hits `/comm-channels/visible/details` instead of OLD `/comm-channels` (this is INTENTIONAL — the new wire shape ships the `details[]` discriminated union for shadow rows the old UI never used). NO new SignalR write-path replaces the REST SoT for validity/visibility — SignalR is wired only to the do-payment popup, never to validity/visibility toggles. **The user's concern about "SignalR-only optimistic flips that never wait for the API" is FALSIFIED for this surface.**

Two REAL bugs found: (P0) the skeleton path never fires on the INITIAL list-load nor on node-switch because `[loading]="submitting()"` is bound to MUTATION state only — the slice's `mode === 'loading'` is never surfaced to the table. (P1) `loadError` is captured by the slice but the host wrapper template renders no in-pane error banner, so a 4xx/5xx GET silently leaves an empty table after the global error-toast auto-dismisses — matching the user's "table renders empty, need to refresh" symptom. Add Client/User wizard tables and mgmt-console Apps/Comms tabs do NOT consume the shared wrapper (intentional per Wave 2 contract — mgmt has no mutations yet).

# 1. The Shared Surface

## 1.1 Host-shell wrapper — `<app-service-pricing>`

| File | Line | Symbol | Purpose | URL/Event | Notes |
|---|---:|---|---|---|---|
| `apps/host-shell/src/app/shared-components/service-pricing/index.ts` | 5 | `ServicePricingComponent` (re-export) | Public surface | — | Path alias `@host-shell/shared/service-pricing` |
| `service-pricing.component.ts` | 74 | `ServicePricingComponent` | Wrapper – binds `kind`+`nodeId`; orchestrates HTTP; toasts; hosts do-payment popup | — | Standalone, OnPush |
| `service-pricing.component.ts` | 85 | `nodeId = input<string \| null>(null)` | Selected node | — | — |
| `service-pricing.component.ts` | 89 | `kind = input.required<ServicePricingKind>()` | `'application' \| 'comm-channel'` | — | Drives every endpoint |
| `service-pricing.component.ts` | 109 | `submitting` computed | `state.submitting() \|\| doPaymentInFlight()` | — | Bound to table `[submitting]` |
| `service-pricing.component.ts` | 122 | `effect(...)` | Re-loads slice on `kind`/`nodeId` change | `state.load(id)` | Wrapped in `untracked()` to avoid signal re-read inside effect |
| `service-pricing.component.ts` | 134 | `resolveAccessFlags()` | Resolves 4 PES gates | `FalconAccess.adminConsole.services.{visibility,editPriceType,editPriceValue,payment}` | Caught failures default-deny |
| `service-pricing.component.ts` | 175 | `onMutationResult(res)` | Generic mutation success branch | `state.reload()` | Keeps `submitting=true` through reload |
| `service-pricing.component.ts` | 188 | `onPriceMutationResult(res)` | Price-edit branch | `state.applyOptimisticRow(...)` + `state.reload()` | Best-effort optimistic patch |
| `service-pricing.component.ts` | 212 | `onMutationError()` | Releases gate | — | Toast owned by global `errorRules` (double-toast fix [MEMORY] `project_double_toast_root_cause_and_z_index_fix_2026_05_20`) |
| `service-pricing.component.ts` | 218 | `onVisibilityToggle(event)` | Visibility toggle path | `actions.changeVisibility(kind, …)` | Calls `runMutation` → `onMutationResult` |
| `service-pricing.component.ts` | 235 | `onRowAction(event)` | Kebab enable/disable | `actions.enable(kind, …) \| actions.disable(kind, …)` | Same shape |
| `service-pricing.component.ts` | 250 | `onPriceTypeSave(event)` | Save scheduled price-type | `actions.changePriceType(kind, …)` | `onPriceMutationResult` |
| `service-pricing.component.ts` | 268 | `onPriceValueSave(event)` | Save scheduled price-value | `actions.changePriceValue(kind, …)` | `onPriceMutationResult` |
| `service-pricing.component.ts` | 285 | `onScheduledDelete(event)` | Delete pending change | `actions.deleteNewPriceType \| deleteNewPriceValue` | `onMutationResult` |
| `service-pricing.component.ts` | 305 | `onDoPaymentRequest(event)` | Open do-payment popup | sets `ibTrigger` | popup hosts SignalR+HTTP flow |
| `service-pricing.component.html` | 4-14 | `<falcon-service-pricing-table>` | Presentation child | — | `[loading]="submitting()"` — **NOT** wired to `state.loading()` (see §6.1) |
| `service-pricing.component.html` | 17-20 | `<app-do-payment-priority-popup>` | Do-payment | — | Wave 4 SignalR popup, separate scope |

## 1.2 Slice — `ServicePricingStateSlice`

| File | Line | Symbol | Purpose | Notes |
|---|---:|---|---|---|
| `signals/service-pricing-state.slice.ts` | 22 | `@Injectable() ServicePricingStateSlice` | Per-mount instance | NOT `providedIn:'root'` — wrapper-scoped |
| `service-pricing-state.slice.ts` | 28 | `mode = signal<ServicePricingMode>('idle')` | Lifecycle state — `'idle' \| 'loading' \| 'view' \| 'error'` | Captured but never bound to table |
| `service-pricing-state.slice.ts` | 29 | `rows = signal<ReadonlyArray<ServiceRow>>([])` | Data | Fed to wrapper's `appRows` computed |
| `service-pricing-state.slice.ts` | 30 | `loadError = signal<string \| null>(null)` | i18n error key | NOT bound in template (no banner) |
| `service-pricing-state.slice.ts` | 34 | `submitting = signal<boolean>(false)` | Mutation-pending gate | Default `false` — fires only when `reload()` or `runMutation()` flip it |
| `service-pricing-state.slice.ts` | 45 | `configure(kind)` | Sets internal `this.kind` | Called once per mount before first load |
| `service-pricing-state.slice.ts` | 49 | `load(nodeId)` | GET dispatch | Sets `mode='loading'`; does NOT touch `submitting` |
| `service-pricing-state.slice.ts` | 93 | `reload()` | Re-fires `load(lastNodeId)` | Flips `submitting=true` BEFORE delegating |
| `service-pricing-state.slice.ts` | 107 | `applyOptimisticRow(row)` | Patches one row from PUT result | No-op when snapshot empty |

## 1.3 Gateway / actions

| File | Line | Symbol | URL / shape | Notes |
|---|---:|---|---|---|
| `services/commerce-gateway.service.ts` | 45 | `baseUrl = 'commerce/Node'` | base | **Case differs from OLD `'commerce/node'`** (see §2) |
| `commerce-gateway.service.ts` | 57 | `listPath(kind, nodeId)` | `commerce/Node/{nodeId}/applications` OR `…/comm-channels/visible/details` | comm-channel suffix changed (see §2) |
| `commerce-gateway.service.ts` | 65 | `idBody(kind, account, service)` | `{accountId, applicationId}` OR `{accountId, commChannelId}` | Identical to OLD |
| `commerce-gateway.service.ts` | 72 | `list(kind, nodeId)` | GET list | — |
| `commerce-gateway.service.ts` | 79 | `changeVisibility` | PUT `commerce/Node/{application\|comm-channel}/visibility` | — |
| `commerce-gateway.service.ts` | 91 | `changePriceType` | PUT `commerce/Node/{kind}/price-type` | Response now typed `AccountServiceWire` (H3 optimistic patch) |
| `commerce-gateway.service.ts` | 107 | `changePriceValue` | PUT `commerce/Node/{kind}/price-value` | Same |
| `commerce-gateway.service.ts` | 119 | `enable` | POST `commerce/Node/{kind}/enable` | — |
| `commerce-gateway.service.ts` | 131 | `disable` | POST `commerce/Node/{kind}/disable` | — |
| `commerce-gateway.service.ts` | 143 | `deleteNewPriceType` | DELETE `commerce/Node/{kind}/new-price-type` (with body) | — |
| `commerce-gateway.service.ts` | 155 | `deleteNewPriceValue` | DELETE `commerce/Node/{kind}/new-price-value` (with body) | — |
| `commerce-gateway.service.ts` | 172 | `CommerceActionsService` | Facade over gateway, implements `ServicePricingTransport` | Bound via `SERVICE_PRICING_TRANSPORT` token at wrapper provider scope |

## 1.4 Presentation library — `<falcon-service-pricing-table>`

| File | Line | Symbol | Purpose |
|---|---:|---|---|
| `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts` | 139 | `ServicePricingTableComponent` | Presentation-only — zero HTTP |
| `service-pricing-table.component.ts` | 146 | `rows = input<…>([])` | Rendered rows |
| `service-pricing-table.component.ts` | 157 | `submitting = input<boolean>(false)` | Drives `[loading]` of inner `<falcon-angular-data-table>` |
| `service-pricing-table.component.ts` | 161-166 | Outputs | `visibilityToggle / rowAction / priceTypeSave / priceValueSave / scheduledDelete / doPaymentRequest` |
| `service-pricing-table.component.ts` | 408 | `onToggleVisibility(id, checked)` | Fires `visibilityToggle.emit({rowId, visible})` |
| `service-pricing-table.component.ts` | 420 | `onRowAction(event)` | Kebab dispatcher — editPriceType/editPriceValue open shadow; enable/disable/doPayment emit |
| `service-pricing-table.component.ts` | 552 | `onShadowRowSave(event)` | Runs FE validation BEFORE emit; `shadowError` on fail |
| `service-pricing-table.component.html` | 4-32 | `<falcon-angular-data-table>` | Inner Stencil-backed table; `[loading]="submitting()"` |

## 1.5 Validations — `libs/falcon/src/shared-features/service-pricing-table/validations/validations.ts`

Three pure server-mirrored rules: `effectiveDateRequired`, `effectiveDateMustBeInFuture`, `invalidEffectiveDateForPeriodicPricingChange` — composed via `validateEffectiveDate(value, ctx)`. Fired BEFORE emitting `priceTypeSave`. The Service-Pricing-Table also seeds VALID default effective dates via `defaultEffectiveDateIso(...)` and disables non-periodic-valid dates in the picker via `disabledDatesForRow(...)` so the user cannot pick a date the backend will reject.

## 1.6 Consumers

| File | Line | Consumer | `kind` | Notes |
|---|---:|---|---|---|
| `apps/admin-console/src/app/features/comm-channels-services/comm-channels-services.component.html` | 34 | Admin CommChannels & Services page | `"comm-channel"` | Tree LEFT + table RIGHT |
| `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.component.html` | 34 | Admin Marketplace Applications | `"application"` | — |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 357 | Admin org-hierarchy "CommChannels" tab | `"comm-channel"` | — |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 360 | Admin org-hierarchy "Apps" tab | `"application"` | — |

The user's "Communication tab" and "Application tab" map to lines 357 + 360 above (admin-console org-hierarchy-page).

## 1.7 Non-consumers (intentional, do NOT route through shared)

| File | Reason |
|---|---|
| `apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/apps-services-tab/apps-services-tab.component.ts:74` | Mgmt has no mutations yet (Wave 7 §6.6 — no PES keys for visibility/editPriceType/editPriceValue) — view-only inline table |
| `apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/comm-channels-tab/comm-channels-tab.component.ts:74` | Same (Wave 6 §6.6) |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/.../client-comm-channels-step/*` | Synchronous wizard-state input — no async fetch |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/.../client-applications-step/*` | Same |

# 2. Old vs New Endpoint Diff

Source for OLD: `git show origin/main:apps/admin-console/.../tabs-layout/components/service/commerce-gateway.service.ts` + `…/apps-services-tab/services/apps-services.service.ts` + `…/comm-channels-services-tab/services/comm-channels-services.service.ts` + `…/service/commerce-actions.service.ts`.

| Surface | OLD method/URL | NEW method/URL | Payload key | Status |
|---|---|---|---|---|
| **List — applications** | GET `commerce/Node/{nodeId}/applications` (`AppsServicesService.getList` [CODE] `apps-services.service.ts:33`) | GET `commerce/Node/{nodeId}/applications` (`CommerceGatewayService.list(kind='application', nodeId)` [CODE] `commerce-gateway.service.ts:57-60`) | n/a | Identical |
| **List — comm-channels** | GET `commerce/Node/{nodeId}/comm-channels` ([CODE] `comm-channels-services.service.ts:34`) | GET `commerce/Node/{nodeId}/comm-channels/visible/details` ([CODE] `commerce-gateway.service.ts:61`) | n/a | **Behavioural drift** (enhancement) — NEW endpoint ships the `details[]` discriminated union driving shadow rows. OLD never rendered scheduled-changes for comm-channels; NEW does. Backend already supports the new path per [CODE] commerce-svc `NodeController.cs:142-318`. |
| **Visibility — application** | PUT `commerce/node/application/visibility` body `{accountId, applicationId, visibility}` ([CODE] `commerce-gateway.service.ts:65-73` OLD) | PUT `commerce/Node/application/visibility` same body ([CODE] `commerce-gateway.service.ts:79-88` NEW) | `{accountId, applicationId, visibility}` | Identical (case differs — see §2.1) |
| **Visibility — comm-channel** | PUT `commerce/node/comm-channel/visibility` ([CODE] `commerce-gateway.service.ts:55-63` OLD) | PUT `commerce/Node/comm-channel/visibility` | `{accountId, commChannelId, visibility}` | Identical (case differs) |
| **Price-type — application** | PUT `commerce/node/application/price-type` ([CODE] `commerce-gateway.service.ts:85-92` OLD) | PUT `commerce/Node/application/price-type` | `{accountId, applicationId, pricingType, effectiveDate}` | Identical |
| **Price-type — comm-channel** | PUT `commerce/node/comm-channel/price-type` | PUT `commerce/Node/comm-channel/price-type` | `{accountId, commChannelId, pricingType, effectiveDate}` | Identical |
| **Price-value — application** | PUT `commerce/node/application/price-value` | PUT `commerce/Node/application/price-value` | `{accountId, applicationId, priceValue}` | Identical |
| **Price-value — comm-channel** | PUT `commerce/node/comm-channel/price-value` | PUT `commerce/Node/comm-channel/price-value` | `{accountId, commChannelId, priceValue}` | Identical |
| **Enable — application** | POST `commerce/node/application/enable` | POST `commerce/Node/application/enable` | `{accountId, applicationId}` | Identical |
| **Enable — comm-channel** | POST `commerce/node/comm-channel/enable` | POST `commerce/Node/comm-channel/enable` | `{accountId, commChannelId}` | Identical |
| **Disable — application** | POST `commerce/node/application/disable` | POST `commerce/Node/application/disable` | `{accountId, applicationId}` | Identical |
| **Disable — comm-channel** | POST `commerce/node/comm-channel/disable` | POST `commerce/Node/comm-channel/disable` | `{accountId, commChannelId}` | Identical |
| **Delete new-price-type — application** | DELETE `commerce/node/application/new-price-type` body | DELETE `commerce/Node/application/new-price-type` body | `{accountId, applicationId}` | Identical |
| **Delete new-price-type — comm-channel** | DELETE `commerce/node/comm-channel/new-price-type` body | DELETE `commerce/Node/comm-channel/new-price-type` body | `{accountId, commChannelId}` | Identical |
| **Delete new-price-value — application** | DELETE `commerce/node/application/new-price-value` body | DELETE `commerce/Node/application/new-price-value` body | `{accountId, applicationId}` | Identical |
| **Delete new-price-value — comm-channel** | DELETE `commerce/node/comm-channel/new-price-value` body | DELETE `commerce/Node/comm-channel/new-price-value` body | `{accountId, commChannelId}` | Identical |
| **Do-Payment — application** | POST `commerce/node/application/do-payment` body + `notShowToaster:'true'` header ([CODE] `commerce-gateway.service.ts:123-133` OLD) | POST `commerce/{gateway-base}/application/do-payment` from the do-payment-priority-popup — `ApplicationPaymentService` (lives in `libs/falcon/src/shared-data-access/...`) ([CODE] `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts:54`) | `{accountId, applicationId, commChannelPriorityIds?}` | Identical surface — moved to host-shell popup ([CODE] `do-payment-priority-popup.component.ts` Wave 16) |
| **Do-Payment — comm-channel** | POST `commerce/node/comm-channel/do-payment` body + `notShowToaster:'true'` header | POST `commerce/comm-channel/do-payment` via `CommChannelPaymentService` | `{accountId, commChannelId, commChannelPriorityIds?}` | Identical |
| **Order status (post-do-payment)** | GET `commerce/order-status/{orderId}` polled every 2s via `SimplePollService` ([CODE] `apps-services-tab.component.ts:583` OLD) | SignalR push via `OrderStatusRealtimeService` (`/hubs/order-status` group `falcon:order:{orderId}` or `order:{tenantId}:{orderId}`) with catch-up GET + fallback bounded GET ([CODE] `apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts:1-145` + `do-payment-priority-popup.component.ts`) | n/a | **Enhancement (Wave 4 2026-05-19)** — replaces 2s poll. Does NOT replace the REST submit endpoint; only the post-submit status check. The REST endpoint still authoritative. |

## 2.1 Case-sensitivity note — `commerce/node` vs `commerce/Node`

OLD: `baseUrl = 'commerce/node'` (lowercase) at [CODE] `git show origin/main:apps/admin-console/.../tabs-layout/components/service/commerce-gateway.service.ts:43`. NEW: `baseUrl = 'commerce/Node'` (capital N) at [CODE] `apps/host-shell/src/app/shared-components/service-pricing/services/commerce-gateway.service.ts:45`. Both share the same YARP route `commerce/{**remainder}` at the gateway layer, which forwards path-as-given. Whether the backend YARP cluster + ASP.NET routing tolerate the case difference is **not verifiable from the FE alone** — it depends on the backend pipeline's URL normalization. The OLD apps-services list at [CODE] `apps-services.service.ts:33` ALSO used `'commerce/Node'` (capital N), so the OLD codebase itself was inconsistent: the list URLs were capital-N, the mutation URLs were lowercase. The NEW code unifies on capital-N. 🟡 [INFERRED] Likely no functional impact (the platform clearly accepts both), but flag as a question for backend ops if any 404s appear.

## 2.2 Auth + interceptor parity

Both OLD and NEW use the same `HttpService` wrapper + `useGateway()` helper to attach gateway routing context. NEW retains the same `SystemGateway` (admin) selection via `APP_DEFAULT_GATEWAY` token. JWT-attach via `request-interceptor` + error-handling via `response-interceptor` — global, unchanged.

## 2.3 What's MISSING in new (none business-critical)

| OLD behaviour | NEW equivalent? | Notes |
|---|---|---|
| Optimistic local visibility toggle revert on error ([CODE] OLD `apps-services-tab.component.ts:316` `row.visibility = !nextVisibility`) | ❌ Not present | NEW relies on `state.reload()` after mutation OR keeps the user's local switch-flip visible during the in-flight → response → reload sequence. **Hypothesis [INFERRED]**: NEW's flow `runMutation → onMutationError → submitting=false` does NOT mutate `rows`, so the FalconAngularSwitch's internal `checkedInput` stays at the OPTIMISTIC value the user clicked (visible mismatch with backend until `reload()` fires). Since `onMutationError` does NOT call `state.reload()` (only `submitting.set(false)`), a failed visibility toggle leaves the on-screen switch desynced from server state. ⚠️ **This is a real behavioural regression.** Fix details in `FIX-PLAN.md` §P1-3. |
| `confirmationService.confirm` on "do-payment" before triggering ([CODE] OLD `apps-services-tab.component.ts:480`) | ❌ Not present in new — moved into the popup | NEW jumps straight into the do-payment popup. Old behavior was "Confirm? Y/N → then proceed". The popup itself drives the insufficient-balance prompts but does NOT gate the FIRST `doPayment` POST behind a confirm. This may be intentional (the popup IS the confirmation surface) but is worth flagging if old UX explicitly required a "Are you sure?" before any POST. 🟡 |
| `messageService.add({ severity: 'success', detail: 'Visibility updated successfully' })` on each mutation success | ✅ Identical via `this.toast.success(this.i18n.translate('hierarchy.services.mutationSuccess'))` ([CODE] `service-pricing.component.ts:177`) | Same UX. |
| Loading indicator per-row ([CODE] OLD `apps-services-tab.component.ts:139` `loadingRowIds` Set) | ❌ Not present | NEW uses table-wide `[loading]` only (skeleton over entire body). Old UX showed a per-row spinner; new UX shows global skeleton. This is the consolidation's deliberate design choice; not a regression of business logic but a UI affordance change. |

## 2.4 What's ADDED in new (enhancements, no regression)

| NEW behaviour | Why |
|---|---|
| Shadow-row inline editing for scheduled price changes | OLD used inline-row editing with `FalconInlineRowContext` templates; NEW uses the new Stencil shadow-row API. Functionally equivalent (Save → emit → HTTP → reload). |
| H3 optimistic `applyOptimisticRow(wire)` from PUT response | One-round-trip earlier UI; canonical `reload()` still runs after as the SoT. |
| H4 `disabledDatesForRow` calendar predicate (server-mirrored) | Prevents picking a date the backend will reject. Pure UX improvement. |
| H5 preserve shadow-row expansion across `rows()` re-emission | Better UX — old behaviour collapsed everything on each reload. |
| Bug-2 — hidden row drops scheduled-change UI (no expand, no kebab edit) | Server-side: hidden + still-has-NewPricingInfo is preserved; FE now correctly hides the affordance. |

# 3. "Is Valid" / "Is Not Valid" Toggle Audit

The user's "is valid" is the **Visibility column switch** (`<falcon-angular-switch>` at [CODE] `service-pricing-table.component.html:36-41`). Trace, NEW branch:

| Step | File:Line | Action |
|---|---|---|
| 1. User clicks the switch | `service-pricing-table.component.html:39` | `(valueChange)="onToggleVisibility(row.id, $event)"` |
| 2. Table presentation guard | `service-pricing-table.component.ts:408-418` | If row hidden by `accessFlags.canVisibility=false` → no-op; if attempting HIDE without `canHide` → no-op; on HIDE, call `collapseShadowState(id)` (optimistic local cleanup); emit `visibilityToggle.emit({rowId, visible: checked})` |
| 3. Wrapper handler | `service-pricing.component.ts:218-233` | `runMutation(() => actions.changeVisibility(kind, {accountId, serviceId, visibility}).subscribe({...}))` |
| 4. Actions facade | `services/commerce-gateway.service.ts:181-185` | Delegates to gateway |
| 5. Gateway HTTP | `services/commerce-gateway.service.ts:79-87` | `PUT commerce/Node/{application\|comm-channel}/visibility` with `{accountId, applicationId\|commChannelId, visibility}` |
| 6. Response — success | `service-pricing.component.ts:175-182` | Toast success + `state.reload()` (keeps `submitting=ON`) |
| 7. Reload → GET succeeds | `service-pricing-state.slice.ts:73-77` | `rows.set(rows)`, `mode='view'`, `submitting=false` |
| 8. Table re-renders | — | New rows reflect server-authoritative state |

Compare OLD (admin):
- [CODE] `git show origin/main:apps/admin-console/.../apps-services-tab/apps-services-tab.component.ts:282-321` — calls `commerceActions.changeApplicationVisibility({accountId, applicationId: row.id, visibility: nextVisibility}).subscribe({...next: loadData(), error: revert row.visibility})`.
- [CODE] `git show origin/main:apps/admin-console/.../comm-channels-services-tab/comm-channels-services-tab.component.ts:318-358` — symmetric.

**Verdict**: same URL, same method, same payload. Response handling difference:
- OLD: on error, `row.visibility = !nextVisibility` mutates the local row to revert the optimistic toggle.
- NEW: on error, no rollback — relies on the user perceiving the next reload (which is NOT triggered on error). ⚠️ See `FIX-PLAN.md` §P1-3.

**SignalR involvement**: NONE. The hub at `OrderStatusRealtimeService` is bound only to do-payment order-status events. No code path in the new branch fires a SignalR-driven `rows.set(...)` from a visibility/enable/disable event. The user's hypothesis is FALSIFIED.

# 4. SignalR Race Audit

`@microsoft/signalr` is used in EXACTLY two places:

| File | Usage |
|---|---|
| [CODE] `apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts:20-145` | `HubConnection` for `/hubs/order-status`. Server→client event: `"OrderFinalized"` payload `{orderId, status (eOrderStatus 1=Pending/2=Paid/3=Failed), failureReason}`. Subscriber pattern with handler map keyed by `orderId`. Does NOT mutate any table rows. |
| [CODE] `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts:78-80` | Imports the service. The popup `handleTerminal` path translates the push enum to `ProcessState`, fires reconciliation GET on Failed, and emits `(succeeded)` / `(failed)` events to the parent `<app-service-pricing>` wrapper. |

The wrapper's `onIbSucceeded()` handler at [CODE] `service-pricing.component.ts:323-327` then runs `state.reload()` — REST is the source of truth. The wrapper's `onIbFailed()` handler at line 329 does NOT reload.

There is NO SignalR write-path into the service-pricing slice's `rows` outside the do-payment success branch's call to `state.reload()`. The "row is valid/visible" toggles do NOT depend on SignalR — they are purely synchronous PUT → reload GET.

**No races possible** between SignalR and REST for the validity/visibility surface.

# 5. "Is Visible" Skeleton Trace

Per user: "is visible should show skeleton → fire API → hide skeleton when API resolves." Trace actual behaviour:

| Click → effect | Reality |
|---|---|
| User clicks the visibility switch | `(valueChange)` fires `onToggleVisibility` which emits to wrapper |
| Wrapper calls `runMutation` | `runMutation` at [CODE] `service-pricing.component.ts:158-163` calls `state.submitting.set(true)` BEFORE subscribing |
| `submitting()` flips true | Wrapper's `submitting` computed (state.submitting OR doPaymentInFlight) → updates `<falcon-service-pricing-table [submitting]>` |
| Lib table passes through | [CODE] `service-pricing-table.component.html:16` `[loading]="submitting()"` — the inner `<falcon-angular-data-table>` switches its body to **skeleton** rendering. With the 2026-05-21 rev-2 fix [MEMORY] `project_data_table_skeleton_during_external_cells_loading_2026_05_21`, this path now correctly renders skeleton even though the consumer projects template cells |
| PUT resolves successfully | `onMutationResult` calls `state.reload()`, which sets `submitting.set(true)` again (already true) → flips to `mode='loading'` → fires GET → finalize() sets `submitting=false` |
| GET resolves | `rows.set(...)` → `mode='view'` → `submitting=false` → table flips from skeleton back to data |

**Skeleton DOES fire on visibility/enable/disable/price mutations** — this part of the user's flow is working correctly post-rev-2 fix.

**HOWEVER — Skeleton DOES NOT fire on:**

1. **Initial mount load** — when `effect()` at line 122 calls `state.load(nodeId)` on first paint, the slice sets `mode='loading'` but **NEVER touches `submitting`**. `[loading]="submitting()"` stays false → no skeleton, just empty body until the GET resolves. This is exactly the "empty table that needs refresh" symptom the user reported — except it's a delay, not a permanent failure (rows eventually appear). [CODE] `service-pricing-state.slice.ts:60` sets `mode='loading'` but [CODE] line 34 has `submitting = signal<boolean>(false)` — and `load()` never touches it.
2. **Node-switch** — same: `effect()` fires `state.load(newId)`; `mode='loading'` set, `submitting` stays `false`.

This is in direct conflict with the doctrine from [MEMORY] `project_data_table_skeleton_initial_loading_fix_2026_05_20`: "a slice/component that auto-loads on mount must default `loading = signal<boolean>(true)`" — the equivalent here is "must surface `mode === 'loading'` to `[loading]`."

**Confirmed root cause**: the wrapper's `submitting` computed forgets to OR in `state.mode() === 'loading'`. Fix in `FIX-PLAN.md` §P0-1.

# 6. Missing-Data Bug Diagnosis (ranked hypotheses)

Per user: "sometimes the data-table renders empty and needs a page-refresh to populate."

| Rank | Hypothesis | Evidence | Status |
|---|---|---|---|
| **A (highest)** | **Silent GET failure with no inline banner** — when `commerce/Node/{id}/applications` or `…/comm-channels/visible/details` 4xx/5xx, the slice's error branch sets `rows.set([])`, `loadError.set('hierarchy.appsServices.loadError')`, `mode='error'`, `submitting=false` ([CODE] `service-pricing-state.slice.ts:78-86`). The wrapper template at [CODE] `service-pricing.component.html:4-14` renders NEITHER `loadError` NOR `mode==='error'`. The global response-interceptor fires its error toast which dismisses after 5s. User sees a transient toast then "empty table that doesn't populate." Refreshing the page re-fires the effect → fresh GET → if backend is now up, rows arrive. | 🟢 Code-verified. The slice writes to `loadError` but no consumer reads it ([CODE] grep `loadError` in `apps/host-shell/src/app/shared-components/service-pricing` returns ONLY slice file). |
| **B** | **`submitting=true` left ON when GET fires from a `reload()` after error** — `reload()` always sets `submitting=true`, then calls `load(lastNodeId)`. `load()`'s `finalize()` runs regardless of success/error, setting `submitting=false`. ✅ This case is correctly handled. Discounted as a cause of empty rows but worth noting `finalize` runs only AFTER `error` branch's `rows.set([])` — so the error branch IS reached cleanly. | 🟢 Code-verified clean. Not the cause. |
| **C** | **NG0600 inside `syncEmptyView`** — the rev-2 fix [MEMORY] `project_data_table_skeleton_during_external_cells_loading_2026_05_21` deferred `_isEmpty.set(...)` via `queueMicrotask` to break the synchronous CD-pass write that previously crashed render. With that fix landed (build hash `4a68198a0d4a42e9` for admin per memory), this should NOT trigger empty bodies anymore. | 🟡 Inferred — needs runtime confirmation. If the user is on a `polishing-v0.4` snapshot PRE-rev-2 fix this would still bite. Check the current branch HEAD vs the memory's build hash. |
| **D** | **Effect race — wrapper effect reads `kind()`+`nodeId()`, calls `state.configure(k)`+`state.load(id)`** — `configure` only sets internal `this.kind`. If `kind` arrives FIRST as a missing input that triggers an Angular signal-mismatch error (since `kind` is `input.required<ServicePricingKind>()`), the component would never mount. But this would NOT manifest as "empty table" — it would be a hard NG0951 throw. | 🟢 Discounted via code. Both consumers pass `kind="comm-channel"` / `kind="application"` literally; no missing-input path exists in production templates. |
| **E** | **Sub-tree node switch with `nodeId` going null briefly** — clicking a different tree node may emit `selectedNodeId() → null → newId` if the tree resolver transitions through null. `load(null)` clears rows. If a subsequent `load(newId)` is delayed (or never arrives), table stays empty. Inspecting [CODE] `CommChannelsPageStateService.onTreeSelect` at line 89-94 — it sets the selected-node directly (does NOT clear first), so this is benign on that page. For org-hierarchy-page-menu (line 357/360), the `state.effectiveNodeId()` is derived from `treeSlice.effectiveNodeId` — would need to inspect `TreeStateSlice` for any null-blip pattern but no evidence on quick scan. | 🟡 Inferred — would need to instrument the effect with `console.debug` to confirm. |
| **F** | **Sub-tree click clearing `lastNodeId` indirectly** — `state.load(null)` at slice line 50-57 sets `lastNodeId=null` + `rows.set([])`. If reload() is called later, `load(lastNodeId=null)` re-runs the null branch → empty rows. This is correct behaviour ON its own, but if a SECOND effect fires later (e.g. node-switch back) it should re-set `lastNodeId` and reload. No bug here UNLESS the effect somehow doesn't fire. | 🟡 Code-verified clean. Not the cause. |
| **G** | **Empty `mapServiceRows` mapping** — if the backend returns `result: null` or `result: []`, the mapper [CODE] `models/models.ts:319` returns `[]` and the table shows empty-state. That's correct — the data is just absent. Could be misinterpreted as "table didn't load." | 🟢 Code-verified. Empty state IS expected when backend has nothing to ship; not a bug. |

## 6.1 Summary

The "data sometimes missing until refresh" is most likely **Hypothesis A** (silent GET failure with no in-pane error banner + transient toast that auto-dismisses). The fix is a single conditional banner — see `FIX-PLAN.md` §P1-2.

Secondary contributor: the **skeleton not firing on initial/node-switch** (§5) means the user sees an empty body during the in-flight window. Even if the GET later succeeds, perception is "table didn't load" because there's no skeleton during the GET — the body is just blank for ~200-1000ms. Fix in §P0-1.

# 7. Confidence Ledger

| Claim | Verification | Note |
|---|---|---|
| `<app-service-pricing>` is the consolidated wrapper | 🟢 code-verified | [CODE] `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts:74` |
| 4 admin tabs consume the shared wrapper | 🟢 code-verified | [CODE] org-hierarchy-page-menu.component.html:357,360 + marketplace-applications.component.html:34 + comm-channels-services.component.html:34 |
| Mgmt tabs do NOT consume the shared wrapper | 🟢 code-verified | View-only inline tables — confirmed by Read of both mgmt files |
| Every OLD mutation endpoint is hit by NEW | 🟢 code-verified | URLs + payload keys cross-checked via `git show origin/main:…` |
| OLD comm-channels list = `/comm-channels`; NEW = `/comm-channels/visible/details` | 🟢 code-verified | OLD: `comm-channels-services.service.ts:34`; NEW: `commerce-gateway.service.ts:61` |
| `commerce/node` (OLD) vs `commerce/Node` (NEW) — backend tolerance | 🔴 needs runtime check | YARP route is path-as-given; ASP.NET routing is case-INsensitive by default but each gateway should be checked |
| SignalR has NO write path to validity/visibility rows | 🟢 code-verified | Only `order-status-realtime.service.ts` + `do-payment-priority-popup` — neither writes `rows` directly |
| `[loading]` bound only to `submitting()`, NOT to `state.loading`/`mode==='loading'` | 🟢 code-verified | [CODE] `service-pricing.component.html:8` + `service-pricing.component.ts:109-111` |
| `loadError` captured by slice but never displayed | 🟢 code-verified | Grep for `loadError` in `apps/host-shell/src/app/shared-components/service-pricing/` only matches slice |
| Visibility-error rollback present in OLD, MISSING in NEW | 🟢 code-verified | OLD: `apps-services-tab.component.ts:316`; NEW: `service-pricing.component.ts:212` only releases `submitting` |
| Validations fire BEFORE emit (no API call when invalid) | 🟢 code-verified | `service-pricing-table.component.ts:552-586` |
| Defaults seeded to VALID effective dates (periodic-aware) | 🟢 code-verified | `validations.ts:133-173` |
| Date-picker `disabledDates` prevents invalid picks at picker-time | 🟢 code-verified | `validations.ts:204-254` |
| Skeleton fires on mutation (post rev-2) | 🟡 inferred | Code path verified; runtime confirmation pending |
| Skeleton does NOT fire on initial mount | 🟢 code-verified | `submitting` default `false`; `load()` never touches it |
| H3 optimistic patch executes AFTER PUT response (not from SignalR) | 🟢 code-verified | `service-pricing.component.ts:194` reached inside `next:` callback of HTTP subscription |
| Do-payment popup uses SignalR for ORDER STATUS only, not validity | 🟢 code-verified | `order-status-realtime.service.ts` + popup |
| Toast doctrine (single notifier surface per mutation) | 🟢 code-verified | `onMutationError` deliberately silent (global errorRules owns the toast) — matches [MEMORY] `project_double_toast_root_cause_and_z_index_fix_2026_05_20` |

# 8. Halt-and-flag Items (ambiguity ≥ 7)

| # | Ambiguity | Why I'm not guessing |
|---|---|---|
| HF-1 | `commerce/node` (lowercase) vs `commerce/Node` (capital N) — does ANY environment's YARP/ASP.NET pipeline reject case-mismatch? | This is a backend-platform fork. The FE switches case unilaterally between branches; if even one gateway rejects, every mutation 404s. Should be verified by hitting both casings against a live dev gateway. |
| HF-2 | NEW comm-channel list switched from `/comm-channels` to `/comm-channels/visible/details` — does the user / product expect the comm-channels tab to ONLY show "visible" comm-channels, or ALL? | The path-name implies "visible only." OLD endpoint returned the full list. If product wants ALL (incl. hidden), the new endpoint is wrong. If product wants only visible (with detail), it's correct. Need confirmation. |
| HF-3 | Should a failed visibility toggle visibly revert the switch (OLD behaviour) or stay flipped + show error banner (NEW de-facto behaviour)? | Both are defensible UX choices; OLD was explicit revert; NEW is implicit "next reload will sync." The user may have a preference. |
| HF-4 | Should `loadError` produce a top-level banner (preserving the table's empty state below it) OR replace the empty-state body? | Both shippable; the mgmt-console pattern at [CODE] `apps-services-tab.component.html:19-32` uses a TOP banner ABOVE the table. Host-shell wrapper doesn't even have a banner slot. |

These four items are written into `FIX-PLAN.md` as open questions for the user before any fix lands.
