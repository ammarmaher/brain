---
type: page-flow
page: create-contact-group
module: 04 Contact Group Management
service: Contact Group Service
status: SoT-ready (mgmt-console old-UI pending extraction)
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/create-contact-group/
---

# Create Contact Group Flow

> 4-stage wizard with pre-signed S3 upload session FSM. Client users only.

## Source of truth

Full implementation folder: [pages/create-contact-group/](../../../Brain%20Outputs/understanding/pages/create-contact-group/)

- [README](../../../Brain%20Outputs/understanding/pages/create-contact-group/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/create-contact-group/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/create-contact-group/01-PERMISSIONS.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/create-contact-group/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/create-contact-group/08-BACKEND_API.md)
- [11-STATE_TRANSITIONS](../../../Brain%20Outputs/understanding/pages/create-contact-group/11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/create-contact-group/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/create-contact-group/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/create-contact-group/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/create-contact-group/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [PRD-04 BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md)
- **Backend:** [[Contact Group Service]] — multi-stage POST with S3 pre-signed URL
- **Path:** `/management-console/contact-groups/new`
- **Stages:** (1) Metadata → (2) Request pre-signed URL → (3) Direct S3 upload → (4) Confirm upload
- **Upload session FSM:** `Requested → Uploading → Processing → Validated → Persisted` (or `Failed` at any stage)
- **Permissions:** Client users only (Account Owner · Node Admin · Normal User per PRD-04)

## Sister flows

[[Contact Groups List Flow]] (admin-console counterpart)

## Falcon components used

[[Falcon Input]] · [[Falcon Stepper]] · [[Falcon Uploader (generic)]] · [[Falcon Button]] · [[Falcon Dialog]] · [[Falcon Notification]] · [[Falcon Status Badge]]

## Hubs

[[04 Contact Group Management]] · [[Contact Group Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
