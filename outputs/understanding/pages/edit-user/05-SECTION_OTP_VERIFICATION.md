*** Edit User — Section: OTP verification modal ***
*** SoT for the email/phone change OTP flow · 2026-05-17 ***

# Edit User — OTP Verification

> Required when admin changes the user's Email or Phone per [PRD] BR-UM-36. **Q-UM-13 OPEN** on which OTP path applies for admin-edit-of-another-user — see [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## The modal component

[CODE] `apps/host-shell/.../user-profile/components/profile-otp-modal/profile-otp-modal.component.ts:22-294`:

- Selector: `app-profile-otp-modal`
- Standalone: yes
- Encapsulation: `ViewEncapsulation.None` (so PrimeNG dialog portal styles cascade)
- Inputs: `visible: boolean`, `field: VerifiableField | null`, `fieldValue: string`
- Outputs: `verified: EventEmitter<VerifiableField>`, `dismissed: EventEmitter<void>`

## State machine — `OtpScreenState`

[CODE] re-exported from `@falcon`:

```
Sending → Input → Verifying → Success
                            \→ Error
                            \→ Expired
```

## Timing

| Constant | Value | Source |
|---|---|---|
| `OTP_DEFAULTS.LENGTH` | 6 digits | [CODE] `@falcon` constant; PRD BR-UM-28 says "OTP length is 4 OR 6 (system app setting)" |
| `OTP_DEFAULTS.EXPIRY_SECONDS` | 120 seconds | [CODE] same; **PRD BR-UM-26 says 60s** — this is a drift, see GAP-UM-25 |

## Endpoints called

[BRAIN-OUT] `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/user-profile/03-SERVICES-APIS.md:42-47`:

| Step | Method | Path | Body | Response |
|---|---|---|---|---|
| Send (email) | POST | `/user/me/verify-email` | `{ }` (PRD says new email in body; old-UI sends empty body — drift) | `ServiceOperationResult<bool>` |
| Send (phone) | POST | `/user/me/verify-phone` | `{ }` | `ServiceOperationResult<bool>` |
| Confirm (email) | POST | `user/me/verify-email/confirm` | `{ code: <otp> }` | `ServiceOperationResult<bool>` |
| Confirm (phone) | POST | `user/me/verify-phone/confirm` | `{ code: <otp> }` | `ServiceOperationResult<bool>` |

**Note inconsistency:** [CODE] `profile-otp.service.ts:33-35` — send endpoints use leading slash; confirm endpoints don't. RuntimeBaseUrlInterceptor likely normalizes. Flag in GAPS.

## Backend endpoint signatures

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:41-46`:

```
POST /api/user/me/verify-email
  Request: VerifyEmailRequest (body optional — Email?)
  Response: VerificationCodeResponse
  Note: if body has new email → verify-before-save flow; else resend for current.

POST /api/user/me/verify-email/confirm
  Request: ConfirmEmailRequest { code }
  Response: bool

(Same for /verify-phone)
```

> **Q-UM-13 implication:** the `/me/` paths verify the CURRENT logged-in user's contact. For admin-edit-of-another-user, the backend would need new endpoints like `POST /api/user/{id}/verify-email`. None exist today. See GAP-UM-21.

## Masked value display

[CODE] `profile-otp-modal.component.ts:111-122`:

- Email: `t**@example.com` (first char + 2 stars + everything from `@`)
- Phone: `****1234` (4 stars + last 4 digits)

## Modal flow

```
1. ngOnChanges detects visible=true → resetState() → sendOtp()
2. POST /user/me/verify-{field} → on success → state=Input
3. User types 6 digits → auto-submits when complete
4. POST /user/me/verify-{field}/confirm → on success →
   emit verified(field) after 900ms delay (gives time for success animation)
5. Parent: verified.emit → emailVerified=true → save button enables
6. If expired (120s timer hits 0): state=Expired, show Resend
```

## Resend

- Manual click on "Resend" — calls send endpoint again, resets state to Sending → Input.
- Timer resets to 120s on each send.

## Falcon component composition (NEW UI target)

| Element | Falcon component | Notes |
|---|---|---|
| Modal shell | `<falcon-dialog>` | replace PrimeNG `<p-dialog>` |
| OTP input | `<falcon-otp>` | replace PrimeNG `<p-inputOtp>` ([F-016]) · 6-digit |
| Timer pill | inline `<span>` with countdown | bind to `remainingSeconds` |
| Resend link | `<falcon-link-button>` | disabled until expiry OR after each send (TBD throttle) |

## Failure UX

| Failure | UI |
|---|---|
| Wrong OTP | Inline error: "Code is incorrect. Try again." · Input stays · NO lockout (matches BR-UM-32 silent failure for forgot-password; need PRD confirmation for admin edit) |
| Expired (120s/60s) | "Code expired" badge · Resend button enabled |
| Network error | "Could not send verification code" toast · Retry button |
| 3 wrong OTPs (login flow only) | Per BR-UM-27: auto-lock. **Does this apply to edit-user verify-email?** → flagged Q-UM-OTP-LOCKOUT in GAPS |

## See also

- [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [12-ERROR_STATES](12-ERROR_STATES.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [README](README.md)
