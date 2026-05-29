*** Contracts List — Backend API ***
*** 3 read endpoints + 2 tree-load endpoints · 2026-05-18 ***

# Contracts List — Backend API

> Endpoint surface for the LIST mode only. Add / Edit / View endpoints live in their own folders.

## Backend endpoint summary

| Method | Path | Service | Auth | Request | Response | Phase |
|---|---|---|---|---|---|---|
| GET | `commerce/Node` | Commerce | `[Authorize]` | (none) | `ServiceOperationResult<GetNodeResponse[]>` | Account tree — root |
| GET | `commerce/Node?NodeId={parentId}` | Commerce | `[Authorize]` | query | `ServiceOperationResult<GetNodeResponse[]>` | Account tree — children (NOT USED in contracts panel) |
| GET | `commerce/Setting/wallets/{accountId}` | Commerce | `[Authorize]` | route | `ServiceOperationResult<ApiWalletSettings \| null>` | Wallet strategy gate |
| GET | `commerce/Contracts?accountId={accountId}` | Commerce | `[Authorize]` | query | `ServiceOperationResult<ApiContractListResponse>` | List rows |
| GET | `charging/Wallet/contract-balance-summaries?accountId={accountId}` | Charging | `[Authorize]` | query | `ServiceOperationResult<ApiContractBalanceSummariesResponse>` | Per-contract remaining values |

[BRAIN-OUT] Verify each in `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md` and `Brain Outputs/understanding/backend/charging/ENDPOINT_REGISTRY.md`.

## Gateway routing

- All endpoints routed via **System Gateway** (`/system-gateway/<prefix>`) since admin-console is Falcon-user-side.
- `useGateway()` with no arg → app-default gateway (System Gateway).
- `commerce/*` prefix → falcon-core-commerce-svc
- `charging/*` prefix → falcon-core-charging-svc

## Request DTOs

### Wallet strategy

`GET /api/Setting/wallets/{accountId}` — no body. Route param.

### Contract list

`GET /api/Contracts?accountId={accountId}` — no body. Query param.

### Balance summaries

`GET /api/Wallet/contract-balance-summaries?accountId={accountId}` — no body.

## Response DTO — `ApiContractListResponse`

[INFERRED] from `contracts-api.service.ts:148-163` mapping:

```jsonc
{
  "contracts": [
    {
      "id": "<contract-id>",
      "contractName": "Q1 Voice Contract",
      "farabiReferenceId": "FR-2026-001",
      "createdAt": "2026-01-15T08:00:00",
      "startLocalDateTime": "2026-02-01T00:00:00",
      "endLocalDateTime": "2026-12-31T23:59:59",
      "committedValue": 1000000,
      "currency": "SAR",
      "status": "active",   // pending | active | expired
      "canEdit": true
    }
  ]
}
```

## Response DTO — `ApiContractBalanceSummary`

```jsonc
{
  "contractId": "<contract-id>",
  "remaining": 750000.5,
  "lastUpdated": "2026-05-15T11:30:00"
}
```

## Date serialization

[CODE] `toLocalContractDateValue` lines 419-431:

```typescript
function toLocalContractDateValue(date: Date): string {
  // Contract dates are business dates in Asia/Riyadh.
  // Send a date-like local value; do NOT use toISOString() which shifts the day.
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}
```

## Response wrapper

```
ServiceOperationResult<T> {
  bool isSuccessful,
  T? result,
  string[]? errors,
  string[]? errorMessages
}
```

[CODE] `unwrap` helper lines 411-417 throws with `errors?.[0] ?? errorMessages?.[0] ?? defaultMessage`.

## Error handling specifics

| Endpoint | 404 behavior | Network error | UI effect |
|---|---|---|---|
| `getWalletStrategy` | returns `null` (gateable) | throws | Add button disabled |
| `listContracts` | throws | throws | `pageError` set |
| `getContractBalanceSummaries` | returns `[]` | returns `[]` (swallows!) | Remaining column "—" |

The deliberate error-swallow on balance summaries is by design (graceful Charging downtime).

## Charging round-trip

```
admin-console → System Gateway → (proxies) → Charging Service
                                              │
                                              ▼
                                  Reads ContractBalance projection from MongoDB
                                  (updated by Kafka consumers from commerce.order-*)
                                              │
                                              ▼
                                  Returns aggregated remaining per contract
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
