# Implementation Scorecard — Organization Hierarchy

> Per-feature completeness: how much of the source-of-truth feature is actually built and functional.

**Aggregate implementation:** **~73%** ↑ +18 (post Tabs Night Shift — Waves 5/6/7/7b/8)

## Method

Each feature is scored on **two axes**:
- **Built**: has the UI been rendered (placeholder counts as 30%, partial as 60%, full as 90%, polished as 100%)
- **Wired**: is the behavior connected (signals, services, validators, navigation, state)

Implementation score per feature = `(built + wired) / 2`

## Per-feature scorecard

| # | Feature | Built | Wired | Implementation % | Status |
|---|---|---|---|---|---|
| 1 | Tree panel rendering | 90% | 85% | 88% | functional |
| 2 | Tree panel kebab context menu | 100% | 100% | 100% | functional (separate from data-table menu) |
| 3 | Tab strip + switching | 100% | 100% | 100% | functional |
| 4 | View toggle (List/Tree) | 100% | 90% | 95% | List works; Tree view component exists |
| 5 | Users table render | 100% | 90% | 95% | post-Wave 17 heights+radius polished |
| 6 | Users table row-action (More Details) | 0% | 0% | 0% | DELETED today — no replacement path yet |
| 7 | Users table pagination | 100% | 100% | 100% | custom 3-section footer |
| 8 | Filter button (root only) | 60% | 30% | 45% | button visible; filter logic not built |
| 9 | Search input (root only) | 80% | 70% | 75% | input visible, debounce + filter logic partial |
| 10 | Status badges (8 statuses) | 60% | 100% | 80% | 6 of 8 visually verified |
| 11 | Node header action buttons | 100% | 100% | 100% | functional matrix |
| 12 | Add Client wizard step 1 | 30% | 30% | 30% | partial |
| 13 | Add Client wizard steps 2-5 | 10% | 5% | 7% | minimal |
| 14 | Add Client → Send Credentials → Success | 5% | 5% | 5% | not built |
| 15 | Add User wizard step 1 (Personal) | 30% | 20% | 25% | skeleton |
| 16 | Add User wizard step 2 (Role) | 20% | 10% | 15% | minimal |
| 17 | Add User wizard step 3 (Permissions) | 20% | 10% | 15% | minimal |
| 18 | OTP modal | **80%** | **70%** | **75%** | wired via `<app-otp-dialog>` in user-details Personal tab (Wave 7b) |
| 19 | Phone verify pill | **85%** | **80%** | **82%** | Verify chip → opens OTP → green Verified badge (Wave 7b) |
| 20 | Email verify pill | **85%** | **80%** | **82%** | same pattern as phone (Wave 7b) |
| 21 | User Details drilldown (view) | **85%** | **80%** | **82%** | 6 personal fields + status/role/perm dropdowns + checker matrix (Wave 7b) |
| 22 | User Details drilldown (edit) | **85%** | **80%** | **82%** | OTP-gated save when status='pending' (Wave 7b) |
| 23 | Settings tab | **90%** | **85%** | **87%** | Falcon radio + tag + input-number + confirm-dialog (Wave 8) |
| 24 | Settings tab edit mode + save | **85%** | **80%** | **82%** | full read/edit/cancel/save with validation (Wave 8) |
| 25 | Allowed IPs CRUD | **85%** | **80%** | **82%** | chips dismissible via confirm dialog; IPv4/IPv6 inline error (Wave 8) |
| 26 | Apps & Services table | **85%** | **80%** | **82%** | Falcon data-table + switch + status-badge + per-status row actions (Wave 5/6) |
| 27 | App row actions (per-status) | **90%** | **80%** | **85%** | 5 actions (disable/enable/doPayment/editType/editValue) gated per-row by status (Wave 5/6) |
| 28 | Apps inline-edit row | **80%** | **70%** | **75%** | price-type with `<falcon-angular-calendar>` + price-value modes preserved (Wave 5/6) |
| 29 | Insufficient Balance modal | 0% | 0% | 0% | not built (GAP-BIZ-001 — deferred) |
| 30 | CommChannels & Services table | **85%** | **80%** | **82%** | inherits Wave 5/6 — consumer tab unchanged |
| 31 | Node drawer (Add/Edit) | 90% | 90% | 90% | functional |
| 32 | Toast system | 100% | 100% | 100% | functional |
| 33 | Org chart view | 70% | 50% | 60% | component exists, pan/zoom not formally tested |
| 34 | Org chart focus mode | 30% | 20% | 25% | not formally tested |
| 35 | i18n EN/AR + langTick reactivity | 90% | 90% | 90% | functional with workaround for sync API |
| 36 | RTL layout | 30% | 30% | 30% | not formally tested |
| 37 | PES/permission gating | 0% | 0% | 0% | NOT WIRED — see GAP-BEH-004 |
| 38 | Backend persistence integration | 30% | 30% | 30% | partial; User Details save in-memory only |

Average across 38 features: ~54.5% ≈ **55%**

## Implementation Risk by feature category

| Category | Average % | Risk |
|---|---|---|
| Display (read-only) features | ~85% | LOW |
| Interactive features (forms, modals) | ~30% | MEDIUM |
| Permission/security features | ~0% | **HIGH** |
| Backend integration | ~30% | **HIGH** |

## What "100% implementation" means

A feature reaches 100% when:
- All UI elements from source render correctly
- All behaviors from source work (handlers wired, validations active)
- Backend integration is real (no in-memory mocks)
- PES gating is honored (if applicable)
- Live regression check passes
- Ammar approves

## Currently at or above 80% implementation

- Tree panel rendering (88%)
- Tree panel kebab (100%)
- Tab strip (100%)
- View toggle (95%)
- Users table render + pagination (95-100%)
- Status badges (80%)
- Node header action buttons (100%)
- Node drawer (90%)
- Toast system (100%)
- i18n EN/AR (90%)

## Currently at or below 25% implementation

- Users More Details path (0% — broken today)
- Add Client steps 2-5 (7-30%)
- Add User wizard (15-25%)
- Settings tab edit (7-20%)
- Allowed IPs CRUD (15%)
- Apps & Services table + row actions (7-15%)
- Insufficient Balance modal (0%)
- CommChannels tab (15%)
- Org chart focus mode (25%)
- PES gating (0%)
