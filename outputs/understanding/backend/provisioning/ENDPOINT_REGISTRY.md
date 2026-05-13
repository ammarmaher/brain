# Provisioning Service — Endpoint Registry

> All controllers use `[Route("api/[controller]")]`. All have `[Authorize]` at class level.

## `ServicesController` — `/api/Services` (5 endpoints)

See [`controllers/ServicesController/`](controllers/ServicesController/) for drill-down.

| Method | Route | Action | Request | Response (T) | Per-Action Auth |
|---|---|---|---|---|---|
| GET | `/api/Services/account/{id}/comm-channels` | `GetAccountCommunicationChannelServices` | (route) | `List<GetAccountCommunicationChannelServiceRespose>` | (class) |
| GET | `/api/Services/account/{id}/applications` | `GetAccountApplicationServices` | (route) | `List<GetAccountApplicationServiceRespose>` | (class) |
| POST | `/api/Services/create-account-services` | `CreateAccountServices` | `CreateAccountServicesRequest` | `CreateAccountServicesResponse` | **FalconOnly** |
| PUT | `/api/Services/account/comm-channel/visibility` | `ChangeAccountCommunicationChannelServiceVisibility` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `ChangeAccountCommunicationChannelServiceVisibilityResponse` | **FalconOnly** |
| PUT | `/api/Services/account/application/visibility` | `ChangeAccountApplicationServiceVisibility` | `ChangeAccountApplicationServiceVisibilityRequest` | `ChangeAccountApplicationServiceVisibilityResponse` | **FalconOnly** |

## `LookupController` — `/api/Lookup` (1 endpoint)

| Method | Route | Action | Query | Response (T) |
|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` | `Get` | (route + query) | `List<Hook<LookupValueResponse>>` |

Mirror of Commerce's and Charging's `LookupController`.

## Health Endpoint

| Method | Route |
|---|---|
| GET | `/health` (`AllowAnonymous`) |

## Endpoint Count

- GET: 3
- POST: 1
- PUT: 2
- Total: 6
