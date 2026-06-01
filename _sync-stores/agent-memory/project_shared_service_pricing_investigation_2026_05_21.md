---
name: shared-service-pricing-investigation-2026-05-21
description: "Investigation-only audit of the new <app-service-pricing> shared wrapper (polishing-v0.4 Wave 2) against origin/main per-tab implementations — falsifies user's SignalR fear, locates two real P0 bugs."
metadata: 
  node_type: memory
  type: project
  originSessionId: b7a7ca8a-2fa6-43bf-b879-505e93ba2d72
---

🟢 INVESTIGATION COMPLETE 2026-05-21 (no code changed). User flagged: (a) shared raw service across Communication + Application tabs may be hitting different APIs than origin/main, (b) "is valid"/"is visible" toggles may be SignalR-only without waiting for REST, (c) skeleton may not fire on visibility toggle, (d) table sometimes renders empty until page refresh. Investigation produced TWO reports:

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\_investigations\2026-05-21-shared-service-pricing\GAP-REPORT.md` (38 KB)
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\_investigations\2026-05-21-shared-service-pricing\FIX-PLAN.md` (13 KB)

**The Shared Raw Service** = `<app-service-pricing>` at `apps/host-shell/src/app/shared-components/service-pricing/` (Wave 2 consolidation 2026-05-19), `kind`-parameterised (`'application'` | `'comm-channel'`), driven by `ServicePricingStateSlice` + `CommerceGatewayService` + `<falcon-service-pricing-table>` (presentation lib). Consumed by admin-console `comm-channels-services` route + mgmt-console org-hierarchy `apps-services-tab` + `comm-channels-tab`. On `origin/main` the equivalent files are 4 separate per-tab components — never consolidated.

**Key finding 1 — SignalR fear FALSIFIED**: `grep -r "SignalR|HubConnection|@microsoft/signalr"` hits only `apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts` + the do-payment popup. The service-pricing slice has ZERO SignalR write-path. Every visibility/enable/disable/price-edit toggle is REST-only: `PUT/POST commerce/Node/{kind}/...` → success → `state.reload()` GET. All 17 OLD endpoints from `git show origin/main:apps/admin-console/.../service/commerce-gateway.service.ts` are hit identically by new gateway with identical payload keys (`accountId + applicationId` / `accountId + commChannelId`).

**Key finding 2 — Skeleton never fires on initial GET or node-switch (P0 / root cause of "empty table needs refresh")**: Wrapper binds `[loading]="submitting()"` (mutation gate only) — slice's `mode === 'loading'` is never surfaced. Slice's `submitting` defaults `false`, `load()` never flips it. Violates the rule in [[data-table-skeleton-initial-loading-default-fix]] memory. ONE-LINE FIX at [CODE] `service-pricing.component.ts:109-111`: OR `state.mode() === 'loading'` into the `submitting` computed.

**Key finding 3 — `loadError` is dead-coded (P0 / secondary cause of "data missing")**: Slice writes `loadError.set('hierarchy.appsServices.loadError')` on GET failure at [CODE] `service-pricing-state.slice.ts:80-84` but no template renders it. After global error toast auto-dismisses, user sees empty table with no inline explanation and no retry button. Fix: mgmt-console-style inline banner + `Retry` button in `service-pricing.component.html`.

**Other findings**: P1 — visibility-toggle error path lost OLD's optimistic-rollback (`row.visibility = !nextVisibility`) at [CODE] `git show origin/main:apps/admin-console/.../apps-services-tab/apps-services-tab.component.ts:316`. P2 — `commerce/node` vs `commerce/Node` casing inconsistency (HF-1, backend tolerance unknown). HF-2 — new comm-channels list URL `…/comm-channels/visible/details` differs from OLD `…/comm-channels`; intentional for shadow-row UI but needs product confirmation.

**4 halt-and-flag questions resolved by user**:
1. HF-1 → Keep `commerce/Node` (capital N) everywhere (will backend-verify mutation casing tolerance).
2. HF-2 → Keep new `…/comm-channels/visible/details` (intentional for shadow-row scheduled-changes UI).
3. HF-3 → Revert switch + reload table (origin/main parity) on visibility-PUT failure.
4. HF-4 → NO in-pane banner. Top-right toast already owned by HTTP interceptor + `FalconHttpUiDispatcher` — verified `list()` call uses `useGateway()` only (no `notShowToaster:'true'`) → interceptor fires ONE toast. Slice's `error:` branch sets `loadError` signal + `mode='error'` but never calls a notifier → no second emission. Confirmed correct single-emission per [[double-toast-root-cause-z-index-2000-1000-fix]]. `loadError` signal kept as internal state (harmless), no template changes.

**Fixes applied 2026-05-21 (build hash `9994b7fc3e4ef5ef`, 11.9s)** — two surgical edits to `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`:

- **P0-1** at the `submitting` computed (was lines 109-111) — OR'd `this.state.mode() === 'loading'` into the existing `this.state.submitting() || this.doPaymentInFlight()` chain. Skeleton now fires on first GET + every node-switch (was only firing on mutations). Slice flips `mode` back to `view`/`error` in load()'s `next:`/`error:` branches at [CODE] `service-pricing-state.slice.ts:76,85` so skeleton terminates deterministically.

- **P1-2** — new private `onVisibilityError()` method that clears `submitting` + calls `state.reload()`; visibility-toggle's PUT subscribe `error:` handler flipped from `onMutationError()` to `onVisibilityError()`. Enable/disable/price-edit handlers KEPT on `onMutationError()` (no optimistic-UI artifact to roll back — those are kebab-triggered, not local form state). Switch reverts to server truth via the GET response within one round-trip; global error toast still fires from interceptor (no double-toast).

P2-1 (`commerce/Node` casing audit) and P2-2 (URL change doc) dropped — user picked recommended options.

Rules cemented:
1. Any new shared host-shell wrapper that auto-loads on mount MUST surface `state.mode()==='loading'` into its presentation child's `[loading]` binding — `submitting`-only is insufficient (only covers mutations, leaves initial GET + node-switch with no skeleton).
2. Visibility/enable/disable/price PUT failures on slice-backed shared tables that own optimistic-UI state should call `state.reload()` on error — the GET response is the SoT; the interceptor still owns the user-facing toast.
3. Slices feeding shared host-shell wrappers must NOT call a notifier in their `error:` branch when the gateway request uses `useGateway()` without `notShowToaster:'true'` — interceptor already fires the toast; duplicate emission = double-toast.

Build green only — NOT yet runtime-verified in browser. User needs to click through admin-console org-hierarchy CommChannels + Apps tabs to confirm: (a) skeleton appears on first landing + node-switch, (b) PUT /visibility 5xx reverts the switch within ~200ms via the reload GET.
