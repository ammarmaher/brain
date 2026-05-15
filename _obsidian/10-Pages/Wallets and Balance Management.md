---
type: page
slug: wallets-and-balance-management
prd-implements: [PRD-01]
has-flow-folder: false
status: stub
created: 2026-05-15
---
*** Page note — Wallets & Balance Management ***
*** Vault file: 10-Pages/Wallets and Balance Management.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\wallets-and-balance-management\ ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***

# Wallets and Balance Management

> **STUB — seeded from PRD-01 OVERVIEW.** Sibling Account-Management screen — distinct from Organization Hierarchy tabs. Wallet config = Falcon usertype only; transfers per role matrix. Brain Outputs is the source of truth — every link below points into the SoT tree.

## Entry point in Brain Outputs
- [PAGE_LEARNING.md](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/PAGE_LEARNING.md)

## Implements PRDs
- [[01 Account Management]] — **primary** (`latest-prd.md:67-79` Wallet/Balance Type config; `:86-91` transfer matrix; supporting PRD `Acc - Wallet & Balance Mng VB4`)
- [[03 Contract Packaging Charging Billing]] — nearest-expiring deduction + contract-ID linkage

## Likely Falcon components
- [[Falcon Tabs]] · [[Falcon Data Table]] · [[Falcon Dropdown]] · [[Falcon Input Number]] · [[Falcon Toggle]] · [[Falcon Status Badge]] · [[Falcon Confirm Dialog]] · [[Falcon Insufficient Balance Dialog]] · [[Falcon Alert Dialog]] · [[Falcon Button]] · [[Falcon Paginator]]

## Backend services
- [[Charging Service]] — **primary**; wallet ledger + transfers + nearest-expiring deduction
- [[Commerce Service]] — contract-ID linkage in WalletRecords

## Related V-rules
- _None promoted yet_ — likely candidates: `V-account-limits-zero-means-no-limit` (cross-cuts org-hierarchy Settings); transfer-matrix permission V-rules.

## Tags

#type/page #status/stub #prd/01 #prd/03 #service/charging #service/commerce

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Contracts List]] · [[Organization Hierarchy]]
