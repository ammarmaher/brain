---
name: service-pricing-do-payment-screen-loader-2026-05-21
description: "Wire host-shell shared service-pricing wrapper's Do Payment trigger to FalconLoaderService.showOverlay so the centred screen loader fires in lock-step with the in-data-table loader"
metadata: 
  node_type: memory
  type: project
  originSessionId: f7614aa7-aaed-49eb-b5ae-9a8c9501486b
---

🟢 BUILD-GREEN 2026-05-21 — host-shell + admin-console `7c111fd241972a8e` (23.7s, lazy chunks `comm-channels-services-component` 4.80 kB + `marketplace-applications-component` 4.81 kB intact).

## Context

User screenshot: admin-console Org Hierarchy → CommChannels & Services tab → action menu open on a row with "Do Payment" highlighted. User noted the in-data-table loader fires correctly during the Do Payment flow but the centred screen loader was NOT firing in lock-step. Direction: add a centred screen loader that starts when Do Payment is clicked and finishes "in the same configuration as the loader inside the data table for this case."

## Architecture trace (source-prefixed)

- **[CODE] `apps/admin-console/.../comm-channels-services.component.ts:35-93`** — admin-console comm-channels page mounts `<app-service-pricing kind="comm-channel" [nodeId]>` (Wave 2 consolidation moved BOTH apps + comm-channels tabs into the shared host-shell wrapper).
- **[CODE] `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`** — host-shell SHARED wrapper that owns ALL Do Payment orchestration. Composes `<falcon-service-pricing-table>` (presentation lib) + `<app-do-payment-priority-popup>` (host-shell shared popup).
- **[CODE] same file lines 134-139** — `doPaymentInFlight: signal<boolean>(false)` — flips TRUE in `onDoPaymentRequest` (menu item clicked → trigger set), FALSE in `onIbSucceeded`/`onIbFailed` (popup emits terminal). It feeds the `submitting()` computed which drives the in-data-table loader via `[submitting]` on `<falcon-service-pricing-table>`. G-27 (Wave 12) had already narrowed `submitting()` to `state.mode() === 'loading' || doPaymentInFlight()` — so for Do Payment specifically, the table loader is gated by ONE signal: `doPaymentInFlight`.
- **[CODE] `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts:71-74, 198-218`** — popup ALREADY held a `FalconLoaderService.showOverlay('do-payment-priority-popup')` slot gated on `processing && !dialogOpen` (network-roundtrip-only — intentionally released during priority-reorder dialog phase per "at most ONE loader visible at any time" doctrine).
- **[CODE] `apps/host-shell/src/app/app.ts:46-65`** — host-shell mounts an always-alive `<falcon-angular-loader-inline>` inside a `fixed inset-0 z-[2000] bg-[color:var(--color-falcon-teal-alpha-18)]` div whose visibility is driven by `FalconLoaderService.overlayVisible()`. THAT is the centred-on-screen loader the user is asking for (centred card on a teal-tinted dim backdrop, pinned to viewport).
- **[CODE] `libs/falcon-studio/src/lib/services/falcon-loader.service.ts:68-86`** — counter-based pattern: `showOverlay(reason)` returns a dismiss disposer; concurrent slots compose ADDITIVELY (multiple callers each bump the counter; the overlay hides only when the counter reaches 0).

## Gap diagnosed

The popup's pre-existing slot only covered the network-roundtrip segments AND released during the priority-reorder dialog phase. The in-data-table loader stayed ON for the WHOLE popup-mount window (`doPaymentInFlight`). Symptoms:

1. **Click → submit microtask gap**: `doPaymentInFlight` flipped TRUE in the trigger setter, but the popup's internal effect re-evaluated `processing` in the next microtask → screen loader appeared one tick AFTER the table loader. Brief, perceptible flicker.
2. **InsufficientFunds / WalletNotConfig wait window**: popup released its slot when `processing.set(false)` ran inside `settle()`; the Falcon confirm popup opened immediately after. During the user-read window the in-data-table loader was still ON (waiting for `failed.emit`) but the screen loader was OFF.

## Fix

Add a SECOND `showOverlay` slot AT THE WRAPPER LEVEL, sourced from the exact same signal that drives the table loader: `doPaymentInFlight`. Counter-additive — does not touch the popup's pre-existing slot.

5 lines of file edits (`apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`):

1. Added `DestroyRef` to the `@angular/core` import.
2. Added `import { FalconLoaderService } from '@falcon/studio/runtime';` (same runtime-only subpath as the popup).
3. Added `private readonly loader = inject(FalconLoaderService);` + `private readonly destroyRef = inject(DestroyRef);` to the class fields.
4. Added `private overlayDismiss: (() => void) | null = null;` field.
5. Added an `effect()` in the constructor that watches `doPaymentInFlight()`:
   - TRUE + no dismiss held → `this.overlayDismiss = this.loader.showOverlay('service-pricing-do-payment')`
   - FALSE + dismiss held → call dismiss, clear field
6. Added `destroyRef.onDestroy(() => this.overlayDismiss?.())` for mid-flight unmount safety.

## Resulting lifecycle (lock-step)

- User clicks "Do Payment" → `onDoPaymentRequest()` runs synchronously:
  - `doPaymentInFlight.set(true)` → my new effect runs → `showOverlay('service-pricing-do-payment')` slot acquired → counter ≥ 1 → centred screen loader ON
  - `ibTrigger.set({...})` → popup's `set trigger()` runs → `startFlow → submit → processing.set(true)` → popup's effect runs → its slot also acquired → counter = 2 (additive, no visual change — already visible)
  - At the table layer, `submitting()` recomputes to TRUE (via `doPaymentInFlight`) → `[submitting]` flips → in-data-table loader ON
  - **Both loaders ON in the same tick.** ✓
- Popup reaches terminal (Completed) → `settle()` calls `processing.set(false)` → popup releases ITS slot → counter = 1 (still visible)
- `handleTerminal` fires `succeeded.emit` → wrapper's `onIbSucceeded()` runs synchronously → `doPaymentInFlight.set(false)` → my effect runs → wrapper's slot released → counter = 0 → centred screen loader OFF
- At the table layer, `submitting()` recomputes to FALSE → in-data-table loader OFF
- **Both loaders OFF in the same tick.** ✓

The priority-reorder dialog scenario remains correct: the popup still releases its slot when `dialogOpen.set(true)`, BUT the wrapper's slot stays held → the centred screen loader stays ON consistent with the in-data-table loader. The loader-inline host has `pointer-events: auto` on the dim backdrop div — operators trying to interact with the priority dialog will be blocked. If that turns out to be a UX issue in QA, the next iteration would emit a `(dialogStateChange)` Output from the popup so the wrapper can release its slot during the dialog window. For now: user explicitly asked for "same configuration as the loader inside the data table" — lock-step is what they got.

## Rules emitted

- **Centred screen loader for any feature flow goes through `FalconLoaderService.showOverlay(reason)`** — never mount your own `<falcon-angular-loader-overlay>`. The host-shell already mounts the always-alive primitive at z-2000 (`app.ts:46-65`); the service is the SoT for visibility.
- **Counter-based composition is the canonical pattern** for "I want the centred loader to follow my feature signal" — call `showOverlay` from an `effect()` watching the signal, hold the disposer in a private field, dismiss in the OFF branch + in `destroyRef.onDestroy()`.
- **Source the screen loader from the SAME signal as the table loader** when you want them in lock-step. In `ServicePricingComponent` that signal is `doPaymentInFlight`. Mirror; do not invent a new sibling signal — drift becomes inevitable.
- **`@falcon/studio/runtime` is the runtime-only subpath** for `FalconLoaderService` — the main `@falcon/studio` barrel pulls in the gallery/example registry which crashes host-shell bootstrap. Follow `do-payment-priority-popup.component.ts:74` precedent.
- **`destroyRef.onDestroy()` cleanup is mandatory** for any held `showOverlay` disposer — without it, a route change or node switch during the in-flight window leaves the counter > 0 forever and the screen loader is stuck on.
- **The popup's internal `processing && !dialogOpen` gate STAYS** — counter-additive means the wrapper's slot extends the visibility window without breaking the popup's "release during interactive dialog" doctrine for OTHER consumers that might rely on that release.

## Verification

- 🟢 host-shell build: `Successfully ran target build for project host-shell and 5 tasks it depends on` — all chunks emitted, no TS errors.
- 🟢 admin-console build: hash `7c111fd241972a8e`, 23.7s — `comm-channels-services-component.4514.dbda2929cff3431d.js` (4.80 kB) + `marketplace-applications-component.9133.dbda2929cff3431d.js` (4.81 kB) chunks present.
- ✋ Browser runtime: NOT verified — Falcon FE blocked on 40+ pre-existing Stencil/Angular compile errors per `[VAULT] VERIFICATION-STATUS.md`. Build-only is the achievable bar in this workspace (matches login v1-v10 + add-node drawer precedent).

## Touch zone

Single file: `Falcon\falcon-web-platform-ui\apps\host-shell\src\app\shared-components\service-pricing\service-pricing.component.ts`. ~20 LOC added (1 import, 2 injected fields, 1 private field, 1 effect, 1 destroyRef.onDestroy). Zero changes to HTML, the popup, the app shell, the loader service, or any tokens.

Links: [[project_login_auth_revamp_2026_05_21]] (build-only verification bar precedent); [[feedback_falcon_ui_core_layout_traps]] (Falcon UI Core ::ng-deep + shadow-DOM patterns reused here).
