# Contact Group Module

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Contact-Group-Module.md`
**Length:** 457 lines · **Headings:** 62
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **dedicated Contact Group microservice** spec. Defines the **preview-first / direct-upload** architecture for ingesting CSV/XLSX recipient lists into Falcon: pre-signed-URL uploads (bypassing the backend for bytes), preview extraction, user column configuration, async import workers, sharing within account hierarchy, soft delete, recipient resolution for downstream channels.

## Key rules / decisions

### §1 Architecture style (`Contact-Group-Module.md:1-21`)

Dedicated microservice — **`falcon-core-contact-group-svc`** — with internal layers:
- **API Layer** — Controllers, request/response handling.
- **Application Layer** — Use cases and orchestration.
- **Domain Layer** — Entities and business rules.
- **Infrastructure Layer** — MongoDB, Object Storage, File Parsing.
- **Worker Layer** — Background import processing.

### §3.1-3.3 Core design principles (`…md:41-71`)

- **Preview-First Processing Model** — two phases: (1) fast upload + preview, (2) async import. Full file processing starts only after user confirmation.
- **Direct Upload (No Backend File Transfer)** — "The backend **never** receives file bytes." Files go directly UI → Object Storage using **pre-signed URLs**.
- **Separation of Responsibilities** — UI uploads; Service orchestrates + holds metadata; Object Storage persists; Worker parses + processes.

### §4-§6 Pre-signed URL pattern (`…md:73-143`)

- Time-limited (e.g. **5 minutes**, `expiresInSeconds: 300`).
- Operation-specific (PUT for upload, GET for download).
- Restricted to a single object.
- Cryptographically signed.

Sample response shape:
```json
{
  "uploadId": "up_1",
  "uploadUrl": "https://bucket.endpoint/...signed...",
  "bucket": "falcon-contactgroup-dev",
  "objectKey": "tenants/t1/contact-groups/temp/up_1/original/customers.xlsx",
  "expiresInSeconds": 300
}
```

### §7 Upload, Preview, Import flow (`…md:144-283`)

1. UI requests upload session.
2. Service returns object key + pre-signed URL.
3. UI uploads directly to Object Storage.
4. UI confirms upload completion.
5. Service reads **only header row + first 5 rows** for preview.
6. Service stores preview session.
7. UI shows preview.
8. User confirms headers, assigns aliases, ignores columns, configures sharing, submits.
9. Service creates final `groupId`; copies temp object → final object; deletes temp.
10. Service creates `ContactGroup(status=Processing)`, marks preview session as `Consumed`, publishes import job to Queue.
11. Worker streams file from Object Storage; applies aliases + ignore rules; validates + bulk-inserts in batches; marks group `Ready` or `Failed`.

### §7.2.1 Temporary upload path (`…md:210-218`)

`tenants/{tenantId}/contact-groups/temp/{uploadId}/original/{fileName}`

### §7.4.1 Final object path (`…md:230-247`)

`tenants/{tenantId}/contact-groups/{groupId}/original/{fileName}`
`tenants/{tenantId}/contact-groups/{groupId}/validated/{fileName}`

### §8 Large file handling (`…md:285-296`)

- Direct upload to object storage.
- Asynchronous import.
- Streaming parsing.
- Batched MongoDB writes.
- Batch size: **500 to 2000 rows**.

### §9 Data model — MongoDB collections (`…md:313-527`)

- **`contact_group_upload_sessions`** — Upload preview sessions (temporary; TTL-expired).
- **`contact_groups`** — Reusable contact groups.
- **`contact_group_contacts`** — Imported contact records.
- **`contact_group_import_jobs`** — Async job tracking.

Upload session lifecycle states: `Created → Uploaded → PreviewReady → Consumed | Expired`.

Mandatory indexes (`…md:506-527`):
- `contact_group_upload_sessions`: `(tenantId, uploadedByUserId, createdAt desc)`, `(expiresAt)` TTL index.
- `contact_groups`: `(tenantId, accountId, nodeId, createdAt desc)`, `(tenantId, createdByUserId, createdAt desc)`, `(tenantId, deleted.isDeleted, createdAt desc)`.
- `contact_group_contacts`: `(tenantId, groupId, rowNumber)`, `(tenantId, groupId, validation.status)`.
- `contact_group_import_jobs`: `(tenantId, groupId, startedAt desc)`.

### §9.8 Cleanup worker (`…md:528-549`)

Scheduled worker removes expired upload preview sessions + temp files:
1. Locate temp object in object storage.
2. Delete temp object.
3. Mark session as `Expired` or remove from MongoDB.
4. Write logs + metrics.

### §10 Object storage design (`…md:551-569`)

- Separate buckets per environment: `falcon-contactgroup-qc`, `falcon-contactgroup-prod`.
- Key structures (final + temp paths above).

### §11 Authorization model (`…md:571-589`)

| Role | Capabilities |
|---|---|
| **Falcon User** | read-only; can view deleted groups |
| **Account Owner / Admin** | create, share, view hierarchy |
| **Normal User** | create own, view shared, edit own only |

## Diagrams / images referenced

- `mermaid-diagram%20(2)-990a244e-…png` — Upload/Preview sequence diagram.
- `mermaid-diagram%20(5)-fe34fc4a-…png` — Import sequence diagram.

## Cross-references

- Authorization uses the model from `Permissions-&-Authorization-Module-…md` (PBAC).
- Pre-signed URL pattern referenced by `Front%2DEnd-Architecture.md` micro-app context (when micro-apps need uploads).

## Implications for code

**Verified against code:**
- `falcon-core-contact-group-svc` exists ✓.
- Single-project shape (Api project with `Application/`, `Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/` folders) — does NOT match the "5 csproj" Clean Architecture rule (fallback §1.2). **Soft drift** — but the wiki Contact-Group module §1 says "internal layers" not "internal projects," so single-csproj may be acceptable here.
- `AWSSDK.S3` referenced in csproj (fallback §5.5) ✓ — matches object-storage design.
- Hangfire + Hangfire.Mongo referenced (fallback §5.4) — likely powers the cleanup worker §9.8 / import worker §7.4.
- FastEndpoints used for `…\Endpoints\ContactGroups\*Endpoint.cs` + `…\Endpoints\Uploads\*Endpoint.cs` (fallback §4.2). Endpoint style is FastEndpoints — wiki is silent on this choice.

**Conflicts / open items:**

1. **`X-MicroApp-Key` header validation** (`Security-Architecture.md` §4.2.6 #2) — does Contact Group enforce dual-credential? Unverified.
2. **Collection naming** — wiki §9 uses snake_case (`contact_group_upload_sessions`, `contact_groups`, `contact_group_contacts`, `contact_group_import_jobs`). Verify code matches.
3. **MongoDB database name** — should be `falcon_core_contactgroup_db` per `Design-Patterns-&-Guidelines.md`. Currently likely `FalconContactGroupDB` (PascalCase, per Commerce pattern). **Naming drift.**
4. **`uploadSessionId` → `previewId`** — wiki API examples conflate the two; verify endpoint signatures use a consistent term.
5. **Authorization model integration** — `Falcon User / Account Owner / Admin / Normal User` (§11) needs PBAC policy rules in `falcon-core-access-svc`. No evidence of policy seeding documented yet.
6. **Indexes not verified** — confirm `(expiresAt)` TTL index exists on `contact_group_upload_sessions`.
7. **Cleanup worker** — confirm Hangfire job schedule + retention threshold matches §9.8.
