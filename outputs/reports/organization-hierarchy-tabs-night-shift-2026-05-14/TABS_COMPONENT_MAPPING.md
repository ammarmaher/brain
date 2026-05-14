# Tabs Component Mapping — Organization Hierarchy

**Date:** 2026-05-14
**Scope:** tabs only above `falcon-node-details-section`
**Author:** Brain SK orchestrator (Adnan)

## Sources used
- `01-tabs-source-discovery.md` (React + HTML)
- `02-current-angular-tabs-inspection.md` (Angular)
- `03a-falcon-component-capability.md` (Falcon UI library)

## Conflict-resolution decisions

| # | Conflict | Brain SK brief | React source | Decision | Gap ID |
|---|---|---|---|---|---|
| 1 | Info-panel sub-tabs | Audit/RuleStatus/Permission as sub-tabs of `<app-org-info-panel>` | InfoPanel is a flat dossier; the 3-tab pattern exists only in `<app-user-details-page>` (labels: Personal Information / Role & Status / Permissions & Privilege) | Keep InfoPanel **flat** (React parity). Apply brief's *intent* (uploader, required validation, OTP-before-save) to the user-details flow where those patterns belong in source. | GAP-SOT-006 (NEW) |
| 2 | OTP "all zeros pass" | All zeros pass | React: `150999` fails, everything else passes | **Brain SK wins** per existing GAP-SOT-003. `OtpMockService` already implements this. | GAP-SOT-003 (already resolved) |
| 3 | Tab label "Communication Channels" | "Communication Channels" | "CommChannels & Services" | Use React label. | GAP-SOT-007 (NEW, LOW) |
| 4 | IP delete confirm popup | Confirm popup on chip × | React: no confirm dialog | **Brain SK wins** (defensive UX). Add `<falcon-angular-confirm-dialog>`. | GAP-PARITY-006 (NEW) |
| 5 | Apps panel header text | "Apps & Services" | Tab label "Apps & Services" but panel header "Applications" | Match React (panel header = "Applications"). | informational only |
| 6 | 70/80 + 30/20 split in Settings edit | Ratio-based | Fixed `grid-template-columns: minmax(0,1fr) 360px` | Match React. | informational only |
| 7 | "Account Limits ±1" min/max | Unspecified | `min=0, max=9999` (component default) | Match React. | informational only |

## Per-tab mapping

### Tab 0 — Tab strip (above `falcon-node-details-section`)

| Source element | Falcon component | Status | Action |
|---|---|---|---|
| `.tabs-bar` strip | `<falcon-angular-tabs>` + `falconTabActions` | ✅ Applied (~80%) | Keep. Tab labels via `state.visibleTabs()` already conditional on root-vs-node. |
| View toggle (List/Tree) on hierarchy tab | `<falcon-view-toggle>` projected via `<ng-template falconTabActions="hierarchy">` | ✅ Applied | Keep. |
| Settings tab portal slot | N/A in Angular (in-component buttons inside `<app-settings-tab>` header) | ⚠️ Different pattern | Keep Angular pattern — buttons live inside the tab body header. Acceptable departure. |

**No new components added in Wave 5-8 for tab strip.** Tab strip is healthy.

### Tab 1 — comm-channels-tab (and Tab 2 — apps-services-tab share same inner table)

Current state: `<app-applications-table>` is hand-rolled `<table>` (~35% complete).

| Source feature | Current Angular | Target Falcon component | Action | Wave |
|---|---|---|---|---|
| Table container | Hand-rolled `<table>` | `<falcon-angular-data-table>` | **MIGRATE** | 5 |
| Header text "Applications" vs i18n | Inline header text | Keep custom panel header above data-table | Keep | 5 |
| Visibility column toggle | Hand-rolled `<button role="switch">` | `<falcon-angular-switch>` (cell template) | **MIGRATE** | 5 |
| Name column (bold, max-width) | `<td>` with classes | data-table column template | Keep cell template approach | 5 |
| Price Type, Price Value, Date columns | `<td>` text | data-table column default rendering | Inherit | 5 |
| Status column | Hand-rolled `<span>` with switch | `<falcon-angular-status-badge>` (cell template) | **MIGRATE** | 5 |
| Row action menu (per-status) | Hand-rolled absolute `<div>` dropdown | `[rowActions]` + `actionFlags` + `(rowAction)` output on data-table | **MIGRATE** (with menu fallback if BUG-2026-05-14-004 reappears in tab overflow context) | 5 |
| Inline EditRow (price-type/price-value) | `@if (editingId() === app.id)` expanding two `<tr>`s | Keep inline expansion BUT swap legacy `<falcon-calendar>` → `<falcon-angular-calendar>` | **UPGRADE** | 5 |
| Pagination footer | Hard-coded "1 of 1" + disabled Next | `<falcon-angular-data-table>` built-in paginator (showing `rowsPerPageOptions=[10,20,30,40]`, default 20) | **WIRE** | 5 |
| Pending price/value edit indicators | Inline pencil + trash | Keep current handlers; surface via Tailwind | Keep | 5 |
| Empty state | None | `<falcon-angular-empty-state>` via `[emptyData]` config | **ADD** | 5 |
| Insufficient Balance modal (Do Payment) | Not implemented | `<falcon-angular-dialog>` with drag-list | **DEFER to follow-up** (out of tab-content polish scope) | GAP — log |

**No shared-component upgrade required** for the migration above. All needed Falcon APIs already exist (per Agent 3 capability scan).

### Tab 3 — falcon-org-info-panel (node info — kept flat per React parity)

| Source feature | Current Angular | Target Falcon component | Action | Wave |
|---|---|---|---|---|
| Header row | Static `<header>` with i18n key | Keep | — | 7 |
| Avatar circle (single letter) | `<span>` with `grid place-items-center` | Replace with `<falcon-angular-single-uploader>` (image upload + replace) in edit mode; keep current avatar in view mode | **UPGRADE** (Wave 7) | 7 |
| 17 dossier fields (4 sections) | `<falcon-angular-input>` (edit) + `<span>` (view) | Keep `<falcon-angular-input>` for text fields; add `<falcon-angular-dropdown>` for classification/sub-classification/country/city/authority | **UPGRADE** | 7 |
| Field edits not persisting | `[ngModel]` only — no `(ngModelChange)` | Wire `(ngModelChange)` → state service update | **FIX** | 7 |
| `back` output never emitted | Declared but unused | Emit on cancel | **FIX** | 7 |
| Required field markers | None | `* ` asterisk on `accountName`, `financeId` labels; `Validators.required` | **ADD** | 7 |
| Sub-tabs (Audit/RuleStatus/Permission) | None | **N/A** — keep flat per React parity | **REJECTED** (per Conflict #1) | n/a |

### Tab 3b — app-user-details-page (where the brief's "Audit/RuleStatus/Permission" patterns belong)

| Source feature | Current Angular | Target Falcon component | Action | Wave |
|---|---|---|---|---|
| 3 sub-tabs (Personal Information / Role & Status / Permissions & Privilege) | Existing | `<falcon-angular-tabs>` | Verify | 7b |
| Avatar + 6 personal fields (FirstName/LastName/UserName/NationalId/Phone/Email) | Hand-rolled? Verify | Wrapper + `<falcon-angular-input>` per field | Verify and bring up to required-state | 7b |
| Phone field with verify | Likely hand-rolled | `<falcon-angular-phone-field>` (verifyButton="true") | **UPGRADE** if needed | 7b |
| Email field with verify | Likely hand-rolled | `<falcon-angular-input>` + verify chip | **UPGRADE** if needed | 7b |
| OTP modal (`OtpModal`) | Existing `otp-dialog.component.ts` | `<falcon-angular-otp>` (length=6) + `<falcon-angular-otp-send-dialog>` if available | **VERIFY** — current is page-local, but `OtpMockService` already enforces all-zeros-pass | 7b |
| Status dropdown | Probably exists | `<falcon-angular-dropdown>` (disabled in edit per source) | Verify | 7b |
| Role dropdown | Probably exists | `<falcon-angular-dropdown>` | Verify | 7b |
| Permission group | Probably hand-rolled | `<falcon-angular-dropdown>` | Verify | 7b |
| CommChannel checker level (2-row radio matrix) | Probably hand-rolled | `<falcon-angular-radio-group>` × 2 | Verify | 7b |

**Note:** Wave 7b is scoped to drilldown polish only. If existing user-details-page is already at 60%+ parity (per IMPLEMENTATION_SCORECARD lines 21-22), Wave 7b becomes a verification + targeted fix wave, not a full rebuild.

### Tab 4 — settings-tab

Current state: ~65% complete. Reuses `<app-client-settings-step>` from Add Client wizard.

| Source feature | Current Angular | Target Falcon component | Action | Wave |
|---|---|---|---|---|
| Password security radios (Normal/Advanced) | Hand-rolled `<label>` + `<input type="radio">` | `<falcon-angular-radio-group>` with rich label slots | **MIGRATE** | 8 |
| Add IP dashed button | Hand-rolled `<button>` with Tailwind `border-dashed` | Either keep + Tailwind tokens OR upgrade `<falcon-angular-button>` to support `variant="dashed"` | **DECISION:** Keep Tailwind dashed border with tokens (simpler; no library churn). Document as gap for Future button upgrade. | 8 |
| IP input | Native `<input type="text" falconIpAddress>` | `<falcon-angular-input>` with `appendIcon` Add/X | **MIGRATE** | 8 |
| IP chips | Hand-rolled `<span>` | `<falcon-angular-tag>` (closable) | **MIGRATE** | 8 |
| IP delete confirmation | Immediate removal | `<falcon-angular-confirm-dialog>` "Are you sure you want to delete this IP?" | **ADD** (Brain SK ask) | 8 |
| IPv4/IPv6 validation | Already exists (`isValidIp` + `FalconIpAddressDirective`) | Keep | Verify visible error styling | 8 |
| Account limits (3 ±1 number inputs) | Native `<input type="number">` | `<falcon-angular-input-number>` (with min=0 max=9999) | **MIGRATE** | 8 |
| "Current existing" readonly column | Native `<input>` readonly | `<falcon-angular-input>` `[readonly]="true"` size="sm" | **MIGRATE** | 8 |
| Hint text "* Restrict platform access…" | Tailwind red text | Keep | — | 8 |
| Discard confirm on Cancel with dirty edits | None | `<falcon-angular-confirm-dialog>` | **DEFER** (out of strict scope; nice-to-have) | gap |

## Falcon Component Reuse Plan — Summary

| Component | Currently used by tabs? | After Wave 5-8 |
|---|---|---|
| `<falcon-angular-tabs>` | ✓ | ✓ (unchanged) |
| `falconTabActions` directive | ✓ | ✓ |
| `<falcon-angular-button>` | ✓ (settings tab) | ✓ (now in data-table empty/error actions too) |
| `<falcon-angular-input>` | ✓ (info-panel edit) | ✓✓ (info-panel persisting now, used in IP add) |
| `<falcon-angular-data-table>` | ✗ (hand-rolled `<table>`) | ✓ (NEW in applications-table) |
| `<falcon-angular-switch>` | ✗ | ✓ (NEW in visibility column) |
| `<falcon-angular-status-badge>` | ✗ | ✓ (NEW in status column) |
| `<falcon-angular-calendar>` (new wrapper) | ✗ (legacy used) | ✓ (NEW in inline edit row) |
| `<falcon-angular-single-uploader>` | ✗ | ✓ (NEW in info-panel client picture) |
| `<falcon-angular-dropdown>` | ✗ | ✓ (NEW in info-panel classification fields) |
| `<falcon-angular-radio-group>` | ✗ | ✓ (NEW in password security cards) |
| `<falcon-angular-tag>` | ✗ | ✓ (NEW in IP chip list) |
| `<falcon-angular-input-number>` | ✗ | ✓ (NEW in account limits) |
| `<falcon-angular-confirm-dialog>` | ✗ | ✓ (NEW in IP delete confirm) |
| `<falcon-angular-empty-state>` | ✗ | ✓ (NEW via data-table `[emptyData]`) |
| `<falcon-angular-phone-field>` | ✗ | ✓ (NEW in user-details Personal Info, Wave 7b) |
| `<falcon-angular-otp>` | partial (page-local dialog) | ✓ (verify) |
| `<falcon-angular-menu>` | ✗ | conditional — only if BUG-2026-05-14-004 fix holds inside tab overflow; else keep hand-rolled |

Total Falcon components introduced or re-engaged: **15** new direct usages.

## Shared component upgrade plan

| Component | Upgrade needed? | Reason | Wave |
|---|---|---|---|
| `<falcon-angular-tabs>` | NO | Already works for tabs use case | n/a |
| `<falcon-angular-data-table>` | NO | All required APIs exist (cellTemplate, rowActions, paginator, emptyData, useTailwind) per Agent 3 capability scan | n/a |
| `<falcon-angular-button>` | OPTIONAL — defer | `variant="dashed"` would be nice but Tailwind alternative is fine for now | gap → log |
| `<falcon-angular-menu>` | NO (per Agent 3 — fix mitigated in lines 96-100 of falcon-menu.component.ts). Tab-overflow context untested. | If BUG-004 reappears, fallback to hand-rolled menu inside the data-table row template. | escape hatch |
| `<falcon-angular-dropdown>` | NO | Standard dropdown sufficient | n/a |

**Conclusion:** No mandatory library upgrades for this task. All tab work is consumer-side enhancement using existing Falcon APIs. The brief's "Falcon Button dashed variant" can be implemented via Tailwind tokens (`border border-dashed border-falcon-teal-700`) until a library upgrade is justified.

## Out-of-scope items found

- **Insufficient Balance modal** for Apps & Services "Do Payment" flow — log as deferred (GAP-BIZ-001)
- **Send Credentials modal** + Success modal at end of Add Client wizard — out of tabs scope
- **Tree seed mismatch** (GAP-PARITY-003) — pre-existing, not tab-related
- **PES wiring** (GAP-BEH-004) — pre-existing, not tab-related
- **Tab-strip imperative DOM patches** (5 documented Stencil workarounds) — keep for now; Stencil rebuild required to remove
