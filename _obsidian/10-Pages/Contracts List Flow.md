---
type: page-flow
page: contracts-list
module: 03 Contract Packaging Charging Billing Management
service: Commerce Service + Charging Service
status: SoT-ready
created: 2026-05-18
folder: Brain Outputs/understanding/pages/contracts-list/
---

# Contracts List Flow

> Falcon-user list of contracts per Account. Read-only. Hosts mode state-machine for Add/View/Edit transitions.

## Source of truth

Full implementation folder: [pages/contracts-list/](../../../Brain%20Outputs/understanding/pages/contracts-list/)

Key files: [README](../../../Brain%20Outputs/understanding/pages/contracts-list/README.md) · [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/contracts-list/00-OVERVIEW.md) · [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/contracts-list/08-BACKEND_API.md) · [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/contracts-list/13-GAPS_AND_DRIFTS.md) · [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/contracts-list/14-IMPLEMENTATION_CHECKLIST.md)

## Quick reference

- **PRD anchor:** [PRD-03 BUSINESS_RULES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Backend:** Commerce (`/api/Contracts`) + Charging (`/api/Wallet/contract-balance-summaries`)
- **Container mode FSM:** list ↔ add ↔ view ↔ edit
- **Pre-condition for Add:** wallet strategy configured (`commerce/Setting/wallets/{accId}` returns non-null)

## Sister flows

- [[Add Contract Flow]] · [[Edit Contract Flow]] · [[Wallets and Balance Management Flow]]

## Hubs

[[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[Organization Hierarchy]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
