*** Wallets — Section: Topology ***
*** BalanceType × WalletType reference · 2026-05-18 ***

# Wallets — Topology

> The conceptual model. **Master Wallet is abstract** — it's the sum of its children, NOT a physical Mongo row.

## BalanceType enum

```typescript
enum BalanceType {
  Master = 'Master',           // abstract aggregate
  CommChannel = 'CommChannel', // per-channel
  Node = 'Node',               // per-sub-node
  User = 'User',               // per-user
}
```

## WalletType enum (a.k.a. WalletStructure)

```typescript
enum WalletStructure {
  MasterOnly = 1,       // single master pool; channels share
  MasterPlusSub = 2,    // master + sub-wallets per topology
}
```

## BalanceDistribution enum

```typescript
enum BalanceDistribution {
  Aggregated = 1,    // children draw from one pool
  Separate = 2,      // each child has its own balance
}
```

## Topology matrix

[PRD] BR-AM-27..30:

| WalletStructure | BalanceDistribution | Wallets materialized |
|---|---|---|
| MasterOnly | Aggregated | Master only (channels reference Master) |
| MasterOnly | Separate | (invalid combination — flag GAP) |
| MasterPlusSub | Aggregated | Master + per-channel; channels draw from Master pool |
| MasterPlusSub | Separate | Master + per-channel + per-node + per-user (all have own balances) |

[INFERRED] `MasterOnly + Separate` is logically invalid — verify backend rejects. Flag GAP-WBM-INVALID-COMBO.

## Master Wallet is abstract

[PRD] BR-AM-27 emphasis:

> Master Wallet is an aggregate. It has no physical row in the Wallet collection. Its balance is the sum of child wallet balances.

Critical implication: you can transfer FROM Master (which deducts from a child) or TO Master (which adds to a child), but Master itself is computed, not stored. The "Master" you see in the UI is a virtual aggregate.

## Nearest-expiring rule

[PRD] BR-AM-XX (nearest-expiring): when debiting Master, the system picks the contract balance with the nearest expiry first. This implements FIFO behavior at the contract level.

## Wallet creation events (Kafka)

[See [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)]:

- `commerce.wallet-configured.v1` → Charging creates wallets per topology.
- `commerce.user-wallet-create.v1` → per-user wallet creation when user is added.
- `commerce.subnode-wallet-create.v1` → per-sub-node wallet creation when sub-node is added.
- `commerce.comm-channel-shown.v1` → channel wallet creation when channel is shown.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
