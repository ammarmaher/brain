---
type: page-flow
page: add-contract
module: 03 Contract Packaging Charging Billing Management
service: Commerce Service
status: SoT-ready
created: 2026-05-18
folder: Brain Outputs/understanding/pages/add-contract/
---

# Add Contract Flow

> 4-step wizard. Composite POST. Falcon-user-only. Triggered from Contracts List "+ Add Contract" button.

## Source of truth

Folder: [pages/add-contract/](../../../Brain%20Outputs/understanding/pages/add-contract/)

Key files: [README](../../../Brain%20Outputs/understanding/pages/add-contract/README.md) · [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/add-contract/00-OVERVIEW.md) · [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/add-contract/07-VALIDATIONS.md) · [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/add-contract/08-BACKEND_API.md) · [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/add-contract/14-IMPLEMENTATION_CHECKLIST.md)

## Quick reference

- **PRD anchor:** [BR-CC-01..20](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Endpoint:** `POST commerce/Contracts` (composite)
- **Wire format:** PascalCase, `YYYY-MM-DDT00:00:00` dates
- **Pre-condition:** wallet strategy configured

## Sister flows

[[Contracts List]] · [[Edit Contract Flow]] · [[Wallets and Balance Management]]

## Hubs

[[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
