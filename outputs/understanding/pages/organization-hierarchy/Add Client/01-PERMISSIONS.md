*** Add Client — Permission matrix ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Permission matrix (who can run this flow)

Authority: `Permission list - Jawad` (PRD-01 `latest-prd.md:31`, BR-AM-02; cross-referenced in [../BUSINESS_RULES.md](../BUSINESS_RULES.md)).

| Role | Can run? | Source |
|---|---|---|
| Falcon System Administrator | YES | PRD-01 OVERVIEW (Actors row 1) + BR-AM-02 |
| Falcon Product | YES | PRD-01 OVERVIEW (Actors row 2) + BR-AM-02 |
| Falcon Operation | NO (explicit Not Allow) | PRD-01 OVERVIEW (Actors row 3) — "Operation cannot add clients" |
| Client Account Owner | NO | Cannot add clients (client-side, scope = own hierarchy only) |
| Client Node Admin | NO | Cannot add clients |
| Client Normal User | NO | Transactional only |

Cross-link: [[Falcon Roles Permission Matrix]]. PES policy gate at the Core/System Gateway must mirror this matrix; drift between the Permission sheet and the PES policy rules is tracked as Q-AM-16.

## Enforcement layers

- **Frontend (visibility):** hide the "Add Client" action button via PES guard so it never renders for non-allowed roles.
- **Backend (`[Authorize]`):** all Commerce endpoints class-level `[Authorize]` — see [08-BACKEND_API](08-BACKEND_API.md).
- **PES policy at the Gateway:** the authoritative security boundary. Frontend hiding is UX; backend `[Authorize]` + PES is the actual gate.

## Edge cases

- **Standalone visibility/pricing edit endpoints** (post-create): `PUT /api/Node/comm-channel/visibility`, `PUT /api/Node/comm-channel/price-type`, `PUT /api/Node/comm-channel/price-value` carry `[Authorize(Policy = "FalconOnly")]` per `ENDPOINT_REGISTRY.md`. The create-time path (inside `CreateAccountRequest`) inherits the parent endpoint's auth, which is the same Falcon System Admin + Product matrix.

## Open

- **Q-AM-16:** PES rule sync with Permission sheet — drift between the Permission spreadsheet (Jawad) and the runtime PES policy rules can cause silent allow/deny inconsistencies. Tracked as an open question.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Falcon Roles Permission Matrix]] · [[Access PES Service]] · [[Organization Hierarchy]] · [[01 Account Management]] · [[Commerce Service]] · [[System Gateway Service]] · [[Core Gateway Service]] · [[PRD_INDEX]] · [[BUSINESS_INDEX]] · [[AMMAR_BRAIN_HOME]]
