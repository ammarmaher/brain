*** Validation V-normal-user-limit-enforcement — Normal-User account-limit gate ***
*** Origin: PRD-02 User Management · Backend: Identity (UserQuotaPolicy) reads Commerce limit · 2026-05-15 ***

# V-normal-user-limit-enforcement — Adding or activating a Normal User must not exceed account.MaxNormalUserLimit

> The Normal-User cap is owned by Account Settings (BR-AM-11) and enforced at multiple Identity entry points: create user (Tab 1 save), role change to Normal User, and any Status transition to Active for a Normal User. Pending/Active/Suspended/Locked all count toward the cap; Deleted does NOT count.

## Origin (PRD)

- **PRD:** [[02 User Management]] (enforcer) ← [[01 Account Management]] (data owner)
- **Source files:**
  - [BUSINESS_RULES (PRD-02)](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — BR-UM-07, BR-UM-09, BR-UM-17, BR-UM-38
  - [BUSINESS_RULES (PRD-01)](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) — BR-AM-11 (data origin)
- **Rule ids:** `BR-UM-07` (status counting) + `BR-UM-09` (status→Active gate) + `BR-UM-17` (create gate) + `BR-UM-38` (role-change re-validation)
- **PRD line reference:**
  - "Pending, Active, Suspended, Locked all count toward the account's Normal-User limit; Deleted does NOT count." (`latest-prd.md:34-40`)
  - "If role is Normal User and the account has reached its Normal-User limit -> reject." (`latest-prd.md:62-63`)
  - "When changing to Active for a Normal User, enforce account Normal-User limit." (`latest-prd.md:42`)
  - "Role is editable; changing to Normal User re-validates the Normal-User limit." (`latest-prd.md:99-100`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** W1 Add User step 4 save · W6 Edit User (role change) · W8 Status Change

## Backend enforcement

- **Service:** [[Identity Service]] (policy enforcer) reading account-limit data sourced from [[Commerce Service]] (data owner)
- **Policy class:** `UserQuotaPolicy` at `Domain/Policies/UserQuotaPolicy.cs`
- **Entry points where the policy runs:**
  - `CreateUserRequest` handler — on save with `Role = NormalUser`
  - `UpdateUserRoleByIdRequest` handler — when target role is `NormalUser`
  - `ChangeUserStatusRequest` handler — when target status is `Active` AND the user role is `NormalUser`
- **Error codes:**
  - `FalconKeys.Error.NormalUserLimitReached` (422)
  - Surfaces in both Identity AND Commerce catalogs (Commerce uses the same code when Account Step 5 fails)
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — Domain-Level Policies table, `UserQuotaPolicy` row
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — User Status Errors section
  - [ERRORS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — 422 section
  - Cap source: `SettingsInfo.MaxNormalUserLimit` (see [V-account-limits-zero-means-no-limit])
- **Counting rule:** Identity counts users whose `status ∈ {Pending, Active, Suspended, Locked}` (Deleted excluded — `BR-UM-07`)

## Frontend implementation hint

- **Form / page section:**
  - Add User wizard — Tab 1 save action (catch on response, not pre-empt)
  - Edit User — Role dropdown change to "Normal User" (pre-flight warning is **inferred** UX — show "this will count against the X/Y Normal User cap")
  - User Status dropdown → Active for Normal User
- **Suggested validator wiring:**
  - **No purely client-side validator** can enforce this — the cap and current usage are server state.
  - Optional pre-flight: a `GET /api/user/count?tenantId=...&role=NormalUser` request (Identity endpoint **inferred** from `GetUserCountRequest` DTO present in [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md)) to display "12 / 50 Normal Users" badge next to the role dropdown
  - On 422 `NormalUserLimitReached` response: surface the localized message via the standard error toast / inline form error — DO NOT silently swallow
- **Page note:** Add User wizard page not yet seeded under `10-Pages/`; Edit User page also not yet seeded.

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — Add User / Edit User / Change Status permissions per role
- **Business rule cluster:**
  - [[02 User Management]] BR-UM-07 (counting) ↔ BR-UM-09 (status→Active) ↔ BR-UM-17 (create) ↔ BR-UM-38 (role change) — four-rule cluster all bound to the same cap
  - [[01 Account Management]] BR-AM-11 + BR-AM-12 — Commerce owns the cap (`MaxNormalUserLimit`), separate from `MaxSystemUserLimit`
  - Sister validation: [[V-account-limits-zero-means-no-limit]]
- **Related learning events:** none yet
- **Open question:** `BR-AM-39` — what happens when an admin shrinks the cap below current usage is silent in PRD

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
