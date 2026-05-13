<!-- *** Backend use-case + module structure rules *** -->
<!-- *** Sibling of chain.md — last word on backend folder/file layout *** -->

# Backend Use-Case + Module Structure

## Source of truth

This document collapses the wiki's Clean Architecture rules into the operational layout every Ammar must follow when creating or extending backend code. On any conflict between this doc and an Ammar's default prompt, this doc wins. On any conflict between this doc and the Falcon Wiki, the wiki wins — update this doc, then proceed.

Wiki anchors:
- `Clean-Architecture-project-structure-&-business-concepts.md`
- `Design-Patterns-&-Guidelines.md`

## Solution layout (per service)

Every backend service (`falcon-core-commerce-svc`, `falcon-core-charging-svc`, `falcon-core-provisioning-svc`, `falcon-core-identity-svc`) follows the same five-project Clean Architecture shape:

```
src/
  <Service>.Domain/          ← innermost. No dependencies.
  <Service>.Application/     ← depends only on Domain.
  <Service>.Infrastructure/  ← depends on Application + Domain.
  <Service>.Api/             ← depends on Application + Infrastructure (transitively Domain).
  <Service>.Contracts/       ← shared request/response DTOs. Cross-cutting; depends on nothing.
```

Gateway services (`falcon-int-core-gateway-svc`, `falcon-int-system-gateway-svc`) use a thinner shape: `Api` project + YARP config, optional `Aggregations/` for custom Minimal API endpoints, no `Domain` of their own.

## Dependency direction (immutable)

`Domain` ← `Application` ← `Infrastructure` ← `Api`

- `Domain` references nothing except the BCL.
- `Application` references `Domain` only.
- `Infrastructure` references `Application` (for ports) and `Domain` (for entities).
- `Api` references `Application` (for MediatR types) and `Infrastructure` (for DI registration only — composition root).

A reverse reference (e.g. `Domain` referencing `Application`) is a chain violation and must be reverted before any other work proceeds.

## Application Service CANNOT call another Application Service

A handler is the application service. Handlers do not chain to other handlers. Banned patterns:

- `_mediator.Send(otherCommand)` from inside another handler to "reuse" a use-case.
- Direct injection of one handler into another and calling its `Handle` method.
- "Facade" handlers that exist only to delegate to another handler.

Allowed coordination mechanisms when two use-cases share logic:

1. **Extract to a Domain Service.** Pure business logic that doesn't naturally belong on an entity moves into a domain service in `Domain/Services/Policies/` or `Domain/Services/`. Both handlers inject and call it.
2. **Publish a domain event.** The first use-case publishes via `IPublisher.Publish(new <Entity><Action>DomainEvent(...))`. A handler in `Infrastructure/Messaging/MediatR/Consumers/` reacts and triggers downstream work — this is event-driven, not call-chained.
3. **Application coordinator (rare).** A purpose-named coordinator class in `Application/Coordinators/` (or per-module `Application/<Module>/Coordinators/`) that owns the multi-step workflow as one logical use-case. It is itself a handler — not called from another handler.

If you cannot satisfy the two use-cases through any of the above, the design is wrong: re-scope the use-cases.

## Internal services NEVER call each other through gateways

Service-to-service communication is direct:

- **Synchronous, request/response, low-latency** → gRPC client + server registered in each service's `Infrastructure/Clients/<TargetService>/`.
- **Asynchronous, fire-and-forget, durable** → Kafka. Producer in `Infrastructure/Messaging/Kafka/` of the publishing service. Consumer in `Infrastructure/Messaging/Kafka/Consumers/` of the consuming service.

Gateways exist only for browser/mobile/admin traffic. Commerce calling Charging via `core-gateway` is a chain violation.

## Gateways use YARP — 90% pass-through, 10% custom aggregation

Default route declarations in `appsettings.json` under YARP config sections. Custom Minimal API endpoints under `Aggregations/` only when:

- A single client request must fan out to two or more downstream services and return a merged result.
- A response shape needs reduction/transformation that the client must not see (e.g. dropping internal fields).
- Authorization or rate-limit logic must execute before forwarding.

Custom endpoints forward JWTs unchanged. Gateways never re-issue tokens.

## Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly

Only `falcon-core-identity-svc`:

- Creates users.
- Mutates user status (Active/Locked/Suspended/Deleted).
- Resets passwords / generates OTPs / starts sessions.
- Talks to Zitadel via `IIdentityManager`.

Other services consume identity events from Kafka or call Identity's gRPC for read operations. They never write to the user collection. They never instantiate a Zitadel client.

## Use-case folder template (the unit of backend work)

Every command or query lives in its own folder:

```
<Service>.Application/
  <Module>/                            ← e.g. Users, Orders, ContactGroups, Wallets
    UseCases/
      <UseCaseName>/                   ← e.g. SuspendUser, CreateOrder, AddContactToGroup
        <UseCaseName>Command.cs        ← record, MediatR IRequest<ServiceOperationResult<T>>, IUnitOfWorkTrigger if state-changing
        <UseCaseName>Handler.cs        ← IRequestHandler<TCommand, ServiceOperationResult<T>>
        <UseCaseName>Validator.cs      ← FluentValidation AbstractValidator<TCommand>; required when command takes user input
        <UseCaseName>Result.cs         ← record returned inside ServiceOperationResult<T> (omit if returning primitive/Unit)
```

Read use-cases (queries) follow the same template:

```
    UseCases/
      Get<Entity>By<Criteria>/         ← e.g. GetUserById, ListContactGroupsByTenant
        Get<Entity>By<Criteria>Query.cs
        Get<Entity>By<Criteria>Handler.cs
        Get<Entity>By<Criteria>Validator.cs   ← omit when there are no inputs to validate
        Get<Entity>By<Criteria>Result.cs
```

### Naming inside the folder (non-negotiable)

- Command: `<UseCaseName>Command` — `SuspendUserCommand`.
- Query: `Get<Entity>By<Criteria>Query` or `List<Entity>By<Criteria>Query`.
- Handler: `<UseCaseName>Handler`.
- Validator: `<UseCaseName>CommandValidator` / `<UseCaseName>QueryValidator`.
- Result: `<UseCaseName>Result`.
- Domain event: `<Entity><Action>DomainEvent` (e.g. `UserSuspendedDomainEvent`).
- Integration event (Kafka): `<Entity><Action>Event` (e.g. `UserSuspendedEvent`).

Records, init-only properties, primary constructors, file-scoped namespaces, `required` modifiers — apply per the existing service style. Do not introduce a different style inside a new folder.

## Module folder template (cross-cutting work)

A "module" is a feature area that contains many related use-cases plus its own domain types. Use the module template when the work introduces a new bounded concept — not just a new operation on an existing one.

```
<Service>.Domain/
  Entities/
    <Module>/
      <Entity>.cs
      <ValueObject>.cs
  Services/
    <Module>Policies/
      <Policy>.cs
  Events/                              ← optional, when domain events live in Domain layer
    <Entity><Action>DomainEvent.cs

<Service>.Application/
  <Module>/
    UseCases/
      <UseCaseA>/...
      <UseCaseB>/...
    Abstractions/                      ← module-private ports, e.g. I<Module>Repository if the generic IRepository isn't enough
    Coordinators/                      ← only if a multi-use-case workflow exists
    DomainEvents/                      ← MediatR INotification handlers for this module's events

<Service>.Infrastructure/
  Persistence/
    <Module>/
      <Entity>RepositoryExtensions.cs  ← optional, custom Mongo queries for the module
  Messaging/
    Kafka/
      Producers/<Module>EventProducer.cs
      Consumers/<UpstreamModule>EventConsumer.cs

<Service>.Api/
  Controllers/
    <Module>Controller.cs
  Mappings/
    <Module>MappingProfile.cs

<Service>.Contracts/
  Models/<Module>/
    <Action><Entity>Request.cs
    <Entity>Response.cs
```

## Decision rule: new module vs new use-case in existing module

Use the existing module when **any** of the following is true:

- The work adds an action on an entity that already exists in the module.
- The work adds a query over data the module already owns.
- The work introduces a new domain event published by an existing entity.
- The work touches one to three files outside `Application/<Module>/UseCases/`.

Create a new module when **all** of the following are true:

- The work introduces a new bounded concept (a new aggregate root or a clearly distinct subdomain).
- The new concept owns its own entities, value objects, and policies.
- The new concept has its own external contract surface (controllers, request/response DTOs).
- The work spans Domain + Application + Infrastructure + Api consistently for the new concept.

If you are unsure, default to extending the existing module. Splitting later is cheap; merging two prematurely separated modules is expensive.

## Standing platform rules (apply to every use-case)

1. **`ServiceOperationResult<T>`** is the return type of every handler and every API endpoint. Wrap success values, validation errors (`FalconError` codes), and domain failures inside it. No bare DTOs returned to controllers.

2. **`MultiLanguageName(string En, string Ar)`** for every user-facing string stored in the domain. Entity names, status labels, error display strings, configuration labels — all bilingual.

3. **`FalconException` + `FalconError`** for domain/application failures. Throw inside the handler/domain. The exception middleware translates to `ServiceOperationResult` at the API edge. No raw `Exception`, `InvalidOperationException`, or `ArgumentException` for business cases.

4. **No hardcoded secrets.** Connection strings, API keys, signing keys all live in `appsettings.json` sections (`Mongo`, `Redis`, `Kafka`, `Zitadel`, `Mailing`, `Sms`, `Hangfire`) or environment variables. Strongly-typed options classes bind config in `Infrastructure/DependencyInjection.cs`.

5. **`IUnitOfWorkTrigger`** on every state-changing command. The `UnitOfWorkFilter` only commits MongoDB transactions when the command implements this interface. Queries never implement it.

6. **`FluentValidation` `AbstractValidator<TCommand>`** for every command/query that accepts user input. Validator sits in the same use-case folder. The `ValidationBehavior` MediatR pipeline rejects invalid inputs before the handler runs and returns the failures as `ServiceOperationResult` errors.

7. **`IRepository<T>`** is the only data-access surface from `Application`. Custom queries are added via extension methods in `Infrastructure/Persistence/<Module>/<Entity>RepositoryExtensions.cs` and exposed through narrowed application-layer interfaces when shared.

8. **Entity base interfaces.** Apply the right combination on every new entity:
   - `IBaseEntity` — always (Mongo `ObjectId` string).
   - `ITenantEntity` — for multi-tenant entities.
   - `ICreationInfo` / `IUpdationInfo` — for audit fields.
   - `ISoftDeletion` — for soft-delete entities.

9. **Domain events via MediatR `INotification`**, integration events via Kafka producers (`IEventPublisher<T>`), with Avro schemas under `Infrastructure/Messaging/Kafka/AvroEvent/`. Topic names live in `appsettings.json` under `Kafka:Topics`.

10. **Banner comments only.** `*** Description ***` delimited, max two lines. No JSDoc-style or XML-doc-heavy blocks unless an Ammar default prompt explicitly requires XML docs for public APIs.

## Definition-of-done checklist for any backend use-case

Before marking a task complete:

- [ ] New folder lives under `Application/<Module>/UseCases/<UseCaseName>/`.
- [ ] Command/Query is a `record` and implements `IRequest<ServiceOperationResult<T>>`.
- [ ] State-changing commands implement `IUnitOfWorkTrigger`.
- [ ] Validator exists when input is taken; lives in the same folder.
- [ ] Handler returns `ServiceOperationResult<T>`; uses `IRepository<T>`; throws `FalconException` with `FalconError` codes for business failures.
- [ ] No `_mediator.Send(otherCommand)` from inside the handler.
- [ ] No direct `IMongoCollection<T>` usage outside `Infrastructure/Persistence/`.
- [ ] Domain events (if any) are `INotification` and published via `IPublisher.Publish(...)`.
- [ ] Kafka events (if any) flow `Domain Event Handler` → `IEventPublisher<T>` with an Avro schema and a registered topic.
- [ ] Controller endpoint maps the request → command → `_mediator.Send` → returns the result. AutoMapper or manual mapping in `Api/Mappings/`.
- [ ] Multi-language fields use `MultiLanguageName(En, Ar)`.
- [ ] No hardcoded secrets; new config bound from `appsettings.json`.
- [ ] `dotnet build src/src.sln` passes; relevant unit tests under `tests/` pass.
- [ ] Identity Service owns any user-lifecycle change touched by the task.
- [ ] No internal service-to-service call goes through a gateway.
