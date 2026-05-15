*** Page Learning — Add Contract ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/add-contract/PAGE_LEARNING.md ***

# Add Contract

> **STUB** — page discovered from PRD-03 OVERVIEW (`03-contract-packaging-charging-billing-management/OVERVIEW.md:30`). 4-step wizard: Info / Rate Card / Contract Details matrix / Addons. Falcon usertype only (Sys Admin + Product). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-03 Contract Packaging Charging Billing Management
- PRD section reference: `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/OVERVIEW.md:30` (Main Screen #2) + `latest-prd.md:23-46` (4-step wizard details)

## Primary backend service
- Commerce Service (`Brain Outputs/understanding/backend/commerce/`) — contract create / validate / activate-on-start-date

## Expected Falcon components
- [[Falcon Wizard]] — 4-step container
- [[Falcon Stepper]] — top progress indicator
- [[Falcon Input]] — contract ID · name · Farabi Reference ID (<=50)
- [[Falcon Date Picker]] — start date · end date
- [[Falcon Dropdown]] — account · currency · contract type
- [[Falcon Data Table]] — Rate Card editable rows + Contract Details matrix (CommChannel × Destination)
- [[Falcon Grid Input]] — matrix cell editing
- [[Falcon Input Number]] — values per row
- [[Falcon Checkbox]] — addon enable/disable
- [[Falcon Button]] — next / back / save / cancel
- [[Falcon Alert Dialog]] — validation errors

## Key flows on this page
- Step 1 — Info: contract ID, dates, account, Farabi Reference ID
- Step 2 — Rate Card: per-CommChannel base pricing
- Step 3 — Contract Details: CommChannel × Destination matrix (linked to Destinations doc)
- Step 4 — Addons: optional purchasable items
- Submit → contract enters Pending status; auto-Activate on Start Date funds Master Wallet
- Only Falcon Sys Admin + Product can reach this screen

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Add Contract]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Contracts List]] · [[Edit Contract]] · [[Organization Hierarchy]] (sister page)
