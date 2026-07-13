# falcon-otp-send-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-otp-send-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-otp-send-dialog.tsx:346-365` — A small (`size="sm"`) centered **modal dialog** with a title that changes per step. Two faces:

- **Step 1 (channel)** `[CODE]` `:198-283` — a subtitle, a target line showing the email/phone, then a vertical stack of selectable rows. Each row: a channel **icon** (envelope / phone / both), a **radio**, and a label + sub-text ("Send via Email — to user@x.com"). Below: a full-width primary "Send code" button + a ghost "Cancel".
- **Step 2 (code)** `[CODE]` `:286-344` — a description line ("We sent a 6-digit code to …"), a `<falcon-otp>` box row, an optional error line, a full-width "Verify" button (disabled until complete) + ghost "Cancel", and a text-link "Resend code" at the bottom.

Distinguishing feature: a **two-step modal that pairs a channel chooser with an OTP entry** — not a plain dialog, not a bare OTP field.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + a `<RadioGroup>` + `<MuiOtpInput>`, hand-assembled across two steps | no single MUI component — Falcon packages the whole ceremony. |
| PrimeNG | `<p-dialog>` + `<p-radioButton>` + `<p-inputOtp>` hand-assembly | Falcon's pre-composed equivalent. |
| Ant Design | `<Modal>` + `<Radio.Group>` + `<Input.OTP>` + `<Steps>` | the closest mental model — a stepped modal. |
| Bootstrap | `.modal` + radios + OTP inputs, fully hand-rolled | upgrade target. |
| shadcn / Radix | `<Dialog>` + `<RadioGroup>` + `<InputOTP>` composed by hand | Falcon's value is the composition is done for you. |
| plain HTML | `<dialog>` + radios + inputs | always replace. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a modal that asks "where do you want your code?" then "enter the code" | `<falcon-angular-otp-send-dialog>` | a bare dialog |
| just a row of code boxes, inline, no modal | `<falcon-angular-otp>` | the send-dialog |
| a generic confirm/cancel modal | `<falcon-angular-dialog>` / `<falcon-angular-popup>` | the send-dialog |
| a phone field with a Verify button | `<falcon-angular-phone-field [verifyButton]>` (often *opens* this dialog) | the send-dialog alone |
| channel radios with no OTP step | `<falcon-angular-radio>` group | the send-dialog |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[(open)]` two-way, `email`, `phone`, `mode` (set from tenant policy: `'both-allowed'` / `'email-only'` / `'sms-only'`), `otpLength` (match the backend code length), `[(step)]` two-way.
2. **Copy** — every label is a prop (`titleStep1/2`, `subtitleStep1`, `sendLabel`, `verifyLabel`, `cancelLabel`, `resendLabel`) — pass translated strings.
3. **Flow wiring** — handle `(falcon-send)` → call Identity to deliver → flip `step='code'`; handle `(falcon-verify)` → call `auth/verify-otp` → on failure call the element's `markVerificationError()`, on success close via `open=false`; handle `(falcon-resend)` → re-issue.
4. **Error painting** — set `[errorMessage]` (mirrored to the OTP boxes) or call the `markVerificationError()` method.
5. **Tokens** — channel-row + dialog tokens via `otp-send-dialog.tokens.css`.
6. **Do not re-compose** — the dialog already embeds `<falcon-dialog>` + `<falcon-radio>` + `<falcon-otp>` + `<falcon-button>`; never rebuild the ceremony from parts.

## Anti-patterns
- Hand-assembling a dialog + radios + OTP for a verify ceremony — this component IS that assembly.
- Binding `step='verify'` — the enum value is `'code'` (`falcon-otp-send-dialog.types.ts:10`).
- Treating `falcon-send`/`falcon-verify`/`falcon-resend` as completed actions — they are intents; the flow must perform the Identity calls.
- Leaving `mode='both-allowed'` when the tenant forbids a channel — set `mode` from policy.
- Listening on the host element for the events instead of the `@Output`s — risks the double-emit the wrapper guards against.

## Verification
🟡 CODE-DERIVED (RE-VERIFIED 2026-06-03, B07) from `falcon-otp-send-dialog.tsx` (366 ln) render tree + `.types.ts`. The two-step render tree (channel `:198-283` / code `:286-344`), composed `<falcon-dialog size="sm">` shell (`:350`), and the `step='code'` enum (types.ts:10) re-confirmed. Cross-library mappings 🔴 INFERRED from standard library APIs.
