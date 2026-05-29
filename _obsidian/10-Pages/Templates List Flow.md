---
type: page-flow
page: templates-list
module: 05 Templates
service: Templates Service
status: BLOCKED (backend pending)
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/templates-list/
---

# Templates List Flow

> List of message templates per Maker/Checker governance. **BLOCKED**: backend CRUD endpoints do not exist (GAP-T-001).

## Source of truth

Full implementation folder: [pages/templates-list/](../../../Brain%20Outputs/understanding/pages/templates-list/)

- [README](../../../Brain%20Outputs/understanding/pages/templates-list/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/templates-list/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/templates-list/01-PERMISSIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/templates-list/08-BACKEND_API.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/templates-list/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/templates-list/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/templates-list/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [PRD-05 BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md)
- **Backend:** [[Templates Service]] — **CRUD MISSING** (GAP-T-001)
- **Controllers used:** _(none yet — backend not built)_
- **Path:** `/admin-console/templates`
- **Governance:** Maker/Checker workflow
- **Channels:** WhatsApp · SMS (future)

## Key gaps

- **GAP-T-001:** Template CRUD endpoints MISSING — see [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/templates-list/13-GAPS_AND_DRIFTS.md)
- **Q-TM-CHECKER-ROLE:** Checker assignment unclear — open question

## Sister flows

[[Create Template WhatsApp Flow]] · [[Contact Groups List Flow]]

## Falcon components used

[[Falcon Data Table]] · [[Falcon Status Badge]] · [[Falcon Button]] · [[Falcon Dropdown]] · [[Falcon Tabs]]

## Hubs

[[05 Templates]] · [[Templates Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
