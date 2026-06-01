---
name: Wizard validations PRD-clean
description: Add Client/User/Node wizard input validators reconciled against PRDs — invented whitespace rule removed, 3 missing PRD rules added
type: project
originSessionId: 58f613ee-79bd-429f-bc19-eaf2d729ff52
---
🟢 BUILD-GREEN 2026-05-19. Cleaned input validators for Add Client / Add User / Add Node / Edit Node so each matches the PRDs.

All validators resolve via `named-validators.ts` to `defaultFalconValidationsRegistry` in `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`.

REMOVED — invented, no PRD basis: the edge-whitespace rule `if (v !== v.trim()) return {whitespace:'edge'}` from factories anyString/accountName/nodeName/personName/userName/permissionGroup. Replaced with quiet `.trim()` on submit (added trims in add-client wire-builders; Add User + Node drawer already trimmed).

ADDED — PRD-mandated, were missing: `accountName()` + `userName()` must start with a letter (`{startsWithLetter}`, BR-AM-03 / BR-UM-12); `personName()` letters-only no digits (`{lettersOnly}`, BR-UM-11). New consts `LETTERS_ONLY` / `STARTS_WITH_LETTER`. Message keys already existed in messages.ts.

STRIPPED — all non-PRD EXTRA rules + 3 DRIFTs (2026-05-19, build-green): removed accountName min-2 + letters/digits charset, personName min-2, email max-50, permissionGroup max-64, anyString 2–50 caps on financeId + 9 address fields, nationalId 10-digit format; removed the 999 upper cap on userLimit + maxNodeLevels (BR-AM-11 states no upper bound). Deleted consts ACCOUNT_NAME_MIN, PERSON_NAME_MIN, EMAIL_MAX, PERM_GROUP_MAX, NODE_NAME_MAX, USER_LIMIT_MAX, NATIONAL_ID_REGEX. Judgment calls: nodeName `required` KEPT (presence intrinsic); nationalId now has zero validation (PRD has no NID rule).

OPEN GAP — ❌ Balance Transfer Limit (%): BR-AM-11 mandates it as an Account Limit but Add Client Step 2 has no field for it. Not built (needs model field + input + wire-builder).

**Why:** PRD/BRD is the only validation authority. PRDs 01-account-management + 02-user-management mandate only: required, length caps explicitly stated, start-with-letter, letters-only, uniqueness, valid email/phone format. Everything else was invented frontend convention.

**How to apply:** NEVER add a wizard input validator unless a PRD BR rule mandates it. `required` for an entity's own name and email/phone "valid format" (BR explicitly says "valid format") are OK. Add Client/User/Node wizard validation is now 100% PRD-grounded — verified per-step audit tables exist.
