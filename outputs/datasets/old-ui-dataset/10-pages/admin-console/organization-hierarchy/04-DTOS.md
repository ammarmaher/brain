# DTOs — organization-hierarchy

> 45 distinct TS interface / class / type / enum declarations spread across the feature scope. Listed by file.

## Org-hierarchy domain (`models/org-hierarchy.models.ts`)

### `OrgHierarchyNode`
- File: `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts:8-19`
```typescript
export interface OrgHierarchyNode {
  id: string | null;
  label: string;
  icon?: string;
  url?: string;
  hasChildren: boolean;
  children?: OrgHierarchyNode[];
  isRootNode?: boolean;
  isMainMenu?: boolean;
  isFalconNode?: boolean;   // Deprecated — use isRootNode
  isFirstLevelChild?: boolean;
}
```
- Used by: `OrgHierarchyApiService` outputs, `org-hierarchy.mapper.ts`

### `OrgNodeListItem`
- File: `models/org-hierarchy.models.ts:24-29`
```typescript
export interface OrgNodeListItem {
  id: string;
  name: string;
  type?: string;
  [key: string]: unknown;
}
```

### `OrgNodeActionType` + `OrgNodeAction`
- File: `models/org-hierarchy.models.ts:34-43`
```typescript
export type OrgNodeActionType =
  | 'add-node' | 'edit-node' | 'add-client' | 'add-user' | 'view-details' | 'delete';

export interface OrgNodeAction {
  actionId: OrgNodeActionType;
  nodeKey: string | null;
  nodeData?: unknown;
}
```

## Node API (`models/node-api.models.ts`)

### `IResult<T>` (generic wrapper)
- File: `models/node-api.models.ts:8-13`
```typescript
export interface IResult<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
```

### `GetNodeResponse`
- File: `models/node-api.models.ts:18-27`
```typescript
export interface GetNodeResponse {
  id: string;
  label: string;
  icon?: string;
  url?: string;
  hasChildren: boolean;
  path?: string | null;
  children?: GetNodeResponse[];
  [key: string]: unknown;
}
```

### `CreateSubNodeRequest`
- File: `models/node-api.models.ts:29-32`
```typescript
export interface CreateSubNodeRequest {
  id: string;     // parent node id
  name: string;
}
```

### `UpdateSubNodeNameRequest`
- File: `models/node-api.models.ts:33-36`
```typescript
export interface UpdateSubNodeNameRequest {
  parentId: string;
  name: string;
}
```

### `NodeApiResponse`
- File: `models/node-api.models.ts:37`
```typescript
export type NodeApiResponse = IResult<GetNodeResponse>;
```

### `CreateAccountResponse` (in `NodeApiService`)
- File: `services/node-api.service.ts:15-17`
```typescript
export interface CreateAccountResponse {
  id: string;
}
```

## User API (`services/user-api.service.ts`)

### `GeneratePasswordRequest` / `GeneratePasswordResponse`
- File: `user-api.service.ts:6-12`
```typescript
export interface GeneratePasswordRequest {
  passwordSecurityLevel: number;
}
export interface GeneratePasswordResponse {
  password: string;
}
```

### `GetUsersByNodeRequest`
- File: `user-api.service.ts:14-16`
```typescript
export interface GetUsersByNodeRequest {
  nodeId?: string;
}
```

### `PagedResponse<T>` (mirrors backend record)
- File: `user-api.service.ts:19-24`
```typescript
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

### `UserInfoResponse`
- File: `user-api.service.ts:26-39`
```typescript
export interface UserInfoResponse {
  id: string;
  nodeId?: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email?: string | null;
  phoneNumber?: string | null;
  roleKey: string;
  userType: number;
  status: number;
  permissionGroup: string;
  path?: string | null;
}
```

## Create-Client wizard (`components/create-client-wizard/create-client-wizard.model.ts`)

### Top-level: `CreateClientWizardRequestDto`
- File: `create-client-wizard.model.ts:3-11`
```typescript
export interface CreateClientWizardRequestDto {
  id?: string;
  info: CreateClientInfoDto;
  settings: CreateClientSettingsDto;
  commChannels: CreateClientCommChannelsDto;
  applications: CreateClientApplicationDto;
  accountOwner: CreateClientAccountOwnerDto;
  deliveryMethod?: DeliveryMethod;   // @falcon enum
}
```

### Step 0: `CreateClientInfoDto`
- File: `create-client-wizard.model.ts:13-33`
```typescript
export interface CreateClientInfoDto {
  id?: string;
  profilePictureInfo?: AttachmentRequestModel | null;  // @falcon
  accountName?: string | null;
  financeId?: string | null;
  classificationCategory?: number | null;
  classificationSubCategory?: number | null;
  authorityLetterType?: number | null;
  entityName?: string | null;
  sector?: string | null;
  budgetNo?: string | null;
  countryId?: string | null;
  cityId?: string | null;
  district?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  postalCode?: string | null;
  additionalAddress?: string | null;
  anotherId?: string | null;
  vatRegistrationNumber?: string | null;
}
```

### Step 1: `CreateClientSettingsDto`
- File: `create-client-wizard.model.ts:35-43`
```typescript
export interface CreateClientSettingsDto {
  id?: string;
  passwordSecurityLevel?: PasswordSecurityLevel;  // @falcon enum Normal | Advanced
  allowedIPs?: string[];
  maxNormalUserLimit?: number;
  maxSystemUserLimit?: number;
  maxNodeLevel?: number;
  balanceTransferLimit?: number;
}
```

### `CreateClientServiceDto` (used by steps 2 + 3)
- File: `create-client-wizard.model.ts:45-53`
```typescript
export interface CreateClientServiceDto {
  id?: string;
  appId?: string;
  name: string;
  visibility: boolean;
  priceType?: number;
  priceValue?: number;
  status?: string;
}
```

### Step 2: `CreateClientCommChannelsDto`
- File: `create-client-wizard.model.ts:55-58`
```typescript
export interface CreateClientCommChannelsDto {
  id?: string;
  services?: CreateClientServiceDto[];
}
```

### Step 3: `CreateClientApplicationDto`
- File: `create-client-wizard.model.ts:60-63`
```typescript
export interface CreateClientApplicationDto {
  id?: string;
  services?: CreateClientServiceDto[];
}
```

### Step 4: `CreateClientAccountOwnerDto`
- File: `create-client-wizard.model.ts:65-76`
```typescript
export interface CreateClientAccountOwnerDto {
  id?: string;
  accountOwnerProfilePictureInfo?: AttachmentRequestModel | null;
  firstName?: string;
  lastName?: string;
  userName?: string;
  password?: string;
  nationalId?: string;
  phoneNumber?: string;
  emailAddress?: string;
  role?: UserRoles;
}
```

## Tabs / Hierarchy

### `TabConfig`
- File: `components/tabs-layout/model/models.ts:7-13`
```typescript
export interface TabConfig {
  value: string;
  labelKey: string;
  componentType: TabComponentType;
  enabled?: boolean;
  order?: number;
}
```
Re-exports: `TabComponentType`, `TabComponentTypeI18n` from `@falcon`.

### `UserListItem`
- File: `components/tabs-layout/components/hierarchy-tab/model/models.ts:7-17`
```typescript
export interface UserListItem extends OrgNodeListItem {
  username: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: number;
  url: string;
  permissionGroup: string;
  [key: string]: unknown;
}
```

## Information panel (`components/.../hierarchy-tab/components/information/models/models.ts`)

### `ProfilePictureInfo`
- File: `information/models/models.ts:1-4`
```typescript
export interface ProfilePictureInfo {
  extension?: string | null;
  fileBase64String?: string | null;
}
```

### `AccountInformationModel` (class — used as both response DTO + form model)
- File: `information/models/models.ts:6-38`
```typescript
export class AccountInformationModel {
  nodeId?: string | null = null;
  accountName = '';
  accountId = '';
  financeId = '';
  classificationCategory = '';      // string in TS, mapped to number on PUT
  classificationSubCategory = '';
  entityName = '';
  authorityLetterType = '';
  sector = '';
  budgetNo = '';
  country: any = null;               // either lookup value object or string id
  countryId: any = null;
  city: any = null;
  cityId: any = null;
  district = '';
  street = '';
  buildingNumber = '';
  postalCode = '';
  additionalAddress = '';
  anotherId = '';
  vatRegistrationNumber = '';
  profilePicture?: string | ProfilePictureInfo | null = null;   // base64 dataURL OR object
}
```

### `AccessSection`
- File: `information/models/models.ts:40-43`
```typescript
export enum AccessSection {
  AccountInformation = 'account-information',
  AccountOfficial    = 'account-official',
}
```

### `InformationPageMode`
- File: `information/models/models.ts:45-48`
```typescript
export enum InformationPageMode {
  View = 'VIEW',
  Edit = 'EDIT',
}
```

## Node settings tab (`components/.../node-settings-tab/models/model.ts`)

### `ClientSettingsModel`
- File: `node-settings-tab/models/model.ts:1-5`
```typescript
export class ClientSettingsModel {
  ownerId?: string;
  quotaSettings: QuotaSettingsDto = new QuotaSettingsDto();
  securitySettings: SecuritySettings = new SecuritySettings();
}
```

### `QuotaSettingsDto`
- File: `node-settings-tab/models/model.ts:7-15`
```typescript
export class QuotaSettingsDto {
  maxNormalUserLimit = 0;
  maxSystemUserLimit = 0;
  maxNodeLevels = 0;
  currentNodeLevels = 0;
  currentSystemUserLimit = 0;
  currentNormalUserLimit = 0;
  balanceTransferLimitPercentage = 0;
}
```

### `SecuritySettings`
- File: `node-settings-tab/models/model.ts:17-20`
```typescript
export class SecuritySettings {
  passwordSecurityLevel?: number;       // PasswordSecurityLevel enum value
  allowedIps: Array<string> = new Array<string>();
}
```

## Apps & services tab (`components/.../apps-services-tab/models/models.ts`)

### `AppServiceItem`
- File: `apps-services-tab/models/models.ts:3-19`
```typescript
export interface AppServiceItem {
  id: string;
  accountId: string;
  name: string;
  visibility: boolean;
  pricingType: PricingType | null;
  priceValue: number | null;
  firstActivationDate: string | null;
  activationDate: string | null;
  renewDate: string | null;
  renewDateDate?: Date | null;
  status?: FalconItemStatus;
  allowedActions?: FalconRowAction[];   // delivered by backend; gates row menu visibility
  canHide?: boolean;
  [key: string]: unknown;
}
```

### `GetAppsServicesResponse`
- File: `apps-services-tab/models/models.ts:21-23`
```typescript
export interface GetAppsServicesResponse { items: AppServiceItem[]; }
```

### Legacy update DTOs (unused — see 03)
- File: `apps-services-tab/models/models.ts:25-45`
```typescript
export interface UpdateAppPriceTypeRequest { id: string; pricingType: number; effectiveDate: string; }
export interface UpdateAppPriceTypeResponse { id: string; pricingType: number; effectiveDate: string; }
export interface UpdateAppPriceValueRequest { id: string; priceValue: number; }
export interface UpdateAppPriceValueResponse { id: string; priceValue: number; }
```

### `toFalconItemStatus(value)` (utility)
- File: `apps-services-tab/models/models.ts:47-66`
- Maps numeric or string status (`'active'|'inactive'|'expired'|'disabled'`) to `FalconItemStatus` enum. Defensive against backend payload drift.

## Comm-channels tab (`components/.../comm-channels-services-tab/models/models.ts`)

### `CommChannelServiceItem`
- File: `comm-channels-services-tab/models/models.ts:13-34`
- Structurally identical to `AppServiceItem` plus details-row fields: `newPriceType?: string`, `effectiveDate?: string`, `newPriceValue?: number`.

### `GetCommChannelsServicesResponse`, `UpdateCommChannelPriceTypeRequest/Response`, `UpdateCommChannelPriceValueRequest/Response`
- File: `comm-channels-services-tab/models/models.ts:39-75` — same shape as apps tab counterparts.

### `PriceType` (legacy string alias)
- File: `comm-channels-services-tab/models/models.ts:80`
```typescript
export type PriceType = 'Monthly' | 'Yearly' | 'One-time';
```
Note: actual price-type values are numeric (`PricingType` enum from `@falcon`). This type alias is unused in current code — flag for removal.

## Commerce gateway request/response shapes (`components/tabs-layout/components/models/models.ts`)

### `AccountScopedRequest` (base)
- File: `tabs-layout/components/models/models.ts:1-3`
```typescript
export interface AccountScopedRequest { accountId: string; }
```

### `AccountApplicationScopedRequest`, `AccountCommChannelScopedRequest`
- File: `tabs-layout/components/models/models.ts:5-12`
- Extend `AccountScopedRequest` with `applicationId` / `commChannelId`.

### `CommChannelPriority`
- File: `tabs-layout/components/models/models.ts:13-16`
```typescript
export interface CommChannelPriority {
  commChannelPriorityId: number;
  channelId: string;
}
```

### Action requests (extending base scopes)
- File: `tabs-layout/components/models/models.ts:19-49`
- 16 interfaces; key ones:
  - `ChangeAccountApplicationServiceVisibilityRequest`/...`CommunicationChannel...` (+ `visibility: boolean`)
  - `ChangeApplicationPriceValueRequest`/...`CommunicationChannel...` (+ `priceValue: number`)
  - `ChangeApplicationPriceTypeRequest`/...`CommunicationChannel...` (+ `pricingType: number, effectiveDate: string`)
  - `DoPaymentApplicationRequest`/...`CommunicationChannel...` (+ `commChannelPriorityIds?: CommChannelPriority[] | null`)
  - `EnableApplicationRequest`, `DisableApplicationRequest`, `EnableCommunicationChannelRequest`, `DisableCommunicationChannelRequest` (just base scope)
  - `DeleteApplicationNewPriceTypeRequest`, `DeleteApplicationNewPriceValueRequest`, `DeleteCommunicationChannelNewPriceTypeRequest`, `DeleteCommunicationChannelNewPriceValueRequest` (base scope only)

### Action responses (14 wrappers — `Record<string, unknown>`)
- File: `tabs-layout/components/models/models.ts:84-117`
- All defined as `type X = Record<string, unknown>` because the backend payloads vary per action. This is a placeholder — flag for proper typing when porting.

## Mapper utilities (`utils/org-hierarchy.mapper.ts`)
- `mapOrgNodeToTreeNode(node, isRootMapping?): TreeNode` — PrimeNG `TreeNode` builder; key fields: `treeNode.data = { id, url, isRootNode, isFalconNode, isMainMenu, isFirstLevelChild, isClientNode, raw: node }`.
- `mapOrgNodesToTreeNodes(nodes, isRootMapping?): TreeNode[]` — array mapper with root-node filtering (prevents root re-appearing as its own child).
- `updateTreeNodeChildren(treeNode, children): void` — in-place mutation for lazy-loaded children.

## External (@falcon) enums consumed
| Enum | Use site | Values (from PrimeNG/library) |
|---|---|---|
| `PricingType` | apps/comm-channel tabs + wizard steps 2/3 | (numeric — exact values defined in `libs/falcon`) |
| `ChannelStatus` | wizard step 2/3 | `Active`, `Inactive`, `Expired` |
| `PasswordSecurityLevel` | settings tab + wizard step 1 + account-owner password generation | `Normal`, `Advanced` |
| `UserRoles` | wizard step 4 | filtered to `[AccountOwner, NodeAdmin, NormalUser]` |
| `ClassificationCategory`, `ClassificationSubCategory`, `AuthorityLetterType` | info view + wizard step 0 | mapped via `helper.enumToOptions(enum, i18n, translate)` |
| `UserStatus` | hierarchy tab status badge | `Active, Pending, Suspended, Locked, Deleted` |
| `FalconItemStatus` | apps/comm-channel tab status cell | `None, Active, InActive, Expired, Disabled` |
| `FalconRowAction` | apps/comm-channel tab row menu | `DoPayment, Disable, Enable, EditPriceType, EditPriceValue` |
| `ProcessState` | payment polling | `Pending, Running, Completed, Failed` |
| `OrderFailureReason` | payment polling — failure routing | `InsufficientFunds, CommChannelPriorityOrderRequired, WalletNotConfigForTheNode, ...` |
| `USER_TYPE_STRINGS` | tab-visibility + info view edit gating | `FALCON_USER`, `CLIENT_USER` |
| `DeliveryMethod` | wizard finish — credential delivery | `Sms, Email, Both` (inferred from `<falcon-send-credentials-popup>`) |
| `TabComponentType` | `TabConfig` discriminator | `Hierarchy, CommChannelsServices, AppsServices, Settings` |

## External (@falcon) interface types consumed (passing only — not redefined here)
- `ServiceOperationResult<T>` — platform-wide response wrapper (`isSuccessful, result, errors, errorCodes`)
- `AttachmentRequestModel` (class) — used for profile-picture uploads (constructed with `new`, fields `extension`, `fileBase64String`)
- `GetOrderStatusResponse` — output of `OrderStatusService.getOrderStatus`
- `Hook<T>` — dropdown option model `{ name, value }`
- `LookupValueResponse` — country/city lookup payload
- `WizardState`, `WizardHostComponent`, `StepperConfig`, `DynamicStepperComponent` — host scaffolding for the create-client wizard
- `T2TableColumn<T>`, `T2RowMenuAction<T>`, `FalconInlineRowContext<T>`, `FalconCellContext<T>`, `FalconDetailsRowContext<T>`, `FalconRowActionEvent<T>` — falcon-table column/action shapes
- `AccessQuery` — `{ action: string, resource: string }` access query (declared in `libs/falcon/src/shared-types/lib/models/access-query.models.ts`)
- `FALCON_ROOT_NODE` — sentinel `OrgHierarchyNode` for Falcon-user synthetic root
- `FALCON_PATTERNS.EMAIL_STRING` — email regex used in account-owner step

## DTO drift notes
- `OrgHierarchyNode.id` is `string | null` (null = the synthetic Falcon root). All API responses with `id: null` are remapped to the `FALCON_ROOT_NODE.id` constant when filtering / rendering.
- `AccountInformationModel.classificationCategory` is typed `string` in TS but the API expects `number`. `InformationService.update()` does `Number(model.classificationCategory)` before sending — same for `classificationSubCategory` and `authorityLetterType`. New UI should normalize to numeric throughout.
- `AccountInformationModel.profilePicture` is a heterogeneous type (`string | ProfilePictureInfo`) — on GET it can come back as a base64 data URL string OR as an object. The PUT path normalizes back to PascalCase `{ Extension, FileBase64String }`. Flag for cleanup.
- `CreateClientServiceDto.priceType` is `number` here but `pricingType` (different field name) in the table-side `AppServiceItem` / `CommChannelServiceItem` — beware of the off-by-one naming when wiring submissions.
- `ClientSettingsModel.maxNodeLevel` (singular) in wizard DTO vs. `maxNodeLevels` (plural) in `QuotaSettingsDto` on the settings tab — same concept, different field name. Backend likely normalizes; new UI should pick one.
