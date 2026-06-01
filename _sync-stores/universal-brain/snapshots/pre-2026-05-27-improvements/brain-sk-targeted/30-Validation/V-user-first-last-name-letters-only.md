---
type: validation-rule
id: V-user-first-last-name-letters-only
prd: PRD-02
service: identity
severity: medium
status: SUPERSEDED
drift: false
created: 2026-05-15
superseded-by: V-person-name-format-xlsx-2026-05-24
superseded-on: 2026-05-24
---

> [!warning] SUPERSEDED 2026-05-24 — Ammar declared `Validations.xlsx` the new SoT. First/Last Name now **allows space + apostrophe + hyphen** in addition to letters/digits. See **[[V-person-name-format-xlsx-2026-05-24]]**. This note is kept for archival provenance only.

*** Validation V-user-first-last-name-letters-only — First/Last Name ≤50 chars, letters only (HISTORICAL) ***
*** Origin: PRD-02 User Management · Backend: Identity · 2026-05-15 ***

# V-user-first-last-name-letters-only — Add User First/Last Name capped at 50 chars and letters-only

> First and Last Name are stored as single-language strings on the Identity user record (no `MultiLanguageName(En,Ar)` — intentional, per Identity service deviation note). PRD locks them to ≤ 50 chars and letters-only — no digits, no special characters — so admin search and credential-delivery messaging stay clean.

## Origin (PRD)

- **PRD:** [[02 User Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md)
- **Rule id:** `BR-UM-11`
- **PRD line reference:** "First Name + Last Name: <=50 chars, letters only, mandatory." (`latest-prd.md:47-48`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Add User wizard — Tab 1 Personal Information (W1 step 1). Also editable in W6 Edit User (admin) + W7 Edit Own Profile.

## Backend enforcement

- **Service:** [[Identity Service]]
- **DTO:** `CreateUserRequest.PersonalInfo` (`FirstName`, `LastName`)
- **Validator:** `CreateUserRequestValidator.cs` (`Falcon.Identity.Api/Endpoints/Users/Validators/`)
- **FluentValidation rules:**
  - `RuleFor(x => x.PersonalInfo).NotNull()`
  - `RuleFor(x => x.PersonalInfo.FirstName).NotEmpty()` → `RequiredFieldMissing`
  - `.MaximumLength(50)` → `MaxLengthExceeded`
  - `.Matches(LettersOnly)` → `FirstNameLettersOnly`
  - Same triad on `LastName` → `LastNameLettersOnly`
- **Error codes:**
  - `FalconKeys.Error.RequiredFieldMissing` (400) — empty
  - `FalconKeys.Error.MaxLengthExceeded` (400) — > 50 chars
  - `FalconKeys.Error.FirstNameLettersOnly` (400) — non-letter chars in First Name
  - `FalconKeys.Error.LastNameLettersOnly` (400) — non-letter chars in Last Name
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — User Validators table, `CreateUserRequestValidator` row
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — Validation Errors section
  - Same `FirstNameLettersOnly` / `LastNameLettersOnly` codes also surface in Commerce's catalog (see [ERRORS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) 400 section) because Account Step 5 reuses the User validation

**Cross-service note:** the regex `LettersOnly` constant lives in Identity validators; PRD does not specify whether spaces, hyphens, or apostrophes are allowed. Surface to [[GAPS_INDEX]] if a user with `O'Brien` or `Mary Ann` is rejected.

## Frontend implementation hint

- **Form / page section:**
  - Add User wizard — Tab 1 (Personal Information) — `first-name` + `last-name` inputs
  - Add Client wizard — Step 5 (Account Owner) — same field group (reused)
  - Edit User page (admin + self) — same Personal block
- **Suggested validator wiring:**
  - `Validators.required` → maps to `RequiredFieldMissing`
  - `Validators.maxLength(50)` → maps to `MaxLengthExceeded`
  - `Validators.pattern(/^[A-Za-z؀-ۿ]+$/)` — letters only including Arabic Unicode block; **inferred** PRD intent (PRD silent on Arabic). Confirm against the backend `LettersOnly` regex.
- **Page note:** Add User wizard page not yet seeded under `10-Pages/`. Add Client wizard Step 5 is part of the Org Hierarchy → Add Client flow.

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — Add User permission per role; Self-edit allowed only on own profile (W7)
- **Business rule cluster:**
  - [[02 User Management]] BR-UM-11 ↔ BR-UM-12 ↔ BR-UM-13 ↔ BR-UM-14 (Tab 1 field rules)
  - BR-UM-36 ↔ BR-UM-41 (admin vs self edit scopes)
- **Related learning events:** none yet

## Tags

#type/v-rule #status/triangulated #prd/02 #service/identity #severity/medium #security

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
