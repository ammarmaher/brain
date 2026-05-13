*** PRD Understanding - Contract & Cost Management - OVERVIEW ***

# 03-contract-packaging-charging-billing-management - Overview

> Source PRD: `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md` (`Contract & Cost Management V2`, Drive sync 2026-04-24).
> Supporting: `Destination Identification` doc + `International Phone# Destination List` sheet.

## Purpose

Owns the commercial contract layer between Falcon and client accounts: the contract structure (Info / Rate Card / Contract Details matrix / Addons), the auto-derived status lifecycle (Pending / Active / Expired), and the business logic that charges client wallets against the **nearest-expiring** Active contract first. Contracts feed the Master Wallet when they transition to Active. Edits are Falcon-usertype-only with field-level restrictions per status (Pending = full edit; Active/Expired = limited). Also defines balance-impacting actions (Send Transaction, Activate/Purchase, Contract Expiration, Transfer) and how each one moves WalletRecords across wallets while preserving contract-ID linkage.

The folder is titled "Contract, Packaging, Charging, Billing Mngmnt Module" — but the V2 PRD covers **Contract + Cost only**. Packaging and Billing are present in the folder title but absent from the PRD body — explicitly flagged as a scope gap.

## Actors

| Actor | Capability | Source |
|---|---|---|
| Falcon System Admin / Product | Create / edit contracts (status-aware restrictions); full view. | latest-prd.md:23 |
| Falcon Operation | View contracts only. | understanding.md:21 |
| Client Account Owner (AO) | View only. Remaining Value visible only when status = Active; hidden when Expired; `NA` when Pending. | latest-prd.md:74-75 |
| Client Node Admin | View only per 02-user-management matrix. | understanding.md:23 |
| Client Normal User | Indirectly consumes via Send Transaction (charging). | understanding.md:24 |
| System (background) | Auto-Activate on Start Date, Auto-Expire on End Date, recompute wallet lump-sums on expiry, restore on extension. | understanding.md:39-40, 88 |

## Main Screens

| # | Screen | Source |
|---|---|---|
| 1 | Contracts & Cost Mng list (Falcon + AO/NA view-only) | understanding.md:27 |
| 2 | Add Contract wizard (4 steps: Info / Rate Card / Contract Details / Addons) | latest-prd.md:23-46 |
| 3 | Contract Detail (multi-tab) | understanding.md:29 |
| 4 | Edit Contract (Falcon only, status-constrained) | latest-prd.md:50-56 |
| 5 | (not in PRD) Packaging screens | TBD - scope gap |
| 6 | (not in PRD) Billing report screens | TBD - scope gap |

## Main Actions

| Action | Allowed By | Source |
|---|---|---|
| Create contract (4-step wizard) | Falcon | latest-prd.md:23 |
| Edit contract (status-aware field restrictions) | Falcon | latest-prd.md:50-56 |
| View contract list / detail | Falcon + AO + NA | understanding.md:31 |
| Background: auto-status transitions on date | System | understanding.md:39 |
| Background: contract expiration wallet sweep | System | latest-prd.md:60 (Wallet impact rules #3) |
| Background: extension restores Expired -> Active | System | latest-prd.md:55-56 |
| Send Transaction (Normal User triggers; charges wallet per matrix) | Normal User | latest-prd.md:62 |
| Activate / Purchase from Addons (Falcon or AO) | Falcon + AO | latest-prd.md:63 |
| Transfer Balance (across wallets, contract-ID-preserving) | Per role matrix (in 01-account-management) | latest-prd.md:65 |
| Activate/Renew CommChannel or Application | Falcon + AO | latest-prd.md:66 |

## Module Dependencies

- **01-account-management** — Master Wallet is funded by contract activations; deduction rules described here use the wallet structures defined there (latest-prd.md:90-91; cross-cuts BR-AM-26..38).
- **Account configuration: Single / Multiple wallet** — controls deduction priority cascade for activations / purchases (latest-prd.md:62-66).
- **CommChannel & Apps visibility** — feeds Rate Card and Contract Details matrix (latest-prd.md:91-92).
- **04-contact-group-management** — indirect; contact groups + templates are the data + schema of a `Send Transaction`.
- **05-templates** — Templates referenced for transaction delivery.
- **Destinations** — `Destination Identification` doc + `International Phone# Destination List` sheet define the Destination axis of Contract Details (latest-prd.md:93).
- **Farabi integration** — Each contract carries a `Farabi Reference ID` (<=50) for external billing sync (latest-prd.md:25, 96).
- **02-user-management / Permissions** — Who can create / edit / view (latest-prd.md:23, 73-76).
