*** My Profile — Backend API ***
*** 2026-05-18 ***

# My Profile — Backend API

## Endpoint summary

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/api/user/me` | `[Authorize]` | (none) | `ServiceOperationResult<UserResponse>` |
| PUT | `/api/user/profile` | `[Authorize]` | `UpdateUserProfileRequest` | `ServiceOperationResult<UpdateUserProfileResult>` |
| POST | `/api/user/me/verify-email` | `[Authorize]` | `VerifyEmailRequest?` | `VerificationCodeResponse` |
| POST | `/api/user/me/verify-email/confirm` | `[Authorize]` | `ConfirmEmailRequest` | `bool` |
| POST | `/api/user/me/verify-phone` | `[Authorize]` | `VerifyPhoneRequest?` | `VerificationCodeResponse` |
| POST | `/api/user/me/verify-phone/confirm` | `[Authorize]` | `ConfirmPhoneRequest` | `bool` |

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:28-46`.

## Key difference from Edit User

- My Profile uses `/api/user/profile` (no `:id`).
- Backend resolves user from JWT claim, not URL param.
- All four OTP endpoints are `/me/*` (unambiguous self-target).

## See also

- `../edit-user/08-BACKEND_API.md`
