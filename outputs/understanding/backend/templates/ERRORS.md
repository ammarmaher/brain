# Templates Service — Error Catalog

> Source: `Falcon.Templates.Domain/Constants/FalconKeys.cs`. Small focused catalog.

## Error Codes

| Code | Likely HTTP | Description |
|---|---:|---|
| `RequiredFieldMissing` | 400 | Generic NotEmpty fail |
| `UnauthorizedAccess` | 403 | Caller not allowed |
| `TenantIdMissing` | 401 | JWT has no tenant claim |
| `InternalServerError` | 500 | Generic catch-all |
| `NoChangesToUpdate` | 422 | PUT with no actual change |
| `CommunicationChannelConfigNotFound` | 404 | Config id unknown |
| `CheckerLevelsRequired` | 400 | Body type requires checker levels |
| `CheckerLevelMustHaveAtLeastOneUser` | 400 | A level was declared with zero users |
| `CheckerLevel1RequiredBeforeLevel2` | 400 | Level 2 declared without level 1 |
| `CheckerLevelLimitExceeded` | 400 | More levels than the body type allows |
| `DuplicateCheckerLevelNumber` | 400 | Two levels share the same number |
| `UserAssignedToMultipleCheckerLevels` | 400 | One user appears at >1 level |
| `InvalidCheckerLevelNumber` | 400 | Negative or zero or out-of-range level number |
| `LevelsCountMismatch` | 400 | Declared `LevelsCount` doesn't match actual `CheckerLevels.Count` |
| `LevelsCountRequiredForRestricted` | 400 | `BodyType` of Restricted requires `LevelsCount` |

## Header Constants

| Constant | Value |
|---|---|
| `Headers.TenantId` | `X-Tenant-Id` |
| `Headers.CorrelationId` | `X-Correlation-Id` |

## Exception Class

`FalconException(FalconKeys.Error.<Code>)`. Standard. Localized via `Resources/ErrorMessages.{en,ar}.resx`.
