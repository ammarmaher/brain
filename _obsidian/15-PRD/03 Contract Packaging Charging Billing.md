*** PRD-03 — Contract / Packaging / Charging / Billing ***
*** SoT: Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ ***
*** Drive source: `Contract & Cost Management V2` (sync 2026-04-24) ***

# PRD-03 — Contract / Packaging / Charging / Billing

> Owns the commercial contract layer: structure (Info · Rate Card · Contract Details matrix · Addons), auto-derived status lifecycle (Pending / Active / Expired), and the charging logic that consumes client wallets against the **nearest-expiring** Active contract first. Contracts fund the Master Wallet on transition to Active. Field-level edit restrictions per status (Pending = full edit; Active/Expired = limited).
>
> **Scope warning:** Folder title says "Contract, Packaging, Charging, Billing" — V2 PRD covers Contract + Cost only. Packaging + Billing are absent from the PRD body (flagged as scope gap).

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/OVERVIEW.md) | Purpose · actors · screens · scope gap |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md) | Nearest-expiring-first charging cascade · status-aware edit restrictions |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md) | Contract, RateCardEntry, ContractDetail, Addon, WalletRecord, PriceUnit, Destination, Priority |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) | Create Contract (4-step) · Auto Pending→Active · Auto Active→Expired · Extension · Edit (status-aware) · Send Transaction (charging) · Activate Sub-Service · Transfer Balance |
| [GAPS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/GAPS.md) | 13 COVERED · 7 PARTIAL · 6 MISSING · 14 UNVERIFIABLE |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/QUESTIONS.md) | Q-CC-01 Packaging+Billing scope; GAP-CC-30 audit log; GAP-CC-31 VAT; GAP-CC-36 refund |

## Pages that implement this PRD

- Contracts & Cost Mng list (Falcon + AO/NA view-only)
- Add Contract wizard (4 steps: Info / Rate Card / Contract Details / Addons)
- Edit Contract (status-aware field gates)
- _Not yet seeded under `10-Pages/`_

## Falcon components used by this PRD

- [[Falcon Data Table]] (Contracts list, Rate Card matrix, Contract Details matrix, Addons list)
- [[Falcon Tabs]] (4-step wizard) · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]]
- [[Falcon Status Badge]] (Pending / Active / Expired pills)
- [[Falcon Dialog]] (Transfer confirmations)

## Backend services implementing this PRD

| Concern | Service | Folder |
|---|---|---|
| Contract · RateCardEntry · ContractDetail · Addon | commerce | [`understanding/backend/commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) |
| WalletRecord movement · Send Transaction cascade · charging | charging | [`understanding/backend/charging/`](../../../Brain%20Outputs/understanding/backend/charging/) |
| Sub-service activation · provisioning lifecycle | provisioning | [`understanding/backend/provisioning/`](../../../Brain%20Outputs/understanding/backend/provisioning/) |
| Auto-status job (Pending→Active, Active→Expired) | commerce (scheduler) | [`understanding/backend/commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) |

**Vault service notes:** [[Commerce Service]] · [[Charging Service]] · [[Provisioning Service]] · [[BACKEND_INDEX]]

## Validation surface

Status-aware edit gates · rate-card numeric ranges · destination-priority uniqueness · contract overlap rules. From [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md). Hub: [[VALIDATION_INDEX]].

## Module dependencies

- **[[01 Account Management]]** — Contracts fund the Master Wallet on Active; Master Wallet feeds Comm/User/Node wallets
- **[[02 User Management]]** — view-only restrictions for AO/NA per permission matrix

## Health

- **Status:** Core built; periphery missing
- **Top concerns:** Packaging + Billing not in PRD (Q-CC-01); refund flow MISSING (GAP-CC-36); audit log MISSING (GAP-CC-30); VAT MISSING (GAP-CC-31)
- **Coverage:** 13 ✅ · 7 ⚠️ · 6 ❌ · 14 ❓

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]]
