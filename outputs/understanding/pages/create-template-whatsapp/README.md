*** Create Template WhatsApp — folder index ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — implementation knowledge folder

> Canonical SoT for the WhatsApp template creation wizard. 2-step flow: Basic Info → Message Structure. **Backend CRUD endpoints DO NOT EXIST today** (GAP-T-001) — documented per PRD-05.

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | 2-step wizard summary · per-PRD shape |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Maker role + per-channel permission |
| [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md) | Name · Category · Language · Reference ID |
| [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) | Header · Body · Footer · Buttons · Variables |
| [04-SECTION_PREVIEW](04-SECTION_PREVIEW.md) | Live preview with sample values |
| [05-SECTION_CONTACT_GROUP_LINK](05-SECTION_CONTACT_GROUP_LINK.md) | Linking template variables to contact group columns |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Name format · variable rules · char limits |
| [08-BACKEND_API](08-BACKEND_API.md) | **GAP: POST endpoint missing** |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components per step |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | Template created event + Meta submission |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Created → submit → PendingChecker → PendingMeta → Approved |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Validation errors + Meta rejection |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | GAP-T-001 + 10 OPEN business rules from PRD |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Blocked on backend; tasks documented |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → PRD-05 BR-TM-04..16 (template name, variables, sections)
2. 2-step wizard understood? → YES (per BR-TM-21 + understanding.md:18-21)
3. Variable rules clear? → BR-TM-06..10 (Number vs Name, sequential, no start/end, 20-30 limit)
4. Backend endpoint? → **MISSING (GAP-T-001)**
5. Contact group linkage? → BR-TM-12 — columns → variables
6. Live preview rendering? → BR-TM-14 (client-side per BR-TM-35 OPEN)

## Hubs

[[Create Template WhatsApp Flow]] · [[Templates List]] · [[05 Templates]] · [[Contact Groups List]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
