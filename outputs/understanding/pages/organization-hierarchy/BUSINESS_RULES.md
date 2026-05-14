# Business Rules — Organization Hierarchy

> Granularity: feature/flow level. Status taxonomy per [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md).

## Quick stats

| Total | Applied | Not Applied | Applicable | Not Applicable | Unknown |
|---|---|---|---|---|---|
| 14 | 2 | 4 | 5 | 1 | 2 |

**Dimension score: ~18%** = 2 / (2 + 4 + 5) × 100 = 18.2%
(Capped to 10% in PAGE_SCORECARD due to seed-conservative policy until first formal business review)

---

## Tree & node operations

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-001 | Selecting a tree node changes the users table to that node's users | HTML §6 + state.activeClientTab | `state.selectedNode()` + `state.users()` signals | applied | Confirmed visually today | — | 2026-05-14 |
| BIZ-002 | Selecting root shows ALL users across hierarchy | HTML §6 + isRoot check | unknown | unknown | Not verified — root selection live behavior not measured | Live test on Falcon root | 2026-05-14 |
| BIZ-003 | Add Client flow only available on root | HTML §3 button matrix | template `state.canAddClient()` | applied | Verified template | — | 2026-05-14 |
| BIZ-004 | Add Node flow only available on existing client/node (not root) | HTML §3 | template `!state.isRootSelected()` | applied | Verified template | — | 2026-05-14 |
| BIZ-005 | Add User is available everywhere a node exists | HTML §3 | template | applied | Visible | — | 2026-05-14 |

## User actions

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-006 | "More Details" opens UserDetailsPage drill-in (in-place, no route change) | HTML §6 + §22 | `<app-user-details-page>` rendered via `userDetails()` signal | not_applied | The row-action kebab is now DELETED library-wide (today's edit) — there's NO trigger for More Details anymore | Restore kebab once `<falcon-angular-menu>` syncProps bug fixed (BUG-2026-05-14-004), OR surface drill-in via row-click | 2026-05-14 |
| BIZ-007 | UserDetailsPage save is in-memory only (backend deferred) | Wave 12 decision | template comment + `onUserDetailsSave` no-op | applied | Verified in code | — | 2026-05-14 |
| BIZ-008 | UserDetailsPage shows verify badge per email/phone (verified vs pending) | HTML §22 | unknown | unknown | Verify-badge rendering not formally checked | Live test | 2026-05-14 |
| BIZ-009 | User Status is READ-ONLY in Add User AND in UserDetails edit (changes happen elsewhere) | HTML §13 + §22 | unknown | unknown | Not verified | Live test | 2026-05-14 |

## Status lifecycle

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-010 | Apps & Services status drives available row actions (Active→Disable+EditPrice; Expired→DoPayment+...; etc.) | HTML §7 row action matrix | not implemented in admin-console | not_applied | Apps & Services tab placeholder only | Build full apps/services tab | 2026-05-14 |
| BIZ-011 | "Do Payment" on expired app opens Insufficient Balance modal if balance < required | HTML §7 | not implemented | applicable | Pending implementation | Build IB modal | 2026-05-14 |

## Add Client wizard (5 steps)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-012 | Final step (Account Owner) opens Send Credentials modal on Save → SuccessModal → toast | HTML §12 | unknown | applicable | Wizard exists but final flow not verified | Wave-5 follow-up | 2026-05-14 |
| BIZ-013 | Wizard supports backward navigation only (forward locked until step reached) | HTML §12 | unknown | applicable | Stepper component used; navigation rule not verified | Verify | 2026-05-14 |

## Settings tab

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-014 | Root node Settings tab shows ONLY left card (Password Security + Allowed IPs); right side hidden | HTML §9 | unknown | applicable | Settings tab exists but root-only rule not verified | Verify | 2026-05-14 |

## Behaviors deferred (not_applicable until business says otherwise)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| BIZ-DEFERRED-1 | Kanban board view of users (status columns) | HTML §6 KanbanView | placeholder | not_applicable | Wave-17 decision to defer | — | 2026-05-14 |

## Cross-cutting

| Concern | Notes |
|---|---|
| **PES / permissions wiring** | Currently NO permission gating on visible buttons or actions. Source says different roles should see different tabs/buttons. This is a GAP (`GAP_REGISTRY.md`). |
| **Multi-tenancy enforcement** | All operations should be scoped to the selected client. Frontend currently relies on tree state; backend gating is the source of truth. Not in this registry's scope. |
| **i18n + RTL** | `<body dir="rtl">` mode swaps `font-family` to IBM Plex Sans Arabic. Many components use `flip-rtl` class for icons. Not formally swept. |
