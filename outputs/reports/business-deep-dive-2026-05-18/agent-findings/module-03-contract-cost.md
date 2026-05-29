---
type: agent-findings
agent: Module 03 deep-dive
date: 2026-05-18
---

# Module 03 (Contract & Cost Management) — Raw Agent Findings

## 1. Module inventory

- Total: 50 BR-CC-* (BR-CC-01..50)
- CONFIRMED: 39
- OPEN: 10 (BR-CC-41..50) — **highest OPEN count of all clusters**
- INFERRED: 1 (BR-CC-29)

### 10 OPEN BR rules
- BR-CC-41 — Packaging + Billing scope absent in PRD body
- BR-CC-42 — Tie-breaker when multiple Active contracts share same Expiration Date
- BR-CC-43 — Concurrent send-transaction locking strategy (optimistic vs pessimistic)
- BR-CC-44 — Tax/VAT handling on SAR values
- BR-CC-45 — Remaining Value real-time vs eventually-consistent
- BR-CC-46 — Audit log granularity for contract edits
- BR-CC-47 — Retroactive treatment when Expired→Active covers Expired window
- BR-CC-48 — Cancellation of Pending contracts
- BR-CC-49 — Refund flow (failed campaign)
- BR-CC-50 — Addons rate-card fallback when contract has no matching addon

### Missing E-* notes
- E-contract-detail (BR-CC-22 cost matrix cell)
- E-price-unit (BR-CC-21 DB-editable lookup)
- E-destination (BR-CC-26 destination axis)
- E-priority (BR-CC-23/24/25 priority taxonomy)

### V-rules binding BR-CC (8 of 50 = 16% coverage)
- V-contract-committed-value-positive → BR-CC-08
- V-contract-currency-enum → BR-CC-08, 19
- V-contract-edit-status-aware-fields → BR-CC-15, 16, 17
- V-contract-expiration-after-start → BR-CC-07
- V-contract-rate-per-unit-non-negative → BR-CC-22
- V-charging-insufficient-balance → BR-CC-32
- V-charging-no-applicable-rate → BR-CC-22 + 32
- V-charging-transfer-source-destination → BR-CC-35 (+ BR-AM-34)
- V-service-visibility-pricing-required → cross-cluster to BR-AM-14..17 (PRD-01 owner)

## 2. Business gaps (17 items — full table in REPORT.html)

Coverage gap headline: 50 BR-CC-* but only 8 V-rules bind directly. Major uncovered BR-CC rules: BR-CC-04 (FarabiRefId ≤50), BR-CC-05 (Name ≤50), BR-CC-09 (auto-Remaining), BR-CC-10/11/12/13/14 (status lifecycle), BR-CC-18..21 (rate card semantics), BR-CC-23..29 (priority/destination/addon enums), BR-CC-30/37/38/39/40 (wallet linkage + role visibility).

## 3. Cross-module citations

| Documented in BR-CC | Should cite |
|---|---|
| BR-CC-30 ↔ BR-AM-36 | already documented ✅ |
| BR-CC-37 ↔ BR-AM-35 | already documented ✅ |
| BR-CC-38 ↔ BR-AM-38 | already documented ✅ |
| BR-CC-31 ↔ BR-AM-37 | explicit in MATRIX ✅ |
| BR-CC-35 → BR-AM-34 | MISSING (transfer limit applies) |
| BR-CC-33/34 → BR-AM-29 | MISSING (Multiple-wallet dep) |
| BR-CC-36 → BR-AM-22 | MISSING (activation deducts) |
| BR-CC-12/13/14 → BR-AM-28 | MISSING (Master aggregate) |
| BR-CC-32 → BR-CGM-29 | MISSING (group send) |
| BR-CC-32 → BR-TM-12 | MISSING (template variables) |
| BR-CC-01 → BR-UM-01/02 | MISSING (Falcon usertype def) |

## 4. New V-rules + entities (9 V-rules + 8 entities — full in REPORT.html)

## 5. 20 yes/no questions (full in REPORT.html)

## 6. 17 GAP-BIZ-CC-* candidates (full in REPORT.html)

## Summary stats
- BR-CC coverage: 50/50 rules, 39 confirmed, 10 open, 1 inferred
- V-rule coverage: 8 of 50 BR rules directly bound (16%)
- E-* coverage: 5 of 8 PRD entities have vault notes (62.5%)
- Cross-module citation density: weak — 4 explicit BR-AM cross-refs of 13 wallet-relevant rules
- Scope fork: Packaging + Billing absent from body (F-010 halt) — affects 5 of 10 OPEN rules conceptually
- Top 3 gap clusters by blast radius: (1) Refund, (2) Tax/VAT KSA compliance, (3) Audit log
