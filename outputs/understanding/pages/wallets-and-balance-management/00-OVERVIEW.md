*** Wallets and Balance Management — Overview ***
*** SoT for wallet strategy + transfer · 2026-05-18 ***

# Wallets & Balance Management — Overview

> Falcon-admin page combining wallet strategy editor + balance transfer drawer. Critical for finance ops + business team discussions. Two sub-flows under one page.

## Source-of-truth

- [PRD] PRD-01 BUSINESS_RULES (BR-AM-27..38 wallet topology + transfer) · `Brain Outputs/prd/modules/01-account-management/BUSINESS_RULES.md`
- [PRD] PRD-01 ENTITIES (Wallet · Balance · Currency) · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md`
- [BRAIN-OUT] Commerce ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- [BRAIN-OUT] Charging ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/charging/ENDPOINT_REGISTRY.md`
- [CODE] `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts` (885 LOC container)
- [CODE] `apps/admin-console/.../balance-transfer/balance-transfer.component.ts` (700 LOC drawer)

## Trigger / entry

- **Page:** Admin Console → sidebar "Wallets" → `/wallet-balance-management`
- **Route guards:** `adminConsoleGuard` (parent) + `shellAccessGuard` (feature — but `access:` value not supplied, so it's a no-op today — flag GAP)
- **Default state:** empty — user picks an account from left tree.

## Page layout

```
┌──────────────────────────────────────────────────────┐
│ Account: <name>                          [Save]      │
├──────────────┬───────────────────────────────────────┤
│              │  Currency * [SAR ▼]                  │
│  Tree        │  Balance Distribution * [Separate ▼] │
│  (orgs)      │  Wallet Structure * [Master+Sub ▼]   │
│              ├───────────────────────────────────────┤
│              │  Master Wallet Balance: 10,000.000 SAR│
│              │                                       │
│              │  | Channel │ Balance │ Transfer       │
│              │  |─────────┼─────────┼─────────       │
│              │  | WhatsApp│ 5000.0  │ [Transfer →]   │
│              │  | Voice   │ 3000.0  │ [Transfer →]   │
│              │  | SMS     │  500.0  │ [Transfer →]   │
└──────────────┴───────────────────────────────────────┘

(Transfer drawer slides in from right on click)
```

## Two sub-flows

### Sub-flow A — Strategy editor

1. Pick account from tree.
2. View current strategy: Currency · BalanceDistribution · WalletStructure.
3. Edit dropdowns.
4. Click Save → `POST commerce/setting/wallets`.
5. Backend: persists strategy + emits `commerce.wallet-configured.v1` → Charging materializes wallets.

### Sub-flow B — Balance transfer

1. From the balance table, click "Transfer" on a row.
2. Drawer slides in.
3. User picks: Source wallet · Destination wallet · Amount · Description.
4. Path validator runs (Master ↔ Channel ↔ Node/User per topology).
5. Click Submit → `POST charging/wallet/transfer`.
6. Charging executes ledger transfer · emits `charging.balance-changed.v1`.

## Wallet topology

[PRD] BR-AM-27..30:

| BalanceType | Wallet | Visibility | Notes |
|---|---|---|---|
| Master | (abstract aggregate) | Falcon admin view only | NO physical row — sum of children |
| CommChannel | One per channel (WhatsApp, Voice, SMS, AI) | Falcon + AO | Holds channel-scoped balance |
| Node | One per sub-node | Falcon + node admins | Hierarchical |
| User | One per user (system+normal) | Falcon + assigning admin | Per-user-scoped |

Detailed in [06-SECTION_WALLET_TOPOLOGY](06-SECTION_WALLET_TOPOLOGY.md).

## Hierarchy aggregation endpoint

**Critical:** the page uses a System-Gateway-side aggregator:

```
GET api/commerce/accounts/{id}/hierarchy?currency={1|2}&balanceDistribution={1|2}&walletStructure={1|2}
```

[CODE] `wallet-balance.service.ts:30-43` + comment lines 55-61:

> This page needs the System Gateway aggregation endpoint: Commerce supplies account hierarchy and configured strategy. Charging supplies the canonical OCS master/channel/owner balances. Calling `/commerce/accounts/hierarchy?accountId=...` goes through the generic Commerce proxy and cannot populate the master wallet balance.

So the System Gateway has a custom aggregator that joins Commerce + Charging server-side. Note the `api/` prefix — unique to this endpoint among Commerce calls.

## Sequence diagrams

### Strategy save

```
Falcon admin
   │ (picks account)
   ▼
GET api/commerce/accounts/{id}/hierarchy
   │ → IWalletDataResponse (strategy + balances + channels)
   ▼
[Edit Currency dropdown to Points]
   │ (click Save)
   ▼
POST commerce/setting/wallets
   ├──► commerce.wallet-configured.v1 ──► Charging: materialize new wallet structure
   └──► commerce.identity-settings-sync.v1 ──► Identity
   │
   ▼
Refresh hierarchy view
```

### Balance transfer

```
Falcon admin (or AO with permission)
   │ (clicks Transfer on row)
   ▼
Drawer opens · select source/dest/amount/description
   │ (path validator runs)
   ▼
POST charging/wallet/transfer
   ├──► Charging executes ledger transfer
   ├──► charging.balance-changed.v1 ──► (consumers)
   │
   ▼
Refresh hierarchy view
```

## Cross-flow dependencies

- **Prerequisite for [[Add Contract Flow]]:** wallet strategy must be configured before adding contracts.
- **Consumed by [[Contracts List]]:** the balance projection reflects contract creations + order debits.
- **Triggers [[Identity Service]] sync:** strategy changes emit identity sync event.

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [06-SECTION_WALLET_TOPOLOGY](06-SECTION_WALLET_TOPOLOGY.md) · [08-BACKEND_API](08-BACKEND_API.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)

## Hubs

[[01 Account Management]] · [[Commerce Service]] · [[Charging Service]] · [[Organization Hierarchy]] · [[Contracts List]]
