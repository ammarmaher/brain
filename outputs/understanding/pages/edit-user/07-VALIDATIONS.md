*** Edit User — Validations ***
*** SoT for all V-rules · 2026-05-17 ***

# Edit User — Validations

> Frontend + backend validator inventory. Source-of-truth for V-rule wiki-links.

## V-rule mapping

| V-rule | PRD line | FE Directive | BE Attribute | Notes |
|---|---|---|---|---|
| `V-user-first-last-name-letters-only` | BR-UM-11 | `[falconLettersDigitsMax]` (letters only · ≤50) | `[Required, MaxLength(50), Letters]` | Applied per Personal Info field |
| `V-username-format-uniqueness-immutable` | BR-UM-12 + BR-UM-19 | Display-only here · validated in Add User wizard | BE rejects ANY change in `UpdateUserProfileByIdEndpoint` validator | Edit User never sends `userName` |
| `V-email-valid-format` | BR-UM-13 | regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` | `FluentValidator.Email()` | [CODE] `user-profile.component.ts:362-365` |
| `V-phone-valid-format` | BR-UM-14 | `<falcon-mobile-number>` E.164 validator · digits ≥7 | `[Phone]` or custom regex | [CODE] `user-profile.component.ts:371-373` |
| `V-email-or-phone-not-both` | BR-UM-21 | **GAP-UM-22 — not enforced FE** | TBD — likely `EmailAndPhoneSimultaneousEdit` error | Must add FE guard |
| `V-otp-required-on-email-change` | BR-UM-36 | `emailNeedsVerification` gate disables save | BE rejects if `EmailChanged && !EmailVerified` | [CODE] `user-profile.component.ts:318-321` |
| `V-otp-required-on-phone-change` | BR-UM-36 | `phoneNeedsVerification` gate | Same | [CODE] `user-profile.component.ts:329-332` |
| `V-status-transition-allowed` | BR-UM-08 | **Old-UI does not enforce** — relies on BE | BE: `UnauthorizedStatusTransition` | New UI must filter dropdown options |
| `V-role-change-allowed` | BR-UM-38 + PES | `userRole.other(src,tgt)` filters dropdown | BE: PES re-check + limit-check | [CODE] `user-profile.component.ts:1162-1183` |
| `V-normal-user-limit-on-role-change` | BR-UM-38 | (none) | BE: `NormalUserLimitReached` | Enforced at PUT `/api/user/{id}/role` |
| `V-profile-picture-mime` | BR-UM-16 + BR-UM-48 OPEN | `file.type.startsWith('image/')` | BE size + MIME check (verify) | [CODE] `user-profile.component.ts:806-810` |
| `V-profile-picture-size-4mb` | BR-UM-48 OPEN | `file.size <= 4 * 1024 * 1024` | BE harder cap TBD | [CODE] `user-profile.component.ts:811-816` |
| `V-national-id-format` | (silent in PRD) | (none in old-UI) | TBD | Flagged as Q-UM-NATID |

## Form structure (template-driven NgForm — anti-pattern per F-022)

[CODE] old-UI uses **template-driven `NgForm`** with `ngModel` bindings ([CODE] `user-profile.component.ts` ViewChild `personalForm: NgForm`). Stack new-UI on **Reactive Forms** (`FormBuilder`/`FormGroup`) per Falcon doctrine.

## Async validators

### Username uniqueness — N/A for Edit User

Edit User does NOT validate username because [PRD] BR-UM-19 makes it immutable. The async check exists only in the Add User wizard ([CODE] `personal-information-step.component.ts` `[falconCheckExists]`).

### Email/phone uniqueness — NOT REQUIRED (per PRD BR-UM-13/14: "may be duplicated across usernames")

> So Edit User does NOT do an async uniqueness check on email or phone — only format validation.

## Save-disabled getter

[CODE] `user-profile.component.ts:343` (`isSaveDisabled`):

```typescript
get isSaveDisabled(): boolean {
  if (!this.firstName?.trim()) return true;
  if (!this.lastName?.trim()) return true;
  if (!this.userName?.trim()) return true;        // displayed but immutable; trims to non-empty
  if (!this.emailValid) return true;
  if (!this.phoneValid) return true;
  if (this.emailNeedsVerification) return true;
  if (this.phoneNeedsVerification) return true;
  // [MISSING in old-UI:] BR-UM-21: email AND phone changed simultaneously → reject
  return false;
}
```

## Cross-field rules

| Rule | Source | FE | BE |
|---|---|---|---|
| Email AND Phone NOT both at once | BR-UM-21 | **MISSING (GAP-UM-22)** | TBD endpoint validator |
| Status to Active for Normal User → re-check MaxNormalUserLimit | BR-UM-09 + BR-UM-38 | (cannot check — limit is server-state) | YES at PUT `/api/user/status` |
| Role to Normal User → re-check MaxNormalUserLimit | BR-UM-38 | (cannot check) | YES at PUT `/api/user/{id}/role` |
| Deleted → Active restoration | BR-UM-08 (Falcon-only) | FE: filter dropdown by `session.userType === 'Falcon'` | BE: PES + status guard |

## Validator service injection

[CODE] `personal-information-step.component.ts:35-50`:

```typescript
constructor(
  public accountValidationService: AccountValidationService,
  private cdr: ChangeDetectorRef,
) {
  this.checkUsernameExists = (username: string) =>
    this.accountValidationService.isUserExist(
      username.trim().toLowerCase(),
      this.wizardState.model.personalInfo.email,
      this.wizardState.model.personalInfo.phoneNumber,
    );
}
```

For Edit User, the equivalent service call would be omitted (username immutable).

## Falcon validation registry

| Rule slot | Token | Default impl |
|---|---|---|
| Email pattern | `FALCON_PATTERNS.EMAIL_STRING` | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
| Letters max | `[falconLettersDigitsMax]` directive | letter+space + max length param |
| Username format | `[falconUsernameFormat]` | starts with letter, alphanumeric+underscore, ≤30 |
| Check exists | `[falconCheckExists]` async directive | wraps consumer-supplied async fn |
| OTP defaults | `OTP_DEFAULTS` | `LENGTH=6, EXPIRY_SECONDS=120` |

## See also

- [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) · [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [12-ERROR_STATES](12-ERROR_STATES.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
