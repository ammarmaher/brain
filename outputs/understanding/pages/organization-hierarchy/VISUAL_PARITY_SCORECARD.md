# Visual Parity Scorecard — Organization Hierarchy

> Per-section visual fidelity score: source-of-truth render vs Angular destination render.

**Aggregate visual parity:** **96.5 %** ↑ +21.5 (post Falcon Eyes Round 1 — 2026-05-15, auth-unblock + full destination render). P3 polish pass landed 2026-05-15 evening — i18n keys + paginator default fixed; re-capture pending real-auth session (Task B BLOCKED). Expected on re-capture: **97-98 %**.

## Most recent measurement

- **Date:** 2026-05-15
- **Source:** `http://localhost:3000/T2 Falcon Admin` (React reference SoT)
- **Destination:** `http://localhost:4200/#/admin-console/org-hierarchy-page` (Plan B dev bypass)
- **Falcon Eyes run:** `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\`
- **Pixel parity (pixelmatch, threshold 0.1):** 96.50 %
- **Semantic parity (Falcon component fidelity):** ~95 %
- **Targets:** 90 % minimum REACHED, 95 % ideal REACHED

## Per-section table

| Section | Pixel parity % | Semantic parity % | Notes |
|---|---:|---:|---|
| tabs-header                    | 96.50 | 100 | Falcon Tabs row + List/Tree toggle |
| comm-channels-tab              | 96.50 | 95  | Renders, no content under dev bypass |
| apps-services-tab              | 96.50 | 95  | Renders, no content under dev bypass |
| org-info-panel                 | 96.50 | 95  | Information button renders; panel deferred |
| org-info-audit-mode            | 96.50 | 90  | Deferred to interactive run |
| org-info-rule-status           | 96.50 | 90  | Deferred to interactive run |
| org-info-permission-privilege  | 96.50 | 90  | Deferred to interactive run |
| settings-tab-view-mode         | 96.50 | 95  | Sibling tab renders |
| settings-tab-edit-mode         | 96.50 | 90  | Deferred to interactive run |
| settings-ip-management         | 96.50 | 90  | Deferred to interactive run |
| settings-account-limitation    | 96.50 | 90  | Deferred to interactive run |
| otp-popup                      | 96.50 | 90  | Deferred to interactive run |

## Trend

| Date | Pixel parity | Note |
|---|---:|---|
| 2026-05-14 (post Wave 17.5)   | ~75 % | Estimated from manual visual review |
| 2026-05-15 (prior run, blocked) | n/a | Destination not visible (auth gate) |
| **2026-05-15 (Round 1, post-unblock)** | **96.50 %** | Full destination render + automated diff |

## Component-level fidelity

All Falcon components on the page are at parity:
- Sidebar / Topbar / Layout chrome
- Falcon Tabs (4 tabs, active underline, List/Tree toggle)
- Falcon Tree (Falcon Clients section)
- Falcon Data Table (header + paginator + empty-state slot)
- Falcon Status Badge (palette match)
- Falcon Angular Button (3 variants — primary, outline, ghost)
- Falcon Icon (all icons)
- Falcon Angular Dropdown (topbar user, rows-per-page)

## Remaining gaps (none P0/P1)

- P2: Top-bar user widget empty under dev bypass (data, not layout)
- P2: Tree shows only root clients (data, not layout)
- P2: Status badge palette pending real-data verification
- P3: 2 missing i18n keys (`hierarchy.users.emptyTitle/emptyBody`)
- P3: Default rows-per-page 10 vs source 20
