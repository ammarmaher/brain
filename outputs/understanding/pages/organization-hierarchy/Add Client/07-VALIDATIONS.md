*** Add Client — Consolidated validations ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Validations (consolidated)

> Single-stop validation surface for the wizard. Cross-references every V-rule referenced in the per-step files plus cross-field rules, async checks, and the username 30↔100 cap drift recommendation.

## SoT declaration (2026-05-24)

> [!important] `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx` (snapshot of `Downloads/Validations.xlsx`) is the **single source of truth** for Add Client + Add User validation. Ammar declared this 2026-05-24. PRD-01 BR-AM-03 (starts-with-letter) + PRD-02 BR-UM-11/12 are downgraded to "historical reference" where the xlsx contradicts them. When xlsx and PRD diverge, **xlsx wins**.

## Related V-rules (every validation referenced by the flow)

| V-rule | Steps that apply | Severity / Notes |
|---|---|---|
| [[V-account-name-format-xlsx-2026-05-24]] | Step 1 (Account Name) | **NEW SoT** — supersedes V-account-name-format-uniqueness. Charset: letters + digits + space + & + ' + -. NO starts-with-letter. 2-30. Async unique. |
| [[V-account-name-format-uniqueness]] | (historical) | **SUPERSEDED 2026-05-24** by V-account-name-format-xlsx-2026-05-24 |
| [[V-person-name-format-xlsx-2026-05-24]] | Step 5 (First/Last Name) | **NEW SoT** — supersedes V-user-first-last-name-letters-only. Adds INTERNAL space + apostrophe + hyphen. Leading/trailing spaces rejected with `whitespace` error key (Ammar refinement 2026-05-24 — "Space between words" means internal only). |
| [[V-user-first-last-name-letters-only]] | (historical) | **SUPERSEDED 2026-05-24** by V-person-name-format-xlsx-2026-05-24 |
| [[V-username-format-xlsx-2026-05-24]] | Step 5 (Username) | **NEW SoT** — supersedes V-username-format-uniqueness-immutable. NO starts-with-letter. Simple branch adds `_ . + -`. Async unique. Immutable after create unchanged. |
| [[V-username-format-uniqueness-immutable]] | (historical) | **SUPERSEDED 2026-05-24** by V-username-format-xlsx-2026-05-24 |
| [[V-text-field-no-edge-or-internal-whitespace]] | (historical) | **SUPERSEDED 2026-05-24** — new xlsx removed whitespace constraints from Step 1 free-text fields. Wave D rule rolled back. |
| [[V-password-security-level-enum]] | Step 2 | xlsx confirms {Normal, Advance(d)} — backend Low/Medium/High/Strict drift unchanged. |
| [[V-account-ip-allowlist-enforcement]] | Step 2 | Wave F: validator now supports IPv6 + IPv6-with-prefix per xlsx "Any valid IP address supporting all versions". |
| [[V-account-limits-zero-means-no-limit]] | Step 2 (3 limits — Balance Transfer Limit % removed per xlsx) | xlsx confirms; Balance Transfer Limit field marked "Remove it" |
| [[V-service-visibility-pricing-required]] | Steps 3 + 4 (per-row Visibility ↔ Pricing cross-field) | Wave F: Price Type enum dropped Quarterly per xlsx (Monthly/Yearly/One Time Payment only). Price Value is integer-only now (no decimals). **Wave G 2026-05-24**: numeric cap raised 999_999_999 → 999_999_999_999_999 (15 digits) AND input field has `maxlength=15` so the 16th keystroke is blocked at the browser layer (was `<input type="number">` which ignores maxlength). |
| [[V-account-limits-zero-means-no-limit]] | Step 2 (Max Normal / Max System / Max Node) | xlsx confirms 0-999 integer. **Wave G 2026-05-24**: input fields switched from `<falcon-angular-input-number max=999>` (auto-snapped to 999 on overflow — confusing UX) to `<falcon-angular-input type=text inputMode=numeric maxlength=3>` which hard-blocks the 4th keystroke. Same in admin + mgmt Settings tab. |
| [[V-password-complexity-per-security-level]] | Step 5 (server-side auto-gen) | xlsx confirms: auto-generated, disabled. |
| [[V-normal-user-limit-enforcement]] | Step 5 indirectly | Not a create-time concern. |

## Step 1 — per-field validator wiring (Wave F 2026-05-24 SoT-flip)

Ammar declared `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx` THE source of truth. `CLIENT_INFO_VALIDATIONS` at [CODE] `apps/admin-console/.../client-information-step/validations/validations.ts:65-87` mirrors the xlsx exactly:

| Field | xlsx "Allowed Content" | xlsx max | Validator |
|---|---|---|---|
| `accountName` | Letters+digits + space + & + ' + - | 30 | `accountNameValidator` (no starts-with-letter; charset = `ACCOUNT_NAME_CHARSET`) + async unique |
| `financeId` | Any string + Any special char | 50 | `lengthValidator(2, 50, true)` |
| `entityName` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `district` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `street` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `bldg` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `postal` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `addressExtra` | Any string + Any special char | **50** (xlsx says max 50, not 250) | `lengthValidator(2, 50, false)` |
| `anotherId` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `vat` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |
| `budgetNo` | Any string + Any special char | 50 | `lengthValidator(2, 50, false)` |

### Wave F change log (vs Wave D earlier today)

- **Account Name**: dropped `startsWithLetter`. Charset relaxed to allow `space + & + ' + -`. "Falcon Corp", "O'Brien", "Smith-Jones", "A&B Co", "1abc" all newly valid. PRD BR-AM-03 superseded.
- **Finance ID / Entity Name / District / Building / Postal / Another / VAT / Budget**: ALL whitespace + digits-only validators DROPPED. New xlsx says "Any string" + "Space between words | Any special char and symbol" for every Step 1 free-text field. Length-only is the only FE check.
- **Postal Code**: was `digitsOnlyValidator(2, 50, false)`, now `lengthValidator(2, 50, false)` — xlsx says "Any string", not digits-only.
- **Additional Address**: max reverted 250 → 50 (Wave D had bumped to 250; new xlsx says 50 on both Step-1 row + master Fields-Validations row).

## Step 1 — cross-field validation contract

- `CountryRequiredWhenCityProvided` (400)
- `CityRequiredWhenDistrictProvided` (400)
- `CityRequiredWhenStreetProvided` (400)
- `OfficialDataRequired` (400) — at least Entity Name + Authority Letter block must be present (handler-level)
- `MainNodeAccountInfoRequired` (400) — `Info` block itself must be present

Implement at Angular FormGroup level via custom cross-field validators. On actual submit, use the localized `errorMessages` from `ServiceOperationResult<T>` (do not parse codes — see [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

## Step 2 — cross-field validation contract

- `MainAccountSettingsRequired` (400) — the `Settings` block itself must be present.
- `InvalidAccountLimits` (422) — handler-level violation across the 4 limits (negative, malformed). The four limit fields **lack documented `[ThrowIf*]` attributes** in `VALIDATIONS.md` — empty/negative handler-level only.

## Steps 3 + 4 — central cross-field rule (Visibility ↔ Pricing)

- **`HiddenProductMustNotHavePricing` (422)** — pricing supplied while Visibility = Hide.
- **`PriceValueNotConfigured` (422)** + **`PricingTypeNotConfigured` (422)** — Visibility = Show without complete price tuple.

Canonical Reactive Forms wiring per [[V-service-visibility-pricing-required]]:

```
visibility.valueChanges.subscribe(v => {
  if (v === true) { // 'Show'
    priceType.setValidators([Validators.required]);
    priceValue.setValidators([Validators.required, Validators.min(0)]);
  } else {
    priceType.clearValidators();
    priceValue.clearValidators();
    priceType.reset();
    priceValue.reset();
  }
  priceType.updateValueAndValidity();
  priceValue.updateValueAndValidity();
});
```

## Step 5 — cross-field validation contract

- `RequiredFieldMissing` (400) on any missing `FirstName / LastName / UserName / Role / DeliveryMethod`.
- `DuplicateUsername` (409) — surfaced on submit if async pre-check missed a race.

## Async uniqueness checks (debounced)

| Check | Endpoint | Step | Debounce | FE behavior |
|---|---|---|---|---|
| Account Name | `GET /api/Node/ValidateAccountName?AccountName=` → returns `bool` | Step 1 | 300 ms + cancel-on-input | Map `true` (exists) to a custom `accountNameTaken` validator error. |
| Username | Identity `POST /api/user/exist` → `ExistResponse { bool Exists }` | Step 5 | 300 ms + cancel-on-input | Map `Exists: true` to a `usernameTaken` validator error. |

## Backend `[ThrowIf*]` attribute summary (per DTO)

| DTO field | Backend attribute |
|---|---|
| `Info.AccountName` | `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` |
| `Info.ClassificationCategory` | `[ThrowIfNotEnumValue<eClassificationCategory>]` |
| `Info.ClassificationSubCategory` | `[ThrowIfNotEnumValue<eClassificationSubCategory>]` |
| `Info.AuthorityLetterType` | `[ThrowIfNotEnumValue<eAuthorityLetterType>]` |
| `Settings.PasswordSecurityLevel` | `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]` |
| `Service.PriceType` | `[ThrowIfNotEnumValue<ePricingType>]` |
| `AccountOwner.FirstName` | `[ThrowIfNotPassed]` |
| `AccountOwner.LastName` | `[ThrowIfNotPassed]` |
| `AccountOwner.UserName` | `[ThrowIfNotPassed]` |
| `AccountOwner.PhoneNumber` | **MISSING** despite required (⚠ drift) |
| `AccountOwner.EmailAddress` | **MISSING** despite required (⚠ drift) |
| `AccountOwner.Role` | `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]` |
| `DeliveryMethod` (top-level) | `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]` |

## Username 30 ↔ 100 drift — recommendation

**Drift:** PRD-02 BR-UM-12 caps Username at 30 chars; Commerce/Identity FluentValidation caps at 100.

**Recommendation:** **Enforce 30 on the frontend** (PRD authority wins; be tighter than backend). Apply `Validators.maxLength(30)` on the Step 5 Username field. Document the gap in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md). Server will not reject a 30-char username because its cap is looser.

## PasswordSecurityLevel enum vocabulary drift — recommendation

**Drift:** PRD says `Normal/Advanced`; Identity backend `ePasswordSecurityLevel` is `Low/Medium/High/Strict`.

**Recommendation:** match backend enum names in the request payload (`Low/Medium/High/Strict`) and map PRD `Normal ↔ Low or Medium`, `Advanced ↔ High or Strict` until Q-UM-12 resolves. Display PRD labels in the dropdown but submit backend codes.

## Frontend rule: do NOT parse error codes

Use HTTP status code as the **primary routing signal** per [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md). Display localized `errorMessages[0]` to the user (already localized; do not parse codes). Use error codes only for **logging / instrumentation**, never for branching UI copy.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[V-account-name-format-uniqueness]] · [[V-password-security-level-enum]] · [[V-account-ip-allowlist-enforcement]] · [[V-account-limits-zero-means-no-limit]] · [[V-service-visibility-pricing-required]] · [[V-user-first-last-name-letters-only]] · [[V-username-format-uniqueness-immutable]] · [[V-password-complexity-per-security-level]] · [[V-normal-user-limit-enforcement]] · [[V-text-field-no-edge-or-internal-whitespace]] · [[Commerce Service]] · [[Identity Service]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
