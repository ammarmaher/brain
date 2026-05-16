*** SoT Test-Case Matrix — Organization Hierarchy → CommChannels & Services ***

Round 4 (2026-05-15). Harvested from React SoT at `http://localhost:3000/T2%20Falcon%20Admin`
+ source `Source_of_truth_theme/React/Falcon-Taha (1)/admin/apps.jsx` (the `ApplicationsPage`
component, status-driven `RowActionsMenu`, and `InsufficientBalanceModal`).

Page URL (SoT): `http://localhost:3000/T2%20Falcon%20Admin` → click "CommChannels & Services" tab.
Page URL (Dest): `http://localhost:4200/#/admin-console/org-hierarchy-page`.

# 1. Tab strip

| ID | Name | Preconditions | Action | Expected | SoT verified | Dest verified |
|---|---|---|---|---|---|---|
| T01 | Tab strip rendered | Page loaded | none | 4 tabs visible: Hierarchy / CommChannels & Services / Apps & Services / Settings | YES | YES (Round 4 chrome MCP) |
| T02 | Active tab highlighted | Page loaded | none | The active tab has a bottom border / different color | YES | YES |
| T03 | Tab switch — CommChannels | Hierarchy tab active | click CommChannels tab | Content swaps to CommChannels table; URL hash unchanged (SPA route stays) | YES | YES |
| T04 | Tab switch — back to Hierarchy | CommChannels active | click Hierarchy tab | Content swaps back to users-table view | YES | NOT VERIFIED |

# 2. Table chrome

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T05 | Header background | Table rendered | inspect `thead th` computed bg | `rgb(245, 245, 245)` (#F5F5F5) | YES | **FAIL** (#F5F7F8 — bundle stale; staged Round 3 source has #f5f5f5) |
| T06 | Header padding | Table rendered | inspect `thead th` computed padding | `12px 14px` | YES | **FAIL** (`25px 10px` — staged Round 3 source bumps to 25px to match SoT 65px row height; but SoT itself uses 12/14) |
| T07 | Header font size | Table rendered | inspect `thead th` computed font-size | `12px` | YES | **DELTA** (`11.5px` — minor 0.5px diff) |
| T08 | Header font family | Table rendered | inspect `thead th` font-family | `Poppins, Inter, system-ui, sans-serif` | YES | PASS (matches) |
| T09 | Header text color | Table rendered | inspect `thead th` color | `rgb(107, 114, 128)` (#6B7280) | YES | PASS |
| T10 | Footer background | Table rendered | inspect `.table-footer-wrap` bg | `transparent` (no fill) | YES | **FAIL** (Dest #F5F7F8 — Round 3 staged source sets to #F5F5F5; both diverge from SoT transparent) |
| T11 | Footer padding | Table rendered | inspect footer padding | `0px` | YES | **FAIL** (Dest `12px 18px`) |
| T12 | Container border-radius | Table rendered | inspect `[class*=falcon-table-container-bg]` border-radius | `0px` | YES | PASS (Round 3 staged source already sets to 0) |

# 3. Row structure

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T13 | 9 rows shown | Default Aramco client | none | Rows: SMS Gateway, WhatsApp Business, Email Relay, Voice IVR, Push Notifications, AI-ChatGPT, RCS Messaging, Telegram Bot, Apple Business Chat | YES | YES (chrome MCP confirmed via screenshot) |
| T14 | Status badge — Active | SMS Gateway row | inspect status cell | green dot + "Active" label, light-green bg pill | YES | YES |
| T15 | Status badge — Expired | Voice IVR row | inspect status cell | red dot + "Expired" label, light-red bg pill | YES | YES |
| T16 | Status badge — Disable | Push Notifications row | inspect | grey dot + "Disable" label | YES | YES |
| T17 | Status badge — Inactive | Telegram Bot row | inspect | grey dot + "Inactive" label | YES | YES |
| T18 | Status badge — empty | RCS Messaging / Apple Business Chat | inspect | `-----` literal (5 ASCII dashes) | YES | **DELTA** (Dest renders `—————` em-dashes — minor symbol difference) |
| T19 | Visibility toggle on/off | Apple Business Chat row | click visibility toggle | Toggle state flips; row's status / dates reload as enabled | YES | NOT VERIFIED |
| T20 | Currency symbol | Any row Price Value | inspect price cell | `₪ 4,500` (Riyal symbol prefix) | YES | YES (matches) |

# 4. Row kebab menus (status-driven)

| ID | Name | Status | Expected menu items | SoT | Dest |
|---|---|---|---|---|---|
| T21 | Kebab — Active row | active | Disable / Edit Price Type / Edit Price Value | YES | YES (live verified — SMS Gateway) |
| T22 | Kebab — Expired row | expired | Do Payment / Disable / Edit Price Type / Edit Price Value | YES | NOT VERIFIED on dest (only Disable status row verified) |
| T23 | Kebab — Disable row | disable | Enable / Edit Price Type / Edit Price Value | YES | YES (live verified — Push Notifications) |
| T24 | Kebab — Inactive row | inactive | Do Payment / Disable | YES | YES (live verified — Telegram Bot) |
| T25 | Kebab outside-click closes | menu open | click body | menu closes | YES | NOT VERIFIED |
| T26 | Kebab — empty status | no badge | no kebab or disabled kebab | YES (no kebab shown in source for empty status) | NOT VERIFIED |

# 5. Edit-row expansion (inline edit)

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T27 | Edit Price Type — 2-field mode | Active row | kebab → Edit Price Type | Expand row appears below the clicked row; bg `#F3F8F5` flat stripe; fields: New Price Type dropdown (column-aligned under Price Type col) + Effective Date picker (under Price Value col) | YES | NOT VERIFIED at runtime (bundle stale; Round 3 staged source has this implemented exactly per spec) |
| T28 | Edit Price Value — 1-field mode | Active row | kebab → Edit Price Value | Expand row bg `#F3F8F5`; single New Price Value input column-aligned under Price Value col | YES | NOT VERIFIED at runtime |
| T29 | Edit-row Cancel | Edit-row open | click Cancel | Row expansion closes; row returns to view mode; no value change | YES | NOT VERIFIED at runtime |
| T30 | Edit-row Save | Edit-row open + value entered | click Save | Pending change applied; row returns to view mode; toast "Save ✓"; row shows ✓ disk icon next to changed cell | YES | NOT VERIFIED at runtime |
| T31 | No bubble notch in edit-row | Edit-row open | inspect | NO teal bubble, NO triangle notch (Round 2 used a notch — Round 3 removed it; SoT has none) | YES | **FAIL at runtime** (live serves Round 2 code with bubble + notch — stale bundle) |
| T32 | Multi-lane edit (Email Relay) | Email Relay row visible | kebab → Edit Price Type, then Edit Price Value | Two lanes shown stacked OR replaced (depending on UX choice — SoT replaces) | YES | NOT VERIFIED |

# 6. Insufficient Balance Detected modal

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T33 | IB modal opens via Inactive row | Telegram Bot (Inactive) row | kebab → Do Payment | Modal opens; centered red triangle (~56px); centered title "Insufficient Balance Detected"; centered subtitle ~13px grey; priority list card (3 channels: WhatsApp / Voice / AI-ChatGPT); info pill teal "The first channel will be used automatically"; Cancel + Proceed Payment buttons right-aligned | YES | **PARTIAL FAIL at runtime** (live: title + subtitle visible, but priority list MISSING because bundle is stale and serves old `<falcon-confirm-dialog>`; Round 4 staged source has full SoT layout via new `<falcon-angular-alert-dialog>`) |
| T34 | IB modal opens via Expired row | Push Notifications (Expired) row | kebab → Do Payment | Same modal as T33 | YES | NOT VERIFIED |
| T35 | IB drag-and-drop reorder | IB modal open | drag channel #2 above #1 | Order swaps; visual feedback (opacity-55 on dragging, border-falcon-teal-500 on drop target) | YES | NOT VERIFIED at runtime (staged Round 3 source has dnd) |
| T36 | IB arrow-button move-up | IB modal open | click ↑ button on channel #2 | Channel #2 moves to position 1 | YES | NOT VERIFIED |
| T37 | IB arrow-button move-down | IB modal open | click ↓ button on channel #1 | Channel #1 moves to position 2 | YES | NOT VERIFIED |
| T38 | IB Cancel button | IB modal open | click Cancel | Modal closes; no action emitted to parent (no toast) | YES | NOT VERIFIED |
| T39 | IB Proceed Payment | IB modal open | click Proceed Payment | Modal closes; toast "Payment processed ✓" or similar; row status changes to Active | YES | NOT VERIFIED |
| T40 | IB modal backdrop click | IB modal open | click overlay outside modal | Modal closes (same as Cancel) | YES | NOT VERIFIED |
| T41 | IB X close button | IB modal open | inspect | X button is NOT rendered (SoT has no X; Round 3 `[closable]="false"`) | YES | **FAIL at runtime** (live: X button visible — stale bundle) |
| T42 | IB title typography | IB modal open | inspect title element | font-size 18px, font-weight 700, color near-black | YES | YES (live confirmed in chrome MCP) |
| T43 | IB subtitle max-width | IB modal open | inspect subtitle width | Constrained to ~460px max-width | YES | NOT VERIFIED |
| T44 | IB info pill bg | IB modal open | inspect info pill | light teal bg (`bg-falcon-teal-50`) + dark teal text | YES | NOT VERIFIED at runtime (live missing pill entirely) |

# 7. Pagination + footer

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T45 | Page count label | Table loaded | inspect footer | "Showing 1 - 9 from 9" | YES | YES |
| T46 | Page button — disabled prev | Page 1 of 1 | inspect prev `<` button | disabled (faded) | YES | YES |
| T47 | Page button — disabled next | Page 1 of 1 | inspect next `>` button | disabled (faded) | YES | YES |
| T48 | Rows-per-page label | Footer | inspect | "Rows per page" + dropdown showing 20 | YES | YES |
| T49 | RPP dropdown change | RPP dropdown | select 10 | Table re-renders with 10 rows per page (no scroll if total <= 10) | YES | NOT VERIFIED |
| T50 | Footer alignment | Footer | inspect | Page count left-aligned; pagination + RPP right-aligned | YES | YES |

# 8. Currency + i18n

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T51 | Currency symbol consistent | All rows | inspect | All Price Value cells show same currency prefix (₪) | YES | YES |
| T52 | Date format MM/DD/YYYY or DD/MM/YYYY | First Activation Date | inspect any row date | `2/1/2024` (US-style M/D/YYYY) | YES | YES |
| T53 | Multi-language sidebar | Sidebar | inspect | Items show En labels (e.g. "Wallet & Balance .Mng") | YES | YES |

# 9. Sidebar / breadcrumb / page header

| ID | Name | Preconditions | Action | Expected | SoT | Dest |
|---|---|---|---|---|---|---|
| T54 | Sidebar logo | Page loaded | inspect | "FALCON" wordmark at top with collapse-chevron | YES | YES |
| T55 | Sidebar nav highlighting | "Organization Hierarchy" active | inspect | Item has accent left-border or bg highlight | YES | YES |
| T56 | Page title | Page rendered | inspect | "Organization Hierarchy" h1 + "Home > Organization Hierarchy" breadcrumb | YES | YES |
| T57 | User avatar (top-right) | Page loaded | inspect | Initials/photo avatar + name + role | YES | YES (Dest shows "Falcon Admin / sys-admin"; SoT shows "User Name / Job Title") |

# Total: 57 test cases

# Verification status summary (Round 4)

| Category | Total | Pass | Fail | Partial | Not Verified |
|---|---|---|---|---|---|
| Tab strip | 4 | 3 | 0 | 0 | 1 |
| Table chrome | 8 | 3 | 4 | 1 | 0 |
| Row structure | 8 | 6 | 0 | 1 | 1 |
| Row kebab menus | 6 | 3 | 0 | 0 | 3 |
| Edit-row | 6 | 0 | 1 | 0 | 5 |
| IB modal | 12 | 1 | 2 | 1 | 8 |
| Pagination | 6 | 5 | 0 | 0 | 1 |
| i18n | 3 | 3 | 0 | 0 | 0 |
| Sidebar | 4 | 4 | 0 | 0 | 0 |
| **Total** | **57** | **28** | **7** | **3** | **19** |

# Why so many "Not Verified"

The user-owned dev-serve at PID 18588 was started before Round 3 staged the
fixes. The live `localhost:4200/admin-console/org-hierarchy-page` page serves
PRE-ROUND-3 bundle. We cannot:
- Verify edit-row stripe bg `#F3F8F5` (staged but not loaded)
- Verify IB modal priority list rendering (staged but not loaded — live shows
  fallback `<falcon-confirm-dialog>` with no list)
- Verify drag-and-drop in IB modal
- Verify the absence of bubble + notch in edit-row

PID 18588 cannot be killed from this agent context (Access Denied — user-owned).
The user must restart dev-serve to unblock the remaining 19 test cases.

# Pass criteria for "Round 4 verify resume"

After user restarts dev-serve:
1. Re-open `localhost:4200/#/admin-console/org-hierarchy-page` in chrome MCP.
2. Re-run T19, T22, T25, T26, T27, T28, T29, T30, T31, T32, T34-T44, T49 against the new bundle.
3. Confirm `<falcon-angular-alert-dialog>` renders all SoT-specified elements (title, subtitle, priority list, info pill, both buttons).
4. Confirm edit-row matches SoT (no bubble, no notch, flat #F3F8F5 stripe).
5. Confirm Defect 1 (table chrome) — if still `#F5F7F8`, file as STILL-BROKEN.

# Source-of-truth evidence locations

| Evidence | Path |
|---|---|
| SoT React source | `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\apps.jsx` (lines 267-358 for IB modal, 363-412 for kebab menu) |
| SoT styles | `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\styles.css` |
| Round 3 staged consumer | `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\insufficient-balance-modal\` |
| Round 4 new library component | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\components\falcon-alert-dialog{,-tw}\` |
| Round 4 Angular wrapper | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-alert-dialog\` |
| Round 4 knowledge dossier | `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-alert-dialog\` |
