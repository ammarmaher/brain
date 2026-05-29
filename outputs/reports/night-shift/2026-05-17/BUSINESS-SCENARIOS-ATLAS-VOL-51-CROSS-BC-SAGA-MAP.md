# Volume 51 — Cross-Bounded-Context Saga Map

> **Specialist depth:** Map every Kafka topic, every outbox/inbox pattern, every saga compensation, every cross-service handshake in the Falcon platform. Use this volume when designing or debugging anything that spans service boundaries.
>
> **Authority:** Vol 45 §6 (Charging Kafka consumer) + Vol 47 §10 (Identity-as-User-owner) + Wave 11 + Wave 14 code-mining findings. Code citations carry `[CODE]` prefix.

---

## §1 — The Service Topology

### §1.1 The 7-service map

```
                          ┌─────────────────────┐
                          │   Web Platform UI   │
                          │  (host-shell, etc.) │
                          └──────────┬──────────┘
                                     │ HTTPS
                  ┌──────────────────┴──────────────────┐
                  ▼                                       ▼
         ┌──────────────────┐                  ┌──────────────────┐
         │  Core Gateway     │                  │  System Gateway   │
         │  (client-facing)  │                  │  (Falcon-facing)  │
         └────────┬──────────┘                  └─────────┬────────┘
                  │                                        │
                  │ YARP routing + JWT forward             │
                  └──────────────────┬─────────────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            ▼                        ▼                        ▼
   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
   │  Commerce        │   │  Identity         │   │  Provisioning    │
   │  (account/node)  │   │  (user/auth)      │   │  (commchnl/app)  │
   └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
            │                       │                      │
            └──────────┬────────────┴──────────────────────┘
                       │ Kafka (event-driven cross-BC)
                       ▼
            ┌──────────────────┐
            │  Charging         │
            │  (wallets+ledger) │
            └──────────────────┘
```

### §1.2 Service ownership map (canonical bounded contexts)

| Service | Owns | Does NOT own |
|---|---|---|
| **Commerce** | Account, Node, Hierarchy, **Contract**, **Plan**, ContactGroup, Template (catalog) | User (Identity owns), Wallet (Charging owns), CommChannel state (Provisioning owns) |
| **Identity** | **User entity**, Session, Zitadel sync, Password policy, OTP, IP allowlist | Account (Commerce owns) |
| **Provisioning** | CommChannel state, Application state, Service catalog visibility, Activation/Expiry/Disable FSM | Pricing (Commerce owns), Wallet (Charging owns) |
| **Charging** | Wallet aggregate (`OcsWallet`), Ledger, Funding decisions, Reservation TTLs | Account, User, CommChannel (consumers) |
| **Core Gateway** | YARP routing for client-facing, JWT forward, response aggregation | Domain logic (none) |
| **System Gateway** | Same as Core Gateway but for Falcon-admin-facing | Domain logic (none) |
| **Web Platform UI** | UI state, signals, facades, micro-frontends | Domain logic (all server-side) |

### §1.3 Critical inversion (corrected by Wave 14)

Prior assumption (now wrong): "Commerce owns the User entity; Identity is a projection."

**Truth (code-verified):** **Identity owns the User entity** (`FalconIdentityDb.Users`). Commerce produces creation requests via Kafka → Identity creates and is authoritative.

This is THE most important architectural inversion the night-shift recovered. It changes saga design.

---

## §2 — Kafka Topic Inventory

### §2.1 Commerce-produced topics

| Topic | Event type | Trigger | Consumed by |
|---|---|---|---|
| `user-creation-requested` | `UserCreationRequestedEvent` (AES-256-GCM encrypted password) | Admin invokes Create User from Org Hierarchy | Identity |
| `user-suspended` | `UserSuspendedEvent` | Admin invokes Suspend User | Identity |
| `user-deleted` | `UserDeletedEvent` | Admin invokes Delete User | Identity |
| `user-undeleted` | `UserUndeletedEvent` (Falcon-only) | Admin invokes Un-Delete User | Identity |
| `user-locked` / `user-unlocked` | `UserLockedEvent` / `UserUnlockedEvent` | Admin or system | Identity (⚠️ `Unlocked` handler has bug — see Vol 47 BUG §1) |
| `user-permissions-changed` | `UserPermissionsChangedEvent` | Admin updates role/PES | Identity (re-issue JWT claims on refresh) |
| `tenant-settings-updated` | `TenantSettingsUpdatedEvent` | Admin updates account-level policy | Identity (apply new OTP/password policy) |
| `account-created` | `AccountCreatedEvent` | Admin creates new account | Charging (create MW), Provisioning (init service catalog) |
| `node-created` | `NodeCreatedEvent` | Admin adds sub-node | Provisioning (extend catalog) |
| `contract-charged` | `ContractChargedEvent` | T2 charges contract value | Charging (credit MW with new bucket) |
| `contract-amended` | `ContractAmendedEvent` | T2 amends an existing contract | Charging (update relevant buckets) |
| `contract-expiry-scheduled` | `ContractExpiryScheduledEvent` (with target date) | Contract enters expiring state | Charging (schedule expiry-deduction) |
| `commchannel-purchase-requested` | `CommChannelPurchaseRequestedEvent` | AO/Falcon invokes Activate CommChannel | Charging (compute funding decision) → Provisioning (activate after Charging confirms) |
| `application-purchase-requested` | `ApplicationPurchaseRequestedEvent` | similar to above | same |

### §2.2 Identity-produced topics

| Topic | Event type | Trigger | Consumed by |
|---|---|---|---|
| `user-created` | `UserCreatedEvent` (after Identity creates Zitadel user) | After `user-creation-requested` is processed | Commerce (notify creator + UI), Audit |
| `user-creation-failed` | `UserCreationFailedEvent` | Zitadel rejects (e.g., email duplicate) | Commerce (compensate / surface error) |
| `password-changed` | `PasswordChangedEvent` | User completes ForgotPassword or first-login | Audit |
| `session-started` | `SessionStartedEvent` | Successful login | Audit |
| `session-revoked` | `SessionRevokedEvent` | Suspend/Delete/Lock | Commerce (UI notification), Audit |

### §2.3 Provisioning-produced topics

| Topic | Event type | Trigger | Consumed by |
|---|---|---|---|
| `commchannel-activated` | `CommChannelActivatedEvent` | After Provisioning marks Active (post-Charging funding) | Commerce (UI state), BSA (enable sends), Audit |
| `commchannel-expired` | `CommChannelExpiredEvent` | Grace period ended | Charging (potential refund), Audit |
| `commchannel-disabled` | `CommChannelDisabledEvent` | Admin disables | Charging (release reservations) |
| `application-activated/expired/disabled` | similar shape | similar triggers | same consumers |
| `service-visibility-changed` | `ServiceVisibilityChangedEvent` | Falcon flips Visibility flag | Commerce (UI sync) |

### §2.4 Charging-produced topics

| Topic | Event type | Trigger | Consumed by |
|---|---|---|---|
| `wallet-charged` | `WalletChargedEvent` | After `Charge` action | Commerce (UI sync) |
| `wallet-transferred` | `WalletTransferredEvent` | After `Transfer` | Commerce (UI) |
| `funding-decision-made` | `FundingDecisionMadeEvent` | After purchase/sub-service deduction | Provisioning (proceed with activation) |
| `funding-decision-failed` | `FundingDecisionFailedEvent` | InsufficientFunds / CommChannelPriorityOrderRequired | Provisioning (abort), UI (show error) |
| `contract-expiry-processed` | `ContractExpiryProcessedEvent` | After `ProjectContractLifecycleProcess.ExecuteExpiryAsync` drains buckets | Commerce, Provisioning (deactivate affected services) |
| `refund-issued` | `RefundIssuedEvent` | Saga compensation | Audit |

---

## §3 — The Outbox Pattern

### §3.1 Why Outbox

Cross-BC sagas have a 2-write problem: writing to the local DB AND publishing to Kafka are NOT in the same transaction. If the DB commit succeeds but Kafka publish fails, the system diverges.

Solution: **transactional outbox** — write the event to an `outbox` collection inside the same DB transaction as the entity update. A separate worker reads `outbox` and publishes to Kafka with retry-until-success.

### §3.2 [INFERRED] Outbox collection schema

```
OutboxEntry {
  id, createdAt, publishAt (for delayed publishing),
  topic, payload (serialized event),
  status: Pending | Published | Failed,
  attempts: int,
  lastAttemptAt, lastError?,
  correlationId
}
```

### §3.3 Inbox pattern (consumer-side dedup)

Each consumer maintains an `inbox` collection (or unique index on `correlationId`). When a Kafka message arrives:
1. Check inbox for `correlationId`.
2. If present → ack and skip (already processed).
3. If absent → process, write inbox entry, ack.

This handles Kafka at-least-once delivery without duplicating side-effects.

### §3.4 Code-mining queue for outbox/inbox verification

Wave 18+ should verify:
- Q-SAGA-01: Does Commerce have an `outbox` collection? Where?
- Q-SAGA-02: Does Identity have an `inbox` collection?
- Q-SAGA-03: Is there a shared outbox/inbox base class across services?
- Q-SAGA-04: What's the polling interval for outbox publisher? Backoff strategy?

---

## §4 — Saga Patterns

### §4.1 Saga 1 — User Creation (Commerce orchestrates)

```
1. Admin POSTs /api/user (Commerce endpoint via gateway)
2. Commerce: validate request (PES, hierarchy, limit) → save Pending in local store
3. Commerce: write outbox(topic=user-creation-requested, payload=encrypted)
4. Commerce: respond 202 Accepted to UI with "Pending" state
5. Outbox publisher → Kafka emits user-creation-requested
6. Identity: consume event → decrypt password → create User entity in FalconIdentityDb → create Zitadel user
7. Identity: emit user-created OR user-creation-failed
8. Commerce: consume callback → finalize Pending UI state OR rollback (Saga abort)
```

**Compensation on Identity-side failure:**
- Identity emits `user-creation-failed`
- Commerce: delete the Pending placeholder, emit UI notification "User creation failed: <reason>"

### §4.2 Saga 2 — CommChannel Purchase (multi-step)

```
1. AO clicks "Activate WA-Util" in admin console
2. Commerce: validate request → emit commchannel-purchase-requested (topic)
3. Charging: consume → compute FundingDecision via ResolveWalletFundingDecisionPolicy
   - If success: debit wallets via MongoUnitOfWork transaction → emit funding-decision-made
   - If failure: emit funding-decision-failed
4. Provisioning: consume funding-decision-made → mark CommChannel as Active → emit commchannel-activated
5. Commerce: consume commchannel-activated → UI sync
6. BSA: consume commchannel-activated → enable sends on the channel
```

**Compensation flow:**
- If Step 4 fails (Provisioning errors): emit `provisioning-failed` → Charging: refund the wallets (credit back the FundingDecision sources) → emit `refund-issued` → Commerce: surface error to UI.

### §4.3 Saga 3 — Contract Expiry (system-driven, fan-out)

```
1. Time reaches contract.expiresAt
2. Commerce: scheduler/trigger fires → emit contract-expiry-scheduled (well in advance)
3. Charging: ProjectContractLifecycleProcess.ExecuteExpiryAsync consumes
   - Walk all wallets containing the contract's buckets
   - For each: drain bucket → flip Status=Expired
   - Emit contract-expiry-processed
4. Provisioning: consume contract-expiry-processed → for each affected service:
   - If no other active contract funds it → emit commchannel-expired / application-expired
5. Commerce: consume commchannel-expired → UI state update
6. BSA: stop sends on expired channels
```

**Race-condition handling:** Wave 11 confirmed Charging uses optimistic concurrency on wallets, so concurrent in-flight transactions and the expiry sweep don't corrupt state.

### §4.4 Saga 4 — Account Soft-Delete (cascade)

```
1. Falcon admin clicks Delete Account
2. Commerce: validate → emit account-deletion-requested (encrypted reasons + timestamp)
3. Identity: consume → mark all users under account as Deleted (soft) → revoke sessions
4. Provisioning: consume → mark all services Disabled (no further sends)
5. Charging: consume → freeze wallet (no further mutations) but keep balances for audit
6. All three emit *-acknowledged
7. Commerce: when all 3 acks received → mark Account Deleted → emit account-deleted
```

**Compensation:** Account un-delete reverses the cascade in the same order.

### §4.5 Saga 5 — Template Submission to Meta

```
1. NU submits template via Commerce endpoint
2. Commerce: validate body, variables → write outbox(topic=template-submission-requested)
3. If Free Body: skip internal review → continue
   If Restricted Body 1L: emit template-needs-l1-review → AO notified
4. After L1 (and L2 if 2L) approval: emit template-l-approved
5. Commerce: outbox publishes to Meta Business Mgmt API (HTTP, not Kafka)
6. Meta webhook arrives → Commerce updates status to Approved/Rejected-final
```

**Note:** This saga has HTTP boundary (Meta) — not pure Kafka. Meta webhook becomes the inbound trigger for status-change events.

### §4.6 Saga 6 — Send Transaction (BSA single send)

```
1. AO clicks Send on a BSA action
2. BSA: validate destination via Vol 44 §8 destination-ID
3. BSA: lookup template → check Approved status
4. BSA: compute Needed amount → call Charging
5. Charging: AllocateOcsMonetaryBucketsPolicy → FundingDecision
6. BSA: enter "Funded" state
7. BSA: POST to Meta Cloud API (WA) or SMS provider or Voice provider
8. Provider response → BSA enters "Submitted"
9. Webhook → BSA "Sent" → "Delivered" or "Failed"
10. If Failed: emit refund-requested → Charging credits back the FundingDecision sources
```

This is the most frequent saga in the platform.

---

## §5 — Failure Modes Catalog

### §5.1 Kafka unavailable
**Effect:** Outbox publisher backs off; events accumulate in `outbox` table.
**Recovery:** When Kafka returns, publisher catches up. No event loss because outbox is transactional.

### §5.2 Consumer fails to process event
**Effect:** Consumer retries with exponential backoff. After N attempts → DLQ.
**Recovery:** Admin investigates DLQ; either fix root cause and re-queue, or compensate.

### §5.3 Event applied twice (Kafka redelivery)
**Effect:** Inbox dedup catches the duplicate; second processing is a no-op.

### §5.4 Cross-service ordering issues
**Setup:** Commerce emits A and B in that order; consumer processes B before A.
**Effect:** Depending on event semantics, might be fine (independent) or corrupt (B depends on A).
**Mitigation:** Use Kafka partition keys for related events (e.g., partition by `accountId`).

### §5.5 Provisioning succeeds, Charging compensation fails
**Setup:** Provisioning activated a CommChannel; later, refund saga fires but Charging refund fails.
**Effect:** Service is provisioned but Falcon owes the customer a credit.
**Recovery:** Manual intervention via Falcon admin tools; ledger entries recorded for audit reconciliation.

### §5.6 The Webhook Bug (Wave 14)
**File:** `ZitadelWebhookEndpoint.cs:112`
**Effect:** User unlock from Zitadel sets Status=Active, bypassing the Locked→Pending policy. Security regression.
**Status:** Task chip spawned. Fix is to use UserStatusTransitionPolicy.

---

## §6 — Idempotency

### §6.1 Wallet domain (Wave 11)

Charging uses a **deterministic** idempotency key: `{operation}:{walletId}:{refType}:{refId}` stored as `WalletMutationReceipt`. The receipt caches the `ResponseJson` — replay returns the cached response without re-executing.

**Implication:** Even at-least-once Kafka delivery is safe — the same `correlationId` (= the key components) yields the cached result.

### §6.2 User domain (Wave 14 inference)

Identity likely uses similar pattern — `correlationId` from the inbound Commerce event keyed for inbox dedup.

### §6.3 General principle

Every saga step that mutates state MUST be idempotent. The dedup key is typically:
- `{commandType}:{aggregateId}:{commandId}` for commands
- `{eventType}:{causationEventId}` for projected reactions

### §6.4 Code-mining queue for idempotency verification

- Q-SAGA-05: Is the `WalletMutationReceipt` pattern replicated in Commerce/Identity/Provisioning? Or each service has its own?
- Q-SAGA-06: What's the dedup window (TTL)? Indefinite?

---

## §7 — Mental Model for Saga Design

### §7.1 The 4-question test

For any new cross-BC operation, answer:

1. **Who's the orchestrator?** (Usually the BC that owns the command originator.)
2. **What's the happy path event chain?**
3. **What can fail at each step, and what's the compensation?**
4. **What's the idempotency key for each handler?**

If you can't answer all 4, don't ship the saga.

### §7.2 The "owns vs uses" rule

A service **owns** an entity → it's the authoritative state. Other services **use** the entity via consumed events but cannot mutate it.

Examples:
- Commerce **owns** Contract; Charging **uses** it for FundingDecision lookup.
- Identity **owns** User; Commerce **uses** it for hierarchy attachment.
- Charging **owns** Wallet; Provisioning **uses** FundingDecision for activation gate.

If service A wants to modify entity X owned by B, A emits a request event → B processes and emits a result event. There are NO direct cross-DB writes.

### §7.3 The "publish before respond" axiom

Whenever a command-handler must produce a cross-BC effect:
1. Persist the local entity change.
2. Write to outbox.
3. Respond to caller (with `Accepted` or `Processing` state if not synchronously confirmed).

If you commit the entity but skip outbox, you have a "lost event". If you publish before commit, you have a "phantom event" (no underlying state). **Outbox-in-same-txn is the only correct pattern.**

---

## §8 — Audit Trail Across Services

### §8.1 The correlation chain

Every saga produces a chain of events tied by `correlationId` (= original command id) + `causationId` (= the parent event id).

Example for User Creation:
- `user-creation-requested` → correlationId=ABC, causationId=null
- `user-created` → correlationId=ABC, causationId=ABC (the request)
- `tenant-counter-updated` → correlationId=ABC, causationId=user-created

This lets the audit log reconstruct the full saga from any starting point.

### §8.2 Cross-service log aggregation

Each service writes its audit events to its own DB collection. A central audit aggregator (or external SIEM) collects them all for cross-service queries.

[INFERRED]: Falcon likely uses Kafka for audit log centralization too — a `falcon-audit` topic consumed by an audit-store consumer.

### §8.3 SAMA reporting

For SAMA compliance, the audit aggregator must produce:
- Daily money-movement reports (Charging-sourced)
- User-action reports (every actor + every mutation)
- System-event reports (auto-locks, expirations, etc.)
- 10-year retention

---

## §9 — PR Review Checklist (saga-touching changes)

- [ ] Does the new endpoint/handler use outbox-in-same-txn for cross-BC effects?
- [ ] Is the inbox dedup applied to incoming events?
- [ ] Is the idempotency key deterministic (no client-supplied UUID required)?
- [ ] Is the saga compensation path documented + implemented?
- [ ] Is the `correlationId` propagated through every step?
- [ ] Are events keyed on the right partition (e.g., accountId) for ordering?
- [ ] Is the DLQ handler in place for terminal failures?
- [ ] Is the audit event emitted at every saga step?
- [ ] Is the consumer at-least-once-tolerant?
- [ ] Has the cross-BC contract been reviewed (event schema + Avro/Json)?
- [ ] Has the consumer group been registered properly?
- [ ] Has the retry/backoff strategy been tested?

---

## §10 — Cross-References

- Vol 45 §6 — Contract expiration is Kafka-driven (`ProjectContractLifecycleProcess.ExecuteExpiryAsync`)
- Vol 45 §5 — MongoUnitOfWork atomicity (intra-service)
- Vol 47 §10 — Identity-as-User-owner reversal
- Vol 47 §V47 BUG §1 — Zitadel webhook handler bug
- Vol 40 — Module 06 BSA (the most common saga — send transaction)
- Vol 49 — Template Lifecycle (Meta integration HTTP boundary)
- WAVE-11-CODE-MINING-WALLET.md — Charging code citations
- WAVE-14-CODE-MINING-USER-LIFECYCLE.md — Identity code citations
- WAVE-18A-CODE-MINING-COMMERCE.md — pending (Wave 18a agent)
- WAVE-18B-CODE-MINING-PROVISIONING.md — pending (Wave 18b agent)

---

## §11 — Open Questions

| ID | Question | Owner |
|---|---|---|
| Q-SAGA-01 | Outbox collection — where in Commerce? Schema? | Commerce architect |
| Q-SAGA-02 | Inbox collection in Identity — confirm pattern? | Identity architect |
| Q-SAGA-03 | Shared outbox/inbox base class — exists? | Platform |
| Q-SAGA-04 | Outbox publisher polling + backoff | Platform |
| Q-SAGA-05 | Idempotency receipt pattern across all services? | Platform |
| Q-SAGA-06 | Dedup TTL — indefinite or windowed? | Platform |
| Q-SAGA-07 | Audit aggregator topology — Kafka or batch? | Audit/SIEM team |
| Q-SAGA-08 | DLQ handler operational runbook | DevOps |
| Q-SAGA-09 | Cross-BC event schema registry — Avro? JSON Schema? | Platform |
| Q-SAGA-10 | Account soft-delete cascade ordering — what's the canonical sequence? | Commerce + Identity + Provisioning + Charging |

---

**End of Volume 51 — Cross-Bounded-Context Saga Map**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 45 §5-§6 + Vol 47 §10 + Wave 11 + Wave 14 code-mining
**Pending:** Wave 18a/b/c/d code-mining will refine §3 (outbox), §4 (saga code paths), §5 (failure modes), §6 (idempotency)


---

## §V51-PROVISIONING-ADDENDUM (Added 2026-05-18 — Wave 18b mining agent)

> **Three significant findings.** Two reverse my Vol 51 §2.3 inferences; one (MP-TT-04 missing) is a brand-new gap.

### Finding §1 — Provisioning is a THIN SKELETON, not a full FSM service

**Was inferred:** Provisioning is "the service-state owner with full lifecycle handlers — Activate/Renew/Disable/Enable/DoPayment".

**Code says:** Only **two writes implemented** — `CreateAccountServices` + `ChangeVisibility` (App + CommChannel). **Every other lifecycle handler is ABSENT** as a command handler:
- Activate ❌
- Renew ❌
- Disable ❌
- Enable ❌
- DoPayment ❌
- DeletePending ❌

These actions appear in the `availableActions[]` FSM projection at `Domain/Entities/FalconService/FalconServiceBase.cs:42-75` — but only as **read-side display logic**, not as executable transitions. The FSM is **advertised** but **not enforced** at the Provisioning layer.

**Implication for Vol 51 §2.3:** The Kafka topic list for Provisioning-produced events (commchannel-activated/expired/disabled, application-activated/expired/disabled) **does not exist** in code. **No Kafka producers, no consumers, no background workers, no TTL/cron, no IHostedService** in Provisioning at all.

**Open Q-PROV-01:** Who drives the lifecycle transitions then? Most likely Commerce (CreateAccountServices comes from Commerce's account-creation flow) + Charging (when funding decisions land, they presumably trigger Provisioning writes via direct gRPC OR via Commerce coordinator). **Needs Wave 18a Commerce agent output to confirm.**

### Finding §2 — State enum is `eProductSubscriptionStatus`, not `eFalconServiceStatus`

**Was inferred:** `eFalconServiceStatus { None=0, Inactive=1, Active=2, Expired=3, Disabled=4 }`.

**Code says:** `eProductSubscriptionStatus { InActive=1, Paid=2, Active=3, Expired=4, Disabled=5 }`.

**Two important deltas:**
1. **No `None=0`** — the enum starts at 1 (InActive). Default-zero is not a valid state.
2. **`Paid=2` is dead code** — no switch case anywhere in Provisioning handles it. Likely a leftover from an earlier design where payment was Provisioning-side.

**Q-PROV-02:** Why is `Paid` defined if no code handles it? Should it be removed or wired up?

Action enum: `eFalconServiceAction { DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5 }` at `Domain/Constants/Enums .cs:3-42`.

**Q-PROV-03:** The filename `Enums .cs` has a **literal space** before `.cs`. That's a code-hygiene bug (will break import statements and might trip CI on some systems).

### Finding §3 — Marketplace tautology enforcement (Vol 44 §7 cross-validation)

**MP-TT-02 — Visibility is Falcon-controlled** → ✅ **ENFORCED**:
- `Domain/Services/Policies/ServicesActionsPolicy.cs:28-29` — visibility policy
- `[FalconOnly]` controller policy (presumably on the ChangeVisibility endpoint)
- `CanHide` + `CannotHideActiveService` invariant

**MP-TT-01 — Marketplace ↔ Org Hierarchy sync** → ✅ **ENFORCED** (Falcon-disable lock at policy line 17-20).

**MP-TT-03 — Pricing-Type/Value editable only by Falcon staff** → 🟡 **PARTIAL**:
- The Falcon-only filter exists at the policy level.
- But **price-change command handlers don't exist** — so the filter is defending against something that has no code path. The CLIENT BUG isn't possible because there's no endpoint to call.
- Once Commerce wires the price-change handlers, the Provisioning-side filter is positioned correctly.

**MP-TT-04 — Scheduled price change with effectiveDate** → ❌ **MISSING ENTIRELY**:
- No `effectiveDate` field on services in Provisioning.
- No scheduled-change projection.
- No background worker to flip pricing at the effective date.
- This is a **NEW HIGH-PRIORITY GAP** — BRD Vol 44 §7.4 documents this as a customer-visible feature.

**Q-PROV-04 (NEW HIGH):** Where will scheduled price changes be implemented — Commerce-side projection + Kafka-driven Provisioning update? Or Provisioning-side scheduler?

### Finding §4 — Mongo collections + dead modeling

**Database:** `FalconProvisioningDB`
**Collections:** `ApplicationServices` · `CommunicationChannelServices` · `Tenants` · `Lookups` · `LookupValues` · `ActivityLogs`
**Naming convention:** `typeof(T).Name + "s"` at `Infrastructure/Persistence/Repositories/MongoRepository.cs:17` (the trailing `s` is appended automatically).

**Dead modeling:**
- `StatusHistory[]` field on FalconServiceBase entities — **never written** by any code path.
- `ActivityLog` collection — exists in Mongo but **never written** either.

**Q-PROV-05:** Should `StatusHistory` and `ActivityLog` be wired up, or removed from the entity model?

### Finding §5 — Visibility flag enforcement code path (refines Vol 44 §7 MP-TT-02)

The visibility flag is changed via the `ChangeVisibility` endpoint, gated by:
1. `[FalconOnly]` attribute on the controller (PES enforcement).
2. `CannotHideActiveService` invariant — visibility cannot be hidden if the service is Active.
3. `CanHide` invariant — service must be in a hide-eligible state.

**Implication for Vol 48 (Marketplace Falcon view):** A Falcon user trying to hide an Active CommChannel will get a domain-error. The UI should disable the toggle in that state.

### Updated open questions (post-Wave 18b)

| ID | Status | Note |
|---|---|---|
| Q-PROV-01 | 🟡 NEW | Who drives Provisioning lifecycle transitions? (depends on Wave 18a Commerce answer) |
| Q-PROV-02 | 🟡 NEW | `eProductSubscriptionStatus.Paid` — wire up or remove? |
| Q-PROV-03 | 🟡 NEW | Filename `Enums .cs` literal space — hygiene fix |
| Q-PROV-04 | 🔴 HIGH | MP-TT-04 scheduled price change — entirely missing |
| Q-PROV-05 | 🟡 NEW | `StatusHistory[]` + `ActivityLog` modeled but unwritten — wire up or remove |
| Q-PROV-06 | 🟡 NEW | Activate/Renew/Disable/Enable/DoPayment/DeletePending handlers — 6 unimplemented commands |

### Code citations added

| Concept | File:line |
|---|---|
| Service state enum | [CODE] `eProductSubscriptionStatus { InActive=1, Paid=2, Active=3, Expired=4, Disabled=5 }` in `Domain/Constants/Enums .cs:3-42` |
| Action enum | [CODE] `eFalconServiceAction { DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5 }` (same file) |
| availableActions FSM (read-side only) | [CODE] `Domain/Entities/FalconService/FalconServiceBase.cs:42-75` |
| Visibility policy | [CODE] `Domain/Services/Policies/ServicesActionsPolicy.cs:28-29` |
| Falcon-disable lock | [CODE] `Domain/Services/Policies/ServicesActionsPolicy.cs:17-20` |
| Mongo repo collection naming | [CODE] `Infrastructure/Persistence/Repositories/MongoRepository.cs:17` |



---

## §V51-COMMERCE-ADDENDUM (Added 2026-05-18 — Wave 18a mining agent)

> **6 significant corrections + new code-verified knowledge.** The biggest reversal: Commerce has **NO outbox, NO inbox** — by deliberate team decision, not by omission.

### Correction §1 — NO outbox/inbox pattern (REVERSES Vol 51 §3)

**Was inferred:** "Commerce uses transactional outbox for cross-BC events; inbox for consumer dedup."

**Code says:** **Commerce explicitly does NOT use outbox or inbox.** The decision is documented in `ContractLifecycleProcess.cs:221-222`: the team chose **replayable events + idempotent consumers** instead.

**Why this is a valid alternative:**
- Outbox solves the 2-write problem (DB commit + Kafka publish in different txns).
- Idempotent-consumers approach solves the same problem differently: the **producer is idempotent** (Kafka Producer with `enable.idempotence=true`) AND the **consumer can replay** without side-effect duplication.
- The 5-minute Hangfire watermark replay sweep periodically re-publishes events to ensure all consumers have caught up.

**Implication for Vol 51 §3:** The outbox pattern documented there is a **theoretical pattern**, NOT how Commerce actually works. The Commerce reality is:
1. Producer publishes event immediately after DB commit (Kafka idempotent producer guarantees no duplicate).
2. If publish fails, Hangfire 5-min watermark replay catches it on the next sweep.
3. Consumers MUST be idempotent (handled per-service via deterministic keys, like Charging's `WalletMutationReceipt`).

**Q-SAGA-01 resolved:** No outbox collection — by design.
**Q-SAGA-02 resolved:** No inbox collection — consumers are idempotent without inbox dedup.
**Q-SAGA-03 resolved:** No shared outbox/inbox base class — pattern not used.
**Q-SAGA-04 resolved:** Hangfire 5-min watermark replay sweep — that's the resilience mechanism.

### Correction §2 — Kafka topic names (REPLACES Vol 51 §2.1 with actual names)

The Commerce-produced topics are versioned, namespaced, and Avro-encoded:

| Topic (actual) | Vol 51 §2.1 inferred name | Trigger |
|---|---|---|
| `commerce.wallet-configured.v1` | (not inferred) | Account wallet config persisted |
| `commerce.user-wallet-create.v1` | (not inferred) | User wallet needs to be created |
| `commerce.subnode-wallet-create.v1` | (not inferred) | Sub-node wallet creation |
| `commerce.comm-channel-shown.v1` | (visibility-changed inferred) | CommChannel visibility flipped |
| `commerce.order-created.v1` | (not inferred) | Order workflow starts |
| `commerce.contract-lifecycle.v1` | `contract-expiry-scheduled` (close) | Contract lifecycle event |
| `commerce.user-creation-requested.v1` | `user-creation-requested` ✅ | Admin creates user |
| `commerce.identity-settings-sync.v1` | `tenant-settings-updated` (close) | Tenant settings change |
| `commerce.tenant-ip-allowlist-changed.v1` | (not inferred) | IP allowlist update |

**Total Commerce-produced topics: 9** (Vol 51 §2.1 listed 13 — several were inferred, not real).

### Correction §3 — Single Commerce-consumed topic

Commerce consumes **ONE** topic: `charging.order-payment-processed.v1` (payment reconciliation back-channel).

This is much narrower than Vol 51 §2.2-§2.4 implied. Commerce is mostly a producer; it doesn't react to many cross-BC events.

### New Knowledge §1 — Avro + Schema Registry (resolves Q-SAGA-09)

Events use **Avro** with **Confluent Schema Registry**. Every payload carries an `EventContext` with correlation/causation info. The schema-evolution discipline is handled at registry level.

**Q-SAGA-09 resolved:** Avro, not JSON Schema.

### New Knowledge §2 — Three "saga-lite" orchestrators

Commerce uses **saga-lite** patterns (not full distributed sagas with compensation handlers):

| Orchestrator | File | Concern |
|---|---|---|
| `CreateMainNodeProcess` | (in Commerce) | Multi-step account/node setup |
| `CompleteFalconServicePaymentProcess` | (in Commerce) | Payment completion workflow |
| `ContractLifecycleProcess` | (in Commerce) | Contract state transitions + expiry |

These are **single-service orchestrators** — they coordinate within Commerce + emit events to other services, but they don't directly compensate when a downstream service fails. Compensation is via **replay** (event re-fires).

### New Knowledge §3 — Custom `IHandler.ExecuteAsync` (NOT MediatR)

Commerce uses a **custom command dispatch** pattern via `I*Handler.ExecuteAsync` interfaces — NOT MediatR. This is a project-specific abstraction.

**Implication:** Adding new commands requires implementing the interface, not just decorating with MediatR attributes. PR reviewers should check the interface conformance.

### New Knowledge §4 — Zero authored FluentValidation validators

FluentValidation is wired into the pipeline but **NO validators are authored**. Validation enforcement happens elsewhere:
- **Domain factories** — `Node.Create(...)`, `Tenant.Create(...)`, etc. throw on invalid input.
- **`ThrowIf*` attributes** — annotation-driven validation on entity properties.
- **Handler `_currentUser.UserType` checks** — handler-layer user-type guards.

**Q-VAL-01 (NEW):** Why is FluentValidation wired but not used? Should it be removed (dead infrastructure) or should validators be authored?

### New Knowledge §5 — Gateway behavior

| Concern | Core Gateway | System Gateway |
|---|---|---|
| Audience | Client (AO/NA/NU) | Falcon staff |
| Auth policy | `ClientOnly` | `FalconOnly` |
| Rate limiting | Per-tenant | (probably standard) |
| IP allowlist | Enforced via Redis projection populated from `commerce.tenant-ip-allowlist-changed.v1` Kafka events | (probably standard) |
| Routing | YARP proxy `/commerce/*` → Commerce `/api/*` | Same + FastEndpoints aggregation |
| Aggregation example | (none documented) | `GET /api/commerce/accounts/{Id}/hierarchy` — fan-in Commerce + Identity + Charging |
| Internal-service traffic | Bypasses gateway, direct HttpClient | Same |

**Confirms wiki rule (Vol 39 §): "Internal services NEVER call each other through gateways — use gRPC/Kafka directly."**

### New Knowledge §6 — Tenant invariant

**`Tenant.Id == MainNode.Id`** — the Tenant entity's ID is the same as the root Node's ID. There's no separate tenant ID. This is a deliberate model — one less concept, fewer joins, cleaner identity.

Implication for Vol 47 / Vol 50: When you see `subject = u:<userId>@<tenant-namespace>`, the `<tenant-namespace>` IS the MainNode's ID.

### Correction §4 — Commerce service location

The agent found Commerce at `C:\Falcon\Falcon\falcon-core-commerce-svc` (note the **nested `Falcon\Falcon`** path — important for grep / glob).

### New Knowledge §7 — 7 internal bounded contexts within Commerce

Commerce service is itself partitioned into 7 internal bounded contexts:
1. **Node** (dominant aggregate at `Domain/Entities/Node/Node.cs:11`)
2. Tenant
3. Settings
4. Order
5. Contract
6. Application catalog
7. CommChannel catalog

These are internal-only — not separate services, but separate aggregates with their own consistency boundaries within the Commerce service.

### Updated open questions (post-Wave 18a)

| ID | Status | Note |
|---|---|---|
| Q-SAGA-01 | ✅ RESOLVED | No outbox by design |
| Q-SAGA-02 | ✅ RESOLVED | No inbox by design |
| Q-SAGA-03 | ✅ RESOLVED | Pattern not used |
| Q-SAGA-04 | ✅ RESOLVED | Hangfire 5-min watermark replay |
| Q-SAGA-09 | ✅ RESOLVED | Avro + Confluent Schema Registry |
| Q-VAL-01 (NEW) | 🟡 OPEN | Why FluentValidation wired but unused? |
| Q-SAGA-11 (NEW) | 🟡 OPEN | Test the watermark-replay behavior — what's the SLA? |

### Code citations added

| Concept | File:line |
|---|---|
| Node aggregate | [CODE] `Domain/Entities/Node/Node.cs:11` |
| Replayable-event design decision | [CODE] `ContractLifecycleProcess.cs:221-222` |
| ServiceOperationResult wrapper | [CODE] `Api/Common/ServiceOperationResult.cs:3` |
| MultiLanguageName | [CODE] `Domain/Entities/Node/MultiLanguageName.cs:7` |
| Custom IHandler.ExecuteAsync (no MediatR) | [CODE] custom command dispatch |
| Saga-lite orchestrators | [CODE] `CreateMainNodeProcess`, `CompleteFalconServicePaymentProcess`, `ContractLifecycleProcess` |
| Hangfire watermark replay | [CODE] 5-min sweep schedule |



---

## §V51-GATEWAYS-ADDENDUM (Added 2026-05-18 — Wave 24 mining agent)

> **6 findings.** One CONFIRMS Wave 18a (Core Gateway IP allowlist via Redis projection). Two REFINE the prior service-topology picture. Three surface NEW gaps in observability/resilience/rate-limit.

### Confirmation §1 — Core Gateway IP allowlist defense-in-depth (CONFIRMS Wave 18a)

**Code says:** Core Gateway enforces IP allowlist via `TenantIpAllowlistMiddleware` (`:19-230`) using:
- **HybridCache** keyed `tenant:{tenantId}:ipAllowlist:v1` (FalconKeys.cs:23) — L1 in-memory + L2 Redis.
- **Seeded at boot** by `IpAllowlistSeedingService` calling `GET commerce/security/ip-allowlists`.
- **Kept in sync** by `TenantIpAllowlistChangedConsumer` consuming Kafka topic `commerce.tenant-ip-allowlist-changed.v1`.

**Defense-in-depth reconciliation with Wave 23:**

| Layer | Where | Coverage |
|---|---|---|
| Layer 1 — **Core Gateway** broad enforcement | `TenantIpAllowlistMiddleware` | All proxied routes (commerce/provisioning/charging/contactgroup/identity catchall) |
| Layer 2 — **Identity-side** explicit opt-in | `IpAllowlistGuard.cs` + `IpAllowlistPreProcessor.cs` | Login + ForgotPassword + ResendOtp + VerifyOtp |

**This re-frames the Wave 23 security gap concern (Q-IDENTITY-03):**
- If a request reaches Identity via Core Gateway → IP allowlist is enforced at gateway layer. Refresh-token IS protected.
- If a request reaches Identity directly (bypassing Core Gateway, e.g., internal service-to-service call via gRPC or direct HttpClient per Wave 18a) → only the 4 opted-in endpoints are gated, refresh-token NOT.

**Severity update:** Q-IDENTITY-03 demoted from HIGH to MEDIUM — defense-in-depth holds at the public-API surface. The Identity-side gap only matters for internal-service abuse scenarios (which require already-compromised internal credentials).

### Refinement §2 — Auth + JWT (CLARIFIES Vol 51 §1.2)

**Code says:**
- Identical Zitadel JWT Bearer wiring on both gateways.
- `ClientOnly` / `FalconOnly` policies are **claim-based on Zitadel-metadata `user-type`** (Client=2, Falcon=1) — decoded by `ZitadelClaimsTransformation` (Wave 23 cross-ref).
- System Gateway accepts **multiple ValidIssuers**, Core Gateway accepts a single issuer.
- **PES is NOT enforced at the gateway** — only `user-type` gating. PES happens at the backend service layer.

**Implication:** The gateway authorizes by tier (Falcon vs Client), and the backend service authorizes by PES key. Two-layer authorization.

### Refinement §3 — Core Gateway route map

6 routes at port 7038, all under `PerTenant` rate limit:
1. `/commerce/*` → Commerce service
2. `/provisioning/*` → Provisioning service
3. `/charging/*` → Charging service
4. `/contactgroup/*` → Contact Group service (or routed via Commerce?)
5. `/identity/auth/*` (Order=0, **Anonymous**) → Identity auth endpoints
6. `/identity/*` catchall (Order=1, **ClientOnly**) → Identity other endpoints

### Refinement §4 — System Gateway route map

5 routes at port 7256, all `FalconOnly`, **NO rate limit**, **NO anonymous bypass**:
1. `/commerce/*`
2. `/provisioning/*`
3. `/charging/*`
4. `/identity/*`
5. `/contactgroup/*`

Plus 12 aggregation endpoints (FastEndpoints).

### Refinement §5 — Aggregation endpoints inventory

**Core Gateway (3 aggregations):**
- `GET /api/commerce/accounts/{Id}/hierarchy` (tenant from JWT)
- 2 contract endpoints

**System Gateway (12 aggregations):**
- `GET /api/commerce/accounts/{Id}/hierarchy` — tenant from Commerce response body (admins have NO tenant claim — important detail)
- 11 `/api/testing/charging/*` BFF endpoints — gated by `Settings.TestingCharging.Enabled` flag (testing/dev-only)

**JWT forwarding:** `JwtForwardingHandler` DelegatingHandler.

**Header anti-spoofing:** YARP transforms strip + re-inject `X-Tenant-Id` / `X-Correlation-Id` so clients can't spoof them.

**Response handling:**
- YARP proxy routes pass `ServiceOperationResult<T>` body through verbatim.
- Aggregation endpoints re-wrap via `HttpResponseHandler.HandleResponseAsync<T>` at file `:33-77`.

### ⚠️ GAP §6 — NO OpenTelemetry / Application Insights (HIGH observability)

**Found:** Neither gateway is wired with OpenTelemetry, Application Insights, Datadog, or any APM. Only Serilog console + correlation-id propagation.

**Implication:**
- No distributed tracing.
- No request latency histograms.
- No dependency map of cross-service calls.
- Investigations rely on grep-ing Serilog logs across services with correlation-id — error-prone at scale.

**Q-GW-01 (NEW MED):** Wire OpenTelemetry on both gateways. Forward traces to a collector (Tempo / Jaeger / cloud-vendor). Add metrics (RED — Rate/Errors/Duration).

### ⚠️ GAP §7 — `/health/ready` has no custom checks

**Found:** The `/health/ready` endpoint exists but doesn't probe Redis (HybridCache L2) or Kafka. So Kubernetes (or whatever orchestrator) sees the gateway as "ready" even when Redis or Kafka is unavailable.

**Implication:**
- During Redis outage, IP allowlist defaults to denial (or stale cache) — but the gateway still accepts traffic.
- During Kafka outage, the IP allowlist consumer can't update — stale data goes unnoticed.

**Q-GW-02 (NEW MED):** Add health checks for Redis + Kafka. `/health/ready` should fail when critical dependencies are degraded.

### ⚠️ GAP §8 — Inconsistent resilience (System Gateway has it, Core doesn't)

**Found:** System Gateway uses `AddStandardResilienceHandler` (Microsoft.Extensions.Http.Resilience). **Core Gateway does NOT.**

**Implication:**
- Transient backend failures handled differently per gateway.
- Client-facing requests (Core) lack retry/circuit-breaker — Falcon-admin requests (System) have them.

**Q-GW-03 (NEW MED):** Add `AddStandardResilienceHandler` to Core Gateway. Verify the policies are aligned.

### ⚠️ GAP §9 — Anonymous `/identity/auth/*` has NO rate limit

**Found:** Core Gateway's Order=0 Anonymous route for `/identity/auth/*` is NOT subject to the `PerTenant` rate limiter (because the rate limiter keys by tenant, and anonymous requests have no tenant yet).

**Implication:**
- Login endpoint can be brute-forced from a single IP without gateway-level rate limit (Identity-side might also lack rate limit per Wave 23).
- Forgot-password endpoint can be enumerated.
- OTP-resend can be spammed (cost = SMS/WA per request).

**Severity: HIGH** for OTP-resend spam (real money cost per request).

**Q-GW-04 (NEW HIGH):** Add IP-based rate limiting (separate from tenant-based) to the anonymous identity routes. Especially for OTP-resend.

### New Knowledge §10 — Rate limit specifics

- Algorithm: **sliding window**.
- Default: **100 requests / 60 seconds per tenant**.
- **No tier differentiation** — trial accounts get the same as enterprise.

**Q-GW-05 (NEW LOW):** Should rate limits be per-tier? Trial gets 60/60s; Pro gets 300/60s; Enterprise gets 1000/60s?

### New Knowledge §11 — CORS

Both gateways read `Cors:AllowedOrigins[]` config with:
- `AllowCredentials`
- `AllowAnyMethod`
- `AllowAnyHeader`

This is permissive within the allowed-origin list. Be cautious about adding new origins.

### Status of Q-* questions after Wave 24

| ID | Status | Resolution |
|---|---|---|
| Q-IDENTITY-03 | 🟡 RE-CLASSIFIED MED | Defense-in-depth holds at public surface; gap only applies to direct internal-service calls |
| Q-GW-01 (NEW MED) | 🟡 OPEN | No OpenTelemetry/APM |
| Q-GW-02 (NEW MED) | 🟡 OPEN | /health/ready missing custom checks |
| Q-GW-03 (NEW MED) | 🟡 OPEN | Core Gateway lacks `AddStandardResilienceHandler` |
| Q-GW-04 (NEW HIGH) | 🔴 OPEN | Anonymous auth routes no rate limit — OTP-spam exposure |
| Q-GW-05 (NEW LOW) | 🟡 OPEN | Per-tier rate limit |

### Code citations added

| Concept | File:line |
|---|---|
| TenantIpAllowlistMiddleware | [CODE] `TenantIpAllowlistMiddleware:19-230` |
| HybridCache key | [CODE] `FalconKeys.cs:23` — `tenant:{tenantId}:ipAllowlist:v1` |
| IP allowlist seeder | [CODE] `IpAllowlistSeedingService` |
| IP allowlist Kafka consumer | [CODE] `TenantIpAllowlistChangedConsumer` consuming `commerce.tenant-ip-allowlist-changed.v1` |
| JWT forwarder | [CODE] `JwtForwardingHandler` DelegatingHandler |
| Response re-wrapper | [CODE] `HttpResponseHandler.HandleResponseAsync<T>:33-77` |

