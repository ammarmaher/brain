---
type: per-module-conclusion-knowledge
volume: 36
module: 03-contract-packaging-charging-billing-management
title: "Module 03 — Contract & Cost Management CONCLUSION KNOWLEDGE"
purpose: "Master answer key for everything related to contracts, rate cards, contract details matrix, addons, charging, wallet impacts."
authority: "CANONICAL for Module 03 — supersedes earlier volumes on conflict"
prd-source: "Contract & Cost Management V2 (Drive sync 2026-04-24)"
known-scope-gap: "Folder named 'Contract, Packaging, Charging, Billing Mngmnt' but PRD-03 V2 body covers ONLY Contract + Cost. Packaging and Billing are absent — Q-CC-01"
---

# Module 03 — Contract & Cost CONCLUSION

> Master answer key for: contracts, rate cards, contract details matrix, addons, status FSM, wallet impacts, charging algorithms.

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **Contract & Cost Management owns the commercial contract layer between Falcon and clients. A contract is a Falcon-only-created (BR-CC-01) commercial agreement with: name (≤50) + Farabi Reference ID (≤50) + startDate (≥today) + expirationDate (>startDate AND >now) + committedValue (SAR, positive float) + status (auto-derived from dates: Pending/Active/Expired). The contract has 4 structural parts: (1) Info, (2) Rate Card per CommChannel (SAR↔Points conversion), (3) Contract Details matrix (Application × CommChannel × Priority × Destination × cost), (4) Addons (sub-service quotas + overage rates). Status FSM is system-driven: PEN→ACT when startDate reached; ACT→EXP when expirationDate reached. Extension beyond now flips EXP→ACT and restores wallet records to lump-sums (BR-CC-17). Editable fields are status-aware: PEN = everything; ACT = limited (Farabi/Expiration/RateCard/ContractDetails/Addons but NOT Name/Value/StartDate); EXP = same as ACT plus extension. Send Transactions iterate nearest-expiring Active contracts for deductions (BR-CC-31). Every monetary action tags contractId for SAMA audit. The module's biggest scope gap is BR-CC-41 — Packaging + Billing are in the folder name but absent from V2 PRD body — Q-CC-01 OPEN. The Refund flow is silent in PRD (Q-CC-49 OPEN) — refunds today are off-platform via finance team. Multiple Active contracts simultaneously are allowed (BR-CC-39); tie-breaker on equal expirationDate is silent (Q-CC-42 OPEN).**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities (per [BRAIN-OUT] `prd/modules/03-.../ENTITIES.md`)

| Entity | Key fields | Status FSM |
|---|---|---|
| **Contract** | id, farabiRefId (≤50), name (≤50), accountId, startDate, endDate/expirationDate, valueSar, remainingValueSar (auto), createdAt, status | Pending → Active → Expired (auto) |
| **RateCardEntry** | contractId, commChannelId, priceUnit (predefined), priceValueSar | n/a |
| **ContractDetail** | contractId, applicationId, commChannelId, priority, destination, costSar | n/a |
| **Addon** | contractId, subServiceType, freeCreditValue, rateCardValue | n/a |
| **WalletRecord** (defined in 01, load-bearing here) | id, walletId, contractId, valueSar, createdAt | Live (records survive Expired) |
| **PriceUnit** | id, name, code (DB-editable per BR-CC-21) | n/a |
| **Destination** | id, code, name, countryCode | n/a |
| **Priority** | id, commChannelId, name (per-CommChannel) | n/a |

### Backend DTO mapping (corrected by code reading)

The backend uses richer DTOs than PRD prose:
- `CreateContractRequest` ← maps to multiple PRD concepts
  - `Rates[]` (ContractRateRequest) → ContractDetail (Application × Channel × Priority × Destination)
  - `UnitConversions[]` (ContractUnitConversionRequest) → RateCardEntry
  - `Quotas[]` (ContractQuotaRequest) → Addon free-credit
  - `OverageRates[]` (ContractOverageRateRequest) → Addon rate-card

[CODE] Commerce `ContractsController.cs`

### Status enums

- **Contract.status:** Pending, Active, Expired (BR-CC-11) — auto-derived from dates, NOT user-settable
- **eCurrency:** SAR (only currency used in PRD)

---

## §3 — WORKFLOWS

### W1 — Create Contract (4-step wizard, Falcon-only)
**Steps:** Info → Rate Card → Contract Details → Addons → save
**Status:** ✅ FULLY MINED — `understanding/pages/add-contract/` (Wave 4)

### W2 — Edit Contract (status-aware)
**Rules:** PEN editable everything; ACT editable limited; EXP editable + extension restores
**Status:** ✅ MINED — `understanding/pages/edit-contract/` (Wave 4)

### W3 — Auto Status Transitions (system-driven)
**Cascade:** Background job detects date-passing; flips status; publishes Kafka events
**Status:** ✅ Cascades 6, 7 in Vol 30

### W4 — Contract Extension
**Cascade:** EXP→ACT on future expirationDate; WalletRecords re-enter lump-sums
**Status:** ✅ Cascade 8 in Vol 30

### W5 — Send Transaction (charging)
**Algorithm:** Nearest-expiring Active contract; iterate per recipient; tag contractId
**Status:** ✅ Cascade 10 in Vol 30 / BR-CC-32

### W6 — Activate/Purchase from Addons
**Logic:** Free-credit first, fallback to addon rate card, then Master Wallet
**Status:** ✅ BR-CC-33/34

### W7 — Transfer Balance (with contract-ID preservation)
**Cascade:** Per role × topology; nearest-expiring records pulled; contract IDs preserved
**Status:** ✅ Cascade 11 in Vol 30 / BR-CC-35

### W8 — Activate/Renew CommChannel/App
**Logic:** Master Wallet first (Single); priority cascade (Multiple)
**Status:** ✅ BR-CC-36 + Vol 30 Cascade 9

---

## §4 — BUSINESS RULES (40 confirmed + 10 OPEN)

### Contract Structure & Validation (BR-CC-01..10)
- Falcon-only creates (BR-CC-01)
- 4 wizard steps (BR-CC-02)
- Contract ID auto-generated unique (BR-CC-03)
- Farabi Reference ID ≤50 chars (BR-CC-04)
- Contract Name ≤50 mandatory (BR-CC-05)
- Start Date ≥ today (BR-CC-06)
- Expiration Date > startDate AND > now (BR-CC-07)
- Value (SAR) positive float ≤ hundreds of millions (BR-CC-08)
- Remaining Value auto-calculated (BR-CC-09)
- Status auto-derived from dates; users CANNOT set directly (BR-CC-10)

### Statuses (BR-CC-11..14)
- Pending / Active / Expired
- Pending: startDate future; valueSar NOT in Master Wallet; Remaining = NA
- Active: startDate reached; value charged to Master Wallet
- Expired: records retained but excluded from lump-sums; Remaining hidden from client

### Edit Restrictions (BR-CC-15..17)
- Pending: edit everything
- Active/Expired: edit Farabi/Expiration/RateCard/ContractDetails/Addons; LOCKED Name/Value/StartDate
- Extension of Expired beyond now → flips to Active

### Rate Card (Step 2) (BR-CC-18..21)
- Per visible CommChannel
- Price Unit from predefined list (Falcon-set, client view-only)
- SAR → Points conversion: `balance_in_points = sum(wallet_balance_sar / rate_card_price_value)`
- Applies to: Multiple-wallet accounts OR Single-wallet with EXACTLY ONE active commchannel
- Price-unit list DB-editable (no deployment)

### Contract Details Matrix (Step 3) (BR-CC-22..26)
- Cost = f(Application × CommChannel × Priority × Destination) → SAR
- WhatsApp priorities: Authentication, Utility, Advertisement, Service (Service tentative)
- Voice priorities: High, Normal, Very Low
- AI: no Priority, destination = Global
- Destinations from `International Phone# Destination List`

### Addons (Step 4) (BR-CC-27..29)
- 2 parts: Sub-services addon rate card + Free credit per sub-service or per commchannel/app
- Free-credit exhausted → fall back to addon rate-card
- Zero-value rate card = treated as free

### Wallet Impact / Charging Logic (BR-CC-30..39)
- Every balance-affecting action tagged with contractId (BR-CC-30)
- Nearest-expiring Active contract first (BR-CC-31)
- Send Transaction algorithm (BR-CC-32)
- Activate/Purchase Single-wallet: addons rate card of newest active contract; fallback nearest-expired (BR-CC-33)
- Activate/Purchase Multiple-wallet: same but with Master → CommChannel priority cascade (BR-CC-34)
- Transfer always pulls nearest-expiring; destination inherits contractId (BR-CC-35)
- Activate/Renew cascade similar to Addons (BR-CC-36)
- Contract value flows to Master Wallet on Active (BR-CC-37; cross-ref BR-AM-35)
- On Expiration: records excluded from lump-sums (BR-CC-38)
- Multiple Active contracts simultaneously allowed (BR-CC-39)

### Roles & View Visibility (BR-CC-40)
- AO views contracts: Remaining visible Active / NA Pending / hidden Expired

### OPEN questions (10)
- **BR-CC-41** [OPEN] — Packaging + Billing scope absent from V2
- **BR-CC-42** [OPEN] — Tie-breaker when multiple Active contracts share Expiration Date
- **BR-CC-43** [OPEN] — Concurrent send-transaction locking on shared wallet
- **BR-CC-44** [OPEN] — Tax/VAT handling
- **BR-CC-45** [OPEN] — Remaining Value real-time vs eventually-consistent
- **BR-CC-46** [OPEN] — Audit log granularity for contract edits (SAMA gap)
- **BR-CC-47** [OPEN] — Retroactive treatment when Expired contract extended (charges in expired window?)
- **BR-CC-48** [OPEN] — Cancellation of Pending contracts
- **BR-CC-49** [OPEN] — Refund flow (off-platform today)
- **BR-CC-50** [OPEN] — Addons rate card fallback when no matching addon

---

## §5 — PERMISSIONS MATRIX (Module 03 specific)

| Action | SA/PR | OP | AO | NA | NU |
|---|---|---|---|---|---|
| Create Contract | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Contract (Pending) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Contract (Active) | ✅ (limited fields) | ❌ | ❌ | ❌ | ❌ |
| Edit Contract (Expired) | ✅ + Extension restores | ❌ | ❌ | ❌ | ❌ |
| View Contract List | ✅ | ✅ | ✅ | ✅ (per scope) | ❌ |
| View Contract Detail | ✅ all fields | ✅ | ✅ (Remaining: Active visible / NA Pending / hidden Expired) | ✅ | ❌ |
| Send Transaction (consumer) | n/a | n/a | n/a | n/a | ✅ |
| Background auto-transitions | system | system | system | system | system |

---

## §6 — WHAT'S IMPLEMENTED (verified)

✅ **ContractsController** (Wave 5a) — 4 endpoints, hard-codes `RemainingBalance=null` in list (gap)
✅ **add-contract page** — `understanding/pages/add-contract/` (Wave 4)
✅ **edit-contract page** — `understanding/pages/edit-contract/` (Wave 4)
✅ **contracts-list page** — `understanding/pages/contracts-list/` (Wave 4)
✅ **wallets-and-balance-management page** — `understanding/pages/wallets-and-balance-management/` (Wave 4)
✅ **DTO mapping verified** — Backend DTOs richer than PRD prose; mapping is consistent
✅ **Currency: SAR-only** — eCurrency enum (verified)
✅ **Status FSM** — auto-transitions (Pending→Active on startDate; Active→Expired on expirationDate)
✅ **Background scheduler** — date-driven status flips
✅ **Charging service** integration for deduction algorithm

---

## §7 — WHAT'S NOT IMPLEMENTED / OPEN GAPS

🔴 **Packaging + Billing scope absent** (BR-CC-41) — folder name implies but PRD body doesn't cover
🟡 **Refund flow not in PRD** (BR-CC-49) — refunds today are off-platform via finance team
🟡 **Contract edit audit log MISSING** (BR-CC-46) — SAMA compliance gap; recommend ContractEditHistory table
🟡 **Contract tie-breaker rule MISSING** (BR-CC-42) — risk of non-deterministic deduction order
🟡 **Concurrent transaction locking strategy UNDEFINED** (BR-CC-43) — risk under high concurrency
🟡 **Tax/VAT handling silent** (BR-CC-44)
🟡 **`ContractsController.RemainingBalance=null` hard-coded** (Wave 5a finding) — should compute properly
🟡 **No multi-currency support** — SAR-only (limits international expansion)
🟡 **Voice priorities + AI specifics deferred** (Q-TM-01/08 in module 05)
🟡 **Cancellation of Pending contracts not in PRD** (BR-CC-48)

---

## §8 — CROSS-MODULE DEPENDENCIES

| Direction | Flow |
|---|---|
| **03 → 01** | Contract value flows into Master Wallet on Active (BR-CC-37 / BR-AM-35) |
| **01 ↔ 03** | Master Wallet abstract aggregate of Active contract records |
| **03 → 04** | Contact Group + Templates are inputs to Send Transaction |
| **03 → 05** | Templates need to be linked via CommChannel + Priority |
| **03 → Farabi** | Each contract carries Farabi Reference ID (≤50) for external billing sync (BR-CC-04) |
| **03 → SAMA** | Every balance-affecting action tagged with contractId — audit-trail compliance |

---

## §9 — TOP 10 BUSINESS QUESTIONS

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | Who can create a contract? | Falcon SA + PR only | BR-CC-01 |
| 2 | What's the 4-step wizard? | Info → Rate Card → Contract Details → Addons | BR-CC-02 |
| 3 | What's editable on an Active contract? | Farabi/Expiration/RateCard/ContractDetails/Addons; LOCKED Name/Value/StartDate | BR-CC-16 |
| 4 | What happens when contract expires? | Records retained but excluded from lump-sums; Remaining hidden from AO; extension restores | BR-CC-14/17/38 |
| 5 | Which contract drains first? | Nearest-expiring Active contract | BR-CC-31 |
| 6 | Can multiple Active contracts coexist? | YES — BR-CC-39 | BR-CC-39 |
| 7 | What's the Contract Details matrix? | 4D: Application × CommChannel × Priority × Destination → SAR cost | BR-CC-22 |
| 8 | Can we refund a contract? | NOT on platform (Q-CC-49 OPEN) — refunds are off-platform via finance | BR-CC-49 |
| 9 | Where's Packaging + Billing in this PRD? | NOT in V2 body (BR-CC-41 OPEN scope gap) | BR-CC-41 |
| 10 | Are contract edits audit-logged? | NOT today (BR-CC-46 OPEN) — SAMA compliance gap | BR-CC-46 |

---

## §10 — MODULE 03 NEW INSTRUCTIONS

1. **Contract auto-status transitions are non-negotiable** — never expose a status setter to users
2. **Nearest-expiring rule applies everywhere** — Send Transaction, transfers, addons, payments
3. **Multi-contract is the norm** — never assume "one Active contract per account"
4. **Contract value LOCKED post-Active** — no mid-contract value bumps (clients must sign new contract)
5. **Extension is the recovery path** — EXP→ACT via date edit restores records
6. **Tie-breaker on equal expDate** — OPEN; document the behavior the moment it surfaces
7. **Refunds are operational, not platform** — finance team handles via bank refund or credit memo
8. **ContractEditHistory needs building** — SAMA audit gap closer
9. **`RemainingBalance=null` in ContractsController** — fix this (computes wrong values today)
10. **All contract edits must be Falcon-only** — never let client roles edit contracts

---

## §11 — CROSS-LINKS

- [BRAIN-OUT] `prd/modules/03-contract-packaging-charging-billing-management/`
- [BRAIN-OUT] `understanding/pages/{contracts-list,add-contract,edit-contract,wallets-and-balance-management}/`
- [BRAIN-OUT] `understanding/backend/commerce/controllers/ContractsController/`
- [BRAIN-OUT] `understanding/backend/charging/controllers/WalletController/`
- [Atlas] Vol 2 Scenarios 8-10 · Vol 6 Scenarios 25-29 · Vol 28 Matrix 4 · Vol 30 Cascades 6-8, 10

---

*Vol 36 · Module 03 Contract & Cost CONCLUSION · 2026-05-18 · Truth-grounded · Source-prefixed · Packaging+Billing scope gap acknowledged.*


---

## §VOL44-CROSS-REF (Added 2026-05-18)

> **BR-CC-31 has been refined by Vol 44 §2.5.** The version of BR-CC-31 elsewhere in this module is now historical and superseded by the wording below. The worked example in Vol 44 §2.3 is now canonical.

### BR-CC-31 (canonical wording, replaces prior versions)

When a transaction is funded:
1. Walk active contracts in nearest-expiry order.
2. For each contract, attempt to consume the full transaction at THAT contract's per-action rate.
3. If the contract's remaining balance covers only a fraction `f` of the transaction, consume `f` worth from it.
4. Move to the next contract and price the remaining `(1-f)` fraction at THAT contract's rate.
5. Continue until the transaction is fully priced or all eligible contracts are exhausted (in which case → **abort**).

### Worked example reference
`Vol 44 §2.3` — two-contract WA-Mark KSA deduction (C#1 1.5 SAR/msg with 1.25 SAR remaining + C#2 0.75 SAR/msg) → 1.25 + 0.125 = **1.375 SAR** effective deduction.

### Cross-contract pricing rule (NEW from Vol 44)
**MC-TT-02:** When a transaction spans two contracts, each portion is priced at its OWN contract's rate — not blended, not averaged. This is the explicit refinement that supports per-contract rate cards.

### Master Wallet structure clarification (NEW from Vol 44)
**MC-TT-04:** Master Wallet stores **per-contract balances** (not a single SAR pot). Columns `MW C#1` and `MW C#2` are independent. Transfers from MW to CommChnl wallets preserve contract identity (MC-TT-05).

### Open Q-CC-12
"Are WA Auth/Util/Mark per-contract rates stored on the Contract entity or derived from a Plan template?" — tracked in Vol 44 §11.

