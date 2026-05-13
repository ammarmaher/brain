# Commerce Service — Endpoint Registry

> All routes use the `[Route("api/[controller]")]` convention unless overridden. `[controller]` resolves to the controller name minus the `Controller` suffix.
> All controllers have `[Authorize]` at class level unless noted. Class-level `[Authorize(Policy = ...)]` annotations are recorded.

## `NodeController` — `/api/Node` (26 endpoints)

See [`controllers/NodeController/`](controllers/NodeController/) for the full drill-down.

| Method | Route | Handler Action | Request DTO | Response (T inside SOR) | Auth |
|---|---|---|---|---|---|
| GET | `/api/Node?NodeId=` | `GetHierarchy` | (query) | `List<GetHierarchyNodeResponse>` | (class) |
| POST | `/api/Node/create-account` | `CreateMainNode` | `CreateAccountRequest` | `CreateAccountResponse` | (class) |
| POST | `/api/Node/create-SubNode` | `CreateSubNode` | `CreateSubNodeRequest` | `bool` | (class) |
| PUT | `/api/Node/ChangeNodeName` | `ChangeNodeName` | `ChangeNodeNameRequest` | `string` | (class) |
| GET | `/api/Node/ValidateAccountName?AccountName=` | `ValidateAccountName` | (query) | `bool` | (class) |
| GET | `/api/Node/{id}/comm-channels` | `GetAccountCommunicationChannels` | (route) | `List<AccountCommunicationChannelResponse>` | (class) |
| GET | `/api/Node/{NodeId}/comm-channels/visible` | `GetVisibleCommunicationChannels` | (route) | `List<VisibleCommunicationChannelResponse>` | (class) |
| GET | `/api/Node/{NodeId}/comm-channels/visible/details` | `GetVisibleCommunicationChannelDetails` | (route) | `List<AccountCommunicationChannelResponse>` | (class) |
| GET | `/api/Node/{id}/applications` | `GetAccountApplications` | (route) | `List<AccountApplicationResponse>` | (class) |
| PUT | `/api/Node/comm-channel/visibility` | `ChangeAccountCommunicationChannelServiceVisibility` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `ChangeAccountCommunicationChannelServiceVisibilityResponse` | **FalconOnly** |
| PUT | `/api/Node/application/visibility` | `ChangeAccountApplicationServiceVisibility` | `ChangeAccountApplicationServiceVisibilityRequest` | `ChangeAccountApplicationServiceVisibilityResponse` | **FalconOnly** |
| PUT | `/api/Node/comm-channel/price-type` | `ChangeCommunicationChannelPriceType` | `ChangeCommunicationChannelPriceTypeRequest` | `ChangeCommunicationChannelPriceTypeResponse` | **FalconOnly** |
| PUT | `/api/Node/comm-channel/price-value` | `ChangeCommunicationChannelPriceValue` | `ChangeCommunicationChannelPriceValueRequest` | `ChangeCommunicationChannelPriceValueResponse` | **FalconOnly** |
| PUT | `/api/Node/application/price-type` | `ChangeCommunicationChannelPriceType` (overload) | `ChangeApplicationPriceTypeRequest` | `ChangeApplicationPriceTypeResponse` | **FalconOnly** |
| PUT | `/api/Node/application/price-value` | `ChangeApplicationPriceValue` | `ChangeApplicationPriceValueRequest` | `ChangeApplicationPriceValueResponse` | **FalconOnly** |
| POST | `/api/Node/comm-channel/do-payment` | `DoPaymentCommunicationChannel` | `DoPaymentCommunicationChannelRequest` | `DoPaymentCommunicationChannelResponse` | (class) |
| POST | `/api/Node/application/do-payment` | `DoPaymentApplication` | `DoPaymentApplicationRequest` | `DoPaymentApplicationResponse` | (class) |
| POST | `/api/Node/comm-channel/disable` | `DisableCommunicationChannel` | `DisableCommunicationChannelRequest` | `DisableCommunicationChannelResponse` | (class) |
| POST | `/api/Node/comm-channel/enable` | `EnableCommunicationChannel` | `EnableCommunicationChannelRequest` | `EnableCommunicationChannelResponse` | (class) |
| POST | `/api/Node/application/disable` | `DisableApplication` | `DisableApplicationRequest` | `DisableApplicationResponse` | (class) |
| POST | `/api/Node/application/enable` | `EnableApplication` | `EnableApplicationRequest` | `EnableApplicationResponse` | (class) |
| DELETE | `/api/Node/comm-channel/new-price-type` | `DeleteCommunicationChannelNewPriceType` | `DeleteCommunicationChannelNewPriceTypeRequest` | `DeleteCommunicationChannelNewPriceTypeResponse` | **FalconOnly** |
| DELETE | `/api/Node/comm-channel/new-price-value` | `DeleteCommunicationChannelNewPriceValue` | `DeleteCommunicationChannelNewPriceValueRequest` | `DeleteCommunicationChannelNewPriceValueResponse` | **FalconOnly** |
| DELETE | `/api/Node/application/new-price-type` | `DeleteApplicationNewPriceType` | `DeleteApplicationNewPriceTypeRequest` | `DeleteApplicationNewPriceTypeResponse` | **FalconOnly** |
| DELETE | `/api/Node/application/new-price-value` | `DeleteApplicationNewPriceValue` | `DeleteApplicationNewPriceValueRequest` | `DeleteApplicationNewPriceValueResponse` | **FalconOnly** |
| GET | `/api/Node/order/{orderId}/status` | `GetOrderStatus` | (route) | `GetOrderStatusResponse` | (class) |

## `AccountHierarchyController` — `/api/accounts/hierarchy` (1 endpoint)

| Method | Route | Action | Query Params | Response (T) | Auth |
|---|---|---|---|---|---|
| GET | `/api/accounts/hierarchy` | `GetAccountHierarchy` | `accountId, currency?, balanceDistribution?, walletStructure?` | `GetAccountHierarchyResponse` | (class) |

Note the unusual route — `[Route("api/accounts/hierarchy")]` is set explicitly rather than using `[controller]`.

## `ApplicationController` — `/api/Application` (1 endpoint)

| Method | Route | Action | Response (T) |
|---|---|---|---|
| GET | `/api/Application` | `Get` | `List<ApplicationResponse>` |

## `CommunicationChannelController` — `/api/CommunicationChannel` (1 endpoint)

| Method | Route | Action | Response (T) |
|---|---|---|---|
| GET | `/api/CommunicationChannel` | `Get` | `List<CommunicationChannelResponse>` |

## `ContractsController` — `/api/Contracts` (4 endpoints)

| Method | Route | Action | Request DTO | Response (T) |
|---|---|---|---|---|
| GET | `/api/Contracts?accountId=` | `List` | (query) | `ContractListResponse` |
| GET | `/api/Contracts/{contractId}` | `Get` | (route) | `ContractResponse` |
| POST | `/api/Contracts` | `Create` | `CreateContractRequest` | `ContractResponse` |
| PUT | `/api/Contracts/{contractId}` | `Update` | `UpdateContractRequest` (route `contractId` overrides body) | `ContractResponse` |

## `InformationController` — `/api/Information` (2 endpoints)

| Method | Route | Action | Request | Response (T) |
|---|---|---|---|---|
| GET | `/api/Information?NodeId=` | `Get` | (query) | `GetMainNodeInfoResponse` |
| PUT | `/api/Information` | `Update` | `UpdateMainNodeInfoRequest` | `UpdateMainNodeInfoResponse` |

(No `[Authorize]` at class level — verify if intentional; could be an oversight.)

## `LookupController` — `/api/Lookup` (1 endpoint)

| Method | Route | Action | Query Params | Response (T) |
|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` | `Get` | (route + query) | `List<Hook<LookupValueResponse>>` |

## `SecurityController` — `/api/Security` (1 endpoint, east-west)

| Method | Route | Action | Auth | Response (T) |
|---|---|---|---|---|
| GET | `/api/Security/ip-allowlists` | `GetAllIpAllowlists` | **AllowAnonymous** (service-to-service) | `GetAllIpAllowlistsResponse` |

Returns `Dictionary<tenantId, IpAllowlistEntryDto { bool Enabled, List<string> AllowedIps }>` — read by Core Gateway at startup to seed its enforcement cache.

## `SettingController` — `/api/Setting` (4 endpoints)

| Method | Route | Action | Request | Response (T) | Auth |
|---|---|---|---|---|---|
| GET | `/api/Setting?ownerId=` | `Get` | (query) | `GetSettingsResponse` | (none at class level) |
| PUT | `/api/Setting` | `Update` | `UpdateSettingsRequest` | `UpdateSettingsResponse` | (none) |
| POST | `/api/Setting/wallets` | `ConfigureWallet` | `ConfigureWalletSettingsRequest` | `ConfigureWalletSettingsResponse` | **FalconOnly** |
| GET | `/api/Setting/wallets/{ownerId}` | `GetWallet` | (route) | `GetWalletSettingsResponse?` | (none) |

## `Testing/TestingAccountsController` — `/api/testing/accounts` (1 endpoint)

| Method | Route | Action | Query | Response | Gate |
|---|---|---|---|---|---|
| GET | `/api/testing/accounts?search=&page=&pageSize=` | `List` | (query) | `TestingAccountListResponse` | `Settings:TestingCharging:Enabled` must be true — returns 404 otherwise |

## Health Endpoint

| Method | Route | Source |
|---|---|---|
| GET | `/health` | `app.MapHealthChecks("/health").AllowAnonymous()` |
