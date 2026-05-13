# ServicesController — Drill-down

> File: `falcon-core-provisioning-svc/src/Falcon.Provisioning.Api/Controllers/ServicesController.cs` (~80 lines)
> Only non-Lookup controller in the service; covers the full Provisioning surface (5 endpoints).

## Purpose

Five operations against per-account service subscriptions:
1. `GetAccountCommunicationChannelServices` — read all comm-channel services for an account
2. `GetAccountApplicationServices` — read all application services for an account
3. `CreateAccountServices` — provision the initial set of services when a new account is created
4. `ChangeAccountCommunicationChannelServiceVisibility` — toggle visibility for one channel
5. `ChangeAccountApplicationServiceVisibility` — toggle visibility for one application

## Architecture

Constructor injects 5 handlers via `IMapper`:
- `IGetAccountCommunicationChannelServicesHandler`
- `IGetAccountApplicationServicesHandler`
- `ICreateAccountServicesHandler`
- `IChangeAccountCommunicationChannelServiceVisibilityHandler`
- `IChangeAccountApplicationServiceVisibilityHandler`

Each action is the same shape:
1. Map request → command (or use route param as query)
2. `handler.ExecuteAsync(command)` → result
3. AutoMapper-map result → response
4. Wrap in `ServiceOperationResult<T>`

## Authorization

Class level: `[Authorize]`.

Per-action overrides:
- `POST /create-account-services` → `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]`
- `PUT /account/comm-channel/visibility` → `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]`
- `PUT /account/application/visibility` → `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]`

Read endpoints are open to both client and Falcon users.

## Code Smells / Findings

1. **DTO typo:** `GetAccountApplicationServiceRespose` and `GetAccountCommunicationChannelServiceRespose` should be `Response`. Visible in DTO files **and** controller return type signatures. Wire impact: camelCase JSON will be `accountApplicationServiceRespose` — but the property is wrapped in `ServiceOperationResult.Result` so the client only sees the JSON, not the type name. Renaming is safe.
2. **Constructor parameter name typo:** `gGetAccountCommunicationChannelServicesHandler` (double `g`) in the constructor parameter list — assigned to `_getAccountCommunicationChannelServicesHandler`. Harmless but ugly.
3. **No XML doc comments** anywhere in the controller.
4. **`CreateAccountServices` is the only POST** and is `FalconOnly` — fine, but consider whether the call should come over Kafka instead of HTTP (the platform standard recommends "internal services NEVER call each other through gateways — use gRPC/Kafka directly"). Commerce calls Provisioning over HTTP via `ServicesClients:Provisioning` in `appsettings.json` — this is **east-west traffic** that violates the Wiki standard. Surface as a finding.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
