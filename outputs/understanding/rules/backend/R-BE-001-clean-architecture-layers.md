---
ruleId: R-BE-001
name: Clean Architecture layers — dependencies point inward only
category: architecture
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/*.cs"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
    - "**/Program.cs"
    - "**/Startup.cs"
severity: must
detector:
  type: ast
  patterns:
    - 'UsingDirectiveSyntax inside a file whose project path matches "*.Domain*" that references "*.Application*", "*.Infrastructure*", or "*.Api*"'
    - 'UsingDirectiveSyntax inside a file whose project path matches "*.Application*" that references "*.Infrastructure*" or "*.Api*"'
    - 'UsingDirectiveSyntax inside a file whose project path matches "*.Application*" or "*.Domain*" that references "Microsoft.EntityFrameworkCore*", "MongoDB.Driver*", "StackExchange.Redis*", "Confluent.Kafka*"'
  description: Roslyn walk that verifies project-to-project references and using directives respect the layered direction Domain → Application → Infrastructure → Api. Flags any inward layer referencing an outer layer, and any leakage of EF Core, MongoDB.Driver, StackExchange.Redis, or Kafka client types into Application or Domain.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Move the offending type behind an abstraction (port) in Application, implement the adapter in Infrastructure, and inject via DI.'
relatedRules:
  - R-BE-002
  - R-BE-003
  - R-BE-004
source:
  - file: Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md
    location: wiki
  - file: Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-001 — Clean Architecture layers; dependencies point inward only ***
*** Source: Falcon Architecture Wiki — Clean Architecture & DDD ***
*** Detector: ast (Roslyn) ***

# R-BE-001 — Clean Architecture layers; dependencies point inward only

## What it says

Every Falcon backend service MUST be organized as four .NET projects — `<Service>.Domain`, `<Service>.Application`, `<Service>.Infrastructure`, `<Service>.Api` (plus optional `<Service>.Contracts`) — and the project-to-project references MUST follow this exact direction:

- `Domain` → references **nothing** (or only primitive shared libraries)
- `Application` → references `Domain` only
- `Infrastructure` → references `Application` (+ `Domain` when needed)
- `Api` → references `Application` + `Contracts` (and `Infrastructure` only for DI wiring in `Program.cs` / composition root)

Inner layers MUST NOT reference outer layers. In addition, **infrastructure-flavored types** — `Microsoft.EntityFrameworkCore.*`, `MongoDB.Driver.*`, `StackExchange.Redis.*`, `Confluent.Kafka.*`, vendor SDKs — MUST NEVER appear in `Domain` or `Application`. Persistence and messaging are reached through **ports (interfaces)** declared in `Application/Abstractions` and **adapters (implementations)** that live in `Infrastructure`.

## Why it exists

Clean Architecture is the load-bearing decision behind every Falcon backend service. The Domain holds business truths (entities, value objects, domain services, invariants) that must remain pure — they encode rules that survive any framework change. The Application holds use cases that orchestrate the domain via abstractions. The Infrastructure project is the only seam allowed to touch databases, message buses, and external APIs. When a developer drops an `EF DbContext` into Application or imports `MongoDB.Driver` from Domain, the seam collapses: business logic becomes untestable without spinning up Mongo, the use-case definition becomes fused to a vendor model, and porting / refactoring becomes weeks of work. The Falcon wiki states the rule plainly: "dependencies point inward" and "Domain should not reference Application or Infrastructure. Application should not reference Infrastructure."

## Detector strategy

Roslyn AST + project-graph walk, run once per service repo:

1. Build a project graph from the `.sln` file. Classify each project by suffix:
   - `*.Domain` → layer index 0
   - `*.Application` → layer index 1
   - `*.Infrastructure` → layer index 2
   - `*.Api` → layer index 3
   - `*.Contracts` → side layer (no inbound layer restriction; consumed by Api + Application)
2. For every `ProjectReference` element in every `.csproj`, emit a violation if the referenced project's layer index is **greater than** the referencing project's layer index. (e.g., `Domain` referencing `Application` → violation.)
3. For every `.cs` file in `Domain` and `Application`, enumerate `UsingDirectiveSyntax` nodes. Match the namespace against a deny-list of infrastructure namespaces:
   - `Microsoft.EntityFrameworkCore*`
   - `MongoDB.Driver*`
   - `StackExchange.Redis*`
   - `Confluent.Kafka*`
   - `Dapper*`
   - `Microsoft.AspNetCore.Mvc*` (Application/Domain only — Api is allowed)
   - Vendor SDKs explicitly listed in `detectors/banned-namespaces.json`
4. Each hit is a violation row with file path, line number, offending namespace, and the layer it appears in.

Detector implementation lives at `detectors/ast-runner.cs` and reuses the same Roslyn workspace as R-BE-002.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Application/Abstractions/IOrderRepository.cs
// Application defines the PORT — no EF, no Mongo, no vendor types.
namespace Falcon.Commerce.Application.Abstractions;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct);
    Task AddAsync(Order order, CancellationToken ct);
}
```

```csharp
// File: src/Commerce.Infrastructure/Persistence/OrderRepository.cs
// Infrastructure ADAPTER — Mongo lives here, behind the port.
using MongoDB.Driver;
using Falcon.Commerce.Application.Abstractions;
using Falcon.Commerce.Domain.Orders;

namespace Falcon.Commerce.Infrastructure.Persistence;

public class OrderRepository : IOrderRepository
{
    private readonly IMongoCollection<Order> _coll;
    public OrderRepository(IMongoDatabase db) => _coll = db.GetCollection<Order>("orders");

    public Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct) =>
        _coll.Find(o => o.Id == id).FirstOrDefaultAsync(ct);

    public Task AddAsync(Order order, CancellationToken ct) =>
        _coll.InsertOneAsync(order, cancellationToken: ct);
}
```

### ❌ Bad

```csharp
// File: src/Commerce.Application/UseCases/SubmitOrder/SubmitOrderHandler.cs
// ❌ Application imports MongoDB.Driver directly — adapter leaked through the port.
using MongoDB.Driver;                                  // ❌ violates R-BE-001
using Microsoft.EntityFrameworkCore;                    // ❌ violates R-BE-001

namespace Falcon.Commerce.Application.UseCases.SubmitOrder;

public class SubmitOrderHandler
{
    private readonly IMongoCollection<Order> _orders;   // ❌ vendor type in Application

    public SubmitOrderHandler(IMongoCollection<Order> orders) => _orders = orders;

    public async Task<ServiceOperationResult<Guid>> Handle(SubmitOrderCommand cmd)
    {
        var order = Order.Submit(cmd);
        await _orders.InsertOneAsync(order);             // ❌ infrastructure call from Application
        return ServiceOperationResult<Guid>.Ok(order.Id);
    }
}
```

```xml
<!-- File: src/Commerce.Domain/Commerce.Domain.csproj -->
<!-- ❌ Domain references Application — wrong direction. -->
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <ProjectReference Include="..\Commerce.Application\Commerce.Application.csproj" />
  </ItemGroup>
</Project>
```

## Known legitimate exemptions

- **Composition root** — `Program.cs` / `Startup.cs` in the `Api` project may reference `Infrastructure` for DI registration. This is the canonical Clean Architecture exception.
- **Test projects** — `*/Tests/**` and `*.spec.cs` may compose any layer for integration testing.
- **Shared primitive libraries** — `Falcon.Shared`, `Falcon.Shared.Contracts` may be referenced by Domain.
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-001` with a justification + date.

## Fix recipe

For a leaked infrastructure type:

1. Identify the operation being performed (read, write, publish, query).
2. Declare a port interface in `<Service>.Application/Abstractions/` — e.g., `IOrderRepository`, `IEventPublisher`, `IRiskService`.
3. Move the vendor-typed implementation to `<Service>.Infrastructure/` under `Persistence/`, `Messaging/`, or `Clients/<ServiceName>/`.
4. Register the adapter against the port in the Api project's composition root.
5. Replace the leaked usage with the port interface, injected via constructor.
6. Re-run the detector.

For a wrong-direction project reference:

1. Open the offending `.csproj`.
2. Remove the outward `ProjectReference`.
3. If the inner layer genuinely needs a contract, move that contract down to the inner layer or to `Contracts`.
4. Recompile; resolve any cascading compile errors by introducing ports where the call sites need behavior, not types.

Because every fix is a structural change, night-shift auto-fix is **disabled**. Each violation becomes a row in the Decisions Queue with the suggested port name.

## Related rules

- [[R-BE-002-no-app-service-to-app-service]] — sibling: enforces single-use-case ownership inside Application
- [[R-BE-003-internal-services-no-gateway]] — sibling: enforces correct cross-service composition
- [[R-BE-004-service-operation-result-wrapper]] — works with this rule to keep Application boundaries explicit

## Sources of truth

1. `falcon-wiki/Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md` — sections "Clean Architecture projects", "Project dependencies (who can reference whom)"
2. `falcon-wiki/Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md` — section ".NET Solution & Project Naming Inside Each Repo"
3. `CLAUDE.md` (project root) — Key Architecture Rules section, rule 1
