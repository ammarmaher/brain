*** PRD Understanding - Account Management - OVERVIEW ***

# 01-account-management - Overview

> Source PRD: `Brain SK\skills\imported-business\prd-knowledge\modules\01-account-management\latest-prd.md` (`Account Management Module VB4`, Drive sync 2026-04-24).
> Supporting PRD: `Acc - Wallet & Balance Mng VB4`.

## Purpose

Owns the Account (Client) concept in Falcon, including hierarchy below it (Root -> Main -> Sub-nodes), creation via a 5-step wizard, configuration (password security, allowed IPs, account limits, commchannel/application visibility/pricing), and wallet & balance management. Translates contract value into spendable credits via Master / Comm / User / Node wallets across a 2x2 Balance-Type x Wallet-Type matrix. Falcon usertype configures wallet topology; Account Owner and Node Admin transfer balances inside the resulting permission matrix. Status transitions on commchannels and applications (InActive -> Paid -> Active -> Expired -> InActive (Grace Period Ends) / Disabled) gate consumption.

## Actors

| Actor | User Type | Role | Scope |
|---|---|---|---|
| System Administrator | Falcon | sys-admin | Full hierarchy access; creates clients; configures everything (latest-prd.md:31, understanding.md:9-12) |
| Product | Falcon | product | Can add clients, edit pricing, do wallet transfers, edit contracts, edit account limitations |
| Operation | Falcon | operation | Can add nodes/users; cannot add clients, cannot edit pricing/payment, view-only on contracts/wallet-config |
| Account Owner | Client | account-owner | Main-node only; full hierarchy/user mgmt inside Main + sub-nodes; wallet transfers; commchannel `Disable` / `Do Payment` but not `Edit Price` |
| Node Admin | Client | node-admin | Sub-nodes only; manages sub-nodes; wallet transfers; no settings/commchannel/app actions |
| Normal User | Client | normal-user | Transactional only; views own profile, holds wallet balance (User-based config) |

## Main Screens

| # | Screen | Source |
|---|---|---|
| 1 | Organization Hierarchy menu (Hierarchy tab, CommChannels & Services tab, Apps & Services tab, Settings tab) | understanding.md:18 |
| 2 | Add Client wizard (5 steps) | latest-prd.md:31-54 |
| 3 | Account Information page (basic + official info) | latest-prd.md:33-40 |
| 4 | Settings tab (Password Security, Allowed IPs, Account Limitations) | latest-prd.md:42-45 |
| 5 | CommChannels & Services tab (Visibility, Pricing, Status, Actions) | latest-prd.md:47-49 |
| 6 | Apps & Services tab (same shape as commchannel list) | latest-prd.md:50-51 |
| 7 | Wallets & Balance Mng menu (Wallet config + Transfer UI) | understanding.md:24 |

## Main Actions

| Action | Allowed By | Source |
|---|---|---|
| Create Account (5-step wizard) | Falcon: System Admin, Product | latest-prd.md:31 |
| Edit Account (info / official data / settings) | Falcon (per matrix) | understanding.md:32 |
| Add / Edit / View Node, Sub-Node | Falcon + Client AO/NA per scope | understanding.md:33 |
| Configure CommChannel visibility / price / enable / disable | Falcon (visibility, pricing); AO can disable / do-payment | understanding.md:34-36 |
| Configure Wallet Type & Balance Type | Falcon usertype ONLY | latest-prd.md:67-79 |
| Transfer Balance (Master <-> Comm, Comm <-> User/Node, User <-> User) | Per source-x-destination matrix | latest-prd.md:86-91 |
| Manage commchannel / application status (Paid / Active / Expired / Disabled) | Falcon + AO | latest-prd.md:56-63 |
| Visibility toggle (Hide / Show) | Falcon | latest-prd.md:48 |

## Module Dependencies

- **02-user-management** — Account Owner user is created at Step 5 of the wizard; permission matrix lives there; user statuses gate logins (understanding.md:96).
- **03-contract-packaging-charging-billing-management** — Contract value flows into Master Wallet when contracts go Active; nearest-expiring deduction rule (latest-prd.md:93-98).
- **04-contact-group-management** — Contact groups belong to nodes inside the account hierarchy (no direct PRD link; transitive via Templates).
- **05-templates** — Template configuration is per commchannel per account; possible inheritance on Main node (root-documents/latest-prd.md:29).
- **Finance Integration** — Finance ID links account to Finance team records (understanding.md:100).
- **Farabi Integration** — Indirectly via contracts (understanding.md:101).
- **Notification module** — Credential delivery, system alerts (understanding.md:101).
- **Permissions module / Access (PES)** — Per-action gating across Organization Hierarchy / CommChannels / Apps / Settings (understanding.md:97).
