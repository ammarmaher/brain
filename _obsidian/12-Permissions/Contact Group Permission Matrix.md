---
type: permission-matrix
matrix-name: Contact Group Permission Matrix
prd: PRD-04
sheet-source: Contact Group Permission Matrix
fully-captured: true
created: 2026-05-15
---
*** Permission Matrix — Contact Groups (Falcon view-only + Client roles × CRUD/share/download) ***
*** SoT: Brain Outputs/prd/modules/04-contact-group-management/understanding.md (Permission matrix) ***
*** Created 2026-05-15 by Brain SK Phase 2B permission-matrix install ***

# Contact Group Permission Matrix

> The Google Sheet **`Contact Group Permissions`** is the **authoritative source** for who can do what to a Contact Group. The matrix crosses **6 effective roles** (3 Falcon usertypes — view-only; 3 Client roles × {creator, not-creator}) with **7 actions** (View, Create, Edit, Share, Delete, Download CG, Download Original Uploaded File). Single tab — **fully captured** in PRD-04 `understanding.md`. PRD prose is consistent with the sheet here.

## Source-of-truth pointer

- **Captured matrix:** [`understanding.md` — Permission matrix section](../../../Brain%20Outputs/prd/modules/04-contact-group-management/understanding.md) (table verbatim from sheet)
- **PRD body context:** [`latest-prd.md`](../../../Brain%20Outputs/prd/modules/04-contact-group-management/latest-prd.md)
- **Original Drive sheet name:** `Contact Group Permissions` (Google Sheet)
- **Drive folder:** `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`

## Sheet shape

| Column | Meaning |
|---|---|
| `Role` | One of 9 effective rows (3 Falcon view-only + 3 Client × {creator, not-creator}) |
| `View Details` | Can open the group detail view |
| `Create` | Can run the Create Contact Group wizard |
| `Edit` | Can edit Name / Shared With / Reference ID (other fields read-only) |
| `Share` | Can manage the Shared With list |
| `Delete` | Can soft-delete the group |
| `Download CG` | Can download the validated CSV (post-upload-parsed) |
| `Download Original Uploaded File` | Can download the raw file as uploaded |

Cell values are `Y` (allowed) / `N` (not allowed). No `Deny` semantics — this matrix is a flat allow-list.

## Full matrix (verbatim from `Contact Group Permissions` sheet)

| Role | View | Create | Edit | Share | Delete | Download CG | Download Original |
|---|---|---|---|---|---|---|---|
| Falcon System Admin | Y | N | N | N | N | Y | Y |
| Falcon Product | Y | N | N | N | N | Y | Y |
| Falcon Operation | Y | N | N | N | N | Y | Y |
| Client AO — creator | Y | Y | Y | Y | Y | Y | Y |
| Client AO — not creator | Y | Y | N | Y | N | Y | Y |
| Client Node Admin — creator | Y | Y | Y | Y | Y | Y | Y |
| Client Node Admin — not creator | Y | Y | N | Y | N | Y | Y |
| Client Normal User — creator | Y | Y | Y | Y | Y | Y | Y |
| Client Normal User — not creator | Y | Y | N | N | N | Y | Y |

### Reading notes

- **Falcon usertypes** (System Admin, Product, Operation) are **view-only**. They can never create / edit / share / delete — they can only view groups and download both file variants. This is the central rule of the module.
- **"Not creator" Account Owners and Node Admins** retain `Share` (they can re-share groups under their hierarchy) but lose `Edit` and `Delete`. Only the original creator can mutate the group record.
- **"Not creator" Normal Users** cannot share — they only consume groups shared with them.
- **Soft delete:** "Delete" cells = Y means the user can trigger soft-delete; Falcon usertypes still see soft-deleted records and can download them.

## Capture quality

- **Tab 1 ✅** — fully captured verbatim in [`understanding.md`](../../../Brain%20Outputs/prd/modules/04-contact-group-management/understanding.md) lines 56–66.
- **Single-tab sheet** — no Tab 2 gap (unlike the Falcon Roles matrix).
- **PRD prose consistency** — confirmed against PRD-04 `latest-prd.md` (lines 22–26 Roles section). Note one open clarification flagged in `understanding.md`: when a "creator" Normal User's permissions are evaluated, the **Create** column is `Y` and the **Share** column is `Y` — share retention post-creation is consistent with the sheet, despite ambiguous PRD prose elsewhere.

## Backend enforcement

| Service | Role |
|---|---|
| [[Contact Group Service]] | Owns `ContactGroup`, `SharePolicy`, and `UploadSession`. Applies the matrix in command handlers and list-query filters. |
| [[Access PES Service]] | Final decision point. Contact Group Service delegates `Evaluate(AuthRequest)` to PES for each action; PES holds the policy rules built from this sheet. |
| [[Identity Service]] | Resolves the calling user's usertype + role (Falcon vs Client; AO / NA / NU) and "creator" flag (User.id == ContactGroup.createdBy). |

## PRDs that cite this matrix

- [[04 Contact Group Management]] — **owner** of the sheet. Permission matrix section.
- [[02 User Management]] — defines the **6 effective roles** (3 Falcon × 3 Client) that this matrix references.

## Pages gated by this matrix

_Frontend pending — Story 115329 (see PRD-04 GAPS)._

When the frontend ships, the gated pages will be:

- Contact Groups list (own node)
- Contact Groups list (sub-node under AO/NA hierarchy)
- Create Contact Group wizard (4 steps)
- Contact Group detail view
- Share / Edit / Download dialogs
- Falcon usertype list (Main-node selection, view-only)

Until those pages exist as vault notes under `10-Pages/`, this matrix is referenced from PRD-04 and the Contact Group Service only.

## Validation tie-in

Permission gating runs **before** validation:

- View action gated → list query filtered server-side; client never sees forbidden records.
- Create gated → button hidden; backend rejects `POST /contact-groups`.
- Edit / Share / Delete gated per-record at PES — the three-dots menu hides actions the user can't perform.
- Download CG / Download Original — both gated identically; either both `Y` or both follow Falcon view-only rules.

## Tags

#type/permission-matrix #prd/02 #prd/04 #service/access #service/contact-group #service/identity #gap

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]]
