# Services & APIs — account-administration

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `OrgHierarchyApiService` | `apps/.../organization-hierarchy/services/org-hierarchy.api.service.ts:21` | `providedIn: 'root'` | Tree (roots, children), paginated users for a node |
| `NodeApiService` | `apps/.../organization-hierarchy/services/node-api.service.ts:13` | `providedIn: 'root'` | Create / rename sub-node |
| `UserApiService` | `apps/.../organization-hierarchy/services/user-api.service.ts:42` | `providedIn: 'root'` | Identity user list + generate password |
| `SettingsApiService` | `apps/.../organization-hierarchy/services/settings-api.service.ts:9` | `providedIn: 'root'` | Get/update security settings (PW level, allowed IPs, quotas) |
| `InformationService` | `apps/.../hierarchy-tab/components/information/service/information.service.ts:9` | `providedIn: 'root'` | Get/update account information (PUT uses C# PascalCase mapping) |
| `CommerceActionsService` | `apps/.../tabs-layout/components/service/commerce-actions.service.ts:43` | `providedIn: 'root'` | Façade delegating to `CommerceGatewayService` |
| `CommerceGatewayService` | `apps/.../tabs-layout/components/service/commerce-gateway.service.ts:42` | `providedIn: 'root'` | All commerce mutation endpoints (visibility, price changes, payments, disables, deletes) |
| `AppsServicesService` | `apps/.../apps-services-tab/services/apps-services.service.ts:23` | `providedIn: 'root'` | List + update applications |
| `CommChannelsServicesService` | `apps/.../comm-channels-services-tab/services/comm-channels-services.service.ts:24` | `providedIn: 'root'` | List + update comm channels |

## HTTP endpoints called

### Tree & Users (OrgHierarchyApiService + NodeApiService + UserApiService)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node` (no `NodeId`) | `OrgHierarchyApiService.getRootNodes()` | n/a | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:42-61` |
| GET | `commerce/Node?NodeId={parentId}` | `OrgHierarchyApiService.getChildren(parentId)` | n/a | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:63-87` |
| GET | `identity/user?NodeId={id}&Role={r}&Role={r}&PageNumber=N&PageSize=N` | `UserApiService.listUsersByNode(nodeId, roles, page, size)` | n/a | `ServiceOperationResult<PagedResponse<UserInfoResponse>>` | `user-api.service.ts:68-119` |
| POST | `identity/user/generate-password` | `UserApiService.generatePassword(level)` | `GeneratePasswordRequest` | `ServiceOperationResult<GeneratePasswordResponse>` | `user-api.service.ts:47-66` |
| PUT | `commerce/Node/changeNodeName` | `NodeApiService.updateNodeName(model)` | `CreateSubNodeRequest` | `ServiceOperationResult<CreateSubNodeRequest>` | `node-api.service.ts:18-27` |
| POST | `commerce/Node/create-SubNode` | `NodeApiService.addNodeName(model)` | `UpdateSubNodeNameRequest` | `ServiceOperationResult<CreateSubNodeRequest>` | `node-api.service.ts:28-37` |

### Settings (SettingsApiService)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Setting?ownerId={nodeId}` | `SettingsApiService.getSecuritySettings(ownerId)` | n/a | `ServiceOperationResult<ClientSettingsModel>` | `settings-api.service.ts:13-22` |
| PUT | `commerce/Setting` | `SettingsApiService.updateSecuritySettings(request)` | `ClientSettingsModel` | `ServiceOperationResult<ClientSettingsModel>` | `settings-api.service.ts:25-33` |

### Account Information (InformationService)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/information?NodeId={id}` | `InformationService.get(nodeId)` | n/a | `ServiceOperationResult<AccountInformationModel>` | `information.service.ts:14-26` |
| PUT | `commerce/information` | `InformationService.update(nodeId, model)` | C# `UpdateMainNodeInfoRequest` (PascalCase fields) | `ServiceOperationResult<AccountInformationModel>` | `information.service.ts:28-83` |

### Apps & Services list (AppsServicesService)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node/{nodeId}/applications` | `AppsServicesService.getList(nodeId)` | n/a | `ServiceOperationResult<AppServiceItem[]>` | `apps-services.service.ts:28-45` |
| PUT | `commerce/Node/priceType?NodeId={id}` | `AppsServicesService.updatePriceType(nodeId, req)` | `UpdateAppPriceTypeRequest` | `ServiceOperationResult<UpdateAppPriceTypeResponse>` | `apps-services.service.ts:50-70` (unused; delegated to CommerceGatewayService.changeApplicationPriceType) |
| PUT | `commerce/Node/priceValue?NodeId={id}` | `AppsServicesService.updatePriceValue(nodeId, req)` | `UpdateAppPriceValueRequest` | `ServiceOperationResult<UpdateAppPriceValueResponse>` | `apps-services.service.ts:75-94` (unused; delegated) |

### Comm Channels list (CommChannelsServicesService)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node/{nodeId}/comm-channels/visible/details` | `CommChannelsServicesService.getList(nodeId)` | n/a | `ServiceOperationResult<CommChannelServiceItem[]>` | `comm-channels-services.service.ts:29-50` |
| PUT | `commerce/Node/priceType?NodeId={id}` | `CommChannelsServicesService.updatePriceType(nodeId, req)` | `UpdateCommChannelPriceTypeRequest` | `ServiceOperationResult<UpdateCommChannelPriceTypeResponse>` | `comm-channels-services.service.ts:55-75` (unused; delegated) |
| PUT | `commerce/Node/priceValue?NodeId={id}` | `CommChannelsServicesService.updatePriceValue(nodeId, req)` | `UpdateCommChannelPriceValueRequest` | `ServiceOperationResult<UpdateCommChannelPriceValueResponse>` | `comm-channels-services.service.ts:80-99` (unused; delegated) |

### Commerce mutations (CommerceGatewayService — base `commerce/node`)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| PUT | `commerce/node/comm-channel/visibility` | `changeCommChannelVisibility` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:50-58` |
| PUT | `commerce/node/application/visibility` | `changeApplicationVisibility` | `ChangeAccountApplicationServiceVisibilityRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:60-68` |
| PUT | `commerce/node/comm-channel/price-type` | `changeCommChannelPriceType` | `ChangeCommunicationChannelPriceTypeRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:70-78` |
| PUT | `commerce/node/comm-channel/price-value` | `changeCommChannelPriceValue` | `ChangeCommunicationChannelPriceValueRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:80-88` |
| PUT | `commerce/node/application/price-type` | `changeApplicationPriceType` | `ChangeApplicationPriceTypeRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:90-96` |
| PUT | `commerce/node/application/price-value` | `changeApplicationPriceValue` | `ChangeApplicationPriceValueRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:98-104` |
| POST | `commerce/node/comm-channel/do-payment` | `doPaymentCommChannel` | `DoPaymentCommunicationChannelRequest` | `{ orderId: string }` | `commerce-gateway.service.ts:106-117` |
| POST | `commerce/node/application/do-payment` | `doPaymentApplication` | `DoPaymentApplicationRequest` | `{ orderId: string }` | `commerce-gateway.service.ts:119-132` |
| POST | `commerce/node/comm-channel/disable` | `disableCommChannel` | `DisableCommunicationChannelRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:134-140` |
| POST | `commerce/node/comm-channel/enable` | `enableCommChannel` | `EnableCommunicationChannelRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:142-148` |
| POST | `commerce/node/application/disable` | `disableApplication` | `DisableApplicationRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:150-158` |
| POST | `commerce/node/application/enable` | `enableApplication` | `EnableApplicationRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:160-168` |
| DELETE | `commerce/node/comm-channel/new-price-type` (with body) | `deleteCommChannelNewPriceType` | `DeleteCommunicationChannelNewPriceTypeRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:170-181` |
| DELETE | `commerce/node/comm-channel/new-price-value` (with body) | `deleteCommChannelNewPriceValue` | `DeleteCommunicationChannelNewPriceValueRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:183-194` |
| DELETE | `commerce/node/application/new-price-type` (with body) | `deleteApplicationNewPriceType` | `DeleteApplicationNewPriceTypeRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:196-205` |
| DELETE | `commerce/node/application/new-price-value` (with body) | `deleteApplicationNewPriceValue` | `DeleteApplicationNewPriceValueRequest` | `Record<string, unknown>` | `commerce-gateway.service.ts:207-216` |

**Special headers:**
- `do-payment` endpoints set `headers: { 'notShowToaster': 'true' }` (file `commerce-gateway.service.ts:112-115` & `126-129`) — global HTTP interceptor uses this header to skip auto-toast.

### Order status polling (from `@falcon`)
- After `doPayment*`, the component switches to polling `OrderStatusService.getOrderStatus(orderId)` via `SimplePollService.watch({ intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: status.status ∈ {Completed, Failed} })` — `comm-channels-services-tab.component.ts:933-1022` & `apps-services-tab.component.ts:908-997`

## Endpoint count: 35 distinct (across all service files in this feature)

## Base URL resolution
All services use `useGateway()` from `@falcon` — which **at the management-console level resolves to `Gateway.CoreGateway`** (set in `apps/management-console/src/app/app.config.ts:52` → `provideAppDefaultGateway(Gateway.CoreGateway)`).

Exception:
- `UserApiService` (`user-api.service.ts:45`) explicitly calls `useGateway(Gateway.CoreGateway)` — same value but written explicitly.

The `RuntimeBaseUrlInterceptor` (registered in `app.config.ts:53-57`) reads from window shell env (`baseURLCoreGateway`, `baseURLSystemGateway`, `baseURLChargingGateway`, `baseURLIdentityGateway`) and rewrites the URL at request time.

## Auth / interceptors
- `RuntimeBaseUrlInterceptor` — rewrites base URL based on `useGateway()` context
- Bearer JWT + tenant headers are injected by `@falcon` HttpService internals (not visible here — managed at the library layer)

## Backend service mapping (inferred)
- `commerce/*` → Falcon Commerce service (via Core Gateway)
- `identity/user` → Falcon Identity service (via Core Gateway) — user listing + password generation
- Order-status polling (`OrderStatusService` from `@falcon`) → Charging service (the do-payment flow returns an `orderId` and polls until `Completed`/`Failed`)
