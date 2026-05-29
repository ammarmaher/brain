# SettingController — Validations

## DTO-Level Validation (attribute-based)

### `UpdateSettingsRequest` + nested

| Field | Attribute |
|---|---|
| `SecuritySettingsRequest.PasswordSecurityLevel` | `[ThrowIfNotEnumValue<ePasswordSecurityLevel>]` |
| All other fields | **None** |

[CODE] `UpdateSettingsRequest.cs:15`

### `ConfigureWalletSettingsRequest`

| Field | Attributes |
|---|---|
| `OwnerId` | `[Required]` |
| `Currency` | `[Required] [EnumDataType(typeof(eCurrency))]` |
| `WalletBalanceType` | `[Required] [EnumDataType(typeof(eWalletBalanceType))]` |
| `WalletType` | `[Required] [EnumDataType(typeof(eWalletBaseType))]` |

[CODE] `ConfigureWalletSettingsRequest.cs:6-22`

**Style note**: `ConfigureWallet` uses **standard DataAnnotations** (`[Required]`, `[EnumDataType]`), while `UpdateSettings` uses **custom Falcon attributes** (`[ThrowIfNotEnumValue<>]`). The codebase has both styles — inconsistent.

## Authorization Validation

| Endpoint | Policy | Handler-side check |
|---|---|---|
| `GET /api/Setting` | (none) | If `_currentUser.UserType == Client && OwnerId == null` → `OwnerIdRequired`. If `Client && resolvedTenantId != _currentUser.TenantId` → `OwnerIdNotMatchWithTenantId` |
| `GET /api/Setting/wallets/{id}` | (none) | If `OwnerId is empty` → `OwnerIdRequired`. If `Client && OwnerId != _currentUser.TenantId` → `OwnerIdNotMatchWithTenantId`. Main-node-only |
| `PUT /api/Setting` | (none) | `QuotaSettings` write requires `Falcon` user-type → otherwise `UnauthorizedUserToPerformThisAction`. Main-node-only |
| `POST /api/Setting/wallets` | `[FalconOnly]` | `OwnerIdRequired`, Main-node-only, set-once |

[CODE] `GetSettingsHandler.cs:59-69, 71-93`, `UpdateSettingsHandler.cs:48-75`, `GetWalletSettingsHandler.cs:58-77`, `ConfigureWalletSettingsHandler.cs:117-141`.

## Handler-Level Validation

### `GetSettingsHandler`

| Step | Source line | Throws |
|---|---|---|
| Client without ownerId | `61-62` | `OwnerIdRequired` → 400 |
| Tenant-id resolution miss | `131` | `NodeNotFound` → 404 |
| Client tenant mismatch | `66-68` | `OwnerIdNotMatchWithTenantId` → 403 |
| SecuritySettings doc missing | `77-78` | `SettingsNotFound` → 404 |
| QuotaSettings doc missing (non-Falcon-root) | `98-99` | `AccountLimitNotFound` → 404 |

### `UpdateSettingsHandler`

| Step | Source line | Throws |
|---|---|---|
| Node existence | `50-51` | `NodeNotFound` → 404 |
| Main-node only | `53-54` | `SettingsOnlyAllowedForMainNode` → 422 |
| Settings doc exists | `58-59` | `SettingsNotFound` → 404 |
| Quota write needs Falcon | `74-75` | `UnauthorizedUserToPerformThisAction` → 403 |

### `ConfigureWalletSettingsHandler`

| Step | Source line | Throws |
|---|---|---|
| `OwnerId` empty | `119-120` | `OwnerIdRequired` → 400 |
| Node existence | `127` | `MainNodeNotFound` → 404 |
| Main-node only | `130-131` | `WalletSettingsOnlyForMainNode` → 422 |
| Set-once | `140-141` | `WalletSettingsAlreadyConfigured` → 409 |
| `WalletConfiguration.Create` | (domain) | Throws on invalid enum combos (verify domain rules) |
| `GetOwnersAsync` unknown balance type | `159` | `InvalidWalletBalanceType` → 400 |

### `GetWalletSettingsHandler`

| Step | Source line | Throws |
|---|---|---|
| `OwnerId` empty | `60-61` | `OwnerIdRequired` → 400 |
| Client tenant mismatch | `64-65` | `OwnerIdNotMatchWithTenantId` → 403 |
| Node existence | `72-73` | `NodeNotFound` → 404 |
| Main-node only | `75-76` | `WalletSettingsOnlyForMainNode` → 422 |

## Cross-Field Validation

### Wallet-type / balance-type interactions

[CODE] `ConfigureWalletSettingsHandler.cs:92-101`: `GetVisibleCommChannelIds(...)` returns empty list for `SingleWallet` and visible-only channel ids for `MultipleWallets`. The frontend should hide CommChannel selection when `WalletType == SingleWallet`.

[CODE] `ConfigureWalletSettingsHandler.cs:146-159`: `GetOwnersAsync` branches by `WalletBalanceType`:
- `UserBased` → asks Identity for all non-AccountOwner users → owners list filled with `OwnerInfo { OwnerId = user.Id, Path = user.Path }`
- `NodeBased` → reads node tree under `mainNodePath` from Commerce DB
- Anything else → `InvalidWalletBalanceType`

### Settings sync to Identity

[CODE] `UpdateSettingsHandler.cs:107-117`: After updating Mongo, the handler reads the **effective** state (newly-set fields + previously-saved fields) and publishes the merged settings via `TenantIdentitySettingsSyncEvent`. This means Identity always has the latest snapshot, regardless of whether the caller updated security or quota or both.

### IP-allowlist cache + Kafka

[CODE] `UpdateSettingsHandler.cs:121-130`: `TenantIpAllowlistChangedEvent` only fires when `newSecurity is not null` (i.e. the caller actually mutated SecuritySettings). The Core Gateway consumes this event and overwrites its Redis projection.

## Order of Validations

1. JSON deserialization → ModelState
2. `[ApiController]` 400 short-circuit on `ConfigureWalletSettingsRequest` if `[Required]` field missing
3. `[ThrowIf*]` attribute middleware on `UpdateSettingsRequest.SecuritySettings.PasswordSecurityLevel`
4. Controller action → AutoMapper → handler
5. Handler-side validation (per table above)
6. Domain-entity validation (e.g. `WalletConfiguration.Create`)

Failures funnel through `ExceptionHandlerMiddleware` → `ServiceOperationResult<T>.Failure`.

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/`:
- **V-026** — password security level enum bounds (enforced by `[ThrowIfNotEnumValue<>]`)
- **V-027** — allowed-ips list format (NOT enforced server-side — verify FE pre-validation)
- **V-028** — wallet set-once (enforced by `WalletSettingsAlreadyConfigured`)
- **V-024** — quota read-only after first save (combined with `AccountHierarchy.CanSave`)
