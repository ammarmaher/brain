# falcon-wizard-finalization — API

## Selectors

- Angular: `falcon-angular-wizard-finalization` `[CODE]` falcon-wizard-finalization.component.ts:97
- Stencil Shadow / Light: **none** (Angular-only composite).

## Import

```ts
import { FalconAngularWizardFinalizationComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-wizard-finalization';
// or via the barrel:
import { FalconAngularWizardFinalizationComponent } from '@falcon/ui-core';
```

Add `FalconAngularWizardFinalizationComponent` to the consuming standalone component's `imports: []`. The two child dialogs are imported internally (`[CODE]` ts:98-101), so the host does NOT import them separately.

## Inputs (signal `input()` — NOT `@Input` decorators)

`[CODE]` falcon-wizard-finalization.component.ts:107-150 — all inputs are signal `input()` (read as `name()` in the template).

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | `[CODE]` ts:108 — opens the channel-selection popup. The picker's actual visibility is the `pickerOpen` computed (`open && !submitting && !successOpen`), so it closes the instant Send is clicked. |
| `ownerName` | `string` | `''` | `[CODE]` ts:111 — owner summary, passed through to the channel dialog. |
| `ownerPhone` | `string` | `''` | `[CODE]` ts:112. |
| `ownerEmail` | `string` | `''` | `[CODE]` ts:113. |
| `defaultDelivery` | `FalconCredentialDeliveryMethod` (`'email'\|'sms'\|'both'`) | `'email'` | `[CODE]` ts:116 — initial selected delivery method in the channel dialog. |
| `submitFn` | `(method: FalconCredentialDeliveryMethod) => Observable<unknown>` | **REQUIRED** (`input.required()`) | `[CODE]` ts:120-121 — host-supplied API call. API code stays in the host app; this component only invokes it. **The single load-bearing input.** |
| `successTitle` | `string` | `'Completed successfully'` | `[CODE]` ts:127 — forwarded to the inline completion-success dialog. |
| `successSubtitle` | `string` | `'Credentials sent to the user'` | `[CODE]` ts:128. |
| `autoDismissMs` | `number` | `10_000` | `[CODE]` ts:129 — forwarded to the success dialog; `0` disables auto-dismiss (dialog stays until ×/outside/Escape). |
| `errorToastTitle` | `string` | `'Something went wrong'` | `[CODE]` ts:132 — submit-error toast title. |
| `errorToastBody` | `string` | `'We could not complete the request. Please try again.'` | `[CODE]` ts:133-135 — fallback toast body (used when the thrown error has no clean message — see BUG-14). |
| `channelTitle` | `string` | `'Sending Credentials'` | `[CODE]` ts:138 — channel-dialog label passthrough (i18n). |
| `channelSubtitle` | `string` | (long default) | `[CODE]` ts:139-141. |
| `deliveryLabel` | `string` | `'Delivery method:'` | `[CODE]` ts:142. |
| `ownerKeyLabel` | `string` | `'Account owner'` | `[CODE]` ts:143. |
| `phoneKeyLabel` | `string` | `'Phone Number'` | `[CODE]` ts:144. |
| `emailKeyLabel` | `string` | `'Email'` | `[CODE]` ts:145. |
| `sendLabel` | `string` | `'Send Credentials'` | `[CODE]` ts:146. |
| `cancelLabel` | `string` | `'Cancel'` | `[CODE]` ts:147. |
| `emailMethodLabel` | `string` | `'Send via Email'` | `[CODE]` ts:148. |
| `smsMethodLabel` | `string` | `'Send via SMS'` | `[CODE]` ts:149. |
| `bothMethodLabel` | `string` | `'Both, SMS and Email'` | `[CODE]` ts:150. |

## Outputs (signal `output()`)

| Name | Payload | Notes |
|---|---|---|
| `finalized` | `void` | `[CODE]` ts:153 — emitted when the success dialog is dismissed (`onSuccessClosed`, ts:254-257). This is the "flow complete, close everything" signal the host listens to. |
| `cancelled` | `void` | `[CODE]` ts:154 — emitted when the operator cancels the channel picker (`onCancel`, ts:237-239). The host closes the popup. |

> There is **no `submitting` / `success` / `error` output** — those are internal `signal`s. The host learns success via `finalized` and (for errors) sees the orchestrator toast; the host's `submitFn` Observable is the place to observe the raw HTTP result if needed.

## TypeScript types

`[CODE]` Reuses `FalconCredentialDeliveryMethod = 'email' | 'sms' | 'both'` from the sending-credentials dialog (ts:85 import; falcon-sending-credentials-dialog.component.ts:34). The `submitFn` returns `Observable<unknown>`. `FalconLoaderDismiss` (the loader disposer) is imported from `@falcon/studio/runtime` (ts:94).

## CVA / ngModel / Reactive Forms

**NO.** This is not a form control — it owns no value and is not a `ControlValueAccessor`. It is an imperative orchestrator driven by the `open` input + `submitFn`.

## Signal compatibility

`[CODE]` Fully signals-first + modern Angular best practice: signal `input()`/`output()`, internal `signal`s (`submitting`, `successOpen`), `computed` (`pickerOpen`), `inject()`, `takeUntilDestroyed(this.destroyRef)`, `OnPush`. Zoneless-safe.

## Internal state (protected signals — not part of the public API, documented for behavior)

| Member | Type | Role |
|---|---|---|
| `submitting` | `signal<boolean>` | `[CODE]` ts:158 — true while `submitFn` is in flight; flips the picker closed + the loader on, reset in `finalize`. |
| `successOpen` | `signal<boolean>` | `[CODE]` ts:159 — drives the inline completion-success dialog. |
| `pickerOpen` | `computed<boolean>` | `[CODE]` ts:165-167 — `open() && !submitting() && !successOpen()`; the actual `[open]` of the channel dialog. |
| `loaderDismiss` | `FalconLoaderDismiss \| null` | `[CODE]` ts:176 — disposer for the in-flight loader slice; dismissed BEFORE the next UI mounts. |

## Methods / template handlers (protected)

| Member | Description |
|---|---|
| `onSend(method)` | `[CODE]` ts:196-225 — the channel-dialog Send handler. Guards re-entry (`if submitting return`), flips `submitting`, shows the loader, invokes `submitFn()(method)` through the **minimum-loader-visibility gate** (`concatMap`/`catchError(switchMap)` on a `timer`), then on next → dismiss loader + show success ack; on error → dismiss loader + business-error toast. `finalize` resets `submitting`. |
| `onCancel()` | `[CODE]` ts:237-239 — emits `cancelled`. |
| `onSuccessClosed()` | `[CODE]` ts:254-257 — sets `successOpen=false` + emits `finalized`. |
| `ngOnDestroy()` | `[CODE]` ts:307-309 — safety net: dismisses the loader if the host unmounts mid-flight (prevents the counter-based overlay leaking a slot). |

> `private minLoaderGate$(startedAt)` (ts:230-234): emits after the remaining `MIN_LOADER_VISIBLE_MS` (600 ms) or synchronously (`of(void 0)`) if the loader has already been visible long enough — so the loader is always perceivable, with no artificial delay on slow backends. `private errorMessageFrom(err)` (ts:283-293): extracts a clean user-facing message from a thrown `Error`/string, returning `''` for empty / whitespace / bracket-prefixed sentinels so the static `errorToastBody` is used (BUG-14).

## Slots / template inputs

`[CODE]` **No `<slot>` / `<ng-content>` / `ng-template` inputs.** The template (54 ln) mounts exactly two child dialogs with prop bindings; there is no content projection. `:host { display: contents; }` so the orchestrator adds no box to the layout.

## Constraints

- `[CODE]` **`submitFn` is required** (`input.required()`) — the component throws at construction if a consumer forgets it.
- `[CODE]` **The success ack is INLINE** (`<falcon-angular-completion-success-dialog>`), NOT the orchestrator modal — this is the deliberate 2026-05-24 partial-revert (the orchestrator route rendered the wrong small red OK/Cancel alert). Do not "simplify" it back through the orchestrator.
- `[CODE]` **The submit error IS the orchestrator** (`business-error`, 5s top-right toast) — that path is correct and intentional.
- `[CODE]` **Loader is dismissed BEFORE the next UI mounts** — `dismissLoader()` is called in both next and error branches before `showCompletionAck()` / `showSubmitErrorToast()`, so the success dialog never stacks on top of the loader.
- `[CODE]` **Minimum-visibility gate (600 ms)** — a sub-frame backend response would otherwise flash the loader; the gate makes it perceivable in every path. Do not remove it.

## Accessibility

- The orchestrator itself renders no visible UI (`display: contents`) — a11y is delegated to the two composed dialogs (each owns its own focus trap / `role="dialog"` / Escape handling).
- `[CODE]` The channel picker's Send is disabled while `submitting` (`[disableSend]="submitting()"`, html:31) so a double-submit cannot fire.
- `[CODE]` The success dialog dismisses on auto-timeout / × / backdrop / panel click / Escape (per the file header) → all routed to `onSuccessClosed` → `finalized`.
- `[INFERRED]` Focus management on the picker→loader→success transition relies on the child dialogs + the central loader overlay; not re-verified at runtime this pass.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) against falcon-wizard-finalization.component.ts (311 ln) + .component.html (54 ln). All inputs (22 incl. required `submitFn`), 2 outputs (`finalized`/`cancelled`), the `pickerOpen` computed gate, the rxjs minimum-visibility gate, and BUG-14 message extraction confirmed in source. No CVA, no slots, no Stencil twin. Child-dialog `FalconCredentialDeliveryMethod` type cross-read from falcon-sending-credentials-dialog.component.ts:34.
