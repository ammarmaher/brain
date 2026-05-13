# Provisioning Service — Validations

## DTO-Level Validation

None visible on `CreateAccountServicesRequest` or `ChangeAccountApplicationServiceVisibilityRequest`. No DataAnnotations, no FluentValidation, no `[ThrowIfNotPassed]`. All validation is handler-side.

## Handler-Level Validation

| Handler | Validates | Throws |
|---|---|---|
| `IGetAccountCommunicationChannelServicesHandler` | `AccountId` exists | (none surfaced — empty list returned for unknown accounts) |
| `IGetAccountApplicationServicesHandler` | `AccountId` exists | (same) |
| `ICreateAccountServicesHandler` | All Comm/App ids exist in catalog, account exists, no duplicates | `CommChannelNotFound`, `ApplicationNotFound` |
| `IChangeAccountCommunicationChannelServiceVisibilityHandler` | Service exists for account, current state allows the transition (can't hide an active service) | `CommChannelNotFound`, `CannotHideActiveService`, `UnauthorizedAction` |
| `IChangeAccountApplicationServiceVisibilityHandler` | Same shape for applications | `ApplicationNotFound`, `CannotHideActiveService`, `UnauthorizedAction` |

## Policy Enforcement

- `POST /create-account-services`: `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` — only Falcon admins can provision services for an account. Typically called via Kafka by Commerce's `CreateMainNodeProcess` (but Provisioning has no consumer in this scan — verify whether Commerce calls Provisioning over HTTP).
- `PUT /account/comm-channel/visibility` and `PUT /account/application/visibility`: `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]`.
- All read endpoints inherit `[Authorize]` from class — both client and Falcon users can read.

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` (sic — typo) fails service startup if any error code lacks a translation in `Resources/ErrorMessages.{en,ar}.resx`.

## Multi-Language

`MultiLanguage` is defined and available. Not consumed by any of the public Provisioning DTOs in this scan.

## ServiceOperationResult Conformance

All endpoints return `ServiceOperationResult<T>` — conformant.

## UnitOfWork Wrap

`UnitOfWorkFilter` is registered globally; wraps each action in a Mongo session.
