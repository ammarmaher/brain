# Commerce Service — Validations

> Commerce uses a custom **attribute-based validation** family in `Falcon.Commerce.Domain.Validations` — **not** FluentValidation. The Application-layer middleware (`UseFalconMiddlewares`) inspects these attributes on DTOs as they bind. ASP.NET's standard `[Required]`, `[Range]`, `[EnumDataType]` from `System.ComponentModel.DataAnnotations` are also used (primarily on contract DTOs).

## Custom Validation Attributes (`Falcon.Commerce.Domain.Validations`)

| Attribute | Behavior | Error Code |
|---|---|---|
| `[ThrowIfNotPassed]` | Required-field check; throws if value is null/default | `FalconKeys.Error.RequiredFieldMissing` |
| `[ThrowIfMaxLengthExceed(int max)]` | String length cap | `FalconKeys.Error.MaxLengthExceeded` |
| `[ThrowIfNotEnumValue<TEnum>]` | Enforces the value is in `Enum.GetValues<TEnum>()` | `FalconKeys.Error.InvalidValue` |

(Inferred from `CreateAccountRequest.cs` usage; attribute source files are under `Domain/Validations/`.)

## DataAnnotations-Based Validation

Used heavily on `CreateContractRequest` and `UpdateContractRequest`:

- `[Required]` on all reference + name fields
- `[Range(typeof(decimal), "0.0000001", "79228162514264337593543950335")]` on `CommittedValue` (positive decimal)
- `[Range(typeof(decimal), "0", "79228162514264337593543950335")]` on `RatePerUnit`, `PriceValue`, `IncludedAmount`, `IncludedUnits`, `UnitPrice` (non-negative decimal)
- `[EnumDataType(typeof(eCurrency))]` on `Currency`

## Per-DTO Validation Inventory

### `CreateAccountRequest`

- `Info` and `Settings` and `AccountOwner` all `[ThrowIfNotPassed]`
- `Info.AccountName` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]`
- `Info.ClassificationCategory` `[ThrowIfNotEnumValue<eClassificationCategory>]`
- `Info.ClassificationSubCategory` `[ThrowIfNotEnumValue<eClassificationSubCategory>]`
- `Info.AuthorityLetterType` `[ThrowIfNotEnumValue<eAuthorityLetterType>]`
- `Settings.PasswordSecurityLevel` `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]`
- `Service.AppId` `[ThrowIfNotPassed]`
- `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]`
- `AccountOwner.FirstName / LastName / UserName` all `[ThrowIfNotPassed]`
- `AccountOwner.Role` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]`
- `DeliveryMethod` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]`

### `CreateSubNodeRequest`

- `ParentId` `[ThrowIfNotPassed]`
- `Name` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]`

### `CreateContractRequest` / `UpdateContractRequest`

- All scalar fields `[Required]`
- All decimal money/quantity fields `[Range(decimal, ...)]`
- `Currency` `[EnumDataType(typeof(eCurrency))]`
- `Rates` list `[Required]` (must be non-null but allowed empty — verify)
- Nested `ContractRateRequest`, `ContractUnitConversionRequest`, `ContractQuotaRequest`, `ContractOverageRateRequest` all follow the same `[Required]` + `[Range]` pattern

### `UpdateMainNodeInfoRequest`

- **No validation attributes** — purely permissive. Business validation happens in the handler.

## Resource Completeness Check

`app.ValidateErrrosResourceCompleteness()` (sic — typo retained in source) runs at startup. It enumerates every `FalconKeys.Error.<Code>` constant and asserts that both `Resources/ErrorMessages.en.resx` and `Resources/ErrorMessages.ar.resx` contain a translation for it. Service refuses to start otherwise — fail-fast.

## Deviations from Platform Standards

| Standard | Status in Commerce |
|---|---|
| **`MultiLanguageName(En, Ar)` on user-facing names** | **Deviation.** `CreateAccountRequest.Info.AccountName` is a plain `string`, not a `MultiLanguageName`. Account names are stored single-language. (Service catalog items — `ApplicationResponse`, `CommunicationChannelResponse` — likely use `MultiLanguage` from the shared contracts; the request side doesn't.) |
| **FluentValidation** | Commerce uses its **own attribute family** instead. The Wiki/standards may prefer FluentValidation for shared idiom; flagged. |
| **`ServiceOperationResult<T>` is a struct** | Conforms; same shape across all services. |
| **`[ApiController]` global behaviors** | Implicit model validation is bypassed because handlers re-validate via the custom middleware. The `[ApiController]` automatic 400 short-circuit may interact poorly with the custom error pipeline — verify behavior with malformed JSON. |

## Pre-finish Validation Hook

The Commerce Application-layer pattern is "thin controller → handler → process". Validation happens at three points:

1. **Binding-time** — DataAnnotations + custom `[ThrowIf*]` attributes on DTOs.
2. **Handler-time** — `IXxxHandler.ExecuteAsync(...)` re-checks invariants and pulls in domain policies (`UserRolePolicy`, `UserStatusTransitionPolicy`, etc.).
3. **Aggregate-time** — Domain entities enforce their own rules in constructors / methods.

Each layer can throw `FalconException(FalconKeys.Error.<Code>)`. The global exception handler maps the code to an HTTP status using the `[ErrorHttpStatus(NNN)]` attribute defined on the constant.
