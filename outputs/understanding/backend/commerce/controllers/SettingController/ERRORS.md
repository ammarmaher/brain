# SettingController — Errors

> Subset of `commerce/ERRORS.md`. Cross-link: [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`.

## Error Codes per Endpoint

### `GET /api/Setting`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `OwnerIdRequired` | 400 | Client user with empty `ownerId` | `GetSettingsHandler.cs:62` |
| `NodeNotFound` | 404 | `ownerId` resolves to no node | `GetSettingsHandler.cs:131` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client user querying another tenant | `GetSettingsHandler.cs:67-68` |
| `SettingsNotFound` | 404 | No SecuritySettings sub-doc | `GetSettingsHandler.cs:78` |
| `AccountLimitNotFound` | 404 | No QuotaSettings sub-doc (non-Falcon-root) | `GetSettingsHandler.cs:99` |

### `GET /api/Setting/wallets/{ownerId}`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `OwnerIdRequired` | 400 | Empty path param (route binding allows empty?) | `GetWalletSettingsHandler.cs:61` |
| `OwnerIdNotMatchWithTenantId` | 403 | Client tenant mismatch | `GetWalletSettingsHandler.cs:65` |
| `NodeNotFound` | 404 | Node lookup miss | `GetWalletSettingsHandler.cs:73` |
| `WalletSettingsOnlyForMainNode` | 422 | Caller passed a sub-node id | `GetWalletSettingsHandler.cs:76` |

**Returns `null` (not error) when wallet not yet configured** — [CODE] `GetWalletSettingsHandler.cs:47-48`.

### `PUT /api/Setting`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `RequiredFieldMissing` | 400 | Generic `[ThrowIfNotPassed]` violations | `[ThrowIf*]` middleware |
| `InvalidValue` | 400 | `[ThrowIfNotEnumValue<ePasswordSecurityLevel>]` violation | `[ThrowIf*]` middleware |
| `NodeNotFound` | 404 | `ownerId` resolves to no node | `UpdateSettingsHandler.cs:51` |
| `SettingsOnlyAllowedForMainNode` | 422 | Sub-node id passed | `UpdateSettingsHandler.cs:54` |
| `SettingsNotFound` | 404 | Settings doc missing for owner | `UpdateSettingsHandler.cs:59` |
| `UnauthorizedUserToPerformThisAction` | 403 | Client tried to write `quotaSettings` | `UpdateSettingsHandler.cs:75` |

### `POST /api/Setting/wallets`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `Forbidden` | 403 | Non-Falcon JWT (policy gate) | `[FalconOnly]` |
| `OwnerIdRequired` | 400 | Empty `OwnerId` in request | `ConfigureWalletSettingsHandler.cs:120` |
| `MainNodeNotFound` | 404 | Node lookup miss | `ConfigureWalletSettingsHandler.cs:128` |
| `WalletSettingsOnlyForMainNode` | 422 | Sub-node id | `ConfigureWalletSettingsHandler.cs:131` |
| `WalletSettingsAlreadyConfigured` | 409 | Already set | `ConfigureWalletSettingsHandler.cs:141` |
| `SettingsNotFound` | 404 | Settings doc missing on update (data race) | `ConfigureWalletSettingsHandler.cs:70` |
| `InvalidWalletBalanceType` | 400 | Enum value outside known set | `ConfigureWalletSettingsHandler.cs:159` |

## Auth Errors

| Code | HTTP | Triggered by |
|---|---:|---|
| `Unauthorized` | 401 | No JWT / invalid signature |
| `Forbidden` | 403 | Policy `[FalconOnly]` fails on `POST /wallets` |
| `OwnerIdNotMatchWithTenantId` | 403 | Cross-tenant read attempt by Client |
| `UnauthorizedUserToPerformThisAction` | 403 | Client trying to write Falcon-only quota fields |

## Infrastructure / External Errors

| Code | HTTP | When |
|---|---:|---|
| `InternalServerError` | 500 | Unhandled exception |
| `UnknownError` | 500 | Catch-all |
| `ExternalServiceError` | 500 | `IIdentityClient.GetUserCountAsync` failure |
| `ExternalServiceTimeout` | 500 | Same — east-west Identity call |

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs` — error code constants
- [VAULT] `falcon-wiki/Home/Software-Architecture-Design/Account-Management-Module.md` — domain rules
