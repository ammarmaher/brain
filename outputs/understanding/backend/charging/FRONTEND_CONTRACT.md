# Charging Service — Frontend Contract

## Base URLs

| Environment | Direct | Via Core Gateway (Client) | Via System Gateway (Falcon admin) |
|---|---|---|---|
| Local dev | `https://localhost:7224/api` | `https://localhost:7038/charging/*` | `https://localhost:7256/charging/*` |
| Prod | n/a (gateway-fronted) | `<core-gateway>/charging/*` | `<system-gateway>/charging/*` |

Path transform: gateway strips `/charging` and prepends `/api/`. So `https://core-gateway/charging/Wallet/transfer` → Charging `/api/Wallet/transfer`.

## Authentication

`Authorization: Bearer <zitadel-jwt>` required for all endpoints **except**:
- `/api/test/kafka/*` (`AllowAnonymous` — dev-only)
- `/health`

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`. **Exception:** `TestKafkaController.PublishTestEvent` returns a bare object — dev-only, ignore.

## Wallet Operation Patterns

### Pre-paid (Direct Debit)

Single-shot final debit, no reserve/commit. Use for system-priced subscriptions or settled invoices.

```
POST /charging/Wallet/debit
{
  "accountId": "acct-123",
  "amount": 10.50,
  "currency": 1,            // eCurrency
  "referenceType": "subscription",
  "referenceId": "sub-456",
  "description": "Monthly fee",
  "serviceId": null
}
→ 200 { transactionId, debitedAmount, remainingBalance, alreadyApplied }
```

**Idempotent** on `referenceType + referenceId` — safe to retry.

### Reserve → Commit | Release (Two-Phase Charging)

Use for usage-based billing where the chargeable amount isn't known until delivery confirms (e.g. WhatsApp message — charged after delivery acknowledgement).

```
POST /charging/Wallet/reserve   (or /authorize — same handler)
{
  "accountId": "acct-123",
  "ownerId": "user-789",
  "channel": "WHATSAPP",
  "currency": 1,
  "applicationId": "app-456",
  "priority": "NONE",
  "destination": "ANY",
  "unit": "MESSAGE",
  "quantity": 1,
  "policyCode": "WA_DELIVERY_COMMIT",
  "referenceType": "wa-message",
  "referenceId": "msg-001",
  "chargeKind": "USAGE",
  "quotaCode": null,
  "subService": null,
  "reservationTtlSeconds": 300
}
→ 200 { reservationId, ratedAmount, quotaUnits, billedUnits, expiresAt, alreadyApplied }

// On delivery success:
POST /charging/Wallet/commit { reservationId }
→ 200 { reservationId, status: "Committed", ratedAmount, quotaUnits, billedUnits, alreadyApplied }

// On delivery failure:
POST /charging/Wallet/release { reservationId }
→ 200 { reservationId, status: "Released", ratedAmount, quotaUnits, billedUnits, alreadyApplied }
```

Reservation auto-expires after `reservationTtlSeconds` (default 300s) — frontend must `Commit` or `Release` within that window or restart the cycle.

### Balance Transfer

```
POST /charging/Wallet/transfer
{
  "amount": 100,
  "currency": 1,
  "description": "Internal transfer",
  "source":      { "walletId": "wallet-A", "channelId": "WHATSAPP" },
  "destination": { "walletId": "wallet-B", "channelId": "WHATSAPP" }
}
→ 200 { success, message, transactionId }
```

### Read: Account Wallets

```
POST /charging/Wallet/get-account-wallets
{
  "accountId": "acct-123",
  "ownerIds":  ["user-1", "user-2"]
}
→ 200 GetAccountWalletsResponse {
        masterWallet: { id, balance? },
        commChannelWallets: [{ id, commChannelId, balance }, ...],
        ownerWallets: [{ id, ownerId, balance?, commChannelSubWallets: [{ commChannelId, walletId, balance }, ...] }, ...]
      }
```

The endpoint uses POST despite being a read — `GetAccountWalletsRequest` doesn't fit easily in a query string because `OwnerIds` is a list. Frontend should use `POST` here.

### Read: Contract Balance Summaries

```
GET /charging/Wallet/contract-balance-summaries?accountId=acct-123
→ 200 GetContractBalanceSummariesResponse { summaries: [{ contractId, availableAmount, ... }] }
```

Used by management-console to display contract remaining balance without recomputing it from wallet docs.

## Idempotency

Every mutation endpoint is idempotent on `referenceType + referenceId` (or for reservations, the reservation id). The `alreadyApplied: true` flag in the response signals a duplicate — treat it as success.

## Currency Field

`eCurrency` is bound as an integer enum on the wire. Frontend must align with the Charging service's currency enum values (defined in `Falcon.Charging.Domain.Constants`). **Cross-service drift risk**: Commerce's `eCurrency` enum may have different numeric values — verify alignment when crossing service boundaries.

## Headers

`Authorization: Bearer <jwt>` required. No tenant or correlation header is required from the frontend (gateways inject).

## CORS

Charging's CORS config is empty in default `appsettings.json` (`"Cors": { "AllowedOrigins": [] }`). Production deployment **must** set this — the frontend will get blocked at the browser level if it calls Charging directly. In practice, the frontend goes through the gateway, which has its own CORS — but if you ever hit Charging directly during dev, set the CORS list.

## Real-Time Charging (Server-Side Stream)

`RealTimeCharging:EventStreamKey = "ocs:realtime-events"` — this is a **Redis stream**, not an HTTP endpoint. Frontend doesn't subscribe to it directly. Internal services (Ledger, downstream consumers) read from it. Mentioned for completeness.

## Charging Lab / Testing Charging

Falcon admin-only, gated by `Settings:TestingCharging:Enabled`. Use via System Gateway aggregation endpoints under `/api/testing/charging/*` — see [`GATEWAY_ROUTE_MAP.md`](../GATEWAY_ROUTE_MAP.md) for the full list. The aggregation re-serializes downstream Charging responses as raw `JsonElement` to avoid duplicating DTOs in the gateway.

## OpenAPI / Swagger

Development only:
- Swagger UI at `https://localhost:7224/swagger`
- OpenAPI JSON at `https://localhost:7224/swagger/v1/swagger.json`

## Multi-Language

No user-facing multi-language fields on the request side. Lookup responses may include `MultiLanguage` for display names.

## Deviation Summary

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant — except `TestKafkaController` (dev-only) |
| camelCase JSON | Framework default (likely camelCase) — not explicitly configured |
| MultiLanguage | Available but unused in mainline contracts |
| Route casing | PascalCase: `/api/Wallet`, `/api/Lookup`. Kebab-case sub-paths: `get-account-wallets`, `contract-balance-summaries`, `debit`, `authorize`, `reserve`, `commit`, `release`, `transfer`. |
| Lowercase property name in DTO | `GetAccountCommChannelSubWalletResponse.walletId` — should be `WalletId`. **Wire impact**: with framework camelCase, this renders as `walletid` (single word) — different from `WalletId` → `walletId`. Treat as a bug. |
