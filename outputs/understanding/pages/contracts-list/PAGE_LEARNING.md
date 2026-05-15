*** Page Learning — Contracts List ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/contracts-list/PAGE_LEARNING.md ***

# Contracts List

> **STUB** — page discovered from PRD-03 OVERVIEW (`03-contract-packaging-charging-billing-management/OVERVIEW.md:29`). Contracts & Cost Management list — Falcon roles + Client AO/NA view-only. Includes Contract Detail multi-tab access. Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-03 Contract Packaging Charging Billing Management
- PRD section reference: `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/OVERVIEW.md:29` (Main Screen #1) + `:31` (#3 Contract Detail)

## Primary backend service
- Commerce Service (`Brain Outputs/understanding/backend/commerce/`) — contract entity + list/detail endpoints + auto-status transitions

## Expected Falcon components
- [[Falcon Data Table]] — primary list (status · start/end dates · value · remaining value)
- [[Falcon Filter Panel]] — status · date range · account · contract ID
- [[Falcon Search Input]] — quick search
- [[Falcon Status Badge]] — Pending / Active / Expired
- [[Falcon Tabs]] — Contract Detail tabs (Info / Rate Card / Contract Details / Addons)
- [[Falcon Button]] — "Add Contract" (Falcon only) + row actions
- [[Falcon Menu]] — row 3-dot menu (View / Edit per role)
- [[Falcon Empty State]] — no contracts yet
- [[Falcon Paginator]] — pagination

## Key flows on this page
- Falcon Sys Admin / Product: full view + create + edit (status-aware restrictions)
- Falcon Operation: view-only
- Client AO: view-only; Remaining Value visible only when status = Active (hidden Expired; NA Pending)
- Client Node Admin: view-only per 02-user-management matrix
- Open Contract Detail → multi-tab view (Info · Rate Card · Contract Details matrix · Addons)
- Background: auto-Activate on Start Date · auto-Expire on End Date (system actor)

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Contracts List]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Add Contract]] · [[Edit Contract]] · [[Organization Hierarchy]] (sister page)
