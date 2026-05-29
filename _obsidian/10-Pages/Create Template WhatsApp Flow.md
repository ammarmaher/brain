---
type: page-flow
page: create-template-whatsapp
module: 05 Templates
service: Templates Service
status: BLOCKED (backend pending)
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/create-template-whatsapp/
---

# Create Template WhatsApp Flow

> 2-step wizard for WhatsApp templates. **BLOCKED** on backend (GAP-T-001).

## Source of truth

Full implementation folder: [pages/create-template-whatsapp/](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/)

- [README](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/00-OVERVIEW.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/08-BACKEND_API.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [PRD-05 BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md)
- **Backend:** [[Templates Service]] — **MISSING** (GAP-T-001)
- **Controllers used:** _(none yet — backend not built)_
- **Path:** `/admin-console/templates/new/whatsapp`
- **Steps:** Step 1 (Metadata · Channel · Language) → Step 2 (Body template · Variables · Buttons · Header · Footer)
- **WhatsApp Business API contract:** template categories (UTILITY/MARKETING/AUTHENTICATION) · approval status (PENDING/APPROVED/REJECTED)

## Key gaps

- **GAP-T-001:** Template CRUD endpoints MISSING
- WhatsApp Business API submission flow undefined

## Sister flows

[[Templates List Flow]] · [[Create Contact Group Flow]]

## Falcon components used

[[Falcon Input]] · [[Falcon Textarea]] · [[Falcon Dropdown]] · [[Falcon Stepper]] · [[Falcon Button]] · [[Falcon Tag]]

## Hubs

[[05 Templates]] · [[Templates Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
