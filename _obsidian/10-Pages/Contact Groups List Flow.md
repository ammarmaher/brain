---
type: page-flow
page: contact-groups-list
module: 04 Contact Group Management
service: Contact Group Service
status: SoT-ready
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/contact-groups-list/
---

# Contact Groups List Flow

> Two-tab admin-console browser of contact groups. Falcon view-only doctrine. softDelete visibility per role.

## Source of truth

Full implementation folder: [pages/contact-groups-list/](../../../Brain%20Outputs/understanding/pages/contact-groups-list/)

- [README](../../../Brain%20Outputs/understanding/pages/contact-groups-list/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/contact-groups-list/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/contact-groups-list/01-PERMISSIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/contact-groups-list/08-BACKEND_API.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/contact-groups-list/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/contact-groups-list/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/contact-groups-list/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/contact-groups-list/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [PRD-04 BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md)
- **Backend:** [[Contact Group Service]] — `GET /api/contact-groups`
- **Path:** `/admin-console/contact-groups`
- **Tabs:** Active · Deleted (softDelete visibility — Falcon admin only)
- **Doctrine:** Falcon view-only (no create/edit on admin console — those live in management-console)

## Falcon admin soft-delete

This page surfaces deleted Contact Groups when a Falcon admin queries `?IncludeDeleted=true`. Mirrors the IncludeDeleted lift pattern from [project_pr40937_include_deleted_lift_2026_05_17](../../../Users/User/.claude/projects/C--Falcon/memory/project_pr40937_include_deleted_lift_2026_05_17.md).

## Sister flows

[[Create Contact Group Flow]] (management-console counterpart)

## Falcon components used

[[Falcon Data Table]] · [[Falcon Tabs]] · [[Falcon Status Badge]] · [[Falcon Button]] · [[Falcon Search Input]]

## Hubs

[[04 Contact Group Management]] · [[Contact Group Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
