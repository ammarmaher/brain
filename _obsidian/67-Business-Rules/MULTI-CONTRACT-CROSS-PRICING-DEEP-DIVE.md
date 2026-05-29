---
type: atomic-note
cluster: 67-business-rules
source: "[BRAIN-OUT] Vol 45 §4 (canonical algorithm + worked example) + [CODE] AllocateOcsMonetaryBucketsPolicy.cs:35-46"
created: 2026-05-18
status: canonical-code-verified
tags:
  - business-rules
  - specialist/multi-contract
  - br-cc-31
  - canonical
---

# Multi-Contract Cross-Pricing — Deep Dive

> Atomic deep-dive note for BR-CC-31 (refined wording). Read this whenever you touch contract pricing, wallet deduction, or balance reservation code.

## The rule (one sentence)

When a transaction spans multiple contracts, **each portion is priced at its own contract's rate** — Falcon walks contracts in nearest-expiry order and pays for the fraction each can fund at that contract's per-action rate; total cost is the sum, not a blended rate.

## The worked example (BRD-extracted)

**Setup:**
- C#1 (older): WA-Mark rate = **1.5 SAR/msg**, remaining balance = **1.25 SAR**
- C#2 (newer): WA-Mark rate = **0.75 SAR/msg**, remaining balance = **5.0 SAR**
- Send 1 WA-Mark message

**Math:**
- C#1 funds `1.25 / 1.5 = 0.833...` of the message at 1.25 SAR.
- C#2 funds the remaining `(1 - 0.833) = 0.167` of the message at `0.167 × 0.75 = 0.125` SAR.
- **Total deducted = 1.25 + 0.125 = 1.375 SAR.**

## The algorithm (pseudocode mirroring code)

```
function ConsumeBalance(needed, action, account):
  remaining = needed  // denominated in transaction units
  sources = []

  for each contract in ActiveContracts(account).OrderBy(c => c.ExpiresAt):
    if remaining == 0: break

    rate = contract.RatesFor(action)        // per-contract rate
    available = MW[account, contract.id]
    if available == 0: continue

    fraction = min(1.0, available / (rate × remaining))
    funded = fraction × remaining
    cost = funded × rate

    MW[account, contract.id] -= cost
    remaining -= funded
    sources += { contractId, units: funded, cost, rate }

  if remaining > 0:
    rollback(sources)                       // atomicity
    throw InsufficientBalance

  return FundingDecision { sources, totalCost: sum(sources.cost) }
```

## Code citation

[CODE] `AllocateOcsMonetaryBucketsPolicy.cs:35-46` — `.OrderBy(b => b.ExpiresAt)` loop with shortfall throw `InsufficientBalance`. Reused by `DirectDebitHandler`, `TransferBalanceHandler`, `BuildOcsUsageReservationPlanPolicy`.

## Edge cases

| Case | Behavior |
|---|---|
| `needed == 0` | Return success with empty sources, no debit |
| `eligibleContracts.empty()` | Throw `WalletNotConfigForTheNode` |
| One contract covers the whole | Single source, single rate, simplest path |
| Crosses N contracts | N sources in funding decision |
| Single message split across 3 contracts | Possible — same algorithm produces 3 sources |
| Last contract zero balance | Loop `continue`, no contribution |
| **Rate = 0** for a contract | Special-case: treat as "free under this contract"; fund full remaining for $0 |
| Contract expires mid-flow | Race — handled by reservation TTL + optimistic concurrency |

## Why this matters

If you write **blended-rate** pricing code, you violate MC-TT-02 and produce wrong invoices. Test cases must include:
- Single-contract spans (basic case)
- Cross-contract spans (the §4.2 math)
- Three-contract spans (rare but possible)
- Exhausted contract skipped
- Zero-rate contract handled

## Cross-references

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Multi-Contract Cross-Pricing (MC-TT-01..06)
- [[WALLET-SPECIALIST-HUB]] — wallet entry point
- [[Vol 45 — Wallet Specialist Guide]] §4 (full algorithm + edge cases)
- [[03 Contract Packaging Charging Billing]] — Module 03 entity
- [Wave 11 code mining report](../../../Brain%20Outputs/reports/night-shift/2026-05-17/WAVE-11-CODE-MINING-WALLET.md)
- BR-CC-31 (refined wording) — see [Vol 36 §VOL44-CROSS-REF](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-36-MODULE-03-CONCLUSION.md)

#br-cc-31 #multi-contract #canonical #specialist/wallet
