---
type: per-module-conclusion-knowledge
volume: 37
module: 04-contact-group-management
title: "Module 04 — Contact Group Management CONCLUSION KNOWLEDGE"
purpose: "Master answer key for everything related to contact groups, uploads, columns, sharing, soft-delete."
authority: "CANONICAL for Module 04 — supersedes earlier volumes on conflict"
prd-source: "Contact Group Management Module_V2 (Drive sync 2026-04-24) + Contact Group Permissions sheet"
---

# Module 04 — Contact Group Management CONCLUSION

> Master answer key for: contact group creation, file upload (CSV/XLS/XLSX), column configuration, sharing semantics, soft-delete, role-based actions, view tabs, list columns, edit constraints.

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **Contact Group Management owns structured lists of recipients (Contact Groups) created exclusively by Client user types (Account Owner, Node Admin, Normal User) — Falcon usertypes are view-only (BR-CGM-13). Groups are uploaded as CSV/XLS/XLSX files (size capped by App Settings; default unstated — BR-CGM-30 OPEN), with columns named in English letters only (no numbers/special, ≤20 chars, spaces→underscores per BR-CGM-06). Column values become template variables when groups are linked to templates (cross-cut to 05-Templates). Content is NOT validated beyond parsing (BR-CGM-08) — whatever the user uploads is accepted. Sharing semantics differ by role: AO/NA can share groups (own or others in hierarchy); Normal Users CANNOT share even their own (BR-CGM-12). View tabs differ: AO/NA on own node see 1 tab; NU on own node sees 2 (own + Shared); Falcon must select Main node first and sees 1 tab plus soft-deleted groups. Edit is creator-only (Name/SharedWith/ReferenceID); Contact ID, Creation Date, Status, and the contact table itself are read-only (BR-CGM-26). Delete is soft (BR-CGM-28) — hidden from clients but downloadable by Falcon usertype. Status enum is `{In Progress, Completed}` (BR-CGM-29) — no Failed status in current PRD. Edits propagate to all shared versions (single SoT per BR-CGM-27).**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities (per [BRAIN-OUT] `prd/modules/04-contact-group-management/ENTITIES.md`)

| Entity | Key fields | Lifecycle |
|---|---|---|
| **ContactGroup** | contactId (auto, immutable), name (≤50), referenceId, createdBy, createdAt, uploadedCount, status, sharedWith[], originalFileRef, validatedFileRef, nodeId, tenantId, softDeleted (flag) | In Progress → Completed |
| **ContactGroupColumn** | groupId, index, name (EN letters, no special, ≤20, unique), ignored? | n/a |
| **ContactGroupRecord** | groupId, rowIndex, fields {columnName: value} | n/a |
| **SharePolicy** | groupId, sharedWithAllUsers (bool), sharedUserIds[] (NU IDs) | n/a |
| **UploadSession** | uploadId, fileName, contentType, fileSizeBytes, expiresAt, hasHeader, detectedColumns[], previewRows[][] | Init → Complete → Used/Abandoned |
| **AppSetting (shared with 02)** | maxFileSizeMB, allowedExtensions[] (csv, xls, xlsx), previewRowCount | Singleton |

### Status enums

- **ContactGroup.status:** In Progress, Completed (BR-CGM-29 — no Failed status)
- **UploadSession state (inferred):** Initialized, Completed, Abandoned, Expired
- **FileType (download):** original, validated

---

## §3 — WORKFLOWS

### W1 — Create Contact Group (upload + columns + share)
**Steps:** File upload → column configuration → preview → optional sharing → commit
**Status:** ✅ MINED — `understanding/pages/create-contact-group/` (Wave 4)
**Note:** Wizard is **management-console ONLY** — admin-console has list/edit/detail but NOT the creation wizard

### W2 — View Contact Groups (list)
**Per [BRAIN-OUT] `understanding/pages/contact-groups-list/`** (Wave 4)
**Tab visibility:** Per role + node location
**Status:** ✅ MINED

### W3 — Edit Contact Group (creator only)
**Editable fields:** Name, SharedWith, ReferenceId
**Read-only:** Contact ID, Creation Date, Status, contact table
**Status:** ✅ Implementation present (BR-CGM-26)

### W4 — Share Contact Group
**Actors:** AO + NA (creator OR not); NU only if creator
**Scope:** Same hierarchy
**Status:** ✅ Implementation present (BR-CGM-09/10/11/12)

### W5 — Delete Contact Group (soft-delete, creator only)
**Behavior:** Hidden from clients but downloadable by Falcon
**Status:** ✅ Implementation present (BR-CGM-28)

### W6 — Download Contact Group File
**Types:** original (as uploaded) OR validated (after column normalization)
**Endpoint:** `GET /api/contact-groups/{id}/files/{fileType}`
**Status:** ✅ Implementation present

---

## §4 — BUSINESS RULES (29 confirmed + 9 OPEN)

### Identity & Naming (BR-CGM-01..03)
- Contact ID auto-generated immutable
- Group Name ≤50 mandatory
- Reference ID optional

### Upload & File Validation (BR-CGM-04..08)
- File types: CSV / XLS / XLSX (BR-CGM-04)
- Size capped by App Settings (default unstated — BR-CGM-30 OPEN)
- First row header toggle (BR-CGM-05)
- Column names: EN letters only · no duplicates · no special chars · ≤20 chars · spaces→underscore (BR-CGM-06)
- Preview: first 5 rows (BR-CGM-07)
- File CONTENT NOT validated beyond parsing (BR-CGM-08)

### Sharing (BR-CGM-09..12)
- Share Step optional → pick Normal Users OR "All Users" (BR-CGM-09)
- Sharing scope: NU in same account (BR-CGM-10)
- AO + NA can share own AND others in hierarchy (BR-CGM-11)
- **NU CANNOT share even own groups** (BR-CGM-12)

### Permission Matrix (BR-CGM-13..19)
- Falcon usertype: View Y, Create N, Edit N, Share N, Delete N, Downloads Y (BR-CGM-13)
- AO creator: all Y (BR-CGM-14)
- AO non-creator: View Y, Create Y, Edit N, Share Y, Delete N, Downloads Y (BR-CGM-15)
- NA creator/non-creator: similar to AO with sub-tree scope (BR-CGM-16/17)
- NU creator: all Y EXCEPT Share (BR-CGM-12)
- NU non-creator: View Y (Shared Groups tab), Create Y, Edit N, Share N, Delete N, Downloads Y

### View Tabs (BR-CGM-20..23)
- AO/NA own node: 1 tab "Contact Groups"
- NU own node: 2 tabs "Contact Groups" + "Shared Groups"
- AO/NA sub-node hierarchy: 1 tab
- Falcon usertype: must select Main node first; 1 tab; view-only; can see soft-deleted

### List Columns (BR-CGM-24..25)
- Contact ID + Name + Reference ID + Created By (empty when creator) + Creation Date + Uploaded Count + Status + Shared With (collapsed `+N`) + Actions
- Uploaded Count frozen at upload time (no edit-list capability)

### Edit & Delete (BR-CGM-26..28)
- Edit (creator only): Name / Shared / ReferenceId editable; rest read-only
- Edits propagate to all shared versions (BR-CGM-27)
- Delete is soft (BR-CGM-28); Falcon view+download retained

### Status (BR-CGM-29)
- {In Progress, Completed} — no Failed status

### OPEN questions
- **BR-CGM-30** [OPEN] — App Settings default file size
- **BR-CGM-31** [OPEN] — Re-parsing vs snapshot semantics
- **BR-CGM-32** [OPEN] — Behavior when shared-with NU is deleted
- **BR-CGM-33** [OPEN] — "+N" collapsing threshold
- **BR-CGM-34** [OPEN] — "Failed" status on parse error
- **BR-CGM-35** [OPEN] — Hierarchy depth visibility
- **BR-CGM-36** [OPEN] — Behavior when creator's account is Deleted
- **BR-CGM-37** [OPEN] — "First row is the header" toggle post-edit-of-names
- **BR-CGM-38** [OPEN] — Self-sharing prevention

---

## §5 — PERMISSIONS MATRIX (Module 04 specific)

| Action | Falcon (SA/OP/PR) | AO creator | AO non-creator | NA creator | NA non-creator | NU creator | NU non-creator |
|---|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (shared only) |
| Create | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Share | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ (BR-CGM-12) | ❌ |
| Delete | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Download original | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Download validated | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| See soft-deleted | ✅ (Falcon-only) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## §6 — WHAT'S IMPLEMENTED (verified)

✅ **Contact-Group service** — backend with 6 service-level dossier files (Wave initial)
✅ **admin-console contact-groups page** — list + detail + edit (Wave 4)
✅ **management-console create wizard** — Add Contact Group wizard
✅ **File upload (CSV/XLS/XLSX)** — multipart
✅ **Column configuration with rules** (BR-CGM-06)
✅ **Share semantics with NU restriction** (BR-CGM-12)
✅ **Soft-delete + Falcon visibility** (BR-CGM-28)
✅ **Download original + validated files**
✅ **9 PES queries** documented for permission gates
✅ **Status: In Progress → Completed**
✅ **understanding/pages/contact-groups-list/** (Wave 4 — 14 files)
✅ **understanding/pages/create-contact-group/** (Wave 4 — 14 files)

---

## §7 — WHAT'S NOT IMPLEMENTED / OPEN GAPS

🟡 **App Settings max file size default UNSTATED** (BR-CGM-30 OPEN)
🟡 **"Failed" status on parse error NOT implemented** (BR-CGM-34 OPEN) — PRD only has In Progress/Completed
🟡 **+N collapsing threshold UNDEFINED** (BR-CGM-33 OPEN)
🟡 **Behavior when shared-with NU is deleted UNCLEAR** (BR-CGM-32 OPEN)
🟡 **Hierarchy depth visibility UNCLEAR** (BR-CGM-35 OPEN) — does AO see groups 3+ levels deep?
🟡 **Self-sharing prevention NOT documented** (BR-CGM-38 OPEN) — UI should prevent
🟡 **Re-parsing vs snapshot semantics UNCLEAR** (BR-CGM-31 OPEN)
🟡 **Header toggle post-edit-of-names UNCLEAR** (BR-CGM-37 OPEN)
🟡 **Bulk operations NOT implemented** (Vol 10 design)
🟡 **Edit a row in the contact list** — not in PRD (uploadedCount frozen per BR-CGM-25)
🟡 **Export beyond CSV/XLS/XLSX** — not supported

---

## §8 — CROSS-MODULE DEPENDENCIES

| Direction | Flow |
|---|---|
| **04 → 01** | Contact Groups scoped to Nodes (hierarchy from PRD-01) |
| **04 → 02** | Created by Users; sharing requires user list lookups (Identity user-picker) |
| **04 → 05** | Columns become Template Variables (when Templates UI built) — cross-cut |
| **04 → Charging** | Contact Group recipient list feeds Send Transaction (PRD-03) |
| **04 → S3** | File references via pre-signed URLs per backend ENDPOINT_REGISTRY |
| **04 → PES** | 9 contact-group permission checks |

---

## §9 — TOP 10 BUSINESS QUESTIONS

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | Who can create a contact group? | Client users only (AO/NA/NU). Falcon usertype CANNOT create | BR-CGM-13 |
| 2 | What file types are accepted? | CSV, XLS, XLSX | BR-CGM-04 |
| 3 | What's the column name rule? | EN letters only, ≤20, no special/numbers, spaces→`_`, unique | BR-CGM-06 |
| 4 | Can a Normal User share a group? | NO — even own groups (BR-CGM-12) | BR-CGM-12 |
| 5 | Who can edit a group? | Creator only | BR-CGM-26 |
| 6 | What happens when deleted? | Soft-delete — hidden from clients but Falcon can view + download | BR-CGM-28 |
| 7 | Can edits propagate to shared versions? | YES — single source of truth | BR-CGM-27 |
| 8 | Is content validated? | NO — only parsing. Whatever uploaded is accepted | BR-CGM-08 |
| 9 | What's the file size limit? | Configurable via App Settings; default UNSTATED (BR-CGM-30 OPEN) | BR-CGM-30 |
| 10 | What status enum exists? | In Progress, Completed (no Failed — BR-CGM-34 OPEN) | BR-CGM-29 |

---

## §10 — MODULE 04 NEW INSTRUCTIONS

1. **Falcon NEVER creates contact groups** — view+download only (client business asset)
2. **NU cannot share** — even their own groups (BR-CGM-12 is non-negotiable)
3. **Soft-delete preserves audit** — Falcon retains visibility for compliance
4. **Column names = English ASCII only** — values can be Arabic, but column names are technical identifiers
5. **Edit propagates to all shared** — single SoT model; no cloning
6. **uploadedCount frozen** — cannot edit recipient list post-upload (must re-upload)
7. **Add file size default to App Settings** — close BR-CGM-30 OPEN
8. **Decide "Failed" status policy** — close BR-CGM-34 OPEN
9. **Self-share prevention** — UI-side check; document as part of BR-CGM-38 resolution
10. **Hierarchy depth visibility scope** — resolve BR-CGM-35 for sub-node visibility

---

## §11 — CROSS-LINKS

- [BRAIN-OUT] `prd/modules/04-contact-group-management/`
- [BRAIN-OUT] `understanding/pages/{contact-groups-list,create-contact-group}/`
- [BRAIN-OUT] `understanding/backend/contact-group/`
- [Atlas] Vol 28 Matrix 6 · Vol 7 Scenario 30 (data export)

---

*Vol 37 · Module 04 Contact Group Management CONCLUSION · 2026-05-18 · Truth-grounded · Source-prefixed.*
