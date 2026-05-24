---
type: validation-rule
id: V-person-name-format-xlsx-2026-05-24
prd: PRD-02
service: identity
severity: medium
status: triangulated
drift: false
created: 2026-05-24
xlsx: Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx
supersedes: [V-user-first-last-name-letters-only]
---
*** V-person-name-format-xlsx-2026-05-24 — First/Last Name per new xlsx SoT ***
*** Origin: Validations.xlsx 2026-05-24 · Identity · 2026-05-24 ***

# V-person-name-format-xlsx-2026-05-24 — Person Name (First/Last) per new SoT

> SoT-flip. Ammar declared the new `Validations.xlsx` the source of truth. Per the xlsx, First Name + Last Name now allow **space + apostrophe + hyphen** in addition to letters/digits. PRD BR-UM-11 stricter rule is **superseded**. Old V-rule [[V-user-first-last-name-letters-only]] is superseded.

## Origin (xlsx)

- **xlsx source:** sheets `Add Client - Step 5` + `Add User -step1` + master `Fields Validations`
- **Mandatory:** Yes
- **Length:** (2-50) Char
- **Allowed Content:** "Letters and digits Only"
- **Allowed Special Char:** `Space between words | Allow apostroph | Allow hyphens`
- **Valid Sample:** `Ahmed`
- **Invalid Sample:** `Ahm@d`

## SUPERSEDED rules

- ❌ Strict `LETTERS_ONLY = /^[\p{L}\p{N}]+$/u` (no spaces). Replaced by `PERSON_NAME_CHARSET = /^[\p{L}\p{N} '\-]+$/u`.
- ❌ "Mary Ann" was rejected before (compound name with space). Now allowed per Wave F.
- ❌ "O'Brien" was rejected before (apostrophe). Now allowed.
- ❌ "Smith-Jones" was rejected before (hyphen). Now allowed.

## Frontend implementation

- **Validator:** `personNameValidator` at [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:392-410` (Wave F 2026-05-24 rewrite). Emits `{ personNameCharset: true }`.
- **i18n key:** `hierarchy.validation.personNameCharset` — en: "Allowed: letters, digits, spaces, apostrophe, hyphen" · ar: "مسموح: أحرف، أرقام، مسافات، علامة اقتباس، شرطة".
- **Test coverage:** 21 cases per field in both `add-client-validations.test.ts` (Step 5 ownerFirst + ownerLast) + `add-user-validations.test.ts` (Step 1 firstName + lastName). New positive cases: "Mary Ann", "O'Brien", "Smith-Jones", Arabic compound.

## Wiring sites

- Add Client Step 5: [CODE] `apps/admin-console/.../client-account-owner-step/validations/validations.ts`
- Add User Step 1: [CODE] `apps/admin-console/.../user-personal-step/validations/validations.ts` + mgmt-console mirror
- User details (edit): [CODE] `libs/falcon/src/shared-features/user-details/validations/validations.ts`

## Cross-domain links

- **Sister rule:** [[V-account-name-format-xlsx-2026-05-24]] · [[V-username-format-xlsx-2026-05-24]] — all relaxed at the same time.
- **Superseded predecessor:** [[V-user-first-last-name-letters-only]] — historical.

## Tags

#type/v-rule #status/triangulated #prd/02 #service/identity #severity/medium #xlsx-sot-2026-05-24 #wave/f #supersedes-prd

## Hubs

- [[VALIDATION_INDEX]] · [[Identity Service]] · [[Add Client Flow]] · [[Add User Flow]]
