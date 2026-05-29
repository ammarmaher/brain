*** Create Contact Group — Overview ***
*** 2026-05-18 ***

# Create Contact Group — Overview

> 4-stage wizard for creating a contact group. Uses an UploadSession FSM with pre-signed URL pattern for direct browser→S3 uploads. Only client usertypes (AO/NA/NU) can create; Falcon usertypes are view-only (BR-CGM-13).

## Source-of-truth

- [PRD] PRD-04 BUSINESS_RULES · `Brain Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md` (BR-CGM-01..XX)
- [PRD] PRD-04 ENTITIES (UploadSession entity)
- [BRAIN-OUT] Contact Group ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md` (UploadEndpointGroup + standalone upload-config)

## Trigger / entry

- **Page:** Management Console → Contact Groups → "+ Create Contact Group"
- **Route:** TBD (e.g. `/contact-groups/new`)
- **Precondition:** Client usertype · `FalconAccess.contactGroup.create()` PES

## The 4 stages

| Stage | Title | Endpoint | Outcome |
|---|---|---|---|
| 1 | Upload | `POST /api/contact-groups/uploads/init` → PUT to S3 → `POST /api/contact-groups/uploads/{uploadId}/complete` | UploadSession + preview rows + detected columns |
| 2 | Column Config | (FE-local) | User reviews/edits column names, picks headers row |
| 3 | Preview | (FE-local, optional re-fetch via `GET /uploads/{id}/preview`) | First 5 rows displayed |
| 4 | Naming + Share | `POST /api/contact-groups` | Commit — UploadSession → Committed; new ContactGroup created |

## Upload session FSM

```
              ┌─────────────────┐
              │ (no session)    │
              └────────┬────────┘
                       │ POST /uploads/init
                       ▼
              ┌─────────────────┐
              │      Init       │  ← pre-signed URL returned
              └────────┬────────┘
                       │ user uploads to S3 directly
                       │ POST /uploads/{id}/complete
                       ▼
              ┌─────────────────┐
              │    Complete     │  ← preview + columns derived
              └──────┬──────┬───┘
              POST   │      │ no commit within TTL
              /contact-groups│ (e.g. 24h)
                     │      ▼
                     │  ┌─────────────────┐
                     │  │   Abandoned     │
                     │  └─────────────────┘
                     ▼
              ┌─────────────────┐
              │   Committed     │  ← persistent ContactGroup created
              └─────────────────┘
```

[PRD] understanding.md re UploadSession lifecycle.

## Sequence

```
Client user (AO/NA/NU)
   │
   ▼
Click "+ Create Contact Group"
   │
   ▼
[Wizard opens]
   │
   ▼
Stage 1 — Upload
   │
   ├─► GET /api/contact-groups/upload-config (max size, allowed exts, preview row count)
   │
   │ User picks file
   │
   ├─► POST /api/contact-groups/uploads/init { FileName, ContentType, FileSizeBytes }
   │     → returns { uploadId, presignedUrl }
   │
   │ Browser PUT to presignedUrl (direct to S3)
   │
   ├─► POST /api/contact-groups/uploads/{uploadId}/complete
   │     → returns { previewRows, detectedColumns, hasHeader }
   │
   ▼
Stage 2 — Column Config
   │ User toggles hasHeader, edits column names per BR-CGM-06 rules
   │
   ▼
Stage 3 — Preview (display first 5 rows)
   │
   ▼
Stage 4 — Naming + Share
   │ User enters name, optional refId, optional share-policy
   │
   ├─► POST /api/contact-groups { uploadSessionId, name, referenceId, hasHeader, columnConfig, sharePolicy }
   │     → ContactGroup created, UploadSession → Committed
   │
   ▼
On success → emit Kafka event → close wizard → navigate to detail page
```

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) · [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)

## Hubs

[[Create Contact Group Flow]] · [[Contact Groups List]] · [[04 Contact Group Management]] · [[Contact Group Service]]
