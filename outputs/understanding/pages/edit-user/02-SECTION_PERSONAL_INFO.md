*** Edit User — Section: Personal Info tab ***
*** SoT for the Personal Info tab · 2026-05-17 ***

# Edit User — Personal Info tab

> Tab 1 of 3. Editable fields per [PRD] BR-UM-36: First Name · Last Name · Profile Picture · Email (OTP gate) · Phone (OTP gate). Immutable display-only: Username (BR-UM-19). Not present here: Password (user-owned, BR-UM-20).

## Field-by-field spec

| Field | Editable | Validator | Backend field | Notes |
|---|---|---|---|---|
| `firstName` | YES | required · letters only · ≤50 chars · `[falconLettersDigitsMax]` | `UpdateUserProfileByIdRequest.FirstName` | [PRD] BR-UM-11 |
| `lastName` | YES | required · letters only · ≤50 chars · `[falconLettersDigitsMax]` | `UpdateUserProfileByIdRequest.LastName` | [PRD] BR-UM-11 |
| `userName` | **NO (immutable)** | display only | not sent | [PRD] BR-UM-19; backend rejects edits via `UnsupportedOperation` |
| `email` | YES (OTP gate) | required · regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` · OTP required before save | `UpdateUserProfileByIdRequest.Email` | [PRD] BR-UM-13 + BR-UM-21 (email/phone NOT both at once) |
| `phoneNumber` | YES (OTP gate) | required · digits-only length ≥7 · E.164 (FalconMobileNumberComponent internal validator) · OTP required | `UpdateUserProfileByIdRequest.PhoneNumber` | [PRD] BR-UM-14 |
| `nationalId` | YES | required · format TBD | `UpdateUserProfileByIdRequest.NationalId` | [PRD] silent on format constraint |
| `picture` | YES (upload OR delete) | MIME `image/*` · size ≤4 MB | `UpdateUserProfileByIdRequest.ProfilePictureInfo` (multi-part: extension + base64) OR `DeleteImage = true` | [PRD] BR-UM-16; [CODE] `user-profile.component.ts:801-823` |

## Cross-field rules

### BR-UM-21 — Email AND Phone cannot be edited in the same save

[PRD] `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:41`:

> Email and Phone cannot be edited in the SAME save request (only one at a time, each requiring OTP verification).

**FE enforcement:** if BOTH `emailChanged` AND `phoneChanged` are true, disable save and surface inline error. Old-UI does NOT enforce this client-side — flag as `GAP-UM-22` ([13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)).

**BE enforcement:** `UpdateUserProfileByIdEndpoint` validator must reject simultaneous email + phone diff with `FalconKeys.Error.User.EmailAndPhoneSimultaneousEdit` ([BRAIN-OUT] inferred; verify against `Brain Outputs/understanding/backend/identity/VALIDATIONS.md`).

### Email-changed detection ([CODE] `user-profile.component.ts:661-666` — `onEmailChange`)

```typescript
this.emailChanged =
  this.email.trim().toLowerCase() !== this.originalProfile.email.trim().toLowerCase();
```

### Phone-changed detection ([CODE] `user-profile.component.ts:671-675` — `onPhoneChange`)

```typescript
this.phoneChanged =
  this.phoneNumber.replace(/\D/g, '').replace(/^0+/, '') !==
  this.originalProfile.phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
```

> Phone comparison uses **digits-only**, leading zeros stripped — to avoid false positives when E.164 prefix changes shape.

## Verification gate

[CODE] `user-profile.component.ts:318-321 + 329-332`:

```typescript
get emailNeedsVerification(): boolean {
  return !this.emailVerified &&
         (this.emailChanged || !this.originalProfile?.emailVerified);
}

get phoneNeedsVerification(): boolean {
  return !this.phoneVerified &&
         (this.phoneChanged || !this.originalProfile?.phoneVerified);
}
```

The save button is **disabled** while either flag is true. Verification flips the flag via the OTP modal — see [05-SECTION_OTP_VERIFICATION](05-SECTION_OTP_VERIFICATION.md).

## UI shape

```
+----------------------------------+
| Personal Info | Role & Status | Permissions |
+----------------------------------+
|                                  |
|  [ Profile Picture Avatar ]      |
|   Upload | Delete                |
|                                  |
|  First Name *  [_______________] |
|  Last Name *   [_______________] |
|  Username      [user1234] (lock) |   ← immutable, gray
|                                  |
|  Email *       [a@b.com] [Verify]|   ← Verify button if !emailVerified
|  Phone *       [+966...]  [Verify]|
|  National Id   [_______________] |
|                                  |
|  [ Save ] [ Cancel ]             |
+----------------------------------+
```

The **Verify** chip beside email/phone fires the `ProfileOtpModal`. When verified, the chip becomes a green checkmark.

## Falcon component composition (NEW UI target)

| Element | Falcon component | Customization |
|---|---|---|
| Avatar | `<falcon-uploader>` | accept `image/*` · max 4 MB · base64 binding |
| First/Last Name | `<falcon-input>` | `[validators]="[required, lettersOnly, max(50)]"` |
| Username | `<falcon-input>` | `[disabled]="true"` · gray styling · lock icon prefix |
| Email | `<falcon-email-field>` | composite — input + Verify chip + ProfileOtpModal trigger |
| Phone | `<falcon-mobile-number>` | composite — E.164 + Verify chip + ProfileOtpModal trigger |
| National Id | `<falcon-input>` | basic |

NB: do NOT use PrimeNG `<p-inputtext>` / `<p-select>` in new UI ([F-016] Falcon UI Core supersedes PrimeNG). Old-UI uses PrimeNG `<p-input-group>` for the Verify chip layout — replace with `<falcon-input-group>` (or compose with Tailwind utility classes if no such Falcon component exists).

## Save payload mapping

Builds `UpdateUserProfileByIdRequest` from local form state + diff:

```typescript
const payload: UpdateUserProfileByIdRequest = {
  Id: this.userId,
  FirstName: this.firstName.trim(),
  LastName: this.lastName.trim(),
  PhoneNumber: this.phoneNumber.trim(),
  Email: this.email.trim().toLowerCase(),
  NationalId: this.nationalId.trim(),
  ProfilePictureInfo: this.profilePictureInfo,
  DeleteImage: this.deleteImage,
};
```

[INFERRED] Casing depends on Identity Service wire spec — Identity uses **camelCase** per its FRONTEND_CONTRACT (verify at `Brain Outputs/understanding/backend/identity/FRONTEND_CONTRACT.md`).

## See also

- [05-SECTION_OTP_VERIFICATION](05-SECTION_OTP_VERIFICATION.md) · [06-SECTION_PROFILE_PICTURE](06-SECTION_PROFILE_PICTURE.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [README](README.md)
