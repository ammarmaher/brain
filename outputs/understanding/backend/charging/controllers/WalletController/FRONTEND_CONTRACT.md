# WalletController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users):

```
POST /charging/Wallet/get-account-wallets
GET  /charging/Wallet/contract-balance-summaries?accountId=<id>
POST /charging/Wallet/debit
POST /charging/Wallet/authorize
POST /charging/Wallet/reserve
POST /charging/Wallet/commit
POST /charging/Wallet/release
POST /charging/Wallet/transfer
```

Via **System Gateway** (Falcon admins) — same paths with `<system-gateway>/charging/...` prefix. Falcon admins may transfer balance between any two wallets across tenants; client users are restricted to wallets within their tenant by the handler-side `IAccessCurrentUser` enforcement.

## Headers

`Authorization: Bearer <jwt>` — required. No additional headers required from frontend.

## End-to-End Flow Example: WhatsApp Message Charging

```typescript
// 1) Reserve before sending the message
const reserve = await api.post('/charging/Wallet/reserve', {
  accountId: 'acct-1',
  ownerId: 'user-9',
  channel: 'WHATSAPP',
  currency: 1,
  applicationId: 'app-msg',
  unit: 'MESSAGE',
  quantity: 1,
  policyCode: 'WA_DELIVERY_COMMIT',
  referenceType: 'wa-message',
  referenceId: messageId,
  reservationTtlSeconds: 300
});
const { reservationId, expiresAt } = reserve.data.result;

// 2) Send the message via WhatsApp gateway (out of band)
await whatsappGateway.send(...);

// 3) On delivery success webhook from WhatsApp:
await api.post('/charging/Wallet/commit', { reservationId });

// 3') On delivery failure / timeout webhook:
await api.post('/charging/Wallet/release', { reservationId });
```

If step 2 hangs > 300s and webhook arrives late, `Commit` returns `ReservationNotFound` (auto-released). Frontend must handle this — typically by re-reserving and only debiting if the message proves delivered. Often the safer path is `DirectDebit` after delivery confirmation for messages that can be retroactively charged.

## End-to-End Flow Example: Subscription Purchase

```typescript
// Single-shot, idempotent
const debit = await api.post('/charging/Wallet/debit', {
  accountId: 'acct-1',
  amount: 50.00,
  currency: 1,
  referenceType: 'subscription',
  referenceId: 'sub-2026-05',  // unique per period
  description: 'May 2026 subscription',
  serviceId: 'svc-xyz'
});

// debit.data.result.alreadyApplied tells you if this was a retry
// debit.data.result.transactionId is canonical
```

## End-to-End Flow Example: Balance Transfer

```typescript
const transfer = await api.post('/charging/Wallet/transfer', {
  amount: 100,
  currency: 1,
  description: 'Quarterly redistribution',
  source:      { walletId: 'wallet-A', channelId: 'WHATSAPP' },
  destination: { walletId: 'wallet-B', channelId: 'WHATSAPP' }
});
// transfer.data.result.success, transfer.data.result.transactionId
```

Frontend note: `walletId` here is the **wallet entity id** (a Charging internal id). Don't confuse it with the comm-channel wallet id surfaced by `GetAccountWallets` under `commChannelWallets[].id`. They're the same conceptually but the field is named `Id` in the read DTO and `WalletId` in the transfer DTO.

## Display Patterns

### Listing wallets

`GET /charging/Wallet/contract-balance-summaries?accountId=...` is the **management-console-friendly** read — gives you per-contract remaining balance in one call. Use this in the contract management screen.

`POST /charging/Wallet/get-account-wallets` returns the **full wallet tree** (master + per-channel + per-owner sub-wallets). Use this on the account hierarchy screen (or via the **gateway aggregation** `/commerce/accounts/{id}/hierarchy` which merges wallet balances into the node tree automatically).

### Currency

`eCurrency` is a numeric enum on the wire. Match the Charging service's enum definition. **Cross-service drift risk** — verify alignment with Commerce's `eCurrency`.

### Decimal Precision

All money fields are `decimal` (no float). Frontend must use a decimal library to avoid precision loss.

## Idempotency Strategy

For every mutator, supply a **stable** `referenceType + referenceId`. The 24-hour Redis cache (`IdempotencyTtlSeconds: 86400`) deduplicates within that window. After 24h, the same key will be treated as a new request.

`alreadyApplied: true` in the response means "this exact call was already processed — here's the original result". Don't show an error.

## Reservation Lifetime Strategy

Default `reservationTtlSeconds: 300` (5 minutes). For long-running flows (e.g. async WhatsApp delivery with retries), request a longer TTL up front:

```json
{ "reservationTtlSeconds": 1800 }   // 30 min
```

Verify whether the handler clamps. Tracking the `expiresAt` field in the reserve response is the safest bet — set a frontend timer.

## Error Surface

| HTTP Status | Likely Backend Code | Frontend Action |
|---|---|---|
| 400 | `InvalidAmount`, `InvalidChargeRequest`, `InvalidIdempotencyKey`, `InvalidTransferWallets`, `InvalidWalletIdentity` | Show field-level error |
| 403 | `Unauthorized*` | Show "not allowed" |
| 404 | `WalletNotFound`, `WalletSettingsNotFound`, `CommChannelSubWalletNotFound`, `ReservationNotFound`, `NoAnyCommChannelWalletWasFound` | Show "not found" |
| 409 | `WalletVersionConflict`, `Duplicate*` | Show "please retry" |
| 422 | `InsufficientBalance`, `NoApplicableRate` | Show specific business message |

## Multi-Language

No multi-language fields on Wallet endpoints. Error messages are localized via the `Accept-Language` header on the request (server-side `ErrorLocalizer` reads it).

## OpenAPI / Swagger

Available in dev at `https://localhost:7224/swagger`.
