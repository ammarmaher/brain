# DIFF — contact-groups (management-console vs admin-console)

> Mgmt-console version: `apps/management-console/src/app/features/contact-groups/`
> Admin-console version: `apps/admin-console/src/app/features/contact-groups/`

## Routing diff
| Path | Admin-console | Management-console | Why |
|---|---|---|---|
| `contact-groups` root | `loadComponent → ContactGroupsComponent` (no nested children — flat) | `loadComponent → ContactGroupsComponent` **with 3 children**: `''` (list), `'create'`, `':groupId'` | Mgmt uses nested router-outlet pattern; admin uses sibling top-level routes (`contact-groups` and `contact-groups/:groupId` are separate top-level entries) |
| Details child | `contact-groups/:groupId` (top-level) | `contact-groups/:groupId` (nested child of `contact-groups`) | Same URL surface but different router tree structure — mgmt's nested children share the parent component (which renders the org-hierarchy tree) |
| Create child | **NOT present** — admin has no create page route | `contact-groups/create` → `CreateContactGroupComponent` | Mgmt-console implements the full **5-step create wizard** (upload-group-details, preview-configure, review-create, share-group); admin does not expose this |
| Component file path for details | `./contact-groups/components/contact-group-details/contact-group-details.component` | `./contact-groups/contact-group-details/contact-group-details.component` | Admin nests under `components/` subfolder; mgmt flattens it |
| Guards | `shellAccessGuard` on both `contact-groups` + `contact-groups/:groupId` | `shellAccessGuard` on parent only | Single guard sufficient on parent because children inherit |

## Component diff

### Components only in mgmt-console (not in admin-console)
- `ContactGroupsComponent` (parent shell) — wraps the org-hierarchy tree picker on the left, router-outlet on the right
- `CreateContactGroupComponent` + **5 step components**:
  - `UploadGroupDetailsStepComponent` (with `UploadGroupDetailsService`)
  - `PreviewConfigureStepComponent` (with `PreviewConfigureService`)
  - `ReviewCreateStepComponent` (with `ReviewCreateService`)
  - `ShareGroupStepComponent` (with `ShareGroupService`)
- `ContactGroupDetailsComponent` (full edit/details page — uses ContactGroupDetailsService for get/update/share)
- `ContactGroupsListComponent` (the table-only list page; admin's version is `ContactGroupsComponent` directly)

### Components only in admin-console
- The admin app has only a top-level `ContactGroupsComponent` + a `ContactGroupDetailsComponent` (no wizard, no list/parent split, no preview/share/upload steps).

### Architectural shape diff
- **Mgmt-console**: parent shell (tree + outlet) + list + create wizard (4 steps) + details + share dialog inside details
- **Admin-console**: single-page list + read-only details (no create UI exposed)

## Service / API diff

### Endpoints only in mgmt
| Method | URL | Service | Purpose |
|---|---|---|---|
| GET | `contactgroup/contact-groups/upload-config` | `UploadGroupDetailsService.getUploadConfig()` | File constraints (max size, extensions) |
| POST | `contactgroup/contact-groups/uploads/init` | `UploadGroupDetailsService.initUploadSession()` | Create upload session → pre-signed S3 URL |
| PUT | `{pre-signed-S3-url}` (external — AWS) | `UploadGroupDetailsService.uploadFileToStorage()` | Direct upload to S3 |
| POST | `contactgroup/contact-groups/uploads/{uploadId}/complete` | `UploadGroupDetailsService.confirmUpload()` | Validate + return preview data |
| GET | `contactgroup/contact-groups/uploads/{uploadId}/preview` | `PreviewConfigureService.getUploadPreview()` | Re-fetch preview |
| POST | `contactgroup/contact-groups` | `ReviewCreateService.createContactGroup()` | Create the contact group |
| GET | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.getDetail()` | Group metadata |
| GET | `contactgroup/contact-groups/{groupId}/files/{fileType}` | `ContactGroupDetailsService.getFileDownloadUrl()` | Time-limited pre-signed URL for original/validated/error-report |
| GET | `contactgroup/contact-groups/{groupId}/contacts?page=N&pageSize=N` | `ContactGroupDetailsService.getContacts()` | Paginated contact rows |
| PATCH | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.updateGroup()` | Update name/referenceId/share policy |
| PATCH | `contactgroup/contact-groups/{groupId}/share-policy` | `ContactGroupDetailsService.shareGroup()` | Update share policy (users list) |
| GET | `identity/user?Status=2&Status=3&Status=4&Role=6&...` | `ContactGroupDetailsService.getShareableUsers()` + `ShareGroupService.getShareableUsers()` | List Active/Suspended/Locked NormalUsers for share dialog |
| POST | `contactgroup/contact-groups/{groupId}/share` (legacy) | `ContactGroupsApiService.shareContactGroup()` | Older share endpoint kept for back-compat |
| DELETE | `contactgroup/contact-groups/{contactGroupId}` | `ContactGroupsApiService.deleteContactGroup()` | Soft-delete |

### Endpoints in admin-console (subset)
| Method | URL | Service | Purpose |
|---|---|---|---|
| GET | `contactgroup/contact-groups?NodeId={id}&page&pageSize` | `ContactGroupsApiService.list()` | Same list endpoint |
| GET | `contactgroup/contact-groups/shared?NodeId={id}&Page&PageSize` | `ContactGroupsApiService.getSharedGroups()` | Same shared list |

Admin-console **does NOT have** the upload pipeline, create/share endpoints, or the file-download endpoints — admin is read-only on contact groups.

### Different gateway routing
- **Admin** → System Gateway → backend Commerce service strips `/contactgroup` and prepends `/api` → `GET /api/contact-groups`
- **Mgmt** → Core Gateway → same upstream API but via a different external host

(See file headers in `contact-groups-api.service.ts` of both apps for the gateway routing comment.)

## DTO diff
- **Mgmt has many additional DTOs** for the create wizard:
  - `InitUploadSessionRequest/Response`
  - `UploadConfigResponse`
  - `CompleteUploadResponse` (detected columns + preview rows)
  - `UploadPreviewResponse`
  - `CreateContactGroupRequest/Response`
  - `ShareGroupRequest`, `ShareContactGroupSharedUser`, `ShareableUser`, `SharedUserOption`
  - `ContactGroupDetailDto`, `ContactGroupContactItem`, `ContactGroupContactsResponseDto`
  - `ContactGroupFileDownloadDto`, `ContactGroupFileType` (Original=0, Validated=1, ErrorReport=2)
  - `UpdateContactGroupRequest`
- **Admin** has only `ContactGroupListItemDto` + `ContactGroupTableRowVm` + `PagedResult<T>` from `@falcon` for the list page.

## PES diff

### Permission keys
| Admin-console (FalconAccess.contactGroup.*) | Management-console (FalconAccess.contactGroup.*) |
|---|---|
| `view('acc')`, `create('acc')`, `edit('acc')`, `share('acc')`, `shareOther('acc')`, `delete('acc')`, `downloadValidated('acc')`, `downloadOriginal('acc')` + `FalconAccess.contactGroups.viewShared()` | Same 9 keys |

**Note**: the contact-groups permission namespace appears to be `FalconAccess.contactGroup.*` in both apps (NOT `managementConsole.contactGroup.*` or `adminConsole.contactGroup.*`). This is the **only feature** in management-console that does NOT use the `managementConsole.*` namespace — it uses the dedicated `contactGroup` module namespace. This is consistent with admin-console which also uses `contactGroup.*` directly.

### Row-level overlay
Both apps use the same `rowFlags(row, session, flags)` helper (`models/models.ts:47-60` in mgmt) — overlays ownership (`session.identityUserId === row.createdByUserId`) onto PBAC flags for edit/delete actions. **Shared logic**.

## Other architectural diff
- **Mgmt** uses an injectable `ContactGroupsStateService` (signals for selectedNode, uploadConfig, pendingSuccessMessage) shared between parent, list, create-wizard, and details. **Admin has no equivalent** — its single page manages state locally.
- **Mgmt parent component injects `OrgHierarchyApiService` from account-administration** (`contact-groups.component.ts:19`) — reuses the org tree for left-pane navigation. Admin has no such tree integration.
- **Mgmt parent provides `ContactGroupsStateService` at component level** (`providers: [ContactGroupsStateService]` — `contact-groups.component.ts:32`) — service instance scoped per parent so multiple tabs don't bleed.
- Both apps are module-federation remotes; not hosts of each other.
