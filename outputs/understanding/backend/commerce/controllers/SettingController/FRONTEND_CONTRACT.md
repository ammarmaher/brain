# SettingController — Frontend Contract

## Public URLs (via Gateways)

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/setting?ownerId=<id>` | Commerce `/api/Setting?ownerId=<id>` | Client (own tenant) or Falcon JWT |
| `GET /commerce/setting/wallets/<ownerId>` | Commerce `/api/Setting/wallets/<ownerId>` | Client (own tenant) or Falcon JWT |
| `PUT /commerce/setting` | Commerce `/api/Setting` | Client (security only) or Falcon (quota too) |
| `POST /commerce/setting/wallets` | Commerce `/api/Setting/wallets` | **Falcon JWT only** (System Gateway) |

## Headers

- `Authorization: Bearer <jwt>` — required
- `Content-Type: application/json` — for body-bearing requests
- `Accept: application/json`

## Request shapes

### `GET /commerce/setting?ownerId=acct-123`

No body. Single query param `ownerId` (optional for Falcon admin opening Falcon-root).

### `PUT /commerce/setting`

```json
{
  "ownerId": "acct-123",
  "securitySettings": {
    "passwordSecurityLevel": 2,
    "allowedIps": ["10.0.0.0/24", "203.0.113.42"]
  },
  "quotaSettings": {
    "maxNormalUserLimit": 50,
    "maxSystemUserLimit": 0,
    "maxNodeLevels": 5,
    "balanceTransferLimitPercentage": 80.0
  }
}
```

- Either `securitySettings` or `quotaSettings` may be `null` — only the non-null section is updated
- `passwordSecurityLevel` is the enum int (`Normal=1`, `High=2`, `Critical=3` — verify)
- `quotaSettings` write requires Falcon JWT (handler-enforced)
- camelCase wire shape; **note the camelCase property names** carry over from C# convention deviation (see DTOS.md)

### `POST /commerce/setting/wallets`

```json
{
  "ownerId": "acct-123",
  "currency": 1,
  "walletBalanceType": 2,
  "walletType": 2
}
```

- All four fields `[Required]`
- Falcon-only via `FalconOnly` policy

## Response shapes

### `GET /commerce/setting` (Success — full)

```json
{
  "isSuccessful": true,
  "result": {
    "securitySettings": {
      "passwordSecurityLevel": 2,
      "allowedIps": ["10.0.0.0/24"]
    },
    "quotaSettings": {
      "maxNormalUserLimit": 50,
      "maxSystemUserLimit": 0,
      "maxNodeLevels": 5,
      "balanceTransferLimitPercentage": 80.0,
      "currentNodeLevels": 3,
      "currentSystemUserLimit": 0,
      "currentNormalUserLimit": 12
    }
  },
  "errorMessages": []
}
```

### `GET /commerce/setting` (Falcon admin, no ownerId)

```json
{
  "isSuccessful": true,
  "result": {
    "securitySettings": { "passwordSecurityLevel": 2, "allowedIps": null },
    "quotaSettings": null
  },
  "errorMessages": []
}
```

Frontend treats `quotaSettings: null` as "Falcon root has no quota section — render only Security + IP allowlist".

### `GET /commerce/setting/wallets/<id>` (Wallet configured)

```json
{
  "isSuccessful": true,
  "result": {
    "currency": 1,
    "walletBalanceType": 2,
    "walletType": 2
  },
  "errorMessages": []
}
```

### `GET /commerce/setting/wallets/<id>` (Wallet NOT configured)

```json
{
  "isSuccessful": true,
  "result": null,
  "errorMessages": []
}
```

Status is **200** — null result is the expected unconfigured state, NOT 404.

### Error response

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Wallet settings already configured."]
}
```

With HTTP from the ERRORS.md table.

## Multi-Step Flows

### Settings tab first paint (Wave 14)

1. `forkJoin([GET /commerce/setting?ownerId=<id>, GET /commerce/Setting/wallets/<id>])` — initial load
2. Form rendered in **view mode** with fetched values
3. User clicks "Edit" → form transitions to **edit mode**
4. Save → `PUT /commerce/setting` with the diff
5. Toast on success; refetch via the same forkJoin

[MEMORY] `project_settings_tab_standalone_wave14_2026_05_17` documents the `SettingsTabStateSlice` orchestration.

### Wallet configuration (Add Client wizard Step 5 / 1-time setup)

1. Falcon admin completes Add Client wizard → `POST /commerce/Node/create-account` returns `accountId`
2. Admin opens new account → `GET /commerce/accounts/hierarchy?accountId=<id>` → `canSave: true`
3. Admin opens wallet panel → fills currency/balance/type → `POST /commerce/setting/wallets`
4. Backend publishes `WalletConfiguredEvent` to Charging — Charging creates wallet
5. Frontend refetches `GET /commerce/accounts/hierarchy` → `canSave: false`, wallet panel becomes read-only

### IP allowlist change → Core Gateway sync

1. `PUT /commerce/setting` with `securitySettings.allowedIps: [...]`
2. Commerce writes Mongo + publishes `TenantIpAllowlistChangedEvent`
3. Core Gateway Kafka consumer overwrites Redis `tenant:{tenantId}:ipAllowlist:v1`
4. Gateway middleware enforces new list on next request

## Pagination

**No paged endpoints in this controller.** All shapes are single-document.

## Casing & Path Conventions

- Route is `/api/Setting` (PascalCase) — but the path through the gateway is **lowercased** at the frontend service layer (gateways pass through case-sensitively, so verify your `HttpClient.baseUrl` matches the controller route case exactly — `commerce/Setting` vs `commerce/setting`)
- JSON wire is camelCase
- DTOs have camelCase property names on the request/response side (deviation from C# convention)

## Cross-References

- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/` — Settings tab dossier
- [MEMORY] `project_settings_tab_standalone_wave14_2026_05_17` — FE consumer
- [CODE] `apps/admin-console/.../tab-components/settings-tab/services/settings.service.ts` — FE service file
- [CODE] `apps/admin-console/.../tab-components/settings-tab/signals/settings-tab.state.ts` — state slice

## PES Keys (canonical — from Wave 14 memory)

| Section | Falcon-side | Client-side (Account Owner) |
|---|---|---|
| Root password security level | `falconAccess.adminConsole.rootPasswordSecurityLevel.edit` | not applicable |
| Account password security level | `falconAccess.adminConsole.accountPasswordSecurityLevel.edit` | (verify in code) |
| Root allowed IPs | `falconAccess.adminConsole.rootAllowedIps.edit` | not applicable |
| Account allowed IPs | `falconAccess.adminConsole.accountAllowedIps.edit` | (verify in code) |
| Account quota | `falconAccess.adminConsole.accountQuota.edit` | not applicable (Falcon-only) |

The Settings tab gates each section's edit button by the matching PES key.
