*** Add Client — Consolidated validations ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Validations (consolidated)

> Single-stop validation surface for the wizard. Cross-references every V-rule referenced in the per-step files plus cross-field rules, async checks, and the username 30↔100 cap drift recommendation.

## Related V-rules (every validation referenced by the flow)

| V-rule | Steps that apply | Severity / Notes |
|---|---|---|
| [[V-account-name-format-uniqueness]] | Step 1 | Backend missing letter-prefix regex; FE enforces |
| [[V-password-security-level-enum]] | Step 2 | Q-UM-12 vocabulary drift |
| [[V-account-ip-allowlist-enforcement]] | Step 2 (admin edit form for the list) + every login (enforce-at-gateway, not at Step 2) | Cross-cuts PRD-01 + PRD-02 |
| [[V-account-limits-zero-means-no-limit]] | Step 2 (all 4 limits) | Backend missing per-field `[ThrowIf*]` attributes; handler-level only |
| [[V-service-visibility-pricing-required]] | Steps 3 + 4 (per-row Visibility ↔ Pricing cross-field) | Conditional reactive form wiring |
| [[V-user-first-last-name-letters-only]] | Step 5 | Open: Arabic/spaces/hyphens semantics |
| [[V-username-format-uniqueness-immutable]] | Step 5 (immutability not relevant at create, applies post-create) | HIGH drift — PRD cap 30 vs backend cap 100 |
| [[V-password-complexity-per-security-level]] | Step 5 (server-side auto-gen; not user-facing) | Tier resolved from Step 2's `PasswordSecurityLevel` |
| [[V-normal-user-limit-enforcement]] | Step 5 indirectly (AO is sys-admin/account-owner role, not Normal User; no immediate breach) | Not a create-time concern; runtime cap on subsequent Add User flow |

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

- [[V-account-name-format-uniqueness]] · [[V-password-security-level-enum]] · [[V-account-ip-allowlist-enforcement]] · [[V-account-limits-zero-means-no-limit]] · [[V-service-visibility-pricing-required]] · [[V-user-first-last-name-letters-only]] · [[V-username-format-uniqueness-immutable]] · [[V-password-complexity-per-security-level]] · [[V-normal-user-limit-enforcement]] · [[Commerce Service]] · [[Identity Service]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
