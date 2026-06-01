*** My Profile — Section: OTP verification ***
*** 2026-05-18 ***

# My Profile — OTP Verification

> Same modal + same endpoints as Edit User. **No Q-UM-13 ambiguity** here because the OTP path is unambiguous: the user is verifying their own contact.

## Endpoints (unchanged from Edit User)

| Step | Method | Path |
|---|---|---|
| Send email OTP | POST | `/api/user/me/verify-email` |
| Confirm email OTP | POST | `/api/user/me/verify-email/confirm` |
| Send phone OTP | POST | `/api/user/me/verify-phone` |
| Confirm phone OTP | POST | `/api/user/me/verify-phone/confirm` |

## Modal component

Same `<app-profile-otp-modal>` from auth feature (or NEW UI `<falcon-otp-dialog>` replacement).

## See also

- `../edit-user/05-SECTION_OTP_VERIFICATION.md` · [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md)
