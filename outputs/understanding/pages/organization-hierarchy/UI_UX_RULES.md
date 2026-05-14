# UI / UX Rules — Organization Hierarchy

> Granularity: element/section level. Status taxonomy per [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md).

## Quick stats

| Total | Applied | Not Applied | Applicable | Not Applicable | Partial | Unknown |
|---|---|---|---|---|---|---|
| 32 | 11 | 8 | 5 | 2 | 3 | 3 |

**Dimension score: 25%** = 11 / (11 + 8 + 5 + 0.5×3 + 0.5×3) / × 100 ≈ 25%

---

## Chrome (sidebar / topbar)

These are host-shell concerns. Listed for completeness but not blocking org-hierarchy score.

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-001 | Sidebar uses CSS Grid `[sidebar 224px \| main 1fr]` | HTML §1 | `host-shell` layout | unknown | Not verified in admin-console context yet | Live diff against React reference | 2026-05-14 | host-shell |
| UIUX-002 | Sidebar bg `--teal #0d3f44` | HTML §2 | live page shows teal sidebar | applied | Confirmed in today's screenshots | — | 2026-05-14 | host-shell |
| UIUX-003 | Topbar height `72px` | HTML §1 | not measured | unknown | Need live measurement | Measure on next sweep | 2026-05-14 | host-shell |
| UIUX-004 | Breadcrumb: `home-icon › Home › Org Hierarchy` | HTML §1 | live page: `Home › Org Hierarchy` text visible | applied | Visible in screenshots | — | 2026-05-14 | host-shell |

## Tree panel (left, 272px)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-005 | Tree panel width `--clients-w 272px` | HTML §4 | template `grid-cols-[272px_1fr]` | applied | Matches in `org-hierarchy-page-menu.component.html` line 16 | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-006 | Falcon root rendered as special row above scrollable list | HTML §4 | live page shows root + section label | applied | Confirmed | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-007 | "Falcon Clients" section header label | HTML §4 | template `clientsLabelKey="hierarchyTab.tree.clientsLabel"` | applied | Visible in screenshots | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-008 | Tree row selected state: `--teal-light #e8f0f1` bg + teal name | HTML §4 styles.css 477-663 | live | applied | Confirmed visual today | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-009 | Hover-path: ancestor rails get teal stripe gradient | HTML §4 | unknown | unknown | Not formally verified | Live diff on hover | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-010 | Chevron `.client-chev` rotates between open/collapsed states + `.invisible` for leaves | HTML §4 | unknown | unknown | Visible in screenshots but state matrix not formally verified | Verify across leaf/branch/root | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-011 | Kebab btn visible on hover OR selected (opacity 0 → 1) | HTML §4 | live | applied | Visible in screenshots when row hovered | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-012 | Context menu items per node type (root: AddClient+AddUser; node/client: AddNode+EditNode+AddUser) | HTML §4 | template `ROOT_ACTIONS` + `NODE_ACTIONS` | applied | Visible in code at `org-hierarchy-page-menu.component.ts` line 40-49 | — | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-013 | Context menu anchoring (LTR: pin right edge of menu to right edge of btn; RTL: pin left) | HTML §4 | unknown | unknown | RTL not tested | RTL sweep | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-014 | Tree auto-scroll on programmatic selection | HTML §4 | not implemented | not_applied | No `el.scrollIntoView` call in current Angular code | Add to tree-panel directive or use signal effect | 2026-05-14 | `<falcon-tree-panel>` |
| UIUX-015 | Horizontal scroll reveals full names (`.is-scrolled` modifier) | HTML §4 | not implemented | not_applied | Not in current tree-panel | Library upgrade or page-side CSS | 2026-05-14 | `<falcon-tree-panel>` |

## Tab strip + view toggle

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-016 | Tab strip labels per node type (root: Hierarchy+Settings; client/node: 4 tabs) | HTML §5 | `state.visibleTabs()` computed | applied | Verified — Hierarchy + Settings only when root; 4 tabs when client | — | 2026-05-14 | `<falcon-angular-tabs>` |
| UIUX-017 | View toggle (List/Tree) inline with tab strip, only on Hierarchy tab | HTML §5 | `<ng-template falconTabActions="hierarchy">` | applied | Done in Wave 17.1 | — | 2026-05-14 | `<falcon-angular-tabs>` |
| UIUX-018 | Active tab gets `border-bottom-color: var(--teal)` + weight 600 | HTML §5 | lib renders this | applied | Visible | — | 2026-05-14 | `<falcon-angular-tabs>` |

## Node header (page header, in `.node-header`)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-019 | Node title: avatar + name (BMW icon, BrandLogo, or initial circle) | HTML §3 | `<app-org-node-header>` | applied | Visible | — | 2026-05-14 | none |
| UIUX-020 | Top-right action buttons per scenario (root → AddClient+AddUser; client/node → Info+AddNode+AddUser; etc.) | HTML §3 | `[canShow*]` inputs | applied | Visible button matrix matches | — | 2026-05-14 | none |
| UIUX-021 | Compact button sizes (`h-8 px-3` per Wave 17.2) | User request 2026-05-13 | template | applied | Confirmed today's screenshots | — | 2026-05-14 | none |

## Users table

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-022 | Columns: Username/FirstName/Email/Phone/Role/PermGroup/Status | HTML §6 | `state.userColumns()` | applied | Visible | — | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-023 | Phone column `dir="ltr"` (keeps phone LTR in RTL) | HTML §6 | unknown | unknown | RTL not tested | RTL sweep | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-024 | Status badge per status (Active/Pending/Suspended/Locked/Deleted/Expired/Disable/Inactive) | HTML §7 | `<app-falcon-status>` | applied | Today's screenshot shows Pending badge orange | — | 2026-05-14 | `<app-falcon-status>` |
| UIUX-025 | Row action menu (3-dot) opens "More Details" → drill-in | HTML §6 | **REMOVED** (today's library deletion) | not_applicable | Kebab column was suppressed library-wide today; drill-in path needs new mechanism | Future: re-enable kebab once library syncProps bug fixed (BUG-2026-05-14-004), or surface "More Details" via row-click | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-026 | Filter btn + Search input ONLY on root node table | HTML §6 + §10 | template `@if (state.isRootSelected() && usersView === 'list')` | applied | Verified in template | — | 2026-05-14 | `<falcon-angular-input>` |
| UIUX-027 | Table header bg + footer bg match (both `--color-falcon-neutral-30`) | User request 2026-05-13 | inline `--falcon-table-header-bg` + `--falcon-table-footer-bg` | applied | Both rgb(250,250,250) verified today | — | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-028 | Table container border-radius = 0 (all 4 corners) | User request 2026-05-14 | `--falcon-table-container-border-radius: 0px` | applied | Verified today (0px/0px/0px/0px) | — | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-029 | Header / data-row / footer rows ALL same visible height (~65px) | User request 2026-05-14 | `--falcon-table-header-padding-block: 25px` + `--falcon-table-cell-padding-block: 20px` | applied | Today's measurement: within 0.94px | — | 2026-05-14 | `<falcon-angular-data-table>` |
| UIUX-030 | Pagination footer 3-section layout (Showing X-Y \| pager \| RowsPerPage) | HTML §6 | `<app-falcon-custom-table-footer>` | applied | Verified today | — | 2026-05-14 | `<app-falcon-custom-table-footer>` |
| UIUX-031 | RowsPerPage dropdown corner radius medium (`rounded-sm` = 8px in Falcon scale) | User request 2026-05-14 | `rounded-sm` on select | applied | Computed 8px verified today | — | 2026-05-14 | `<app-falcon-custom-table-footer>` |
| UIUX-032 | "Rows per page" label appears BEFORE the dropdown | User request 2026-05-13 | Today: native label in template; previously injected via JS | partially_applied | Currently using native `<label>` in custom footer; legacy effect also injects one in some paths — could double-render | Audit: remove redundant JS-side injection now that custom footer has native label | 2026-05-14 | `<app-falcon-custom-table-footer>` |

## Information panel (drill-in)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-033 | 4-col grid Top + Bottom sections (17 fields total) | HTML §11 | `<app-org-info-panel>` | unknown | Component exists; field count not verified | Live diff field-by-field | 2026-05-14 | none |
| UIUX-034 | View/Edit mode toggle via header buttons | HTML §11 | unknown | unknown | Not verified live | Live test | 2026-05-14 | none |

## Wizards (Add Client, Add User)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-035 | Add Client wizard: 5 steps with horizontal step bar | HTML §12 | `<app-add-client-wizard>` | applicable | Component exists; step count needs verification | Wave 5/6 follow-up | 2026-05-14 | `<falcon-angular-stepper>` |
| UIUX-036 | Add User wizard: 3 steps | HTML §13 | `<app-add-user-wizard>` | applicable | Component exists; step content needs verification | Verify against React | 2026-05-14 | `<falcon-angular-stepper>` |
| UIUX-037 | Wizard step pane animation (`.in-right` / `.in-left`) | HTML §21 | unknown | unknown | Animation timing not verified | Visual sweep | 2026-05-14 | none |

## Org chart (Tree view)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-038 | Chart card dimensions: 180×56, gaps 60/14, pad 24 | HTML §18 | `<app-org-chart>` | applicable | Component exists, dimensions not verified | Live check | 2026-05-14 | none |
| UIUX-039 | Focus mode: user circles ring below focused card | HTML §18 | unknown | unknown | Focus mode not verified live | Live test | 2026-05-14 | none |

## Status pills (canonical)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-040 | All 8 status pills have exact colors per HTML §7 table | HTML §7 styles.css 1319-1351 | `STATUS_MAP` in `<app-falcon-status>` | partially_applied | 6 of 8 verified (active/pending/suspended/locked/deleted/inactive); expired and disable not verified live yet | Live test those two states | 2026-05-14 | `<app-falcon-status>` |

## Kanban view

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-041 | Kanban board view as alternate to list | HTML §6 (KanbanView) | template renders placeholder "not surfaced in v1" | not_applicable | Deferred per Wave 17 decision | Implement when business decides | 2026-05-14 | none |

## OTP modal

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked | Related |
|---|---|---|---|---|---|---|---|---|
| UIUX-042 | 6-digit OTP boxes split 3+3 with separator | HTML §14 | uses lib OTP | partially_applied | Lib component used, exact 3+3 split needs verify | Visual sweep | 2026-05-14 | `<falcon-angular-otp>` |
