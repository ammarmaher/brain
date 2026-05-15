*** Validation V-password-complexity-per-security-level — Password complexity tier resolved per account security level ***
*** Origin: PRD-02 User Management · Backend: Identity (PasswordPolicy) · 2026-05-15 ***

# V-password-complexity-per-security-level — New password must satisfy the complexity tier set on the account's PasswordSecurityLevel (Normal / Advanced)

> Every password-write surface (auto-generation at create, first-login force-change, regular change-password, forgot-password set-password) re-runs the same `PasswordPolicy` domain class. The policy reads the account's `ePasswordSecurityLevel` and applies tier-specific length + character-class requirements. Bridges PRD-01 (where the level is configured) to PRD-02 (where it is consumed).

## Origin (PRD)

- **PRD:** [[02 User Management]] (consumer) ← [[01 Account Management]] (configurer)
- **Source files:**
  - [BUSINESS_RULES (PRD-02)](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — BR-UM-15, BR-UM-22, BR-UM-34, BR-UM-20
  - [BUSINESS_RULES (PRD-01)](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) — BR-AM-09 (origin of the level)
- **Rule ids:** `BR-UM-15` (auto-gen at create) + `BR-UM-22` (force-change after first login) + `BR-UM-34` (Change Password complexity) + `BR-UM-20` (user-owned, not admin-set)
- **PRD line reference:**
  - "Password is auto-generated; complexity follows account security level (Normal / Advanced)." (`latest-prd.md:52`)
  - "Current Password mandatory; New Password complexity per account security level; Confirm must match." (`latest-prd.md:87-89`)
  - "Password is owned by the user (via Change Password), never by admin edit." (`latest-prd.md:96`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** W1 Add User (auto-gen) · W2 First Login step 6 (force-change) · W4 Forgot Password step 5 · W5 Change Password steps 2-3
- **Open question:** `Q-UM-12` — vocabulary mismatch (PRD prose talks about Normal/Advanced; some Drive Drawings talk about Low/Medium/High). Canonical enum lives in Commerce.

## Backend enforcement

- **Service:** [[Identity Service]] (policy enforcer) reading the level from [[Commerce Service]] via tenant settings
- **Policy class:** `PasswordPolicy` at `Domain/Policies/PasswordPolicy.cs`
- **Validators that delegate to PasswordPolicy:**
  - `ChangePasswordRequestValidator.cs`
  - `SetPasswordRequestValidator.cs` (admin or force-change paths)
  - `ForgotPasswordSetPasswordRequestValidator.cs`
  - `FirstLoginSetupRequestValidator.cs`
- **Error codes:**
  - `FalconKeys.Error.InvalidPassword` (422) — generic policy fail
  - `FalconKeys.Error.PasswordTooShort` (422)
  - `FalconKeys.Error.PasswordRequiresUppercase` (422)
  - `FalconKeys.Error.PasswordRequiresLowercase` (422)
  - `FalconKeys.Error.PasswordRequiresDigit` (422)
  - `FalconKeys.Error.PasswordRequiresSpecialChar` (422)
  - `FalconKeys.Error.PasswordsDoNotMatch` — when Confirm field mismatches (Change Password / Forgot Password set-password)
  - `FalconKeys.Error.ChangePasswordFailed` (422) — current-password verify fail in `ChangePasswordRequest`
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — Auth Validators table + Domain-Level Policies (`PasswordPolicy` row)
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — User Lifecycle Errors section (Password*)
- **Tier resolution:** the level is read from Commerce tenant settings (`SettingsInfo.PasswordSecurityLevel` from `CreateAccountRequest`); the exact length/class thresholds per tier are NOT in the documented VALIDATIONS surface and live in the policy class — surface to [[GAPS_INDEX]] if the threshold values need to be locked.

## Frontend implementation hint

- **Form / page section:**
  - First Login force-change-password screen
  - Change Password screen (self-service)
  - Forgot Password new-password screen
  - Add User Tab 1 — `password` is auto-generated, not user-typed (BR-UM-15)
- **Suggested validator wiring:**
  - Fetch the tier from `/api/setting` (Commerce — endpoint `GET /Setting` per [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) `GetSettingsResponse`) on form open
  - Build a composite validator tied to the resolved tier:
    - `Normal` tier: `Validators.minLength(8)` + at least one of [upper, lower, digit] (**inferred** — confirm thresholds against `PasswordPolicy.cs`)
    - `Advanced` tier: `Validators.minLength(12)` + all four classes (upper/lower/digit/special) (**inferred**)
  - Cross-field: `passwordsMatch` validator on the FormGroup comparing `newPassword` ↔ `confirmPassword` → maps to `PasswordsDoNotMatch`
  - Use a strength meter component that shows each requirement as a passing/failing checklist row (matches the per-requirement error codes above)
  - On the Change Password screen, also include `currentPassword` field bound to `ChangePasswordRequest.CurrentPassword`
- **Page note:** First Login / Change Password / Forgot Password pages not yet seeded under `10-Pages/`

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — admins **cannot** set a user's password (BR-UM-20 + BR-UM-37). Self-service only. "Force-change" at first login is technically user-initiated.
- **Business rule cluster:**
  - [[02 User Management]] BR-UM-15 ↔ BR-UM-20 ↔ BR-UM-22 ↔ BR-UM-34 ↔ BR-UM-37 — five-rule cluster on password ownership + complexity
  - [[01 Account Management]] BR-AM-09 — origin of the tier
  - Sister validation: [[V-password-security-level-enum]]
- **Related learning events:** none yet
- **Open question:** `Q-UM-12` — Normal/Advanced vs Low/Medium/High vocabulary lock

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
