---
type: business-scenarios-atlas
volume: 6
title: "Falcon Business Scenarios Atlas — Volume 6: Contract Amendment Patterns + Sales Negotiation"
purpose: "Every question that comes up when a client wants to change something about their commercial relationship: extend, expand, downgrade, swap channels, restructure pricing. Grounded in BR-CC-15/16/17 (status-aware edit rules)."
volume-6-scenarios: 5
---

# Falcon Business Scenarios Atlas — Volume 6

> The conversations the sales team has weekly: "can we extend this?", "can we cheapen WhatsApp?", "can we add Voice?", "can we downgrade?". This volume maps every contract amendment scenario to PRD rules + the operational steps.

---

## SCENARIO 25 — Extend an Active Contract Before It Expires

**Business question:** "Client's contract expires next week. They want to extend it 6 months instead of signing a new one. What changes?"

### The mechanism — [PRD] BR-CC-16

For an **Active** contract, the editable fields are:
- `Farabi Reference ID` — for finance team sync
- `Expiration Date` — MUST be > now AND > startDate
- Rate Card `priceValue` per CommChannel
- Contract Details grid (per-cell costSar)
- Addons values

LOCKED fields on Active contracts:
- Name
- Value (`valueSar`)
- Start Date

### What actually happens

1. Falcon admin opens admin-console → Contracts → picks the contract
2. Edits Expiration Date from `2026-06-01` to `2026-12-01`
3. `PUT commerce/Contracts/{id}` with updated expiration
4. Status doesn't change (still Active)
5. `remainingValueSar` doesn't change (still the same SAR amount)
6. WalletRecords don't change (already in Active lump-sums)
7. **What changes for the client:**
   - Their contract is now valid for 6 more months
   - The "nearest-expiring" ordering may shift (if other contracts now expire sooner)
   - All deductions continue against this contract first if it's still nearest-expiring

### What you CANNOT do via "extension"

- ❌ Add more SAR value (would need to bump `valueSar`, which is LOCKED on Active)
- ❌ Rename the contract
- ❌ Change start date

If the client also wants more value, you have two paths:
- **Path A:** Wait for current contract to expire → sign a fresh contract with higher value
- **Path B:** Create a SECOND parallel contract (multiple Active contracts allowed per BR-CC-39) → second contract gets new value + new pricing

### Business implications

| Question | Answer |
|---|---|
| "Can I add 100k SAR to an Active contract?" | **No** — valueSar is locked on Active. Either extend the duration (no money added) or create a parallel contract. |
| "Will the client lose access while the extension is processing?" | No — the edit is a metadata update. Contract stays Active throughout. |
| "Can the client see the extension in their UI?" | Yes — they'll see the new Expiration Date in their Contracts list (AO can view). Remaining Value still visible (Active). |
| "What if I extend an Expired contract?" | Status flips Expired → Active per BR-CC-17. WalletRecords re-enter lump-sums. Effectively a "revive" operation. |

---

## SCENARIO 26 — Lower the WhatsApp Rate for an Existing Contract

**Business question:** "Client says 'WhatsApp is too expensive at 0.20 SAR. Can we drop it to 0.12?' Contract is mid-term Active."

### What's editable mid-Active — [PRD] BR-CC-16

**Yes, you can:**
- Edit Rate Card `priceValue` per CommChannel (the conversion rate)
- Edit Contract Details grid (per-cell costSar — the actual per-action rate)

### The two layers — which one to edit?

| Layer | Edit when | Effect |
|---|---|---|
| **Rate Card price value** | You want to change SAR ↔ Points conversion (UX display, doesn't change actual cost) | Cosmetic |
| **Contract Detail cell** | You want to change the REAL per-message cost | **This is what you want** |

To drop WhatsApp Saudi from 0.20 → 0.12:
- Falcon admin opens the contract → Contract Details tab
- Finds (Application = "Falcon SMS", CommChannel = WhatsApp, Priority = Utility, Destination = "Saudi Arabia") cell
- Updates `costSar` from 0.20 to 0.12
- Saves

### What happens to past and future deductions

- **Past deductions** (already debited at 0.20): unchanged. Audit trail preserved at the old rate.
- **Future deductions** (after this edit): use the new 0.12 rate.
- **`remainingValueSar`** is NOT recomputed retroactively. The contract has whatever SAR is left; messages at the new rate just last longer.

### Edge cases

| Case | Behavior |
|---|---|
| Other CommChannel rates on this contract | Unchanged. Edit is per-cell. |
| Other contracts on the same account | Unchanged. Edit is per-contract. |
| In-flight messages at the moment of edit | They use whatever rate is in DB at deduction time. The transaction is racy but [INFERRED] the rate is read fresh per deduction. |
| Audit log of the edit | 🟡 Currently NOT logged (Q-CC-46 OPEN). Operational risk for SAMA reviews. |

### Business implications

| Question | Answer |
|---|---|
| "If we lower the rate, do clients get a refund?" | **No** — past deductions stand. The rate change applies going forward. |
| "Can the client see we lowered their rate?" | If they're an AO viewing contracts, yes — the matrix shows the current cell value. But there's no "you got a discount" notification unless we build one. |
| "Should we tell the client when we adjust rates?" | Yes — communication is good business. The system won't auto-notify; sales/account-management handles this manually. |
| "What about the audit trail for the rate edit?" | **Currently a gap** (Q-CC-46). Document who/when on a manual change log until backend implements automatic logging. |

---

## SCENARIO 27 — Add a New CommChannel to an Existing Account Mid-Contract

**Business question:** "Client has WhatsApp only. They want to add Voice. Their current contract doesn't have Voice in the matrix. How?"

### The current setup

- Contract is Active
- Contract Details matrix has WhatsApp rows but NO Voice rows (Voice wasn't in scope at signing)
- Account's CommChannelConfig may or may not include Voice (separate from contract)

### Two scenarios depending on configuration

**Scenario A — Voice is in Account's CommChannelConfig but at Visibility=Hide**

1. Falcon admin opens Settings tab → CommChannels → Voice row
2. Edits visibility from Hide → Show, sets pricingType + priceValue
3. Account now sees Voice in their CommChannels tab
4. AO clicks Do Payment → Voice activates
5. **But the current contract has NO Voice Contract Details entries**
6. Send Transaction via Voice → wallet check passes (Master Wallet has SAR) → but Contract Details lookup for Voice fails (no entry)
7. **Likely behavior:** Send fails OR backend uses a fallback cost (e.g., 0 SAR — wrong!) OR uses a Voice cost from a DIFFERENT Active contract

This is an UNDEFINED case in the PRD. **Open question for product team.**

**Scenario B — Voice doesn't exist on Account at all (master CommChannel exists, but no per-account config)**

1. Falcon admin must first ADD Voice to the Account's CommChannelConfig
2. (Where does this happen? Probably the admin-console's Marketplace Applications page or Settings tab — verify)
3. Once added, follow Scenario A's path

### The right approach (recommended)

When a client wants a new CommChannel mid-contract:
1. Sign a NEW contract that includes Voice in its Contract Details matrix
2. New contract becomes Active alongside the existing one
3. Voice Send Transactions deduct against the new contract (since it has the Voice cells)
4. Original contract continues serving WhatsApp

This is cleaner than retrofitting an Active contract.

### Business implications

| Question | Answer |
|---|---|
| "Can we add Voice without a new contract?" | Theoretically: edit the existing contract's Contract Details to add Voice rows. **Practically: the PRD doesn't clearly support this (you'd need to add Voice cells to BR-CC-16 editable list).** Recommend new contract path. |
| "What if a client wants to add a CommChannel that doesn't exist in the master catalog?" | Falcon must first add it to the master catalog (Lookup table / Commerce). Then to the account. Then to a contract. **Multi-step, multi-team workflow.** |
| "Can the client self-add a CommChannel?" | **No** — CommChannel addition is Falcon-admin only (visibility + pricing per BR-AM-25). |
| "Why does this matter for sales?" | Clients expand over time. Anticipate this — write contracts with placeholder Voice/AI rows even if not initially used. Cheaper to have unused matrix cells than to amend mid-contract. |

---

## SCENARIO 28 — Downgrade: Client Wants Less Service

**Business question:** "Client says 'we're cutting back. Stop our SMS service immediately and reduce our WhatsApp commitment.' What can we do?"

### The mechanism — what's possible

1. **Stop SMS immediately** → Falcon admin disables SMS CommChannel on the account
   - Status: Active → Disabled (BR-AM-24, manual transition)
   - Future Send Transactions on SMS reject
   - Existing wallet records linked to SMS-funded contracts remain (audit preserved)
2. **Reduce WhatsApp commitment** → harder

### Why reducing commitment is hard

- The contract has a fixed `valueSar` (locked on Active per BR-CC-16)
- You can't refund part of a contract by editing it (no PRD path)
- The Contract has a fixed expirationDate (editable, but only to extend or shorten)

### Options for "reducing commitment"

**Option A — Shorten the contract's expirationDate to today**
- Per BR-CC-16, expirationDate is editable on Active (must be > now AND > startDate)
- Set expirationDate to today (after current moment) → contract goes Active until exp time today, then Expired
- WalletRecords retain audit but exit lump-sums
- ⚠ **Client loses access to unused SAR** — BR-CC-38 says records are retained but excluded from spend
- This is essentially "terminating early without refund"

**Option B — Negotiate a new contract**
- Mutually agree to a "termination + new lower-tier contract" handoff
- Falcon shortens current contract + signs new smaller-value one
- More client-friendly

**Option C — Refund flow**
- Q-CC-49 [OPEN] — refund flow is not in current PRD
- Operationally: would require manual finance handling outside Falcon (bank refund, credit memo)

### Business implications

| Question | Answer |
|---|---|
| "Can we partially refund a contract?" | **Not in the current platform.** Refunds are off-Falcon (manual finance). The contract is structurally fixed-value. |
| "What's the cleanest 'downgrade' workflow?" | New contract path: terminate current + sign new at lower commitment. Avoids the irrevocable money-loss on early termination. |
| "Will the client be angry if we terminate without refund?" | YES. Communicate clearly: "Per contract terms, early termination means you forfeit unused SAR." Recommend always offering Option B (renegotiate) instead. |
| "Can the client self-disable a CommChannel?" | Account Owner CAN trigger Disable per BR-AM-24 / capability-acc-owner (one of the AvailableActions). Falcon doesn't need to be in the loop for routine disables. |

---

## SCENARIO 29 — The "Renegotiation Mid-Contract" Conversation

**Business question:** "Client wants to renegotiate pricing 6 months into a 12-month contract. Sales team needs to know what's possible."

### The negotiation toolbox (what Falcon can do)

| Lever | Mid-Active editable? | Source |
|---|---|---|
| Lower per-message rate (Contract Details) | ✅ | BR-CC-16 |
| Raise per-message rate (Contract Details) | ✅ technically; commercially questionable | BR-CC-16 |
| Change Rate Card (Points display) | ✅ | BR-CC-16 |
| Adjust Addons (free credit + overage) | ✅ | BR-CC-16 |
| Extend contract duration | ✅ | BR-CC-16/17 |
| Add SAR to contract value | ❌ — locked on Active | BR-CC-16 |
| Reduce SAR commitment | ❌ — no refund path | Q-CC-49 OPEN |
| Change start date | ❌ — locked on Active | BR-CC-16 |
| Rename contract | ❌ — locked on Active | BR-CC-16 |

### Common renegotiation patterns

**Pattern 1 — "Better rate going forward"**
- Lower Contract Details cells
- No refund on already-used SAR at old rate
- Client gets more messages per remaining SAR
- ✅ Fully supported, fast (minutes)

**Pattern 2 — "Add more value"**
- Sign a new parallel contract
- New contract becomes Active
- Multiple Active contracts allowed (BR-CC-39)
- ✅ Supported, requires new contract signing

**Pattern 3 — "Lower commitment, higher per-unit rate"**
- Can't reduce value mid-contract directly
- Workaround: shorten exp date + sign new smaller contract starting later
- Tricky timing; risks gap in service

**Pattern 4 — "Add new CommChannel"**
- See Scenario 27 — new contract preferred

**Pattern 5 — "Restructure entire commercial relationship"**
- Treat as "terminate + restart"
- Old contract loses unused SAR (or, if commercially negotiated, a credit-memo offset on the new contract)

### The "commercial offset" technique

For client retention, Falcon often negotiates an off-platform credit:
- Client has 50,000 unused SAR in an old contract that's about to expire
- Falcon issues a credit memo for 50,000 SAR off the new contract's price
- Old contract expires naturally (audit clean)
- New contract starts with the lower commercial value (which represents net new commitment)
- **Falcon's perspective:** zero data loss, clean audit. Client perspective: continuous service with no money "lost."

### Business implications

| Question | Answer |
|---|---|
| "What's the most common renegotiation pattern?" | Pattern 1 (better rate going forward). Easy, fast, no contract paperwork. |
| "Can we offer 'credits' as a retention tool?" | Off-platform credit memos work. On-platform: cannot add SAR mid-contract. Plan retention deals around the contract boundaries. |
| "What's the operational cost of a renegotiation?" | Minutes for Pattern 1. Hours for Pattern 2 (signing process). Days for Pattern 5. |
| "Audit trail for renegotiations?" | Currently Q-CC-46 [OPEN] — contract edits not logged. Manual change log recommended until backend implements. |

---

## Continuous mining queue update

Volumes 1-6 = 29 scenarios + 4 compliance deep-dives = 33 deep analyses.

Remaining queue:
- **Vol 7:** Data export & client off-boarding playbook
- **Vol 8:** Refund flows (Q-CC-49 OPEN — bring to product)
- **Vol 9:** Sales handoff (sales → onboarding → operations)
- **Vol 10:** Scaling scenarios (1M users / 10M messages/day)
- **Vol 11:** Multi-language Template behavior
- **Vol 12:** Bulk operations design space (Q-UM-11 OPEN)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 6 (contract amendments) written 2026-05-18 · 33 deep-dives total.*
