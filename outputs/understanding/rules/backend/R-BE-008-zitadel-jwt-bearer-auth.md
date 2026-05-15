---
ruleId: R-BE-008
name: Zitadel JWT Bearer auth on controllers + ICurrentUser for claims
category: auth
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/Api/**/*.cs"
    - "src/**/Application/**/*.cs"
    - "src/**/Infrastructure/**/*.cs"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
    - "**/Program.cs"
    - "**/Startup.cs"
severity: must
detector:
  type: ast
  patterns:
    - 'ClassDeclarationSyntax inheriting from ControllerBase or Controller, OR carrying [ApiController], that has neither [Authorize] nor [AllowAnonymous] at the class level — AND that has at least one public action method without its own [Authorize] / [AllowAnonymous] attribute'
    - 'MemberAccessExpressionSyntax matching "HttpContext.User.Claims", "HttpContext.User.FindFirst(", "User.Claims", "User.FindFirst(", "User.Identity.Name" — outside the canonical ICurrentUser implementation file'
  description: Roslyn walk. Part A flags any MVC / Minimal-API controller class missing an explicit [Authorize] (or [AllowAnonymous]) decision. Part B flags any code outside the canonical ICurrentUser implementation that reads claims directly from HttpContext.User instead of injecting ICurrentUser.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Add [Authorize] at the class level (or [AllowAnonymous] for explicit public endpoints). Replace HttpContext.User.Claims access with constructor-injected ICurrentUser.'
relatedRules:
  - R-BE-001
  - R-BE-007
source:
  - file: Home/Software-Architecture-Design/Security-Architecture.md
    location: wiki
  - file: Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-008 — Zitadel JWT Bearer auth on every controller; claims via ICurrentUser ***
*** Source: Falcon Architecture Wiki — Security Architecture (§4.6.6) + Platform Standards ***
*** Detector: ast (Roslyn) ***

# R-BE-008 — Zitadel JWT Bearer auth + ICurrentUser

## What it says

Two requirements, both enforced together:

**Part A — Explicit authorization decision on every controller.**
Every MVC controller (class inheriting `ControllerBase` / `Controller` or decorated with `[ApiController]`) and every Minimal-API endpoint group MUST carry an explicit authorization decision:

- `[Authorize]` (optionally `[Authorize(Policy = "AdminOnly")]` / `[Authorize(Policy = "ManagementAccess")]` per the portal-access table in Security Architecture §4.6.4) — the default for nearly all endpoints
- `[AllowAnonymous]` — only when the endpoint is genuinely public (health checks, OIDC callback, webhook with its own signature validation)

A controller missing both attributes at the class level — and whose action methods don't each carry their own attribute — is a violation. Default-on auth, not default-off.

**Part B — Read claims via the canonical `ICurrentUser` abstraction, never `HttpContext.User` directly.**
Application Services, Domain Services, and Infrastructure adapters MUST read user identity and tenant context through the injected `ICurrentUser` interface (`UserId`, `TenantId`, `UserType`, `Roles`, `IsInRole(...)`, `HasPermission(...)`). It is forbidden to:

- `HttpContext.User.Claims.First(c => c.Type == "tenant_id")`
- `User.FindFirst("user_type").Value`
- `User.Identity.Name`
- Any other direct `HttpContext.User.*` claim read.

Direct claim reads bypass the canonical claim-name table (`sub`, `tenant_id`, `user_type` from Security Architecture §4.6.3), defeat unit testing (every test now needs a fake `HttpContext`), and prevent the platform from evolving the claim source (e.g., switching the `tenant_id` claim name without breaking 200 call sites).

## Why it exists

Falcon's security model (Security Architecture §4.6) is a **single OIDC client** in Zitadel with **user-type and tenant claims** flowing in every JWT. The backend enforcement guarantee is stated verbatim in §4.6.6: "All backend APIs enforce authorization independently of the frontend… Frontend guards improve UX… Backend policies enforce **hard security boundaries**." That guarantee fails the moment a single controller ships without `[Authorize]` — every subsequent request to that controller skips the JWT-validation pipeline entirely, regardless of how thorough the rest of the codebase is. Default-on `[Authorize]` is the only sustainable enforcement.

The `ICurrentUser` abstraction exists because Falcon has four services, each potentially needing the same claims; each service can implement the interface against its own `IHttpContextAccessor` once, and every consumer (Application, Domain, Infrastructure) reads the same shape regardless of transport (HTTP, gRPC, Kafka consumer). Direct `HttpContext.User` reads also break gRPC and Kafka paths — they have no `HttpContext` at all.

## Detector strategy

Two AST passes on `src/**/Api/**/*.cs` and `src/**/{Application,Infrastructure}/**/*.cs`:

### Pass A — Controller authorization decision

1. Enumerate every `ClassDeclarationSyntax` that:
   - inherits from `ControllerBase` or `Controller`, OR
   - is decorated with `[ApiController]`.
2. For each, check class-level attribute list for any of: `[Authorize]`, `[Authorize(...)]`, `[AllowAnonymous]`. If present → class is OK; skip.
3. Otherwise, enumerate the public action methods. Each method MUST carry its own `[Authorize]` / `[AllowAnonymous]`. If any action method lacks both → emit a violation.

For Minimal APIs:

1. Find `MapGroup(...)` / `MapGet/MapPost/MapPut/MapDelete(...)` calls.
2. Check that the chain includes `.RequireAuthorization(...)` or `.AllowAnonymous()`. Missing → violation.

### Pass B — Direct claim access

1. Enumerate `MemberAccessExpressionSyntax` matching any of:
   - `HttpContext.User.Claims`
   - `HttpContext.User.FindFirst(`
   - `User.Claims` (inside a controller — `User` is `HttpContext.User`)
   - `User.FindFirst(`
   - `User.Identity.Name`
2. Skip if the containing file is the canonical `ICurrentUser` implementation (`<Service>.Infrastructure/Auth/CurrentUser.cs`).
3. All other hits → violation.

Detector implementation lives at `detectors/ast-runner.cs`.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Api/Controllers/OrdersController.cs
[ApiController]
[Route("api/orders")]
[Authorize(Policy = "ManagementAccess")]                 // ✅ explicit policy at class level
public class OrdersController : ControllerBase
{
    private readonly ISubmitOrderHandler _handler;

    public OrdersController(ISubmitOrderHandler handler) => _handler = handler;

    [HttpPost]
    public async Task<IActionResult> Submit(SubmitOrderRequest req, CancellationToken ct)
    {
        var cmd = new SubmitOrderCommand(req.OrderId);
        var result = await _handler.Handle(cmd, ct);
        return result.ToHttpResponse();
    }

    [HttpGet("health")]
    [AllowAnonymous]                                     // ✅ explicit override
    public IActionResult Health() => Ok();
}
```

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrderHandler.cs
public class SubmitOrderHandler : ICommandHandler<SubmitOrderCommand, Guid>
{
    private readonly IOrderRepository _repo;
    private readonly ICurrentUser _currentUser;          // ✅ canonical claim source

    public SubmitOrderHandler(IOrderRepository repo, ICurrentUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public async Task<ServiceOperationResult<Guid>> Handle(SubmitOrderCommand cmd, CancellationToken ct)
    {
        var tenantId = _currentUser.TenantId;            // ✅ no HttpContext access
        var userId = _currentUser.UserId;
        var order = Order.Submit(cmd, userId, tenantId);
        await _repo.AddAsync(order, ct);
        return ServiceOperationResult<Guid>.Ok(order.Id);
    }
}
```

```csharp
// File: src/Commerce.Infrastructure/Auth/CurrentUser.cs
// The ONE place HttpContext.User is allowed to be touched.
public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _ctx;
    public CurrentUser(IHttpContextAccessor ctx) => _ctx = ctx;

    public Guid UserId   => Guid.Parse(_ctx.HttpContext!.User.FindFirst("sub")!.Value);
    public string TenantId => _ctx.HttpContext!.User.FindFirst("tenant_id")!.Value;
    public string UserType => _ctx.HttpContext!.User.FindFirst("user_type")!.Value;
}
```

### ❌ Bad

```csharp
// File: src/Commerce.Api/Controllers/OrdersController.cs
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase           // ❌ no [Authorize], no [AllowAnonymous]
{
    [HttpPost]
    public async Task<IActionResult> Submit(SubmitOrderRequest req)
    {
        // ❌ reading claims directly from HttpContext.User
        var tenantId = HttpContext.User.FindFirst("tenant_id")?.Value;
        var userId = User.FindFirst("sub")?.Value;
        ...
    }
}
```

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrderHandler.cs
public class SubmitOrderHandler
{
    private readonly IHttpContextAccessor _ctx;          // ❌ Application leaking HttpContext

    public SubmitOrderHandler(IHttpContextAccessor ctx) => _ctx = ctx;

    public async Task<ServiceOperationResult<Guid>> Handle(SubmitOrderCommand cmd)
    {
        // ❌ direct claim read, violates Part B
        var tenantId = _ctx.HttpContext!.User.Claims
            .First(c => c.Type == "tenant_id").Value;
        ...
    }
}
```

## Known legitimate exemptions

- **The canonical `ICurrentUser` implementation file** (`<Service>.Infrastructure/Auth/CurrentUser.cs`) — by definition reads `HttpContext.User`.
- **Authentication startup** in `Program.cs` / `Startup.cs` — configures the JWT Bearer scheme; not a claim read.
- **Genuinely public endpoints** — Health/Readiness probes, OIDC sign-in callback, webhooks that have their own HMAC signature validation. Must carry `[AllowAnonymous]` explicitly.
- **Test projects** — `*/Tests/**` and `*.spec.cs`.
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-008` with a justification + date.

## Fix recipe

For Part A violations (missing controller attribute):

1. Decide the policy:
   - Falcon admin endpoint → `[Authorize(Policy = "AdminOnly")]`
   - Tenant management endpoint → `[Authorize(Policy = "ManagementAccess")]`
   - Default authenticated → `[Authorize]`
   - Truly public → `[AllowAnonymous]` (and document why in the surrounding comment)
2. Add the attribute at the **class level** (preferred) so future actions inherit it.
3. If the controller has mixed public/protected actions, mark the class with the stricter default and override at the action level.
4. Verify the JWT Bearer scheme is registered in `Program.cs` (one-time, per service).
5. Re-run the detector.

For Part B violations (direct claim read):

1. Confirm the canonical `ICurrentUser` exists in `<Service>.Application/Abstractions/ICurrentUser.cs` and is implemented in `<Service>.Infrastructure/Auth/CurrentUser.cs`. If not, add it.
2. Constructor-inject `ICurrentUser` into the offending class.
3. Replace the direct claim access with the matching property (`.UserId`, `.TenantId`, `.UserType`, `.IsInRole(...)`).
4. Update unit tests to mock `ICurrentUser` directly — no more `HttpContext` ceremony.
5. Re-run the detector.

Because both fixes touch authentication wiring, night-shift auto-fix is **disabled**.

## Related rules

- [[R-BE-001-clean-architecture-layers]] — Part B keeps `IHttpContextAccessor` out of Application and Domain
- [[R-BE-007-no-hardcoded-secrets]] — Zitadel client secret lives in config, not source

## Sources of truth

1. `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` — sections 4.1.1 "Core Concepts", 4.2.6 "API Middleware Validation Logic", 4.6.3 "Token Claims Model", 4.6.4 "Portal Access Rules", 4.6.6 "Backend Enforcement (ASP.NET Core)"
2. `falcon-wiki/Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md` — sections 4.1, 4.4 (policy definitions consumed via `ICurrentUser.HasPermission(...)`)
3. `CLAUDE.md` (project root) — Platform Standards section, line "Auth: Zitadel JWT Bearer with custom claims"
