---
status: SUPERSEDED
superseded-by: "(none — rule deleted, not replaced)"
superseded-on: 2026-05-24
type: validation-rule
id: V-text-field-no-edge-or-internal-whitespace
prd: PRD-01
service: commerce
severity: medium
status: triangulated
drift: false
created: 2026-05-24
xlsx: Brain Outputs/sources/Validation.xlsx (2026-05-24) — column "Allow Spaces?"
---
*** Validation V-text-field-no-edge-or-internal-whitespace — text field whitespace policy ***
*** Origin: xlsx 2026-05-24 "Allow Spaces?" column · Backend: Commerce · 2026-05-24 ***

# V-text-field-no-edge-or-internal-whitespace — text field whitespace is enforced per xlsx column "Allow Spaces?"

> The new Validation.xlsx (2026-05-24) splits text fields into three whitespace classes. The rule says the FE MUST surface a dedicated whitespace error when the user violates the class — `lengthValidator` alone trims silently and was previously masking the violation. Wired in Wave D of the xlsx-locked rule-map rollout.

## Origin (xlsx + PRD)

- **PRD:** [[01 Account Management]] (the source-of-truth is the xlsx, which the BA aligns to PRD-01 BR-AM-03 et al; PRD itself is silent on whitespace per field)
- **xlsx source:** `[XLSX] Brain Outputs/sources/Validation.xlsx (2026-05-24)` — `Allow Spaces?` column (column 10 of the 43-column field schema)
- **Three xlsx values + their semantics:**

  | xlsx value | Meaning | Validator wiring |
  |---|---|---|
  | `No` | No whitespace anywhere | `whitespaceValidator('none')` → emits `{ noSpacesAllowed: true }` |
  | `No start or end spaces` | Middle whitespace allowed; leading/trailing whitespace rejected | `whitespaceValidator('no-edges')` → emits `{ whitespace: true }` |
  | `Yes` | Whitespace anywhere | (no whitespace validator wired) |

- **Per-field xlsx mapping (2026-05-24):**

  | Field | Sheet | xlsx says | Validator |
  |---|---|---|---|
  | Account Name | Add Client Step 1 | `No` (in `accountNameValidator` via `LETTERS_ONLY`) | (no separate whitespace validator — `lettersAndDigitsOnly` rejects spaces) |
  | Finance ID | Add Client Step 1 | `No start or end spaces` | `whitespaceValidator('no-edges')` |
  | Entity Name | Add Client Step 1 | `No start or end spaces` | `whitespaceValidator('no-edges')` |
  | Budget No / Commercial Reg / License No | Add Client Step 1 | `No start or end spaces` | `whitespaceValidator('no-edges')` |
  | District | Add Client Step 1 | `No start or end spaces` | `whitespaceValidator('no-edges')` |
  | Another ID | Add Client Step 1 | `No start or end spaces` | `whitespaceValidator('no-edges')` |
  | Street | Add Client Step 1 | `Yes` | (no whitespace validator) |
  | Building Number | Add Client Step 1 | `No` | `whitespaceValidator('none')` |
  | Postal Code | Add Client Step 1 | `No` (digits-only naturally excludes spaces) | (no separate — `digitsOnlyValidator` rejects spaces) |
  | Additional Address | Add Client Step 1 | `Yes` (max 250) | (no whitespace validator; max bumped 50→250 in Wave D) |
  | VAT Registration Number | Add Client Step 1 | `No` | `whitespaceValidator('none')` |
  | First / Last / Username / Email / Phone / National ID | Add Client Step 5 + Add User Step 1 | `No` | (each validator's own charset rule excludes spaces) |
  | Node Name | Add Node + Edit Node | `No` (via `nodeNameValidator` chain — `lettersAndDigitsOnly` rejects spaces) | (no separate whitespace validator) |

## Backend enforcement

- **Service:** [[Commerce Service]] + [[Identity Service]]
- **Backend gap (honest call):** No `[ThrowIfWhitespace]` attribute exists in either service's FluentValidation surface. `string.Trim()` happens implicitly inside .NET model-binding for query strings but body fields keep raw whitespace. Backend will accept ` FIN-0001 ` today; the FE is the sole enforcer of the whitespace policy.
- **Implication:** if the FE were bypassed (e.g. direct API call), edge whitespace would persist into Mongo + into the Account Name unique-index. Add a backend `.Must(s => s == null || s == s.Trim())` rule on each affected text field if defence-in-depth is required.

## Frontend implementation

- **Validator:** `whitespaceValidator(mode: 'no-edges' | 'none')` exported from `@falcon` — see [CODE] `libs/falcon/src/shared-utils/lib/validations/named-validators.ts:93`.
- **Underlying primitive:** `r.whitespace(mode)` on `defaultFalconValidationsRegistry` — see [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:600-614`.
- **Error keys:**
  - `mode='no-edges'` → `{ whitespace: true }` → i18n `hierarchy.validation.whitespace` (en: "No leading or trailing spaces" · ar: "لا يُسمح بمسافات في البداية أو النهاية").
  - `mode='none'` → `{ noSpacesAllowed: true }` → i18n `hierarchy.validation.noSpacesAllowed` (en: "Spaces are not allowed" · ar: "المسافات غير مسموح بها").
- **Live-error gate:** both keys are in `LIVE_ERROR_KEYS` — see [CODE] `libs/falcon/src/shared-utils/lib/validations/messages.ts:62-68`. They display immediately on typing rather than waiting for blur.
- **Order in rule chain:** whitespace validator MUST come BEFORE `lengthValidator` in the rule array. Length trims silently, which would hide the cause from the user. With whitespace first, `messageFor()` picks the whitespace key from the merged errors object.
- **Self-delegation to `required`:** when the raw value is empty or whitespace-only, the whitespace validator returns `null` so the `required` validator owns the missing-field message.

## Wiring sites

- [CODE] `apps/admin-console/.../client-information-step/validations/validations.ts:80-92` — 7 Step 1 fields wired in Wave D (2026-05-24).
- **Not wired** (intentional — xlsx says `Yes` or charset already excludes spaces):
  - Account Name, First/Last Name, Username, Phone, Email, National ID, Postal Code, Street, Additional Address, Node Name.
- **Mgmt-console mirror:** Add Client wizard does NOT exist on mgmt-console (Falcon-only feature). Info Panel mirror (admin + mgmt) intentionally NOT updated in Wave D — sheet has no Information Page row; revisit when business widens the xlsx scope.

## Test coverage

- [CODE] `tools/validation-tests/add-client-validations.test.ts` — Wave D added 5 case lists:
  - `financeIdCases` — 16 cases (required text + `no-edges`).
  - `optionalNoEdgeWsCases` — 13 cases (entityName / district / anotherId / budgetNo).
  - `optionalNoSpacesCases` — 14 cases (bldg / vat).
  - `optionalText2to50Cases` — 11 cases (street — unchanged, validates xlsx `Allow Spaces: Yes`).
  - `optionalLongTextCases` — 7 cases (addressExtra — validates max 250 bump).
- **Suite total:** 374/374 Add Client + 135/135 Add User = 509/509 (100%). Run via `npx vitest run --config tools/validation-tests/vitest.config.mts`.

## Cross-domain links

- **Sister rule:** [[V-account-name-format-uniqueness]] — also enforces no-spaces on Account Name (via the charset regex, not the dedicated whitespace validator).
- **Sister rule:** [[V-user-first-last-name-letters-only]] — same charset-excludes-spaces pattern for First/Last Name.
- **Business rule cluster:** xlsx 2026-05-24 sheets `Add Client - Step 1 Info` rows 5-21.
- **Wave provenance:** `feat(@falcon): xlsx-locked validation rule-map rollout for Add Client + Add User wizards` (commit `1812cbb6`) introduced the test harness; Wave D builds on it.

## Tags

#type/v-rule #status/triangulated #prd/01 #service/commerce #service/identity #severity/medium #wave/d #xlsx-2026-05-24

## Hubs

- [[VALIDATION_INDEX]] · [[Commerce Service]] · [[Identity Service]] · [[Add Client Flow]] · [[AMMAR_BRAIN_HOME]]
