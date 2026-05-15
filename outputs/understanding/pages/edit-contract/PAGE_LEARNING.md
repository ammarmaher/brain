*** Page Learning — Edit Contract ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/edit-contract/PAGE_LEARNING.md ***

# Edit Contract

> **STUB** — page discovered from PRD-03 OVERVIEW (`03-contract-packaging-charging-billing-management/OVERVIEW.md:32`). Falcon usertype only, with field-level restrictions per status (Pending = full edit; Active/Expired = limited). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-03 Contract Packaging Charging Billing Management
- PRD section reference: `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/OVERVIEW.md:32` (Main Screen #4) + `latest-prd.md:50-56` (status-aware edit rules) + `:55-56` (extension restores Expired → Active)

## Primary backend service
- Commerce Service (`Brain Outputs/understanding/backend/commerce/`) — contract update / extend / status-aware validation

## Expected Falcon components
- [[Falcon Tabs]] — Info / Rate Card / Contract Details / Addons (mirrors Add Contract wizard)
- [[Falcon Input]] — editable fields (disabled per status)
- [[Falcon Date Picker]] — end date (extension allowed on Expired → restores Active)
- [[Falcon Dropdown]] — restricted selectors
- [[Falcon Data Table]] — Rate Card + Contract Details matrix (read-only or editable per status)
- [[Falcon Status Badge]] — current contract status
- [[Falcon Button]] — save / cancel
- [[Falcon Confirm Dialog]] — confirm status-impacting saves
- [[Falcon Alert Dialog]] — field-restriction explanations

## Key flows on this page
- Status = Pending: full edit (all fields)
- Status = Active: limited edit (dates can extend; rate-card mostly locked)
- Status = Expired: extension only (extending end-date restores Active + wallet sweep restored)
- Save triggers re-validation per status
- Only Falcon Sys Admin + Product can reach this screen

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Edit Contract]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Contracts List]] · [[Add Contract]] · [[Organization Hierarchy]] (sister page)
