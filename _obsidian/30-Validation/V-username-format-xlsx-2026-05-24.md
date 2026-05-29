---
type: validation-rule
id: V-username-format-xlsx-2026-05-24
prd: PRD-02
service: identity
severity: medium
status: triangulated
drift: false
created: 2026-05-24
xlsx: Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx
supersedes: [V-username-format-uniqueness-immutable]
module: user-mgmt
feature: add-user
verification: runtime
last-verified: 2026-05-24
tags: ["#status/triangulated", "#module/user-mgmt", "#verification/runtime", "#layer/fe"]
up: "[[V-rules-MOC]]"
parent: "[[V-rules-MOC]]"
superseded-by: []
evidence-link: project_validation_xlsx_sot_flip_wave_f_2026_05_24.md
---
*** V-username-format-xlsx-2026-05-24 — Username per new xlsx SoT ***

# V-username-format-xlsx-2026-05-24 — Username per new SoT (no starts-with-letter)

> SoT-flip. Per `Validations.xlsx` 2026-05-24, Username allows letters + digits + email format + specials `_ + @ . -`. Length 2-30. EN only. **No starts-with-letter rule** — was a PRD-only invention, dropped here. Async uniqueness + immutability after create unchanged.

## Origin (xlsx)

- **Sheets:** `Add Client - Step 5` row 5 + `Add User -step1` row 5
- **Mandatory:** Yes
- **Length:** (2-30) Char
- **Unique:** in the system (async)
- **Allowed Content:** `Letters / Digits / Valid email format`
- **Allowed Special Char:** `Underscore (_), Plus (+), At (@), Dot (.), Hyphen (-)`
- **Lang:** EN only
- **Valid Sample:** `ahmed_123` or `ahmed@falcon.com`
- **Invalid Sample:** `ahmed 123` (space) / `Ahmad$Dan` ($)
- **Business Rules:** "Once created it could not be edited, it will be on read only mode."

## SUPERSEDED rules

- ❌ Starts-with-letter (PRD BR-UM-12). Removed Wave F.
- ❌ Prior `LETTERS_DIGITS_OR_EMAIL = /^([\p{L}\p{N}._-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}|[\p{L}\p{N}_]+)$/u` — simple branch only allowed letters/digits/`_`. Replaced by `USERNAME_OR_EMAIL_NEW = /^([\p{L}\p{N}._+\-]+@[\p{L}\p{N}.\-]+\.[\p{L}]{2,}|[\p{L}\p{N}_.+\-]+)$/u` — simple branch now allows `_ . + -` too.

## Newly accepted inputs (Wave F)

| Input | Was | Now |
|---|---|---|
| `1abc` | startsWithLetter fail | valid (digit first) |
| `_admin` | startsWithLetter fail | valid (underscore first) |
| `.admin` | startsWithLetter + charset fail | valid (dot allowed in simple branch) |
| `name.surname` | charset fail (no `.` in simple) | valid |
| `name+tag` | charset fail | valid |
| `name-test` | charset fail | valid |

## Still rejected (matches xlsx invalid samples)

- `ahmed 123` (space) → `userNameCharset`
- `Ahmad$Dan` ($) → `userNameCharset`
- `user!name`, `user#name` → `userNameCharset`
- `@admin` (@ first) → `userNameCharset` (email branch needs domain; simple branch rejects @)

## Frontend implementation

- **Validator:** `userNameValidator` at [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:412-433` (Wave F). Emits `{ userNameCharset: true }`.
- **i18n key:** `hierarchy.validation.userNameCharset` — en: "Allowed: letters, digits, _, +, @, ., - or a valid email" · ar: "مسموح: أحرف، أرقام، _، +، @، .، - أو بريد إلكتروني صالح".
- **Async uniqueness:** unchanged. `userNameUniqueValidator` → `POST /identity/api/user/exist`. Self-edit short-circuit applied on Edit screens.
- **Immutability:** unchanged. After create, Username field is read-only.
- **Test coverage:** 27 cases in `add-client-validations.test.ts` (Step 5 ownerUser) + 27 cases in `add-user-validations.test.ts` (Step 1 userName).

## Wiring sites

- Add Client Step 5: [CODE] `apps/admin-console/.../client-account-owner-step/validations/validations.ts`
- Add User Step 1: [CODE] `apps/admin-console/.../user-personal-step/validations/validations.ts` + mgmt-console mirror

## Cross-domain links

- **Sister rule:** [[V-account-name-format-xlsx-2026-05-24]] · [[V-person-name-format-xlsx-2026-05-24]] — relaxed together.
- **Superseded predecessor:** [[V-username-format-uniqueness-immutable]] — historical.

## Tags

#type/v-rule #status/triangulated #prd/02 #service/identity #severity/medium #xlsx-sot-2026-05-24 #wave/f #supersedes-prd

## Hubs

- [[VALIDATION_INDEX]] · [[Identity Service]] · [[Add Client Flow]] · [[Add User Flow]]
