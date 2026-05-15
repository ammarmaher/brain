---
type: validation-rule
id: V-contact-group-name-required-format
prd: PRD-04
service: contact-group
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-contact-group-name-required-format — Group Name required, ≤50, matches NamePattern ***
*** Origin: PRD-04 Contact Group Management · Backend: contact-group · 2026-05-15 ***

# V-contact-group-name-required-format — Contact Group Name is mandatory, ≤50 chars, must match `ContactGroupRules.NamePattern`

> The user-facing label for a Contact Group. PRD pins it to mandatory + 50-char cap; the backend layers in a name-format regex via `ContactGroupRules.NamePattern`. The "required" gate is a dedicated rule (`ContactGroupNameRequired`); the "too long / wrong format" gate is dependent on the field actually being present.

## Origin (PRD)

- **PRD:** [[04 Contact Group Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CGM-02`
- **PRD line reference:** "Group Name <=50 chars, mandatory." (`latest-prd.md:30`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 1 — Upload & Set Details ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) §W1 step 1). Step also allows optional Reference ID (BR-CGM-03).

## Backend enforcement

- **Service:** [[Contact Group Service]]
- **DTO:** `CreateContactGroupRequest.Name: string` (and `UpdateContactGroupRequest.Name: string?` for the PATCH path)
- **Attribute:** FluentValidation `CreateContactGroupRequestValidator` — `RuleFor(x => x.Name).NotEmpty()` with key `ContactGroupNameRequired`, dependent `.MaximumLength(ContactGroupRules.NameMaxLength)` + `.Matches(ContactGroupRules.NamePattern)` with key `ContactGroupNameInvalidFormat`. `UpdateContactGroupRequestValidator` mirrors the same rules conditionally (only when `Name` is supplied).
- **Error codes:**
  - `FalconKeys.Error.ContactGroupNameRequired` (400) — empty / whitespace
  - `FalconKeys.Error.ContactGroupNameInvalidFormat` (400) — length > `NameMaxLength` OR pattern mismatch
  - `FalconKeys.Error.MaxLengthExceeded` (400) — generic backup path
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) (`CreateContactGroupRequestValidator` row)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md) (Validation Errors table)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md) (`CreateContactGroupRequest`, `UpdateContactGroupRequest`)
- **Endpoint:** `POST /api/contact-groups` (create) + `PATCH /api/contact-groups/{groupId}` (update)

**Honest call:** the exact value of `ContactGroupRules.NameMaxLength` and `ContactGroupRules.NamePattern` is **not literal in `VALIDATIONS.md`** — only the symbolic names are recorded. PRD pins the cap at 50; the regex content is not in Brain Outputs. Treat the validator file (`ContactGroupRules`) as authoritative if the frontend ever needs the exact pattern.

## Frontend implementation hint

- **Form / page section:** Create Contact Group wizard — Step 1 (Upload & Set Details) — `group-name` field. Also reused in the Edit dialog (W4 — creator-only edit of Name / Shared With / Reference ID). Frontend pending per GAP-CGM-34.
- **Suggested validator wiring:**
  - `Validators.required` → maps to `ContactGroupNameRequired`
  - `Validators.maxLength(50)` → maps to `ContactGroupNameInvalidFormat` (length component)
  - `Validators.pattern(<ContactGroupRules.NamePattern>)` — fetch the canonical pattern from a shared frontend constants module **inferred** to live under `libs/falcon/src/sdk/contact-group/rules.ts`, mirroring the backend rule set.
  - Maps to error code `ContactGroupNameInvalidFormat` on server reject.
- **Page note:** [[Organization Hierarchy]] (Contact Groups page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Contact Group Permission Matrix]] — Create allowed for Client AO / NA / NU (creator); Edit Name allowed for creator-only (BR-CGM-26)
- **Business rule cluster:** [[04 Contact Group Management]] BR-CGM-02 + BR-CGM-26 (edit allows the same field)
- **Sister rule:** [[V-account-name-format-uniqueness]] — analogous "name required + length + format" pattern at the Account level
- **Related learning events:** none yet

## Tags

#type/v-rule #status/triangulated #prd/04 #service/contact-group #severity/medium #gap

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
