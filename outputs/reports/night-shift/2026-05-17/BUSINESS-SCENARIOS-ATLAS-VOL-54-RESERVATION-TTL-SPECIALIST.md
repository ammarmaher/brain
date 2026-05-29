# Volume 54 — Reservation & TTL Specialist Guide

> **Specialist depth:** The reservation pattern that protects in-flight transactions from concurrent overdraft. The `ReservationExpiryWorker` background service. TTL semantics, compensation, and the reservation-vs-commit lifecycle.
>
> **Authority:** Wave 11 (Charging code mining) — `ReservationExpiryWorker` (`BackgroundService`) is one of only TWO scheduled-background workers in Charging (the other is `ProjectContractLifecycleProcess.ExecuteExpiryAsync` consumer). Reservations are explicitly mentioned at `BuildOcsUsageReservationPlanPolicy.cs:121`.

---

## §1 — Why Reservations Exist

### §1.1 The race condition reservations prevent

Without reservations:
```
Time T₀: User starts sending 1000 WA-Util messages (will cost 500 SAR total)
Time T₁: Wallet has 600 SAR — passes the pre-flight check
Time T₂: Concurrent admin transfer drains 200 SAR (wallet now 400 SAR)
Time T₃: Send fan-out completes 800 of 1000 messages, costing 400 SAR (drained)
Time T₄: Last 200 messages fail with InsufficientFunds — but the user thought they had enough!
```

This is the **time-of-check / time-of-use** (TOCTOU) race. Two concurrent operations can both pass pre-flight, then together overdraft.

### §1.2 The reservation solution

```
Time T₀: User starts sending 1000 messages
Time T₁: Charging RESERVES 500 SAR (decrements available balance immediately, parks the SAR in a reservation)
Time T₂: Concurrent admin transfer sees only 100 SAR available (600 - 500 reserved) — request denied
Time T₃: Send fan-out completes successfully using the reserved 500 SAR
Time T₄: Reservation is COMMITTED — the parked SAR is permanently deducted
```

Reservations turn pre-flight check + commit into a 2-phase pattern. Concurrent operations see the reservation as already-deducted.

### §1.3 What if the send is cancelled mid-fan-out?

```
Time T₀-T₂: Same as §1.2
Time T₃: Send is cancelled / fails (e.g., template restricted mid-flight per Vol 49 §9.2)
Time T₄: Charging RELEASES the reservation — the 500 SAR returns to available balance
```

Reservations are compensatable. Until committed, they can be released.

### §1.4 What if the system crashes mid-send?

```
Time T₀-T₂: Same as §1.2
Time T₃: System crash — neither commit nor release happens
Time T₄: ReservationExpiryWorker scans for orphaned reservations
Time T₅: Reservation TTL exceeded → worker releases the reservation
Time T₆: 500 SAR returns to available balance
```

This is **why TTLs are mandatory** on reservations — they're the only safety net against permanent stuck-balance.

---

## §2 — The Reservation Entity

### §2.1 [INFERRED — Wave 11 hint] Schema

```
Reservation {
  id: ObjectId,
  walletId: string,                  // OcsWallet aggregate key
  contractId: string,                // bucket within wallet
  amount: Money,                     // SAR being reserved
  action: string,                    // 'WA-Util-Send' | 'CommChannel-Activate' | ...
  contextRef: { type, id },          // e.g., { type: 'BSA-Batch', id: 'BSA-123' }
  status: 'Reserved' | 'Committed' | 'Released' | 'Expired',
  reservedAt: UTC,
  ttl: timespan,                     // e.g., 30 minutes
  committedAt?: UTC,
  releasedAt?: UTC,
  expiresAt: UTC,                    // reservedAt + ttl
  correlationId: string,
  receiptKey: string                 // deterministic for idempotency
}
```

### §2.2 Per-bucket reservation accounting

Each `OcsWalletBucket` (Vol 45 §V45 addendum §1) tracks both `balance` and `reservedAmount`. The **available** is `balance - reservedAmount`.

When a new reservation is requested:
```
if (bucket.balance - bucket.reservedAmount >= needed):
    bucket.reservedAmount += needed
    create Reservation(amount = needed)
else:
    throw InsufficientFunds
```

When committed:
```
bucket.balance -= reservation.amount
bucket.reservedAmount -= reservation.amount
Reservation.status = Committed
```

When released:
```
bucket.reservedAmount -= reservation.amount
Reservation.status = Released
```

---

## §3 — The Three Reservation Outcomes

### §3.1 Outcome 1 — Commit (happy path)

The operation completed; the reserved amount is now permanently deducted. Ledger entry written with `correlationId`.

### §3.2 Outcome 2 — Release (controlled cancel)

The operation was cancelled before commit. The reserved amount returns to available. No ledger debit; instead a "Reservation Released" audit entry.

### §3.3 Outcome 3 — Expired (TTL exceeded)

The `ReservationExpiryWorker` found a Reservation whose `expiresAt < now`. It auto-releases (same effect as §3.2) but marks `status = Expired` to distinguish from intentional release.

**Why distinguish Released from Expired?** Operational telemetry. High Expired-rate signals a system problem (e.g., the consumer that should commit is dead). High Released-rate is normal (cancels happen).

---

## §4 — The ReservationExpiryWorker

### §4.1 What it is

A `BackgroundService` running inside the Charging service. The ONLY non-Kafka scheduled task in Charging (per Wave 11).

### §4.2 What it does

Periodically (likely every 1 minute) scans:
```
db.reservations.find({
  status: 'Reserved',
  expiresAt: { $lt: now }
}).forEach(r => {
    release(r)
    r.status = 'Expired'
    write to audit log
})
```

Idempotent — running twice produces same result.

### §4.3 Scan interval [INFERRED]

Likely 30 seconds to 1 minute. Trade-off:
- Too frequent → wasteful queries.
- Too rare → orphaned reservations linger.

### §4.4 What it does NOT do

- Does NOT handle contract expiry (that's `ProjectContractLifecycleProcess.ExecuteExpiryAsync` consuming Kafka).
- Does NOT trigger refunds (that's saga-driven from Provisioning/Commerce).
- Does NOT bulk-clean ledger entries.

It's narrowly scoped to **release stuck reservations**, nothing more.

---

## §5 — Reservation Lifecycle

### §5.1 Visual

```
                  ┌─────────────────┐
                  │ Reservation      │
                  │  Created         │
                  │ (status=Reserved │
                  │  ttl=30min)      │
                  └─────────────────┘
                  /        |         \
       (commit)  /   (release)  (expire)
                /         |           \
               ▼          ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ COMMITTED│ │ RELEASED │ │ EXPIRED  │
        └──────────┘ └──────────┘ └──────────┘
        (terminal:    (terminal:   (terminal:
         money       reservation   handled by
         deducted)   freed)        ReservationExpiryWorker)
```

### §5.2 Allowed transitions

- `Reserved → Committed` (success path)
- `Reserved → Released` (intentional cancel)
- `Reserved → Expired` (TTL exceeded, worker-driven)

### §5.3 NOT allowed

- `Committed → Released` (cannot un-commit; use refund saga instead)
- `Released → Reserved` (cannot un-release; create new reservation)
- `Expired → Reserved` (same — create new)

---

## §6 — Per-Use-Case Reservation Sizing

### §6.1 BSA single-message send

Reservation = single message cost. TTL = short (~1 min, since the send is synchronous-ish).

### §6.2 BSA bulk send (campaign)

Reservation = batch cost (e.g., 1000 messages × 0.5 SAR = 500 SAR). TTL = longer (~30 min, since batches take longer).

### §6.3 CommChannel/Application Purchase

Reservation = full purchase price. TTL = generous (30 min), since saga involves Charging + Provisioning + potentially manual intervention.

### §6.4 Sub-service consumption

Reservation = quota unit cost. TTL = short, since sub-services are typically synchronous.

---

## §7 — Concurrent Reservations on Same Wallet

### §7.1 Two BSA sends for 300 SAR each, wallet has 500 SAR

```
T₀: Send A requests reservation for 300 SAR.
    bucket.reservedAmount: 0 → 300
    Send A receives reservation_A.
T₁: Send B requests reservation for 300 SAR.
    bucket.available = 500 - 300 = 200 < 300 → InsufficientFunds
    Send B fails immediately (does NOT block).
T₂: Send A completes, commits.
    bucket.balance: 500 → 200
    bucket.reservedAmount: 300 → 0
T₃: User retries Send B.
    Reservation request for 300 SAR.
    bucket.available = 200 - 0 = 200 < 300 → InsufficientFunds.
```

This is correct: the user can't double-spend.

### §7.2 Send A completes, Send B retries — alternative

If T₃ retries after a top-up:
```
T₃: AO charges contract +500 SAR.
    bucket.balance: 200 → 700
T₄: User retries Send B for 300 SAR.
    Reservation request for 300 SAR.
    bucket.available = 700 - 0 = 700 >= 300 → granted.
```

### §7.3 Many concurrent small sends

```
For 100 concurrent sends, each reserving 5 SAR (total 500 SAR):
- Each reservation modifies bucket.reservedAmount via optimistic concurrency.
- Two simultaneous requests may conflict on Version; the retry pattern (Vol 45 §V45) handles this.
- Final state: 100 reservations, total reservedAmount = 500 SAR.
```

---

## §8 — Reservation × Multi-Contract

Reservations respect the per-contract bucket structure (Vol 45 §V45 addendum §1 + §6 of this volume).

### §8.1 Cross-contract reservation example

Send requires 1.5 SAR; nearest-expiry contract C#1 has 1.0 SAR; C#2 has 5.0 SAR.

```
Step 1: ReservePolicy walks contracts.
  - C#1: reserve 1.0 SAR (drain available)
  - C#2: reserve 0.5 SAR
Step 2: Reservation entity records the split.
  Reservation {
    sources: [
      { contractId: C#1, amount: 1.0 },
      { contractId: C#2, amount: 0.5 }
    ],
    totalAmount: 1.5
  }
Step 3: On commit, each contract's bucket.balance is debited proportionally.
Step 4: On release/expire, each contract's bucket.reservedAmount is restored proportionally.
```

This is why the reservation entity has a `sources[]` array — multi-contract spans are first-class.

---

## §9 — Edge Cases

### §9.1 Reservation TTL exactly at expiry boundary
**Setup:** Reservation expires at 12:00:00.000; commit arrives at 12:00:00.001.
**Behavior:** Race — depends on which worker runs first. Two possible outcomes:
- **A:** Commit succeeds, reservation transitions Reserved → Committed. ExpiryWorker scan finds no Reserved entry.
- **B:** ExpiryWorker fires first, reservation transitions Reserved → Expired. Commit fails with `ReservationExpired`.

**Mitigation:** Generous TTLs (well beyond expected commit time). Application code should handle `ReservationExpired` by creating a fresh reservation.

### §9.2 Wallet balance changes during reservation
**Setup:** Reservation held for 500 SAR on bucket with 600 SAR balance. Admin tries to debit 200 SAR (transfer out).
**Behavior:** Available = 600 - 500 = 100. Transfer denied with `InsufficientFunds`. The reservation HOLDS the available balance until commit/release.

### §9.3 Contract expiration with active reservation
**Setup:** Contract C#1 has 100 SAR balance with a 50 SAR reservation held against it. Contract expires.
**Behavior:**
- `ProjectContractLifecycleProcess.ExecuteExpiryAsync` drains the bucket.
- But the reservation is referencing this bucket.
- **Likely behavior:** Expiry-drain waits for in-flight reservations (Vol 45 §10.5 expiry boundary race) — release reservations first, THEN drain. OR drain blindly, leaving the reservation orphaned (ReservationExpiryWorker eventually cleans).

**Q-RES-01 (NEW):** What's the canonical interaction between contract expiry and active reservations? Need code-mining confirmation.

### §9.4 User suspension with active reservation
**Setup:** User U has a 500 SAR reservation (mid-send). Admin suspends U.
**Behavior:** Suspension doesn't auto-release the reservation. The reservation stays Reserved.
- If the send completes → commit (the deduction happens despite suspension).
- If the send is interrupted → reservation expires → release.

The user's session is revoked but in-flight side-effects continue. This is **Vol 47 §12.5** — stale Zitadel session after Commerce-side suspend.

### §9.5 Reservation orphaned after consumer crash
**Setup:** Charging consumer issues reservation, then crashes before commit/release.
**Behavior:** ReservationExpiryWorker handles it at next scan. Reservation transitions Reserved → Expired. Wallet returns to available.

This is the **safety net** — no manual intervention needed.

### §9.6 Operator manually releases a reservation
**Setup:** Operator (Falcon admin) calls a hypothetical `releaseReservation(id)` endpoint.
**Behavior:** Reservation transitions Reserved → Released. Audit entry with operator's identity.

**Q-RES-02 (NEW):** Does such an admin endpoint exist? Or is release strictly automated?

---

## §10 — Mental Model

### §10.1 The "available = balance - reserved" formula

This is THE formula reservations enforce. Any query that needs to answer "can I spend X?" must use `available`, not `balance`. The pre-flight check in `AllocateOcsMonetaryBucketsPolicy.cs:35-46` (Vol 45) uses this implicitly.

### §10.2 The "reserve before fan-out" axiom

Anytime an action will be fanned out (BSA bulk send, multi-step purchase, etc.), the FULL fan-out cost must be reserved upfront. If you can't reserve the full cost, fail-fast — don't start the fan-out and then run out of money mid-way.

### §10.3 The "TTL is the safety net" axiom

Reservations without TTLs would leak balance permanently on crashes. The TTL + ReservationExpiryWorker ensures self-healing.

### §10.4 The "commit OR release, never both" invariant

A reservation can ONLY transition to ONE terminal state. If you can't commit, release. If you can't release, let it expire. Never both.

---

## §11 — PR Review Checklist (reservation-touching)

- [ ] Does the new fan-out reserve the FULL projected cost upfront (not incrementally)?
- [ ] Is the reservation TTL set to a value greater than the expected fan-out duration?
- [ ] Is the commit triggered exactly once on success?
- [ ] Is the release triggered exactly once on cancel/failure?
- [ ] Is the failure path that creates a reservation but never commits (e.g., consumer crash) tested?
- [ ] Is the `available = balance - reserved` formula used in queries (NOT raw `balance`)?
- [ ] Is the cross-contract reservation's `sources[]` array correctly populated?
- [ ] Is the audit entry written for each lifecycle event (Reserved/Committed/Released/Expired)?
- [ ] Are concurrent reservations on same wallet handled via optimistic concurrency?
- [ ] Is the user-visible error for `ReservationExpired` distinct from `InsufficientFunds`?

---

## §12 — Cross-References

- Vol 45 — Wallet Specialist §5 (atomicity) + §V45 addendum (OcsWallet aggregate)
- Vol 46 — Campaigns Specialist §12 (send-flow uses reservation implicitly)
- Vol 51 — Saga Map §V51-COMMERCE-ADDENDUM (no outbox by design)
- Vol 53 — Order/Polling Specialist (reservation underlies the DoPayment saga)
- Wave 11 — Charging code mining (ReservationExpiryWorker mention)
- `[CODE]` `BuildOcsUsageReservationPlanPolicy.cs:121` (reservation plan)
- `[CODE]` `ReservationExpiryWorker` (BackgroundService — Charging)

---

## §13 — Open Questions

| ID | Question | Severity |
|---|---|---|
| Q-RES-01 | Interaction between contract expiry and active reservations | MED |
| Q-RES-02 | Admin endpoint to manually release reservations? | LOW |
| Q-RES-03 | Confirm scan interval of `ReservationExpiryWorker` | LOW |
| Q-RES-04 | Confirm reservation schema fields + Mongo collection name | MED |
| Q-RES-05 | What's the Default TTL per use-case? Should it be configurable per-tenant? | MED |

---

**End of Volume 54 — Reservation & TTL Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 45 (Wallet) + Wave 11 (Charging code citations)
**Pending:** Future code-mining wave to verify §2.1 schema + §9.3 + §10 axioms
