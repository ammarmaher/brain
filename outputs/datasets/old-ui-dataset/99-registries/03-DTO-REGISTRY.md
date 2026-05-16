---
title: DTO Registry — Old UI (origin/main @ 803ac1d1)
type: registry
registry: dtos
source: aggregated from 10-pages/ deep-dives (origin/main @ 803ac1d1)
extracted: 2026-05-16
extracted-by: aggregation-agent
total_dtos: 285
---

# Old UI — DTO Registry

> Every TypeScript interface, class, type alias, and enum that participates in HTTP request/response or feature state. Grouped by feature. Cross-feature shared shapes promoted to `## Shared / platform-wide DTOs` section.

## Headline counts (per per-page README + extension)

| Feature | DTOs/types | Source |
|---|---|---|
| admin/organization-hierarchy | **45** | most DTO-heavy single feature |
| admin/wallet-balance-management | **22** (4 enums + 13 interfaces + 5 helpers/aliases + ...) | |
| admin/comms-hub | **22** | row + 8 shared request + 8 response + dialog DTOs |
| admin/contact-groups | **18** | + 3 constant maps |
| admin/contracts-cost-management | **30** | 17 form/state + 11 API-wire + 4 catalog constants |
| admin/marketplace-applications | **28** | 5 local + 15 shared mutation + 8 enum/shared |
| admin/testing-charging | **17** | 14 module-level + 3 inline component types |
| host/_core | **29** | Auth + User + nav + MF DTOs |
| host/auth | **12** | screen-level + state |
| host/dashboard | **4** | all internal mock-data |
| host/Demo | **1** | `FacadeRow` |
| host/user-profile | **24** | screen + wizard + node-API + OTP + role-catalog |
| host/error · not-found · unauthorized | **0** | |
| mgmt/account-administration | **50+** | wraps the admin org-hierarchy shapes 1:1 with mgmt deltas |

**Working total: ~285 named TS types** in the workspace. Deduplicated, the platform inventory is roughly 200 unique shapes after we collapse the `CommChannelServiceItem` / `AppServiceItem` / `OrgHierarchyNode` / `GetNodeResponse` / `UpdateMainNodeInfoRequest` duplicates that appear in both admin and mgmt.

## Index by feature
- [Shared / platform-wide DTOs](#shared--platform-wide-dtos)
- [Organization Hierarchy (admin) + Account Administration (mgmt)](#organization-hierarchy-admin--account-administration-mgmt) — 45 + 50
- [Wallet Balance Management](#wallet-balance-management) — 22 (admin) / 22 (mgmt mirror)
- [Comms Hub](#comms-hub) — 22 (admin) / 22+UI-extras (mgmt)
- [Contact Groups](#contact-groups) — 18 (admin) / 18 + 14 wizard (mgmt)
- [Contracts & Cost Management](#contracts--cost-management) — 30
- [Marketplace & Applications](#marketplace--applications) — 28
- [Testing Charging](#testing-charging) — 17
- [Host-Shell Core (Auth + User + Nav + MF)](#host-shell-core) — 29
- [Auth (login / OTP / forgot)](#auth) — 12
- [Dashboard / Demo / Error / 404 / 401](#placeholders) — 4 + 1 + 0
- [User Profile (host)](#user-profile-host) — 24

---

## Shared / platform-wide DTOs

### `ServiceOperationResult<T>` — universal response envelope
- From: `@falcon` (shared-types). Some callers cast `(response as any).errorMessages?.[0]` when the backend returns the legacy `errorMessages` array instead of `errors`.
```typescript
interface ServiceOperationResult<T = unknown> {
  isSuccessful: boolean;
  result: T;
  errors?: string[];
  errorMessages?: string[]; // legacy alias seen in some responses
}
```
- Used by: **every API call** in the workspace.

### `PagedResponse<T>` (host + admin org-hierarchy + identity user)
- File: `apps/host-shell/src/app/core/user/user.models.ts:70-75` + `apps/admin-console/src/app/features/organization-hierarchy/services/user-api.service.ts:19-24`
```typescript
interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

### `PagedResult<T>` (contact-groups / shared-types)
- File: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:54-59` — same shape as `PagedResponse<T>` but a different module location.

### `MultiLanguageName` (En/Ar) — platform standard
- Per CLAUDE.md: `MultiLanguageName(En, Ar)` for all user-facing text. Not directly typed in the feature files (consumed via `@falcon` translation system).

### `AccessQuery` — PES key
```typescript
interface AccessQuery {
  action: string;
  resource: string;
  attrs?: Record<string, unknown>;
  ignoreExpression?: boolean;
}
```
- File: `libs/falcon/src/shared-types/lib/models/access-query.models.ts` (referenced from every PES-using feature).

### Common Falcon enums (platform-wide)

```typescript
// libs/falcon/src/shared-types/lib/enums/globels.ts:57-61
enum PricingType { Monthly = 1, Yearly = 2, OneTimePayment = 3 }

// :110-116
enum FalconRowAction {
  DoPayment = 1,
  Disable = 2,
  Enable = 3,
  EditPriceType = 4,
  EditPriceValue = 5,
}

// :118-124
enum FalconItemStatus {
  None = 0,
  InActive = 1,
  Active = 2,
  Expired = 3,
  Disabled = 4,
}

// libs/falcon/src/shared-types/lib/enums/order-status.enums.ts:1-18
enum ProcessState { Pending = 1, Running = 2, Completed = 3, Failed = 4 }
enum OrderFailureReason {
  None = 0,
  InsufficientFunds = 1,
  CommChannelPriorityOrderRequired = 2,
  WalletNotConfigForTheNode = 3,
}
enum WalletType { SingleWallet = 1, MultipleWallets = 2 }
```

### `GetOrderStatusResponse` — polled by every page that does `do-payment`
- File: `libs/falcon/src/shared-types/lib/models/order-status.models.ts:3-7`
```typescript
interface GetOrderStatusResponse {
  status: ProcessState;
  failureReason?: OrderFailureReason | null;
  walletType: WalletType;
}
```

### `VisibleCommunicationChannelResponse` — used by every priority dialog
- File: `libs/falcon/src/shared-types/lib/models/communication-channel.models.ts:1-5`
```typescript
interface VisibleCommunicationChannelResponse {
  PriorityOrder: number;   // PascalCase from backend (also accepts camelCase fallback in normaliser)
  ChannelId: string;
  ChannelName: string;
}
```

---

## Organization Hierarchy (admin) + Account Administration (mgmt)

> Mgmt's `account-administration` feature wraps the admin org-hierarchy shapes 1:1 (same files, copied paths). Diffs noted inline.

### Domain — `OrgHierarchyNode` / `OrgNodeListItem` / `OrgNodeAction`
- File: `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts:8-43`
```typescript
interface OrgHierarchyNode {
  id: string | null;       // null = synthetic Falcon root
  label: string;
  icon?: string;
  url?: string;
  hasChildren: boolean;
  children?: OrgHierarchyNode[];
  isRootNode?: boolean;
  isMainMenu?: boolean;
  isFalconNode?: boolean;  // Deprecated — use isRootNode
  isFirstLevelChild?: boolean;
}

interface OrgNodeListItem {
  id: string;
  name: string;
  type?: string;
  [key: string]: unknown;
}

type OrgNodeActionType =
  | 'add-node' | 'edit-node' | 'add-client' | 'add-user' | 'view-details' | 'delete';

interface OrgNodeAction {
  actionId: OrgNodeActionType;
  nodeKey: string | null;
  nodeData?: unknown;
}
```

### Node API — `IResult<T>` / `GetNodeResponse` / `CreateSubNodeRequest` / `UpdateSubNodeNameRequest` / `CreateAccountResponse`
- File: `models/node-api.models.ts:8-37` + `services/node-api.service.ts:15-17`
```typescript
interface IResult<T> { isSuccess: boolean; message?: string; data?: T; errors?: string[]; }

interface GetNodeResponse {
  id: string; label: string; icon?: string; url?: string;
  hasChildren: boolean; path?: string | null;
  children?: GetNodeResponse[]; [key: string]: unknown;
}

interface CreateSubNodeRequest { id: string; name: string; }              // rename — id = parent
interface UpdateSubNodeNameRequest { parentId: string; name: string; }    // add child
type NodeApiResponse = IResult<GetNodeResponse>;
interface CreateAccountResponse { id: string; }
```

### User API — `GeneratePasswordRequest/Response` / `UserInfoResponse`
- File: `services/user-api.service.ts:6-39`
```typescript
interface GeneratePasswordRequest { passwordSecurityLevel: number; }
interface GeneratePasswordResponse { password: string; }
interface GetUsersByNodeRequest { nodeId?: string; }
interface UserInfoResponse {
  id: string; nodeId?: string | null;
  firstName: string; lastName: string; username: string;
  email?: string | null; phoneNumber?: string | null;
  roleKey: string; userType: number; status: number;
  permissionGroup: string; path?: string | null;
}
```

### Create Client wizard (5-step)
- File: `components/create-client-wizard/create-client-wizard.model.ts:3-76`
```typescript
interface CreateClientWizardRequestDto {
  id?: string;
  info: CreateClientInfoDto;
  settings: CreateClientSettingsDto;
  commChannels: CreateClientCommChannelsDto;
  applications: CreateClientApplicationDto;
  accountOwner: CreateClientAccountOwnerDto;
  deliveryMethod?: DeliveryMethod;
}
interface CreateClientInfoDto { /* 18 fields: accountName, financeId, classificationCategory, ..., vatRegistrationNumber */ }
interface CreateClientSettingsDto { /* passwordSecurityLevel, allowedIPs[], maxNormalUserLimit, maxSystemUserLimit, maxNodeLevel, balanceTransferLimit */ }
interface CreateClientServiceDto { id?: string; appId?: string; name: string; visibility: boolean; priceType?: number; priceValue?: number; status?: string; }
interface CreateClientCommChannelsDto  { id?: string; services?: CreateClientServiceDto[]; }
interface CreateClientApplicationDto   { id?: string; services?: CreateClientServiceDto[]; }
interface CreateClientAccountOwnerDto  { /* firstName/lastName/userName/password/nationalId/phoneNumber/emailAddress/role */ }
```

### Tabs — `TabConfig` / `UserListItem`
```typescript
interface TabConfig { value: string; labelKey: string; componentType: TabComponentType; enabled?: boolean; order?: number; }
interface UserListItem extends OrgNodeListItem {
  username: string; firstName: string; email: string; phoneNumber: string;
  role: string; status: number; url: string; permissionGroup: string;
}
```

### Information panel — `AccountInformationModel` (class) / `ProfilePictureInfo` / `AccessSection` / `InformationPageMode`
- File: `hierarchy-tab/components/information/models/models.ts:1-48`
```typescript
interface ProfilePictureInfo { extension?: string | null; fileBase64String?: string | null; }

class AccountInformationModel {
  nodeId?: string | null = null;
  accountName = ''; accountId = ''; financeId = '';
  classificationCategory = ''; classificationSubCategory = '';  // string in TS, number on wire
  entityName = ''; authorityLetterType = ''; sector = ''; budgetNo = '';
  country: any = null; countryId: any = null; city: any = null; cityId: any = null;
  district = ''; street = ''; buildingNumber = ''; postalCode = '';
  additionalAddress = ''; anotherId = ''; vatRegistrationNumber = '';
  profilePicture?: string | ProfilePictureInfo | null = null;   // heterogeneous
}

enum AccessSection { AccountInformation = 'account-information', AccountOfficial = 'account-official' }
enum InformationPageMode { View = 'VIEW', Edit = 'EDIT' }
```

### Settings tab — `ClientSettingsModel` / `QuotaSettingsDto` / `SecuritySettings`
- File: `node-settings-tab/models/model.ts:1-20`

### Apps + Comm-channels tab DTOs — `AppServiceItem` / `CommChannelServiceItem`
- Files: `apps-services-tab/models/models.ts:3-23`, `comm-channels-services-tab/models/models.ts:13-34`
- Shared shape (CommChannelServiceItem extends with details-row fields `newPriceType`, `effectiveDate`, `newPriceValue`).

### Commerce-gateway shared shapes — `AccountScopedRequest` / `AccountApplicationScopedRequest` / `AccountCommChannelScopedRequest` / `CommChannelPriority` + 16 action requests + 14 response aliases
- File: `tabs-layout/components/models/models.ts:1-117`
- All response types declared as `Record<string, unknown>` placeholder.

### Mgmt-only deltas (`apps/management-console/.../account-administration/...`)
- Same base files copied — same interfaces, same enum values.
- 50+ DTOs total when counting class duplicates per the per-page README.

---

## Wallet Balance Management

### Enums (8)
- `Currency`, `WalletBalanceType`, `WalletType`, `NodeType`, `TransferMode`, `EntityType`, `TransferEntityType`, `TransferErrorCode`
- All declared in `models/wallet-balance.models.ts` + `models/transfer.models.ts`. See per-page DTO doc for exact value mappings.

### Hierarchy / Strategy DTOs
```typescript
interface ISaveBalancesRequest { ownerId: string; currency: Currency; walletBalanceType: WalletBalanceType; walletType: WalletType; }
interface IWalletQuery { selectedNodeId: string; currency: Currency; balanceDistribution: WalletBalanceType; walletStructure: WalletType; parentNodeId?: string | null; }

interface IWalletDataResponse { accountInfo: IWalletAccountInfo; channels: IChannel[]; summary: IWalletSummary; node: IBalanceNode; canSave: boolean; }
interface IWalletAccountInfo { accountId: string; accountName: string; accountImage: string; }
interface IWalletSummary { masterWalletId: string; totalBalance: number; currency: Currency; channelWallet?: IChannelBalance[]; walletBalanceType: WalletBalanceType; walletType: WalletType; }
interface IChannel { id: string; name: string; displayOrder: number; }
interface IChannelBalance { channelId: string; walletId: string | null; balance: number; name: string; }
interface IBalanceNode { id: string; parentId?: string | null; nodeType: NodeType; name: string; expandable: boolean; icon?: string; balance?: number | null; channelBalances?: IWalletChannelBalance[]; disabled?: boolean; children?: IBalanceNode[]; }
interface IWalletChannelBalance { balance: number; channelId: string; walletId: string | null; }
interface IBalanceChange { nodeId: string; nodeType: NodeType; channelId?: string; walletId?: string; amount: number | null; }  // declared but unused
```

### Transfer DTOs
```typescript
interface ITransferRequest { amount: number; currency: Currency; description?: string; source: ITransferEndpoint; destination: ITransferEndpoint; }
interface ITransferEndpoint { walletId?: string; channelId?: string; }
interface ITransferResponse { success: boolean; message?: string; transactionId?: string; errorCode?: TransferErrorCode; }
interface ITransferEntity { id: string; name: string; type: TransferEntityType; icon?: string; channelId?: string; balance?: number | null; nodeType?: NodeType; channelBalances?: Array<{ balance: number; channelId: string; walletId: string | null; }>; }
interface ITransferWallet { id: string; name: string; channelId?: string; balance?: number | null; }
interface ITransferContext { /* 11 fields: mode, fromMasterWallet, isFalconUser, preSelectedSource?, sourceEntities, destinationEntities, availableWallets, masterWallet, currency, balanceDistribution, channels */ }
```

### Type aliases + helpers
- `DraftKey = string` (composite `${nodeId}::${channelId|'single'}`)
- `DraftMap = Map<DraftKey, number | null>`
- Helpers: `createDraftKey`, `parseDraftKey`, `isDescriptionRequired`, `toBackendEntityType`, plus 4 translation-key lookups

### Constants
- `WALLET_BALANCE_TRANSLATION_KEYS` (map)

---

## Comms Hub

### Domain — `CommChannelServiceItem` (admin lean / mgmt extended)
- File (admin): `apps/admin-console/src/app/features/comms-hub/models/models.ts:11-32`
- Mgmt mirror adds 9 UI-extras (`subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`).

### Local request/response wrappers (declared, mostly dead)
- `GetCommChannelsServicesResponse`, `UpdateCommChannelPriceTypeRequest/Response`, `UpdateCommChannelPriceValueRequest/Response`, `PriceType` (string union — unused).

### Shared commerce request/response shapes (reused from org-hierarchy)
- 8 request types extending `AccountCommChannelScopedRequest` (visibility / price-type / price-value / do-payment / enable / disable / delete-new-price-type / delete-new-price-value)
- 8 response type aliases (all `Record<string, unknown>`)
- Plus base `AccountScopedRequest`, `AccountCommChannelScopedRequest`, `CommChannelPriority`

### Dialog DTO
- `CommChannelPriority` shape duplicated inside `insufficient-balance-priority-dialog.component.ts:21-24`.

### `toFalconItemStatus(value)` helper — accepts numeric or string status, returns enum value or `None`.

---

## Contact Groups

### Request DTOs
- `GetContactGroupsRequestParams` (libs/falcon shared-types) — `{ nodeId?, page?, pageSize? }`
- `UpdateContactGroupRequest` (admin detail) — `{ groupId, name, referenceId?, sharePolicy }`

### Response DTOs (workspace-shared)
- `ContactGroupListItemDto` — `{ id, name, referenceId?, status, createdByUserId, createdByDisplayName, createdByUsername, createdAt, sharePolicy, uploadedContacts, isDeleted? }`
- `ContactGroupSharedUserDto` — `{ userId, firstName, lastName, username }`
- `SharePolicyDto` — `{ sharedWithAllUsers, sharedUsers? }`
- `ContactGroupDetailDto` — 14-field detail view (with `isCreator`, `columnDefinitions`, `statistics`, `files`)
- `ContactGroupDetailSharedUserDto` (mirror of list-level)
- `ColumnDefinitionDto`, `GroupStatisticsDto`, `FileAvailabilityDto`
- `ContactGroupContactItem` — dynamic schema (`{ id: string; [key: string]: unknown }`)
- `ContactGroupContactsResponseDto`
- `ContactGroupFileDownloadDto` — `{ downloadUrl, fileName, expiresInSeconds }` (pre-signed URL)
- `SharedUserOption` — `{ userId, firstName, lastName, displayName, username }`
- `IdentityUserInfoDto` (private to service)

### View-model
- `ContactGroupTableRowVm` — `{ id, contactsName, referenceId, createdByUserId, createdByName, createdByUsername, creationDate, creationTime, uploadedContacts, status, statusCode, processedRows, totalRows, sharedWith: FalconChipItem[], isDeleted }`
- `ContactGroupListResult` — local API wrapper

### Enums + constants
```typescript
enum ContactGroupStatus { InProgress = 1, Completed = 2 }
enum ContactGroupFileType { Original = 1, Validated = 2 }
const CONTACT_GROUP_STATUS_LABELS / _I18N / _STYLE   // 3 maps
```

### Permission shapes (local)
- `ContactGroupPermissionFlags` (8 bools), `RowActionFlags` (3 bools)
- `rowFlags(row, session, flags)` overlay helper — applies `isOwner` via `session.identityUserId === row.createdByUserId` (NEVER use `session.subjectId`)

### Mgmt-only wizard DTOs (14 additional)
- `InitUploadSessionRequest/Response`, `UploadConfigResponse`, `CompleteUploadResponse`, `UploadPreviewResponse`
- `CreateContactGroupRequest/Response`, `ShareGroupRequest`, `ShareContactGroupSharedUser`, `ShareableUser`

---

## Contracts & Cost Management

### Form/state DTOs (`contracts.models.ts`)
- `ContractStatus = 'active' | 'pending' | 'expired'`
- `ContractRow`, `ContractsSelectOption`, `WalletStrategySettings`
- `ContractUnitConversionRow` (Step 2 rate-card)
- `ContractRateRow` (Step 3 rate-matrix flattened)
- `ContractRateMatrixCell` / `ContractRateMatrixRow` / `ContractRateMatrixState`
- `ContractQuotaRow` (Step 4 addons)
- `ContractOverageRateRow` (Step 4 overage)
- `ContractTariffPlan`, `ContractDetails`, `ContractFormValue`

### Catalog constants (`as const`)
- `CONTRACT_UNIT_CONVERSION_CATALOG` (3 channels — WhatsApp / Voice / AI-ChatGPT)
- `CONTRACT_RATE_PRIORITIES` (4 — AUTHENTICATION / UTILITY / ADVERTISEMENT / SERVICE)
- `CONTRACT_VOICE_RATE_PRIORITIES` (3 — HIGH / NORMAL / VERY_LOW)
- `CONTRACT_RATE_DESTINATIONS` (11 ISO codes)
- `CONTRACT_ADDON_CATALOG` (5 addon types)

### API-wire DTOs (private to `contracts-api.service.ts`)
- `ApiContractListResponse`, `ApiContractSummary`, `ApiContractResponse`, `ApiContractTariffPlan`
- `ApiContractUnitConversion`, `ApiContractRate`, `ApiContractQuota`, `ApiContractOverageRate`
- `ApiWalletSettings`, `ApiContractBalanceSummariesResponse`, `ApiContractBalanceSummary`
- `ApiApplicationOption`, `ApiChannelOption`

### Helpers / utilities
- `normalizeContractStatus`, `currencyCodeFromEnum`, `createDefaultUnitConversions`, `canEditContractStatus`, `hasRestrictedContractCommercialFields`

---

## Marketplace & Applications

### Feature-owned
- `AppServiceItem` — same as org-hierarchy apps-tab
- `GetAppsServicesResponse` (declared, unused)
- `UpdateAppPriceTypeRequest/Response` (declared, unused)
- `UpdateAppPriceValueRequest/Response` (declared, unused)
- `toFalconItemStatus` helper

### Mgmt-only deltas
- `MarketplaceApplicationItem` — extends `AppServiceItem` shape with UI-extras (`subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`)
- `UpdateMarketplacePriceTypeRequest/Response`, `UpdateMarketplacePriceValueRequest/Response` (mgmt-side wrappers)

### Inherited from `organization-hierarchy` shared
- 15 request types (visibility / price-type / price-value / do-payment / enable / disable / delete-new-price-type/value for application + comm-channel)
- 15 response type aliases (all `Record<string, unknown>`)

---

## Testing Charging

### Generic envelope
- `TestingChargingPagedResponse<T>` — `{ page, pageSize, totalCount, items }`

### Response DTOs (13)
- `TestingChargingAccount` (with `subscribedApplications`, `subscribedOwners`, `lastTestingRun`)
- `TestingChargingAccountApplication`, `TestingChargingAccountOwner`
- `TestingChargingOverview`
- `TestingChargingWallet` (with `expanded?: boolean` UI-only)
- `TestingChargingBucket` (recently extended with `effectiveFromLocalDateTime`, `expiresAtLocalDateTime`, `businessTimeZone` per latest commit)
- `TestingChargingReservation`, `TestingChargingLedgerEntry`
- `TestingChargingBalances`, `TestingChargingBalanceSnapshot`, `TestingChargingContractBalanceSummary`
- `TestingChargingRun` (21 fields including `messages[]`)
- `TestingChargingMessageRecord`

### Request DTOs (2)
- `TestingChargingCreateWhatsappBatchRequest` (13 fields, 11 with template-constrained ranges)
- `TestingChargingTriggerDeliveryRequest`

### Inline component types (3, not exported)
- `TestingChargingTab` union: `'overview' | 'wallets' | 'buckets' | 'reservations' | 'ledger' | 'balances' | 'runs' | 'simulator'`
- `TestingChargingSelectOption`, `TestingChargingOwnerOption`

---

## Host-Shell Core

### Auth request DTOs (`apps/host-shell/src/app/core/auth/auth.models.ts`)
- `LoginRequest { username, password }`
- `VerifyOtpRequest { sessionId, code }` / `ResendOtpRequest { sessionId }`
- `ForgotPasswordRequest { username, phoneNumber, deliveryMethod }`
- `ForgotPasswordSetPasswordRequest { sessionId, newPassword }`
- `FirstLoginSetupRequest { sessionId, newPassword }`
- `SetPasswordRequest { sessionId, newPassword, confirmPassword }`

### Auth response DTOs
- `AuthenticatedResult { accessToken, refreshToken, expiresIn }`
- `LoginStepResult` — 13 fields (stage, requiresOtp, requiresPasswordChange, otpCodeLength, otpExpiresInSeconds, tokens, devOtpCode, otpCode, accessToken, refreshToken, idToken, expiresIn)
- `AuthSessionResult` (declared but unused — potential legacy)

### Auth enum
```typescript
enum AuthenticationStage {
  PasswordPending = 1,
  OtpPending = 2,
  PasswordChangeRequired = 3,
  Authenticated = 4,
  Failed = 5,
  OtpVerified = 6,
}
```

### User DTOs (host core — `core/user/user.models.ts`)
- `UserPersonalInformation` (nested)
- `ProfilePictureInfo` (class)
- `CreateUserRequest`, `UserExistRequest`, `GeneratePasswordRequest`
- `ChangeUserStatusRequest`, `UpdateUserProfileRequest`, `UpdateUserRoleRequest`
- `GetUsersByNodeRequest`
- `UserResponse` (18 fields), `UserInfoResponse` (13 fields)
- `CreateUserResponse` (13 fields), `ExistResponse { exist }`, `GeneratePasswordResponse { password }`
- `ChangePasswordRequest` (layout — `{ oldPassword, newPassword, confirmNewPassword }`)
- Re-exports from `@falcon`: `UserType`, `DeliveryMethod`, `PasswordSecurityLevel`, `UserStatus`

### Layout / nav DTOs (`apps/host-shell/src/app/layout/model/models.ts`)
- `NavItem` (12 fields including `requiredUserTypes`, `access`, `safePath`, `children`)
- `User { name, role, avatar }`
- `Breadcrumb { label, url }`

### Module-Federation (`core/services/remote-config.ts`)
- `RemoteDefinition` (11 fields)
- `RemoteExposeType` enum (`Component | Module | Routes | RoutingModule`)
- `RemoteEntryType` enum (`Manifest | RemoteEntry`)
- `RemoteConfig = Record<string, RemoteDefinition>`

### Auth-flow state (`features/auth/services/auth-flow-state.service.ts`)
- `LoginDTO { userName, password }`
- `OtpConfig { seconds, length }`
- `AuthFlowState { credentials, sessionId, otpConfig, firstLogin }`
- Persisted in `sessionStorage['falcon_auth_flow']`

---

## Auth

### Screen-level Request DTOs
- `LoginRequest { userName, password }` (note: `userName` form-field; mapped to backend `username` by `LoginService`)
- `CheckOtpRequest { sessionId, otp }` (mapped to backend `code`)
- `ResendOtpRequest { sessionId }`
- `ChangePasswordRequest { userName, password, newPassword, confirmPassword }`
- `ForgotPasswordRequestPayload { userName, phoneNumber, deliveryMethod }`
- `ForgotPasswordVerifyOtpPayload { sessionId, otp }`
- `ForgotPasswordSetPasswordPayload { sessionId, newPassword }`

### Re-exports (from `core/auth/auth.models.ts`)
- `LoginRequest` (backend shape), `LoginStepResult` (as `LoginResponse`, `CheckOtpResponse`, `ResendOtpResponse`)
- `FirstLoginSetupRequest`, `SetPasswordRequest`

### State DTOs (re-from core)
- `LoginDTO`, `OtpConfig`, `AuthFlowState`

---

## User Profile (host)

### Screen-level
- `UserProfile` (16 fields)
- `SaveUserProfileRequest` (14 fields)
- `ProfilePageMode` enum (`View | Edit | Add`)

### Wizard DTOs
- `UserCreateRequest { nodeId?, path?, tenantId?, personalInfo, roleStatus, deliveryMethod? }`
- `PersonalInformationModel` (9 fields)
- `RoleStatusModel { userStatus?, roleKey? }`

### Node-API
- `GetNodeResponse` (host-shell flavor — adds `tenantId?: string | null` vs admin/mgmt)

### Profile-OTP
- `SendProfileOtpRequest { field: VerifiableField, value }`
- `VerifyProfileOtpRequest { field: VerifiableField, value, otp }`
- `SendProfileOtpResponse = boolean`
- `VerifyProfileOtpResponse = boolean`

### Role-catalog
- `RoleCatalogItem { id?, tenantId?, englishName, arabicName, roleKey, isBuiltIn }`
- `RoleOption { label, value, roleKey, isBuiltIn }`
- `TargetRoleUserType = 'system' | 'account'`

---

## Placeholders

### Dashboard (4 internal interfaces, all mock data — no backend)
- `StatCard { label, value, change, icon, color }`
- `RecentActivity { action, target, time, icon, color }`
- `ServiceStatus { name, status, usage }`
- `RevenueData { month, value }`

### Demo
- `type FacadeRow = { key: string; value: string }`

### Error / Not Found / Unauthorized
- **0 DTOs**. Pure UI fallback components.

---

## DTO drift notes (cross-feature)

- **`OrgHierarchyNode.id` is `string | null`** — null sentinels for the synthetic Falcon root. All API responses remapped to `FALCON_ROOT_NODE.id` for filtering.
- **`AccountInformationModel.classificationCategory` typed `string`, wire-shape numeric** — `InformationService.update()` does `Number(model.classificationCategory)` before sending. Same for `classificationSubCategory` and `authorityLetterType`. Should normalize to `number`.
- **`AccountInformationModel.profilePicture` is heterogeneous (`string | ProfilePictureInfo`)** — backend sometimes returns base64 dataURL string, sometimes object. PUT path normalizes back to PascalCase `{ Extension, FileBase64String }`.
- **`CreateClientServiceDto.priceType` vs `AppServiceItem.pricingType`** — same concept, different field name. Beware off-by-one when wiring submissions.
- **`ClientSettingsModel.maxNodeLevel` vs `QuotaSettingsDto.maxNodeLevels`** — wizard DTO is singular, settings tab DTO is plural. Likely backend-tolerant; new UI should pick one.
- **`PriceType` string union (`'Monthly' | 'Yearly' | 'One-time'`)** declared in comms-hub + apps-tab models — **never used**; the live type is the numeric `PricingType` enum. Flag for removal.
- **`UpdateCommChannelPriceType{Request,Response}`, `UpdateCommChannelPriceValue{Request,Response}`, `UpdateAppPriceType{Request,Response}`, `UpdateAppPriceValue{Request,Response}`** — declared in feature-local models + as service methods, but components call `CommerceActionsService` (which routes to `commerce/node/comm-channel/price-type` and friends) instead. Dead code.
- **`InformationService.update()` sends PascalCase body** — the only endpoint in the workspace that hand-builds a PascalCase request matching the C# DTO name. Every other call uses the platform standard camelCase serialization.
- **All 14+15 `Record<string, unknown>` response types** on `CommerceGatewayService` — placeholder typing. Backend payloads contain at least `orderId` for `do-payment`. Should narrow.
- **`PagedResponse<T>` vs `PagedResult<T>`** — see Shared section. Same shape, two locations.
- **`IResult<T>`** (node-api locals) is independent of `ServiceOperationResult<T>` — different envelope. `NodeApiResponse = IResult<GetNodeResponse>` is the only consumer.
