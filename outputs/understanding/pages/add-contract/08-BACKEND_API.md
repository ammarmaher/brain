*** Add Contract — Backend API ***
*** Composite POST + 3 lookups · 2026-05-18 ***

# Add Contract — Backend API

## Endpoint summary

| Method | Path | Service | Phase |
|---|---|---|---|
| GET | `commerce/Node/{accountId}/applications` | Commerce | Lookup (wizard open) |
| GET | `commerce/Node/{accountId}/comm-channels/visible` | Commerce | Lookup (wizard open) |
| GET | `commerce/Setting/wallets/{accountId}` | Commerce | Gate check (precondition) |
| **POST** | **`commerce/Contracts`** | **Commerce** | **Step 4 Finish submit** |

## Composite request — `CreateContractRequest`

[CODE] `contracts-api.service.ts:178-182` + `toCreatePayload` (lines 350-410):

```jsonc
{
  "accountId": "<account-id>",
  "contractName": "Q1 2026 Voice & WhatsApp",
  "farabiReferenceId": "FR-2026-001",
  "startDate": "2026-02-01T00:00:00",        // YYYY-MM-DDT00:00:00 local
  "endDate": "2026-12-31T00:00:00",
  "committedValue": 1000000,
  "currency": 1,                              // 1=SAR
  "unitConversions": [
    {
      "code": "WHATSAPP",
      "name": "WhatsApp Business",
      "priceUnit": "ONE_KSA_TRANSACTION",
      "ratingUnit": "MESSAGE",
      "priceValue": 0.05
    },
    {
      "code": "VOICE",
      "name": "Voice",
      "priceUnit": "ONE_KSA_SECOND",
      "ratingUnit": "SECOND",
      "priceValue": 0.001
    }
  ],
  "rates": [
    {
      "applicationId": "<app-id>",
      "channelId": "<channel-id>",
      "priority": "AUTHENTICATION",
      "destination": "SAU",
      "unit": "MESSAGE",
      "ratePerUnit": 0.05
    }
    /* ... 44 entries for WhatsApp matrix ... */
  ],
  "quotas": [
    {
      "quotaCode": "WHATSAPP_MESSAGE",
      "channelId": "<channel-id>",
      "includedAmount": 5000,
      "includedUnits": null,
      "unit": "SAR",
      "quotaCategory": "USAGE",
      "quotaType": "FREE_CREDIT",
      "scope": "ACCOUNT",
      "subService": ""
    }
  ],
  "overageRates": [
    {
      "subService": "WHATSAPP_TEMPLATE",
      "channelId": "<channel-id>",
      "unit": "TEMPLATE",
      "unitPrice": 10,
      "billingCycle": "PER_USE"
    }
  ]
}
```

## Response — `ApiContractResponse`

```jsonc
{
  "isSuccessful": true,
  "result": {
    "id": "<new-contract-id>",
    "accountId": "<account-id>",
    "contractName": "...",
    "farabiReferenceId": "...",
    "startDate": "2026-02-01T00:00:00",
    "endDate": "2026-12-31T00:00:00",
    "committedValue": 1000000,
    "currency": 1,
    "status": "pending",
    "canEdit": true,
    "createdAt": "2026-05-18T...",
    "unitConversions": [...],
    "rates": [...],
    "quotas": [...],
    "overageRates": [...]
  }
}
```

[CODE] `mapApiContractResponseToDetails` lines 256-296 maps wire shape to FE `ContractDetails`.

## Gateway routing

- `commerce/*` → System Gateway → Commerce Service.
- `useGateway()` with no arg = app-default = System Gateway.
- Auth: JWT Bearer.

## Casing

Commerce uses **PascalCase** on wire per [BRAIN-OUT] `FRONTEND_CONTRACT.md`. The FE HttpClient interceptor or `toCreatePayload` mapper must produce PascalCase keys. **Verify at runtime.**

## Backend validation chain

[BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/VALIDATIONS.md` — `CreateContractRequest` validator:

- Account exists + wallet strategy configured.
- `farabiReferenceId` unique per account.
- `startDate >= today` (PRD BR-CC-01).
- `endDate > startDate` (same-day adjusted at BE).
- `committedValue > 0`.
- `unitConversions` ≥ 1 with valid catalog combos.
- `rates` matches matrix shape (every (app × channel × priority × destination) cell).
- `quotas` per category-rule.
- `overageRates` per `billingCycle` enum.

## Error wrapper

```
ServiceOperationResult<T> {
  bool isSuccessful,
  T? result,
  string[]? errors,
  string[]? errorMessages   // localized
}
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [12-ERROR_STATES](12-ERROR_STATES.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
