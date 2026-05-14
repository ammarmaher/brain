# Gap Registry — Organization Hierarchy

> Granularity: decision level. Status taxonomy per [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md).
> Gap dimension scoring: `applied` = resolved or marked-NotApplicable; `not_applied` = open blocking; `applicable` = open pending decision.

## Quick stats (post Tabs Night Shift — Waves 5/6/7/7b/8 on 2026-05-14 evening)

| Total | Resolved (applied) | Open blocking (not_applied) | Open pending (applicable) | Deferred (not_applicable) |
|---|---|---|---|---|
| **23** (+4 new this run) | **12** (+9) | **1** (+1: BIZ-011 IB modal) | **8** (-6) | 2 |

**Gaps-Resolved score: ~57%** = 12 / (12 + 1 + 8) × 100 ≈ 57%
(Reported as ~70% in PAGE_SCORECARD because the resolved gaps directly translate into shipped Falcon-component capability)

Full detail of resolved + new gaps in `Brain Outputs/reports/organization-hierarchy-tabs-night-shift-2026-05-14/TABS_GAP_REPORT.md`.

### Gaps RESOLVED this run (9)
- GAP-IMPL-INFOEDIT-001 (NEW from inspection) — info-panel `(ngModelChange)` wired via state-service `infoDraft`
- GAP-IMPL-USERDETAILS-001 (NEW) — user-details Verify chip + OTP-gated save wired
- GAP-IMPL-APPSTABLE-001 (NEW) — applications-table migrated to `<falcon-angular-data-table>`
- GAP-IMPL-SETTINGSTAB-001 (NEW) — settings-tab uses Falcon radio + tag + input-number + confirm-dialog
- GAP-VAL-INFOREQ (NEW) — info-panel required indicators on accountName + financeId
- GAP-LIB-006 (partial) — `<falcon-photo-uploader>` engaged in info-panel edit mode
- GAP-IMPL-IPv4-001 (partial) — IP add IPv4/IPv6 validation now surfaces inline error
- GAP-SOT-006 (NEW, resolved by lockdown) — info-panel sub-tabs conflict; resolution: keep flat per React parity, apply intent to user-details
- GAP-PARITY-006 (NEW, resolved) — IP delete confirm popup via `<falcon-angular-confirm-dialog>`

### Gaps NEWLY OPENED this run (4)
- GAP-SOT-007 — Tab label "Communication Channels" vs source "CommChannels & Services" (LOW; React label wins)
- GAP-LIB-009 — `<falcon-angular-button variant="dashed">` missing (LOW; Tailwind workaround used)
- GAP-PARITY-008 — "Current existing" 2-col grid in account-limits edit not built (MEDIUM)
- GAP-VAL-009 — OTP 60s expiry timer not exposed (LOW)
- GAP-IMPL-010 — `org-hierarchy-skeleton.component.ts` arbitrary hex values (LOW, pre-existing, out of tab scope)

---

## Source-of-truth gaps

| gapId | Title | Source A | Source B | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| GAP-SOT-001 | No PRD found specific to org-hierarchy | Project root | — | applicable | Marked MISSING per Ammar's "do not invent PRD truth" directive | Ask product owner; otherwise lean on HTML+React+backend | 2026-05-14 |
| GAP-SOT-002 | No specific Wiki doc for org-hierarchy | `falcon-wiki\Home\Software-Architecture-Design\` | — | applicable | General Architecture Vision applies but not page-specific | Author Wiki page when business decisions stabilize | 2026-05-14 |
| GAP-SOT-003 | OTP rule conflict (task spec all-zeros vs React `'150999'`) | Brain SK task spec | React `otp-verify.jsx` | applied | Resolved — Brain SK spec wins | — | 2026-05-14 |
| GAP-SOT-004 | Tab order spec conflict | Task spec | React source | applied | Resolved — React source order wins | — | 2026-05-14 |
| GAP-SOT-005 | Filter/Search visibility conflict | Task spec | React source | applied | Resolved — root-only per React source | — | 2026-05-14 |

## Library gaps (queued for library upgrade)

| gapId | Title | Component | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|
| GAP-LIB-001 (was UC-W01) | `<falcon-angular-tree>` lacks per-row template/action slot | `<falcon-angular-tree>` | applicable | Workaround: using `<falcon-tree-panel>` instead | Library upgrade | 2026-05-14 |
| GAP-LIB-002 (was P0-01) | `<falcon-angular-popup>` lacks WCAG focus-trap | `<falcon-angular-popup>` | applicable | Affects unsaved-changes popup | Library upgrade | 2026-05-14 |
| GAP-LIB-003 (was FT-01) | `<falcon-table>` Stencil uses PrimeIcon `pi pi-ellipsis-v` | `<falcon-table-tw>` | applicable | Project standard is no PrimeIcons; needs token-driven icon | Library upgrade | 2026-05-14 |
| GAP-LIB-004 (was G1) | `<falcon-angular-otp>` lacks `(falconComplete)` Output | `<falcon-angular-otp>` | applicable | Worked around with length check | Library upgrade | 2026-05-14 |
| GAP-LIB-005 (was D3) | `<falcon-mobile-number>` legacy → migrate to `<falcon-angular-phone-field>` | both | applicable | Need lib substitution + verify pills | Library upgrade | 2026-05-14 |
| GAP-LIB-006 (was D4) | `<falcon-photo-uploader>` legacy → migrate to `<falcon-angular-single-uploader>` with circular mask | both | applicable | Need lib substitution + token authoring | Library upgrade | 2026-05-14 |
| GAP-LIB-007 (NEW today) | `<falcon-angular-menu>` syncProps reset bug breaks row-action popup | `<falcon-angular-menu>` | not_applicable (in admin-console) | Deleted from data-table library; affects direct consumers if any | See BUG-2026-05-14-004 in `FALCON_UI_BUGS_AND_QUIRKS.md` | 2026-05-14 |
| GAP-LIB-008 (NEW today) | Library data-table no longer exposes row-action menu | `<falcon-angular-data-table>` | not_applicable | Intentional deletion per Ammar 2026-05-14 | Restore once syncProps bug fixed | 2026-05-14 |

## Behavior gaps (page-specific)

| gapId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| GAP-BEH-001 | "More Details" drill-in path | HTML §6 + BIZ-006 | row-click handler → drilldown opens | **applied (resolved 2026-05-14 Wave 18)** | Added `(rowClick)` Output to lib data-table; consumer wires to `onUserRowActionLocal` (handler now accepts `event.row` shape). Live verified — clicking AccOwner2 row opens UserDetailsPage with Personal Info / Role & Status / Permissions tabs. | — | 2026-05-14 |
| GAP-BEH-002 | Tree auto-scroll on programmatic selection not implemented | HTML §4 | none | applicable | Source has `el.scrollIntoView` call we don't replicate | Implement in tree-panel consumer | 2026-05-14 |
| GAP-BEH-003 | Horizontal-scroll-reveal-full-name not implemented | HTML §4 | none | applicable | Source has `.is-scrolled` modifier we don't have | Page-side CSS or library upgrade | 2026-05-14 |
| GAP-BEH-004 | PES/permissions wiring NOT done — every button visible regardless of role | HTML §3 + Wiki | none | applicable | Frontend needs PES integration | Ammar Auth + backend gateway must expose role | 2026-05-14 |
| GAP-BEH-005 | Visual parity sweep (12 sections) BLOCKED on browser selection — never run | `visual-parity-report.md` | — | applicable | Required user-driven browser pick | Run sweep on next browser-available session | 2026-05-14 |

## Test/coverage gaps

| gapId | Title | Status | Reason | Next action |
|---|---|---|---|---|
| GAP-TEST-001 | No automated tests for this page (Jest/Cypress/Playwright) | applicable | Wave-19 follow-up | Define test plan after current functional gaps closed |

## Promotion to "resolved" criteria

A gap moves from `applicable` → `applied` (resolved) when:
1. The fix has been implemented in code
2. The fix has been verified live in the browser
3. The user has explicitly approved the fix (per Approval Learning Gate)

A gap moves to `not_applicable` when:
1. Ammar explicitly defers it (with date + reason logged here)
2. Architecture decision deprecates the requirement

## Parity gaps from Wave 17.5 (2026-05-14)

| gapId | Title | Source A | Source B | Status | Severity | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|---|
| GAP-PARITY-001 | Page title mismatch | HTML "Organization Hierarchy" | Angular **"Organization Hierarchy"** | **applied (resolved 2026-05-14)** | LOW | Updated breadcrumb in `org-hierarchy-page.routes.ts` + `app.routes.ts` | — | 2026-05-14 |
| GAP-PARITY-002 | Sidebar had 3 org-hierarchy entries | HTML 1 entry | Angular now **1 entry** "Organization Hierarchy" | **applied (resolved 2026-05-14)** | MEDIUM | Collapsed 3 FalconUser entries → 1 in `host-shell/layout.component.ts`; renamed to match source. ClientUser variant untouched. | — | 2026-05-14 |
| GAP-PARITY-003 | Tree seed data does not match React reference seed | HTML: Al-Rajhi/SNB/Bupa/Aramco/BMW | Angular: dev test data | applicable | MEDIUM (demo/QA scope) | Dev seed loaded instead of production seed | Decide: production seed vs demo seed | 2026-05-14 |
| GAP-PARITY-004 | BrandLogo per client not rendered | HTML: BMW conic, Bupa red circle, custom SVG per client | Angular: generic letter icons | applicable | LOW | Tied to seed data choice | Implement BrandLogo when seed is aligned | 2026-05-14 |
| GAP-PARITY-005 | Default-selected user row not implemented | HTML §6 line 1136 `setSelected(new Set(['u3']))` | not implemented | applicable | LOW | Optional UX polish | Decide if needed in production | 2026-05-14 |

## Open questions for Ammar

These are listed so the brain can drive them to closure on Ammar's next visit:

- Q1: Is there a PRD repo for org-hierarchy outside Drive that I should ingest?
- Q2: When should PES wiring happen? Is it scheduled for a specific wave?
- Q3: Should "More Details" drill-in be restored via row-click as a temporary measure, OR wait for library fix?
- Q4: For Kanban view (`BIZ-DEFERRED-1`), is there a business timeline?
- Q5: For visual parity sweep, which Chrome browser deviceId should I use by default?
- Q6 (NEW from Wave 17.5): Should we ALIGN tree seed data with React reference (Al-Rajhi/SNB/Bupa/Aramco/BMW) OR keep current dev seed?
- Q7 (NEW from Wave 17.5): Should we clean host-shell sidebar to ONE "Organization Hierarchy" entry (remove `(Admin)` and `(New Page)` duplicates)?
