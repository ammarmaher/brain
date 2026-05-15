*** Validation V-account-name-format-uniqueness — Account Name format + uniqueness ***
*** Origin: PRD-01 Account Management · Backend: Commerce · 2026-05-15 ***

# V-account-name-format-uniqueness — Account Name must be unique, ≤30 chars, start with a letter, mandatory

> Falcon hierarchy uniqueness rule: an Account Name identifies a client across the platform. The PRD locks it to a 30-character cap, letter-prefix, and global uniqueness so admin search and Zitadel tenant provisioning stay deterministic.

## Origin (PRD)

- **PRD:** [[01 Account Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- **Rule id:** `BR-AM-03`
- **PRD line reference:** "Account Name must be unique across Falcon, <=30 chars, must start with a letter, mandatory." (`latest-prd.md:34`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 1 — Account Information ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) §W1 step 1)

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateAccountRequest.Info.AccountName`
- **Attribute:** `[ThrowIfNotPassed]` + `[ThrowIfMaxLengthExceed(30)]`
- **Error codes:**
  - `FalconKeys.Error.AccountNameRequired` (400) — missing
  - `FalconKeys.Error.RequiredFieldMissing` (400) — generic missing-field path
  - `FalconKeys.Error.MaxLengthExceeded` (400) — > 30 chars
  - `FalconKeys.Error.AccountNameTooLong` (400) — explicit Commerce variant
  - `FalconKeys.Error.DuplicateTenantName` (409) — uniqueness violation at handler / Zitadel layer
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) (`CreateAccountRequest` section)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) (400 + 409 sections)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) (`CreateAccountRequest.Info`)

**Backend gap (honest call):** the PRD requires "must start with a letter" but the Commerce `CreateAccountRequest.Info.AccountName` validation surface in `VALIDATIONS.md` shows only `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` — no documented format regex matching the letter-prefix rule. The letter-prefix check is either delegated to the handler (not shown) or unenforced. Surface in [[GAPS_INDEX]] as a candidate.

## Frontend implementation hint

- **Form / page section:** Add Client wizard — Step 1 (Account Information) — `account-name` field. Page surface lives under [[Organization Hierarchy]] `Add Client` flow. Frontend wrapper note: **inferred** path pattern `apps/admin-console/.../add-client-page/step-1-account-info.form.ts`.
- **Suggested validator wiring:**
  - `Validators.required` → maps to `AccountNameRequired` / `RequiredFieldMissing`
  - `Validators.maxLength(30)` → maps to `AccountNameTooLong` / `MaxLengthExceeded`
  - `Validators.pattern(/^[A-Za-z]/)` → enforces the PRD letter-prefix rule client-side (no backend mirror yet — surface as gap)
  - Async uniqueness check against `/api/commerce/Node/account-name/exist` (endpoint name **inferred** — confirm against [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md))
- **Page note:** [[Organization Hierarchy]] (Add Client wizard sub-page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — only Falcon System Admin + Product can `Add Client` (BR-AM-02 / BR-UM-02)
- **Business rule cluster:** [[01 Account Management]] BR-AM-03 → BR-AM-08 (Step 1 field rules)
- **Related learning events:** none yet
- **Sister rule:** [[V-subnode-name-maxlength-30]] — same 30-char cap on `CreateSubNodeRequest.Name`

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
