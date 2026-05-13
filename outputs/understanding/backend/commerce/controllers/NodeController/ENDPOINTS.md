# NodeController — Endpoints

> Class route prefix: `/api/Node` (via `[Route("api/[controller]")]`). All endpoints inherit `[Authorize]` from class unless overridden.

## Read Endpoints

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Node?NodeId=` | `GetHierarchy` | (query) | `List<GetHierarchyNodeResponse>` | `IGetOrgHierarchyNodeHandler.ExecuteAsync(new GetOrgHierarchyNodeQuery { NodeId })` |
| GET | `/api/Node/ValidateAccountName?AccountName=` | `ValidateAccountName` | (query) | `bool` (IsAlreadyInUse) | `IValidateAccountNameHandler.ExecuteAsync(new ValidateAccountNameQuery(AccountName))` |
| GET | `/api/Node/{id}/comm-channels` | `GetAccountCommunicationChannels` | (route `id`) | `List<AccountCommunicationChannelResponse>` | `IGetAccountCommunicationChannelsHandler` |
| GET | `/api/Node/{NodeId}/comm-channels/visible` | `GetVisibleCommunicationChannels` | (route `NodeId`) | `List<VisibleCommunicationChannelResponse>` | `IGetVisibleCommunicationChannelsHandler` |
| GET | `/api/Node/{NodeId}/comm-channels/visible/details` | `GetVisibleCommunicationChannelDetails` | (route `NodeId`) | `List<AccountCommunicationChannelResponse>` | `IGetVisibleCommunicationChannelDetailsHandler` |
| GET | `/api/Node/{id}/applications` | `GetAccountApplications` | (route `id`) | `List<AccountApplicationResponse>` | `IGetAccountApplicationsHandler` |
| GET | `/api/Node/order/{orderId}/status` | `GetOrderStatus` | (route `orderId`) | `GetOrderStatusResponse` | `IGetOrderStatusHandler` |

## Mutation Endpoints (Account & Hierarchy)

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| POST | `/api/Node/create-account` | `CreateMainNode` | `CreateAccountRequest` | `CreateAccountResponse` | `ICreateMainNodeProcess` (orchestrator) |
| POST | `/api/Node/create-SubNode` | `CreateSubNode` | `CreateSubNodeRequest` | `bool` (success) | `ICreateSubNodeHandler` |
| PUT | `/api/Node/ChangeNodeName` | `ChangeNodeName` | `ChangeNodeNameRequest` | `string` (new node name) | `IChangeNodeNameHandler.ChangeNodeNameAsync(...)` |

## Mutation Endpoints (Service Catalog) — All `[Authorize(Policy=FalconOnly)]`

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| PUT | `/api/Node/comm-channel/visibility` | `ChangeAccountCommunicationChannelServiceVisibility` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `ChangeAccountCommunicationChannelServiceVisibilityResponse` | `IChangeAccountCommunicationChannelServiceVisibilityHandler` |
| PUT | `/api/Node/application/visibility` | `ChangeAccountApplicationServiceVisibility` | `ChangeAccountApplicationServiceVisibilityRequest` | `ChangeAccountApplicationServiceVisibilityResponse` | `IChangeAccountApplicationServiceVisibilityHandler` |
| PUT | `/api/Node/comm-channel/price-type` | `ChangeCommunicationChannelPriceType` | `ChangeCommunicationChannelPriceTypeRequest` | `ChangeCommunicationChannelPriceTypeResponse` | `IChangeCommunicationChannelPriceTypeHandler` |
| PUT | `/api/Node/comm-channel/price-value` | `ChangeCommunicationChannelPriceValue` | `ChangeCommunicationChannelPriceValueRequest` | `ChangeCommunicationChannelPriceValueResponse` | `IChangeCommunicationChannelPriceValueHandler` |
| PUT | `/api/Node/application/price-type` | `ChangeCommunicationChannelPriceType` (overload — same C# name) | `ChangeApplicationPriceTypeRequest` | `ChangeApplicationPriceTypeResponse` | `IChangeApplicationPriceTypeHandler` (note: handler field initialization is missing in constructor body — see `OVERVIEW.md` finding #4) |
| PUT | `/api/Node/application/price-value` | `ChangeApplicationPriceValue` | `ChangeApplicationPriceValueRequest` | `ChangeApplicationPriceValueResponse` | `IChangeApplicationPriceValueHandler` |
| DELETE | `/api/Node/comm-channel/new-price-type` | `DeleteCommunicationChannelNewPriceType` | `DeleteCommunicationChannelNewPriceTypeRequest` | `DeleteCommunicationChannelNewPriceTypeResponse` | `IDeleteCommunicationChannelNewPriceTypeHandler` |
| DELETE | `/api/Node/comm-channel/new-price-value` | `DeleteCommunicationChannelNewPriceValue` | `DeleteCommunicationChannelNewPriceValueRequest` | `DeleteCommunicationChannelNewPriceValueResponse` | `IDeleteCommunicationChannelNewPriceValueHandler` |
| DELETE | `/api/Node/application/new-price-type` | `DeleteApplicationNewPriceType` | `DeleteApplicationNewPriceTypeRequest` | `DeleteApplicationNewPriceTypeResponse` | `IDeleteApplicationNewPriceTypeHandler` |
| DELETE | `/api/Node/application/new-price-value` | `DeleteApplicationNewPriceValue` | `DeleteApplicationNewPriceValueRequest` | `DeleteApplicationNewPriceValueResponse` | `IDeleteApplicationNewPriceValueHandler` |

## Mutation Endpoints (Service Lifecycle)

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| POST | `/api/Node/comm-channel/do-payment` | `DoPaymentCommunicationChannel` | `DoPaymentCommunicationChannelRequest` | `DoPaymentCommunicationChannelResponse` | `ICreateFalconServiceOrderHandler` |
| POST | `/api/Node/application/do-payment` | `DoPaymentApplication` | `DoPaymentApplicationRequest` | `DoPaymentApplicationResponse` | `ICreateFalconServiceOrderHandler` |
| POST | `/api/Node/comm-channel/disable` | `DisableCommunicationChannel` | `DisableCommunicationChannelRequest` | `DisableCommunicationChannelResponse` | `IDisableCommunicationChannelHandler` |
| POST | `/api/Node/comm-channel/enable` | `EnableCommunicationChannel` | `EnableCommunicationChannelRequest` | `EnableCommunicationChannelResponse` | `IEnableCommunicationChannelHandler` |
| POST | `/api/Node/application/disable` | `DisableApplication` | `DisableApplicationRequest` | `DisableApplicationResponse` | `IDisableApplicationHandler` |
| POST | `/api/Node/application/enable` | `EnableApplication` | `EnableApplicationRequest` | `EnableApplicationResponse` | `IEnableApplicationHandler` |

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 7 |
| POST | 8 |
| PUT | 7 |
| DELETE | 4 |
| **Total** | **26** |
