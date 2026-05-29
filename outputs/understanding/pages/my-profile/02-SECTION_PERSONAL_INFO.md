*** My Profile — Section: Personal Info ***
*** Same fields as Edit User Tab 1 with self-edit restrictions · 2026-05-18 ***

# My Profile — Personal Info

> Same fields as Edit User Personal Info tab, but the Role/Status/Permissions tabs are hidden.

## Fields per status

| Field | Editable | Validator | Backend field |
|---|---|---|---|
| `firstName` | YES | letters only · ≤50 | `UpdateUserProfileRequest.FirstName` |
| `lastName` | YES | letters only · ≤50 | `UpdateUserProfileRequest.LastName` |
| `userName` | **NO** (immutable) | display only | (not sent) |
| `email` | YES (OTP gate) | regex · OTP required | `UpdateUserProfileRequest.Email` |
| `phoneNumber` | YES (OTP gate) | E.164 · OTP required | `UpdateUserProfileRequest.PhoneNumber` |
| `nationalId` | YES | format TBD | `UpdateUserProfileRequest.NationalId` |
| `picture` | YES (upload/delete) | image/* · ≤4MB | `UpdateUserProfileRequest.ProfilePictureInfo` / `DeleteImage` |

## Cross-field rules

Same as Edit User:
- BR-UM-21 — Email AND Phone cannot be edited in same save.
- BR-UM-19 — Username immutable.

## emailNeedsVerification / phoneNeedsVerification

Same computed signal as Edit User. Save disabled until verified.

## Save endpoint

```
PUT /api/user/profile
Body: UpdateUserProfileRequest {
  FirstName, LastName, PhoneNumber, Email, NationalId,
  ProfilePictureInfo?, DeleteImage?
}
Response: ServiceOperationResult<UpdateUserProfileResult>
```

No `:id` param — backend identifies user from JWT claim.

## See also

- `../edit-user/02-SECTION_PERSONAL_INFO.md` · [03-SECTION_OTP_VERIFICATION](03-SECTION_OTP_VERIFICATION.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
