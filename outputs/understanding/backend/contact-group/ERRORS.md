# Contact Group Service — Error Catalog

> Source: `Falcon.ContactGroup.Api/Domain/Constants/FalconKeys.cs`. Error keys are localized via `Resources/ErrorMessages.{en,ar}.resx` and surfaced through the standard `ServiceOperationResult<object>.Failure(...)` pattern.

## Validation Errors

| Code | Likely HTTP | Description |
|---|---:|---|
| `RequiredFieldMissing` | 400 | Generic NotEmpty fail |
| `MaxLengthExceeded` | 400 | Generic MaximumLength fail |
| `BelowMinimumLength` | 400 | Generic MinimumLength fail |
| `InvalidPageNumber` | 400 | Page ≤ 0 |
| `InvalidPageSize` | 400 | PageSize ≤ 0 (or upper bound) |
| `InvalidFileSize` | 400 | FileSize ≤ 0 |
| `ContactGroupNameRequired` | 400 | CreateContactGroupRequest.Name empty |
| `ContactGroupNameInvalidFormat` | 400 | Doesn't match `ContactGroupRules.NamePattern` |
| `InvalidFileType` | 400 | Extension not in `FileImport:AllowedExtensions` |
| `FileSizeExceeded` | 400 | > `FileImport:MaxFileSizeMB` |
| `FileEmpty` | 400 | 0-byte file |
| `NoDataRows` | 400 | File has header but no data rows |
| `FileParseError` | 400 | CSV/XLSX parser failed |
| `ImportTooLarge` | 400 | Rows > `FileImport:MaxRowsPerImport` |

## State Errors

| Code | Likely HTTP | Description |
|---|---:|---|
| `EntityNotFound` | 404 | Generic |
| `ContactGroupNotFound` | 404 | |
| `UploadSessionNotFound` | 404 | Upload session id unknown |
| `UploadSessionExpired` | 410 | Past `SessionExpiryMinutes` |
| `UploadSessionAlreadyCompleted` | 409 | Already completed (validation pass done) |
| `UploadSessionNotReady` | 409 | Trying to use a session that hasn't been completed |
| `UploadSessionAlreadyUsed` | 409 | Trying to create a contact group from a session that was already used |
| `ContactGroupNotCompleted` | 409 | Trying to read contacts before import job finished |
| `DuplicateEntity` | 409 | |
| `FileNotFound` | 404 | S3 lookup miss |

## Authorization Errors

| Code | Likely HTTP | Description |
|---|---:|---|
| `UnauthorizedAccess` | 403 | Generic |
| `ForbiddenToDeleteContactGroup` | 403 | Only creator can delete |
| `ForbiddenToShareContactGroup` | 403 | Only creator can share |
| `ForbiddenToEditContactGroup` | 403 | Only creator can edit |
| `InvalidOperation` | 422 | Generic |
| `NoChangesToUpdate` | 422 | PATCH with no actual changes |

## Tenant/Node Errors

| Code | Likely HTTP | Description |
|---|---:|---|
| `TenantIdMissing` | 401 | JWT has no tenant claim (Falcon admin trying client endpoint) |
| `NodeIdMissing` | 400 | Missing required node id |
| `NodeIdRequiredForFalconUser` | 400 | Falcon admin must pass `NodeId` explicitly (no JWT-resolved node) |
| `NodeNotInHierarchy` | 403 | Node id is outside caller's access scope |

## External Service Errors

| Code | Likely HTTP | Description |
|---|---:|---|
| `IdentityServiceError` | 502 | Identity HTTP call failed |
| `IdentityServiceConnectionError` | 503 | Identity unreachable |
| `IdentityServiceTimeout` | 504 | Identity didn't respond within `ServicesClients:Identity:TimeoutSeconds` |
| `S3CopyFailed` | 500 | Failed to copy temp upload to permanent location |
| `ImportEventPublishFailed` | 500 | Kafka producer failed |
| `InternalServerError` | 500 | Generic catch-all |

## Headers

`FalconKeys.Headers` constants (not error codes):
- `TenantId = "X-Tenant-Id"`
- `CorrelationId = "X-Correlation-Id"`

## Exception Class

`FalconException(FalconKeys.Error.<Code>)` — same shape as the rest of the platform. Mapped to `ServiceOperationResult<object>.Failure(...)` by the global exception handler.
