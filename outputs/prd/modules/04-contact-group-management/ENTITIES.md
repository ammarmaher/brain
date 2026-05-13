*** PRD Understanding - Contact Group Management - ENTITIES ***

# 04-contact-group-management - Domain Entities

> Inferred from `latest-prd.md` + `understanding.md` + `Contact Group Permissions` sheet.

| Entity | Description | Key Fields | Lifecycle Status | Relationships |
|---|---|---|---|---|
| ContactGroup | A named list of recipients, owned by a single creator, stored under a specific node in the hierarchy. | contactId (auto, immutable), name (<=50), referenceId?, createdBy (userId), createdAt, uploadedCount, status, sharedWith[], originalFileRef, validatedFileRef, nodeId, tenantId, softDeleted (bool) | `In Progress` -> `Completed`. Soft-delete flips a flag (no Deleted status). | N:1 Node; N:1 Creator (User); 1:N ContactGroupColumn; 1:N ContactGroupRecord; 1:N SharePolicy entries |
| ContactGroupColumn | One column in the parsed file (named after the file header or auto-named when header absent). | groupId, index, name (EN letters, no special, <=20, spaces->_), ignored? (if user de-selected) | n/a | N:1 ContactGroup |
| ContactGroupRecord | One row of contacts (key = column name -> value). | groupId, rowIndex, fields { columnName: value, ... } | n/a | N:1 ContactGroup |
| SharePolicy | Describes who can use the group beyond the creator. | groupId, sharedWithAllUsers (bool), sharedUserIds[] (Normal User IDs) | n/a | N:1 ContactGroup; N:M User |
| UploadSession | Pre-create scratch space for the file before commit. | uploadId, fileName, contentType, fileSizeBytes, expiresAt, hasHeader, detectedColumns[], previewRows[][] | Init -> Complete -> Used / Abandoned | N:0..1 ContactGroup (when committed) |
| AppSetting (shared with 02-user-management) | Max file size, allowed extensions, preview row count. | maxFileSizeMB, allowedExtensions[] (`csv`, `xls`, `xlsx`), previewRowCount | n/a | Singleton |

## Relationship summary

```
Node (01) ──┐
            └─ ContactGroup × N
                 ├─ ContactGroupColumn × N
                 ├─ ContactGroupRecord × N
                 ├─ SharePolicy (1:0..1, with N user refs)
                 └─ File references → S3 (per backend ENDPOINT_REGISTRY notes: pre-signed URLs)
```

## Status enumeration

- **ContactGroup.status**: `In Progress`, `Completed` (BR-CGM-29).
- **UploadSession state** (inferred): `Initialized`, `Completed`, `Abandoned`, `Expired`.
- **FileType** (download): `original`, `validated` (per Contact Group `GET .../files/{fileType}`).

## Cardinality notes

- A user can be a creator of MANY groups (1:N User -> ContactGroup).
- A user can be a sharer-target of MANY groups (M:N via SharePolicy.sharedUserIds).
- `sharedWithAllUsers = true` is a shorthand for "all Normal Users in the same hierarchy scope as the creator".

## Audit + soft-delete

- `softDeleted` is a flag, not a status. The group is hidden from client side but Falcon usertype can still view + download (BR-CGM-28).
- No hard delete observed in PRD or current ENDPOINT_REGISTRY.

## Column rules (BR-CGM-06 in tabular form)

| Constraint | Value |
|---|---|
| Allowed chars | English letters (a-z, A-Z) |
| Numbers | Not allowed (PRD says "EN letters only") |
| Special chars | Not allowed |
| Spaces | Auto-converted to `_` |
| Max length | <=20 chars |
| Uniqueness | No duplicates within a group |
