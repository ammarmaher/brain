---
ruleId: R-XC-001
name: Identity Service owns user lifecycle — Commerce does not
category: architecture
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-int-core-gateway-svc
    - falcon-int-system-gateway-svc
  paths:
    - "src/**/*.cs"
    - "**/*.cs"
  exemptPaths:
    - "**/falcon-core-identity-svc/**"
severity: must
detector:
  type: structural
  patterns:
    - 'INSERT\s+INTO\s+Users'
    - 'UPDATE\s+Users\s+SET'
    - 'DELETE\s+FROM\s+Users'
    - 'class\s+\w*UserRepository'
    - 'IZitadelClient|ZitadelManagementClient|ZitadelUserService'
    - 'namespace\s+.+\.Users\b'
  exemptPatterns:
    - 'falcon-core-identity-svc'
  description: |
    A non-Identity service violates this rule when it (a) defines a User aggregate / repository, (b) writes to a Users table directly, or (c) imports a Zitadel management client. Detector walks .cs files in non-Identity services for these structural shapes and emits a violation when any are present.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Replace direct user mutation with a call into Identity Service via its public HTTP/gRPC contract. Architecture migration — not auto-fixable.'
relatedRules:
  - R-XC-002
  - R-XC-008
source:
  - file: feedback_frontend_auth_identity_service.md
    location: memory
  - file: Home/Software-Architecture-Design/Security-Architecture.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-001 — Identity Service owns user lifecycle ***
*** Source: CLAUDE.md "Key Architecture Rules" + Security-Architecture.md ***
*** Detector: structural (.cs namespace + repository + Zitadel client) ***

# R-XC-001 — Identity Service owns user lifecycle

## What it says

The Identity Service (`falcon-core-identity-svc`) is the **sole owner** of the User aggregate and the user lifecycle states (Pending, Active, Suspended, Locked, Deleted). No other Falcon service — Commerce, Charging, Provisioning, Core Gateway, System Gateway — may create, update, or delete users, define a `User` aggregate root, own a `Users` table, or call Zitadel management endpoints directly. All user-lifecycle mutations from other services go through Identity Service's public HTTP/gRPC contract.

## Why it exists

Per `CLAUDE.md` "Key Architecture Rules (from Wiki)" rule #6 and `Home/Software-Architecture-Design/Security-Architecture.md`: Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly. Putting user-creation logic in Commerce splits the source of truth across two services, leaks identity-provider coupling (Zitadel), and bypasses the tenant + IP-allowlist enforcement layer that Identity centralizes. A second `Users` table in any other service is a data-integrity bomb: dual-write divergence, no single audit trail, and a permanently broken story for password / OTP / suspend / delete flows.

## Detector strategy

**Structural** scan of every non-Identity service's `.cs` files:

1. Enumerate services under the Falcon backend solution, excluding `falcon-core-identity-svc`.
2. For each excluded service, find any of the following shapes and emit a violation:
   - Namespace ending in `.Users` containing a class named `User`, `UserAggregate`, `UserRepository`, or `UserService`.
   - SQL/EF migration creating a `Users` table or `dbo.Users` index.
   - Direct `INSERT INTO Users` / `UPDATE Users SET` / `DELETE FROM Users` in any string literal or EF expression.
   - Any reference to `IZitadelClient`, `ZitadelManagementClient`, `ZitadelUserService`, or the Zitadel admin API base URL.
3. Read-only user *projections* (denormalized snapshots for query) are allowed but must (a) be tagged with `// projection of Identity Service` and (b) be hydrated via Kafka events emitted by Identity. The detector treats files lacking that comment as suspect.

## Examples

### ✅ Good

```csharp
// file: falcon-core-commerce-svc/src/Commerce.Application/Customers/CreateCustomerHandler.cs
public sealed class CreateCustomerHandler {
    public CreateCustomerHandler(IIdentityServiceClient identity, ...) { ... }

    public async Task<ServiceOperationResult<CustomerDto>> Handle(CreateCustomerCommand cmd, CancellationToken ct) {
        // Identity Service owns user creation
        var userResult = await _identity.ProvisionUserAsync(cmd.ToProvisionRequest(), ct);
        if (!userResult.IsSuccess) return userResult.AsFailure<CustomerDto>();

        var customer = Customer.Create(userResult.Value.UserId, cmd.CompanyName, ...);
        ...
    }
}
```

### ❌ Bad

```csharp
// file: falcon-core-commerce-svc/src/Commerce.Infrastructure/Users/UserRepository.cs
public sealed class UserRepository : IUserRepository {
    private readonly CommerceDbContext _db;

    // ❌ Commerce defines its own Users table + write path
    public async Task<User> CreateAsync(string email, string password, ...) {
        var user = new User(Guid.NewGuid(), email, password, UserStatus.Pending);
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // ❌ AND calls Zitadel admin directly
        await _zitadelClient.CreateUserAsync(user.Id, email, password);
        return user;
    }
}
```

## Known legitimate exemptions

- `falcon-core-identity-svc/**` — the owner. This rule does not apply inside Identity.
- Read-only `UserProjection` records hydrated from Identity-emitted Kafka events, tagged `// projection of Identity Service`. These are query-side denormalizations, not write-side mutations.
- Migration scripts dropping a *legacy* `Users` table in a non-Identity service (cleanup direction is fine).
- Anything listed in `exemptions/EXEMPTIONS.md` against this ruleId.

## Fix recipe

When a violation is found in a non-Identity service:

1. Identify the user mutation site (create / update / delete / status-change).
2. Locate or define the matching Identity Service endpoint (`/identity/users`, `/identity/users/{id}/suspend`, etc.). Coordinate with Ammar Auth.
3. Inject `IIdentityServiceClient` (the typed HTTP/gRPC client) in place of the direct repository/Zitadel call.
4. Replace the direct write with an `await _identity.X(...)` call. Map `ServiceOperationResult<T>` through.
5. If the calling service needs a local denormalized copy, subscribe to the matching Identity Kafka event (`user.created`, `user.suspended`, ...) and update a `UserProjection` read model — never a write-capable `User` aggregate.
6. Delete the local `Users` table via migration, or rename it to `UserProjections` and strip write paths.
7. Document the change in the service's architecture doc and link the Identity contract.

## Related rules

- [[R-XC-002-frontend-never-calls-zitadel]] — sibling rule for the frontend boundary
- [[R-XC-008-trunk-based-development]] — migration of ownership lands as feature-flagged trunk commits, not a long-lived branch

## Sources of truth

1. `C:\Falcon\CLAUDE.md` — "Key Architecture Rules (from Wiki)" rule #6: *"Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly"*
2. `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Security-Architecture.md`
3. `memory/feedback_frontend_auth_identity_service.md` — explicit 2026-04-18 correction
