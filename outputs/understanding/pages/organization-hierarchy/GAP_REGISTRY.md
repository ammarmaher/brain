# Gap Registry — Organization Hierarchy

> Granularity: decision level. Status taxonomy per [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md).
> Gap dimension scoring: `applied` = resolved or marked-NotApplicable; `not_applied` = open blocking; `applicable` = open pending decision.

## Quick stats

| Total | Resolved (applied) | Open blocking (not_applied) | Open pending (applicable) | Deferred (not_applicable) |
|---|---|---|---|---|
| 14 | 3 | 0 | 9 | 2 |

**Gaps-Resolved score: ~25%** = 3 / (3 + 0 + 9) × 100 = 25%
(Set to 20% in PAGE_SCORECARD as a conservative seed before formal sweep)

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
| GAP-BEH-001 | "More Details" drill-in path is broken — kebab column gone, no replacement trigger yet | HTML §6 + BIZ-006 | none | applicable | Today's library edit removed the trigger | Add row-click handler to open drill-in OR wait for library fix | 2026-05-14 |
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

## Open questions for Ammar

These are listed so the brain can drive them to closure on Ammar's next visit:

- Q1: Is there a PRD repo for org-hierarchy outside Drive that I should ingest?
- Q2: When should PES wiring happen? Is it scheduled for a specific wave?
- Q3: Should "More Details" drill-in be restored via row-click as a temporary measure, OR wait for library fix?
- Q4: For Kanban view (`BIZ-DEFERRED-1`), is there a business timeline?
- Q5: For visual parity sweep, which Chrome browser deviceId should I use by default?
