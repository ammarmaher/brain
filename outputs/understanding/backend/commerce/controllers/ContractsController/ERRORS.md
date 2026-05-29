# ContractsController — Errors

## Error Codes per Endpoint

### `GET /api/Contracts?accountId=<id>`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `AccountIdRequired` | 400 | `accountId` empty | `ListContractsHandler.cs:27` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client cross-tenant | `ListContractsHandler.cs:30` |
| `Unauthorized` | 401 | No JWT | Middleware |

### `GET /api/Contracts/{contractId}`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `ContractNotFound` | 404 | id empty OR not in DB | `GetContractHandler.cs:32, 37` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client cross-tenant | `GetContractHandler.cs:47` |
| `Unauthorized` | 401 | No JWT | Middleware |

### `POST /api/Contracts`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `RequiredFieldMissing` | 400 | `[Required]` violation on string fields | ModelState |
| `InvalidValue` | 400 | `[EnumDataType]` violation on Currency / sub-items | ModelState |
| (Range violation) | 400 | `[Range]` violation on CommittedValue / decimals | ModelState |
| `AccountIdRequired` | 400 | Empty `AccountId` (redundant with `[Required]`) | `CreateContractHandler.cs:80` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client cross-tenant | `CreateContractHandler.cs:101` |
| `NodeNotFound` | 404 | AccountId doesn't resolve | `CreateContractHandler.cs:89` |
| `ApplicationNotFound` | 404 | Any Rate references unknown app | `CreateContractHandler.cs:116` |
| `CommunicationChannelNotFound` | 404 | Any Rate/Quota/Overage references unknown channel | `CreateContractHandler.cs:136` |
| Wallet policy codes | 422 | Domain policy `IValidateContractWalletStrategyPolicy.Execute` | Domain |
| Contract entity codes | 422 | `Contract.Create(...)` invariants (date order, etc.) | Domain |

### `PUT /api/Contracts/{contractId}`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `ContractNotFound` | 404 | contractId empty OR not in DB | `UpdateContractHandler.cs:57, 62` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client cross-tenant | `UpdateContractHandler.cs:167` |
| `ApplicationNotFound` | 404 | Rate references unknown app | `UpdateContractHandler.cs:189` |
| `CommunicationChannelNotFound` | 404 | Rate/Quota/Overage references unknown channel | `UpdateContractHandler.cs:209` |
| Wallet policy codes | 422 | Domain policy | Domain |
| Contract entity codes | 422 | `Contract.Update(...)` invariants | Domain |

## Auth Errors

| Code | HTTP |
|---|---:|
| `Unauthorized` | 401 |
| `OwnerIdNotMatchWithTenantId` | 403 |

## Infrastructure Errors

| Code | HTTP |
|---|---:|
| `InternalServerError` | 500 |
| `UnknownError` | 500 |
| Kafka publish failures (transient) | 500 (logged + retried; should not surface to caller in non-orchestrator path) |

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs`
