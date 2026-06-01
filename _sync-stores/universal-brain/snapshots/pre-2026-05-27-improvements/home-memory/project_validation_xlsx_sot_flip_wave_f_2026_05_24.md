---
name: validation-xlsx-sot-flip-wave-f-2026-05-24
description: Wave F SoT-flip — new Validations.xlsx declared single source of truth for Add Client + Add User; PRD start-with-letter rules superseded; whitespace validators rolled back; charset relaxed
metadata: 
  node_type: memory
  type: project
  originSessionId: 469a24eb-c3e5-4ebf-baa6-0a8b28d2117b
---

# Wave F — Validations.xlsx 2026-05-24 SoT-flip (PRD downgraded)

🟢 **BROWSER-VERIFIED 2026-05-24** host-shell `falcon-host-shell` (post-restart, hash `31315fc9e71484c4` from prior build). User declaration: *"the validation Excel is the source of truth … your source of truth is always PRDs, but in this case … we are changing the source of truth that is inside your brain and make sure that we always take this Excel sheet as the source of truth."*

## SoT snapshot

- **Original**: `C:\Users\User\Downloads\Validations.xlsx` (574 KB, 2026-05-24 15:28). DO NOT edit per Ammar.
- **Brain snapshot**: `C:\Falcon\Source_of_truth_theme\Validations.SOT-2026-05-24.xlsx` (copy, same bytes).
- **Sheets**: Gaps · Fields Validations (master 74×26) · Add Client Step 1 (20×32) · Step 2 (6×31) · Step 3+4 (4×23) · Step 5 (10×25) · Add User Step 1 (8×14) · Step 2 (3×23) · Step 3 (3×24). Add Node + Edit Node NOT covered this version.
- **Parsed TSVs**: `C:\Falcon\Source_of_truth_theme\.xlsx-parse\dump-SOT\*.tsv` via existing `dump.js` (Node + `xlsx` npm).

## Validator deltas vs Wave D earlier today

| Validator | Was | Now (Wave F) | xlsx evidence |
|---|---|---|---|
| `accountName` | startsWithLetter + LETTERS_ONLY + 2-30 | NO startsWithLetter; `ACCOUNT_NAME_CHARSET = /^[\p{L}\p{N} &'\-]+$/u` + 2-30 + async unique | Step 1 row 3 "Letters and digits Only" + specials {Space, &, ', -}. Business Rules: "Can start with anything allowed." Valid sample "Falcon Corp". |
| `personName` | LETTERS_ONLY (no spaces) | `PERSON_NAME_CHARSET = /^[\p{L}\p{N} '\-]+$/u` | Step 5 row 3+4 + Add User Step 1: "Letters and digits Only" + {Space, ', -}. Valid: "Ahmed". |
| `userName` | startsWithLetter + LETTERS_DIGITS_OR_EMAIL (simple branch only `_`) | NO startsWithLetter; `USERNAME_OR_EMAIL_NEW = /^([\p{L}\p{N}._+\-]+@[\p{L}\p{N}.\-]+\.[\p{L}]{2,}\|[\p{L}\p{N}_.+\-]+)$/u` | Step 5 row 5 + Add User Step 1 row 5: "Letters / Digits / Valid email format" + specials {_, +, @, ., -}. Valid: "ahmed_123" or "ahmed@falcon.com". Invalid: "ahmed 123", "Ahmad$Dan". |
| `priceValue` | numberInRangeFn (decimals OK) | `integerInRangeFn(0, 999_999_999, required)` | Step 3+4 row 4: "Digits only. Integer greater than or equal to 0." Invalid sample "1,250,000,000" (overflow), and decimals not in valid samples. |
| `allowedIpList` | IPv4 / IPv4-CIDR only via `CIDR_OR_IP_V4` regex | Function checking IPv4-CIDR OR IPv6 OR IPv6-with-prefix via new `IPV6_CORE` regex + `CIDR_OR_IP(s: string)` predicate | Step 2 row 6: "Any valid IP address supporting all versions and format". Valid samples include "FE80:0000:0000:0000:0202:B3FF:FE1E:8329" + "FE80::202:B3FF:FE1E:8329". |

## Step 1 wiring (Wave F)

`CLIENT_INFO_VALIDATIONS` at [CODE] `apps/admin-console/.../client-information-step/validations/validations.ts:65-87` — collapsed from 11 distinct rule chains (Wave D) to **2 shared factories**: `requiredText = lengthValidator(2, 50, true)` and `optionalText = lengthValidator(2, 50, false)`. Per the new xlsx, every Step 1 free-text field is "Any string" + "Space between words | Any special char and symbol".

- `accountName` → `accountNameValidator`
- `financeId` → `requiredText`
- All others (`entityName`, `district`, `street`, `bldg`, `postal`, `addressExtra`, `anotherId`, `vat`, `budgetNo`) → `optionalText`

**Wave D rollbacks**: dropped all `whitespaceValidator('no-edges'|'none')` imports + wiring. Dropped `digitsOnlyValidator` for postal. Reverted `addressExtra` max 250 → 50 (new xlsx says 50).

## New error keys

[CODE] `messages.ts:18-23` + i18n en+ar:
- `accountNameCharset` → "Allowed: letters, digits, spaces, &, apostrophe, hyphen" / "مسموح: أحرف، أرقام، مسافات، &، علامة اقتباس، شرطة"
- `personNameCharset` → "Allowed: letters, digits, spaces, apostrophe, hyphen" / "مسموح: أحرف، أرقام، مسافات، علامة اقتباس، شرطة"
- `userNameCharset` → "Allowed: letters, digits, _, +, @, ., - or a valid email" / "مسموح: أحرف، أرقام، _، +، @، .، - أو بريد إلكتروني صالح"

All three in `VALIDATOR_KEYS` + `LIVE_ERROR_KEYS` so they surface immediately on typing.

## i18n placeholder + helper cleanup

[CODE] `libs/falcon/src/language/i18n/{en,ar}.json` — Account Name's misleading placeholder/helper updated:
- placeholder: was "Start with letter · Max 30 Characters" → "2-30 characters" (no longer asserts starts-with-letter)
- helper: was "Letters, numbers and underscores only" → "Letters, digits, spaces, &, apostrophe and hyphen"

Also fixed legacy alias `accountNamePlaceholder` at line 445.

## Tests (Wave F)

`tools/validation-tests/add-client-validations.test.ts` + `add-user-validations.test.ts` — 100% pass.
- Add Client: 457/457 cases (was 374 before Wave F; +83 cases for new charset behavior)
- Add User: passing (full count not captured in last run, but 0 failures)
- New positive cases prove SoT-flip: "Falcon Corp", "O'Brien", "Smith-Jones", "A&B Co", "1abc" all valid for accountName. "Mary Ann", "O'Brien", "Smith-Jones", "محمد على" all valid for personName. "1abc", "_admin", ".admin", "name.surname", "name+tag" all valid for userName.
- New negative cases prove charset still enforces: "Falcon@Corp" → `accountNameCharset`. "Ahm@d" → `personNameCharset`. "ahmed 123", "Ahmad$Dan" → `userNameCharset`.

## Browser-verified

- Add Client Step 1 Account Name: "1abc" → valid ✓ (was rejected with `startsWithLetter`). "Falcon Corp" → valid. "Falcon@Corp" → "Allowed: letters, digits, spaces, &, apostrophe, hyphen" ✓ (xlsx invalid sample triggers the new charset error).
- Screenshot captured in turn output.

## Obsidian SoT-reset

**3 NEW V-rules** declaring xlsx as SoT:
- `Brain SK/_obsidian/30-Validation/V-account-name-format-xlsx-2026-05-24.md`
- `Brain SK/_obsidian/30-Validation/V-person-name-format-xlsx-2026-05-24.md`
- `Brain SK/_obsidian/30-Validation/V-username-format-xlsx-2026-05-24.md`

**4 V-rules marked SUPERSEDED** (kept for archival provenance):
- `V-account-name-format-uniqueness.md` (Wave D supersedes-by frontmatter + admonition)
- `V-user-first-last-name-letters-only.md`
- `V-username-format-uniqueness-immutable.md`
- `V-text-field-no-edge-or-internal-whitespace.md` (Wave D rule rolled back — no replacement; whitespace validators kept in registry for potential Add Node revival)

**Matrix updated** at [BRAIN-OUT] `06-validation-by-feature/MATRIX.md`:
- Discrepancy note rewritten — 4 SUPERSEDED + 3 NEW V-rules listed.
- Rows 25/26 marked SUPERSEDED; rows 27/28/29 added for new xlsx V-rules.

**Add Client `07-VALIDATIONS.md` updated** — header carries the SoT declaration ("PRD downgraded where xlsx contradicts"). Step 1 per-field table rewritten for Wave F. Old "whitespace BEFORE length" rationale removed (no whitespace validators wired anymore).

## SoT priority — new ordering

Going forward for Add Client + Add User work, the source-of-truth priority is:
1. **Validations.xlsx** (snapshot at `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx`) — single source of truth, **wins over PRD**.
2. Backend FluentValidation attributes — for backend-only constraints not in xlsx.
3. PRD-01/02 — historical reference only where xlsx is silent OR contradicts the xlsx (xlsx wins).
4. Brain V-rules — derived from xlsx; the new `V-*-xlsx-2026-05-24.md` notes are authoritative.

For Add Node + Edit Node: xlsx doesn't cover them in this version. nodeName validator (still uses old `startsWithLetter + LETTERS_ONLY`) is unchanged. Pending future xlsx revision.

## Brain sync state

- Canonical → `C:\falcon-brain-sync\` push done via `sync-from-canonical.ps1 -Push`.
- Pending in falcon-brain-sync (NOT committed per no-auto-commit rule):
  - `Brain-Outputs/datasets/authority-dataset/06-validation-by-feature/MATRIX.md`
  - `Brain-Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md`
  - `Brain-Outputs/sources/Validations.xlsx` (snapshot deliberately not pushed — local source-of-truth artifact)
  - `home-memory/MEMORY.md` + new topic `project_validation_xlsx_sot_flip_wave_f_2026_05_24.md`
- Brain SK side: 3 new V-rule files + 4 SUPERSEDED frontmatter updates. Untracked in its own git (`https://github.com/ammarmaher/brain`).
- FE branch `polishing-v0.4` working tree: 12 mod + 4 new (1 new test xlsx parser script + 3 new V-rule notes) — uncommitted per no-auto-commit rule.

## Rules emitted (reusable)

- **xlsx is a stronger source than PRD when Ammar declares it so** — frontmatter `superseded-by` + `superseded-on` on the old V-rules makes the lineage discoverable.
- **Snapshot the SoT xlsx into the brain** — never edit the user's original; copy to `Source_of_truth_theme/Validations.SOT-<date>.xlsx` so the rule history is reproducible from a stable artifact.
- **Per-field charset errors are better UX than a generic `lettersAndDigitsOnly`** — when the allowed set differs per field (account vs person vs username), users need to know which subset their field accepts. Add a dedicated error key per validator.
- **Test cases should cite xlsx valid/invalid samples verbatim** — direct citation lets a future maintainer diff the sheet against the suite and catch drift.
- **"Allow Spaces" is xlsx vocabulary, not a validator** — when the xlsx says "Any string" + "Space between words", that means no charset validator + no whitespace validator. The earlier `whitespaceValidator(mode)` from Wave D is dead code in Add Client / Add User scope but stays in the registry for future feature coverage.
- **Placeholder + helper text are part of the validation contract** — if the placeholder says "Start with letter" but the validator doesn't require it, users are lied to. Rewrite placeholders + helpers in lockstep with validator rewrites.
- **integerInRangeFn does NOT coerce strings** (unlike `numberInRangeFn`) — adopt with eyes open. For UI fields that emit strings, either pre-coerce upstream or switch to numberInRange.

## Related

- Predecessor: [[project_validation_whitespace_wave_d_2026_05_24]] — Wave D added whitespace validators; Wave F rolled them back per the new xlsx.
- Sister memories: [[project_validation_xlsx_pre_filled_2026_05_21]] (original v1 xlsx delivery), [[project_info_panel_validation_parity_2026_05_21]] (Info Panel mirror precedent).
