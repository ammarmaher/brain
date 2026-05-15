---
ruleId: R-BE-002
name: Application Service must not call another Application Service
category: architecture
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
severity: must
detector:
  type: ast
  patterns:
    - 'ClassDeclaration whose constructor parameter type ends with "AppService" or "ApplicationService" inside a class that also ends with "AppService" or "ApplicationService"'
  description: Walks Roslyn syntax tree; flags any constructor injection of an Application Service into another Application Service. Domain services, repositories, infrastructure clients, IMediator, IPublisher are allowed.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Refactor to (a) Domain Service, (b) MediatR notification, or (c) coordinator/orchestrator class — needs architect review'
relatedRules:
  - R-BE-001
  - R-BE-003
  - R-XC-001
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

*** Rule R-BE-002 — Application Service can NOT call another Application Service ***
*** Source: Falcon Architecture Wiki — Clean Architecture & DDD ***
*** Detector: ast (Roslyn) ***

# R-BE-002 — Application Service must not call another Application Service

## What it says

Inside any Falcon backend service, an **Application Service** class (suffix `AppService` or `ApplicationService`) MUST NOT depend on another Application Service via constructor injection, method call, or property access. Cross-cutting work between two application use-cases is done through:

1. **Domain Services** — when the rule is a pure domain invariant
2. **MediatR notifications / events** — when the work is fire-and-forget
3. **Coordinator / orchestrator classes** — when sequential composition is required

## Why it exists

Application Services are a Clean Architecture seam that orchestrates a single use-case end-to-end. Letting one app-service call another collapses the use-case boundary, creates fragile transactional contracts, and produces a giant ball of mutual dependencies that cannot be ported, mocked, or evolved. Stated explicitly in the Falcon architecture wiki under Clean Architecture & DDD.

## Detector strategy

Roslyn AST walk (one pass per service repo):

1. Enumerate every `ClassDeclarationSyntax` whose Identifier ends with `AppService` or `ApplicationService`.
2. For each, find every `ConstructorDeclarationSyntax` belonging to that class.
3. For each constructor parameter, resolve its `TypeSyntax` to a `INamedTypeSymbol`.
4. If the symbol's name (or any of its base types / interfaces) ends with `AppService` / `ApplicationService` → emit violation.
5. Also flag any `MemberAccessExpressionSyntax` on a field/property whose type matches the pattern (catches non-constructor injection).

Detector implementation lives at `detectors/ast-runner.cs`.

## Examples

### ✅ Good

```csharp
// File: src/Application/Services/AccountAppService.cs
public class AccountAppService : IAccountAppService
{
    private readonly IAccountDomainService _domain;
    private readonly IAccountRepository _repo;
    private readonly IPublisher _publisher;

    public AccountAppService(
        IAccountDomainService domain,
        IAccountRepository repo,
        IPublisher publisher)
    {
        _domain = domain;
        _repo = repo;
        _publisher = publisher;
    }

    public async Task<ServiceOperationResult<Guid>> CreateAsync(CreateAccountRequest req)
    {
        var account = _domain.BuildAccount(req);   // domain service ✅
        await _repo.AddAsync(account);
        await _publisher.Publish(new AccountCreated(account.Id));  // fire-and-forget ✅
        return ServiceOperationResult<Guid>.Ok(account.Id);
    }
}
```

### ❌ Bad

```csharp
// File: src/Application/Services/AccountAppService.cs
public class AccountAppService : IAccountAppService
{
    private readonly IUserAppService _userAppService;        // ❌ another app-service
    private readonly IOrganizationAppService _orgAppService; // ❌ another app-service

    public AccountAppService(
        IUserAppService userAppService,
        IOrganizationAppService orgAppService)
    {
        _userAppService = userAppService;
        _orgAppService = orgAppService;
    }

    public async Task<ServiceOperationResult<Guid>> CreateAsync(CreateAccountRequest req)
    {
        var user = await _userAppService.CreateAsync(req.User);   // ❌ violates R-BE-002
        var org = await _orgAppService.AttachAsync(user.Id);      // ❌ violates R-BE-002
        return ServiceOperationResult<Guid>.Ok(org.Id);
    }
}
```

## Known legitimate exemptions

- **Test projects** — `*/Tests/**` and `*.spec.cs` may compose app-services in integration tests
- **Coordinator classes** explicitly named `*Coordinator` or `*Orchestrator` are NOT app-services and may compose multiple app-services (file a separate decision if introducing one)
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-BE-002`

## Fix recipe

For each violation:

1. **Identify the seam** — what is the actual collaboration trying to accomplish?
   - Pure domain invariant → extract a **Domain Service** that both app-services depend on
   - Side-effect or eventual consistency → publish an **integration event** via MediatR `IPublisher`, let the second app-service subscribe
   - Strict sequential composition → introduce a **Coordinator** / Orchestrator class that depends on both app-services
2. Move the violating call into the chosen seam.
3. Update DI registrations.
4. Update unit tests.
5. Re-run detector.

Because all three remediations are non-trivial architectural decisions, night-shift auto-fix is disabled. Each violation becomes a row in the Decisions Queue with the suggested refactor target.

## Related rules

- [[R-BE-001-clean-architecture-layers]] — the parent rule that this enforces
- [[R-BE-003-internal-services-no-gateway]] — sibling: cross-service composition rule
- [[R-XC-001-identity-owns-user-lifecycle]] — concrete example: Commerce app-service must NOT call Identity app-service

## Sources of truth

1. `falcon-wiki/Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md`
2. `falcon-wiki/Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md`
3. `CLAUDE.md` (project root) — Key Architecture Rules section, rule 2
