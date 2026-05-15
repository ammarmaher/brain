*** Page Learning — Wallets & Balance Management ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/wallets-and-balance-management/PAGE_LEARNING.md ***

# Wallets & Balance Management

> **STUB** — page discovered from PRD-01 OVERVIEW (`01-account-management/OVERVIEW.md:33`). Wallet configuration (Falcon-only) + Transfer UI (per role matrix). Sits next to Organization Hierarchy as a sibling Account-Mgmt screen — distinct from the Hierarchy / CommChannels / Apps / Settings tabs. Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-01 Account Management (supporting PRD: `Acc - Wallet & Balance Mng VB4`)
- PRD section reference: `Brain Outputs/prd/modules/01-account-management/OVERVIEW.md:33` (Main Screen #7) + `latest-prd.md:67-79` (Wallet Type / Balance Type config) + `:86-91` (transfer matrix)

## Primary backend service
- Charging Service (`Brain Outputs/understanding/backend/charging/`) — wallet ledger + balance transfers + nearest-expiring deduction; cross-cuts Commerce Service for contract-ID linkage

## Expected Falcon components
- [[Falcon Tabs]] — Configuration / Transfer / History (likely)
- [[Falcon Data Table]] — wallet matrix view (Master / Comm / User / Node × Balance-Type)
- [[Falcon Dropdown]] — wallet type · balance type · source wallet · destination wallet
- [[Falcon Input Number]] — transfer amount
- [[Falcon Toggle]] — Single vs Multiple wallet account-level setting
- [[Falcon Status Badge]] — wallet status / config locked state
- [[Falcon Confirm Dialog]] — confirm transfer
- [[Falcon Insufficient Balance Dialog]] — block transfer when source < amount
- [[Falcon Alert Dialog]] — wallet config validation errors
- [[Falcon Button]] — save config / submit transfer
- [[Falcon Paginator]] — transaction history pagination

## Key flows on this page
- Wallet configuration (Falcon usertype ONLY): set Wallet Type + Balance Type per account
- Transfer Balance: Master ↔ Comm, Comm ↔ User/Node, User ↔ User per matrix (latest-prd.md:86-91)
- Single vs Multiple wallet topology controls deduction priority cascade (cross-cuts PRD-03 contract logic)
- Nearest-expiring contract deduction rule on Send Transaction (PRD-03 wallet impact rule)
- Transfers preserve contract-ID linkage in WalletRecords
- AO + Node Admin: transfer per matrix; Normal User: holds balance (User-based config) only

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Wallets and Balance Management]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Organization Hierarchy]] (sister page) · [[Contracts List]] (funding source)
