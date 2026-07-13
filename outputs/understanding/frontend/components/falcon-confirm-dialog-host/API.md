# falcon-confirm-dialog-host — API

> This unit has TWO public surfaces: (1) the injectable **`FalconConfirmService`** (the thing consumers actually call) and (2) the **host component** (a no-input projection element mounted once). Most of the API is the service.

## Selectors / symbols

- Angular host: `falcon-angular-confirm-dialog-host` (component `FalconAngularConfirmDialogHostComponent`).
- Service: `FalconConfirmService` (`@Injectable({ providedIn: 'root' })`).
- Types: `FalconConfirmRequest`, `FalconConfirmSeverity`.

## Import

```ts
import {
  FalconAngularConfirmDialogHostComponent,
  FalconConfirmService,
  type FalconConfirmRequest,
  type FalconConfirmSeverity,
} from '@falcon/ui-core/angular';
```

`[CODE]` index.ts:3-8 — the barrel re-exports all four. Mount the host once (`app.ts`); inject the service anywhere.

## Service API — `FalconConfirmService`

`[CODE]` falcon-confirm.service.ts:43-128.

| Member | Signature | Notes |
|---|---|---|
| `confirm` | `confirm(request: FalconConfirmRequest): Observable<boolean>` | **The primary API.** Returns a **cold** Observable that emits exactly once and completes: `true` = confirmed, `false` = cancel / backdrop / Esc / replaced-by-a-newer-confirm / unsubscribed-before-pick. `[CODE]` :65-116. |
| `accept` | `accept(): void` | Courtesy shim — resolves the active in-flight confirm as `true`. `[CODE]` :122-124. In Phase 5 the orchestrator's modal-adapter drives accept/cancel, so external callers rarely need this. |
| `reject` | `reject(): void` | Courtesy shim — resolves the active in-flight confirm as `false`. `[CODE]` :126-128. |
| `active` | `Signal<FalconConfirmRequest \| null>` (readonly `computed`) | **Legacy.** Always `null` in Phase 5 (orchestrator owns the modal). Kept so the host component compiles. `[CODE]` :59-60. |

### `confirm()` behavior (verified)

- **Cold + single-shot:** each subscribe runs the producer once; emits once; completes (`[CODE]` :86-87).
- **Sequential:** a new `confirm()` while one is in flight resolves the previous one as `false` FIRST, then takes over (`[CODE]` :67-72).
- **Routing:** internally calls `orchestrator.show({ category: 'action-required', title, message: body ?? '', source: 'falcon-confirm-service', actionLabel: confirmLabel ?? 'Confirm', actionCallback: () => resolve(true), cancelCallback: () => resolve(false), hideCancel, correlationId })` (`[CODE]` :91-105).
- **Teardown:** unsubscribing before the user picks → `orchestrator.dismissByCorrelationId(correlationId)` + resolve `false` (`[CODE]` :109-114).
- **`correlationId`:** stable per call, format `` `falcon-confirm|{base36-now}|{base36-rand}` `` (`[CODE]` :74).

## `FalconConfirmRequest` (all fields readonly)

`[CODE]` falcon-confirm.service.ts:30-41:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | ✅ | Modal title. |
| `body` | `string` | — | Modal message (forwarded as orchestrator `message`; defaults to `''`). |
| `confirmLabel` | `string` | — | Confirm-button text (orchestrator `actionLabel`; defaults to `'Confirm'`). |
| `cancelLabel` | `string` | — | Cancel-button text. **Phase-5 note:** read by the legacy host template; the orchestrator/popup path does not consume it (the popup uses its own variant default). |
| `severity` | `FalconConfirmSeverity` (`'info' \| 'warning' \| 'danger'`) | — | **Phase-5 note:** ignored by the orchestrator's modal-adapter (it always renders `variant="error"` for `action-required`). Kept on the shape for API compatibility (`[CODE]` :23-28). |
| `icon` | `string` | — | Read by the legacy host template only. |
| `closeOnBackdrop` | `boolean` | — | Read by the legacy host template only (default `true`). |
| `closeOnEsc` | `boolean` | — | Read by the legacy host template only (default `true`). |
| `hideCancel` | `boolean` | — | **Live + honored.** Forwarded to `orchestrator.show({ hideCancel })` → the modal-adapter renders a single confirm button; ×/ESC/backdrop still resolve `false` (`[CODE]` :99-104). |
| `hideConfirm` | `boolean` | — | Read by the legacy host template only. |

> `[CODE]` In Phase 5, only `title`, `body`, `confirmLabel`, and `hideCancel` reach the rendered popup. `severity` / `icon` / `cancelLabel` / `closeOnBackdrop` / `closeOnEsc` / `hideConfirm` are accepted but inert (legacy-host-only). This is a documented compatibility shim, not a bug.

## Host component API — `FalconAngularConfirmDialogHostComponent`

`[CODE]` falcon-confirm-dialog-host.component.ts:33-71.

| Member | Kind | Notes |
|---|---|---|
| selector | — | `falcon-angular-confirm-dialog-host`. |
| `@HostBinding('class.falcon-angular-confirm-dialog-host')` | host class | `[CODE]` :41. |
| inputs / outputs | — | **NONE.** Pure projection of the service. No `@Input`/`@Output`. |
| `active` (protected) | `Signal` | Bound from `service.active` (`[CODE]` :45) — always null in Phase 5. |
| `defaultConfirmLabel` / `defaultCancelLabel` (protected) | `computed<string>` | Literal `'Confirm'` / `'Cancel'` fallbacks (`[CODE]` :54-55) — matches the alert-dialog wrapper's own defaults. |
| `severityFor(req)` (protected) | method | Maps `FalconConfirmSeverity` → `FalconAlertDialogSeverity` (identity for warning/danger; default `'warning'`) (`[CODE]` :59-62). Only used by the dead template. |
| `onAccept()` / `onReject()` (protected) | methods | Call `service.accept()` / `service.reject()` (`[CODE]` :64-70). Wired to the alert-dialog's `(falconConfirm)` / `(falconCancel)` in the legacy template — unreachable in Phase 5. |
| change detection | — | `ChangeDetectionStrategy.OnPush`, `schemas: [CUSTOM_ELEMENTS_SCHEMA]`, `imports: [FalconAngularAlertDialogComponent]` (`[CODE]` :35-38). |

## TypeScript types

```ts
type FalconConfirmSeverity = 'info' | 'warning' | 'danger';  // falcon-confirm.service.ts:28

interface FalconConfirmRequest {                              // :30-41
  readonly title: string;
  readonly body?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly severity?: FalconConfirmSeverity;
  readonly icon?: string;
  readonly closeOnBackdrop?: boolean;
  readonly closeOnEsc?: boolean;
  readonly hideCancel?: boolean;
  readonly hideConfirm?: boolean;
}
```

## Confirm-result contract (promise/observable)

`[CODE]` The result is an **`Observable<boolean>`** (NOT a Promise) emitting once then completing:

| Outcome | Emits | Trigger |
|---|---|---|
| Confirmed | `true` | user clicks the confirm button → `actionCallback` → `resolve(true)` (`[CODE]` :97). |
| Cancelled | `false` | user clicks cancel / × / ESC / backdrop → `cancelCallback` → `resolve(false)` (`[CODE]` :98). |
| Superseded | `false` | a newer `confirm()` arrives while this one is open (`[CODE]` :67-72). |
| Torn down | `false` | subscriber unsubscribes before picking (`[CODE]` :109-114). |

Idempotent: a private `settled` guard ensures only the first resolution wins (`[CODE]` :77-88).

## CVA / ngModel / Reactive Forms

**N/A** — neither the host nor the service is a form control.

## Slots / template inputs

**None** — the host has no `<ng-content>`; it projects the service request into the modal. Consumers pass content via the `FalconConfirmRequest` fields, not slots.

## Accessibility

- The host itself renders no chrome; a11y belongs to the rendered substrate. In Phase 5 that is `<falcon-angular-popup>` (which wraps a native `<dialog falconOverlay="modal">` — Top Layer, focus-trapped). The legacy alert-dialog path (dead) carried `role="alertdialog"` for danger/warning.
- `[CODE]` Sequential single-modal semantics prevent stacked dialogs (`:67-72`) — good for screen-reader focus management.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Service API (`confirm`/`accept`/`reject`/`active`), `FalconConfirmRequest` field-by-field, the Observable<boolean> contract, and the host's no-input/projection shape all read from source. Phase-5 field-inertness (severity/icon/etc. accepted-but-unused by the popup) verified against falcon-modal-adapter.component.ts.
