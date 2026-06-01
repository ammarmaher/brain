---
type: validation-rule
id: V-password-security-level-enum
prd: PRD-01
service: commerce
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-password-security-level-enum — Password Security Level enum membership ***
*** Origin: PRD-01 Account Management · Backend: Commerce + Identity · 2026-05-15 ***

# V-password-security-level-enum — Account Settings password security level must be Normal or Advanced

> The Account-level `PasswordSecurityLevel` selects which password complexity tier Identity later enforces on every user belonging to that account. Locking it to a closed enum keeps the per-account `PasswordPolicy` tier resolution deterministic.

## Origin (PRD)

- **PRD:** [[01 Account Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- **Rule id:** `BR-AM-09`
- **PRD line reference:** "Password Security Level is one of {Normal, Advanced}." (`latest-prd.md:43`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 2 — Account Settings (mandatory step). ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) §W1 step 2)
- **Open vocabulary question:** `Q-UM-12` in PRD-02 (password security vocabulary mismatch — Normal/Advanced vs Low/Medium/High; PRD-02 prose talks about complexity tiers but the canonical enum lives in Commerce).

## Backend enforcement

- **Service:** [[Commerce Service]] (source of truth for the enum) + [[Identity Service]] (consumer — applies `PasswordPolicy` per resolved tier)
- **DTO:** `CreateAccountRequest.Settings.PasswordSecurityLevel`
- **Attribute:** `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]`
- **Error codes:**
  - `FalconKeys.Error.RequiredFieldMissing` (400) — missing
  - `FalconKeys.Error.InvalidValue` (422) — value outside `ePasswordSecurityLevel` set
- **Source files:**
  - [VALIDATIONS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — `CreateAccountRequest.Settings.PasswordSecurityLevel`
  - [ERRORS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — 400 + 422 sections
  - [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `SettingsInfo` nested type + `ePasswordSecurityLevel` in Domain Enums list
- **Downstream consumer:** Identity `PasswordPolicy` domain class in `Domain/Policies/PasswordPolicy.cs` — translates tier into length/uppercase/lowercase/digit/special-char requirements (see [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md), Domain-Level Policies section)

## Frontend implementation hint

- **Form / page section:** Add Client wizard — Step 2 (Account Settings) — `password-security-level` dropdown. Also editable in [[Organization Hierarchy]] `settings-tab-edit-mode` section.
- **Suggested validator wiring:**
  - `Validators.required` → maps to `RequiredFieldMissing`
  - Custom enum-membership validator wired to a shared `ePasswordSecurityLevel` TS enum imported from `@falcon/sdk` (or generated DTO module) — maps to `InvalidValue`
  - Dropdown options sourced from the same enum (single source of truth — never hand-list options in the template)
- **Page note:** [[Organization Hierarchy]] (Add Client wizard sub-page not yet seeded; Settings tab is part of the Org Hierarchy page)

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — "Edit Password Security Level on Root/Main" is Falcon-only with Operation = Not Allow (per W7 workflow text)
- **Business rule cluster:**
  - [[01 Account Management]] BR-AM-09 (enum) ↔ BR-AM-11 (account limits — same Step 2)
  - [[02 User Management]] BR-UM-15 + BR-UM-22 + BR-UM-34 (downstream: every user create/login/change-password applies the resolved tier)
- **Related learning events:** none yet

## Tags

#type/v-rule #status/triangulated #prd/01 #prd/02 #service/commerce #service/identity #severity/medium #security

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
