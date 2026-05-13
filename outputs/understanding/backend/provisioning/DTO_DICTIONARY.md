# Provisioning Service — DTO Dictionary

> Source: `Falcon.Provisioning.Contracts/Models/{RequestsDtos,ResponseDtos,Shared}/`

## Cross-Cutting Types

| Type | Shape | Notes |
|---|---|---|
| `ServiceOperationResult<T>` | `struct { bool IsSuccessful; List<string> ErrorMessages; T? Result; }` | Standard wrapper (own implementation, same shape across services) |
| `Hook<T>` | `class { T Value; string Name; }` | Lookup table response |
| `MultiLanguage` | `class { string? En; string? Ar; }` | Implements `ITranslate`. Properties are nullable here (different from Charging's where they're non-nullable). |
| `IUnitOfWorkTrigger` | marker interface | UnitOfWorkFilter eligibility |

## Request DTOs

| Name | Used By | Fields |
|---|---|---|
| `CreateAccountServicesRequest` | `POST /Services/create-account-services` | `List<CreateAccountCommunicationChannelServiceRequest> CommunicationChannelServices, List<CreateAccountApplicationServiceRequest> ApplicationServices` |
| `CreateAccountServiceRequestBase` (abstract base) | nested | `string AccountId, eProductSubscriptionStatus Status, bool Visibility, string TenantId` |
| `CreateAccountCommunicationChannelServiceRequest : Base` | nested | adds `string CommChannelId` |
| `CreateAccountApplicationServiceRequest : Base` | nested | adds `string ApplicationId` |
| `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `PUT /Services/account/comm-channel/visibility` | `string AccountId, string CommChannelId, bool Visibility` (inferred; one of the few DTOs in the contracts) |
| `ChangeAccountApplicationServiceVisibilityRequest` | `PUT /Services/account/application/visibility` | `string AccountId, string ApplicationId, bool Visibility` |

## Response DTOs

| Name | Used By | Fields |
|---|---|---|
| `CreateAccountServicesResponse` | `POST /create-account-services` | `List<CreateAccountApplicationServiceResponse> ApplicationServices, List<CreateAccountCommunicationChannelServiceResponse> CommunicationChannelServices` |
| `CreateAccountServiceResponseBase` | nested | `string Id, string AccountId, eProductSubscriptionStatus Status, bool Visibility, string TenantId` |
| `CreateAccountApplicationServiceResponse : Base` | nested | adds `string ApplicationId` |
| `CreateAccountCommunicationChannelServiceResponse : Base` | nested | adds `string CommChannelId` |
| `GetAccountApplicationServiceRespose` *(sic — typo)* | `GET /account/{id}/applications` | `string ApplicationId, bool Visibility, string AccountId, eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions` |
| `GetAccountCommunicationChannelServiceRespose` *(sic — typo)* | `GET /account/{id}/comm-channels` | `string CommChannelId, bool Visibility, string AccountId, eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions` |
| `ChangeAccountCommunicationChannelServiceVisibilityResponse` | PUT visibility | (inferred shape: subscription/visibility echo) |
| `ChangeAccountApplicationServiceVisibilityResponse` | PUT visibility | (inferred shape) |
| `LookupValueResponse` | `GET /Lookup/{id}` | (wrapped in `Hook<>`) |
| `ExistResponse` | (unused in current endpoints) | `bool Exists` |

## Domain Enums

- `eProductSubscriptionStatus` (in `Falcon.Provisioning.Domain.Constants`) — values used: subscribed, suspended, hidden, …
- `eFalconServiceAction` — actions available for a service (enable, disable, hide, configure-pricing, …) — surfaced as `List<eFalconServiceAction> AvailableActions` so frontend can compute valid actions per row

## Naming Issue

`GetAccountApplicationServiceRespose` and `GetAccountCommunicationChannelServiceRespose` — both DTOs have **"Respose"** (typo of "Response") in the class name. This is consistent with the file name and the controller usage (handlers also use the typo'd name). The frontend will see the camelCase wire shape and won't notice, but rename for clarity is recommended.
