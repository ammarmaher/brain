*** Edit User — Error states ***
*** SoT for FalconKeys.Error.* → UI message mapping · 2026-05-17 ***

# Edit User — Error States

> Backend errors → user-facing UX mapping. Backend returns `ServiceOperationResult<T> { isSuccessful: false, errorMessages: [string] }`; FE displays `errorMessages[0]` directly. HTTP status is the primary routing signal.

## HTTP status routing

| HTTP | Meaning | UX response |
|---|---|---|
| 200 | Success | Toast success · refresh local cache |
| 400 | Validation error | Inline field error OR toast with `errorMessages[0]` |
| 401 | Unauthorized | Global refresh-token flow OR redirect to login |
| 403 | Forbidden (PES denied) | Toast: `errorMessages[0]` (e.g. "You are not allowed to change this user's role.") |
| 404 | User not found | Toast: "User not found." · navigate back to list |
| 409 | Conflict (e.g. role change collides) | Toast: `errorMessages[0]` (e.g. "Account already has an Account Owner.") |
| 422 | Business rule rejection | Toast: `errorMessages[0]` |
| 429 | Rate limit (OTP throttle) | Toast: "Too many requests, try again in a minute." |
| 500 | Server error | Toast: "Something went wrong. Try again." |

## Per-endpoint error codes

### `PUT /api/user/{id}/profile`

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ERRORS.md` (full enumeration to verify):

| FalconKey | Origin | UX | Likely HTTP |
|---|---|---|---|
| `Error.User.UserNotFound` | DB miss | Toast · navigate to list | 404 |
| `Error.User.UsernameImmutable` | UserName change attempt | Toast: "Username cannot be changed." | 422 |
| `Error.User.EmailAndPhoneSimultaneousEdit` | BR-UM-21 violation | Toast: "Update email and phone separately." | 422 |
| `Error.User.EmailNotVerified` | save without OTP | Toast: "Please verify your new email first." | 422 |
| `Error.User.PhoneNotVerified` | save without OTP | Toast: "Please verify your new phone first." | 422 |
| `Error.User.UnauthorizedEdit` | PES denied | Toast: "You don't have permission to edit this user." | 403 |
| `Error.Validation.LettersOnly` | non-letter in name | Inline field error | 400 |
| `Error.Validation.MaxLength` | name >50 chars | Inline field error | 400 |
| `Error.Validation.InvalidEmail` | email regex fail | Inline field error | 400 |
| `Error.Validation.InvalidPhone` | phone format fail | Inline field error | 400 |
| `Error.Validation.ImageTooLarge` | picture >4MB | Inline · revert upload | 400 |

### `PUT /api/user/status`

| FalconKey | Origin | UX | Likely HTTP |
|---|---|---|---|
| `Error.User.UnauthorizedStatusTransition` | BR-UM-08 disallowed | Toast: "This status change is not allowed." | 422 |
| `Error.User.DeletedRestoreFalconOnly` | non-Falcon trying Deleted→Active | Toast: "Only Falcon admins can restore deleted users." | 403 |
| `Error.Account.NormalUserLimitReached` | Activate Normal User over limit | Toast: "The account has reached its Normal User limit." | 422 |
| `Error.User.UnauthorizedEdit` | PES denied | Toast: per above | 403 |

### `PUT /api/user/{id}/role`

| FalconKey | Origin | UX | Likely HTTP |
|---|---|---|---|
| `Error.UserRole.NotAllowed` | PES `userRole.other` rejected | Toast: "You cannot assign this role." | 403 |
| `Error.Account.NormalUserLimitReached` | new role=NormalUser, account full | Toast: per above | 422 |
| `Error.Account.SystemUserLimitReached` | new role=SystemUser, account full | Toast: per above | 422 |
| `Error.Account.AccountOwnerAlreadyExists` | assigning AO when one exists | Toast: "An Account Owner already exists." | 409 |

### `POST /api/user/me/verify-email` (and verify-phone)

| FalconKey | Origin | UX | Likely HTTP |
|---|---|---|---|
| `Error.User.EmailAlreadyVerified` | Email already verified — but BR allows resend? | Inline alert OR proceed silently | 200/422 |
| `Error.OTP.TooManyRequests` | throttle | "Try again in a minute" | 429 |
| `Error.OTP.SendFailed` | provider error | Toast: "Could not send the code. Try again." | 502 |

### `POST /api/user/me/verify-email/confirm` (and verify-phone/confirm)

| FalconKey | Origin | UX | Likely HTTP |
|---|---|---|---|
| `Error.OTP.IncorrectCode` | wrong code | Inline error: "Code is incorrect." · keep input | 400 |
| `Error.OTP.Expired` | timer hit 0 | "Code expired. Resend?" | 410 |
| `Error.OTP.NoActiveChallenge` | trying to confirm without prior send | "Please request a new code." | 422 |
| `Error.OTP.LockoutTriggered` | 3 wrong codes (login flow only) | (TBD for verify-email path — Q-UM-OTP-LOCKOUT) | 423 |

## Partial-state recovery

Because save dispatches 3 sequential PUT calls, mid-chain failure can leave a partial state:

| Step that succeeded | Step that failed | UI message |
|---|---|---|
| Profile | Status | "Profile saved, but status change failed. Retry?" |
| Profile | (Status n/a) Role | "Profile saved, but role change failed. Retry?" |
| Profile · Status | Role | "Profile and status saved, but role change failed. Retry?" |

[INFERRED] No code path for retry exists in old-UI — flag as `GAP-UM-PARTIAL-RECOVERY` in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md). Old-UI behavior: re-fetch `GET /api/user/{id}` to re-sync, but UI shows the FIRST failure's `errorMessages[0]` and the user has to know which fields are now out of sync. New UI should explicitly detect partial state.

## Toast service

[CODE] Old-UI uses `FalconMessageService` (deprecated post-Wave-4.2 per [MEMORY] `project_notification_facade_wave13`). New UI MUST use `FalconToastService` → `<falcon-angular-notification-stack position="top-right">`.

```typescript
this.falconToast.show({
  severity: 'success',
  title: 'User updated',
  detail: 'Changes saved successfully.',
});
```

## See also

- [README](README.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
