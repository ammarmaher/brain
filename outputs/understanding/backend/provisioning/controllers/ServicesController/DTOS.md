# ServicesController — DTOs

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Provisioning dictionary.

## Request DTOs

| DTO | Endpoint | Fields |
|---|---|---|
| `CreateAccountServicesRequest` | `POST /create-account-services` | `List<CreateAccountCommunicationChannelServiceRequest> CommunicationChannelServices, List<CreateAccountApplicationServiceRequest> ApplicationServices` |
| `CreateAccountServiceRequestBase` (abstract) | shared base | `string AccountId, eProductSubscriptionStatus Status, bool Visibility, string TenantId` |
| `CreateAccountCommunicationChannelServiceRequest` | inherits Base | adds `string CommChannelId` |
| `CreateAccountApplicationServiceRequest` | inherits Base | adds `string ApplicationId` |
| `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `PUT /comm-channel/visibility` | `string AccountId, string CommChannelId, bool Visibility` (inferred) |
| `ChangeAccountApplicationServiceVisibilityRequest` | `PUT /application/visibility` | `string AccountId, string ApplicationId, bool Visibility` |

## Response DTOs

| DTO | Endpoint | Fields |
|---|---|---|
| `GetAccountCommunicationChannelServiceRespose` *(typo)* | `GET /account/{id}/comm-channels` | `string CommChannelId, bool Visibility, string AccountId, eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions` |
| `GetAccountApplicationServiceRespose` *(typo)* | `GET /account/{id}/applications` | `string ApplicationId, bool Visibility, string AccountId, eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions` |
| `CreateAccountServicesResponse` | `POST /create-account-services` | `List<CreateAccountApplicationServiceResponse> ApplicationServices, List<CreateAccountCommunicationChannelServiceResponse> CommunicationChannelServices` |
| `CreateAccountServiceResponseBase` (abstract) | shared base | `string Id, string AccountId, eProductSubscriptionStatus Status, bool Visibility, string TenantId` |
| `CreateAccountCommunicationChannelServiceResponse` | inherits Base | adds `string CommChannelId` |
| `CreateAccountApplicationServiceResponse` | inherits Base | adds `string ApplicationId` |
| `ChangeAccountCommunicationChannelServiceVisibilityResponse` | `PUT /comm-channel/visibility` | (shape mirrors the request + new state) |
| `ChangeAccountApplicationServiceVisibilityResponse` | `PUT /application/visibility` | (shape mirrors the request + new state) |

## Internal Command/Query Types (`Falcon.Provisioning.Application/{Commands,Queries}/`)

| Internal Type | Used By |
|---|---|
| `GetAccountCommunicationChannelServicesQuery { AccountId }` | `GetAccountCommunicationChannelServices` |
| `GetAccountApplicationServicesQuery { AccountId }` | `GetAccountApplicationServices` |
| `CreateAccountServicesCommand` (mapped) | `CreateAccountServices` |
| `ChangeAccountCommunicationChannelServiceVisibilityCommand` (mapped) | comm-channel visibility |
| `ChangeAccountApplicationServiceVisibilityCommand` (mapped) | application visibility |

## Enum Vocabulary

- `eProductSubscriptionStatus` — likely values: `Pending`, `Active`, `Suspended`, `Hidden`, `Cancelled` (verify in `Falcon.Provisioning.Domain.Constants`)
- `eFalconServiceAction` — likely values: `Enable`, `Disable`, `Hide`, `Show`, `ConfigurePrice`, `Pay` (verify)
