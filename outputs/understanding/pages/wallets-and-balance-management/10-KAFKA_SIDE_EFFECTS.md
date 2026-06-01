*** Wallets — Kafka side effects ***
*** Strategy + transfer events · 2026-05-18 ***

# Wallets — Kafka Side Effects

## On `POST commerce/setting/wallets` success (strategy save)

Commerce emits:

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `commerce.wallet-configured.v1` | `WalletConfiguredEvent { accountId, currency, walletStructure, balanceDistribution }` | Charging | Creates/recreates wallet structure per new topology |
| `commerce.identity-settings-sync.v1` | `IdentitySettingsSyncEvent { accountId, fields[] }` | Identity | Syncs account-level settings |
| `commerce.user-wallet-create.v1` | `UserWalletCreateEvent { accountId, userId }` × N | Charging | One per user when distribution=Separate |
| `commerce.subnode-wallet-create.v1` | `SubNodeWalletCreateEvent { accountId, nodeId }` × N | Charging | One per sub-node |
| `commerce.comm-channel-shown.v1` | `CommChannelShownEvent { accountId, channelId }` × N | Charging | One per visible channel |

[CODE] Verify in Commerce Service source for `IPublishEndpoint` calls. [MEMORY] from index entries: these topics are well-documented.

## On `POST charging/wallet/transfer` success

Charging emits:

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `charging.balance-changed.v1` | `BalanceChangedEvent { walletId, oldBalance, newBalance, txId, reason: 'transfer' }` | Commerce (audit log) · UI projection refresh | Live balance update |

> [INFERRED] If a contract is tied to the source wallet, may also emit `charging.contract-balance-changed.v1`.

## Re-projection lag

After save / transfer, the FE re-fetches `GET api/commerce/accounts/{id}/hierarchy` to show new balances. The aggregator joins fresh Charging data so the latency is minimal (typically <500ms).

## Idempotency

- Strategy save is idempotent per resource.
- Transfer is NOT idempotent — each POST creates a new transaction. UI should debounce or disable Submit during in-flight.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
