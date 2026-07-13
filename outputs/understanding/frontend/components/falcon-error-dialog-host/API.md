# falcon-error-dialog-host — API

> Single-render Angular host. It has **no `@Input`s and no `@Output`s of its own** — it is driven entirely by the injected `ErrorDialogService` signal. The public "API" for consumers is the **service method `openError(...)`**, documented below. Rubric **B** (Stencil dual-render) + **E** (cross-framework) are **N/A**.

## Selectors

- Angular: `falcon-angular-error-dialog-host` `[CODE]` ts:35
- Host class: `.falcon-angular-error-dialog-host` `[CODE]` ts:42
- Stencil Shadow / Light: **N/A**

## Import

```ts
// the HOST (mount once in the app shell):
import { FalconAngularErrorDialogHostComponent } from '@falcon';

// the SERVICE (inject in feature code to OPEN the dialog):
import { ErrorDialogService, type ErrorDialogState } from '@falcon';
```

`[CODE]` Re-exported from `@falcon` via `libs/falcon/src/shared-ui/index.ts:410` (host) and `libs/falcon/src/shared-data-access/lib/services/index.ts:10` (service). Add `FalconAngularErrorDialogHostComponent` to the shell component's `imports: []` (already done in `app.ts:27`). The wrapper sets `CUSTOM_ELEMENTS_SCHEMA` internally `[CODE]` ts:39 — the host component does NOT need to.

## Inputs (on `FalconAngularErrorDialogHostComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| _(none)_ | — | — | `[CODE]` The host declares **zero `@Input`s**. All state comes from the injected `ErrorDialogService.state` signal. ts:44-47. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| _(none)_ | — | `[CODE]` The host declares **zero `@Output`s**. The only user action (OK / backdrop / Esc) calls the private `dismiss()` → `ErrorDialogService.dismiss()`. ts:95-97 + html:16-17. |

## Driving service API — `ErrorDialogService` (the real public surface)

`[CODE]` `libs/falcon/src/shared-data-access/lib/services/error-dialog.service.ts`, `@Injectable({ providedIn: 'root' })`.

| Member | Signature | Notes |
|---|---|---|
| `state` | `signal<ErrorDialogState \| null>` | Active dialog state, or `null` when closed. The host reads this. `[CODE]` service:24. |
| `openError(opts)` | `(opts: ErrorDialogState) => Promise<void>` | Opens the dialog. Returns a Promise that **resolves when `dismiss()` is called** — so callers can `await` user acknowledgement before continuing. `[CODE]` service:32-44. |
| `dismiss()` | `() => void` | Closes the dialog (`state.set(null)`) + resolves any pending `openError` Promise. `[CODE]` service:47-53. |

### `ErrorDialogState` (the `openError` payload)

```ts
export interface ErrorDialogState {
  readonly httpStatus: number;            // drives title selection + severity
  readonly errorMessages: readonly string[]; // pre-translated OR i18n-keyed; rendered as a bulleted <ul>
  readonly titleKey?: string;             // optional override for the i18n title key
}
```
`[CODE]` service:12-19.

### Service behavior contracts

- `[CODE]` **`401` is suppressed** — `openError({ httpStatus: 401 })` returns `Promise.resolve()` immediately and never sets state, because the global response interceptor owns re-auth/refresh. service:32-33.
- `[CODE]` **Single-instance, last-wins** — opening a new dialog while one is in flight resolves the prior `openError` Promise first, then takes over the state. service:36-40.
- `[CODE]` Callers use `void this.errorDialog.openError({...})` (fire-and-forget) at every observed call site (settings-tab + info-panel signals) — none currently `await` the acknowledgement.

## Host internal computed surface (template bindings — not public API)

`[CODE]` All `protected readonly` computeds derived from `state()`:

| Member | Type | Logic |
|---|---|---|
| `state` | `Signal<ErrorDialogState \| null>` | Aliases `errorDialog.state`. ts:47. |
| `titleText` | `computed<string>` | `titleKey` override → else `hierarchy.error.title.{httpStatus}` → else `hierarchy.error.title.default` with `{status}` interpolation. ts:51-59. |
| `subtitleText` | `computed<string>` | Error count: `n===1` → `hierarchy.error.countOne`, else `hierarchy.error.countOther` with `{count}` replaced. Flat-i18n (no ICU). ts:63-69. |
| `severity` | `computed<FalconAlertDialogSeverity>` | `httpStatus===422` → `'warning'` (business-rule rejection); everything else → `'danger'`. ts:74-78. |
| `errorMessages` | `computed<readonly string[]>` | Best-effort i18n: each message that looks like a known key is translated, else echoed raw; empty strings preserved as `''`. ts:80-89. |
| `confirmLabel` | `computed<string>` | `this.i18n.translate('common.ok')`. ts:91-93. |
| `dismiss()` | `void` method | Calls `errorDialog.dismiss()`. ts:95-97. |

## TypeScript types

- `ErrorDialogState` — `[CODE]` error-dialog.service.ts:12-19 (re-exported from `@falcon`).
- `FalconAlertDialogSeverity = 'danger' | 'warning' | 'info' | 'success'` — `[CODE]` falcon-alert-dialog.types.ts:5 (the host only ever emits `'warning'` | `'danger'`).
- No component-local types.

## Reflected props / Mutable props

**N/A** — single-render Angular host; no Stencil props, no reflection.

## CVA / ngModel / Reactive Forms

**N/A** — this is a passive imperative host, not a form control. No `ControlValueAccessor`.

## Signal compatibility

`[CODE]` Fully signal-driven: the service holds `signal<ErrorDialogState | null>`; the host derives 6 `computed()`s from it; `ChangeDetectionStrategy.OnPush` (ts:38) + zoneless-safe (no manual CD, no subscriptions, no timers). The `@if (state(); as s)` in the template (html:3) reacts to the signal directly.

## Methods

`[CODE]` `dismiss(): void` is the only method (`protected`, template-bound). No programmatic open/close API on the component — open via the service.

## Slots / template inputs

- `[CODE]` The host **projects** a Tailwind-styled `<ul>` of error bullets INTO the alert-dialog's default content slot (html:18-24). Each non-empty message renders as `<li>{{ m }}</li>` via `@for (m of errorMessages(); track m + $index)`.
- No `ng-content` / `ng-template` inputs ON this host (it is the projector, not the projectee).

## Sizes / states / variants / appearances

`[CODE]` The host pins the rendered alert-dialog to fixed values (html:4-15):

| Alert-dialog prop | Value set by host | Source |
|---|---|---|
| `open` | `true` (only rendered inside `@if (state())`) | html:5 |
| `title` | `titleText()` | html:6 |
| `subtitle` | `subtitleText()` | html:7 |
| `severity` | `severity()` (`'warning'` for 422, else `'danger'`) | html:8 |
| `confirmLabel` | `confirmLabel()` (`common.ok`) | html:9 |
| `hideCancel` | `true` (OK-only) | html:10 |
| `size` | `'md'` (fixed) | html:11 |
| `position` | `'center'` (fixed) | html:12 |
| `closable` | `true` | html:13 |
| `closeOnBackdrop` | `true` | html:14 |
| `closeOnEsc` | `true` | html:15 |

There is no size/variant axis exposed by the host itself.

## Constraints

- `[CODE]` **Mount exactly once** in the app shell (header doctrine ts:6: "Mount once in app.ts next to `<falcon-angular-message-host>`"). It is `providedIn: 'root'`-service-backed, so a second mount would render a duplicate dialog for the same state.
- `[CODE]` **`401` never renders** — suppressed at the service. Do not expect a re-auth dialog here.
- `[CODE]` **Title i18n keys must exist** — `hierarchy.error.title.{400,403,404,409,422,500,default}` are defined `[CODE]` en.json:1570-1578; an unmapped status falls through to `default` with `{status}` interpolation.
- `[CODE]` **Subtitle is flat-i18n** (no ICU plural) — only `countOne` (n=1) vs `countOther` (n≠1, incl. 0). en.json:1579-1580.
- `[CODE]` **Messages are best-effort-translated** — a backend message that accidentally matches an i18n key WILL be translated; otherwise echoed raw (ts:84-88). Callers should pass already-translated copy OR a real key.

## Accessibility

- `[CODE]` Inherits the `<falcon-angular-alert-dialog>` ARIA contract: `role="dialog"` + `aria-modal` + focus-trap + Esc-close come from the primitive (alert-dialog wrapper).
- `[CODE]` `closable` + `closeOnEsc` + `closeOnBackdrop` all `true` → keyboard + pointer dismissal both work (html:13-15).
- `[CODE]` The error list is a semantic `<ul>` / `<li>` (html:18-24), `text-start` for RTL.
- `[INFERRED]` The host does NOT add an `aria-live`/`role="alert"` wrapper around the bullet list (the alert-dialog body is read on open via focus, not announced live) — acceptable for a modal but noted in GAPS (A1).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Component has zero `@Input`/`@Output` (ts:41-97); the public surface is `ErrorDialogService.openError/dismiss/state` (service:24-53). Alert-dialog prop pins read from html:4-15; severity 422→warning + title/subtitle/messages computeds re-confirmed against ts:51-93 and en.json `hierarchy.error.*` (1570-1580). B/E rubric N/A (single-render host).
