# Tabs Business Rule Report — Organization Hierarchy

**Date:** 2026-05-14
**Scope:** business rules applied or affected by tab-content work

## Rule status (post-implementation)

| ruleId | Title | Source | Before | After | Wave |
|---|---|---|---|---|---|
| BIZ-006 | "More Details" drill-in → UserDetailsPage | HTML §6 + §22 | applied (Wave 18 row-click) | applied (unchanged) | — |
| BIZ-007 | UserDetailsPage save is in-memory only | Wave 12 decision | applied | applied (Wave 7b retains in-memory) | — |
| BIZ-008 | UserDetailsPage shows verify badge per phone/email | HTML §22 | unknown | **applied** — Verify chip (warning palette) when not verified, green Verified badge after OTP success | 7b |
| BIZ-009 | User Status is READ-ONLY in Add User AND in UserDetails edit | HTML §13 + §22 | unknown | **applied** — Role tab status dropdown rendered with `[readonly]=true` (matches React `.au-select-disabled`) | 7b |
| BIZ-010 | Apps & Services status drives row actions | HTML §7 row action matrix | not_applied | **applied** — per-row visible predicate on each action (Disable / Enable / Edit Price Type / Edit Price Value / Do Payment) maps to `row.status` exactly per React | 5/6 |
| BIZ-011 | "Do Payment" opens Insufficient Balance modal | HTML §7 | applicable | **partially_applied** — Do Payment action triggers status flip to `active` (optimistic); IB modal still deferred (GAP-BIZ-001) | 5/6 |
| BIZ-012 | Add Client wizard final step → Send Credentials → Success → toast | HTML §12 | applicable | unchanged (wizard out of tabs scope) | — |
| BIZ-013 | Wizard supports backward navigation only | HTML §12 | applicable | unchanged | — |
| BIZ-014 | Root node Settings tab shows ONLY left card (no right-side account limits) | HTML §9 | applicable | **applied** — `[CODE]` `client-settings-step.component.html` has `@if (!isRoot)` around the right aside; verified in Wave 8 | 8 (verified) |
| BIZ-NEW-015 (NEW) | OTP-gate Personal Info save when status='pending' | Brain SK extension of VAL-005/006 | n/a | **applied** — `saveDisabled` signal blocks save until both `phoneVerified && emailVerified` | 7b |
| BIZ-NEW-016 (NEW) | CommChannel Checker Level per channel (WhatsApp/Voice → none/level1/level2) | HTML §13 step 3 + userdetails | not_applied | **applied** — 2-row radio matrix; selection stored in `User.checkerWhatsapp` / `checkerVoice` (additive User-model fields) | 7b |
| BIZ-NEW-017 (NEW) | IP delete confirmation | Brain SK ask | n/a | **applied** — `<falcon-angular-confirm-dialog severity="danger">` on chip dismiss | 8 |

## Dimension score impact

Before: 3/(3+3+5)×100 ≈ **27%**
After: 9/(9+1+4+0.5×1)×100 ≈ **62%**

(applied = 9; not_applied = 1 (BIZ-011 IB modal still missing); applicable = 4 (wizard rules); partial = 1 × 0.5)

**New dimension score: ~62%** — just clears the 60% NEEDS-ATTENTION threshold.

## What still blocks 100%

- BIZ-011 Insufficient Balance modal (drag-and-drop priority list) — deferred GAP-BIZ-001
- BIZ-012/013 Add Client wizard final flow — out of tabs scope
- BIZ-DEFERRED-1 Kanban view — deferred indefinitely
- PES/permission gating (GAP-BEH-004) — not in tabs scope
