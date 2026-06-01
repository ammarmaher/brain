# SettingController — Endpoints

> Class route prefix: `/api/Setting` ([CODE] `SettingController.cs:16`). **No class-level `[Authorize]`** — only `POST /wallets` has `FalconOnly`.

## Read Endpoints

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Setting?ownerId=` | `Get` | (query `ownerId?`) | `GetSettingsResponse` | `IGetSettingsHandler.ExecuteAsync(new GetSettingsQuery(ownerId))` |
| GET | `/api/Setting/wallets/{ownerId}` | `GetWallet` | (route `ownerId`) | `GetWalletSettingsResponse?` (can be null) | `IGetWalletSettingsHandler.ExecuteAsync(new GetWalletSettingsQuery(ownerId))` |

### `GET /api/Setting`

[CODE] `SettingController.cs:40-46`

```csharp
[HttpGet]
public async Task<ActionResult> Get(string? ownerId)
{
    var result = await _getSettingHandler.ExecuteAsync(new GetSettingsQuery(ownerId));
    return Ok(ServiceOperationResult<GetSettingsResponse>.Success(
        _mapper.Map<GetSettingsResponse>(_mapper.Map<GetSettingsResponse>(result))));
}
```

- `ownerId` is **nullable** — Falcon admin opening Falcon-root settings sends no `ownerId`
- Returns `SecuritySettings` always, `QuotaSettings` only when `ownerId != null` OR user is Client
- **Note the double-map bug** — see OVERVIEW.md Finding #2

### `GET /api/Setting/wallets/{ownerId}`

[CODE] `SettingController.cs:65-72`

```csharp
[HttpGet("wallets/{ownerId}")]
public async Task<ActionResult> GetWallet(string ownerId)
{
    var result = await _getWalletSettingsHandler.ExecuteAsync(new GetWalletSettingsQuery(ownerId));
    return Ok(ServiceOperationResult<GetWalletSettingsResponse?>.Success(
        result is null ? null : _mapper.Map<GetWalletSettingsResponse>(result)));
}
```

- `ownerId` is **required path parameter** (no default)
- Returns `null` (inside SOR) when wallet not yet configured — **not 404**

## Mutation Endpoints

| Method | Route | Action | Request | Response (T) | Handler | Authorization |
|---|---|---|---|---|---|---|
| PUT | `/api/Setting` | `Update` | `UpdateSettingsRequest` | `UpdateSettingsResponse` | `IUpdateSettingsHandler` | (no policy override) |
| POST | `/api/Setting/wallets` | `ConfigureWallet` | `ConfigureWalletSettingsRequest` | `ConfigureWalletSettingsResponse` | `IConfigureWalletSettingsHandler` | **`[Authorize(Policy=FalconOnly)]`** |

### `PUT /api/Setting`

[CODE] `SettingController.cs:48-54`

```csharp
[HttpPut]
public async Task<ActionResult> Update(UpdateSettingsRequest request)
{
    var result = await _updateSettinghandler.ExecuteAsync(_mapper.Map<UpdateSettingsCommand>(request));
    return Ok(ServiceOperationResult<UpdateSettingsResponse>.Success(_mapper.Map<UpdateSettingsResponse>(result)));
}
```

- Body: `UpdateSettingsRequest { ownerId?, securitySettings?, quotaSettings? }`
- Quota updates require `Falcon` user-type ([CODE] `UpdateSettingsHandler.cs:67-75`) — handler-enforced, not policy-enforced
- Publishes 1 or 2 Kafka events: always `TenantIdentitySettingsSyncEvent`, conditionally `TenantIpAllowlistChangedEvent`
- Invalidates `allowed_ips_{ownerId}` HybridCache key on security change

### `POST /api/Setting/wallets`

[CODE] `SettingController.cs:56-63`

```csharp
[HttpPost("wallets")]
[Authorize(Policy = AuthorizationPolicies.FalconOnly)]
public async Task<ActionResult> ConfigureWallet(ConfigureWalletSettingsRequest request)
{
    var result = await _configureWalletSettingsHandler.ExecuteAsync(_mapper.Map<ConfigureWalletSettingsCommand>(request));
    return Ok(ServiceOperationResult<ConfigureWalletSettingsResponse>.Success(_mapper.Map<ConfigureWalletSettingsResponse>(result)));
}
```

- Falcon-only by explicit policy
- Set-once — second call raises `WalletSettingsAlreadyConfigured`
- Publishes `WalletConfiguredEvent` to Charging

## PES (Permission Enforcement Service) Keys

| Endpoint | PES Key (Frontend) | Backend Gate |
|---|---|---|
| `GET /api/Setting` | _none enforced_ | Handler-side `OwnerIdRequired` (client) + `OwnerIdNotMatchWithTenantId` (client tenant isolation) |
| `GET /api/Setting/wallets/{ownerId}` | `falconAccess.adminConsole.accountQuota.view` (inferred) | Handler-side tenant isolation |
| `PUT /api/Setting` | `falconAccess.adminConsole.{rootPasswordSecurityLevel,accountPasswordSecurityLevel,rootAllowedIps,accountAllowedIps,accountQuota}.edit` (split by section) | Handler-side: Falcon-only for quota, Main-node only |
| `POST /api/Setting/wallets` | `falconAccess.adminConsole.walletConfig.create` (Falcon-only) | `[Authorize(Policy=FalconOnly)]` + handler `WalletSettingsAlreadyConfigured` |

[MEMORY] `project_settings_tab_standalone_wave14_2026_05_17` confirms the per-section PES keys; document them as the canonical set when this dossier is cross-validated.

## Status Codes

| Endpoint | Possible Codes |
|---|---|
| `GET /api/Setting` | 200, 400 (OwnerIdRequired), 401, 404 (NodeNotFound, SettingsNotFound, AccountLimitNotFound), 403 (OwnerIdNotMatchWithTenantId) |
| `GET /api/Setting/wallets/{id}` | 200 (with `null` body inside SOR if unconfigured), 400, 401, 403, 404 (NodeNotFound, WalletSettingsOnlyForMainNode) |
| `PUT /api/Setting` | 200, 400, 401, 403 (UnauthorizedUserToPerformThisAction for quota), 404 (NodeNotFound, SettingsNotFound), 422 (SettingsOnlyAllowedForMainNode) |
| `POST /api/Setting/wallets` | 200, 400 (OwnerIdRequired, enum-bind), 401, 403, 404 (MainNodeNotFound, SettingsNotFound), 422 (WalletSettingsOnlyForMainNode, WalletSettingsAlreadyConfigured, InvalidWalletBalanceType) |

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 2 |
| PUT | 1 |
| POST | 1 |
| **Total** | **4** |
