# falcon-otp-send-dialog — API

## Selectors

- Angular: `falcon-angular-otp-send-dialog`
- Stencil Shadow: `<falcon-otp-send-dialog>`
- Stencil Light: `<falcon-otp-send-dialog-tw>`

## Import

```ts
import { FalconAngularOtpSendDialogComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `openChange`. |
| `email` | `string?` | — | |
| `phone` | `string?` | — | |
| `mode` | `FalconOtpSendDialogMode` | `'both-allowed'` | E.g. `'both-allowed'`, `'email-only'`, `'sms-only'`. |
| `defaultChannel` | `FalconOtpSendChannel?` | — | Pre-select a channel. |
| `otpLength` | `number` | `6` | |
| `disabled` | `boolean` | `false` | |
| `errorMessage` | `string?` | — | |
| `step` | `FalconOtpSendDialogStep` | `'channel'` | `'channel' \| 'verify'`. Two-way via `stepChange`. |
| `titleStep1` | `string` | `'Verify your identity'` | |
| `titleStep2` | `string` | `'Enter verification code'` | |
| `subtitleStep1` | `string` | `'Choose where you want to receive your one-time code.'` | |
| `sendLabel` | `string` | `'Send code'` | |
| `verifyLabel` | `string` | `'Verify'` | |
| `cancelLabel` | `string` | `'Cancel'` | |
| `resendLabel` | `string` | `'Resend code'` | |
| `useTailwind` | `boolean` | `true` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falcon-send` | `FalconOtpSendDialogSendDetail` | Step 1 → Send pressed. |
| `falcon-verify` | `FalconOtpSendDialogVerifyDetail` | Step 2 → Verify pressed. |
| `falcon-resend` | `FalconOtpSendDialogResendDetail` | Resend in step 2. |
| `falcon-cancel` | `void` | Dialog dismissed. |
| `falcon-channel-change` | `FalconOtpSendDialogChannelChangeDetail` | User changed channel in step 1. |
| `openChange` | `boolean` | Two-way for `open`. |
| `stepChange` | `FalconOtpSendDialogStep` | Two-way for `step`. |

## TypeScript types

From `falcon-otp-send-dialog.types.ts`:
- `FalconOtpSendDialogMode`
- `FalconOtpSendChannel`
- `FalconOtpSendDialogStep`
- Detail types for each output.

## CVA

Not applicable — this is a dialog orchestrator, not a value-bearing form control. Outputs drive parent state.

## Methods

None proxied.

## Slots / template inputs

- Slot-friendly behavior is unclear (likely none — composed dialog).

## Constraints

- Email and phone passed in via inputs; component does NOT validate them.
- `mode='email-only'` / `'sms-only'` restrict channel.
- Step 1 → Send → emits `falcon-send` → parent sends code → parent flips `step='verify'`.
- Step 2 → Verify → emits `falcon-verify` → parent validates → parent closes via `open=false`.
- Resend in step 2 emits `falcon-resend`; parent sends new code.

## Accessibility

- Inherits dialog A11y (role=dialog, focus trap, Esc to close).
- Verify radio group inside step 1 has `role="radiogroup"`.
