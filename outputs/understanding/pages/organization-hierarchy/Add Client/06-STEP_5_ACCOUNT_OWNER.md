*** Add Client — Step 5 Account Owner ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Step 5 — Account Owner user (MANDATORY) — TRIGGERS COMPOSITE SUBMIT

**Source-of-truth references**
- PRD-01: BUSINESS_RULES `BR-AM-19` (Step 5 creates AO user, mandatory).
- PRD-01: WORKFLOWS §W1 step 5 (`latest-prd.md:53-54`).
- PRD-02: WORKFLOWS §W1 (Add User 3-tab wizard — Step 5 of Add Client is a degenerate case of the Add User flow with role pre-set to `account-owner`).
- PRD-02: ENTITIES `User` row.
- Backend: `CreateAccountRequest.AccountOwner` (nested) + top-level `DeliveryMethod`.
- Entity reconciliation: [[E-user]].

**Screen / section**
- Wizard step 5 panel — single-form layout, 2-column responsive Tailwind grid.
- Final action button: **Submit** (not "Next"). On submit, the composite `CreateAccountRequest` is built from Steps 1-5 and POSTed to Commerce.

## Fields

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Profile Picture | uploader ([[Falcon Single Uploader]]) | PRD-02 BR-UM-14: optional profile pic on Add User | `AccountOwner.AccountOwnerProfilePictureInfo?` (`{ Extension, FileBase64String }`) | — | Optional. Same image constraints as Step 1 picture (1024 KB, jpg/png/webp/jpeg/gif/bmp/x-icon). | — |
| 2 | First Name | text input ([[Falcon Input]]) | PRD-02 BR-UM-11: ≤50, letters only, mandatory | `AccountOwner.FirstName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | `Validators.required` + `Validators.maxLength(50)` + `Validators.pattern(/^[A-Za-z؀-ۿ]+$/)` (letters + Arabic Unicode). Backend errors: `FirstNameLettersOnly` (400), `MaxLengthExceeded` (400). | ⚠ Open: spaces/hyphens/apostrophes allowed? PRD silent. |
| 3 | Last Name | text input ([[Falcon Input]]) | PRD-02 BR-UM-11 | `AccountOwner.LastName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | Same as First Name. Backend error: `LastNameLettersOnly` (400). | Same as above. |
| 4 | Username | text input ([[Falcon Input]]) | PRD-02 BR-UM-12/19/37: ≤30, starts with letter, unique system-wide, mandatory, **immutable after create** | `AccountOwner.UserName` `[ThrowIfNotPassed]` | [[V-username-format-uniqueness-immutable]] | `Validators.required` + `Validators.maxLength(30)` (**PRD cap; backend FluentValidation cap is 100 — be tighter than backend**) + `Validators.pattern(/^[A-Za-z]/)`. Async uniqueness via Identity `POST /api/user/exist` → `ExistResponse { bool Exists }`. Debounce 300 ms. Backend errors: `UsernameMustStartWithLetter` (400), `DuplicateUsername` (409). | ⚠ HIGH DRIFT — backend cap 100 vs PRD 30; FE enforces 30. |
| 5 | National ID | text input ([[Falcon Input]]) | Optional per backend DTO | `AccountOwner.NationalId?` (string) | — | Optional. PRD silent on format; Saudi NID is 10 digits — apply `Validators.pattern(/^\d{10}$/)` as safe default. | — |
| 6 | Phone Number | phone field ([[Falcon Phone Field]] or [[Falcon Mobile Number]]) | PRD-02 mandatory | `AccountOwner.PhoneNumber` (string) — **no `[ThrowIfNotPassed]` despite required** (handler validates) | — | `Validators.required` (despite backend gap — PRD says mandatory). E.164 / Saudi format validation via the component's built-in validator. Backend error: `InvalidPhoneNumber` (400). | ⚠ DRIFT — DTO attribute missing on required field. |
| 7 | Email | email field ([[Falcon Email Field]]) | PRD-02 mandatory | `AccountOwner.EmailAddress` (string) — **no `[ThrowIfNotPassed]` despite required** | — | `Validators.required` + `Validators.email` (FE-side strictness). | ⚠ DRIFT — DTO attribute missing on required field. |
| 8 | Role | dropdown ([[Falcon Dropdown]]) — should be locked to `account-owner` per BR-AM-19 | PRD-01 BR-AM-19: Step 5 creates the Account Owner | `AccountOwner.Role` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]` | — | **Pre-set to `account-owner` and shown as read-only** (PRD says this step creates the AO; offering the dropdown invites operator error). If the implementation chooses to show all options, restrict to AO-compatible values (`account-owner` only at this stage). Backend errors: `RequiredFieldMissing` (400), `InvalidValue` (422). | — |
| 9 | Password | not collected here — auto-generated server-side per `ePasswordSecurityLevel` from Step 2 | PRD-02 BR-UM-15: auto-generated; complexity follows account security level | `AccountOwner.Password?` (optional — generated if not supplied) | [[V-password-complexity-per-security-level]] | **Do not render a password input on this form.** Backend auto-generates using `PasswordPolicy` tier resolved from Step 2's `PasswordSecurityLevel`. Show an info banner: "An initial password will be generated and delivered to the Account Owner via the selected channel below." | — |
| 10 | Delivery Method | dropdown / radio group ([[Falcon Dropdown]] or [[Falcon Radio Group]]) — Email / SMS / Both | PRD-02 W1 confirmation dialog | `CreateAccountRequest.DeliveryMethod` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]` (**top-level**, not nested in `AccountOwner`) | — | `Validators.required` + enum-membership. | — |

> **No password input in this step.** Per Step 2's `PasswordSecurityLevel`, the server auto-generates the AO's initial password using `PasswordPolicy(level)` and delivers it via the selected `DeliveryMethod`. Do not surface a password field — see [[V-password-complexity-per-security-level]].

## Step 5 cross-field validation contract

- `RequiredFieldMissing` (400) on any missing `FirstName / LastName / UserName / Role / DeliveryMethod`.
- `DuplicateUsername` (409) — surfaced on submit if async pre-check missed a race.

## SUBMIT — the composite POST

When Step 5 Submit is clicked, the wizard:

1. **Composes** `CreateAccountRequest` from all 5 steps' buffered state.
2. **POSTs** to `POST /api/Node/create-account` via the System Gateway (`POST <system-gateway>/commerce/Node/create-account` — gateway strips `/commerce` prefix and prepends `/api/`).
3. **Receives** `ServiceOperationResult<CreateAccountResponse>` (PascalCase JSON per Commerce — confirm against [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

**Composite payload shape** (per `CreateAccountRequest`):
```jsonc
{
  "Info": { /* Step 1 — ~20 fields, see Step 1 table */ },
  "Settings": {
    "PasswordSecurityLevel": <int>,       // ePasswordSecurityLevel enum value
    "AllowedIPs": ["..."],                // optional list
    "MaxNormalUserLimit": 0,
    "MaxSystemUserLimit": 0,
    "MaxNodeLevel": 0,                    // singular per backend
    "BalanceTransferLimit": 0
  },
  "CommChannels": {                        // optional — omit if Step 3 untouched
    "Services": [
      { "AppId": "<channelId>", "PriceType": <int> /* + PriceValue per DTO drill-down */ }
    ]
  },
  "Applications": {                        // optional — omit if Step 4 untouched
    "Services": [
      { "AppId": "<appId>", "PriceType": <int> /* + PriceValue */ }
    ]
  },
  "AccountOwner": {
    "AccountOwnerProfilePictureInfo": null,
    "FirstName": "...",
    "LastName": "...",
    "UserName": "...",
    "Password": null,                      // auto-generated if not supplied
    "NationalId": null,
    "PhoneNumber": "...",
    "EmailAddress": "...",
    "Role": <int>                          // eUserRoles enum value (account-owner)
  },
  "DeliveryMethod": <int>                  // eDeliveryMethod enum value
}
```

**Casing note:** Commerce uses PascalCase on the wire per `FRONTEND_CONTRACT.md` (deviation from Identity / Contact Group / Templates which use camelCase). The frontend's HttpClient interceptor or DTO module must serialize with PascalCase property names for Commerce calls. **Verify at runtime** — `Microsoft.AspNetCore.Mvc.JsonOptions` may default to camelCase in .NET 6+ without explicit config; check the live response shape and adjust.

## Server-side effects on success (Kafka chain)

When `POST /api/Node/create-account` returns 200 with `IsSuccessful: true`, the Commerce handler `CreateMainNodeProcess` triggers a multi-service Kafka chain — full details in [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md). Headline: `commerce.user-creation-requested.v1` → [[Identity Service]] creates the Zitadel user, applies the password policy from Step 2's level, sends credentials per `DeliveryMethod`.

## Account status after creation

See [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) for the full state machine. Headline: AO User starts at `Pending` per PRD-02 BR-UM-09 (Pending → Active on first successful login + force-change-password per W2).

## Permission gate

- Same as overall flow. See [01-PERMISSIONS](01-PERMISSIONS.md).

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[02 User Management]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[V-user-first-last-name-letters-only]] · [[V-username-format-uniqueness-immutable]] · [[V-password-complexity-per-security-level]] · [[E-user]] · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Email Field]] · [[Falcon Phone Field]] · [[Falcon Mobile Number]] · [[Falcon Single Uploader]] · [[Falcon Password]] · [[Falcon Radio Group]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
