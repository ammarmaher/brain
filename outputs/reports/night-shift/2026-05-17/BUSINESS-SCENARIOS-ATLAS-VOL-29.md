---
type: business-scenarios-atlas
volume: 29
title: "Falcon Business Scenarios Atlas — Volume 29: Simplified Memory Card (Mnemonic Rules for Fast Recall)"
purpose: "When you're in a meeting and need to remember a rule fast, this is the cheat sheet. Maximum-density mnemonics + simplified rules + the 'mental model' for each domain."
volume-29-cards: 10
---

# Falcon Business Scenarios Atlas — Volume 29: The Memory Card

> Print this. Pin it. Memorize it. 10 mental models that cover ~80% of business questions.

---

## CARD 1 — The Falcon Role Hierarchy (memorize)

```
FALCON SIDE                          CLIENT SIDE
─────────────                        ───────────
SA (System Admin)  ◄──── creates    AO (Account Owner)
PR (Product)       ◄──── client      ↓
OP (Operation)        accounts       NA (Node Admin)
                                     ↓
                                     NU (Normal User)
```

**Mental shortcut:**
- **3 Falcon roles, 3 Client roles**
- **Falcon side = commercial control** (who pays, who gets what)
- **Client side = operational control** (who manages whom inside the account)

---

## CARD 2 — "What can Falcon do that AO can't?" (the 4 commercial levers)

Falcon has 4 commercial levers AO doesn't:

```
1. CREATE ACCOUNTS         (BR-AM-02)
2. CREATE/EDIT CONTRACTS   (BR-CC-01)
3. SET PRICING             (BR-AM-25 — visibility + price type + price value)
4. SET WALLET TOPOLOGY     (BR-AM-25 — balance type + wallet type)
```

**Mnemonic:** **"CCPT"** — Create accounts, Create contracts, Pricing, Topology.

If a question involves any of these → Falcon-only answer.

---

## CARD 3 — User Status FSM (5 states)

```
                Create
                  ↓
                PENDING ─────────────► ACTIVE
                                          │
                            ┌─────────────┼─────────────┐
                            ↓             ↓             ↓
                       SUSPENDED       LOCKED        DELETED
                            │             │             │
                            └── ACTIVE ◄──┘             │
                                       ↑                │
                                    (system)            │
                            ┌── PENDING ◄────────────────
                          unlock                       Falcon-only restore
                       (Falcon only)
```

**Mental shortcuts:**
- **PEN = ACT-in-waiting** (just needs First Login)
- **SUS = manual block** (admin can reverse)
- **LCK = system block** (Falcon must unlock; user redoes First Login)
- **DEL = soft-delete** (audit preserved; Falcon-only restore)

---

## CARD 4 — CommChannel/App FSM (6 states)

```
   InActive (First time)
         │
      Do Payment
         ↓
       PAID ──settle──► ACTIVE ──renewDate w/o pay──► EXPIRED
                          │                              │
                       Disable                       grace ends
                          ↓                              ↓
                       DISABLED                  InActive (Grace Ends)
                          │                              │
                       Enable                         Do Payment
                          ↓                              ↓
                       ACTIVE                       PAID → ACTIVE
```

**Mental shortcuts:**
- **6 states total** (InActive-First / Paid / Active / Expired / InActive-GraceEnds / Disabled)
- **Grace:** 7d Monthly, 30d Yearly/OneTime
- **Disabled = manual** (not automatic)
- **Falcon owns FSM** (Commerce drives transitions; Provisioning mirrors — Wave 5d finding)

---

## CARD 5 — Contract FSM (3 states + auto-transitions)

```
        Create
          ↓
       PENDING ───startDate reached───► ACTIVE
                                            │
                                  expirationDate reached
                                            ↓
                                        EXPIRED
                                            │
                            Extend (new expirationDate > now)
                                            ↓
                                        ACTIVE (records re-enter lump-sum)
```

**Mental shortcuts:**
- **PEN edit = everything** (no money at stake yet)
- **ACT edit = limited** (date can extend; rates/details can change; value LOCKED)
- **EXP recovery = extension only** (BR-CC-17)
- **Records always retained** for audit, even after expiration (BR-CC-38)

---

## CARD 6 — Wallet Transfer Matrix (the 4-cell shorthand)

| From → To | Master | Comm | User/Node |
|---|---|---|---|
| **Master** | — | 🔒 F | ✅ F+AO (Single) |
| **Comm** | 🔒 F | — | ✅ F+AO |
| **User/Node** | ❌ | ✅ F+AO | ✅ F+AO (+NA for Node-Node within sub-tree) |

**Mnemonic:** "**Master = Falcon. AO = Operations. NA = Sub-tree only.**"

---

## CARD 7 — The 3 Compliance Regimes (Saudi-focused)

```
SAMA (Banking)          CITC (Telecom)         GDPR (EU/UK clients)
─────────────           ──────────────         ──────────────────
Audit trail             Service continuity      Right to access
Reconciliation          Grace periods          Right to erasure
Immutability            Fair billing           Right to portability
10-year retention       Consent for marketing  72hr breach notice
Data residency
```

**Mental shortcuts:**
- **SAMA = money + audit** (every charge tagged with contractId)
- **CITC = service + transparency** (grace periods + opt-in)
- **GDPR = data subject rights** (not currently met for EU; gap for expansion)

---

## CARD 8 — The 7 Open-Question Categories (what we still don't know)

```
1. PRD Sheet Tab 2 capture          → Q-UM-07 (blocked on Drive)
2. Contract tie-breaker             → BR-CC-42 (same expiration date)
3. Refund flow                      → Q-CC-49 (off-platform today)
4. Packaging + Billing PRD scope    → BR-CC-41 (folder named but body empty)
5. Forgot-password OTP lockout      → Q-UM-01 (clarify silent-vs-lock)
6. Bulk user operations             → Q-UM-11 (design space in Vol 10)
7. Falcon skip-validation policy    → Q-UM-16 (for internal users)
```

**Mnemonic:** **"PCRPFBF"** — pretend it spells "**Product Critical Resolved Pending For Brain Faster**" (yes it's forced — but you'll remember it).

---

## CARD 9 — The Wallet Math Mental Model

```
Master Wallet = SUM( WalletRecord.valueSar WHERE contract.status = Active )

For each Send Transaction:
  cost = Contract Detail[Application × CommChannel × Priority × Destination]
  deduct from nearest-expiring contract's WalletRecord
  tag deduction with contractId  ← SAMA audit trail
```

**Mental shortcuts:**
- **Master is virtual** (not a row; just an aggregate)
- **Records survive** contract expiry (audit) but exit lump-sum
- **Nearest-expiring drains first** (deterministic ordering, except tie-breaker open)

---

## CARD 10 — The Permission Quick Test

Before deciding "can X do Y?", ask:

```
Step 1 — Is X a Falcon role (SA/OP/PR) or Client role (AO/NA/NU)?
Step 2 — Is Y a commercial action (CREATE/EDIT pricing/contract/topology) → Falcon-only
Step 3 — Is Y operational (Do Payment / Disable / Manage Users / Transfer Balance)?
         → Check the matrix in Vol 28
Step 4 — Is Y "view a thing"?
         → Falcon: all scopes. Client: own account/sub-tree only.
Step 5 — Is Y on a Client business asset (Templates / Contact Groups)?
         → Falcon: view+download only. Client: per creator/non-creator rules.
```

**80% of permission questions resolve at Step 2 or Step 3.**

---

## BONUS — The "Why Did This Break?" Decision Tree

```
Something broke. Where to look?

│ User can't log in?
├──► IP allowed? (BR-UM-24) — IpAllowlistPreProcessor
├──► Status = ACT? (BR-UM-23)
├──► Credentials right?
├──► OTP entered in 60s? (BR-UM-26)
└──► 3 wrong attempts → Locked (BR-UM-27)

│ Send Transaction failing?
├──► CommChannel Active? (Vol 28 Matrix 9 Check 2)
├──► Template Approved AND Meta-Usable? (BR-TM-27)
├──► Wallet has balance? (BR-CC-32)
├──► WalletTypeConfig set? (BR-AM-25)
└──► Contract Detail cell exists? (BR-CC-22)

│ Do Payment failing?
├──► Master Wallet has SAR? (BR-AM-28)
├──► Contract Active with balance? (BR-CC-13)
├──► Priority order conflict? (CommChannelPriorityOrderRequired error)
└──► WalletNotConfigForTheNode?

│ Status changed unexpectedly?
└──► Look in COMMERCE not Provisioning (Wave 5d arch finding)
```

---

## THE ONE-SENTENCE MEMORY MODEL

> **Falcon = Multi-tenant hierarchical Saudi CPaaS where Falcon controls commercial layer (accounts/contracts/pricing/topology) and clients control operational layer (users/payments within their scope/business content). Every monetary action tags to a contract. Status FSMs are system-driven; users trigger transitions but don't set states directly.**

If you remember nothing else, remember this paragraph.

---

## Continuous mining queue update

Volumes 1-29 = 148 entries.

Remaining:
- Vol 30: Cross-module cascade matrices
- Vol 31: Error × Cause × Recovery matrix

---

*Falcon Brain Forever-Wave · Vol 29 (Memory Card) written 2026-05-18 · 10 mnemonic cards + one-sentence model.*
