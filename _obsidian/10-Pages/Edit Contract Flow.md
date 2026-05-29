---
type: page-flow
page: edit-contract
module: 03 Contract Packaging Charging Billing Management
service: Commerce Service
status: SoT-ready
created: 2026-05-18
folder: Brain Outputs/understanding/pages/edit-contract/
---

# Edit Contract Flow

> 4-tab editor for existing Contracts. Status-aware field freeze. Extension via endDate change.

## Source of truth

Folder: [pages/edit-contract/](../../../Brain%20Outputs/understanding/pages/edit-contract/)

Key files: [README](../../../Brain%20Outputs/understanding/pages/edit-contract/README.md) · [06-SECTION_FIELD_FREEZE](../../../Brain%20Outputs/understanding/pages/edit-contract/06-SECTION_FIELD_FREEZE.md) · [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/edit-contract/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** BR-CC-50..56 (status-aware restrictions)
- **Endpoint:** `PUT commerce/Contracts/{id}`
- **Frozen states:** active (most fields) · expired (all except endDate)
- **Extension trick:** new endDate > today on expired → status flips to active

## Sister flows

[[Add Contract Flow]] · [[Contracts List]]

## Hubs

[[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
