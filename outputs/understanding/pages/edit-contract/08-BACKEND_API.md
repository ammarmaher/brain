*** Edit Contract — Backend API ***
*** 2026-05-18 ***

# Edit Contract — Backend API

## Endpoint summary

| Method | Path | Service | Phase |
|---|---|---|---|
| GET | `commerce/Contracts/{contractId}` | Commerce | Page load — pre-populate |
| GET | `commerce/Node/{accountId}/applications` | Commerce | Lookup |
| GET | `commerce/Node/{accountId}/comm-channels/visible` | Commerce | Lookup |
| GET | `commerce/Setting/wallets/{accountId}` | Commerce | Lookup |
| **PUT** | **`commerce/Contracts/{contractId}`** | **Commerce** | **Save** |

## Request — `UpdateContractRequest`

[CODE] `contracts-api.service.ts:184-188` + `toUpdatePayload` lines 350-410:

Same shape as `CreateContractRequest` (4 nested arrays). Backend uses request type discrimination on the route's `{contractId}` parameter.

## Response

`ServiceOperationResult<ApiContractResponse>` → `ContractDetails` (same shape as Add).

## Status-aware backend behavior

- Active contract → BE checks: did any commercial field change? If yes → 422 `Error.Contracts.CommercialFieldLockedOnActive`.
- Expired contract → BE checks: did anything except endDate change? If yes → 422. Also if new endDate > today → flips status to active.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [../add-contract/08-BACKEND_API.md](../add-contract/08-BACKEND_API.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
