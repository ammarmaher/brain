*** PRD Understanding - Contact Group Management - BUSINESS_RULES ***

# 04-contact-group-management - Business Rules

> Citations point at `Brain SK\skills\imported-business\prd-knowledge\modules\04-contact-group-management\latest-prd.md` unless otherwise noted.

## Identity & Naming

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-01 | Each group has a system-generated immutable Contact ID. | latest-prd.md:34; understanding.md:42 | [CONFIRMED] |
| BR-CGM-02 | Group Name <=50 chars, mandatory. | latest-prd.md:30 | [CONFIRMED] |
| BR-CGM-03 | Reference ID is optional. | latest-prd.md:30 | [CONFIRMED] |

## Upload & File Validation

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-04 | Contact file must be CSV / XLS / XLSX. Size capped by App Settings (configurable per system). | latest-prd.md:30, 55 | [CONFIRMED] |
| BR-CGM-05 | "First row is the header" toggle controls column-name source. | latest-prd.md:31 | [CONFIRMED] |
| BR-CGM-06 | Column names: English letters only, no duplicates, no special chars, <=20 chars, spaces auto-converted to `_`. | latest-prd.md:31 | [CONFIRMED] |
| BR-CGM-07 | Data preview shows first 5 rows. | latest-prd.md:31 | [CONFIRMED] |
| BR-CGM-08 | Contact file CONTENT is NOT validated beyond parsing — whatever the user uploads is accepted. | latest-prd.md:54 | [CONFIRMED] |

## Sharing

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-09 | Share Step (optional) lets creator pick specific Normal Users OR "All Users". | latest-prd.md:32 | [CONFIRMED] |
| BR-CGM-10 | Sharing scope: Normal Users inside the same account (cross-ref hierarchy). | latest-prd.md:25-27 | [CONFIRMED] |
| BR-CGM-11 | AO and Node Admin can share groups created by OTHERS in their hierarchy. | latest-prd.md:25-26; understanding.md:69 | [CONFIRMED] |
| BR-CGM-12 | Normal User (non-creator) CANNOT share groups (even shared-with-me). | understanding.md:67 | [CONFIRMED] |

## Permission Matrix (canonical from `Contact Group Permissions` sheet)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-13 | Falcon usertypes (System Admin, Operation, Product): View Y, Create N, Edit N, Share N, Delete N, Download CG Y, Download Original Y. | attachments.md:18-19; understanding.md:57-59 | [CONFIRMED] |
| BR-CGM-14 | Client AO (creator): all Y. | understanding.md:60 | [CONFIRMED] |
| BR-CGM-15 | Client AO (not creator): View Y, Create Y, Edit N, Share Y, Delete N, Downloads Y. | understanding.md:61 | [CONFIRMED] |
| BR-CGM-16 | Client Node Admin (creator): all Y. | understanding.md:62 | [CONFIRMED] |
| BR-CGM-17 | Client Node Admin (not creator): View Y, Create Y, Edit N, Share Y, Delete N, Downloads Y. | understanding.md:63 | [CONFIRMED] |
| BR-CGM-18 | Client Normal User (creator): all Y. | understanding.md:64 | [CONFIRMED] |
| BR-CGM-19 | Client Normal User (not creator): View Y, Create Y, Edit N, Share N, Delete N, Downloads Y. | understanding.md:65 | [CONFIRMED] |

## View Tabs

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-20 | AO / Node Admin on their own node: 1 tab `Contact Groups`. | latest-prd.md:37 | [CONFIRMED] |
| BR-CGM-21 | Normal User on their own node: 2 tabs `Contact Groups` + `Shared Groups` (shared-with-me, view-only). | latest-prd.md:38 | [CONFIRMED] |
| BR-CGM-22 | AO / Node Admin on sub-nodes in hierarchy: 1 tab; can view groups created on that sub-node; NO Shared Groups tab. | latest-prd.md:39 | [CONFIRMED] |
| BR-CGM-23 | Falcon usertype: must select a Main node first; 1 tab; view-only; can still see groups soft-deleted by creators. | latest-prd.md:40 | [CONFIRMED] |

## List Columns

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-24 | List columns: Contact ID, Contact Group Name, Reference ID, Created By (empty when viewer is creator), Creation Date `DD/MM/YYYY HH:MM AM/PM`, Uploaded Contact (count), Status (In Progress / Completed), Shared With (collapsed `+N`), Actions. | latest-prd.md:41 | [CONFIRMED] |
| BR-CGM-25 | `Uploaded Contact` count is frozen at upload time (no edit-list capability). | understanding.md:72 | [CONFIRMED] |

## Edit & Delete

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-26 | Edit (creator only): Name / Shared With / Reference ID editable. Contact ID / Creation Date / Status / contact table are read-only. | latest-prd.md:48 | [CONFIRMED] |
| BR-CGM-27 | Edits propagate to all shared versions (single source of truth). | latest-prd.md:56; understanding.md:48 | [CONFIRMED] |
| BR-CGM-28 | Delete is soft (creator only): hidden client-side but still visible to Falcon usertype with download access. | latest-prd.md:45; understanding.md:46 | [CONFIRMED] |

## Status

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-29 | Status values: `In Progress`, `Completed` (no `Failed` mentioned in PRD). | latest-prd.md:41 | [CONFIRMED] |

## Open / Unstated

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CGM-30 | App Settings max-upload-file-size has no default value stated. | latest-prd.md:67; understanding.md:140 | [OPEN] |
| BR-CGM-31 | Re-parsing vs snapshot semantics — PRD says original file is downloadable; unclear whether edits re-read original or diff. | latest-prd.md:69 | [OPEN] |
| BR-CGM-32 | When a shared-with Normal User is deleted, behavior of the share entry is silent. | understanding.md:89, 143 | [OPEN] |
| BR-CGM-33 | "Shared With (+N)" collapsing threshold is undefined. | understanding.md:133 | [OPEN] |
| BR-CGM-34 | "Failed" status on parse error - not mentioned in PRD; current status set is {In Progress, Completed}. | understanding.md:136 | [OPEN] |
| BR-CGM-35 | Hierarchy depth visibility - whether AO sees groups 3+ levels deep in their list is silent. | understanding.md:144 | [OPEN] |
| BR-CGM-36 | What happens to a group when its creator's account is Deleted is silent. | understanding.md:89 | [OPEN] |
| BR-CGM-37 | "First row is the header" toggle off post-edit-of-names behavior is silent. | understanding.md:88 | [OPEN] |
| BR-CGM-38 | Whether a user can share a group with themselves is silent (UI should prevent). | understanding.md:90 | [OPEN] |
