*** Backend Service — Contact Group ***
*** SoT: Brain Outputs/understanding/backend/contact-group/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-contact-group-svc ***

# Contact Group Service

> Owns the **contact group lifecycle**: customer uploads a CSV/XLSX of contacts, the service validates it, persists the contacts, and exposes them as a group for downstream campaign tooling.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/contact-group/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md) — 12 endpoints across 3 groups
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/contact-group/FRONTEND_CONTRACT.md)

## PRDs this service implements

- [[04 Contact Group Management]] — **primary** (ContactGroup · ContactGroupColumn · ContactGroupRecord · SharePolicy · UploadSession)

## Pages served

- Contact Groups list (own node · sub-node under AO/NA)
- Create Contact Group wizard (4 steps + upload pre-flow)
- Share / Edit / Download dialogs

## Falcon components backed by this service

- [[Falcon Data Table]] — contact groups list · column configurator · preview rows · contacts pagination
- [[Falcon Uploader]] — CSV/XLSX upload to pre-signed S3 URL
- [[Falcon Tabs]] (4-step wizard) · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]]
- [[Falcon Status Badge]] · [[Falcon Dialog]]

## Endpoint surface (12 endpoints)

From [ENDPOINT_REGISTRY.md](../../../Brain%20Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md):

| Group | Endpoints |
|---|---|
| `/api/contact-groups/*` | 8 (CRUD · share · pagination · download URLs) |
| `/api/contact-groups/upload-config` | 1 (standalone — needed before any upload session exists) |
| `/api/contact-groups/uploads/*` | 3 (upload-session lifecycle) |

All `RequireAuthorization()`. Dynamic alias-keyed contact pagination (CSV header → property name).

## Upload pipeline

- Pre-signed S3 PUT URL generation (`/uploads/*`)
- Server-side validation + preview extraction
- Background cleanup of orphaned upload sessions and soft-deleted groups (Hangfire)

## Kafka activity

- **Produces:** `contactgroup.import-requested.v1` for downstream consumers (templates linking, etc.)

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) — file type (CSV / XLS / XLSX) · file size · column shape · share-target hierarchy bounds · soft-delete reversibility window.

## Gateway exposure

- Client traffic → [[Core Gateway Service]]
- Admin traffic → [[System Gateway Service]] (view-only per Permission matrix)

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
