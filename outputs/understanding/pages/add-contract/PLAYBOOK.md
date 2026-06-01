*** Add Contract — Playbook ***
*** Single-doc synthesis · 2026-05-18 ***

# Add Contract — Playbook

## TL;DR

The Add Contract wizard authors a commercial Contract against an Account node. 4 sequential steps (Info / Rate Card / Contract Details / Add-ons) submitted as ONE composite POST to Commerce. Falcon-user-only. ~28 validation predicates across all steps. Two pre-loaded lookups (applications + channels). Wallet strategy precondition gated at parent list view. New contract starts `pending`, auto-transitions to `active` on startDate via cron, `expired` on endDate.

## Sections

### 1. Permissions
- Parent `adminConsoleGuard` only. No feature PES (GAP-CC-ADD-PES).
- Falcon Operation role permission TBD.

### 2. Step 1 — Contract Info
- Fields: contractName · farabiReferenceId · startDate · endDate · committedValue.
- 5 predicates.

### 3. Step 2 — Rate Card
- One row per visible channel, auto-populated.
- Channel-locked priceUnit (WhatsApp/Voice/AI_ChatGPT).
- 6 predicates per row.

### 4. Step 3 — Contract Details (matrix)
- 2D grid: (priority × destination_country) → ratePerUnit.
- 44 cells for WhatsApp, 33 for Voice.
- Every cell required.

### 5. Step 4 — Add-ons
- Quotas (USAGE/SUB_SERVICE × FREE_CREDIT/CREDIT_POOL).
- Overage Rates (subService + unit + price + billingCycle).

### 6. Validations
- 28+ sync predicates, NO async (FarabiId uniqueness caught at BE — flagged as gap).
- Output-side filters strip empty/null rows.

### 7. Backend API
- Composite `POST commerce/Contracts` with `CreateContractRequest`.
- 3 lookup GETs: applications, channels, walletStrategy.
- Commerce uses PascalCase wire.
- Date format: `YYYY-MM-DDT00:00:00` (local Asia/Riyadh).

### 8. Components
- `<falcon-stepper>` (new) replaces `<dynamic-stepper>` (legacy).
- 3 reusable sub-section components (RateCard, ContractDetails, Addons) re-used in Edit too.
- `<app-contracts-number-input>` is local — tuned for thousands-sep + decimals=6.

### 9. Kafka
- On success: `commerce.contract-created.v1` + `commerce.contract-funded.v1`.
- Charging consumes → creates wallet balance row.

### 10. State
- New contract: `pending` → (cron) `active` → (cron) `expired`.

### 11. Errors
- HTTP-status routing + per-FalconKey inline mapping.
- Submit-time recovery: keep form open, surface error.

### 12. Gaps & drifts
- HIGH: GAP-CC-ADD-PES · NOUNIQUE · NORX · DISCARD-GUARD · FARABI
- MED: AUTOCOLLAPSE · 44CELLS · NOSAVEDRAFT
- LOW: NGMODEL-FREEZE · FOOTER-PLACEMENT

### 13. Implementation checklist
- 8-question gate.
- FE / BE / E2E task lists.

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md`
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/`
- [CODE] `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/`

## Hubs

[[Add Contract Flow]] · [[Contracts List]] · [[Edit Contract Flow]] · [[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[AMMAR_BRAIN_HOME]]
