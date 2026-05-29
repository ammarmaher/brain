*** Templates List — folder index ***
*** SoT for templates list view · 2026-05-18 ***

# Templates List — implementation knowledge folder

> Canonical SoT for the Templates list view. **CRITICAL CAVEAT:** Template CRUD endpoints DO NOT EXIST in the backend today — only 3 communication-channel-config endpoints. This folder documents what the page SHOULD do per PRD-05 + flags the implementation gap.

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | Per-PRD purpose · Maker/Checker governance · channel types |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Per-role permissions · who can create/approve |
| [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md) | Columns · status pill · row actions |
| [03-SECTION_FILTERS](03-SECTION_FILTERS.md) | Filter by status · channel · category · language |
| [04-SECTION_EMPTY_STATES](04-SECTION_EMPTY_STATES.md) | Empty state UX |
| [05-SECTION_CREATE_ENTRY](05-SECTION_CREATE_ENTRY.md) | Channel-picker for create entry |
| [07-VALIDATIONS](07-VALIDATIONS.md) | (list mode = no form validations) |
| [08-BACKEND_API](08-BACKEND_API.md) | **GAP: endpoints don't exist; only 3 config endpoints documented** |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | (list is read-only) |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Template status FSM · Meta state mapping |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Error UX |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | **GAP-T-001: Template CRUD endpoints MISSING** · 75% unmined PRD-05 |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + backend-first dependency |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → PRD-05 (75% mined per current state)
2. Backend endpoints? → **MISSING** (GAP-T-001) — only 3 config endpoints exist
3. Maker/Checker governance understood? → YES per BR-TM-01..XX
4. Per-channel wizard branches? → WhatsApp / Voice / AI (Voice + AI deferred)
5. Status lifecycle? → Pending / Approved / Rejected (+ Meta state mapping for WhatsApp)
6. Cross-link to ContactGroup? → YES (columns become template variables)

## Hubs

[[Templates List]] · [[Create Template WhatsApp Flow]] · [[05 Templates]] · [[Contact Groups List]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
