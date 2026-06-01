# TestingChargingController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users):

```
GET  /charging/testing/charging/accounts/{accountId}/overview
GET  /charging/testing/charging/accounts/{accountId}/wallets
GET  /charging/testing/charging/accounts/{accountId}/reservations?page=&pageSize=&walletId=&status=&refId=
GET  /charging/testing/charging/accounts/{accountId}/ledger?page=&pageSize=&walletId=&contractId=&refType=&refId=&ledgerType=&from=&to=
GET  /charging/testing/charging/accounts/{accountId}/balances
GET  /charging/testing/charging/runs?accountId=&page=&pageSize=
GET  /charging/testing/charging/runs/{runId}
POST /charging/testing/charging/whatsapp/batches
POST /charging/testing/charging/whatsapp/batches/{runId}/deliveries
```

Via **System Gateway** (Falcon admins) — same paths with `<system-gateway>/charging/...` prefix.

**Pre-flight check** — before binding any FE component to these URLs, hit any one of them and check:
- 200 + envelope → feature enabled, proceed
- 404 (no body) → feature disabled, hide the Lab UI

## Headers

| Header | Required | Effect |
|---|---|---|
| `Authorization: Bearer <jwt>` | yes | Class-level `[Authorize]` |
| `Accept-Language` | no | Error message localization |

## End-to-End Flow: Manual WhatsApp Batch

```typescript
// 1) Create the batch (Manual mode — reserves immediately, holds for inspection)
const create = await api.post<ServiceOperationResult<TestingChargingRun>>(
  '/charging/testing/charging/whatsapp/batches',
  {
    accountId: 'acct-1',
    ownerId: 'user-9',
    channelId: null,                     // null → service resolves from active tariff
    applicationId: 'app-msg',
    priority: 'UTILITY',
    destination: 'ANY',
    unit: 'MESSAGE',
    currency: 1,                         // eCurrency.SAR
    messageCount: 10,
    quantityPerMessage: 1,
    reservationTtlSeconds: 3600,         // Manual mode floors to ≥3600 anyway
    parallelism: 20,
    deliveryMode: 'Manual',
    successRate: null
  }
);

const run = create.data.result;
const failedReserves = run.messages.filter(m => m.reservationStatus === 'ReserveFailed');
if (failedReserves.length > 0) {
  // Show "X of N reservations failed" with per-row reasons
  failedReserves.forEach(m => console.log(`msg ${m.sequence}: ${m.error}`));
}

// 2) Inspect the run / wallet state via:
//    GET /charging/testing/charging/runs/{runId}
//    GET /charging/testing/charging/accounts/{accountId}/balances

// 3) Trigger delivery for specific messages
const triggered = await api.post<ServiceOperationResult<TestingChargingRun>>(
  `/charging/testing/charging/whatsapp/batches/${run.runId}/deliveries`,
  {
    deliveryMode: 'AutoDelivered',       // all selected → commit
    sequences: [1, 3, 5]                  // null = all non-terminal
  }
);
```

## End-to-End Flow: Auto Batch (Fire-And-Forget)

```typescript
// One-shot: create + immediate auto-delivery
const auto = await api.post<ServiceOperationResult<TestingChargingRun>>(
  '/charging/testing/charging/whatsapp/batches',
  {
    accountId: 'acct-1',
    ownerId: 'user-9',
    applicationId: 'app-msg',
    messageCount: 50,
    deliveryMode: 'MixedBySuccessRate',
    successRate: 75
  }
);
// auto.data.result.committedCount ≈ 38, releasedCount ≈ 12 (deterministic)
```

When `deliveryMode != Manual`, `CreateWhatsappBatch` immediately invokes `TriggerWhatsappDeliveriesAsync(runId, ...)` internally — the response includes the final commit/release outcomes per message in one round-trip.

## Display Patterns

### Overview Dashboard

```
+---------------------------------------------------+
|  Available: 1,234.56 SAR    Reserved: 50.00 SAR  |
|  Consumed:   789.00 SAR                          |
|---------------------------------------------------|
|  Wallets: 5     Buckets: 12                      |
|  Active Reservations: 3                          |
|  Committed: 120  Released: 45  Failed Tests: 2   |
|  Last Ledger: 2026-05-17 16:42                   |
|  Last Run: testing-wa-r-abc (10 msgs, Committed)  |
+---------------------------------------------------+
```

Source: `GET /accounts/{accountId}/overview`.

### Per-Wallet Grid

Render `TestingChargingWalletSnapshotResponse[]` as rows; click a row to expand `buckets` (the `Buckets` field is included in the same payload — no second request).

### Reservation Grid (Paged)

```
GET /accounts/{accountId}/reservations?page=1&pageSize=50&status=Active&walletId=...
```

Columns: `reservationId`, `walletId`, `status`, `policyCode`, `refType`, `refId`, `ratedAmount`, `quotaUnits`, `billedUnits`, `expiresAt`, `allocationSummary`. The `allocationSummary` is a joined `BucketType:BucketId:Amount, ...` string — render as a tooltip or split client-side.

### Ledger Grid (Paged)

```
GET /accounts/{accountId}/ledger?page=1&pageSize=50&from=2026-05-01&to=2026-05-31&ledgerType=Reserve
```

Columns: `id`, `walletId`, `bucketId`, `contractId`, `type`, `refType`, `refId`, `amount`, `currency`, `createdAt`. Sort UI on the client (response is already sorted server-side — verify).

### Contract Balance Summaries

Use `GET /accounts/{accountId}/balances` and read `result.contractSummaries[]`. Each summary has:
- `contractId`
- `currency`
- `totalFundedAmount`
- `availableAmount`
- `reservedAmount`
- `consumedAmount`
- `updatedAt`

This is the **lab equivalent of `WalletController.GetContractBalanceSummaries`** with an `UpdatedAt` field and a projection-lag caveat (the snapshot may lag if Redis real-time pipeline is enabled).

### Run Grid

```
GET /charging/testing/charging/runs?accountId=acct-1&page=1&pageSize=50
```

For each run, columns: `runId`, `channel`, `applicationId`, `messageCount`, `reservedCount`, `committedCount`, `releasedCount`, `failedCount`, `deliveryMode`, `status`, `createdAt`. Click a row to drill into messages.

### Run Detail

```
GET /charging/testing/charging/runs/{runId}
```

Returns the run with embedded `messages[]`. Each message has `sequence`, `referenceId`, `reservationId`, `reservationStatus`, `deliveryStatus`, `ratedAmount`, `error`. Render as a sortable table.

## Frontend Filter Cookbook

| Filter | Query | Notes |
|---|---|---|
| Active reservations only | `?status=Active` | enum string match |
| Reservations for one wallet | `?walletId=<id>` | |
| Reservations matching a ref id substring | `?refId=msg-abc` | substring (verify on backend) |
| Ledger for last 24h | `?from=<now-24h>&to=<now>` | ISO 8601 string |
| Ledger of one ref id | `?refType=USAGE&refId=msg-abc` | both filters AND-combined |
| Ledger by bucket | `?walletId=W&from=...&to=...` then client-side filter by `bucketId` | (no direct `bucketId` filter) |
| Runs for one account | `?accountId=acct-1` | |

## Idempotency Strategy

- **Single-record idempotency** is owned by the underlying reserve/commit/release handlers — 24h Redis cache, ref id `testing-wa-{runId}-{sequence}`.
- **Batch-level idempotency** is **not provided**. Re-calling `CreateWhatsappBatch` produces a new run with a fresh `runId` and a fresh set of references. To repeat a previous batch's intent, the FE should track the prior `runId` and call `TriggerWhatsappDeliveries({runId})` instead.

## Reservation TTL Strategy

- **Manual mode**: TTL is automatically floored to 3600 seconds. Use `runs/{runId}` to inspect reservations before triggering deliveries.
- **Auto modes**: TTL respects the caller's `ReservationTtlSeconds` value (default 3600 in request — service default 300 in production handler).
- The lab UI should display the live expiry timestamp per reservation (`reservation.expiresAt`) so QAs see the deadline.

## Channel Resolution Caveat

When `channelId` is omitted from the request, the service resolves it from the active tariff cache. If the cache is stale (e.g. tariff just published, projection consumer lagging), the request may fail with `NoApplicableRate` even though a wallet exists. The FE should retry once after a few seconds, or fall back to manual `channelId` entry.

## Owner Resolution Caveat

If the FE sends the `accountId` as `ownerId` (e.g. user has not selected a node), the service may silently swap the owner to the first runtime node/user wallet. **The response's `run.ownerId` field is the resolved value, not the requested value**. Render the resolved `ownerId` (not the requested one) in the UI so the QA sees what actually got charged.

## Error Surface

| HTTP Status | Likely Backend Code | Frontend Action |
|---|---|---|
| 200 | (success) | Render result; **inspect per-message statuses inside `result.messages[]` for partial failures** |
| 4xx | `InvalidChargeRequest`, `NoApplicableRate`, `ReservationNotFound`, `WalletNotFound`, `InsufficientBalance`, `WalletVersionConflict`, `CommChannelSubWalletNotFound` | Show specific error toast |
| 401 | `Unauthorized` | Redirect to login |
| 404 (no body) | (feature gate off) | Hide the Charging Lab UI entirely |
| 500 | `InternalServerError` | Generic error, retry once, escalate to ops |

## Differentiating 404 (gate off) vs 404 (URL typo)

Both look identical from the FE. The only safe heuristic: **if any one Charging-Lab URL returns 404 with no body, treat the entire feature as disabled**. Don't probe other Lab endpoints; they will all return 404.

## Production-Readiness Banner (Recommended)

When the FE renders the Charging Lab, show a banner:

> **Charging Lab — DEVELOPMENT/QA USE ONLY**
> 
> This panel mutates real wallet balances and creates real ledger entries. Do not run against production data.

The backend's 404-on-disabled gate is the only safeguard. The FE banner is the visual reminder.

## Multi-Language

No multi-language fields on response DTOs. Error messages are localized via the `Accept-Language` header on the request.

## OpenAPI / Swagger

The full controller surface is visible in `https://localhost:7224/swagger` only when `Settings:TestingCharging:Enabled = true`. When disabled, the routes still appear in Swagger (the framework registers them), but every call returns 404.
