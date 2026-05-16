---
title: API Registry — Old UI (origin/main @ 803ac1d1)
type: registry
registry: api
source: aggregated from 10-pages/ deep-dives (origin/main @ 803ac1d1)
extracted: 2026-05-16
extracted-by: aggregation-agent
backend_services: 7
total_endpoints: 88
---

# Old UI — API Registry

> Every HTTP endpoint observed in the workspace. URL patterns aggregated and deduplicated. Each row carries the canonical caller; cross-feature reuse is noted in the "Used by" column.

## Headline counts (canonical URL × method)

- **Commerce** — 42 endpoints (`commerce/*`, `api/commerce/*`)
- **Charging** — 3 endpoints (`charging/*`)
- **Identity** — 18 endpoints (8 `auth/*` + 9 `identity/user/*` + 1 `user/generate-password`)
- **Contact Group** — 13 endpoints (`contactgroup/*`)
- **Testing Charging** — 10 endpoints (`api/testing/charging/*`)
- **PES** — 1 endpoint (`pes/roles`)
- **System-Gateway aggregator** — 1 endpoint (`api/commerce/accounts/{id}/hierarchy`)
- **Module-Federation manifest fetch** — 1 static asset (not platform API)

**Total distinct endpoints: 88** (88 URL × method × gateway combinations).

## Backend-service mapping (URL prefix → backend)

| URL prefix | Routed via | Backend service |
|---|---|---|
| `commerce/*` (admin) | System Gateway (`falcon-int-system-gateway-svc`, dev :7256) | **Falcon Core Commerce Service** (`falcon-core-commerce-svc`, dev :7045) |
| `commerce/*` (mgmt) | Core Gateway (`falcon-int-core-gateway-svc`, dev :7038) | **Falcon Core Commerce Service** |
| `api/commerce/accounts/{id}/hierarchy` | System Gateway aggregator (joins Commerce + Charging at gateway) | **Falcon Core Commerce Service + Charging Service** (gateway-side aggregation) |
| `charging/*` | App-default Gateway (System for admin, Core for mgmt) | **Falcon Core Charging Service** (`falcon-core-charging-svc`, dev :7224) |
| `charging/wallet/transfer` (mgmt only) | **Charging Gateway** (explicit `useGateway(Gateway.ChargingGateway)`) | **Falcon Core Charging Service** |
| `auth/*` | Identity Gateway (`useGateway(Gateway.IdentityGateway)`) | **Falcon Core Identity Service** (`falcon-core-identity-svc`, dev :8080) |
| `identity/user/*` | App-default Gateway (or explicit Identity) | **Falcon Core Identity Service** |
| `user/generate-password` (admin org-hierarchy) | Identity Gateway (explicit) | **Falcon Core Identity Service** |
| `contactgroup/*` | App-default Gateway → System/Core Gateway rewrites `/contactgroup/*` → upstream `/api/contact-groups/*` | **Falcon Core Contact Group Service** (`falcon-core-contact-group-svc`) |
| `pes/roles` | Direct via `baseURLPes` (bypasses gateway) | **Falcon PES Service** |
| `api/testing/charging/*` | System Gateway YARP route (feature-flagged) | **Falcon Core Charging Service** (testing/QA controller, requires `TestingCharging` flag enabled in both system-gateway and charging) |

Every endpoint returns the platform envelope `ServiceOperationResult<T>` (`isSuccessful: boolean; result: T; errors?: string[]; errorMessages?: string[]`). Auth: Zitadel JWT Bearer attached by host-shell `RequestInterceptor` (`apps/host-shell/src/app/core/interceptors/request-interceptor.ts:8-62`).

Every business call (excluding `auth/*` and `pes/*`) is sent through the Falcon `useGateway()` HttpContext (`libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137`). The `RuntimeBaseUrlInterceptor` substitutes the configured gateway base URL (`baseURL{System,Core,Charging,Identity}Gateway`).

---

## 1. Commerce endpoints (42)

### 1.1 Commerce — Node tree + hierarchy (5)

| Method | URL pattern | Caller (service.method) | Request DTO | Response DTO | Used by |
|---|---|---|---|---|---|
| GET | `commerce/Node` | `OrgHierarchyApiService.getRootNodes()` | n/a | `ServiceOperationResult<GetNodeResponse[]>` | admin: org-hierarchy, wallet-balance, comms-hub, contact-groups, contracts, marketplace, user-profile (host); mgmt: account-administration, contact-groups, contracts |
| GET | `commerce/Node?NodeId={parentId}` | `OrgHierarchyApiService.getChildren(parentId)` | querystring | `ServiceOperationResult<GetNodeResponse[]>` | same as above |
| PUT | `commerce/Node/changeNodeName` | `NodeApiService.updateNodeName(model)` | `CreateSubNodeRequest { id, name }` | `ServiceOperationResult<CreateSubNodeRequest>` | admin: org-hierarchy; mgmt: account-administration |
| POST | `commerce/Node/create-SubNode` | `NodeApiService.addNodeName(model)` | `UpdateSubNodeNameRequest { parentId, name }` | `ServiceOperationResult<CreateSubNodeRequest>` | admin: org-hierarchy; mgmt: account-administration |
| POST | `commerce/Node/create-account` | `NodeApiService.createAccount(wizardModel)` | `CreateClientWizardRequestDto` (5-step wizard) | `ServiceOperationResult<{ id }>` | admin: org-hierarchy (Create Client wizard) |

### 1.2 Commerce — Node-scoped settings + information (4)

| Method | URL pattern | Caller | Request DTO | Response DTO | Used by |
|---|---|---|---|---|---|
| GET | `commerce/Setting?ownerId={id}` | `SettingsApiService.getSecuritySettings(ownerId)` | querystring | `ServiceOperationResult<ClientSettingsModel>` | admin/mgmt: org-hierarchy settings-tab |
| PUT | `commerce/Setting` | `SettingsApiService.updateSecuritySettings(req)` | `ClientSettingsModel` | `ServiceOperationResult<ClientSettingsModel>` | admin/mgmt: org-hierarchy settings-tab |
| GET | `commerce/information?NodeId={id}` | `InformationService.get(nodeId)` | querystring | `ServiceOperationResult<AccountInformationModel>` | admin/mgmt: org-hierarchy hierarchy-tab info |
| PUT | `commerce/information` | `InformationService.update(nodeId, model)` | PascalCase `UpdateMainNodeInfoRequest` (`{NodeId, AccountName, AccountId, FinanceId, ClassificationCategory, ClassificationSubCategory, EntityName, AuthorityLetterType, Sector, BudgetNo, Country, City, District, Street, BuildingNumber, PostalCode, AdditionalAddress, AnotherId, VatRegistrationNumber, ProfilePicture: { Extension, FileBase64String }}`) | `ServiceOperationResult<AccountInformationModel>` | admin/mgmt: org-hierarchy hierarchy-tab info |

### 1.3 Commerce — Global lookups (2)

| Method | URL pattern | Caller | Response | Used by |
|---|---|---|---|---|
| GET | `commerce/application` | `ApplicationApiService.list()` | `ServiceOperationResult<any[]>` | admin: org-hierarchy create-client wizard Step 3 |
| GET | `commerce/communicationChannel` | `CommunicationChannelApiService.list()` | `ServiceOperationResult<any[]>` | admin: org-hierarchy create-client wizard Step 2 |

### 1.4 Commerce — Per-node application + comm-channel lists (4)

| Method | URL pattern | Caller | Response | Used by |
|---|---|---|---|---|
| GET | `commerce/Node/{nodeId}/applications` | `AppsServicesService.getList(nodeId)` / `MarketplaceApplicationsService.getList(nodeId)` | `ServiceOperationResult<AppServiceItem[]>` | admin: org-hierarchy apps-tab, marketplace-applications, contracts (lookup); mgmt: account-administration apps-tab, marketplace-applications |
| GET | `commerce/Node/{nodeId}/comm-channels` | `CommsHubService.getList(nodeId)` (admin) | `ServiceOperationResult<CommChannelServiceItem[]>` | admin: comms-hub |
| GET | `commerce/Node/{nodeId}/comm-channels/visible` | `CommunicationChannelsApiService.getVisibleChannels(nodeId)` | `ServiceOperationResult<VisibleCommunicationChannelResponse[]>` | admin: comms-hub, marketplace, contracts (lookup), org-hierarchy priority dialog; mgmt: same |
| GET | `commerce/Node/{nodeId}/comm-channels/visible/details` | `CommChannelsServicesService.getList(nodeId)` (mgmt) / `CommsHubService.getList(nodeId)` (mgmt comms-hub) | `ServiceOperationResult<CommChannelServiceItem[]>` | mgmt: account-administration comm-channels-tab + comms-hub |

### 1.5 Commerce — Node legacy price updates (4, dead code — kept for reference)

| Method | URL pattern | Caller | Notes |
|---|---|---|---|
| PUT | `commerce/Node/priceType?NodeId={id}` | `AppsServicesService.updatePriceType()` / `CommChannelsServicesService.updatePriceType()` | Declared but unused — superseded by `node/application/price-type` and `node/comm-channel/price-type` below |
| PUT | `commerce/Node/priceValue?NodeId={id}` | `AppsServicesService.updatePriceValue()` / `CommChannelsServicesService.updatePriceValue()` | Same — dead code |

### 1.6 Commerce — Node action surface (`commerce/node/*`, 16)

> Lives on `CommerceGatewayService` (`apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts:42-217`). Mirrored byte-for-byte in mgmt-console's `account-administration/.../commerce-gateway.service.ts`. Every mutation routes through the app-default gateway.

| Method | URL pattern | Caller | Request DTO | Response DTO |
|---|---|---|---|---|
| PUT | `commerce/node/comm-channel/visibility` | `CommerceGatewayService.changeCommChannelVisibility(req)` | `ChangeAccountCommunicationChannelServiceVisibilityRequest { accountId, commChannelId, visibility }` | `Record<string, unknown>` |
| PUT | `commerce/node/application/visibility` | `CommerceGatewayService.changeApplicationVisibility(req)` | `ChangeAccountApplicationServiceVisibilityRequest { accountId, applicationId, visibility }` | `Record<string, unknown>` |
| PUT | `commerce/node/comm-channel/price-type` | `CommerceGatewayService.changeCommChannelPriceType(req)` | `ChangeCommunicationChannelPriceTypeRequest { accountId, commChannelId, pricingType, effectiveDate }` | `Record<string, unknown>` |
| PUT | `commerce/node/comm-channel/price-value` | `CommerceGatewayService.changeCommChannelPriceValue(req)` | `ChangeCommunicationChannelPriceValueRequest { accountId, commChannelId, priceValue }` | `Record<string, unknown>` |
| PUT | `commerce/node/application/price-type` | `CommerceGatewayService.changeApplicationPriceType(req)` | `ChangeApplicationPriceTypeRequest { accountId, applicationId, pricingType, effectiveDate }` | `Record<string, unknown>` |
| PUT | `commerce/node/application/price-value` | `CommerceGatewayService.changeApplicationPriceValue(req)` | `ChangeApplicationPriceValueRequest { accountId, applicationId, priceValue }` | `Record<string, unknown>` |
| POST | `commerce/node/comm-channel/do-payment` (`header notShowToaster: 'true'`) | `CommerceGatewayService.doPaymentCommChannel(req)` | `DoPaymentCommunicationChannelRequest { accountId, commChannelId, commChannelPriorityIds? }` | `Record<string, unknown>` (carries `orderId`) |
| POST | `commerce/node/application/do-payment` (`header notShowToaster: 'true'`) | `CommerceGatewayService.doPaymentApplication(req)` | `DoPaymentApplicationRequest { accountId, applicationId, commChannelPriorityIds? }` | `Record<string, unknown>` (carries `orderId`) |
| POST | `commerce/node/comm-channel/disable` | `CommerceGatewayService.disableCommChannel(req)` | `DisableCommunicationChannelRequest { accountId, commChannelId }` | `Record<string, unknown>` |
| POST | `commerce/node/comm-channel/enable` | `CommerceGatewayService.enableCommChannel(req)` | `EnableCommunicationChannelRequest { accountId, commChannelId }` | `Record<string, unknown>` |
| POST | `commerce/node/application/disable` | `CommerceGatewayService.disableApplication(req)` | `DisableApplicationRequest { accountId, applicationId }` | `Record<string, unknown>` |
| POST | `commerce/node/application/enable` | `CommerceGatewayService.enableApplication(req)` | `EnableApplicationRequest { accountId, applicationId }` | `Record<string, unknown>` |
| DELETE | `commerce/node/comm-channel/new-price-type` (body) | `CommerceGatewayService.deleteCommChannelNewPriceType(req)` | `DeleteCommunicationChannelNewPriceTypeRequest { accountId, commChannelId }` | `Record<string, unknown>` |
| DELETE | `commerce/node/comm-channel/new-price-value` (body) | `CommerceGatewayService.deleteCommChannelNewPriceValue(req)` | `DeleteCommunicationChannelNewPriceValueRequest { accountId, commChannelId }` | `Record<string, unknown>` |
| DELETE | `commerce/node/application/new-price-type` (body) | `CommerceGatewayService.deleteApplicationNewPriceType(req)` | `DeleteApplicationNewPriceTypeRequest { accountId, applicationId }` | `Record<string, unknown>` |
| DELETE | `commerce/node/application/new-price-value` (body) | `CommerceGatewayService.deleteApplicationNewPriceValue(req)` | `DeleteApplicationNewPriceValueRequest { accountId, applicationId }` | `Record<string, unknown>` |

### 1.7 Commerce — Contracts CRUD (4) + lookups (1) + Wallet strategy (1)

| Method | URL pattern (admin) | URL pattern (mgmt) | Caller | Request | Response | Used by |
|---|---|---|---|---|---|---|
| GET | `commerce/Contracts?accountId={id}` | `api/commerce/contracts` | `ContractsApiService.listContracts(accountId)` (admin), `ManagementContractsApiService.list(accountId)` (mgmt) | querystring | `ServiceOperationResult<ApiContractListResponse>` → mapped `ContractRow[]` | admin contracts (with parallel charging balance call), mgmt contracts (no balance call) |
| GET | `commerce/Contracts/{contractId}` | `api/commerce/contracts/{contractId}` | `ContractsApiService.getContract(id)` | n/a | `ServiceOperationResult<ApiContractResponse>` → `ContractDetails` | admin + mgmt contracts |
| POST | `commerce/Contracts` | — (admin only) | `ContractsApiService.createContract(accountId, form)` | `toCreatePayload(accountId, form)` | `ServiceOperationResult<ApiContractResponse>` | admin contracts |
| PUT | `commerce/Contracts/{contractId}` | — (admin only) | `ContractsApiService.updateContract(id, form)` | `toUpdatePayload(form)` | `ServiceOperationResult<ApiContractResponse>` | admin contracts |
| GET | `commerce/Setting/wallets/{accountId}` | — | `ContractsApiService.getWalletStrategy(accountId)` (404 → null) | n/a | `ServiceOperationResult<ApiWalletSettings \| null>` | admin contracts |

### 1.8 Commerce — Wallet strategy persist (1)

| Method | URL pattern | Caller | Request | Response | Used by |
|---|---|---|---|---|---|
| POST | `commerce/setting/wallets` | `WalletBalanceService.saveChanges(request)` | `ISaveBalancesRequest { ownerId, currency, walletBalanceType, walletType }` | `ServiceOperationResult<void>` | admin + mgmt wallet-balance-management |

### 1.9 Commerce — System-Gateway aggregator (1)

| Method | URL pattern | Caller | Request | Response | Used by |
|---|---|---|---|---|---|
| GET | `api/commerce/accounts/{accountId}/hierarchy?currency={n}&balanceDistribution={n}&walletStructure={n}` | `WalletBalanceService.getWalletData(query)` | querystring | `ServiceOperationResult<IWalletDataResponse>` | admin + mgmt wallet-balance-management |

Notable: this endpoint is **a System-Gateway aggregator** that joins Commerce (account hierarchy + configured strategy) and Charging (canonical OCS master/channel/owner balances) in one response. Code comment in `wallet-balance.service.ts:18-19` says calling `/commerce/accounts/hierarchy?accountId=...` (no `api/` prefix) through the generic Commerce proxy **cannot populate the master wallet balance** — the gateway-side aggregator is required.

---

## 2. Charging endpoints (3)

| Method | URL pattern | Caller | Request | Response | Gateway | Used by |
|---|---|---|---|---|---|---|
| POST | `charging/wallet/transfer` | `WalletBalanceService.transfer(request)` | `ITransferRequest { amount, currency, description?, source: {walletId?, channelId?}, destination: {walletId?, channelId?} }` | `ServiceOperationResult<ITransferResponse { success, message?, transactionId?, errorCode? }>` | admin: app-default System; **mgmt: explicit `useGateway(Gateway.ChargingGateway)`** (only place in mgmt where gateway is overridden) | admin + mgmt wallet-balance-management |
| GET | `charging/Wallet/contract-balance-summaries?accountId={accountId}` | `ContractsApiService.getContractBalanceSummaries(accountId)` (errors swallowed → `[]`) | querystring | `ServiceOperationResult<ApiContractBalanceSummariesResponse>` | App-default | admin contracts (list + detail balance enrichment) |
| GET | (commerce-hosted) order status — exact URL inside `OrderStatusService.getOrderStatus(orderId)`. Polled at 2s intervals (max 30 min) until `ProcessState.Completed \| Failed` | `OrderStatusService.getOrderStatus(orderId)` | n/a | `ServiceOperationResult<GetOrderStatusResponse { status, failureReason?, walletType }>` | App-default | admin: comms-hub, marketplace, org-hierarchy apps-tab + comm-channels-tab; mgmt: same set |

---

## 3. Identity endpoints (18)

### 3.1 Identity — Auth flow (`auth/*`, all via `Gateway.IdentityGateway`) — 8

| Method | URL pattern | Caller | Request DTO | Response DTO | Notes |
|---|---|---|---|---|---|
| POST | `auth/login` | `AuthApiService.login()` | `LoginRequest { username, password }` | `ServiceOperationResult<LoginStepResult>` | `notShowToaster: 'true'` |
| POST | `auth/verify-otp` | `AuthApiService.verifyOtp()` | `VerifyOtpRequest { sessionId, code }` | `ServiceOperationResult<LoginStepResult>` | `notShowToaster: 'true'` |
| POST | `auth/resend-otp` | `AuthApiService.resendOtp()` | `ResendOtpRequest { sessionId }` | `ServiceOperationResult<LoginStepResult>` | — |
| POST | `auth/forgot-password` | `AuthApiService.forgotPassword()` | `ForgotPasswordRequest { username, phoneNumber, deliveryMethod }` | `ServiceOperationResult<LoginStepResult>` | — |
| POST | `auth/set-password` | `AuthApiService.setPassword()` | `SetPasswordRequest { sessionId, newPassword, confirmPassword }` | `ServiceOperationResult<boolean>` | — |
| POST | `auth/forgot-password/set-password` | `AuthApiService.forgotPasswordSetPassword()` | `ForgotPasswordSetPasswordRequest { sessionId, newPassword }` | `ServiceOperationResult<boolean>` | — |
| POST | `auth/first-login` | `AuthApiService.firstLogin()` | `FirstLoginSetupRequest { sessionId, newPassword }` | `ServiceOperationResult<LoginStepResult>` | — |
| POST | `auth/refresh-token` | `AuthApiService.refreshToken()` | `{ refreshToken }` | `ServiceOperationResult<AuthenticatedResult>` | `notShowToaster: 'true'`; called by request interceptor |

### 3.2 Identity — User (10)

| Method | URL pattern | Caller | Request | Response | Used by |
|---|---|---|---|---|---|
| GET | `identity/user/me` | `UserApiService.getMe()` | n/a | `ServiceOperationResult<UserResponse>` | host: user-profile (own) |
| GET | `identity/user/{id}` | `UserApiService.getById(id)` | n/a | `ServiceOperationResult<UserResponse>` | host: user-profile (admin viewing other) |
| GET | `identity/user?NodeId={nodeId}&Role={n}&Role={n}&PageNumber=N&PageSize=N` | `UserApiService.listByNode()` / `UserApiService.listUsersByNode()` | querystring | `ServiceOperationResult<PagedResponse<UserInfoResponse>>` | admin/mgmt: org-hierarchy hierarchy-tab user list, host: user-profile |
| GET | `identity/user?Status=2&Status=3&Status=4&Role=6&PageNumber={n}&PageSize={n}&Search={term}` | `ContactGroupDetailsService.getShareableUsers()` / `ShareGroupService.getShareableUsers()` | querystring | `ServiceOperationResult<{items: IdentityUserInfoDto[]; totalCount: number}>` | admin + mgmt contact-groups detail share dialog |
| POST | `identity/user` | `UserApiService.create(payload)` / `UserWizardService.createUser()` | `CreateUserRequest { personalInfo, permissionGroupId, deliveryMethod, roleKey, tenantId, nodeId, path? }` | `ServiceOperationResult<CreateUserResponse>` | host: user-profile add-user wizard |
| POST | `identity/user/exist` | `UserApiService.checkExist(payload)` | `UserExistRequest { username, email, phoneNumber }` | `ServiceOperationResult<ExistResponse { exist }>` | host: user-profile (`<input falconCheckExists>`) |
| POST | `identity/user/generate-password` | `UserApiService.generatePassword(payload)` | `GeneratePasswordRequest { passwordSecurityLevel }` | `ServiceOperationResult<GeneratePasswordResponse>` | host: user-profile, admin org-hierarchy wizard Step 4 |
| PUT | `identity/user/status` | `UserApiService.changeStatus(payload)` | `ChangeUserStatusRequest { userId, newStatus }` | `ServiceOperationResult<object>` | host: user-profile |
| PUT | `identity/user/profile` | `UserApiService.updateOwnProfile(payload)` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | host: user-profile (own) |
| PUT | `identity/user/{id}/profile` | `UserApiService.updateUserProfile(id, payload)` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | host: user-profile (admin editing other) |
| PUT | `identity/user/{id}/role` | `UserApiService.updateUserRole(id, payload)` | `UpdateUserRoleRequest { roleKey }` | `ServiceOperationResult<boolean>` | host: user-profile |
| PUT | `identity/user/change-password` | `ChangePasswordService.changePassword(payload)` (layout) | `ChangePasswordRequest { oldPassword, newPassword, confirmNewPassword }` | `ServiceOperationResult` | host: layout user-profile-menu change-password modal |
| POST | `/user/me/verify-phone` (leading slash) | `ProfileOtpService.sendOtp({field: Phone})` | `{}` (empty body) | `ServiceOperationResult<boolean>` | host: user-profile email/phone OTP |
| POST | `/user/me/verify-email` (leading slash) | `ProfileOtpService.sendOtp({field: Email})` | `{}` | `ServiceOperationResult<boolean>` | host: user-profile |
| POST | `user/me/verify-phone/confirm` (no leading slash — inconsistency) | `ProfileOtpService.verifyOtp({field: Phone, otp})` | `{ code: otp }` | `ServiceOperationResult<boolean>` | host: user-profile |
| POST | `user/me/verify-email/confirm` | `ProfileOtpService.verifyOtp({field: Email, otp})` | `{ code: otp }` | `ServiceOperationResult<boolean>` | host: user-profile |

### 3.3 Identity-namespaced legacy — admin org-hierarchy (1)

| Method | URL pattern | Caller | Request | Response |
|---|---|---|---|---|
| POST | `user/generate-password` (relative, **Identity Gateway** explicit) | `UserApiService.generatePassword(level)` (admin org-hierarchy) | `GeneratePasswordRequest { passwordSecurityLevel }` | `ServiceOperationResult<GeneratePasswordResponse>` |

> Note: this is functionally identical to `identity/user/generate-password` but lives at a different relative URL. The admin org-hierarchy local service uses `user/generate-password` with explicit `useGateway(Gateway.IdentityGateway)`; the host-core `UserApiService.generatePassword` uses `identity/user/generate-password`. Inconsistency flagged as GAP-OLDUI-02.

---

## 4. Contact Group endpoints (13)

> URL prefix `contactgroup/*` is rewritten by the gateway to upstream `api/contact-groups/*` per code comment in `contact-groups-api.service.ts:30-31`. Routed via System Gateway (admin) or Core Gateway (mgmt).

### 4.1 List + Detail (shared across admin + mgmt) — 5

| Method | URL pattern | Caller | Request | Response | Used by |
|---|---|---|---|---|---|
| GET | `contactgroup/contact-groups?NodeId={id}&page={n}&pageSize={n}` | `ContactGroupsApiService.list()` | `GetContactGroupsRequestParams` | `ServiceOperationResult<PagedResult<ContactGroupListItemDto>>` | admin + mgmt list |
| GET | `contactgroup/contact-groups/shared?NodeId={id}&Page={n}&PageSize={n}` (PascalCase params) | `ContactGroupsApiService.getSharedGroups()` | `GetContactGroupsRequestParams` | `ServiceOperationResult<PagedResult<ContactGroupListItemDto>>` | admin + mgmt list (shared tab) |
| GET | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.getDetail()` | n/a | `ServiceOperationResult<ContactGroupDetailDto>` | admin + mgmt detail |
| GET | `contactgroup/contact-groups/{groupId}/files/{fileType}` (`fileType` ∈ `{1=Original, 2=Validated}`) | `ContactGroupDetailsService.getFileDownloadUrl()` | n/a | `ServiceOperationResult<ContactGroupFileDownloadDto { downloadUrl, fileName, expiresInSeconds }>` (pre-signed URL) | admin + mgmt detail (file download) |
| GET | `contactgroup/contact-groups/{groupId}/contacts?page={n}&pageSize={n}` | `ContactGroupDetailsService.getContacts()` | n/a | `ServiceOperationResult<PagedResult<ContactGroupContactItem>>` → `ContactGroupContactsResponseDto` | admin + mgmt detail (contacts table) |

### 4.2 Mutation — admin uses subset; mgmt has full surface (8)

| Method | URL pattern | Caller | Request | Response | Used by |
|---|---|---|---|---|---|
| PATCH | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.updateGroup()` | `UpdateContactGroupRequest { groupId, name, referenceId?, sharePolicy }` (admin hard-codes `sharePolicy: null` at call site — known dead path) | `ServiceOperationResult<ContactGroupDetailDto>` | admin + mgmt detail edit |
| PATCH | `contactgroup/contact-groups/{groupId}/share-policy` | `ContactGroupDetailsService.shareGroup()` | (mgmt only) | `ServiceOperationResult` | mgmt detail share |
| POST | `contactgroup/contact-groups/{groupId}/share` (legacy) | `ContactGroupsApiService.shareContactGroup()` | (legacy) | — | mgmt only — back-compat |
| DELETE | `contactgroup/contact-groups/{contactGroupId}` | `ContactGroupsApiService.deleteContactGroup()` | n/a | `ServiceOperationResult` | mgmt only |
| GET | `contactgroup/contact-groups/upload-config` | `UploadGroupDetailsService.getUploadConfig()` | n/a | upload constraints DTO | mgmt only — create wizard step 1 |
| POST | `contactgroup/contact-groups/uploads/init` | `UploadGroupDetailsService.initUploadSession()` | (init body) | pre-signed S3 URL + uploadId | mgmt only — wizard |
| PUT | `{pre-signed-S3-url}` (AWS external) | `UploadGroupDetailsService.uploadFileToStorage()` | file blob | (S3 200) | mgmt only — wizard |
| POST | `contactgroup/contact-groups/uploads/{uploadId}/complete` | `UploadGroupDetailsService.confirmUpload()` | n/a | `ServiceOperationResult<CompleteUploadResponse>` | mgmt only — wizard |
| GET | `contactgroup/contact-groups/uploads/{uploadId}/preview` | `PreviewConfigureService.getUploadPreview()` | n/a | `ServiceOperationResult<UploadPreviewResponse>` | mgmt only — wizard |
| POST | `contactgroup/contact-groups` | `ReviewCreateService.createContactGroup()` | `CreateContactGroupRequest` | `ServiceOperationResult<CreateContactGroupResponse>` | mgmt only — wizard finish |

---

## 5. Testing Charging endpoints (10) — `api/testing/charging/*`

All under `TestingChargingApiService` (`apps/admin-console/src/app/features/testing-charging/services/testing-charging-api.service.ts`). All routed through System Gateway. Used only by admin testing-charging feature.

| # | Method | URL pattern | Service.method | Request | Response |
|---|---|---|---|---|---|
| 1 | GET | `api/testing/charging/accounts?search={s}&page={p}&pageSize={ps}` | `getAccounts()` | querystring | `TestingChargingPagedResponse<TestingChargingAccount>` |
| 2 | GET | `api/testing/charging/accounts/{accountId}/overview` | `getOverview(accountId)` | path | `TestingChargingOverview` |
| 3 | GET | `api/testing/charging/accounts/{accountId}/wallets` | `getWallets(accountId)` | path | `TestingChargingWallet[]` |
| 4 | GET | `api/testing/charging/accounts/{accountId}/reservations?page={p}&pageSize={ps}` | `getReservations(accountId)` | path + query | `TestingChargingPagedResponse<TestingChargingReservation>` |
| 5 | GET | `api/testing/charging/accounts/{accountId}/ledger?page={p}&pageSize={ps}` | `getLedger(accountId)` | path + query | `TestingChargingPagedResponse<TestingChargingLedgerEntry>` |
| 6 | GET | `api/testing/charging/accounts/{accountId}/balances` | `getBalances(accountId)` | path | `TestingChargingBalances` |
| 7 | GET | `api/testing/charging/runs?accountId={id}&page={p}&pageSize={ps}` | `getRuns(accountId)` | querystring | `TestingChargingPagedResponse<TestingChargingRun>` |
| 8 | GET | `api/testing/charging/runs/{runId}` | `getRun(runId)` | path | `TestingChargingRun` (with full `messages[]`) |
| 9 | POST | `api/testing/charging/whatsapp/batches` | `createWhatsappBatch(request)` | `TestingChargingCreateWhatsappBatchRequest` | `TestingChargingRun` |
| 10 | POST | `api/testing/charging/whatsapp/batches/{runId}/deliveries` | `triggerDeliveries(runId, request)` | `TestingChargingTriggerDeliveryRequest` | `TestingChargingRun` |

---

## 6. PES endpoint (1)

| Method | URL pattern | Caller | Request | Response | Notes |
|---|---|---|---|---|---|
| GET | `<baseURLPes>/pes/roles?targetUserType={system\|account}&tenantId={...}` | `RoleCatalogService.getRoles(targetUserType, tenantId)` | querystring | `RoleCatalogItem[]` | **Bypasses gateway context** — uses `envConfig.baseURLPes` directly (`role-catalog.service.ts:39-43`). Used by host user-profile + add-user wizard role dropdown. |

---

## 7. Module-Federation manifest fetch (1 — not platform API)

| Method | URL | Caller |
|---|---|---|
| GET | `/assets/module-federation.manifest.json` (static asset) | `RemoteRouteService.loadManifest()` (`apps/host-shell/src/app/core/services/remote-route.service.ts:33-44`) |

---

## Patterns observed

- **Response envelope** is `ServiceOperationResult<T>` everywhere. Some endpoints unwrap to `T` inside service classes; some surface the wrapper to the component. Inconsistency.
- **Gateway selection**:
  - admin-console → `Gateway.SystemGateway` app default
  - management-console → `Gateway.CoreGateway` app default
  - auth flow → always `Gateway.IdentityGateway` (explicit)
  - host user-profile OTP → always `Gateway.IdentityGateway` (explicit)
  - admin org-hierarchy `user/generate-password` → `Gateway.IdentityGateway` (explicit)
  - mgmt wallet transfer → `Gateway.ChargingGateway` (explicit override of app default)
  - PES `pes/roles` → bypasses gateway, uses `baseURLPes` directly
- **System-Gateway aggregator pattern** — `api/commerce/accounts/{id}/hierarchy` is the only known endpoint that joins multiple backends at gateway time. Required because the generic Commerce proxy can't populate master-wallet balance (Charging-owned data).
- **Order processing is async** — `do-payment` endpoints return `orderId` immediately and frontend polls `OrderStatusService.getOrderStatus(orderId)` at 2s intervals (max 30 min) until `ProcessState.Completed | Failed`. Failure routes through 3 reasons: `InsufficientFunds`, `CommChannelPriorityOrderRequired` (→ priority dialog → retry with `commChannelPriorityIds`), `WalletNotConfigForTheNode`.
- **`notShowToaster: 'true'` request header** suppresses global error-toast. Used on `auth/login`, `auth/verify-otp`, `auth/refresh-token`, both `do-payment` endpoints.
- **Default-deny row gating** — list rows carry `allowedActions: FalconRowAction[]` from backend; UI row menus default-hide actions not in the array. Combined with `AccessControlFacade` flags for double-gate.
- **Polling implementation**: `SimplePollService.watch({ intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: x => x?.status === Completed || Failed })` (`marketplace-applications.component.ts:437-443`, `comms-hub`, both org-hierarchy tabs).
- **Account-id source** differs by app — admin chooses via tree node; mgmt resolves from session (`session.tenantId || session.client_id || session.node?.tenantId`). See wallet-balance-management mgmt comment for the strict precedence.

## Inconsistencies / surprises (GAP candidates)

- **URL prefix casing inconsistencies** within Commerce — `commerce/Node` (PascalCase), `commerce/Setting` (PascalCase), `commerce/information` (lowercase), `commerce/node/comm-channel/*` (all lowercase), `commerce/Contracts` (admin) vs `api/commerce/contracts` (mgmt). ASP.NET routing is case-insensitive so wire-compatible, but the code reads inconsistent. **GAP-OLDUI-03**.
- **`api/` prefix is non-uniform** — most Commerce calls omit it (`commerce/Node`), but the wallet hierarchy uses `api/commerce/accounts/{id}/hierarchy` and the mgmt contracts service uses `api/commerce/contracts`. The `api/` prefix is meaningful for the wallet-aggregator (different gateway route) but appears spurious on mgmt contracts. **GAP-OLDUI-04**.
- **`PagedResponse<T>` vs `PagedResult<T>`** — both shapes coexist with the same fields (`items, totalCount, pageNumber, pageSize`) but different module locations (`host-shell/src/app/core/user/user.models.ts:70-75` vs `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:54-59`). Should consolidate.
- **`/user/me/verify-{email,phone}` send endpoints have a leading slash**, the corresponding `confirm` endpoints don't — likely a copy-paste artifact. `RuntimeBaseUrlInterceptor` normalizes both, but the asymmetry is visible in code review.
- **Dead-code endpoints** — `commerce/Node/priceType?NodeId=` and `commerce/Node/priceValue?NodeId=` are declared on `AppsServicesService` and `CommChannelsServicesService` but no component invokes them; the live path is `commerce/node/application/price-*` and `commerce/node/comm-channel/price-*` via `CommerceGatewayService`. Vestige of an earlier API generation. **GAP-OLDUI-05**.
- **Mgmt-only contract endpoint diverges** — `api/commerce/contracts` (mgmt) instead of `commerce/Contracts` (admin) for the same upstream service. Two different gateway routes for the same business action. **GAP-OLDUI-06**.
- **Mgmt-only contracts API hardcodes `canEdit: false, currencyCode: 'SAR'`** — mgmt contracts list is read-only; admin's mirror computes `canEdit` from contract status. By design, but worth documenting.
- **Mock-on-error fallback** — `OrgHierarchyApiService.getRootNodes/getChildren` (admin) catches all errors and returns `of([])` after a delay — backend-down DX scaffolding. Same pattern in `MarketplaceApplicationsService.updatePriceType/updatePriceValue` (mgmt) returns mock-data on error. **Anti-pattern** that new UI must drop.
- **Pagination quirks** — admin contact-groups list page requests `pageSize: 100` because FalconTable paginates client-side (TODO comment in `contact-groups.component.ts:333-337` says "switch to lazy onLazyLoad").
- **`pes/roles` bypasses the gateway context** — uses `envConfig.baseURLPes` directly. Every other endpoint follows the `useGateway()` pattern; PES is the lone exception.
