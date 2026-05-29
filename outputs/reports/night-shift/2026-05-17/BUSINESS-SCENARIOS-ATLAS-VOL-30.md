---
type: business-scenarios-atlas
volume: 30
title: "Falcon Business Scenarios Atlas — Volume 30: Cross-Module State Cascades (When X Happens, What Fires)"
purpose: "Every state change in Falcon triggers cascades across multiple modules. This volume maps every event to its complete cascade. The 'what happens next' reference."
volume-30-cascades: 15
---

# Falcon Business Scenarios Atlas — Volume 30: Cross-Module Cascades

> A user clicks a button. Or a date passes. What downstream effects fire? This volume maps all 15 critical cascade chains in Falcon.

---

## CASCADE FORMAT (used throughout)

Each cascade documented as:
- **Trigger** (what kicks it off)
- **Synchronous chain** (immediate; blocks the caller)
- **Async chain** (Kafka events; happens in background)
- **End state** (what's true after the cascade settles)
- **Failure modes** (where it can go wrong + how)

---

## CASCADE 1 — User Created (PEN status)

**Trigger:** Admin clicks "Create User" in wizard → POST `identity/api/user/`

### Synchronous chain
```
Identity Service
├── Validate request (username unique? format? email valid? etc.)
├── Pre-flight: maxNormalUserLimit check (for role=NormalUser)
├── Create Zitadel user (via OIDC)
├── Insert User record in Mongo (status=Pending)
├── Insert UserStatusHistory row (PEN, actorId, timestamp)
├── If deliveryMethod = Email/Both: send credentials email
├── If deliveryMethod = Sms/Both: send credentials SMS
└── Return UserResponse
```

### Async chain
```
Identity → Kafka topic UserCreated event
  ├── Commerce consumes → updates tenant user count cache
  ├── Charging consumes → may create wallet records (if topology demands)
  └── (other consumers if any)
```

### End state
- User exists in Zitadel + Mongo, status = Pending
- UserStatusHistory has creation entry
- Credentials delivered
- Tenant user counts updated downstream

### Failure modes
| Failure | Behavior |
|---|---|
| Username already exists | Identity returns 409; nothing created |
| maxNormalUserLimit exceeded | Identity returns 403; nothing created |
| Zitadel unavailable | Identity returns 503; Mongo write rolled back |
| Email delivery fails | User created but credentials not delivered → support ticket |
| Kafka publish fails | User created in DB but downstream count stale → reconciliation script needed |

---

## CASCADE 2 — User First Login Completed (PEN → ACT)

**Trigger:** User submits new password via `POST /api/auth/first-login`

### Synchronous chain
```
Identity Service
├── Validate session (matches sessionId issued at OTP verify)
├── Validate password complexity (per Account's passwordSecurityLevel)
├── Update Zitadel password
├── Update Identity Mongo User.status = Active
├── Insert UserStatusHistory row (PEN → ACT)
├── Force-logout-all-sessions (BR-UM-35) — no other sessions to logout but consistent behavior
├── Issue JWT tokens
└── Return tokens + redirect URL
```

### Async chain
```
Identity → Kafka UserStatusChanged event
  └── Commerce consumes → updates active user count
```

### End state
- User.status = Active
- Tokens issued; user logged in
- Audit trail has transition entry

### Failure modes
| Failure | Behavior |
|---|---|
| Password doesn't meet complexity | Reject; user retries |
| Session expired | Reject; user must redo login flow |
| Zitadel update fails | Identity rolls back Mongo write |

---

## CASCADE 3 — User Suspended (ACT → SUS)

**Trigger:** Admin via PUT `identity/api/user/status` with status=Suspended

### Synchronous chain
```
Identity Service
├── Validate transition is allowed for this role+status
├── Update User.status = Suspended
├── Insert UserStatusHistory row
└── Return
```

### Async chain
```
Identity → Kafka UserStatusChanged
  ├── Active sessions: tokens REMAIN VALID until expiry (~30 min)
  └── PES authorize: should re-check User.status on every action (defense-in-depth)
```

### End state
- User.status = Suspended
- Existing JWTs still valid up to 30 min (idle timeout)
- User cannot log in fresh (Failed stage in next login attempt)

### Failure modes / risks
- **30-min vulnerability window**: suspended user could continue acting until JWT expires
- Mitigation: force-logout-all-sessions on status change (currently NOT implemented; recommend adding)

---

## CASCADE 4 — User Locked (ACT → LCK) — system-driven

**Trigger:** Zitadel detects 3 failed login attempts → fires webhook to Falcon Identity

### Synchronous chain (at Zitadel)
```
Zitadel
├── Detect 3rd failed attempt
├── Mark user as Locked internally
├── Fire webhook POST /api/webhook/zitadel with UserLocked event
```

### Synchronous chain (at Falcon Identity)
```
WebhookController
├── Verify HMAC signature (currently non-constant-time — Wave 5b finding)
├── Identify event type (UserLocked)
├── Update Mongo User.status = Locked
├── Insert UserStatusHistory row
└── Return 200 OK to Zitadel
```

### Async chain
```
Identity → Kafka UserStatusChanged event
  └── Downstream consumers update caches
```

### End state
- User.status = Locked
- Subsequent login attempts fail at Credentials stage (Failed)
- User must request unlock from Falcon admin (LCK → PEN by Falcon-only)

### Failure modes
- **Webhook delivery delay**: User locked in Zitadel but Falcon DB not updated → user could still get authorized for 30 min via existing JWT
- **HMAC timing attack** (Wave 5b): theoretically attacker could forge UserLocked events; mitigated by network-internal hosting

---

## CASCADE 5 — Account Created (Add Client wizard finalize)

**Trigger:** Falcon admin clicks Finish on Step 5 of Add Client wizard

### Synchronous chain (multi-service orchestration)
```
Commerce: POST commerce/Node (CreateMainNode)
├── Insert Node (type=Main) → nodeId
├── Insert Account record
├── Insert AccountSettings record
├── Insert WalletTypeConfig record (defaults if not specified)
└── Return accountId + nodeId

Commerce: POST commerce/Setting (initial settings if non-default)

Commerce: POST commerce/node/comm-channel/visibility (per visible CommChannel in Step 3)
├── For each CommChannelConfig:
│   ├── Insert CommChannelConfig (status=InActive-First-time)
│   └── Update visibility=Show + pricingType + priceValueSar

Commerce: POST commerce/node/application/visibility (per visible App in Step 4)
├── Same pattern as CommChannels

Identity: POST identity/api/user (Step 5 Account Owner)
├── Create AO user as in CASCADE 1
```

### Async chain
```
Commerce → Kafka AccountCreated event
  ├── Charging consumes → initializes wallet structure per WalletTypeConfig
  ├── Provisioning consumes → mirrors initial CommChannelConfig + AppConfig state
  └── Identity consumes → tenant linkage update

Identity → Kafka UserCreated event (for the AO user)
  └── (same as CASCADE 1)
```

### End state
- Account record exists, tenant created
- CommChannelConfigs + AppConfigs in InActive state
- AO User exists in Pending status
- Credentials delivered to AO
- Wallet topology initialized

### Failure modes (partial-failure handling)
| Failure point | Behavior |
|---|---|
| Step 5 AO creation fails after Account created | Per BR-AM-19 / F-015: PRESERVE wizard state, show "Account created but Account Owner creation failed — contact support" — DO NOT auto-rollback the Account |
| CommChannel/App config write fails | Account exists without channel config; manual cleanup needed |
| Kafka publish fails on AccountCreated | Account exists but downstream services unaware → reconciliation script needed |

---

## CASCADE 6 — Contract Activated (PEN → ACT)

**Trigger:** Background scheduler detects `Contract.startDate ≤ now` AND status=Pending

### Synchronous chain
```
Background Job (Commerce)
├── Query: contracts where startDate ≤ now AND status = Pending
├── For each:
│   ├── Update Contract.status = Active
│   └── Publish Kafka ContractActivated event
```

### Async chain
```
Charging consumes ContractActivated
├── Create WalletRecord rows with valueSar from contract
├── Tag each with contractId
└── These records now contribute to Master Wallet lump-sum (BR-AM-35)

Commerce consumes (its own event for cache invalidation)
└── Refreshes any cached "Active contracts per account" data
```

### End state
- Contract.status = Active
- Master Wallet lump-sum increased by `contract.valueSar`
- Account can now send transactions against this contract

### Failure modes
- Job failure: contract stuck in Pending past startDate → manual flip + notification

---

## CASCADE 7 — Contract Expired (ACT → EXP)

**Trigger:** Background scheduler detects `Contract.expirationDate ≤ now` AND status=Active

### Synchronous chain
```
Background Job (Commerce)
├── Update Contract.status = Expired
└── Publish Kafka ContractExpired event
```

### Async chain
```
Charging consumes
├── Mark WalletRecords for this contract as "expired" (not deleted)
├── Recompute all wallet lump-sums (BR-CC-38) — records excluded from sums
└── Master Wallet displayed balance drops by contract's remaining value

Commerce consumes
├── For each CommChannelConfig that depended on this contract's wallet:
│   ├── At their next renewDate: attempt deduction from Master Wallet
│   ├── If insufficient: status flips Active → Expired → enters grace period
│   └── (cascade chains further through CommChannel grace logic)
```

### End state
- Contract.status = Expired
- Wallet records retained for audit (BR-CC-38)
- Wallet lump-sums updated
- Any CommChannel funded primarily by this contract may enter grace/expire on its renewDate

### Failure modes
- Race condition on lump-sum recalculation: brief window where balance is inconsistent across services (eventual consistency)

---

## CASCADE 8 — Contract Extended (EXP → ACT)

**Trigger:** Falcon admin edits Contract.expirationDate to future date

### Synchronous chain
```
Commerce
├── Validate new expirationDate > now AND > startDate
├── Update Contract.expirationDate
├── Update Contract.status = Active (per BR-CC-17)
└── Publish Kafka ContractExtended event
```

### Async chain
```
Charging consumes
├── Restore the contract's WalletRecords to the lump-sums (BR-CC-17)
└── Master Wallet displayed balance increases back
```

### End state
- Contract.status = Active again
- Wallet records re-enter lump-sums
- Any dependent CommChannel can resume normal renewal if Master has funds

---

## CASCADE 9 — Do Payment on CommChannel

**Trigger:** AO or Falcon clicks Do Payment in Settings → CommChannels tab

### Synchronous chain
```
Commerce POST commerce/Node/{nodeId}/comm-channel/{id}/payment
├── Create Order record (orderId, status=Pending)
├── Publish Kafka CommChannelPaymentRequested event
└── Return orderId to FE
```

### Async chain
```
Charging consumes
├── Identify wallet to debit per WalletTypeConfig
├── Deduct cost from nearest-expiring Active contract's WalletRecord
├── Tag deduction with contractId (BR-AM-36)
├── Publish Kafka CommChannelPaymentCompleted event (or *Failed)

Commerce consumes
├── On Completed: update CommChannelConfig
│   ├── status = Paid → (settlement period) → Active
│   ├── set firstActivationDate (if first ever)
│   ├── set activationDate
│   └── calculate renewDate per pricingType
└── Publish Kafka CommChannelStatusChanged event

Provisioning consumes
└── Mirror new status in its read-mirror DB
```

### FE polling chain (concurrent)
```
FE SimplePollService
├── GET order/{orderId}/status every 2 seconds
├── Continue until status=Completed/Failed OR 30 min timeout
└── Show success toast OR failure dialog
```

### End state
- CommChannelConfig.status = Active
- Wallet balance reduced
- Audit trail has charge entry tagged with contractId
- Order.status = Completed

### Failure modes
| Failure | UI dialog |
|---|---|
| Insufficient balance | `<insufficient-balance-warning-dialog>` |
| Wallet not configured | `<insufficient-balance-warning-dialog>` (WalletNotConfigForTheNode) |
| Priority order conflict | `<insufficient-balance-priority-dialog>` (drag-drop reorder) |
| 30-min poll timeout | Generic error; order may still complete |

---

## CASCADE 10 — Send Transaction (per-message cost flow)

**Trigger:** NU sends message via Application

### Synchronous chain (per recipient)
```
Application → Charging (Send Transaction API)
├── Pre-flight checks (Matrix 9 in Vol 28)
├── Identify wallet to debit
├── Lookup Contract Detail cell (Application × CommChannel × Priority × Destination)
├── For each contract (nearest-expiring first):
│   ├── Deduct from WalletRecord
│   ├── Tag with contractId
│   └── Continue until cost satisfied
├── Update wallet balance(s)
└── Dispatch message via CommChannel provider (Meta API for WhatsApp, etc.)
```

### Async chain
```
Charging → Kafka TransactionCompleted (or *Failed) event
  ├── Audit log update
  └── (potentially) downstream analytics
```

### End state
- WalletRecord(s) debited
- Contract.remainingValueSar updated
- Message dispatched (delivery confirmation comes later via provider webhook)

---

## CASCADE 11 — Wallet Transfer (between wallets)

**Trigger:** Authorized actor initiates transfer in Wallet & Balance Mng page

### Synchronous chain
```
Charging POST charging/wallet/transfer
├── Validate transfer permissions (Matrix 5 in Vol 28)
├── Validate amount ≤ Balance Transfer Limit % cap (BR-AM-34)
├── Validate source has sufficient balance
├── Identify nearest-expiring WalletRecords in source
├── For each:
│   ├── Decrement source's record
│   ├── Create destination's record (inheriting contractId)
│   └── Continue until amount satisfied
├── Insert TransferTx row (audit)
└── Return success
```

### End state
- Source wallet decreased
- Destination wallet increased
- ContractId(s) preserved through the transfer (BR-CC-35)
- TransferTx row has full audit info (actor, src, dst, amount, contractIds[])

---

## CASCADE 12 — Account Deletion (Falcon-only)

**Trigger:** Falcon admin initiates account closure (operational; not in formal PRD)

### Synchronous chain (likely sequence)
```
Commerce
├── Mark Account.status = SoftDeleted (or equivalent flag)
├── For each Active Contract: edit expirationDate to today → flip to Expired
├── For each CommChannelConfig: status → Disabled
└── Publish multiple Kafka events (AccountDeleted + ContractExpired + CommChannelDisabled)

Identity
├── For each User in this account: status → Deleted (soft)
├── Force-logout-all-sessions
└── (users can no longer log in)

Charging
└── Wallet records retained (audit) but no further activity possible
```

### End state
- Client cannot log in or use Falcon
- All data retained for audit/regulatory
- Falcon-only restore via reversing each step

---

## CASCADE 13 — Wallet Topology Changed (rare; Falcon-only)

**Trigger:** Falcon admin updates WalletTypeConfig (e.g., User-based → Node-based)

### Synchronous chain (complex; not in current PRD if it's even allowed)
```
Commerce + Charging
├── This is essentially a wallet migration — non-trivial
├── For each existing wallet record:
│   ├── Map to new topology's wallet structure
│   ├── Migrate the balance
│   └── Preserve contractId tags
├── Create new wallet structure if needed
└── Update WalletTypeConfig record
```

### End state
- New topology in effect
- Audit trail preserved
- ⚠ **This is a one-way door operationally — rarely done; recommend per onboarding**

### Failure modes
- Mid-migration failure leaves inconsistent state
- Strongly recommended: do this via maintenance window with full backup

---

## CASCADE 14 — Permission Group Changed Mid-Session

**Trigger:** Admin updates User.permissionGroupId

### Synchronous chain
```
Identity
├── Update User.permissionGroupId
└── Return success
```

### Async chain
```
[INFERRED based on Vol 5]
PES rule re-evaluation on next authorize check
└── Within ~ms-seconds, new permissions in effect at backend
```

### End state
- Backend authorization reflects new permissions immediately
- Frontend cached "authorize/resources" response may be stale up to page refresh
- User in stale state sees old buttons but actions are denied at backend

### Mitigation
- Push notification to user (banner) — currently not implemented
- Force-logout-on-PermissionGroup-change for high-stakes changes — recommended

---

## CASCADE 15 — Template Created → Approved → Used

**Trigger:** Maker creates a WhatsApp template (when Template entity API exists; today GAP-T-001)

### Future-state cascade (when built)
```
Maker → Templates Service
├── Create Template record (status=Draft)
├── Return templateId

Maker submits
├── Update Template.status = Pending
├── If internal Checker exists: notify Checker
└── If no internal config: proceed directly to Meta

Checker approves
├── Update Template.status = Pending (waiting Meta)
└── Submit to Meta API

Meta approves
├── Webhook to Templates Service
├── Update Template.metaState = Active-Quality-Pending
└── Status = Approved

Meta quality drift (Pause)
├── Webhook
├── Update Template.metaState = Paused
└── Status remains Approved but isUsable = false

Send Transaction tries to use Template
├── Check Template.status = Approved
├── Check Template.metaState ∈ {Quality pending, High, Medium, Low}
└── If both true: proceed; else reject
```

### Current state
- Template CRUD endpoints DO NOT EXIST (GAP-T-001)
- The above cascade is design-stage only

---

## Continuous mining queue update

Volumes 1-30 = 163 entries.

Remaining:
- Vol 31: Error × Cause × Recovery matrix
- Future: per-error mapping with mitigation

---

*Falcon Brain Forever-Wave · Vol 30 (Cross-Module Cascades) written 2026-05-18 · 15 cascades documented end-to-end.*
