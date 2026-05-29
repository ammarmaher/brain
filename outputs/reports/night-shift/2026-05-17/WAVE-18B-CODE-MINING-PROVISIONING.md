# WAVE-18B — Code Mining: Falcon Provisioning Service

> **Repo:** `C:\Falcon\Falcon\falcon-core-provisioning-svc`
> **Mined:** 2026-05-18
> **Mode:** Whole-repo grep + read; no behavioral testing.
> **Vol 44 cross-refs:** Mapped where present; gaps explicitly marked.

---

## TL;DR — Reality Check

The Provisioning service is a **thin skeleton**, not the full lifecycle engine the spec implies. Out of the requested mining surface (Activate, Renew, Disable, Enable, DoPayment, Delete-Pending, Kafka producers/consumers, grace-period worker, scheduled price-change flow), **only two flows are implemented end-to-end**:

1. **`CreateAccountServices`** — bulk seed an account's service rows (called by Falcon-only at provisioning time).
2. **`ChangeAccount{Application|CommChannel}ServiceVisibility`** — flip the `visibility` bool (Falcon-only).

Everything else — Activate/Renew/Disable/Enable/DoPayment/Delete-Pending, Kafka consumers/producers, grace-period TTL, scheduled price-change with `effectiveDate`, validators, sufficient-balance checks, Commerce↔Provisioning sync — **does not exist in code**. The state machine is *modeled* (enum `eProductSubscriptionStatus` with 5 states, plus a static `GetAvailableActions` FSM), but **only the `Visibility` write-path actually exists**. Transitions between `InActive → Active → Expired → Disabled` are **not wired to any command handler**, and `Status` is set exclusively at create time (always to `InActive` on the visibility-flip auto-create path).

This means: **Provisioning currently owns the data model and the read-side projection of available actions, but the actual lifecycle is driven elsewhere** (presumably Commerce — Vol 44 §7 MP-TT-* tautologies are not enforced here). The handlers that would call DoPayment / Activate / Renew live in another service or do not yet exist.

---

## 1. Service Entity Model

### Inheritance shape

`FalconServiceBase` is **abstract** and inherited by both `ApplicationService` and `CommunicationChannelService`. CommChannel is **NOT** a sub-type of "service" in a generic sense — it is a peer sibling alongside Application, both rooted at `FalconServiceBase`.

**File:line citations:**
- `src/Falcon.Provisioning.Domain/Entities/FalconService/FalconServiceBase.cs:9` — `public abstract class FalconServiceBase : IBaseEntity, ITenantEntity`
- `src/Falcon.Provisioning.Domain/Entities/FalconService/ApplicationService.cs:6` — `public class ApplicationService : FalconServiceBase` (adds `ApplicationId`)
- `src/Falcon.Provisioning.Domain/Entities/FalconService/CommunicationChannelService.cs:6` — `public class CommunicationChannelService : FalconServiceBase` (adds `CommChannelId`)

### Common columns on `FalconServiceBase` (FalconServiceBase.cs:11-34)

| Property | BSON element | Type |
|---|---|---|
| `Id` | `_id` (ObjectId) | string |
| `AccountId` | `accountId` | string |
| `Status` | `status` | `eProductSubscriptionStatus` |
| `TenantId` | `tenantId` (required) | string |
| `StatusHistory` | `statusHistory[]` | `List<FalconServiceStatusHistory>` |
| `Visibility` | `visibility` | bool |
| `LastUpdatedByUserType` | `lastUpdatedByUserType` | `eUserType` (Falcon|Client) |

### MongoDB Collection Names

The repository uses a generic convention: `typeof(T).Name + "s"` (`src/Falcon.Provisioning.Infrastructure/Persistence/Repositories/MongoRepository.cs:17`). Therefore:

| Entity class | Mongo collection |
|---|---|
| `ApplicationService` | `ApplicationServices` |
| `CommunicationChannelService` | `CommunicationChannelServices` |
| `Tenant` | `Tenants` |
| `Lookup` | `Lookups` |
| `LookupValue` | `LookupValues` |
| `ActivityLog` | `ActivityLogs` |

Database: `FalconProvisioningDB` (`src/Falcon.Provisioning.Api/appsettings.json:42`).

> **GAP vs Vol 44**: Apps and CommChannels are **separate Mongo collections** here, but Vol 44 §7 treats them as polymorphic "marketplace items" with identical action FSMs. The codebase reflects that intent (shared base + identical action policy), but the wire DTOs are duplicated (`GetAccountApplicationServiceRespose` vs `GetAccountCommunicationChannelServiceRespose` — both structurally identical except for the `ApplicationId`/`CommChannelId` discriminator).

### Tenant entity

`src/Falcon.Provisioning.Domain/Entities/Tenant.cs:8-67` — holds `name`, `databaseName`, `connectionString`, `username`, `password`, `usesSharedDatabase`. Seeded with one row at startup: `FalconValues.Tenants.FlaconTenantId = "6952700afc1773b4ec8b6ba2"` named "Falcon" (`src/Falcon.Provisioning.Domain/Constants/FalconValues.cs:8`, `src/Falcon.Provisioning.Infrastructure/Seeding/SeedData.cs:9-17`). Unique index on `name` (`src/Falcon.Provisioning.Infrastructure/Persistence/MongoIndexInitializer.cs:26-38`).

---

## 2. State Machines

### 2.1 State enum

**`src/Falcon.Provisioning.Domain/Constants/Enums .cs:3-10`** (yes, filename has a literal space before `.cs`):

```csharp
public enum eProductSubscriptionStatus
{
    InActive = 1,
    Paid = 2,
    Active = 3,
    Expired = 4,
    Disabled = 5
}
```

> **DEVIATION from the spec brief**: The task brief expected `eFalconServiceStatus { None=0, Inactive=1, Active=2, Expired=3, Disabled=4 }`. Actual code uses **`eProductSubscriptionStatus`** with numbering `InActive=1, Paid=2, Active=3, Expired=4, Disabled=5`. There is an extra `Paid=2` state, and **no `None=0`** value. The `Paid` state appears nowhere in switch logic — only in the enum declaration and the commented-out case in `FalconServiceBase.cs:57-59` (`//case eProductSubscriptionStatus.Paid:`). It is dead code/data only.

> **DEVIATION from Vol 44**: The other-service mining note in your prompt cites `eFalconServiceStatus`. The actual Provisioning enum is named `eProductSubscriptionStatus`. Cross-service alignment is broken — Commerce may use a different enum name/values.

### 2.2 Action enum

**`src/Falcon.Provisioning.Domain/Constants/Enums .cs:35-42`**:

```csharp
public enum eFalconServiceAction
{
    DoPayment = 1,
    Disable = 2,
    Enable = 3,
    EditPriceType = 4,
    EditPriceValue = 5
}
```

> **MISSING actions vs the prompt**: No `Activate`, no `Renew`, no `DeletePending`. The codebase models only the 5 actions above. Activation, Renewal, and Delete-Pending are entirely absent from this service's enum surface.

### 2.3 Transition policy / Available-Actions FSM

**`src/Falcon.Provisioning.Domain/Entities/FalconService/FalconServiceBase.cs:42-75`** — static method `GetAvailableActions(bool visibility, eProductSubscriptionStatus status)`:

| Status | Visibility | Available actions emitted |
|---|---|---|
| any | `false` (hidden) | `EditPriceType`, `EditPriceValue` only |
| `InActive` | `true` | `EditPriceType, EditPriceValue, DoPayment, Disable` |
| `Active` | `true` | `EditPriceType, EditPriceValue, Disable` |
| `Expired` | `true` | `EditPriceType, EditPriceValue, DoPayment, Disable` |
| `Disabled` | `true` | `EditPriceType, EditPriceValue, Enable` |
| `Paid` | (any) | **case is commented out → would throw `ArgumentOutOfRangeException`** at FalconServiceBase.cs:71-72 |

**Observations:**
- This is the **closest thing the repo has to a transition policy**. It is a *projection* of available actions, not a transition validator (no command handler enforces "you can only Disable from Active|InActive|Expired" before mutating Status).
- The "hidden" branch (visibility=false) is allowed for any status — it suppresses lifecycle actions and exposes only price editing. This is the foundation for "MP-TT-02 Falcon-controlled hide" but the **store side** of MP-TT-02 (only Falcon may flip Visibility) is enforced in `ServicesActionsPolicy.ValidateChangeServiceVisibilityAction` instead (see §4).
- `Paid` has no case and falls through to `default → throw` — calling `GetAvailableActions(true, eProductSubscriptionStatus.Paid)` is a **runtime exception**. (This indicates `Paid` is unreachable in the current code path. Possibly a vestige of a prior pay→active transition.)

### 2.4 Client/Falcon action filter

**`src/Falcon.Provisioning.Domain/Services/Policies/ServicesActionsPolicy.cs:10-24`** — `FilterActions(List<eFalconServiceAction> serviceActions, ActionAvailabilityContext context)`:

```csharp
if (context.CurrentUserType is eUserType.Client)
{
    serviceActions.Remove(eFalconServiceAction.EditPriceType);
    serviceActions.Remove(eFalconServiceAction.EditPriceValue);

    if (context.Status is eProductSubscriptionStatus.Disabled
        && context.LastUpdatedByUserType == eUserType.Falcon)
    {
        serviceActions.Remove(eFalconServiceAction.Enable);
    }
}
return serviceActions;
```

**Enforces:**
- **ENFORCES Vol 44 §7 MP-TT-03 (Falcon-only price control)** — Clients cannot see `EditPriceType` / `EditPriceValue` in `availableActions[]`.
- **ENFORCES Vol 44 §7 MP-TT-01 (Falcon-disable lock)** — if a Falcon user disabled a service, a Client cannot re-enable it. (`LastUpdatedByUserType == Falcon && Status == Disabled → Enable removed`).

The `ActionAvailabilityContext` carries the three signals needed for this filter (`src/Falcon.Provisioning.Domain/ValueObjects/ActionAvailabilityContext.cs:5-17`):

```csharp
public eUserType CurrentUserType { get; }
public eProductSubscriptionStatus Status { get; }
public eUserType LastUpdatedByUserType { get; }
```

`LastUpdatedByUserType` is persisted on the row (`FalconServiceBase.cs:34`) and re-written on every visibility change (`ChangeAccountApplicationServiceVisibilityHandler.cs:54,61`). This is the durable "who last touched this" stamp the policy reads at query time to compute `availableActions[]`.

### 2.5 `StatusHistory[]` value object

**`src/Falcon.Provisioning.Domain/ValueObjects/FalconServiceStatusHistory.cs:7-12`**:

```csharp
public eProductSubscriptionStatus Status { get; set; }
public eFalconServiceAction? Action { get; set; }
public DateTime CreatedAt { get; set; }
public string CreatedBy { get; set; }
```

The shape exists, the `BsonElement("statusHistory")` is wired on the entity (`FalconServiceBase.cs:27-28`), but **no code in the repo ever appends to `StatusHistory`**. Grep confirms: zero writers. The audit log of transitions is **modeled but never recorded**.

> **GAP**: Status history is dead infrastructure. If/when Activate/Renew/Disable/Enable land, they must write to `StatusHistory[]`.

---

## 3. Lifecycle Actions — Command Handlers

### Existing handlers (`src/Falcon.Provisioning.Application/Services/Handlers/`)

| Handler | Command | Endpoint | Auth |
|---|---|---|---|
| `CreateTenantHandler.cs` | `CreateTenantCommand` | (no controller — internal) | n/a |
| `CreateAccountServicesHandler.cs` | `CreateAccountServicesCommand` | `POST /api/Services/create-account-services` | `FalconOnly` |
| `ChangeAccountApplicationServiceVisibilityHandler.cs` | `ChangeAccountApplicationServiceVisibilityCommand` | `PUT /api/Services/account/application/visibility` | `FalconOnly` |
| `ChangeAccountCommunicationChannelServiceVisibilityHandler.cs` | `ChangeAccountCommunicationChannelServiceVisibilityCommand` | `PUT /api/Services/account/comm-channel/visibility` | `FalconOnly` |
| `GetAccountApplicationServicesHandler.cs` | `GetAccountApplicationServicesQuery` | `GET /api/Services/account/{id}/applications` | `Authorize` (any auth user) |
| `GetAccountCommunicationChannelServicesHandler.cs` | `GetAccountCommunicationChannelServicesQuery` | `GET /api/Services/account/{id}/comm-channels` | `Authorize` (any auth user) |
| `ListLookupHandler.cs` | `ListLookupQuery` | `GET /api/Lookup/{id}` | `Authorize` |

### Missing handlers — none of the following exist in code

| Action | Status |
|---|---|
| **Activate** | **NOT FOUND** — no handler, no command, no endpoint. `Status` is never set to `Active` anywhere in this repo. |
| **Renew** | **NOT FOUND** — no `RenewDate` field, no renewal handler, no scheduled job. |
| **Disable** | **NOT FOUND** as a command handler. The `eFalconServiceAction.Disable` value exists, the `GetAvailableActions` FSM advertises it, but no controller/handler/command writes `Status = Disabled`. |
| **Enable** | **NOT FOUND** as a command handler. Same as Disable — advertised in `availableActions[]` only. |
| **DoPayment** | **NOT FOUND** — no payment flow in Provisioning. Surfaced as an action in `GetAvailableActions` for `InActive`/`Expired` only. **Presumed to live in Commerce or Charging.** |
| **DeletePending** | **NOT FOUND** — no enum value, no handler. (Vol 44 §7 hints at delete-pending but Provisioning does not model it.) |

### Visibility handler details (the only real lifecycle write)

`ChangeAccountApplicationServiceVisibilityHandler.cs:29-65`:

1. `GetAsync(c => c.AccountId == command.AccountId && c.ApplicationId == command.ApplicationId)` — look up the row.
2. **Auto-create path** (row not found): build a new `ApplicationService` with `Status = eProductSubscriptionStatus.InActive`, `TenantId = command.AccountId` (n.b. tenantId is being set to accountId — possibly a bug, since they are different concepts) and `LastUpdatedByUserType = _sessionProvider.UserType.Value`, then `AddAsync`. Returns immediately — **the policy validation is skipped on auto-create**.
3. **Update path**: call `_servicesActionsPolicy.ValidateChangeServiceVisibilityAction(app.Status, command.Visibility, _sessionProvider.UserType.Value)`. If status is `Active` and visibility is being set to `false` → `FalconException(CannotHideActiveService)`. If user is `Client` → `FalconException(UnauthorizedAction)`.
4. `UpdateOneAsync(filter, builder => builder.Set(Visibility).Set(LastUpdatedByUserType))`.
5. Map result via `GetResult(...)`, which computes `CanHide` and `AvailableActions[]` server-side.

The CommChannel handler is structurally identical (`ChangeAccountCommunicationChannelServiceVisibilityHandler.cs:27-63`), with one minor anomaly:

> **BUG (likely)**: `ChangeAccountCommunicationChannelServiceVisibilityHandler.cs:74` builds `AvailableActions` by calling **`ApplicationService.GetAvailableActions(...)`** instead of inheriting from `FalconServiceBase` directly. Since both classes inherit the static method from `FalconServiceBase`, the call works — but it reads as a copy-paste leftover. Same pattern at `GetAccountCommunicationChannelServicesHandler.cs:47` and `GetAccountApplicationServicesHandler.cs:47`. Cosmetic but worth flagging.

### `CreateAccountServices` handler

`CreateAccountServicesHandler.cs:20-69` — bulk-inserts both `CommunicationChannelService` and `ApplicationService` rows in one call. **Does not set `LastUpdatedByUserType`** at create-time (only `AccountId`, `ApplicationId`/`CommChannelId`, `Status`, `Visibility`, `TenantId`). Status defaults to whatever the caller sets in the command (typically `InActive` from the caller's side; not enforced server-side).

> **Implication**: When `CreateAccountServices` is called and seed rows are written with `LastUpdatedByUserType = default` (i.e. `eUserType.Falcon = 1`? — actually the C# enum default is `0`, which is **not a valid `eUserType`** since the enum starts at `Falcon = 1`). This means **`LastUpdatedByUserType = 0` is persisted** on every newly seeded service row. Filter logic comparing `LastUpdatedByUserType == eUserType.Falcon` may behave inconsistently on first read. **Implicit bug.**

---

## 4. Visibility Flag

### Storage

- **Field**: `Visibility` (bool) on `FalconServiceBase` — `src/Falcon.Provisioning.Domain/Entities/FalconService/FalconServiceBase.cs:30-31`, BSON element `"visibility"`.
- **Default**: not specified in `[BsonDefaultValue(...)]` — relies on C# bool default `false`.
- **Persisted on**: `ApplicationServices` and `CommunicationChannelServices` Mongo collections.

### Who can flip it

**`src/Falcon.Provisioning.Domain/Services/Policies/ServicesActionsPolicy.cs:26-35`**:

```csharp
public bool ValidateChangeServiceVisibilityAction(
    eProductSubscriptionStatus status,
    bool newVisibility,
    eUserType currentUserType)
{
    if (currentUserType is eUserType.Client)
        throw new FalconException(FalconKeys.Error.UnauthorizedAction);

    if (!newVisibility && status is eProductSubscriptionStatus.Active)
        throw new FalconException(FalconKeys.Error.CannotHideActiveService);

    return true;
}
```

**ENFORCES Vol 44 §7 MP-TT-02 (Falcon-controlled visibility)** — only `eUserType.Falcon` may flip `Visibility`. Client attempts → `UnauthorizedAction` (FalconException). The controller-level `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` on the `PUT` endpoints (`ServicesController.cs:62, 71`) is the *defense in depth* — the policy method is the domain-layer enforcement.

**Additional invariant**: An `Active` service cannot be hidden. Hiding is allowed only when the service is in `InActive`, `Paid`, `Expired`, or `Disabled`. This invariant is also encoded in `FalconServiceBase.CanHide`:

```csharp
public static bool CanHide(bool visibility, eProductSubscriptionStatus status)
{
    return visibility && status is not eProductSubscriptionStatus.Active;
}
```

Returned to the client in every response DTO as `CanHide` — UI can pre-disable the "Hide" button before the request even fires. (FalconServiceBase.cs:37-40, all GET/PUT response DTOs.)

### Visibility on auto-create

The visibility-change handlers will **silently create the row if it doesn't exist** with the requested visibility value and `Status = InActive` (handler lines `34-49` for app, `32-47` for commchannel). This means the very first call to `PUT /api/Services/account/application/visibility` for a brand-new (account, app) pair **acts as both Create and Visibility-Set** in one operation. The policy method is not called on this auto-create path — only on subsequent updates.

> **GAP vs Vol 44 §7 MP-TT-02**: The auto-create branch bypasses `ValidateChangeServiceVisibilityAction`. A Client user *cannot* reach this branch through the API surface (the controller already gates on `FalconOnly`), so the gap is theoretical — but it is a defense-in-depth violation. If the controller policy is ever loosened, the auto-create branch would let a Client create rows.

---

## 5. Marketplace Integration (Commerce ↔ Provisioning sync)

**Result of grep `Commerce|commerce|charging|Charging|Wallet|Balance` across the entire repo:**

```
Falcon.Provisioning.Api/Program.cs:36 → Swagger title string "Falcon Commerce API v1" (stale copy-paste)
Falcon.Provisioning.Application/Services/Handlers/CreateTenantHandler.cs:1 → using Falcon.Commerce.Application.Commands;
Falcon.Provisioning.Application/Commands/CreateTenantCommand.cs:3   → namespace Falcon.Commerce.Application.Commands
Falcon.Provisioning.Application/Interfaces/Handlers/ICreateTenantHandler.cs:1 → using Falcon.Commerce.Application.Commands;
```

**None of these are integration code.** They are **stale namespace remnants** from when the file was forked from the Commerce service. The `CreateTenantCommand` literally still lives in `namespace Falcon.Commerce.Application.Commands` — a build artifact, not an event contract.

> **CONCLUSION**: There is **no Commerce → Provisioning sync code** in this repo. No gRPC client, no Kafka consumer, no webhook endpoint, no HTTP outbound. Whatever sync exists is **inbound-only and Commerce-driven** (Commerce calls the `POST /api/Services/create-account-services` endpoint when a new account is provisioned, and `PUT .../visibility` when Falcon flips a flag). Provisioning is a **passive store**.

---

## 6. Kafka Consumers

**Grep result for `Kafka|IConsumer|IProducer|Topic|kafka`: zero matches across the entire repo.**

> **CONCLUSION**: Provisioning is **not a Kafka consumer.** No `Confluent.Kafka` package reference, no consumer hosted service, no topic subscription.

This contradicts the platform architecture diagram in `C:\Falcon\CLAUDE.md` which shows `Commerce ↔ Kafka ↔ Provisioning`. The integration **is not implemented in this service yet**. (Commerce may publish events, but no one is reading them on the Provisioning side.)

---

## 7. Kafka Producers

**Same grep, zero matches.**

> **CONCLUSION**: Provisioning publishes **no Kafka events.** A state change on a `ApplicationService` or `CommunicationChannelService` does not emit a domain event downstream. Other services (Identity, Charging) cannot react to provisioning changes via the event bus.

---

## 8. Validation

### FluentValidation usage

**Grep `Validator|FluentValidation|IValidator`**:
```
Falcon.Provisioning.Api/Validators/ErrorResourceCompletenessValidator.cs
Falcon.Provisioning.Api/Localization/LocalizationExtension.cs
```

Both are localization-resource validators (startup-time check that all error keys have translations) — **not domain-level request validators**. No FluentValidation registered, no `IValidator<>` chain.

### Existing validation surface

1. **`ServicesActionsPolicy.ValidateChangeServiceVisibilityAction`** (covered in §4) — 2 rules:
   - Client user → `UnauthorizedAction`
   - `!newVisibility && Status==Active` → `CannotHideActiveService`

2. **`SessionProvider.TenantId` / `.NodeId` guards** — `src/Falcon.Provisioning.Infrastructure/Services/SessionProvider.cs:40-63` — if a Falcon user's JWT carries `tenantId` or `nodeId` claims (which it shouldn't), throw `UnauthorizedUserToPerformThisAction`. **ENFORCES** "Falcon admins are tenant-less" (Vol 44 mentions this implicitly in Authority Knowledge).

3. **`CreateTenantHandler.cs:43-50`** — try/catch on duplicate-key Mongo exception → `DuplicateTenantName`. Single domain-level guard on tenant create.

### Missing validators

| Validation expected by Vol 44 / spec | Code present? |
|---|---|
| Sufficient balance before `DoPayment` | **No** — DoPayment is not implemented in Provisioning. |
| `effectiveDate` is in the future on price-change | **No** — no price-change handler exists. |
| `effectiveDate.Day == RenewDate.Day - 1` (clamped) for Monthly/Yearly | **No** — no `RenewDate` field, no price-change handler. |
| `effectiveDate >= RenewDate - 1d` else `InvalidEffectiveDateForPeriodicPricingChange` | **No** — no such error code in `FalconKeys.Error`. |
| `OneTimePayment` only allows hard-future date | **No** — no `OneTimePayment` enum value in this service. |
| Cannot `Activate` if no comm-channel priority-order configured (`CommChannelPriorityOrderRequired`) | **No** — no `Activate` handler. |
| Cannot `Activate` if wallet not configured (`WalletNotConfigForTheNode`) | **No** — no wallet integration. |
| `InsufficientFunds` guard | **No**. |
| Account state-machine reentrancy guards | **No** — `Status` is never written by code except at create. |

> **CONCLUSION**: The full validation matrix from Vol 44 §7 MP-TT-04 (price-change scheduling) and the do-payment failure-reason set (`CommChannelPriorityOrderRequired` / `InsufficientFunds` / `WalletNotConfigForTheNode`) **lives somewhere else** — likely Commerce, not Provisioning. Provisioning does not own these invariants.

---

## 9. Grace Period

**Grep `BackgroundService|IHostedService|TTL|ExpireAfter|Schedule|Cron|Hangfire|Quartz` across the entire repo: zero matches.**

> **CONCLUSION**: There is **no background worker**, no scheduled task, no Mongo TTL index, no Hangfire/Quartz, no `IHostedService` implementation in Provisioning. The grace-period logic for `Expired` CommChannels (Vol 44 §7) **does not exist in this service.**

This is consistent with the broader picture: state transitions are not performed by Provisioning. Whatever flips `Status` to `Expired` (and whatever grace-period clock runs on `Expired` rows) lives outside this repo.

The `Expired` status value is declared (`eProductSubscriptionStatus.Expired = 4`) and the FSM advertises `DoPayment + Disable` actions for it — but **no code ever writes `Status = Expired`**. There is no clock, no expiry calculator, no TTL.

> **GAP**: Whoever runs the "renew or expire" cycle is not Provisioning. Candidates: Commerce, Charging, or a not-yet-built background service. **This is a major missing piece.**

---

## 10. Pricing-Change Scheduling (Vol 44 §7.4 MP-TT-04)

**Grep `effectiveDate|EffectiveDate|priceType|PriceType|priceValue|PriceValue|FirstActivationDate|ActivationDate|RenewDate` across the entire repo:**

```
Falcon.Provisioning.Domain/Services/Policies/ServicesActionsPolicy.cs    → only the enum names EditPriceType/EditPriceValue
Falcon.Provisioning.Domain/Entities/FalconService/FalconServiceBase.cs   → same, FSM exposes EditPriceType/EditPriceValue
Falcon.Provisioning.Domain/Constants/Enums .cs                            → enum value declarations only
```

**No** `PriceType`, `PriceValue`, `EffectiveDate`, `FirstActivationDate`, `ActivationDate`, `RenewDate`, or `Pricing` **field** exists on any entity in this service. The actions `EditPriceType` and `EditPriceValue` are **only visible as enum-set entries returned in `availableActions[]`** — there is no command handler, no endpoint, no controller, no validator, no scheduled-execution worker that honors `effectiveDate`.

> **CONCLUSION**: The MP-TT-04 "schedule a price change for a future effective date" flow is **entirely absent from Provisioning.** Either:
>   1. Commerce owns it (most likely — Commerce already has the `ServiceRow.pricingType/priceValue/firstActivationDate/activationDate/renewDate/scheduledChanges[]` shape per the memory log Wave 17), OR
>   2. It is not implemented yet on either side.

Provisioning does not own pricing.

---

## Cross-cutting findings

### Authorization surface

`src/Falcon.Provisioning.Infrastructure/Auth/AuthorizationPolicies.cs:1-10`:
```csharp
public const string FalconOnly = "FalconOnly";
public const string ClientOnly = "ClientOnly";
```

Applied at controller level:
- `[Authorize]` (any auth user) — GET endpoints (`ServicesController.cs:16` + per-method GETs at `:36, :44`, `LookupController.cs:13`)
- `[Authorize(Policy = FalconOnly)]` — all 3 write endpoints (`ServicesController.cs:52, 62, 71`)

`ClientOnly` is **defined but never used** (dead constant).

### Error keys (`FalconKeys.Error`)

`src/Falcon.Provisioning.Domain/Constants/FalconKeys.cs:9-18`:
- `DuplicateTenantName`
- `InternalServerError`
- `CommChannelNotFound`
- `ApplicationNotFound`
- `CannotHideActiveService`
- `UnauthorizedAction`
- `UnauthorizedUserToPerformThisAction`

Note: `CommChannelNotFound` and `ApplicationNotFound` are **declared but never thrown** (grep confirms). They are scaffolding for handlers that don't exist.

### Activity logging

`ActivityLogService.cs:23-43` logs request bodies + IP/agent/browser/URL/method to the `ActivityLogs` collection. **Never called from any handler** (grep `LogActivityAsync` returns only the definition). Activity log is **provisioned but never invoked**.

### Multi-language

`src/Falcon.Provisioning.Domain/ValueObjects/MultiLanguageName.cs` exists (per directory listing) but the Provisioning service has **no user-facing names** to localize (service rows are referenced by ID only — names presumably come from Commerce). Carried for consistency.

### Tenant model anomaly

In both visibility handlers, the auto-create branch sets `TenantId = command.AccountId`:
- `ChangeAccountApplicationServiceVisibilityHandler.cs:42`
- `ChangeAccountCommunicationChannelServiceVisibilityHandler.cs:40`

This is conflating tenant-id and account-id. The `Tenant` collection has a single seeded row (`"6952700afc1773b4ec8b6ba2"` named "Falcon"). All non-Falcon accounts apparently use their own AccountId as TenantId — implying the deployed model is "one tenant per account, sharing one Mongo database". This deserves review.

> **GAP / SMELL**: `TenantId` is `[BsonRequired]` on `FalconServiceBase.cs:21-24` but the auto-create code populates it from `command.AccountId`. The semantic of "tenant" in this service is unclear.

---

## Vol 44 §7 MP-TT-* Tautology Mapping

| Tautology | Description (best guess from prompt) | Provisioning enforcement |
|---|---|---|
| **MP-TT-01** | Falcon-disabled services stay locked from client re-enable | ENFORCES at `ServicesActionsPolicy.cs:17-20` (removes `Enable` from client `availableActions[]` when `Status==Disabled && LastUpdatedByUserType==Falcon`). |
| **MP-TT-02** | Visibility (Show/Hide) is Falcon-controlled | ENFORCES at `ServicesActionsPolicy.cs:28-29` + `[Authorize(Policy=FalconOnly)]` on both visibility PUT endpoints. Also: cannot hide `Active` service (`CannotHideActiveService` guard). |
| **MP-TT-03** | Falcon-only price control (Edit{PriceType,PriceValue}) | ENFORCES at `ServicesActionsPolicy.cs:14-15` (removes both price actions from client `availableActions[]`). **However: the actual `EditPriceType/EditPriceValue` command handlers do not exist** — the FSM advertises them, the filter hides them from clients, but no handler implements them. |
| **MP-TT-04** | Scheduled price change with `effectiveDate` honoring | **NOT ENFORCED.** No code present. See §10. |

---

## File:line citation index

| File | Lines | Purpose |
|---|---|---|
| `Domain/Entities/FalconService/FalconServiceBase.cs` | 1-76 | Abstract base — Id, AccountId, Status, TenantId, Visibility, LastUpdatedByUserType, StatusHistory; static `CanHide` + `GetAvailableActions` FSM |
| `Domain/Entities/FalconService/ApplicationService.cs` | 1-12 | Sub-type adds `ApplicationId` |
| `Domain/Entities/FalconService/CommunicationChannelService.cs` | 1-12 | Sub-type adds `CommChannelId` |
| `Domain/Constants/Enums .cs` | 3-10 | `eProductSubscriptionStatus { InActive=1, Paid=2, Active=3, Expired=4, Disabled=5 }` |
| `Domain/Constants/Enums .cs` | 22-33 | `eUserType { Falcon=1, Client=2 }` |
| `Domain/Constants/Enums .cs` | 35-42 | `eFalconServiceAction { DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5 }` |
| `Domain/Services/Policies/ServicesActionsPolicy.cs` | 10-24 | `FilterActions` — client/falcon action filter |
| `Domain/Services/Policies/ServicesActionsPolicy.cs` | 26-35 | `ValidateChangeServiceVisibilityAction` — MP-TT-02 enforcement |
| `Domain/ValueObjects/ActionAvailabilityContext.cs` | 5-17 | DTO carrying `currentUserType + status + lastUpdatedByUserType` |
| `Domain/ValueObjects/FalconServiceStatusHistory.cs` | 7-12 | StatusHistory shape (never written by any code) |
| `Domain/Constants/FalconKeys.cs` | 9-18 | Error keys |
| `Domain/Constants/FalconValues.cs` | 6-8 | `FlaconTenantId = "6952700afc1773b4ec8b6ba2"` |
| `Application/Services/Handlers/ChangeAccountApplicationServiceVisibilityHandler.cs` | 29-65 | Auto-create or update + `LastUpdatedByUserType` write |
| `Application/Services/Handlers/ChangeAccountCommunicationChannelServiceVisibilityHandler.cs` | 27-63 | Same pattern for CommChannel |
| `Application/Services/Handlers/CreateAccountServicesHandler.cs` | 20-69 | Bulk seed both service types |
| `Application/Services/Handlers/GetAccountApplicationServicesHandler.cs` | 25-51 | Read + project `availableActions[]` |
| `Application/Services/Handlers/GetAccountCommunicationChannelServicesHandler.cs` | 25-51 | Same for CommChannel |
| `Application/Services/Handlers/CreateTenantHandler.cs` | 23-53 | Insert Tenant (still in `Falcon.Commerce.Application.Commands` namespace — stale fork) |
| `Api/Controllers/ServicesController.cs` | 36-77 | All 5 service endpoints |
| `Api/Controllers/LookupController.cs` | 25-33 | `GET /api/Lookup/{id}` |
| `Infrastructure/Auth/AuthorizationPolicies.cs` | 6-10 | `FalconOnly`, `ClientOnly` |
| `Infrastructure/Persistence/Repositories/MongoRepository.cs` | 17 | Collection naming: `typeof(T).Name + "s"` |
| `Infrastructure/Persistence/MongoIndexInitializer.cs` | 26-38 | Tenants unique index on `name` |
| `Infrastructure/Seeding/SeedData.cs` | 9-17 | Single Falcon Tenant seed |
| `Infrastructure/Services/SessionProvider.cs` | 40-65 | TenantId/NodeId guards + UserType extraction from Zitadel claim |
| `Api/appsettings.json` | 39-44 | Mongo settings — db = `FalconProvisioningDB` |
| `Api/Bootstrap.cs` | 14-29 | DI registration root |
| `Application/Bootstrap.cs` | 12-23 | 8 handler registrations |
| `Domain/Bootstrap.cs` | 9-13 | Single registration — `IServicesActionsPolicy` |

---

## Five-Line Summary

1. Provisioning is a **thin skeleton**: only `CreateAccountServices` + `ChangeVisibility` (App/CommChannel) writes implemented; **Activate/Renew/Disable/Enable/DoPayment/DeletePending all absent** as command handlers despite being advertised in the `availableActions[]` FSM.
2. State enum is **`eProductSubscriptionStatus { InActive=1, Paid=2, Active=3, Expired=4, Disabled=5 }`** (not `eFalconServiceStatus { None=0, Inactive=1, Active=2, Expired=3, Disabled=4 }` as the brief expected) — `Paid` is dead code with no switch case, never reached.
3. **No Kafka producers, no Kafka consumers, no background workers, no TTL/cron, no `IHostedService`** — Provisioning is a passive store; whoever drives lifecycle transitions and grace-period expiry lives elsewhere (likely Commerce + Charging).
4. **Visibility is fully Falcon-controlled (ENFORCES MP-TT-02)** at `ServicesActionsPolicy.cs:28-29` + `[FalconOnly]` controller policy + `CanHide`+`CannotHideActiveService` invariant on `Active` status. **MP-TT-01 (Falcon-disable lock)** also enforced at policy filter line 17-20. **MP-TT-03 (Falcon-only price)** filter exists but price-change command handlers do not. **MP-TT-04 (scheduled price change with `effectiveDate`)** entirely missing.
5. **Mongo collections** = `ApplicationServices`, `CommunicationChannelServices`, `Tenants`, `Lookups`, `LookupValues`, `ActivityLogs` (database `FalconProvisioningDB`); naming convention `typeof(T).Name + "s"` at `MongoRepository.cs:17`; `StatusHistory[]` and `ActivityLog` are modeled but **never written** anywhere in code.
