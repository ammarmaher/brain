*** Validation V-username-format-uniqueness-immutable — Username starts with letter, ≤30 chars, unique, immutable after create ***
*** Origin: PRD-02 User Management · Backend: Identity · 2026-05-15 ***

# V-username-format-uniqueness-immutable — Username must start with a letter, ≤30 chars, unique system-wide, mandatory, and immutable after create

> Username is the stable identifier used across login, Forgot Password (Username + Phone), credential delivery, and Zitadel binding. PRD locks it on three axes: format (letter-prefix + 30-char cap), uniqueness (system-wide), and immutability (cannot change after create — neither admin nor self can edit).

## Origin (PRD)

- **PRD:** [[02 User Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md)
- **Rule ids:** `BR-UM-12` (format + uniqueness) + `BR-UM-19` (immutability) + `BR-UM-37` (non-editable by admin)
- **PRD line reference:**
  - "Username: <=30 chars, starts with a letter, unique across system, mandatory." (`latest-prd.md:49`)
  - "Username is **immutable** after create." (`latest-prd.md:96`)
  - "Non-editable personal fields (admin): Username (ever), Password (user-owned)." (`latest-prd.md:96`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Add User Tab 1 (W1) — created. W6 Edit User + W7 Edit Own Profile — Username is read-only.

## Backend enforcement

- **Service:** [[Identity Service]]
- **DTO:** `CreateUserRequest.PersonalInfo.UserName`
- **Validator:** `CreateUserRequestValidator.cs`
- **FluentValidation rules:**
  - `RuleFor(x => x.PersonalInfo.UserName).NotEmpty()` → `RequiredFieldMissing`
  - `.MaximumLength(100)` → `MaxLengthExceeded` (**backend cap is 100, PRD cap is 30** — see SoT surprise below)
  - `.Matches(StartsWithLetter)` → `UsernameMustStartWithLetter`
- **Uniqueness check:** handler-level — throws `DuplicateUsername` (409)
- **Immutability:** there is no DTO field for renaming a username — `UpdateUserProfileRequest` simply does not expose it. Any attempt to change Username flows through Profile edit and is silently dropped (or `NoChangesToUpdate` if it was the only field touched).
- **Error codes:**
  - `FalconKeys.Error.RequiredFieldMissing` (400)
  - `FalconKeys.Error.MaxLengthExceeded` (400)
  - `FalconKeys.Error.UsernameMustStartWithLetter` (400)
  - `FalconKeys.Error.DuplicateUsername` (409)
  - `FalconKeys.Error.InvalidUserExistQuery` (400) — empty Username sent to `/user/exist`
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — User Validators, `CreateUserRequestValidator` row
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — User Lifecycle Errors + Validation Errors sections
  - [ERRORS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — same `DuplicateUsername` + `UsernameMustStartWithLetter` codes surface here too (Account Step 5 path)

**SoT surprise (honest call):** PRD says `<= 30 chars`, but the documented FluentValidation rule in [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) is `MaximumLength(100)`. **Backend is more lenient than PRD.** Surface to [[GAPS_INDEX]] — either (a) tighten the Max to 30 to match PRD, or (b) confirm 100 was an intentional buffer for Zitadel external-id format. The frontend should still apply 30 (the PRD cap) to keep behavior consistent.

## Frontend implementation hint

- **Form / page section:**
  - Add User wizard — Tab 1 (Personal Information) — `username` input (write-only at create)
  - Add Client wizard — Step 5 (Account Owner) — same input (reused)
  - Edit User + Edit Own Profile — `username` field is **read-only** / `disabled` / shown as plain text
- **Suggested validator wiring (create only):**
  - `Validators.required` → `RequiredFieldMissing`
  - `Validators.maxLength(30)` → PRD cap (tighter than backend's 100)
  - `Validators.pattern(/^[A-Za-z]/)` → maps to `UsernameMustStartWithLetter`
  - Async uniqueness check via Identity `POST /user/exist` (confirm endpoint name in [ENDPOINT_REGISTRY (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md)) — returns `ExistResponse { bool Exists }`. Debounce 300 ms; map a true result to a custom `usernameTaken` validator error.
- **Edit form behavior:** the `username` form control must be omitted from the FormGroup entirely OR set as `{ disabled: true }` so it doesn't reach the patch endpoint
- **Page note:** Add User wizard page not yet seeded under `10-Pages/`

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — Add User permission per role
- **Business rule cluster:**
  - [[02 User Management]] BR-UM-12 (create-time) ↔ BR-UM-19 (immutability) ↔ BR-UM-37 (admin cannot edit) — three-rule cluster pinned to Username
  - [[01 Account Management]] BR-AM-19 (Step 5 creates Account Owner — username flows through identical validator) — same constraint applies via shared `CreateUserRequest`
- **Related learning events:** none yet

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
