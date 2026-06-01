---
type: entity-reconciliation
entity: contact-group
prd: PRD-04
service: contact-group
drift-count: 19
created: 2026-05-15
---
*** Entity Reconciliation E-contact-group — ContactGroup ***
*** PRD: PRD-04 Contact Group Management · Backend service: contact-group · 2026-05-15 ***

# E-contact-group — ContactGroup

> A named list of recipients owned by a single Client-side creator (AO / Node Admin / Normal User), stored under a specific node in the hierarchy. Used by Normal Users for sending transactions. Falcon usertypes are view-only. Soft-deleted groups stay downloadable by Falcon but are hidden from clients. Backend service is the primary system of record and exposes 12 endpoints across `/api/contact-groups/*` and `/api/contact-groups/uploads/*`.

## PRD definition (business-conceptual)

- **PRD module:** [[04 Contact Group Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/04-contact-group-management/ENTITIES.md)
- **PRD fields:**
  - `contactId`: auto, immutable
  - `name`: string, `<=50`
  - `referenceId?`: optional external reference
  - `createdBy`: userId
  - `createdAt`: auto
  - `uploadedCount`: derived
  - `status`: `In Progress | Completed` (BR-CGM-29)
  - `sharedWith[]`: list of user ids
  - `originalFileRef`: S3 ref to uploaded file
  - `validatedFileRef`: S3 ref to validated/normalized file
  - `nodeId`: ref → Node (01)
  - `tenantId`: ref → Tenant
  - `softDeleted` (bool): flag, not status (BR-CGM-28)

## Backend DTO mapping

- **Service:** [[Contact Group Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md)
- **Relevant DTOs (request):**
  - `CreateContactGroupRequest` — `POST /contact-groups`
  - `ListContactGroupsRequest` — `GET /contact-groups`
  - `ListSharedContactGroupsRequest` — `GET /contact-groups/shared`
  - `GetContactGroupDetailsRequest` — `GET /contact-groups/{groupId}`
  - `UpdateContactGroupRequest` — `PATCH /contact-groups/{groupId}`
  - `ShareContactGroupRequest` — `PATCH /contact-groups/{groupId}/share`
  - `DeleteContactGroupRequest` — `DELETE /contact-groups/{groupId}`
  - `BrowseContactGroupContactsRequest` — `GET /contact-groups/{groupId}/contacts`
  - `GetFileDownloadUrlRequest` — `GET /contact-groups/{groupId}/files/{fileType}`
- **Relevant DTOs (response):**
  - `CreateContactGroupResponse` — `{ GroupId, …diagnostic counters }`
  - `ContactGroupListItemDto` — `{ GroupId, Name, ReferenceId, CreatedAt, RowCount, Status, IsShared, … }`
  - `GetContactGroupDetailsResponse` — full details (name, share policy, columns, statistics, file availability flags)
  - `GetFileDownloadUrlResponse` — `{ DownloadUrl, FileName, ExpiresInSeconds }`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `contactId` (auto, immutable) | `GroupId` (CreateContactGroupResponse, ContactGroupListItemDto, request routes) | opaque → `string` | ⚠ naming drift — PRD calls it `contactId`, backend calls it `GroupId`. Same concept |
| `name` (`<=50`) | `Name` (CreateContactGroupRequest, UpdateContactGroupRequest, ContactGroupListItemDto) | string `<=50` → `string`, FluentValidation `NotEmpty + MaximumLength(ContactGroupRules.NameMaxLength) + Matches(ContactGroupRules.NamePattern)` | ✅ match on cap (assuming `NameMaxLength=50`; literal not in VALIDATIONS.md — see [[V-contact-group-name-required-format]]). ⚠ FE must mirror `NamePattern` via shared-constants file |
| `referenceId?` | `ReferenceId?` (CreateContactGroupRequest, UpdateContactGroupRequest, ContactGroupListItemDto) | optional string → nullable `string` | ✅ match |
| `createdBy` (userId) | _not on response DTOs documented_ | ref → likely from JWT, not echoed | ⚠ drift — DTO_DICTIONARY does not enumerate `CreatedBy` on response DTOs (`GetContactGroupDetailsResponse` inferred to carry it but unconfirmed). The `BR-CGM-08` creator-only-edit gate relies on this; must verify |
| `createdAt` (auto) | `CreatedAt` (ContactGroupListItemDto) | datetime → `DateTime` | ✅ match |
| `uploadedCount` (derived) | `RowCount` (ContactGroupListItemDto) | derived int → `int` | ⚠ naming drift — PRD `uploadedCount` ↔ backend `RowCount`. Same concept |
| `status` (`In Progress \| Completed`) | `Status` (ContactGroupListItemDto) | 2-state enum → (verify enum type) | ✅ match per BR-CGM-29. ⚠ GAP-CGM-26 — PRD silent on a `Failed` status that backend may need |
| `sharedWith[]` | `IsShared` (ContactGroupListItemDto) + `SharePolicy` on `GetContactGroupDetailsResponse` | list → `bool + SharePolicy` | ⚠ drift — backend list response gives only `IsShared` (boolean). Detailed `SharedUserIds[]` only available on details endpoint. FE must dual-fetch |
| `originalFileRef` | `GetFileDownloadUrlRequest.FileType="original"` → `GetFileDownloadUrlResponse.DownloadUrl` | S3 ref → pre-signed URL | ⚠ drift — PRD models a persistent ref; backend exposes an **ephemeral pre-signed URL** (with `ExpiresInSeconds`). FE must not cache |
| `validatedFileRef` | `GetFileDownloadUrlRequest.FileType="validated"` → `GetFileDownloadUrlResponse.DownloadUrl` | S3 ref → pre-signed URL | ⚠ same drift as `originalFileRef` |
| `nodeId` (ref → Node) | `NodeId?` on `ListContactGroupsRequest` | ref → nullable `string` | ⚠ drift — backend treats `NodeId` as a list-filter on the request side; not enumerated as a field on `ContactGroupListItemDto`. `NodeIdRequiredForFalconUser` error code implies the field is read-side material but the response shape doesn't show it |
| `tenantId` (ref → Tenant) | _implicit — read from JWT_ | ref → from `X-Tenant-Id` gateway-injected header | ⚠ drift — backend does not surface `tenantId` on response DTOs. `TenantIdMissing` error code shows it's load-bearing internally |
| `softDeleted` (bool, BR-CGM-28) | _not on response DTOs documented_ | bool → not surfaced | ❌ likely missing on response side. Backend has `DeleteContactGroupRequest` which (per BR-CGM-28) sets the flag, but the response/list DTOs don't show a `SoftDeleted`/`IsDeleted` indicator. **Falcon-side download-deleted UI needs this** |
| _PRD silent_ | `UploadSessionId` (CreateContactGroupRequest) | _PRD models upload as pre-flow_ | ➕ extra — backend create DTO requires linking to a prior `UploadSession`. See [[E-upload-session]] |
| _PRD silent_ | `HasHeader` (CreateContactGroupRequest) | _PRD covered under workflow_ | ➕ extra on request — whether the uploaded file has a header row |
| _PRD silent_ | `ColumnConfig` (CreateContactGroupRequest) | _PRD models as `ContactGroupColumn`_ | ➕ extra — backend nests column metadata inline at create-time (PRD treats columns as separate entity) |
| _PRD silent_ | `SharePolicy` (CreateContactGroupRequest) — `{ SharedWithAllUsers: bool, SharedUserIds[]: string[] }` | _PRD models as separate `SharePolicy` entity_ | ➕ extra on create DTO — see [[V-contact-group-share-policy-mode-mutex]] for the "silent drop" gap |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ Naming drift — PRD `contactId` ↔ backend `GroupId`; PRD `uploadedCount` ↔ backend `RowCount`
- ⚠ Symbolic constraint — `ContactGroupRules.NameMaxLength` and `ContactGroupRules.NamePattern` are referenced in VALIDATIONS but literal values not documented. FE must mirror via shared-constants. See [[V-contact-group-name-required-format]]
- ⚠ Persistent ref vs pre-signed URL — PRD models `originalFileRef` / `validatedFileRef` as stable refs; backend exposes only ephemeral URLs via `GetFileDownloadUrlResponse` with TTL
- ⚠ `sharedWith[]` collapsed to `IsShared: bool` on list responses — detail-level needs a separate fetch
- ❌ `softDeleted` flag not surfaced on response DTOs — Falcon view-only "see deleted groups" UI (BR-CGM-28) currently has no obvious binding. Likely a backend gap to surface this on `GetContactGroupDetailsResponse`
- ❌ `createdBy` / `tenantId` / `nodeId` not enumerated on response DTOs in DTO_DICTIONARY — DTO_DICTIONARY uses inferred shape for several fields. Verify against source
- ❌ Failed-status missing (GAP-CGM-26) — backend `Status` enum may need a third value
- ➕ Backend `UploadSessionId`-driven creation pattern — PRD has the upload pre-flow but doesn't model the session join explicitly on the create call. See [[E-upload-session]]
- ➕ `SharePolicy` nested on create / update DTOs — PRD models SharePolicy as a separate entity with relationship; backend treats it as an inline value object on the ContactGroup request

## Related validation rules (V-rule notes)

- [[V-contact-group-name-required-format]] — `Name` `NotEmpty + MaximumLength + Matches`
- [[V-contact-group-file-type-allowlist]] — file extension allowlist applied during upload
- [[V-contact-group-file-size-cap]] — file size cap applied during upload
- [[V-contact-group-column-name-shape]] — column-name rules (per BR-CGM-06)
- [[V-contact-group-share-policy-mode-mutex]] — share-policy mode mutex (silent-drop gap)

## Pages using this entity

_frontend pending Story 115329_ — Contact Groups list (own node), Contact Groups list (sub-node), Create Contact Group wizard, Share / Edit / Download dialogs are listed in [[04 Contact Group Management]] but no `10-Pages/` seed yet.

## Cross-service touches

- **Templates** (cross-cuts PRD-05) — Contact Group columns become Template variables when a group is linked to a template. See [[05 Templates]] ENTITIES.md `TemplateVariable.contactGroupColumnName` relation.
- **Access PES** — share policy gating cross-checks with the Access service; sharing rules read tenant + node hierarchy.
- **Identity** — `IdentityServiceError` / `IdentityServiceConnectionError` / `IdentityServiceTimeout` errors surface when resolving `SharedUserIds[]` against Identity.
- **Kafka:** Contact Group produces `contactgroup.import-requested.v1` for downstream consumers.

## Tags

#type/e-entity #prd/04 #prd/05 #service/contact-group #severity/high #drift #gap #security

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
