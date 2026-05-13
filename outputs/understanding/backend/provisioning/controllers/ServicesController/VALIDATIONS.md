# ServicesController — Validations

## DTO-Level Validation

None. All request DTOs in `Falcon.Provisioning.Contracts/Models/RequestsDtos/` are plain POCOs.

## Handler-Level Validation

| Handler | Validation Responsibilities |
|---|---|
| `IGetAccountCommunicationChannelServicesHandler` | Returns empty list for unknown account (no exception); tenant-scoping enforced via `IAccessCurrentUser` for client users (verify) |
| `IGetAccountApplicationServicesHandler` | Same |
| `ICreateAccountServicesHandler` | Verifies catalog membership (each `CommChannelId` and `ApplicationId` exists globally); rejects duplicate provisioning for the same account+service combo |
| `IChangeAccountCommunicationChannelServiceVisibilityHandler` | Verifies the service exists for the account; rejects `Visibility=false` when status is Active → `CannotHideActiveService` |
| `IChangeAccountApplicationServiceVisibilityHandler` | Same shape for applications |

## Authorization

- Class-level `[Authorize]` requires a valid JWT
- Per-action `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` on mutation endpoints (3 of 5)
- Reads (GET) are open to both client and Falcon users; tenant-scoping happens inside the handler (Falcon admins can read across tenants; client users only see their tenant's data — verify enforcement)

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` (sic) fails service startup if any `FalconKeys.Error` code lacks a translation.

## UnitOfWork

Global `UnitOfWorkFilter` wraps every action. For pure-read GET endpoints this is wasteful but harmless.

## Multi-Language

No multi-language fields on ServicesController DTOs.
