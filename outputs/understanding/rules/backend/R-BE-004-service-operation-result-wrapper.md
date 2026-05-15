---
ruleId: R-BE-004
name: ServiceOperationResult<T> wrapper on every public Application Service method
category: pattern
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/Application/**/*.cs"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
    - "**/Abstractions/**/I*Repository.cs"
    - "**/Abstractions/**/I*Publisher.cs"
    - "**/Abstractions/**/I*Gateway.cs"
severity: must
detector:
  type: ast
  patterns:
    - 'MethodDeclarationSyntax inside a public class/interface whose name ends with "AppService", "ApplicationService", "Handler", "UseCase", "CommandHandler", "QueryHandler" whose return type is NOT ServiceOperationResult<T> / Task<ServiceOperationResult<T>> / ValueTask<ServiceOperationResult<T>>'
  description: Roslyn walk over Application-layer classes. Flags any public method on an Application Service / Handler / UseCase whose return type is a bare T, Task<T>, Task, IActionResult, ActionResult<T>, or any DTO/entity instead of ServiceOperationResult<T>. Repository, Publisher, and Gateway ports are exempt — they live behind the Application boundary.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Wrap the return value: return ServiceOperationResult<T>.Ok(value) on success; return ServiceOperationResult<T>.Fail(FalconError.<code>) on failure. Update callers and controller mappings.'
relatedRules:
  - R-BE-001
  - R-BE-002
  - R-BE-006
source:
  - file: CLAUDE.md
    location: project-root
  - file: Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md
    location: wiki
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-004 — Every public Application Service method returns ServiceOperationResult<T> ***
*** Source: Falcon Platform Standards — CLAUDE.md ***
*** Detector: ast (Roslyn) ***

# R-BE-004 — ServiceOperationResult<T> wrapper on every public Application Service method

## What it says

Every **public** method on a Falcon Application Service, Command Handler, Query Handler, or Use Case (any class whose name ends with `AppService`, `ApplicationService`, `Handler`, `UseCase`, `CommandHandler`, or `QueryHandler`, and any interface those classes implement) MUST return `ServiceOperationResult<T>` — wrapped in `Task<>` or `ValueTask<>` for async — and MUST NOT return:

- a bare `T` (raw entity, raw DTO, raw primitive)
- a bare `Task<T>` / `ValueTask<T>` where `T` is not `ServiceOperationResult<...>`
- a bare `Task` (use `ServiceOperationResult` non-generic variant for void-style ops)
- `IActionResult` / `ActionResult<T>` (transport concerns belong to the Api layer, not Application)
- a domain entity directly

The Application boundary speaks one return shape. Success or failure, both flow as `ServiceOperationResult<T>` carrying the value, the `FalconError` code, and any contextual metadata. Controllers in the Api layer translate the wrapper into HTTP responses; gRPC handlers translate it into gRPC status codes; consumers translate it into log + metric. The translation happens **once**, at the edge.

## Why it exists

Falcon ships four .NET services that all expose the same operations through three different surfaces — REST controllers, gRPC handlers, Kafka consumers — and every surface needs a consistent way to communicate **success with payload**, **business failure with error code**, **validation failure with field-level details**, and **infrastructure failure**. Returning bare types forces every transport handler to invent its own success/error mapping; returning `IActionResult` from Application binds the use-case to ASP.NET Core and breaks gRPC + Kafka reuse; returning entities leaks internal models past the Application boundary. `ServiceOperationResult<T>` is the single response envelope the platform standardized on (CLAUDE.md Platform Standards, line 1). It pairs with `FalconException` + `FalconError` codes (R-BE-006) so every layer composes the same error vocabulary.

## Detector strategy

Roslyn AST walk over `src/**/Application/**/*.cs` per service:

1. Build a Roslyn `Compilation` for the service solution.
2. Enumerate every `ClassDeclarationSyntax` and `InterfaceDeclarationSyntax` whose identifier matches the application-class suffix regex: `(AppService|ApplicationService|Handler|UseCase|CommandHandler|QueryHandler)$`.
3. For each, enumerate `MethodDeclarationSyntax` nodes that are `public` (or interface members, which are implicitly public).
4. Resolve the method's `ReturnType` to a `INamedTypeSymbol`. Strip one layer of `Task<>` / `ValueTask<>` if present.
5. The remaining symbol MUST be either `ServiceOperationResult` (non-generic) or `ServiceOperationResult<T>` for some `T`.
6. Anything else → emit a violation with file, line, class name, method name, and observed return type.

Exemptions inside the AST walk:

- Port interfaces (`I*Repository`, `I*Publisher`, `I*Gateway`, `I*Client`) — these speak in raw types because they are infrastructure-facing.
- Private / internal helper methods inside an Application class.
- Methods explicitly tagged with `[ApplicationInternal]` attribute (escape hatch — adds to Decisions Queue).

Detector implementation lives at `detectors/ast-runner.cs`.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrder/SubmitOrderHandler.cs
public class SubmitOrderHandler : ICommandHandler<SubmitOrderCommand, Guid>
{
    private readonly IOrderRepository _repo;
    private readonly IPublisher _publisher;

    public SubmitOrderHandler(IOrderRepository repo, IPublisher publisher)
    {
        _repo = repo;
        _publisher = publisher;
    }

    public async Task<ServiceOperationResult<Guid>> Handle(
        SubmitOrderCommand cmd,
        CancellationToken ct)
    {
        var order = Order.Submit(cmd);
        if (order is null)
            return ServiceOperationResult<Guid>.Fail(FalconError.OrderInvalid);

        await _repo.AddAsync(order, ct);
        await _publisher.Publish(new OrderSubmittedV1(order.Id), ct);

        return ServiceOperationResult<Guid>.Ok(order.Id);   // ✅
    }
}
```

```csharp
// File: src/Commerce.Application/Orders/Queries/GetOrderByIdQuery.cs
public interface IGetOrderByIdQuery
{
    Task<ServiceOperationResult<OrderDto>> Execute(Guid orderId, CancellationToken ct);   // ✅
}
```

### ❌ Bad

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrder/SubmitOrderHandler.cs
public class SubmitOrderHandler
{
    public async Task<Guid> Handle(SubmitOrderCommand cmd)                  // ❌ bare Task<Guid>
    {
        var order = Order.Submit(cmd);
        await _repo.AddAsync(order);
        return order.Id;                                                     // ❌ raw payload
    }

    public async Task<IActionResult> HandleHttp(SubmitOrderCommand cmd)      // ❌ ASP.NET in Application
    {
        var order = Order.Submit(cmd);
        await _repo.AddAsync(order);
        return new OkObjectResult(order);                                    // ❌ transport leakage + raw entity
    }

    public async Task<OrderDto> GetById(Guid id)                             // ❌ bare DTO
    {
        return await _repo.GetByIdAsync(id);
    }
}
```

## Known legitimate exemptions

- **Port interfaces** under `Application/Abstractions/` — `IOrderRepository`, `IEventPublisher`, `IPaymentGateway`, etc. These contracts speak in raw domain/value types because they are crossed by Infrastructure adapters.
- **Test projects** — `*/Tests/**` and `*.spec.cs`.
- **Private and internal helper methods** inside an Application class.
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-004` with a justification + date.

## Fix recipe

For each violation:

1. Locate the method's return value(s). Identify success path(s) and failure path(s).
2. Change the return type to `Task<ServiceOperationResult<T>>` where `T` is the payload (Guid, DTO, etc.). Use `Task<ServiceOperationResult>` (non-generic) for void operations.
3. On success path: `return ServiceOperationResult<T>.Ok(value);`
4. On business-rule failure: `return ServiceOperationResult<T>.Fail(FalconError.<SpecificCode>);` — pair with R-BE-006.
5. Update **callers** in the Api layer to unwrap the result:
   ```csharp
   var result = await _handler.Handle(cmd, ct);
   return result.IsSuccess
       ? Ok(result.Value)
       : result.ToHttpResponse();   // shared extension
   ```
6. Update **callers** in gRPC handlers + Kafka consumers similarly via their respective `ToGrpcStatus()` / `ToConsumerOutcome()` extensions.
7. Update unit tests to assert on `result.IsSuccess` and `result.Error.Code`.
8. Re-run the detector.

Because the wrapper change ripples through controllers and tests, auto-fix is **disabled**.

## Related rules

- [[R-BE-001-clean-architecture-layers]] — keeps `IActionResult` out of Application
- [[R-BE-002-no-app-service-to-app-service]] — same boundary discipline
- [[R-BE-006-falcon-exception-error-codes]] — `FalconError` codes are how `ServiceOperationResult.Fail` carries failure information

## Sources of truth

1. `CLAUDE.md` (project root) — Platform Standards section, line "Response wrapper: `ServiceOperationResult<T>` everywhere"
2. `falcon-wiki/Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md` — section "Application Service" (defines the orchestration boundary)
