# ContractsController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/ContractsController.cs` (73 lines)
> 4 endpoints — owns the per-account **Contract** lifecycle (rate plans, quotas, unit conversions, overage rates).

## Purpose

Provides full CRUD-minus-Delete for the account-level **Contract** entity:
- `GET /api/Contracts?accountId=` — list account contracts (summary)
- `GET /api/Contracts/{contractId}` — full contract with tariff plan
- `POST /api/Contracts` — create contract + tariff plan
- `PUT /api/Contracts/{contractId}` — update contract; publishes activation/expiration events

Contracts compose 4 sub-collections inside the TariffPlan:
- **Rates** — per (application, channel, priority, destination, unit)
- **UnitConversions** — code→ratingUnit mappings with price values
- **Quotas** — included amount + units per (channel, category, type, scope)
- **OverageRates** — per-(subService, channel) overage pricing with billing cycle

## Architecture

- Constructor injection (5 dependencies)
- AutoMapper used for request → command, result → response
- Heavily relies on domain entities `Contract`, `ContractTariffPlan`, and `IValidateContractWalletStrategyPolicy`
- Update path publishes `ContractActivatedEvent` or `ContractExpiredEvent` to Charging based on resulting status

```csharp
public ContractsController(
    IMapper mapper,
    IListContractsHandler listContractsHandler,
    IGetContractHandler getContractHandler,
    ICreateContractHandler createContractHandler,
    IUpdateContractHandler updateContractHandler)
```

[CODE] `ContractsController.cs:24-36`

## Route Prefix

`/api/Contracts` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[ApiController] [Authorize]`
- No action-level overrides → any authenticated JWT
- Tenant-isolation enforced inside handlers: Client users can only access their own tenant's contracts (`ValidateCurrentUser(accountId)` raises `OwnerIdNotMatchWithTenantId`)

[CODE] `CreateContractHandler.cs:98-102`, `UpdateContractHandler.cs:164-168`, `GetContractHandler.cs:44-48`, `ListContractsHandler.cs:29-30`.

## Collaborators

| Type | Used For |
|---|---|
| `IRepository<Contract>` | Contract CRUD |
| `IRepository<Settings>` | Wallet strategy lookup for policy check |
| `IRepository<Node>` | Node-type check on create |
| `IRepository<Application>` | Application name resolution for tariff plan |
| `IRepository<CommunicationChannel>` | Channel name resolution for tariff plan |
| `ICurrentUser` | UserType + TenantId for tenant isolation |
| `ITranslateHelper` | Translate `MultiLanguageName` for response |
| `IValidateContractWalletStrategyPolicy` | Domain policy — wallet currency + strategy must be compatible with contract currency |
| `IEventPublisher<ContractActivatedEvent>` | Kafka — sent on Update when status becomes Active |
| `IEventPublisher<ContractExpiredEvent>` | Kafka — sent on Update when status becomes Expired |

## Kafka Events

| Event | When | Consumer |
|---|---|---|
| `ContractActivatedEvent` | `PUT /api/Contracts/{id}` resolves to `eContractStatus.Active` | Charging service — projects tariff plan into its rating engine |
| `ContractExpiredEvent` | `PUT /api/Contracts/{id}` resolves to `eContractStatus.Expired` | Charging service — invalidates tariff projection |

`POST /api/Contracts` does **NOT** publish events directly — the entity is created and stored, then activation timing is determined by the `ContractLifecycleProcess` background job (see [CODE] `Falcon.Commerce.Application/Services/Processes/ContractLifecycleProcess.cs`).

## Findings

1. **Two distinct activation paths.** Create stores the contract but doesn't activate it; the `ContractLifecycleProcess` (Hangfire-scheduled) handles transition Pending → Active based on `StartDate`. Update can directly transition status if the domain `Contract.Update(...)` method recomputes status from new dates.

2. **`RemainingBalance` is hard-coded to null in list response.** [CODE] `ListContractsHandler.cs:46`:
   ```csharp
   RemainingBalance = null
   ```
   Either intentional (Charging service owns balance — Commerce should east-west query) or **F-004 incomplete-implementation drift**. PRD wireframes may show remaining balance — verify.

3. **Per-tariff-plan unique IDs** generated server-side via `ObjectId.GenerateNewId().ToString()[..8].ToUpperInvariant()`:
   - Rates: `RATE-XXXXXXXX`
   - UnitConversions: `UC-XXXXXXXX`
   - Quotas: `Q-XXXXXXXX`
   - OverageRates: `OR-XXXXXXXX`

   8-character prefix from a 24-character ObjectId — birthday collision risk at high volume (~50% collision at ~10K IDs). Verify uniqueness constraint exists in Mongo schema.

4. **All sub-collection IDs regenerate on Update.** [CODE] `UpdateContractHandler.cs:81, 94, 105, 119`. Every PUT replaces all Rate IDs, UnitConversion IDs, Quota IDs, OverageRate IDs. **Drift if PRD expects stable IDs across updates** (e.g. for audit trail or external references).

5. **AccountId-fed contract creation, but no node-type check.** [CODE] `CreateContractHandler.cs:84-89`. Loads the node and uses its `NodeType` for the policy check, but does not reject sub-nodes outright. The policy decides. Verify whether sub-node contracts are intentional.

6. **Currency enum nullable check**: `[EnumDataType(typeof(eCurrency))]` on `CreateContractRequest.Currency` but no `[Required]` for it. Default zero-value `eCurrency.None` (if present) silently passes. Drift candidate.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
