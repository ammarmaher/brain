*** Wallets and Balance Management — folder index ***
*** SoT for wallet strategy + transfer · 2026-05-18 ***

# Wallets & Balance Management — implementation knowledge folder

> Canonical SoT for the Falcon-admin wallet strategy page in admin-console. Combines (1) **strategy editor** (currency · balance distribution · wallet structure) and (2) **balance transfer drawer** (Master ↔ CommChannel ↔ Node/User wallets). Backend split: Commerce owns the strategy + hierarchy aggregation; Charging owns the actual transfer execution + balance authority.

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | End-to-end picture · backend split · two sub-flows |
| [01-PERMISSIONS](01-PERMISSIONS.md) | 5 PES checks (entry + 4 feature) |
| [02-SECTION_HIERARCHY_TREE](02-SECTION_HIERARCHY_TREE.md) | Left tree (orgs) |
| [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) | Currency · BalanceDistribution · WalletStructure controls |
| [04-SECTION_BALANCE_TABLE](04-SECTION_BALANCE_TABLE.md) | Per-channel balances table · disabled inputs · transfer affordance |
| [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) | Side-drawer for executing a transfer · path FSM |
| [06-SECTION_WALLET_TOPOLOGY](06-SECTION_WALLET_TOPOLOGY.md) | BalanceType × WalletType topology table · Master abstract aggregate |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Transfer-path business rules · amount cap · same-source/dest |
| [08-BACKEND_API](08-BACKEND_API.md) | 3 feature endpoints + 2 tree |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components (drawer, table, dropdowns) |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | `commerce.wallet-configured` + `charging.balance-changed` |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Strategy lifecycle (none → configured → reconfigured) |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Insufficient balance · currency mismatch · path invalid |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | 9 anti-patterns · dead cell-edit scaffolding · API casing inconsistency |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. Two sub-flows clear? → strategy + transfer
2. Backend split clear? → Commerce strategy, Charging transfer authority
3. Aggregation endpoint? → `GET api/commerce/accounts/{id}/hierarchy` (System Gateway aggregator)
4. Master Wallet is abstract? → YES — aggregate of channel + node + user wallets; NO physical row
5. Transfer matrix understood? → who-can-transfer-what-to-what per role per topology
6. `balanceTransferLimitPct` cap? → applied per transfer; PRD BR-AM-XX
7. Currency mismatch guard? → F-014 — Commerce rejects cross-currency
8. 5 PES keys? → adminConsole.enter, adminConsole.walletStrategy.edit, adminConsole.wallet.transfer, adminConsole.wallet.viewMaster, adminConsole.wallet.viewStrategy

## Hubs

[[Wallets and Balance Management]] · [[Contracts List]] · [[Add Contract Flow]] · [[01 Account Management]] · [[Commerce Service]] · [[Charging Service]] · [[Organization Hierarchy]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
