*** PRD Understanding - Contact Group Management - OVERVIEW ***

# 04-contact-group-management - Overview

> Source PRD: `Brain SK\skills\imported-business\prd-knowledge\modules\04-contact-group-management\latest-prd.md` (`Contact Group Management Module_V2`, Drive sync 2026-04-24).
> Supporting: `Contact Group Permissions` sheet (authoritative permission matrix).

## Purpose

Owns structured lists of recipients (Contact Groups) created by **Client** user types (Account Owner, Node Admin, Normal User) and used by Normal Users for sending transactions. Groups are created by uploading a file (CSV / XLS / XLSX), configuring columns, and optionally sharing with Normal Users in the same account. Columns become template variables when groups are linked to templates (cross-cuts 05-templates). Falcon usertypes are **view-only** — they never create, edit, delete, or share. Groups are soft-deleted: hidden from clients but still downloadable by Falcon usertype.

## Actors

| Actor | User Type | Capability | Source |
|---|---|---|---|
| System Administrator | Falcon | View only (via Main node selection). | latest-prd.md:24; understanding.md:11 |
| Operation | Falcon | View only. | understanding.md:12 |
| Product | Falcon | View only. | understanding.md:13 |
| Account Owner (AO) | Client | Create / Edit own / Delete own / Share own / Share groups created by others in hierarchy / Download. | latest-prd.md:25; understanding.md:14 |
| Node Admin | Client | Same as AO, scoped to hierarchy. | latest-prd.md:26; understanding.md:15 |
| Normal User (creator) | Client | Create / Edit / Delete / Share / Download own groups. Use shared-with-me. | latest-prd.md:27; understanding.md:16 |
| Normal User (non-creator) | Client | View only on shared groups; cannot edit/delete/share. | understanding.md:17 |

## Main Screens

| # | Screen | Source |
|---|---|---|
| 1 | Contact Groups list (on logged-in user's own node) | understanding.md:24 |
| 2 | Contact Groups list (on a sub-node under AO / Node Admin hierarchy) | understanding.md:25 |
| 3 | Create Contact Group wizard (4 steps) | latest-prd.md:29-34 |
| 4 | Contact Group detail view (read-only, with Edit button for creator) | understanding.md:27 |
| 5 | Edit Contact Group (creator only, subset of fields) | latest-prd.md:48 |
| 6 | Shared Groups tab (Normal User only) | understanding.md:29 |

## Main Actions

| Action | Allowed By | Source |
|---|---|---|
| Upload & parse file (CSV / XLS / XLSX) | Client roles | latest-prd.md:30 |
| Configure header row + column names | Client roles | latest-prd.md:31 |
| Share during creation or via action menu | Client roles (per matrix) | latest-prd.md:32; understanding.md:54-67 |
| View detail with paginated contacts | All roles per matrix | latest-prd.md:35-46 |
| Download full validated contacts or original uploaded file | All roles per matrix | latest-prd.md:44 |
| Edit (creator only, name / sharing / reference ID) | Creator | latest-prd.md:48 |
| Soft delete (creator only) | Creator | latest-prd.md:45 |

## Module Dependencies

- **05-templates** — Contact group columns become template variables when groups are linked to templates. Warn user when linked CommChannel needs a field the group lacks (e.g. NationalID for Nabaa) (latest-prd.md:61-63).
- **App Settings** — Max upload file size is configurable per system (latest-prd.md:55; BR-CGM-04).
- **Permission module / PES** — Per-action gating (view/create/edit/share/delete/download) per `Contact Group Permissions` sheet (understanding.md:106).
- **Hierarchy module (01-account-management)** — Tab layout and list scoping depend on where the user is in the tree (understanding.md:107).
- **CommChannel & Services** — Alerts when linked channel needs a column the group lacks (understanding.md:108).
- **02-user-management** — User roster for the "Share With" picker.
