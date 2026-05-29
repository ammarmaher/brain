*** Login — Stage 3: First Login Password ***
*** 2026-05-18 ***

# Login — Stage 3: First Login Password

> Forced for users in `Pending` status (BR-UM-22). Becomes Active after successful submit.

## Component

[CODE] `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` (first-login mode):

- Selector: `app-change-password`
- Standalone
- Reactive Form
- Validators include `passwordMatchValidator` (custom)

## Fields

| Field | Required | Validator |
|---|---|---|
| `newPassword` | YES | required · complexity per account level (Normal / Advanced) |
| `confirmPassword` | YES | required · must match newPassword via `passwordMatchValidator` |

## Password complexity

[PRD] BR-UM-15: complexity follows account security level:
- **Normal**: e.g. 8+ chars
- **Advanced**: e.g. 12+ chars, uppercase, lowercase, digit, special

Backend enforces. FE shows real-time strength indicator.

## Submit (first-login)

```
POST /api/auth/first-login
Body: { SessionId, NewPassword }
Response: ServiceOperationResult<LoginStepResponse> with nextStage='Complete'
```

## Regular change-password (NOT first-login)

If user is already Active and changing password from My Profile, different endpoint: `PUT /api/user/change-password`. See `pages/change-password/`.

## Force-logout on success

[BRAIN-OUT] `/api/auth/first-login` does NOT revoke other sessions. But `/api/user/change-password` (regular flow) DOES revoke all sessions per [PRD] BR-UM-35.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · `../change-password/` · [07-VALIDATIONS](07-VALIDATIONS.md)
