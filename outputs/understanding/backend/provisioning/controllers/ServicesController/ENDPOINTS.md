# ServicesController — Endpoints

> Class route prefix: `/api/Services` (via `[Route("api/[controller]")]`). All endpoints inherit `[Authorize]` from class.

| Method | Route | Action | Request | Response (T) | Per-Action Auth |
|---|---|---|---|---|---|
| GET | `/api/Services/account/{id}/comm-channels` | `GetAccountCommunicationChannelServices` | route `id` | `List<GetAccountCommunicationChannelServiceRespose>` | (class) |
| GET | `/api/Services/account/{id}/applications` | `GetAccountApplicationServices` | route `id` | `List<GetAccountApplicationServiceRespose>` | (class) |
| POST | `/api/Services/create-account-services` | `CreateAccountServices` | `CreateAccountServicesRequest` | `CreateAccountServicesResponse` | `[Authorize(Policy=FalconOnly)]` |
| PUT | `/api/Services/account/comm-channel/visibility` | `ChangeAccountCommunicationChannelServiceVisibility` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `ChangeAccountCommunicationChannelServiceVisibilityResponse` | `[Authorize(Policy=FalconOnly)]` |
| PUT | `/api/Services/account/application/visibility` | `ChangeAccountApplicationServiceVisibility` | `ChangeAccountApplicationServiceVisibilityRequest` | `ChangeAccountApplicationServiceVisibilityResponse` | `[Authorize(Policy=FalconOnly)]` |

## Verb Count

- GET: 2
- POST: 1
- PUT: 2
- Total: 5
