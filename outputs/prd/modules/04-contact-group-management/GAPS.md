*** PRD Understanding - Contact Group Management - GAPS ***

# 04-contact-group-management - PRD vs Code Gaps

> Cross-references `Brain Outputs\understanding\backend\contact-group\ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md`. `latest-prd.md` is relative to this module.

## Coverage Matrix

| # | PRD Requirement | PRD Citation | Backend Code Location | Status |
|---|---|---|---|---|
| GAP-CGM-01 | Create Contact Group (4-step wizard with upload, configure, share, review) | latest-prd.md:29-34 (BR-CGM-01..09) | Contact Group `POST /api/contact-groups/uploads/init` -> `POST /api/contact-groups/uploads/{uploadId}/complete` -> `POST /api/contact-groups` (`CreateContactGroupRequest`) | COVERED |
| GAP-CGM-02 | Pre-create file upload via pre-signed S3 URL | (implied by flow) | Contact Group `InitUploadResponse { UploadId, PreSignedUrl, ExpiresInSeconds, MaxFileSizeMB }` | COVERED |
| GAP-CGM-03 | Group Name <=50, mandatory | latest-prd.md:30 (BR-CGM-02) | `CreateContactGroupRequest.Name` - max length validator in handler. | UNVERIFIABLE (likely COVERED) |
| GAP-CGM-04 | Reference ID optional | latest-prd.md:30 (BR-CGM-03) | `CreateContactGroupRequest.ReferenceId?` (nullable). | COVERED |
| GAP-CGM-05 | File types CSV / XLS / XLSX | latest-prd.md:30 (BR-CGM-04) | `UploadConfigResponse.AllowedExtensions[]` - frontend reads from server. | COVERED |
| GAP-CGM-06 | Configurable max file size | latest-prd.md:55 (BR-CGM-04) | `UploadConfigResponse.MaxFileSizeMB` returned to client; server enforces in `InitUploadEndpoint`. | COVERED |
| GAP-CGM-07 | "First row is header" toggle | latest-prd.md:31 (BR-CGM-05) | `CreateContactGroupRequest.HasHeader` (bool). | COVERED |
| GAP-CGM-08 | Column name validation (EN letters, no special, no duplicates, <=20, spaces->_) | latest-prd.md:31 (BR-CGM-06) | `CreateContactGroupRequest.ColumnConfig` carries per-column type mapping + alias. Server-side validator enforces rules. | UNVERIFIABLE (likely COVERED) |
| GAP-CGM-09 | Preview first 5 rows | latest-prd.md:31 (BR-CGM-07) | `UploadConfigResponse.PreviewRowCount` (configurable - PRD says 5, server makes it tunable); `CompleteUploadResponse.PreviewRows[][]`. | COVERED |
| GAP-CGM-10 | File content NOT validated beyond parsing | latest-prd.md:54 (BR-CGM-08) | Server does parse to detect columns + preview rows; whatever rows pass parsing are accepted. | COVERED |
| GAP-CGM-11 | Share during creation OR via action menu | latest-prd.md:32 (BR-CGM-09) | `CreateContactGroupRequest.SharePolicy` AND post-create `PATCH /api/contact-groups/{groupId}/share` (`ShareContactGroupRequest { SharedWithAllUsers, SharedUsers[] }`). | COVERED |
| GAP-CGM-12 | List with role-aware tabs | latest-prd.md:36-40 (BR-CGM-20..23) | Contact Group `GET /api/contact-groups` (`ListContactGroupsRequest { NodeId, Page, PageSize }`) + `GET /api/contact-groups/shared` (Normal User). Tab logic is frontend; server provides two endpoints. | COVERED |
| GAP-CGM-13 | Falcon view: Main-node-required, view-only, includes soft-deleted | latest-prd.md:40 (BR-CGM-23) | Server tenant scoping in handler. `IncludeDeleted` flag not visible on the request DTO; backend handler must apply role check. | PARTIAL (mechanism likely exists; not directly verifiable from DTO) |
| GAP-CGM-14 | List columns: Contact ID, Name, Reference ID, Created By, Creation Date, Uploaded Count, Status, Shared With, Actions | latest-prd.md:41 (BR-CGM-24) | `ContactGroupListItemDto { GroupId, Name, ReferenceId, CreatedAt, RowCount, Status, IsShared, ... }`. PRD's "Shared With (+N)" collapsing is frontend display. | COVERED (with one open: Created-By being shown empty when viewer is creator - server flag needed) |
| GAP-CGM-15 | "Created By empty when viewer is creator" rule | latest-prd.md:41 | Not visible in `ContactGroupListItemDto`. Server must include `CreatedBy` field; frontend hides when matches viewer. | UNVERIFIABLE (frontend implementation) |
| GAP-CGM-16 | Detail view with paginated contacts | latest-prd.md:42-46 | Contact Group `GET /api/contact-groups/{groupId}` (`GetContactGroupDetailsResponse`) + `GET /api/contact-groups/{groupId}/contacts?page=&pageSize=` (paginated dynamic-keyed dict). | COVERED |
| GAP-CGM-17 | Download Contact Group (validated + original) | latest-prd.md:44 (BR-CGM-13..19 permission cells) | Contact Group `GET /api/contact-groups/{groupId}/files/{fileType}` with `fileType` in `{original, validated}` -> returns pre-signed download URL. | COVERED |
| GAP-CGM-18 | Edit (creator only): Name / Shared With / Reference ID | latest-prd.md:48 (BR-CGM-26) | Contact Group `PATCH /api/contact-groups/{groupId}` (`UpdateContactGroupRequest { Name?, ReferenceId?, SharePolicy? }`). Permission check server-side. | COVERED |
| GAP-CGM-19 | Edits propagate to shared versions | latest-prd.md:56 (BR-CGM-27) | Single-row update; shares reference the same row -> propagation is automatic. | COVERED (by design) |
| GAP-CGM-20 | Soft Delete (creator only) | latest-prd.md:45 (BR-CGM-28) | Contact Group `DELETE /api/contact-groups/{groupId}` (`DeleteContactGroupRequest`). | COVERED (soft semantic; verify via handler) |
| GAP-CGM-21 | Permission Matrix (canonical from `Contact Group Permissions` sheet) | attachments.md:9-19 (BR-CGM-13..19) | Server-side: per-action handler must check Role + Creator-vs-Not. PES policies likely encode this. | PARTIAL (policy data alignment with sheet - Q-CGM-15) |
| GAP-CGM-22 | Falcon usertypes (System Admin, Operation, Product) can VIEW but cannot Edit/Share/Delete/Create | BR-CGM-13 | Server-side role check; FastEndpoints policy. | UNVERIFIABLE (likely COVERED) |
| GAP-CGM-23 | AO / Node Admin "not creator" can Share groups created by OTHERS in hierarchy | BR-CGM-11 / BR-CGM-15, BR-CGM-17 | Server-side role check; PES policy. | UNVERIFIABLE |
| GAP-CGM-24 | Normal User non-creator cannot share | BR-CGM-12 / BR-CGM-19 | Server-side role check. | UNVERIFIABLE |
| GAP-CGM-25 | Status: `In Progress` / `Completed` | latest-prd.md:41 (BR-CGM-29) | `ContactGroupListItemDto.Status` is a string. Set during processing (during W1's W1-pre flow). | COVERED (assumed) |
| GAP-CGM-26 | "Failed" status for parse errors | BR-CGM-34 / Q-CGM-04 | PRD doesn't list it; backend status enum likely has more values. Not surfaced in PRD wording. | MISSING (in PRD; status may exist in code) |
| GAP-CGM-27 | App Settings max file size (configurable per system) | BR-CGM-04 / BR-CGM-30 | `GET /api/contact-groups/upload-config` returns it. Default value not documented (Q-CGM-01). | COVERED (mechanism) / OPEN (default value) |
| GAP-CGM-28 | UploadSession TTL / garbage collection | Q-CGM-15 | Hangfire daily cron + dev-only `/api/_internal/cleanup/trigger`. | COVERED |
| GAP-CGM-29 | Audit log of Falcon admin downloads (compliance) | Q-CGM-16 | No audit-log endpoint observed. | MISSING |
| GAP-CGM-30 | Hard delete / retention for soft-deleted groups | Q-CGM-12 | No hard-delete endpoint observed. Retention policy not documented. | MISSING |
| GAP-CGM-31 | Behavior when shared-with Normal User is deleted | BR-CGM-32 / Q-CGM-03 | Not directly visible. | UNVERIFIABLE |
| GAP-CGM-32 | Sub-node visibility depth (how deep AO sees) | BR-CGM-35 / Q-CGM-05 | `ListContactGroupsRequest.NodeId` is single-node; recursion behavior is server-side. | UNVERIFIABLE |
| GAP-CGM-33 | "All Users" share semantic - all Normal Users in same hierarchy scope | (implied by W3) | `ShareContactGroupRequest.SharedWithAllUsers` (bool). Server expands at use time. | COVERED |
| GAP-CGM-34 | Frontend integration | (cross-frontend) | Per API_TO_COMPONENT_TRACE: **all 14 Contact Group endpoints are unbound** in current frontend tree. `active-story-115329-handover.md` indicates work in flight. | MISSING (frontend; backend ready) |
| GAP-CGM-35 | Email/SMS notifications when group shared (UX nicety) | (not in PRD) | Not in PRD; not in code. | (out of scope) |
| GAP-CGM-36 | Bulk upload + bulk operations | (not in PRD) | Not in PRD; not in code. | (out of scope) |

## Summary

- **Total rows:** 36.
- **COVERED:** 14.
- **PARTIAL:** 2 (GAP-CGM-13 Falcon-soft-delete-visibility, GAP-CGM-21 permission alignment).
- **MISSING:** 5 (GAP-CGM-26 Failed status, GAP-CGM-29 audit log, GAP-CGM-30 retention, GAP-CGM-34 frontend integration, GAP-CGM-26 hard-delete).
- **UNVERIFIABLE:** 8 (handler-side validators).

## Quick-win flags

- **GAP-CGM-34** is the biggest active blocker; backend is ready, frontend pending (story 115329).
- **GAP-CGM-26** introduce a `Failed` status before users report "stuck In Progress" rows.
- **GAP-CGM-29** add a download audit trail for Falcon admin actions (compliance / PII).
- **GAP-CGM-30** retention policy on soft-deleted groups is a known unknown.
