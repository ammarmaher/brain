*** Add Contract — folder index ***
*** SoT for Add Contract 4-step wizard · 2026-05-18 ***

# Add Contract — implementation knowledge folder

> Canonical SoT for the Falcon Add Contract 4-step wizard inside Contracts & Cost Management. Falcon-user only (admin-console). Composite POST to Commerce — ALL 4 steps submitted as one payload (similar to Add Client).

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | End-to-end picture, 4 steps, gateway routing |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Who can author contracts |
| [02-STEP_1_INFO](02-STEP_1_INFO.md) | Contract Information form (name, dates, value) |
| [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) | Rate Card (unit conversions per channel) |
| [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) | Contract Details (rate matrix per application × channel) |
| [05-STEP_4_ADDONS](05-STEP_4_ADDONS.md) | Add-ons (quotas + overage rates) |
| [07-VALIDATIONS](07-VALIDATIONS.md) | ~25 validation predicates across 4 steps |
| [08-BACKEND_API](08-BACKEND_API.md) | `POST commerce/Contracts` + lookups + wallet strategy |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components per step |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | Contract creation → wallet funding events |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Newly-created contract starts as `pending` |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Validation rejections, duplicate FarabiId, etc. |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | ngModel anti-pattern, missing async uniqueness, etc. |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + FE/BE/E2E tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Load order

Frontend: README → 00 → 02-05 (steps) → 07 (validations) → 09 (components) → 12 (errors) → 14 (checklist)

Backend: README → 00 → 08 (API) → 07 (validations) → 10 (Kafka) → 11 (state) → 13 (gaps) → 14

## Verification gate

1. Which PRD rules? → BR-CC-01..20 (creation), BR-CC-50..56 (status FSM)
2. Backend endpoint? → `POST commerce/Contracts`
3. Composite request DTO shape? → `CreateContractRequest` with 4 nested arrays (Rates, UnitConversions, Quotas, OverageRates)
4. Validations per step? → 5 + 6 + 4 + 13 = ~28 predicates
5. Wallet strategy precondition? → YES — Add gated by `getWalletStrategy(accountId)` non-null
6. Falcon components? → `<falcon-calendar>`, `<falcon-input>`, `<falcon-select>`, `<dynamic-stepper>` (currently)
7. Async uniqueness? → NO (FarabiId duplicate caught at BE)
8. Date format on wire? → `YYYY-MM-DDT00:00:00` (no Z; business date Asia/Riyadh)

## Hubs

- [[Add Contract Flow]] · [[Contracts List]] · [[Edit Contract Flow]] · [[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
