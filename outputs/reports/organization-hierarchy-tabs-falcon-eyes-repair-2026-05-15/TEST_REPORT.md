*** Test Report — Org Hierarchy Falcon Eyes Repair (RESUMED 2026-05-15, Round 5 appended) ***

## Round 5 (2026-05-15 ~14:00 local) — live-bundle 57-case SoT matrix

Run against fresh dev-serve bundle on Ammar PC Chrome via claude-in-chrome MCP.

| Section | Pass | Fail | Partial | Not-Verified |
|---|---:|---:|---:|---:|
| 1. Tab strip (T01-T04) | 4 | 0 | 0 | 0 |
| 2. Table chrome (T05-T12) | 6 | 0 | 2 | 0 |
| 3. Row structure (T13-T20) | 7 | 0 | 1 | 0 |
| 4. Row kebab menus (T21-T26) | 5 | 0 | 0 | 1 |
| 5. Edit-row expansion (T27-T32) | 4 | 1 | 0 | 1 |
| 6. IB modal (T33-T44) | 1 | 1 | 0 | 10 |
| 7. Pagination + footer (T45-T50) | 6 | 0 | 0 | 0 |
| 8. Currency + i18n (T51-T52) | 2 | 0 | 0 | 0 |
| 9. Out-of-table assertions (T53-T57) | 5 | 0 | 0 | 0 |
| **Totals** | **40** | **2** | **3** | **12** |

Save/Cancel audit per editable surface (see `audit/SAVE_CANCEL_AUDIT.md`):

| Surface | Save verdict | Cancel verdict | Network |
|---|---|---|---|
| S1 Inline edit-row 2-field | LOCAL-STATE-ONLY | CANCEL-WORKS | NONE |
| S2 Inline edit-row 1-field | LOCAL-STATE-ONLY | CANCEL-WORKS (by source contract) | NONE |
| S3 Visibility toggle | LOCAL-STATE-ONLY (immediate apply) | n/a | NONE |
| S4 IB dialog | WIRED-TO-BACKEND in Wave-15 code (mock fallback on this page) | CANCEL-WORKS by source contract | NONE on Org Hierarchy page |

**Round 5 new defects:**
- DEFECT-CCS-R5-001 (P2) — edit-row above-table on second/subsequent open
- DEFECT-CCS-R5-002 (P1) — IB modal 0×0 dimensions (Wave-15 regression)

**Round 4 STILL-BROKEN trio resolution:**
- Defect 1 (table chrome) → FIXED at runtime (header bg #F5F5F5 confirmed)
- Defect 2 (inline edit-row) → FIXED at runtime (first-open; second-open has R5-001 regression)
- Defect 3 (IB modal) → REGRESSED via Wave-15 (introduced R5-002)

Build at end of Round 5: GREEN (hash `8d2ea4c8c3255942`, 16.4s).

---

## Round 2 (2026-05-15 evening) — comm-channels-tab interactive tests

| # | Test | Result | Notes |
|---|------|--------|-------|
| R2-T1 | Tab switching (Hierarchy ↔ CommChannels ↔ Apps ↔ Settings) | PASS | i18n labels resolve; tab strip restored to active row |
| R2-T2 | Header hover                                                | PASS | Non-sortable; no visual change (expected) |
| R2-T3 | Visibility toggle (SMS Gateway)                             | PASS | Off → status dashes; on → status restored |
| R2-T4 | Row-action kebab                                            | PASS | 3 items for Active rows (Disable / Edit Price Type / Edit Price Value) |
| R2-T5 | New inline edit-row                                         | **FAIL (HIGH)** | Slot projection regression — edit panel renders ABOVE the table chrome instead of inline `<tr>`. Repros on c1 + c3. DEFECT-CCS-R2-001 |
| R2-T6 | Org info uploader                                           | BLOCKED | Section out-of-scope |
| R2-T7 | OTP popup                                                   | BLOCKED | Section out-of-scope |
| R2-T8 | Status/role dropdowns                                       | BLOCKED | Section out-of-scope |
| R2-T9 | Settings view↔edit                                          | BLOCKED | Section out-of-scope |
| R2-T10 | IP management                                              | BLOCKED | Section out-of-scope |

**Round 2 tally: 4 pass · 1 fail · 5 blocked · 2 new defects logged (1 HIGH + 1 LOW).**

---

## Status

**PARTIAL.** The 30-item destination test list was not exhaustively run because no implementation edits landed in this Falcon Eyes round — the page already meets visual parity. The test list is filed for the next implementation pass (when the i18n + paginator P3 items are addressed).

## What this run verified

| # | Test | Status | Evidence |
|---|---|---|---|
|  1 | Page renders at `/admin-console/org-hierarchy-page` | PASS | `evidence/destination/destination_full-page.png` |
|  2 | Sidebar renders with Main Items + Account Administration sections | PASS | Same image |
|  3 | Topbar renders with search + notifications + user widget | PASS (widget empty under dev bypass) | Same image |
|  4 | Breadcrumb shows "Home / Organization Hierarchy" | PASS | Same image |
|  5 | Falcon Tabs row renders 4 tabs in correct order | PASS | Same image |
|  6 | Active tab "Hierarchy" has primary underline | PASS | Same image |
|  7 | `List / Tree` toggle renders on the right of the tabs row | PASS | Same image |
|  8 | Falcon Tree panel renders with Falcon Clients section header | PASS | Same image |
|  9 | Tree shows top-level clients (Saudi Aramco / Al Rajhi Bank / Saudi National Bank / Bupa Arabia) | PASS | Same image |
| 10 | Hierarchy content header shows selected-node avatar + name | PASS | Same image |
| 11 | Information button renders with `(i)` icon + label | PASS | Same image |
| 12 | "+ Add Node" button renders | PASS | Same image |
| 13 | "Add User" button renders | PASS | Same image |
| 14 | Users table renders with header row (Username / First Name / Email / Phone / Role / Permission Group / Status) | PARTIAL (renders empty-state placeholder due to no data) | Same image |
| 15 | Status badges use Falcon palette (green / yellow / red / gray / orange) | DEFERRED (no rows rendered to verify) | n/a |
| 16 | Paginator renders | PASS | Same image |
| 17 | Build is green (`nx build admin-console`) | NOT RUN (no implementation edits in this round) | n/a |
| 18 | No PrimeNG imports introduced | PASS (by inspection — no edits to feature) | n/a |
| 19 | No PrimeIcons used | PASS | n/a |
| 20 | No inline styles introduced | PASS (no edits) | n/a |
| 21 | All colors token-driven (`falcon-*`) | PASS | DOM inspection |
| 22 | No hardcoded hex / px in changed files | PASS (no feature edits) | n/a |
| 23 | All text token-driven typography | PASS | DOM inspection |
| 24 | i18n strings resolved | FAIL (2 keys missing — P3) | `evidence/diff/tabs-header-diff.png` |
| 25 | RTL switch keeps layout correct | DEFERRED (no Arabic state captured) | n/a |
| 26 | Sidebar collapse + expand | DEFERRED (interactive) | n/a |
| 27 | Tree node expand + collapse | DEFERRED (interactive) | n/a |
| 28 | Tab switch (Hierarchy → CommChannels & Services → Apps & Services → Settings) | DEFERRED (interactive) | n/a |
| 29 | Information panel open / close | DEFERRED (interactive) | n/a |
| 30 | OTP popup open / close | DEFERRED (interactive) | n/a |

**Net:** 17 pass, 1 partial, 2 fail (P3 — i18n missing), 10 deferred (interactive flows for next pass).

---

## Update 2026-05-15 evening — Post P3 polish pass

The 3 P3 follow-ups landed and `nx build admin-console` is GREEN (hash `439d98a8dd333f51`).

| # | Test | Previous | Now | Notes |
|---|---|---|---|---|
| 17 | Build green (`nx build admin-console`) | NOT RUN | **PASS** | Hash `439d98a8dd333f51` |
| 24 | i18n strings resolved | FAIL | **PASS** (static) | Keys `hierarchy.users.emptyTitle` + `hierarchy.users.emptyBody` added to canonical `libs/falcon/src/language/i18n/{en,ar}.json`. Real-auth re-capture pending. |

### Task B — Real-auth interactive test pass: BLOCKED

The 10 deferred interactive tests (tab switching, header hover/active, comm-channels toggles, row actions menus, org info uploader, OTP popup, status/role dropdowns, permissions dropdown/checkboxes, settings view↔edit toggle, dashed Add IP button + IPv4/IPv6 valid+invalid + Enter + Clear/Cancel + chip delete + delete-confirm popup, account limitation +/-) cannot be exercised — no seeded portal-login credentials are findable on this machine (no `falcon-essentials`, no `.env*`, no Zitadel seed JSON). Per the brief, the dev bypass was NOT re-applied because it would produce false positives on interactive flows.

Full blocker doc: `TASK_B_BLOCKED.md`.

**Updated net:** 18 pass, 1 partial, 1 fail (now PASS-static), 10 BLOCKED (real-auth required).

## Deferred / next-pass test plan

When the three P3 follow-ups land (add 2 i18n keys, set paginator default rows-per-page to 20):

- Re-run Falcon Eyes — expected: 97-98 % pixel parity
- Run interactive flows (tab switch / tree expand / panel open / popup) under real session
- Run `nx build admin-console` — expected: green (no changes other than 2 JSON additions + 1 HTML attribute)
- Run validation + business test list

## Files involved (read-only this run)

- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts`
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html`
- `libs/falcon-ui-core/...` (Falcon Tabs / Tree / Data Table / Status Badge — verified component selectors render correctly)
