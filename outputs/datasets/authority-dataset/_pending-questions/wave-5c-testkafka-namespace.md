---
type: pending-question
wave: 5c
controller: TestKafkaController
related-service: falcon-core-charging-svc
status: OPEN
date: 2026-05-18
severity: Low
module: contract
feature: namespace-mismatch
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/contract", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: medium
due: 
blocked-on: [code-cleanup]
---

# Pending Question — TestKafkaController files declare wrong namespaces (Commerce instead of Charging)

**Raised by:** Ammar-Core-Charging (Wave 5c)
**Date:** 2026-05-18
**Severity:** Low — compiles fine, but pollutes Commerce namespace and confuses IDE navigation
**Affected files:** 3 files in `falcon-core-charging-svc`

## Observation

Three files inside the Charging service declare their `namespace` as `Falcon.Commerce.*` even though they physically reside in `falcon-core-charging-svc/`:

| File | Physical Location | Declared Namespace | Correct Namespace |
|---|---|---|---|
| `TestKafkaController.cs` | `Falcon.Charging.Api/Controllers/` | `Falcon.Commerce.Api.Controllers` | `Falcon.Charging.Api.Controllers` |
| `TestEvent.cs` | `Falcon.Charging.Application/Events/` | `Falcon.Commerce.Application.Events` | `Falcon.Charging.Application.Events` |
| `IEventPublisher.cs` | `Falcon.Charging.Application/Interfaces/Messaging/` | `Falcon.Commerce.Application.Interfaces.Messaging` | `Falcon.Charging.Application.Interfaces.Messaging` |

Excerpts:

```csharp
// [CODE] falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/TestKafkaController.cs:6
namespace Falcon.Commerce.Api.Controllers
{
    [ApiController]
    [Route("api/test/kafka")]
    [AllowAnonymous]
    public class TestKafkaController : ControllerBase
    { ... }
}

// [CODE] falcon-core-charging-svc/src/Falcon.Charging.Application/Events/TestEvent.cs:1
namespace Falcon.Commerce.Application.Events
{
    public class TestEvent { ... }
}

// [CODE] falcon-core-charging-svc/src/Falcon.Charging.Application/Interfaces/Messaging/IEventPublisher.cs:1
namespace Falcon.Commerce.Application.Interfaces.Messaging
{
    public interface IEventPublisher<in T> { ... }
}
```

This is a classic copy-paste artifact — these files were lifted from `falcon-core-commerce-svc` and the `namespace` line was never updated. C# does not enforce namespace-to-folder matching, so the build succeeds.

## Practical Issues

1. **IDE namespace tree pollution** — the Charging Application assembly exposes `Falcon.Commerce.Application.Events.TestEvent` and `Falcon.Commerce.Application.Interfaces.Messaging.IEventPublisher<T>` to consumers. If any code in the Falcon platform does an `Assembly.GetTypes().Where(t => t.Namespace.StartsWith("Falcon.Commerce"))` reflection scan, it will pick up Charging types.
2. **`Falcon.Commerce.Api.Controllers.TestKafkaController`** lives inside `Falcon.Charging.Api.dll`. Naming clash potential if Commerce ever introduces its own `TestKafkaController` (it already has one — same file).
3. **`IEventPublisher<TestEvent>`** is registered in the Charging DI container at its `Falcon.Commerce.*` name. If a future refactor unifies the publisher interface across services into a shared library, the rename will be invasive.
4. **Code-review confusion** — diff tooling will sort these files under `Falcon.Commerce.*` in IDE solution explorers that group by namespace.

## Additional Bugs in `TestKafkaController` (Captured in Dossier)

While reviewing the namespace, I also captured these in `controllers/TestKafkaController/`:

1. `[AllowAnonymous]` — no JWT required for `POST /publish`
2. Error bodies are raw `text/plain` strings, bypassing `ServiceOperationResult` envelope
3. `DateTimeOffset.Now` used instead of `DateTimeOffset.UtcNow` (local-time drift)
4. Catch-all `catch (Exception)` swallows specific Kafka error codes
5. No `CancellationToken` plumbed to `_publisher.PublishAsync`
6. Defensive null-checks in constructor inconsistent with rest of codebase

These are independent of the namespace cleanup but should probably ride along in the same PR.

## Questions for Operator

1. **Are these three files intended to remain in the Charging service at all?** Commerce also ships a `TestKafkaController` that publishes to the same `commerce.test-event` topic. If yes, the Charging copy is redundant duplication — remove it and rely on Commerce's instance for dev verification.
2. **If the files stay, can we rename the namespaces in a follow-up cleanup PR?** Three-file rename is mechanical and should not break any callers (Charging DI registration uses the type's full name, which will update automatically with the file).
3. **Should `[AllowAnonymous]` be gated by `Settings:TestKafka:Enabled` like `TestingChargingController` is?** Recommended for production safety.

## Recommendation

Either:
- **Delete the three files** from `falcon-core-charging-svc`. Commerce's `TestKafkaController` already exists and publishes to the same topic — sufficient for dev verification.
- **Rename the namespaces** (`Falcon.Commerce.*` → `Falcon.Charging.*`) and add a `Settings:TestKafka:Enabled` gate matching the `TestingCharging` pattern.

## Related Files

- `controllers/TestKafkaController/OVERVIEW.md` (this dossier)
- `controllers/TestKafkaController/DTOS.md` (namespace inventory table)
- `controllers/TestKafkaController/VALIDATIONS.md` (auth + production-readiness)

## Tasks-plugin tracking

- [ ] [[wave-5c-testkafka-namespace]] Pending Question — TestKafkaController files declare wrong namespaces (Commerce instead of Charging) 🔼 #blocked-on/code-cleanup
