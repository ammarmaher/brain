*** Wallets — Playbook ***
*** Single-doc synthesis · 2026-05-18 ***

# Wallets and Balance Management — Playbook

## TL;DR

Falcon-admin page in admin-console combining (1) wallet strategy editor (currency · balance-distribution · wallet-structure) and (2) balance transfer drawer (Master ↔ CommChannel ↔ Node ↔ User wallets). Backend split: Commerce owns strategy; Charging owns transfer execution + ledger; System Gateway has a custom aggregator at `api/commerce/accounts/{id}/hierarchy` that joins both sides.

**Critical concept:** Master Wallet is **abstract** — sum of children, no physical row. Transfer FROM Master deducts from a child, TO Master adds to a child.

## Sections

1. **Permissions** — 5 PES keys. Feature `shellAccessGuard` is a no-op today (GAP).
2. **Hierarchy tree** — re-uses `<falcon-organization-hierarchy-tree>`.
3. **Strategy editor** — 3 dropdowns + Save. `ISaveBalancesRequest{ ownerId, currency, walletBalanceType, walletType }`.
4. **Balance table** — Master + per-channel/node/user rows. Transfer button per row. Cell inputs disabled (dead scaffolding).
5. **Transfer drawer** — source/dest/amount/description. Path matrix gates allowed combinations. balanceTransferLimitPct cap. Same-source/dest guard. Currency match.
6. **Topology** — BalanceType (Master/CommChannel/Node/User) × WalletStructure (MasterOnly/MasterPlusSub) × BalanceDistribution (Aggregated/Separate).
7. **Validations** — 4 transfer business rules + 2 strategy. No Reactive Forms today (GAP).
8. **Backend API** — 3 feature endpoints + 2 tree. `api/` prefix unique on aggregator URL.
9. **Components** — replace PrimeNG sidebar/dropdown/inputtext with Falcon UI Core. 1177+439 LOC SCSS → Tailwind.
10. **Kafka** — Strategy save emits 5+ events (wallet-configured, identity-sync, user-wallet-create, subnode-wallet-create, comm-channel-shown). Transfer emits balance-changed.
11. **State** — Strategy: None → Configured → Reconfigured. Transfer mutates balances per ledger.
12. **Errors** — Insufficient · Path · Currency · Cap · SameDestSrc · Concurrent.
13. **Gaps** — 9 anti-patterns: dead edits, API prefix, locale parse, money precision, NgForm, SCSS heavy, points inconsistency, currency enum, wallet ID opacity.
14. **Implementation** — 8-question gate. FE+BE+E2E tasks.

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/01-account-management/BUSINESS_RULES.md` (BR-AM-27..38)
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/`, `Brain Outputs/understanding/backend/charging/`
- [CODE] `apps/admin-console/src/app/features/wallet-balance-management/`

## Hubs

[[Wallets and Balance Management]] · [[01 Account Management]] · [[Commerce Service]] · [[Charging Service]] · [[Contracts List]] · [[AMMAR_BRAIN_HOME]]
