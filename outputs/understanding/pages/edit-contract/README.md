*** Edit Contract — folder index ***
*** SoT for editing existing contracts · 2026-05-18 ***

# Edit Contract — implementation knowledge folder

> Canonical SoT for editing an existing Contract. Falcon-user-only. 4 tabs matching the Add wizard's 4 steps. Status-aware field restrictions: Pending=full edit, Active=limited, Expired=read-only with optional extend.

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | E2E picture · entry from list/view · 4 tabs |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Who can edit, status-aware |
| [02-TAB_1_INFO](02-TAB_1_INFO.md) | Contract Information tab (name, dates, value) |
| [03-TAB_2_RATE_CARD](03-TAB_2_RATE_CARD.md) | Rate Card tab (reuses add component) |
| [04-TAB_3_CONTRACT_DETAILS](04-TAB_3_CONTRACT_DETAILS.md) | Contract Details tab (rate matrix) |
| [05-TAB_4_ADDONS](05-TAB_4_ADDONS.md) | Add-ons tab (quotas + overage) |
| [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md) | Status-aware field-freeze logic |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Same predicates as Add + canSave gates |
| [08-BACKEND_API](08-BACKEND_API.md) | `PUT commerce/Contracts/{id}` + extend logic |
| [09-COMPONENTS](09-COMPONENTS.md) | Same Falcon components as Add |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | `contract-updated` event |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Edit can flip expired → active (extension) |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Status-restricted field rejection · same errors as Add |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | Same anti-patterns as Add · plus extension UX |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD rules? → BR-CC-50..56 (status-aware edit restrictions)
2. Endpoint? → `PUT commerce/Contracts/{id}`
3. Status → editable fields mapping clear? → Pending: all · Active: name/farabi only · Expired: read-only (extension flips status)
4. Frontend gate? → `canEditContractStatus(status)` + `hasRestrictedCommercialFields(status)`
5. Extension is same endpoint? → YES (re-uses PUT; status flips Expired→Active)
6. Validation runs only when canSave? → YES

## Hubs

[[Edit Contract Flow]] · [[Add Contract Flow]] · [[Contracts List]] · [[03 Contract Packaging Charging Billing Management]]
