# WAVE-18A — Code Mining Report: Falcon Commerce Service

**Service path:** `C:\Falcon\Falcon\falcon-core-commerce-svc`
**Solution:** `Falcon.Commerce.slnx`
**Date:** 2026-05-18 (Night-shift Wave 18A)
**Method:** Static source inspection of `src/Falcon.Commerce.{Domain,Application,Infrastructure,Api,Contracts}` projects.

Clean Architecture layout: `Falcon.Commerce.Domain` → `Falcon.Commerce.Application` → `Falcon.Commerce.Infrastructure` → `Falcon.Commerce.Api` (+ shared `Falcon.Commerce.Contracts`). Dependencies flow inward, consistent with Wiki rule #1 ("Domain → Application → Infrastructure → Api").

---

## 1. Bounded Contexts

Commerce is one .NET microservice. Inside it, the Domain folder structure carves out logical **internal bounded contexts** (not separate services). Each is rooted in one aggregate. The Account/Node BC is the dominant aggregate; Settings, Order, Contract, Tenant are siblings that compose the platform.

| Bounded context | Aggregate root | File:line | Notes |
|---|---|---|---|
| **Node (Account / Organization Hierarchy)** | `Node` | `src/Falcon.Commerce.Domain/Entities/Node/Node.cs:11` | `partial class Node` — main aggregate. Owns `AccountInfo`, `CommChannels[]`, `Applications[]`, `AdminIds[]`. `eNodeType.Main` = Account root; `eNodeType.Sub` = sub-node. Path/Level/TenantId. Static factories `CreateMainNode` / `CreateSubNode` in `Node.Operations.cs:11/32`. |
| **Tenant (multi-tenant DB pointer)** | `Tenant` | `src/Falcon.Commerce.Domain/Entities/Tenant.cs:8` | Owns `DatabaseName`, `ConnectionString`, `UsesSharedDatabase`. Sibling of Node, used to provision a database row per main node. `Tenant.Id == MainNode.Id` (Commerce uses node id as tenant id — verified in `CreateMainNodeProcess.cs:38`). |
| **Settings (Security / Quota / Wallet)** | `Settings` | `src/Falcon.Commerce.Domain/Entities/Settings/Settings.cs:7` | Composes `SecurityConfiguration` (passwords, IP allowlist), `QuotaConfiguration` (user/node limits), `WalletConfiguration` (currency, wallet type/balance type). Owned per main node via `OwnerId`. |
| **Order (FalconService Order)** | `Order` | `src/Falcon.Commerce.Domain/Entities/Order/Order.cs:9` | Pending/Paid/Failed FSM. `Status` + `FailureReason`. Created when client clicks "do payment" on a comm-channel / application. Status reconciled by Kafka consumer from Charging. Factory `Order.CreatePending` (`Order.cs:52`); mutators `MarkAsPaid` / `MarkAsFailed`. |
| **Contract (Tariff plan)** | `Contract` | `src/Falcon.Commerce.Domain/Entities/Contracts/Contract.cs:13` | Pending → Active → Expired FSM with reactivation path. Owns `ContractTariffPlan` (rates, quotas, overage rates, unit conversions). Saudi-local time domain (`StartLocalDateTime`, `BusinessTimeZone = "Asia/Riyadh"`). Factory `Contract.Create` at line 81. |
| **Application catalog (Falcon Service)** | `Application` (entity) | `src/Falcon.Commerce.Domain/Entities/Application.cs:9` | Global catalog item (e.g., Campaign Manager). `MultiLanguageName Name`. Referenced by `ApplicationConfiguration` inside `Node`. |
| **Communication Channel catalog** | `CommunicationChannel` (entity) | `src/Falcon.Commerce.Domain/Entities/CommunicationChannel.cs:9` | Global catalog item (e.g., SMS, WhatsApp, Email). `MultiLanguageName Name`. Referenced by `CommChannelConfiguration` inside `Node`. |
| **Lookup** | `Lookup`, `LookupValue` | `src/Falcon.Commerce.Domain/Entities/Lookup/Lookup.cs:9`, `LookupValue.cs:9` | Reference data (countries, cities, classifications). `MultiLanguageName`-aware. |
| **Activity Log (cross-cutting)** | `ActivityLog` | `src/Falcon.Commerce.Domain/Entities/Logging/ActivityLog.cs` | Cross-cutting audit. |

> **Vol 44 cross-ref:** Maps to Atlas tautologies in Module-02 (Account Management) and Module-03 (Wallet & Charging). Single aggregate per BC follows the "one aggregate per write transaction" tautology. `Tenant.Id == Node.Id` is the **tenancy-equals-account-root** invariant.

### Value Objects

| VO | File:line | Notes |
|---|---|---|
| `MultiLanguageName(En, Ar)` | `Entities/Node/MultiLanguageName.cs:7` | Lives under `Entities/Node` namespace, used cross-BC. |
| `NodeName` | `ValueObjects/Node/NodeName.cs` | Validation wrapper for `Node.Name`. |
| `Address` | `ValueObjects/Node/Address.cs` | Country/city/district/street/building/postal/additional. |

---

## 2. Entity Inventory

Mongo collection name = `typeof(T).Name + "s"` (see `MongoRepository<T>` constructor `src/Falcon.Commerce.Infrastructure/Persistence/Repositories/MongoRepository.cs:19`). So `Node` → `Nodes`, `Tenant` → `Tenants`, etc. (Indexes confirm: `MongoIndexInitializer.cs:89` uses `nameof(Node) + "s"`.)

| Entity | File:line | Identity | Mongo collection | Notes |
|---|---|---|---|---|
| `Node` | `Domain/Entities/Node/Node.cs:11` | `Id` (ObjectId string) | `Nodes` | Aggregate root for org hierarchy. Indexes: name (non-unique), parentId, tenantId, path. |
| `Tenant` | `Domain/Entities/Tenant.cs:8` | `Id` | `Tenants` | Unique index on `name`. |
| `Application` (catalog) | `Domain/Entities/Application.cs:9` | `Id` | `Applications` | Global catalog. |
| `CommunicationChannel` (catalog) | `Domain/Entities/CommunicationChannel.cs:9` | `Id` | `CommunicationChannels` | Global catalog. |
| `Settings` | `Domain/Entities/Settings/Settings.cs:7` | `Id`; partitioned by `OwnerId` (= main node id) | `Settings` (note: `Settingss` due to naming — confirm via index initializer). | Composes `SecurityConfiguration`, `QuotaConfiguration`, `WalletConfiguration`. |
| `Order` | `Domain/Entities/Order/Order.cs:9` | `Id` (ObjectId) | `Orders` | Status/FailureReason FSM. |
| `Contract` | `Domain/Entities/Contracts/Contract.cs:13` | `Id` (ObjectId) + business key `ContractId = "CTR-<8hex>"` | `Contracts` | Unique index on `ContractId`. Multiple composite indexes for the lifecycle worker (see §6 sagas). |
| `Lookup` | `Domain/Entities/Lookup/Lookup.cs:9` | `Id` | `Lookups` | Reference categories. |
| `LookupValue` | `Domain/Entities/Lookup/LookupValue.cs:9` | `Id`, FK `LookupId`, business key `Code` | `LookupValues` | Reference values. |
| `FalconServiceStatusHistory` | `Domain/Entities/FalconServiceStatusHistory.cs` | `Id` | `FalconServiceStatusHistories` | Service status audit trail. |
| `ActivityLog` | `Domain/Entities/Logging/ActivityLog.cs` | `Id` | `ActivityLogs` | Cross-cutting audit. |

### Embedded sub-entities (no own collection)

| Sub-entity | Parent | File:line |
|---|---|---|
| `AccountInfo` | `Node.AccountDetails` | `Entities/Node/AccountInfo.cs:9` — `FinanceId`, `ClassificationCategory/SubCategory`, `ProfilePicture`, `OfficialData`. |
| `OfficialData` | `AccountInfo.OfficialData` | `Entities/Node/OfficialData.cs:10` — `EntityName`, `AuthorityLetterType`, `Sector`, `LicenseNo`, `Address`, `AnotherId`, `VatRegistrationNumber`. |
| `Address` | `OfficialData.Address` | `ValueObjects/Node/Address.cs` |
| `CommChannelConfiguration` | `Node.CommChannels[]` | `Entities/Node/FalconService/Types/CommChannelConfiguration.cs` — extends `FalconServiceConfigurationBase`. |
| `ApplicationConfiguration` | `Node.Applications[]` | `Entities/Node/FalconService/Types/ApplicationConfiguration.cs` — extends `FalconServiceConfigurationBase`. |
| `FalconServiceConfigurationBase` (abstract) | parent of the two above | `Entities/Node/FalconService/FalconServiceConfigurationBase.cs:9` — `Id`, `PricingType`, `PriceValue`, `FirstActivationDate`, `ActivationDate`, `RenewDate`, `NewPricingInfo`, `Visibility`, `LastUpdatedByUserType`, `Status`. |
| `NewPricingInfo` | `FalconServiceConfigurationBase.NewPricingInfo` | `Entities/Node/FalconService/NewPricingInfo.cs` |
| `SecurityConfiguration` | `Settings.SecuritySettings` | `Entities/Settings/SecurityConfiguration.cs:9` — `PasswordSecurityLevel`, `AllowedIps[]`. |
| `QuotaConfiguration` | `Settings.QuotaSettings` | `Entities/Settings/QuotaConfiguration.cs:9` — `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevels`, `BalanceTransferLimitPercentage`. |
| `WalletConfiguration` | `Settings.WalletSettings` | `Entities/Settings/WalletConfiguration.cs:8` — `Currency`, `WalletBalanceType`, `WalletType`. |
| `ContractTariffPlan` | `Contract.TariffPlan` | `Entities/Contracts/Contract.cs:395` — owns `Rates[]`, `UnitConversions[]`, `Quotas[]`, `OverageRates[]`. |

### Base interfaces (in `Entities/Base/`)

`IBaseEntity` (id) · `ICreationInfo` · `IUpdationInfo` · `ISoftDeletion` · `ITenantEntity`. `Node` implements all five.

---

## 3. Command Handlers

Commerce uses an explicit **`I*Handler.ExecuteAsync`** convention (NOT MediatR for command dispatch — MediatR is wired only for domain notifications + assembly scan; ValidationBehavior is registered but no FluentValidators have been authored yet). Each handler implements its own interface and is invoked directly from controllers. This is documented at `Application/Behaviors/ValidationBehavior.cs:6` (pipeline behavior wired in `Application/DependencyInjection.cs:96`).

All registrations live in `src/Falcon.Commerce.Application/DependencyInjection.cs:30–80`.

### Process orchestrators (sagas-lite)

| Process | File:line | Role |
|---|---|---|
| `CreateMainNodeProcess` | `Application/Services/Processes/CreateMainNodeProcess.cs:22` | Orchestrates: `CreateMainNodeHandler` → `CreateTenantHandler` → `AccessRoleBootstrapClient.BootstrapAccountRolesAsync` → `ActivityLogService.LogActivityAsync` → publish `UserCreationRequestedEvent`. Falcon-only caller guard at line 80. |
| `CompleteFalconServicePaymentProcess` | `Application/Services/Processes/CompleteFalconServicePaymentProcess.cs:7` | `UpdatePendingFalconServiceOrderHandler` then conditional `ActivateFalconServiceHandler` when `OrderStatus == Paid`. Triggered by Kafka consumer. |
| `ContractLifecycleProcess` | `Application/Services/Processes/ContractLifecycleProcess.cs:18` | Hangfire-driven sweep: `ReplayActiveContractActivationEventsAsync` → `ReactivateExtendedExpiredContractsAsync` → `ActivateEligibleContractsAsync` → `ExpireEligibleContractsAsync`. Uses `IUnitOfWork` for Mongo transactions. |

### Domain action handlers (Node + Service Catalog mutations)

| Domain action | Handler | File:line | Dependencies |
|---|---|---|---|
| Create main node (CreateAccount) | `CreateMainNodeHandler` | `Application/Services/Handlers/CreateMainNodeHandler.cs:22` | `IRepository<Node>`, `IRepository<Settings>`, `IFileValidator`, `IEventPublisher<TenantIdentitySettingsSyncEvent>`, `IEventPublisher<TenantIpAllowlistChangedEvent>`, `IOptions<ConfigurationSettings>`. |
| Create sub node | `CreateSubNodeHandler` | `Application/Services/Handlers/CreateSubNodeHandler.cs:16` | `IRepository<Node>`, `IRepository<Settings>`, `IEventPublisher<SubNodeCreatedEvent>`. Publishes only when `WalletBalanceType == NodeBased`. |
| Create tenant | `CreateTenantHandler` | `Application/Services/Handlers/CreateTenantHandler.cs:12` | `IRepository<Tenant>`, `IDBExceptionService` (duplicate-key → `DuplicateTenantName`). |
| Change node name | `ChangeNodeNameHandler` | `Application/Services/Handlers/ChangeNodeNameHandler.cs:13` | `IRepository<Node>`. Regex-pattern duplicate-name check (case-insensitive) at `:50` via `NodeQueryHelpers.BuildExactIgnoreCasePattern`. |
| Update main node info | `UpdateMainNodeInfoHandler` | `Application/Services/Handlers/UpdateMainNodeInfoHandler.cs:17` | `IRepository<Node>`, `ICurrentUser`, `IOptions<ConfigurationSettings>`. Falcon-only edits include `AccountName` + `FinanceId` (`:36–46`, `:72–75`). |
| Validate account name (uniqueness pre-check) | `ValidateAccountNameHandler` | `Handlers/ValidateAccountNameHandler.cs` | `IRepository<Node>`. |
| Configure wallet | `ConfigureWalletSettingsHandler` | `Handlers/ConfigureWalletSettingsHandler.cs:21` | `IRepository<Settings>`, `IRepository<Node>`, `IIdentityClient`, `ISessionProvider`, `IEventPublisher<WalletConfiguredEvent>`. Validates main-node-only; fetches user list from Identity for `UserBased` balance type. |
| Update settings (security + quota) | `UpdateSettingsHandler` | `Handlers/UpdateSettingsHandler.cs:16` | `IRepository<Settings>`, `IRepository<Node>`, `ICurrentUser`, `HybridCache`, `IEventPublisher<TenantIdentitySettingsSyncEvent>`, `IEventPublisher<TenantIpAllowlistChangedEvent>`. Quota changes are Falcon-only (`:75`). Invalidates `allowed_ips_<ownerId>` cache key. |
| Change comm-channel visibility / price-type / price-value | `ChangeAccountCommunicationChannelServiceVisibilityHandler` · `ChangeCommunicationChannelPriceTypeHandler` · `ChangeCommunicationChannelPriceValueHandler` · `DeleteCommunicationChannelNewPriceTypeHandler` · `DeleteCommunicationChannelNewPriceValueHandler` | `Handlers/Change*Handler.cs`, `Handlers/Delete*Handler.cs` | All gated on `AuthorizationPolicies.FalconOnly` in controller (see `NodeController.cs:175,193,201,210,219,277,285`). |
| Enable / Disable comm-channel | `EnableCommunicationChannelHandler` · `DisableCommunicationChannelHandler` | `Handlers/EnableCommunicationChannelHandler.cs`, `DisableCommunicationChannelHandler.cs` | Both user-callable (no Falcon-only gate). |
| Same set for Applications | `ChangeAccountApplicationServiceVisibilityHandler` · `ChangeApplicationPriceTypeHandler` · `ChangeApplicationPriceValueHandler` · `DeleteApplicationNewPriceTypeHandler` · `DeleteApplicationNewPriceValueHandler` · `EnableApplicationHandler` · `DisableApplicationHandler` | `Handlers/*Application*Handler.cs` | Same authorization split. |
| Create falcon-service order (do-payment) | `CreateFalconServiceOrderHandler` | `Handlers/CreateFalconServiceOrderHandler.cs:17` | `ICurrentUser`, `IRepository<Node>`, `IRepository<Order>`, `ICalculatePriceValuePolicy`, `ICreateOrderPolicy`, `IResolveOrderTypePolicy`, `IEventPublisher<FalconServiceOrderCreatedEvent>`. Publishes Kafka after `Order.CreatePending`. |
| Update pending order from payment result | `UpdatePendingFalconServiceOrderHandler` | `Handlers/UpdatePendingFalconServiceOrderHandler.cs` | `IRepository<Order>`. Called from Kafka consumer. |
| Activate falcon service | `ActivateFalconServiceHandler` | `Handlers/ActivateFalconServiceHandler.cs:14` | `IRepository<Node>`, `ICalculateRenewalDatePolicy`, `IAutoRenewalTrigger`. Schedules Hangfire `AutoRenewalJob`. |
| Renew falcon service | `RenewalHandler` | `Handlers/RenewalHandler.cs` | invoked by `AutoRenewalJob`. |
| Create contract | `CreateContractHandler` | `Handlers/Contracts/CreateContractHandler.cs:18` | `IRepository<Contract>`, `IRepository<Settings>`, `IRepository<Node>`, `IRepository<Application>`, `IRepository<CommunicationChannel>`, `ICurrentUser`, `ITranslateHelper`, `IValidateContractWalletStrategyPolicy`. Cross-tenant guard at `:100`. |
| Update contract | `UpdateContractHandler` | `Handlers/Contracts/UpdateContractHandler.cs` | Same set. Commercial-basis lock for Active/Expired contracts (see `Contract.HasRestrictedCommercialEditFields` and `Contract.Update`). |
| Get contract / List contracts | `GetContractHandler`, `ListContractsHandler` | `Handlers/Contracts/GetContractHandler.cs`, `ListContractsHandler.cs` | Read-side. |

### Query handlers (read-side)

`GetAccountHierarchyHandler` (`Handlers/GetAccountHierarchyHandler.cs`), `GetOrgHierarchyNodeHandler`, `GetMainNodeInfoHandler`, `GetSettingsHandler`, `GetWalletSettingsHandler`, `GetWalletListHandler`, `GetAccountCommunicationChannelsHandler`, `GetAccountApplicationsHandler`, `GetVisibleCommunicationChannelsHandler`, `GetVisibleCommunicationChannelDetailsHandler`, `GetOrderStatusHandler`, `ListApplicationsHandler`, `ListCommunicationChannelHandler`, `ListLookupHandler`, `Security/GetAllIpAllowlistsHandler`, `Testing/TestingListAccountsHandler`.

---

## 4. Kafka Topics Produced

All topics defined in `src/Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs:50` (class `KafkaTopics`) and configured in `src/Falcon.Commerce.Api/appsettings.json:91`. All Avro events serialized via Confluent Schema Registry; tenant-settings JSON events use `IKafkaJsonProducer`.

| Topic | Event DTO (Application) | Trigger | Producer file:line |
|---|---|---|---|
| `commerce.wallet-configured.v1` (`WalletConfigured`) | `Application.Events.WalletConfiguredEvent` | `ConfigureWalletSettingsHandler` calls `PublishWalletConfiguredEventAsync` after writing `Settings.WalletSettings`. | `Infrastructure/Messaging/Kafka/Producers/WalletConfiguredEventPublisher.cs:9` (Avro). Wired in `DependencyInjection.cs:244–245`. |
| `commerce.user-wallet-create.v1` (`UserWalletCreate`) | `Application.Events.UserCreatedEvent` | After a new user is provisioned (UserBased wallet path). | `Producers/UserCreatedEventPublisher.cs:9` (Avro). DI `:249–250`. |
| `commerce.subnode-wallet-create.v1` (`SubNodeWalletCreate`) | `Application.Events.SubNodeCreatedEvent` | `CreateSubNodeHandler` publishes only when `WalletBalanceType == NodeBased` (`CreateSubNodeHandler.cs:56–65`). | `Producers/SubNodeCreatedEventPublisher.cs:9` (Avro). DI `:251–252`. |
| `commerce.comm-channel-shown.v1` (`CommChannelShown`) | `Application.Events.CommChannelShownEvent` | When a comm-channel is set visible for an account. | `Producers/CommChannelShownEventPublisher.cs:8` (Avro). DI `:253–254`. |
| `commerce.order-created.v1` (`FalconServiceOrderCreated`) | `Application.Events.FalconServiceOrderCreatedEvent` | `CreateFalconServiceOrderHandler.PublishFalconServiceOrderCreatedAsync` (do-payment endpoint). | `Producers/FalconServiceOrderCreatedEventPublisher.cs:8` (Avro). DI `:255–256`. |
| `commerce.contract-lifecycle.v1` (`ContractLifecycle`) | `Application.Events.ContractActivatedEvent` AND `Application.Events.ContractExpiredEvent` (shared topic, lifecycle type discriminator in payload) | `ContractLifecycleProcess` activation/expiry sweeps. Activation also republished by the replay sweep. | `Producers/ContractActivatedEventPublisher.cs:10` (Avro, `LifecycleType = "ACTIVATED"`); `Producers/ContractExpiredEventPublisher.cs:10` (Avro, `LifecycleType = "EXPIRED"`). DI `:246–248`. |
| `commerce.user-creation-requested.v1` (`UserCreationRequested`) | `Application.Events.UserCreationRequestedEvent` | `CreateMainNodeProcess` (account-owner provisioning). | `Producers/UserCreationRequestedEventPublisher.cs:10` (JSON). DI `:258`. |
| `commerce.identity-settings-sync.v1` (`IdentitySettingsSync`) | `Application.Events.TenantIdentitySettingsSyncEvent` | `CreateMainNodeHandler.cs:77` (initial sync) AND `UpdateSettingsHandler.cs:110` (delta sync). | `Producers/TenantIdentitySettingsSyncEventPublisher.cs:10` (JSON). DI `:257`. |
| `commerce.tenant-ip-allowlist-changed.v1` (`TenantIpAllowlistChanged`) | `Application.Events.TenantIpAllowlistChangedEvent` | `CreateMainNodeHandler.cs:89` (seed empty allowlist) AND `UpdateSettingsHandler.cs:124` (only when AllowedIps actually changed). Consumed by **Core Gateway** to refresh Redis projection at `tenant:{tenantId}:ipAllowlist:v1`. | `Producers/TenantIpAllowlistChangedEventPublisher.cs:11` (Avro). DI `:259–260`. |

> **Producer config:** `Acks = All`, `EnableIdempotence = true`, `Partitioner = Consistent`, `CompressionType = 1 (Gzip)`. See `DependencyInjection.cs:318–330`.
> **Every event carries an `EventContext`** (UserId, TenantId, IpAddress, UserAgent, CorrelationId) populated by `EventContextProvider` (`Infrastructure/Messaging/EventContextProvider.cs:13`).

---

## 5. Kafka Topics Consumed

| Topic | Avro Event | Handler | File:line |
|---|---|---|---|
| `charging.order-payment-processed.v1` (`FalconServiceOrderPaymentProcessed`) | `Infrastructure.Messaging.Kafka.AvroEvent.FalconServiceOrderPaymentProcessedEvent` | `FalconServiceOrderPaymentProcessedEventConsumer` → `CompleteFalconServicePaymentProcess.ExecuteAsync` (`UpdatePendingFalconServiceOrderHandler` + conditional `ActivateFalconServiceHandler`). | `Infrastructure/Messaging/Kafka/Consumers/FalconServiceOrderPaymentProcessedEventConsumer.cs:14` (`KafkaAvroConsumerBase<...>`). Wired in `DependencyInjection.cs:237–238` (HostedService). |

> Only **one** Kafka consumer in Commerce — the payment-result reconciliation lane. Commerce is mostly a producer.
> Consumer group id: `commerce-service` (`ConfigurationSettings.cs:82`). Consumer is hosted via `IHostedService` so it runs in every pod; rebalancing/partitioning is Kafka-managed.
> `IsolationLevel.ReadCommitted`, `EnableAutoCommit = false` (manual commit). See `DependencyInjection.cs:339–346`.

---

## 6. Cross-Service Patterns

### Outbox pattern — **NOT IMPLEMENTED**
- No `OutboxMessage` collection, no outbox-publisher. Verified: `Glob: **/Outbox*.cs → No files found`.
- Domain mutations and Kafka publishes are **not transactionally bound**. Example: `CreateMainNodeHandler.cs:65–93` writes Node + Settings to Mongo, then publishes two Kafka events. If the process dies between the Mongo writes and the Kafka acks, projections diverge.
- The Contract lifecycle sweep **acknowledges this gap explicitly** in `ContractLifecycleProcess.cs:221–222`: "Until Commerce gets a durable outbox, we prefer replayable activation events over silent projection gaps. Charging consumers are replay-safe, so duplicates are acceptable." → The team has chosen **idempotent consumers + scheduled replay** as the compensation strategy. Confirmed by the periodic `ReplayActiveContractActivationEventsAsync` sweep (every 5 min throttle, `:27`) that re-publishes activation events on a `LastActivationEventPublishedAt` watermark.

> **Vol 44 tautology:** "Cross-service consistency without an outbox requires idempotent consumers + scheduled replay" — Commerce enforces it via the lifecycle replay sweep.

### Inbox pattern — **NOT IMPLEMENTED**
- No inbox collection. Verified: `Glob: **/Inbox*.cs → No files found`.
- The single consumer (`FalconServiceOrderPaymentProcessedEventConsumer`) does not dedupe by event id. The handler's `ProcessMessageAsync` returns `false` on exception (`:50–55`), which signals the base class to NOT commit the offset — so re-delivery on next poll. This is **at-least-once** delivery, and `CompleteFalconServicePaymentProcess` must therefore be idempotent (which it is, because `UpdatePendingFalconServiceOrderHandler` operates on the order status FSM and `ActivateFalconServiceHandler` checks current service status).

### Saga coordinators
The team uses **process orchestrators** as their saga implementation (no MassTransit / NServiceBus saga framework). Three exist:

| Saga | File:line | Pattern |
|---|---|---|
| **Create-Account saga** | `Application/Services/Processes/CreateMainNodeProcess.cs:22` | Synchronous orchestration. `CreateMainNode → CreateTenant → BootstrapRoles → LogActivity → PublishUserCreationRequested`. If `BootstrapRoles` fails after `CreateTenant`, the saga is **not compensated** — manual cleanup required. |
| **Service-Order saga** | `Application/Services/Processes/CompleteFalconServicePaymentProcess.cs:7` | Choreography across services. Commerce publishes `FalconServiceOrderCreatedEvent` → Charging processes payment → Charging publishes `FalconServiceOrderPaymentProcessedEvent` → Commerce consumes → `UpdatePendingOrder` + conditional `ActivateService`. |
| **Contract-Lifecycle saga** | `Application/Services/Processes/ContractLifecycleProcess.cs:18` | Background Hangfire sweep driven by `ContractLifecycleRecurringJob` (`Infrastructure/Jobs/ContractLifecycleRecurringJob.cs:12`, JobId `commerce-contract-lifecycle`). Uses `IUnitOfWork` (Mongo transactions) per contract to atomically update status + watermark before publishing. Race-safe via `Status` filter in the update: a concurrent worker that already advanced the contract is detected by the empty `FindOneAndUpdateAsync` result (`:201–219`). |

### Compensation handlers
- No explicit compensation. The activation flow uses **forward retry** (`LastActivationEventPublishedAt` watermark + replay sweep) rather than rollback.
- The `Reactivate` flow on `Contract` (`Contract.cs:258`) is a **forward-compensation** primitive: an Expired contract whose end-date is extended back into the live window is moved back to Active and re-published.

### Domain Events (in-process)
- MediatR is wired for in-process notifications (`Application/DependencyInjection.cs:84–88`).
- One domain event exists: `Application/DomainEvents/ServiceStatusChangedDomainEvent.cs`.
- One handler: `Infrastructure/Messaging/MediatR/Consumers/ServiceStatusChangedDomainEventHandler.cs:11` — **currently a stub** (the provisioning call is commented out at `:25–28`).
- Publisher: `Infrastructure/Messaging/MediatR/Producers/ServiceStatusChangedEventPublisher.cs:7` (`IEventPublisher<ServiceStatusChangedEvent>` → `_mediator.Publish`).

### Unit of Work (Mongo transactions)
- `IUnitOfWork` interface in Application layer; `MongoUnitOfWork` in `Infrastructure/Persistence/MongoUnitOfWork.cs:6` wraps `IClientSessionHandle`. Begin / Commit / Abort.
- Used by `ContractLifecycleProcess` (`:133`, `:158`, `:197`, `:262`) to atomically update contract status + watermark; falls back to non-transactional path for single-document ops (`MongoRepository<T>.AddAsync:65–73` checks `_unitOfWork?.Session`).

---

## 7. Validation Pipeline

### Layer 1 — FluentValidation pipeline (wired, but unused)
- `ValidationBehavior<TRequest, TResponse>` registered as MediatR `IPipelineBehavior` in `Application/DependencyInjection.cs:96`.
- Validator assembly scan via `services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly)` at `:92`.
- **No `: AbstractValidator<T>` classes exist anywhere in the service** (verified via `Grep: ": AbstractValidator" → No files found`). The pipeline is wired but no validators have been written yet — so no validators run.
- **Implication:** request validation today is entirely at the controller / handler / domain level. FluentValidation is intentional plumbing, not active enforcement.

### Layer 2 — Domain attribute validators (active)
Lightweight DataAnnotations-style attributes in `src/Falcon.Commerce.Domain/Validations/ValidationAttribute.cs` decorating entity fields. They throw `FalconException` on validation failure:

| Attribute | File:line | Behavior |
|---|---|---|
| `[ThrowIfMaxLengthExceed(max)]` | `Validations/ValidationAttribute.cs:7` | String length cap (`FalconKeys.Error.MaxLengthExceeded`). |
| `[ThrowIfNotEnumValue<TEnum>]` | `:27` | Enum range check (`InvalidValue`). |
| `[ThrowIfNotPassed]` | `:38` | Required field — null, empty, zero (`RequiredFieldMissing`). |
| `[ThrowIfLessThan(min)]` | `:64` | Numeric min check. |

Used on: `Node.Name` (`Node.cs:28`), `Node.TenantId` (`Node.cs:18`), `OfficialData.EntityName` (`OfficialData.cs:13`), `QuotaConfiguration.MaxNormalUserLimit` (`QuotaConfiguration.cs:13`), `FalconServiceConfigurationBase.Id` (`FalconServiceConfigurationBase.cs:13`).

### Layer 3 — Domain factory + invariant validation (most enforcement lives here)
- `Node.CreateMainNode` / `CreateSubNode` (`Node.Operations.cs:11/32`) — node-level invariants (parent required, tenant required, max-node-levels, etc.).
- `Node.ValidateNodeHierarchy` and `Node.ValidateNodeIdentity` (`Node.Validations.cs:20/28`) — hierarchy invariants.
- `Contract.Validate` (`Contract.cs:273`) — contract draft completeness (committed value > 0, start < end, currency-tariff match, no duplicate rates/quotas/overage rates).
- `SecurityConfiguration.SetAllowedIps` (`SecurityConfiguration.cs:32`) — IP format validation.
- `QuotaConfiguration.Create` (`QuotaConfiguration.cs:30`) — limits ≥ 0.
- `WalletConfiguration.Create` (`WalletConfiguration.cs:19`) — factory only, no business rule.
- `AccountInfo.Create` (`AccountInfo.cs:41`) — requires `FinanceId`.

### Layer 4 — File / image validation
- `IFileValidator` interface (`Application/Interfaces/CommonServices/IFileValidator.cs`).
- `FileValidator` implementation (`Infrastructure/Services/FileValidator.cs`) — `ValidateNotExecutable`, `ValidateFileSize`. Called from `CreateMainNodeHandler.cs:111–112`.
- `MongoObjectIdValidator` (`Infrastructure/Validation/MongoObjectIdValidator.cs`) — used by `IObjectIdValidator`.

### Layer 5 — Resource completeness validator (startup)
- `ErrorResourceCompletenessValidator` (`src/Falcon.Commerce.Api/Validators/ErrorResourceCompletenessValidator.cs`) — ensures every `FalconKeys.Error.*` code has localized resource strings. Catches missing-translation drift at startup.

### Layer 6 — Authorization (declarative)
- Controller-level `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` on every price-change / visibility / new-price-deletion endpoint (e.g., `NodeController.cs:175,193,201,210,219,277,285`, `SettingController.cs:57`).
- `AuthorizationPolicies.FalconOnly` / `ClientOnly` constants in `Infrastructure/Auth/AuthorizationPolicies.cs:6`.
- Handler-level checks via `ICurrentUser.UserType == eUserType.Falcon` (e.g., `UpdateMainNodeInfoHandler.cs:36`, `UpdateSettingsHandler.cs:69`, `CreateMainNodeProcess.cs:80`).

> **Vol 44 tautology:** "Authorization is declared at the boundary AND enforced in the handler" — Commerce enforces it twice for the Falcon-only edits (controller policy + `_currentUser.UserType` re-check).

---

## 8. Gateway Routing

Commerce sits behind **TWO** YARP-based gateways. Both use 90% pass-through routing + a small set of aggregation endpoints (FastEndpoints).

### Core Gateway — `falcon-int-core-gateway-svc` (CLIENT-FACING)
- Config: `Falcon.Core.Gateway/appsettings.json:66`.
- Auth: `AuthorizationPolicy = "ClientOnly"` for all routes (line 70, 82, 94, 118, 132).
- Rate limiting: `RateLimiterPolicy = "PerTenant"` everywhere (`appsettings.json:71` etc.).
- IP allowlist enforcement: gateway middleware reads from Redis projection at `tenant:{tenantId}:ipAllowlist:v1`, populated by Kafka consumer that listens to `commerce.tenant-ip-allowlist-changed.v1`. Confirmed by `KafkaSettings.Topics.TenantIpAllowlistChanged` in the gateway settings (`appsettings.json:58`). Settings section `GatewaySettings.IpAllowlist` (`:61`).
- Identity has a special anonymous prefix route for `/identity/auth/*` (lines 104–115, `Order: 0`) so login/refresh tokens work pre-auth.
- Routes (PathPrefix → cluster):
  - `/commerce/{**remainder}` → `commerce-cluster`
  - `/provisioning/{**remainder}` → `provisioning-cluster`
  - `/charging/{**remainder}` → `charging-cluster`
  - `/identity/{**remainder}` → `identity-cluster`
  - `/contactgroup/{**remainder}` → `contactgroup-cluster`
- Transform: `PathRemovePrefix: /commerce` then `PathPrefix: /api` — so `GET /commerce/Node/{id}/comm-channels` is rewritten to `GET /api/Node/{id}/comm-channels` at the Commerce upstream.

### System Gateway — `falcon-int-system-gateway-svc` (ADMIN-FACING / Falcon)
- Config: `Falcon.System.Gateway/appsettings.json:42`.
- Auth: `AuthorizationPolicy = "FalconOnly"` for all proxied routes.
- No `PerTenant` rate limiter (Falcon admins are platform-wide).
- Aggregation endpoints (FastEndpoints, not YARP pass-through):
  - `GET /api/commerce/accounts/{Id}/hierarchy` → `GetAccountHierarchyEndpoint` (`Features/AccountHierarchy/GetAccountHierarchyEndpoint.cs:21`). Aggregates Commerce hierarchy + Identity users + Charging wallets into one response. Grouped under `CommerceEndpointGroup` (`Endpoints/Groups/CommerceEndpointGroup.cs:12`).
- Otherwise same five proxy routes as Core Gateway, all with `FalconOnly`.

### Sample Commerce routes (from controllers)
- `GET /api/Node?NodeId=<id>` (`NodeController.cs:103`) — get hierarchy.
- `POST /api/Node/create-account` (`NodeController.cs:111`) — Falcon-only orchestration.
- `POST /api/Node/create-SubNode` (`NodeController.cs:119`).
- `PUT /api/Node/ChangeNodeName` (`NodeController.cs:127`).
- `GET /api/Node/ValidateAccountName?AccountName=<name>` (`NodeController.cs:135`).
- `GET /api/Node/{id}/comm-channels`, `GET /api/Node/{NodeId}/comm-channels/visible`, `GET /api/Node/{NodeId}/comm-channels/visible/details` (`NodeController.cs:143,150,158`).
- `GET /api/Node/{id}/applications` (`NodeController.cs:167`).
- `PUT /api/Node/comm-channel/visibility` (`NodeController.cs:176`) — **FalconOnly**.
- `PUT /api/Node/application/visibility` (`NodeController.cs:185`) — **FalconOnly**.
- `PUT /api/Node/comm-channel/price-type` (`NodeController.cs:194`) — **FalconOnly**.
- `PUT /api/Node/comm-channel/price-value` (`NodeController.cs:203`) — **FalconOnly**.
- `POST /api/Node/comm-channel/do-payment` (`NodeController.cs:229`) — client-callable.
- `POST /api/Node/comm-channel/enable|disable` (`NodeController.cs:244,252`).
- `DELETE /api/Node/comm-channel/new-price-type|new-price-value` (`NodeController.cs:277,285`) — **FalconOnly**.
- `GET /api/Node/order/{orderId}/status` (`NodeController.cs:313`) — polled by the FE during do-payment.
- `GET /api/Information?NodeId=`, `PUT /api/Information` (`InformationController.cs:31,39`).
- `GET /api/Setting?ownerId=`, `PUT /api/Setting`, `POST /api/Setting/wallets`, `GET /api/Setting/wallets/{ownerId}` (`SettingController.cs:40,48,57,65`).
- `GET /api/Contracts?accountId=`, `GET /api/Contracts/{contractId}`, `POST /api/Contracts`, `PUT /api/Contracts/{contractId}` (`ContractsController.cs:38,46,54,62`).
- `GET /api/accounts/hierarchy?accountId=&currency=&balanceDistribution=&walletStructure=` (`AccountHierarchyController.cs:27`).
- `GET /api/Security/ip-allowlists` (`SecurityController.cs:27`) — **AllowAnonymous** east-west endpoint for the Core Gateway to seed its cache at startup. Documented explicitly in the class summary.
- `GET /api/Lookup/{id}?name=&code=` (`LookupController.cs:25`).
- `GET /api/Application` (`ApplicationController.cs:24`) — global app catalog.

### Service URL forwarding
- `ServicesClientsOptions` (`Infrastructure/Configurations/Clients/ServicesClientsOptions.cs`) holds `Provisioning.BaseUrl`, `Identity.BaseUrl`, `Access.BaseUrl`. Commerce reaches **Identity and Provisioning directly** (gRPC/HTTP), NOT through the gateway — confirmed by `DependencyInjection.cs:115–125`. Internal services bypass gateways per Wiki rule #3.

---

## 9. MultiLanguageName Usage

### Type definition
`src/Falcon.Commerce.Domain/Entities/Node/MultiLanguageName.cs:7` — `public class MultiLanguageName : ITranslate` with `string En` and `string Ar`. Constructor `MultiLanguageName(string en, string ar)` at `:17`. Implements `ITranslate` interface (`Domain/Interfaces/ITranslate.cs`).

### Usage by entity
| Entity / VO | Field | File:line |
|---|---|---|
| `Application` | `Name`, `SubTitle`, `Description` | `Application.cs:17, 24, 28` |
| `CommunicationChannel` | `Name`, `SubTitle`, `Description` | `CommunicationChannel.cs:17, 24, 28` |
| `Lookup` | `Name` | `Lookup.cs:17` |
| `LookupValue` | `Name` | `LookupValue.cs:26` |
| `ContractRate` | `ApplicationName`, `ChannelName` | `Contract.cs:429, 435` |
| `ContractQuota` | `ChannelName` | `Contract.cs:499` |
| `ContractOverageRate` | `ChannelName` | `Contract.cs:539` |
| `ContractTariffPlanSnapshot` (Kafka event) | nested `ApplicationName`, `ChannelName` | `ContractLifecycleEvents.cs` — preserved in Avro snapshots so Charging gets full bilingual names. |

> **Hard rule:** Every user-facing name field in the Domain layer uses `MultiLanguageName(En, Ar)`. No bare `string Name` for human-displayed labels.
> **Persistence:** `[BsonElement("name")] public MultiLanguageName Name` — serialized as nested `{en, ar}` document in Mongo.
> **i18n via `TranslateHelper`:** `Application/Services/Helpers/TranslateHelper.cs` resolves the right side based on `ICurrentCulture`. Used by Contract mapper to pick `En` vs `Ar` for snapshot fields.

> **Vol 44 tautology:** "Every user-facing label is bilingual at rest, not at presentation" — Commerce satisfies this at the entity level.

---

## 10. ServiceOperationResult Shape

**Canonical wrapper:** `src/Falcon.Commerce.Api/Common/ServiceOperationResult.cs:3`

```csharp
public sealed record ServiceOperationResult<T>(
    bool IsSuccessful,
    T? Result,
    List<string> ErrorCodes,
    List<string> ErrorMessages)
{
    public static ServiceOperationResult<T> Success(T value)
        => new(true, value, [], []);

    internal static ServiceOperationResult<T> Failure(IEnumerable<string> errorCodes, IEnumerable<string> errorMessages)
        => new(false, default, errorCodes.ToList(), errorMessages.ToList());
}
```

- **All controllers return `Ok(ServiceOperationResult<T>.Success(...))`.** No exceptions — verified in `NodeController.cs`, `InformationController.cs`, `SettingController.cs`, `ContractsController.cs`, `SecurityController.cs`, `AccountHierarchyController.cs`, `ApplicationController.cs`, `LookupController.cs`.
- **Failure path** is centralized: handlers throw `FalconException` (with a `FalconError` containing a code + optional description, defined in `Domain/Exceptions/FalconException.cs:4` and `FalconError.cs:3`). The global `FalconExceptionHandler` (`Api/ExceptionHandlers/FalconExceptionHandler.cs`) translates the exception into `ServiceOperationResult.Failure` with the correct HTTP status (driven by `[ErrorHttpStatus(...)]` attributes on `FalconKeys.Error.*` constants).
- `MongoWriteExceptionHandler`, `ValidationExceptionHandler`, `GlobalExceptionHandler` complete the chain.

> **Platform standard reaffirmed:** `IsSuccessful` (bool) + `Result` (T?) + `ErrorCodes` (list of stable string codes) + `ErrorMessages` (list of localized strings). Matches the Falcon-wide contract documented in `CLAUDE.md`.

---

## Cross-references to Vol 44 Tautologies

| Vol 44 tautology | Commerce evidence |
|---|---|
| **One aggregate per write transaction** | Each handler updates exactly one aggregate; `MongoUnitOfWork` is only used when multiple writes must be atomic (contract lifecycle). |
| **Tenancy equals account root** | `Tenant.Id == MainNode.Id` invariant — see `CreateMainNodeProcess.cs:38`. |
| **Falcon vs Client authority split** | Encoded at controller policy + handler `_currentUser.UserType == eUserType.Falcon` re-check (`UpdateMainNodeInfoHandler.cs:36,72`; `UpdateSettingsHandler.cs:69`). |
| **Replayable events over silent gaps** (no outbox) | `ContractLifecycleProcess.cs:221–222` comment + `ReplayActiveContractActivationEventsAsync`. |
| **Bilingual at rest, not at presentation** | `MultiLanguageName` on every catalog entity. |
| **East-west bypasses gateways** | Commerce → Identity/Provisioning/Access via direct `HttpClient` with `AuthorizationHeaderHandler` JWT forwarding, not via gateway. See `Infrastructure/DependencyInjection.cs:111–125`. |
| **Internal services NEVER call each other through gateways** | Confirmed — see above. |
| **Settings only allowed for main node** | `UpdateSettingsHandler.cs:53–54` (`FalconKeys.Error.SettingsOnlyAllowedForMainNode`); pre-empts a 422. |
| **Wallet settings only for main node** | `ConfigureWalletSettingsHandler.cs:130–131` (`FalconKeys.Error.WalletSettingsOnlyForMainNode`). |
| **Wallet cannot be re-configured** | `ConfigureWalletSettingsHandler.cs:140–141` (`WalletSettingsAlreadyConfigured`) — idempotent fence. |
| **Commercial-basis lock on Active/Expired contracts** | `Contract.HasRestrictedCommercialEditFields` (`Contract.cs:189`) + `Contract.Update` short-circuits at `:141–144`. |
| **Saudi business time as the single contract clock** | `ContractDatePolicy` (`Domain/Services/Policies/ContractDatePolicy.cs`); `BusinessTimeZoneId = "Asia/Riyadh"` (`Contract.cs:55`); start/end stored as both UTC and Saudi-local strings. |

---

## Gap notes (for follow-up phases)

1. **No FluentValidators authored** — pipeline wired (`AddAppValidation`), zero validators exist (`Grep ": AbstractValidator" → 0 hits`). Either delete the pipeline or start adding per-command validators.
2. **No transactional outbox** — explicit "live with replay" decision in `ContractLifecycleProcess.cs:221–222`. Single-shot Kafka events for `CreateMainNode`, `ConfigureWallet`, etc., are at-most-once if the pod dies between Mongo and Kafka.
3. **No inbox dedupe** on the single consumer — relies on downstream idempotence.
4. **`ServiceStatusChangedDomainEventHandler.cs:25–28` is commented out** — provisioning notify is dead code.
5. **Mongo collection name pluralization is naive** (`typeof(T).Name + "s"`) — `Settings` → `Settingss` (double-s). Verify by inspecting prod data or fix to use a custom pluralizer.
6. **`CreateMainNodeHandler` has no compensation** — if Kafka publish fails after the Node + Settings writes, the tenant is created but Identity never gets the sync. Manual cleanup risk.
7. **`Order` uses `MarkAsPaid` with hardcoded `"Commerce System"` updater** (`Order.cs:77`) — no audit trail of which Kafka message id caused the transition.

---

## File-path index (absolute)

Source tree root: `C:\Falcon\Falcon\falcon-core-commerce-svc\src\`

- `Falcon.Commerce.Domain\Entities\Node\Node.cs` (aggregate root)
- `Falcon.Commerce.Domain\Entities\Tenant.cs`
- `Falcon.Commerce.Domain\Entities\Order\Order.cs`
- `Falcon.Commerce.Domain\Entities\Contracts\Contract.cs`
- `Falcon.Commerce.Domain\Entities\Settings\Settings.cs`
- `Falcon.Commerce.Domain\Entities\Node\MultiLanguageName.cs`
- `Falcon.Commerce.Domain\Validations\ValidationAttribute.cs`
- `Falcon.Commerce.Domain\Exceptions\FalconException.cs`
- `Falcon.Commerce.Application\Services\Handlers\*Handler.cs` (≈ 50 files)
- `Falcon.Commerce.Application\Services\Processes\CreateMainNodeProcess.cs`
- `Falcon.Commerce.Application\Services\Processes\ContractLifecycleProcess.cs`
- `Falcon.Commerce.Application\Services\Processes\CompleteFalconServicePaymentProcess.cs`
- `Falcon.Commerce.Application\Behaviors\ValidationBehavior.cs`
- `Falcon.Commerce.Application\DependencyInjection.cs`
- `Falcon.Commerce.Application\Events\*.cs` (13 event DTOs)
- `Falcon.Commerce.Infrastructure\Messaging\Kafka\Producers\*.cs` (10 publishers)
- `Falcon.Commerce.Infrastructure\Messaging\Kafka\Consumers\FalconServiceOrderPaymentProcessedEventConsumer.cs`
- `Falcon.Commerce.Infrastructure\Persistence\MongoIndexInitializer.cs`
- `Falcon.Commerce.Infrastructure\Persistence\MongoUnitOfWork.cs`
- `Falcon.Commerce.Infrastructure\Persistence\Repositories\MongoRepository.cs`
- `Falcon.Commerce.Infrastructure\DependencyInjection.cs`
- `Falcon.Commerce.Infrastructure\Auth\AuthorizationPolicies.cs`
- `Falcon.Commerce.Infrastructure\Jobs\ContractLifecycleRecurringJob.cs`
- `Falcon.Commerce.Infrastructure\Jobs\AutoRenewalJob.cs`
- `Falcon.Commerce.Api\Common\ServiceOperationResult.cs`
- `Falcon.Commerce.Api\Controllers\*.cs` (10 controllers)
- `Falcon.Commerce.Api\appsettings.json` (Kafka topics + Mongo + settings)

Gateways:
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\appsettings.json`
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\appsettings.json`
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Endpoints\Groups\CommerceEndpointGroup.cs`
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Features\AccountHierarchy\GetAccountHierarchyEndpoint.cs`

— end of Wave 18A —
