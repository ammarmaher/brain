# TestingAccountsController — Frontend Contract

## Frontend Visibility

This endpoint is **NOT exposed to the main web platform UIs**. It's consumed by the **Charging Lab BFF**, a QA / simulation harness.

If the standard web apps (`admin-console`, `host-shell`, `management-console`) happen to surface this data, it's a development-only path gated by the feature flag.

## Public URL (via System Gateway if exposed)

| URL | Maps to | Auth | Gate |
|---|---|---|---|
| `GET /commerce/testing/accounts?search=&page=&pageSize=` | Commerce `/api/testing/accounts` | Any JWT | Feature flag `TestingCharging.Enabled = true` |

## Headers

- `Authorization: Bearer <jwt>` — required
- `Accept: application/json`

## Request

| Param | Type | Default | Notes |
|---|---|---|---|
| `search` | string? | null | Case-insensitive substring on `Name` |
| `page` | int | 1 (when ≤ 0) | 1-based |
| `pageSize` | int | 50 (when ≤ 0), clamped `[1, 100]` | |

## Response (Success)

```json
{
  "isSuccessful": true,
  "result": {
    "page": 1,
    "pageSize": 50,
    "totalCount": 12,
    "items": [
      {
        "accountId": "acct-001",
        "tenantId": "tenant-acct-001",
        "accountName": "GUCCI North",
        "subscribedApplications": [
          { "applicationId": "app-sms-blast", "applicationName": "SMS Blast", "status": "Active" }
        ],
        "subscribedOwners": [
          { "ownerId": "node-001", "ownerName": "GUCCI North", "ownerType": "NODE" }
        ],
        "walletStrategyConfigured": true,
        "currency": "SAR",
        "walletBalanceType": "NodeBased",
        "walletStructure": "SingleWallet",
        "activeContractCount": 1,
        "totalContractCount": 3,
        "createdAt": "2025-08-12T10:00:00Z"
      }
    ]
  },
  "errorMessages": []
}
```

- `currency`, `walletBalanceType`, `walletStructure` are **enum NAMES (strings)** — not ints
- `status` on applications is the enum NAME
- `ownerType` is `"NODE"` or `"USER"`

## Response (Feature flag off)

HTTP 404 with empty body.

## Response (Empty)

```json
{
  "isSuccessful": true,
  "result": { "page": 1, "pageSize": 50, "totalCount": 0, "items": [] },
  "errorMessages": []
}
```

## Pagination

| Field | Notes |
|---|---|
| `page` | 1-based, normalized from input |
| `pageSize` | Clamped `[1, 100]` |
| `totalCount` | Total matching rows (across pages) |
| `items` | Page slice |

Total page count = `Math.Ceiling(totalCount / pageSize)`.

## Casing & Path Conventions

- Route: `/api/testing/accounts` (lowercase plural, slash-separated)
- Query params: lowercase camelCase (`search`, `page`, `pageSize`)
- JSON wire: camelCase

## Cross-References

- [CODE] `Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` — feature flag
- [CODE] `falcon-core-charging-svc/.../charging-lab/` (Charging Lab BFF — verify in code map)
- [CODE] `Falcon.Commerce.Application/Services/Handlers/Testing/TestingListAccountsHandler.cs` — handler impl

## Frontend Use Cases

1. **Charging Lab account picker** — list accounts with their wallet/contract/owner state so QA can select valid simulation targets
2. **Charging-lab `reserve` command source** — the simulator submits owner IDs from `SubscribedOwners` as the reserve target

## Symmetry / Anti-pattern Note

This is the **only Commerce endpoint that returns paginated data with `Page / PageSize / TotalCount`**. The other endpoints (Contracts list, AccountHierarchy, etc.) return full sets unpaginated. If PRD requires pagination platform-wide, this is the reference shape — otherwise it's a one-off for tooling.
