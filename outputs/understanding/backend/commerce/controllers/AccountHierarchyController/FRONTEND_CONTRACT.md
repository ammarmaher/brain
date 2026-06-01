# AccountHierarchyController — Frontend Contract

## Public URL (via Gateways)

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/accounts/hierarchy?accountId=...&currency=...&balanceDistribution=...&walletStructure=...` | Commerce `/api/accounts/hierarchy` | Client or Falcon JWT |

Both gateways pass through:
- Core Gateway (`localhost:7038` / `core-api.falconhub.space`) — client users
- System Gateway (`localhost:7256` / `system-api.falconhub.space`) — Falcon admins

## Headers

- `Authorization: Bearer <jwt>` — required
- `Accept: application/json`

## Query parameters

| Param | Type | Required | UI Source |
|---|---|---|---|
| `accountId` | string | Yes | Selected account id (Falcon admin: dropdown; Client AO: implicit `_currentUser.TenantId`) |
| `currency` | int (`eCurrency`) | No | Wallet form pre-fill (typically `1` = SAR) |
| `balanceDistribution` | int (`eWalletBalanceType`) | No | Wallet form pre-fill (typically `1` = NodeBased) |
| `walletStructure` | int (`eWalletBaseType`) | No | Wallet form pre-fill (typically `1` = SingleWallet) |

## Response Shape (Success)

```json
{
  "isSuccessful": true,
  "result": {
    "accountId": "acct-987",
    "accountName": "ACME Corp",
    "accountIcon": "data:image/png;base64,iVBORw0KG...",
    "tenantId": "tenant-acct-987",
    "currency": 1,
    "walletBalanceType": 2,
    "walletType": 2,
    "canSave": false,
    "commChannels": [
      { "channelId": "ch-sms", "commChannelName": "SMS" },
      { "channelId": "ch-email", "commChannelName": "Email" }
    ],
    "hierarchy": {
      "nodeId": "node-root-987",
      "nodeName": "ACME Root",
      "subNodes": [
        {
          "nodeId": "node-marketing",
          "nodeName": "Marketing",
          "subNodes": [
            { "nodeId": "node-mkt-eu", "nodeName": "Marketing EU", "subNodes": [] }
          ]
        }
      ]
    }
  },
  "errorMessages": []
}
```

### Notes on the shape

- JSON is **camelCase** (framework default in .NET 6+)
- `commChannels` is `null` (not `[]`) when `walletType == SingleWallet` (= 1)
- `accountIcon` is a full data URL or empty string; never null on success
- `hierarchy.subNodes` is `[]` (empty array) at leaves

## Response Shape (Validation failure)

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Account id is required"]
}
```

HTTP 400 (`AccountIdRequired`) or 404 (`NodeNotFound`) or 422 (`MainNodeOnlyOperation`).

## Pagination

**Not paginated.** Full hierarchy is returned regardless of size.

Stress-test consideration: a 1000-node enterprise account returns a deeply-nested JSON tree in one shot. The `BuildHierarchyAsync` in-memory dictionary assembly is O(N) — Mongo round-trip is O(1) ([CODE] `GetAccountHierarchyHandler.cs:119-138`).

## Multi-Step Flows

### First-paint of org-hierarchy page

1. `GET /commerce/accounts/hierarchy?accountId=<id>` — shell + tree
2. `GET /commerce/Node/{nodeId}/comm-channels/visible/details` — CommChannels tab data ([MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17`)
3. `GET /commerce/Node/{nodeId}/applications` — Apps tab data
4. `GET /commerce/setting?ownerId=<accountId>` — Settings tab data ([MEMORY] `project_settings_tab_standalone_wave14_2026_05_17`)

The frontend issues these in parallel using `forkJoin(...)`. The first call drives the tree skeleton; the other three hydrate tabs.

### After wallet config first save

1. `POST /commerce/Setting/wallets` — `ConfigureWalletSettingsRequest` (Falcon-only)
2. Frontend refetches `GET /commerce/accounts/hierarchy?accountId=<id>` — `canSave` now `false`, wallet read-only

## Casing & Path Conventions

- Route: lowercase + slash-separated (`/accounts/hierarchy`)
- Query params: camelCase (`accountId`, not `AccountId`) — framework default model binding is case-insensitive but the OpenAPI doc emits camelCase
- Response: camelCase fields

## Cross-References

- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` — wizard
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/` — settings tab dossier
- [MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` — per-tab data flow
- [MEMORY] `project_settings_tab_standalone_wave14_2026_05_17` — settings consumer
- [CODE] `apps/admin-console/.../org-hierarchy-page/services/services.ts` — `HierarchyService` consumer

## Frontend Consumption Files

| File | Endpoint Method |
|---|---|
| `apps/admin-console/.../org-hierarchy-page/services/services.ts` | `HierarchyService.getAccountHierarchy(accountId, params)` |
| `apps/host-shell/.../core/account/account-api.service.ts` | (alt host-shell consumer, if present — verify in code map) |
