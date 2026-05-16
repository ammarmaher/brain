# DTOs — contact-groups (admin-console)

## Request DTOs

### `GetContactGroupsRequestParams`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:71-75`
- Shape:
```ts
export interface GetContactGroupsRequestParams {
  nodeId?: string | null;
  page?: number;
  pageSize?: number;
}
```
- Used by: `ContactGroupsApiService.list()` and `.getSharedGroups()`
- Note: serialised differently for the two endpoints — `list()` uses lowercase `page`/`pageSize`, `getSharedGroups()` uses PascalCase `Page`/`PageSize` (see [[03-SERVICES-APIS]]).

### `UpdateContactGroupRequest`
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts:101-109`
- Shape:
```ts
export interface UpdateContactGroupRequest {
  groupId: string;
  name: string;
  referenceId?: string | null;
  sharePolicy: {
    sharedWithAllUsers: boolean;
    sharedUsers: { userId: string; firstName: string; lastName: string; username: string }[];
  } | null;
}
```
- Used by: `ContactGroupDetailsService.updateGroup()`
- **Important caveat**: at the call-site (`onSave()` line 632-637) `sharePolicy` is hard-coded to `null`. The selected user IDs the user picked in the multiselect are NOT being sent in this build. Name and referenceId go through; sharePolicy edit is effectively dead code.

## Response DTOs

### `ContactGroupListItemDto`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:32-49`
- Shape:
```ts
export interface ContactGroupListItemDto {
  id: string;
  name: string;
  referenceId?: string | null;
  status: ContactGroupStatus;       // 1 | 2
  createdByUserId: string;
  createdByDisplayName: string;
  createdByUsername: string;
  createdAt: string;                // ISO 8601
  sharePolicy: SharePolicyDto;
  uploadedContacts: number;         // defaults server-side to 0
  isDeleted?: boolean;              // Only present for Falcon admin users
}
```
- Used by: GET list + GET shared list (paged inside `PagedResult<ContactGroupListItemDto>`)
- Backward-compat alias: `ContactGroupItemDto` and `ContactGroupListResponseDto` (deprecated, lines 64-67).

### `ContactGroupSharedUserDto`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:9-14`
- Shape:
```ts
export interface ContactGroupSharedUserDto {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
}
```
- Used by: `SharePolicyDto.sharedUsers[]` (list-item DTO)

### `SharePolicyDto`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:20-23`
- Shape:
```ts
export interface SharePolicyDto {
  sharedWithAllUsers: boolean;
  sharedUsers?: ContactGroupSharedUserDto[];
}
```

### `PagedResult<T>`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:54-59`
- Shape:
```ts
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```
- Used by: list, shared-list, contacts, shareable-users endpoints

### `ContactGroupDetailDto`
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts:49-66`
- Shape:
```ts
export interface ContactGroupDetailDto {
  id: string;
  name: string;
  referenceId: string | null;
  status: ContactGroupStatus;
  createdAt: string;
  createdByUserId: string | null;
  isCreator: boolean;                     // ← drives canEdit
  sharePolicy: {
    sharedWithAllUsers: boolean;
    sharedUsers?: ContactGroupDetailSharedUserDto[];
  };
  columnDefinitions: ColumnDefinitionDto[];
  statistics: GroupStatisticsDto | null;
  files: FileAvailabilityDto;
  isDeleted: boolean | null;
  deletedAt: string | null;
}
```
- Used by: `getDetail()` + `updateGroup()`

### `ContactGroupDetailSharedUserDto`
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts:13-18`
- Same shape as the list-level `ContactGroupSharedUserDto` (both have `userId, firstName, lastName, username`).

### `ColumnDefinitionDto`
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts:22-28`
- Shape:
```ts
export interface ColumnDefinitionDto {
  sourceIndex: number;
  originalName: string;       // header label
  alias: string;              // VM field key
  isIgnored: boolean;         // hides column
  dataType: string;
}
```
- Used by: `buildColumnsFromDefinitions()` (detail component line 334) — drives the contacts table's dynamic column list.

### `GroupStatisticsDto`
- File: models.ts:32-36
```ts
export interface GroupStatisticsDto {
  totalRows: number;
  validRows: number;
  invalidRows: number;
}
```
- Used by: Group Information card (Total Contacts / Valid Contacts / Invalid Contacts fields).

### `FileAvailabilityDto`
- File: models.ts:40-44
```ts
export interface FileAvailabilityDto {
  hasOriginal: boolean;
  hasValidated: boolean;
  hasErrorReport: boolean;
}
```
- Used by: `canDownloadOriginal` / `canDownloadValidated` getters. (Note: `hasErrorReport` is declared but not consumed by the admin-console UI.)

### `ContactGroupContactItem`
- File: models.ts:70-73
```ts
export interface ContactGroupContactItem {
  id: string;
  [key: string]: unknown;   // dynamic schema from columnDefinitions
}
```
- Used by: contacts table rows. The keys are dynamic because each group can have a different column set.

### `ContactGroupContactsResponseDto`
- File: models.ts:77-82
```ts
export interface ContactGroupContactsResponseDto {
  items: ContactGroupContactItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

### `ContactGroupFileDownloadDto`
- File: models.ts:86-91
```ts
export interface ContactGroupFileDownloadDto {
  downloadUrl: string;        // pre-signed URL
  fileName: string;
  expiresInSeconds: number;
}
```

### `SharedUserOption`
- File: models.ts:111-117
```ts
export interface SharedUserOption {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;        // computed `${firstName} ${lastName}`.trim()
  username: string;
}
```
- Used by: edit-mode multiselect.

### `IdentityUserInfoDto` (private to the service)
- File: `contact-group-details.service.ts:36-41`
```ts
interface IdentityUserInfoDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}
```
- Used by: `getShareableUsers()` to type the raw `identity/user` response before mapping to `SharedUserOption`.

## View-Model DTOs

### `ContactGroupTableRowVm`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:79-98`
- Shape:
```ts
export interface ContactGroupTableRowVm {
  id: string;
  contactsName: string;
  referenceId: string;             // '-' when null
  createdByUserId: string;
  createdByName: string;
  createdByUsername: string;
  creationDate: string;            // 'dd/MM/yyyy'
  creationTime: string;            // 'hh:mm am|pm'
  uploadedContacts: string;        // stringified, 'N/A' when null
  status: string;                  // localized label
  statusCode: ContactGroupStatus;
  processedRows: number;           // always 0 on the list — TODO comment
  totalRows: number;               // always 0 on the list — TODO comment
  sharedWith: FalconChipItem[];
  isDeleted: boolean;              // false when not Falcon user
}
```
- Built by `mapContactGroupDtoToTableRow()` in `libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts:15-41`.

### `ContactGroupListResult` (local to API service)
- File: `contact-groups-api.service.ts:16-21`
```ts
export interface ContactGroupListResult {
  rows: ContactGroupTableRowVm[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

## Enums / Constants

### `ContactGroupStatus`
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:108-117`
```ts
export enum ContactGroupStatus {
  InProgress = 1,
  Completed = 2,
}
export function normalizeContactGroupStatus(raw: number | null | undefined): ContactGroupStatus {
  return raw === ContactGroupStatus.Completed
    ? ContactGroupStatus.Completed
    : ContactGroupStatus.InProgress;
}
export const CONTACT_GROUP_STATUS_LABELS: Record<ContactGroupStatus, string> = {
  [ContactGroupStatus.InProgress]: 'In Progress',
  [ContactGroupStatus.Completed]: 'Completed',
};
```
- Banner comment (lines 101-107) is explicit: any non-Completed value (null / unknown / legacy Failed) defaults to `InProgress`.

### `ContactGroupFileType`
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts:93-97`
```ts
export enum ContactGroupFileType {
  Original = 1,
  Validated = 2,
}
```
- Matches backend `eGroupFileType` (per code comment line 93).

### `CONTACT_GROUP_STATUS_I18N` / `CONTACT_GROUP_STATUS_STYLE`
- File: models.ts:121-129
```ts
export const CONTACT_GROUP_STATUS_I18N: Record<ContactGroupStatus, string> = {
  [ContactGroupStatus.InProgress]: 'contactGroups.detail.status.inProgress',
  [ContactGroupStatus.Completed]: 'contactGroups.detail.status.completed',
};
export const CONTACT_GROUP_STATUS_STYLE: Record<ContactGroupStatus, string> = {
  [ContactGroupStatus.InProgress]: 'cgd-status--in-progress',
  [ContactGroupStatus.Completed]: 'cgd-status--completed',
};
```

## Permission DTOs (local feature models)

### `ContactGroupPermissionFlags`
- File: `apps/admin-console/src/app/features/contact-groups/models/models.ts:11-20`
```ts
export interface ContactGroupPermissionFlags {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canShare: boolean;
  canShareOther: boolean;
  canDelete: boolean;
  canDownloadValidated: boolean;
  canDownloadOriginal: boolean;
}
```

### `RowActionFlags`
- File: models.ts:22-26
```ts
export interface RowActionFlags {
  canEditRow: boolean;
  canDeleteRow: boolean;
  canShareRow: boolean;
}
```

### `rowFlags()` overlay
- File: models.ts:47-60
```ts
export function rowFlags(
  row: Pick<ContactGroupTableRowVm, 'createdByUserId'>,
  session: UserSession | null,
  flags: ContactGroupPermissionFlags,
): RowActionFlags {
  const isOwner = !!session?.identityUserId
    && session.identityUserId === row.createdByUserId;
  return {
    canEditRow:   flags.canEdit   && isOwner,
    canDeleteRow: flags.canDelete && isOwner,
    canShareRow:  flags.canShare  && (isOwner || flags.canShareOther),
  };
}
```
- Banner comment is explicit: **NEVER compare with `session.subjectId` (Zitadel id space)** — always use `identityUserId`.

## Total
- **8 response DTOs / shapes** from the API (list-item, detail, detail-shared-user, column-def, statistics, file-availability, contact-item, file-download)
- **2 request DTO shapes** (list params, update payload)
- **1 paged envelope** (`PagedResult<T>`)
- **1 result envelope** (`ServiceOperationResult<T>` — from `@falcon`, not declared here)
- **2 VM shapes** (`ContactGroupTableRowVm`, `ContactGroupListResult`)
- **2 picker DTOs** (`SharedUserOption`, `IdentityUserInfoDto`)
- **2 enums** (`ContactGroupStatus`, `ContactGroupFileType`)
- **2 permission shapes** (`ContactGroupPermissionFlags`, `RowActionFlags`)
- **3 constant maps** (`CONTACT_GROUP_STATUS_LABELS`, `CONTACT_GROUP_STATUS_I18N`, `CONTACT_GROUP_STATUS_STYLE`)
