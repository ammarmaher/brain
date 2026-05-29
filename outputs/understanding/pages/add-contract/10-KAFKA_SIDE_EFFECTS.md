*** Add Contract — Kafka side effects ***
*** Events emitted after creation · 2026-05-18 ***

# Add Contract — Kafka Side Effects

## On successful `POST commerce/Contracts`

Commerce emits:

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `commerce.contract-created.v1` | `ContractCreatedEvent { contractId, accountId, committedValue, currency, startDate, endDate }` | Charging | Creates contract-scoped wallet balance entries |
| `commerce.contract-funded.v1` | `ContractFundedEvent { contractId, accountId, amount }` | Charging | Initial funding event — sets `available = committedValue` |

[INFERRED] Verify exact topic names in Commerce Service source (`IPublishEndpoint` calls).

## Charging consumer side

```
commerce.contract-created.v1 → CreateContractWalletConsumer
   ↓
   - Creates a new wallet balance row of type=Contract in Mongo
   - Initial `available = 0` (pre-funding)

commerce.contract-funded.v1 → FundContractConsumer
   ↓
   - Updates the wallet balance: `available = committedValue`
   - Emits charging.balance-changed.v1
```

## Cross-service consequences

- The new contract's balance immediately appears in `GET charging/Wallet/contract-balance-summaries?accountId={accId}` once Charging processes the event (eventually consistent).
- Frontend list-mode auto-refreshes on next navigation.

## Status auto-transitions (cron, NOT Kafka)

Contract starts as `pending`. Backend cron:
- `pending → active` when today >= startDate
- `active → expired` when today > endDate

Emits `commerce.contract-status-changed.v1` on transitions.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
