*** Page Learning — Create Contact Group ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/create-contact-group/PAGE_LEARNING.md ***

# Create Contact Group

> **STUB** — page discovered from PRD-04 OVERVIEW (`04-contact-group-management/OVERVIEW.md:30`). 4-step wizard for Client roles only (Falcon usertypes are view-only across PRD-04). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-04 Contact Group Management
- PRD section reference: `Brain Outputs/prd/modules/04-contact-group-management/OVERVIEW.md:30` (Main Screen #3) + `latest-prd.md:29-34` (4-step wizard) + `:48` (Edit subset)

## Primary backend service
- Contact Group Service (`Brain Outputs/understanding/backend/contact-group/`) — upload / parse / configure / share / persist endpoints

## Expected Falcon components
- [[Falcon Wizard]] — 4-step stepper container
- [[Falcon Stepper]] — top progress indicator
- [[Falcon Uploader]] — file upload (CSV / XLS / XLSX) with max-size enforcement
- [[Falcon Single Uploader]] — single-file variant
- [[Falcon Data Table]] — preview parsed rows + header-row picker
- [[Falcon Dropdown]] — column-name configuration · share-with picker
- [[Falcon Input]] — group name · reference ID
- [[Falcon Checkbox Group]] — share-with-users multi-select
- [[Falcon Toggle]] — public/private share mode
- [[Falcon Button]] — next / back / submit / cancel
- [[Falcon Alert Dialog]] — validation errors (linked-channel field warnings)

## Key flows on this page
- Step 1: Upload file (CSV / XLS / XLSX); max size from App Settings (BR-CGM-04)
- Step 2: Pick header row; rename / map columns (columns become template variables when linked)
- Step 3: Group name + reference ID + sharing config (share-with picker per matrix)
- Step 4: Review + submit
- Linked-channel warning when group lacks a column the channel needs (e.g. NationalID for Nabaa)
- Falcon usertypes cannot reach this screen (view-only)

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Create Contact Group]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Contact Groups List]] · [[Organization Hierarchy]] (sister page)
