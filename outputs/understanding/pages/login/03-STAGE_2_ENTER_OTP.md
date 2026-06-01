*** Login — Stage 2: Enter OTP ***
*** 2026-05-18 ***

# Login — Stage 2: Enter OTP

## Component

[CODE] `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts`:

- Selector: `app-enter-otp`
- Standalone
- Reactive Form
- Auto-submits when 6 digits entered

## Fields

| Field | Required | Validator |
|---|---|---|
| `code` | YES | length === OTP_DEFAULTS.LENGTH (6) |

## Timer

- Display countdown: 60s per [PRD] BR-UM-26 (code says 120s — drift)
- On expiry: show "Code expired. Resend?"

## Resend

[CODE] `OtpService.resendOtp(sessionId)` → `POST /api/auth/resend-otp { SessionId }`.

Resend resets timer.

## Submit

```
POST /api/auth/verify-otp
Body: { SessionId, Code }
Response: ServiceOperationResult<LoginStepResponse>
```

## Auto-submit

Once user types 6 digits, form auto-submits (no Submit button required).

## Branching

- `nextStage = 'Complete'` → handleLoginSuccess → tokens stored → navigate to redirect URL.
- `nextStage = 'FirstLogin'` → navigate /login/change-password (per BR-UM-22).

## 3-wrong-OTP lockout

[PRD] BR-UM-27: ≥3 wrong OTP attempts → auto Locked.

UI shows count remaining: "2 attempts left."

## UI shape

```
+--------------------------------------+
|  Verify your phone                   |
|                                      |
|  We sent a 6-digit code to +966 *** 1234  |
|                                      |
|     ┌───┬───┬───┬───┬───┬───┐       |
|     │ 5 │ 4 │ 7 │ 8 │ 9 │ 3 │       |
|     └───┴───┴───┴───┴───┴───┘       |
|                                      |
|  Code expires in 0:48                |
|                                      |
|  Didn't receive? [Resend]            |
+--------------------------------------+
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [04-STAGE_3_FIRST_LOGIN_PASSWORD](04-STAGE_3_FIRST_LOGIN_PASSWORD.md)
