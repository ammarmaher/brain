---
type: agent-findings
agent: Cross-module integration deep-dive
date: 2026-05-18
---

# Cross-Cutting Integration — Raw Agent Findings

## 1. Cross-module workflows without single owner (9)

| # | Workflow | Modules | Gap |
|---|---|---|---|
| X-WF-01 | Send Transaction E2E | 02→04→05→03→01 | NO single document; only BR-CC-32 single sentence + Add-Client.trace |
| X-WF-02 | Add Client wizard post-creation | 01→03→01 | Post-creation (walletStrategy=null → first contract) transition undocumented |
| X-WF-03 | Contract Activation → Wallet Funding → CommChannel Cascade | 03→01→01 | No event-flow doc; trigger (timer/Kafka/cron) not in source |
| X-WF-04 | User Lifecycle Affects Owned Resources | 02→04→05→01 | 4 OPEN rules across 3 modules asking same systemic question |
| X-WF-05 | Account Soft-Delete | 01+02+03+04+05 | Undefined — no PRD discusses account-termination |
| X-WF-06 | Hierarchy Move (re-parenting) | 01+02+04+PES | Marked MISSING in root-documents/GAPS.md |
| X-WF-07 | First-Login → OTP → Force-Change-Password → Active | 02+01+OTP+notification | No trace binding |
| X-WF-08 | Template Approval Chain | 02→05→04→03 | Checker invented by 05 but mapped to no role in 02 |
| X-WF-09 | Falcon-Only Visibility/Pricing Edit | 01↔03 | Mid-life rate card coupling undocumented |

## 2. Module dependencies declared but not encoded (12)

Each OVERVIEW.md declares dependencies in narrative form. Following declared dependencies have NO formal cross-reference matrix / no shared entity / no cross-module workflow doc:
- 01→02: "Account Owner created at Step 5" — no doc binding BR-AM-19 + BR-UM-03 + BR-UM-17
- 01→03: "Contract value flows into Master Wallet" — no Kafka topic documented
- 03→01: "Master Wallet is funded by contract activations" — same
- 04→05: "Columns become template variables" — no binding contract
- 05→02: "Checker user from User roster" — no PES Checker permission key exists
- 04→02: "Share With picker reads User roster" — no API contract
- 01→04 (transitive): groups belong to nodes — no entity field doc
- 01→Finance + Farabi — declared but no entities exist
- 01→Notification module — both modules declare; no E-notification entity
- 02→"Hierarchy module" — informal term, no glossary entry
- 05→Send Transaction — never written as cross-module rule
- 05→01 "Template inheritance per Main node" — [OPEN]

## 3. Cross-module entities that should be shared E-* notes (8)

| Proposed | Cited in | Why missing matters |
|---|---|---|
| E-permission-group | Most-cited concept across platform | HIGHEST priority gap |
| E-audit-event | BR-AM-36, BR-CC-30, BR-CGM-28 | Action-tracking invented ad-hoc per feature |
| E-notification | BR-UM-18, BR-UM-26, BR-AM-21 | Platform-wide but unmodeled |
| E-translation | Cross-platform i18n + DB-editable messages | MultiLanguageName mandatory but no entity |
| E-finance-record | BR-AM-05 | External integration, no contract |
| E-farabi-reference | BR-CC-04 | External integration, no spec |
| E-destination | BR-CC-26, Q-RD-09 | International phone destination list referenced but no entity |
| E-app-setting | BR-UM-28, BR-CGM-30 | "App Settings" cited 3+ times, no entity |

## 4. Cross-module business rules that should exist but don't (13)

| Proposed BR-X | Statement | Cross-cuts |
|---|---|---|
| BR-X-USER-CASCADE-01 | User Deleted → ContactGroups surface with creator-deleted status | 02+04 |
| BR-X-USER-CASCADE-02 | User Deleted → Pending Templates auto-Reject | 02+05 |
| BR-X-USER-CASCADE-03 | Normal User Deleted → wallet balance returns to parent node | 02+01 |
| BR-X-ACCOUNT-LIFECYCLE-01 | Define account-termination Active→Suspended→Deleted | All |
| BR-X-CONTRACT-EXTENSION-01 | Extension Expired→Active → re-add excluded wallet records | 03+01 |
| BR-X-HIERARCHY-MOVE-01 | Node moved → permission paths re-resolve | 01+02+04+PES |
| BR-X-VISIBILITY-DOWNGRADE-01 | Hiding only-active commchannel of Single-wallet with active Rate Card is FORBIDDEN | 01+03 |
| BR-X-AUDIT-EVENT-01 | All cross-module events MUST emit audit record with correlationId | All |
| BR-X-I18N-FALLBACK-01 | MultiLanguageName missing locale → fall back to other | All |
| BR-X-OTP-PURPOSE-COVERAGE | New user-confirmation flows MUST reuse E-otp-challenge | 02+consumers |
| BR-X-PERMISSION-GROUP-01 | PGs account-scoped; cross-account sharing FORBIDDEN | 01+02+PES |
| BR-X-CHECKER-ROLE-01 | Template Checker is PES key, not user flag | 02+05 |
| BR-X-DELIVERY-FAILURE-01 | Credential delivery failure → user stays Pending; wizard retry | 02+notification |

## 5. Drift items (9)

- D-01: Module 05 only ~12% of PRD captured; no CAPTURE_TRACKING.md
- D-02: Q-UM-07 blocks 4 downstream questions; no blocked-by graph
- D-03: _runtime-verification/ exists but no parallel _business-verification/
- D-04: PRD modules folder has no top-level cross-module README or MOC
- D-05: Add-User/Add-Node/Edit-Node traces exist; Send-Transaction/Add-Contract/Transfer-Balance/Do-Payment are TODO
- D-06: Folder-form vs single-file trace inconsistency
- D-07: Page-level BUSINESS_RULES.md exists only for organization-hierarchy
- D-08: MATRIX.md lead sentence stale ("174 rules" vs correct 180)
- D-09: Wave 2 closed Q-RD-07 + Q-RD-11 by inference; no inferred-resolutions tracking

## 6. 20 cross-cutting yes/no questions (Q-X-NEW-01..20 — full in REPORT.html)

## 7. Recommended new vault notes
- 12 GAP-BIZ-X-* files
- 6 trace files in 18-a-to-z-traces/
- 7 new top-level MOCs
- 8 new shared E-* entities

## Key file paths for next session
- `Brain Outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md`
- `Brain Outputs/datasets/authority-dataset/18-a-to-z-traces/_INDEX.md`
- `Brain Outputs/datasets/authority-dataset/18-a-to-z-traces/Add-Client.trace.md` (template)
- `Brain Outputs/prd/modules/root-documents/GAPS.md`
- `Brain Outputs/prd/modules/root-documents/QUESTIONS.md`
- `Brain Outputs/prd/modules/01..05/BUSINESS_RULES.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md`
- `Brain SK/_obsidian/40-API/` (15 E-* entities — 8+ proposed)
