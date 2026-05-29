---
type: validation-rule
id: V-account-name-format-xlsx-2026-05-24
prd: PRD-01
service: commerce
severity: high
status: triangulated
drift: false
created: 2026-05-24
xlsx: Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx (snapshot of Downloads/Validations.xlsx)
supersedes: [V-account-name-format-uniqueness]
module: account-mgmt
feature: add-client
verification: runtime
last-verified: 2026-05-24
tags: ["#status/triangulated", "#module/account-mgmt", "#verification/runtime", "#layer/fe"]
up: "[[V-rules-MOC]]"
parent: "[[V-rules-MOC]]"
superseded-by: []
evidence-link: project_validation_xlsx_sot_flip_wave_f_2026_05_24.md
---
*** Validation V-account-name-format-xlsx-2026-05-24 — Account Name per new xlsx SoT ***
*** Origin: Validations.xlsx 2026-05-24 (declared SoT by Ammar) · Commerce · 2026-05-24 ***

# V-account-name-format-xlsx-2026-05-24 — Account Name per new Validations.xlsx (SoT, supersedes PRD)

> SoT-flip. Ammar declared `C:\Users\User\Downloads\Validations.xlsx` (snapshot kept at `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx`) the single source of truth for Add Client + Add User validation in Falcon. PRD BR-AM-03 ("must start with a letter") is **superseded**. The prior V-rule [[V-account-name-format-uniqueness]] is **superseded** by this note.

## Origin (xlsx — Source of Truth)

- **xlsx source:** `[XLSX] Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx` sheet `Add Client - Step 1` + master `Fields Validations`
- **Mandatory:** Yes
- **Length:** (2-30) Char
- **Unique:** in the system (async)
- **Allowed Content:** "Letters and digits Only"
- **Allowed Special Char:** `Space between words | & | Allow apostroph | Allow hyphens`
- **Lang:** AR & EN
- **Valid Sample:** `Falcon Corp`
- **Invalid Sample:** `Falcon@Corp`
- **Error Message:** `Account name already exists | Invalid characters`
- **Business Rules:** "Can start with anything allowed. Can end with anything allowed."

## SUPERSEDED rules (do not re-introduce)

- ❌ "Account Name must START with a letter" (PRD BR-AM-03, prior V-rule) — Ammar explicitly removed this 2026-05-24. New rule: ANY allowed char may start the value.
- ❌ Strict `LETTERS_ONLY = /^[\p{L}\p{N}]+$/u` — replaced by `ACCOUNT_NAME_CHARSET = /^[\p{L}\p{N} &'\-]+$/u` (adds space + & + apostrophe + hyphen).

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateAccountRequest.Info.AccountName`
- **Attribute:** `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]`
- **Error codes:** `AccountNameRequired` (400) · `MaxLengthExceeded` (400) · `AccountNameTooLong` (400) · `DuplicateTenantName` (409)
- **Backend gap:** still no FluentValidation regex for the charset. FE is the sole enforcer of the new (relaxed) charset just as it was the sole enforcer of the prior (strict) one.

## Frontend implementation

- **Validator:** `accountNameValidator` at [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:358-388` (Wave F 2026-05-24 rewrite). Emits `{ accountNameCharset: true }` on invalid character + `{ required: true }`, `{ minLength }`, `{ maxLength }`, `{ duplicateAccountName }` (async).
- **i18n key:** `hierarchy.validation.accountNameCharset` — en: "Allowed: letters, digits, spaces, &, apostrophe, hyphen" · ar: "مسموح: أحرف، أرقام، مسافات، &، علامة اقتباس، شرطة".
- **Async uniqueness:** unchanged — `accountNameUniqueValidator` against `GET /commerce/Node/ValidateAccountName?AccountName=` with debounce 300ms + self-edit short-circuit.
- **Test coverage:** 24 cases in `tools/validation-tests/add-client-validations.test.ts` `accountNameCases`. New positive cases include "Falcon Corp", "O'Brien", "Smith-Jones", "A&B Co", "1abc" (all valid). New negative cases include "Falcon@Corp" (xlsx invalid sample), "@abc", "a!b".

## Wiring sites (unchanged)

- [CODE] `apps/admin-console/.../client-information-step/validations/validations.ts` — Add Client Step 1 row 1.
- [CODE] `apps/admin-console/.../falcon-org-info-panel/validations/validations.ts` — Info Panel mirror (admin).
- [CODE] `apps/management-console/.../falcon-org-info-panel/validations/validations.ts` — Info Panel mirror (mgmt). For mgmt the rule runs only when `includeFalconOnly=true`; Account Owner sessions read the field as readonly.

## Cross-domain links

- **Sister rule:** [[V-username-format-xlsx-2026-05-24]] — username dropped starts-with-letter at the same time.
- **Sister rule:** [[V-person-name-format-xlsx-2026-05-24]] — First/Last Name relaxed to allow space + apostrophe + hyphen at the same time.
- **Superseded predecessor:** [[V-account-name-format-uniqueness]] — kept for archival provenance only.
- **Business rule cluster:** [[01 Account Management]] BR-AM-03 (now historical only).

## Tags

#type/v-rule #status/triangulated #prd/01 #service/commerce #severity/high #xlsx-sot-2026-05-24 #wave/f #supersedes-prd

## Hubs

- [[VALIDATION_INDEX]] · [[Commerce Service]] · [[Add Client Flow]] · [[AMMAR_BRAIN_HOME]]
