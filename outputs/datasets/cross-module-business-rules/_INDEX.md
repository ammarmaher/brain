---
type: registry-index
title: Cross-Module Business Rules (BR-X-*)
created: 2026-05-18
source: Business deep-dive mining 2026-05-18
purpose: "Home for business rules that span 2+ PRD modules and therefore have no single owning module file. Each rule documents the cross-cut and proposed normative behavior."
---

# Cross-Module Business Rules — BR-X-* Registry

> Module-level PRD files (`01..05/BUSINESS_RULES.md`) own rules scoped within one domain. This registry holds rules that genuinely span 2+ modules — where the canonical text would arbitrarily live in only one module's PRD file and be lost to readers of the others.

## Why this exists

The 2026-05-18 business mining pass surfaced **13 cross-cutting rules** that today are either:
- Documented in one module's BR file with the other modules' BR files silent on the dependency
- Implicit in `Points to be covered later` (root-documents) but never authored
- Inferred from code reality (e.g. Wave 14/15 cross-field validators) but never PRD-confirmed
- Open questions that require a cross-module answer (e.g. "what happens when User is deleted?")

Each gets its own `BR-X-<NAMESPACE>-NN.md` file with PRD-style text, cross-module impact table, blocked-by dependencies, and a normative statement.

## Registered BR-X rules (stubs to be authored)

| BR-X id | Statement | Cross-cuts | Status |
|---|---|---|---|
| `BR-X-USER-CASCADE-01` | User Deleted ⇒ ContactGroups they created surface with `creator-deleted` status; Edit locked, shared-with users retain read access. | 02 + 04 | 🟡 stub — closes BR-CGM-32, BR-CGM-36 OPEN |
| `BR-X-USER-CASCADE-02` | User Deleted ⇒ Pending Templates they authored auto-Reject (reason `creator-deleted`); Approved templates remain. | 02 + 05 | 🟡 stub |
| `BR-X-USER-CASCADE-03` | Normal User Deleted ⇒ Wallet balance returns to parent Node wallet, tagged with deleted-user id for audit. | 02 + 01 | 🟡 stub — closes BR-AM-42 OPEN |
| `BR-X-ACCOUNT-LIFECYCLE-01` | Account termination lifecycle: `Active → Suspended → Deleted`. Suspended: AO login OK, writes 403, contracts continue, templates inactive. Deleted: full cascade per `BR-X-USER-CASCADE-*`. | All 5 | 🟡 stub — closes GAP-BIZ-X-02 |
| `BR-X-CONTRACT-EXTENSION-01` | When a Contract is Extended (Expired→Active per BR-CC-17), all WalletRecords previously subtracted from lump-sum (per BR-CC-38) MUST be re-added. | 03 + 01 | 🟡 stub |
| `BR-X-HIERARCHY-MOVE-01` | When a Node is Moved (re-parented), all child users' permission paths MUST re-resolve against the new parent; ContactGroups scoped to moved Node MUST follow; PES rules with path-prefix patterns MUST recompute. | 01 + 02 + 04 + PES | 🟡 stub — closes GAP-RD-03 |
| `BR-X-VISIBILITY-DOWNGRADE-01` | Hiding the only-active CommChannel of a Single-wallet account that has an Active Rate-Card-priced contract is FORBIDDEN. | 01 + 03 | 🟡 stub — closes BR-AM-40 OPEN |
| `BR-X-AUDIT-EVENT-01` | Every cross-module state-changing event MUST emit an audit record with `actor, at, targetEntity, targetId, previousState?, newState?, correlationId`. Cross-module correlation requires SINGLE `correlationId` across all consumers. | All | 🟡 stub — backed by `E-audit-event` |
| `BR-X-I18N-FALLBACK-01` | When `MultiLanguageName(En, Ar)` field is missing requested locale, fall back to the OTHER locale (NEVER empty string). When DB-stored messages are missing, fall back to `.resx`. | All | 🟡 stub — backed by `E-translation` |
| `BR-X-OTP-PURPOSE-COVERAGE` | Any new user-confirmation flow (Send Transaction confirm, Wallet Transfer confirm, Template Submit confirm) MUST reuse `E-otp-challenge` purpose-enum rather than invent new entity. | 02 + every consumer | 🟡 stub |
| `BR-X-PERMISSION-GROUP-01` | Permission Groups MUST be account-scoped (created inside an Account context). Cross-account Permission Group sharing is FORBIDDEN. Falcon-side roles use a separate set of PGs owned by the platform tenant. | 01 + 02 + PES | 🟡 stub — backed by `E-permission-group` |
| `BR-X-CHECKER-ROLE-01` | Template Checker role (per BR-TM-22) MUST be a PES permission key (`acc.template / approve`), not a per-user Maker/Checker flag. Default mapping: AO + NodeAdmin = both Maker+Checker; NormalUser = Maker only. | 02 + 05 | 🟡 stub — closes BR-TM-31 OPEN |
| `BR-X-DELIVERY-FAILURE-01` | When credential delivery (Email/Phone/Both per BR-UM-18) fails, the User MUST remain in Pending status and the wizard MUST surface a retry option. Spans Identity + Notification + every Add-User-style flow. | 02 + notification | 🟡 stub |

## How to use this registry

1. **Before authoring a new BR rule**, check whether the rule crosses modules. If yes, register it here as a `BR-X-*` file rather than in a single module's BUSINESS_RULES.md.
2. **When a module BR rule cites another module**, add a back-reference in this registry's matching `BR-X-*` file so the cross-cut is bidirectional.
3. **When a cross-module rule resolves an OPEN question in any module**, close that question by linking it to the new BR-X file (don't promote it inside the single module's BR file).

## Cross-references

- Module 01 BR rules: `Brain Outputs/prd/modules/01-account-management/BUSINESS_RULES.md`
- Module 02 BR rules: `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md`
- Module 03 BR rules: `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md`
- Module 04 BR rules: `Brain Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md`
- Module 05 BR rules: `Brain Outputs/prd/modules/05-templates/BUSINESS_RULES.md`
- Cross-cut feature matrix: `Brain Outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md`
- Pending questions (F-* halts): `Brain Outputs/datasets/authority-dataset/_pending-questions/`
- Business deep-dive: `Brain Outputs/reports/business-deep-dive-2026-05-18/REPORT.html`

## Authoring status

🟡 All 13 BR-X rules registered as STUB entries above. Each needs a dedicated `.md` file with full PRD-style text. Authoring is gated on the corresponding yes/no questions in `REPORT.html` (the answers determine the rule's normative phrasing).
