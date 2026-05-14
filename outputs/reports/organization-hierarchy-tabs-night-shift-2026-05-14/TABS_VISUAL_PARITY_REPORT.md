# Tabs Visual Parity Report — Organization Hierarchy

**Date:** 2026-05-14
**Method:** code-level parity (no live browser comparison — task spec disallows dev-serve UI testing during implementation)

## Per-tab parity (post-implementation)

| # | Tab area | Source ref | Parity before | Parity after | Δ | Notes |
|---|---|---|---|---|---|---|
| 0 | Tab strip + view-toggle slot | `hierarchy.jsx:1191-1277` | 90% | 90% | — | Already healthy; not touched |
| 1 | comm-channels-tab → applications-table | `apps.jsx:1-628` | 10% (hand-rolled `<table>`) | **85%** | **+75** | Falcon data-table + switch + status-badge + per-status row actions; gap: Insufficient Balance modal |
| 2 | apps-services-tab → applications-table | `apps.jsx:1-628` | 10% (hand-rolled `<table>`) | **85%** | **+75** | Inherits Wave 5; gap: same as comm-channels |
| 3 | falcon-org-info-panel (node info) | `hierarchy.jsx:992-1146` | 30% (façade) | **80%** | **+50** | Real edits via state-service draft, dropdowns, photo uploader; gap: per-field placeholder text |
| 3b | user-details-page | `userdetails.jsx:1-479` | 50% (3-tab skeleton) | **80%** | **+30** | 6 req fields, OTP-gated save, status/role/permission dropdowns, checker matrix; gap: full image uploader for user picture |
| 4 | settings-tab → client-settings-step | `settingstab.jsx:1-273` + `addclient.css:399-568` | 20% (hand-rolled) | **85%** | **+65** | Falcon primitives + confirm dialog on IP delete; gap: "Current existing" 2-col cells (deferred GAP-PARITY-008) |

**Aggregate (5 tab areas):** ~83% (was ~24% — +59%)

## Visual parity scorecard delta (impact on page-level)

| Section in `VISUAL_PARITY_SCORECARD.md` | Before | After |
|---|---|---|
| #11 CommChannels tab | 10% | **85%** |
| #12 Apps & Services tab | 10% | **85%** |
| #9 Info panel | 30% | **80%** |
| #10 Settings tab | 20% | **85%** |
| #16 User Details drill-in | 50% | **80%** |
| #18 OTP modal | 40% | **65%** (now wired into user-details with all-zeros-pass) |

**New aggregate visual parity for the page:** ~75% (was 52%) — +23.

## Things that LANDED on visual parity

- 9-column data table with proper status badges + visibility toggles + per-status row action menu (BIZ-010 matrix from React)
- Inline edit row (price-type with date picker, price-value with number input) preserved end-to-end
- Real pagination ([10,20,30,40], default 20) instead of dead "1 of 1" footer
- Info-panel edit mode: 17 fields persist via state-service draft; 5 dropdowns render with React-parity option lists; 2 required fields show red asterisk + inline error
- Photo uploader in info-panel edit mode replaces single-letter avatar circle
- User-details Personal tab now has 6 required fields with Verify chip on phone/email; OTP-gated save when `status==='pending'`
- Settings tab: Falcon radio cards, IP chip dismissal via confirm dialog, account-limit ±1 buttons via input-number

## Things that didn't reach 90% (logged as gaps)

| Gap | Wave | Severity | Decision |
|---|---|---|---|
| Insufficient Balance modal for "Do Payment" action | 5/6 | medium | deferred GAP-BIZ-001 (out of tab-content polish scope) |
| Pending-toggle chevron in action column | 5/6 | low | not modeled in data-table API; consumer-side cell template could add later |
| Custom 3-section table footer ("Showing X-Y from Z") | 5/6 | low | uses default paginator footer; users-table on same page already has the 3-section custom |
| Per-field placeholder text in info-panel (e.g. "Start with letter · Max 30 Characters") | 7 | low | future UX pass |
| Photo uploader for user picture in user-details Personal tab | 7b | low | not in W7b acceptance criteria |
| `<falcon-angular-phone-field>` integration in user-details | 7b | low | kept `<falcon-angular-input>` + Verify chip for layout parity |
| "Current existing" 2-col grid in account-limits edit | 8 | medium | GAP-PARITY-008 — needs state-service field additions |
| Dashed `<falcon-angular-button variant="dashed">` | 8 | low | GAP-LIB-009 — library upgrade candidate; Tailwind tokens used as workaround |
| Skeleton component uses `bg-[#hex]` (pre-existing) | — | low | GAP-IMPL-010 (NEW) — not touched, outside tab scope but flagged |

## Live regression NOT performed

- Per task spec: "Do NOT run dev-serve, preview tools, or browser verification during implementation" (feedback_no_ui_testing_during_implementation.md). Code-level parity + build-green is the highest verification this wave allows.
- The dev server WAS running at 200 throughout (verified at start + at smoke test), but tab content was not exercised in a browser. Live runtime verification deferred to a separate "UI test" session.
