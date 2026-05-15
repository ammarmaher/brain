*** Page Learning — Contact Groups List ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/contact-groups-list/PAGE_LEARNING.md ***

# Contact Groups List

> **STUB** — page discovered from PRD-04 OVERVIEW (`04-contact-group-management/OVERVIEW.md:28`). Covers both the logged-in user's own-node list and the hierarchy-scoped list (sub-node under AO / Node Admin). Includes the Shared-Groups tab (Normal User only). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-04 Contact Group Management
- PRD section reference: `Brain Outputs/prd/modules/04-contact-group-management/OVERVIEW.md:28-29` (Main Screens #1 + #2) + `:33` (#6 Shared Groups tab)

## Primary backend service
- Contact Group Service (`Brain Outputs/understanding/backend/contact-group/`) — list / search / filter / soft-delete / download endpoints

## Expected Falcon components
- [[Falcon Data Table]] — primary list with pagination + filters
- [[Falcon Tabs]] — own / sub-node / shared-with-me tabs (per role)
- [[Falcon Filter Panel]] — name · created-by · shared-with filters
- [[Falcon Search Input]] — quick search by group name
- [[Falcon Status Badge]] — shared / private / soft-deleted
- [[Falcon Button]] — primary "Create Contact Group" + row actions
- [[Falcon Menu]] — row 3-dot action menu (Edit / Share / Delete / Download)
- [[Falcon Confirm Dialog]] — soft-delete confirmation
- [[Falcon Empty State]] — no groups yet

## Key flows on this page
- Falcon usertypes (Sys Admin / Operation / Product): view-only via Main node selection
- AO / Node Admin: create / edit own / delete own / share own / share within hierarchy / download
- Normal User (creator): create / edit / delete / share / download own
- Normal User (non-creator): view-only on shared groups (via Shared Groups tab)
- Soft-deleted groups hidden from clients but downloadable by Falcon usertype
- Permissions per `Contact Group Permissions` sheet (PES gated)

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Contact Groups List]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Create Contact Group]] · [[Organization Hierarchy]] (sister page)
