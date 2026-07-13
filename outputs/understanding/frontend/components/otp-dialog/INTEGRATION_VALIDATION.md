# otp-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

- **Identity** — the OTP send/verify/resend lifecycle is owned by Falcon Identity. `[CODE]` profile-otp.service.ts routes all 6 endpoints through `Gateway.IdentityGateway` (ts:31).
- The dialog itself is **presentational + gateway-free** — it imports NO HttpClient; it injects only the `OTP_GATEWAY` port (ts:65), the `DestroyRef`, and `TranslateService`. Per the port doctrine the concrete HTTP service lives in the host app, never the library. `[CODE]` otp-gateway.interface.ts:1-4 + ts:24-67.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `/user/me/verify-email` | POST | Identity | `VerifyEmailRequest { email }` → `ServiceOperationResult<VerificationCodeResponse>` | Identity GW | `sendOtp('email', value)`. `[CODE]` profile-otp.service.ts:35-48. |
| `/user/me/verify-phone` | POST | Identity | `VerifyPhoneRequest { phoneNumber }` → `…VerificationCodeResponse` | Identity GW | `sendOtp('phone', value)`. |
| `/user/me/verify-email/confirm` | POST | Identity | `ConfirmOtpRequest { code }` → `ServiceOperationResult<boolean>` | Identity GW | `verifyOtp('email', code)`. `[CODE]` profile-otp.service.ts:51-64. |
| `/user/me/verify-phone/confirm` | POST | Identity | `ConfirmOtpRequest { code }` → `…<boolean>` | Identity GW | `verifyOtp('phone', code)`. |
| `/user/me/verify-email/resend` | POST | Identity | `{}` (empty) → `…VerificationCodeResponse` | Identity GW | `resendOtp('email')` — reuses pending target. `[CODE]` profile-otp.service.ts:68-80. |
| `/user/me/verify-phone/resend` | POST | Identity | `{}` (empty) → `…VerificationCodeResponse` | Identity GW | `resendOtp('phone')`. |

`[CODE]` `VerificationCodeResponse = { otpCodeLength: number; otpExpiresInSeconds: number; devOtpCode: string | null }` (otp.dtos.ts:7-11). `RuntimeBaseUrlInterceptor` resolves the Identity-gateway host from the `useGateway(Gateway.IdentityGateway)` context (profile-otp.service.ts:31).

> `[CODE]` Every gateway call sets `headers: { notShowToaster: 'true' }` (profile-otp.service.ts:46/62/78) so the dialog's own error UX is the only error channel.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| OTP code correctness | the entered code | `verifyOtp` confirm | BE returns `isSuccessful:false` or HTTP 4xx → inline `verifyErrorMsg` from the SOR body, else generic `hierarchy.otp.invalid`. `[CODE]` ts:319-353. |
| OTP completeness | the entered code | auto-verify / Confirm | dialog guards `isComplete()` (`value.length === otpLength()`); won't verify a partial code. `[CODE]` ts:91/190/302. |
| Code expiry | n/a | countdown hits 0 | `screenState = Expired` → `hierarchy.otp.expired` + Resend enabled. `[CODE]` ts:375-377 + html:191-195. |
| Usable code length | n/a (BE policy) | `sendOtp`/`resendOtp` response | `otpCodeLength <= 0` → `hierarchy.otp.zeroLength` toast (business fault). `[CODE]` ts:248-251. |
| Send transport | n/a | gateway error / 12s timeout | `hierarchy.otp.sendFailed` toast. `[CODE]` ts:256-259/400-410. |

> `[CODE]` The dialog performs **format-completeness + expiry** validation client-side; CODE CORRECTNESS is strictly backend (it never knows the right code). `extractVerifyError` reads the first non-empty business message from either the in-body SOR `{ errors }` shape or `HttpErrorResponse.error.errors`. ts:342-353.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| _(none on the dialog)_ | open / verify | The dialog itself has **no PES gate**. |
| `[MEMORY]` self-edit gating (`/user/me`) | edit own email/phone | The HOST (user-details-page in self mode) gates whether the contact field is editable at all; this dialog only runs once the user is permitted to change the field. `[MEMORY]` edit-user-by-status (self path uses `/user/me`). |

The OTP dialog inherits the gate of the **profile-edit action** that launches it — it owns no PES key.

## State / signal pattern

`[CODE]` otp-dialog.component.ts — fully signal-first, zoneless, OnPush:
- **Inputs:** `model.required(open)`, `input(field/fieldValue/length)`. **Outputs:** `output(verified/cancelled/failed)`.
- **Machine:** `screenState = signal<OtpScreenState>` drives the whole view; `value`/`invalid`/`verifyErrorMsg`/`visible`/`otpLength`/`secondsLeft` are signals; `modalVisible`/`isComplete`/`expired`/`progress`/`ringDashOffset`/`countdownText`/`introKey` are computeds.
- **Open lifecycle:** an `effect()` (ts:135-146) watches `open()`; on the false→true edge (guarded by `wasOpen`, ts:131) with `field`+`fieldValue` present it `resetState()` + `sendOtp()`; on false it stops timers + hides. The modal's `showModal()/close()` is owned by `[falconOverlay]` via `[falconOpen]="modalVisible()"` (html:31) + `FalconStackingService` registration — NOT a bespoke effect.
- **Timers/handles:** `setInterval` countdown + `setTimeout` for success-beat / auto-verify / send-watchdog, ALL cleared in `cancelHandles()`/`stopTimer()` and on `DestroyRef.onDestroy` (ts:111-156, 419-426). Proper teardown.
- **Auto-verify:** 200ms after incomplete→complete (ts:181-185); success beat 900ms before emitting `verified` (ts:315).

## Skeleton ↔ app-wrapper layering

- **Port (interface)** — `OtpGateway` + `OTP_GATEWAY` token live in `libs/sdk` (no Angular HTTP); DTOs in `libs/sdk` otp.dtos. The presentational lib depends only on this abstraction. `[CODE]` otp-gateway.interface.ts:1-4.
- **Presentational modal** — `<app-otp-dialog>` in `libs/falcon/src/shared-ui`; composes `<falcon-angular-otp>` + `[falconOverlay]` from `@falcon/ui-core/angular`. `[CODE]` ts:23-24.
- **Concrete gateway** — `ProfileOtpService implements OtpGateway` in host-shell, bound via `{ provide: OTP_GATEWAY, useExisting: ProfileOtpService }`. `[CODE]` app.config.ts:113.
- **Host glue** — `user-details-page` owns `otpOpen`/`otpField`/`otpRecipient` signals + `onOtpVerified`/`onOtpFailed`; the dialog is a dumb verify surface. `[CODE]` signals.ts:173/476/481 + user-details-page.component.ts:402-414.

## Integration gotchas

- `[CODE]` **`OTP_GATEWAY` MUST be provided** — the dialog `inject(OTP_GATEWAY)` (ts:65); a missing provider crashes at construction. Bind it in the host app (host-shell does, app.config.ts:113).
- `[CODE]` **`open` is positive-edge** — set it false→true to start; the `wasOpen` guard means re-running the effect for `field`/`fieldValue` recompute will NOT re-send (prevents auto-open-on-load + input-wipe). ts:131/135-146.
- `[CODE]` **Send the DRAFT value** — `fieldValue` must be the NEW email/phone; the BE keys the verification record off it. ts:228-235.
- `[CODE]` **The code is never emitted** — only `verified:void`; the verified state is backend-owned. ts:300-318.
- `[CODE]` **`zeroLength` ≠ `sendFailed`** — distinguish the BE-business-fault toast from the transport-failure toast. ts:248-251.
- `[CODE]` **`notShowToaster:'true'` on all calls** — the dialog owns error UX; do not strip the header or the user double-sees errors. profile-otp.service.ts:46/62/78.
- `[CODE]` **Overlay lifecycle is the directive's** — do NOT call `showModal()`/`close()` manually; `[falconOverlay]` + the `@if (modalVisible())` gate own it (the auto-open bug history, html:11-28, was caused by an unconditional `display:flex` beating the UA `:not([open])` rule — now gated). ts:148-151.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). 6-endpoint Identity-gateway wiring read verbatim from profile-otp.service.ts:35-80 + otp.dtos.ts; port doctrine from otp-gateway.interface.ts; `OTP_GATEWAY` binding from app.config.ts:113. Signal state-machine + `[falconOverlay]` lifecycle + teardown + positive-edge guard re-confirmed in ts. PES inheritance 🟡 CODE-DERIVED from the self-edit host + `[MEMORY]` edit-user-by-status (the dialog has no PES key of its own).
