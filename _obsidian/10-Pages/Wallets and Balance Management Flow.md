---
type: page-flow
page: wallets-and-balance-management
module: 01 Account Management
service: Commerce + Charging
status: SoT-ready
created: 2026-05-18
folder: Brain Outputs/understanding/pages/wallets-and-balance-management/
---

# Wallets and Balance Management Flow

> Falcon-admin wallet strategy editor + balance transfer drawer.

## Source of truth

Folder: [pages/wallets-and-balance-management/](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/)

Key files: [README](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/README.md) · [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/00-OVERVIEW.md) · [05-SECTION_TRANSFER_DRAWER](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/05-SECTION_TRANSFER_DRAWER.md) · [06-SECTION_WALLET_TOPOLOGY](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/06-SECTION_WALLET_TOPOLOGY.md) · [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-AM-27..38](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- **Aggregator endpoint:** `GET api/commerce/accounts/{id}/hierarchy` (System Gateway joins Commerce + Charging)
- **Strategy save:** `POST commerce/setting/wallets`
- **Transfer:** `POST charging/wallet/transfer`
- **Master Wallet:** abstract aggregate (sum of children, no physical row)

## Sister flows

[[Contracts List]] · [[Add Contract Flow]] · [[Organization Hierarchy]]

## Hubs

[[01 Account Management]] · [[Commerce Service]] · [[Charging Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
