# Charging Service — Overview

> Service: `Falcon.Charging.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-charging-svc`
> Solution: `Falcon.Charging.slnx`

## Purpose

The platform's **Online Charging System (OCS)** and wallet management service. Owns:
- **Wallets** (master / per-comm-channel / per-owner sub-wallets)
- **Reservation lifecycle** (reserve → commit | release) for usage-based billing (e.g. WhatsApp message charging)
- **Direct debit** (immediate final debit for system-priced purchases)
- **Balance transfers** between wallets
- **Contract balance summaries** (projection of contract remaining balance — read-model for the management UI)
- **Real-time charging core** (Redis-backed event stream `ocs:realtime-events` for hot channels: WHATSAPP / SMS / VOICE)
- **Charging Lab / Testing Charging** simulator for end-to-end WhatsApp delivery testing (gated by `Settings:TestingCharging:Enabled`)

## Project Layout

Clean Architecture:

```
src/
  Falcon.Charging.Api/                  <- Controllers (4), Middlewares (UnitOfWorkFilter), Localization
  Falcon.Charging.Application/          <- Commands, Queries, Handlers, Interfaces (TestingCharging models),
                                            TestingCharging/, Events, Mappers
  Falcon.Charging.Contracts/            <- Request/Response DTOs, ServiceOperationResult<T>, Hook<T>,
                                            MultiLanguage, IUnitOfWorkTrigger
  Falcon.Charging.Domain/               <- Entities, Constants (FalconKeys), Validations
  Falcon.Charging.Infrastructure/       <- Persistence (Mongo, OCS-specific MongoOcsRepositoryBase),
                                            Messaging (Kafka producers/consumers + OcsWalletEventPublisher),
                                            ContractLifecycleProjection, WalletBalanceManagement,
                                            LedgerIntegration, RealTimeChargingCore (Redis), Seeding
tests/Falcon.Charging.Tests/            <- xUnit
```

The Infrastructure layer is the most complex of all services — split into 5 sub-areas (`ContractLifecycleProjection`, `WalletBalanceManagement`, `LedgerIntegration`, `RealTimeChargingCore`, base `Persistence/Ocs`). This reflects the OCS responsibility surface.

## Framework & Style

- **.NET 10**
- **Controllers** (4 controllers, 20 endpoints) using ASP.NET MVC attribute routing
- AutoMapper for request → command mapping
- `UnitOfWorkFilter` registered globally on `AddControllers(o => o.Filters.Add<UnitOfWorkFilter>())` — wraps each action in a unit-of-work for atomicity across multiple Mongo operations + Kafka outbox

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5225` |
| https | `https://localhost:7224;http://localhost:5225` |

## Endpoint Surface

| Controller | Endpoints | Drilled? |
|---|---:|:---:|
| `WalletController` | 8 | **yes — see `controllers/WalletController/`** |
| `Testing/TestingChargingController` | 9 (gated by feature flag) | no |
| `LookupController` | 1 | no |
| `TestKafkaController` | 2 (`AllowAnonymous`, dev/test only) | no |

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md) for the full table.

## Kafka

The OCS-heavy service has the most diverse topic set:

| Direction | Topic | Producer/Consumer | Purpose |
|---|---|---|---|
| consume | `commerce.wallet-configured.v1` | `WalletConfiguredEventConsumer` | Commerce configured wallet settings — Charging materializes the wallet |
| consume | `commerce.user-wallet-create.v1` | `UserCreatedEventConsumer` | Commerce signaled a new user — Charging creates their sub-wallet |
| consume | `commerce.subnode-wallet-create.v1` | `SubNodeCreatedEventConsumer` | Commerce created sub-node — Charging creates the sub-node wallet |
| consume | `commerce.comm-channel-shown.v1` | `CommChannelShownEventConsumer` | Comm channel made visible — Charging may create the channel sub-wallet |
| consume | `commerce.order-created.v1` | `FalconServiceOrderCreatedEventConsumer` | Order created — Charging processes the payment |
| consume | `commerce.contract-lifecycle.v1` | `ContractLifecycleEventConsumer` | Contract activated / expired — Charging updates the projection |
| produce | `charging.order-payment-processed.v1` | `FalconServiceOrderPaymentProcessedEventPublisher` | Charging finished processing payment — Commerce updates order status |
| produce | `charging.ocs-wallet-events.v1` | `OcsWalletEventPublisher` (via `WalletOutboxPublisherWorker`) | OCS wallet mutations — published from an outbox table for downstream consumption (Ledger) |
| consume | `commerce.test-event` | `TestKafkaEventConsumer` | Dev test |
| produce | `commerce.test-event` | `TestKafkaEventPublisher` | Dev test |

Consumer group: `commerce-service` (note: same group as Commerce — likely a misconfig). Schema Registry: Avro + BACKWARD.

## MongoDB

- Database: **`FalconChargingDB`**
- OCS-specific repository base: `MongoOcsRepositoryBase.cs` with built-in optimistic concurrency
- Outbox pattern for Kafka producer reliability (`WalletOutboxPublisherWorker` + `OcsOutbox` config)
- Reservation expiry sweeper (`OcsReservationExpiry` config: 50-batch, 5s poll)

## Other Infrastructure

- **Redis** (`Settings:Redis:ConnectionString`) — `ocs:realtime-events` stream for hot channels; idempotency cache (`IdempotencyTtlSeconds: 86400`); reservation hold tracking
- **OCS Resilience**: optimistic-retry config (`MaxOptimisticRetries: 3`, `BaseRetryDelayMs: 25`, `MaxRetryDelayMs: 250`)
- **OCS Observability**: `SlowWalletLoadWarningMs: 50`, `StaleReservationWarningMs: 300000`, `SlowProjectionLagWarningMs: 60000`
- **OCS Reservation Expiry**: 50-batch, 5s poll

## Startup Flow (`Program.cs`)

```csharp
builder.Services.AddControllers(o => { o.Filters.Add<UnitOfWorkFilter>(); });
builder.Services.AddHealthChecks();
builder.Services.RegisterFalconDependencies(builder.Configuration);

app.ValidateErrrosResourceCompleteness();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseFalconMiddlewares();
app.MapHealthChecks("/health").AllowAnonymous();
app.MapControllers();
```

## Configuration Notes

`appsettings.json` has a JSON parsing artifact at line 100 — `OcsResilience` opens at the same level as `Topics`, suggesting the `Kafka` section is closed early. **Verify** that `OcsResilience`, `OcsObservability`, `OcsOutbox`, `OcsReservationExpiry` are at the top level rather than nested under `Settings:Kafka` — config classes may not bind correctly.
