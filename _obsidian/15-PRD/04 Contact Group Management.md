---
type: prd-module
prd-id: PRD-04
module-name: Contact Group Management
coverage-percent: 0
sync-date: 2026-04-24
status: fresh
created: 2026-05-15
---
*** PRD-04 — Contact Group Management ***
*** SoT: Brain Outputs/prd/modules/04-contact-group-management/ ***
*** Drive source: `Contact Group Management Module_V2` (sync 2026-04-24) ***

# PRD-04 — Contact Group Management

> Owns structured recipient lists (Contact Groups) created by **Client** user types (AO / Node Admin / Normal User) and used by Normal Users for sending transactions. Groups are created by uploading a CSV/XLS/XLSX, configuring columns, optionally sharing inside the same account. Columns become template variables when groups link to templates (cross-cuts [[05 Templates]]). Falcon usertypes are **view-only**. Groups are soft-deleted: hidden from clients but downloadable by Falcon.

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/04-contact-group-management/OVERVIEW.md) | Actors · screens · role permission matrix |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md) | Soft-delete · share policy · view-only Falcon · download rights |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/ENTITIES.md) | ContactGroup, ContactGroupColumn, ContactGroupRecord, SharePolicy, UploadSession |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) | Create Contact Group (4-step + upload pre-flow) · View · Share · Edit · Soft Delete · Download · Link to Template · Falcon view |
| [GAPS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/GAPS.md) | 14 COVERED · 2 PARTIAL · 5 MISSING · 8 UNVERIFIABLE — **frontend pending** |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/QUESTIONS.md) | GAP-CGM-26 Failed status; GAP-CGM-34 Story 115329 |

## Pages that implement this PRD

- Contact Groups list (own node)
- Contact Groups list (sub-node under AO/NA hierarchy)
- Create Contact Group wizard (4 steps)
- Share / Edit / Download dialogs
- _Frontend pending Story 115329_

## Falcon components used by this PRD

- [[Falcon Data Table]] (Contact Groups list, column configurator, preview rows)
- [[Falcon Uploader]] (CSV/XLS/XLSX upload — the same component used in [[Organization Hierarchy]] photo upload)
- [[Falcon Tabs]] (4-step wizard) · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]]
- [[Falcon Status Badge]] (group status)
- [[Falcon Dialog]] (Share / Confirm-delete)

## Backend services implementing this PRD

| Concern | Service | Folder |
|---|---|---|
| ContactGroup · Column · Record · UploadSession | contact-group | [`understanding/backend/contact-group/`](../../../Brain%20Outputs/understanding/backend/contact-group/) |
| SharePolicy · permission gating | contact-group + access | [`understanding/backend/access/`](../../../Brain%20Outputs/understanding/backend/access/) |
| Link to Template (column → template variable) | templates | [`understanding/backend/templates/`](../../../Brain%20Outputs/understanding/backend/templates/) |
| Gateway routing | core-gateway | [`understanding/backend/core-gateway/`](../../../Brain%20Outputs/understanding/backend/core-gateway/) |

**Vault service notes:** [[Contact Group Service]] · [[Access PES Service]] · [[Templates Service]] · [[Core Gateway Service]] · [[BACKEND_INDEX]]

## Validation surface

File type · file size · column shape · share-target hierarchy bounds · soft-delete reversibility window. From [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md). Hub: [[VALIDATION_INDEX]].

## Linked permission matrices

- [[Contact Group Permission Matrix]] — `Contact Group Permissions` sheet (Falcon view-only + Client AO/NA/NU × {creator, not-creator} × View/Create/Edit/Share/Delete/Download CG/Download Original); single tab, fully captured
- Folder hub: [[12-Permissions/README|12-Permissions]]

## Module dependencies

- **[[02 User Management]]** — Client user types are the only creators (Falcon is view-only)
- **[[05 Templates]]** — Group columns become template variables when linked to a template

## Health

- **Status:** Backend ready; frontend pending
- **Top concerns:** Story 115329 unfinished (GAP-CGM-34); Failed status missing (GAP-CGM-26); audit log + retention policy missing
- **Coverage:** 14 ✅ · 2 ⚠️ · 5 ❌ · 8 ❓

## Tags

#type/prd-module #prd/02 #prd/04 #prd/05 #service/access #service/contact-group #service/core-gateway #service/templates #gap

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]]
