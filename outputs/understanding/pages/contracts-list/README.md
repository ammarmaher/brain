*** Contracts List — folder index ***
*** SoT for Contracts List implementation · 2026-05-18 (Wave 4 page-mining) ***

# Contracts List — implementation knowledge folder

> Canonical source of truth for the Falcon Contracts list view inside the Contracts & Cost Management container. Falcon-user-only (admin-console). Hosts mode state-machine (list/add/view/edit) — this folder covers the LIST mode only. Companion folders: `add-contract/`, `edit-contract/`.

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | You need the end-to-end picture · actors · entry conditions |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Who can see / open / act on the list |
| [02-SECTION_ACCOUNTS_PANEL](02-SECTION_ACCOUNTS_PANEL.md) | Left-side accounts tree panel (`<app-contracts-accounts-panel>`) |
| [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) | The contracts table — columns, sort, row coloring, actions |
| [04-SECTION_EMPTY_STATES](04-SECTION_EMPTY_STATES.md) | Empty state UX (no node selected · no contracts · no wallet strategy) |
| [05-SECTION_NODE_HEADER](05-SECTION_NODE_HEADER.md) | Selected-node header with Add Contract action button |
| [07-VALIDATIONS](07-VALIDATIONS.md) | (list has no form — validations are about wallet-strategy gate) |
| [08-BACKEND_API](08-BACKEND_API.md) | API surface — 3 list endpoints (contracts + balances + wallet strategy) |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components used + customization notes |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | (list is read-only — no Kafka produced from this page) |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Mode state machine: list ↔ add ↔ view ↔ edit |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Error UX (charging down, wallet not configured, network) |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | Open gaps · anti-patterns · PRD↔backend drift |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code verification gate + FE/BE task list |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Load order for implementation tasks

Frontend task:
1. README → 00-OVERVIEW → 02 (panel) → 03 (table) → 09 (components) → 12 (errors) → 14 (checklist)

Backend task:
1. README → 00-OVERVIEW → 08 (API) → 12 (errors) → 13 (gaps) → 14 (checklist)

## Verification gate

1. What is the entry point? (Admin Console sidebar → Contracts & Cost Management)
2. Which roles can access? (Falcon System Admin / Operation / Product per `adminConsoleGuard`)
3. What is the table data source? (`GET commerce/Contracts?accountId={accountId}` + `GET charging/Wallet/contract-balance-summaries`)
4. What blocks "Add Contract"? (`!walletStrategy` — wallet-strategy must be configured first)
5. What are the row coloring rules? (pending → green-25, expired → lilac-25)
6. What status auto-transitions exist? (None at FE — backend status changes via cron + Kafka events)
7. What's the date format? (`Intl.DateTimeFormat` localized, replace spaces with dashes)
8. What's the charging-down resilience? (Balance summaries swallow errors → `[]` so list stays usable)

## Hubs

- [[Contracts List]] · [[Add Contract Flow]] · [[Edit Contract Flow]] · [[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[Organization Hierarchy]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
