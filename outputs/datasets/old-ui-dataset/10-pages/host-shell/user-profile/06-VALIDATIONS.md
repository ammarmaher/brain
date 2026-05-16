# Validations — user-profile

## Form validators (sync) — UserProfileComponent (template-driven, NgForm)

| Form | Field | Validator | Where | Message |
|---|---|---|---|---|
| personal | `firstName` | required (string non-empty after trim) | `isSaveDisabled` getter line 343 | none (button disabled) |
| personal | `lastName` | required | same | none |
| personal | `userName` | required | same | none |
| personal | `email` | required AND `emailValid` (regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, line 364) | same | inline ngForm error class |
| personal | `phoneNumber` | required AND `phoneValid` (`digits.length >= 7`, line 372) | same | inline |
| personal | (contact verification) | `!emailNeedsVerification AND !phoneNeedsVerification` | same | UI hides save button |

### emailNeedsVerification (line 318-321)
- True when `!emailVerified AND (emailChanged OR !originalProfile.emailVerified)`.
- emailChanged is set in `onEmailChange()` (line 661-666) by comparing `email.trim().toLowerCase()` to `originalProfile.email.trim().toLowerCase()`.

### phoneNeedsVerification (line 329-332)
- True when `!phoneVerified AND (phoneChanged OR !originalProfile.phoneVerified)`.
- phoneChanged is set in `onPhoneChange()` (line 671-675) by comparing digits-only versions (`replace(/\D/g, '').replace(/^0+/, '')`).

### emailValid (line 362-365)
```typescript
get emailValid(): boolean {
  const v = this.email.trim();
  return v.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}
```

### phoneValid (line 371-373)
```typescript
get phoneValid(): boolean {
  return this.phoneNumber.replace(/\D/g, '').length >= 7;
}
```

## Form validators — PersonalInformationStepComponent (wizard step 1)

Uses Falcon validation directives stacked on each input via NgForm:

| Field | Directives | Notes |
|---|---|---|
| `firstName`, `lastName` | `[falconLettersDigitsMax]` (max length), `required` | Falcon directive defined in `@falcon` |
| `userName` | `[falconUsernameFormat]` + `[falconCheckExists]="checkUsernameExists"` (async) + `required` | Async validates against `identity/user/exist` |
| `email` | `[email]` + `[pattern]="emailPattern"` where `emailPattern = FALCON_PATTERNS.EMAIL_STRING` + `required` | Falcon-shared regex |
| `phoneNumber` | `FalconMobileNumberComponent` (own internal E.164 validator) + `required` | |
| `nationalId` | required | |
| `profilePictureUrl` | optional | |

`FalconFormValidateDirective` is applied at the form level to handle the cross-cutting validation messages.

## Form validators — RoleStatusStepComponent (wizard step 2)
- `userStatus`: required, must be `Pending` or `Active` (line 91-93).
- `roleKey`: required, must be one of the PES-filtered roleOptions.

## Async validators
| Field | Validator | Endpoint | Debounce |
|---|---|---|---|
| `userName` (wizard step 1) | `FalconCheckExistsDirective` invoking `AccountValidationService.isUserExist(username, email, phoneNumber)` | `identity/user/exist` (via `UserApiService.checkExist`) | `[INFERRED]` directive internally debounces; specific ms not visible |

## Business rules captured in code

### Save dispatch (`UserProfileService.updateUserProfile`, `user-profile.service.ts:75-122`)
- Computes 3 diffs:
  - `personalInfoChanged` = any of (firstName, lastName, phoneNumber, nationalId, email, profilePictureInfo, deleteImage) differs from `originalProfile`.
  - `statusChanged` = `userId provided AND payload.userStatus != null AND payload.userStatus !== originalProfile.userStatus`.
  - `roleChanged` = `userId provided AND payload.roleKey AND payload.roleKey !== originalProfile.roleKey`.
- If nothing changed → returns `success(true)` immediately.
- Else: chains `profileUpdate$ → switchMap(runStatusUpdate) → switchMap(runRoleUpdate)`.
- Each subsequent step runs only if the previous succeeded.

### Profile-picture upload
- Single file only (`onFilesSelected`, line 801-823).
- MIME validation: `file.type.startsWith('image/')`.
- Size limit: `file.size <= 4 * 1024 * 1024` (4 MB).
- Stored as `ProfilePictureInfo { extension, fileBase64String }`. The `image` field on the response is a URL; on save it's swapped for the new info.

### Delete profile picture
- Requires `confirmationService.confirm({ key: 'deleteProfilePicture', ... })` first.
- On accept: sets `deleteImage = true`, clears `profilePictureInfo`, then calls `updateUserProfile()` with full payload (including image deletion flag).

### Wizard cancel
- Requires `confirmationService.confirm({ key: 'cancelUserWizard', ... })`.

### Username normalization
- `(personalInfo.userName ?? '').trim().toLowerCase()` in `UserWizardService.createUser` (line 42) before sending to backend.

### Role-edit matrix
- Source role = `originalProfile.roleKey` (saved, not draft).
- Target role = each option in the role catalog.
- Matrix queried via `FalconAccess.userRole.other(source, target)`.
- Only matched roles + the current role appear in the dropdown.

### Status options
- Edit mode: full enum minus none (computed via `Helper.enumToOptions(UserStatus, UserStatusI18n)`).
- Add mode: filtered to `[UserStatus.Pending, UserStatus.Active]` only.

### Tree-fetch deduplication (`loadNodeChildren`, line 1061-1085)
- Uses `loadingChildrenIds` + `loadedChildrenIds` Sets to avoid re-fetching the same node's children.

### `isEmail` masking in OTP modal (`profile-otp-modal.component.ts:111-122`)
- Email: `t**@example.com` (first char + 2 stars + the rest).
- Phone: `****1234` (4 stars + last 4 digits).

### OTP defaults
- `OTP_DEFAULTS.LENGTH = 6` (from `@falcon`).
- `OTP_DEFAULTS.EXPIRY_SECONDS = 120` (from `@falcon`).
- Used by `ProfileOtpModal` (lines 72, 76).

## Cross-field rules
- `personalInfoChanged`, `statusChanged`, `roleChanged` are computed per-save in `UserProfileService.updateUserProfile` — see business rules section.
- `passwordMatchValidator` IS used in the `auth/` feature but NOT in user-profile (no password change here).
