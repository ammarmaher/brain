# ContractsController — Frontend Contract

## Public URLs

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/Contracts?accountId=<id>` | Commerce `/api/Contracts?accountId=<id>` | Client (own tenant) or Falcon |
| `GET /commerce/Contracts/<contractId>` | Commerce `/api/Contracts/<contractId>` | Client or Falcon |
| `POST /commerce/Contracts` | Commerce `/api/Contracts` | Client or Falcon |
| `PUT /commerce/Contracts/<contractId>` | Commerce `/api/Contracts/<contractId>` | Client or Falcon |

## Headers

- `Authorization: Bearer <jwt>`
- `Content-Type: application/json` (for POST/PUT)
- `Accept: application/json`
- `Accept-Language: en | ar` (drives translated channel/app names)

## Request shapes

### `POST /commerce/Contracts`

```json
{
  "accountId": "acct-987",
  "contractName": "Annual Telecom 2026",
  "farabiReferenceId": "FAR-12345",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z",
  "committedValue": 250000.00,
  "currency": 1,
  "rates": [
    {
      "applicationId": "app-sms-blast",
      "channelId": "ch-sms",
      "priority": "HIGH",
      "destination": "SAU",
      "unit": "msg",
      "ratePerUnit": 0.045
    }
  ],
  "unitConversions": [
    { "code": "SMS_TO_PARTS", "name": "SMS to parts", "priceUnit": "msg", "ratingUnit": "msg-part", "priceValue": 1.0 }
  ],
  "quotas": [
    {
      "quotaCode": "Q-SMS-MONTHLY",
      "channelId": "ch-sms",
      "includedAmount": 100000,
      "includedUnits": 100000,
      "unit": "msg",
      "quotaCategory": "MONTHLY",
      "quotaType": "SMS",
      "scope": "ACCOUNT",
      "subService": null
    }
  ],
  "overageRates": [
    { "subService": "PRIORITY", "channelId": "ch-sms", "unit": "msg", "unitPrice": 0.055, "billingCycle": "MONTHLY" }
  ]
}
```

### `PUT /commerce/Contracts/<id>`

Same shape **minus `accountId`** (immutable).

## Response shapes

### `GET /commerce/Contracts?accountId=<id>`

```json
{
  "isSuccessful": true,
  "result": {
    "contracts": [
      {
        "contractId": "CONTRACT-001",
        "contractName": "Annual Telecom 2026",
        "farabiReferenceId": "FAR-12345",
        "createdAt": "2025-12-15T10:00:00Z",
        "startDate": "2026-01-01T00:00:00Z",
        "endDate": "2026-12-31T23:59:59Z",
        "startLocalDateTime": "2026-01-01 00:00:00",
        "endLocalDateTime": "2026-12-31 23:59:59",
        "businessTimeZone": "Asia/Riyadh",
        "committedValue": 250000.00,
        "remainingBalance": null,
        "status": "active"
      }
    ]
  },
  "errorMessages": []
}
```

- `status` is **lowercased** (e.g. `"active"`, `"pending"`, `"expired"`) — see [CODE] `ListContractsHandler.cs:47`
- `remainingBalance` is **always null** in list response — see [OVERVIEW.md](OVERVIEW.md) Finding #2

### `GET /commerce/Contracts/<id>` (full shape)

Same fields as summary + `AccountId`, `Currency`, `CanEdit`, `TariffPlan`. Status field on this endpoint may differ in casing — verify.

### Error responses

```json
{ "isSuccessful": false, "result": null, "errorMessages": ["Contract not found."] }
```

## Pagination

**Not paginated.** The list endpoint returns all contracts for an account. For large enterprise accounts with many historic contracts, this may produce large payloads. Drift candidate vs PRD.

## Multi-Step Flows

### Create Contract → Activation

1. `POST /commerce/Contracts` — contract stored, status typically `pending`
2. `ContractLifecycleProcess` Hangfire job runs periodically — when `StartDate` passes, transitions to `Active`
3. On transition: `ContractActivatedEvent` published to Charging
4. Charging projects the tariff plan into its rating engine
5. UI may poll `GET /commerce/Contracts/<id>` to see status flip

### Update Contract → Re-activation / Expiration

1. `PUT /commerce/Contracts/<id>` — Update handler recomputes status from new dates
2. If new status is `Active` → publishes `ContractActivatedEvent`
3. If new status is `Expired` → publishes `ContractExpiredEvent`
4. Charging re-projects or invalidates accordingly

## Casing & Path Conventions

- Route: `/api/Contracts` (PascalCase plural — note: different from `ApplicationController` which is singular)
- Path params: lowercase camelCase (`contractId`)
- JSON wire: camelCase

## Cross-References

- [CODE] `apps/admin-console/.../contracts-page/` (inferred — verify in code map)
- [VAULT] `falcon-wiki/50-Services/commerce-contracts.md` (if present)
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/02-prd/PRD-Contracts.md` (if present)

## Frontend Use Cases

1. **Contracts list page** — `GET /commerce/Contracts?accountId=<id>` rendered as table
2. **Contract detail page** — `GET /commerce/Contracts/<id>` with full TariffPlan
3. **New Contract wizard** — `POST /commerce/Contracts` with all 4 sub-collections
4. **Edit Contract** — `PUT /commerce/Contracts/<id>` (gated by `canEdit` flag)
