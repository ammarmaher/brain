# falcon-otp-send-dialog — API

## Selectors

- Angular: `falcon-angular-otp-send-dialog`
- Stencil Shadow: `<falcon-otp-send-dialog>` (tag `'falcon-otp-send-dialog'`, `shadow: true`)
- Stencil Light: `<falcon-otp-send-dialog-tw>` (tag `'falcon-otp-send-dialog-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularOtpSendDialogComponent } from '@falcon/ui-core';
// or: import { FalconAngularOtpSendDialogComponent } from '@falcon';
```

Add to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` falcon-otp-send-dialog.component.ts:33) — the host does NOT need it.

## Inputs (all on `FalconAngularOtpSendDialogComponent`)

`[CODE]` falcon-otp-send-dialog.component.ts:42-60 — **17 `@Input()`s** (apply to BOTH render paths):

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `(openChange)`. Forwarded as `open` attr. Closing resets the dialog to step 1 (Stencil `@Watch('open')`). |
| `email` | `string?` | `undefined` | Contact shown in the channel sub-text + step-2 target line. NOT validated by the dialog. |
| `phone` | `string?` | `undefined` | Same — shown, not validated. |
| `mode` | `'email-only' \| 'sms-only' \| 'both-allowed'` (`FalconOtpSendDialogMode`) | `'both-allowed'` | Drives WHICH channel radios render (`allowedChannels`, `[CODE]` .utils.ts:9-19). Set from tenant policy, not a UI default. |
| `defaultChannel` | `FalconOtpSendChannel?` (`'email'\|'sms'\|'both'`) | `undefined` | Pre-selects a channel if it is allowed by `mode` (`resolveDefaultChannel`, .utils.ts:22-29). |
| `otpLength` | `number` | `6` | Code length → forwarded to `<falcon-otp>`. Must match the Identity-issued code length. |
| `disabled` | `boolean` | `false` | Reflected; greys + blocks all actions. |
| `errorMessage` | `string?` | `undefined` | Mirrored onto the internal error slot via `@Watch('errorMessage')` → painted on the OTP boxes + the step-2 error line. |
| `step` | `'channel' \| 'code'` (`FalconOtpSendDialogStep`) | `'channel'` | **Two-way via `(stepChange)`.** `[CODE]` falcon-otp-send-dialog.types.ts:10 — the second value is **`'code'`, NOT `'verify'`** (the prior dossier's `'verify'` was wrong). |
| `titleStep1` | `string` | `'Verify your identity'` | Step-1 dialog title. |
| `titleStep2` | `string` | `'Enter verification code'` | Step-2 dialog title. |
| `subtitleStep1` | `string` | `'Choose where you want to receive your one-time code.'` | Step-1 subtitle. |
| `sendLabel` | `string` | `'Send code'` | Step-1 primary button label. |
| `verifyLabel` | `string` | `'Verify'` | Step-2 primary button label. |
| `cancelLabel` | `string` | `'Cancel'` | Ghost cancel button label (both steps). |
| `resendLabel` | `string` | `'Resend code'` | Step-2 resend link label. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-otp-send-dialog-tw>` (Light DOM, composes the `-tw` children). `false` → `<falcon-otp-send-dialog>` (Shadow). |

> `[CODE]` There is **no `rootClass` / `wrapperClass`** on this wrapper (unlike calendar/date-picker) — it is a pure orchestrator with no path-specific class prop.

## Outputs (on `FalconAngularOtpSendDialogComponent`)

`[CODE]` falcon-otp-send-dialog.component.ts:62-70 — **7 `@Output`s**. The five intent events use **renamed kebab-case aliases** (`@Output('falcon-send')` etc.) so consumer templates write `(falcon-send)="…"`:

| Output (template binding) | Backing field | Payload | Notes |
|---|---|---|---|
| `(falcon-send)` | `sendOut` | `FalconOtpSendDialogSendDetail` (`{ channel, email?, phone? }`) | Step 1 → Send pressed. `[CODE]` Wrapper calls `event.stopPropagation()` in `handleSend()` (ts:81-85) to defeat the bubbled-CustomEvent double-fire. |
| `(falcon-verify)` | `verifyOut` | `FalconOtpSendDialogVerifyDetail` (`{ code, channel }`) | Step 2 → Verify. `[CODE]` `handleVerify()` does NOT stopPropagation (ts:87-90) — see the double-emit caveat below. |
| `(falcon-resend)` | `resendOut` | `FalconOtpSendDialogResendDetail` (`{ channel }`) | Resend link. `[CODE]` `handleResend()` does NOT stopPropagation (ts:92-95). |
| `(falcon-cancel)` | `cancelOut` | `void` | Dialog dismissed. `[CODE]` `handleCancel()` ALSO sets `open=false` + emits `openChange(false)` (ts:97-101). |
| `(falcon-channel-change)` | `channelChangeOut` | `FalconOtpSendDialogChannelChangeDetail` (`{ channel }`) | Channel radio changed. `[CODE]` `handleChannelChange()` does NOT stopPropagation (ts:103-106). |
| `(openChange)` | — | `boolean` | Two-way for `open`. |
| `(stepChange)` | — | `FalconOtpSendDialogStep` | Two-way for `step`. **NOTE:** no `handleStep` wires it — the wrapper never emits `stepChange` from any handler in the inspected source, so `[(step)]` write-back from the dialog's own transitions does NOT propagate (the flow must drive `step` one-way). GAP. |

> `[CODE]` **Double-emit caveat (G-DBL):** the inner Stencil events all dispatch `bubbles: true, composed: true`. The wrapper guards ONLY `falcon-send` with `stopPropagation()` (ts:82). `falcon-verify` / `falcon-resend` / `falcon-channel-change` are NOT stopped — so a consumer that ALSO listens on the host element (rather than via the `@Output`) would receive those three TWICE. Bind via the `@Output`s only.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.types.ts`:

```ts
type FalconOtpSendChannel = 'email' | 'sms' | 'both';
type FalconOtpSendDialogMode = 'email-only' | 'sms-only' | 'both-allowed';
type FalconOtpSendDialogStep = 'channel' | 'code';                 // NOT 'verify'
interface FalconOtpSendDialogSendDetail   { readonly channel; readonly email?; readonly phone?; }
interface FalconOtpSendDialogVerifyDetail { readonly code; readonly channel; }
interface FalconOtpSendDialogResendDetail { readonly channel; }
interface FalconOtpSendDialogChannelChangeDetail { readonly channel; }
```

## Reflected props (Stencil only)

`[CODE]` falcon-otp-send-dialog.tsx:46-54 — `open`, `mode`, `otpLength`, `disabled`, `step` are reflected (`@Prop({ reflect: ... })`; `open` + `step` are also `mutable`). The label/copy props do NOT reflect.

## Mutable props (Stencil)

`open` and `step` are `@Prop({ mutable: true, reflect: true })` (`[CODE]` tsx:46,54) — the component mutates them internally (e.g. `advanceToCodeStep()` sets `step='code'`; cancel sets `open=false`).

## CVA / ngModel / Reactive Forms

**Not applicable.** `[CODE]` This is a dialog orchestrator, not a value-bearing control — no `ControlValueAccessor`, no `NG_VALUE_ACCESSOR`. State flows via the two-way `open`/`step` + the five intent outputs.

## Methods

`[CODE]` The Angular wrapper proxies **none**. The Stencil tags DO expose three `@Method`s (the prior API.md "None proxied" is WRONG — call via the native element ref):

| Method | Description | Available on |
|---|---|---|
| `advanceToCodeStep()` | Programmatically move to step 2 (`step='code'`, clears OTP/error). | BOTH tags `[CODE]` falcon-otp-send-dialog.tsx:112-118 / -tw:124-130 |
| `markVerificationError(message)` | Paint a verification error on the OTP boxes (sets `internalError`). | BOTH tags `[CODE]` falcon-otp-send-dialog.tsx:121-124 / -tw:132-135 |
| `resetToChannelStep()` | Reset back to step 1 (clears OTP/error). | BOTH tags `[CODE]` falcon-otp-send-dialog.tsx:127-133 / -tw:137-143 |

> No wrapper-side `goToStep1()`/`goToStep2()`/`reset()` proxy (GAP G1). To call these, obtain the native element ref.

## Slots / template inputs

`[CODE]` Neither render path declares a `<slot>` and the wrapper has no `ng-content`/`ng-template`. ALL content is prop-driven (the copy is fully customizable via the 7 label inputs). The composed children (`<falcon-dialog>` etc.) are internal — you cannot project into them.

## Supported modes / steps / states

- `mode`: `email-only` / `sms-only` / `both-allowed` → controls which radios render.
- `step`: `channel` (radios + Send/Cancel) / `code` (OTP boxes + Verify/Cancel + Resend).
- `disabled`: greys + blocks every handler (`if (this.disabled) return` guards on send/verify/resend/cancel/channel-change).
- No `size`/`variant` on the wrapper — the inner `<falcon-dialog size="sm">` is fixed (`[CODE]` tsx:353).

## Constraints

- `[CODE]` Validation deferred — the dialog does not send/verify/throttle; it emits intents (tsx:152-181). The flow owns all Identity calls.
- `[CODE]` Closing resets state — a re-opened dialog always starts fresh on step 1 (`@Watch('open')`, tsx:94-103). Do not expect a half-entered code to survive open/close.
- `[CODE]` Verify is disabled until the OTP is complete (`disabled={this.disabled || !this.otpComplete}`, tsx:318).
- `[CODE]` `email`/`phone` are NOT validated — the flow vouches for them.
- `[CODE]` `step` two-way write-back is one-directional in practice (no `stepChange` emit from the wrapper) — drive `step` from the flow.

## Accessibility

`[CODE]` Verified IMPLEMENTED (the prior "inherits dialog A11y" claims are confirmed + extended):
- The channel block is `role="radiogroup"` with `aria-label="Delivery method"` (`[CODE]` falcon-otp-send-dialog.tsx:211).
- Each channel is a `<falcon-radio>` (Shadow) / `<falcon-radio-tw>` (`-tw`) with `name`/`value`/`checked`/`label`/`disabled` — proper radio semantics.
- The step-2 error line is `role="alert"` (`[CODE]` tsx:309).
- The channel-option leading icons are `aria-hidden="true"` (`[CODE]` tsx:225).
- Focus trap + `role="dialog"` + Esc-to-close are inherited from the embedded `<falcon-dialog>` (`closable`, `dismissible={!disabled}`, `[CODE]` tsx:354-355) — see the `<falcon-dialog>` dossier for the trap details.
- **Shadow↔`-tw` a11y note:** the Shadow channel options wire BOTH a `<div onClick>` AND an `onFalcon-change` on each radio (tsx:223,251); the `-tw` twin wires ONLY the `<div onClick>` (the `<falcon-radio-tw>` has no `onFalcon-change`, -tw:242-248). See `INTEGRATION_VALIDATION.md` for the resulting behavioral divergence.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-otp-send-dialog.component.ts (107 ln), .html (55 ln), .tsx (366 ln), -tw.tsx (362 ln), .types.ts, .utils.ts. Corrected vs prior dossier: `step` enum is `'channel'|'code'` (NOT `'verify'`); 3 Stencil `@Method`s confirmed (prior "None proxied" wrong); outputs use renamed kebab aliases; only `falcon-send` is stop-propagated (verify/resend/channel-change double-emit risk); `stepChange` is never emitted by the wrapper.
