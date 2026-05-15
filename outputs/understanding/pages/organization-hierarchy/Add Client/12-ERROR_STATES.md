*** Add Client — Error states + UX ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Error states + UX

> Backend error code → UX mapping. Use HTTP status code as the **primary routing signal** per [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md). Display localized `errorMessages[0]` to the user — already localized; do not parse codes for copy.

## Error code → UX behavior table

| Backend error code (Commerce/Identity) | HTTP | UX behavior |
|---|---|---|
| `AccountNameRequired` · `RequiredFieldMissing` · `AccountIdRequired` · `FinanceIdRequired` · `ParentIdRequired` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` · `MainAccountSettingsRequired` · `OwnerIdRequired` | 400 | Inline error on the missing field. Wizard step indicator highlights the affected step ([[Falcon Stepper]] error state). Scroll to first error. |
| `AccountNameTooLong` · `MaxLengthExceeded` · `BelowMinimumLength` | 400 | Inline error on the affected field |
| `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` | 400 | Inline error on the affected Step 5 field |
| `InvalidPriceValue` · `InvalidPriceType` · `PriceValueRequired` | 400 | Inline error on the affected Step 3/4 row |
| `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` | 400 | Inline error on the dependent field, with hint pointing at the required parent |
| `ImageExtensionNotAllowed` · `InvalidImageFile` · `ExecutableFileNotAllowed` · `ProfilePictureSizeExceeded` · `FileSizeExceeded` | 400 | Inline error on the uploader; show allowed types + max size hint |
| `DuplicateTenantName` | 409 | Inline error on Account Name field in Step 1 ("This name is already in use"). Stepper highlights Step 1. |
| `DuplicateUsername` | 409 | Inline error on Username field in Step 5. Stepper highlights Step 5. |
| `DuplicateNodeName` | 409 | Inline error on Account Name (if Main Node naming collision separate from tenant). |
| `InvalidAccountLimits` · `InvalidNodeLevel` · `InvalidValue` | 422 | Inline error in Step 2 limits panel |
| `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` | 422 | Inline error on the affected Step 3/4 row |
| `InvalidAuthorityLetterType` | 422 | Inline error on Authority Letter Type field |
| `InvalidIpAddress` · `IpNotAllowed` | 403 | Generic "Request not permitted from your network" toast. **Do NOT differentiate from credential errors** (BR-UM-24 enumeration-leak protection). |
| `Forbidden` · `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction` | 403 | "You do not have permission to add a client" toast ([[Falcon Notification]]) + close wizard |
| `Unauthorized` · `InvalidCredentials` | 401 | Trigger re-auth flow |
| `CreateIdentityUserFailed` · `GetIdentityUserFailed` · `ExternalServiceError` · `ExternalServiceConnectionError` · `ExternalServiceTimeout` | 500 | Toast via [[Falcon Notification]] "Account created but Account Owner creation failed — contact support". **Wizard state should be preserved** so the operator can retry Step 5 user creation. **Important:** Account may have been created server-side before the Identity hop failed — surface a clear partial-failure UX. |
| `ZitadelCreateMachineUserFailed` / various `Zitadel*Failed` | 500 | Same as above — Identity-Zitadel chain failure |
| `RenewalJobCreationFailed` | 500 | Toast — non-blocking (renewal job is a background concern) |
| Network 5xx (generic) | 5xx | Toast via [[Falcon Notification]] + retry button; wizard state preserved |

## Per-step error placement

| Step | Codes that route here |
|---|---|
| Step 1 (Basic Info) | `AccountNameRequired`, `AccountNameTooLong`, `DuplicateTenantName`, `DuplicateNodeName`, `OfficialDataRequired`, `MainNodeAccountInfoRequired`, `FinanceIdRequired`, `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `InvalidAuthorityLetterType`, `BudgetNoRequired`, all image-uploader 400s |
| Step 2 (Settings) | `MainAccountSettingsRequired`, `InvalidAccountLimits`, `InvalidNodeLevel`, `InvalidValue`, `InvalidIpAddress` |
| Steps 3 + 4 (CommChannels / Apps) | `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `InvalidPriceValue`, `InvalidPriceType`, `PriceValueRequired` |
| Step 5 (Account Owner) | `RequiredFieldMissing`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidPhoneNumber`, `DuplicateUsername` |
| Cross-cutting (toast) | `Forbidden`, `Unauthorized`, all 500-class Identity/Zitadel failures, generic 5xx network |

## Banner UX rule

The wizard stepper component must visually mark the offending step as **error-state** when the backend returns a code that resolves to a specific step. Use the page rule UIUX-SHADOW-001..005 family for inline-edit error patterns where applicable (cross-link: [../UI_UX_RULES.md](../UI_UX_RULES.md)).

## Recovery paths

| Scenario | Recovery |
|---|---|
| Validation error (400/422) | Inline message · scroll to first error · stepper highlights offending step · user fixes and re-submits |
| Duplicate (409) | Inline message on the offending field · stepper highlights step · user picks a different value · re-submits |
| Permission (403 `Forbidden`) | Close wizard · toast · no retry from this user |
| IP allowlist (403 `InvalidIpAddress`/`IpNotAllowed`) | Generic toast (do not leak which check failed) · re-auth required from allowed network |
| Auth (401) | Trigger re-auth flow · wizard state should be preserved if possible |
| Downstream failure (500 Identity/Zitadel after Account is created) | **Preserve wizard state**. Toast: "Account created but Account Owner creation failed — contact support". Retry Step 5 may need to use a different endpoint (re-trigger Identity user creation for an existing Account) — surface as a documented gap. |
| Network 5xx | Toast with retry button. Preserve wizard state. |

## Frontend rule: never parse error codes for copy

Use HTTP status code for **routing logic** (which UI to show). Use `errorMessages[0]` for **display copy** (already localized). Error codes are for **logging / instrumentation** only — never branch UI copy on them.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Commerce Service]] · [[Identity Service]] · [[Falcon Stepper]] · [[Falcon Notification]] · [[Falcon Toast]] · [[BACKEND_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
