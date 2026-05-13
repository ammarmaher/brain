# Contact Group Service — DTO Dictionary

> Source: `Falcon.ContactGroup.Api/Application/{ContactGroups,Uploads}/Models/`. DTOs are split per feature folder.

## Cross-Cutting Types

| Type | Shape | Notes |
|---|---|---|
| `ServiceOperationResult<T>` | record | (inferred — same record shape as Identity) |
| `PagedResult<T>` | record | `{ Items[], TotalCount, Page, PageSize }` (inferred from usage) |

## Contact Group Request DTOs

| Name | Used By | Notable Fields |
|---|---|---|
| `CreateContactGroupRequest` | `POST /contact-groups` | `string UploadSessionId, string Name, string? ReferenceId, bool HasHeader, ColumnConfig, SharePolicy SharePolicy` |
| `ListContactGroupsRequest` | `GET /contact-groups` | `string? NodeId, int Page, int PageSize` |
| `ListSharedContactGroupsRequest` | `GET /contact-groups/shared` | `int Page, int PageSize` |
| `GetContactGroupDetailsRequest` | `GET /contact-groups/{groupId}` | `string GroupId` (route) |
| `UpdateContactGroupRequest` | `PATCH /contact-groups/{groupId}` | `string GroupId, string? Name, string? ReferenceId, SharePolicy? SharePolicy` |
| `ShareContactGroupRequest` | `PATCH /contact-groups/{groupId}/share` | `string GroupId, bool SharedWithAllUsers, List<SharedUser> SharedUsers` |
| `DeleteContactGroupRequest` | `DELETE /contact-groups/{groupId}` | `string GroupId` |
| `BrowseContactGroupContactsRequest` | `GET /contact-groups/{groupId}/contacts` | `string GroupId, int Page, int PageSize` |
| `GetFileDownloadUrlRequest` | `GET /contact-groups/{groupId}/files/{fileType}` | `string GroupId, string FileType` (`original` or `validated`) |
| `SharePolicy` (nested) | embedded | `bool SharedWithAllUsers, List<string> SharedUserIds` (inferred) |
| `ColumnConfig` (nested) | embedded | Per-column type mapping & alias (`Name, Phone, Email, Custom1`, …) |

## Contact Group Response DTOs

| Name | Used By | Fields |
|---|---|---|
| `CreateContactGroupResponse` | `POST` | `{ GroupId, …diagnostic counters }` (inferred) |
| `ContactGroupListItemDto` | list rows | `{ GroupId, Name, ReferenceId, CreatedAt, RowCount, Status, IsShared, … }` (inferred) |
| `GetContactGroupDetailsResponse` | details + update | Full details — name, share policy, columns, statistics, file availability flags |
| `GetFileDownloadUrlResponse` | file URL | `{ string DownloadUrl, string FileName, int ExpiresInSeconds }` |
| `PagedResult<T>` | listings | Items + Count + Page + PageSize |

## Upload Request DTOs

| Name | Used By | Fields |
|---|---|---|
| `InitUploadRequest` | `POST /uploads/init` | `string FileName, string ContentType, long FileSizeBytes` |
| `CompleteUploadRequest` | `POST /uploads/{uploadId}/complete` | `string UploadId` |
| `GetUploadPreviewRequest` | `GET /uploads/{uploadId}/preview` | `string UploadId` |

## Upload Response DTOs

| Name | Used By | Fields |
|---|---|---|
| `InitUploadResponse` | init | `{ UploadId, PreSignedUrl, ExpiresInSeconds, MaxFileSizeMB, … }` (inferred) |
| `CompleteUploadResponse` | complete + preview | `{ HasHeader, DetectedColumns[], PreviewRows[][], … }` (inferred) |
| `UploadConfigResponse` | `GET /upload-config` | `int MaxFileSizeMB, List<string> AllowedExtensions, int PreviewRowCount` |

## Dynamic-Keyed Response

`BrowseContactGroupContactsEndpoint` returns `PagedResult<Dictionary<string, object>>`. Each item's keys are the **column aliases** chosen during `CreateContactGroupRequest.ColumnConfig`. Example:

```json
{
  "items": [
    { "name": "Alice", "phone": "+1-555-0100", "email": "alice@example.com" },
    { "name": "Bob", "phone": "+1-555-0200", "email": "bob@example.com" }
  ],
  "totalCount": 12345,
  "page": 1,
  "pageSize": 10
}
```

The frontend must read the column schema from `GetContactGroupDetailsResponse` (which contains the column definitions including their alias keys) to render this correctly.

## File Type Vocabulary

`GetFileDownloadUrlRequest.FileType`:
- `original` — the file the user uploaded
- `validated` — the post-processing validated/normalized version produced by the import job

## Command/Query Types (Internal)

Each endpoint maps its request to a corresponding command/query for Mediator dispatch:

| Internal Type | Path |
|---|---|
| `CreateContactGroupCommand(UploadSessionId, Name, ReferenceId, HasHeader, ColumnConfig, SharePolicy)` | `Application/ContactGroups/Commands/` |
| `ListContactGroupsQuery(NodeId, Page, PageSize)` | `Application/ContactGroups/ListContactGroups/Queries/` |
| `ListSharedContactGroupsQuery(Page, PageSize)` | `Application/ContactGroups/ListSharedContactGroups/Queries/` |
| `GetContactGroupDetailsQuery(GroupId)` | `Application/ContactGroups/Queries/` |
| `UpdateContactGroupCommand(GroupId, Name, ReferenceId, SharePolicy)` | `Application/ContactGroups/UpdateContactGroup/Command/` |
| `ShareContactGroupCommand(GroupId, SharedWithAllUsers, SharedUsers)` | `Application/ContactGroups/ShareContactGroup/Command/` |
| `DeleteContactGroupCommand(GroupId)` | `Application/ContactGroups/DeleteContactGroup/Command/` |
| `BrowseContactGroupContactsQuery(GroupId, Page, PageSize)` | `Application/ContactGroups/BrowseContactGroupContacts/Queries/` |
| `GetFileDownloadUrlQuery(GroupId, FileType)` | `Application/ContactGroups/Queries/` |
| `InitUpload* / CompleteUploadCommand / GetUploadPreviewQuery` | `Application/Uploads/{Commands,Queries}/` |

The handlers are dispatched through `IMediator` (Mediator NuGet, source-generated).
