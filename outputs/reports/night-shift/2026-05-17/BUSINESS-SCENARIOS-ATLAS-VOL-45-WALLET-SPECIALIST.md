# Volume 45 — Wallet & Balance Management Specialist Guide

> **Specialist depth:** This volume converts Vol 44 §1-§2 (truth tautologies) into a working specialist mental model — every wallet topology, every action, every actor, every edge case, every reconciliation rule. Use this volume as the *operating manual* when designing, debugging, or auditing any money-movement code path.
>
> **Source-of-truth boundary:** All BRD-extracted facts have `[BRD-EXTRACTED]` provenance. Patterns inferred from the architecture are marked `[INFERRED]`. Cross-references are explicit.

---

## §1 — Wallet Universe Topology

### §1.1 The 7 Wallet Concepts

| # | Concept | Mode | Scope | Real Storage? | Notes |
|---|---|---|---|---|---|
| 1 | **Master Wallet (MW)** | both | per-account (root node) | **Abstract aggregate** of all active `WalletRecord` entries for the account | The "checkbook" of the entire account |
| 2 | **Node Wallet** | Single | per-node (sub-node) | concrete | Created when AO transfers MW → Node |
| 3 | **User Wallet** | Single | per-user | concrete | Created when AO/NA transfers Node/User → User |
| 4 | **CommChannel Wallet** | Multi | per-(account × CommChannel) | concrete | One per channel: WA-Auth-Wallet, WA-Util-Wallet, WA-Mark-Wallet, Voice-Wallet, etc. |
| 5 | **Per-User CommChannel Wallet** | Multi | per-(user × CommChannel) | concrete | User-side mirror of #4, one per channel per user |
| 6 | **Per-Node CommChannel Wallet** | Multi | per-(sub-node × CommChannel) | concrete | Node-side mirror of #4 |
| 7 | **Addons** | both | per-(contract × sub-service) | concrete | Allowance pool with own Activation + Expired dates |

> **Critical truth (MC-TT-04):** "Master Wallet" is NOT a single SAR-pot. It is a **per-contract aggregate** — every contract's funded amount tracked independently. When a worksheet shows `MW C#1 = 10.0` and `MW C#2 = 15.0`, those are **two distinct internal balances** under the MW abstraction.

### §1.2 Single-Wallet vs Multi-Wallet Mode

A client chooses ONE mode at account creation (and migration between modes is **not** supported in the current PRD).

| Aspect | Single Wallet | Multi Wallet |
|---|---|---|
| Wallet kinds | MW + Node + User | MW + CommChannel + (User/Node × CommChannel) |
| Spend granularity | One pot per actor | Channel-scoped budgets |
| Best for | Simple accounts, single-channel use cases | Channel-budget enforcement, compliance separation |
| Deduction order | MW → Addons (SubServices only) | MW → CommChannel wallet (priority-ordered) → Addons |
| Falcon-only power | Master ↔ Node/User Transfer | + **Master ↔ CommChannel** Transfer (Multi-only) |

### §1.3 ASCII topology diagrams

#### Single Wallet
```
                       ┌─────────────────┐
                       │  Master Wallet  │ (per-contract aggregate)
                       │  C#1: X SAR     │
                       │  C#2: Y SAR     │
                       └─────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
      ┌──────────┐        ┌──────────┐        ┌──────────┐
      │ Node A   │        │ Node B   │        │ Node C   │
      └──────────┘        └──────────┘        └──────────┘
            │                   │                   │
       ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
       ▼         ▼         ▼         ▼         ▼         ▼
     User1     User2     User3     User4     User5     User6

   Addons (per-contract, per-sub-service): orthogonal to the tree
```

#### Multi Wallet
```
                       ┌─────────────────┐
                       │  Master Wallet  │ (per-contract aggregate)
                       └─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  │ WA-Auth     │         │ WA-Util     │         │ WA-Mark     │  ← CommChannel wallets
  │ Wallet      │         │ Wallet      │         │ Wallet      │
  └─────────────┘         └─────────────┘         └─────────────┘
        │                       │                       │
   ┌────┴────┐             ┌────┴────┐             ┌────┴────┐
   ▼         ▼             ▼         ▼             ▼         ▼
 Node A    Node B        Node A    Node B        Node A    Node B
 WA-Auth   WA-Auth       WA-Util   WA-Util       WA-Mark   WA-Mark
   │         │
 User1.WA-Auth, User2.WA-Auth, ...
```

The **multiplicative blow-up** in Multi-Wallet (channels × hierarchy levels) is the reason CommChannel-wallet priority ordering exists — without it, drawing from the right pool would be ambiguous.

---

## §2 — The 5 Universal Actions

### §2.1 Master action table (refined from Vol 44 §1)

| # | Action | Who | Source pool | Target pool | Currency mover |
|---|---|---|---|---|---|
| 1 | **Charge** | T2 (Falcon admin) only | Contract value | Master Wallet | Adds SAR (per-contract) |
| 2 | **Transfer** | T2 + AO + NA (hierarchy-bounded) | Any wallet they control | Any wallet within scope | No SAR creation — moves between pools |
| 3 | **Deduct** | T2 (lifecycle) OR System (expiration) | Wallet | Sink (removed) | Permanently removes |
| 4 | **Purchase** | T2 + AO | MW (+ CommChnl in Multi mode) | Sink (paid to merchant — Falcon) | Pays for CommChannel activate/renew or Application purchase |
| 5 | **Consume Addons** | T2 + AO | Addons first, then MW (then CommChnl in Multi mode) | Sink | Pays for sub-services |

### §2.2 Why the actor list matters

The Vol 44 §1 matrix is not a "who's allowed by RBAC" — it's a **business authority** statement:
- A Normal User **doesn't have a transfer permission** because the BR model says NU has no money-movement authority beyond outgoing send transactions.
- The PES key `wallet.transfer.execute` will be issued to NA/AO/Falcon roles; granting it to NU would violate Vol 44 W-TT-01.
- The CG permission matrix (§5) gives the *creator* authority across roles — wallet authority is **role-only**, not creator-bound.

### §2.3 Concrete examples per action

#### Charge (T2 adds 100k SAR to client account via Contract C#1)
```
Operator action: SetContractCharged(contractId=C#1, value=100000)
Result:
  MW[Account=ACC, Contract=C#1] += 100000
  Ledger: { type: 'Charge', from: 'Contract:C#1', to: 'MW:ACC', amount: 100000, by: 'T2:user.id' }
```

#### Transfer (AO sends 10k from MW to Node-B)
```
Operator action: TransferBalance(from=MW, to=Node-B, amount=10000, contractHint=C#1)
Result:
  MW[ACC, C#1] -= 10000
  NodeWallet[Node-B, C#1] += 10000
  Ledger: { type: 'Transfer', from: 'MW:ACC:C#1', to: 'NodeWallet:Node-B:C#1', amount: 10000, by: 'AO:user.id' }
```
**Key tautology:** Contract identity is preserved through the transfer (MC-TT-05).

#### Deduct (system on contract expiration — drains all C#1 balances)
```
System trigger: ContractExpired(contractId=C#1)
Result:
  ∀ (wallet, balance) where wallet[*, C#1] > 0:
    wallet[*, C#1] -= balance
    Ledger: { type: 'ExpiredDeduct', from: wallet, contract: C#1, amount: balance, by: 'System' }
```
**Atomicity:** This is a SAGA — must be transactional or compensable. If any wallet write fails, the whole expiration deduction either rolls back or is retried until convergent.

#### Purchase (AO activates WA-Util CommChannel — 500 SAR)
```
Operator action: ActivateCommChannel(channel=WA-Util, fee=500)
Compute Needed = 500.
Single-Wallet mode:
  Step 1: Walk MW contracts by nearest-expiry.
  Step 2: For each contract c, take min(MW[c], 500 - taken).
  Step 3: If taken < 500 → ABORT (no partial activation).
Multi-Wallet mode:
  Step 1: Try MW first (same loop).
  Step 2: If MW < 500, fallback to WA-Util-Wallet (channel-specific).
  Step 3: ABORT if total < 500.
```

#### Consume Addons (AO triggers OTP verification — uses an OTP-Addons quota)
```
Operator action: ConsumeAddon(addonType=OTP-Verification, qty=1)
Step 1: Find Addons[*, type=OTP-Verification] with nearest-expiry, qty > 0.
Step 2: Decrement qty by 1.
Step 3: If no Addons left → fallback to MW LOOP at the price-per-OTP rate.
Step 4: ABORT if neither covers.
```

---

## §3 — Actor Authority Lattice

> A **lattice** (not a hierarchy) because authority intersects on actions, not on identity. An NU can spend their own wallet but cannot transfer; an AO can transfer but cannot charge; T2 can do everything except be a recipient.

### §3.1 Authority by action

```
                   Charge   Transfer   Deduct(lifecycle)   Purchase   Consume Addons
  Normal User        ✗         ✗              ✗              ✗            ✗     ← but CAN spend on send (Do Transaction)
  Node Admin         ✗      ✓ (subtree)       ✗              ✗            ✗
  Account Owner      ✗      ✓ (account)       ✗              ✓            ✓
  Falcon User (T2)   ✓      ✓ (cross-acct)    ✓              ✓            ✓
  System             ✗         ✗      ✓ (on expiration)      ✗            ✗
```

### §3.2 Falcon-User exclusive powers

Vol 44 W-TT-04 named **one** Falcon-exclusive power (Master ↔ CommChnl transfer). The full list of Falcon-only powers:

| Power | Why Falcon-only | BRD evidence |
|---|---|---|
| Charge (add balance from contract) | Money creation requires Falcon-side commercial action | Sheet 3 row 2038 — actor column shows only "T2" |
| Transfer Master ↔ CommChnl wallet | Cross-pool plumbing is operational, not commercial | Sheet 3 row 2066 — Falcon-only addition to AO list |
| Cross-account transfers | Multi-tenant boundary | Sheet 3 rows 2042, 2064 — "Falcon User across same account hierarchy" |
| Set CommChnl wallet priority for Falcon-User-initiated deductions | Operator-side override of client priority | Sheet 3 rows 2075, 2089 |
| Bypass account-level eligibility checks | n/a in BRD — INFERRED from operator-tier role | [INFERRED] |

### §3.3 NA authority bounding

Vol 44 W-TT-02: A Node Admin's authority is bounded by **his sub-hierarchy**, not the account. This means:
- NA on Node-B can transfer Node-B ↔ Node-B.User1, Node-B.User2 freely.
- NA on Node-B **cannot** transfer to/from Node-A, Node-C, or any User under Node-A.
- NA on Node-B **cannot** touch the Master Wallet (only AO/Falcon can).
- NA on Node-B **cannot** purchase CommChannels for the account (only AO).

Subtree-scoping is enforced at the **command-handler validation** level — the request's `targetNodeId` must be in `currentUser.adminScope.descendants()`.

---

## §4 — Multi-Contract Orchestration Deep-Dive

This section refines BR-CC-31 with all the edge cases.

### §4.1 Canonical algorithm

```
function ConsumeBalance(needed: Money, context: TransactionContext): FundingDecision {
    var remaining = needed;
    var sources = [];

    // Step 1: identify eligible contracts (sorted by NearestExpiry ASC)
    var eligibleContracts = ActiveContracts(context.account, context.commChannel)
        .OrderBy(c => c.ExpiresAt);

    // Step 2: walk contracts in expiry order
    foreach (var contract in eligibleContracts) {
        if (remaining == 0) break;

        var rate = contract.RatesFor(context.action);       // ← per-contract rate
        var availableBalance = MW[context.account, contract.id];

        if (availableBalance == 0) continue;

        // How much of the transaction can THIS contract fund?
        // remaining is denominated in "transaction units" (e.g. messages),
        // priced at THIS contract's rate.
        var fractionFundableByThisContract =
            Math.Min(1.0, availableBalance / (rate * remaining));

        var fundedHere = fractionFundableByThisContract * remaining;
        var costHere = fundedHere * rate;

        MW[context.account, contract.id] -= costHere;
        remaining -= fundedHere;
        sources.Add(new FundingSource {
            contractId = contract.id,
            unitsFunded = fundedHere,
            costPaid = costHere,
            rate = rate
        });
    }

    // Step 3: atomicity guard
    if (remaining > 0) {
        // Some fraction of the transaction is unfundable.
        // ABORT — no partial debit. Reverse all sources.
        foreach (var s in sources) {
            MW[context.account, s.contractId] += s.costPaid;
        }
        throw new FalconException(FalconError.InsufficientFunds);
    }

    // Step 4: return the funding decision (audit trail)
    return new FundingDecision { sources = sources, totalCost = sources.Sum(s => s.costPaid) };
}
```

### §4.2 Worked Example — Vol 44 §2.3 expanded

**Setup:**
- C#1 (older): WA-Mark rate = 1.5 SAR/msg, remaining balance = 1.25 SAR in Aramco wallet
- C#2 (newer): WA-Mark rate = 0.75 SAR/msg, remaining balance = 5.0 SAR in Aramco wallet
- Send 1 WA-Mark message — what gets deducted from which?

**Step-by-step:**

```
remaining = 1.0 message

Contract C#1 (nearest-expiry first):
  rate = 1.5 SAR/msg
  available = 1.25 SAR
  fraction = min(1.0, 1.25 / (1.5 * 1.0)) = min(1.0, 0.833...) = 0.833
  funded = 0.833 messages
  cost = 0.833 * 1.5 = 1.25 SAR
  MW[ACC, C#1] -= 1.25 → 0.0
  remaining = 1.0 - 0.833 = 0.167 messages
  sources += { contract: C#1, units: 0.833, cost: 1.25 }

Contract C#2 (next):
  rate = 0.75 SAR/msg
  available = 5.0 SAR
  fraction = min(1.0, 5.0 / (0.75 * 0.167)) = min(1.0, 39.9) = 1.0
  funded = 0.167 messages
  cost = 0.167 * 0.75 = 0.125 SAR
  MW[ACC, C#2] -= 0.125 → 4.875
  remaining = 0
  sources += { contract: C#2, units: 0.167, cost: 0.125 }

Step 3: remaining == 0 → no abort
Step 4: return { totalCost: 1.375 SAR, sources: [C#1: 1.25, C#2: 0.125] }
```

**Total SAR deducted = 1.375** (matches the worksheet cell value verbatim).

### §4.3 Edge cases in the algorithm

| Edge case | Behavior |
|---|---|
| `needed == 0` | Return success with empty `sources[]` (free action, no debit) |
| `eligibleContracts.empty()` | Throw `WalletNotConfigForTheNode` |
| One contract covers the whole transaction | Loop exits after first iteration; sources = 1 |
| Transaction crosses N contracts | Loop produces N sources; total cost = sum |
| Single message split across 3 contracts | Possible — same algorithm, sources = 3 |
| `MW[ACC, C#i] == 0` for all C#i | Loop completes without funding anything; remaining > 0 → ABORT |
| Last contract has zero balance | Loop skips it (`continue`), moves to next |
| Contract expires mid-flow | Race condition — see §7 below for the mitigation |
| Negative balance | Impossible by precondition — pre-deduct check + atomicity guard |
| Rate = 0 for a contract | `availableBalance / (0 * remaining)` → division by zero. **Must be guarded.** Treat rate=0 as "free under this contract" → fund full remaining for $0 |

### §4.4 The Aramco-Wallet phenomenon (MC-TT-05 in action)

When AO transfers 10 SAR from MW to a Node wallet (`Aramco`), the per-contract identity is preserved:

```
Before: MW[C#1] = 10, MW[C#2] = 15, AramcoWallet[C#1] = 0, AramcoWallet[C#2] = 0
Operator: Transfer(amount=10, from=MW, to=Aramco)
  → Algorithm: drain nearest-expiry first
  → MW[C#1] = 0, MW[C#2] = 15
  → AramcoWallet[C#1] = 10, AramcoWallet[C#2] = 0

A second 10-SAR transfer:
  → MW[C#1] = 0 (drained), so skip; MW[C#2] = 15 → take 10
  → MW[C#2] = 5
  → AramcoWallet[C#2] = 10
  → AramcoWallet now has: [C#1: 10, C#2: 10]
```

**Implication:** Aramco's "20 SAR balance" is internally split across two contracts. When Aramco sends a WA-Mark message:
1. C#1 (1.5 SAR/msg) is consumed first.
2. After C#1's 10 SAR depletes (drains to 0 in 6.67 messages... but msgs are discrete), the system charges fractionally — exactly the §4.2 math.

This is why **the worksheet shows 0.833 and 0.125** as cell values — these are real numbers stored in the calculation pipeline, not display artifacts.

### §4.5 Addons vs MW priority

For SubServices (Vol 44 W-TT-07):
1. **Addons first** (per-contract, nearest-expiry).
2. **MW second** (per-contract, nearest-expiry).
3. **CommChnl wallet third** (Multi-Wallet only, per-AO/Falcon priority).
4. **Abort** if total insufficient.

For CommChannel/Application Purchase:
1. **MW first** (per-contract, nearest-expiry).
2. **CommChnl wallet second** (Multi-Wallet only, per-priority).
3. **Abort** if insufficient.
4. **NO Addons consultation** — Addons are reserved for SubServices only.

---

## §5 — Atomicity & Consistency

### §5.1 Mongo-session transactional pattern [INFERRED]

The Falcon backend likely uses MongoDB sessions for the deduction transaction:

```csharp
using (var session = await client.StartSessionAsync()) {
    await session.StartTransactionAsync();
    try {
        var decision = walletDomainService.ComputeFundingDecision(needed, ctx);
        if (!decision.IsFunded) {
            await session.AbortTransactionAsync();
            throw new FalconException(FalconError.InsufficientFunds);
        }
        foreach (var src in decision.Sources) {
            await walletRepository.DebitAsync(src.ContractId, src.CostPaid, session);
        }
        await ledgerRepository.AppendAsync(decision.ToLedgerEntries(), session);
        await session.CommitTransactionAsync();
    } catch {
        await session.AbortTransactionAsync();
        throw;
    }
}
```

> **TODO — verify with Wave 11 code-mining report** at `Brain Outputs/reports/night-shift/2026-05-17/WAVE-11-CODE-MINING-WALLET.md` once it completes.

### §5.2 Atomicity guarantees

| Guarantee | Mechanism |
|---|---|
| No partial debit | Pre-compute the full funding decision before any wallet write |
| Reversibility on abort | Mongo session rollback OR explicit compensating writes |
| Ledger consistency | Ledger entries written inside the same transaction |
| No double-debit | Idempotency token on the operation (request-id, command-id) |
| Concurrency safety | Optimistic-concurrency `ETag`/`_version` on each wallet doc |
| Replay safety | Saga / outbox pattern for cross-bounded-context events (Charging ↔ Provisioning ↔ Commerce) |

### §5.3 What happens if MongoDB session is unavailable (e.g., standalone Mongo)?

MongoDB transactions require a replica set. If the Falcon dev environment uses standalone Mongo, transactions fail. The likely fallback is **explicit compensation**:

```csharp
var written = new List<(string contractId, decimal amount)>();
try {
    foreach (var src in decision.Sources) {
        await walletRepository.DebitAsync(src.ContractId, src.CostPaid);
        written.Add((src.ContractId, src.CostPaid));
    }
} catch {
    foreach (var (c, a) in written) {
        await walletRepository.CreditAsync(c, a);  // compensate
    }
    throw;
}
```

This is **less safe** because compensation itself can fail. The production deployment must use a replica set.

---

## §6 — Contract Lifecycle Interactions

### §6.1 Contract states (from Vol 36)

```
   Pending ──charge by T2──> Active ──expiration──> Expired
                              │
                              └──suspension──> Suspended ──resume──> Active
```

### §6.2 What happens to each wallet on each contract transition

| Transition | Effect on MW | Effect on CommChnl wallets | Effect on User/Node wallets | Effect on Addons |
|---|---|---|---|---|
| Pending → Active | T2 Charge: MW[C#i] += contract.value | (none unless T2 distributes) | (none) | Addons activated at C#i.activationDate |
| Active → Active (Re-Charge) | MW[C#i] += additional | (none) | (none) | (none) |
| Active → Suspended | (frozen; no movement) | (frozen) | (frozen) | (frozen) |
| Active → Expired | ALL C#i balances drained to sink | ALL C#i balances drained | ALL C#i balances drained | ALL Addons with C#i deactivated |

### §6.3 Mid-contract balance addition (recharge)

Operator may recharge a contract mid-life:
```
SetContractCharged(C#i, additionalValue = 50000)
  → MW[ACC, C#i] += 50000
```

The newly-added SAR inherits C#i's expiry. So if C#i expires in 30 days, the new 50k SAR also expires in 30 days. The client should be aware of this — it's not "fresh money with 1-year shelf life", it's an extension on the existing contract.

### §6.4 Contract expiration — the cascading deduction

When C#i hits its expiry timestamp, the system fires a single event that cascades:

```
[ContractExpired event] from Commerce
   ↓
[Charging service consumer]
   ↓
For each wallet in WHERE contractId == C#i AND balance > 0:
    Debit wallet balance to sink
    Append ledger entry (type: 'ExpiredDeduct', by: 'System')
   ↓
For each Addon in WHERE contractId == C#i:
    Mark Addon as deactivated
   ↓
[Emit BalancesDrainedForContract event]
   ↓
[Commerce + Provisioning consumers update entity states]
```

**Race condition window:** Between the `ContractExpired` event firing and the wallet deductions completing, an in-flight transaction MAY consume balance from C#i. The consumer should:
1. Acquire a contract-scoped lock (pessimistic).
2. Wait for in-flight transactions to drain (graceful, with timeout).
3. Then perform the expiration deduction.

Alternative: idempotent deduction that handles the race by re-computing balance == 0 and no-op'ing.

---

## §7 — CommChannel Wallet Priority

### §7.1 What is priority?

In Multi-Wallet mode, an account has many CommChannel wallets (`WA-Auth`, `WA-Util`, `WA-Mark`, `Voice`, etc.). When a non-CommChannel-specific deduction needs to fall back from MW to a CommChannel pool, **which one** does it draw from?

Answer: a manually-ordered priority list, set by the AO (for AO-initiated actions) or by the Falcon User (for Falcon-initiated actions).

### §7.2 Storage [INFERRED]

```
AccountWalletConfig {
  accountId: ObjectId,
  walletMode: 'Single' | 'Multi',
  commChannelPriority: [
    { channel: 'WA-Mark', order: 1 },
    { channel: 'WA-Util', order: 2 },
    { channel: 'Voice', order: 3 },
    ...
  ]
}
```

### §7.3 Consumption rule

When MW is exhausted for a purchase/sub-service deduction:
```
foreach commChannel in walletConfig.commChannelPriority.OrderBy(o => o.order):
    DeductFromCommChannelWallet(commChannel, remaining)
    if remaining == 0: break
```

### §7.4 Falcon-side override

Vol 44 §1.2 row "Falcon User" notes "As per the priority order set by the Falcon User/Node". This implies:
- The same `commChannelPriority` list applies to both client and Falcon actions.
- OR — Falcon has a parallel `commChannelPriorityFalcon` list that overrides the client's during Falcon-initiated actions.

**Open question Q-CC-13 (new):** Is there one priority list (used by both AO + Falcon) or two (one per actor type)?

### §7.5 Single-Wallet mode

In Single-Wallet, there are no CommChannel wallets — only MW + Node/User wallets. Priority ordering is irrelevant. The deduction order is simply:
1. MW (per-contract, nearest-expiry)
2. (none — abort if MW insufficient)

For Addons-eligible actions:
1. Addons (per-contract, nearest-expiry)
2. MW (per-contract, nearest-expiry)
3. (none — abort)

---

## §8 — Audit & Provenance

### §8.1 Ledger entries

Every wallet write produces a ledger entry. The minimum schema:
```
LedgerEntry {
  id: ObjectId,
  timestamp: UTC,
  type: 'Charge' | 'Transfer' | 'Deduct' | 'ExpiredDeduct' | 'Purchase' | 'ConsumeAddon' | 'Refund',
  from: WalletRef | ContractRef | 'Sink' | 'System',
  to: WalletRef | 'Sink',
  amount: Money,
  contractId: string,
  actor: { userId: string, role: 'T2' | 'AO' | 'NA' | 'NU' | 'System' },
  correlationId: string,    // ties multiple entries to one operation
  reason: enum,             // 'do-transaction' | 'transfer' | 'activate-commchannel' | etc.
}
```

### §8.2 Trace-id propagation

A single user action (e.g., "AO clicks Activate WA-Util") may produce 4+ ledger entries (one per contract drained). They share `correlationId`. This is the unit of audit — reconciliation joins on `correlationId`.

### §8.3 Funding decision record

The `FundingDecision` returned from §4.1 is **persisted alongside the operation result** for replay/audit. Schema:
```
FundingDecisionRecord {
  operationId: string,
  decisionAt: UTC,
  needed: Money,
  totalCost: Money,
  sources: [{ contractId, unitsFunded, costPaid, rate }],
  result: 'Funded' | 'Aborted',
  abortReason?: enum
}
```

### §8.4 SAMA audit requirements

SAMA (Saudi Central Bank) audit requires:
1. Every money movement traceable to a person + timestamp + business reason.
2. No deletion of ledger entries (append-only).
3. Reconciliation reports daily.
4. Retention period: 10 years.

Implication for the wallet domain:
- Ledger collection must be append-only (write-once at MongoDB level if possible).
- Soft-deletion of users does NOT delete their ledger entries.
- Audit-export endpoints with strict authorization.

---

## §9 — Reconciliation Rules

### §9.1 Daily close

At T+1 EOD (Riyadh time):
1. Sum all `Charge` ledger entries for the day.
2. Sum all `Deduct`/`ExpiredDeduct`/`Purchase`/`ConsumeAddon` ledger entries.
3. Compare net change to delta of `Σ wallet balances` snapshot at SOD vs EOD.
4. **Difference must be zero.**

If non-zero → escalate; production-critical alert.

### §9.2 Monthly close

Same as daily, but with finer granularity:
- Per-contract reconciliation (each contract's debit/credit sums match its balance delta).
- Per-account reconciliation.
- Cross-channel reconciliation (Multi-Wallet mode — does sum of CommChnl wallets + MW = sum of contract values - net deducted?).

### §9.3 Discrepancy resolution

Three classes of discrepancy:
1. **Ledger missing** — wallet write happened but no ledger row. Recover: query wallet collection's audit log to reconstruct.
2. **Ledger present but wallet not updated** — half-applied transaction. Recover: replay the wallet write; if balance already updated (idempotent), no-op.
3. **Two ledger entries for one operation** — duplicate (likely retried request). Recover: dedupe by `correlationId`.

---

## §10 — Edge Cases Catalog

### §10.1 Zero-Needed amount
**Symptom:** Operator calls `ActivateCommChannel(channel=X, fee=0)`.
**Behavior:** Funding decision returns immediately with `sources=[]`. Wallet writes are skipped. Activation succeeds. Ledger entry: `{ type: 'Purchase', amount: 0, sources: [] }` — kept for audit.

### §10.2 Restricted node (account suspended)
**Symptom:** Account is in a `Restricted` state per [Vol 28 Matrix] account status.
**Behavior:** All deductions throw `AccountRestricted` before reaching the wallet domain. No wallet writes.

### §10.3 User suspension mid-transaction
**Symptom:** User U sends a WA-Util message; mid-flight, an admin suspends U.
**Behavior:** Pessimistic — the in-flight transaction completes; the suspension takes effect for future actions. Optimistic — the in-flight transaction is aborted; balance reversed.
**[INFERRED]:** Falcon likely uses pessimistic (transaction completes) to avoid mid-send aborts that leave partial WhatsApp delivery state.

### §10.4 Contract expiration race
See §6.4 above. The mitigation is contract-scoped pessimistic lock + drain timeout.

### §10.5 Cross-contract send at exactly the boundary
**Symptom:** Contract C#1 expires at 2026-05-18T23:59:59 UTC; user sends a WA-Util at 2026-05-18T23:59:58 UTC.
**Behavior:**
1. Pre-flight check: At time of read, `eligibleContracts(now)` includes C#1.
2. Deduction begins.
3. By the time deduction completes, C#1 has expired.
4. **Did the deduct succeed?**

Two valid interpretations:
- **A:** The deduction succeeded because it began before expiry — let it stand.
- **B:** The contract is now expired — refund the deducted amount.

Falcon BRD does not explicitly cover this. **[Open question Q-CC-14]:** Boundary-case rule for contract expiry during in-flight transaction.

### §10.6 Quota limit hit
**Symptom:** Account has a daily quota of 10k messages; user sends the 10,001st.
**Behavior:** Quota check happens BEFORE the wallet deduction. Throw `QuotaExceeded` from the BSA/Commerce layer; wallet untouched.

### §10.7 IP allowlist denial
**Symptom:** User connects from IP not on the account's allowlist.
**Behavior:** Auth-layer rejection at the gateway; wallet never consulted.

### §10.8 Refund (rare)
**Symptom:** A purchase failed downstream (e.g., CommChannel activation succeeded in Provisioning but failed in Commerce).
**Behavior:** Saga compensation — emit `RefundRequested` event; Charging service refunds the original sources (using `FundingDecisionRecord` audit trail) by crediting the same contract balances.

---

## §11 — Error Catalog (wallet-domain)

| Error code | When thrown | Recovery |
|---|---|---|
| `InsufficientFunds` | Funding decision returns `Aborted` | Top up via Charge OR reduce transaction |
| `WalletNotConfigForTheNode` | Account has no active contracts OR no wallet records | Charge an initial contract |
| `CommChannelPriorityOrderRequired` | Multi-Wallet mode + deduction needs to use CommChnl wallets but priority is unset | AO/Falcon must set priority via `SetCommChnlPriority` |
| `InvalidEffectiveDateForPeriodicPricingChange` | Scheduled pricing change with effective date violating periodic boundaries | Pick a valid effective date (see Vol 28 Matrix) |
| `ContractExpiredDuringDeduction` | Race condition (§6.4) | Reverse the deduction; retry on a still-active contract |
| `WalletModeNotSupported` | Operator tries to use a Multi-Wallet feature on a Single-Wallet account | Migration is required (not currently supported) |
| `AccountRestricted` | Account in restricted state | Lift the restriction via Falcon admin |
| `DuplicateOperation` | Same `correlationId` submitted twice | Idempotent — return the original result |
| `RateNotConfiguredForActionOnContract` | Contract doesn't have a rate for the requested action | Configure rates on the contract |

---

## §12 — Specialist Mental Model (mnemonic + decision tree)

### §12.1 The 3-question test

For any wallet-touching code change, answer 3 questions:

1. **Whose wallet?** (MW / Node / User / CommChnl / Addons)
2. **Which actor authority?** (T2 / AO / NA / NU / System)
3. **Which contract(s)?** (nearest-expiry; cross-contract if needed)

If you can't answer all 3 from the request payload, the API contract is missing a field.

### §12.2 The "CTC" mnemonic — Charge, Transfer, Consume

Three irreducible primitives. Every wallet action is one of:
- **Charge** (Falcon adds SAR from outside)
- **Transfer** (SAR moves between Falcon-internal wallets, no creation/destruction)
- **Consume** (SAR removed: Deduct on send, Purchase on activate, Consume Addons on sub-service, ExpiredDeduct on expiration)

### §12.3 Decision tree: "Where does this money go?"

```
Is the action introducing SAR from outside? ──Yes──> Charge (T2 only)
                    │
                   No
                    ↓
Is the action moving SAR between Falcon wallets? ──Yes──> Transfer (actor by scope)
                    │
                   No
                    ↓
Is the action a Sub-Service (OTP, etc.)? ──Yes──> Consume Addons first, MW fallback
                    │
                   No
                    ↓
Is the action a CommChannel/App purchase? ──Yes──> Purchase: MW first, CommChnl fallback (Multi)
                    │
                   No
                    ↓
Is the action a do-transaction (send)? ──Yes──> Deduct from User/Node (Single) or User/Node CommChnl (Multi)
                    │
                   No
                    ↓
Is contract expiring? ──Yes──> System: ExpiredDeduct cascades
```

### §12.4 The "no leakage" axiom

Every SAR that enters the system via a `Charge` must leave it via exactly one path:
- `Deduct` (consumed on a transaction)
- `ExpiredDeduct` (contract expired)
- `Purchase` (paid out for a service)
- `ConsumeAddon` (paid out as part of an allowance)
- `Refund` (returned to source — rare, saga-driven)

**If at year-end:** `Σ Charge - (Σ Deduct + Σ ExpiredDeduct + Σ Purchase + Σ ConsumeAddon + Σ Refund) ≠ Σ active balances`, there's a leak — escalate.

---

## §13 — Cross-References

### §13.1 Direct truth tautologies (Vol 44 §1, §2)

- W-TT-01 through W-TT-08 — wallet authority
- MC-TT-01 through MC-TT-06 — multi-contract orchestration

### §13.2 Refines

- Vol 28 Matrix 5 — wallet matrix (this volume IS the deep-dive Matrix 5 deserves)
- Vol 36 §BR-CC-31 — multi-contract deduction rule (now refined with worked example)

### §13.3 Cross-references to other modules

- Vol 34 (Module 01 Account Mgmt) — wallet/contract are owned by Commerce, but account creation is the entry point
- Vol 36 (Module 03 Contract & Cost) — contract entity model + pricing
- Vol 40 (Module 06 BSA) — Do Transaction consumes wallet via this volume's §2.3
- Vol 32 (Campaigns honest map) — campaigns are wallet consumers; this volume is the consumer's reference

### §13.4 New open questions

| ID | Question | Owner |
|---|---|---|
| Q-CC-13 | Is there one CommChannel priority list (used by both AO and Falcon) or two (one per actor)? | Module 03 architect |
| Q-CC-14 | What is the canonical rule for in-flight transaction at contract expiry boundary? | Module 03 + Module 06 architects |
| Q-CC-15 | Is the `commChannelPriority` settable per-sub-node or only per-account? | Module 01 + Module 03 |
| Q-CC-16 | What's the exact MongoDB transaction strategy (replica set required vs compensation pattern)? | Backend platform |
| Q-CC-17 | Are ledger entries enforced append-only at the DB level, or by application logic only? | Audit/compliance |

---

## §14 — Specialist Operating Checklist (use when reviewing wallet code)

When reviewing any wallet-related PR, check:

- [ ] Does the change preserve **per-contract balance identity** through transfers? (MC-TT-05)
- [ ] Is the nearest-expiry FIFO honored? (W-TT-05)
- [ ] Is atomicity enforced (pre-compute funding, then write, or compensate)? (W-TT-06)
- [ ] Is the correct actor authority gate applied via PES?
- [ ] Is the operation idempotent on `correlationId`?
- [ ] Are ledger entries written in the same transaction?
- [ ] Is the `FundingDecisionRecord` persisted for audit?
- [ ] Are Addons consumed before MW for SubServices? (W-TT-07)
- [ ] Are MW consumed before CommChnl wallets for Purchase? (W-TT-07 inverse)
- [ ] Is contract expiration the **only** trigger for `ExpiredDeduct` (i.e., never invoked by a user action)? (W-TT-08)
- [ ] Are zero-Needed actions short-circuited (no debit, ledger entry retained)?
- [ ] Are the SAMA audit requirements satisfied (append-only, 10-year retention)?

---

**End of Volume 45 — Wallet & Balance Management Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 44 §1-§2 (truth tautologies) + Vol 28 Matrix 5 + Vol 36 (Module 03)
**Next:** Vol 46 — Campaigns & Channels Specialist (WhatsApp/Meta/Voice/SMS/Email + Facebook/Instagram NOT-impl rationale)


---

## §V45-CODE-VERIFICATION-ADDENDUM (Added 2026-05-18 — from Wave 11 code-mining agent)

> **Truth correction:** Several Vol 45 sections marked `[INFERRED]` are now `[CODE-VERIFIED]` with the agent's findings. Where code contradicts the inference, the code wins.

### Correction §1 — Wallet storage model (REVISES §1.1)

**Was inferred:** Master Wallet is "abstract aggregate of per-contract `WalletRecord` entries".

**Code says:** Phase 1 uses a single MongoDB aggregate **`OcsWallet`** (collection `wallets`) keyed `{OwnerType}:{OwnerId}:{Channel}:{Currency}`. There is **no per-contract `WalletRecord` doc**. Each contract is an **embedded `OcsWalletBucket` of type `ContractFunded`** inside the wallet aggregate.

- The Master Wallet IS a stored document: `ACCOUNT:{accountId}:ALL:SAR`.
- `ContractBalanceSummary` is a **computed GROUP-BY-contractId projection** over the embedded buckets — not a stored entity.

**Refined truth tautology (replaces MC-TT-04 wording):**
> **MC-TT-04 (code-verified):** Master Wallet is a single aggregate document, with per-contract balances stored as embedded `OcsWalletBucket[]` entries (one per contract, type `ContractFunded`). The "per-contract balance" view is a real array inside one doc, not a join.

### Correction §2 — BR-CC-31 implementation location (CONFIRMS §4.1)

**Code says:** `AllocateOcsMonetaryBucketsPolicy.cs:35-46` — `.OrderBy(b => b.ExpiresAt)` loop over active in-window contract buckets. Shortfall throws `InsufficientBalance` after the loop. Same policy is reused by 4 handlers: `DirectDebitHandler`, `TransferBalanceHandler`, `BuildOcsUsageReservationPlanPolicy`.

**Implication:** The nearest-expiry FIFO is implemented **exactly once** at the policy layer and reused everywhere. This is correct DDD — domain policy, not handler logic.

### Correction §3 — Atomicity mechanism (CONFIRMS + REFINES §5.1)

**Was inferred:** "MongoDB session + transactional `using` block".

**Code says:**
- `MongoUnitOfWork.cs` wraps `ClientSession` transactions.
- **Per-wallet optimistic concurrency** via `Version++` + `TryReplaceAsync(wallet, expectedVersion)`.
- On `WalletVersionConflict` → exponential backoff retry.
- **Idempotency** = deterministic key `{operation}:{walletId}:{refType}:{refId}` stored as `WalletMutationReceipt` with cached `ResponseJson`.
- **No client-supplied trace-id needed** — the key is derived from the operation context.

**Refined operating note:** When designing wallet-touching code, the idempotency key must be **derivable**, not client-supplied. The Falcon pattern is: same operation + same wallet + same reference (e.g., orderId) = same key = same cached response.

### Correction §4 — CommChannel priority (REVISES §7)

**Was inferred:** Stored in `AccountWalletConfig.commChannelPriority` array per account.

**Code says:** **CommChannel priority is a per-request input**, not a stored entity. The `DoPayment*` request shapes contain `CommChannelPriority { CommChannelPriorityId, ChannelId }` — the caller (AO or Falcon admin) supplies the priority list at request time.

**Funding decision** = `ResolveWalletFundingDecisionPolicy` returning one of:
- `Master` — fully funded from MW alone.
- `CommChannel` — fully funded from CommChannel wallets.
- `Both` — split across MW and CommChannel wallets.
- `Fail(InsufficientFunds)` — total insufficient.
- `Fail(CommChannelPriorityOrderRequired)` — missing priorities when MW alone can't cover → hard abort.

**Implication:** The UX must collect the priority order before submitting the `DoPayment*` action, or the request fails fast.

**Resolves Q-CC-13:** There's only ONE priority list, supplied per-request by the caller (AO or Falcon admin) — not a stored account-level config.

**Resolves Q-CC-15:** Priority is per-request, not per-sub-node. The caller decides at the moment of action.

### Correction §5 — Addons (REVISES §1.1 row 7)

**Was implied:** Addons are a separate entity type.

**Code says:** Addons are **Quota buckets** with `QuotaCategory = "SUB_SERVICE"`. There is **no separate `Addon` entity**. They live in the same `OcsWallet` aggregate alongside `ContractFunded` buckets.

**Implication:** The wallet aggregate is more polymorphic than my INFERRED model suggested — buckets can be:
- `ContractFunded` (regular SAR balance)
- `Quota` with various categories including `SUB_SERVICE` (this is what we called "Addons")

The "Addons-first then MW" priority (W-TT-07) is then a **bucket selection rule**, not a cross-document rule.

### Correction §6 — Contract expiration mechanism (REVISES §6.4)

**Was inferred:** "system job/scheduled task" using Hangfire/Quartz.

**Code says:** Contract expiration is **Kafka-event-driven**:
- `ProjectContractLifecycleProcess.ExecuteExpiryAsync` consumes the contract-expiry event and flips bucket `Status = Expired`.
- There's NO Hangfire/Quartz in the Charging service.
- The ONLY scheduled-background worker is `ReservationExpiryWorker` (a `BackgroundService`) — and that's for **reservation TTLs**, not contract expiry.

**Implication:** Contract expiration is part of the Kafka event flow from Commerce. Charging is a **passive consumer**. Race conditions are handled by:
1. The reservation TTL keeping in-flight transactions bounded.
2. Optimistic concurrency at the wallet level preventing late writes.

**Resolves Q-CC-16:** Mongo transactions ARE used (via `MongoUnitOfWork`), so replica set is a deployment requirement.

### Correction §7 — Worked example status (REVISES §4.2)

**Was claimed:** The 1.25 + 0.125 = 1.375 SAR worked example reflects actual code behavior.

**Code says:** The cross-contract sum mechanism EXISTS at `BuildOcsUsageReservationPlanPolicy.cs:121` (so the math is implementable), but **no literal constants for those numbers (1.25 / 0.125 / 1.375) appear in code**. The Vol 44 §2.3 worksheet example is illustrative — derived from BRD content, not from copying code values.

**Implication:** The fractional cross-contract pricing is a real code capability. The specific numbers are an operator-supplied scenario from the BRD spreadsheet, not test fixtures.

### Correction §8 — New canonical citations

| Concept | File:line |
|---|---|
| Nearest-expiry FIFO | [CODE] `AllocateOcsMonetaryBucketsPolicy.cs:35-46` |
| Wallet aggregate root | [CODE] `OcsWallet` (collection `wallets`) |
| Cross-contract pricing mechanism | [CODE] `BuildOcsUsageReservationPlanPolicy.cs:121` |
| Funding decision policy | [CODE] `ResolveWalletFundingDecisionPolicy` |
| Atomicity primitive | [CODE] `MongoUnitOfWork.cs` |
| Idempotency receipt | [CODE] `WalletMutationReceipt` |
| Contract expiry consumer | [CODE] `ProjectContractLifecycleProcess.ExecuteExpiryAsync` |
| Reservation TTL worker | [CODE] `ReservationExpiryWorker` (BackgroundService) |

### Updated open questions (post-code-mining)

| ID | Status | Note |
|---|---|---|
| Q-CC-13 | ✅ RESOLVED | One priority list, per-request, supplied by caller |
| Q-CC-14 | 🟡 Still open | Boundary-case rule for contract expiry during in-flight (race) |
| Q-CC-15 | ✅ RESOLVED | Priority is per-request, not per-sub-node |
| Q-CC-16 | ✅ RESOLVED | Mongo transactions used (`MongoUnitOfWork`) — replica set required |
| Q-CC-17 | 🟡 Still open | Ledger append-only enforcement (need separate code-mining pass) |

### Full code-mining report

See `WAVE-11-CODE-MINING-WALLET.md` in this directory for the full agent report with all file:line citations.

