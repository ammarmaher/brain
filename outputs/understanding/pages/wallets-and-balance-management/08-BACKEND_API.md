*** Wallets — Backend API ***
*** 3 feature endpoints + 2 tree · 2026-05-18 ***

# Wallets — Backend API

## Endpoint summary

| Method | Path | Service | Auth | Request | Response | Phase |
|---|---|---|---|---|---|---|
| GET | `commerce/Node` | Commerce | `[Authorize]` | (none) | `ServiceOperationResult<GetNodeResponse[]>` | Tree root |
| GET | `commerce/Node?NodeId={id}` | Commerce | same | query | same | Tree children |
| GET | `api/commerce/accounts/{accountId}/hierarchy?currency=&balanceDistribution=&walletStructure=` | **System Gateway aggregator** (joins Commerce + Charging) | `[Authorize]` | route + query | `ServiceOperationResult<IWalletDataResponse>` | Hierarchy + balances |
| POST | `commerce/setting/wallets` | Commerce | `[Authorize]` | `ISaveBalancesRequest` | `ServiceOperationResult` | Save strategy |
| POST | `charging/wallet/transfer` | Charging | `[Authorize]` | `ITransferRequest` | `ServiceOperationResult<ITransferResponse>` | Execute transfer |

## Aggregator endpoint (the special one)

```
GET api/commerce/accounts/{accountId}/hierarchy
    ?currency=1
    &balanceDistribution=2
    &walletStructure=2
```

[CODE] `wallet-balance.service.ts:55-61` comment:

> This page needs the System Gateway aggregation endpoint: Commerce supplies account hierarchy and configured strategy. Charging supplies the canonical OCS master/channel/owner balances. Calling `/commerce/accounts/hierarchy?accountId=...` goes through the generic Commerce proxy and cannot populate the master wallet balance.

So **System Gateway has a custom aggregator** that:
1. Calls Commerce for hierarchy + strategy.
2. Calls Charging for live balances.
3. Joins them server-side.
4. Returns one consolidated payload.

Note the **`api/` prefix** — unique among Commerce-facing URLs in this codebase. The other commerce/* URLs don't have this prefix.

## `IWalletDataResponse` shape

```jsonc
{
  "accountId": "<id>",
  "accountName": "...",
  "currency": 1,
  "balanceDistribution": 2,
  "walletStructure": 2,
  "summary": {
    "totalBalance": 10000.000
  },
  "channels": [
    { "channelCode": "WHATSAPP", "channelName": "WhatsApp", "balance": 5000.0, "balanceType": "CommChannel" },
    ...
  ],
  "subNodes": [
    { "nodeId": "...", "label": "...", "balance": 2000.0, "balanceType": "Node" },
    ...
  ],
  "users": [
    { "userId": "...", "userName": "...", "balance": 100.0, "balanceType": "User" },
    ...
  ]
}
```

## `ISaveBalancesRequest`

```jsonc
{
  "ownerId": "<account-id>",
  "currency": 1,
  "walletBalanceType": 2,
  "walletType": 2
  // "changes": [...]  // commented OUT — dead code
}
```

## `ITransferRequest`

```jsonc
{
  "accountId": "...",
  "sourceWalletId": "...",
  "sourceWalletType": "CommChannel",
  "destinationWalletId": "...",
  "destinationWalletType": "Master",
  "currency": 1,
  "amount": 500.000,
  "description": "Refund from WhatsApp to Master"
}
```

## `ITransferResponse`

```jsonc
{
  "transactionId": "<txn-id>",
  "newSourceBalance": 4500.000,
  "newDestinationBalance": 10500.000,
  "timestamp": "2026-05-18T..."
}
```

## Casing

[INFERRED] All three endpoints use camelCase wire (Identity-like style). But verify — Commerce typically uses PascalCase. This is **another inconsistency** (besides the `api/` prefix difference).

## Gateway routing

All 5 endpoints → System Gateway (admin-console default = `Gateway.SystemGateway`). The aggregator routes to both Commerce + Charging internally.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
