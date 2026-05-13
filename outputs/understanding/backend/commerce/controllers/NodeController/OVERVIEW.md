# NodeController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/NodeController.cs` (320 lines)
> Largest controller in Commerce (26 endpoints) — chosen as the representative drill-down.

## Purpose

Owns all operations against **nodes** (account-organization tree elements):
- Hierarchy reads (`GetHierarchy`, `ValidateAccountName`)
- Hierarchy mutations (`CreateMainNode`, `CreateSubNode`, `ChangeNodeName`)
- Per-account service catalog queries (`GetAccountCommunicationChannels`, `GetAccountApplications`, visibility variants)
- Per-account service catalog mutations — visibility, pricing type, pricing value (all `FalconOnly`)
- Per-account service lifecycle — enable/disable/do-payment flows
- Pending price-change cancellation (DELETE endpoints, all `FalconOnly`)
- Order status read

## Architecture

The controller is **thin**: each action does three things in order:

1. Build a Command / Query — often via AutoMapper (`_mapper.Map<XxxCommand>(request)`)
2. Call the handler — `_handler.ExecuteAsync(command)`
3. Wrap the result in `ServiceOperationResult<TResponse>.Success(_mapper.Map<TResponse>(result))`

22 separate handler interfaces are injected via constructor:

```csharp
- IMapper
- ICreateMainNodeProcess          (uses Process suffix — orchestrates multi-step creation)
- IChangeNodeNameHandler
- ICreateSubNodeHandler
- IValidateAccountNameHandler
- IGetOrgHierarchyNodeHandler
- IGetAccountCommunicationChannelsHandler
- IGetVisibleCommunicationChannelsHandler
- IGetVisibleCommunicationChannelDetailsHandler
- IGetAccountApplicationsHandler
- IChangeAccountCommunicationChannelServiceVisibilityHandler
- IChangeAccountApplicationServiceVisibilityHandler
- IChangeCommunicationChannelPriceTypeHandler
- IChangeApplicationPriceTypeHandler
- IChangeCommunicationChannelPriceValueHandler
- IChangeApplicationPriceValueHandler
- IDisableCommunicationChannelHandler
- IEnableCommunicationChannelHandler
- IDisableApplicationHandler
- IEnableApplicationHandler
- IDeleteCommunicationChannelNewPriceTypeHandler
- IDeleteCommunicationChannelNewPriceValueHandler
- IDeleteApplicationNewPriceTypeHandler
- IDeleteApplicationNewPriceValueHandler
- ICreateFalconServiceOrderHandler
- IGetOrderStatusHandler
```

Note the **`Process` vs. `Handler` suffix distinction** — `Process` means a multi-step orchestrator that may publish Kafka events; `Handler` means a single CQRS handler. The Wiki says Application Services cannot call other Application Services — `CreateMainNodeProcess` likely sits one layer up as a coordinator that calls multiple handlers.

## Authorization

- Class-level: `[Authorize]` and `[ApiController]`
- Action-level overrides:
  - `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` on all visibility-change, price-change, price-value-change, and pending-price-deletion actions (12 endpoints total)
- All other endpoints: client + falcon both allowed (subject to gateway policy)

## Code Smells / Findings

1. **Method name collision (compile-allowed):** Two methods are both named `ChangeCommunicationChannelPriceType`:
   - `public async Task<...> ChangeCommunicationChannelPriceType(ChangeCommunicationChannelPriceTypeRequest request)` → `PUT /comm-channel/price-type` (line 194)
   - `public async Task<...> ChangeCommunicationChannelPriceType(ChangeApplicationPriceTypeRequest request)` → `PUT /application/price-type` (line 212)
   - C# allows the overload because parameter types differ, but reflection-based OpenAPI generation may collide on action names. Verify Swagger UI shows both.
   - Recommend renaming the second to `ChangeApplicationPriceType` for clarity.

2. **Constructor with 25 dependencies** — classic constructor-injection bloat. Either split this controller into `NodeAdminController` / `NodeReadController` / `NodeOrderController`, or use the IMediator pattern (the Wiki recommends Mediator over direct handler injection in most other services).

3. **Inconsistent route casing.** Most routes are kebab-case (`comm-channel/visibility`), but `ChangeNodeName` and `ValidateAccountName` use PascalCase. Pick one.

4. **`_changeApplicationPriceTypeHandler` is injected but never assigned** — constructor parameter is `changeApplicationPriceTypeHandler` (camel-cased), but no `_changeApplicationPriceTypeHandler = changeApplicationPriceTypeHandler;` statement in the body. The field stays null → NRE at runtime when `ChangeCommunicationChannelPriceType(ChangeApplicationPriceTypeRequest)` is called. **High-severity bug.** Verify against current main.

5. **Two identical `DoPayment*` actions** both call `_createFalconServiceOrderHandler.ExecuteAsync(...)` with `CreateFalconServiceOrderCommand` mapped from different DTOs. The discrimination between application order and comm-channel order happens entirely inside the command — could be one endpoint accepting a `ServiceType` discriminator.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
