# NodeController — Frontend Contract

## Public URLs (via Core Gateway, Client users)

| Frontend URL | Maps to | Auth needed |
|---|---|---|
| `GET /commerce/Node?NodeId=...` | Commerce `/api/Node?NodeId=...` | Client JWT |
| `POST /commerce/Node/create-account` | Commerce `/api/Node/create-account` | Client JWT (typically blocked at handler level for client users — verify) |
| `POST /commerce/Node/create-SubNode` | Commerce `/api/Node/create-SubNode` | Client JWT |
| `PUT /commerce/Node/ChangeNodeName` | Commerce `/api/Node/ChangeNodeName` | Client JWT |
| `GET /commerce/Node/{id}/comm-channels` | Commerce `/api/Node/{id}/comm-channels` | Client JWT |
| `GET /commerce/Node/{id}/comm-channels/visible` | Commerce `/api/Node/{id}/comm-channels/visible` | Client JWT |
| `GET /commerce/Node/{id}/comm-channels/visible/details` | Commerce `/api/Node/{id}/comm-channels/visible/details` | Client JWT |
| `GET /commerce/Node/{id}/applications` | Commerce `/api/Node/{id}/applications` | Client JWT |
| `POST /commerce/Node/comm-channel/do-payment` | Commerce `/api/Node/comm-channel/do-payment` | Client JWT |
| `POST /commerce/Node/application/do-payment` | Commerce `/api/Node/application/do-payment` | Client JWT |
| `POST /commerce/Node/comm-channel/disable` (or enable) | Commerce `/api/Node/comm-channel/disable` | Client JWT |
| `POST /commerce/Node/application/disable` (or enable) | Commerce `/api/Node/application/disable` | Client JWT |
| `GET /commerce/Node/order/{orderId}/status` | Commerce `/api/Node/order/{orderId}/status` | Client JWT |
| `GET /commerce/Node/ValidateAccountName?AccountName=...` | Commerce `/api/Node/ValidateAccountName?AccountName=...` | Client JWT |

## Falcon-Admin-Only URLs (via System Gateway)

Visibility, pricing, and pending-price-deletion operations all require `FalconOnly` policy. Use System Gateway:

| Frontend URL | Maps to | Auth |
|---|---|---|
| `PUT /commerce/Node/comm-channel/visibility` | Commerce `/api/Node/comm-channel/visibility` | Falcon JWT |
| `PUT /commerce/Node/application/visibility` | Commerce `/api/Node/application/visibility` | Falcon JWT |
| `PUT /commerce/Node/comm-channel/price-type` | … | Falcon JWT |
| `PUT /commerce/Node/comm-channel/price-value` | … | Falcon JWT |
| `PUT /commerce/Node/application/price-type` | … | Falcon JWT |
| `PUT /commerce/Node/application/price-value` | … | Falcon JWT |
| `DELETE /commerce/Node/comm-channel/new-price-type` | … | Falcon JWT |
| `DELETE /commerce/Node/comm-channel/new-price-value` | … | Falcon JWT |
| `DELETE /commerce/Node/application/new-price-type` | … | Falcon JWT |
| `DELETE /commerce/Node/application/new-price-value` | … | Falcon JWT |

## Headers

- `Authorization: Bearer <jwt>` — required for all
- `Content-Type: application/json` — for body-bearing requests
- `Accept: application/json`
- (No tenant/correlation header injection required from frontend — gateways add `X-Tenant-Id` and `X-Correlation-Id` based on JWT and trace context)

## Response Shape Examples

### `GET /commerce/Node?NodeId=acct-123` (Hierarchy)

```json
{
  "isSuccessful": true,
  "result": [
    {
      "nodeId": "acct-123",
      "nodeName": "ACME",
      "subNodes": [
        { "nodeId": "node-1", "nodeName": "Marketing", "subNodes": [] }
      ]
    }
  ],
  "errorMessages": []
}
```

(Camel-case assumed — Commerce uses framework default, which is camelCase in .NET 6+.)

### `POST /commerce/Node/create-account` (Success)

```json
{
  "isSuccessful": true,
  "result": { "accountId": "acct-987" },
  "errorMessages": []
}
```

### `POST /commerce/Node/create-account` (Validation failure)

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Account name is required", "Owner role is invalid"]
}
```

with HTTP 400 (Bad Request).

### `PUT /commerce/Node/comm-channel/visibility` from a Client user (Forbidden)

The Core Gateway YARP `commerce-proxy` will allow this request because the policy is `ClientOnly`. But the Commerce endpoint has `[Authorize(Policy = FalconOnly)]` — so Commerce returns HTTP 403 with `errorMessages: ["..."]`.

## Pagination

NodeController endpoints are **not paginated** in this scan. All list endpoints (`GetHierarchy`, `GetAccountCommunicationChannels`, `GetAccountApplications`, etc.) return full lists.

## Multi-Step Flows

### Account Creation

1. `POST /commerce/Node/create-account` with `CreateAccountRequest` → triggers `ICreateMainNodeProcess`
2. Process publishes `commerce.user-creation-requested.v1` → Identity consumes, creates Zitadel user, publishes back
3. Process publishes `commerce.user-wallet-create.v1` → Charging consumes, creates wallet
4. Process publishes `commerce.identity-settings-sync.v1` → Identity syncs password policy
5. Frontend should poll `GET /commerce/Node?NodeId=<returned>` to see the populated hierarchy after a short delay (eventual consistency)

### Service Order ("Do Payment")

1. `POST /commerce/Node/comm-channel/do-payment` → returns order id
2. `commerce.order-created.v1` published
3. Charging processes payment, publishes `charging.order-payment-processed.v1`
4. Commerce consumes the result and updates order status
5. Frontend polls `GET /commerce/Node/order/{orderId}/status`

## Casing & Path Conventions

NodeController routes are a mix:
- PascalCase: `ChangeNodeName`, `ValidateAccountName`
- kebab-case: `comm-channel/visibility`, `application/price-type`, `create-account`, `create-SubNode` (note: `SubNode` is PascalCase inside kebab — inconsistent)
- `{id}` vs `{NodeId}` route parameters used inconsistently

Frontend HttpClient code must match exactly.

## Deviation Summary

- camelCase JSON: not explicit, framework default
- PascalCase route names: deviates from kebab-case used elsewhere
- 25-dependency constructor: smells; not your problem as a consumer but it makes endpoint behaviour brittle
- Method overload (`ChangeCommunicationChannelPriceType`): could break OpenAPI; verify Swagger UI renders both endpoints
- Missing handler-field assignment in constructor (potential NRE at `application/price-type` path) — see [`OVERVIEW.md`](OVERVIEW.md) finding #4
