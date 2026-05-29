---
type: business-scenarios-atlas
volume: 4
title: "Falcon Business Scenarios Atlas — Volume 4: Regulatory Compliance Map (SAMA + CITC + GDPR)"
purpose: "Map every regulatory requirement to what Falcon currently does, what's missing, and what the gap means in business terms. The doc you open before any compliance / audit / enterprise sales conversation."
volume-4-deep-dives: 4
---

# Falcon Business Scenarios Atlas — Volume 4: Regulatory Compliance

> Every Saudi enterprise client asks: "Is this SAMA-compliant? CITC-compliant?" Every EU prospect asks: "Is this GDPR-compliant?" This volume maps each requirement to what we do today, what's missing, and the size of each gap.

---

## DEEP-DIVE 18 — SAMA (Saudi Central Bank) Compliance Map

**Scope:** SAMA regulates financial transactions in Saudi Arabia. Falcon is not a bank, but any platform that **moves money or records financial events** must produce a SAMA audit trail.

### What SAMA cares about (the requirements that touch Falcon)

1. **Audit trail integrity** — Every monetary action traceable to actor + time + amount + counterparty
2. **Reconciliation** — Stated balances must reconcile to underlying records
3. **Immutability** — Financial history cannot be silently altered
4. **Access control** — Only authorized personnel can act on financial records
5. **Data residency** — Saudi customer data stays within KSA jurisdiction
6. **Retention** — Financial records kept for minimum 10 years (SAMA standard for banks; CPaaS may have different specifics — verify)
7. **Reporting** — Ability to produce on-demand reports for regulatory queries

### Falcon's current state — requirement by requirement

| Requirement | Current state | Gap |
|---|---|---|
| Audit trail integrity | ✅ `WalletRecord` has `walletId`, `contractId`, `valueSar`, `createdAt`. `TransferTx` has `actorId`, `srcWalletId`, `dstWalletId`, `amountSar`, `at`, `contractIds[]`. Every charging action tagged per BR-AM-36 / BR-CC-30. | None — strong design |
| Reconciliation | ✅ Master Wallet displayed = `SUM(Active WalletRecords)`. Contract.remainingValueSar = valueSar minus deductions. Can be cross-checked at any time. | None |
| Immutability | 🟡 `WalletRecord` is append-only (records retained on contract expiry per BR-AM-38, BR-CC-38). BUT: contract edits silently mutate Rate Card / Contract Details / valueSar without an audit log. **Q-CC-46 OPEN.** | 🟡 Need `ContractEditHistory` table to log every admin edit with who/when/before/after |
| Access control | 🟡 PES enforces role + permission group. Falcon admins can edit all contracts. Wave 5a found 3 Commerce controllers missing `[Authorize]` — backend relies on UI for auth. | 🔴 Fix Commerce security gaps (see SECURITY-FINDINGS-2026-05-18) |
| Data residency | [INFERRED] Hosting region = KSA per Falcon-essentials infrastructure. **Verify with infra team** that all services (Mongo, Kafka, Zitadel, blob storage for ContactGroup files) are KSA-region. | 🟡 Needs operational verification |
| Retention | [OPEN] Not defined in PRD. Soft-delete preserves data but no formal retention policy. | 🔴 Define retention policy. SAMA standard: 10 years for financial records. Recommend: 10 years for `WalletRecord`, `TransferTx`, `Contract`; 7 years for `User`/`UserStatusHistory`; configurable for other tables. |
| Reporting | 🟡 Query is straightforward (Scenario 9 in Vol 2) but no canned reports exist. Operations must run ad-hoc queries. | 🟡 Add a "Compliance Reports" admin tool: per-contract transaction history, per-account summary, system-wide audit log |

### Three SAMA scenarios you should be ready for

**Scenario A: "Show me every charge for client X over the last 12 months."**
- Query: `LedgerEntry WHERE accountId = X AND timestamp BETWEEN now-365d AND now`
- Time to produce: minutes (with index on `accountId + timestamp`)
- Output: CSV with timestamp, amount, contractId, actorId, walletId, eventType
- ✅ Achievable today

**Scenario B: "Prove that the displayed balance on 2026-04-01 matched the underlying records."**
- Query: Reconstruct point-in-time balance by re-aggregating `WalletRecord` as of that date
- Requires: `createdAt` + a "still-active-as-of" check via Contract.expirationDate
- 🟡 Need to verify the query is auditable. May need a snapshot table for performance.

**Scenario C: "We suspect a fraudulent transaction. Show us all transfers by user ID Y in the last 30 days."**
- Query: `TransferTx WHERE actorId = Y AND at > now-30d`
- Output: full transfer history with src/dst wallets and amounts
- ✅ Achievable today

### Business implications

| Question | Answer |
|---|---|
| "Are we SAMA-compliant today?" | **Mostly yes** for transaction-level audit. **Gaps:** contract-edit audit log (Q-CC-46), formal retention policy, full controller-level auth audit. **Not blockers for SAMA review but document each gap with a remediation plan.** |
| "What if SAMA asks for a specific report tomorrow?" | Most queries are achievable with ad-hoc SQL/Mongo. Recommend: pre-build the top 5 SAMA query templates as admin-console reports. |
| "What's the biggest SAMA risk today?" | The 3 Commerce security gaps (missing `[Authorize]`, commented role gate, tenant isolation) — if any of these allow cross-tenant data access, SAMA would flag this as access-control failure. Fix these first. |

---

## DEEP-DIVE 19 — CITC (Communications & IT Commission) Compliance Map

**Scope:** CITC regulates telecom services in Saudi Arabia. Falcon's CPaaS operations are within CITC's purview. Service continuity, SLA enforcement, and customer fairness are key CITC concerns.

### CITC focus areas (that touch Falcon)

1. **Service continuity** — Customers must be notified of service disruptions
2. **Grace periods on payment** — Customers must have opportunity to remediate before disconnection
3. **Fair billing** — No surprise charges; pricing must be communicated upfront
4. **Complaint handling** — Customers must have escalation paths
5. **Number portability / Service portability** — Customers can switch providers (less relevant for B2B CPaaS but applies if Falcon offers numbers)
6. **Consent for messaging** — Especially marketing messages; opt-in required

### Falcon's current state

| Requirement | Current state | Gap |
|---|---|---|
| Service continuity notifications | ❌ No formal notification system for CommChannel status changes. | 🔴 Build CITC-grade notifications: when CommChannel goes Expired → email/SMS to Account Owner. |
| Grace periods | ✅ BR-AM-21 defines 7 days (Monthly) / 30 days (Yearly/OneTime). **Hard-coded; should be CITC-compliant.** | None |
| Fair billing | ✅ Contract Details matrix communicated upfront. AO sees Remaining Value (Active). 🟡 BUT: the "blended rate" reality (Scenario 10 in Vol 2) is non-obvious — clients may not understand that nearest-expiring contract pricing dominates. | 🟡 Improve client UX: show "current effective rate" + "next contract rate after current depletes" |
| Complaint handling | ❌ No support ticket integration in current PRD. | 🟡 Out-of-band (email/phone support). Document the formal complaint escalation flow. |
| Number portability | n/a (Falcon is CPaaS for messaging, not voice numbers directly). | n/a |
| Consent for messaging | 🟡 Marketing template category requires opt-in per BR-TM-25, but this is enforced by Meta (WhatsApp) for WA templates. **No Falcon-side consent verification for non-WA channels.** | 🔴 Add explicit opt-in tracking + audit log for ALL marketing messages (not just WA) |

### Three CITC scenarios

**Scenario A: "Our service was disrupted for 4 hours yesterday. Show us the impact."**
- Need: incident timeline + affected accounts + remediation steps + customer communications
- Falcon today: ad-hoc operational response; no formal incident reporting
- 🔴 Recommend: incident reporting tool

**Scenario B: "Customer complained about an unauthorized charge."**
- Need: full transaction history + actor identification + dispute resolution path
- Falcon today: query the audit trail (Scenario 9 in Vol 2 — achievable)
- ✅ Achievable for query; complaint handling process is operational

**Scenario C: "Show that you give customers grace before disconnecting them."**
- Need: PRD documentation + code evidence + log of grace-period activations
- Falcon today: BR-AM-21 in PRD + code implements 7/30 day windows
- ✅ Achievable; documented

### Business implications

| Question | Answer |
|---|---|
| "Are we CITC-compliant today?" | **Mostly yes** for the technical requirements (grace periods, fair pricing transparency). **Gaps:** service disruption notifications, formal complaint process, non-WA opt-in tracking. |
| "What if CITC asks 'did you notify affected customers when CommChannel X expired?'" | Today: no formal notification log. **High risk** — recommend immediate addition of "CommChannelStatusChange" event log + email/SMS notification to AO. |
| "If a marketing message is sent without opt-in, what's our exposure?" | For WhatsApp: Meta enforces consent — we have implicit compliance via their platform. For Voice/SMS: no Falcon-side enforcement. **Gap.** |

---

## DEEP-DIVE 20 — GDPR Compliance Map (for EU/UK Clients)

**Scope:** Currently Falcon serves the Saudi market. But future EU expansion would require GDPR compliance. Even today, if Falcon hosts an EU citizen's data (e.g., a contact-group recipient), some GDPR rules apply.

### GDPR core requirements (that touch Falcon)

1. **Lawful basis for processing** — Consent, contract, legitimate interest, etc.
2. **Right to access** — Data subject can request their data
3. **Right to rectification** — Data subject can correct their data
4. **Right to erasure** ("right to be forgotten") — Data subject can request deletion
5. **Right to portability** — Data subject can export their data
6. **Right to object** — Data subject can opt out of marketing
7. **Data minimization** — Don't collect more than needed
8. **Purpose limitation** — Don't use data for purposes other than stated
9. **Breach notification** — 72 hours from awareness to authority notification
10. **DPO + records of processing** — Documented data flows

### Falcon's current state vs GDPR

| Requirement | Current state | Gap |
|---|---|---|
| Lawful basis | 🟡 Implicit via service contract. No explicit "data processing basis" record. | 🟡 Document the lawful basis per data type (e.g., User data = contract; ContactGroup recipient data = legitimate interest of the client) |
| Right to access | ❌ No FE feature for data subject self-service access. | 🔴 Build: data export endpoint for Users + ContactGroup recipients |
| Right to rectification | 🟡 User can edit own profile (BR-UM-41). ContactGroup recipients can't self-correct (the data is in the client's system). | 🟡 Document the boundary: Falcon's user = self-rectifiable. ContactGroup recipient = pass-through to the client. |
| Right to erasure | 🔴 Soft-delete preserves data (BR-UM-32). For GDPR, need hard-delete capability with documented purpose. | 🔴 Build hard-delete path for User + cascade decisions for ContactGroup data |
| Right to portability | 🟡 ContactGroup files downloadable (BR-CGM-04). User profile not exportable. | 🟡 Add user-data-export feature |
| Right to object (marketing) | 🟡 Opt-in per BR-TM-25 (Meta-enforced for WA). No central opt-out registry. | 🔴 Build opt-out tracking; mandatory check before sending marketing messages |
| Data minimization | ✅ User schema is reasonably minimal. ContactGroup data is client-uploaded (their responsibility for minimization). | None |
| Purpose limitation | 🟡 No formal documentation of purpose per data type. | 🟡 Document data uses per table |
| Breach notification | ❌ No formal breach response in PRD. | 🔴 Build incident response runbook with 72-hour notification commitment |
| DPO + records | n/a (operational — Falcon must appoint a DPO for EU operations) | n/a |

### Two GDPR scenarios

**Scenario A: "A data subject in Germany sends Falcon a SAR (Subject Access Request) for their data."**
- Need: identify all Falcon records about this individual + produce an export within 30 days
- Falcon today: 🟡 Need to manually query Users (if they're a Falcon user), then check all ContactGroup files for their phone/email. The latter is messy.
- 🔴 Build: SAR fulfillment tool

**Scenario B: "A data subject requests deletion under Article 17."**
- Need: hard-delete all records about them
- Falcon today: 🔴 Soft-delete only. Manual cascade required: User.status=Deleted, then scrub all ContactGroup files line-by-line.
- 🔴 Build: GDPR hard-delete cascade

### Business implications

| Question | Answer |
|---|---|
| "Are we GDPR-compliant today?" | **No, several gaps.** Acceptable while serving Saudi market only. **Not acceptable for EU expansion.** |
| "What's the smallest viable GDPR readiness for EU expansion?" | Top 3: SAR fulfillment tool, hard-delete path, opt-out tracking. Followed by: breach response runbook, DPO appointment, lawful basis documentation. |
| "Could we host EU client data today?" | Risky — soft-delete + no hard-delete path means we cannot fulfill Article 17 requests within the legal timeframe. Recommend: do not onboard EU clients until gaps closed. |

---

## DEEP-DIVE 21 — Cross-Regulation Decision Matrix

When a business situation touches multiple regulations, which one wins?

### The general rule
**Most restrictive applies.** If SAMA requires 10-year retention and GDPR requires deletion on request, the user can ONLY exercise the GDPR right on data SAMA doesn't require to retain.

### Specific conflict cases

| Conflict | Resolution |
|---|---|
| SAMA wants financial records retained 10 years; GDPR data subject wants erasure | Retain the financial transaction record (no PII in WalletRecord — just amounts and IDs). Erase the linked User record's PII (name, email, phone). Audit trail integrity is preserved via opaque IDs. |
| CITC wants marketing opt-in; client wants to send a one-off promotional message | Opt-in is mandatory. No exception. |
| SAMA wants actor identification; GDPR wants minimal user data exposure in reports | Pseudonymize actor IDs in non-SAMA reports. Provide full deanonymization only on regulatory request. |
| Saudi data residency wants data in KSA; EU client wants data in EU | Either run two Falcon instances (KSA + EU) or refuse the EU client. Single-instance multi-region is not currently supported. |

### Business implications

| Question | Answer |
|---|---|
| "Can a single Falcon platform serve both Saudi and EU clients?" | Technically yes (two regions). Operationally complex (separate data residency, different retention policies, different SAR processes). **Recommend: two separate deployments if EU is in roadmap.** |
| "What's our biggest regulatory risk today?" | **Operational maturity** — Falcon's regulatory posture relies on Saudi-only operation + ad-hoc query capability. Any expansion or audit pressure will stress this. Invest in tooling early. |

---

## Continuous mining queue update

Volumes 1-4 = 17 scenarios + 4 deep-dives. Remaining queue:
- **Vol 5:** Edit User end-to-end (Q-UM-13 RESOLVED — buildable now)
- **Vol 6:** Scaling scenarios (1M users / 10M messages per day)
- **Vol 7:** Negotiation & contract amendment patterns
- **Vol 8:** Data export & client off-boarding
- **Vol 9:** Refund flows (Q-CC-49 — bring to product)
- **Vol 10:** Sales handoff playbooks (sales-to-onboarding-to-operations)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 4 (compliance) written 2026-05-18 · 4 volumes total = 21 deep-dive cascades + compliance gap maps.*
