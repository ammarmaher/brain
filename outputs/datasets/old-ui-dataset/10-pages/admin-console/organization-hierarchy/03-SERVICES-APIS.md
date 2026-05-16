# Services & APIs — organization-hierarchy

> **CRITICAL** — this is the most-load-bearing artifact. Every HTTP call is enumerated. All services use the Falcon `HttpService` (a thin wrapper over `HttpClient`) plus `useGateway()` for gateway routing.

## Services (declared in scope)
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:29` | `providedIn: 'root'` | Root nodes / lazy children of the tree + paged user list per node |
| `NodeApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/node-api.service.ts:21` | `providedIn: 'root'` | Add sub-node, rename sub-node, create-account (full client wizard submission) |
| `UserApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/user-api.service.ts:42` | `providedIn: 'root'` | Generate strong password + list users by node (cross-gateway: Identity) |
| `ApplicationApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/application-channel-api.service.ts:7` | `providedIn: 'root'` | List global applications (for wizard step 3) |
| `CommunicationChannelApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/communication-channel-api.service.ts:7` | `providedIn: 'root'` | List global communication channels (for wizard step 2) |
| `SettingsApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/settings-api.service.ts:9` | `providedIn: 'root'` | Get/update security settings for a node (settings tab) |
| `InformationService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/service/information.service.ts:9` | `providedIn: 'root'` | Get/update account information for a node (hierarchy-tab info view) |
| `AppsServicesService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/apps-services-tab/services/apps-services.service.ts:23` | `providedIn: 'root'` | List apps/services per node + (legacy) update price endpoints |
| `CommChannelsServicesService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/services/comm-channels-services.service.ts:24` | `providedIn: 'root'` | List comm channels/services per node + (legacy) update price endpoints |
| `CommerceGatewayService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts:42` | `providedIn: 'root'` | Single source of truth for 14 commerce/node action endpoints (PUT visibility/price-type/price-value, POST enable/disable/do-payment, DELETE new-price-*) |
| `CommerceActionsService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts:43` | `providedIn: 'root'` | Thin façade re-exporting `CommerceGatewayService` methods (allows mocking) |

## HTTP endpoints called (21 distinct paths)

| # | Method | URL pattern | Service.method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|---|
| 1 | GET | `commerce/Node` | `OrgHierarchyApiService.getRootNodes()` | n/a | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:50-69` |
| 2 | GET | `commerce/Node?NodeId={parentId}` | `OrgHierarchyApiService.getChildren(parentId)` | n/a (query params) | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:71-98` |
| 3 | PUT | `commerce/Node/changeNodeName` | `NodeApiService.updateNodeName(model)` | `CreateSubNodeRequest { id, name }` | `ServiceOperationResult<CreateSubNodeRequest>` | `node-api.service.ts:26-35` |
| 4 | POST | `commerce/Node/create-SubNode` | `NodeApiService.addNodeName(model)` | `UpdateSubNodeNameRequest { parentId, name }` | `ServiceOperationResult<CreateSubNodeRequest>` | `node-api.service.ts:36-45` |
| 5 | POST | `commerce/Node/create-account` | `NodeApiService.createAccount(wizardModel)` | `CreateClientWizardRequestDto` | `ServiceOperationResult<CreateAccountResponse { id }>` | `node-api.service.ts:52-71` |
| 6 | POST | `user/generate-password` (Identity gateway) | `UserApiService.generatePassword(level)` | `GeneratePasswordRequest { passwordSecurityLevel }` | `ServiceOperationResult<GeneratePasswordResponse { password }>` | `user-api.service.ts:47-66` |
| 7 | GET | `user?PageNumber={n}&PageSize={n}&NodeId={id}&Role={r}[&Role={r}…]` (Identity gateway) | `UserApiService.listUsersByNode(nodeId, roles, page, size)` | n/a (query params) | `ServiceOperationResult<PagedResponse<UserInfoResponse>>` | `user-api.service.ts:68-119` |
| 8 | GET | `commerce/application` | `ApplicationApiService.list()` | n/a | `ServiceOperationResult<any[]>` | `application-channel-api.service.ts:12-20` |
| 9 | GET | `commerce/communicationChannel` | `CommunicationChannelApiService.list()` | n/a | `ServiceOperationResult<any[]>` | `communication-channel-api.service.ts:12-20` |
| 10 | GET | `commerce/Setting?ownerId={id}` | `SettingsApiService.getSecuritySettings(ownerId)` | n/a (query) | `ServiceOperationResult<ClientSettingsModel>` | `settings-api.service.ts:13-24` |
| 11 | PUT | `commerce/Setting` | `SettingsApiService.updateSecuritySettings(req)` | `ClientSettingsModel` (incl. quotaSettings + securitySettings) | `ServiceOperationResult<ClientSettingsModel>` | `settings-api.service.ts:27-35` |
| 12 | GET | `commerce/information?NodeId={id}` | `InformationService.get(nodeId)` | n/a (query) | `ServiceOperationResult<AccountInformationModel>` | `information.service.ts:14-26` |
| 13 | PUT | `commerce/information` | `InformationService.update(nodeId, model)` | PascalCase body matching C# `UpdateMainNodeInfoRequest` — `{ NodeId, AccountName, AccountId, FinanceId, ClassificationCategory, ClassificationSubCategory, EntityName, AuthorityLetterType, Sector, BudgetNo, Country, City, District, Street, BuildingNumber, PostalCode, AdditionalAddress, AnotherId, VatRegistrationNumber, ProfilePicture: { Extension, FileBase64String } }` | `ServiceOperationResult<AccountInformationModel>` | `information.service.ts:28-83` |
| 14 | GET | `commerce/Node/{nodeId}/applications` | `AppsServicesService.getList(nodeId)` | n/a | `ServiceOperationResult<AppServiceItem[]>` | `apps-services.service.ts:33-50` |
| 15 | GET | `commerce/Node/{nodeId}/comm-channels` | `CommChannelsServicesService.getList(nodeId)` | n/a | `ServiceOperationResult<CommChannelServiceItem[]>` | `comm-channels-services.service.ts:35-56` |
| 16 | PUT | `commerce/node/comm-channel/visibility` | `CommerceGatewayService.changeCommChannelVisibility(req)` | `ChangeAccountCommunicationChannelServiceVisibilityRequest { accountId, commChannelId, visibility }` | `ServiceOperationResult<ChangeAccountCommunicationChannelServiceVisibilityResponse>` | `commerce-gateway.service.ts:50-58` |
| 17 | PUT | `commerce/node/application/visibility` | `CommerceGatewayService.changeApplicationVisibility(req)` | `ChangeAccountApplicationServiceVisibilityRequest { accountId, applicationId, visibility }` | `ServiceOperationResult<ChangeAccountApplicationServiceVisibilityResponse>` | `commerce-gateway.service.ts:60-68` |
| 18 | PUT | `commerce/node/comm-channel/price-type` | `CommerceGatewayService.changeCommChannelPriceType(req)` | `ChangeCommunicationChannelPriceTypeRequest { accountId, commChannelId, pricingType, effectiveDate }` | `ServiceOperationResult<ChangeCommunicationChannelPriceTypeResponse>` | `commerce-gateway.service.ts:70-78` |
| 19 | PUT | `commerce/node/comm-channel/price-value` | `CommerceGatewayService.changeCommChannelPriceValue(req)` | `ChangeCommunicationChannelPriceValueRequest { accountId, commChannelId, priceValue }` | `ServiceOperationResult<ChangeCommunicationChannelPriceValueResponse>` | `commerce-gateway.service.ts:80-88` |
| 20 | PUT | `commerce/node/application/price-type` | `CommerceGatewayService.changeApplicationPriceType(req)` | `ChangeApplicationPriceTypeRequest { accountId, applicationId, pricingType, effectiveDate }` | `ServiceOperationResult<ChangeApplicationPriceTypeResponse>` | `commerce-gateway.service.ts:90-96` |
| 21 | PUT | `commerce/node/application/price-value` | `CommerceGatewayService.changeApplicationPriceValue(req)` | `ChangeApplicationPriceValueRequest { accountId, applicationId, priceValue }` | `ServiceOperationResult<ChangeApplicationPriceValueResponse>` | `commerce-gateway.service.ts:98-104` |
| 22 | POST | `commerce/node/comm-channel/do-payment` (header `notShowToaster: true`) | `CommerceGatewayService.doPaymentCommChannel(req)` | `DoPaymentCommunicationChannelRequest { accountId, commChannelId, commChannelPriorityIds?: CommChannelPriority[] }` | `ServiceOperationResult<DoPaymentCommunicationChannelResponse>` (response `result.orderId`) | `commerce-gateway.service.ts:106-117` |
| 23 | POST | `commerce/node/application/do-payment` (header `notShowToaster: true`) | `CommerceGatewayService.doPaymentApplication(req)` | `DoPaymentApplicationRequest { accountId, applicationId, commChannelPriorityIds? }` | `ServiceOperationResult<DoPaymentApplicationResponse>` (response `result.orderId`) | `commerce-gateway.service.ts:119-132` |
| 24 | POST | `commerce/node/comm-channel/disable` | `CommerceGatewayService.disableCommChannel(req)` | `DisableCommunicationChannelRequest { accountId, commChannelId }` | `ServiceOperationResult<DisableCommunicationChannelResponse>` | `commerce-gateway.service.ts:134-140` |
| 25 | POST | `commerce/node/comm-channel/enable` | `CommerceGatewayService.enableCommChannel(req)` | `EnableCommunicationChannelRequest { accountId, commChannelId }` | `ServiceOperationResult<EnableCommunicationChannelResponse>` | `commerce-gateway.service.ts:142-148` |
| 26 | POST | `commerce/node/application/disable` | `CommerceGatewayService.disableApplication(req)` | `DisableApplicationRequest { accountId, applicationId }` | `ServiceOperationResult<DisableApplicationResponse>` | `commerce-gateway.service.ts:150-158` |
| 27 | POST | `commerce/node/application/enable` | `CommerceGatewayService.enableApplication(req)` | `EnableApplicationRequest { accountId, applicationId }` | `ServiceOperationResult<EnableApplicationResponse>` | `commerce-gateway.service.ts:160-168` |
| 28 | DELETE | `commerce/node/comm-channel/new-price-type` (body in request) | `CommerceGatewayService.deleteCommChannelNewPriceType(req)` | `DeleteCommunicationChannelNewPriceTypeRequest { accountId, commChannelId }` | `ServiceOperationResult<DeleteCommunicationChannelNewPriceTypeResponse>` | `commerce-gateway.service.ts:170-181` |
| 29 | DELETE | `commerce/node/comm-channel/new-price-value` (body) | `CommerceGatewayService.deleteCommChannelNewPriceValue(req)` | `DeleteCommunicationChannelNewPriceValueRequest { accountId, commChannelId }` | `ServiceOperationResult<DeleteCommunicationChannelNewPriceValueResponse>` | `commerce-gateway.service.ts:183-194` |
| 30 | DELETE | `commerce/node/application/new-price-type` (body) | `CommerceGatewayService.deleteApplicationNewPriceType(req)` | `DeleteApplicationNewPriceTypeRequest { accountId, applicationId }` | `ServiceOperationResult<DeleteApplicationNewPriceTypeResponse>` | `commerce-gateway.service.ts:196-205` |
| 31 | DELETE | `commerce/node/application/new-price-value` (body) | `CommerceGatewayService.deleteApplicationNewPriceValue(req)` | `DeleteApplicationNewPriceValueRequest { accountId, applicationId }` | `ServiceOperationResult<DeleteApplicationNewPriceValueResponse>` | `commerce-gateway.service.ts:207-216` |

> **Endpoint count by canonical path**: 21 distinct URL patterns (treating `?param=...` query-string variants as 1 path each). The table above lists 31 rows because each method on `CommerceGatewayService` is a distinct call site even though several share root paths (`comm-channel/*`, `application/*`).

### Legacy / unused price-update endpoints
- `AppsServicesService.updatePriceType(nodeId, req)` (`apps-services.service.ts:55-75`) — PUT `commerce/Node/priceType?NodeId={nodeId}` with `UpdateAppPriceTypeRequest { id, pricingType, effectiveDate }`. Not called by any tab component in current code (price-type changes go through `CommerceGatewayService.changeApplicationPriceType` instead). Likely a vestige of the previous architecture — flag for cleanup in new UI.
- `AppsServicesService.updatePriceValue(nodeId, req)` (`apps-services.service.ts:80-99`) — same situation for price-value.
- `CommChannelsServicesService.updatePriceType`, `.updatePriceValue` (`comm-channels-services.service.ts:61-105`) — same.

### Inherited / cross-feature endpoints invoked by this page (called via shared services but not enumerated in this feature's table)
- `OrderStatusService.getOrderStatus(orderId)` — polled at 2s intervals during `DoPayment` flow on both tab components (`apps-services-tab.component.ts:881-888`, `comm-channels-services-tab.component.ts:894-900`). Endpoint lives in `libs/falcon/src/...` — assumed under `commerce/Order` namespace; this feature only consumes the result type `GetOrderStatusResponse`.
- `AccountValidationService.checkAccountNameExists(name)` — used by `<input falconCheckExists>` directive in wizard Step 0 (info) for uniqueness check on `accountName`. Underlying endpoint not in this scope.
- `AccountValidationService.isUserExist(username, email, phone)` — wizard Step 4 (account-owner) username uniqueness check.
- `LookupService.getLookup(LOOKUP_IDS.Country)` and `LookupService.getLookup(LOOKUP_IDS.City, { name, code })` — country/city dropdowns in wizard Step 0 and information view.

## Base URL resolution
- `HttpService` (in `@falcon`) prepends `environment.baseURL` to relative paths. The org-hierarchy services pass relative URLs like `commerce/Node`, `commerce/Setting`, `commerce/information`, `commerce/communicationChannel`, `commerce/application`, `commerce/node/*`, `user/*`.
- `useGateway()` — default returns gateway context routing through the **Core Gateway** (per `org-hierarchy.api.service.ts:53`). Explicit override `useGateway(Gateway.IdentityGateway)` is used by `UserApiService` (`user-api.service.ts:45`) — the only place this feature talks directly to the Identity Gateway.
- `environments/environment.ts` and `environment.prod.ts` files were not present in the worktree under `apps/admin-console/src/environments/` — `[INFERRED]` they live elsewhere (likely `apps/host-shell/src/environments/`) and are injected via Module Federation runtime config. **[CODE-INFERRED]** baseURL resolution is centralized in the host-shell.

## Auth / interceptors
- Standard Falcon interceptor chain (defined in `libs/falcon/src/core/lib/interceptors/`):
  - `AuthInterceptor` — attaches `Bearer <jwt>` (Zitadel token from SessionProvider)
  - Tenant / org-context header injection — applied based on `useGateway()` context
- `notShowToaster: 'true'` header is used by both `doPaymentApplication` and `doPaymentCommChannel` to suppress the global error toaster (since the page wires its own error UI through poll + `<p-confirmDialog>` + insufficient-balance dialogs).

## Backend service mapping
**[INFERRED]** from the URL patterns + the platform architecture documented in `C:\Falcon\CLAUDE.md`:

| URL prefix | Routes to | Owning service |
|---|---|---|
| `commerce/Node`, `commerce/Setting`, `commerce/information`, `commerce/application`, `commerce/communicationChannel`, `commerce/node/*` | Core Gateway (`falcon-int-core-gateway-svc`) → Commerce backend | **Falcon Core Commerce Service** (`falcon-core-commerce-svc`) |
| `user/*` (via `Gateway.IdentityGateway`) | Identity Gateway → Identity backend | **Falcon Core Identity Service** (`falcon-core-identity-svc`) |
| `OrderStatusService.getOrderStatus(orderId)` (cross-feature) | Core Gateway → Commerce | **Falcon Core Commerce Service** (order/payment subdomain) |

Order processing is asynchronous on the backend — `do-payment` returns an `orderId` immediately and the frontend polls `getOrderStatus(orderId)` until `ProcessState.Completed | Failed`. Failure reasons enum: `InsufficientFunds | CommChannelPriorityOrderRequired | WalletNotConfigForTheNode | ...` (from `@falcon` `OrderFailureReason`).

## Notable patterns
- **Lazy lookup data**: Settings tab is the only tab that uses lazy data-load on tab activation — `TabsLayoutComponent.onTabChange` (`tabs-layout.component.ts:144-159`) special-cases `newTab === '1'` and calls `nodeSettingsComponent.loadSettings()` via `setTimeout`. The other 3 tabs fetch in `ngOnInit | ngOnChanges` on `selectedNodeId` change.
- **Mock fallback for early dev**: `OrgHierarchyApiService.getRootNodes()` (`org-hierarchy.api.service.ts:63-68`) and `getChildren()` (`93-96`) catch all errors and return `of([])` after a delay — designed for backend-down development. New UI must NOT carry this anti-pattern over.
- **PascalCase request body**: `InformationService.update()` (`information.service.ts:53-74`) explicitly hand-builds a PascalCase body matching the C# `UpdateMainNodeInfoRequest` DTO. The rest of the services let the platform standard camelCase serialization through. This is a quirk on the backend side — flag for normalization.
- **Status normalization**: both apps/comm-channel models expose `toFalconItemStatus(value)` (in `models/models.ts`) that accepts both numeric enum values AND strings like `'Active' | 'Inactive' | 'Expired' | 'Disabled'`, returning `FalconItemStatus.None` on unknown. Suggests backend payloads have evolved over time.
