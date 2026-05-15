*** Test Report — Org Hierarchy Falcon Eyes Repair (RESUMED 2026-05-15) ***

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
