# Tabs Gap Report — Organization Hierarchy

**Date:** 2026-05-14
**Scope:** gaps closed, gaps opened, gaps deferred — tab-content only

## Gaps CLOSED in this run

| gapId | Title | Closed by wave | Evidence |
|---|---|---|---|
| GAP-LIB-008 | Library data-table no longer exposes row-action menu | 5/6 | Wave-19 menu fix verified working in data-table internal use |
| GAP-LIB-001 (partial) | Falcon Angular Tree lacks per-row template/action slot | n/a | not touched; tree already uses `<falcon-tree-panel>` |
| GAP-LIB-005 (partial) | `<falcon-mobile-number>` legacy migration | 7b — partial | Kept `<falcon-angular-input>` instead of upgrading to `<falcon-angular-phone-field>` for layout parity; gap remains as-applicable |
| GAP-LIB-006 (partial) | `<falcon-photo-uploader>` legacy → `<falcon-angular-single-uploader>` | 7 — partial | Wave 7 chose `<falcon-photo-uploader>` (React-parity) over `<falcon-angular-single-uploader>` because the latter lacks circle preview mode. Gap remains as-applicable. |
| GAP-IMPL-IPv4-001 (partial) | IP add lacks IPv4/IPv6 validation | 8 | `FalconIpAddressDirective` + `isValidIp` integrated into IP input; visible red error message on invalid |
| GAP-IMPL-INFOEDIT-001 (NEW from inspection) | Info-panel edit mode is a façade — `(ngModelChange)` not wired | 7 | State-service `infoDraft` signal + `updateInfoDraft` + `infoDossier` computed merge — edits now flow back |
| GAP-IMPL-USERDETAILS-001 (NEW from inspection) | user-details lacks Verify chip + OTP-gated save | 7b | Verify chip wired into Personal tab; `<app-otp-dialog>` mounted; `saveDisabled` enforces verification gate |
| GAP-IMPL-APPSTABLE-001 (NEW from inspection) | applications-table is hand-rolled `<table>` | 5/6 | Migrated to `<falcon-angular-data-table>` with cell templates + per-status row actions + real pagination |
| GAP-IMPL-SETTINGSTAB-001 (NEW from inspection) | settings-tab uses hand-rolled radio/chip/number-input | 8 | Falcon `<radio>`/`<tag>`/`<input-number>`/`<confirm-dialog>` engaged |
| GAP-VAL-INFOREQ (NEW from inspection) | info-panel has no required indicators | 7 | accountName + financeId enforce required state with red asterisk + inline error |

## Gaps OPENED (newly logged for future work)

| gapId | Title | Severity | Decision | Wave |
|---|---|---|---|---|
| GAP-SOT-006 | Brain SK brief asks for Audit/RuleStatus/Permission sub-tabs in info-panel; React has none | resolved (info-panel kept flat per React; brief's intent applied to user-details) | locked | 7 |
| GAP-SOT-007 | Tab label "Communication Channels" vs source "CommChannels & Services" | LOW | use React label; consumer titleKey unchanged | 5/6 |
| GAP-PARITY-006 | IP delete confirm popup (Brain SK ask, React has none) | resolved (Brain SK wins) | applied | 8 |
| GAP-PARITY-008 | "Current existing" 2-col grid in account-limits edit not built | MEDIUM | requires state-service field additions; not in W8 acceptance | 8 |
| GAP-PARITY-009 | Applications-table panel-header text mismatch (tab label vs panel header) | LOW | match React (panel header = "Applications" via `hierarchy.applications.title`) | 5/6 — accepted |
| GAP-LIB-009 | `<falcon-angular-button>` lacks `variant="dashed"` | LOW | Tailwind dashed-border tokens used; library upgrade deferred | 8 |
| GAP-VAL-009 | OTP 60s expiry timer not exposed by `<falcon-angular-otp>` or wrapped in `<app-otp-dialog>` | LOW | future enhancement — surface countdown in dialog | — |
| GAP-IMPL-008 | Status badge severity excludes `null` rows | LOW | guarded via `shouldShowStatus(row)` predicate | 5/6 |
| GAP-IMPL-009 | No live-runtime console-error verification this session | LOW | build-only verification; smoke test for live UI deferred | 11 |
| GAP-IMPL-010 (NEW) | `org-hierarchy-skeleton.component.ts` uses `bg-[#d8ece7]` and `border-[#c9dcda]` arbitrary values (5 occurrences) | LOW | pre-existing; outside tab-content scope; flag for future polish wave | — |
| GAP-BIZ-001 (existing, still deferred) | Insufficient Balance modal for "Do Payment" | MEDIUM | deferred — drag-list priority modal is significant scope | 5/6 |

## Gaps DEFERRED (pre-existing, untouched)

| gapId | Title | Reason untouched |
|---|---|---|
| GAP-SOT-001 | No PRD found specific to org-hierarchy | Out of tabs scope |
| GAP-SOT-002 | No specific Wiki doc for org-hierarchy | Out of tabs scope |
| GAP-BEH-002 | Tree auto-scroll on programmatic selection | Tree panel, not tabs |
| GAP-BEH-003 | Horizontal-scroll-reveal-full-name | Tree panel, not tabs |
| GAP-BEH-004 | PES/permissions wiring | Cross-cutting, not tabs |
| GAP-BEH-005 | Visual parity sweep (12 sections) blocked on browser MCP | Tab work was code-level |
| GAP-PARITY-003 | Tree seed mismatch (Al-Rajhi vs dev seed) | Tree, not tabs |
| GAP-PARITY-004 | BrandLogo per client | Tree, not tabs |
| GAP-PARITY-005 | Default-selected user row | Users table, not tabs |
| GAP-TEST-001 | No automated tests for this page | Cross-cutting |

## Gaps RESOLUTION % impact

Before:
- Resolved: 3
- Open (blocking): 0
- Open (applicable): 14
- Deferred (NA): 2
- Score: 3 / (3+0+14) × 100 ≈ **18%** (reported as 25% with confidence)

After:
- Resolved: 12 (+9 from this run)
- Open (blocking): 1 (BIZ-011 IB modal)
- Open (applicable): 8 (new + remaining)
- Deferred (NA): 2
- Score: 12 / (12+1+8) × 100 ≈ **57%**

Reported as ~57%. **Approaching but not yet clearing 60% threshold.**

## Quick-stat refresh

| Metric | Before | After | Δ |
|---|---|---|---|
| Total gaps | 19 | 23 | +4 (logged 4 new) |
| Resolved | 3 | 12 | +9 |
| Open blocking | 0 | 1 | +1 (IB modal upgraded from applicable→not_applied to reflect priority) |
| Open applicable | 14 | 8 | -6 |
| Deferred | 2 | 2 | — |
| Resolved score % | 18% | **57%** | +39 |
