---
type: business-scenarios-atlas
volume: 7
title: "Falcon Business Scenarios Atlas — Volume 7: Data Export + Client Off-boarding + Refund Reality"
purpose: "Closing the commercial relationship lifecycle. How a client gets their data out, how they leave cleanly, what happens to their money, and where the refund/credit policies stand."
volume-7-scenarios: 4
---

# Falcon Business Scenarios Atlas — Volume 7

> Every business has clients who leave. Some renegotiate (Vol 6). Some just leave. This volume covers the cleanest path out: how do they take their data, how does Falcon close their account, and how do we handle the money trail.

---

## SCENARIO 30 — Client Requests Their Data Before Off-boarding

**Business question:** "Client is leaving. They want to export everything they have on Falcon. What can we give them?"

### What clients OWN (their content)

| Asset | Current export path | Format |
|---|---|---|
| Contact Groups | `GET /api/contact-groups/{groupId}/files/{fileType}` per BR-CGM-04. fileType = `original` (the file as uploaded) OR `validated` (after column normalization) | CSV / XLS / XLSX |
| Templates | ❌ No export endpoint today (Template entity not built — GAP-T-001) | n/a |
| User accounts (their staff who use Falcon) | ❌ No bulk export. Per-user via `GET /api/user/{id}` returns one user at a time | JSON |
| Sent message history | ❌ No public export endpoint in current PRD | n/a |
| Wallet balance / transaction history | ❌ No client-facing export. Falcon-side query possible. | n/a |

### What clients DON'T own (Falcon-owned commercial records)

- Contract records (Falcon's commercial document)
- WalletRecord ledger (Falcon's accounting)
- TransferTx history (Falcon's audit)
- CommChannel master catalog (shared, not client-specific)

These can be **viewed** by client roles (AO sees contracts per BR-CC-40) but not exported as raw data.

### The realistic export bundle today

If a client says "give us everything you have on us":
1. ✅ All Contact Group files (downloadable)
2. 🟡 List of users with their profile data (must script per-user GETs)
3. 🟡 Sent message metadata (need to build a custom query against Charging service)
4. ❌ Templates (don't exist as exportable entities)
5. ❌ Wallet/transaction history (Falcon-internal, would require special export tool)

### Gaps in current export capability

| Asset | Effort to add export | Business value |
|---|---|---|
| User bulk export | LOW — 1 endpoint | HIGH (clients ask for this often) |
| Sent message history | MEDIUM — needs query API | HIGH (campaign reports) |
| Template export | LOW (when Templates exist) | MEDIUM |
| Wallet transaction history client-facing | MEDIUM — formatting + redaction | MEDIUM (audit transparency) |
| Self-service export portal | HIGH — full UI + scheduled exports | HIGH (compliance + retention prep) |

### Business implications

| Question | Answer |
|---|---|
| "Can we say 'yes' to a client asking to export everything?" | **Partially.** Contact Groups yes; most else requires manual work. Be honest in sales conversations. |
| "What's our story for clients about data ownership?" | Client owns: their uploaded content (Contact Groups), their templates (when built), their user list. Falcon owns: commercial records, wallet ledger, audit trail. **Same data sovereignty pattern as Wave 4 finding W4-5.** |
| "If GDPR Article 20 (portability) applies, can we comply?" | **Not fully today.** Major gap for EU expansion. Build a user-data-export feature before EU launch. |
| "How do we handle a SAR (Subject Access Request)?" | Manual process: query Users → query ContactGroups → compile → respond within 30 days. Build a SAR fulfillment tool to scale this. |

---

## SCENARIO 31 — Clean Off-boarding (the cooperative termination)

**Business question:** "Client gave 60 days notice. They want a clean exit. Walk through the operational playbook."

### Phase 1 — Pre-termination (60 → 30 days out)

1. Falcon account manager confirms termination date with client
2. Issue data export bundle (see Scenario 30):
   - Generate all Contact Group files (zip them)
   - Export user list as CSV
   - Generate transaction history report (if requested)
3. Notify client's Account Owner of the timeline
4. Identify contracts with end dates beyond termination → discuss what to do
   - Option A: Run contracts to their natural expiry (client retains service)
   - Option B: Shorten contracts to terminate alongside Falcon engagement (forfeits unused SAR)
   - Option C: Issue credit memo for unused SAR (off-platform commercial offset)

### Phase 2 — Service wind-down (30 → 1 day out)

1. Client's Normal Users may continue sending messages until their contract balance depletes or contract expires (whichever is first)
2. No new CommChannel activations
3. Falcon admin disables Edit/Delete/Add actions on the client's account in admin-console (operational courtesy, not technical lockout)
4. Final data export refresh on Day -1

### Phase 3 — Termination (Day 0)

1. Falcon admin sets all Active contracts' `expirationDate = now` → all flip to Expired
2. CommChannel Active subscriptions enter grace period → 7/30 days of residual service
3. Account Owner user notified
4. All client users continue to be able to log in (status remains Active) but cannot perform actions because:
   - Contracts are Expired → no wallet balance available for transactions
   - CommChannels enter grace → still usable for the grace window

### Phase 4 — Post-termination wind-down (Day 0 → +30 or +60 days)

1. Grace periods elapse → CommChannels go to InActive (Grace Period Ends)
2. Templates (if any) become unsubmittable
3. Falcon admin chooses: delete users (soft-delete) OR leave them Active for potential re-onboarding
4. Final audit: confirm all WalletRecords settled, all contracts Expired, all CommChannels in InActive states

### Phase 5 — Account closure (typically +90 days after Day 0)

1. Falcon admin (system or product role) closes the Account
2. [INFERRED] Likely the Account is **soft-deleted** (status flag) — preserves audit data
3. Client name + financeId remain in the system but the account is "frozen"
4. Eventually (per retention policy, 7-10 years for SAMA), data may be hard-deleted

### Edge cases

| Case | Behavior |
|---|---|
| Client's last contract is mid-Active on termination day | Two options: let it run to natural exp date (client retains service longer than termination) OR shorten exp to today (forfeits unused SAR) — sales decision |
| Active CommChannel pending payment | Block the payment by disabling the CommChannel before settle |
| Pending user accounts (never activated) | Soft-delete them along with the account |
| Pending Templates (not approved) | n/a today (Templates unbuilt) — when built, mark them rejected/cancelled |

### Business implications

| Question | Answer |
|---|---|
| "What's the standard off-boarding timeline?" | 60 days notice → 30 days service wind-down → grace periods (7-30 days) → 90 days post-termination → archival. **Total: 90-120 days from notice to closure.** |
| "Can a client re-onboard after termination?" | Soft-delete preserves data. Falcon-only restore. Recommend: handle as a new sales motion (new contract, fresh credentials) but with continuity benefits (same Account ID, retained Contact Groups). |
| "What if a client just ghosts (stops paying, stops responding)?" | Same end-state but operationally messier: contracts naturally expire, CommChannels go through grace, users still logged in but can't act. No formal data export issued. Documentation: have a "deemed-terminated" trigger after 90 days of zero activity. |
| "How do we handle off-boarding if there's a payment dispute?" | Hold the off-boarding pending dispute resolution. Operations decides per legal/compliance team. The Falcon platform doesn't have a "frozen for dispute" state today — operational workaround. |

---

## SCENARIO 32 — Refund Flow (Q-CC-49 OPEN — what happens off-platform)

**Business question:** "Client paid 100,000 SAR up front for a contract. They got 30,000 SAR of value before terminating. Where does the 70,000 SAR go?"

### Per current PRD — what the platform does

Per BR-CC-38 + BR-AM-38:
- Contract expired (whether naturally or by early termination via expirationDate edit)
- WalletRecords linked to this contract are **retained** in the database (audit)
- BUT excluded from all wallet lump-sum values going forward
- The 70,000 SAR is no longer "spendable" by anyone
- The records are not deleted — they're permanent audit history

### What's MISSING — refund mechanics

Q-CC-49 [OPEN] from the Contract & Cost PRD: refund flow is silent.

There is NO platform-side mechanism to:
- Convert frozen WalletRecords back to refundable money
- Issue a credit memo within the platform
- Decrement the contract's `valueSar` retroactively
- Tag the records as "refunded" vs "expired"

### How this is handled in practice (operational)

**Option A — Off-platform refund**
- Finance team issues a bank refund for the unused 70,000 SAR
- The Falcon platform shows the contract as Expired with frozen records
- Operations may add a comment to the contract noting "refunded off-platform"
- ⚠ **No platform-side audit trail for the refund itself**

**Option B — Credit-memo offset on a new contract**
- Client signs a new contract for, say, 30,000 SAR commitment
- Falcon discounts the new contract's price by 70,000 SAR (the "refund" via credit)
- The new contract has full SAR value on paper but the client paid only 30,000 SAR in cash
- ⚠ **The platform sees both contracts at face value; the offset is in finance records, not Falcon DB**

**Option C — No refund, contractual forfeit**
- Per contract terms (sales-side), unused SAR is forfeited on early termination
- Falcon takes the upside (good for revenue, bad for client relationships)
- Most aggressive position; only viable when client has breached or chose to terminate without cause

### What should be built (recommendation)

To close Q-CC-49, the platform needs:
1. A `RefundTx` table (parallel to TransferTx but for outflows back to client)
2. An admin-side "Issue Refund" action that:
   - Creates a RefundTx record with amount + reason + targetWallet (which might be virtual for a bank refund)
   - Optionally adjusts contract.remainingValueSar or marks specific WalletRecords as Refunded
   - Audit-logs the refund actor + timestamp
3. Reporting: per-account refund history for SAMA audits

### Business implications

| Question | Answer |
|---|---|
| "What happens to unused SAR when a contract expires early?" | **Per the platform: stays frozen, no spend possible.** Operationally: refund handled off-platform via finance team. |
| "Is there an audit trail for refunds?" | **Not in the Falcon platform today.** The bank refund is in finance records. The platform shows the contract Expired with frozen records but no "refunded" marker. |
| "Do clients lose money on early termination?" | Depends on commercial agreement: standard contract terms typically forfeit unused SAR; relationship-driven clients get credit memos or refunds via finance team. |
| "What should we build first?" | Q-CC-49 resolution: define the refund flow with product team. Build the `RefundTx` table + admin action. Critical for SAMA + GDPR + general transparency. **High priority for next sprint.** |

---

## SCENARIO 33 — Sales Handoff: From Won Deal to Live Operations

**Business question:** "Sales just signed a new client. Walk through every handoff to ensure they're operational by their go-live date."

### The handoff chain

```
Sales (closed deal)
   │
   ↓ contract terms agreed
Account Management (relationship owner)
   │
   ↓ technical kickoff
Onboarding Engineering (Falcon admin tasks)
   │
   ↓ account live
Customer Success (post-launch support)
   │
   ↓ ongoing
Operations / Finance (billing, audits)
```

### Phase 1 — Sales-to-Account-Management handoff (Day 0)

**Sales delivers:**
- Signed contract (legal document)
- Commercial terms summary: valueSar, startDate, endDate, Rate Card preferences, expected CommChannels, expected user count
- Client's primary contacts: who will be the Account Owner, billing contact, technical contact

**Account Management receives + acknowledges:**
- Creates a tracking record (CRM)
- Schedules technical kickoff with client

### Phase 2 — Account-Management-to-Onboarding-Engineering handoff (Day 1-3)

**Account Management delivers:**
- Client metadata: company name, finance ID, address, etc.
- Account Owner-to-be: name, email, phone
- CommChannel + Application list with expected pricing
- Allowed IPs (if known)
- Password security level preference (Normal / Advanced)
- Account limits (max users, etc.)
- WalletType + BalanceType preference (Single/Multiple × User/Node)
- Custom Permission Group setup (if non-default)

**Onboarding Engineering executes (typically same-day):**
- Run Add Client wizard (Scenario 1 in Vol 1) — 5-step wizard, ~30 min
- Run Add Contract wizard — 4-step wizard, ~30-60 min depending on Contract Details matrix complexity
- Send credentials to Account Owner

### Phase 3 — Account Owner first-login + self-setup (Day 3-7)

**Account Owner does:**
- First login (IP check, OTP, password change)
- Reviews account settings
- Creates initial users (Node Admins, Normal Users)
- Activates CommChannels (Do Payment if needed)
- Sets up Contact Groups
- (Eventually) creates Templates — but currently blocked by GAP-T-001

### Phase 4 — Go-live (Day 7-14)

- Client team is trained
- First real campaigns / transactions sent
- Falcon Customer Success monitors initial activity for issues
- Falcon Operations validates wallet deductions are correct

### Common failure points

| Failure | Mitigation |
|---|---|
| Account Owner doesn't receive credentials (spam filter, wrong email) | Always confirm receipt before considering Phase 2 done. Backup channel: phone OTP. |
| Wrong Account Name in contract — needs to be re-keyed | Account Name is immutable post-creation; if wrong, must close + recreate the Account. **Be very careful in the wizard.** |
| Allowed IPs list wrong / incomplete | Client locked out on first login. Coordinate with their network team before activating IP allowlist. |
| Contract Details matrix has gaps | Send Transaction fails when hitting an empty cell. Sales must specify every (App, Channel, Priority, Destination) combination. |
| Wallet topology mistake (Single when client needed Multiple) | Hard to change later. Plan carefully with the client's volume / billing expectations. |

### Business implications

| Question | Answer |
|---|---|
| "How long from contract signed to client live?" | **1-2 weeks** typical. Faster if the client is responsive and the matrix is simple. Slower if technical kickoff reveals contract gaps. |
| "Where do most onboarding delays come from?" | Account Owner unavailable for first login. Allowed IPs not coordinated with client network. Contract Details matrix incomplete. |
| "What's the biggest gotcha?" | Account Name immutability + Wallet Topology being hard to change. These are "one-way doors" — get them right in the wizard. |
| "Can we automate any of this?" | Today, all manual. A "Sales Handoff Form" with structured fields (CRM-integrated) could automate Phases 1-2 metadata flow. |

---

## Continuous mining queue update

Volumes 1-7 = 33 scenarios + 4 compliance deep-dives = 37 deep analyses.

Remaining queue:
- **Vol 8:** Scaling scenarios (1M users / 10M messages/day)
- **Vol 9:** Multi-language Template behavior (English + Arabic variants)
- **Vol 10:** Bulk operations design space (Q-UM-11 OPEN)
- **Vol 11:** Operational runbooks (incident response, data recovery, key rotation)
- **Vol 12:** Falcon Brain knowledge graph navigation patterns

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 7 (off-boarding + refund + sales handoff) written 2026-05-18 · 37 deep-dives total.*
