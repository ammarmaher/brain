# Contact Group Service — Validations

## DTO-Level Validation

FluentValidation (`Validator<T>` — FastEndpoints variant) auto-discovered. Validators live under `Endpoints/{ContactGroups,Uploads}/Validators/` and `Application/ContactGroups/Validators/`.

| Validator | Target DTO | Notable Rules |
|---|---|---|
| `CreateContactGroupRequestValidator` | `CreateContactGroupRequest` | `Name`: NotEmpty (`ContactGroupNameRequired`); dependent: MaximumLength(`ContactGroupRules.NameMaxLength`) + Matches(`ContactGroupRules.NamePattern`) (`ContactGroupNameInvalidFormat`) |
| `UpdateContactGroupRequestValidator` | `UpdateContactGroupRequest` | Optional Name/ReferenceId/SharePolicy validation |
| `ListContactGroupsRequestValidator` | `ListContactGroupsRequest` | Page > 0, PageSize > 0 (`InvalidPageNumber`, `InvalidPageSize`) |
| `ListSharedContactGroupsRequestValidator` | `ListSharedContactGroupsRequest` | Page bounds |
| `BrowseContactGroupContactsValidator` | `BrowseContactGroupContactsRequest` | Page + GroupId + PageSize bounds |
| `InitUploadRequestValidator` | `InitUploadRequest` | `FileName`: NotEmpty (`RequiredFieldMissing`), MaximumLength(255) (`MaxLengthExceeded`); `ContentType`: NotEmpty; `FileSizeBytes`: > 0 (`InvalidFileSize`) |

Plus implicit validations:
- FastEndpoints binds route, query, and body via attribute-less convention — missing route params surface as 404
- Malformed JSON returns 400 with a framework body

## Handler-Level Business Validation

Throws `FalconException(FalconKeys.Error.<Code>)`:

| Concern | Error Codes |
|---|---|
| Upload session lifecycle | `UploadSessionNotFound`, `UploadSessionExpired`, `UploadSessionAlreadyCompleted`, `UploadSessionNotReady`, `UploadSessionAlreadyUsed` |
| File validation | `InvalidFileType`, `FileSizeExceeded`, `InvalidFileSize`, `FileEmpty`, `NoDataRows`, `FileParseError`, `FileNotFound`, `ImportTooLarge` |
| Authorization | `UnauthorizedAccess`, `ForbiddenToDeleteContactGroup`, `ForbiddenToShareContactGroup`, `ForbiddenToEditContactGroup` |
| Identity (sharing) | `IdentityServiceError`, `IdentityServiceConnectionError`, `IdentityServiceTimeout` |
| Group state | `ContactGroupNotFound`, `ContactGroupNotCompleted`, `DuplicateEntity` |
| Node/Tenant resolution | `TenantIdMissing`, `NodeIdMissing`, `NodeIdRequiredForFalconUser`, `NodeNotInHierarchy` |
| S3 | `S3CopyFailed` |
| Page bounds | `InvalidPageNumber`, `InvalidPageSize` |
| Import | `ImportEventPublishFailed` |
| Name | `ContactGroupNameInvalidFormat`, `ContactGroupNameRequired` |

## Authorization Policy

- Class-level `Group<ContactGroupEndpointGroup>()` and `Group<UploadEndpointGroup>()` apply `RequireAuthorization()` via `ep.Options(x => x.RequireAuthorization())` in the group constructor — every endpoint requires a valid JWT.
- Internal endpoints (`/api/_internal/info`, `/api/_internal/cleanup/trigger`) are `AllowAnonymous` and excluded from OpenAPI.
- The cleanup trigger has an additional runtime check: returns 404 if not running in `Development` environment.

## Sharing Rule

`ShareContactGroupRequest.SharedWithAllUsers` is a flag — if true, the `SharedUsers` list is ignored. Frontend must use one mode or the other consistently.

## Tenant Resolution

Every endpoint reads tenant id from JWT (`X-Tenant-Id` header is gateway-injected). Falcon users with no tenant claim cannot access these endpoints (they get `TenantIdMissing`).

## Multi-Language

`MultiLanguage` is not used in Contact Group DTOs. Group names are user-entered strings.

## Resource Completeness

`app.ValidateResourceCompleteness()` (without typo — Contact Group uses the correctly-spelled method name unlike Commerce/Charging). Fails startup if any code in `FalconKeys.Error` lacks a translation in `Resources/ErrorMessages.{en,ar}.resx`.

## Pre-Processor Pattern

No custom pre-processors observed (Identity uses `IpAllowlistPreProcessor`). Contact Group relies on FastEndpoints' built-in validation + handler-side checks.
