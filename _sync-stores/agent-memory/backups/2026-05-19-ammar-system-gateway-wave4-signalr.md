---
name: Session Backup - Wave 4 SignalR delivery (System Gateway)
description: Added SignalR hub + first Kafka consumer to System Gateway for real-time do-payment order outcomes
type: project
agent: ammar-system-gateway
date: 2026-05-19
status: completed
originSessionId: b587fc86-734c-4f63-b47d-a1ec14184cff
---
## What Was Done
Wave 4 SignalR delivery, System Gateway side. The admin-console now learns a do-payment
Order's terminal outcome via SignalR push instead of polling. Repo
`falcon-int-system-gateway-svc`, branch `main`. NOT committed (orchestrator builds
in-container and commits on `polishing-v0.4`). Local clean build verified: 0 warnings,
0 errors (TreatWarningsAsErrors + Meziantou + Sonar all active).

System Gateway had NO Kafka infra before this wave — this added the first consumer.
Pattern mirrored from Core Gateway's `TenantIpAllowlistChangedConsumer`.

### Files created (7)
- `Configurations/GatewaySettings.cs` — `GatewaySettings`/`KafkaSettings`/`KafkaConsumerOptions`/`KafkaTopics`
- `Messaging/AvroEvents/AvroEventBase.cs` — reflection-based Avro `ISpecificRecord` base (copied from Core Gateway)
- `Messaging/AvroEvents/EventContext.cs` — nested Avro record (namespace `Falcon.Commerce.Events`)
- `Messaging/AvroEvents/OrderFinalizedEvent.cs` — Avro event, mirrors Commerce schema exactly
- `Realtime/OrderStatusHub.cs` — SignalR hub
- `Realtime/OrderFinalizedPayload.cs` — push payload record
- `Messaging/Consumers/OrderFinalizedConsumer.cs` — BackgroundService

### Files modified (6)
- `Directory.Packages.props` — added Confluent.Kafka/SchemaRegistry/Serdes.Avro 2.13.0
- `src/Falcon.System.Gateway/Falcon.System.Gateway.csproj` — 3 Kafka PackageReferences
- `Startup/Extensions/ServiceCollectionExtensions.cs` — AddSignalR + Kafka DI + hosted service
- `Startup/Extensions/WebApplicationExtensions.cs` — MapHub before MapReverseProxy
- `Infrastructure/Auth/ZitadelExtensions.cs` — JwtBearerEvents.OnMessageReceived for /hubs query-string token
- `appsettings.json` + `appsettings.Development.json` — GatewaySettings:Kafka section

## Locked FE Contract
- Hub route: `/hubs/order-status`
- Auth: `[Authorize(FalconOnly)]`; handshake token via `?access_token=` query string
- Client→server: `JoinOrder(string orderId)`, `LeaveOrder(string orderId)` → group `order:{orderId}`
- Server→client: message `"OrderFinalized"`, payload `{ orderId: string, status: int, failureReason: int|null }` camelCase
- `status`/`failureReason` are Commerce enum INTEGERS forwarded verbatim:
  eOrderStatus 1=Pending 2=Paid 3=Failed; eOrderFailureReason 0=None 1=InsufficientFunds
  2=CommChannelPriorityOrderRequired 3=WalletNotConfigForTheNode

## Key Decisions
- Hub uses `FalconOnly` policy (not bare `[Authorize]`) — consistent with every other
  System Gateway endpoint; the gateway serves only Falcon admins.
- Payload forwards raw enum ints (not strings/mapped) — literal reading of the contract
  `{orderId,status,failureReason}` and matches Commerce's Avro wire values. FLAGGED below.
- Avro deser uses schema-registry + `AvroDeserializer` + `AsSyncOverAsync` — exact Core
  Gateway pattern. `AvroEventBase` reflection base avoids hand-written Get/Put.
- Consumer `EnableAutoCommit=false`, manual `Commit` after successful push — same as Core Gateway.
- appsettings.json holds in-container hostnames (`kafka:9092`, `schema-registry:8081`);
  Development holds localhost (`localhost:9092`, `localhost:8085`, matching Commerce/Core Gateway dev).

## Flagged Ambiguities
1. **Schema-registry dev port** — Core Gateway + Commerce dev configs both use `:8085`
   for schema registry (not 8081). Task said in-container `:8081`. Resolved: appsettings.json
   (container) = `8081` per task; appsettings.Development.json = `8085` per platform dev
   convention. If the container actually exposes `8085`, change appsettings.json.
2. **Payload status/failureReason type** — contract says `{orderId,status,failureReason}`
   without specifying int vs string. Sent as raw Commerce enum ints. If FE expects mapped
   string labels, add a translation layer in `OrderFinalizedConsumer`/`OrderFinalizedPayload`.
3. **Consumer group id** — used `system-gateway-service` (mirrors Core Gateway's
   `core-gateway-service`). Each gateway instance shares the group, so order events are
   load-balanced across replicas — every push targets a SignalR group, and SignalR groups
   are per-instance. With >1 gateway replica a client connected to instance A may miss an
   event consumed by instance B. For multi-replica prod a SignalR backplane (Redis) is
   needed. Single-replica dev/staging is fine. FLAGGED for the orchestrator.

## Verification
- Static-verified only. Local: deleted obj/bin, `dotnet restore --force`, clean build —
  Build succeeded, 0 warnings, 0 errors. Confluent.Kafka/SchemaRegistry/Avro DLLs confirmed
  in bin output. The orchestrator compiles in-container as the authoritative check.
- NOT runtime-tested (no broker/schema-registry/JWT exercised).

## Context for Next Agent
- The FE (admin-console) builds against the locked contract above — do not change route,
  method names, or payload keys without updating the FE side.
- If multi-replica System Gateway is planned, add a SignalR Redis backplane (see flag 3).
- The reflection `AvroEventBase` handles the nested `EventContext` record because
  `EventContext` is itself `ISpecificRecord` with a matching schema name.
