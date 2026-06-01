---
name: double-toast-root-cause-z-index-2000-1000-fix
description: "2026-05-20 RCA + 5-edit fix for double toasts on Add Node / Edit Node / Service Pricing, plus toast=2000 / drawer=1000 z-index alignment."
metadata: 
  node_type: memory
  type: project
  originSessionId: d984a1c8-f7f1-4fde-bbde-21649db72e4b
---

🟢 BUILD-GREEN (tsc clean on my 6 files) 2026-05-20. `nx build falcon-theme` PASS. `nx build falcon-ui-core` PASS 45.06s. Full `nx build admin-console` / `host-shell` blocked on a pre-existing `falcon-studio:build` failure (dirty `libs/falcon-studio/src/index.ts` + `libs/falcon-ui-core/.../falcon-data-table.component.ts` — NOT mine).

## Root causes (3)

All three notifier surfaces — `FalconToastService`, `HostNotifierFacade` (FALCON_NOTIFIER token, [CODE] `apps/host-shell/falcon-facades/host-notifier.facade.ts:12-16`), and `FalconHttpUiDispatcherService.renderSuccess/dispatchError` — push to the SAME `FalconNotificationService` queue feeding ONE `<falcon-angular-notification-stack>` host. Two writes = two toasts in one stack.

1. **Add Node / Edit Node (admin-console)** — TWO double-fire paths, one fixed per rev:
   - **Success path** (rev 1): [CODE] `apps/admin-console/.../services.ts:262-265,297-300` attached `withMessagesOn(..., { success: FalconToastMessage.success(...) })` to `createSubNode` POST + `changeNodeName` PUT → ResponseInterceptor fires TOAST #1 via `dispatcher.renderSuccess()`. [CODE] `apps/admin-console/.../node-drawer-state.signals.ts:123` ALSO fires `this.notifier?.success(...)` → TOAST #2.
   - **Failure path** (rev 2, 2026-05-20 follow-up): rev-1 fix dropped `withMessagesOn` but kept `useGateway(...)` alone — NO `notShowToaster: 'true'`. So on 4xx/5xx OR 200+`isSuccessful:false`, [CODE] `response-interceptor.ts` fires `dispatcher.dispatchError(err, request)` or `dispatchApplicationError(detail, request)` → TOAST #1 (global errorRules). Service-level `catchError((err) => of(httpFailure(err)))` then funnels the error into `next(SOR{isSuccessful:false})`, and [CODE] `node-drawer-state.signals.ts:115-121` `!res.isSuccessful` branch fires `this.notifier?.error(message)` → TOAST #2. Same queue.

2. **Service Pricing (apps + comm-channels tabs)** — on network failure: [CODE] `apps/host-shell/.../service-pricing.component.ts:209-212` `onMutationError()` fires `this.toast.error(...)` → TOAST #1. The CommerceGatewayService mutations attach NO `notShowToaster: 'true'`, so the global `errorRules` in [CODE] `apps/host-shell/src/app/core/http-ui/falcon-http-ui.config.ts` ALSO fires → TOAST #2.

3. **`<falcon-angular-message-host>` is dead-mounted** — [CODE] `apps/host-shell/src/app/app.ts:28` still mounts the legacy host, but a workspace-wide grep proves NOTHING calls `FalconMessageService.add()` anymore. Not a double-fire path today, but tech-debt to remove.

## Add Client / Add User clarification
The "two statuses" user perceived is the centered **`<falcon-angular-completion-success-dialog>`** PLUS the top-right `toast.success(...)` from the wizard signal slice — not two top-right toasts. User direction (2026-05-20): **keep the centered dialog only** (it already says "Completed successfully" + "Credentials sent to the user"). The top-right success toast is dropped. Error path unchanged — finalization component still fires a 5s red error toast on submit failure.

### Follow-up edits (2 files, +12 / -16)
| File | Change |
|---|---|
| [CODE] `apps/admin-console/.../add-client-wizard.signals.ts:258-275` | Removed `this.toast.success(...)` block in `createClientSubmit$` map. Dropped now-unused `FalconToastService` + `TranslateService` imports + injections. |
| [CODE] `apps/admin-console/.../add-user-state.signals.ts:101-135` | Removed `this.toast.success(...)` block in `createUserSubmit$` map. Dropped now-unused `FalconToastService` + `TranslateService` imports + injections. |

`tsc --noEmit -p apps/admin-console/tsconfig.app.json` PASS after the cleanup.

## 5-edit fix delta (6 files, +31 / -26)

| # | File | Change |
|---|---|---|
| 1 | [CODE] `apps/admin-console/.../services.ts:255-313` | **rev 1**: `withMessagesOn({success:...})` → plain `useGateway(...)` on `createSubNode` + `changeNodeName`. Dropped `FalconToastMessage`/`withMessagesOn` imports. (Fixed success-path double.) **rev 2 (failure-path fix)**: added `{ headers: { notShowToaster: 'true' }, context: useGateway(Gateway.SystemGateway).context }` to BOTH calls. Silences the interceptor's `dispatchError` + `dispatchApplicationError` so the slice's `notifier?.error(...)` stays single on failure too. Mirrors `createClientFull` + `createUser`. |
| 1b | [CODE] `apps/management-console/.../services.ts:78-121` | **rev 2 mgmt-console mirror**: mgmt has its OWN `HierarchyService` with `createSubNode` + `changeNodeName`. User runtime-tested 2026-05-20 and STILL saw 2 toasts on failure because admin-only rev 2 didn't reach this file. Added `headers: { notShowToaster: 'true' }` to both calls. Mgmt slice (`apps/management-console/.../node-drawer-state.signals.ts`) has 4 `notifier?.error?.(...)` sites — lines 116/126/156/170 — across Add + Edit success/error paths, more than admin's 2. Now slice owns ALL toast UX for mgmt Node mutations too. |
| 2 | [CODE] `apps/host-shell/.../service-pricing.component.ts:209-217` | `onMutationError()` no longer calls `this.toast.error(...)` — just releases the in-flight gate. Global `errorRules` in `falcon-http-ui.config.ts` owns the toast (matches doctrine in `apps-services.service.ts` header). |
| 3 | [CODE] `libs/falcon-ui-core/.../falcon-notification-stack.component.ts:falconNotificationStackContainerClasses` | `z-40` → `z-[2000]`. Canonical top-right stack now sits above drawer (1000) AND dialog (1200). |
| 4 | [CODE] `apps/host-shell/tests/falcon-notification-stack-position.spec.ts:44-52` | Test expectation updated `z-40` → `z-[2000]`. |
| 5 | [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:426` | `--z-falcon-drawer-modal: 99999` → `1000`. Mgmt-console drawer already consumed the token, so the change applies there for free. |
| 6 | [CODE] `apps/admin-console/.../falcon-org-node-drawer.component.html:6` | Hard-coded `z-[99999]` → `z-falcon-drawer-modal` (consumes the token). |

## Z-index ladder after fix
| Surface | Z | Source |
|---|---|---|
| Notification stack (top-right toast) | **2000** | `falcon-notification-stack.component.ts` |
| Dialog (`<falcon-angular-dialog>`) | 1200 | overlay.tokens.css (unchanged) |
| Drawer (org-node) | **1000** | `--z-falcon-drawer-modal` token (was 99999) |
| `--z-falcon-modal` legacy | 1050 | falcon-tailwind-tokens.css (unchanged) |
| `--falcon-toast-host-z-index` (legacy host) | 1300 | toast.tokens.css (unchanged, dead host) |

## Verification status
- ✅ `nx build falcon-theme` — pass (drawer token consumed).
- ✅ `nx build falcon-ui-core` — pass 45.06s (notification stack edit).
- ✅ `tsc --noEmit` on admin-console + host-shell + falcon-ui-core — zero errors.
- ❌ Full `nx build admin-console` / `host-shell` — blocked on PRE-EXISTING `falcon-studio:build` (`FALCON_DATA_TABLE_SKELETON_DEFAULTS` / `FalconDataTableSkeletonConfig` missing export reach — see dirty `libs/falcon-studio/src/index.ts` + `falcon-data-table.component.ts`, both untouched by this work).
- ⏳ Runtime-verify pending: cannot smoke-test in this session (no preview server reachable). User to manually verify Add Node / Edit Node fires ONE toast, drawer no longer covers top-right toasts.

**Why:** user explicitly reported "double toast on every action" + asked toast=2000 / drawer=1000.
**How to apply:** any new mutation handler must pick ONE notifier surface: either attach per-call `withMessages` (interceptor SoT) OR fire `notifier`/`toast` in the slice (slice SoT) — never both. New raw-Tailwind drawers must consume `z-falcon-drawer-modal`, never hard-code `z-[99999]`.
**Trigger to revisit:** [[falcon ui core layout traps]] · `double toast` · `z-index ladder` · `add node toast` · `edit node toast` · `service pricing error toast` · `notifier facade` · `withMessagesOn`.
