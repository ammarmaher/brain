# Templates Service — Validations

## DTO-Level Validation

FluentValidation `Validator<T>` (FastEndpoints variant). Validators under `Falcon.Templates.Api/Endpoints/CommunicationChannelConfigs/Validators/` and (one root-level) `UpdateCommunicationChannelConfigsValidator.cs`.

| Validator | Target DTO | Rules |
|---|---|---|
| `UpdateCommunicationChannelConfigsValidator` | `UpdateCommunicationChannelConfigsRequest` | `Configs`: NotNull (`RequiredFieldMissing`) + Count > 0 (same key). `RuleForEach(x => x.Configs).SetValidator(itemValidator).When(...)`. `RuleLevelCascadeMode = Stop`. |
| `UpdateCommunicationChannelConfigItemValidator` | `UpdateCommunicationChannelConfigItem` | Per-item structural rules: `Id` NotEmpty, conditional rules on `BodyType` driving `LevelsCount` and `CheckerLevels` |
| `CheckerLevelValidator` | `CheckerLevel` | LevelNumber bounds (1..N), at least one user (`CheckerLevelMustHaveAtLeastOneUser`) |
| `CheckerUserValidator` | `CheckerUser` | UserId NotEmpty |
| `GetUserCheckerLevelsValidator` | `GetUserCheckerLevelsRequest` | `UserId` and/or `TenantId` rules — verify which are required |

## Handler-Level Validation

`UpdateCommunicationChannelConfigEndpoint` handler enforces:

- `CheckerLevelsRequired` — checker levels mandatory for a given body type
- `CheckerLevelMustHaveAtLeastOneUser`
- `CheckerLevel1RequiredBeforeLevel2` — sequential level requirement
- `CheckerLevelLimitExceeded` — bounded `LevelsCount`
- `DuplicateCheckerLevelNumber`
- `UserAssignedToMultipleCheckerLevels`
- `InvalidCheckerLevelNumber`
- `LevelsCountMismatch` — mismatched declared count vs. actual
- `LevelsCountRequiredForRestricted` — `BodyType=Restricted` requires `LevelsCount`

(All these codes are in `Falcon.Templates.Domain.Constants.FalconKeys.Error`.)

## Failure Modes for Bulk Update

The bulk endpoint applies items one-by-one and aborts at the first failure. Frontend behavior:
- If the entire request is invalid (e.g. `Configs` empty), the validator returns 400 with one error
- If item 3 of 5 fails business validation, the response contains the first two `UpdateCommunicationChannelConfigResponse` entries, then the failure (HTTP 400 with the failure code). Items 4-5 are NOT processed.

## Authorization

Group-level `RequireAuthorization()` — every endpoint needs a JWT. No per-endpoint policy beyond that.

## Tenant Resolution

`ICurrentUser.IsFalconUser` and `ICurrentUser.TenantId` are injected into the bulk update endpoint. Falcon admins can update **any tenant's** configs by passing the tenant id in the route; Client users can only update their own tenant's configs (route is ignored).

## Multi-Language

Not used at the DTO level. Error messages localized through `ErrorLocalizer`.

## Resource Completeness

`app.ValidateResourceCompleteness()` fails startup if any code lacks a translation.
