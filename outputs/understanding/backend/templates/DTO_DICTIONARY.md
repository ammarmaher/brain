# Templates Service — DTO Dictionary

> Source: `Falcon.Templates.Contracts/CommunicationChannelConfigs/{Requests,Responses}/` + `Falcon.Templates.Contracts/Common/`.

## Cross-Cutting Types

| Type | Shape | Notes |
|---|---|---|
| `ServiceOperationResult<T>` | (record/struct — verify) | Standard platform wrapper. Used uniformly across endpoints. |

## Request DTOs

| Name | Used By | Fields |
|---|---|---|
| `GetCommunicationChannelConfigsRequest` | `GET /communication-channel-configs` | `string TenantId` |
| `GetUserCheckerLevelsRequest` | `GET /communication-channel-configs/user-checker-levels` | `string? UserId, string TenantId` (nullable `UserId` — verify whether it allows omitting the user) |
| `UpdateCommunicationChannelConfigsRequest` | `PUT /communication-channel-configs/{id}` | `List<UpdateCommunicationChannelConfigItem> Configs` |
| `UpdateCommunicationChannelConfigItem` (nested) | bulk item | `string Id, BodyType, int? LevelsCount, List<CheckerLevel>? CheckerLevels` (inferred from validator hints) |
| `CheckerLevel` (nested) | within Configs | `int LevelNumber, List<CheckerUser> Users` (inferred) |
| `CheckerUser` (nested) | within CheckerLevels | `string UserId, ...` (inferred) |

## Response DTOs

| Name | Used By | Fields |
|---|---|---|
| `CommunicationChannelConfigDto` | `GET /communication-channel-configs` | `{ Id, TenantId, CommChannelId, BodyType, LevelsCount?, CheckerLevels[] }` (inferred — verify by reading the DTO file) |
| `UserCheckerLevelDto` | `GET /user-checker-levels` | `{ LevelNumber, … }` (inferred) |
| `UpdateCommunicationChannelConfigResponse` | bulk-update result element | `{ Id, … }` (inferred) |

## Internal Command/Query Types

| Internal Type | Used By |
|---|---|
| `GetCommunicationChannelConfigsQuery(TenantId)` | GET endpoint |
| `GetUserCheckerLevelsQuery(UserId, TenantId)` | GET endpoint |
| `UpdateCommunicationChannelConfigCommand(TenantId, Id, BodyType, LevelsCount, CheckerLevels, ActorUserId)` | each bulk-item dispatch |

## Vocabulary

- **CommunicationChannelConfig** — per-tenant + per-channel configuration row (one document in Mongo per `TenantId + CommChannelId`)
- **BodyType** — likely an enum: `Plain`, `Template`, `Interactive`, … (verify)
- **LevelsCount** — required only when `BodyType` indicates a restricted/approval flow
- **CheckerLevel** — an approval level (1..N) with assigned users
- **UserCheckerLevel** — projection of "user can be assigned at level X"

## Multi-Language

Not observed on Templates DTOs. Channel names are resolved upstream via Commerce.
