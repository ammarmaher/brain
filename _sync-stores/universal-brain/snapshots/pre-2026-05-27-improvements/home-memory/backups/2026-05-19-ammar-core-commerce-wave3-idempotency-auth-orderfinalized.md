---
name: Session Backup - Wave 3 edit-price/do-payment revamp (Commerce)
description: B1 idempotency guard, B3 NodeController [Authorize], commerce.order-finalized.v1 event
type: project
agent: ammar-core-commerce
date: 2026-05-19
status: completed
originSessionId: b587fc86-734c-4f63-b47d-a1ec14184cff
---
## What Was Done
Repo: C:\Falcon\Falcon\falcon-core-commerce-svc (branch main). All three Wave-3 items implemented.

### B1 — Idempotency guard on order-payment-processed consumer
- `UpdatePendingFalconServiceOrderHandler` — now distinguishes truly-missing order (throws OrderNotFound)
  from already-terminal order (returns no-op success). `Order.Status` is the idempotency key.
- `UpdatePendingFalconServiceOrderResult` — added `bool AlreadyTerminal`.
- `CompleteFalconServicePaymentProcess` — `return` early on AlreadyTerminal; activation runs only on
  real Pending->Paid transition.
- `FalconServiceOrderPaymentProcessedEventConsumer` — catches FalconException w/ OrderNotFound code,
  returns TRUE (commit + warn = poison-message handling, no infinite loop); other exceptions return false.

### B3 — NodeController authorization hole
- Added class-level `[Authorize]` to `NodeController` (it had none — unlike all 6 siblings).
- Do-payment endpoints intentionally left at class-level `[Authorize]` only (BRD: Falcon users AND
  Account Owners can pay). Price-edit/visibility endpoints keep their `[Authorize(Policy=FalconOnly)]`.
- Confirmed zero `[AllowAnonymous]` endpoints in NodeController — nothing regresses.

### commerce.order-finalized.v1 — new integration event
- New `Application/Events/OrderFinalizedEvent.cs` POCO (OrderId, AccountId, Status, FailureReason, OccurredAt — no WalletType).
- New `Infrastructure/Messaging/Kafka/AvroEvent/OrderFinalizedEvent.cs` — IAvroEvent, ReferenceId=OrderId,
  nullable Context, BACKWARD-compatible schema (FailureReason as ["null","int"]).
- New `Infrastructure/Messaging/Kafka/Producers/OrderFinalizedEventPublisher.cs` — mirrors FalconServiceOrderCreatedEventPublisher.
- `KafkaTopics.OrderFinalized` added; `appsettings.json` Topics += "OrderFinalized":"commerce.order-finalized.v1".
- `Infrastructure/DependencyInjection.cs` AddProducers() — registered producer pair.
- Published in `CompleteFalconServicePaymentProcess` after order durably terminal, gated on `!AlreadyTerminal`.

## What Remains
- BUILD NOT VERIFIED. Environment has only .NET SDK 9.0.201; all projects target net10.0.
  `dotnet build` fails at SDK resolution (NETSDK1045) before compiling. This is a known env limitation
  (see project_seed_3_clients_2026_05_18.md). Code was statically verified against the codebase but
  must be compiled on a .NET 10 machine.
- Not runtime-tested.
- No unit tests added (task did not request; existing repo has no tests for these handlers).

## Key Decisions
- OrderFinalizedEvent POCO includes `OccurredAt` (task spec listed it explicitly) even though the
  mirror FalconServiceOrderCreatedEvent POCO does not — publisher uses the POCO's value.
- Avro `FailureReason` nullable-int Put uses `fieldValue is null ? null : Convert.ToInt32(fieldValue)`
  to match ContractLifecycleEvent's nullable-numeric pattern and survive numeric-type widening.
- Did NOT downgrade TargetFramework to build — that is an unrelated repo-wide change.

## Files Changed
Modified (6): UpdatePendingFalconServiceOrderHandler.cs, UpdatePendingFalconServiceOrderResult.cs,
CompleteFalconServicePaymentProcess.cs, FalconServiceOrderPaymentProcessedEventConsumer.cs,
NodeController.cs, Infrastructure/Configurations/ConfigurationSettings.cs,
Infrastructure/DependencyInjection.cs, Api/appsettings.json.
Created (3): Application/Events/OrderFinalizedEvent.cs, Infrastructure/.../AvroEvent/OrderFinalizedEvent.cs,
Infrastructure/.../Producers/OrderFinalizedEventPublisher.cs.

## Context for Next Agent
- NOT committed (task said do not commit). Tree has unrelated uncommitted changes from other work — left untouched.
- If a .NET 10 SDK becomes available: `dotnet build C:\Falcon\Falcon\falcon-core-commerce-svc\Falcon.Commerce.slnx`.
- commerce.order-finalized.v1 is the trigger for a future SignalR push (not built here).
