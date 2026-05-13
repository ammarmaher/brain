# Clean Architecture Project Structure & Business Concepts

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Clean-Architecture-project-structure-&-business-concepts.md`
**Length:** 900 lines · **Headings:** 39
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The platform's **canonical backend architecture rule book**. Defines the five clean-architecture projects (`Domain`, `Application`, `Infrastructure`, `Api`, `Contracts`), what each contains, who can reference whom, where communication code lives (other microservices, external services, queues), how Contracts DTOs vs Application DTOs differ, what an Application Service vs Domain Service is, and the **four restrictions** that block Application Services from calling each other.

## Key rules / decisions

### Business-concept terminology (`Clean-Architecture-…md:1-365`)

Authoritative table defining the project-wide vocabulary:

| Term | Layer | Role |
|---|---|---|
| **Business Policy** | Domain | High-level principles |
| **Business Rule** | Domain (Entities, Domain Services) | Precise constraints |
| **Use Case** | Application | Application Service (orchestrator) |
| **Authorization** | Application or Interface | Access decision |
| **Control** | Interface (Controllers, Filters, Middleware) | Enforcement |
| **Permission** | Data/Resource level | Specific allowed action |
| **Authorization Policy** | Business / Governance | "If X then Y" rules (ABAC) |

The doc spends substantial space distinguishing Business Behavior / Requirement / Rule and Business Rule / Use Case (`…md:208-365`).

### The five projects (`…md:407-562`)

For Commerce sample (same pattern for every service):

1. **`Commerce.Domain`** — entities, aggregates, value objects, **business rules/invariants** (methods that protect state), domain events, **pure domain services** (e.g. `TaxCalculator`, `PasswordGenerator`, `DiscountPolicy`). **"No dependencies on frameworks or IO."** "Still makes sense with **no database, no HTTP, no queue**."
2. **`Commerce.Application`** — handlers, use cases (e.g. `CreateDocumentService`), command/query models, **interfaces (ports)** for repositories / event bus / external services / time / current-tenant. Transaction boundary via Unit of Work abstraction.
3. **`Commerce.Infrastructure`** — repository implementations, EF/Mongo/Dapper, messaging consumers + producers + outbox, external HTTP/gRPC clients, retry/circuit breaker, serialization, outgoing-auth plumbing.
4. **`Commerce.Api`** — controllers / minimal API endpoints, request validation (API shape only), authn/authz, API versioning, OpenAPI, request→command and result→response mapping.
5. **`Commerce.Contracts`** — **integration event schemas** (e.g. `OrderSubmittedV1`), shared gRPC proto-generated models, **public API DTOs**. "Keep contracts stable and versioned; do not leak internal domain types."

### Dependency direction — "dependencies point inward" (`…md:564-578`)

```
Commerce.Domain          → nothing (or only primitives libs)
Commerce.Application     → Domain
Commerce.Infrastructure  → Application (+ Domain if needed)
Commerce.Api             → Application + Contracts (+ Infrastructure for DI wiring)
```

> **Important:** Domain **should not** reference Application or Infrastructure. Application **should not** reference Infrastructure.

### Communication code placement (`…md:582-668`)

**A) Calling other microservices (HTTP/gRPC) — Ports & Adapters:**
- Application defines interface (port): `ICustomerProfileClient`, `INotificationSender`, `IIdentityService`.
- Infrastructure implements via HTTP/gRPC: `CustomerProfileHttpClient`, `NotificationGrpcClient`.
- Outbound DTOs:
  - If they are integration contracts → **Contracts** project.
  - If internal mapping → Infrastructure under `Clients/<ServiceName>/Dtos`.
- Resilience, auth headers, service discovery → Infrastructure.

**B) Calling external services (Payment, SMS, Email):**
- Same pattern: Application port + Infrastructure adapter.
- **"Never let your domain or use cases depend on vendor SDKs or vendor models. Wrap them."**

**C) Queues / messaging (Kafka, RabbitMQ, Azure Service Bus):**
- **Publishing:**
  - Domain event happens in **Domain**.
  - Application decides what to publish (integration event) and calls `IEventPublisher` port.
  - Infrastructure implements publishing — **outbox pattern (recommended)**, serialization, headers, partition keys, retries, dead-lettering.
- **Consuming:**
  - Consumers are adapters → belong to **Infrastructure** (or a separate Worker project that references Infrastructure + Application).
  - Consumers should be **thin** — map message to Application command, call use-case handler.
  - **Keep business logic out of consumers.**

### Folder layout suggestion (`…md:669-722`)

```
Commerce.Domain
  /Orders                    Order.cs, OrderItem.cs, OrderStatus.cs, Events/OrderSubmitted.cs
  /PoliciesAndRules          DiscountPolicy.cs, TaxCalculator.cs
  /Shared                    Money.cs, DomainException.cs

Commerce.Application
  /Orders/UseCases/SubmitOrder/{SubmitOrderCommand,SubmitOrderHandler,SubmitOrderResult}.cs
  /Abstractions              IOrderRepository.cs, IPaymentGateway.cs, IEventPublisher.cs, IUnitOfWork.cs

Commerce.Infrastructure
  /Persistence               CommerceDbContext.cs, OrderRepository.cs
  /Messaging                 EventPublisher.cs, OutboxDispatcher.cs, Consumers/PaymentCapturedConsumer.cs
  /Clients/{RiskService,PaymentProvider}/...

Commerce.Api
  /Endpoints                 OrdersController.cs (or Minimal endpoints)
  /Mapping
  /Auth
  Program.cs
```

### Contracts DTOs vs Application DTOs (`…md:724-838`)

| Aspect | Contracts DTOs | Application DTOs |
|---|---|---|
| Purpose | External communication | Internal use cases |
| Layer | Contracts | Application |
| Audience | Clients, other services | Application logic |
| Versioned | **Yes** | No |
| Can use value objects | No | **Yes** |
| Can include computed fields | No | **Yes** |
| Validation attributes | **No** | Allowed |

### Application Service vs Domain Service (`…md:840-944`)

**Application Service:**
- Represents **one use case**.
- Orchestrates domain objects, coordinates repositories + domain services + policies.
- **Has no business rules of its own** — boundary between outside world and domain.

**Domain Service:**
- Lives in Domain layer.
- Expresses **business rules**.
- **No infrastructure or framework code.**
- Used when a rule involves multiple entities or has behavior without identity.

Domain Service examples (`…md:937-945`): `DiscountPolicy`, `PasswordPolicy`/`PasswordGenerator`, `DocumentNumberGenerator`.
Infrastructure examples (NOT Domain Services): `EmailSender`, `PdfGenerator`.

### The 4 Restrictions on Application Services (`…md:984-1063`)

**Rule: "Application Service Can't Call Another Application Service."**

> "Application services represent business use cases, not reusable utilities. If Service A calls Service B you no longer have two use cases — you have one big implicit use case."

**Four legal alternatives:**
1. **Extract Shared Logic into a Domain Service** — both call the domain service, not each other.
2. **Extract a Shared Application Component** (e.g. `DocumentWorkflow.ValidateAndPersistAsync(...)`) — a helper, NOT a use case.
3. **Raise a Domain or Integration Event** — `CreateDocument → DocumentCreated → IndexDocument` (loose, async-friendly).
4. **Move Logic Up to a Coordinator / Facade** (e.g. `DocumentLifecycleCoordinator.ExecuteAsync(...)` — the coordinator calls services; services don't call each other).

## Diagrams / images referenced

- None (text-only, with code blocks).

## Cross-references

- Vocabulary table (`…md:1-365`) is referenced by `Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md` (Subject, Object, Action, Effect, Policy).
- Folder layout examples extend `Design-Patterns-&-Guidelines.md` naming.

## Implications for code

**Verified against code:**
- All 5 projects exist for layered services (Commerce, Charging, Provisioning, Templates) ✓.
- Dependency direction structurally correct in Commerce (fallback §1.3) ✓.

**Conflicts with code:**

1. **Domain leaks MongoDB** — `Falcon.Commerce.Domain.csproj` has `MongoDB.Bson` as a PackageReference. Wiki §"Dependency direction" says **Domain references nothing or only small primitives libs**. `MongoDB.Bson` is NOT a primitives lib — it's an IO concern. **VIOLATION**. (Resolves fallback UNVERIFIED §3.)
2. **Contracts depends on Domain** — `Falcon.Commerce.Contracts.csproj` references Domain. Wiki §"Contracts project" says Contracts are "stable, versioned DTOs; do not leak internal domain types." Contracts depending on Domain implies Contracts can change when Domain types do — **VIOLATION**. (Fallback §3.2.)
3. **Single-project services (Identity, Contact Group) collapse 5 csproj into 1 + folders.** Wiki §"Project dependencies" lists 5 separate projects with `<ProjectReference>` walls. Folders-only relies on namespace discipline rather than compiler enforcement — **wiki implies separate csproj is the intended pattern, but doesn't explicitly forbid folder-only.** Treat as a **soft violation** unless wiki updated.
4. **No outbox pattern visible in code** — wiki §"Publishing" recommends outbox. Code uses `KafkaAvroProducer` / `KafkaJsonProducer` directly without a visible outbox dispatcher pattern. (Fallback did not flag this; flag now.)
5. **Application Service → Application Service call check** — wiki §"4 restrictions". This needs grep verification across each `*.Application/` project; not done in fallback. **Open audit item.**

**Implementation checklist:**
- Move `MongoDB.Bson` out of Domain. Use plain `Guid` and ISO date types in Domain; map to Bson in Infrastructure repositories.
- Strip Domain references from Contracts; copy needed value-object shapes as plain records in Contracts.
- Adopt outbox pattern in Infrastructure/Messaging (e.g. with `Wolverine`, `MassTransit`, or homegrown).
