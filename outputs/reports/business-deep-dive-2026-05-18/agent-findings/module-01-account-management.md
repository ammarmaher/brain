---
type: agent-findings
agent: Module 01 deep-dive
date: 2026-05-18
---

# Module 01 (Account Management) — Raw Agent Findings

> Output preserved verbatim from the mining agent. Consolidated outputs are in `../REPORT.html` and `../CONSOLIDATED-REGISTRY.md`.

## 1. Module inventory

### BR-AM-* counts
[BRAIN-OUT] `Brain Outputs/prd/modules/01-account-management/BUSINESS_RULES.md`:
- Total: 42 BR-AM-* rules (BR-AM-01 → BR-AM-42)
- CONFIRMED: 36 (BR-AM-01..21, BR-AM-24..38 minus the 2 INFERRED)
- OPEN: 4 (BR-AM-39, BR-AM-40, BR-AM-41, BR-AM-42)
- INFERRED: 2 (BR-AM-22 derived from BR-AM-26; BR-AM-23 derived from PRD status definitions)

### OPEN BR rules
- BR-AM-39 — Limit-edit enforcement mode (reject vs grandfather) when users already exceed the new cap is silent
- BR-AM-40 — Behavior of a CommChannel/App when Visibility flips Show→Hide while Status is Active is silent
- BR-AM-41 — Migration semantics when Balance Type / Wallet Type is changed mid-life are silent
- BR-AM-42 — Fate of balance held by a Normal User being deleted is silent

### Entities defined in PRD vs vault
PRD `ENTITIES.md` defines 9 entities: Node, Account, AccountOfficialData, AccountSettings, CommChannelConfig, AppConfig, Wallet, WalletRecord, TransferTx, WalletTypeConfig.
Vault has 7 entities: E-account, E-account-settings, E-node, E-wallet, E-wallet-record, E-comm-channel-config, E-app-config.

Mismatches:
- AccountOfficialData — PRD defines distinct embedded entity (12 fields); no E-account-official-data.md exists
- TransferTx — PRD defines as entity; no E-transfer-tx.md exists
- WalletTypeConfig — PRD defines as 1:1 Account entity (balanceType, walletType); collapsed into E-account-settings but THOSE FIELDS are NOT in E-account-settings

### V-rules in vault touching BR-AM-*
- V-account-name-format-uniqueness → BR-AM-03
- V-account-limits-zero-means-no-limit → BR-AM-11, BR-AM-12, BR-AM-13, BR-AM-34
- V-account-ip-allowlist-enforcement → BR-AM-10 (+ BR-UM-24 cross)
- V-password-security-level-enum → BR-AM-09
- V-password-complexity-per-security-level → BR-AM-09 (consumer)
- V-service-visibility-pricing-required → BR-AM-14, BR-AM-15, BR-AM-16, BR-AM-17
- V-normal-user-limit-enforcement → BR-AM-11 (via cap source)

Coverage: 12 of 42 BR-AM rules have V-rule binding. 30 of 42 rules have NO V-rule binding — wallet topology + lifecycle + contract-interplay clusters essentially unvalidated.

## 2. Business gaps discovered (full table — 29 items, see REPORT.html section Module 01)

## 3. Missing cross-links

### Cross-module BR references inside BR-AM-*
| BR-AM rule | Crosses to | State |
|---|---|---|
| BR-AM-02 | 02 (Falcon usertypes) | One-way |
| BR-AM-09 | 02 (PasswordPolicy) | Bidirectional via V-rule ✅ |
| BR-AM-10 | 02 (login gate) | Bidirectional via V-rule ✅ |
| BR-AM-11/12 | 02 (Normal-User quota) | Bidirectional via V-rule ✅ |
| BR-AM-19 | 02 (AO user create Step 5) | One-way |
| BR-AM-22, 35..38 | 03 (Master Wallet funding) | One-way |
| BR-AM-27 | 02 (Normal User consumption) | No cross-link |
| BR-AM-28 (Master aggregate) | 03 | No cross-link |
| BR-AM-34 (transfer-limit %) | 03 (transfer endpoint) | One-way |

### E-* entity back-references missing
None of the 7 vault E-* notes have explicit "Used by BR-AM-*" sections. They reference V-rules and pages but NOT BR rules.

### Wave 14/15 memory entries — code drift from PRD
- Wave 14 Settings tab — does NOT cite BR-AM-09/10/11/12/13 in code; PES list correct but BR-AM mapping implicit
- Wave 15 Info panel — uses cross-field validators (CountryRequiredWhenCity etc.) that are NEW business rules NOT in BUSINESS_RULES.md
- Falcon-only-edit gate on AccountName + FinanceId — operationally enforced but NOT in BR-AM-03 or BR-AM-05

## 4. New entities + V-rules (17 V-rules + 6 entities — full table in REPORT.html)

## 5. 20 yes/no questions (full list in REPORT.html Module 01 section)

## 6. 29 GAP-BIZ-AM-* candidates (full list in REPORT.html)
