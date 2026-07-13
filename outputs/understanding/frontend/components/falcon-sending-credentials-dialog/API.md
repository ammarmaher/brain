# falcon-sending-credentials-dialog — API

## Selectors

- Angular: `falcon-angular-sending-credentials-dialog`
- Stencil Shadow: _none_
- Stencil Light: _none_

## Import

```ts
import {
  FalconAngularSendingCredentialsDialogComponent,
  type FalconCredentialDeliveryMethod,
} from '@falcon/ui-core/angular';
// component barrel: libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/index.ts
```

Add `FalconAngularSendingCredentialsDialogComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the component internally (`[CODE]` ts:46) — the host does NOT need it.

> `[CODE]` This component uses the modern **`input()` / `output()` signal API** (NOT `@Input`/`@Output` decorators) and `ChangeDetectionStrategy.OnPush`.

## Inputs (all on `FalconAngularSendingCredentialsDialogComponent`, all signal `input()`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | `[CODE]` ts:91 — visibility. The template `@if (open())` mounts the `<dialog>`; the `[falconOverlay]` directive drives `showModal()`/`close()`. A false→true transition re-seeds `selected` from `defaultDelivery()` (`[CODE]` ts:149-151 effect). |
| `ownerName` | `string` | `''` | `[CODE]` ts:94 — name shown in the owner-summary card. |
| `ownerPhone` | `string` | `''` | `[CODE]` ts:95 — phone shown in the summary card. |
| `ownerEmail` | `string` | `''` | `[CODE]` ts:96 — email shown in the summary card. |
| `defaultDelivery` | `FalconCredentialDeliveryMethod` (`'email' \| 'sms' \| 'both'`) | `'email'` | `[CODE]` ts:99 — initial selected method; re-seeds `selected` on each open. |
| `disableSend` | `boolean` | `false` | `[CODE]` ts:102 — disables the **Send Credentials** button (submit-in-flight). Also guards `onSend()` (`[CODE]` ts:169). |
| `title` | `string` | `'Sending Credentials'` | `[CODE]` ts:105 — heading. Parent feeds a pre-translated string (TranslatePipe upstream). |
| `subtitle` | `string` | `'An email and/or SMS … sent to the account owner'` | `[CODE]` ts:106-108 — sub-heading copy. |
| `deliveryLabel` | `string` | `'Delivery method:'` | `[CODE]` ts:109 — label above the 3 cards. |
| `ownerKeyLabel` | `string` | `'Account owner'` | `[CODE]` ts:110 — summary-card key for name. |
| `phoneKeyLabel` | `string` | `'Phone Number'` | `[CODE]` ts:111 — summary-card key for phone. |
| `emailKeyLabel` | `string` | `'Email'` | `[CODE]` ts:112 — summary-card key for email. |
| `sendLabel` | `string` | `'Send Credentials'` | `[CODE]` ts:113 — primary button label. |
| `cancelLabel` | `string` | `'Cancel'` | `[CODE]` ts:114 — link button label. |
| `closeAriaLabel` | `string` | `'Close'` | `[CODE]` ts:115 — aria-label of the top-end X button. |
| `emailMethodLabel` | `string` | `'Send via Email'` | `[CODE]` ts:118 — Email card label. |
| `smsMethodLabel` | `string` | `'Send via SMS'` | `[CODE]` ts:119 — SMS card label. |
| `bothMethodLabel` | `string` | `'Both, SMS and Email'` | `[CODE]` ts:120 — Both card label. |
| `closeOnBackdrop` | `boolean` | `true` | `[CODE]` ts:123 — backdrop click → `onCancel()` (gated in `onBackdropClick`/`onDialogClick`). |
| `closeOnEsc` | `boolean` | `true` | `[CODE]` ts:124 — when false, `onNativeCancel` calls `event.preventDefault()` to block the native ESC close. |

## Outputs

`[CODE]` Two signal `output()`s.

| Name | Payload | Notes |
|---|---|---|
| `(send)` | `FalconCredentialDeliveryMethod` | `[CODE]` ts:128 — emitted by `onSend()` with the currently selected method (`this.selected()`), gated by `open() && !disableSend()`. |
| `(cancel)` | `void` | `[CODE]` ts:127 — emitted by `onCancel()` on the X button, Cancel button, backdrop click (if `closeOnBackdrop`), or native ESC close (`(falconClose)`). Gated by `open()`. |

> `[CODE]` There is **no `[(open)]` two-way binding** — `open` is a one-way input. The parent toggles it false in its own `(cancel)`/`(send)` handlers (the wizard-finalization composite does this). Compare the legacy `send-credentials-popup`, which had `[(visible)]` two-way + a `submit` output.

## TypeScript types

`[CODE]` Declared inline in the component file (no separate `.types.ts`):

```ts
export type FalconCredentialDeliveryMethod = 'email' | 'sms' | 'both';   // ts:34 (exported)
interface DeliveryOption { readonly id: FalconCredentialDeliveryMethod; readonly label: string; } // ts:36-39 (internal)
```

`FalconCredentialDeliveryMethod` is re-exported from the barrel (`index.ts:5`). `[INFERRED]` This is a NEW string-union contract — it does NOT reuse the legacy `DeliveryMethod` enum from `@falcon/shared-types` that `send-credentials-popup` used; the wizard maps between them at the `wire-builders.ts` boundary (see `INTEGRATION_VALIDATION.md`).

## Reflected props (Stencil only)

N/A — no Stencil tag.

## Mutable props (Stencil)

N/A. Internal mutable state is the Angular signal `selected = signal<FalconCredentialDeliveryMethod>('email')` (`[CODE]` ts:133), set by `pickMethod()` and re-seeded by the open effect.

## CVA / ngModel / Reactive Forms

**NONE.** `[CODE]` This is not a form control — it does not implement `ControlValueAccessor` and provides no `NG_VALUE_ACCESSOR`. The selected method is surfaced only via the `(send)` event payload. Do not attempt `[(ngModel)]` / `formControlName`.

## Signal compatibility

`[CODE]` Fully signal-based: `input()` for every prop, `output()` for events, `computed()` for `options` (`[CODE]` ts:135-139), `signal()` for `selected`, `viewChild()` for the `<dialog>` ref (`[CODE]` ts:145), and an `effect()` for the open→re-seed (`[CODE]` ts:149-151). `OnPush`.

## Methods

`[CODE]` No public methods. Protected handlers only (`pickMethod`, `onCancel`, `onSend`, `onBackdropClick`, `onCardKeydown`, `onNativeCancel`, `onDialogClick`). `ngOnInit` registers `<falcon-button-tw>` via `defineFalconTwComponent('falcon-button')` (`[CODE]` ts:154-157).

## Slots / template inputs

`[CODE]` **None** — no `<ng-content>`, no `ng-template` inputs. Every visual element (cards, illustrations, owner summary, buttons) is hardcoded in the template (`[CODE]` html:11-194). The 3 SVG illustrations are inlined verbatim from the React source (`[CODE]` html:87-124).

## Supported sizes / states / variants / appearances

`[CODE]` **None** — single fixed visual. Panel is `max-w-[880px]` (`[CODE]` html:26, mirrors React `ac-send-modal`). The only per-card state is selected vs unselected (toggles teal solid border + ring vs neutral dashed border — `[CODE]` html:60-67).

## Constraints

- `[CODE]` **One-way `open`** — no two-way binding; parent must flip `open` to `false` on cancel/send.
- `[CODE]` **Pre-translated labels** — every label input is a plain string; the component does NOT call TranslatePipe. The parent (`wizard-finalization`) feeds already-translated values.
- `[CODE]` **Footer buttons are Stencil `<falcon-button-tw>`** with `[attr.label]` + `(falcon-click)` (`[CODE]` html:179-191), NOT `<falcon-angular-button>`. The disabled state is `[attr.disabled]="disableSend() ? '' : null"`.
- `[CODE]` **Method cards are `<div role="radio">`** with inline visual radio dots — not real `<input type=radio>` / `<falcon-angular-radio>` (`[CODE]` html:51-81). See `GAPS_AND_UPGRADES.md` G1 (no enclosing `role="radiogroup"`, roving-tabindex).

## Accessibility

- `[CODE]` `<dialog role="dialog" aria-modal="true" [attr.aria-labelledby]="'falcon-sc-title'">` (`[CODE]` html:12-18); the heading carries `id="falcon-sc-title"` (`[CODE]` html:42).
- `[CODE]` Each method card: `role="radio"`, `tabindex="0"`, `[attr.aria-checked]="selected()===o.id"`, `[attr.aria-label]="o.label"`, keyboard pick via Space/Enter (`onCardKeydown` → `preventDefault` + `pickMethod`) (`[CODE]` html:52-57 + ts:180-185).
- `[CODE]` Visual radio dot `<span>`s are `aria-hidden="true"` (decorative) (`[CODE]` html:74); all 3 illustration SVGs are `aria-hidden="true"` + `pointer-events-none select-none` (`[CODE]` html:84-87).
- `[CODE]` Owner-summary icons are `aria-hidden="true"` (`[CODE]` html:137/151/165).
- `[CODE]` Top-end X button: `type="button"` + `[attr.aria-label]="closeAriaLabel()"` (`[CODE]` html:29-34).
- `[CODE]` ESC handled natively via `(falconCancel)="onNativeCancel($event)"` (preventDefault iff `!closeOnEsc()`); native close → `(falconClose)="onCancel()"`. Focus trap + restore inherited from the native `<dialog>` Top Layer (the `[falconOverlay]` directive owns `showModal()`).
- `[CODE]` **a11y gaps** (see GAPS): cards lack an enclosing `role="radiogroup"` + `aria-label`, every card is `tabindex="0"` (no roving-tabindex; arrow-key navigation between radios is not implemented).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-sending-credentials-dialog.component.ts (206 ln) + .component.html (195 ln). Inputs (21), outputs (2), the `FalconCredentialDeliveryMethod` union, the open→re-seed effect, the `<falcon-button-tw>` footer, and the `role="radio"` card a11y all read from live source. No CVA / no Stencil / no token file confirmed.
