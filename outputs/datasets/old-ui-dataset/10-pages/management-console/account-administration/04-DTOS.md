# DTOs — account-administration

## Request DTOs

### CreateSubNodeRequest
- File: `apps/.../organization-hierarchy/models/node-api.models.ts:29-32`
```typescript
interface CreateSubNodeRequest {
  id: string;
  name: string;
}
```
- Used by: `NodeApiService.updateNodeName()` (rename) — body, PUT

### UpdateSubNodeNameRequest
- File: `apps/.../organization-hierarchy/models/node-api.models.ts:33-36`
```typescript
interface UpdateSubNodeNameRequest {
  parentId: string;
  name: string;
}
```
- Used by: `NodeApiService.addNodeName()` (create child) — body, POST

### GeneratePasswordRequest
- File: `apps/.../organization-hierarchy/services/user-api.service.ts:6-8`
```typescript
interface GeneratePasswordRequest {
  passwordSecurityLevel: number;
}
```

### Account information `UpdateMainNodeInfoRequest` (C# PascalCase)
- File: `apps/.../information/service/information.service.ts:53-74` (constructed inline)
- Shape (PascalCase server-side):
```typescript
{
  NodeId: string;
  AccountName: string | null;
  AccountId: string | null;
  FinanceId: string | null;
  ClassificationCategory: number | null;
  ClassificationSubCategory: number | null;
  EntityName: string | null;
  AuthorityLetterType: number | null;
  Sector: string | null;
  BudgetNo: string | null;
  Country: string | null;
  City: string | null;
  District: string | null;
  Street: string | null;
  BuildingNumber: string | null;
  PostalCode: string | null;
  AdditionalAddress: string | null;
  AnotherId: string | null;
  VatRegistrationNumber: string | null;
  ProfilePicture: { Extension: string | null; FileBase64String: string | null } | null;
}
```

### Commerce mutation requests (shared base — `tabs-layout/components/models/models.ts:1-82`)
```typescript
interface AccountScopedRequest { accountId: string; }
interface AccountApplicationScopedRequest extends AccountScopedRequest { applicationId: string; }
interface AccountCommChannelScopedRequest extends AccountScopedRequest { commChannelId: string; }

interface CommChannelPriority {
  commChannelPriorityId: number;
  channelId: string;
}

// Visibility
interface ChangeAccountApplicationServiceVisibilityRequest extends AccountApplicationScopedRequest { visibility: boolean; }
interface ChangeAccountCommunicationChannelServiceVisibilityRequest extends AccountCommChannelScopedRequest { visibility: boolean; }

// Price value
interface ChangeApplicationPriceValueRequest extends AccountApplicationScopedRequest { priceValue: number; }
interface ChangeCommunicationChannelPriceValueRequest extends AccountCommChannelScopedRequest { priceValue: number; }

// Price type
interface ChangeApplicationPriceTypeRequest extends AccountApplicationScopedRequest { pricingType: number; effectiveDate: string; }
interface ChangeCommunicationChannelPriceTypeRequest extends AccountCommChannelScopedRequest { pricingType: number; effectiveDate: string; }

// Payment
interface DoPaymentApplicationRequest extends AccountApplicationScopedRequest { commChannelPriorityIds?: CommChannelPriority[] | null; }
interface DoPaymentCommunicationChannelRequest extends AccountCommChannelScopedRequest { commChannelPriorityIds?: CommChannelPriority[] | null; }

// Enable/disable — empty body, just IDs
interface EnableApplicationRequest extends AccountApplicationScopedRequest {}
interface DisableApplicationRequest extends AccountApplicationScopedRequest {}
interface EnableCommunicationChannelRequest extends AccountCommChannelScopedRequest {}
interface DisableCommunicationChannelRequest extends AccountCommChannelScopedRequest {}

// Delete pending price changes
interface DeleteApplicationNewPriceTypeRequest extends AccountApplicationScopedRequest {}
interface DeleteApplicationNewPriceValueRequest extends AccountApplicationScopedRequest {}
interface DeleteCommunicationChannelNewPriceTypeRequest extends AccountCommChannelScopedRequest {}
interface DeleteCommunicationChannelNewPriceValueRequest extends AccountCommChannelScopedRequest {}
```

### Apps/CommChannels inline price updates (legacy — not invoked by tabs)
```typescript
interface UpdateAppPriceTypeRequest      { id: string; pricingType: number; effectiveDate: string; }
interface UpdateAppPriceValueRequest     { id: string; priceValue: number; }
interface UpdateCommChannelPriceTypeRequest { id: string; pricingType: number; effectiveDate: string; }
interface UpdateCommChannelPriceValueRequest { id: string; priceValue: number; }
```

## Response DTOs

### GetNodeResponse (org tree node from backend)
- File: `apps/.../organization-hierarchy/models/node-api.models.ts:18-27`
```typescript
interface GetNodeResponse {
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

### OrgHierarchyNode (UI domain — mapped from response)
- File: `apps/.../organization-hierarchy/models/org-hierarchy.models.ts:8-20`
```typescript
interface OrgHierarchyNode {
  id: string | null;
  label: string;
  icon?: string;
  url?: string;
  hasChildren: boolean;
  path?: string | null;
  children?: OrgHierarchyNode[];
  isRootNode?: boolean;
  isMainMenu?: boolean;
  isFalconNode?: boolean;
  isFirstLevelChild?: boolean;
}
```

### OrgNodeListItem (right-pane list base) & UserListItem (extension)
- File: `apps/.../organization-hierarchy/models/org-hierarchy.models.ts:25-30` & `hierarchy-tab/model/models.ts:7-17`
```typescript
interface OrgNodeListItem {
  id: string;
  name: string;
  type?: string;
  [key: string]: unknown;
}

interface UserListItem extends OrgNodeListItem {
  username: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: number;
  url: string;
  permissionGroup: string;
}
```

### OrgNodeAction (context-menu / tree action)
- File: `apps/.../organization-hierarchy/models/org-hierarchy.models.ts:35-45`
```typescript
type OrgNodeActionType = 'add-node' | 'edit-node' | 'add-user' | 'view-details' | 'delete';

interface OrgNodeAction {
  actionId: OrgNodeActionType;
  nodeKey: string | null;
  nodeData?: unknown;
}
```

### UserInfoResponse (Identity user shape)
- File: `apps/.../organization-hierarchy/services/user-api.service.ts:26-39`
```typescript
interface UserInfoResponse {
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

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

### AccountInformationModel
- File: `apps/.../information/models/models.ts:6-38`
```typescript
class AccountInformationModel {
  nodeId?: string | null = null;
  // Information
  accountName = '';
  accountId = '';
  financeId = '';
  classificationCategory = '';
  classificationSubCategory = '';
  // Account Official
  entityName = '';
  authorityLetterType = '';
  sector = '';
  budgetNo = '';
  // Address
  country: any = null;
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
  // Profile Picture
  profilePicture?: string | ProfilePictureInfo | null = null;
}

interface ProfilePictureInfo {
  extension?: string | null;
  fileBase64String?: string | null;
}

enum AccessSection {
  AccountInformation = 'account-information',
  AccountOfficial = 'account-official',
}

enum InformationPageMode { View = 'VIEW', Edit = 'EDIT' }
```

### ClientSettingsModel + nested
- File: `apps/.../node-settings-tab/models/model.ts:1-20`
```typescript
class ClientSettingsModel {
  id?: string;
  quotaSettings: QuotaSettingsDto | null = null;
  securitySettings: SecuritySettings = new SecuritySettings();
}

class QuotaSettingsDto {
  maxNormalUserLimit = 0;
  maxSystemUserLimit = 0;
  maxNodeLevels = 0;
  currentNodeLevels = 0;
  currentSystemUserLimit = 0;
  currentNormalUserLimit = 0;
  balanceTransferLimitPercentage = 0;
}

class SecuritySettings {
  passwordSecurityLevel?: number;
  allowedIps: Array<string> = new Array<string>();
}
```

### CommChannelServiceItem
- File: `apps/.../comm-channels-services-tab/models/models.ts:13-34`
```typescript
interface CommChannelServiceItem {
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
  status: FalconItemStatus;
  allowedActions?: FalconRowAction[];
  newPriceType?: string;
  effectiveDate?: string;
  newPriceValue?: number;
  canHide?: boolean;
  [key: string]: unknown;
}
```

### AppServiceItem
- File: `apps/.../apps-services-tab/models/models.ts:3-19`
```typescript
interface AppServiceItem {
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
  allowedActions?: FalconRowAction[];
  canHide?: boolean;
  [key: string]: unknown;
}
```

### TabConfig
- File: `apps/.../tabs-layout/model/models.ts:7-13`
```typescript
interface TabConfig {
  value: string;
  labelKey: string;
  componentType: TabComponentType;  // from @falcon
  enabled?: boolean;
  order?: number;
}
```

## Shared / enums (from `@falcon`)
| Symbol | Origin |
|---|---|
| `FalconItemStatus` | enum: `None`, `Active`, `InActive`, `Expired`, `Disabled` |
| `FalconRowAction` | enum: `DoPayment`, `Disable`, `Enable`, `EditPriceType`, `EditPriceValue`, ... |
| `PricingType` | enum: `Monthly`, `Yearly`, `OneTimePayment` |
| `UserStatus` | enum: `Active`, `Pending`, `Suspended`, `Locked`, `Deleted` |
| `USER_TYPE_STRINGS` | `{ FALCON_USER, CLIENT_USER, ... }` |
| `ACCOUNT_USER_ROLES` | numeric role array used for list filtering at non-root nodes |
| `SYSTEM_USER_ROLES` | numeric role array used for list filtering at Falcon root |
| `PasswordSecurityLevel` | enum: `Normal`, `Advanced` |
| `ClassificationCategory` / `ClassificationCategoryI18n` | enum + i18n key map |
| `ClassificationSubCategory` / `ClassificationSubCategoryI18n` | enum + i18n key map |
| `AuthorityLetterType` / `AuthorityLetterTypeI18n` | enum + i18n key map |
| `ProcessState` | enum used by order polling: `Pending`, `Running`, `Completed`, `Failed` |
| `OrderFailureReason` | enum: `InsufficientFunds`, `WalletNotConfigForTheNode`, `CommChannelPriorityOrderRequired`, ... |
| `Currency` | passed to Helper for formatting |
| `LOOKUP_IDS` | `Country`, `City` (used by InformationComponent autocompletes) |
| `FALCON_ROOT_NODE` | sentinel constant for Falcon-user pseudo-root |

## ServiceOperationResult (response envelope)
All endpoints return `ServiceOperationResult<T>` from `@falcon`:
```typescript
interface ServiceOperationResult<T = unknown> {
  isSuccessful: boolean;
  result: T;
  errors: string[];
  errorMessages?: string[];   // legacy alias seen in some places
}
```
