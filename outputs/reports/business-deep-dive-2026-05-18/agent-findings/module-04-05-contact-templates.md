---
type: agent-findings
agent: Modules 04+05 deep-dive
date: 2026-05-18
---

# Modules 04 (Contact Group) + 05 (Templates) — Raw Agent Findings

## 1. Inventory (both modules)

### Module 04 BR-CGM-*
- Total: 38
- CONFIRMED: 29
- OPEN: 9 (BR-CGM-30..38)
- INFERRED: 0

### Module 05 BR-TM-*
- Total: 41
- CONFIRMED: 29
- OPEN: 12 (BR-TM-30..41)
- INFERRED: 0

### Module 05 head-only coverage drift
"head ~250 of 982 lines" was misstated — actual PRD is 115 lines summary; 982 figure is original Drive doc length. Missing content:
- Voice template flow (W9) — never captured
- AI template flow (W10) — never captured
- Edit/versioning detailed semantics (BR-TM-33)
- Language addition flow (BR-TM-34)
- Preview server-side vs client-side (BR-TM-35)
- Template deletion governance (BR-TM-38)
- Falcon usertype read-scope (BR-TM-39)
- Full WhatsApp button enumeration past basic types
- Quick Reply label cap (Q-TM-17)
- Variable cap precision (Q-TM-16 — "20-30" wording)
- Marketing-policy/opt-in mechanism past BR-TM-25
- Approval-role default (Q-TM-02)

### Module 04 entities (6 in PRD, 2 in vault)
Missing: ShareAuditEntry, ContactGroupLink, SoftDeleteRetentionPolicy

### Module 05 entities (11 in PRD, 0 in vault)
**E-template.md does NOT exist** — single biggest knowledge-graph gap. Only CommChannelConfig + CheckerLevel + CheckerUser are wired in backend.

### V-rule bindings
Module 04 (5 V-rules):
- V-contact-group-column-name-shape → BR-CGM-06 + BR-CGM-05
- V-contact-group-file-size-cap → BR-CGM-04 + BR-CGM-30
- V-contact-group-file-type-allowlist → BR-CGM-04 + BR-CGM-08
- V-contact-group-name-required-format → BR-CGM-02 + BR-CGM-26
- V-contact-group-share-policy-mode-mutex → BR-CGM-09/10/11/12

Module 05 (2 V-rules):
- V-template-checker-level-integrity → BR-TM-21/22/23
- V-template-levels-count-required-for-restricted → BR-TM-19 implicit

Coverage hole: zero V-rules for BR-TM-02..16 (entire wizard body), BR-TM-17..20 (statuses), BR-TM-24..29 (WhatsApp categories + Meta states). Reason: backend template-entity DTOs don't exist (GAP-TM-01 MISSING).

## 2. Business gaps

### Module 04 (12 items — full in REPORT.html)

### Module 05 (16 items — full in REPORT.html)

### Cross-module 04↔05 integration gaps (4 items)
- Contact group deleted → bound template behavior (Q-TM-19 OPEN)
- Template approved → contact group locked? (PRD silent)
- Sharing changes → template-send permission? (silent on in-flight sends)
- Column→variable mapping rule (BR-TM-12 mentions but never formally stated; load-bearing but implicit)

## 3. Cross-module BR rules missing

- BR-CGM-32 → BR-UM user-deletion cascade — no such BR-UM rule exists
- BR-CGM-36 → BR-AM account-deletion cascade — no such BR-AM rule exists
- BR-CGM-15..19 cite roles without citing BR-UM rule that defines those roles
- BR-CGM-10 references "same account hierarchy" without BR-AM citation
- BR-CGM-06 (column name) shape doesn't cross-reference BR-TM-12 (variable binding)
- BR-TM-02 (one template = one CommChannel) doesn't cross to BR-CC channel selection
- BR-TM-27 (Paused/Disabled runtime block) doesn't cite BR-CC send-pipeline rule

Send Transaction triangle missing: Contract → Template → ContactGroup → CommChannel — no single document binds all three. Closest is OVERVIEW-level mention; no trace.

## 4. New V-rules + entities (17 + 6 — full in REPORT.html)

## 5. 30 yes/no questions (15 CG + 15 TM — full in REPORT.html)

## 6. GAP-BIZ-CG + GAP-BIZ-TM candidates (28 total — full in REPORT.html)

## Summary
- Module 04: 38 rules (29/9/0), 6 PRD entities, 5 V-rules — primary gaps: cascade rules + missing Failed status
- Module 05: 41 rules (29/12/0), 11 PRD entities but 0 in vault, 2 V-rules — Template entity has no public API + no E-template.md
- Cross-module: no Send Transaction trace document; column→variable binding implicit
