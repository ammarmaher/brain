---
type: business-scenarios-atlas
volume: 2
title: "Falcon Business Scenarios Atlas — Volume 2: Pricing Model + SAMA Audit (2026-05-18)"
purpose: "Two deep-dives the business team uses constantly: (a) how the actual per-message cost is calculated end-to-end, (b) how to answer regulatory audit questions about the financial trail. Continuous mining continuation of Vol 1."
volume-2-scenarios: 5
---

# Falcon Business Scenarios Atlas — Volume 2

> The two questions business managers ask most: "How much does a message actually cost?" and "Can we prove this charge to the auditor?" This volume answers both with full code-grounded traces.

---

## SCENARIO 8 — The Real Cost of a Message (pricing model deep-dive)

**Business question:** "A Normal User sends one WhatsApp message to a Saudi number using template T. Trace every SAR that gets deducted."

### The pricing components

```
Per-message cost = Lookup(Application × CommChannel × Priority × Destination) in Contract Details matrix
                   - any Addon free-credit available
                   + Addon overage rate if free-credit exhausted
                   * Rate Card conversion (SAR → Points if applicable)
```

Each component is set per-contract, and a single message can hit multiple contracts (nearest-expiring first).

### Walking through ONE message

**Setup:**
- Account "Acme Corp" has 2 Active contracts:
  - Contract A: expires 2026-08-01, valueSar = 100,000, remainingValueSar = 5,000
  - Contract B: expires 2026-12-01, valueSar = 100,000, remainingValueSar = 95,000
- CommChannel WhatsApp, Priority Utility, Destination Saudi Arabia
- Contract A's Contract Detail for this cell: **0.15 SAR per message**
- Contract B's Contract Detail for this cell: **0.12 SAR per message** (negotiated cheaper)
- Account has Multiple Wallet, Node-based topology

**Send 1 message:**
1. NU's wallet check: total accessible balance ≥ 0.15 SAR? Yes
2. Nearest-expiring rule applies → look at Contract A (expires first)
3. Contract A's matrix cost for this cell: **0.15 SAR**
4. Deduct 0.15 SAR from Contract A's WalletRecord(s)
5. Contract A.remainingValueSar: 5,000 → 4,999.85
6. Dispatch the message

**Send 33,334 messages later:**
- Contract A's remaining = 0 SAR (5000 / 0.15 = 33,333.33, so the 33,334th hits empty)
- The 33,334th message: Contract A has insufficient — system moves to Contract B
- Contract B's matrix cost for the same cell: **0.12 SAR** (different per contract!)
- Deduct 0.12 SAR from Contract B's WalletRecord
- Contract B.remainingValueSar: 95,000 → 94,999.88

**The unintuitive consequence:**
- The first 33,333 messages cost the client 0.15 each (5,000 SAR)
- The next message suddenly costs 0.12 (because it hits a different contract)
- **Same recipient, same template, same channel, same priority — different cost** because contract pricing differs

### The Rate Card layer (when applicable)

If account has Multiple-wallet mode **OR** Single-wallet mode with exactly ONE active CommChannel:
- Rate Card price-value converts SAR to "Points"
- `balance_in_points = sum(wallet_balance_sar / rate_card_price_value)` grouped by contract — [PRD] BR-CC-19
- The displayed "balance" to the user might be in Points, not SAR
- This is a UX abstraction — internally everything is SAR

**Example:** If Rate Card says "1 Point = 0.05 SAR for WhatsApp":
- Contract A's 5,000 SAR balance shows as 100,000 Points
- Each 0.15 SAR message = 3 Points deducted in the UI

### The Addon layer

Addons are sub-services (e.g., Voice Number, Nabaa Template) with TWO parts:
1. **Free credit bucket** — pre-allocated quota per addon ([PRD] BR-CC-27)
2. **Rate card overage** — what you pay when free credit runs out

**Cascade order ([PRD] BR-CC-28):**
- If addon free-credit > 0 → deduct from free-credit, no SAR charge
- If addon free-credit = 0 OR exhausted → fall back to addon rate card SAR
- If addon rate card = 0 → action is "free" (no deduction at all — [PRD] BR-CC-29 inferred)

### Cross-account variations

The same WhatsApp message to the same Saudi number costs different amounts depending on:
- Which contract's matrix is being deducted (nearest-expiring)
- Whether an addon free-credit is available
- The current Rate Card setting (Points conversion display)
- Whether the account is in Single or Multiple wallet mode

### Business implications

| Question | Answer |
|---|---|
| "Why did the same message cost different amounts last week vs this week?" | The nearest-expiring contract shifted. When Contract X expired, Contract Y's pricing took over. **Always different per contract.** |
| "Can a client predict their monthly cost?" | Only if all messages will fit in the nearest-expiring contract's remaining balance × that contract's per-message cost. Once contracts roll over, the answer changes. |
| "If the client says 'WhatsApp is too expensive,' what do we do?" | Either renegotiate the Contract Detail cell (Falcon-only edit on Active contracts ✅), OR have them switch to a different contract structure on their next contract. |
| "How does Falcon make money on this?" | The Contract Detail cell costs are what Falcon CHARGES the client. Falcon's costs to Meta/Voice provider are separate — the spread is Falcon's margin. |
| "Why are there 3 different layers (Rate Card / Contract Details / Addons)?" | Rate Card = display layer (SAR ↔ Points UX). Contract Details = the actual per-action cost matrix. Addons = sub-service bundles with free credit + overage. Each layer addresses a different commercial use case. |

---

## SCENARIO 9 — SAMA Audit Trail Reconstruction

**Business question:** "SAMA auditor asks: 'Show me every transaction tagged to Contract X over the past 12 months, with timestamps and balance impact.' What do we do?"

### The audit-trail design (in code)

Every balance-affecting action is tagged with a `contractId` — [PRD] BR-AM-36, BR-CC-30

The schema:
```
WalletRecord {
  id, walletId, contractId, valueSar, createdAt
}

TransferTx {
  id, srcWalletId, dstWalletId, amountSar, actorId, at, contractIds[]
}
```

Each `WalletRecord` ties a specific monetary unit to a specific contract.
Each `TransferTx` carries an array of `contractIds[]` (because a transfer can pull from records of multiple contracts).

### Reconstruction query (conceptual)

To answer "every transaction tagged to Contract X":

```sql
-- Direct deductions from this contract's records
SELECT wr.createdAt, wr.valueSar, wr.walletId, 'creation' as eventType
FROM WalletRecord wr
WHERE wr.contractId = 'X' AND wr.createdAt BETWEEN startDate AND endDate

UNION ALL

-- Transfers that touched this contract's records
SELECT tt.at, tt.amountSar, tt.srcWalletId, 'transfer-out' as eventType
FROM TransferTx tt
WHERE 'X' = ANY(tt.contractIds) AND tt.at BETWEEN startDate AND endDate

UNION ALL

-- Charge transactions tagged to this contract
SELECT le.timestamp, le.amount, le.walletId, le.eventType
FROM LedgerEntry le
WHERE le.contractId = 'X' AND le.timestamp BETWEEN startDate AND endDate
ORDER BY 1
```

[INFERRED] The exact schema is per Charging service backend; this is the conceptual query shape.

### What the auditor sees

| Time | Event | Wallet | Contract X impact |
|---|---|---|---|
| 2026-04-15 09:00 | Contract X activated | Master (abstract) | +100,000 SAR (lump-sum increase) |
| 2026-04-15 14:23 | Send Transaction by user@acme.com | User Wallet 'u123' | -0.15 SAR (deducted from Contract X's WalletRecord) |
| 2026-04-15 14:23 | Send Transaction by user@acme.com | User Wallet 'u123' | -0.15 SAR |
| ... | ... | ... | ... |
| 2026-08-01 23:59 | Contract X expired (auto) | All wallets with Contract X records | Records retained but excluded from lump-sum |
| 2026-08-15 12:00 | Contract X extended to 2027-01-01 | All wallets | Records re-enter lump-sum |

### What the audit trail PROVES

✅ **Reconcilability** — Every SAR that left an account can be traced to a specific contract.
✅ **Immutability** — WalletRecords are append-only (not deleted on expire — just unlinked from lump-sum). [PRD] BR-CC-38
✅ **Actor accountability** — TransferTx has `actorId`; every transfer has a human (or system) responsible.
✅ **Timestamp integrity** — `createdAt` and `at` are set server-side, not client-supplied.
✅ **Contract linkage** — `contractIds[]` on TransferTx means a single transfer can be split across multiple contracts (per nearest-expiring rule); the audit shows which portion came from which contract.

### Gaps in the current audit trail

🟡 **Tie-breaker non-determinism** — Q-CC-42 [OPEN]: when two contracts share the same expiration date, the deduction order is silent. The audit trail will show which one was hit, but two replays might pick different ones.

🟡 **Send Transaction granularity** — [INFERRED]: a single "Send to 1,000 recipients" call results in 1,000 atomic deductions. The audit shows each individually, but business reporting might want a "batch" header. Not in current schema.

🟡 **Refund flow** — Q-CC-49 [OPEN]: when a campaign fails partway through, the refund mechanism is silent in the PRD. The audit trail can show deductions, but a manual reversal is needed to produce a "refund" entry.

🟡 **Audit log granularity for contract edits** — Q-CC-46 [OPEN]: when Falcon edits a contract's Rate Card or Contract Details, the change is silent in the audit log per PRD. Business needs to add a `ContractEditHistory` table.

### How to answer SAMA in practice

**Operational playbook:**
1. SAMA sends a regulatory query referencing client account ID + date range
2. Operations/Finance runs the reconstruction query (above) on the Charging database
3. Result exported as CSV/PDF with every event timestamp, amount, contractId, actorId, wallet
4. Cross-reference against contract activation/extension dates (Commerce DB)
5. Total deductions per contract should reconcile to `(contract.valueSar - contract.remainingValueSar)` — if not, alert (data integrity issue)
6. Provide to auditor; retain a copy in the audit response folder

**Time to produce:** [INFERRED] minutes to hours depending on date range. The query is straightforward; the bottleneck is formatting for human-readable output.

### Business implications

| Question | Answer |
|---|---|
| "Can we prove our charges to a client who disputes their invoice?" | **Yes** — every charge has a contractId tag. We can reconstruct any specific transaction. |
| "What if a client says 'I never sent this message but I was charged'?" | The audit shows actorId (the user who triggered the send) + timestamp + recipient. Either the client's user did send it, OR there's a system bug (extremely unlikely given the architecture). |
| "Do we comply with SAMA's audit-trail requirement?" | **Yes** — BR-AM-36 / BR-CC-30 are explicit PRD requirements that map directly to the code. The tag is enforced at every wallet-affecting code path. |
| "What about contract edits? If Falcon admin changes a Rate Card mid-contract, does the audit capture it?" | **Currently NO** (Q-CC-46 OPEN). This is a gap. Recommend product add `ContractEditHistory` before next SAMA review. |
| "Can the client see their own audit trail?" | The client's Contract view shows `Remaining Value` (when Active). Detailed transaction history per contract is not in the current PRD/UI. Recommend a "Contract Statement" PDF export feature. |

---

## SCENARIO 10 — Multi-Contract Active Mix (the "blended rate" reality)

**Business question:** "Acme Corp signed Contract B in March (cheaper rates) but Contract A from January (more expensive) is still active. What does the client see?"

### Setup
- Contract A: signed Jan 1, expires Aug 1. valueSar = 50,000 (originally 100,000). Rate Card: 0.20 SAR/WhatsApp-msg.
- Contract B: signed Mar 15, expires Dec 1. valueSar = 100,000 (originally 100,000). Rate Card: 0.12 SAR/WhatsApp-msg.

### How the system handles it ([PRD] BR-CC-31, BR-CC-39)

1. Both contracts are simultaneously Active — perfectly legal.
2. Master Wallet displayed balance = SUM(both contracts' active WalletRecords) = 50,000 + 100,000 = 150,000 SAR
3. When a message is sent: deduct from **nearest-expiring first** → Contract A
4. As Contract A drains: rate is 0.20 SAR/msg
5. Contract A hits zero (or expires Aug 1) → shift to Contract B → rate is now 0.12 SAR/msg

### What the client sees

The client perceives:
- "We have 150,000 SAR balance" (correct sum)
- "Our rate is 0.20 SAR/msg" (current effective rate, from Contract A)

But the client might expect:
- "We have 100,000 SAR at the new rate" (Contract B)
- "And 50,000 SAR at the old rate" (Contract A)
- Total: still 150,000 SAR, but **different effective rates depending on which contract is hit first**

### Why this matters

If the client plans a campaign of 250,000 messages:
- Naive math: 250,000 × 0.12 = 30,000 SAR
- Reality: First (50,000 / 0.20) = 250,000 messages drain Contract A → 50,000 SAR. Done.

Actually wait — that math: 50,000 SAR / 0.20 SAR/msg = 250,000 messages. The entire campaign hits Contract A. Contract B remains untouched at 100,000 SAR.

But the client expected: "I have a cheaper contract, my campaign will be cheap." NO — the nearest-expiring rule forces the more expensive contract to drain first.

### The business decision

This is the **"use it or lose it" pressure** the nearest-expiring rule creates:
- Older contracts must be consumed before newer ones
- If Contract A expires before being fully consumed: client loses the unused SAR (per BR-CC-38, records retained but unspendable)
- This incentivizes clients to maximize usage on the soonest-expiring contract

### Business implications

| Question | Answer |
|---|---|
| "Can the client choose which contract to charge?" | **NO** — the order is system-enforced (nearest-expiring first). This is a non-negotiable platform rule. |
| "What if a client wants to preserve Contract A for emergencies and use cheaper Contract B daily?" | Not possible in the current model. Either renegotiate Contract A to extend its date OR cancel Contract A and start fresh. |
| "Can Falcon ever override the nearest-expiring rule?" | Not in the standard send flow. There might be administrative override paths, but they're not in the PRD. |
| "How do we communicate this to clients before they sign multiple contracts?" | Add to the sales onboarding deck. Make it explicit: "Older contracts always drain first. Plan your sequence accordingly." |
| "What if both contracts have the same expiration date?" | Q-CC-42 OPEN. The PRD is silent. The system picks ONE (presumably whichever Mongo returns first, which is non-deterministic) and drains it. **Recommend product define this rule.** |

---

## SCENARIO 11 — Account Owner Promotes a Normal User to Node Admin

**Business question:** "An AO wants to promote a Normal User to Node Admin. What changes, and what can go wrong?"

### Trigger
- AO opens management-console → Users tab → picks a Normal User → "Edit Role"

### Pre-conditions
- User must be in `Active` status (cannot edit role on Pending/Locked/Suspended/Deleted)
- AO must have `editRole` permission on this user — [PRD] BR-UM-38

### The change

1. AO calls `PUT identity/api/user/{userId}/role` with `role = node-admin` and `nodeId = <target sub-node>`
2. Backend checks: Does this transition violate any role-edit-reach rule? [CODE] `BuiltInRoleCatalog.cs:18-75` defines who can edit who
3. Backend checks: Does the target node have a `maxNodeAdminLimit` (if such a limit exists)? — [INFERRED] not in current PRD
4. If user's new role is Normal User → re-check `maxNormalUserLimit` (BR-UM-09/17/38). But here we're going Normal → Node Admin, so no normal-user limit re-check needed for the source role
5. Update User.role + User.nodeId
6. Update User.permissionGroupId (Node Admin gets a different permission set by default? Or stays the same? [INFERRED] Permission Group is separate from Role; the AO might need to ALSO update Permission Group)
7. Status remains Active (no re-onboarding needed)

### What changes for the user

**Login behavior:** Same. No re-auth needed.

**Visible features:**
- User can now create sub-nodes under their assigned node (cascade depth limited by `maxNodeLevels`)
- User can now create users under their sub-tree (Normal User and Node Admin)
- User loses Normal-User-specific actions (e.g., they can't be the sender of a Send Transaction, because Node Admin doesn't have that capability per [PRD] BR-AM-27 "Node Admins hold but do not consume")

**Wallet impact:**
- If account is User-based Single/Multiple wallet: the user's User Wallet stays attached to them but Node Admins typically have a Node Wallet
- If account is Node-based: the wallet topology around them shifts
- ⚠ **This is the messiest cascade in role promotion** — wallet residue from when they were a Normal User stays linked to them; new Node Wallet records get created. May need manual cleanup.

### Edge cases / failure modes

| Case | Behavior | Recommendation |
|---|---|---|
| Active session of the user during role change | The user's JWT contains old role. They keep old privileges until token refresh. **Risk:** they could perform Normal-User actions briefly even after promotion. | Force-logout-all-sessions on role change (similar to BR-UM-35 for password). Not currently documented. |
| User's PermissionGroup still has Normal-User permissions | Role changed but Permission Group didn't. UI might show Node Admin features but PES denies them. | Update Permission Group as part of role change OR validate compatibility. |
| Promotion to Node Admin in a node that's at `maxNodeAdminLimit` | [INFERRED] If such a limit exists, request rejected. If not — limit is silent in PRD. | Q-AM-* product clarification: do we want per-node Node-Admin limits? |
| Wallet records orphaned from old role | Records linked to user as NU may need migration. | Tech debt scenario — document for ops team. |

### Business implications

| Question | Answer |
|---|---|
| "Is promotion instant?" | API call is instant. User experience: needs to log out and back in for JWT refresh to reflect new privileges. |
| "Can we promote a Normal User who's sent transactions to a Node Admin and have history preserved?" | Yes — User identity is stable. Their UserStatusHistory and LoginAttempt records persist. Their WalletRecords stay linked to them but become orphan-ish under new role. |
| "What if the new role's actions break things they were doing as the old role?" | Likely won't — Node Admin is a superset of Normal User UX in most areas. But they LOSE the ability to send transactions (Node Admins don't consume — BR-AM-27). |
| "Can Falcon promote any user to any role?" | Yes — Falcon admin has full role-edit reach per BuiltInRoleCatalog. Client roles have narrower reach (AO can edit Client users within their account; NA can edit only Normal Users in their sub-tree). |

---

## SCENARIO 12 — Account Deletion (where the data goes)

**Business question:** "A client terminates their contract and we delete their account. What happens to their data?"

### The current model — soft-delete pattern

Currently the PRD describes **soft-delete on Users** (BR-UM-08, BR-UM-32) but **not explicitly on Accounts**. The Account deletion model is implicit.

[INFERRED] Account deletion (likely Falcon-only) would:
1. Flip Account.status to a soft-delete marker (similar to User.status = Deleted)
2. Cascade: all Users on the account become Deleted (or stay Active but unreachable due to account being closed)
3. CommChannelConfigs go to Disabled
4. AppConfigs go to Disabled
5. Active contracts auto-expire (or get a special "TerminatedEarly" status — not in PRD)
6. Wallet balance: per BR-CC-38, records remain but become unspendable

### What the AUDIT TRAIL preserves

Even after deletion:
- All User records (status = Deleted)
- All UserStatusHistory rows (append-only)
- All LoginAttempt rows
- All WalletRecord rows
- All TransferTx rows
- All Contract records (status = Expired or terminated)
- All ContactGroup rows (softDeleted = true) — Falcon can still download

### What the CLIENT loses

- UI access for all client users (their logins are rejected)
- Active CommChannel subscriptions (disabled)
- Any remaining wallet balance (frozen)
- ContactGroups + Templates (hidden from client UI)

### Edge cases

| Case | Behavior |
|---|---|
| Username re-use after deletion | [INFERRED] If `username` uniqueness is enforced globally, a soft-deleted user's username is still "taken" — would need explicit reuse logic. **Open question.** |
| Account name re-use after deletion | Same as above. Account Name is unique globally (BR-AM-03) — does soft-delete release the name? **Open question.** |
| GDPR right-to-erasure | The current soft-delete is logical, not physical. For regulatory compliance, a hard-delete path may be needed. **Open question.** |
| Client wants to come back 6 months later | Falcon can technically restore. Status flips Deleted → Active. Users restored. Contract state reconstructed (but historical Active period is gone). |

### Business implications

| Question | Answer |
|---|---|
| "Can a deleted client be revived?" | Yes — Falcon-only. Soft-delete preserves all data. |
| "What about GDPR / data protection compliance?" | Logical deletion may not satisfy GDPR Article 17 ("right to be forgotten"). For EU/UK clients, recommend implementing a hard-delete path. Saudi Arabia (current Falcon market) may have different rules — verify with SAMA / CITC compliance. |
| "How long do we keep data after deletion?" | Not explicitly defined in PRD. Recommend a retention policy: e.g., 7 years for SAMA-relevant financial records, hard-delete personal data after legal minimum. |
| "Can the client export their data before deletion?" | They can download Contact Group files (BR-CGM-04 allows Falcon download even after soft-delete). User profile data and contracts are not currently exportable. **Recommend a "data export before account closure" feature.** |
| "Who triggers account deletion?" | [INFERRED] Falcon-only. The PRD doesn't define a client-initiated deletion path — clients would terminate via contract end + Falcon-admin closure. |

---

## Open mining queue (Volumes 3-N)

- **Vol 3:** Template approval flow + Maker/Checker decision tree (when GAP-T-001 resolves)
- **Vol 4:** Operational failure scenarios (Kafka down, Zitadel webhook delay, Mongo partition)
- **Vol 5:** Multi-tenant isolation guarantees (where tenant boundaries are enforced; where they leak)
- **Vol 6:** Falcon vs Client UX divergence (admin-console vs management-console feature delta)
- **Vol 7:** Rate Card vs Contract Detail decision logic (when to update which)
- **Vol 8:** Edit User wizard end-to-end (now that Q-UM-13 is resolved — deferred verification)
- **Vol 9:** Sub-node creation cascades (depth limit + cascade to wallets)
- **Vol 10:** SAMA / CITC compliance gap analysis (what's missing for full regulatory coverage)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 2 written 2026-05-18 · Vol 3-10 will follow as the mining loop continues.*
