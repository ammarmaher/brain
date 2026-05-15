*** PRD-01 — Account Management ***
*** SoT: Brain Outputs/prd/modules/01-account-management/ ***
*** Drive source: `Account Management Module VB4` (sync 2026-04-24) ***

# PRD-01 — Account Management

> Owns the Account (Client) concept: hierarchy (Root → Main → Sub-nodes), 5-step Add-Client wizard, settings (password security · allowed IPs · account limits · commchannel/app visibility/pricing), wallet & balance management (Master / Comm / User / Node wallets across a 2×2 Balance-Type × Wallet-Type matrix).

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/01-account-management/OVERVIEW.md) | Purpose · actors · main screens · main actions · module deps |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) | All business rules with cited PRD-line evidence |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md) | Account, Node, AccountSettings, CommChannelConfig, AppConfig, Wallet, WalletRecord, WalletTypeConfig, TransferTx |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) | Create Account (5-step) · Wallet & Balance Config · Balance Transfer · CommChannel/App Activation · Renewal w/ grace period · Contract→Master funding |
| [GAPS](../../../Brain%20Outputs/prd/modules/01-account-management/GAPS.md) | 18 COVERED · 3 PARTIAL · 3 MISSING · 9 UNVERIFIABLE |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/01-account-management/QUESTIONS.md) | Open questions; e.g. wallet topology edit mid-life (BR-AM-41), move-node (Q-AM-18) |

## Pages that implement this PRD

- [[Organization Hierarchy]] — primary page (Hierarchy · CommChannels & Services · Apps & Services · Settings · Account Limitations · IP Management)
  - Sections: `tabs-header`, `comm-channels-tab`, `apps-services-tab`, `org-info-panel`, `settings-tab-view-mode`, `settings-tab-edit-mode`, `settings-ip-management`, `settings-account-limitation`, `otp-popup`
- Wallets & Balance Management page — not yet seeded under `10-Pages/`

## Falcon components used by this PRD

- [[Falcon Data Table]] — CommChannels list, Apps list, Permission/Privilege rows, IP list, Account-Limitation rows
- [[Falcon Tabs]] — top-level tab container
- [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Toggle]] · [[Falcon Button]] · [[Falcon Status Badge]] — form + cell components
- [[Falcon Uploader]] — org-info photo upload
- [[Falcon Dialog]] — OTP popup + confirmations

## Backend services implementing this PRD

| Concern | Service | Folder |
|---|---|---|
| Account & Node & AccountSettings | commerce | [`understanding/backend/commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) |
| Wallet & Balance & TransferTx | charging | [`understanding/backend/charging/`](../../../Brain%20Outputs/understanding/backend/charging/) |
| User-side onboarding from Step 5 | identity | [`understanding/backend/identity/`](../../../Brain%20Outputs/understanding/backend/identity/) |
| Gateway routes | core-gateway · system-gateway | [`understanding/backend/core-gateway/`](../../../Brain%20Outputs/understanding/backend/core-gateway/) · [`understanding/backend/system-gateway/`](../../../Brain%20Outputs/understanding/backend/system-gateway/) |

**Vault service notes:** [[Commerce Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Identity Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[BACKEND_INDEX]]

## Validation surface (lives in BUSINESS_RULES + WORKFLOWS)

Field-level validations and cross-field rules are spread across [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) (status-aware edits) and [WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) (wizard step gates). After PRD promotion: per-page [VALIDATION_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VALIDATION_RULES.md).

Hub: [[VALIDATION_INDEX]].

## Module dependencies

- **[[02 User Management]]** — Account Owner user is created at Step 5 of the wizard; permission matrix + user statuses gate logins
- **[[03 Contract Packaging Charging Billing]]** — Contracts fund the Master Wallet on transition to Active

## Health

- **Status:** Mostly built
- **Top concerns:** Wallet topology edit mid-life (BR-AM-41 OPEN); move-node (Q-AM-18 MISSING); account archive (GAP-AM-29 MISSING)
- **Coverage:** 18 ✅ · 3 ⚠️ · 3 ❌ · 9 ❓

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[EVIDENCE_INDEX]] · [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]]
